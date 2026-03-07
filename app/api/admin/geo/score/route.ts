import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const SITE_URL = process.env.SITE_URL || 'https://jhr-photography.com';

const SERVICE_PAGES = [
  '/services/corporate-event-coverage',
  '/services/headshot-activation',
  '/services/executive-imaging',
  '/services/trade-show-media',
];

interface ScoreBreakdown {
  schema: { score: number; max: number; detail: string };
  faq: { score: number; max: number; detail: string };
  crawlers: { score: number; max: number; detail: string };
  sitemap: { score: number; max: number; detail: string };
  content: { score: number; max: number; detail: string };
  entity: { score: number; max: number; detail: string };
}

async function fetchPage(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${SITE_URL}${path}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractJsonLd(html: string): object[] {
  const schemas: object[] = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch {
      // skip invalid JSON
    }
  }
  return schemas;
}

const ORG_TYPES = ['Organization', 'LocalBusiness', 'ProfessionalService', 'Corporation', 'PhotographyBusiness'];

function checkOrganizationSchema(schemas: object[]): boolean {
  return schemas.some((s) => {
    const type = (s as Record<string, unknown>)['@type'];
    if (Array.isArray(type)) return type.some((t) => ORG_TYPES.includes(t));
    return typeof type === 'string' && ORG_TYPES.includes(type);
  });
}

function checkFaqSchema(schemas: object[]): boolean {
  return schemas.some((s) => {
    const type = (s as Record<string, unknown>)['@type'];
    if (Array.isArray(type)) return type.includes('FAQPage');
    return type === 'FAQPage';
  });
}

function countWords(html: string): number {
  // Try to extract main content area, fall back to full page
  const mainMatch = html.match(/<main[\s>][\s\S]*?<\/main>/i);
  const content = mainMatch ? mainMatch[0] : html;
  // Strip HTML tags and scripts/styles
  const text = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.split(' ').filter((w) => w.length > 0).length;
}

