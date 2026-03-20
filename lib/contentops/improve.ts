// ContentOps Engine — 3-Phase Article Improvement
//
// Each phase is a SEPARATE Lambda invocation (Amplify 30s hard limit).
// Intermediate state stored in DynamoDB between phases.
//
// Phase 1 — ANALYZE  (~5s, Haiku)  : Structure analysis → revised outline
// Phase 2 — REWRITE  (~20s, Sonnet): Body rewrite using outline (streamed)
// Phase 3 — POLISH   (~5s, Haiku)  : Metadata, FAQ, save final article

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload, FAQItem } from './types';

const FAST_MODEL = 'claude-haiku-4-5-20251001';
const QUALITY_MODEL = 'claude-sonnet-4-20250514';

// ─── Voice Guide (cached) ────────────────────────────────────────────────────

let _skillCache: string | null = null;
function loadVoiceGuide(): string {
  if (_skillCache) return _skillCache;
  try {
    _skillCache = readFileSync(join(process.cwd(), 'lib/contentops/improve-skill.md'), 'utf-8');
  } catch {
    try {
      _skillCache = readFileSync(join(__dirname, 'improve-skill.md'), 'utf-8');
    } catch {
      _skillCache = 'You are rewriting a JHR Photography article. Warm, direct, confident voice. No AI slop.';
    }
  }
  return _skillCache;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }
  return cleaned;
}

