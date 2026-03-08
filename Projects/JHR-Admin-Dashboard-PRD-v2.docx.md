

**PRODUCT REQUIREMENTS DOCUMENT  ·  V2.0**

**JHR Photography**

Admin Performance & Analytics Dashboard

*SEO  ·  Core Web Vitals  ·  GEO  ·  Social  ·  Lead Intelligence via Notion CRM*

| Document Type | Product Requirements Document (PRD) |
| :---- | :---- |
| **Version** | 2.0 — All integrations confirmed and architecture finalized |
| **Date** | March 2026 |
| **Owner** | Jayson Rivas, Owner — JHR Photography / Impact Consulting |
| **Deployment** | AWS Amplify (live) — jhr-photography.com |
| **Backend Stack** | Next.js 14+ · TypeScript · Tailwind CSS · App Router |
| **CRM** | Notion — ALL lead data flows into Notion (MCP connector available) |
| **Social Auth** | Meta Graph API — Instagram Business account CONFIRMED \+ keys available |
| **Video** | YouTube Data API v3 — Active channel \+ Google Cloud permissions ACTIVE |
| **Analytics** | GA4 · Google Search Console · PSI API · BigQuery (permissions active) |
| **Auth Model** | NextAuth.js v5 — Google OAuth (protected /admin route) |
| **Scheduler** | AWS EventBridge — replaces Google Cloud Scheduler for cron jobs |
| **Secrets Mgmt** | AWS Secrets Manager \+ Amplify Environment Variables |
| **Agent Ref Files** | Load into /mnt/user-data/uploads/ — agents will read on task execution |

**Integration Confirmation Status**

| ✅ | CONFIRMED | Integration confirmed by owner — build immediately |
| :---: | :---- | :---- |
| 📁 | **REF FILE PENDING** | Credential/config file to be loaded into /mnt/user-data/uploads/ before agent executes |
| ⚙️ | **CONFIG REQUIRED** | One-time configuration step required during build — instructions included in section |

**01  PRODUCT OVERVIEW**

*What we're building, why it matters, and the confirmed technical context*

## **1.1  Purpose**

JHR Photography's website is the primary lead generation asset for a premium Nashville B2B photography company serving corporate events, conferences, trade shows, and conventions. The site recently migrated from WordPress to Next.js on AWS Amplify — creating a temporary visibility gap that needs active monitoring, diagnosis, and continuous improvement to close.

This admin dashboard gives Jayson a single, private morning view that answers one question: 'Is the site performing better as a lead machine than it was yesterday?' It combines technical performance data, SEO health signals, AI/GEO visibility metrics, social media reach, and lead conversion data pulled directly from Notion — into one unified interface with zero manual data entry.

| Confirmed Technical Foundation — Build on This ✅  Deployment:  AWS Amplify (live at jhr-photography.com) — all scheduling via AWS EventBridge ✅  CRM:         Notion — all form submissions route to Notion; lead data pulled via Notion API ✅  Instagram:   Business Account confirmed \+ Meta Graph API keys available in reference file ✅  YouTube:     Active channel \+ Google Cloud Analytics permissions already provisioned ✅  GA4/GSC:     Google Cloud project active with analytics permissions configured 📁  Ref Files:   Meta API keys, YouTube credentials, Notion token — load to /mnt/user-data/uploads/ This PRD is fully actionable. No open questions remain. Agents can begin Phase 1 immediately. |
| :---- |

## **1.2  What Changed in v2.0**

| Decision Area | v1.0 (Assumption) | v2.0 (Confirmed) | Impact on Build |
| :---- | :---- | :---- | :---- |
| Deployment Platform | Vercel or Cloud Run | AWS Amplify (live) | Cron → AWS EventBridge; secrets → AWS Secrets Manager \+ Amplify Env Vars |
| Lead / Form Data | Supabase (PostgreSQL) | Notion CRM (confirmed) | Lead module pulls from Notion API; no database build needed for lead log |
| Instagram Auth | Setup required | Keys ready in ref file | Skip OAuth setup; wire existing credentials directly |
| YouTube Channel | Unknown | Active \+ GCP permissions live | Skip channel creation; wire to existing property immediately |
| Google Analytics | Setup needed | GCP project \+ permissions active | Skip GCP project creation; confirm property IDs and begin integration |

## **1.3  Success Metrics — 90-Day Targets**

| KPI | Baseline (Now) | Target (30 Days) | Target (90 Days) |
| :---- | :---- | :---- | :---- |
| Google Search Console Clicks/mo | \~0 (migration gap) | 150+ | 750+ |
| Indexed Pages (new URL structure) | \<5 | 25+ | 55+ |
| PSI Performance Score (Desktop) | No CrUX data | 90+ | 95+ |
| Core Web Vitals — LCP | No field data | \< 2.5s | \< 1.8s |
| Form Leads/mo (via Notion) | Baseline from Notion | \+30% | \+100% |
| Instagram Reach/mo | Pull from Graph API | \+25% | \+75% |
| YouTube Views/mo | Pull from YT API | Baseline established | \+40% |
| GEO Readiness Score | Not tracked | 50/100 | 80/100 |
| Notion Lead Pipeline Value | Baseline from CRM | \+20% | \+60% |

**02  CONFIRMED SYSTEM ARCHITECTURE**

*AWS Amplify deployment, data flows, and service topology*

## **2.1  High-Level Architecture — AWS Amplify Edition**

| Data Flow — End to End (Confirmed Stack) EXTERNAL APIs                      NEXT.JS API ROUTES (Amplify)              ADMIN FRONTEND ──────────────────────────────────────────────────────────────────────────────────────────── PSI API ─────────────────────→  /api/admin/psi             ──────→  Performance Module Google Search Console API ───→  /api/admin/gsc             ──────→  SEO Intelligence GA4 Data API ────────────────→  /api/admin/ga4             ──────→  Lead Intelligence Meta Graph API ──────────────→  /api/admin/social/meta     ──────→  Social Module (IG \+ FB) YouTube Data API v3 ─────────→  /api/admin/social/youtube  ──────→  Social Module (YT) Notion API ──────────────────→  /api/admin/notion          ──────→  Lead Intelligence Claude API ──────────────────→  /api/admin/insights        ──────→  AI Recommendations         ↓ (all data written nightly) AWS EventBridge (cron: 6am CT daily)         → triggers /api/admin/cron/refresh (protected endpoint)         → fetches all APIs → writes to BigQuery BigQuery (jhr\_analytics dataset) ← read back for 30d/90d trend charts Notion CRM ← lead data lives here natively (no duplicate storage needed) |
| :---- |

## **2.2  AWS Amplify — Configuration Requirements**

