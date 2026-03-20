// ContentOps Engine — Article Improvement via Claude API
// Reads GEO score notes and validation failures, then rewrites targeted sections.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload } from './types';
import { validateArticle } from './validate';
import { getGenerationLessons, formatLessonsForPrompt, addLesson } from './lessons-store';

// Haiku is ~3x faster than Sonnet — required to fit within Amplify's 30s Lambda timeout
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

// Load the improvement skill from file — cached after first read
let _skillCache: string | null = null;
function loadImproveSkill(): string {
  if (_skillCache) return _skillCache;
  try {
    _skillCache = readFileSync(join(process.cwd(), 'lib/contentops/improve-skill.md'), 'utf-8');
  } catch {
    // Fallback for standalone builds where cwd differs
    try {
      _skillCache = readFileSync(join(__dirname, 'improve-skill.md'), 'utf-8');
    } catch {
      _skillCache = 'You are improving a JHR Photography article. Fix the listed deficiencies. Return valid JSON matching the input structure.';
    }
  }
  return _skillCache;
}

export interface ImproveResult {
  slug: string;
  status: 'improved' | 'already-passing' | 'failed' | 'skipped';
  beforeScore: number;
  afterScore: number | null;
  beforeHardFails: string[];
  afterHardFails: string[];
  changes: string[];
  improvedData?: ArticlePayload;
  error?: string;
}

// System prompt loaded from improve-skill.md at runtime — keeps prompt lean and skill editable
function getImproveSystemPrompt(): string {
  return loadImproveSkill();
}

function buildImprovementPrompt(
  article: ArticlePayload,
  hardFails: string[],
  softFails: string[],
  geoNotes: string,
  lessons: string,
): string {
  const deficiencies: string[] = [];

  if (hardFails.length > 0) {
    deficiencies.push(`## Hard Failures (MUST FIX — these block publishing)\n${hardFails.map((f) => `- ${f}`).join('\n')}`);
  }

  if (softFails.length > 0) {
    deficiencies.push(`## Soft Failures (SHOULD FIX)\n${softFails.map((f) => `- ${f}`).join('\n')}`);
  }

  if (geoNotes) {
    deficiencies.push(`## GEO Score Improvement Notes\n${geoNotes}`);
  }

  return `Here is the current article that needs improvement:

## Current Article (JSON)
\`\`\`json
${JSON.stringify(article)}
\`\`\`

## Deficiencies to Fix

${deficiencies.join('\n\n')}

${lessons ? `\n${lessons}\n` : ''}

## Instructions

Fix all hard failures and as many soft failures / GEO improvements as possible.
Return the COMPLETE improved article as a single valid JSON object (no markdown fences, no explanation).
The JSON must match the exact same structure as the input — all fields present.
Update wordCount, readTime, externalLinkCount, and internalLinkCount to reflect your changes.

CRITICAL: Only modify what needs fixing. Preserve everything that already works.`;
}

function parseImprovedArticle(content: string): ArticlePayload {
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
      throw new Error(`Improved article missing required field: ${field}`);
    }
  }

  return parsed as ArticlePayload;
}

function diffChanges(before: ArticlePayload, after: ArticlePayload): string[] {
  const changes: string[] = [];

  if (before.title !== after.title) changes.push(`Title changed`);
  if (before.metaTitle !== after.metaTitle) changes.push(`Meta title updated`);
  if (before.metaDescription !== after.metaDescription) changes.push(`Meta description updated`);
  if (before.quickAnswer !== after.quickAnswer) changes.push(`Quick answer block rewritten`);
  if (before.excerpt !== after.excerpt) changes.push(`Excerpt updated`);
  if (before.body !== after.body) changes.push(`Body content modified`);
  if (before.wordCount !== after.wordCount) changes.push(`Word count: ${before.wordCount} → ${after.wordCount}`);
  if (before.externalLinkCount !== after.externalLinkCount) changes.push(`External links: ${before.externalLinkCount} → ${after.externalLinkCount}`);
  if (before.internalLinkCount !== after.internalLinkCount) changes.push(`Internal links: ${before.internalLinkCount} → ${after.internalLinkCount}`);
  if ((before.faqBlock?.length || 0) !== (after.faqBlock?.length || 0)) changes.push(`FAQ items: ${before.faqBlock?.length || 0} → ${after.faqBlock?.length || 0}`);

  return changes;
}

/**
 * Improve a single article by fixing its deficiencies.
 * Returns the improved ArticlePayload and a summary of changes.
 */
export async function improveArticle(
  article: ArticlePayload,
  geoNotes?: string,
): Promise<{ data?: ArticlePayload; changes: string[]; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { changes: [], error: 'ANTHROPIC_API_KEY not set' };
  }

  // Run validation to get current hard/soft fails
  const validation = await validateArticle(article);

  // If already passing with good GEO score and no notes, skip
  if (validation.passed && validation.geoScore.totalScore >= 70 && !geoNotes) {
    return { data: article, changes: ['No improvements needed — article passes all checks'] };
  }

  // Load lessons from the learning system
  let lessonsBlock = '';
  try {
    const lessons = await getGenerationLessons();
    lessonsBlock = formatLessonsForPrompt(lessons);
  } catch {
    // Lessons unavailable — continue without them
  }

  const userPrompt = buildImprovementPrompt(
    article,
    validation.hardFails,
    validation.softFails,
    geoNotes || '',
    lessonsBlock,
  );

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 6144,
      system: getImproveSystemPrompt(),
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3, // Lower temperature for targeted improvements
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { changes: [], error: 'Claude returned no text content' };
    }

    const improved = parseImprovedArticle(textBlock.text);

    // Preserve slug and status from original
    improved.slug = article.slug;
    improved.status = article.status;

    const changes = diffChanges(article, improved);

    return { data: improved, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}

