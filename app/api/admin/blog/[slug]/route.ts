import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSlug } from '@/types/blog';
import {
  getBlogContent,
  saveBlogPost,
  saveBlogSections,
  deleteBlog,
} from '@/lib/blog-content';
import type { BlogContentInput } from '@/lib/blog-content';

/**
 * PATCH /api/admin/blog/[slug]
 * Updates a blog post by slug. Requires authentication.
 *
 * Accepts either:
 * - `sections` array (new format) - section-based content like pages
 * - `body` string (legacy format) - merged with existing content
 *
 * Body:
 * - title?: string
 * - sections?: PageSectionContent[]
 * - body?: string (legacy)
 * - seo?: PageSEOMetadata
 * - excerpt?: string
 * - tags?: string[]
 * - categories?: string[]
 * - featuredImage?: string
 * - status?: 'draft' | 'published'
 * - version?: number (for optimistic concurrency)
 * - scheduledPublishAt?: string (ISO date for scheduled publishing)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required.' },
        { status: 400 }
      );
    }

    // Get the existing post (try draft first, then published)
    let existing = await getBlogContent(slug, 'draft');
    if (!existing) {
      existing = await getBlogContent(slug, 'published');
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    const body = await request.json();
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
      version,
      scheduledPublishAt,
    } = body;

    // Optimistic concurrency check
    if (version !== undefined && existing.version !== version) {
      return NextResponse.json(
        { error: `Version conflict: expected ${version}, found ${existing.version}. Please refresh and try again.` },
        { status: 409 }
      );
    }

    // Handle slug change if title changed
    let newSlug = slug;
    if (title && title !== existing.title) {
      const potentialSlug = generateSlug(title);
      if (potentialSlug && potentialSlug !== slug) {
        const conflictCheck = await getBlogContent(potentialSlug, 'draft');
        if (!conflictCheck) {
          newSlug = potentialSlug;
        }
      }
    }

    // If only sections are provided, use saveBlogSections for efficiency
    if (sections && !title && !postBody && !seo && !excerpt && !tags && !categories && !featuredImage && status === undefined) {
      const post = await saveBlogSections(
        newSlug,
        sections,
        existing.status || 'draft',
        version,
        session.user?.email || undefined
      );

      // Delete old record if slug changed
      if (newSlug !== slug) {
        await deleteBlog(slug);
      }

      return NextResponse.json({
        post,
        message: 'Post updated successfully.',
        slugChanged: newSlug !== slug,
        newSlug: newSlug !== slug ? newSlug : undefined,
      });
    }

    // Full update - prepare input
    const input: BlogContentInput = {
      slug: newSlug,
      title: title || existing.title,
      sections: sections || existing.sections,
      body: postBody,
      seo: seo || existing.seo,
      excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
      tags: tags !== undefined ? tags : existing.tags,
      categories: categories !== undefined ? categories : existing.categories,
      featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
      scheduledPublishAt: scheduledPublishAt !== undefined ? scheduledPublishAt : existing.scheduledPublishAt,
    };

    // Determine status
    const postStatus = status || (scheduledPublishAt ? 'scheduled' : existing.status) || 'draft';

    const post = await saveBlogPost(input, postStatus, session.user?.email || undefined);

    // Delete old record if slug changed
    if (newSlug !== slug) {
      await deleteBlog(slug);
    }

    return NextResponse.json({
      post,
      message: 'Post updated successfully.',
      slugChanged: newSlug !== slug,
      newSlug: newSlug !== slug ? newSlug : undefined,
    });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/blog/[slug]
 * Fetches a single blog post by slug (admin version).
 *
 * Query params:
 * - status: 'draft' | 'published' (default: 'draft')
 *
 * Returns both old (body) and new (sections) format for backward compatibility.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as 'draft' | 'published') || 'draft';

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required.' },
        { status: 400 }
      );
    }

    // Try to get the requested status first
    let post = await getBlogContent(slug, status);

    // If not found and looking for draft, try published
    if (!post && status === 'draft') {
      post = await getBlogContent(slug, 'published');
    }

    // If still not found, return 404
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blog/[slug]
 * Deletes a blog post by slug.
 *
 * Deletes both draft and published versions.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required.' },
        { status: 400 }
      );
    }

    const success = await deleteBlog(slug);
    if (!success) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