export function extractH2s(html: string): string[] {
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

// ─── Phase 1: ANALYZE ────────────────────────────────────────────────────────
// ~5s with Haiku. Returns revised outline.

export interface AnalysisResult {
  sections: Array<{ h2: string; goal: string; mustInclude?: string[] }>;
  quickAnswerGoal: string;
  metaGoals: { title: string; description: string };
  faqTopics: string[];
}

export async function phaseAnalyze(
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
  "sections": [{ "h2": "...", "goal": "...", "mustInclude": ["entity1"] }],
  "quickAnswerGoal": "...",
  "metaGoals": { "title": "...", "description": "..." },
  "faqTopics": ["question 1", "question 2", ...]
}`;

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  return JSON.parse(cleanJson(text)) as AnalysisResult;
}

// ─── Phase 2: REWRITE BODY ───────────────────────────────────────────────────
// ~15-20s with Sonnet streaming. Returns improved HTML body.

export async function phaseRewrite(
  originalBody: string,
  outline: AnalysisResult['sections'],
  primaryKeyword: string,
  title: string,
  onChunk?: (count: number) => void,
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  // Trim if very long — keep first and last sections for context
  let bodyContext = originalBody;
  if (originalBody.length > 8000) {
    bodyContext = originalBody.slice(0, 5000) + '\n\n[...middle content...]\n\n' + originalBody.slice(-2000);
  }

  const outlineText = outline.map((s, i) =>
    `${i + 1}. <h2>${s.h2}</h2> — Goal: ${s.goal}${s.mustInclude?.length ? ` | Include: ${s.mustInclude.join(', ')}` : ''}`
  ).join('\n');

  const prompt = `Rewrite this article body following the revised outline.

## Title: "${title}"
## Primary Keyword: "${primaryKeyword}"

## Revised Outline
${outlineText}

## Current Body
${bodyContext}

## Rules
- Valid HTML only (<h2>, <p>, <ul>, <li>, <a>, <strong>, <em>, <blockquote>). NO markdown.
- 2-3 sentence paragraphs. Vary sentence length. Use contractions.
- Primary keyword in first 100 words and at least one H2
- 4+ external links (target="_blank" rel="noopener noreferrer") — industry orgs, .gov, Nashville tourism
- 2+ internal links — /services/corporate-event-coverage, /services/headshot-activation, /services/executive-imaging, /schedule
- Include statistics with numbers. Include named entities (Nashville, Music City, venues, PCMA, MPI).
- Include a quotable definition or branded concept.
- Minimum 900 words.
- NEVER use: crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, leverage, holistic, revolutionize, groundbreaking, transformative
- NEVER use: free consultation, affordable, cheap, budget, premier, elite, discount, photo booth, freelancer, hourly rate

Output ONLY the HTML body. No explanation.`;

  let fullText = '';
  let chunkCount = 0;

  const stream = client.messages.stream({
    model: QUALITY_MODEL,
    max_tokens: 6144,
    system: loadVoiceGuide(),
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

// ─── Phase 3: POLISH ─────────────────────────────────────────────────────────
// ~5s with Haiku. Generates metadata + FAQ, returns merged ArticlePayload.

export interface PolishResult {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  faqBlock: FAQItem[];
}

export async function phasePolish(
  improvedBody: string,
  quickAnswerGoal: string,
  metaGoals: { title: string; description: string },
  faqTopics: string[],
  primaryKeyword: string,
  currentTitle: string,
): Promise<PolishResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const bodyPreview = improvedBody.slice(0, 3000);

  const prompt = `Generate SEO/GEO metadata for this JHR Photography article.

## Article Preview
${bodyPreview}

## Primary Keyword: "${primaryKeyword}"
## Current Title: "${currentTitle}"
## Quick Answer Goal: ${quickAnswerGoal}
## Meta Goals: title="${metaGoals.title}", description="${metaGoals.description}"
## FAQ Topics: ${faqTopics.join('; ')}

## Rules
- title: Engaging, includes primary keyword, max 80 chars
- metaTitle: 50-60 chars, includes primary keyword
- metaDescription: 140-160 chars, includes primary keyword, compelling
- excerpt: 1-2 sentences for blog cards
- quickAnswer: 50-75 words, self-contained, quotable, includes a number or named entity
- faqBlock: 5+ items. Each answer 30-50 words. Varied question starters.

Return ONLY valid JSON:
{
  "title": "...", "metaTitle": "...", "metaDescription": "...",
  "excerpt": "...", "quickAnswer": "...",
  "faqBlock": [{ "question": "...", "answer": "..." }]
}`;

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  return JSON.parse(cleanJson(text)) as PolishResult;
}

// ─── Merge helper ────────────────────────────────────────────────────────────

export function mergeImprovedArticle(
  original: ArticlePayload,
  improvedBody: string,
  polished: PolishResult,
): { data: ArticlePayload; changes: string[] } {
  const body = improvedBody;
  const wordCount = body.split(/\s+/).filter(Boolean).length;

  const merged: ArticlePayload = {
    ...original,
    title: polished.title || original.title,
    metaTitle: polished.metaTitle || original.metaTitle,
    metaDescription: polished.metaDescription || original.metaDescription,
    excerpt: polished.excerpt || original.excerpt,
    quickAnswer: polished.quickAnswer || original.quickAnswer,
    body,
    faqBlock: polished.faqBlock?.length >= 5 ? polished.faqBlock : original.faqBlock,
    wordCount,
    readTime: Math.ceil(wordCount / 250),
    externalLinkCount: (body.match(/href="https?:\/\/(?!jhr)/g) || []).length,
    internalLinkCount: (body.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
  };

  const changes: string[] = [];
  if (original.body !== merged.body) changes.push('Body rewritten');
  if (original.title !== merged.title) changes.push('Title updated');
  if (original.quickAnswer !== merged.quickAnswer) changes.push('Quick answer rewritten');
  if (original.metaTitle !== merged.metaTitle) changes.push('Meta title updated');
  if (original.metaDescription !== merged.metaDescription) changes.push('Meta description updated');
  if ((original.faqBlock?.length || 0) !== (merged.faqBlock?.length || 0)) {
    changes.push(`FAQ: ${original.faqBlock?.length || 0} → ${merged.faqBlock?.length || 0}`);
  }
  changes.push(`Words: ${original.wordCount} → ${merged.wordCount}`);

  return { data: merged, changes };
}
