// ContentOps Engine — Article Improvement via Claude API
// Reads GEO score notes and validation failures, then rewrites targeted sections.

import Anthropic from '@anthropic-ai/sdk';
import type { ArticlePayload } from './types';
import { validateArticle } from './validate';
import { scoreArticleGEO } from './geo-score';
import { getGenerationLessons, formatLessonsForPrompt, addLesson } from './lessons-store';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

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

const IMPROVE_SYSTEM_PROMPT = `You are a content improvement specialist for JHR Photography, a Nashville-based event and corporate photography company.

Your job is to take an existing article and fix specific deficiencies while preserving the original voice, structure, and all content that already works.

## Brand Voice Rules (MUST FOLLOW)
- Client is the Hero, JHR is the Guide, Villain is Uncertainty (StoryBrand)
- Warm, personable, direct, confident, solution-focused
- NEVER use these AI slop terms: crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, state-of-the-art, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, game-changer, leverage, holistic, spearhead, revolutionize, groundbreaking, transformative
- NEVER use these brand-prohibited terms: free consultation, affordable, cheap, budget, premier, elite, championship
- Write like a trusted partner, not a vendor. Use contractions naturally.
- Be generous with knowledge — teach, don't tease.

## Link Policy
### Internal Links (use these exact paths)
- /services/corporate-event-coverage — corporate event photography Nashville
- /services/headshot-activation — headshot activation
- /services/executive-imaging — executive imaging
- /services/trade-show-media — trade show photography
- /services/convention-media — convention media coverage
- /services/social-networking-media — event social media content
- /solutions/dmcs-agencies — DMC and agency event photography solutions
- /solutions/exhibitors-sponsors — exhibitor and sponsor media solutions
- /solutions/associations — association and conference photography
- /solutions/venues — venue photography partner
- /venues/music-city-center — Music City Center photography
- /venues/gaylord-opryland — Gaylord Opryland event photography
- /schedule — schedule a strategy call

### External Links
- NEVER link to Nashville event/corporate photography competitors
- Include preferred partners when Nashville context: nashvilleadventures.com, visitmusiccity.com, nashvillechamber.com
- Other externals: industry associations, trade publications, government sites, research institutions

## Improvement Rules
1. Fix ONLY what the deficiency notes call out. Do not rewrite sections that are working.
2. Preserve the article's existing structure, tone, and personality.
3. When adding statistics, use real data with source attributions.
4. When improving the quick answer block, keep it 50-75 words, self-contained, quotable.
5. When adding FAQ items, make them specific to the topic and Nashville context.
6. When fixing headings, use question-based H2s where natural.
7. The body MUST be valid HTML (not markdown). Use <h2>, <p>, <ul>, <a>, etc.
8. All external links: target="_blank" rel="noopener noreferrer"
9. Maintain accurate wordCount, externalLinkCount, internalLinkCount after changes.
10. If a keyword must appear in title/H2/first-100-words/meta-description, add it naturally — don't force it.`;

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
${JSON.stringify(article, null, 2)}
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
      max_tokens: 8192,
      system: IMPROVE_SYSTEM_PROMPT,
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
