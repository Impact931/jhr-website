import { NextRequest, NextResponse } from 'next/server';
import { getPageSections } from '@/lib/content';
import { ContentStatus } from '@/types/content';

/**
 * GET /api/content/sections?slug=home
 * Public (unauthenticated) endpoint for fetching published page content.
 * Lives outside /api/admin/ so it is NOT caught by the auth middleware.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Missing required query parameter: slug' },
      { status: 400 }
    );
  }

  try {
    const page = await getPageSections(slug, ContentStatus.PUBLISHED);

    if (!page) {
      return NextResponse.json(
        { error: 'No published content found for this page' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { sections: page.sections, seo: page.seo, version: page.version, updatedAt: page.updatedAt },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching published content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
