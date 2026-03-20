// ContentOps Engine — Article Improvement (3-Phase Assembly Line)
//
// Phase 1: ANALYZE — Extract structure, identify deficiencies, produce revised outline
// Phase 2: REWRITE — Section-by-section body rewrite using the new outline
// Phase 3: POLISH — Quick answer, meta fields, FAQ generation
//
// Each phase is a focused Claude call with minimal context.
// SSE keepalives flow between phases to prevent Amplify gateway timeout.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload, FAQItem } from './types';

// Haiku for analysis/metadata (speed), Sonnet for body writing (quality)
const FAST_MODEL = 'claude-haiku-4-5-20251001';
const QUALITY_MODEL = 'claude-sonnet-4-20250514';

// ─── Skill / Voice Guide ─────────────────────────────────────────────────────

let _skillCache: string | null = null;
function loadVoiceGuide(): string {
  if (_skillCache) return _skillCache;
  try {
    _skillCache = readFileSync(join(process.cwd(), 'lib/contentops/improve-skill.md'), 'utf-8');
  } catch {
    try {
      _skillCache = readFileSync(join(__dirname, 'improve-skill.md'), 'utf-8');
    } catch {
      _skillCache = 'You are improving a JHR Photography article. Write in a warm, direct, confident voice. No AI slop words.';
    }
  }
  return _skillCache;
}

// ─── Phase 1: ANALYZE ────────────────────────────────────────────────────────
// Input:  Current H2 structure + deficiency notes + keyword
// Output: Revised outline with improved H2s and brief section goals

interface OutlineSection {
  h2: string;
  goal: string;
  mustInclude?: string[];
}

interface AnalysisResult {
  outline: OutlineSection[];
  quickAnswerGoal: string;
  metaGoals: { title: string; description: string };
  faqTopics: string[];
}

async function phaseAnalyze(
  currentH2s: string[],
  deficiencies: string,
  primaryKeyword: string,
  title: string,
  wordCount: number,
): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const prompt = `You are an SEO/GEO content strategist for JHR Photography (Nashville event/corporate photography).

Analyze these deficiencies and produce a revised article outline.

## Current Article
- Title: "${title}"
- Primary Keyword: "${primaryKeyword}"
- Word Count: ${wordCount}
- Current H2s: ${currentH2s.map((h, i) => `\n  ${i + 1}. ${h}`).join('')}

## Deficiencies to Fix
${deficiencies || 'General quality improvement needed — improve GEO score.'}

## Rules
- H2s should use high-intent keywords and question formats where natural
- Each section needs a clear goal (what information it delivers)
- Must include entities: Nashville venues, industry orgs (PCMA, MPI, IAEE), JHR Photography
- At least 4 H2 sections, at least 2 question-based
- Quick answer must be 50-75 words, self-contained, quotable
- Meta title: 50-60 chars with primary keyword
- FAQ topics should address "People Also Ask" style questions

Return ONLY valid JSON:
{
  "outline": [{ "h2": "...", "goal": "...", "mustInclude": ["entity1", "entity2"] }],
  "quickAnswerGoal": "Brief description of what the quick answer should cover",
  "metaGoals": { "title": "Suggested meta title (50-60 chars)", "description": "Suggested meta description focus (140-160 chars)" },
  "faqTopics": ["question 1", "question 2", ...]
}`;

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '').trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

// ─── Phase 2: REWRITE BODY ───────────────────────────────────────────────────
// Input:  Original body + revised outline + voice guide
// Output: Rewritten HTML body (streamed)

async function phaseRewriteBody(
  originalBody: string,
  outline: OutlineSection[],
  primaryKeyword: string,
  title: string,
  onChunk?: (count: number) => void,
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const voiceGuide = loadVoiceGuide();

  // Trim body if extremely long — send first 6000 chars + last 2000 chars
  let bodyContext = originalBody;
  if (originalBody.length > 10000) {
    bodyContext = originalBody.slice(0, 6000) + '\n\n[...middle sections...]\n\n' + originalBody.slice(-2000);
  }

  const outlineText = outline.map((s, i) =>
    `${i + 1}. <h2>${s.h2}</h2> — Goal: ${s.goal}${s.mustInclude?.length ? ` | Must include: ${s.mustInclude.join(', ')}` : ''}`
  ).join('\n');

  const prompt = `Rewrite this article body following the revised outline below.

## Article Title: "${title}"
## Primary Keyword: "${primaryKeyword}"

## Revised Outline
${outlineText}

## Current Body (HTML)
${bodyContext}

## Writing Rules
- Output valid HTML only (<h2>, <p>, <ul>, <li>, <a>, <strong>, <em>, <blockquote>)
- NO markdown. NO explanation. ONLY the article body HTML.
- 2-3 sentence paragraphs max
- Vary sentence length. Use contractions. Be conversational.
- Primary keyword in first 100 words and in at least one H2
- Include 4+ external links (target="_blank" rel="noopener noreferrer") to authority sources (industry orgs, .gov, Nashville tourism)
- Include 2+ internal links to JHR service pages (/services/corporate-event-coverage, /services/headshot-activation, /services/executive-imaging, /schedule, etc.)
- Include statistics with numbers and sources
- Include named entities: Nashville, Music City, venue names, org names (PCMA, MPI, IAEE, BizBash)
- Include a quotable definition or branded concept
- Minimum 900 words
- NEVER use these words: crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, leverage, holistic, revolutionize, groundbreaking, transformative
- NEVER use: free consultation, affordable, cheap, budget, premier, elite, discount, photo booth, freelancer, hourly rate`;

  let fullText = '';
  let chunkCount = 0;

  const stream = client.messages.stream({
    model: QUALITY_MODEL,
    max_tokens: 6144,
    system: voiceGuide,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      chunkCount++;
      if (onChunk) onChunk(chunkCount);
    }
  }

  return fullText;
}

