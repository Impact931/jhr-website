// ContentOps Engine — Phase 1: Research via multiple providers
// Fallback chain: Perplexity Sonar → Gemini (with Google Search grounding) → OpenRouter
// Optimized for programmatic SEO + Generative Engine Optimization (GEO)

import type { ResearchPayload, ICPTag } from './types';
import { getICPTemplate } from './icp-templates';
import { PREFERRED_PARTNERS } from './link-policy';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar-pro';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.5-flash';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-001';

// Nashville venue keywords to trigger hyper-local research
const NASHVILLE_VENUES = [
  'Music City Center',
  'Gaylord Opryland',
  'Bridgestone Arena',
  'Ryman Auditorium',
  'Grand Ole Opry House',
  'Country Music Hall of Fame',
  'Omni Nashville Hotel',
  'JW Marriott Nashville',
  'The Hermitage Hotel',
  'Marathon Music Works',
  'The Pinnacle at Symphony Place',
  'Nashville Convention Center',
];

function buildSystemMessage(icpTag: ICPTag): string {
  const icp = getICPTemplate(icpTag);
  return `You are a senior B2B content strategist specializing in the Nashville corporate events and conventions industry. You have deep expertise in ${icp.label.toLowerCase()} marketing, event industry trends, and Nashville's venue ecosystem.

Your research supports article creation for JHR Photography — Nashville's premier event and corporate photography company. Articles must rank in the top 3 on Google AND get cited by AI search engines (Google AI Overviews, ChatGPT, Perplexity).

Research rules:
- Every data point must be specific, verifiable, and from a named source
- Prefer data from 2024-2026. Reject anything older than 2022
- Nashville-specific data always beats generic national data
- Industry metrics that the target reader (${icp.label}) would find decision-useful
- Return ONLY valid JSON. No markdown fences. No explanation text.`;
}