/**
 * Streaming version of improveArticle — uses client.messages.stream()
 * to prevent Amplify gateway timeouts (~25s). Calls onChunk periodically
 * so the SSE route can send keepalive events.
 */
export async function improveArticleStreaming(
  article: ArticlePayload,
  geoNotes?: string,
  onChunk?: (chunkCount: number) => void,
): Promise<{ data?: ArticlePayload; changes: string[]; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { changes: [], error: 'ANTHROPIC_API_KEY not set' };
  }

  const validation = await validateArticle(article);

  if (validation.passed && validation.geoScore.totalScore >= 70 && !geoNotes) {
    return { data: article, changes: ['No improvements needed — article passes all checks'] };
  }

  let lessonsBlock = '';
  try {
    const lessons = await getGenerationLessons();
    lessonsBlock = formatLessonsForPrompt(lessons);
  } catch {
    // Lessons unavailable — continue without them
  }

  const userPrompt = buildImprovementPrompt(
    article,
    validation.hardFails,
    validation.softFails,
    geoNotes || '',
    lessonsBlock,
  );

  try {
    const client = new Anthropic({ apiKey });
    let fullText = '';
    let chunkCount = 0;

    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 6144,
      system: getImproveSystemPrompt(),
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullText += event.delta.text;
        chunkCount++;
        if (onChunk) onChunk(chunkCount);
      }
    }

    if (!fullText) {
      return { changes: [], error: 'Claude streaming returned no text' };
    }

    const improved = parseImprovedArticle(fullText);
    improved.slug = article.slug;
    improved.status = article.status;

    const changes = diffChanges(article, improved);
    return { data: improved, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}

/**
 * Improve an article and validate the result.
 * If the improved version is worse, return the original.
 * Optionally stores a lesson if improvement revealed a pattern.
 */
export async function improveAndValidate(
  article: ArticlePayload,
  geoNotes?: string,
): Promise<ImproveResult> {
  // Score before
  const beforeValidation = await validateArticle(article);
  const beforeScore = beforeValidation.geoScore.totalScore;

  // Already passing with no notes? Skip.
  if (beforeValidation.passed && beforeScore >= 80 && !geoNotes) {
    return {
      slug: article.slug,
      status: 'already-passing',
      beforeScore,
      afterScore: beforeScore,
      beforeHardFails: beforeValidation.hardFails,
      afterHardFails: beforeValidation.hardFails,
      changes: [],
      improvedData: article,
    };
  }

  const result = await improveArticle(article, geoNotes);

  if (result.error || !result.data) {
    return {
      slug: article.slug,
      status: 'failed',
      beforeScore,
      afterScore: null,
      beforeHardFails: beforeValidation.hardFails,
      afterHardFails: [],
      changes: [],
      error: result.error,
    };
  }

  // Validate the improved version
  const afterValidation = await validateArticle(result.data);
  const afterScore = afterValidation.geoScore.totalScore;

  // If improved version is worse, don't use it
  if (afterScore < beforeScore && afterValidation.hardFails.length >= beforeValidation.hardFails.length) {
    return {
      slug: article.slug,
      status: 'failed',
      beforeScore,
      afterScore,
      beforeHardFails: beforeValidation.hardFails,
      afterHardFails: afterValidation.hardFails,
      changes: result.changes,
      error: `Improved version scored lower (${afterScore} vs ${beforeScore}) — keeping original`,
    };
  }

  // Store a lesson if we fixed hard fails that should be prevented in future generation
  if (beforeValidation.hardFails.length > 0 && afterValidation.hardFails.length < beforeValidation.hardFails.length) {
    const fixedFails = beforeValidation.hardFails.filter((f) => !afterValidation.hardFails.includes(f));
    for (const fail of fixedFails.slice(0, 2)) { // Max 2 lessons per article
      try {
        await addLesson({
          date: new Date().toISOString().split('T')[0],
          title: `Auto-fix applied: ${fail.slice(0, 60)}`,
          trigger: `Article "${article.slug}" had this deficiency during improvement`,
          rule: `Ensure generated articles avoid: ${fail}`,
          severity: 'IMPORTANT',
          appliesTo: 'GENERATE',
          source: 'auto',
        });
      } catch {
        // Lesson storage failure is non-blocking
      }
    }
  }

  return {
    slug: article.slug,
    status: 'improved',
    beforeScore,
    afterScore,
    beforeHardFails: beforeValidation.hardFails,
    afterHardFails: afterValidation.hardFails,
    changes: result.changes,
    improvedData: result.data,
  };
}