| Amplify Environment Variables — Full List Set in: AWS Amplify Console → App Settings → Environment Variables \# Auth NEXTAUTH\_URL=https://jhr-photography.com NEXTAUTH\_SECRET=\[generate with: openssl rand \-base64 32\] \# Google APIs (GCP project already active) GOOGLE\_CLIENT\_ID=\[from GCP Console → OAuth 2.0 Credentials\] GOOGLE\_CLIENT\_SECRET=\[from GCP Console → OAuth 2.0 Credentials\] GOOGLE\_API\_KEY=\[PSI API key — restrict to PageSpeed Insights API\] GSC\_PROPERTY\_URL=https://jhr-photography.com GA4\_PROPERTY\_ID=\[from Google Analytics → Property Settings\] BIGQUERY\_PROJECT\_ID=jhr-analytics BIGQUERY\_SERVICE\_ACCOUNT=\[JSON key, base64-encoded for Amplify\] \# Meta / Instagram (keys in reference file — load to /mnt/user-data/uploads/) META\_APP\_ID=\[from reference file\] META\_APP\_SECRET=\[from reference file\] META\_PAGE\_ACCESS\_TOKEN=\[long-lived token from reference file\] IG\_BUSINESS\_USER\_ID=\[from reference file\] \# YouTube (GCP permissions already active) YOUTUBE\_CHANNEL\_ID=\[YouTube Studio → About → Share → Copy Channel ID\] YOUTUBE\_API\_KEY=\[create in GCP Console → API Key, restrict to YouTube Data API v3\] \# Notion (CRM integration) NOTION\_TOKEN=\[Notion → Settings → Integrations → Internal Integration Token\] NOTION\_LEADS\_DB\_ID=\[Notion → Lead database → Share → Copy link → extract ID\] NOTION\_CONTACTS\_DB\_ID=\[Notion → Contacts database ID if separate\] \# Claude API (weekly recommendations) ANTHROPIC\_API\_KEY=\[console.anthropic.com → API Keys\] |
| :---- |

## **2.3  AWS EventBridge — Cron Job Setup**

| Replacing Cloud Scheduler — AWS EventBridge Configuration Purpose: Trigger daily data refresh at 6:00 AM Central Time Step 1: AWS Console → EventBridge → Create Rule   Name: jhr-dashboard-daily-refresh   Schedule: cron(0 11 \* \* ? \*)  \[11:00 UTC \= 6:00 AM CT\] Step 2: Target → API destination → HTTPS endpoint   URL: https://jhr-photography.com/api/admin/cron/refresh   Method: POST   Header: Authorization: Bearer {CRON\_SECRET}  \[stored in Amplify env vars\] Step 3: The /api/admin/cron/refresh route:   \- Verifies CRON\_SECRET header (prevents unauthorized triggers)   \- Calls all 6 data APIs in parallel   \- Writes results to BigQuery   \- Fires any threshold alerts   \- Triggers Claude weekly recommendation (Mondays only) Cost: EventBridge free tier \= 14 million events/month. This costs $0. |
| :---- |

## **2.4  Route Architecture — Next.js App Router**

| Complete /admin Route Tree app/   (admin)/     layout.tsx                 ← Auth guard: checks NextAuth session; redirects to /api/auth/signin     admin/       page.tsx                ← Module 1: Command Center (morning brief)       performance/         page.tsx              ← Module 2: Core Web Vitals \+ PSI scores       seo/         page.tsx              ← Module 3: SEO Intelligence (GSC \+ schema)         \[slug\]/page.tsx       ← Per-page SEO drill-down       geo/         page.tsx              ← Module 4: GEO readiness \+ citation log       social/         page.tsx              ← Module 5: Instagram \+ Facebook \+ YouTube       leads/         page.tsx              ← Module 6: Lead Intelligence (Notion CRM data)         \[id\]/page.tsx         ← Individual lead detail from Notion       alerts/         page.tsx              ← Module 7: Active alerts \+ AI recommendations       settings/         page.tsx              ← API connections, keyword list, alert thresholds api/admin/   psi/route.ts                ← PSI API proxy   gsc/route.ts                ← Google Search Console API   ga4/route.ts                ← GA4 Data API   social/meta/route.ts        ← Meta Graph API (IG \+ FB)   social/youtube/route.ts     ← YouTube Data API v3   notion/leads/route.ts       ← Notion API — lead pipeline   notion/contacts/route.ts    ← Notion API — contact records   insights/route.ts           ← Claude API — weekly recommendations   cron/refresh/route.ts       ← EventBridge trigger endpoint |
| :---- |

**03  DATA SOURCES & API INTEGRATIONS**

*Detailed specification for every data feed — with confirmed credential status*

## **3.1  Integration Status Matrix**

| Integration | Status | Credential Source | Data Pulled | Refresh |
| :---- | :---- | :---- | :---- | :---- |
| PageSpeed Insights API | ✅ Confirmed | GCP project (active) | Lab scores, CWV, opportunities | On-demand \+ daily |
| Google Search Console | ✅ Confirmed | GCP / OAuth (active) | Clicks, impressions, position, index | Daily (24hr lag) |
| GA4 Data API | ✅ Confirmed | GCP / OAuth (active) | Sessions, conversions, source/medium | Daily |
| BigQuery | ✅ Confirmed | GCP Service Account (active) | Long-term trend storage | Daily write |
| Meta Graph API (IG \+ FB) | ✅ Confirmed | Ref file 📁 | Reach, followers, engagement, clicks | Daily |
| YouTube Data API v3 | ✅ Confirmed | GCP (active) \+ ref file 📁 | Views, subs, watch time, top videos | Daily |
| Notion API (CRM) | ✅ Confirmed | Notion integration token | Lead records, pipeline, contacts | Real-time \+ daily |
| Claude API | ✅ Ready | ANTHROPIC\_API\_KEY | Weekly AI recommendations | Weekly (Monday) |
| Bing Webmaster / IndexNow | ⚙️ Configure | Bing WMT account needed | Index status, crawl errors | Daily |

## **3.2  Google PageSpeed Insights API**

The PSI API runs a Lighthouse audit and returns Lab data (simulated Lighthouse) and Field data (CrUX — real user percentiles). The site currently shows 'No CrUX Data' due to insufficient traffic volume. The dashboard will track when field data becomes available and alert when it does — a milestone that signals meaningful organic traffic growth.

| PSI API — Implementation Detail Endpoint: GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed   ?url=https://jhr-photography.com   \&key={GOOGLE\_API\_KEY}   \&strategy=desktop  (run separately for mobile)   \&category=performance\&category=accessibility\&category=best-practices\&category=seo Key response fields to extract:   lighthouseResult.categories.performance.score × 100 \= Performance Score   lighthouseResult.audits\['largest-contentful-paint'\].displayValue \= LCP   lighthouseResult.audits\['cumulative-layout-shift'\].displayValue \= CLS   lighthouseResult.audits\['total-blocking-time'\].displayValue \= TBT   lighthouseResult.audits\['first-contentful-paint'\].displayValue \= FCP   lighthouseResult.audits\['speed-index'\].displayValue \= Speed Index   loadingExperience.overall\_category \= FAST | AVERAGE | SLOW (CrUX field)   loadingExperience.metrics \= actual CrUX percentile data (when available) Run both desktop and mobile versions. Store separately in BigQuery. Rate limit: free, but cache results — don't run more than once per hour per URL. Recommended: run on-demand via button \+ automatic daily via EventBridge cron. |
| :---- |

