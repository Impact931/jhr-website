// ContentOps Engine — Post-Generation GEO Scoring via Claude API

import Anthropic from '@anthropic-ai/sdk';
import type { ArticlePayload } from './types';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

interface GEOScoringResult {
  totalScore: number;
  breakdown: {
    quickAnswerBlock: number;
    statisticsDensity: number;
    quotableDefinition: number;
    headingStructure: number;
    namedEntityDensity: number;
    externalCitations: number;
    faqQuality: number;
  };
  notes: string;
}

const SCORING_PROMPT = `You are a GEO (Generative Engine Optimization) expert evaluating an article for AI-engine quotability.

Score the article on each criterion below. Return ONLY valid JSON (no markdown fences).

## Scoring Rubric (total: 100 points)

1. **Quick Answer Block** (20 pts):
   - 0 = absent
   - 10 = present but over 90 words
   - 20 = concise 50-75 word opening that directly answers the core question

2. **Statistics Density** (20 pts):
   - 0 = no statistics
   - 10 = 1-2 statistics
   - 15 = 3 statistics with sources
   - 20 = 4+ statistics with attributable sources

3. **Quotable Definition** (15 pts):
   - 0 = absent
   - 10 = generic definition
   - 15 = branded JHR-specific definition or unique framework

4. **Heading Structure** (15 pts):
   - 0 = flat/no headings
   - 8 = some H2 headings
   - 15 = question-pattern H2s with logical hierarchy

5. **Named Entity Density** (10 pts):
   - 0 = generic, no named entities
   - 5 = mentions Nashville
   - 10 = mentions Nashville + specific venues + JHR Photography + industry trademarks/orgs

6. **External Citations** (10 pts):
   - 0 = no external links
   - 5 = 1-3 links to Tier-2 sources
   - 10 = 4+ links including Tier-1 authoritative sources

7. **FAQ Quality** (10 pts):
   - 0 = absent
   - 5 = 3-4 generic questions
   - 10 = 5+ specific, search-intent-matching questions

## Response Format

{
  "totalScore": <number 0-100>,
  "breakdown": {
    "quickAnswerBlock": <0-20>,
    "statisticsDensity": <0-20>,
    "quotableDefinition": <0-15>,
    "headingStructure": <0-15>,
    "namedEntityDensity": <0-10>,
    "externalCitations": <0-10>,
    "faqQuality": <0-10>
  },
  "notes": "<Brief explanation of deficiencies and improvement suggestions>"
}`;

function buildArticleSummary(article: ArticlePayload): string {
  const faqSummary = article.faqBlock
    ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join('\n\n') || '(no FAQ block)';

  return `## Article to Score

**Title:** ${article.title}
**Primary Keyword:** ${article.primaryKeyword}
**Word Count:** ${article.wordCount}
**External Links:** ${article.externalLinkCount}
**Internal Links:** ${article.internalLinkCount}

### Quick Answer Block
${article.quickAnswer || '(absent)'}

### Article Body
${article.body}

### FAQ Block
${faqSummary}`;
}

/**
 * Score an article for GEO quotability using Claude API.
 * Returns score, breakdown, and notes. Returns null on failure.
 */
export async function scoreArticleGEO(
  article: ArticlePayload
): Promise<GEOScoringResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[ContentOps] ANTHROPIC_API_KEY not set, skipping GEO scoring');
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: SCORING_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildArticleSummary(article),
        },
      ],
      temperature: 0.1,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      console.error('[ContentOps] GEO scoring returned no text content');
      return null;
    }

    let cleaned = textBlock.text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
    }

    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (typeof parsed.totalScore !== 'number' || !parsed.breakdown || !parsed.notes) {
      console.error('[ContentOps] GEO scoring response missing required fields');
      return null;
    }

    return {
      totalScore: parsed.totalScore,
      breakdown: parsed.breakdown,
      notes: parsed.notes,
    };
  } catch (err) {
    console.error(
      '[ContentOps] GEO scoring failed:',
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
