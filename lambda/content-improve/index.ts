/**
 * Standalone Lambda — Article Improvement Engine
 *
 * Deployed with Function URL (RESPONSE_STREAM mode) to bypass
 * Amplify's 30s Lambda limit. Timeout: 120s.
 *
 * Runs the full 3-phase pipeline in a single invocation:
 *   Phase 1: ANALYZE  (Haiku, ~5s)  — structure + outline
 *   Phase 2: REWRITE  (Sonnet, ~40s) — body rewrite (streamed)
 *   Phase 3: POLISH   (Haiku, ~5s)  — metadata + FAQ
 *   Save to DynamoDB
 *
 * Input (POST JSON): { slug: string, apiKey: string }
 * Output: SSE stream with progress events
 */

import Anthropic from '@anthropic-ai/sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// ─── Config ──────────────────────────────────────────────────────────────────

const FAST_MODEL = 'claude-haiku-4-5-20251001';
const QUALITY_MODEL = 'claude-sonnet-4-20250514';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
  unmarshallOptions: { wrapNumbers: false },
});

// ─── Voice Guide (inlined — no filesystem in Lambda zip) ─────────────────────

const VOICE_GUIDE = `You are rewriting the body of a JHR Photography article. JHR is Nashville's premier event and corporate photography company — 15+ years, 200+ events/year, 15+ venue partnerships.

## Voice
StoryBrand framework: Client = Hero. JHR = Guide. Villain = Uncertainty.
Warm, direct, confident, solution-focused, relationship-first. Write like a capable teammate, not a content marketer.
Use contractions. Short paragraphs (2-3 sentences). Vary sentence length. Be generous with knowledge.

## Proprietary Systems (weave naturally)
- Execution Confidence — certainty your event media is handled
- Final Frame Guarantee™ — every image meets standard or doesn't leave our system
- Zero Friction Onboarding — one call, one brief, confirmed
- CMOC (Certified Media Operator Corps) — credentialed operators, not freelancers

## Trademarked Services (exact names)
Headshot Activation™, Executive Imaging™, Corporate Event Coverage™, Event Highlight System™, Trade-Show Media Services™, Social Recap System™

## Substitute Language
freelancer→operator | hourly rate→engagement pricing | photo booth→Headshot Activation | cost→investment | discount→strategic rate | coverage→intentional media

## Quality Check
1. Could any vendor have written this? → add JHR/Nashville specifics
2. Does it sound like AI? → vary sentences, add personality
3. Would Jayson say this? → make it conversational
4. Is the client the hero? → reframe if JHR is center

## Output: Valid HTML only. No markdown. No explanation. Just the article body.`;

// ─── Types ───────────────────────────────────────────────────────────────────

interface FAQItem { question: string; answer: string }

interface ArticleData {
  title: string;
  slug: string;
  body: string;
  quickAnswer: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  tags: string[];
  faqBlock: FAQItem[];
  wordCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoMetadata: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AnalysisResult {
  sections: Array<{ h2: string; goal: string; mustInclude?: string[] }>;
  quickAnswerGoal: string;
  metaGoals: { title: string; description: string };
  faqTopics: string[];
}

interface PolishResult {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  quickAnswer: string;
  faqBlock: FAQItem[];
}

// ─── DynamoDB Helpers ────────────────────────────────────────────────────────

async function loadArticle(slug: string): Promise<ArticleData | null> {
  // Try draft first, then published
  for (const sk of ['draft', 'published', 'post']) {
    const result = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `BLOG#${slug}`, sk },
    }));
    if (result.Item && result.Item.body) {
      return result.Item as ArticleData;
    }
  }
  return null;
}

async function saveArticle(slug: string, data: Record<string, unknown>): Promise<void> {
  await ddb.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      pk: `BLOG#${slug}`,
      sk: 'draft',
      ...data,
      updatedAt: new Date().toISOString(),
    },
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractH2s(html: string): string[] {
  const h2s: string[] = [];
  const pattern = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    h2s.push(match[1].replace(/<[^>]+>/g, '').trim());
  }
  const mdPattern = /^##\s+(.+)$/gm;
  while ((match = mdPattern.exec(html)) !== null) {
    h2s.push(match[1].trim());
  }
  return h2s;
}

function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
  }
  return cleaned;
}

// ─── Phase 1: ANALYZE ────────────────────────────────────────────────────────