## **3.3  Google Search Console API**

| GSC API — Endpoints, Scopes, and Key Queries OAuth Scope: https://www.googleapis.com/auth/webmasters.readonly Endpoint 1: Search Analytics   POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query   Body: { startDate, endDate, dimensions: \['query','page','device'\], rowLimit: 1000 }   → Returns: query string, page URL, device, clicks, impressions, ctr, position Endpoint 2: URL Inspection (index status per URL)   POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect   Body: { inspectionUrl, siteUrl }   → Returns: indexingState (INDEXING\_ALLOWED|BLOCKED), robotsTxtState, crawledAs   Use for: checking whether new service/venue pages are indexed Endpoint 3: Sitemaps   GET https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps   → Returns: submitted sitemaps with lastDownloaded, isPending, warnings, errors Key dashboard queries to pre-configure:   1\. Last 7 days: top 50 queries by clicks — detect rank shifts   2\. Last 28 days: all pages with impressions \> 0 — full coverage map   3\. Per tracked keyword: fetch position history (run daily, store in BQ)   4\. New vs returning URLs in index — detect de-indexing events |
| :---- |

## **3.4  Notion API — Lead Intelligence (PRIMARY CRM)**

All form submissions from jhr-photography.com route directly to Notion. This is the authoritative source of truth for leads. The dashboard pulls from Notion instead of maintaining a separate database — eliminating data duplication and keeping the CRM as the single record of truth.

| Notion API — Integration Architecture for Lead Intelligence Auth: Internal Integration Token (NOTION\_TOKEN)   → Create at: notion.so/my-integrations → New Integration → select JHR workspace   → Grant access to the Leads database in Notion (share database with integration) Core Endpoint: POST https://api.notion.com/v1/databases/{NOTION\_LEADS\_DB\_ID}/query   Headers: Authorization: Bearer {NOTION\_TOKEN}            Notion-Version: 2022-06-28 Filter for recent leads (last 30 days):   { "filter": { "property": "Created", "date": { "past\_month": {} } } } Expected Notion Lead Properties to map (adjust to actual DB schema):   Name / Company        → Lead identification   Lead Source           → organic / instagram / referral / direct / paid   Service Interest      → Corporate Event / Headshot Activation / Executive Imaging / etc.   Status                → New / Contacted / Proposal Sent / Booked / Closed-Lost   Inquiry Date          → for time-series trending   Event Date            → for pipeline forecasting   Estimated Value       → for pipeline dollar value   Form / Source Page    → which page triggered the inquiry 📁  Agent note: When reference files are loaded, extract the Notion integration token     and database IDs. Map the actual property names from the Notion schema. Dashboard views from Notion data:   • New leads (7d / 30d) with trend vs prior period   • Pipeline by status (Kanban-style count summary — not full Notion view)   • Lead source breakdown (pie/bar chart)   • Service interest breakdown (what are people inquiring about?)   • Estimated pipeline value (sum of Estimated Value for open leads)   • Avg time from inquiry to response (Inquiry Date → first status change) |
| :---- |

| Notion API — Rate Limits and Caching Notion API rate limit: 3 requests/second per integration token. Notion is NOT designed for high-frequency polling. Correct pattern: 1\. Daily sync: EventBridge cron at 6am CT → fetch all leads created/updated in last 48hrs    → write structured summary to BigQuery for trend charts 2\. On-demand: 'Refresh' button in dashboard → fresh Notion query → updates today's counts 3\. Cache: Store last Notion fetch response in Vercel KV or Upstash Redis (15-min TTL)    → dashboard reads from cache first, avoiding repeated Notion hits on page refresh Do NOT poll Notion in real-time or on every page load. |
| :---- |

## **3.5  Meta Graph API — Instagram Business (CONFIRMED)**

The JHR Photography Instagram account is confirmed as a Business account with Meta Graph API access. Credentials are available in a reference file to be loaded into the build directory. This section specifies exactly how to wire them up.

| Meta Graph API — Wiring Instructions (📁 Ref File Required) Reference file contains: META\_APP\_ID, META\_APP\_SECRET, PAGE\_ACCESS\_TOKEN, IG\_USER\_ID Step 1: Validate the existing access token   GET https://graph.facebook.com/debug\_token   ?input\_token={PAGE\_ACCESS\_TOKEN}\&access\_token={META\_APP\_ID}|{META\_APP\_SECRET}   → Check: is\_valid=true, expires\_at (if near expiry, regenerate) Step 2: Get Instagram Business User ID (confirm from ref file)   GET https://graph.facebook.com/me/accounts?access\_token={PAGE\_ACCESS\_TOKEN}   → Find Instagram Business Account ID from connected Page Step 3: Pull account-level insights   GET https://graph.facebook.com/{IG\_USER\_ID}/insights   ?metric=reach,impressions,profile\_views,website\_clicks   \&period=day\&since={7daysAgo}\&until={today}   \&access\_token={PAGE\_ACCESS\_TOKEN} Step 4: Pull recent media performance   GET https://graph.facebook.com/{IG\_USER\_ID}/media   ?fields=id,caption,media\_type,timestamp,like\_count,comments\_count   \&access\_token={PAGE\_ACCESS\_TOKEN}   → Then for each post: GET /{media\_id}/insights?metric=reach,impressions,saved Step 5: Token refresh strategy   Long-lived Page Access Tokens expire every 60 days.   Build a /api/admin/meta/refresh-token route that swaps the token monthly.   Store refreshed token in AWS Secrets Manager immediately. |
| :---- |

## **3.6  YouTube Data API v3 (ACTIVE CHANNEL \+ GCP PERMISSIONS CONFIRMED)**

JHR Photography has an active YouTube channel and Google Cloud Analytics permissions already provisioned. This section specifies exactly which API calls to make against the confirmed channel.

| YouTube API — Implementation (GCP Permissions Active) Two APIs needed — both require GCP credentials already in place:   1\. YouTube Data API v3 → channel/video metadata (public data, API key auth)   2\. YouTube Analytics API → viewership data (requires OAuth, GCP permissions active) Step 1: Verify YOUTUBE\_CHANNEL\_ID   YouTube Studio → Customization → Basic Info → Channel URL \= /channel/{ID}   OR: GET https://www.googleapis.com/youtube/v3/channels?part=id\&mine=true       Authorization: Bearer {oauth\_access\_token} Step 2: Channel statistics (API key, no OAuth needed)   GET https://www.googleapis.com/youtube/v3/channels   ?part=statistics,snippet\&id={YOUTUBE\_CHANNEL\_ID}\&key={YOUTUBE\_API\_KEY}   → Returns: subscriberCount, viewCount, videoCount, channelDescription Step 3: Recent video performance   GET https://www.googleapis.com/youtube/v3/search   ?channelId={YOUTUBE\_CHANNEL\_ID}\&order=date\&maxResults=10\&part=snippet   → Get video IDs, then:   GET https://www.googleapis.com/youtube/v3/videos   ?part=statistics\&id={video\_id\_1,video\_id\_2,...}\&key={YOUTUBE\_API\_KEY}   → Returns: viewCount, likeCount, commentCount per video Step 4: YouTube Analytics (OAuth — GCP permissions active)   GET https://youtubeanalytics.googleapis.com/v2/reports   ?ids=channel=={YOUTUBE\_CHANNEL\_ID}\&startDate={30dAgo}\&endDate={today}   \&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained   \&dimensions=day\&sort=day   → Requires: https://www.googleapis.com/auth/yt-analytics.readonly scope |
| :---- |

