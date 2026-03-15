/**
 * DataForSEO API Client
 *
 * Wraps DataForSEO REST API for SERP tracking, search volume,
 * keyword suggestions, and competitor gap analysis.
 *
 * Auth: Basic auth via DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD env vars.
 * All calls use location_code 2840 (US) and language_code 'en'.
 */

const API_BASE = 'https://api.dataforseo.com/v3';
const LOCATION_CODE = 2840; // United States
const LANGUAGE_CODE = 'en';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SerpResult {
  keyword: string;
  position: number | null;
  url: string | null;
  searchVolume: number;
}

export interface SearchVolumeResult {
  keyword: string;
  searchVolume: number;
  competition: number | null;
  cpc: number | null;
  monthlySearches: Array<{ month: number; year: number; volume: number }>;
}

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  competition: number | null;
  cpc: number | null;
}

export interface CompetitorKeyword {
  keyword: string;
  searchVolume: number;
  competitorPosition: number;
  competitorDomain: string;
}

// ─── Auth Helper ────────────────────────────────────────────────────────────

function getAuthHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error('DataForSEO credentials not configured (DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD)');
  }
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function dataforseoFetch(endpoint: string, body: unknown[]): Promise<any> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`DataForSEO error (${endpoint}):`, text);
    throw new Error(`DataForSEO API error: ${res.status}`);
  }

  const data = await res.json();
  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO error: ${data.status_message || 'Unknown error'}`);
  }

  return data;
}

// ─── SERP Position Tracking ─────────────────────────────────────────────────

/**
 * Check Google SERP positions for a list of keywords.
 * Finds where targetDomain ranks (if at all) in top 30 results.
 *
 * Cost: ~$0.002 per keyword
 */
export async function checkSerpPositions(
  keywords: string[],
  targetDomain = 'jhr-photography.com'
): Promise<SerpResult[]> {
  if (keywords.length === 0) return [];

  // DataForSEO SERP endpoint processes one keyword per task
  const tasks = keywords.map((keyword) => ({
    keyword,
    location_code: LOCATION_CODE,
    language_code: LANGUAGE_CODE,
    device: 'desktop',
    os: 'windows',
    depth: 30,
  }));

  const data = await dataforseoFetch('serp/google/organic/live/advanced', tasks);
  const results: SerpResult[] = [];

  for (const task of data.tasks || []) {
    const keyword = task.data?.keyword || '';
    const items = task.result?.[0]?.items || [];

    // Find our domain in the results
    let position: number | null = null;
    let url: string | null = null;
    let searchVolume = 0;

    // Get search volume from the SERP result if available
    searchVolume = task.result?.[0]?.search_information?.search_results_count || 0;

    for (const item of items) {
      if (item.type === 'organic' && item.domain?.includes(targetDomain)) {
        position = item.rank_absolute;
        url = item.url;
        break;
      }
    }

    results.push({ keyword, position, url, searchVolume });
  }

  return results;
}

// ─── Search Volume Lookup ───────────────────────────────────────────────────

/**
 * Get Google Ads search volume data for a list of keywords.
 * Batches up to 700 keywords per call.
 *
 * Cost: ~$0.075 per batch (up to 700 keywords)
 */
export async function getSearchVolume(
  keywords: string[]
): Promise<SearchVolumeResult[]> {
  if (keywords.length === 0) return [];

  const data = await dataforseoFetch('keywords_data/google_ads/search_volume/live', [
    {
      keywords,
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
    },
  ]);

  const results: SearchVolumeResult[] = [];
  const items = data.tasks?.[0]?.result || [];

  for (const item of items) {
    results.push({
      keyword: item.keyword || '',
      searchVolume: item.search_volume || 0,
      competition: item.competition_index ?? null,
      cpc: item.cpc ?? null,
      monthlySearches: (item.monthly_searches || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (m: any) => ({
          month: m.month,
          year: m.year,
          volume: m.search_volume || 0,
        })
      ),
    });
  }

  return results;
}

// ─── Keyword Suggestions ────────────────────────────────────────────────────

/**
 * Get keyword suggestions based on a seed keyword.
 *
 * Cost: ~$0.075 per call
 */
export async function getKeywordSuggestions(
  seedKeyword: string,
  limit = 20
): Promise<KeywordSuggestion[]> {
  const data = await dataforseoFetch('dataforseo_labs/google/keyword_suggestions/live', [
    {
      keyword: seedKeyword,
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
      limit,
      include_seed_keyword: false,
      filters: ['keyword_data.keyword_info.search_volume', '>', 10],
    },
  ]);

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => ({
      keyword: item.keyword_data?.keyword || '',
      searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
      competition: item.keyword_data?.keyword_info?.competition_index ?? null,
      cpc: item.keyword_data?.keyword_info?.cpc ?? null,
    })
  );
}

// ─── Competitor Keywords ────────────────────────────────────────────────────

/**
 * Find competitor domains and their keywords that targetDomain doesn't rank for.
 *
 * Cost: ~$0.075 per call
 */
export async function getCompetitorKeywords(
  targetDomain = 'jhr-photography.com',
  limit = 20
): Promise<CompetitorKeyword[]> {
  const data = await dataforseoFetch('dataforseo_labs/google/competitors_domain/live', [
    {
      target: targetDomain,
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
      limit,
      filters: ['avg_position', '<', 20],
    },
  ]);

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  const results: CompetitorKeyword[] = [];

  for (const item of items) {
    if (item.domain === targetDomain) continue;
    results.push({
      keyword: '', // Competitor domain endpoint returns domains, not keywords
      searchVolume: item.metrics?.organic?.count || 0,
      competitorPosition: item.avg_position || 0,
      competitorDomain: item.domain || '',
    });
  }

  return results;
}

// ─── Credential Check ───────────────────────────────────────────────────────

export function isConfigured(): boolean {
  return !!(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}