// ─── Phase 3: GEO POLISH ────────────────────────────────────────────────────
// Input:  Improved body + analysis goals
// Output: quickAnswer, metaTitle, metaDescription, excerpt, FAQ items

interface PolishResult {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  faqBlock: FAQItem[];
}

async function phasePolish(
  improvedBody: string,
  analysisResult: AnalysisResult,
  primaryKeyword: string,
  currentTitle: string,
): Promise<PolishResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  // Send just enough body context for the model to generate metadata
  const bodyPreview = improvedBody.slice(0, 3000);

  const prompt = `Generate SEO/GEO metadata for this JHR Photography article.

## Article Preview (first ~3000 chars)
${bodyPreview}

## Primary Keyword: "${primaryKeyword}"
## Current Title: "${currentTitle}"
## Quick Answer Goal: ${analysisResult.quickAnswerGoal}
## Meta Goals: title=${analysisResult.metaGoals.title}, description=${analysisResult.metaGoals.description}
## FAQ Topics to Cover: ${analysisResult.faqTopics.join('; ')}

## Rules
- title: Engaging, includes primary keyword, max 80 chars
- metaTitle: 50-60 chars, includes primary keyword
- metaDescription: 140-160 chars, includes primary keyword, compelling
- excerpt: 1-2 sentences summarizing the article for blog cards
- quickAnswer: 50-75 words, self-contained, quotable, includes a number or named entity. This appears as a featured snippet answer.
- faqBlock: At least 5 FAQ items. Each answer 30-50 words, substantive. Questions should be varied (don't all start the same way).

Return ONLY valid JSON:
{
  "title": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "quickAnswer": "...",
  "faqBlock": [{ "question": "...", "answer": "..." }]
}`;

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '').trim();
  return JSON.parse(cleaned) as PolishResult;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractH2s(html: string): string[] {
  const h2s: string[] = [];
  const htmlPattern = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = htmlPattern.exec(html)) !== null) {
    h2s.push(match[1].replace(/<[^>]+>/g, '').trim());
  }
  const mdPattern = /^##\s+(.+)$/gm;
  while ((match = mdPattern.exec(html)) !== null) {
    h2s.push(match[1].trim());
  }
  return h2s;
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

export type ProgressCallback = (phase: string, message: string) => void;

export async function improveArticleStreaming(
  article: ArticlePayload,
  geoNotes: string,
  onChunk?: (chunkCount: number) => void,
  onProgress?: ProgressCallback,
): Promise<{ data?: ArticlePayload; changes: string[]; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { changes: [], error: 'ANTHROPIC_API_KEY not set' };
  }

  const log = (phase: string, msg: string) => {
    if (onProgress) onProgress(phase, msg);
  };

  try {
    // ── Phase 1: Analyze & Outline ──────────────────────────────────────
    log('analyze', 'Analyzing article structure and deficiencies...');

    const currentH2s = extractH2s(article.body);
    const analysis = await phaseAnalyze(
      currentH2s,
      geoNotes,
      article.primaryKeyword,
      article.title,
      article.wordCount,
    );

    log('analyze', `Outline ready: ${analysis.outline.length} sections planned`);

    // ── Phase 2: Rewrite Body (streaming) ───────────────────────────────
    log('rewrite', 'Rewriting article body section-by-section...');

    const improvedBody = await phaseRewriteBody(
      article.body,
      analysis.outline,
      article.primaryKeyword,
      article.title,
      onChunk,
    );

    if (!improvedBody || improvedBody.length < 500) {
      return { changes: [], error: 'Body rewrite produced insufficient content' };
    }

    log('rewrite', `Body complete: ~${improvedBody.split(/\s+/).length} words`);

    // ── Phase 3: GEO Polish ─────────────────────────────────────────────
    log('polish', 'Generating optimized metadata and FAQ...');

    const polished = await phasePolish(
      improvedBody,
      analysis,
      article.primaryKeyword,
      article.title,
    );

    log('polish', 'Metadata and FAQ ready');

    // ── Merge into final ArticlePayload ─────────────────────────────────
    const finalBody = improvedBody;
    const wordCount = finalBody.split(/\s+/).filter(Boolean).length;

    const merged: ArticlePayload = {
      ...article,
      title: polished.title || article.title,
      metaTitle: polished.metaTitle || article.metaTitle,
      metaDescription: polished.metaDescription || article.metaDescription,
      excerpt: polished.excerpt || article.excerpt,
      quickAnswer: polished.quickAnswer || article.quickAnswer,
      body: finalBody,
      faqBlock: polished.faqBlock?.length >= 5 ? polished.faqBlock : article.faqBlock,
      wordCount,
      readTime: Math.ceil(wordCount / 250),
      externalLinkCount: (finalBody.match(/href="https?:\/\/(?!jhr)/g) || []).length,
      internalLinkCount: (finalBody.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
    };

    // Build change log
    const changes: string[] = [];
    if (article.body !== merged.body) changes.push('Body rewritten');
    if (article.title !== merged.title) changes.push('Title updated');
    if (article.quickAnswer !== merged.quickAnswer) changes.push('Quick answer rewritten');
    if (article.metaTitle !== merged.metaTitle) changes.push('Meta title updated');
    if (article.metaDescription !== merged.metaDescription) changes.push('Meta description updated');
    if ((article.faqBlock?.length || 0) !== (merged.faqBlock?.length || 0)) {
      changes.push(`FAQ: ${article.faqBlock?.length || 0} → ${merged.faqBlock?.length || 0}`);
    }
    changes.push(`Words: ${article.wordCount} → ${merged.wordCount}`);

    return { data: merged, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}