function buildResearchPrompt(
  topic: string,
  icpTag: ICPTag,
  primaryKeyword: string
): string {
  const icp = getICPTemplate(icpTag);
  const partnerDomains = PREFERRED_PARTNERS.map(
    (p) => `  * ${p.domain} (${p.description})`
  ).join('\n');

  // Detect if topic mentions a specific Nashville venue for hyper-local research
  const mentionedVenues = NASHVILLE_VENUES.filter(
    (v) => topic.toLowerCase().includes(v.toLowerCase())
  );
  const venueContext = mentionedVenues.length > 0
    ? `\nVENUE-SPECIFIC RESEARCH: The article focuses on ${mentionedVenues.join(', ')}. Find venue-specific data: capacity, notable events hosted, unique features, logistics details, and any published case studies or press coverage about events at this venue.`
    : '';

  return `Research topic: "${topic}"
Primary keyword: "${primaryKeyword}"
Target reader: ${icp.targetReader}

Their key pain points:
${icp.painPoints.map((p) => `- ${p}`).join('\n')}

Language they use:
${icp.languagePatterns.map((p) => `- "${p}"`).join('\n')}
${venueContext}

Gather the following research data and return as a single JSON object:

{
  "currentStats": [
    // 5-8 statistics with SPECIFIC numbers that the target reader would use to justify a decision.
    // GOOD: "The Nashville convention market generated $2.1B in economic impact in 2025 (Nashville CVB)"
    // GOOD: "87% of event planners say professional photography increases sponsor retention by 23% (PCMA 2025)"
    // BAD: "The average salary for an event photographer is $40,921" (irrelevant to the reader's decision)
    // BAD: "Photography is important for events" (not a statistic)
    // Focus on: market size, ROI metrics, conversion rates, industry growth, attendee behavior data
    { "stat": "...", "source": "..." }
  ],

  "authorityLinks": [
    // 6-8 URLs from authoritative sources directly relevant to the topic.
    // REQUIRED types: industry associations (PCMA, MPI, CEIR, IAEE, ASAE), trade publications
    // (BizBash, EventMB/Skift Meetings, Trade Show News Network, Convene), Nashville DMOs,
    // government/research (.gov, .edu), and preferred partners listed below.
    // Each URL must link to a SPECIFIC article or page, not a homepage.
    // NEVER include URLs from Nashville photography studios or photographers.
    { "url": "...", "title": "...", "domain": "..." }
  ],

  "expertQuotes": [
    // 3-4 real, attributable quotes from NAMED industry leaders, published authors, or researchers.
    // Must be findable in a published source. Include the person's title/org.
    // GOOD: "quote" — "Jane Smith, VP of Events at PCMA, in Convene Magazine (2025)"
    // BAD: "quote" — "an industry expert"
    { "quote": "...", "attribution": "..." }
  ],

  "relatedQuestions": [
    // 8-10 questions that the TARGET READER (${icp.label}) would actually search for.
    // These must reflect buyer intent, not general curiosity.
    // GOOD for convention planners: "How do I structure a photography RFP for a multi-day conference?"
    // GOOD for enterprise marketing: "What's the ROI of professional event photography vs iPhone photos?"
    // BAD: "What camera do event photographers use?" (photographer question, not buyer question)
    // Include a mix of: comparison queries, how-to queries, cost/ROI queries, and Nashville-specific queries
  ],

  "competitorUrls": [
    // 3-5 URLs currently ranking on page 1 for "${primaryKeyword}" or close variants.
    // These are articles we need to OUTRANK — not competitor photography studios.
  ],

  "localInsights": [
    // 3-5 Nashville-specific data points that make the article genuinely local, not generic.
    // GOOD: "Music City Center hosted 147 conventions in 2025, up 12% from 2024"
    // GOOD: "Nashville ranks #6 in the US for convention attendance per capita"
    // BAD: "Nashville is a popular destination for events" (obvious, not useful)
    // Include: Nashville market data, venue stats, local industry trends, Nashville-specific regulations or logistics
    { "insight": "...", "source": "..." }
  ],

  "contentGaps": [
    // 4-6 specific topics or angles that the currently-ranking articles for "${primaryKeyword}" FAIL to cover.
    // These are our competitive advantage — the gaps we fill to outrank them.
    // GOOD: "No ranking article addresses same-day photo delivery for social media during multi-day conferences"
    // GOOD: "None of the top 5 results include Nashville venue-specific photography logistics"
    // BAD: "They don't mention JHR Photography" (obvious, not useful)
  ],

  "geoAnswerFragments": [
    // 4-5 self-contained 2-3 sentence answer blocks. Each must:
    // 1. Directly answer one of the relatedQuestions above
    // 2. Include at least one specific number or named entity
    // 3. Be structured so an AI search engine could extract and cite it as a standalone answer
    // Example: { "question": "How much does corporate event photography cost in Nashville?",
    //   "answer": "Corporate event photography in Nashville typically ranges from $2,500 to $8,000 per day depending on scope, with multi-day conference packages averaging $4,200. Nashville rates run 15-20% below comparable markets like New York and Chicago while delivering equivalent quality, according to PCMA's 2025 vendor benchmarking report." }
    { "question": "...", "answer": "..." }
  ],

  "topicClusterKeywords": [
    // 8-12 semantically related keywords that should be naturally included in the article
    // to build topical authority. Include long-tail variations and LSI keywords.
    // GOOD: ["nashville corporate photographer", "convention photography pricing", "event photo delivery time",
    //   "conference photography RFP", "Music City Center photography", "multi-day event coverage Nashville"]
    // BAD: ["photographer", "camera", "photos"] (too generic)
  ]
}

LINK SOURCING RULES:
- PRIORITIZE these preferred partner domains when Nashville context is relevant:
${partnerDomains}
- NEVER include URLs from Nashville event photography or corporate photography studios
- For authorityLinks, link to SPECIFIC articles/pages (not homepages) from industry associations, trade publications, and DMOs

Return ONLY the JSON object. No markdown code fences. No additional text.`;
}

