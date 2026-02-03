import { NextRequest, NextResponse } from 'next/server';
import { publishPage } from '@/lib/content';

/**
 * POST /api/admin/content/publish
 * Publish draft content (copies draft to published)
 *
 * Request body:
 * - slug: Page slug to publish (required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: slug' },
        { status: 400 }
      );
    }

    // Publish the content (copies draft to published)
    // TODO: Get userId from session when auth is integrated
    const published = await publishPage(slug);

    if (!published) {
      return NextResponse.json(
        { error: 'No draft content found to publish' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      content: published,
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
