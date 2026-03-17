---
name: seo-geo-verification
description: Pre-completion verification gates for all SEO/GEO actions. Run before marking any action done.
---

# SEO/GEO Verification Checklist

Every action in the SEO/GEO engine must pass its applicable checklist before being marked complete. If any HARD gate fails, the action is not done — fix it first.

---

## Page-Level SEO Edits

### HARD Gates (must pass)

- [ ] **Title tag**: 50–60 characters, primary keyword included
- [ ] **Meta description**: 140–160 characters, includes CTA verb (discover, learn, book, get)
- [ ] **H1 tag**: Exactly one per page, contains primary keyword or close variant
- [ ] **Primary keyword placement**: In title, H1, first 100 words, at least one H2, meta description
- [ ] **No keyword stuffing**: Density 1–2%, never more. Use natural variations throughout
- [ ] **Internal links**: Page has both inbound links (from other pages) AND outbound links (to other pages)
- [ ] **Images**: Every image has descriptive alt text (not just "photo" or "image")
- [ ] **No broken links**: All href targets resolve to live pages
- [ ] **Mobile-friendly**: No horizontal scroll, tap targets ≥ 44px, readable without zoom
- [ ] **Brand compliance**: No prohibited terms (free, affordable, cheap, premier, elite)

### SOFT Gates (flag but don't block)

- [ ] **Canonical tag**: Present and pointing to correct URL
- [ ] **Schema markup**: At least one JSON-LD schema present
- [ ] **Open Graph**: og:title, og:description, og:image all present
- [ ] **Page speed**: PSI score ≥ 70 desktop, ≥ 60 mobile
- [ ] **Content depth**: 500+ words on service/solution pages

### Intent Check (mandatory reflection)

> "Does this page satisfy the searcher's intent better than the current top 3 results?"

If the answer is no — the edit isn't done. Improve until it is.

---

## Article / Blog Content

### HARD Gates (must pass)

- [ ] **Word count**: ≥ 900 words
- [ ] **Quick-answer block**: 50–75 words in the opening that directly answer the target query
- [ ] **Heading structure**: 4+ H2 headings, at least 2 in question format
- [ ] **Statistics**: 4+ statistics with named sources and dates
- [ ] **External links**: 4+ authority links (no competitors — check blocklist)
- [ ] **Internal links**: 2+ links to JHR service/venue/solution pages
- [ ] **FAQ block**: 5+ questions with substantive answers
- [ ] **Slug format**: Lowercase, hyphenated, matches primary keyword, no stop words
- [ ] **Meta title**: 50–60 characters, primary keyword front-loaded
- [ ] **Meta description**: 140–160 characters, includes CTA
- [ ] **No AI slop**: Zero instances of: crucial, delve, comprehensive, leverage, elevate, streamline, robust, cutting-edge, game-changer, unlock, empower
- [ ] **No brand violations**: Zero prohibited terms
- [ ] **GEO score**: ≥ 70 on the 7-component rubric

### SOFT Gates (flag but don't block)

- [ ] **Featured image**: Present, high-quality, descriptive alt text
- [ ] **Reading time**: Calculated and displayed
- [ ] **Categories/tags**: At least 1 category, 3+ tags
- [ ] **Author attribution**: Named author (Jayson Rivas)
- [ ] **Preferred partners**: Nashville-focused content links to at least 1 preferred partner

### Cannibalization Check (mandatory before publishing)

1. Search GSC: Does any existing page rank for this article's primary keyword?
2. Search internal site: Does any existing page target the same keyword in its title/H1?
3. If overlap exists: **STOP** — merge content or differentiate keyword targeting
4. Document the check result in the action log

### Quality Gate (mandatory reflection)

> "Does this article beat what's currently ranking in positions 1-3 for the target keyword?"

Pull DataForSEO SERP results. Compare:
- Do we have more specific, sourced data?
- Is our structure clearer and more scannable?
- Do we offer more actionable, Nashville-specific advice?
- Would an AI engine quote our content over theirs?

If no on any: rewrite that aspect before publishing.

---

## GEO Enhancements

### HARD Gates (must pass)

- [ ] **AI crawlers**: robots.txt allows GPTBot, ClaudeBot, PerplexityBot (check `/api/admin/geo/crawlers`)
- [ ] **JSON-LD present**: At least Organization + page-specific schema (Service, EventVenue, FAQPage, etc.)
- [ ] **Self-contained sections**: Each H2 section can be understood without reading the rest of the page
- [ ] **Paragraph length**: No paragraph exceeds 4 sentences (AI engines prefer concise blocks)
- [ ] **Named entities**: Content mentions Nashville + at least 2 of: specific venue, JHR Photography, industry organization, named person
- [ ] **Quotable content**: At least 1 definition or statement formatted for direct AI citation

### SOFT Gates (flag but don't block)

- [ ] **Entity markup**: Key entities wrapped in appropriate schema (Organization, Place, Person)
- [ ] **Table/list content**: At least 1 structured data format (table, numbered list, comparison) per page
- [ ] **Freshness signals**: Publication date, "last updated" date visible
- [ ] **Citation-ready format**: Key claims include parenthetical source references

---

## Schema / Structured Data Changes

### HARD Gates (must pass)

- [ ] **Valid JSON-LD**: Passes Google Rich Results Test (or manual JSON validation)
- [ ] **Required fields**: All required properties for the schema type are present
- [ ] **Accurate data**: Phone, email, address, geo coordinates match business reality
- [ ] **No duplicate schemas**: Only one instance of each schema type per page
- [ ] **Type check**: `npx tsc --noEmit` passes after changes to `lib/structured-data.ts`

### SOFT Gates

- [ ] **Enhanced properties**: Optional but valuable properties included (priceRange, areaServed, knowsAbout)
- [ ] **Social profiles**: sameAs links to LinkedIn, Instagram, Facebook

---

## Redirect / Kill Actions

### HARD Gates (must pass)

- [ ] **Escalation check**: `/services/*` and `/solutions/*` pages require Jayson's approval
- [ ] **Traffic check**: Page has < 5 clicks/28d in GSC (don't kill pages with traffic)
- [ ] **Redirect target**: 301 points to the most relevant surviving page
- [ ] **Internal link cleanup**: All internal links pointing to the old URL are updated
- [ ] **Sitemap update**: Old URL removed from `app/sitemap.ts`

---

## Post-Verification

After all gates pass:

1. Log the action as complete in `seo-engine-state.json`
2. Record the expected outcome and measurement date
3. If any SOFT gates failed, note them as follow-up items in `todo.md`
4. Move to the next action
