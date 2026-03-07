// ContentOps Engine — Phase 2: Article Generation via Anthropic Claude

import Anthropic from '@anthropic-ai/sdk';
import type { ContentOpsConfig, ResearchPayload, ArticlePayload } from './types';
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
];

function buildSystemPrompt(config: ContentOpsConfig, research: ResearchPayload): string {
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

  return `## Layer 1: Identity & Voice

You are writing as JHR Photography, Nashville's premier event and corporate photography company with 15+ years of experience. Write in a confident, knowledgeable, but approachable professional voice. You are an expert who has photographed thousands of events in Nashville and nationwide.

PROHIBITED PHRASES — never use any of these:
${PROHIBITED_PHRASES.map((p) => `- "${p}"`).join('\n')}

Write naturally. Avoid cliches and filler. Every sentence should deliver value.

## Layer 2: ICP Context

${icpBlock}

## Layer 3: SEO + GEO Directives

Article type: ${config.articleType}
Primary keyword: "${config.primaryKeyword}"
Word count target: ${config.wordCountTarget} words (acceptable range: 1000-1800 words)

### Required Structure
1. **Quick Answer block**: Start with a 50-75 word direct answer to the core question. This block should be self-contained and quotable by AI systems.
2. **Minimum 4 H2 headings**: Create a logical, scannable structure with descriptive H2s that include keyword variations.
3. **Minimum 3 statistics**: Weave in real statistics with source attributions naturally throughout the article.
4. **FAQ block**: End with a minimum of 5 Q&A pairs formatted as:
   ### Frequently Asked Questions
   **Q: [question]**
   A: [answer]
5. **Meta fields**: Generate SEO-optimized title, meta description (140-160 characters), and excerpt.

### GEO Optimization
- Include a quotable definition or key concept that AI systems can extract
- Use named entities (specific organizations, places, people, tools) frequently
- Cite external sources inline with links
- Structure headings as question-based where natural

## Layer 4: Link Rules

### External Links (minimum 4)
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
${relatedQuestionsBlock}`;
}

function buildUserPrompt(config: ContentOpsConfig): string {
  return `Write a comprehensive article about "${config.topic}" optimized for the primary keyword "${config.primaryKeyword}".

Return ONLY a valid JSON object (no markdown fences, no explanation) matching this exact structure:

{
  "title": "Article title including the primary keyword",
  "slug": "url-friendly-slug-with-hyphens",
  "metaTitle": "SEO title tag, 50-60 characters",
  "metaDescription": "Meta description, 140-160 characters",
  "excerpt": "2-3 sentence excerpt for listings",
  "quickAnswer": "50-75 word direct answer block",
  "body": "Full article in markdown with proper H2s, links, stats, and FAQ block",
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
  research: ResearchPayload
): Promise<{ data?: ArticlePayload; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: 'ANTHROPIC_API_KEY environment variable is not set' };
  }

  const systemPrompt = buildSystemPrompt(config, research);
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
