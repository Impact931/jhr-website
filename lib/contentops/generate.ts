// ContentOps Engine — Phase 2: Article Generation via Anthropic Claude
// Loads full brand voice + ICP docs, includes Claude proofing loop

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
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

// ─── Load brand voice documents from disk ────────────────────────────────────

function loadBrandVoice(): string {
  try {
    return readFileSync(
      join(process.cwd(), '.claude/skills/foundation/jhr-brand-voice.md'),
      'utf-8'
    );
  } catch {
    console.warn('[ContentOps] Brand voice file not found, using inline fallback');
    return '';
  }
}

function loadICPProfiles(): string {
  try {
    return readFileSync(
      join(process.cwd(), '.claude/skills/foundation/jhr-icp-profiles.md'),
      'utf-8'
    );
  } catch {
    console.warn('[ContentOps] ICP profiles file not found, using inline fallback');
    return '';
  }
}

// Cache loaded docs in memory for the process lifetime
let _brandVoiceCache: string | null = null;
let _icpProfilesCache: string | null = null;

function getBrandVoice(): string {
  if (_brandVoiceCache === null) _brandVoiceCache = loadBrandVoice();
  return _brandVoiceCache;
}

function getICPProfiles(): string {
  if (_icpProfilesCache === null) _icpProfilesCache = loadICPProfiles();
  return _icpProfilesCache;
}

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
  const brandVoice = getBrandVoice();
  const icpProfiles = getICPProfiles();
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

  // Use the full brand voice doc if available, otherwise fall back to inline
  const voiceSection = brandVoice
    ? `## Layer 1: JHR Brand Voice (Full Document)

${brandVoice}`
    : `## Layer 1: Identity & Voice (JHR Brand Voice Guide)

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

  // Use full ICP profiles if available, combined with the specific ICP block
  const icpSection = icpProfiles
    ? `## Layer 2: ICP Context

### Target ICP for This Article
${icpBlock}

### Full ICP Reference (use for depth and authenticity)
${icpProfiles}`
    : `## Layer 2: ICP Context

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

// ─── Claude Proofing Loop ────────────────────────────────────────────────────

export interface ProofingResult {
  passed: boolean;
  overallScore: number;
  brandVoiceScore: number;
  geoReadiness: number;
  seoScore: number;
  issues: ProofingIssue[];
  revisedArticle?: ArticlePayload;
}

interface ProofingIssue {
  severity: 'critical' | 'warning' | 'suggestion';
  category: 'brand-voice' | 'ai-slop' | 'geo' | 'seo' | 'nashville' | 'structure';
  description: string;
  location?: string;
  fix?: string;
}

function buildProofingPrompt(article: ArticlePayload, config: ContentOpsConfig): string {
  const brandVoice = getBrandVoice();

  return `You are the JHR Photography content quality editor. Your job is to proof this article against the brand voice guide, GEO best practices, and SEO requirements. Be rigorous — this article must rank in the top 3 on Google AND get cited by AI search engines.

## BRAND VOICE REFERENCE
${brandVoice || 'Brand voice document not available — check for: AI-sounding language, generic phrasing, and client-as-hero framing.'}

## ARTICLE TO PROOF

Title: ${article.title}
Primary Keyword: ${article.primaryKeyword}
ICP: ${config.icpTag}
Word Count: ${article.wordCount}
Quick Answer: ${article.quickAnswer}

Body:
${article.body}

FAQ Block:
${article.faqBlock.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

## PROOFING CHECKLIST

Score each category 0-100 and identify specific issues:

### 1. Brand Voice (0-100)
- Does it follow the StoryBrand framework? (Client = hero, JHR = guide)
- Does it match the EDUCATING tone context?
- Are the voice attributes present? (Warm, Direct, Confident, Solution-Focused, Relationship-First)
- Does it pass the 5 Content Quality Tests? (Vendor Test, Robot Test, Jayson Test, Hero Test, Warmth Test)
- Are prohibited terms/phrases used? Check EVERY word against the blocklist.
- Are JHR-specific term replacements followed? (hourly rate→engagement pricing, etc.)

### 2. AI Slop Detection (deducted from Brand Voice score)
- Flag ANY instance of: crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, state-of-the-art, robust, seamless, elevate, landscape (business metaphor), navigate (business metaphor), empower, unlock, harness, paradigm, synergy, game-changer, leverage
- Flag generic sentences that could apply to any photographer in any city
- Flag sentences that don't deliver specific value
- Flag excessive exclamation points or forced enthusiasm

### 3. GEO Readiness (0-100)
- Does the first 200 words directly answer the primary query?
- Are paragraphs 2-3 sentences max? (AI engines extract passages, not walls)
- Are sections self-contained? (Each should make sense without context)
- Is there a quotable definition or key concept AI can extract?
- Are there 10+ named entities throughout? (Organizations, places, people, specific tools)
- Are statistics cited with sources inline?
- Are headings question-based where natural?
- Quick answer: is it 50-75 words, self-contained, with a specific number?

### 4. SEO Score (0-100)
- Primary keyword in title, H1, first 100 words, and meta description?
- Minimum 4 H2 headings with keyword variations?
- Meta description 140-160 characters?
- Minimum 4 external links (no competitor links)?
- Minimum 2 internal links?
- At least 1 preferred partner link (Nashville Adventures, Visit Music City, Nashville Chamber)?
- Minimum 5 FAQ items with substantive answers?
- Nashville-specific content that shows genuine local knowledge?

### 5. Nashville Authenticity
- Does it reference specific Nashville venues, neighborhoods, or landmarks?
- Does it include Nashville-specific data points (not generic + "Nashville" appended)?
- Would a Nashville event professional recognize this as written by someone who knows the market?

Return ONLY valid JSON (no markdown fences):

{
  "passed": true/false,
  "overallScore": 0-100,
  "brandVoiceScore": 0-100,
  "geoReadiness": 0-100,
  "seoScore": 0-100,
  "issues": [
    {
      "severity": "critical|warning|suggestion",
      "category": "brand-voice|ai-slop|geo|seo|nashville|structure",
      "description": "What's wrong",
      "location": "Where in the article (optional — quote the problematic text)",
      "fix": "Specific suggested fix (optional)"
    }
  ],
  "revisedBody": "If there are critical issues, provide a revised version of the full HTML body with all issues fixed. If no critical issues, set to null."
}

SCORING:
- overallScore = weighted average: brandVoice (30%) + geoReadiness (30%) + seoScore (25%) + nashvilleAuthenticity (15%)
- passed = true if overallScore >= 75 AND zero critical issues
- Be specific about locations — quote the problematic text so the issue can be found`;
}

