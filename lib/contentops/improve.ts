// ContentOps Engine — Article Improvement via Claude API
// Simple: takes article + deficiencies, calls Claude, returns improved fields.
// Uses Haiku for speed — Amplify hard-caps Lambda at 30s.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload } from './types';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

// Load the improvement skill from file — cached after first read
let _skillCache: string | null = null;
function loadImproveSkill(): string {
  if (_skillCache) return _skillCache;
  try {
    _skillCache = readFileSync(join(process.cwd(), 'lib/contentops/improve-skill.md'), 'utf-8');
  } catch {
    try {
      _skillCache = readFileSync(join(__dirname, 'improve-skill.md'), 'utf-8');
    } catch {
      _skillCache = 'You are improving a JHR Photography article. Fix the listed deficiencies. Return valid JSON with the improved fields only.';
    }
  }
  return _skillCache;
}

/** Only the fields Claude needs to see and can improve */
interface ImprovableFields {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  body: string;
  faqBlock: Array<{ question: string; answer: string }>;
}

function parseImprovedFields(content: string): ImprovableFields {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }
  return JSON.parse(cleaned) as ImprovableFields;
}

/**
 * Streaming improvement — sends only improvable fields to Claude, merges back.
 * Uses Haiku for speed (Amplify 30s Lambda limit).
 */
export async function improveArticleStreaming(
  article: ArticlePayload,
  geoNotes: string,
  onChunk?: (chunkCount: number) => void,
): Promise<{ data?: ArticlePayload; changes: string[]; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { changes: [], error: 'ANTHROPIC_API_KEY not set' };
  }

  // Only send the fields Claude can actually improve — not link counts, schema, etc.
  const improvable: ImprovableFields = {
    title: article.title,
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    excerpt: article.excerpt,
    quickAnswer: article.quickAnswer,
    body: article.body,
    faqBlock: article.faqBlock || [],
  };

  const userPrompt = `Improve this article. Fix the deficiencies listed below.

## Deficiencies
${geoNotes || 'General quality improvement needed.'}

## Article (JSON — only the improvable fields)
${JSON.stringify(improvable)}

Return ONLY the improved fields as valid JSON (same keys: title, metaTitle, metaDescription, excerpt, quickAnswer, body, faqBlock). No markdown fences, no explanation.`;

  try {
    const client = new Anthropic({ apiKey });
    let fullText = '';
    let chunkCount = 0;

    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system: loadImproveSkill(),
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
      return { changes: [], error: 'Claude returned no text' };
    }

    const improved = parseImprovedFields(fullText);

    // Merge improved fields back into full article
    const merged: ArticlePayload = {
      ...article,
      title: improved.title || article.title,
      metaTitle: improved.metaTitle || article.metaTitle,
      metaDescription: improved.metaDescription || article.metaDescription,
      excerpt: improved.excerpt || article.excerpt,
      quickAnswer: improved.quickAnswer || article.quickAnswer,
      body: improved.body || article.body,
      faqBlock: improved.faqBlock?.length > 0 ? improved.faqBlock : article.faqBlock,
      // Recalculate derived fields
      wordCount: (improved.body || article.body).split(/\s+/).length,
      readTime: Math.ceil((improved.body || article.body).split(/\s+/).length / 250),
      externalLinkCount: ((improved.body || article.body).match(/href="https?:\/\/(?!jhr)/g) || []).length,
      internalLinkCount: ((improved.body || article.body).match(/href="\/|href="https?:\/\/jhr/g) || []).length,
    };

    // Simple diff
    const changes: string[] = [];
    if (article.body !== merged.body) changes.push('Body content modified');
    if (article.title !== merged.title) changes.push('Title updated');
    if (article.quickAnswer !== merged.quickAnswer) changes.push('Quick answer updated');
    if (article.metaDescription !== merged.metaDescription) changes.push('Meta description updated');
    if ((article.faqBlock?.length || 0) !== (merged.faqBlock?.length || 0)) changes.push(`FAQ: ${article.faqBlock?.length || 0} → ${merged.faqBlock?.length || 0}`);
    if (article.wordCount !== merged.wordCount) changes.push(`Words: ${article.wordCount} → ${merged.wordCount}`);

    return { data: merged, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}