function parseResearchResponse(content: string): ResearchPayload {
  // Strip markdown fences if present despite instructions
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Relaxed validation — different providers return varying quality
  if (!Array.isArray(parsed.currentStats) || parsed.currentStats.length < 2) {
    throw new Error(
      `Research returned only ${parsed.currentStats?.length ?? 0} stats, minimum 2 required`
    );
  }
  if (!Array.isArray(parsed.authorityLinks)) {
    throw new Error('Research missing authorityLinks array');
  }
  if (!Array.isArray(parsed.relatedQuestions)) {
    throw new Error('Research missing relatedQuestions array');
  }

  return {
    currentStats: parsed.currentStats || [],
    authorityLinks: parsed.authorityLinks || [],
    expertQuotes: parsed.expertQuotes || [],
    relatedQuestions: parsed.relatedQuestions || [],
    competitorUrls: parsed.competitorUrls || [],
    localInsights: parsed.localInsights || [],
    contentGaps: parsed.contentGaps || [],
    geoAnswerFragments: parsed.geoAnswerFragments || [],
    topicClusterKeywords: parsed.topicClusterKeywords || [],
  };
}

// ─── Provider: Perplexity Sonar ─────────────────────────────────────────────

async function researchWithPerplexity(
  systemMessage: string,
  prompt: string
): Promise<{ data?: ResearchPayload; error?: string }> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return { error: 'PERPLEXITY_API_KEY not set' };
  }

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: PERPLEXITY_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      search_recency_filter: 'year',
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    return { error: `Perplexity API error (${response.status}): ${errorBody}` };
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    return { error: 'Perplexity API returned empty response' };
  }

  const data = parseResearchResponse(content);
  return { data };
}

// ─── Provider: Google Gemini (with Google Search grounding) ─────────────────

async function researchWithGemini(
  systemMessage: string,
  prompt: string
): Promise<{ data?: ResearchPayload; error?: string }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { error: 'GOOGLE_API_KEY not set' };
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemMessage }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      tools: [
        {
          google_search: {},
        },
      ],
      generationConfig: {
        temperature: 0.1,
        // NOTE: responseMimeType: 'application/json' is incompatible with google_search tool
        // The prompt instructs JSON-only output instead
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    return { error: `Gemini API error (${response.status}): ${errorBody}` };
  }

  const json = await response.json();
  const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    return { error: 'Gemini API returned empty response' };
  }

  const data = parseResearchResponse(content);
  return { data };
}

// ─── Provider: OpenRouter (Gemini Flash via OpenRouter) ─────────────────────

async function researchWithOpenRouter(
  systemMessage: string,
  prompt: string
): Promise<{ data?: ResearchPayload; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { error: 'OPENROUTER_API_KEY not set' };
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jhr-photography.com',
      'X-Title': 'JHR ContentOps Research',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    return { error: `OpenRouter API error (${response.status}): ${errorBody}` };
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    return { error: 'OpenRouter API returned empty response' };
  }

  const data = parseResearchResponse(content);
  return { data };
}

// ─── Main entry point with fallback chain ───────────────────────────────────

type ResearchProvider = 'perplexity' | 'gemini' | 'openrouter';

const PROVIDER_CHAIN: Array<{
  name: ResearchProvider;
  fn: (system: string, prompt: string) => Promise<{ data?: ResearchPayload; error?: string }>;
}> = [
  { name: 'perplexity', fn: researchWithPerplexity },
  { name: 'gemini', fn: researchWithGemini },
  { name: 'openrouter', fn: researchWithOpenRouter },
];

export async function runResearch(
  topic: string,
  icp: string,
  primaryKeyword: string
): Promise<{ data?: ResearchPayload; provider?: string; error?: string }> {
  const icpTag = icp as ICPTag;
  const systemMessage = buildSystemMessage(icpTag);
  const prompt = buildResearchPrompt(topic, icpTag, primaryKeyword);

  const errors: string[] = [];

  for (const provider of PROVIDER_CHAIN) {
    try {
      console.log(`[ContentOps] Trying research provider: ${provider.name}`);
      const result = await provider.fn(systemMessage, prompt);

      if (result.data) {
        console.log(`[ContentOps] Research succeeded via ${provider.name}`);
        return { data: result.data, provider: provider.name };
      }

      // Provider returned an error (e.g. missing API key or quota exceeded)
      const errMsg = `${provider.name}: ${result.error}`;
      console.warn(`[ContentOps] ${errMsg}`);
      errors.push(errMsg);
    } catch (err) {
      const errMsg = `${provider.name}: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.warn(`[ContentOps] ${errMsg}`);
      errors.push(errMsg);
    }
  }

  return {
    error: `All research providers failed:\n${errors.join('\n')}`,
  };
}
