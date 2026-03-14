import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { publishBlog } from '@/lib/blog-content';

/**
 * POST /api/admin/contentops/publish — Publish a ContentOps-generated draft
 *
 * Body: { slug: string }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required field: slug' },
        { status: 400 }
      );
    }

    const published = await publishBlog(slug, session.user?.email ?? undefined);

    if (!published) {
      return NextResponse.json(
        { error: `No draft found for slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, slug, publishedAt: published.publishedAt });
  } catch (error) {
    console.error('ContentOps publish error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Publish failed' },
      { status: 500 }
    );
  }
}