## **3.7  GA4 Data API**

| GA4 — Conversion Events to Track for Lead Intelligence GA4 Property: confirm Property ID from Google Analytics → Admin → Property Settings Required GA4 events (configure in GA4 if not already done):   schedule\_call\_click    → 'Schedule a Strategy Call' button clicks   contact\_form\_submit    → Contact page form submission   phone\_click            → Click on phone number link   email\_click            → Click on email address link   blog\_read\_complete     → Scroll 90% on a blog post (use scroll\_depth trigger in GTM) GA4 Data API — key report queries:   Report 1: Sessions by source/medium (dateRange: last 30d)     dimensions: sessionSource, sessionMedium     metrics: sessions, conversions, engagementRate   Report 2: Landing page conversion rates     dimensions: landingPage     metrics: sessions, conversions, bounceRate     → Identify pages with high traffic but low conversion rates   Report 3: Daily conversion trend     dimensions: date     metrics: conversions (filtered to schedule\_call\_click \+ contact\_form\_submit)   UTM requirement: Tag all social bio links and email links with UTM parameters     so GA4 can attribute sessions back to the correct source. |
| :---- |

**04  DASHBOARD MODULES**

*Detailed specification for all 7 modules*

## **4.1  Module 1 — Command Center**

The Command Center is the first thing Jayson sees after login. It must answer 'what's happening right now?' in under 30 seconds. Every metric has a trend arrow vs. the prior 7-day average. The goal is a 5-minute morning check that surfaces anything requiring action.

***\[ WIREFRAME: Command Center — KPI Cards (Top Row) \]***

| PSI Score Desktop92 / 100▲ \+4 pts (7d) | Indexed Pages34 pages▲ \+8 this week | GEO Readiness61 / 100▲ \+9 pts |
| :---: | :---: | :---: |
| **Organic Clicks127 / 7d▲ \+34%** | **New Leads6 / 7d(via Notion CRM)** | **IG Reach4,210 / 7d▲ \+18%** |

***\[ WIREFRAME: Command Center — Second Row \]***

| Avg SERP Position18.4 (tracked KWs)▼ improving | Pipeline Value$12,400 open(Notion estimate) | YT Views (30d)1,240 views▲ \+190 |
| :---: | :---: | :---: |
| **Active Alerts2 warnings\[ View Alerts \]** | **AI Insight'Index /venues/cmhofnow — quick win'** | **CrUX StatusNo field dataTarget: 500 users/mo** |

| Command Center — Feature Spec LAYOUT: 6-card top row \+ 6-card second row, full width, responsive grid EACH CARD: Large number, unit label, source badge (e.g. 'via Notion'), trend arrow \+ % change COLOR SYSTEM: Green \= improving, Red \= declining, Gray \= flat / no data ALERT BANNER: Sticky top banner if any metric breaches threshold (above KPI cards) QUICK ACTIONS: Below second row — 3 buttons always visible:   \[ Run PSI Audit \]  \[ Request Indexing (N pages) \]  \[ View AI Recommendations \] LAST REFRESHED: Timestamp on each card. Manual \[ Refresh All \] button top-right. LOADING STATE: Show stale data immediately (from cache), update in background (SWR pattern) |
| :---- |

## **4.2  Module 2 — Core Web Vitals & Site Performance**

Full Lighthouse audit display for both Mobile and Desktop, with 30-day trend charts stored in BigQuery. Includes the Lighthouse opportunities table auto-parsed from the PSI API response — so Jayson or a developer knows exactly what to fix and what the estimated improvement is.

***\[ WIREFRAME: Performance Module Layout \]***

| Desktop GaugePerformance92 / 100 ✅ | Mobile GaugePerformance74 / 100 ⚠️ | \[ Run New Audit \]Last run: 2h ago▶ Analyze Now |
| :---: | :---: | :---: |
| **LCP Trend30-day linecurrent: 1.9s ✅** | **CLS Trend30-day linecurrent: 0.08 ✅** | **TBT Trend30-day linecurrent: 180ms ✅** |

| Performance Module — Full Feature Spec GAUGE PANEL (per device — Desktop / Mobile tabs)   • 4 gauge charts: Performance, Accessibility, Best Practices, SEO (Lighthouse)   • Color bands: 0–49 \= Red, 50–89 \= Amber, 90–100 \= Green   • Score history: sparkline for last 30 days (from BigQuery psi\_snapshots table) CORE WEB VITALS TABLE   Metric    | Current Value | Target  | Status Badge | 30d Trend   LCP       | 1.9s          | \< 2.5s  | GOOD ✅      | sparkline   FCP       | 1.1s          | \< 1.8s  | GOOD ✅      | sparkline   TBT       | 180ms         | \< 200ms | GOOD ✅      | sparkline   CLS       | 0.08          | \< 0.10  | GOOD ✅      | sparkline   Speed Idx | 2.8s          | \< 3.4s  | GOOD ✅      | sparkline   TTI       | 3.1s          | \< 3.8s  | GOOD ✅      | sparkline CrUX STATUS PANEL   • Large badge: 'No CrUX Field Data — Insufficient Real-User Traffic'   • Explanation: field data appears when Google has 75th percentile CrUX volume   • Traffic milestone tracker: 'Approx. 500+ monthly organic users needed'   • Will auto-update when field data becomes available LIGHTHOUSE OPPORTUNITIES TABLE (auto-parsed from PSI response)   • Top 5 improvement opportunities with savings estimate   • Example: 'Eliminate render-blocking resources | Est. 0.41s savings'   • Each row links to web.dev documentation for that audit ACTIONS   \[ Run Desktop Audit \]  \[ Run Mobile Audit \]  \[ View Full PSI Report → \]   \[ Export Performance Report (PDF) \] |
| :---- |

## **4.3  Module 3 — SEO Intelligence**

Aggregates Google Search Console data into an actionable SEO dashboard. Covers keyword rank tracking, index coverage, crawl errors, and structured data health. This is where the site migration recovery gets tracked daily.

***\[ WIREFRAME: SEO Intelligence Layout \]***

| Index Coverage34/61 pages▲ \+8 this week | Keyword Ranks10 trackedAvg pos: 14.2 | Crawl Errors3 redirects OK0 new 404s ✅ |
| :---: | :---: | :---: |
| **Keyword Rank Table10 KW with 7d trendPositions \+ CTR** | **Top Pages by ClicksPage / Clicks / CTRlast 28 days** | **Schema Health3 types active2 gaps flagged** |

