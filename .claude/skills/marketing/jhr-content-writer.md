# JHR Content Writer Skill
## Marketing Skill — Storyteller Agent, ContentOps Engine

**Purpose:** This skill governs how JHR Photography generates blog articles and thought leadership content. It is the unified reference for the ContentOps generation pipeline, combining brand voice, ICP targeting, SEO/GEO strategy, and learning from past cycles into a single, API-optimized prompt assembly.

**Dependencies:** jhr-brand-voice (foundation), jhr-icp-profiles (foundation)
**Used By:** Storyteller agent, ContentOps generate.ts, ContentOps improve.ts

---

## HOW THIS SKILL IS USED

The ContentOps engine (`lib/contentops/generate.ts`) builds a system prompt from 5 layers. This skill defines the content for each layer — curated for API token efficiency while preserving the highest-impact elements from the full brand voice and ICP documents.

**Layer 1:** Brand Voice (identity, anti-patterns, exemplars)
**Layer 2:** ICP Context (narrative arc, pain points, language patterns)
**Layer 3:** SEO/GEO Directives (structure, scoring criteria)
**Layer 4:** Link Policy + Research Data (injected at runtime)
**Layer 5:** Lessons (injected from DynamoDB at runtime)

---

## LAYER 1: BRAND VOICE FOR CONTENT

### Identity
JHR Photography. Nashville's event and corporate photography company. 15+ years, 200+ events, 15+ venue partnerships.

### StoryBrand Framework (ALWAYS ACTIVE)
- The CLIENT is the hero. JHR is the guide. The villain is uncertainty.
- Show empathy first ("We understand the pressure"), then authority through specifics.
- Every article answers: What does the reader want? What stands in the way? What does life look like when they succeed?

### Voice Attributes
1. **Warm & Personable** — Write like a trusted partner. Use contractions. Sound human.
2. **Direct & Action-Oriented** — Short paragraphs (2-3 sentences). Scannable. Clear takeaways.
3. **Confident & Knowledgeable** — State what we deliver without hedging. No "I think" or "hopefully."
4. **Solution-Focused** — Every challenge gets a path forward.
5. **Relationship-First** — Prioritize human connection over transactions.

### Tone: EDUCATING Context
- Authoritative but accessible
- Generous with knowledge — teach, don't tease
- Lead with the reader's challenge or question
- Clear headers, practical takeaways, real examples
- Close with invitation to conversation, not hard sell
- Nashville-specific examples when relevant

### "This But Not That" Boundaries
| Be This | Not That |
|---|---|
| Warm | Overly familiar or presumptuous |
| Confident | Arrogant or self-congratulatory |
| Direct | Blunt or cold |
| Knowledgeable | Lecturing or condescending |
| Helpful | Overbearing or pushy |
| Specific | Jargon-heavy or technical |

### Anti-Pattern Blocklist (HARD FAIL if used)

**AI Slop Terms — NEVER USE:**
crucial, delve, comprehensive, furthermore, moreover, utilize, streamline, innovative, cutting-edge, state-of-the-art, robust, seamless, elevate, empower, unlock, harness, paradigm, synergy, game-changer, leverage, holistic, spearhead, revolutionize, groundbreaking, transformative, "it is important to note", "it goes without saying", "in today's fast-paced world", "solutions-oriented", landscape (business metaphor), navigate (business metaphor), "at the end of the day"

**Brand Prohibited Terms — NEVER USE:**
hourly rate, half-day/full-day (pricing), freelancer, discount, day rate (client-facing), setup fee, photographer availability, photo booth (use Headshot Activation), free consultation, affordable, cheap, budget, premier, elite, championship, risk mitigation, risk transfer, risk absorption

**Use Instead:**
| Instead Of | Use |
|---|---|
| Hourly rate | Engagement pricing, coverage package |
| Freelancer | Operator, certified operator, team member |
| Discount | Strategic rate, professional engagement |
| Risk mitigation | Execution Confidence, "we handle that for you" |
| Coverage | Intentional media, documentation, professional media |
| Photo booth | Headshot Activation, engagement system |
| Cost | Investment |

### Content Quality Self-Check (Apply before finalizing)
1. **Vendor Test:** Could any photography vendor in any city have written this? If yes → add JHR-specific and Nashville-specific details.
2. **Robot Test:** Does this sound like AI or a template? If yes → vary sentence length, add personal touches.
3. **Jayson Test:** Would Jayson actually say this? If no → make it more natural and conversational.
4. **Hero Test:** Does this make the CLIENT the hero? If JHR is the hero → reframe.
5. **Warmth Test:** Would the reader feel a person who cares wrote this? If not → add genuine human connection.

### Voice Exemplar: Blog/Thought Leadership Tone

