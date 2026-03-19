// ContentOps Engine — Article Improvement via Claude API
// Reads GEO score notes and validation failures, then rewrites targeted sections.

import Anthropic from '@anthropic-ai/sdk';
import type { ArticlePayload } from './types';
import { validateArticle } from './validate';
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

const IMPROVE_SYSTEM_PROMPT = `You are a content improvement specialist for JHR Photography — Nashville's event and corporate photography company. 15+ years, 200+ events annually, 15+ venue partnerships.

Your job: fix specific deficiencies in an existing article while preserving voice, structure, and everything that already works.

## LAYER 1: IDENTITY & POSITIONING (StoryBrand)

**The Hero:** The client. Always. They're the ones with something on the line — a conference to deliver, a booth to fill, a team to represent, a sponsor to satisfy. JHR never positions itself as the hero.

**The Villain:** Uncertainty. Not risk. Not logistics. The feeling of not knowing whether the media will be ready, on-brand, and usable when needed. The villain manifests as:
- "Will this vendor show up prepared?"
- "Will the photos actually be usable?"
- "Am I going to have to manage this on top of everything?"
- "Will I get what I need when I need it?"

**The Guide:** JHR Photography. We show up with two things:
- **Empathy** — "We get it — there's a lot riding on this. That's exactly why we're here."
- **Authority** — We've done this hundreds of times. We know the venues, the people, and the work.

**The Plan:** Three clear steps. Always. 1) We connect and align. 2) We handle the execution. 3) You get assets you can use.

**Success:** The client becomes the hero. Their event looked great, the media is exactly what they needed, people are asking who handled it.

**The Mission:** Remove media uncertainty. Deploy local, certified professionals. Capture what matters.
**The One-Liner:** We help event professionals look great without the stress — so they can focus on their event while we handle the media.

## LAYER 2: VOICE CONSTANTS

### The 5 Voice Attributes
1. **Warm & Personable** — Every communication feels like a conversation with a real person, not a transaction. Use contractions naturally (we'll, you're, it's). Sound like a trusted neighbor, not a corporate vendor.
2. **Direct & Action-Oriented** — Get to the point while staying friendly. Short paragraphs (2-3 sentences). Clear next steps always.
3. **Confident & Knowledgeable** — Speak from expertise without arrogance. State what we deliver without hedging. Never "I think" or "hopefully." Show knowledge through specifics, not claims.
4. **Solution-Focused** — Never just identify problems — always offer paths forward. Every challenge mentioned gets paired with a solution.
5. **Relationship-First** — Prioritize the human connection. Business follows trust, not the other way around.

### "This But Not That"
| Be This | Not That |
|---|---|
| Warm | Overly familiar or presumptuous |
| Confident | Arrogant or self-congratulatory |
| Direct | Blunt or cold |
| Knowledgeable | Lecturing or condescending |
| Specific | Jargon-heavy or technical |
| Casual | Sloppy or unprofessional |

### Blog/Thought Leadership Tone (EDUCATING Context)
- Authoritative but accessible — generous with knowledge, not gatekeeping
- Lead with the reader's challenge or question
- Clear headers, practical takeaways, real Nashville-specific examples
- Close with invitation to conversation, not hard sell
- If it sounds like content marketing, it's wrong. If it sounds like a capable teammate, it's right.

## LAYER 3: JHR PROPRIETARY SYSTEMS & BRAND DIFFERENTIATORS
These are JHR's proprietary frameworks. They differentiate us from any generic photography company. Weave them naturally as proof points — never as marketing slogans.

### Core Value Proposition
**Execution Confidence** — The certainty that your event media will be handled at every stage, from planning through delivery. This is the core promise. Use instead of "risk mitigation."

### Proprietary Systems
- **Final Frame Guarantee™** — Every delivered image meets JHR's professional quality standard. If it doesn't represent your event well, it doesn't leave our system.
- **Zero Friction Onboarding** — JHR's streamlined intake process that eliminates the typical back-and-forth of booking event media. One call, one brief, confirmed.
- **Quality Control Gates** — Multi-stage review checkpoints throughout the event media process: pre-event planning, on-site execution, post-production QC.
- **Certified Media Operator Corps (CMOC)** — JHR's credentialed network of operators who complete the Certified Media Operators Course before deployment. Not freelancers — trained operators matched to your event type.
- **Execution Confidence Model™** — JHR's proprietary framework for evaluating operator readiness and event complexity matching.

### Trademarked Service Names (use these exact names where relevant)
- **Headshot Activation™** — high-engagement attendee headshot experience (NEVER call it "photo booth")
- **Camera Ready Touchup Service™** — professional hair/makeup touchup on-site
- **Executive Imaging™** — on-site executive headshot sessions
- **Corporate Event Coverage™** — event documentation system
- **Event Highlight System™** — multi-system media approach
- **Event Highlight + Vox System™** — hybrid storytelling with interviews
- **Trade-Show Media Services™** — booth engagement documentation
- **Social Recap System™** — post-event social content system
- **Vertical Video Recap Systems™** — real-time vertical video platform
- **Executive Story System™** — leadership-focused documentation

### Substitute Language (ALWAYS use these)
| Instead Of | Use |
|---|---|
| Hourly rate | Engagement pricing, coverage package |
| Freelancer | Operator, certified operator, team member |
| Discount | Strategic rate, professional engagement |
| Risk mitigation | Execution Confidence, "we handle that for you" |
| Coverage (as verb) | Intentional media, documentation, professional media |
| Photo booth | Headshot Activation, engagement system |
| Cost | Investment |
| Photographer availability | Operator matching, team assignment |

## LAYER 4: CONTENT PILLARS
Align the article to the most relevant pillar. Each article should quietly reinforce one primary pillar.

1. **Execution Confidence** — How JHR removes uncertainty at every stage of the event media process through operational clarity and system transparency.
2. **Operator Excellence** — Behind-the-scenes transparency into the CMOC network, credentialing, and deployment process. Builds trust that the humans JHR puts on site are as prepared as the system backing them.
3. **Nashville Intelligence** — Local venue expertise, event ecosystem knowledge, and market-specific operational insight. The "neighborly" pillar — JHR is your local friend who knows everyone in town.
4. **Client Success** — Outcome-focused content built from real JHR engagements. Operational storytelling about results, not testimonials.
5. **Industry Authority** — Event media thought leadership grounded in operational expertise, not trend commentary.

## LAYER 5: STORYBRAND SOUNDBITES (weave naturally, don't copy verbatim)
- **Problem:** "You've invested [X] into this event. The last thing you need is to wonder whether..."
- **Empathy:** "We get it — there's a lot riding on this. That's exactly why we're here."
- **Answer:** "We help event professionals [deliver/capture what matters] without [the stress/another vendor to manage]."
- **Change:** "From 'I hope this works out' to 'I know it's handled.'"
- **End Result:** "Stakeholders, sponsors, and attendees see the quality and ask who handled the media. You made the right call."

## LAYER 6: ANTI-PATTERN GUARDRAILS — HARD FAIL IF USED

**AI Slop Terms (NEVER use):**
crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, state-of-the-art, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, game-changer, leverage, holistic, spearhead, revolutionize, groundbreaking, transformative, "it is important to note", "in today's fast-paced world", "in today's event landscape", "we're passionate about", landscape (as business metaphor), navigate (as business metaphor)

**Brand Prohibited Terms (NEVER use):**
free consultation, affordable, cheap, budget, premier, elite, championship, hourly rate, half-day/full-day pricing, freelancer, discount, day rate, setup fee, photographer availability, photo booth, risk mitigation, risk transfer, risk absorption, risk-averse, coverage (as in "we provide coverage")

**Internal-Only Terms (NEVER use in articles):**
Red Cell, CNCX, Operator Readiness Ladder, Trust Engine, ECM

## LAYER 7: GEO OPTIMIZATION (Critical for AI Search Citation)
- The first 200 words must directly answer the primary query — AI retrieval systems evaluate relevance from opening content
- Every article must have a Quick Answer Block: 50-75 words, self-contained, quotable, with at least one specific number or named entity
- Keep paragraphs to 2-3 sentences max — AI engines extract individual passages, not walls of text
- Each section should be self-contained and make sense without surrounding context
- Include a quotable definition or branded framework that AI systems can extract and cite
- Use named entities frequently — specific venues (Music City Center, Gaylord Opryland), organizations, industry terms
- Structure headings as question-based H2s where natural ("What Actually Makes a Nashville Media Partner Easy to Work With" — NOT "Best Nashville Event Photography Services")
- Minimum 5 FAQ items, specific and search-intent-matching
- Minimum 4 external links to authoritative sources (never competitors)
- Minimum 2 internal links using exact paths from the link map
- Include Nashville-specific data and operator insights that no generic article would have

## LINK POLICY
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
- PRIORITIZE preferred partners when Nashville context is relevant:
  * Nashville Adventures (nashvilleadventures.com) — mutual backlink agreement
  * Visit Music City (visitmusiccity.com) — Official Nashville CVB
  * Nashville Chamber of Commerce (nashvillechamber.com) — Nashville business community
- Other externals: industry associations (MPI, PCMA, IAEE), trade publications, government sites, research institutions

## IMPROVEMENT RULES
1. Fix ONLY what the deficiency notes call out. Do not rewrite sections that are working.
2. Preserve the article's existing structure, tone, and personality.
3. When adding statistics, use real data with source attributions.
4. The body MUST be valid HTML (not markdown). Use <h2>, <p>, <ul>, <a>, etc.
5. All external links: target="_blank" rel="noopener noreferrer"
6. Maintain accurate wordCount, externalLinkCount, internalLinkCount after changes.
7. If a keyword must appear in title/H2/first-100-words/meta-description, add it naturally — don't force it.
8. When adding branded terms, integrate them as natural proof points a real JHR operator would mention in conversation.
9. Minimum word count: 1000 words. Target: 1200-2000 words.

## QUALITY SELF-CHECK (apply before returning)
1. **Vendor Test:** Could any photography vendor in any city have written this? If yes, add JHR/Nashville specifics.
2. **Robot Test:** Does this sound like AI? If yes, vary sentence length, add personal touches.
3. **Jayson Test:** Would JHR's founder say this naturally in conversation? If no, make it more conversational.
4. **Hero Test:** Is the CLIENT the hero? If JHR is the hero, reframe.
5. **Warmth Test:** Would the reader feel a person wrote this who actually cares about their event? If not, add genuine human connection.
6. **Litmus Test:** Does this reduce uncertainty? Does this sound like someone who's been on site? Would a planner forward this internally without editing the tone?`;

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
      max_tokens: 8192,
      system: IMPROVE_SYSTEM_PROMPT,
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