| Keyword Rank Tracker — Pre-Configured Keywords Edit in Settings panel. Default 10 tracked keywords:   1\.  Nashville corporate event photographer   2\.  Nashville conference photographer   3\.  Gaylord Opryland event photographer   4\.  Music City Center photographer   5\.  Country Music Hall of Fame photographer   6\.  Nashville headshot activation   7\.  Conference headshot lounge Nashville   8\.  Nashville trade show photographer   9\.  Executive headshots Nashville   10\. Nashville convention photographer For each keyword, display:   Current position | 7d position change | Impressions (7d) | CTR | Clicks (7d)   Mini sparkline chart showing 30-day rank history (from BigQuery gsc\_daily table)   Status badge: Top 3 🏆 | Top 10 🟢 | Page 2 🟡 | Page 3+ 🔴 | Not ranking ⬛ |
| :---- |

| SEO Module — Full Feature Spec INDEX HEALTH PANEL   • Donut chart: Indexed vs Not Indexed vs Excluded (from GSC Coverage report)   • Table: pages submitted in sitemap but NOT indexed — with 'Request Indexing' button per row     (calls GSC URL Inspection API → fires index request → logs result)   • Redirect health: OLD WordPress URLs tested — shows 301 status confirmed or 404 error   • New crawl errors in last 7 days: 0 \= green banner; any \= alert TOP CONTENT PERFORMANCE TABLE (from GSC searchAnalytics)   Page | Impressions | Clicks | Avg Position | CTR | Trend   Sorted by impressions. Highlight rows where:     CTR \< 2% AND impressions \> 100 → 'Title/Meta Optimization Opportunity' flag     Position 11–20 AND impressions \> 500 → 'Near Page 1 — Prioritize Content Update' flag STRUCTURED DATA HEALTH   • Schema types currently detected: table with page type, schema type, status   • Missing schema recommendations by page type   • Last Rich Results Test timestamp \+ pass/fail per page   • Quick link: 'Test Now' → opens Google Rich Results Test for that URL |
| :---- |

## **4.4  Module 4 — GEO (Generative Engine Optimization) Tracker**

JHR Photography's forward-looking differentiator module. Tracks readiness for AI-powered answer engines and logs citations when JHR Photography appears in ChatGPT, Perplexity, Google AI Overviews, or Bing Copilot responses. No competitor is doing this systematically — this is a first-mover advantage.

| GEO Readiness Score — Scoring Rubric (0–100) CATEGORY                                          MAX PTS  HOW TO EARN ────────────────────────────────────────────────────────────────────────── Organization JSON-LD schema (layout.js)           20 pts   Present \+ validates FAQPage schema on ≥ 3 service/venue pages         20 pts   Validated by Rich Results Test AI crawler access in robots.txt                   15 pts   GPTBot (5) ClaudeBot (5) Perplexity (5) Sitemap submitted to Bing Webmaster Tools          10 pts   Verified via Bing WMT API Citable content assets (500+ words, H2 structure)  5 pts each, max 15 pts Entity definition page (About page clarity)        20 pts   Scored 0–20 based on entity signals ────────────────────────────────────────────────────────────────────────── TOTAL POSSIBLE                                    100 pts Score is recalculated weekly by the cron job. Stored in BigQuery for trend tracking. |
| :---- |

| GEO Module — Full Feature Spec GEO READINESS SCORE PANEL   • Large score gauge (0–100) with color bands: \<50 Red, 50–74 Amber, 75+ Green   • Breakdown table showing each category score \+ max \+ what's needed to improve   • 12-week trend sparkline AI CRAWLER ACCESS CHECKER   • Fetches https://jhr-photography.com/robots.txt on demand   • Parses for: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot   • Status per crawler: ✅ Allowed | 🔴 Blocked | ⚠️ Not Specified   • 'Fix Now' button → shows exact robots.txt addition needed (copy-paste ready) CITATION LOG (Manual \+ Automated)   • Manual entry form: date, AI engine, query used, citation type, URL of AI response   • Automated (weekly n8n/EventBridge job): tests 10 queries via       ChatGPT API (gpt-4o) \+ Perplexity API → logs any response mentioning       'JHR Photography' or 'jhr-photography.com'   • Citation count by engine: Instagram / ChatGPT / Perplexity / Google / Bing SCHEMA INVENTORY TABLE   Page Type | URL | Schema Types | Status | Last Tested   Color-coded by coverage completeness ENTITY CLARITY SCORE   • Checks About page for: company name, location, specialty, founder name, differentiator   • Checks JSON-LD for: name, description, founder, areaServed, sameAs links   • Score 0–20 with per-item breakdown |
| :---- |

## **4.5  Module 5 — Social Media Performance**

Consolidates Instagram Business (via Meta Graph API), Facebook Page, and YouTube into one view. Goal: see which content drives traffic to jhr-photography.com and which content drives direct lead inquiries — bridging social engagement to business outcomes.

***\[ WIREFRAME: Social Module Layout \]***

| InstagramFollowers: 2,840▲ \+42 (7d) | IG Reach4,210 / 7d▲ \+18% | Profile → Site Clicks67 / 7d▲ direct attribution |
| :---: | :---: | :---: |
| **Facebook Reach2,890 / 7d▲ \+12%** | **YouTube Views (30d)1,240 views▲ \+190** | **YT Subscribers486 total▲ \+14 (30d)** |

| Social Module — Instagram Panel (Meta Graph API) Account Metrics (7-day rolling, pulled daily via EventBridge cron):   • Follower count \+ net change (7d / 30d)   • Reach (unique accounts reached) — 7d   • Impressions (total views) — 7d   • Profile visits — 7d   • Website clicks from bio link — 7d  ← KEY metric: this is the bridge to site traffic Post Performance Grid (last 5 posts):   • Thumbnail-style card with: media type, timestamp, reach, likes, comments, saves   • Engagement rate \= (likes \+ comments \+ saves) / reach × 100   • Best-performing post highlighted with ⭐ badge Story Metrics (if available via API):   • Story views, exits, replies, taps forward/back Cross-channel note: website\_clicks from IG bio \= GA4 source/medium (instagram/social)   → Match to GA4 to close the attribution loop |
| :---- |

| Social Module — YouTube Panel (YouTube Data API v3 \+ Analytics) Channel Overview:   • Subscriber count \+ 30d growth (from YouTube Analytics)   • Total views (30d) \+ trend vs prior 30d   • Watch time hours (30d)   • Avg view duration Top 5 Videos (30d) — card per video:   • Thumbnail, title, publish date, views (30d), likes, comments   • 'GEO Signal' badge if this video appears in Google Search results     (manually taggable in dashboard — high-value content signal) New videos published in last 30d — alert if \> 0 (prompt to check performance) YouTube → GA4 bridge: tag YouTube video descriptions with UTM links   utm\_source=youtube\&utm\_medium=video\&utm\_campaign={video\_slug} |
| :---- |

