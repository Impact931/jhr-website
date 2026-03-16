import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCompetitorKeywords,
  getCompetitorRankedKeywords,
  isConfigured as isDataForSEOConfigured,
  type RankedKeywordResult,
} from '@/lib/dataforseo';
import {
  getStoredToken,
  getValidAccessToken,
  fetchSearchAnalytics,
  getDateRange,
} from '@/lib/gsc';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CompetitorKeywordEntry {
  keyword: string;
  position: number;
  url: string;
  searchVolume: number;
  cpc: number | null;
  competition: number | null;
  ourPosition: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAction: 'create' | 'optimize' | 'overtake';
}

interface CompetitorEntry {
  domain: string;
  organicCount: number;
  avgPosition: number;
  estimatedTraffic: number;
  topKeywords: CompetitorKeywordEntry[];
}

interface CompetitorResponse {
  generatedAt: string;
  cachedUntil: string;
  gscConnected: boolean;
  dataforseoConnected: boolean;
  competitors: CompetitorEntry[];
  totalOpportunities: number;
  totalEasyWins: number;
  totalContentGaps: number;
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: CompetitorResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── Constants ──────────────────────────────────────────────────────────────

const TARGET_DOMAIN = 'jhr-photography.com';
const MAX_COMPETITORS = 15;
const KEYWORDS_PER_COMPETITOR = 20;

// Exclude non-competitor platform/directory domains
const EXCLUDED_DOMAINS = new Set([
  'yelp.com',
  'google.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'pinterest.com',
  'tiktok.com',
  'yellowpages.com',
  'bbb.org',
  'thumbtack.com',
  'bark.com',
  'angi.com',
  'homeadvisor.com',
  'nextdoor.com',
  'mapquest.com',
  'manta.com',
  'alignable.com',
  'tripadvisor.com',
  'weddingwire.com',
  'theknot.com',
  'zola.com',
  'peerspace.com',
  'gigsalad.com',
  'eventbrite.com',
  'meetup.com',
  'craigslist.org',
  'indeed.com',
  'glassdoor.com',
  'reddit.com',
  'quora.com',
  'wikipedia.org',
  'amazon.com',
  'apple.com',
  'microsoft.com',
  'bing.com',
  'yahoo.com',
]);

function isExcludedDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return EXCLUDED_DOMAINS.has(lower) ||
    Array.from(EXCLUDED_DOMAINS).some(d => lower.endsWith(`.${d}`));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyDifficulty(
  competitorPosition: number,
  ourPosition: number | null
): 'easy' | 'medium' | 'hard' {
  if (ourPosition === null) {
    if (competitorPosition <= 5) return 'hard';
    if (competitorPosition <= 15) return 'medium';
    return 'easy';
  }
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
    // ── Step 1: Discover competitor domains (filter out platforms) ────

    const rawCompetitors = await getCompetitorKeywords(TARGET_DOMAIN, MAX_COMPETITORS + 20);
    const filteredCompetitors = rawCompetitors.filter(c => !isExcludedDomain(c.competitorDomain));

    // ── Step 2: Pull our own GSC keywords for overlap ─────────────────

    const ourKeywords = new Map<string, { position: number; clicks: number }>();

    if (gscConnected && gscToken) {
      try {
        const accessToken = await getValidAccessToken(gscToken);
        const siteUrl = process.env.GSC_PROPERTY_URL || `https://${TARGET_DOMAIN}`;
        const { start, end } = getDateRange(28);
        const queryRows = await fetchSearchAnalytics(
          accessToken, siteUrl, start, end, ['query'], 1000
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

    // ── Step 3: Get ranked keywords for each competitor ───────────────

    const topCompetitors = filteredCompetitors.slice(0, MAX_COMPETITORS);

    // Fetch ranked keywords in parallel (limit to 5 concurrent to manage API costs)
    const rankedResults: Array<{ domain: string; keywords: RankedKeywordResult[] }> = [];

    // Process in batches of 5
    for (let i = 0; i < topCompetitors.length; i += 5) {
      const batch = topCompetitors.slice(i, i + 5);
      const batchPromises = batch.map(comp =>
        getCompetitorRankedKeywords(comp.competitorDomain, KEYWORDS_PER_COMPETITOR)
          .then(keywords => ({ domain: comp.competitorDomain, keywords }))
          .catch(err => {
            console.warn(`Ranked keywords failed for ${comp.competitorDomain}:`, err);
            return { domain: comp.competitorDomain, keywords: [] as RankedKeywordResult[] };
          })
      );
      const batchResults = await Promise.all(batchPromises);
      rankedResults.push(...batchResults);
    }

    // ── Step 4: Build enriched competitor entries ─────────────────────

    let totalOpportunities = 0;
    let totalEasyWins = 0;
    let totalContentGaps = 0;

    const competitors: CompetitorEntry[] = topCompetitors.map((comp) => {
      const ranked = rankedResults.find(r => r.domain === comp.competitorDomain);
      const keywords: CompetitorKeywordEntry[] = (ranked?.keywords || []).map(kw => {
        const gscData = ourKeywords.get(kw.keyword.toLowerCase());
        const ourPosition = gscData ? Math.round(gscData.position) : null;
        const difficulty = classifyDifficulty(kw.position, ourPosition);
        const action = classifyAction(ourPosition, kw.position);

        totalOpportunities++;
        if (difficulty === 'easy') totalEasyWins++;
        if (ourPosition === null) totalContentGaps++;

        return {
          keyword: kw.keyword,
          position: kw.position,
          url: kw.url,
          searchVolume: kw.searchVolume,
          cpc: kw.cpc,
          competition: kw.competition,
          ourPosition,
          difficulty,
          suggestedAction: action,
        };
      });

      // Sort by search volume descending
      keywords.sort((a, b) => b.searchVolume - a.searchVolume);

      return {
        domain: comp.competitorDomain,
        organicCount: comp.searchVolume,
        avgPosition: comp.competitorPosition,
        estimatedTraffic: Math.round(comp.searchVolume * (0.3 / Math.max(1, comp.competitorPosition))),
        topKeywords: keywords,
      };
    });

    // ── Build response ──────────────────────────────────────────────

    const response: CompetitorResponse = {
      generatedAt: new Date().toISOString(),
      cachedUntil: new Date(Date.now() + CACHE_TTL).toISOString(),
      gscConnected,
      dataforseoConnected,
      competitors,
      totalOpportunities,
      totalEasyWins,
      totalContentGaps,
    };

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
