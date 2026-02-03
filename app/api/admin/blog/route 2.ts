import { NextRequest, NextResponse } from 'next/server';
import { scanItemsByPkPrefix, putItem, deleteItem, getItem } from '@/lib/dynamodb';
import { generateSlug, estimateReadingTime } from '@/types/blog';

interface BlogRecord {
  pk: string;
  sk: string;
  slug: string;
  title: string;
  body: string;
  featuredImage?: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  readingTime?: number;
  tags: string[];
  categories: string[];
  status: 'draft' | 'published';
  seoMetadata?: Record<string, unknown>;
  structuredData?: Record<string, unknown>;
  geoMetadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/admin/blog — List all blog posts for admin dashboard
 */
export async function GET() {
  try {
    const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');

    const posts = records
      .map(({ pk: _pk, sk: _sk, ...post }) => post)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ posts, count: posts.length });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog — Create a new blog post from admin UI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: postBody, excerpt, tags, categories, featuredImage, status } = body;

    if (!title || !postBody) {
      return NextResponse.json(
        { error: 'Missing required fields: title and body' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    if (!slug) {
      return NextResponse.json(
        { error: 'Could not generate a valid slug from the title' },
        { status: 400 }
      );
    }

    const existing = await getItem<BlogRecord>(`BLOG#${slug}`, 'post');
    if (existing) {
      return NextResponse.json(
        { error: `A post with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const record: BlogRecord = {
      pk: `BLOG#${slug}`,
      sk: 'post',
      slug,
      title: title.trim(),
      body: postBody,
      featuredImage: featuredImage || undefined,
      excerpt: excerpt || postBody.replace(/<[^>]*>/g, '').slice(0, 200),
      author: 'JHR Photography',
      publishedAt: now,
      readingTime: estimateReadingTime(postBody),
      tags: tags || [],
      categories: categories || [],
      status: status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    await putItem(record);

    const { pk: _pk, sk: _sk, ...post } = record;
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/blog — Update blog post status
 * Body: { slug: string, status: 'draft' | 'published' }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, status } = body;

    if (!slug || !status || !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: slug, status (draft|published)' },
        { status: 400 }
      );
    }

    // Fetch existing post
    const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');
    const existing = records.find((r) => r.slug === slug);

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update status
    const updated: BlogRecord = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };

    await putItem(updated);

    const { pk: _pk, sk: _sk, ...post } = updated;
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blog — Delete a blog post
 * Body: { slug: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid request. Required: slug' },
        { status: 400 }
      );
    }

    await deleteItem(`BLOG#${slug}`, 'post');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
