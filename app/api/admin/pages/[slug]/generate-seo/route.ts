import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePageSEO } from '@/lib/page-seo';
import type { PageSectionContent } from '@/types/inline-editor';

/**
 * POST /api/admin/pages/[slug]/generate-seo
 * Generates AI-powered SEO metadata for a page based on its sections.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Page slug is required.' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { sections } = body as { sections?: PageSectionContent[] };

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required.' },
        { status: 400 }
      );
    }

    // Generate SEO metadata
    const result = await generatePageSEO(slug, sections);

    return NextResponse.json({
      seo: result.seo,
      warning: result.warning,
    });
  } catch (error) {
    console.error('Page SEO generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
