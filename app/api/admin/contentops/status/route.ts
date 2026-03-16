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
    // List all blog posts — show everything in the Articles tab
    const allPosts = await listBlogs();

    // Count by status
    const drafts = allPosts.filter((p) => p.status === 'draft');
    const published = allPosts.filter((p) => p.status === 'published');

    return NextResponse.json({
      total: allPosts.length,
      drafts: drafts.length,
      published: published.length,
      // Return as "articles" — matches what the Articles tab UI expects
      articles: allPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        status: post.status,
        geoScore: 0,
        createdAt: post.updatedAt,
        tags: post.tags,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
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
