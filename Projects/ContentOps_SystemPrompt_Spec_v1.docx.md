  
**JHR ENTERPRISES  |  IMPACT CONSULTING**

**ContentOps Engine**

System Prompt Specification & Tool-Stack Integration Manual

**PROPRIETARY OPERATING DOCUMENT**

Version 1.0  |  March 2026  |  CONFIDENTIAL

Jayson Rivas  |  Owner, JHR Photography  |  Impact Consulting

# **1\. Purpose of This Document**

This document governs the generation layer of ContentOps Engine. It defines: the three-phase pipeline that runs before, during, and after every article; how Perplexity, Apify, and Playwright integrate into that pipeline; the exact system prompt architecture passed to the Claude API; and the hard rules for external backlinks and internal links that must be present in every article published.

| Proprietary IP Notice This document is the IP core of ContentOps Engine. The system prompt architecture, research integration workflow, and link specification framework contained here are proprietary methodologies developed by JHR Enterprises / Impact Consulting. This is what differentiates ContentOps from off-the-shelf AI writing tools. |
| :---- |

# **2\. Research Basis: What the Data Says**

The following findings from current SEO and GEO research (2025-2026) directly inform the design of ContentOps Engine's content standards. These are not preferences. They are embedded into every system prompt.

## **2.1  Backlink Intelligence**

| Finding | Implication for ContentOps |
| :---- | :---- |
| **Quality \> Quantity** | Google's SpamBrain AI now distinguishes earned links from manufactured ones. One link from a site that appears in a Perplexity answer outperforms 10 links from high-DR sites with no readership. |
| **Editorial Placement** | Contextual backlinks embedded in article body copy carry more weight than sidebar or footer links. ContentOps targets in-body outbound citation for all link placements. |
| **Linkable Asset Types** | Original research, statistics hubs, comprehensive guides, named frameworks, and expert roundups earn the highest natural backlink rates. Every ContentOps article is structured to be a citable resource. |
| **Co-Citation Effect** | Being mentioned alongside authoritative brands in the same article builds entity authority even without a direct backlink. Outbound citations to industry authorities create association proximity. |
| **Link Rot Reality** | 66.5% of links built 2013-2024 are now dead (Ahrefs data). ContentOps prioritizes linking to institutional sources, association sites, and government domains that have long-term URL stability. |
| **AI Citation \= Link Proxy** | A site that appears in a Perplexity or ChatGPT answer has de facto authority. Earning citations in AI responses now correlates with earning editorial backlinks from sites using AI for research. |

## **2.2  GEO Intelligence**

| Finding | Implication for ContentOps |
| :---- | :---- |
| **LLMs Cite 2-7 Domains** | Unlike Google's 10 blue links, AI answers cite a narrow set of sources. Winner-takes-most dynamics mean early authority moats compound permanently. |
| **Statistics Addition** | Princeton/Georgia Tech research: adding statistics improves GEO visibility by 41% on position-adjusted word count. Every article must include a minimum of 3 data-backed claims. |
| **Quotation Addition** | Adding cited expert quotations improves GEO subjective impression score by 28%. Articles should include at least 1 attributed expert or industry source quote per 400 words. |
| **Quick Answer Block** | Opening every page with a 40-80 word direct answer dramatically increases AI extraction probability. This is non-negotiable in ContentOps output structure. |
| **Recency Signal** | LLMs favor the most recent version of an article matching a query. ContentOps articles include explicit publication dates and are built for refresh cycles. |
| **AI Traffic Surge** | AI-referred web sessions grew 527% between January and May 2025 (Previsible). GEO is not future-proofing. It is present-tense revenue. |

# **3\. The Three-Phase Content Pipeline**

Every ContentOps article runs through three sequential phases. Skipping any phase degrades both link quality and GEO citability. The tool stack integration is distributed across all three phases.

## **Phase 1: Research (Pre-Generation)**

| Phase 1 Summary Inputs: topic, ICP tag, primary keyword. Outputs: research payload JSON passed to Claude API. Tools: Perplexity Sonar API, Apify. |
| :---- |

### **Step 1.1 — Perplexity Research Call**