## **4.6  Module 6 — Lead Intelligence (Notion CRM)**

This is the mission-critical module — the direct line between all marketing activity and business results. All lead data lives in Notion. The dashboard surfaces it in analytics-ready format without duplicating the CRM or requiring Jayson to jump between tools.

***\[ WIREFRAME: Lead Intelligence Layout \]***

| New Leads (30d)14 total▲ \+4 vs prior 30d | Pipeline Value$24,800 open(from Notion est.) | Lead-to-Quote Rate64% contacted▲ improving |
| :---: | :---: | :---: |
| **Source BreakdownOrganic / SocialDirect / Referral** | **Service InterestEvent / HeadshotExecutive / Other** | **Funnel StagesNew→Contact→Prop→Bookedcount per stage** |

| Lead Intelligence Module — Full Feature Spec DATA SOURCE: Notion API (NOTION\_TOKEN \+ NOTION\_LEADS\_DB\_ID) REFRESH: Daily via EventBridge cron (6am CT) \+ on-demand 'Refresh' button CACHE: 15-minute TTL in Upstash Redis to avoid Notion rate limiting LEAD PIPELINE OVERVIEW PANEL   • New leads (7d / 30d / quarter) with trend arrow vs prior period   • Pipeline stage funnel (horizontal bar or Sankey):       New → Contacted → Proposal Sent → Booked → Closed-Lost   • Conversion rates: New→Contacted, Contacted→Proposal, Proposal→Booked   • Estimated open pipeline value (sum of Estimated Value for active leads)   • Avg days from inquiry to booking (time-to-close metric) LEAD SOURCE BREAKDOWN   • Pie chart: Organic Search | Instagram | Facebook | Referral | Direct | Paid   • Requires 'Lead Source' property in Notion to be consistently populated   • Cross-reference with GA4 source/medium for validation SERVICE INTEREST BREAKDOWN   • Bar chart: Corporate Event | Headshot Activation | Executive Imaging |                Trade Show | Convention | Event Video | Other   • Helps identify which services are in demand vs. being undermarketed LEAD LOG TABLE (recent 20 leads from Notion)   Date | Name/Company | Service | Source | Status | Est. Value | Days in Stage   Click row → opens Notion record in new tab   Filter: by status, service type, date range HIGH-VALUE ALERT: If a lead with Est. Value \> $2,000 has been in 'New' status   for more than 24 hours → dashboard alert \+ optional email notification |
| :---- |

## **4.7  Module 7 — Alerts & AI Recommendations**

The dashboard's enforcement layer. Automated alerts catch performance drops before they become problems. The weekly Claude API commentary synthesizes all data into 3–5 prioritized actions — saving Jayson from having to analyze raw numbers himself.

| Alert Threshold System — Default Configuration (All Adjustable in Settings) PERFORMANCE ALERTS   🔴  PSI Performance Score drops below 85 (desktop) or 70 (mobile)   🔴  LCP exceeds 2.5 seconds   🟠  Any Core Web Vital moves from GOOD to NEEDS IMPROVEMENT SEO ALERTS   🔴  Tracked keyword drops 5+ positions in one week   🔴  Indexed page count DECREASES (de-indexing event)   🔴  New 404 errors detected from former redirect targets   🟠  Average position for any tracked keyword moves below 20   🟠  Schema validation fails on any service or venue page LEAD ALERTS (from Notion CRM)   🔴  High-value lead (est. \> $2,000) in 'New' status for \> 24 hours   🔴  Lead volume drops 50%+ vs prior 7-day average   🟠  No new leads in 5 calendar days SOCIAL ALERTS   🟠  Instagram reach drops 30%+ vs prior 7-day average   🟠  Bio link clicks drop to 0 for 3 consecutive days GEO ALERTS   🔴  AI crawler found BLOCKED in robots.txt   🟠  GEO Readiness Score drops 10+ points Alert delivery: In-dashboard sticky banner \+ optional email (via AWS SES or Resend API) |
| :---- |

| AI Recommendations Engine — Claude API Integration Model: claude-sonnet-4-6 (claude-sonnet-4-6) Trigger: Every Monday at 6:00 AM CT via EventBridge cron Cost: \~$0.03/week (≈2,500 tokens per call at current pricing) System prompt (stored in /api/admin/insights/route.ts):   "You are the SEO and marketing performance analyst for JHR Photography,    a premium Nashville B2B corporate event photography company. Your role is    to review the week's performance data and deliver 3–5 specific, prioritized    actions the owner should take this week. Be direct, specific, and tactical.    Reference actual numbers. Format: numbered list, plain English, no fluff." Data bundle sent to Claude (JSON object):   { weekDelta: { psiDesktop, psiMobile, indexedPages, organicClicks,                  avgPosition, newLeads, igReach, ytViews, geoScore },     activeAlerts: \[...\],     keywordPositions: \[{ keyword, position, change7d }, ...\],     notIndexedPages: \[...\],     geoBreakdown: { schemaScore, crawlerScore, entityScore },     notionPipeline: { newLeads, openValue, avgTimeToClose } } Example output rendered in dashboard:   1\. ⚡ 3 venue pages (Gaylord Opryland, Renaissance, CMHOF) are not indexed.      Go to SEO Module → Index Health → Request Indexing. High impact, 5 minutes.   2\. 📈 'Nashville headshot activation' moved from position 24 → 18 this week.      Update the title tag and add an FAQ section with schema to push to page 1\.   3\. 💰 Lead from Gibson Corp has been in 'New' status for 31 hours. Est. $3,200.      Follow up now — open Notion record below. |
| :---- |

**05  IMPLEMENTATION ROADMAP**

*Phased delivery — confirmed stack, sequenced by impact*

## **5.1  Pre-Build Checklist (Before Writing Any Code)**

| Agent Instructions — Reference File Loading Protocol When reference files are loaded to /mnt/user-data/uploads/, agents should: 1\. Read /mnt/user-data/uploads/ to find all available files 2\. For Meta/Instagram credentials file:    → Extract: META\_APP\_ID, META\_APP\_SECRET, PAGE\_ACCESS\_TOKEN, IG\_BUSINESS\_USER\_ID    → Add to .env.local and AWS Amplify environment variables    → Validate the access token before writing any integration code 3\. For Google/YouTube credentials file:    → Confirm: YOUTUBE\_CHANNEL\_ID, verify GCP project name    → Confirm GA4 Property ID and GSC verified property    → Check if service account JSON key is included (needed for BigQuery writes) 4\. For Notion integration file:    → Extract: NOTION\_TOKEN, database IDs for Leads and Contacts    → Run a test query against the Leads database to map actual property names    → Document the schema before building any Notion routes 5\. Cross-reference all env vars against the Amplify list in Section 2.2    → Any missing vars must be flagged before Phase 1 build begins |
| :---- |

## **5.2  Phase 1 — Foundation (Week 1–2)**

