---
name: seo-geo-keyword-strategy
description: Keyword targeting rules, cluster map, and selection criteria for all JHR SEO/GEO content decisions.
---

# Keyword Strategy Rules

These rules govern every keyword decision — from page optimization to new content creation.

---

## Selection Rules

### One Primary, Many Supporting
- **One primary keyword** per page — the single query this page is built to rank for
- **2–5 secondary keywords** — close variants, long-tail extensions, related queries
- **Semantic/LSI vocabulary** — naturally occurring related terms (don't force-insert)
- Never target the same primary keyword on two different pages (cannibalization)

### Placement Protocol
Primary keyword MUST appear in:
1. Title tag (front-loaded when possible)
2. H1 heading
3. First 100 words of body content
4. At least one H2 heading
5. Meta description

Secondary keywords should appear:
- In H2/H3 headings (natural, not forced)
- In body paragraphs (1–2% density across all keywords combined)
- In image alt text where descriptively accurate
- In FAQ questions

### What NOT to Do
- Never force exact-match — use natural variations throughout
- Never exceed 2% keyword density (Google sees this as stuffing)
- Never sacrifice readability for keyword placement
- Never use a keyword in alt text unless the image actually depicts it

---

## Intent Classification

Before targeting any keyword, classify its intent:

| Intent | Signal | Page Type | Example |
|--------|--------|-----------|---------|
| **Informational** | "how to", "what is", "guide", "tips" | Blog post | "how to plan corporate event photography" |
| **Commercial** | "best", "top", "vs", "review", comparison | Blog post or solution page | "best nashville event photographers" |
| **Transactional** | "hire", "book", "pricing", "near me", "cost" | Service page, /inquiry, /schedule | "hire nashville corporate photographer" |
| **Navigational** | Brand name, specific venue | Venue page, about page | "jhr photography nashville" |

**Rule**: Match content type to intent. Don't write a blog post for a transactional keyword. Don't optimize a service page for an informational query.

---

## Keyword Clusters

### Cluster 1: Corporate Event Photography (PRIMARY — highest revenue)
**Primary pages**: `/services/corporate-event-coverage`, `/solutions/associations`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| nashville corporate event photographer | transactional | high | /services/corporate-event-coverage |
| nashville event photographer | transactional | high | /services/corporate-event-coverage |
| corporate event photography nashville | transactional | med | /services/corporate-event-coverage |
| event photographer nashville tn | transactional | med | /services/corporate-event-coverage |
| nashville gala photographer | transactional | low | /services/corporate-event-coverage |
| how to plan corporate event photography | informational | med | blog |
| corporate event photography checklist | informational | low | blog |

### Cluster 2: Convention & Conference Photography
**Primary pages**: `/services/convention-media`, `/solutions/associations`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| nashville convention photographer | transactional | med | /services/convention-media |
| nashville conference photographer | transactional | med | /services/convention-media |
| convention photography services | commercial | med | /services/convention-media |
| association conference photography | commercial | low | /solutions/associations |
| music city center photographer | transactional | low | /venues/music-city-center |

### Cluster 3: Headshot Services
**Primary pages**: `/services/headshot-activation`, `/services/executive-imaging`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| nashville headshot photographer | transactional | high | /services/executive-imaging |
| corporate headshot activation | commercial | med | /services/headshot-activation |
| professional headshots nashville | transactional | med | /services/executive-imaging |
| executive headshot photographer nashville | transactional | low | /services/executive-imaging |
| nashville corporate headshots | transactional | med | /services/executive-imaging |
| headshot activation trade show | commercial | low | /services/headshot-activation |
| on-site headshot booth | informational | low | blog |

### Cluster 4: Trade Show Media
**Primary pages**: `/services/trade-show-media`, `/solutions/exhibitors-sponsors`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| nashville trade show photographer | transactional | low | /services/trade-show-media |
| trade show photography services | commercial | med | /services/trade-show-media |
| trade show booth photography | informational | low | blog |
| exhibit photography nashville | transactional | low | /services/trade-show-media |

### Cluster 5: Event Video
**Primary pages**: `/services/event-video-systems`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| event video production nashville | transactional | med | /services/event-video-systems |
| conference video recording nashville | transactional | low | /services/event-video-systems |
| event recap video production | commercial | low | blog |

### Cluster 6: Venue-Specific (Local SEO)
**Primary pages**: `/venues/*`

| Keyword | Intent | Volume Est | Target Page |
|---------|--------|------------|-------------|
| music city center photographer | transactional | low | /venues/music-city-center |
| gaylord opryland photographer | transactional | low | /venues/gaylord-opryland |
| [venue name] event photographer | transactional | low | /venues/[venue-slug] |
| best event venues nashville | informational | med | /venues (index) |

---

## Cannibalization Prevention

### Detection Protocol
Before assigning a primary keyword to any page:

1. **GSC check**: Search `site:jhr-photography.com [keyword]` — do multiple pages appear?
2. **Internal check**: Grep codebase for the keyword in title tags, H1s, meta descriptions
3. **SERP check**: If Google shows multiple JHR pages for the keyword, they're competing

### Resolution Actions
| Scenario | Action |
|----------|--------|
| Two pages rank for same keyword | Pick the stronger page, de-optimize the weaker one, add internal link from weak → strong |
| Blog post cannibalizing service page | Rewrite blog to target informational variant, add prominent CTA linking to service page |
| Venue page cannibalizing service page | Add "[venue name]" qualifier to venue page keyword, ensure service page targets generic version |
| New content would overlap | Don't create it. Instead, strengthen the existing page |

---

## New Keyword Evaluation

When considering a new keyword target (from DataForSEO suggestions, GSC discoveries, or content gaps):

### Must-Have Criteria
1. **Relevant to JHR services** — directly connects to a service we sell
2. **Has search volume** — DataForSEO shows monthly searches > 10
3. **No cannibalization** — no existing page targets it
4. **Achievable** — current domain authority can realistically rank (position 1-20 within 6 months)

### Scoring Matrix (pick keywords scoring 7+)
| Factor | Weight | Scoring |
|--------|--------|---------|
| Search volume | 3 | Low=1, Med=2, High=3 |
| Commercial intent | 3 | Info=1, Commercial=2, Transactional=3 |
| Competition | 2 | High=1, Med=2, Low=3 |
| Relevance to ICP | 2 | Tangential=1, Related=2, Core=3 |

**Max score: 30.** Target keywords scoring 20+ first.

---

## Keyword Plan Template (for todo.md)

When planning new content, write this to `.claude/campaign-state/todo.md`:

```markdown
## [DATE] — Keyword Plan: [TOPIC]

**Primary keyword**: [keyword] (volume: [N], intent: [type])
**Secondary keywords**: [kw1], [kw2], [kw3]
**Target page**: [new blog / existing page URL]
**ICP**: [ICP-1/2/3/4]
**Cannibalization check**: [✓ clear / ⚠ overlap with [page]]

### H2 Outline
1. [H2 — ideally question format]
2. [H2]
3. [H2]
4. [H2]
5. [FAQ section]

### Competitive Analysis
- Position 1: [URL] — [what they do well / what they miss]
- Position 2: [URL] — [what they do well / what they miss]
- Position 3: [URL] — [what they do well / what they miss]

### Our Angle
[How our content will be different/better — Nashville specificity, JHR expertise, data we have]

**Status**: [ ] Planned → [ ] Drafted → [ ] Verified → [ ] Published
```