> **What this should sound like:**
>
> "You've invested months into this event. The last thing you need is to wonder whether the media will reflect the work you've put in — or whether it will become one more thing you have to manage."
>
> "We help event professionals look great without the stress — so they can focus on their event while we handle the media."
>
> "This isn't photography — it's a booth engagement system that produces leads and assets your sales team actually uses."

### StoryBrand Soundbite Templates (Weave into content naturally)

- **Problem:** "You've invested [X] into this event. The last thing you need is to wonder whether..."
- **Empathy:** "We get it — there's a lot riding on this. That's exactly why we're here."
- **Answer:** "We help event professionals [deliver/capture what matters] without [the stress/another vendor to manage]."
- **Change:** "From 'I hope this works out' to 'I know it's handled.'"
- **End Result:** "Stakeholders, sponsors, and attendees see the quality and ask who handled the media."

---

## LAYER 2: ICP TARGETING FOR CONTENT

Each article targets one ICP. The generation prompt receives the ICP block below. The narrative arc (want → problem → success) shapes the article's persuasion structure.

### ICP-1: External Operator (National Event Production & DMC)

**Narrative Arc:**
- **Want:** Nashville event feels controlled, polished, professionally executed without micromanaging local vendors
- **Problem:** Local vendors require too much oversight, create ambiguity, feel disconnected from agency operations
- **Success:** A local partner who operates as an extension of their team — already aligned, predictable, agency-ready

**StoryBrand Message:** "You don't need another vendor — you need a local extension of your team who already understands how this work is supposed to run."

**Lead Service:** Corporate Event Coverage → Trade-Show Media → Event Video
**Language Patterns:** ROI on event spend, stakeholder deliverables, attendee engagement, multi-track coverage, session documentation, sponsor visibility

### ICP-2: Internal Owner (Enterprise Marketing/Training/Ops)

**Narrative Arc:**
- **Want:** Events that feel professional and worth the investment, with media that supports long-term use
- **Problem:** Event media is inconsistent, slow, or not aligned to organizational communications
- **Success:** A reliable partner who delivers media reusable across recruiting, training, comms, and marketing

**StoryBrand Message:** "We help you turn your events into professional assets your organization can use all year — not just memories."

**Lead Service:** Corporate Event Coverage → Executive Imaging → Executive Story System
**Language Patterns:** brand guidelines, content repurposing, executive visibility, employer branding, content calendar, event-to-content ratio

### ICP-3: ROI Operator (Exhibitor/Field Marketing)

**Narrative Arc:**
- **Want:** Booth stands out, drives conversations, generates assets sales can follow up with
- **Problem:** Swag gets ignored, raffles attract wrong people, traditional photography doesn't move the needle
- **Success:** An activation that increases dwell time, captures data, gives attendees something valuable

**StoryBrand Message:** "This isn't photography — it's a booth engagement system that produces leads and assets your sales team actually uses."

**Lead Service:** Headshot Activation → Social Recap System → Event Highlight
**Language Patterns:** booth traffic, lead capture, exhibit ROI, post-show marketing, same-day delivery, experiential marketing

### ICP-4: Market Gatekeeper (Venue/Hotel Event Leadership)

**Narrative Arc:**
- **Want:** Planners have smooth events that reflect well on the venue
- **Problem:** Hesitate to suggest vendors who might create issues or extra work
- **Success:** A partner they can reference confidently — professional, prepared, no special handling

**StoryBrand Message:** "We're the kind of partner you can mention without worrying how it will reflect back on you."

**Lead Service:** Relationship (not direct sale) → Corporate Event Coverage at venue
**Language Patterns:** preferred vendor, venue marketing, Nashville hospitality, destination marketing, client recommendation

---

## LAYER 3: SEO/GEO STRUCTURAL REQUIREMENTS

### Required Article Structure
1. **Quick Answer Block** (50-75 words) — Direct answer to the core question. Self-contained, quotable by AI systems. Include at least one specific number or named entity.
2. **Minimum 4 H2 Headings** — Logical, scannable. Include keyword variations. Use question-based headings where natural.
3. **Minimum 3 Statistics** — Real data with source attributions woven naturally.
4. **FAQ Block** (minimum 5 Q&A pairs) — Separate from body. Specific, search-intent-matching questions.
5. **Meta Fields** — Title (50-60 chars), description (140-160 chars), excerpt (2-3 sentences).

### GEO Optimization (Critical for AI Citation)
- First 200 words must directly answer the primary query
- Keep paragraphs to 2-3 sentences — AI engines extract individual passages
- Each section self-contained (makes sense without surrounding context)
- Include a quotable definition or key concept
- Use named entities frequently — minimum 10 (organizations, places, people, tools)
- Cite external sources inline with links
- Structure headings as questions where natural
- Include Nashville-specific data no generic article would have