| Task | Detail | Output | Done When |
| :---- | :---- | :---- | :---- |
| Auth setup | NextAuth.js Google OAuth on /admin route | Login works; redirects to sign-in if unauthenticated | Agent \+ Jayson can log in |
| AWS Amplify env vars | Add all env vars from Section 2.2 | All secrets in Amplify console | Test: process.env.GOOGLE\_API\_KEY is defined |
| PSI API route | /api/admin/psi → calls PSI API → returns JSON | JSON with scores and CWV for both desktop and mobile | curl returns scores |
| BigQuery schema | Create jhr\_analytics dataset \+ psi\_snapshots table | BQ table accepting writes | Insert test row succeeds |
| Command Center skeleton | /admin/page.tsx with 6 KPI cards, PSI data live | Cards render with real PSI scores | Visual check in browser |
| EventBridge cron setup | Daily cron pointing to /api/admin/cron/refresh | Cron fires and logs success | CloudWatch shows execution |

## **5.3  Phase 2 — SEO Core (Week 3–5)**

| Task | Detail | Output | Done When |
| :---- | :---- | :---- | :---- |
| GSC OAuth integration | OAuth route \+ GSC API calls for search analytics | Clicks/impressions for last 7 days rendering | SEO module shows real data |
| Keyword rank tracker | 10 pre-configured keywords, position \+ 7d trend | Keyword table with sparklines | All 10 keywords show data or 'no data' |
| Index coverage panel | GSC Coverage → donut chart \+ not-indexed list | 'Request Indexing' button works | Index request confirmed in GSC |
| Redirect health check | Test old WordPress URLs, display 301/404 status | Table with redirect status per old URL | All 8 old URLs show 301 ✅ |
| Schema health checker | Fetch robots.txt, inspect key pages for JSON-LD | GEO readiness score v1 renders | Score updates on page load |
| BigQuery gsc\_daily write | Daily cron writes GSC data to BQ | 30-day sparklines render in keyword tracker | 7+ days of BQ data present |

## **5.4  Phase 3 — Social \+ Notion Leads (Week 6–9)**

| Task | Detail | Output | Done When |
| :---- | :---- | :---- | :---- |
| Meta Graph API wiring | Wire credentials from ref file → /api/admin/social/meta | IG reach, followers, profile clicks rendering | Real IG data in social module |
| Facebook Page Insights | Extend Meta API route to include Page metrics | FB reach and engagement rendering | Real FB data in social module |
| YouTube API integration | Wire GCP credentials → /api/admin/social/youtube | Subscriber count, views, top videos rendering | Real YT data in social module |
| Notion leads integration | Wire NOTION\_TOKEN → /api/admin/notion/leads | Lead count, pipeline value, source breakdown | Real Notion data in leads module |
| Upstash Redis cache | Cache Notion responses with 15-min TTL | Dashboard loads \< 1.5s without hitting Notion every refresh | Cache hit confirmed in logs |
| GA4 Data API | Sessions by source, conversion events | Lead source attribution in leads module | GA4 data matches Notion sources |

## **5.5  Phase 4 — Intelligence Layer (Week 10–12)**

| Task | Detail | Output | Done When |
| :---- | :---- | :---- | :---- |
| Alert threshold engine | Evaluate all metrics vs thresholds on every cron run | Alert banner fires on first threshold breach | Test: set threshold low, confirm alert appears |
| AWS SES email alerts | Send email to Jayson when alert fires | Email received within 5 min of threshold breach | Test alert email received |
| Claude API recommendations | Weekly Monday call with data bundle → store response | AI recommendation panel renders Monday AM | Recommendation visible in /admin/alerts |
| GEO citation log | Manual entry form \+ n8n query tester workflow | Citations logged and visible in GEO module | First manual citation logged |
| Settings panel | /admin/settings — edit keywords, thresholds, API status | All configs editable in UI | Save settings persists on reload |
| Full BigQuery trend charts | 30/90 day charts for all key metrics | All trend sparklines and full charts rendering | 90 days of data (or all available) |

**06  TECH STACK & DESIGN SYSTEM**

*Component library, charting, and visual language*

## **6.1  Frontend Tech Stack**

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| Framework | Next.js 14 App Router \+ TypeScript | Existing site stack — no context switching |
| Styling | Tailwind CSS | Existing site pattern; utility-first |
| Charts & Gauges | Recharts \+ react-gauge-component | Lightweight, composable, Tailwind-compatible |
| Data Tables | TanStack Table v8 | Built-in sort, filter, pagination |
| Icons | Lucide React | Already in site bundle |
| Auth | NextAuth.js v5 | Google OAuth; minimal config |
| Server State | TanStack Query (React Query) | SWR pattern; stale data shown instantly |
| Date Ranges | date-fns \+ shadcn DateRangePicker | Custom date filter on all modules |
| Toast / Alerts | shadcn/ui Toast | In-dashboard alert notifications |
| Cache (server-side) | Upstash Redis | Notion \+ other API response caching |
| Animations | Framer Motion (minimal) | Card entrance animations only — no bloat |

## **6.2  Color & Status System**

| Status | Color | Hex | Applied To |
| :---- | :---- | :---- | :---- |
| Excellent | Green | \#22C55E | PSI 90+, rank improving, leads up, CWV Good |
| Needs Attention | Amber | \#F59E0B | PSI 70–89, flat rank, minor metric drop |
| Critical | Red | \#EF4444 | PSI \<70, rank drop 5+, de-index, high-value lead stalled |
| No Data | Gray | \#9CA3AF | CrUX unavailable, API not connected, no history |
| Trend Up | Blue ↑ | \#3B82F6 | Metric improving vs prior period |
| Trend Down | Red ↓ | \#EF4444 | Metric declining vs prior period |
| AI Insight | Purple | \#8B5CF6 | Claude recommendation highlights |
| Notion | Teal | \#14B8A6 | Notion CRM data indicators |

## **6.3  Design Principles**

* Speed first — dashboard must show stale cached data in \< 500ms, update in background

* Glanceable — every critical number visible above the fold on a 1440px desktop screen

* Action-oriented — every degraded metric links to the specific fix, not a generic docs page

* Mobile-capable — fully responsive for quick checks from phone (Phase 4 polish)

* Zero noise — no decorative elements; density with clarity; military-clean aesthetic

* Trust the data — always show data timestamp; never present stale data as current without a badge

**07  AGENT REFERENCE FILE PROTOCOL**

*Instructions for AI agents consuming credential and config files*

When Jayson loads reference files into /mnt/user-data/uploads/, all AI agents working on this codebase should follow this exact protocol before writing any integration code.