async function runProofingLoop(
  article: ArticlePayload,
  config: ContentOpsConfig,
  apiKey: string
): Promise<ProofingResult> {
  const client = new Anthropic({ apiKey });
  const proofingPrompt = buildProofingPrompt(article, config);

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8192,
    system: 'You are a rigorous content quality editor for JHR Photography. Return only valid JSON. Be specific and actionable in your feedback.',
    messages: [{ role: 'user', content: proofingPrompt }],
    temperature: 0.2,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    return {
      passed: false,
      overallScore: 0,
      brandVoiceScore: 0,
      geoReadiness: 0,
      seoScore: 0,
      issues: [{ severity: 'critical', category: 'structure', description: 'Proofing API returned no content' }],
    };
  }

  let cleaned = textBlock.text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }

  const result = JSON.parse(cleaned);

  // If proofing returned a revised body, apply it to the article
  let revisedArticle: ArticlePayload | undefined;
  if (result.revisedBody && typeof result.revisedBody === 'string') {
    revisedArticle = {
      ...article,
      body: result.revisedBody,
      wordCount: result.revisedBody.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
    };
    revisedArticle.readTime = Math.ceil(revisedArticle.wordCount / 250);
  }

  return {
    passed: result.passed ?? false,
    overallScore: result.overallScore ?? 0,
    brandVoiceScore: result.brandVoiceScore ?? 0,
    geoReadiness: result.geoReadiness ?? 0,
    seoScore: result.seoScore ?? 0,
    issues: (result.issues || []).map((i: ProofingIssue) => ({
      severity: i.severity || 'warning',
      category: i.category || 'structure',
      description: i.description || '',
      location: i.location,
      fix: i.fix,
    })),
    revisedArticle,
  };
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
  lessonsPrompt?: string
): Promise<{ data?: ArticlePayload; proofing?: ProofingResult; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: 'ANTHROPIC_API_KEY environment variable is not set' };
  }

  let systemPrompt = buildSystemPrompt(config, research, competitorContext);

  // Inject lessons from DynamoDB if available
  if (lessonsPrompt) {
    systemPrompt = `${systemPrompt}\n\n${lessonsPrompt}`;
  }

  const userPrompt = buildUserPrompt(config);

  try {
    const client = new Anthropic({ apiKey });

    // Phase 2a: Generate the article
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

    let article = parseArticleResponse(textBlock.text);

    // Phase 2b: Run the proofing loop (race against 20s timeout to avoid gateway 504)
    let proofing: ProofingResult;
    try {
      const proofingResult = await Promise.race([
        runProofingLoop(article, config, apiKey),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 20_000)),
      ]);

      if (proofingResult) {
        proofing = proofingResult;
        // If proofing returned a revised article with fixes, use it
        if (proofing.revisedArticle && !proofing.passed) {
          article = proofing.revisedArticle;
        }
      } else {
        console.warn('[ContentOps] Proofing loop timed out (20s), using unproofed article');
        proofing = {
          passed: true,
          overallScore: 0,
          brandVoiceScore: 0,
          geoReadiness: 0,
          seoScore: 0,
          issues: [{
            severity: 'warning',
            category: 'structure',
            description: 'Proofing skipped (timeout) — article was saved without proofing review',
          }],
        };
      }
    } catch (proofErr) {
      console.error('[ContentOps] Proofing loop failed:', proofErr);
      proofing = {
        passed: false,
        overallScore: 0,
        brandVoiceScore: 0,
        geoReadiness: 0,
        seoScore: 0,
        issues: [{
          severity: 'warning',
          category: 'structure',
          description: `Proofing loop failed: ${proofErr instanceof Error ? proofErr.message : 'Unknown error'}`,
        }],
      };
    }

    return { data: article, proofing };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during generation';
    return { error: `Article generation failed: ${message}` };
  }
}
