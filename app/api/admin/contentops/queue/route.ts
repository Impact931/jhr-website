import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getStoredToken,
  getValidAccessToken,
  fetchSearchAnalytics,
  getDateRange,
} from '@/lib/gsc';
import {
  checkSerpPositions,
  getSearchVolume,
  getKeywordSuggestions,
  isConfigured as isDataForSEOConfigured,
  type SerpResult,
} from '@/lib/dataforseo';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PageScore {
  url: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  compositeScore: number;
  trafficScore: number;
  conversionScore: number;
  positionScore: number;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
}

interface Recommendation {
  id: string;
  keyword: string;
  searchVolume: number;
  currentPosition: number | null;
  currentUrl: string | null;
  recommendedAction: 'optimize' | 'create' | 'refresh';
  suggestedTopic: string;
  suggestedIcp: string;
  suggestedArticleType: string;
  priorityScore: number;
  dataJustification: string;
}

interface QueueResponse {
  generatedAt: string;
  cachedUntil: string;
  gscConnected: boolean;
  dataforseoConnected: boolean;
  summary: {
    totalPages: number;
    totalOpportunities: number;
    strikeDistanceKeywords: number;
    contentGaps: number;
    tierDistribution: Record<string, number>;
  };
  pages: PageScore[];
  recommendations: Recommendation[];
  serpPositions: SerpResult[];
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: QueueResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── Target Keywords ────────────────────────────────────────────────────────

const TARGET_KEYWORDS = [
  'nashville event photographer',
  'nashville corporate event photographer',
  'nashville convention photographer',
  'nashville headshot photographer',
  'corporate headshot activation',
  'nashville trade show photographer',
  'event photographer nashville tn',
  'nashville conference photographer',
  'music city center photographer',
  'nashville corporate headshots',
  'executive headshot photographer nashville',
  'nashville gala photographer',
  'event video production nashville',
  'professional headshots nashville',
];

// ─── Scoring Functions ──────────────────────────────────────────────────────

function computeTrafficScore(clicks: number, impressions: number, ctr: number): number {
  let clickPts = 1;
  if (clicks > 50) clickPts = 8;
  else if (clicks > 20) clickPts = 5;
  else if (clicks > 5) clickPts = 3;

  let impPts = 1;
  if (impressions > 1000) impPts = 8;
  else if (impressions > 200) impPts = 5;
  else if (impressions > 50) impPts = 3;

  let ctrPts = 0;
  if (ctr > 0.05) ctrPts = 6;
  else if (ctr > 0.03) ctrPts = 4;
  else if (ctr > 0.01) ctrPts = 2;

  // Normalize to 0-100 (max raw = 22)
  return Math.min(100, Math.round(((clickPts + impPts + ctrPts) / 22) * 100));
}

function computeConversionScore(ctr: number, impressions: number): number {
  // Proxy: high CTR + high impressions suggests conversion intent
  let score = 0;
  if (ctr > 0.05) score += 40;
  else if (ctr > 0.03) score += 25;
  else if (ctr > 0.01) score += 10;

  if (impressions > 500) score += 30;
  else if (impressions > 100) score += 20;
  else if (impressions > 30) score += 10;

  // Bonus for service/inquiry-intent signals (handled at page level)
  return Math.min(100, score);
}

function computePositionScore(position: number): number {
  let posPts = 0;
  if (position <= 3) posPts = 10;
  else if (position <= 10) posPts = 8;
  else if (position <= 20) posPts = 5;
  else if (position <= 50) posPts = 2;

  return Math.min(100, posPts * 10);
}

function assignTier(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 75) return 'S';
  if (score >= 55) return 'A';
  if (score >= 35) return 'B';
  if (score >= 15) return 'C';
  return 'D';
}

// ─── ICP Inference ──────────────────────────────────────────────────────────

function inferIcp(keyword: string): string {
  const kw = keyword.toLowerCase();
  if (kw.includes('convention') || kw.includes('conference') || kw.includes('planner') || kw.includes('association'))
    return 'ICP-1';
  if (kw.includes('corporate') || kw.includes('marketing') || kw.includes('brand') || kw.includes('executive'))
    return 'ICP-2';
  if (kw.includes('trade show') || kw.includes('exhibit') || kw.includes('booth') || kw.includes('sponsor'))
    return 'ICP-3';
  if (kw.includes('venue') || kw.includes('hotel') || kw.includes('center') || kw.includes('opryland'))
    return 'ICP-4';
  return 'ICP-1'; // default to event planners
}

