import { NextRequest, NextResponse } from 'next/server';
import {
  getPageSections,
  savePageSections,
  publishPageSections,
} from '@/lib/content';
import { ContentStatus } from '@/types/content';
import { ALL_SCHEMA_SLUGS } from '@/content/schema-registry';

/**
 * POST /api/admin/content/find-replace
 *
 * Targeted find-and-replace across DynamoDB page content.
 * Scans every page's published sections, replaces matching string values
 * in-place, and re-saves only the pages that changed. No data is wiped —
 * this is a surgical update.
 *
 * Body:
 *   {
 *     "find": "https://old-url.com/path",
 *     "replace": "/new-path",
 *     "slugs": ["home", "about"]   // optional — defaults to all pages
 *     "dryRun": true                // optional — preview changes without saving
 *   }
 *
 * The replacement is recursive: it walks every string value in every section
 * and replaces exact matches or substrings. This handles button hrefs, image
 * URLs, text content, or any other string field without needing to know the
 * schema structure.
 */

function deepReplace(
  obj: unknown,
  find: string,
  replace: string
): { result: unknown; count: number } {
  if (typeof obj === 'string') {
    if (obj.includes(find)) {
      const newVal = obj.split(find).join(replace);
      return { result: newVal, count: 1 };
    }
    return { result: obj, count: 0 };
  }

  if (Array.isArray(obj)) {
    let totalCount = 0;
    const newArr = obj.map((item) => {
      const { result, count } = deepReplace(item, find, replace);
      totalCount += count;
      return result;
    });
    return { result: newArr, count: totalCount };
  }

  if (obj !== null && typeof obj === 'object') {
    let totalCount = 0;
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const { result, count } = deepReplace(value, find, replace);
      newObj[key] = result;
      totalCount += count;
    }
    return { result: newObj, count: totalCount };
  }

  // numbers, booleans, null — pass through
  return { result: obj, count: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { find, replace: replaceWith, slugs, dryRun } = body as {
      find?: string;
      replace?: string;
      slugs?: string[];
      dryRun?: boolean;
    };

    if (!find || typeof replaceWith !== 'string') {
      return NextResponse.json(
        { error: '"find" and "replace" strings are required.' },
        { status: 400 }
      );
    }

    const targetSlugs =
      slugs && slugs.length > 0 && slugs[0] !== 'all'
        ? slugs
        : ALL_SCHEMA_SLUGS;

    type PageResult = {
      slug: string;
      replacements: number;
      status: 'updated' | 'unchanged' | 'skipped' | 'error';
      error?: string;
    };

    const results: PageResult[] = [];

    for (const slug of targetSlugs) {
      try {
        // Read published content
        const published = await getPageSections(slug, ContentStatus.PUBLISHED);
        if (!published) {
          results.push({ slug, replacements: 0, status: 'skipped' });
          continue;
        }

        // Deep find-and-replace across all sections
        const { result: newSections, count: sectionCount } = deepReplace(
          published.sections,
          find,
          replaceWith
        );

        // Also check SEO metadata
        const { result: newSeo, count: seoCount } = deepReplace(
          published.seo,
          find,
          replaceWith
        );

        const totalReplacements = sectionCount + seoCount;

        if (totalReplacements === 0) {
          results.push({ slug, replacements: 0, status: 'unchanged' });
          continue;
        }

        if (!dryRun) {
          // Save as draft with replacements applied
          await savePageSections(
            slug,
            {
              slug: published.slug,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sections: newSections as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              seo: newSeo as any,
              version: published.version,
            },
            ContentStatus.DRAFT,
            'find-replace-api'
          );

          // Publish immediately
          await publishPageSections(slug, 'find-replace-api');
        }

        results.push({
          slug,
          replacements: totalReplacements,
          status: 'updated',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ slug, replacements: 0, status: 'error', error: message });
      }
    }

    const totalUpdated = results.filter((r) => r.status === 'updated').length;
    const totalReplacements = results.reduce((sum, r) => sum + r.replacements, 0);

    return NextResponse.json({
      mode: dryRun ? 'dry-run' : 'applied',
      find,
      replace: replaceWith,
      summary: {
        pagesScanned: results.length,
        pagesUpdated: totalUpdated,
        totalReplacements,
      },
      results: results.filter((r) => r.status !== 'unchanged'),
    });
  } catch (error) {
    console.error('Find-replace error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
