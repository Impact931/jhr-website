import { NextRequest, NextResponse } from 'next/server';
import { getPageSections, savePageSections, publishPageSections } from '@/lib/content';
import { ContentStatus } from '@/types/content';
import type { PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';
import {
  SCHEMA_REGISTRY,
  ALL_SCHEMA_SLUGS,
  getSchemaBySlug,
} from '@/content/schema-registry';

// ============================================================================
// Image-preserving merge logic
// ============================================================================

/**
 * Merge a schema section with existing DB section, preserving user-uploaded
 * images while applying schema text/structure updates.
 *
 * Strategy: use the schema section as the base, then overlay any image fields
 * that the user has customized in the existing DB content.
 */
function mergeSectionImages(
  schemaSection: PageSectionContent,
  existingSection: PageSectionContent
): PageSectionContent {
  // Only merge if same type and same ID
  if (schemaSection.type !== existingSection.type) return schemaSection;

  // Deep clone schema section so we don't mutate the original
  const merged = JSON.parse(JSON.stringify(schemaSection)) as PageSectionContent;

  switch (merged.type) {
    case 'hero': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = existingSection as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = merged as any;
      if (existing.backgroundImage?.src) {
        m.backgroundImage = existing.backgroundImage;
      }
      if (existing.imagePositionY !== undefined) {
        m.imagePositionY = existing.imagePositionY;
      }
      break;
    }

    case 'cta': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = existingSection as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = merged as any;
      if (existing.backgroundType === 'image' && existing.backgroundValue) {
        m.backgroundValue = existing.backgroundValue;
      }
      if (existing.imagePositionY !== undefined) {
        m.imagePositionY = existing.imagePositionY;
      }
      break;
    }

    case 'feature-grid': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = existingSection as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = merged as any;
      if (existing.features && m.features) {
        m.features = m.features.map((feat: { id: string; image?: unknown }) => {
          const existingFeat = existing.features.find(
            (f: { id: string }) => f.id === feat.id
          );
          if (existingFeat?.image?.src) {
            return { ...feat, image: existingFeat.image };
          }
          return feat;
        });
      }
      break;
    }

    case 'image-gallery': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = existingSection as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = merged as any;
      if (existing.images && m.images) {
        m.images = m.images.map((img: { id: string; src?: string; alt?: string }, i: number) => {
          const existingImg =
            existing.images.find((ei: { id: string }) => ei.id === img.id) ||
            existing.images[i];
          if (existingImg?.src) {
            return { ...img, src: existingImg.src, alt: existingImg.alt || img.alt };
          }
          return img;
        });
      }
      break;
    }

    // text-block, faq, stats, columns, testimonials — no user-uploadable images to preserve
  }

  return merged;
}

/**
 * Merge schema SEO with existing SEO, preserving user-uploaded OG image.
 */
function mergeSeoImages(
  schemaSeo: PageSEOMetadata,
  existingSeo?: PageSEOMetadata
): PageSEOMetadata {
  if (!existingSeo) return schemaSeo;

  // Preserve user-uploaded OG image (non-default local placeholder)
  if (
    existingSeo.ogImage &&
    existingSeo.ogImage !== schemaSeo.ogImage &&
    !existingSeo.ogImage.startsWith('/images/generated/')
  ) {
    return { ...schemaSeo, ogImage: existingSeo.ogImage };
  }

  return schemaSeo;
}

/**
 * Merge full page: schema sections + existing DB content.
 * Returns merged sections array and merged SEO.
 */
function mergePageContent(
  schemaSections: PageSectionContent[],
  schemaSeo: PageSEOMetadata,
  existingSections: PageSectionContent[],
  existingSeo?: PageSEOMetadata
): { sections: PageSectionContent[]; seo: PageSEOMetadata } {
  // Build a map of existing sections by ID for O(1) lookup
  const existingMap = new Map<string, PageSectionContent>();
  for (const section of existingSections) {
    existingMap.set(section.id, section);
  }

  // Use schema sections as the structural source of truth,
  // merging images from existing content where section IDs match
  const mergedSections = schemaSections.map((schemaSection) => {
    const existing = existingMap.get(schemaSection.id);
    if (existing) {
      return mergeSectionImages(schemaSection, existing);
    }
    return schemaSection;
  });

  const mergedSeo = mergeSeoImages(schemaSeo, existingSeo);

  return { sections: mergedSections, seo: mergedSeo };
}

// ============================================================================
// API Route
// ============================================================================

/**
 * POST /api/admin/content/seed
 *
 * Push schema content into DynamoDB (draft + publish) for one or more pages.
 *
 * Body: { "slugs": ["home", "about"] }          — seed specific pages (merge mode)
 *       { "slugs": ["all"] }                    — seed every page (merge mode)
 *       { "slugs": ["home"], "force": true }    — full overwrite, discards user edits
 *
 * Default behavior (merge mode): preserves user-uploaded images from existing
 * DynamoDB content while applying schema text/structure updates.
 *
 * force: true — full overwrite (use when you intentionally want to reset a page).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slugs, force } = body as { slugs?: string[]; force?: boolean };

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
      merged?: boolean;
      error?: string;
    };

    const results: SeedResult[] = [];

    // Process sequentially to avoid throttling
    for (const slug of resolvedSlugs) {
      try {
        const schema = getSchemaBySlug(slug)!;
        let sections = schema.sections;
        let seo = schema.seo;
        let didMerge = false;

        // In merge mode (default), preserve user-uploaded images
        if (!force) {
          const existing = await getPageSections(slug, ContentStatus.PUBLISHED);
          if (existing) {
            const merged = mergePageContent(
              schema.sections,
              schema.seo,
              existing.sections,
              existing.seo
            );
            sections = merged.sections;
            seo = merged.seo;
            didMerge = true;
          }
        }

        // Save as draft
        await savePageSections(
          slug,
          { slug, sections, seo },
          ContentStatus.DRAFT,
          'seed-api'
        );

        // Publish (copies draft → published)
        await publishPageSections(slug, 'seed-api');

        results.push({ slug, status: 'ok', merged: didMerge });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ slug, status: 'error', error: message });
      }
    }

    const succeeded = results.filter((r) => r.status === 'ok').length;
    const failed = results.filter((r) => r.status === 'error').length;

    return NextResponse.json({
      mode: force ? 'overwrite' : 'merge',
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
