// ContentOps Engine — Phase 2: Article Generation via Anthropic Claude

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
  '/venues/music-city-center': 'Music City Center photography',
  '/venues/gaylord-opryland': 'Gaylord Opryland event photography',
  '/schedule': 'schedule a strategy call',
};

const PROHIBITED_PHRASES = [
  'in today\'s fast-paced world',
  'in the ever-evolving landscape',
  'it\'s no secret that',
  'at the end of the day',
  'game-changer',
  'synergy',
  'leverage',
  'move the needle',
  'deep dive',
  'circle back',
  'low-hanging fruit',
  'best-in-class',
  'cutting-edge',
  'world-class',
  'second to none',
  'look no further',
  'without further ado',
  'crucial',
  'delve',
  'comprehensive',
  'furthermore',
  'moreover',
  'utilize',
  'streamline',
  'innovative',
  'state-of-the-art',
  'it is important to note',
  'it goes without saying',
  'solutions-oriented',
  'paradigm',
  'robust',
  'seamless',
  'elevate',
  'landscape',
  'navigate',
  'empower',
  'unlock',
  'harness',
];

function buildCompetitorBlock(competitor: CompetitorContext): string {
  const pageDetails = competitor.pages
    .map((p) => `- ${p.url}: ${p.wordCount} words, ${p.headings.h2.length} H2s, ${p.externalLinkCount} external links\n  H2s: ${p.headings.h2.join(' | ') || '(none)'}`)
    .join('\n');

  return `## Competitor Analysis

The top ${competitor.pages.length} ranking articles for this topic have been analyzed:

${pageDetails}

**Averages:** ${competitor.avgWordCount} words, ${competitor.avgH2Count} H2 sections, ${competitor.avgExternalLinks} external links.

Competitor analysis shows the top ${competitor.pages.length} ranking articles average ${competitor.avgWordCount} words with ${competitor.avgH2Count} H2 sections. Your article must exceed this depth — aim for at least ${Math.round(competitor.avgWordCount * 1.2)} words and ${competitor.avgH2Count + 1}+ H2 sections to outperform competitors.`;
}

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

  return `## Layer 1: Identity & Voice (JHR Brand Voice Guide)

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

### Boundary Pairs — Be This, Not That
- Warm, not overly familiar | Confident, not arrogant | Direct, not blunt
- Professional, not stiff | Knowledgeable, not lecturing | Specific, not jargon-heavy

### Content Quality Tests (apply after writing)
1. Could any photographer in any city have written this? If yes, add JHR-specific details.
2. Does it sound AI-generated? Vary sentence length, add natural touches.
3. Would Jayson Rivas actually say this? Make it conversational.
4. Does this make the CLIENT the hero? Reframe if JHR is the hero.

### Prohibited Terms — NEVER use these
**AI-default vocabulary blocklist:**
${PROHIBITED_PHRASES.map((p) => `- "${p}"`).join('\n')}

**JHR-specific term replacements:**
- "hourly rate" → "engagement pricing"
- "freelancer" → "operator" or "team member"
- "discount" → "strategic rate"
- "coverage" (as in "we provide coverage") → "intentional media" or "documentation"
- "photo booth" → "headshot activation"
- "cost" → "investment"

Write naturally. Avoid cliches and filler. Every sentence should deliver value.

## Layer 2: ICP Context

${icpBlock}

## Layer 3: SEO + GEO Directives

Article type: ${config.articleType}
Primary keyword: "${config.primaryKeyword}"
Word count target: ${config.wordCountTarget} words (acceptable range: 1000-3000 words, NEVER exceed 3000)

### Required Structure
1. **Quick Answer block**: Start with a 50-75 word direct answer to the core question. This block should be self-contained and quotable by AI systems.
2. **Minimum 4 H2 headings**: Create a logical, scannable structure with descriptive H2s that include keyword variations.
3. **Minimum 3 statistics**: Weave in real statistics with source attributions naturally throughout the article.
4. **FAQ block**: Do NOT include FAQ in the body field. FAQs go ONLY in the separate "faqBlock" JSON array (minimum 5 Q&A pairs). The FAQ section is rendered separately on the page.
5. **Meta fields**: Generate SEO-optimized title, meta description (140-160 characters), and excerpt.

### GEO Optimization
- Include a quotable definition or key concept that AI systems can extract
- Use named entities (specific organizations, places, people, tools) frequently
- Cite external sources inline with links
- Structure headings as question-based where natural

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
${relatedQuestionsBlock}${competitorContext ? '\n\n' + buildCompetitorBlock(competitorContext) : ''}`;
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

function parseArticleResponse(content: string): ArticlePayload {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields exist
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

export async function generateArticle(
  config: ContentOpsConfig,
  research: ResearchPayload,
  competitorContext?: CompetitorContext | null
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
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { error: 'Anthropic API returned no text content' };
    }

    const data = parseArticleResponse(textBlock.text);
    return { data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during generation';
    return { error: `Article generation failed: ${message}` };
  }
}