function countH2s(html: string): number {
  const matches = html.match(/<h2[\s>]/gi);
  return matches ? matches.length : 0;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const breakdown: ScoreBreakdown = {
    schema: { score: 0, max: 20, detail: '' },
    faq: { score: 0, max: 20, detail: '' },
    crawlers: { score: 0, max: 15, detail: '' },
    sitemap: { score: 0, max: 10, detail: '' },
    content: { score: 0, max: 15, detail: '' },
    entity: { score: 0, max: 20, detail: '' },
  };

  // 1. Organization JSON-LD on homepage (20 pts)
  const homepageHtml = await fetchPage('/');
  if (homepageHtml) {
    const schemas = extractJsonLd(homepageHtml);
    if (checkOrganizationSchema(schemas)) {
      breakdown.schema.score = 20;
      breakdown.schema.detail = 'Organization schema found on homepage';
    } else {
      breakdown.schema.detail = 'No Organization schema found on homepage. Add JSON-LD Organization markup.';
    }
  } else {
    breakdown.schema.detail = 'Could not fetch homepage to check schema';
  }

  // 2. FAQPage schema on 3+ pages (20 pts)
  let faqCount = 0;
  const faqPages: string[] = [];
  for (const path of SERVICE_PAGES) {
    const html = await fetchPage(path);
    if (html) {
      const schemas = extractJsonLd(html);
      if (checkFaqSchema(schemas)) {
        faqCount++;
        faqPages.push(path);
      }
    }
  }
  if (faqCount >= 3) {
    breakdown.faq.score = 20;
    breakdown.faq.detail = `FAQPage schema found on ${faqCount} pages: ${faqPages.join(', ')}`;
  } else if (faqCount > 0) {
    breakdown.faq.score = Math.round((faqCount / 3) * 20);
    breakdown.faq.detail = `FAQPage schema on ${faqCount}/3 required pages. Add FAQ sections to more service pages.`;
  } else {
    breakdown.faq.detail = 'No FAQPage schema found. Add FAQ sections with structured data to service pages.';
  }

  // 3. AI crawler access (15 pts: 5 each for GPTBot, ClaudeBot, PerplexityBot)
  const robotsTxt = await fetchPage('/robots.txt');
  const crawlerBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot'];
  if (robotsTxt) {
    const lines = robotsTxt.split('\n').map((l) => l.trim());
    const missingBots: string[] = [];

    for (const bot of crawlerBots) {
      // Find the bot's section and check if it has a root disallow
      let inBotSection = false;
      let isBlocked = false;
      let isFound = false;

      for (const line of lines) {
        if (/^user-agent:\s*/i.test(line)) {
          const ua = line.replace(/^user-agent:\s*/i, '').trim();
          inBotSection = ua.toLowerCase() === bot.toLowerCase();
          if (inBotSection) isFound = true;
        } else if (inBotSection) {
          // Only count as blocked if Disallow is exactly "/" (root block)
          if (/^disallow:\s*\/\s*$/i.test(line)) {
            isBlocked = true;
          }
          // Allow: / overrides a disallow
          if (/^allow:\s*\/\s*$/i.test(line) || /^allow:\s*\/$/i.test(line)) {
            isBlocked = false;
          }
        }
      }

      if (isBlocked) {
        missingBots.push(bot);
      } else {
        // Found and not blocked, or not found (default allow)
        breakdown.crawlers.score += 5;
      }
    }

    if (breakdown.crawlers.score === 15) {
      breakdown.crawlers.detail = 'All AI crawlers have access';
    } else {
      breakdown.crawlers.detail = `Blocked crawlers: ${missingBots.join(', ')}. Update robots.txt to allow them.`;
    }
  } else {
    breakdown.crawlers.score = 15; // No robots.txt = all allowed
    breakdown.crawlers.detail = 'No robots.txt found (all crawlers allowed by default)';
  }

  // 4. Sitemap (10 pts)
  const sitemapRes = await fetchPage('/sitemap.xml');
  if (sitemapRes && sitemapRes.includes('<urlset')) {
    breakdown.sitemap.score = 10;
    breakdown.sitemap.detail = 'Sitemap.xml found and valid';
  } else {
    breakdown.sitemap.detail = 'No valid sitemap.xml found. Add a sitemap for better discoverability.';
  }

  // 5. Citable content: 500+ words and H2s on 3 service pages (15 pts)
  let citableCount = 0;
  for (const path of SERVICE_PAGES.slice(0, 3)) {
    const html = await fetchPage(path);
    if (html) {
      const words = countWords(html);
      const h2s = countH2s(html);
      if (words >= 500 && h2s >= 2) {
        citableCount++;
      }
    }
  }
  breakdown.content.score = Math.round((citableCount / 3) * 15);
  if (citableCount === 3) {
    breakdown.content.detail = 'All checked service pages have 500+ words and proper heading structure';
  } else {
    breakdown.content.detail = `${citableCount}/3 service pages have sufficient content (500+ words, 2+ H2s). Add more structured content.`;
  }

  // 6. Entity definition on About page (20 pts)
  const aboutHtml = await fetchPage('/about');
  if (aboutHtml) {
    const lowerAbout = aboutHtml.toLowerCase();
    const signals = [
      { name: 'company name', check: lowerAbout.includes('jhr photography') || lowerAbout.includes('jhr enterprises') },
      { name: 'location', check: lowerAbout.includes('nashville') || lowerAbout.includes('tennessee') },
      { name: 'specialty', check: lowerAbout.includes('corporate') || lowerAbout.includes('event') || lowerAbout.includes('photography') },
      { name: 'founder', check: lowerAbout.includes('founder') || lowerAbout.includes('owner') || lowerAbout.includes('ceo') },
    ];
    const foundSignals = signals.filter((s) => s.check);
    breakdown.entity.score = foundSignals.length * 5;
    if (foundSignals.length === 4) {
      breakdown.entity.detail = 'About page has strong entity signals (name, location, specialty, founder)';
    } else {
      const missing = signals.filter((s) => !s.check).map((s) => s.name);
      breakdown.entity.detail = `About page missing signals: ${missing.join(', ')}. Add these for better AI entity recognition.`;
    }
  } else {
    breakdown.entity.detail = 'Could not fetch /about page. Ensure it exists and is accessible.';
  }

  const totalScore = Object.values(breakdown).reduce((sum, cat) => sum + cat.score, 0);

  return NextResponse.json({
    totalScore,
    breakdown,
    checkedAt: new Date().toISOString(),
  });
}