async function phaseAnalyze(
  h2s: string[], deficiencies: string, keyword: string, title: string, wordCount: number,
): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: `You are an SEO/GEO content strategist for JHR Photography (Nashville event/corporate photography).

Analyze these deficiencies and produce a revised article outline.

## Current Article
- Title: "${title}"
- Primary Keyword: "${keyword}"
- Word Count: ${wordCount}
- Current H2s: ${h2s.map((h, i) => `\n  ${i + 1}. ${h}`).join('')}

## Deficiencies to Fix
${deficiencies || 'General quality improvement needed — improve GEO score.'}

## Rules
- H2s should use high-intent keywords and question formats where natural
- At least 4 H2 sections, at least 2 question-based
- Must include entities: Nashville venues, industry orgs (PCMA, MPI, IAEE), JHR Photography
- Quick answer: 50-75 words, self-contained, quotable
- Meta title: 50-60 chars with primary keyword
- FAQ topics: "People Also Ask" style questions, at least 5

Return ONLY valid JSON:
{
  "sections": [{ "h2": "...", "goal": "...", "mustInclude": ["entity1"] }],
  "quickAnswerGoal": "...",
  "metaGoals": { "title": "...", "description": "..." },
  "faqTopics": ["question 1", "question 2", ...]
}`,
    }],
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  return JSON.parse(cleanJson(text)) as AnalysisResult;
}

// ─── Phase 2: REWRITE (streaming) ────────────────────────────────────────────

async function phaseRewrite(
  body: string, outline: AnalysisResult['sections'], keyword: string, title: string,
  onChunk: (text: string) => void,
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  let bodyContext = body;
  if (body.length > 8000) {
    bodyContext = body.slice(0, 5000) + '\n\n[...middle content...]\n\n' + body.slice(-2000);
  }

  const outlineText = outline.map((s, i) =>
    `${i + 1}. <h2>${s.h2}</h2> — Goal: ${s.goal}${s.mustInclude?.length ? ` | Include: ${s.mustInclude.join(', ')}` : ''}`
  ).join('\n');

  let fullText = '';
  const stream = client.messages.stream({
    model: QUALITY_MODEL,
    max_tokens: 6144,
    temperature: 0.4,
    system: VOICE_GUIDE,
    messages: [{
      role: 'user',
      content: `Rewrite this article body following the revised outline.

## Title: "${title}"
## Primary Keyword: "${keyword}"

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
- Include statistics with numbers. Named entities (Nashville, Music City, PCMA, MPI).
- Include a quotable definition or branded concept.
- Minimum 900 words.
- NEVER use: crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, leverage, holistic, revolutionize, groundbreaking, transformative
- NEVER use: free consultation, affordable, cheap, budget, premier, elite, discount, photo booth, freelancer, hourly rate

Output ONLY the HTML body. No explanation.`,
    }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }

  return fullText;
}

// ─── Phase 3: POLISH ─────────────────────────────────────────────────────────

async function phasePolish(
  body: string, analysis: AnalysisResult, keyword: string, title: string,
): Promise<PolishResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 2048,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: `Generate SEO/GEO metadata for this JHR Photography article.

## Article Preview
${body.slice(0, 3000)}

## Primary Keyword: "${keyword}"
## Current Title: "${title}"
## Quick Answer Goal: ${analysis.quickAnswerGoal}
## Meta Goals: title="${analysis.metaGoals.title}", description="${analysis.metaGoals.description}"
## FAQ Topics: ${analysis.faqTopics.join('; ')}

## Rules
- title: Engaging, includes primary keyword, max 80 chars
- metaTitle: 50-60 chars, includes primary keyword
- metaDescription: 140-160 chars, includes primary keyword
- excerpt: 1-2 sentences for blog cards
- quickAnswer: 50-75 words, self-contained, quotable, includes a number or named entity
- faqBlock: 5+ items, each answer 30-50 words, varied question starters

Return ONLY valid JSON:
{
  "title": "...", "metaTitle": "...", "metaDescription": "...",
  "excerpt": "...", "quickAnswer": "...",
  "faqBlock": [{ "question": "...", "answer": "..." }]
}`,
    }],
  });

  const text = response.content.find((b) => b.type === 'text')?.text || '';
  return JSON.parse(cleanJson(text)) as PolishResult;
}

// ─── GEO Score (simplified local scoring) ────────────────────────────────────