| Agent Protocol — File Ingestion Steps STEP 1: List available files   bash: ls /mnt/user-data/uploads/   Read all files before proceeding. Do not assume file names. STEP 2: For Meta/Instagram credential file   → Parse for: META\_APP\_ID, META\_APP\_SECRET, PAGE\_ACCESS\_TOKEN, IG\_BUSINESS\_USER\_ID   → Validate token: GET /debug\_token — confirm is\_valid=true before wiring   → Note token expiry date — add to settings panel as 'Token Expires' field   → Add all four values to .env.local \+ document in Amplify env vars list STEP 3: For Google/YouTube credential file   → Confirm: YOUTUBE\_CHANNEL\_ID — validate with YouTube API channels.list   → Confirm: GA4\_PROPERTY\_ID — validate with GA4 Data API properties.list   → Confirm: BigQuery project ID and service account access   → If service account JSON key is present: base64-encode for Amplify env var     base64 command: base64 \-i service-account.json | tr \-d '\\n' STEP 4: For Notion credential file   → Extract: NOTION\_TOKEN (internal integration token)   → Extract: database IDs for Leads and any other relevant databases   → Run discovery query to map actual Notion property names:     GET https://api.notion.com/v1/databases/{NOTION\_LEADS\_DB\_ID}     → Document all property names \+ types before building /api/admin/notion routes   → The Notion schema may differ from the assumed schema in Section 3.4 —     ALWAYS use actual property names from the live database, not assumed names. STEP 5: Cross-reference and confirm   → Compare extracted values against the full env var list in Section 2.2   → Flag any missing values to Jayson before beginning build   → Never hardcode credentials — always use process.env.VARIABLE\_NAME |
| :---- |

| Security Rules — Non-Negotiable NEVER commit credentials to git. Use .gitignore to exclude .env.local. NEVER log credential values in console.log or API responses. NEVER expose API keys client-side — all API calls must be made from /api/\* routes. ALWAYS use AWS Amplify Environment Variables for production secrets. ALWAYS validate that tokens are active before writing integration code. Meta PAGE\_ACCESS\_TOKEN expires every 60 days — build token refresh into Month 2\. |
| :---- |

**08  BIGQUERY SCHEMA & DATA STORAGE**

*Table definitions for the jhr\_analytics dataset*

BigQuery stores all time-series data that APIs don't retain long-term. Notion, GSC, and PSI APIs typically provide only 90–180 days of history. BigQuery extends this to unlimited retention for trend analysis, competitive benchmarking, and annual reporting.

| BigQuery — Full Table Definitions (Dataset: jhr\_analytics) CREATE TABLE psi\_snapshots (   snapshot\_date DATE NOT NULL,   url STRING NOT NULL,   device STRING NOT NULL,       \-- 'desktop' | 'mobile'   performance\_score INT64,       \-- 0-100   accessibility\_score INT64,   seo\_score INT64,   best\_practices\_score INT64,   lcp\_seconds FLOAT64,   fcp\_seconds FLOAT64,   tbt\_ms FLOAT64,   cls FLOAT64,   speed\_index\_seconds FLOAT64,   tti\_seconds FLOAT64,   crux\_status STRING,            \-- 'FAST'|'AVERAGE'|'SLOW'|'UNKNOWN'   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP() ); CREATE TABLE gsc\_daily (   report\_date DATE NOT NULL,   query STRING,   page STRING,   device STRING,   clicks INT64,   impressions INT64,   ctr FLOAT64,   position FLOAT64,   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP() ); CREATE TABLE ga4\_daily (   report\_date DATE NOT NULL,   event\_name STRING,   session\_source STRING,   session\_medium STRING,   landing\_page STRING,   sessions INT64,   conversions INT64,   engagement\_rate FLOAT64,   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP() ); CREATE TABLE social\_daily (   report\_date DATE NOT NULL,   platform STRING,               \-- 'instagram'|'facebook'|'youtube'   metric\_name STRING,            \-- 'reach'|'followers'|'views'|'subscribers'|etc   metric\_value FLOAT64,   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP() ); CREATE TABLE geo\_scores (   score\_date DATE NOT NULL,   total\_score INT64,   schema\_score INT64,   crawler\_score INT64,   sitemap\_score INT64,   content\_score INT64,   entity\_score INT64,   notes STRING,   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP() ); CREATE TABLE alerts\_log (   alert\_id STRING DEFAULT GENERATE\_UUID(),   triggered\_at TIMESTAMP NOT NULL,   alert\_type STRING,             \-- 'performance'|'seo'|'lead'|'social'|'geo'   metric\_name STRING,   threshold\_value FLOAT64,   actual\_value FLOAT64,   resolved BOOL DEFAULT FALSE,   resolved\_at TIMESTAMP ); |
| :---- |

**09  COST MODEL & OPERATIONAL OVERHEAD**

*Monthly cost at JHR Photography's current traffic scale*

| Service | Free Tier / Plan | Est. Monthly Cost | Notes |
| :---- | :---- | :---- | :---- |
| AWS Amplify | Pay-per-use: \~$0.01/build min | $1–5/month | First 1,000 build mins free; hosting included |
| AWS EventBridge | 14M events/month free | $0 | Daily cron \= 30 events/month |
| AWS SES (email alerts) | 62,000 emails/month free | $0 | Alert emails only |
| BigQuery | 10GB storage \+ 1TB queries free/month | $0 | jhr\_analytics dataset will be \< 1GB for years |
| PSI API | Free, unlimited | $0 | Runs daily \+ on-demand |
| Google Search Console API | Free | $0 | — |
| GA4 Data API | Free | $0 | — |
| YouTube Data API v3 | 10,000 units/day free | $0 | Each API call ≈ 1 unit |
| Meta Graph API | Free for Business accounts | $0 | — |
| Notion API | Included in any Notion plan | $0 | Internal integration |
| Upstash Redis (cache) | 10,000 commands/day free | $0 | Well within free tier |
| Claude API (weekly) | \~2,500 tokens × $3/M output | \< $1/month | \~$0.03 per weekly call |
| TOTAL | — | \~$1–6/month | Dominated by Amplify build minutes |

**10  FUTURE ROADMAP**

*Post-Phase 4 enhancements*

## **10.1  Near-Term (Month 4–6)**

* Automated weekly email brief — Monday 6am: 5-bullet summary of prior week performance to Jayson's inbox via AWS SES

* Notion → Dashboard bidirectional write — 'Mark as Contacted' button in Lead Intel module updates Notion status directly

* Competitor rank monitoring — track 3 named competitor domains alongside JHR keywords

* Content calendar sync — connect Notion content calendar to show upcoming posts with their SEO target keywords

* Mobile-first responsive redesign of dashboard — Phase 4 targets 1440px desktop; this targets iPhone 14 Pro

## **10.2  Medium-Term (Month 7–12)**

* Client-facing report export — one-click PDF of performance highlights formatted for prospect/client presentations

* AI citation API integration — when Profound.co, BrandMentions, or similar services release APIs for AI citation tracking, plug directly in

* n8n automation bridge — existing n8n workflows (email classifier, lead analysis) push data into the dashboard via webhook

* Seasonal booking intelligence — pattern recognition on when inquiries spike (event conference season vs. slow periods)

* Impact Consulting client dashboard variant — white-label version of this dashboard for consulting clients

JHR Photography — Admin Dashboard PRD v2.0 — March 2026

Jayson Rivas, Owner  ·  Impact Consulting  ·  jhr-photography.com  ·  Deployed on AWS Amplify