import { NextRequest, NextResponse } from 'next/server';
import { savePageSections, publishPageSections } from '@/lib/content';
import { ContentStatus } from '@/types/content';
import {
  SCHEMA_REGISTRY,
  ALL_SCHEMA_SLUGS,
  getSchemaBySlug,
} from '@/content/schema-registry';

/**
 * POST /api/admin/content/seed
 *
 * Push schema content into DynamoDB (draft + publish) for one or more pages.
 *
 * Body: { "slugs": ["home", "about"] }  — seed specific pages
 *       { "slugs": ["all"] }            — seed every page in the registry
 *
 * Each page is saved as draft then published, sequentially to avoid
 * DynamoDB throttling (~27 pages × 2 writes ≈ 3 seconds).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slugs } = body as { slugs?: string[] };

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include a non-empty "slugs" array' },
        { status: 400 }
      );
    }

    // Resolve "all" to every slug in the registry
    const resolvedSlugs =
      slugs.length === 1 && slugs[0] === 'all'
        ? ALL_SCHEMA_SLUGS
        : slugs;

    // Validate that every requested slug exists in the registry
    const unknown = resolvedSlugs.filter((s) => !SCHEMA_REGISTRY.has(s));
    if (unknown.length > 0) {
      return NextResponse.json(
        {
          error: `Unknown slugs: ${unknown.join(', ')}`,
          available: ALL_SCHEMA_SLUGS,
        },
        { status: 400 }
      );
    }

    type SeedResult = {
      slug: string;
      status: 'ok' | 'error';
      error?: string;
    };

    const results: SeedResult[] = [];

    // Process sequentially to avoid throttling
    for (const slug of resolvedSlugs) {
      try {
        const schema = getSchemaBySlug(slug)!;

        // Save as draft
        await savePageSections(
          slug,
          {
            slug,
            sections: schema.sections,
            seo: schema.seo,
          },
          ContentStatus.DRAFT,
          'seed-api'
        );

        // Publish (copies draft → published)
        await publishPageSections(slug, 'seed-api');

        results.push({ slug, status: 'ok' });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ slug, status: 'error', error: message });
      }
    }

    const succeeded = results.filter((r) => r.status === 'ok').length;
    const failed = results.filter((r) => r.status === 'error').length;

    return NextResponse.json({
      summary: { total: results.length, succeeded, failed },
      results,
    });
  } catch (error) {
    console.error('Error in seed endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/content/seed
 *
 * Returns the list of available slugs for discovery.
 */
export async function GET() {
  return NextResponse.json({
    slugs: ALL_SCHEMA_SLUGS,
    count: ALL_SCHEMA_SLUGS.length,
  });
}
