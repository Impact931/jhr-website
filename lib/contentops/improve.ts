// ContentOps Engine — Article Improvement via Claude API
// Simple: takes article + deficiencies, calls Claude, returns improved article.

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ArticlePayload } from './types';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

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
      _skillCache = 'You are improving a JHR Photography article. Fix the listed deficiencies. Return valid JSON matching the input structure.';
    }
  }
  return _skillCache;
}

function parseImprovedArticle(content: string): ArticlePayload {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }
  return JSON.parse(cleaned) as ArticlePayload;
}

/**
 * Streaming improvement — same pattern as generateArticleStreaming.
 * Calls onChunk so the SSE route can send keepalives.
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

  const userPrompt = `Improve this article. Fix the deficiencies listed below.

## Deficiencies
${geoNotes || 'General quality improvement needed.'}

## Article (JSON)
${JSON.stringify(article)}

Return the COMPLETE improved article as valid JSON. Same structure, all fields present. No markdown fences, no explanation.`;

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

    const improved = parseImprovedArticle(fullText);
    improved.slug = article.slug;
    improved.status = article.status;

    // Simple diff
    const changes: string[] = [];
    if (article.body !== improved.body) changes.push('Body content modified');
    if (article.quickAnswer !== improved.quickAnswer) changes.push('Quick answer updated');
    if ((article.faqBlock?.length || 0) !== (improved.faqBlock?.length || 0)) changes.push(`FAQ: ${article.faqBlock?.length || 0} → ${improved.faqBlock?.length || 0}`);
    if (article.wordCount !== improved.wordCount) changes.push(`Words: ${article.wordCount} → ${improved.wordCount}`);

    return { data: improved, changes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { changes: [], error: `Improvement failed: ${message}` };
  }
}
