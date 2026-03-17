/**
 * ContentOps Pre-Flight Intelligence Layer
 *
 * Runs before ANY content generation (admin UI or CLI) to ensure:
 * 1. No keyword cannibalization with existing pages
 * 2. Correct intent classification for page type
 * 3. Keyword cluster alignment
 *
 * This is the shared intelligence that makes CLI and admin dashboard produce identical quality.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PreFlightResult {
  passed: boolean;
  intent: IntentClassification;
  cannibalization: CannibalizationCheck;
  keywordCluster: KeywordClusterMatch;
  warnings: PreFlightWarning[];
  blocks: PreFlightBlock[];
}

export interface IntentClassification {
  type: 'informational' | 'commercial' | 'transactional' | 'navigational';
  confidence: 'high' | 'medium' | 'low';
  recommendedPageType: string;
  reasoning: string;
}

export interface CannibalizationCheck {
  clear: boolean;
  overlaps: CannibalizationOverlap[];
}

export interface CannibalizationOverlap {
  existingPage: string;
  existingTitle?: string;
  matchType: 'exact-keyword' | 'title-match' | 'url-match';
  recommendation: string;
}

export interface KeywordClusterMatch {
  cluster: string | null;
  existingPages: string[];
  isNewCluster: boolean;
}

export interface PreFlightWarning {
  code: string;
  message: string;
  detail?: string;
}

export interface PreFlightBlock {
  code: string;
  message: string;
  detail?: string;
}

// ─── Keyword Clusters (shared source of truth) ──────────────────────────────

export const KEYWORD_CLUSTERS: Record<string, { primaryPage: string; keywords: string[] }> = {
  'corporate-event': {
    primaryPage: '/services/corporate-event-coverage',
    keywords: [
      'nashville corporate event photographer',
      'nashville event photographer',
      'corporate event photography nashville',
      'event photographer nashville tn',
      'nashville gala photographer',
    ],
  },
  'convention-conference': {
    primaryPage: '/services/convention-media',
    keywords: [
      'nashville convention photographer',
      'nashville conference photographer',
      'convention photography services',
      'association conference photography',
    ],
  },
  'headshot': {
    primaryPage: '/services/executive-imaging',
    keywords: [
      'nashville headshot photographer',
      'professional headshots nashville',
      'executive headshot photographer nashville',
      'nashville corporate headshots',
      'corporate headshot activation',
    ],
  },
  'trade-show': {
    primaryPage: '/services/trade-show-media',
    keywords: [
      'nashville trade show photographer',
      'trade show photography services',
      'exhibit photography nashville',
    ],
  },
  'event-video': {
    primaryPage: '/services/event-video-systems',
    keywords: [
      'event video production nashville',
      'conference video recording nashville',
    ],
  },
  'venue': {
    primaryPage: '/venues',
    keywords: [
      'music city center photographer',
      'gaylord opryland photographer',
      'best event venues nashville',
    ],
  },
};

// ─── Intent Classification ───────────────────────────────────────────────────

const INTENT_SIGNALS: Record<string, string[]> = {
  informational: ['how to', 'what is', 'guide', 'tips', 'checklist', 'best practices', 'ideas', 'examples'],
  commercial: ['best', 'top', 'vs', 'review', 'comparison', 'alternative', 'rated'],
  transactional: ['hire', 'book', 'pricing', 'cost', 'near me', 'services', 'quote', 'schedule'],
  navigational: ['jhr', 'jhr photography', 'jayson rivas'],
};

function classifyIntent(keyword: string, topic: string): IntentClassification {
  const combined = `${keyword} ${topic}`.toLowerCase();
  const scores: Record<string, number> = { informational: 0, commercial: 0, transactional: 0, navigational: 0 };

  for (const [intent, signals] of Object.entries(INTENT_SIGNALS)) {
    for (const signal of signals) {
      if (combined.includes(signal)) {
        scores[intent] += 1;
      }
    }
  }

  // Default: if keyword targets a service page, it's likely transactional
  const serviceKeywords = ['photographer', 'photography', 'headshot', 'video', 'media'];
  if (serviceKeywords.some((sk) => combined.includes(sk)) && !combined.includes('how') && !combined.includes('guide')) {
    scores.transactional += 0.5;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topIntent = sorted[0][0] as IntentClassification['type'];
  const topScore = sorted[0][1];
  const secondScore = sorted[1][1];

  const confidence: IntentClassification['confidence'] =
    topScore > 0 && topScore - secondScore >= 1 ? 'high' : topScore > 0 ? 'medium' : 'low';

  const pageTypeMap: Record<string, string> = {
    informational: 'blog post',
    commercial: 'blog post or solution page',
    transactional: 'service page (optimize existing) or inquiry landing',
    navigational: 'core page (about, team)',
  };

  return {
    type: topIntent,
    confidence,
    recommendedPageType: pageTypeMap[topIntent],
    reasoning: confidence === 'low'
      ? 'No strong intent signals detected — defaulting based on keyword structure'
      : `Detected ${topIntent} signals in keyword/topic`,
  };
}

// ─── Cannibalization Check ───────────────────────────────────────────────────

interface GSCPage {
  page: string;
  clicks?: number;
  impressions?: number;
  position?: number;
}

async function checkCannibalization(
  keyword: string,
  _topic: string,
  baseUrl?: string
): Promise<CannibalizationCheck> {
  const overlaps: CannibalizationOverlap[] = [];

  // Check 1: Does the keyword match any existing cluster's primary page?
  const kwLower = keyword.toLowerCase();
  for (const [clusterName, cluster] of Object.entries(KEYWORD_CLUSTERS)) {
    if (cluster.keywords.some((ck) => ck === kwLower || kwLower.includes(ck) || ck.includes(kwLower))) {
      overlaps.push({
        existingPage: cluster.primaryPage,
        matchType: 'exact-keyword',
        recommendation: `This keyword belongs to the "${clusterName}" cluster. Primary page is ${cluster.primaryPage}. Consider optimizing that page or targeting a long-tail variant for blog content.`,
      });
    }
  }

  // Check 2: Query GSC for pages already ranking for this keyword
  if (baseUrl) {
    try {
      const gscUrl = `${baseUrl}/api/admin/gsc?type=keywords&days=28`;
      const res = await fetch(gscUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        const keywords = data.keywords || data.rows || [];
        for (const entry of keywords) {
          const query = (entry.query || entry.keys?.[0] || '').toLowerCase();
          if (query === kwLower || query.includes(kwLower) || kwLower.includes(query)) {
            const page = entry.page || entry.keys?.[1] || '';
            if (page) {
              // Don't flag if it's just a blog page (expected overlap for content)
              const isBlogPage = page.includes('/blog/');
              if (!isBlogPage) {
                overlaps.push({
                  existingPage: page,
                  matchType: 'url-match',
                  recommendation: `This page already ranks for "${query}" (or a variant). Creating new content may split ranking signals. Consider strengthening the existing page instead.`,
                });
              }
            }
          }
        }
      }
    } catch {
      // GSC unavailable — skip, don't block
    }
  }

  // Deduplicate by page
  const seen = new Set<string>();
  const unique = overlaps.filter((o) => {
    const key = o.existingPage;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    clear: unique.length === 0,
    overlaps: unique,
  };
}

// ─── Keyword Cluster Matching ────────────────────────────────────────────────

function matchKeywordCluster(keyword: string): KeywordClusterMatch {
  const kwLower = keyword.toLowerCase();

  for (const [clusterName, cluster] of Object.entries(KEYWORD_CLUSTERS)) {
    if (cluster.keywords.some((ck) => kwLower.includes(ck) || ck.includes(kwLower))) {
      return {
        cluster: clusterName,
        existingPages: [cluster.primaryPage],
        isNewCluster: false,
      };
    }
  }

  return {
    cluster: null,
    existingPages: [],
    isNewCluster: true,
  };
}

// ─── AI Slop Blocklist (unified, shared) ─────────────────────────────────────

export const AI_SLOP_TERMS = [
  'crucial', 'delve', 'comprehensive', 'furthermore', 'moreover', 'utilize',
  'streamline', 'innovative', 'cutting-edge', 'state-of-the-art', 'robust',
  'seamless', 'elevate', 'empower', 'unlock', 'harness', 'paradigm',
  'synergy', 'game-changer', 'leverage', 'holistic', 'spearhead',
  'revolutionize', 'groundbreaking', 'transformative',
];

export const BRAND_PROHIBITED_TERMS = [
  'free consultation', 'affordable', 'cheap', 'budget',
  'premier', 'elite', 'championship',
];

// ─── Main Pre-Flight Function ────────────────────────────────────────────────

export async function runPreFlight(
  keyword: string,
  topic: string,
  articleType: string,
  options?: { baseUrl?: string }
): Promise<PreFlightResult> {
  const warnings: PreFlightWarning[] = [];
  const blocks: PreFlightBlock[] = [];

  // 1. Intent classification
  const intent = classifyIntent(keyword, topic);

  // Warn if creating blog content for transactional keyword
  if (intent.type === 'transactional' && (articleType === 'standard' || articleType === 'ultimate-guide')) {
    warnings.push({
      code: 'INTENT_MISMATCH',
      message: `Keyword "${keyword}" has transactional intent, but you're creating a ${articleType} blog post.`,
      detail: `Consider optimizing the existing service page instead, or target an informational variant of this keyword.`,
    });
  }

  // Warn if creating service-style content for informational keyword
  if (intent.type === 'informational' && articleType === 'pricing-data') {
    warnings.push({
      code: 'INTENT_MISMATCH',
      message: `Keyword "${keyword}" has informational intent, but article type is pricing-data.`,
      detail: `Pricing content works best for transactional/commercial keywords.`,
    });
  }

  // 2. Cannibalization check
  const cannibalization = await checkCannibalization(keyword, topic, options?.baseUrl);

  if (!cannibalization.clear) {
    for (const overlap of cannibalization.overlaps) {
      if (overlap.matchType === 'exact-keyword') {
        warnings.push({
          code: 'CANNIBALIZATION_RISK',
          message: `Keyword overlaps with existing page: ${overlap.existingPage}`,
          detail: overlap.recommendation,
        });
      } else {
        warnings.push({
          code: 'CANNIBALIZATION_POSSIBLE',
          message: `Existing page may already rank for this keyword: ${overlap.existingPage}`,
          detail: overlap.recommendation,
        });
      }
    }
  }

  // 3. Keyword cluster match
  const keywordCluster = matchKeywordCluster(keyword);

  if (keywordCluster.isNewCluster) {
    warnings.push({
      code: 'NEW_CLUSTER',
      message: `Keyword "${keyword}" doesn't match any existing cluster.`,
      detail: 'This may be a new topic area. Verify search volume before investing in content.',
    });
  }

  // Overall pass/fail: blocks prevent generation, warnings are advisory
  const passed = blocks.length === 0;

  return {
    passed,
    intent,
    cannibalization,
    keywordCluster,
    warnings,
    blocks,
  };
}
