// ContentOps Engine — Phase 2: Article Generation via Anthropic Claude
// Research is loaded from DynamoDB. Brand voice + ICP are inline (API-optimized).
// Proofing and GEO scoring run as background updates after the draft is saved.

import Anthropic from '@anthropic-ai/sdk';
import type { ContentOpsConfig, ResearchPayload, ArticlePayload, CompetitorContext } from './types';
import { getICPPromptBlock } from './icp-templates';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// Internal link map: path → anchor text
const INTERNAL_LINK_MAP: Record<string, string> = {
  '/services/corporate-event-coverage': 'corporate event photography Nashville',
  '/services/headshot-activation': 'headshot activation',
  '/services/executive-imaging': 'executive imaging',
  '/services/trade-show-media': 'trade show photography',
  '/services/convention-media': 'convention media coverage',
  '/services/social-networking-media': 'event social media content',
  '/solutions/dmcs-agencies': 'DMC and agency event photography solutions',
  '/solutions/exhibitors-sponsors': 'exhibitor and sponsor media solutions',
  '/solutions/associations': 'association and conference photography',
  '/solutions/venues': 'venue photography partner',
  '/venues/music-city-center': 'Music City Center photography',
  '/venues/gaylord-opryland': 'Gaylord Opryland event photography',
  '/schedule': 'schedule a strategy call',
};

// ─── Competitor analysis block ───────────────────────────────────────────────

function buildCompetitorBlock(competitor: CompetitorContext): string {
  const pageDetails = competitor.pages
    .map((p) => `- ${p.url}: ${p.wordCount} words, ${p.headings.h2.length} H2s, ${p.externalLinkCount} external links\n  H2s: ${p.headings.h2.join(' | ') || '(none)'}`)
    .join('\n');

  return `## Competitor Analysis

The top ${competitor.pages.length} ranking articles for this topic have been analyzed:

${pageDetails}

**Averages:** ${competitor.avgWordCount} words, ${competitor.avgH2Count} H2 sections, ${competitor.avgExternalLinks} external links.

Your article must exceed this depth — aim for at least ${Math.round(competitor.avgWordCount * 1.2)} words and ${competitor.avgH2Count + 1}+ H2 sections to outperform competitors.`;
}

// ─── System prompt builder ───────────────────────────────────────────────────

