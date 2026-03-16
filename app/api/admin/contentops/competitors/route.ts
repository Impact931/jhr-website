import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCompetitorKeywords,
  getCompetitorDomainIntersection,
  isConfigured as isDataForSEOConfigured,
  type DomainIntersectionResult,
} from '@/lib/dataforseo';
import {
  getStoredToken,
  getValidAccessToken,
  fetchSearchAnalytics,
  getDateRange,
} from '@/lib/gsc';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CompetitorEntry {
  domain: string;
  organicCount: number;
  avgPosition: number;
  estimatedTraffic: number;
  overlapKeywords: number;
}

interface Opportunity {
  keyword: string;
  competitorDomain: string;
  competitorPosition: number;
  ourPosition: number | null;
  searchVolume: number;
  cpc: number | null;
  competition: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAction: 'create' | 'optimize' | 'overtake';
}

interface ContentGap {
  keyword: string;
  searchVolume: number;
  cpc: number | null;
  topCompetitor: string;
  competitorPosition: number;
}

interface CompetitorResponse {
  generatedAt: string;
  cachedUntil: string;
  gscConnected: boolean;
  dataforseoConnected: boolean;
  competitors: CompetitorEntry[];
  opportunities: Opportunity[];
  contentGaps: ContentGap[];
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: CompetitorResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── Constants ──────────────────────────────────────────────────────────────

const TARGET_DOMAIN = 'jhr-photography.com';
const MAX_COMPETITORS_TO_ANALYZE = 10;
const MAX_INTERSECTION_PER_COMPETITOR = 30;

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyDifficulty(
  competitorPosition: number,
  ourPosition: number | null
): 'easy' | 'medium' | 'hard' {
  // If we don't rank at all and competitor is top 5, that's hard
  if (ourPosition === null) {
    if (competitorPosition <= 5) return 'hard';
    if (competitorPosition <= 15) return 'medium';
    return 'easy';
  }
  // If we rank but worse — gap determines difficulty
  const gap = ourPosition - competitorPosition;
  if (gap <= 5) return 'easy';
  if (gap <= 15) return 'medium';
  return 'hard';
}

function classifyAction(
  ourPosition: number | null,
  competitorPosition: number
): 'create' | 'optimize' | 'overtake' {
  if (ourPosition === null) return 'create';
  if (ourPosition <= competitorPosition + 5) return 'overtake';
  return 'optimize';
}

// ─── GET Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get('refresh') === 'true';

  // Check cache
  const cacheKey = 'competitor-intelligence';
  if (!refresh) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }
  }

  const gscToken = await getStoredToken();
  const gscConnected = !!gscToken;
  const dataforseoConnected = isDataForSEOConfigured();

  if (!dataforseoConnected) {
    return NextResponse.json(
      {
        error: 'DataForSEO not configured. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.',
        gscConnected,
        dataforseoConnected: false,
      },
      { status: 503 }
    );
  }

  try {
    // ── Step 1: Discover competitor domains ───────────────────────────

    const competitorDomains = await getCompetitorKeywords(TARGET_DOMAIN, MAX_COMPETITORS_TO_ANALYZE);

    // ── Step 2: Pull our own GSC keywords for overlap comparison ─────

    const ourKeywords = new Map<string, { position: number; clicks: number }>();

    if (gscConnected && gscToken) {
      try {
        const accessToken = await getValidAccessToken(gscToken);
        const siteUrl = process.env.GSC_PROPERTY_URL || `https://${TARGET_DOMAIN}`;
        const { start, end } = getDateRange(28);
        const queryRows = await fetchSearchAnalytics(
          accessToken,
          siteUrl,
          start,
          end,
          ['query'],
          1000
        );
        for (const row of queryRows) {
          ourKeywords.set(row.keys[0].toLowerCase(), {
            position: row.position,
            clicks: row.clicks,
          });
        }
      } catch (gscErr) {
        console.warn('GSC fetch failed during competitor analysis:', gscErr);
      }
    }

    // ── Step 3: Get domain intersection for top competitors ──────────

    const intersectionPromises: Array<
      Promise<{ domain: string; results: DomainIntersectionResult[] }>
    > = [];

    // Limit to top 5 competitors to manage API costs
    const topCompetitors = competitorDomains.slice(0, 5);

    for (const comp of topCompetitors) {
      intersectionPromises.push(
        getCompetitorDomainIntersection(
          TARGET_DOMAIN,
          comp.competitorDomain,
          MAX_INTERSECTION_PER_COMPETITOR
        )
          .then((results) => ({ domain: comp.competitorDomain, results }))
          .catch((err) => {
            console.warn(`Intersection failed for ${comp.competitorDomain}:`, err);
            return { domain: comp.competitorDomain, results: [] };
          })
      );
    }

    const intersectionResults = await Promise.all(intersectionPromises);

    // ── Step 4: Build competitor entries ─────────────────────────────

    const competitors: CompetitorEntry[] = competitorDomains.map((comp) => {
      const intersection = intersectionResults.find((r) => r.domain === comp.competitorDomain);
      const overlapCount = intersection
        ? intersection.results.filter((r) => r.targetPosition !== null).length
        : 0;

      return {
        domain: comp.competitorDomain,
        organicCount: comp.searchVolume, // getCompetitorKeywords stores organic count in searchVolume
        avgPosition: comp.competitorPosition,
        estimatedTraffic: Math.round(comp.searchVolume * (0.3 / Math.max(1, comp.competitorPosition))),
        overlapKeywords: overlapCount,
      };
    });

    // ── Step 5: Build opportunities from intersection data ──────────

    const opportunities: Opportunity[] = [];
    const seenKeywords = new Set<string>();

    for (const { domain, results } of intersectionResults) {
      for (const result of results) {
        const kwLower = result.keyword.toLowerCase();
        if (seenKeywords.has(kwLower)) continue;
        seenKeywords.add(kwLower);

        // Cross-reference with GSC data for our actual position
        const gscData = ourKeywords.get(kwLower);
        const ourPosition = result.targetPosition ?? gscData?.position ?? null;
        const ourPosRounded = ourPosition !== null ? Math.round(ourPosition) : null;

        opportunities.push({
          keyword: result.keyword,
          competitorDomain: domain,
          competitorPosition: result.competitorPosition,
          ourPosition: ourPosRounded,
          searchVolume: result.searchVolume,
          cpc: result.cpc,
          competition: result.competition,
          difficulty: classifyDifficulty(result.competitorPosition, ourPosRounded),
          suggestedAction: classifyAction(ourPosRounded, result.competitorPosition),
        });
      }
    }

    // Sort by search volume descending (highest-value opportunities first)
    opportunities.sort((a, b) => b.searchVolume - a.searchVolume);

    // ── Step 6: Build content gaps (keywords where we don't rank) ───

    const contentGaps: ContentGap[] = opportunities
      .filter((opp) => opp.ourPosition === null)
      .map((opp) => ({
        keyword: opp.keyword,
        searchVolume: opp.searchVolume,
        cpc: opp.cpc,
        topCompetitor: opp.competitorDomain,
        competitorPosition: opp.competitorPosition,
      }));

    // ── Build response ──────────────────────────────────────────────

    const response: CompetitorResponse = {
      generatedAt: new Date().toISOString(),
      cachedUntil: new Date(Date.now() + CACHE_TTL).toISOString(),
      gscConnected,
      dataforseoConnected,
      competitors,
      opportunities,
      contentGaps,
    };

    // Cache result
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);
  } catch (err) {
    console.error('Competitor intelligence error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate competitor analysis' },
      { status: 500 }
    );
  }
}
