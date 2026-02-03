import { NextRequest, NextResponse } from 'next/server';
import { scanItemsByPkPrefix } from '@/lib/dynamodb';
import type { BlogPost } from '@/types/blog';

interface BlogRecord extends BlogPost {
  pk: string;
  sk: string;
}

/**
 * GET /api/blog
 * Fetches all published blog posts for the listing page.
 * Supports optional query params: ?status=all (to include drafts), ?category=X, ?tag=X
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'published';
    const categoryFilter = searchParams.get('category');
    const tagFilter = searchParams.get('tag');

    const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');

    // Strip DynamoDB keys and filter
    let posts: BlogPost[] = records.map(({ pk: _pk, sk: _sk, ...post }) => post);

    // Filter by status (default: only published)
    if (statusFilter !== 'all') {
      posts = posts.filter((p) => p.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter) {
      posts = posts.filter((p) =>
        p.categories.some((c) => c.toLowerCase() === categoryFilter.toLowerCase())
      );
    }

    // Filter by tag
    if (tagFilter) {
      posts = posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())
      );
    }

    // Sort by publishedAt descending (most recent first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Blog listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
