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
// Content-preserving merge logic
// ============================================================================

/**
 * Merge a schema section with existing DB section.
 *
 * PRINCIPLE: Published DynamoDB content is the source of truth. When a section
 * already exists in DynamoDB with a matching ID and type, keep ALL of the
 * existing content. The schema only contributes:
 *   1. New child items (features, images, members, etc.) that don't exist yet
 *   2. Structural metadata (order, seo) from the schema
 *   3. Default content for brand-new sections with no DynamoDB match
 *
 * This prevents seeds from overwriting user edits (text, images, videos,
 * categories, links, etc.) that were made through the admin editor.
 */
function mergeSection(
  schemaSection: PageSectionContent,
  existingSection: PageSectionContent
): PageSectionContent {
  // Only merge if same type — if type changed, schema wins (structural change)
  if (schemaSection.type !== existingSection.type) return schemaSection;

  // Start from existing content (preserves all user edits)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged = JSON.parse(JSON.stringify(existingSection)) as any;

  // Update structural fields from schema (order, seo)
  merged.order = schemaSection.order;
  merged.seo = schemaSection.seo;

  // For array-based sections, append any NEW items from the schema
  // that don't already exist (by ID) in the published content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema = schemaSection as any;

  switch (merged.type) {
    case 'feature-grid': {
      if (schema.features && merged.features) {
        const existingIds = new Set(merged.features.map((f: { id: string }) => f.id));
        const newFeatures = schema.features.filter(
          (f: { id: string }) => !existingIds.has(f.id)
        );
        if (newFeatures.length > 0) {
          merged.features = [...merged.features, ...newFeatures];
        }
      }
      // Apply new structural props the schema may introduce (e.g. displayMode, columns)
      if (schema.displayMode !== undefined && merged.displayMode === undefined) {
        merged.displayMode = schema.displayMode;
      }
      if (schema.showStepNumbers !== undefined && merged.showStepNumbers === undefined) {
        merged.showStepNumbers = schema.showStepNumbers;
      }
      break;
    }

    case 'image-gallery': {
      if (schema.images && merged.images) {
        const existingIds = new Set(
          merged.images
            .map((img: { id?: string }) => img.id)
            .filter(Boolean)
        );
        const newImages = schema.images.filter(
          (img: { id?: string }) => img.id && !existingIds.has(img.id)
        );
        if (newImages.length > 0) {
          merged.images = [...merged.images, ...newImages];
        }
      }
      break;
    }

    case 'testimonials': {
      if (schema.testimonials && merged.testimonials) {
        const existingIds = new Set(merged.testimonials.map((t: { id: string }) => t.id));
        const newTestimonials = schema.testimonials.filter(
          (t: { id: string }) => !existingIds.has(t.id)
        );
        if (newTestimonials.length > 0) {
          merged.testimonials = [...merged.testimonials, ...newTestimonials];
        }
      }
      break;
    }

    case 'faq': {
      if (schema.items && merged.items) {
        const existingIds = new Set(merged.items.map((item: { id: string }) => item.id));
        const newItems = schema.items.filter(
          (item: { id: string }) => !existingIds.has(item.id)
        );
        if (newItems.length > 0) {
          merged.items = [...merged.items, ...newItems];
        }
      }
      break;
    }

    case 'team-grid': {
      if (schema.members && merged.members) {
        const existingIds = new Set(merged.members.map((m: { id: string }) => m.id));
        const newMembers = schema.members.filter(
          (m: { id: string }) => !existingIds.has(m.id)
        );
        if (newMembers.length > 0) {
          merged.members = [...merged.members, ...newMembers];
        }
      }
      break;
    }

    case 'tabbed-content': {
      if (schema.tabs && merged.tabs) {
        const existingIds = new Set(merged.tabs.map((t: { id: string }) => t.id));
        const newTabs = schema.tabs.filter(
          (t: { id: string }) => !existingIds.has(t.id)
        );
        if (newTabs.length > 0) {
          merged.tabs = [...merged.tabs, ...newTabs];
        }
      }
      break;
    }

    case 'columns': {
      // Recursively merge nested sections inside each column
      if (schema.columns && merged.columns) {
        merged.columns = merged.columns.map(
          (col: { sections: PageSectionContent[] }, colIdx: number) => {
            const schemaCol = schema.columns[colIdx];
            if (!schemaCol?.sections) return col;

            const existingChildMap = new Map<string, PageSectionContent>();
            for (const child of col.sections) {
              existingChildMap.set(child.id, child);
            }

            const mergedChildren = schemaCol.sections.map(
              (childSchema: PageSectionContent) => {
                const existingChild = existingChildMap.get(childSchema.id);
                if (existingChild) {
                  return mergeSection(childSchema, existingChild);
                }
                return childSchema;
              }
            );

            return { ...col, sections: mergedChildren };
          }
        );
      }
      break;
    }

    // hero, cta, text-block, stats — existing content preserved as-is
  }

  return merged as PageSectionContent;
}

/**
 * Merge schema SEO with existing SEO.
 * Existing user-uploaded OG image always wins.
 */
function mergeSeo(
  schemaSeo: PageSEOMetadata,
  existingSeo?: PageSEOMetadata
): PageSEOMetadata {
  if (!existingSeo) return schemaSeo;

  // Keep existing SEO entirely — user may have edited title, description, etc.
  // Only update fields the user hasn't customized (still at schema defaults)
  const merged = { ...existingSeo };

  // Preserve user-uploaded OG image; only update if still a placeholder
  if (
    !existingSeo.ogImage ||
    existingSeo.ogImage.startsWith('/images/generated/')
  ) {
    merged.ogImage = schemaSeo.ogImage;
  }

  return merged;
}

/**
 * Merge full page: schema sections + existing DB content.
 *
 * Schema controls section ORDER and introduces NEW sections.
 * Existing DB content is preserved for all sections that already exist.
 */
function mergePageContent(
  schemaSections: PageSectionContent[],
  schemaSeo: PageSEOMetadata,
  existingSections: PageSectionContent[],
  existingSeo?: PageSEOMetadata
): { sections: PageSectionContent[]; seo: PageSEOMetadata } {
  const existingMap = new Map<string, PageSectionContent>();
  for (const section of existingSections) {
    existingMap.set(section.id, section);
  }

  // Schema controls which sections exist and their order.
  // For each section: if it exists in DynamoDB, preserve its content.
  // If it's new (no DynamoDB match), use schema defaults.
  const mergedSections = schemaSections.map((schemaSection) => {
    const existing = existingMap.get(schemaSection.id);
    if (existing) {
      return mergeSection(schemaSection, existing);
    }
    return schemaSection;
  });

  const mergedSeo = mergeSeo(schemaSeo, existingSeo);

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
