import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent } from '@/lib/blog-content';

/**
 * GET /api/admin/contentops/status — ContentOps pipeline status
 *
 * Returns counts of ContentOps-generated articles by status
 * with GEO scores from geoMetadata.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allPosts = await listBlogs();

    const drafts = allPosts.filter((p) => p.status === 'draft');
    const published = allPosts.filter((p) => p.status === 'published');

    // Fetch geoScore from the full blog records (geoMetadata is not in summary)
    const articles = await Promise.all(
      allPosts.map(async (post) => {
        let geoScore = 0;
        try {
          const full = await getBlogContent(post.slug, post.status === 'published' ? 'published' : 'draft');
          geoScore = full?.geoMetadata?.geoScore ?? 0;
        } catch {
          // ignore — geoScore stays 0
        }
        return {
          slug: post.slug,
          title: post.title,
          status: post.status,
          geoScore,
          createdAt: post.updatedAt,
          tags: post.tags,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
        };
      })
    );

    return NextResponse.json({
      total: allPosts.length,
      drafts: drafts.length,
      published: published.length,
      articles,
    });
  } catch (error) {
    console.error('ContentOps status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
