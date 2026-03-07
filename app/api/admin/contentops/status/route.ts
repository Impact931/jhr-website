import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs } from '@/lib/blog-content';

/**
 * GET /api/admin/contentops/status — ContentOps pipeline status
 *
 * Returns counts of ContentOps-generated articles by status:
 * - drafts: articles pending review
 * - published: articles that have been published
 * - failedValidation: drafts that may have validation issues
 * - recent: last 20 ContentOps-generated articles with details
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // List all blog posts and filter for ContentOps-generated ones
    const allPosts = await listBlogs();
    const contentopsPosts = allPosts.filter(
      (post) => post.tags && post.tags.includes('contentops-generated')
    );

    // Count by status
    const drafts = contentopsPosts.filter((p) => p.status === 'draft');
    const published = contentopsPosts.filter((p) => p.status === 'published');

    return NextResponse.json({
      total: contentopsPosts.length,
      drafts: drafts.length,
      published: published.length,
      recent: contentopsPosts.slice(0, 20).map((post) => ({
        slug: post.slug,
        title: post.title,
        status: post.status,
        updatedAt: post.updatedAt,
        tags: post.tags,
      })),
    });
  } catch (error) {
    console.error('ContentOps status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
