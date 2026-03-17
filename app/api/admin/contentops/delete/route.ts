import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteBlog } from '@/lib/blog-content';

/**
 * DELETE /api/admin/contentops/delete — Delete a ContentOps-generated article
 *
 * Body: { slug: string }
 */
export async function DELETE(request: NextRequest) {
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

    const success = await deleteBlog(slug);

    if (!success) {
      return NextResponse.json(
        { error: `No article found for slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('ContentOps delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
