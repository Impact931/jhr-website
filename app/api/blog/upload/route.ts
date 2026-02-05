import { NextRequest, NextResponse } from 'next/server';
import { putItem, getItem } from '@/lib/dynamodb';
import { generateSlug, estimateReadingTime, bodyToSection } from '@/types/blog';
import { generateBlogSEO } from '@/lib/blog-seo';
import { getTemplate, applyTemplate } from '@/lib/blog-templates';
import type { BlogPost, BlogPostSK } from '@/types/blog';

interface BlogUploadBody {
  title: string;
  slug?: string;
  body: string;
  featuredImage?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  status?: 'draft' | 'published';
  template?: string;
  templateVariables?: Record<string, string>;
}

interface BlogRecord extends BlogPost {
  pk: string;
  sk: BlogPostSK;
}

function sanitize(value: string, maxLength = 10000): string {
  return value.trim().slice(0, maxLength);
}

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.BLOG_API_KEY;
  if (!expectedKey) {
    // If no API key is configured, reject all requests
    return false;
  }
  return apiKey === expectedKey;
}

/**
 * POST /api/blog/upload
 * Creates a new blog post. Requires x-api-key header.
 */
export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key.' },
        { status: 401 }
      );
    }

    const body: BlogUploadBody = await request.json();

    // If template is provided, merge variables into template structure
    let resolvedBody = body.body;
    let resolvedTags = body.tags;
    let resolvedCategories = body.categories;
    if (body.template && body.templateVariables) {
      const tpl = getTemplate(body.template);
      if (tpl) {
        const applied = applyTemplate(tpl, body.templateVariables);
        // If body was provided, use it; otherwise use template body
        if (!body.body || body.body.trim() === '') {
          resolvedBody = applied.body;
        }
        resolvedTags = resolvedTags?.length ? resolvedTags : applied.tags;
        resolvedCategories = resolvedCategories?.length ? resolvedCategories : applied.categories;
      }
    }

    // Validate required fields
    if (!body.title || !resolvedBody) {
      return NextResponse.json(
        { error: 'Missing required fields: title and body are required.' },
        { status: 400 }
      );
    }

    // Generate or validate slug
    const slug = body.slug
      ? sanitize(body.slug, 200)
      : generateSlug(body.title);

    if (!slug) {
      return NextResponse.json(
        { error: 'Could not generate a valid slug from the provided title.' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await getItem<BlogRecord>(`BLOG#${slug}`, 'post');
    if (existing) {
      return NextResponse.json(
        { error: `A blog post with slug "${slug}" already exists. Use PUT to update.` },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const readingTime = estimateReadingTime(resolvedBody);

    const record: BlogRecord = {
      pk: `BLOG#${slug}`,
      sk: 'post',
      slug,
      title: sanitize(body.title, 300),
      body: sanitize(resolvedBody, 500000),
      featuredImage: body.featuredImage ? sanitize(body.featuredImage, 2000) : undefined,
      excerpt: body.excerpt
        ? sanitize(body.excerpt, 500)
        : sanitize(body.body.replace(/<[^>]*>/g, ''), 200),
      author: body.author ? sanitize(body.author, 200) : 'JHR Photography',
      publishedAt: now,
      readingTime,
      tags: (resolvedTags || []).map((t) => sanitize(t, 100)),
      categories: (resolvedCategories || []).map((c) => sanitize(c, 100)),
      status: body.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    await putItem(record);

    console.log('Blog post created:', { slug, title: record.title });

    // Async SEO metadata generation — post is stored immediately, metadata updates within seconds
    generateBlogSEO({
      title: record.title,
      body: record.body,
      excerpt: record.excerpt,
      author: record.author,
      publishedAt: record.publishedAt,
      featuredImage: record.featuredImage,
      tags: record.tags,
      categories: record.categories,
    })
      .then(async ({ seoMetadata, structuredData, geoMetadata }) => {
        const updatedRecord = { ...record, seoMetadata, structuredData, geoMetadata, updatedAt: new Date().toISOString() };
        await putItem(updatedRecord);
        console.log('SEO metadata generated and stored for:', slug);
      })
      .catch((err) => {
        console.error('Async SEO generation failed for:', slug, err);
      });

    // Return post without DynamoDB keys
    const { pk: _pk, sk: _sk, ...post } = record;
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Blog upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/upload
 * Updates an existing blog post by slug (upsert). Requires x-api-key header.
 */
export async function PUT(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key.' },
        { status: 401 }
      );
    }

    const body: BlogUploadBody = await request.json();

    // Validate required fields
    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Missing required fields: title and body are required.' },
        { status: 400 }
      );
    }

    const slug = body.slug
      ? sanitize(body.slug, 200)
      : generateSlug(body.title);

    if (!slug) {
      return NextResponse.json(
        { error: 'Could not generate a valid slug from the provided title.' },
        { status: 400 }
      );
    }

    // Check if post exists to preserve createdAt
    const existing = await getItem<BlogRecord>(`BLOG#${slug}`, 'post');
    const now = new Date().toISOString();
    const readingTime = estimateReadingTime(body.body);

    const record: BlogRecord = {
      pk: `BLOG#${slug}`,
      sk: 'post',
      slug,
      title: sanitize(body.title, 300),
      body: sanitize(body.body, 500000),
      featuredImage: body.featuredImage ? sanitize(body.featuredImage, 2000) : undefined,
      excerpt: body.excerpt
        ? sanitize(body.excerpt, 500)
        : sanitize(body.body.replace(/<[^>]*>/g, ''), 200),
      author: body.author ? sanitize(body.author, 200) : 'JHR Photography',
      publishedAt: existing?.publishedAt || now,
      readingTime,
      tags: (body.tags || []).map((t) => sanitize(t, 100)),
      categories: (body.categories || []).map((c) => sanitize(c, 100)),
      status: body.status || existing?.status || 'draft',
      // Preserve existing SEO/GEO metadata on update unless overwritten by AI pipeline
      seoMetadata: existing?.seoMetadata,
      structuredData: existing?.structuredData,
      geoMetadata: existing?.geoMetadata,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await putItem(record);

    console.log('Blog post updated:', { slug, title: record.title });

    // Async SEO metadata generation — regenerate on content update
    generateBlogSEO({
      title: record.title,
      body: record.body,
      excerpt: record.excerpt,
      author: record.author,
      publishedAt: record.publishedAt,
      featuredImage: record.featuredImage,
      tags: record.tags,
      categories: record.categories,
    })
      .then(async ({ seoMetadata, structuredData, geoMetadata }) => {
        const updatedRecord = { ...record, seoMetadata, structuredData, geoMetadata, updatedAt: new Date().toISOString() };
        await putItem(updatedRecord);
        console.log('SEO metadata regenerated and stored for:', slug);
      })
      .catch((err) => {
        console.error('Async SEO generation failed for:', slug, err);
      });

    const { pk: _pk, sk: _sk, ...post } = record;
    return NextResponse.json({
      success: true,
      post,
      created: !existing,
    });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
