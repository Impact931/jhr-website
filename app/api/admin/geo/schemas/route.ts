import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface SchemaResult {
  page: string;
  url: string;
  schemas: { type: string; valid: boolean }[];
}

const SITE_URL = 'https://jhr-photography.com';

const PAGES_TO_CHECK = [
  { label: 'Homepage', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Corporate Event Coverage', path: '/services/corporate-event-coverage' },
  { label: 'Headshot Activation', path: '/services/headshot-activation' },
  { label: 'Trade Show Media', path: '/services/trade-show-media' },
  { label: 'Executive Imaging', path: '/services/executive-imaging' },
  { label: 'Convention Media', path: '/services/convention-media' },
  { label: 'Social Networking Media', path: '/services/social-networking-media' },
  { label: 'FAQs', path: '/faqs' },
];

/**
 * GET /api/admin/geo/schemas
 * Server-side proxy that fetches key site pages and extracts JSON-LD schemas.
 * Avoids CORS issues that occur when the admin client fetches the live site directly.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: SchemaResult[] = [];

    // Fetch pages in parallel with timeout
    const fetchPromises = PAGES_TO_CHECK.map(async (page) => {
      const url = `${SITE_URL}${page.path}`;
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(15000),
          headers: {
            'User-Agent': 'JHR-Admin-SchemaChecker/1.0',
          },
        });

        if (!res.ok) {
          return {
            page: page.label,
            url,
            schemas: [],
          };
        }

        const html = await res.text();
        const schemas: { type: string; valid: boolean }[] = [];

        // Extract all JSON-LD script tags
        const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let match;

        while ((match = regex.exec(html)) !== null) {
          try {
            const parsed = JSON.parse(match[1]);
            const extractTypes = (obj: Record<string, unknown>) => {
              const t = obj['@type'];
              if (Array.isArray(t)) {
                t.forEach((type: string) => schemas.push({ type, valid: true }));
              } else if (typeof t === 'string') {
                schemas.push({ type: t, valid: true });
              }
              // Check @graph
              if (obj['@graph'] && Array.isArray(obj['@graph'])) {
                for (const item of obj['@graph']) {
                  if (item && typeof item === 'object') {
                    extractTypes(item as Record<string, unknown>);
                  }
                }
              }
            };
            extractTypes(parsed);
          } catch {
            schemas.push({ type: 'Invalid JSON-LD', valid: false });
          }
        }

        return {
          page: page.label,
          url,
          schemas,
        };
      } catch {
        return {
          page: page.label,
          url,
          schemas: [],
        };
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);
    results.push(...fetchedResults);

    return NextResponse.json({ pages: results });
  } catch (error) {
    console.error('Error checking schemas:', error);
    return NextResponse.json(
      { error: 'Failed to check schemas' },
      { status: 500 }
    );
  }
}