function buildSystemPrompt(config: ContentOpsConfig, research: ResearchPayload, competitorContext?: CompetitorContext | null): string {
  const icpBlock = getICPPromptBlock(config.icpTag);

  const internalLinkLines = Object.entries(INTERNAL_LINK_MAP)
    .map(([path, anchor]) => `- [${anchor}](${path})`)
    .join('\n');

  const statsBlock = research.currentStats
    .map((s) => `- ${s.stat} (Source: ${s.source})`)
    .join('\n');

  const authorityLinksBlock = research.authorityLinks
    .map((l) => `- [${l.title}](${l.url}) — ${l.domain}`)
    .join('\n');

  const expertQuotesBlock = research.expertQuotes
    .map((q) => `- "${q.quote}" — ${q.attribution}`)
    .join('\n');

  const relatedQuestionsBlock = research.relatedQuestions
    .map((q) => `- ${q}`)
    .join('\n');

  const localInsightsBlock = (research.localInsights || [])
    .map((l) => `- ${l.insight} (Source: ${l.source})`)
    .join('\n');

  const contentGapsBlock = (research.contentGaps || [])
    .map((g) => `- ${g}`)
    .join('\n');

  const geoFragmentsBlock = (research.geoAnswerFragments || [])
    .map((f) => `- Q: ${f.question}\n  A: ${f.answer}`)
    .join('\n');

  const clusterKeywordsBlock = (research.topicClusterKeywords || [])
    .map((k) => `"${k}"`)
    .join(', ');

  // Use concise inline voice guide for API calls (full 26KB doc causes timeouts)
  // The full brand voice doc is available for Claude Code sessions, not API generation
  const voiceSection = `## Layer 1: Identity & Voice (JHR Brand Voice Guide)

You are writing as JHR Photography, Nashville's premier event and corporate photography company with 15+ years of experience.

### StoryBrand Framework
- The CLIENT is always the hero. JHR is the guide.
- The villain is uncertainty — "Will the vendor show up prepared?" "Will the photos be usable?"
- JHR demonstrates empathy first ("We understand the pressure"), then authority through specifics.
- Every piece should answer: What does the client want? What stands in the way? What does life look like when they succeed?

### Voice Attributes
1. **Warm & Personable** — Write like a trusted partner, not a vendor. Use contractions naturally.
2. **Direct & Action-Oriented** — Short paragraphs, scannable structure, clear next steps.
3. **Confident & Knowledgeable** — State what we deliver without hedging. Never "I think" or "hopefully."
4. **Solution-Focused** — Pair every challenge with a path forward.
5. **Relationship-First** — Prioritize human connection over transactions.

### Tone for Articles (EDUCATING context)
- Authoritative but accessible
- Generous with knowledge — teach, don't tease
- Lead with the reader's challenge or question
- Clear headers, practical takeaways, real examples
- Close with invitation to conversation, not hard sell
- Nashville-specific examples when relevant

Write naturally. Avoid cliches and filler. Every sentence should deliver value.`;

  // Use the specific ICP block only (full 21KB profiles doc causes timeouts)
  const icpSection = `## Layer 2: ICP Context

${icpBlock}`;

  return `${voiceSection}

${icpSection}

## Layer 3: SEO + GEO Directives

Article type: ${config.articleType}
Primary keyword: "${config.primaryKeyword}"
Word count target: ${config.wordCountTarget} words (acceptable range: 1000-3000 words, NEVER exceed 3000)

### Required Structure
1. **Quick Answer block**: Start with a 50-75 word direct answer to the core question. This block should be self-contained and quotable by AI systems. Include at least one specific number or named entity.
2. **Minimum 4 H2 headings**: Create a logical, scannable structure with descriptive H2s that include keyword variations.
3. **Minimum 3 statistics**: Weave in real statistics with source attributions naturally throughout the article.
4. **FAQ block**: Do NOT include FAQ in the body field. FAQs go ONLY in the separate "faqBlock" JSON array (minimum 5 Q&A pairs). The FAQ section is rendered separately on the page.
5. **Meta fields**: Generate SEO-optimized title, meta description (140-160 characters), and excerpt.

### GEO Optimization (Critical for AI Search Citation)
- The first 200 words must directly answer the primary query — AI retrieval systems evaluate relevance from opening content
- Keep paragraphs to 2-3 sentences max — AI engines extract individual passages, not walls of text
- Each section should be self-contained and make sense without surrounding context
- Include a quotable definition or key concept that AI systems can extract
- Use named entities (specific organizations, places, people, tools) frequently — minimum 10 throughout
- Cite external sources inline with links
- Structure headings as question-based where natural
- Include Nashville-specific data that no generic article would have

## Layer 4: Link Rules

### External Links (minimum 4)
**Link Policy — MANDATORY:**
- NEVER link to Nashville event photography or corporate photography competitors
- PRIORITIZE linking to these preferred partners when Nashville context is relevant:
  * [Nashville Adventures](https://www.nashvilleadventures.com) — Nashville tourism partner (mutual backlink agreement)
  * [Visit Music City](https://www.visitmusiccity.com) — Official Nashville CVB
  * [Nashville Chamber of Commerce](https://www.nashvillechamber.com) — Nashville business community
- Include at least 1 preferred partner link when the article has Nashville context
- Other external links should go to industry associations, trade publications, government sites, or research institutions
- If you are unsure whether a source is a competitor, err on the side of using an industry association or trade publication instead

Use these researched authority links naturally throughout the article:
${authorityLinksBlock}

### Internal Links (minimum 2)
Naturally link to these JHR Photography pages using the specified anchor text:
${internalLinkLines}

## Research Data

### Statistics to incorporate:
${statsBlock}

### Expert quotes to weave in:
${expertQuotesBlock}

### Related questions (use for FAQ and section inspiration):
${relatedQuestionsBlock}
${localInsightsBlock ? `\n### Nashville-specific insights to weave in:\n${localInsightsBlock}` : ''}
${contentGapsBlock ? `\n### Content gaps to exploit (cover what competitors miss):\n${contentGapsBlock}` : ''}
${geoFragmentsBlock ? `\n### GEO answer fragments (use as basis for key sections — these are structured for AI citation):\n${geoFragmentsBlock}` : ''}
${clusterKeywordsBlock ? `\n### Topic cluster keywords (weave naturally throughout):\n${clusterKeywordsBlock}` : ''}${competitorContext ? '\n\n' + buildCompetitorBlock(competitorContext) : ''}`;
}

function buildUserPrompt(config: ContentOpsConfig): string {
  return `Write a comprehensive article about "${config.topic}" optimized for the primary keyword "${config.primaryKeyword}".

CRITICAL: The "body" field MUST be valid HTML, NOT markdown. Use proper HTML tags:
- <h2> for section headings (never use ## markdown syntax)
- <h3> for sub-headings
- <p> for paragraphs
- <ul>/<ol> with <li> for lists
- <a href="..."> for links (include target="_blank" rel="noopener noreferrer" for external links)
- <strong> for bold, <em> for emphasis
- <blockquote> for quotations
- Do NOT use markdown syntax anywhere in the body field

Return ONLY a valid JSON object (no markdown fences, no explanation) matching this exact structure:

{
  "title": "Article title including the primary keyword",
  "slug": "url-friendly-slug-with-hyphens",
  "metaTitle": "SEO title tag, 50-60 characters",
  "metaDescription": "Meta description, 140-160 characters",
  "excerpt": "2-3 sentence excerpt for listings",
  "quickAnswer": "50-75 word direct answer block",
  "body": "Full article in HTML with proper H2s, links, and stats. Do NOT include FAQ in body — FAQs go only in faqBlock array below",
  "wordCount": 0,
  "readTime": 0,
  "icpTag": "${config.icpTag}",
  "primaryKeyword": "${config.primaryKeyword}",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "faqBlock": [
    { "question": "...", "answer": "..." }
  ],
  "linkAudit": [
    { "url": "...", "anchorText": "...", "type": "internal|external", "status": "unchecked" }
  ],
  "linkAuditStatus": "pending",
  "externalLinkCount": 0,
  "internalLinkCount": 0,
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "...",
    "author": {
      "@type": "Organization",
      "name": "JHR Photography"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JHR Photography"
    },
    "description": "..."
  },
  "openGraph": {
    "title": "...",
    "description": "...",
    "type": "article"
  },
  "status": "draft"
}

Ensure:
- wordCount is the actual word count of the body field
- readTime is calculated at 250 words per minute, rounded up
- externalLinkCount and internalLinkCount are accurate counts from the body
- linkAudit contains every link found in the body
- slug is lowercase, hyphen-separated, no spaces
- All JSON is valid and parseable`;
}

// ─── Parse & validate ────────────────────────────────────────────────────────

function parseArticleResponse(content: string): ArticlePayload {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }

  const parsed = JSON.parse(cleaned);

  const requiredFields = [
    'title', 'slug', 'metaTitle', 'metaDescription', 'excerpt',
    'quickAnswer', 'body', 'wordCount', 'readTime', 'icpTag',
    'primaryKeyword', 'secondaryKeywords', 'faqBlock', 'linkAudit',
    'externalLinkCount', 'internalLinkCount', 'schemaMarkup', 'openGraph', 'status',
  ];

  for (const field of requiredFields) {
    if (!(field in parsed)) {
      throw new Error(`Generated article missing required field: ${field}`);
    }
  }

  return parsed as ArticlePayload;
}

// ─── Main generation function ────────────────────────────────────────────────

export async function generateArticle(
  config: ContentOpsConfig,
  research: ResearchPayload,
  competitorContext?: CompetitorContext | null,
): Promise<{ data?: ArticlePayload; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: 'ANTHROPIC_API_KEY environment variable is not set' };
  }

  const systemPrompt = buildSystemPrompt(config, research, competitorContext);
  const userPrompt = buildUserPrompt(config);

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { error: 'Anthropic API returned no text content' };
    }

    const article = parseArticleResponse(textBlock.text);
    return { data: article };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during generation';
    return { error: `Article generation failed: ${message}` };
  }
}
