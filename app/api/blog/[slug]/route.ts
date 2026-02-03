import { NextRequest, NextResponse } from 'next/server';
import { getItem } from '@/lib/dynamodb';
import type { BlogPost } from '@/types/blog';

interface BlogRecord extends BlogPost {
  pk: string;
  sk: string;
}

/**
 * GET /api/blog/[slug]
 * Fetches a single blog post by slug.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required.' },
        { status: 400 }
      );
    }

    const record = await getItem<BlogRecord>(`BLOG#${slug}`, 'post');

    if (!record) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    // Strip DynamoDB keys
    const { pk: _pk, sk: _sk, ...post } = record;

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