Before calling Claude, ContentOps calls the Perplexity Sonar API with a structured research prompt. The response provides: current statistics relevant to the topic, authoritative source URLs that Claude will use as outbound citation targets, and recent industry developments that prevent Claude from hallucinating outdated data.

| // Perplexity Sonar API call — Phase 1 const perplexityPayload \= {   model: "sonar-pro",   messages: \[{     role: "system",     content: "You are a research assistant. Return only structured JSON."   }, {     role: "user",     content: buildResearchPrompt(topic, icp, primaryKeyword)   }\],   return\_citations: true,   search\_recency\_filter: "year" } |
| :---- |

### **Step 1.2 — Research Prompt Template**

The research prompt passed to Perplexity is structured to extract exactly what Claude needs to write a linkable, GEO-optimized article:

| Research the topic: \[TOPIC\] Target audience: \[ICP\_DESCRIPTION\] Primary keyword: \[PRIMARY\_KEYWORD\] Return JSON with exactly these fields: {   "currentStats": \[     { "stat": "string", "source": "string", "url": "string", "year": 2025 }     // minimum 4 stats with specific numbers and attributable sources   \],   "authorityLinks": \[     { "title": "string", "url": "string", "domainType": "trade|gov|research|association" }     // minimum 5 linkable sources; prioritize stable institutional URLs   \],   "expertQuotes": \[     { "quote": "string", "attribution": "string", "context": "string" }     // optional but preferred; 1-2 attributed expert perspectives   \],   "relatedQuestions": \["string"\],  // top 5 questions people ask about this topic   "competitorUrls": \["string"\]     // top 3 ranking URLs for primary keyword } |
| :---- |

### **Step 1.3 — Apify Competitor Scrape**

Apify scrapes the top 3 competitor URLs returned by Perplexity. The scrape extracts: word count, heading structure, external links used, and subheadings. This data is added to the research payload so Claude can identify gaps and structure a more comprehensive article.

| // Apify web scraper call const apifyResult \= await apifyClient.actor('apify/web-scraper').call({   startUrls: perplexityData.competitorUrls.map(url \=\> ({url})),   pageFunction: async ({ page, request }) \=\> {     return {       url: request.url,       wordCount: document.body.innerText.split(' ').length,       headings: Array.from(document.querySelectorAll('h1,h2,h3'))                      .map(h \=\> h.innerText),       externalLinks: Array.from(document.querySelectorAll('a\[href^="http"\]'))                           .map(a \=\> ({ text: a.innerText, href: a.href }))                           .filter(l \=\> \!l.href.includes(request.loadedUrl)),     }   } }) |
| :---- |

## **Phase 2: Generation (Claude API Call)**

| Phase 2 Summary Inputs: research payload from Phase 1, ICP system prompt, link rules, output schema. Outputs: full article payload JSON written to DynamoDB. Tools: Claude API (claude-sonnet-4-20250514). |
| :---- |

Phase 2 assembles the master generation call to Claude. The system prompt is built from four layers stacked in sequence. The research payload from Phase 1 is injected into the user message alongside the topic. Claude is instructed to return a structured JSON payload conforming to the ContentOps output schema.

### **The Four System Prompt Layers**

| Layer | Name | Content |
| :---- | :---- | :---- |
| Layer 1 | Identity & Authority | Establishes the author voice: expert Nashville corporate photographer, named domain authority, experience signals. Sets E-E-A-T foundation for GEO citability. |
| Layer 2 | ICP Context | Injects ICP-specific buyer psychology, pain points, language patterns, and decision-making context. Ensures article speaks directly to the target buyer. |
| Layer 3 | SEO \+ GEO Directives | Explicit structural rules: Quick Answer block, heading hierarchy, keyword placement, FAQ format, schema requirements, statistics density, GEO quotability rules. |
| Layer 4 | Link Rules | Hard specifications for external backlinks (minimum 4\) and internal links (minimum 2). Source requirements, anchor text rules, placement rules. See Section 5\. |

# **4\. The Master System Prompt**

The following is the full system prompt template passed to Claude on every article generation call. Variables in \[BRACKETS\] are replaced at runtime by the ContentOps runner. This prompt is the proprietary core of the system.

## **4.1  Layer 1: Identity**

| You are a senior corporate event photography expert writing for JHR Photography, a Nashville-based premium event photography firm. You have 15+ years of experience photographing Fortune 500 conferences, national trade shows, corporate headshot activations, and executive portrait sessions across Music City and major convention markets nationwide. Your writing voice is: \- Direct and confident. Never hedge. Never use filler transitions. \- Practitioner, not theorist. You write from operational experience. \- Information-dense. Every paragraph earns its place. \- Nashville-specific where relevant. Music City Center, Gaylord Opryland,   Renaissance Hotel are familiar territory. Prohibited phrases: 'seamlessly', 'leverage' (as verb), 'at the end of the day', 'world-class', 'synergy', 'empower', 'holistic'. Signature services to reference where relevant: \- Headshot Activation(TM) \- Executive Imaging(TM) \- Corporate Event Coverage(TM) \- Trade-Show Media Services(TM) \- Execution Confidence Model(TM) |
| :---- |

## **4.2  Layer 2: ICP Context Injection**

The ICP block is dynamically selected based on the icpTag parameter. All four templates are maintained in the ContentOps prompt library. Example for ICP-2:

| // ICP-2: Enterprise Marketing, Training & Operations Leaders TARGET READER: This article is written for in-house corporate marketing directors, L\&D managers, and operations leaders responsible for internal events: town halls, leadership summits, annual conferences, and training days. They own the event budget and are accountable to executives for professional output. THEIR PAIN POINTS: \- Fear of hiring the wrong vendor and looking bad to leadership \- No framework for evaluating photography quality before booking \- Last-minute coverage gaps when the primary vendor cancels \- Inability to articulate ROI of professional event documentation \- Need content that covers the event AND makes the comms team's job easier afterward THEIR LANGUAGE: They say: brand standards, deliverables, content library, stakeholder visibility, day-of execution, post-event assets, budget cycle. They do NOT say: 'beautiful photos', 'capture memories', 'artistic vision'. WRITE TO THEIR JOB, NOT THEIR EMOTIONS. |
| :---- |

## **4.3  Layer 3: SEO \+ GEO Structural Directives**

| ARTICLE STRUCTURE — FOLLOW EXACTLY: \[QUICK ANSWER BLOCK — REQUIRED\] Open the article with a 50-75 word paragraph that directly answers the primary question implied by the keyword. No preamble. Answer first. This block will be extracted by AI engines. Write it to stand alone. \[HEADING HIERARCHY\] H1: Primary keyword in first 5 words. 55-65 characters. H2: Minimum 4 H2 sections. Each H2 should answer a specific sub-question. H3: Use H3 for supporting subsections. At least 2 H3s in the article. Pattern: What Is X / Why X Matters / How To / What To Look For / FAQ \[KEYWORD PLACEMENT\] Primary keyword: title, first 100 words, at least 2 H2s, meta description. Semantic variants: distribute naturally throughout. No keyword stuffing. \[STATISTICS BLOCK — REQUIRED\] Include minimum 3 quantified claims with attribution. Use the stats from the research payload. Format: 'According to \[Source\], \[Specific Stat\].' Do not invent statistics. Use only provided research data. \[EXPERT VOICE / QUOTABLE DEFINITION — REQUIRED\] Include one proprietary definition of the core topic using JHR Photography terminology. This is the GEO-quotable anchor. Format: 'At JHR Photography, we define \[X\] as...' This phrase will be cited verbatim by AI engines. \[FAQ BLOCK — REQUIRED\] Minimum 5 Q\&A pairs at end of article. Questions should match natural language search queries and voice queries. Answers: 40-80 words each, complete answer in first sentence. Enable FAQPage schema. \[WORD COUNT\] Target: \[WORD\_COUNT\_TARGET\] words. Minimum 1,000. Maximum 1,800. \[CTA — REQUIRED\] Final paragraph: one direct call to action. Point to \[CTA\_PATH\]. No soft language. 'Schedule a Strategy Call' or 'View \[Service Page\]'. |
| :---- |

## **4.4  Layer 4: Link Rules (Embedded in System Prompt)**

The complete link specification is embedded directly in the system prompt so Claude cannot generate an article without complying. See Section 5 for the full link specification. The prompt injection is:

| LINK REQUIREMENTS — NON-NEGOTIABLE: EXTERNAL LINKS (minimum 4 required): Use the authorityLinks from the research payload. Requirements: \- Minimum 4 external links embedded in article body copy (not footer, not CTA) \- Links must point to: trade publications, industry associations, government sites,   research reports, or recognized industry databases \- Never link to direct competitors \- Anchor text must be descriptive and natural (not 'click here') \- At least 2 links in the first half of the article \- Each link must add information value — cite the source when using its data INTERNAL LINKS (minimum 2 required): Use the internalLinkMap provided. Requirements: \- Minimum 2 internal links to JHR Photography service pages \- Preferred targets: \[INTERNAL\_LINK\_MAP\] \- Anchor text must match the linked page's primary keyword \- Place naturally in context — not forced OUTPUT: In the article JSON payload, include a 'linkAudit' field listing all links used with their anchor text, URL, and type (external/internal). If you cannot reach the minimum of 4 external \+ 2 internal, return an error in the 'linkAuditStatus' field instead of publishing an incomplete article. |
| :---- |

# **5\. Link Specification: External & Internal**

Links are the single highest-leverage element of every article. They do three things simultaneously: signal authority to Google, create co-citation proximity with trusted sources for GEO, and provide genuine reader value. Every link decision is intentional.

## **5.1  External Backlink Rules**

| Hard Requirement MINIMUM: 4 external outbound links per article, embedded in body copy. This is a hard floor, not a suggestion. Articles that do not meet this standard are returned to DRAFT status and flagged for revision. |
| :---- |

| Rule | Specification |
| :---- | :---- |
| **Minimum Count** | 4 per article. Target 5-6 for high-priority keyword clusters. |
| **Placement** | Body copy only. Not in the CTA, not in the author bio, not in the footer. Contextual in-body links carry maximum weight. |
| **Distribution** | Minimum 2 links in the first half of the article. Do not cluster all links in one section. |
| **Source Priority Tier 1** | Trade associations: PCMA, MPI, ASAE, ILEA, NACE. Convention bureau sites: Nashville Convention & Visitors Corp. These are the highest-value citation partners. |
| **Source Priority Tier 2** | Research reports: Cvent industry data, Event Marketer benchmarks, BizBash trend reports. Government: BLS occupational data, SBA resources. |
| **Source Priority Tier 3** | Recognized industry publications: EventMarketer.com, Skift Meetings, Convene magazine, Successful Meetings. Academic or research institution studies. |
| **Never Link To** | Direct competitors. Generic aggregators without original data. Sites with DA under 30\. Paywalled content the reader cannot access. |
| **Anchor Text Rules** | Descriptive and contextual. Bad: 'click here', 'learn more', 'source'. Good: 'according to PCMA's 2025 meeting industry outlook', 'Nashville Convention & Visitors Corp data shows'. |
| **Perplexity Source Validation** | All external URLs returned by Perplexity research are pre-validated for relevance before injection into the Claude prompt. Apify scrape confirms the URL resolves and contains the cited data. |
| **Link Rot Monitoring** | Playwright runs a monthly health check on all published external links. Dead links are flagged for article refresh and replacement. |

## **5.2  Internal Link Rules**

| Hard Requirement MINIMUM: 2 internal links per article to JHR Photography service pages or venue pages. Internal links transfer authority to conversion pages. Every article should push authority toward revenue-generating pages. |
| :---- |

| Rule | Specification |
| :---- | :---- |
| **Minimum Count** | 2 per article. Target 3 for pillar articles in a cluster. |
| **Priority Targets** | Service pages: /services/corporate-event-coverage, /services/headshot-activation, /services/executive-imaging, /services/trade-show-media. Venue pages when geographically relevant. |
| **Secondary Targets** | Blog posts in the same ICP cluster. FAQ page. Schedule page (/schedule). About page when author credibility is the article's theme. |
| **Anchor Text** | Match the linked page's H1 or primary keyword. 'corporate event photography Nashville', 'headshot activation', 'executive imaging session'. |
| **Placement** | First internal link within first 400 words where natural. Second internal link in the final third of the article, near the CTA. |
| **Internal Link Map** | Maintained as a JSON config in ContentOps. Updated when new service pages or venue pages are added. Claude receives the current map at generation time. |

### **Current Internal Link Map (v1.0)**

| Path | Preferred Anchor Text | Target ICPs |
| :---- | :---- | :---- |
| /services/corporate-event-coverage | corporate event photography Nashville | ICP-1, ICP-2, ICP-4 |
| /services/headshot-activation | headshot activation | ICP-1, ICP-2, ICP-3 |
| /services/executive-imaging | executive imaging | ICP-2 |
| /services/trade-show-media | trade show photography | ICP-3 |
| /services/convention-media | convention media coverage | ICP-1, ICP-4 |
| /services/social-networking-media | event social media content | ICP-1, ICP-2 |
| /venues/music-city-center | Music City Center photography | ICP-1, ICP-4 |
| /venues/gaylord-opryland | Gaylord Opryland event photography | ICP-1, ICP-4 |
| /schedule | schedule a strategy call | All ICPs — CTA use |

# **6\. Tool Stack: Perplexity, Apify, Playwright**

| Tool | Phase | Primary Function |
| :---- | :---- | :---- |
| Perplexity Sonar API | Phase 1 Research | Real-time statistics gathering, authoritative source URL retrieval, related question mining, competitive gap identification. Returns structured JSON with citations. |
| Apify Web Scraper | Phase 1 \+ Phase 3 | Phase 1: competitor content audit (word count, headings, outbound links). Phase 3: link opportunity prospecting — finds resource pages linking to similar content for outreach targeting. |
| Playwright | Phase 3 Monitoring | Monthly link health check on all published external links. Detects 404s and redirects. Flags articles needing refresh. Future: outreach workflow automation for link reclamation. |

## **6.1  Perplexity Integration Detail**

Perplexity's Sonar API is the research-grounding layer that prevents AI hallucination and provides citable data that makes articles linkable assets. The API key is stored in AWS Secrets Manager. The call is made before the Claude API call on every article.

| Parameter | Value |
| :---- | :---- |
| **API Endpoint** | https://api.perplexity.ai/chat/completions |
| **Model** | sonar-pro (deep research) for new articles; sonar (fast) for batch runs |
| **search\_recency\_filter** | year — ensures statistics are current and not outdated |
| **return\_citations** | true — Perplexity returns source URLs alongside claims |
| **Max Tokens** | 2,000 — research payload is concise structured JSON, not prose |
| **Rate Limiting** | Implemented via Redis queue. Respects Perplexity tier limits for batch runs. |
| **Fallback** | If Perplexity call fails, ContentOps logs error and pauses batch. Does not proceed with Claude call on zero research data. |

## **6.2  Apify Integration Detail**

Apify handles two distinct functions: Phase 1 competitor scraping (pre-generation) and Phase 3 link prospecting (post-publication). Both use Apify's hosted actor system.

### **Phase 1 Actor: Web Content Scraper**

| Actor: apify/web-scraper (or cheerio-scraper for speed) Input: Top 3 competitor URLs from Perplexity research Output: {   wordCount: number,   h2Headings: string\[\],   externalLinks: \[{text, href, domain}\],   estimatedReadTime: number } Use: Passed to Claude as 'competitorContext' in research payload. Claude uses this to exceed competitor depth and fill coverage gaps. |
| :---- |

### **Phase 3 Actor: Resource Page Prospector**

| Actor: Custom actor OR apify/google-search-scraper Query patterns:   'intitle:resources corporate event photography'   'intitle:"helpful links" conference photography'   '\[topic\] \+ resources site:associationname.org' Output: List of resource pages with contact context Use: Feeds outreach queue for link acquisition campaigns.      Playwright automates the initial contact logging step. |
| :---- |

## **6.3  Playwright Integration Detail**

Playwright currently handles two functions: monthly link health monitoring across all published articles, and future outreach workflow automation. Both run as scheduled Lambda functions triggered by EventBridge.

| // Monthly link health check — runs via AWS Lambda \+ EventBridge const { chromium } \= require('playwright'); const browser \= await chromium.launch(); for (const article of publishedArticles) {   for (const link of article.linkAudit) {     const page \= await browser.newPage();     const response \= await page.goto(link.url, { timeout: 10000 });     if (\!response || response.status() \>= 400\) {       await flagDeadLink(article.slug, link.url, response?.status());     }     await page.close();   } } // Dead links trigger DynamoDB update: article.linkHealth \= 'REVIEW\_NEEDED' // Dashboard surfaces flagged articles for editor attention |
| :---- |

# **7\. Complete Output Payload Schema**

Every Claude API call returns a structured JSON payload. Claude is instructed to return only this JSON — no prose preamble, no markdown fences. ContentOps validates every field before writing to DynamoDB.

| {   "title":            "string — 55-65 chars, primary keyword in first 5 words",   "slug":             "string — hyphenated, no stop words, max 70 chars",   "metaTitle":        "string — 50-60 chars",   "metaDescription":  "string — 140-160 chars, includes primary keyword",   "excerpt":          "string — 150-200 chars, first 2 sentences of quick answer",   "quickAnswer":      "string — 50-75 word direct answer block",   "body":             "string — full article in markdown",   "wordCount":        "number",   "readTime":         "number — estimated minutes",   "icpTag":           "ICP-1 | ICP-2 | ICP-3 | ICP-4",   "primaryKeyword":   "string",   "secondaryKeywords":"string\[\]",   "faqBlock": \[     { "question": "string", "answer": "string — 40-80 words, direct first sentence" }     // minimum 5 Q\&A pairs   \],   "linkAudit": \[     { "anchor": "string", "url": "string", "type": "external|internal",       "placement": "body|cta", "tier": "1|2|3|internal" }     // all links documented here   \],   "linkAuditStatus":  "PASS | FAIL — INSUFFICIENT\_EXTERNAL | FAIL — INSUFFICIENT\_INTERNAL",   "externalLinkCount":"number — must be \>= 4",   "internalLinkCount":"number — must be \>= 2",   "schemaMarkup": {     "Article":  { "datePublished": "", "author": "", "publisher": "" },     "FAQPage":  { "mainEntity": \[\] }   },   "openGraph": {     "ogTitle": "string", "ogDescription": "string", "ogImage": "string"   },   "publishedAt":      "ISO 8601 timestamp",   "status":           "DRAFT",   "researchSources":  "string\[\] — Perplexity source URLs used in research phase" } |
| :---- |

# **8\. Validation & Quality Gates**

Before any article is written to DynamoDB, ContentOps runs a validation pass against the output payload. Articles that fail any hard gate are returned to DRAFT and flagged. They are never auto-published in a failed state.

| Gate | Condition | Action |
| :---- | :---- | :---- |
| External Links | externalLinkCount \< 4 | HARD FAIL — article held in DRAFT, flagged for revision |
| Internal Links | internalLinkCount \< 2 | HARD FAIL — article held in DRAFT, flagged for revision |
| Word Count | wordCount \< 900 | HARD FAIL — too thin for GEO citability |
| Quick Answer | quickAnswer missing or \> 90 words | HARD FAIL — GEO extraction anchor missing |
| FAQ Block | faqBlock.length \< 5 | HARD FAIL — FAQPage schema requires minimum entries |
| Meta Description | length \< 140 or \> 160 | SOFT FAIL — flagged for review, can publish |
| Slug Format | contains spaces or uppercase | HARD FAIL — URL structure broken |
| Link Audit Status | 'FAIL' string present | HARD FAIL — link requirements not met |
| Stat Count | \< 3 statistics in body | SOFT FAIL — GEO score penalty, flagged |
| Keyword in Title | primaryKeyword not in title | HARD FAIL — SEO foundation broken |

# **9\. Content Types Engineered for Backlink Acquisition**

Not all articles are equal from a backlink acquisition standpoint. ContentOps uses five article archetypes. Each is designed to attract a specific type of inbound link. The research findings confirm these formats earn the highest natural link rates.

| Article Type | Example Title | Backlink Strategy |
| :---- | :---- | :---- |
| Statistics Hub | Nashville Corporate Event Photography Statistics 2026 | Target: 50-75 data points with attributed sources. Ranks for '\[topic\] \+ statistics' keywords. Journalists, bloggers, and AI engines link to these as primary data sources. Build 3-5 of these per year and submit initial links manually to seed authority. |
| Ultimate Guide | The Complete Guide to Hiring a Corporate Event Photographer in Nashville | Comprehensive, 1,600-1,800 words, covers every question. Designed to be the definitive reference. Earns editorial links from vendor directories, association sites, and event planning blogs. Repurpose into pillar content. |
| Original Data / Benchmark | How Much Does Corporate Event Photography Cost in Nashville? (2026 Pricing Data) | Publish proprietary pricing context based on market knowledge. Others cite pricing data. Journalists need cost anchors. High link magnetism for local and industry searches. |
| Named Framework | The Execution Confidence Model: A Photographer Evaluation Framework for Enterprise Event Teams | Proprietary methodology with a name. Once an AI engine learns a named framework, it cites the originating source repeatedly. Build frameworks for each ICP. These compound over time. |
| Expert Roundup / Comparison | Best Corporate Event Photography Tips from 12 Event Planners | Participants link back. Co-citation with event industry professionals builds entity proximity. Use Perplexity to identify the right contributors to approach. |

# **10\. Batch Configuration Reference**

The contentops.config.json schema for batch runs. Both CLI and dashboard modes generate and validate this config before execution begins.

| {   "batchId":           "string — UUID, auto-generated",   "runMode":           "batch | single",   "topics": \[     {       "topic":          "string",       "primaryKeyword": "string",       "icpTag":         "ICP-1 | ICP-2 | ICP-3 | ICP-4",       "articleType":    "statistics-hub | ultimate-guide | pricing-data | framework | roundup | standard",       "wordCountTarget":"number (1000-1800)",       "ctaPath":        "/schedule | /services/\[slug\]"     }   \],   "globalSettings": {     "geoOptimize":      true,     "includeSchema":    \["Article", "FAQPage"\],     "minExternalLinks": 4,     "minInternalLinks": 2,     "runPerplexity":    true,     "runApify":         true,     "autoPublish":      false   },   "outputPath":        "./drafts/",   "notifyOnComplete":  "email | slack | none" } |
| :---- |

# **11\. GEO Scoring Rubric**

ContentOps runs a secondary Claude API call after generation to score each article's GEO quotability before it is written to DynamoDB. Articles scoring below 70 are held in DRAFT and returned with specific improvement notes.

| GEO Signal | Max Score | Scoring Guide |
| :---- | :---- | :---- |
| Quick Answer Block | 20 pts | 0 \= absent. 10 \= present but \> 90 words or buried. 20 \= 50-75 words, opens article, answers directly. |
| Statistics Density | 20 pts | 0 \= no stats. 10 \= 1-2 stats. 15 \= 3 stats. 20 \= 4+ stats, each attributed with source. |
| Quotable Definition | 15 pts | 0 \= absent. 10 \= generic definition. 15 \= branded JHR definition with proprietary framing. |
| Heading Structure | 15 pts | 0 \= flat. 8 \= some H2s. 15 \= H2s answer questions, match LLM query patterns (What/How/Why/When). |
| Named Entity Density | 10 pts | 0 \= generic. 5 \= Nashville mentioned. 10 \= Nashville \+ specific venues \+ JHR Photography \+ trademark names. |
| External Citations | 10 pts | 0 \= no outbound links. 5 \= 1-3 Tier-2 sources. 10 \= 4+ sources including Tier-1 authority. |
| FAQ Quality | 10 pts | 0 \= absent. 5 \= 3-4 generic FAQs. 10 \= 5+ specific questions matching real search queries. |

| Scoring Thresholds GEO Score threshold: 70/100 minimum for DRAFT-to-PUBLISHED promotion. Articles scoring 85+ are flagged as 'High GEO Priority' for manual link acquisition outreach through Apify/Playwright workflow. |
| :---- |

# **Document Control**

| Field | Value |
| :---- | :---- |
| **Document Title** | ContentOps Engine — System Prompt Specification v1.0 |
| **Author** | Jayson Rivas, Owner, JHR Photography / Impact Consulting |
| **Date** | March 2026 |
| **Status** | ACTIVE — Working Document |
| **Classification** | CONFIDENTIAL — JHR Enterprises Proprietary IP |
| **Companion Document** | ContentOps Engine PRD v1.0 |
| **Next Review** | Phase 1 Completion |

Jayson Rivas  |  Owner, JHR Photography  |  Impact Consulting