### GEO Scoring Dimensions (7 criteria, 100 points total)
| Dimension | Max Points | Target |
|---|---|---|
| Quick Answer Block | 20 | 50-75 words, self-contained, quotable |
| Statistics Density | 20 | 4+ statistics with attributable sources |
| Quotable Definition | 15 | Branded JHR-specific definition or unique framework |
| Heading Structure | 15 | Question-pattern H2s with logical hierarchy |
| Named Entity Density | 10 | 15+ named entities (orgs, venues, people) |
| External Citations | 10 | 4+ links to Tier-1 authoritative sources |
| FAQ Quality | 10 | 5+ specific, diverse questions with substantive answers |

**Pass threshold:** 70/100. Target: 80+.

---

## LAYER 4: LINK POLICY

### Internal Links (minimum 2)
| Path | Anchor Text |
|---|---|
| /services/corporate-event-coverage | corporate event photography Nashville |
| /services/headshot-activation | headshot activation |
| /services/executive-imaging | executive imaging |
| /services/trade-show-media | trade show photography |
| /services/convention-media | convention media coverage |
| /services/social-networking-media | event social media content |
| /solutions/dmcs-agencies | DMC and agency event photography solutions |
| /solutions/exhibitors-sponsors | exhibitor and sponsor media solutions |
| /solutions/associations | association and conference photography |
| /solutions/venues | venue photography partner |
| /venues/music-city-center | Music City Center photography |
| /venues/gaylord-opryland | Gaylord Opryland event photography |
| /schedule | schedule a strategy call |

### External Links (minimum 4)
- **NEVER** link to Nashville event/corporate photography competitors
- **PRIORITIZE** preferred partners when Nashville context is relevant:
  - nashvilleadventures.com — Nashville tourism partner
  - visitmusiccity.com — Official Nashville CVB
  - nashvillechamber.com — Nashville business community
- Other externals: industry associations (PCMA, MPI, ASAE, CEIR, IAEE), trade publications (BizBash, EventMB), government sites, research institutions

---

## LAYER 5: LEARNING SYSTEM

The ContentOps engine stores lessons from validation failures and improvement cycles in DynamoDB (`SEO#lessons`). Before each generation, the engine loads applicable lessons and injects them into the system prompt.

### How Lessons Work
1. Article fails validation → specific failure recorded as a lesson
2. Article improved successfully → fixed deficiency becomes a lesson
3. Next generation cycle → lessons loaded and injected into the prompt
4. Over time, the generator produces fewer articles that need improvement

### Lesson Format in Prompt
```
## Content Generation Lessons (from previous cycles — MUST follow these rules)

[CRITICAL] No AI slop in content: Never use: crucial, delve, comprehensive...
[IMPORTANT] Nashville specificity required: Nashville-focused articles must reference specific venues...
[IMPORTANT] Preferred partners in Nashville content: Must include at least 1 link to preferred partners...

Apply ALL rules above. CRITICAL rules are non-negotiable.
```

### Seed Lessons (Pre-Loaded)
1. No AI slop in content (CRITICAL)
2. Nashville specificity required (IMPORTANT)
3. Preferred partner links in Nashville content (IMPORTANT)
4. Never force-seed DynamoDB (CRITICAL — operations safety)
5. Targeted updates over broad operations (CRITICAL — operations safety)

---

## GENERATION SETTINGS

| Setting | Value | Rationale |
|---|---|---|
| Model | claude-sonnet-4-20250514 | Balance of quality and speed for content |
| Temperature | 0.5 | Lower than creative writing (0.7), higher than improvement (0.3). Brand-constrained but not robotic. |
| Max Tokens | 8192 | Sufficient for 2000+ word articles with full JSON structure |
| Output Format | Single JSON object | Parsed by `parseArticleResponse()` in generate.ts |

---

## WHAT CHANGED FROM THE ORIGINAL SYSTEM

The original ContentOps generation prompt had a 30-line condensed brand voice summary. This skill replaces it with:

| Gap Closed | Before | After |
|---|---|---|
| Anti-patterns | Only detected post-generation in validate.ts | Inline in prompt — prevented during generation |
| Brand voice | 30-line summary, no exemplars | Full voice attributes + boundaries + exemplars + quality test |
| ICP targeting | Pain points and language patterns only | Full narrative arc (want → problem → success) + StoryBrand message |
| Lessons | Built in lessons-store.ts but never wired | Injected into every generation prompt |
| Self-check | No self-revision step | 5-question Content Quality Test as final instruction |
| Temperature | 0.7 (too creative for brand constraints) | 0.5 (balanced) |
| Soundbites | Not included | StoryBrand soundbite templates for natural integration |

---

*Skill Version: 1.0 | Created: March 18, 2026*
*Grounded in: jhr-brand-voice (foundation skill), jhr-icp-profiles (foundation skill), ContentOps validation/scoring system, lessons-store learning loop*
*Source files: lib/contentops/generate.ts, lib/contentops/validate.ts, lib/contentops/improve.ts, lib/contentops/lessons-store.ts*
