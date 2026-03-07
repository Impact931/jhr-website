// ContentOps Engine — Phase 1: Research via Perplexity Sonar API

import type { ResearchPayload } from './types';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar-pro';

function buildResearchPrompt(topic: string, icp: string, primaryKeyword: string): string {
  return `You are a research assistant gathering data for a professional article about "${topic}" targeting ${icp} audiences in the event photography and corporate media industry. The primary keyword is "${primaryKeyword}".

Gather the following and return ONLY valid JSON (no markdown fences, no explanation):

{
  "currentStats": [
    // Minimum 4 statistics with specific numbers relevant to the topic.
    // Each must have a "stat" (the data point as a sentence) and "source" (where it comes from).
    // Prefer recent data (2023-2026). Include industry-specific metrics.
    { "stat": "...", "source": "..." }
  ],
  "authorityLinks": [
    // Minimum 5 URLs from authoritative sources: trade publications, government sites,
    // research institutions, or professional associations (e.g., PCMA, MPI, CEIR, IAEE,
    // EventMB, BizBash, ASAE, Trade Show News Network).
    // Each must have "url", "title", and "domain".
    { "url": "...", "title": "...", "domain": "..." }
  ],
  "expertQuotes": [
    // 2-3 real, attributable quotes from named industry experts, authors, or researchers
    // relevant to the topic. Each must have "quote" and "attribution".
    { "quote": "...", "attribution": "..." }
  ],
  "relatedQuestions": [
    // 6-8 questions real people ask about this topic (People Also Ask style)
  ],
  "competitorUrls": [
    // 3-5 URLs of existing articles ranking for "${primaryKeyword}" or closely related terms
  ]
}

Return ONLY the JSON object. No markdown code fences. No additional text.`;
}

function parseResearchResponse(content: string): ResearchPayload {
  // Strip markdown fences if present despite instructions
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  if (!Array.isArray(parsed.currentStats) || parsed.currentStats.length < 4) {
    throw new Error(`Research returned only ${parsed.currentStats?.length ?? 0} stats, minimum 4 required`);
  }
  if (!Array.isArray(parsed.authorityLinks) || parsed.authorityLinks.length < 5) {
    throw new Error(`Research returned only ${parsed.authorityLinks?.length ?? 0} authority links, minimum 5 required`);
  }
  if (!Array.isArray(parsed.expertQuotes)) {
    throw new Error('Research missing expertQuotes array');
  }
  if (!Array.isArray(parsed.relatedQuestions)) {
    throw new Error('Research missing relatedQuestions array');
  }
  if (!Array.isArray(parsed.competitorUrls)) {
    throw new Error('Research missing competitorUrls array');
  }

  return {
    currentStats: parsed.currentStats,
    authorityLinks: parsed.authorityLinks,
    expertQuotes: parsed.expertQuotes,
    relatedQuestions: parsed.relatedQuestions,
    competitorUrls: parsed.competitorUrls,
  };
}

export async function runResearch(
  topic: string,
  icp: string,
  primaryKeyword: string
): Promise<{ data?: ResearchPayload; error?: string }> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return { error: 'PERPLEXITY_API_KEY environment variable is not set' };
  }

  const prompt = buildResearchPrompt(topic, icp, primaryKeyword);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant. Return only valid JSON with no markdown formatting or additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      return {
        error: `Perplexity API error (${response.status}): ${errorBody}`,
      };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      return { error: 'Perplexity API returned empty response' };
    }

    const data = parseResearchResponse(content);
    return { data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during research';
    return { error: `Research failed: ${message}` };
  }
}
