import { NextRequest, NextResponse } from 'next/server';
import { getBlogContent } from '@/lib/blog-content';

/**
 * GET /api/blog/[slug]
 * Fetches a single blog post by slug.
 *
 * Query params:
 * - status: 'published' | 'draft' (default: 'published')
 *
 * Response includes both old (body) and new (sections) format for backward compatibility.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as 'draft' | 'published') || 'published';

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required.' },
        { status: 400 }
      );
    }

    const post = await getBlogContent(slug, status);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
