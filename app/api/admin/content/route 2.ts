import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, savePageContent } from '@/lib/content';
import { ContentStatus, PageContentInput } from '@/types/content';

/**
 * GET /api/admin/content
 * Fetch page content by slug and status
 *
 * Query parameters:
 * - slug: Page slug (required)
 * - status: Content status 'draft' or 'published' (optional, defaults to 'draft')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const statusParam = searchParams.get('status');

    // Validate slug parameter
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required parameter: slug' },
        { status: 400 }
      );
    }

    // Parse and validate status parameter
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

    // Fetch the content
    const content = await getPageContent(slug, status);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content
 * Save page content (creates or updates)
 *
 * Request body:
 * - slug: Page slug (required)
 * - content: PageContentInput object (required)
 *   - sections: Array of content sections
 *   - metadata: Content metadata (title, description, etc.)
 * - status: Content status 'draft' or 'published' (optional, defaults to 'draft')
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, content, status: statusParam } = body;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: slug' },
        { status: 400 }
      );
    }

    // Validate content parameter
    if (!content || typeof content !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: content' },
        { status: 400 }
      );
    }

    // Validate content has required fields
    if (!content.sections || !Array.isArray(content.sections)) {
      return NextResponse.json(
        { error: 'Content must include sections array' },
        { status: 400 }
      );
    }

    if (!content.metadata || typeof content.metadata !== 'object') {
      return NextResponse.json(
        { error: 'Content must include metadata object' },
        { status: 400 }
      );
    }

    // Parse and validate status parameter (defaults to draft)
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

    // Build the content input
    const contentInput: PageContentInput = {
      slug,
      sections: content.sections,
      metadata: content.metadata,
    };

    // Save the content
    // TODO: Get userId from session when auth is integrated
    const savedContent = await savePageContent(slug, contentInput, status);

    return NextResponse.json(savedContent);
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
