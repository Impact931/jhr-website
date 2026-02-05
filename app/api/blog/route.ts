import { NextRequest, NextResponse } from 'next/server';
import { listBlogs, searchBlogs } from '@/lib/blog-content';

/**
 * GET /api/blog
 * Fetches all published blog posts for the listing page.
 *
 * Query params:
 * - status: 'published' | 'draft' | 'all' (default: 'published')
 * - category: string (filter by category)
 * - tag: string (filter by tag)
 * - q: string (search query)
 *
 * Response includes both old (body) and new (sections) format for backward compatibility.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'published';
    const categoryFilter = searchParams.get('category');
    const tagFilter = searchParams.get('tag');
    const searchQuery = searchParams.get('q');

    // Get all posts (or search if query provided)
    let posts = searchQuery
      ? await searchBlogs(searchQuery, statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'published')
      : await listBlogs(statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'published');

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
    posts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Blog listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