function inferArticleType(keyword: string, position: number | null): string {
  const kw = keyword.toLowerCase();
  if (kw.includes('guide') || kw.includes('how to') || kw.includes('tips'))
    return 'ultimate-guide';
  if (kw.includes('cost') || kw.includes('pricing') || kw.includes('price'))
    return 'pricing-data';
  if (kw.includes('best') || kw.includes('top'))
    return 'roundup';
  if (kw.includes('statistics') || kw.includes('data') || kw.includes('trends'))
    return 'statistics-hub';
  // If not ranking at all, create a comprehensive guide
  if (position === null) return 'ultimate-guide';
  return 'standard';
}

function generateTopic(keyword: string): string {
  // Create a natural topic from the keyword
  const kw = keyword.toLowerCase();
  if (kw.includes('headshot'))
    return `Professional ${keyword}: What Event Planners Need to Know`;
  if (kw.includes('video'))
    return `${keyword}: A Complete Guide for Corporate Events`;
  if (kw.includes('photographer'))
    return `How to Choose the Right ${keyword} for Your Next Event`;
  return `The Complete Guide to ${keyword}`;
}

// ─── Main Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get('refresh') === 'true';

  // Check cache
  const cacheKey = 'content-queue';
  if (!refresh) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }
  }

  const gscToken = await getStoredToken();
  const gscConnected = !!gscToken;
  const dataforseoConnected = isDataForSEOConfigured();

  try {
    // ── Pull data in parallel ──────────────────────────────────────────

    const siteUrl = process.env.GSC_PROPERTY_URL || 'https://jhr-photography.com';
    const { start, end } = getDateRange(28);

    // GSC data (if connected)
    let gscPages: Array<{ url: string; clicks: number; impressions: number; ctr: number; position: number }> = [];
    let gscQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }> = [];

    // DataForSEO data (if configured)
    let serpResults: SerpResult[] = [];
    let suggestions: Array<{ keyword: string; searchVolume: number }> = [];

    const promises: Promise<void>[] = [];

    if (gscConnected && gscToken) {
      promises.push(
        (async () => {
          const accessToken = await getValidAccessToken(gscToken);
          const [pageRows, queryRows] = await Promise.all([
            fetchSearchAnalytics(accessToken, siteUrl, start, end, ['page'], 200),
            fetchSearchAnalytics(accessToken, siteUrl, start, end, ['query'], 500),
          ]);

          gscPages = pageRows.map((r) => ({
            url: r.keys[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr,
            position: r.position,
          }));

          gscQueries = queryRows.map((r) => ({
            query: r.keys[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr,
            position: r.position,
          }));
        })()
      );
    }

    if (dataforseoConnected) {
      promises.push(
        (async () => {
          serpResults = await checkSerpPositions(TARGET_KEYWORDS);
        })()
      );

      promises.push(
        (async () => {
          const raw = await getKeywordSuggestions('nashville event photographer', 30);
          suggestions = raw.map((s) => ({
            keyword: s.keyword,
            searchVolume: s.searchVolume,
          }));
        })()
      );
    }

    await Promise.allSettled(promises);

    // ── Score pages ────────────────────────────────────────────────────

    const pageScores: PageScore[] = gscPages.map((p) => {
      const traffic = computeTrafficScore(p.clicks, p.impressions, p.ctr);

      // Bonus for service/solution pages (high conversion intent)
      let convBonus = 0;
      const urlPath = new URL(p.url).pathname;
      if (urlPath.startsWith('/services/') || urlPath.startsWith('/solutions/')) convBonus = 20;
      else if (urlPath === '/inquiry' || urlPath === '/schedule' || urlPath === '/contact') convBonus = 30;
      const conversion = Math.min(100, computeConversionScore(p.ctr, p.impressions) + convBonus);

      const position = computePositionScore(p.position);
      const composite = Math.round(traffic * 0.4 + conversion * 0.35 + position * 0.25);

      return {
        url: urlPath,
        tier: assignTier(composite),
        compositeScore: composite,
        trafficScore: traffic,
        conversionScore: conversion,
        positionScore: position,
        clicks: p.clicks,
        impressions: p.impressions,
        ctr: Math.round(p.ctr * 10000) / 100,
        avgPosition: Math.round(p.position * 10) / 10,
      };
    });

    // Sort by composite score descending
    pageScores.sort((a, b) => b.compositeScore - a.compositeScore);

    // ── Generate recommendations ───────────────────────────────────────

    const recommendations: Recommendation[] = [];
    let recId = 0;

    // 1. Strike-distance keywords from GSC (position 8-30, impressions > 10)
    const strikeDistance = gscQueries.filter(
      (q) => q.position >= 8 && q.position <= 30 && q.impressions > 10
    );

    for (const sd of strikeDistance.slice(0, 10)) {
      const matchingPage = gscPages.find((p) => {
        // Find if there's a GSC page ranking for this query
        return p.clicks > 0 || p.impressions > 0;
      });

      recommendations.push({
        id: `rec-${++recId}`,
        keyword: sd.query,
        searchVolume: sd.impressions * 4, // rough monthly estimate from 7-day impressions
        currentPosition: Math.round(sd.position * 10) / 10,
        currentUrl: matchingPage?.url || null,
        recommendedAction: sd.position <= 15 ? 'optimize' : 'create',
        suggestedTopic: generateTopic(sd.query),
        suggestedIcp: inferIcp(sd.query),
        suggestedArticleType: inferArticleType(sd.query, sd.position),
        priorityScore: Math.round(
          (sd.impressions / (strikeDistance[0]?.impressions || 1)) * 80 +
          (30 - sd.position) * 0.7
        ),
        dataJustification: `Position ${Math.round(sd.position)}, ${sd.impressions} impressions (28d). Strike distance — optimizable to page 1.`,
      });
    }

    // 2. DataForSEO: keywords where JHR doesn't rank in top 30
    const contentGaps = serpResults.filter((s) => s.position === null);
    for (const gap of contentGaps) {
      // Check if we already have a rec for this keyword
      if (recommendations.some((r) => r.keyword.toLowerCase() === gap.keyword.toLowerCase())) continue;

      recommendations.push({
        id: `rec-${++recId}`,
        keyword: gap.keyword,
        searchVolume: gap.searchVolume,
        currentPosition: null,
        currentUrl: null,
        recommendedAction: 'create',
        suggestedTopic: generateTopic(gap.keyword),
        suggestedIcp: inferIcp(gap.keyword),
        suggestedArticleType: inferArticleType(gap.keyword, null),
        priorityScore: 60, // Medium priority — target keyword with no ranking
        dataJustification: `Not ranking in top 30 for target keyword. Content gap.`,
      });
    }

    // 3. Keyword suggestions from DataForSEO that JHR doesn't rank for
    const existingKeywords = new Set([
      ...gscQueries.map((q) => q.query.toLowerCase()),
      ...TARGET_KEYWORDS.map((k) => k.toLowerCase()),
    ]);

    for (const sug of suggestions) {
      if (existingKeywords.has(sug.keyword.toLowerCase())) continue;
      if (sug.searchVolume < 20) continue;
      if (recommendations.length >= 20) break;

      recommendations.push({
        id: `rec-${++recId}`,
        keyword: sug.keyword,
        searchVolume: sug.searchVolume,
        currentPosition: null,
        currentUrl: null,
        recommendedAction: 'create',
        suggestedTopic: generateTopic(sug.keyword),
        suggestedIcp: inferIcp(sug.keyword),
        suggestedArticleType: inferArticleType(sug.keyword, null),
        priorityScore: Math.min(50, Math.round(sug.searchVolume / 5)),
        dataJustification: `Keyword suggestion: ${sug.searchVolume} monthly searches. New content opportunity.`,
      });
    }

    // 4. Low-CTR pages that need meta refresh
    const lowCtrPages = gscPages.filter(
      (p) => p.impressions > 50 && p.ctr < 0.02 && p.position < 20
    );
    for (const page of lowCtrPages.slice(0, 3)) {
      const urlPath = new URL(page.url).pathname;
      recommendations.push({
        id: `rec-${++recId}`,
        keyword: `[page: ${urlPath}]`,
        searchVolume: page.impressions,
        currentPosition: Math.round(page.position * 10) / 10,
        currentUrl: page.url,
        recommendedAction: 'refresh',
        suggestedTopic: `Meta title/description refresh for ${urlPath}`,
        suggestedIcp: inferIcp(urlPath),
        suggestedArticleType: 'standard',
        priorityScore: 70, // High priority — existing page underperforming
        dataJustification: `${page.impressions} impressions but only ${Math.round(page.ctr * 10000) / 100}% CTR at position ${Math.round(page.position)}. Meta refresh needed.`,
      });
    }

    // Sort recommendations by priority score descending
    recommendations.sort((a, b) => b.priorityScore - a.priorityScore);

    // ── Build response ─────────────────────────────────────────────────

    const tierDist = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    for (const p of pageScores) tierDist[p.tier]++;

    const response: QueueResponse = {
      generatedAt: new Date().toISOString(),
      cachedUntil: new Date(Date.now() + CACHE_TTL).toISOString(),
      gscConnected,
      dataforseoConnected,
      summary: {
        totalPages: pageScores.length,
        totalOpportunities: recommendations.length,
        strikeDistanceKeywords: strikeDistance.length,
        contentGaps: contentGaps.length,
        tierDistribution: tierDist,
      },
      pages: pageScores,
      recommendations,
      serpPositions: serpResults,
    };

    // Cache result
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);
  } catch (err) {
    console.error('Content queue error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate content queue' },
      { status: 500 }
    );
  }
}
