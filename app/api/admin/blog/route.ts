import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSlug } from '@/types/blog';
import {
  listBlogs,
  saveBlogPost,
  publishBlog,
  unpublishBlog,
  deleteBlog,
  getBlogContent,
} from '@/lib/blog-content';
import type { BlogContentInput } from '@/lib/blog-content';

/**
 * GET /api/admin/blog — List all blog posts for admin dashboard
 *
 * Query params:
 * - status: 'draft' | 'published' | 'scheduled' (optional filter)
 *
 * Response includes both old (body) and new (sections) format for backward compatibility.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as 'draft' | 'published' | 'scheduled' | null;

    const posts = await listBlogs(statusFilter || undefined);

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
 *
 * Accepts either:
 * - `sections` array (new format) - section-based content like pages
 * - `body` string (legacy format) - wrapped in text-block section
 *
 * Body:
 * - title: string (required)
 * - sections?: PageSectionContent[] (preferred)
 * - body?: string (legacy, converted to text-block section)
 * - seo?: PageSEOMetadata
 * - excerpt?: string
 * - tags?: string[]
 * - categories?: string[]
 * - featuredImage?: string
 * - status?: 'draft' | 'published'
 * - scheduledPublishAt?: string (ISO date for scheduled publishing)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const {
      title,
      sections,
      body: postBody,
      seo,
      excerpt,
      tags,
      categories,
      featuredImage,
      status,
      scheduledPublishAt,
    } = requestBody;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Require either sections or body
    if (!sections && !postBody) {
      return NextResponse.json(
        { error: 'Missing content: provide either sections array or body string' },
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

    // Check if post already exists
    const existing = await getBlogContent(slug, 'draft');
    if (existing) {
      return NextResponse.json(
        { error: `A post with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    // Prepare input
    const input: BlogContentInput = {
      slug,
      title: title.trim(),
      sections,
      body: postBody,
      seo,
      excerpt,
      tags,
      categories,
      featuredImage,
      scheduledPublishAt,
    };

    // Determine status
    const postStatus = scheduledPublishAt ? 'scheduled' : (status || 'draft');

    // Save the post
    const post = await saveBlogPost(input, postStatus, session.user?.email || undefined);

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
 * PATCH /api/admin/blog — Publish or unpublish a blog post
 *
 * Body:
 * - slug: string (required)
 * - action: 'publish' | 'unpublish' (required)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, action } = body;

    if (!slug || !action || !['publish', 'unpublish'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: slug, action (publish|unpublish)' },
        { status: 400 }
      );
    }

    if (action === 'publish') {
      const post = await publishBlog(slug, session.user?.email || undefined);
      if (!post) {
        return NextResponse.json({ error: 'Post not found or no draft to publish' }, { status: 404 });
      }
      return NextResponse.json({ post, message: 'Post published successfully' });
    } else {
      const success = await unpublishBlog(slug);
      if (!success) {
        return NextResponse.json({ error: 'Post not found or not published' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Post unpublished successfully' });
    }
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
 *
 * Body:
 * - slug: string (required)
 *
 * Deletes both draft and published versions.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid request. Required: slug' },
        { status: 400 }
      );
    }

    const success = await deleteBlog(slug);
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
