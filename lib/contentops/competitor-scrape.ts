// ContentOps Engine — Apify Competitor Scraping

import type { CompetitorPage, CompetitorContext } from './types';

const APIFY_API_URL = 'https://api.apify.com/v2';
const ACTOR_ID = 'apify~cheerio-scraper';

interface ApifyRunResponse {
  data?: {
    id: string;
    defaultDatasetId: string;
    status: string;
  };
}

interface ApifyDatasetItem {
  url?: string;
  pageContent?: string;
  html?: string;
  text?: string;
  [key: string]: unknown;
}

/**
 * Scrape competitor URLs via Apify cheerio-scraper to extract
 * word count, heading structure, and external link count.
 *
 * Gracefully returns null on any failure so the pipeline can proceed.
 */
export async function scrapeCompetitors(
  competitorUrls: string[]
): Promise<CompetitorContext | null> {
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) {
    console.warn('[ContentOps] APIFY_API_KEY not set, skipping competitor scraping');
    return null;
  }

  // Take top 3
  const urls = competitorUrls.slice(0, 3);
  if (urls.length === 0) {
    console.warn('[ContentOps] No competitor URLs provided, skipping scraping');
    return null;
  }

  try {
    // Start the actor run synchronously (wait for finish)
    const startUrl = `${APIFY_API_URL}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apiKey}`;

    const response = await fetch(startUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: urls.map((url) => ({ url })),
        pageFunction: `async function pageFunction(context) {
          const { $, request } = context;
          const text = $('body').text() || '';
          const wordCount = text.split(/\\s+/).filter(Boolean).length;
          const h1 = [];
          const h2 = [];
          const h3 = [];
          $('h1').each((_, el) => h1.push($(el).text().trim()));
          $('h2').each((_, el) => h2.push($(el).text().trim()));
          $('h3').each((_, el) => h3.push($(el).text().trim()));
          const externalLinks = $('a[href^="http"]').length;
          return {
            url: request.url,
            wordCount,
            h1,
            h2,
            h3,
            externalLinkCount: externalLinks,
          };
        }`,
        maxRequestsPerCrawl: 3,
        maxConcurrency: 3,
      }),
      signal: AbortSignal.timeout(60_000), // 60s timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown');
      console.error(`[ContentOps] Apify API error (${response.status}): ${errorText}`);
      return null;
    }

    const items: ApifyDatasetItem[] = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      console.warn('[ContentOps] Apify returned no data items');
      return null;
    }

    const pages: CompetitorPage[] = items.map((item) => ({
      url: (item.url as string) || '',
      wordCount: (item.wordCount as number) || 0,
      headings: {
        h1: (item.h1 as string[]) || [],
        h2: (item.h2 as string[]) || [],
        h3: (item.h3 as string[]) || [],
      },
      externalLinkCount: (item.externalLinkCount as number) || 0,
    }));

    const validPages = pages.filter((p) => p.wordCount > 0);
    if (validPages.length === 0) {
      console.warn('[ContentOps] No valid competitor pages scraped');
      return null;
    }

    const avgWordCount = Math.round(
      validPages.reduce((sum, p) => sum + p.wordCount, 0) / validPages.length
    );
    const avgH2Count = Math.round(
      validPages.reduce((sum, p) => sum + p.headings.h2.length, 0) / validPages.length
    );
    const avgExternalLinks = Math.round(
      validPages.reduce((sum, p) => sum + p.externalLinkCount, 0) / validPages.length
    );

    return {
      pages: validPages,
      avgWordCount,
      avgH2Count,
      avgExternalLinks,
    };
  } catch (err) {
    console.error(
      '[ContentOps] Competitor scraping failed:',
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
