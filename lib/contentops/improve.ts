// ContentOps Engine — Article Improvement via Claude API
// Reads GEO score notes and validation failures, then rewrites targeted sections.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload } from './types';

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
 * Fast improvement — caller provides pre-computed deficiencies.
 * No validation, no lessons fetch — just Claude call + parse.
 * Designed to fit within Amplify's 30s Lambda timeout.
 */
export async function improveArticleFast(
  article: ArticlePayload,
  hardFails: string[],
  softFails: string[],
  geoNotes: string,
): Promise<{ data?: ArticlePayload; changes: string[]; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { changes: [], error: 'ANTHROPIC_API_KEY not set' };
  }

  const userPrompt = buildImprovementPrompt(article, hardFails, softFails, geoNotes, '');

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: getImproveSystemPrompt(),
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { changes: [], error: 'Claude returned no text content' };
    }

    const improved = parseImprovedArticle(textBlock.text);
    improved.slug = article.slug;
    improved.status = article.status;

    const changes = diffChanges(article, improved);
    return { data: improved, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}