function computeGeoScore(body: string, quickAnswer: string, faqBlock: FAQItem[]): number {
  let score = 0;

  // Quick answer (20 pts)
  const qaWords = quickAnswer?.split(/\s+/).filter(Boolean).length || 0;
  if (qaWords >= 30 && qaWords <= 100) score += 20;
  else if (qaWords >= 20) score += 15;
  else if (qaWords > 0) score += 10;

  // Statistics (20 pts)
  const stats = (body.match(/\d+[\d,.]*\s*(%|percent|billion|million|thousand)/gi) || []).length;
  if (stats >= 5) score += 20;
  else if (stats >= 3) score += 12;
  else if (stats >= 1) score += 4;

  // Quotable definition (15 pts)
  const defs = [/\bis\s+(?:defined\s+as|the\s+process\s+of|a\s+(?:method|practice|approach))/i, /\brefers\s+to\b/i, /\binvolves\s+/i];
  let defScore = 0;
  for (const p of defs) { if (p.test(body)) defScore += 5; }
  score += Math.min(15, defScore);

  // Heading structure (15 pts)
  const h2Count = (body.match(/<h2[\s>]/gi) || []).length + (body.match(/^##\s+/gm) || []).length;
  if (h2Count >= 4) score += 8;
  else if (h2Count >= 2) score += 3;
  const questions = (body.match(/<h2[^>]*>[^<]*\?/gi) || []).length;
  if (questions >= 2) score += 4;
  else if (questions >= 1) score += 2;
  if ((body.match(/<h3[\s>]/gi) || []).length > 0) score += 3;

  // Named entities (10 pts)
  const entities = (body.match(/\b(?:Nashville|Music\s+City|Tennessee|PCMA|MPI|IAEE|JHR\s+Photography|Gaylord\s+Opryland|Music\s+City\s+Center)\b/g) || []).length;
  if (entities >= 15) score += 10;
  else if (entities >= 6) score += 5;

  // External citations (10 pts)
  const extLinks = (body.match(/href="https?:\/\/(?!jhr)/g) || []).length;
  if (extLinks >= 6) score += 10;
  else if (extLinks >= 4) score += 6;

  // FAQ quality (10 pts)
  if (faqBlock?.length >= 7) score += 4;
  else if (faqBlock?.length >= 5) score += 3;
  if (faqBlock?.length > 0) {
    const avgLen = faqBlock.reduce((s, f) => s + f.answer.split(/\s+/).length, 0) / faqBlock.length;
    if (avgLen >= 30) score += 4;
    else if (avgLen >= 20) score += 3;
    score += 2; // diversity bonus
  }

  return Math.min(100, score);
}

// ─── Lambda Handler ──────────────────────────────────────────────────────────

export const handler = awslambda.streamifyResponse(
  async (event: any, responseStream: any): Promise<void> => {
    // Set up SSE
    const metadata = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };

    responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

    const send = (event: string, data: Record<string, unknown>) => {
      responseStream.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      // Parse request
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
      const slug = body.slug as string;
      const apiKey = body.apiKey as string;

      // Auth check
      if (!apiKey || apiKey !== process.env.IMPROVE_API_KEY) {
        send('error', { error: 'Unauthorized' });
        responseStream.end();
        return;
      }

      if (!slug) {
        send('error', { error: 'slug is required' });
        responseStream.end();
        return;
      }

      // ── Load article ─────────────────────────────────────────────
      send('progress', { phase: 'loading', message: `Loading "${slug}"...` });

      const article = await loadArticle(slug);
      if (!article) {
        send('error', { error: 'Article not found' });
        responseStream.end();
        return;
      }

      const bodyText = article.body || '';
      const title = article.title || '';
      const tags = (article.tags as string[]) || [];
      const primaryKeyword = tags[1] || title.split(' ').slice(0, 4).join(' ');
      const geoNotes = article.geoMetadata?.geoScoreNotes || '';
      const sections = article.sections || [];

      // ── Phase 1: ANALYZE ─────────────────────────────────────────
      send('progress', { phase: 'analyze', message: 'Phase 1: Analyzing structure...' });

      const currentH2s = extractH2s(bodyText);
      const analysis = await phaseAnalyze(
        currentH2s, geoNotes, primaryKeyword, title, bodyText.split(/\s+/).length,
      );

      send('progress', { phase: 'analyze', message: `Outline: ${analysis.sections.length} sections` });

      // ── Phase 2: REWRITE (streaming) ─────────────────────────────
      send('progress', { phase: 'rewrite', message: 'Phase 2: Rewriting body...' });

      let chunkCount = 0;
      const improvedBody = await phaseRewrite(
        bodyText, analysis.sections, primaryKeyword, title,
        () => {
          chunkCount++;
          if (chunkCount % 20 === 0) {
            send('progress', { phase: 'rewrite', chunks: chunkCount });
          }
        },
      );

      if (!improvedBody || improvedBody.length < 500) {
        send('error', { error: 'Body rewrite produced insufficient content' });
        responseStream.end();
        return;
      }

      const newWordCount = improvedBody.split(/\s+/).filter(Boolean).length;
      send('progress', { phase: 'rewrite', message: `Body complete: ~${newWordCount} words` });

      // ── Phase 3: POLISH ──────────────────────────────────────────
      send('progress', { phase: 'polish', message: 'Phase 3: Polishing metadata...' });

      const polished = await phasePolish(improvedBody, analysis, primaryKeyword, title);

      send('progress', { phase: 'polish', message: 'Metadata ready' });

      // ── Save ─────────────────────────────────────────────────────
      send('progress', { phase: 'saving', message: 'Saving improved article...' });

      const faqBlock = polished.faqBlock?.length >= 5 ? polished.faqBlock : (
        sections.filter((s: any) => s.type === 'faq')
          .flatMap((s: any) => (s.items || []).map((i: any) => ({ question: i.question, answer: i.answer })))
      );

      // Update sections
      const updatedSections = sections.map((s: any) =>
        (s.type === 'text-block' || s.type === 'rich-text') ? { ...s, content: improvedBody } : s
      );
      if (!updatedSections.some((s: any) => s.type === 'text-block' || s.type === 'rich-text')) {
        updatedSections.push({ id: `text-${Date.now()}`, type: 'text-block', content: improvedBody });
      }
      const faqIdx = updatedSections.findIndex((s: any) => s.type === 'faq');
      if (faqIdx >= 0 && faqBlock.length > 0) {
        updatedSections[faqIdx] = { ...updatedSections[faqIdx], items: faqBlock };
      } else if (faqIdx < 0 && faqBlock.length > 0) {
        updatedSections.push({ id: `faq-${Date.now()}`, type: 'faq', title: 'Frequently Asked Questions', items: faqBlock });
      }

      // GEO score
      const geoScore = computeGeoScore(improvedBody, polished.quickAnswer, faqBlock);

      // Compute hard fails for notes
      const hardFails: string[] = [];
      const extLinks = (improvedBody.match(/href="https?:\/\/(?!jhr)/g) || []).length;
      const intLinks = (improvedBody.match(/href="\/|href="https?:\/\/jhr/g) || []).length;
      if (extLinks < 4) hardFails.push(`External links: ${extLinks}, minimum 4`);
      if (intLinks < 2) hardFails.push(`Internal links: ${intLinks}, minimum 2`);
      if (newWordCount < 900) hardFails.push(`Word count: ${newWordCount}, minimum 900`);
      if (!polished.quickAnswer) hardFails.push('Missing quickAnswer');
      if (faqBlock.length < 5) hardFails.push(`FAQ items: ${faqBlock.length}, minimum 5`);

      await saveArticle(slug, {
        ...article,
        title: polished.title || title,
        body: improvedBody,
        quickAnswer: polished.quickAnswer || article.quickAnswer,
        excerpt: polished.excerpt || article.excerpt,
        sections: updatedSections,
        seo: {
          ...(article.seo || {}),
          pageTitle: polished.metaTitle || article.seo?.pageTitle,
          metaDescription: polished.metaDescription || article.seo?.metaDescription,
        },
        geoMetadata: {
          ...(article.geoMetadata || {}),
          geoScore,
          geoScoreNotes: hardFails.length > 0 ? hardFails.join('; ') : 'Passing',
        },
        wordCount: newWordCount,
        readTime: Math.ceil(newWordCount / 250),
      });

      // ── Done ─────────────────────────────────────────────────────
      const changes: string[] = ['Body rewritten'];
      if (title !== (polished.title || title)) changes.push('Title updated');
      if (polished.quickAnswer) changes.push('Quick answer rewritten');
      if (polished.metaTitle) changes.push('Meta title updated');
      changes.push(`Words: ${bodyText.split(/\s+/).length} → ${newWordCount}`);

      send('done', {
        slug,
        status: 'improved',
        afterScore: geoScore,
        changes,
      });
    } catch (error) {
      console.error('Content improve error:', error);
      send('error', { error: error instanceof Error ? error.message : 'Improvement failed' });
    }

    responseStream.end();
  }
);

// TypeScript declarations for Lambda streaming API
declare const awslambda: {
  streamifyResponse: (handler: (event: any, responseStream: any, context?: any) => Promise<void>) => any;
  HttpResponseStream: {
    from: (stream: any, metadata: any) => any;
  };
};
