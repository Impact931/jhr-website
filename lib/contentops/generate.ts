// ContentOps Engine — Phase 2: Article Generation via Anthropic Claude
// Research is loaded from DynamoDB. Brand voice + ICP are inline (API-optimized).
// Proofing and GEO scoring run as background updates after the draft is saved.

import Anthropic from '@anthropic-ai/sdk';
import type { ContentOpsConfig, ResearchPayload, ArticlePayload, CompetitorContext } from './types';
import { getICPPromptBlock, getICPNarrativeBlock } from './icp-templates';
import { getGenerationLessons, formatLessonsForPrompt } from './lessons-store';

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

async function buildSystemPrompt(config: ContentOpsConfig, research: ResearchPayload, competitorContext?: CompetitorContext | null): Promise<string> {
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

  // Enriched voice guide — curated from full 550-line brand voice skill for API efficiency
  // Includes anti-patterns inline (prevent, not just detect), exemplars, and quality self-check
  const voiceSection = `## Layer 1: Identity & Voice (JHR Brand Voice Guide)

You are writing as JHR Photography, Nashville's event and corporate photography company. 15+ years, 200+ events, 15+ venue partnerships.

### StoryBrand Framework (ALWAYS ACTIVE)
- The CLIENT is the hero. JHR is the guide. The villain is uncertainty.
- Show empathy first ("We understand the pressure"), then authority through specifics.
- Every article answers: What does the reader want? What stands in the way? What does life look like when they succeed?

### Voice Attributes
1. **Warm & Personable** — Write like a trusted partner. Use contractions. Sound human.
2. **Direct & Action-Oriented** — Short paragraphs (2-3 sentences). Scannable. Clear takeaways.
3. **Confident & Knowledgeable** — State what we deliver without hedging. No "I think" or "hopefully."
4. **Solution-Focused** — Every challenge gets a path forward.
5. **Relationship-First** — Prioritize human connection over transactions.

### Voice Boundaries
| Be This | Not That |
|---|---|
| Warm | Overly familiar or presumptuous |
| Confident | Arrogant or self-congratulatory |
| Direct | Blunt or cold |
| Knowledgeable | Lecturing or condescending |
| Specific | Jargon-heavy or technical |

### Tone: EDUCATING Context (Blog/Thought Leadership)
- Authoritative but accessible — generous with knowledge, teach don't tease
- Lead with the reader's challenge or question
- Clear headers, practical takeaways, real Nashville-specific examples
- Close with invitation to conversation, not hard sell

### ANTI-PATTERN BLOCKLIST — HARD FAIL IF USED
**AI Slop Terms (NEVER use these words):**
crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, state-of-the-art, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, game-changer, leverage, holistic, spearhead, revolutionize, groundbreaking, transformative, "it is important to note", "in today's fast-paced world"

**Brand Prohibited Terms (NEVER use):**
hourly rate, half-day/full-day (pricing), freelancer, discount, day rate, setup fee, photographer availability, photo booth, free consultation, affordable, cheap, budget, premier, elite, championship, risk mitigation, risk transfer

**Use Instead:** engagement pricing (not hourly), operator (not freelancer), Execution Confidence (not risk mitigation), Headshot Activation (not photo booth), investment (not cost)

### StoryBrand Soundbites (Weave naturally into content)
- Problem: "You've invested [X] into this event. The last thing you need is to wonder whether..."
- Empathy: "We get it — there's a lot riding on this. That's exactly why we're here."
- Answer: "We help event professionals [deliver/capture what matters] without [the stress/another vendor to manage]."
- Change: "From 'I hope this works out' to 'I know it's handled.'"

### Voice Exemplar (THIS is the target tone)
> "You've invested months into this event. The last thing you need is to wonder whether the media will reflect the work you've put in — or whether it will become one more thing you have to manage."

Write naturally. Vary sentence length. Every sentence delivers value.`;

  // ICP block with narrative arc (want → problem → success) for persuasion structure
  const icpNarrative = getICPNarrativeBlock(config.icpTag);
  const icpSection = `## Layer 2: ICP Context

${icpBlock}

### Narrative Arc (shape the article's persuasion structure)
${icpNarrative}`;

  const basePrompt = `${voiceSection}

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

  // Layer 5: Inject lessons from previous generation/improvement cycles
  let lessonsBlock = '';
  try {
    const lessons = await getGenerationLessons();
    lessonsBlock = formatLessonsForPrompt(lessons);
  } catch {
    // Lessons unavailable — continue without them
  }

  return lessonsBlock ? `${basePrompt}\n\n${lessonsBlock}` : basePrompt;
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
- All JSON is valid and parseable

BEFORE FINALIZING, mentally apply these 5 checks:
1. Vendor Test: Could any photography vendor have written this? If yes, add JHR/Nashville specifics.
2. Robot Test: Does this sound like AI? If yes, vary sentence length, add personal touches.
3. Jayson Test: Would JHR's founder say this naturally? If no, make it more conversational.
4. Hero Test: Is the CLIENT the hero? If JHR is the hero, reframe.
5. Warmth Test: Would the reader feel a real person wrote this? If not, add genuine connection.`;
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

// ─── Main generation function (non-streaming, used by scripts/competitor-generate) ─

export async function generateArticle(
  config: ContentOpsConfig,
  research: ResearchPayload,
  competitorContext?: CompetitorContext | null,
): Promise<{ data?: ArticlePayload; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: 'ANTHROPIC_API_KEY environment variable is not set' };
  }

  const systemPrompt = await buildSystemPrompt(config, research, competitorContext);
  const userPrompt = buildUserPrompt(config);

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.5,
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

// ─── Streaming generation (used by the API route to prevent gateway timeouts) ─

export async function generateArticleStreaming(
  config: ContentOpsConfig,
  research: ResearchPayload,
  onChunk?: (chunkCount: number) => void,
): Promise<{ data?: ArticlePayload; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: 'ANTHROPIC_API_KEY environment variable is not set' };
  }

  const systemPrompt = await buildSystemPrompt(config, research);
  const userPrompt = buildUserPrompt(config);

  try {
    const client = new Anthropic({ apiKey });
    let fullText = '';
    let chunkCount = 0;

    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.5,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullText += event.delta.text;
        chunkCount++;
        if (onChunk) onChunk(chunkCount);
      }
    }

    if (!fullText) {
      return { error: 'Anthropic streaming returned no text' };
    }

    const article = parseArticleResponse(fullText);
    return { data: article };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during generation';
    return { error: `Article generation failed: ${message}` };
  }
}
