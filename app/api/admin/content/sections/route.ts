import { NextRequest, NextResponse } from 'next/server';
import {
  getPageSections,
  savePageSections,
  validateSections,
} from '@/lib/content';
import { ContentStatus } from '@/types/content';
import type { PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';

/**
 * GET /api/admin/content/sections
 * Fetch section-based page content by slug and status.
 * Returns the full PageSectionContent[] array with SEO metadata.
 *
 * Query parameters:
 * - slug: Page slug (required)
 * - status: 'draft' or 'published' (optional, defaults to 'draft')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const statusParam = searchParams.get('status');

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required parameter: slug' },
        { status: 400 }
      );
    }

    // Parse and validate status
    let status: ContentStatus = ContentStatus.DRAFT;
    if (statusParam) {
      if (statusParam === 'draft') {
        status = ContentStatus.DRAFT;
      } else if (statusParam === 'published') {
        status = ContentStatus.PUBLISHED;
      } else {
        return NextResponse.json(
          { error: 'Invalid status parameter. Must be "draft" or "published"' },
          { status: 400 }
        );
      }
    }

    const content = await getPageSections(slug, status);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Return sections array, SEO metadata, and version for the client
    return NextResponse.json({
      slug: content.slug,
      sections: content.sections,
      seo: content.seo,
      version: content.version,
      updatedAt: content.updatedAt,
      updatedBy: content.updatedBy,
    });
  } catch (error) {
    console.error('Error fetching section content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content/sections
 * Save section-based page content.
 * Accepts sections array with typed content, validates section types and required fields,
 * and preserves section IDs for stable references.
 *
 * Request body:
 * - slug: Page slug (required)
 * - sections: PageSectionContent[] array (required)
 * - seo: PageSEOMetadata object (required)
 * - status: 'draft' or 'published' (optional, defaults to 'draft')
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, sections, seo, status: statusParam } = body;

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: slug' },
        { status: 400 }
      );
    }

    // Validate sections array
    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: sections (must be an array)' },
        { status: 400 }
      );
    }

    // Validate each section's type and required fields
    const validationError = validateSections(sections as PageSectionContent[]);
    if (validationError) {
      return NextResponse.json(
        { error: `Section validation failed: ${validationError}` },
        { status: 400 }
      );
    }

    // Validate SEO metadata
    if (!seo || typeof seo !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: seo (must be an object)' },
        { status: 400 }
      );
    }

    const seoData = seo as PageSEOMetadata;
    if (!seoData.pageTitle || typeof seoData.pageTitle !== 'string') {
      return NextResponse.json(
        { error: 'SEO metadata must include a pageTitle string' },
        { status: 400 }
      );
    }
    if (!seoData.metaDescription || typeof seoData.metaDescription !== 'string') {
      return NextResponse.json(
        { error: 'SEO metadata must include a metaDescription string' },
        { status: 400 }
      );
    }

    // Parse and validate status
    let status: ContentStatus = ContentStatus.DRAFT;
    if (statusParam) {
      if (statusParam === 'draft') {
        status = ContentStatus.DRAFT;
      } else if (statusParam === 'published') {
        status = ContentStatus.PUBLISHED;
      } else {
        return NextResponse.json(
          { error: 'Invalid status parameter. Must be "draft" or "published"' },
          { status: 400 }
        );
      }
    }

    // Save the section-based content
    // TODO: Get userId from session when auth is integrated
    const savedContent = await savePageSections(
      slug,
      { slug, sections: sections as PageSectionContent[], seo: seoData },
      status
    );

    return NextResponse.json({
      slug: savedContent.slug,
      sections: savedContent.sections,
      seo: savedContent.seo,
      version: savedContent.version,
      updatedAt: savedContent.updatedAt,
      updatedBy: savedContent.updatedBy,
    });
  } catch (error) {
    console.error('Error saving section content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
