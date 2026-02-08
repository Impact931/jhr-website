/**
 * Blog Content Service Layer for JHR Photography CMS
 * Provides CRUD operations for blog posts using DynamoDB
 *
 * Blog posts use the same section-based content structure as pages,
 * enabling inline editing, image galleries, and MediaPicker integration.
 */

import { getItem, putItem, queryItems, scanItemsByPkPrefix, deleteItem } from './dynamodb';
import type { PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';
import type {
  BlogPost,
  BlogPostStatus,
  BlogPostSK,
  BlogPostSEOMetadata,
  BlogPostStructuredData,
  BlogPostGEOMetadata,
} from '@/types/blog';
import {
  sectionsToBody,
  bodyToSection,
  extractFeaturedImage,
  extractExcerpt,
  estimateReadingTime,
  migrateLegacyBlogPost,
} from '@/types/blog';

// ============================================================================
// Types
// ============================================================================

/**
 * Internal DynamoDB record type for blog posts.
 */
export interface BlogRecord extends BlogPost {
  pk: string;
  sk: BlogPostSK;
}

/**
 * Input type for creating/updating blog content.
 */
export interface BlogContentInput {
  slug: string;
  title: string;
  sections?: PageSectionContent[];
  seo?: PageSEOMetadata;
  body?: string;
  featuredImage?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  status?: BlogPostStatus;
  scheduledPublishAt?: string;
  seoMetadata?: BlogPostSEOMetadata;
  structuredData?: BlogPostStructuredData;
  geoMetadata?: BlogPostGEOMetadata;
}

/**
 * Summary type for blog listings.
 */
export interface BlogSummary {
  slug: string;
  title: string;
  status: BlogPostStatus;
  updatedAt: string;
  hasDraft: boolean;
  hasPublished: boolean;
  featuredImage?: string;
  sectionCount: number;
  excerpt?: string;
  author: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
  tags: string[];
  categories: string[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate partition key for a blog post.
 */
function generatePk(slug: string): string {
  return `BLOG#${slug}`;
}

/**
 * Determine the sort key to use based on status.
 * Draft posts use 'draft', published posts use 'published'.
 */
function statusToSk(status: BlogPostStatus): BlogPostSK {
  switch (status) {
    case 'published':
      return 'published';
    case 'scheduled':
      return 'draft'; // Scheduled posts are stored as drafts until published
    case 'draft':
    default:
      return 'draft';
  }
}

/**
 * Migrate a legacy record (sk='post') to the new format.
 * Returns both draft and published records if post was published.
 */
function migrateLegacyRecord(record: BlogRecord): BlogRecord {
  const migrated = migrateLegacyBlogPost(record);
  return {
    ...migrated,
    pk: record.pk,
    sk: record.status === 'published' ? 'published' : 'draft',
    version: record.version || 1,
  } as BlogRecord;
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get blog content by slug and status.
 *
 * Handles migration: if the old sk='post' format is found, it converts on read.
 *
 * @param slug - Blog post slug
 * @param status - Content status (draft or published)
 * @returns BlogPost if found, undefined otherwise
 */
export async function getBlogContent(
  slug: string,
  status: BlogPostStatus = 'draft'
): Promise<BlogPost | undefined> {
  const pk = generatePk(slug);
  const sk = statusToSk(status);

  // Try to get the new format first
  let record = await getItem<BlogRecord>(pk, sk);

  // If not found, check for legacy format
  if (!record) {
    const legacyRecord = await getItem<BlogRecord>(pk, 'post');
    if (legacyRecord) {
      // Migrate on read - convert legacy format to new format
      record = migrateLegacyRecord(legacyRecord);

      // If looking for published and legacy was published, return it
      // If looking for draft, always return the migrated record
      if (status === 'published' && legacyRecord.status !== 'published') {
        return undefined;
      }
    }
  }

  if (!record) {
    return undefined;
  }

  // Helper to decode URL-encoded image paths
  const decodeImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return url;
    try {
      return url.includes('%') ? decodeURIComponent(url) : url;
    } catch {
      return url;
    }
  };

  // Ensure backward compatibility: compute body from sections if not present
  const post: BlogPost = {
    ...record,
    body: record.body || (record.sections ? sectionsToBody(record.sections) : ''),
    featuredImage: decodeImageUrl(record.featuredImage) || extractFeaturedImage(record.sections),
    excerpt: record.excerpt || extractExcerpt(record.sections),
  };

  // Strip DynamoDB keys from the returned object
  const { pk: _pk, sk: _sk, ...cleanPost } = post as BlogRecord;
  return cleanPost;
}

/**
 * Save blog sections (creates or updates).
 *
 * @param slug - Blog post slug
 * @param sections - Array of page sections
 * @param status - Content status (default: draft)
 * @param version - Expected version for optimistic concurrency
 * @param userId - Optional user ID for audit trail
 * @returns Saved BlogPost
 */
export async function saveBlogSections(
  slug: string,
  sections: PageSectionContent[],
  status: BlogPostStatus = 'draft',
  version?: number,
  userId?: string
): Promise<BlogPost> {
  const pk = generatePk(slug);
  const sk = statusToSk(status);
  const now = new Date().toISOString();

  // Get existing record to preserve metadata and check version
  const existing = await getItem<BlogRecord>(pk, sk) || await getItem<BlogRecord>(pk, 'post');

  // Optimistic concurrency check
  if (version !== undefined && existing && existing.version !== version) {
    throw new Error(`Version conflict: expected ${version}, found ${existing.version}`);
  }

  // Compute derived fields from sections
  const body = sectionsToBody(sections);
  const featuredImage = extractFeaturedImage(sections);
  const excerpt = extractExcerpt(sections);
  const readingTime = estimateReadingTime(body);

  // Extract title from hero section if present
  const heroSection = sections.find(s => s.type === 'hero');
  const title = (heroSection && heroSection.type === 'hero' ? heroSection.title : existing?.title) || 'Untitled';

  const record: BlogRecord = {
    pk,
    sk,
    slug,
    title,
    sections,
    body,
    featuredImage,
    excerpt,
    author: existing?.author || 'JHR Photography',
    publishedAt: existing?.publishedAt || now,
    readingTime,
    tags: existing?.tags || [],
    categories: existing?.categories || [],
    status,
    seo: existing?.seo,
    seoMetadata: existing?.seoMetadata,
    structuredData: existing?.structuredData,
    geoMetadata: existing?.geoMetadata,
    version: (existing?.version || 0) + 1,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: existing?.createdBy || userId,
    updatedBy: userId,
  };

  await putItem(record);

  // Strip DynamoDB keys from the returned object
  const { pk: _pk, sk: _sk, ...cleanPost } = record;
  return cleanPost;
}

/**
 * Save a complete blog post with all metadata.
 *
 * @param input - Blog content input with all fields
 * @param status - Content status (default: draft)
 * @param userId - Optional user ID for audit trail
 * @returns Saved BlogPost
 */
export async function saveBlogPost(
  input: BlogContentInput,
  status: BlogPostStatus = 'draft',
  userId?: string
): Promise<BlogPost> {
  const pk = generatePk(input.slug);
  const sk = statusToSk(status);
  const now = new Date().toISOString();

  // Get existing record to preserve metadata
  const existing = await getItem<BlogRecord>(pk, sk) || await getItem<BlogRecord>(pk, 'post');

  // Handle sections: use provided sections, or wrap body in text-block
  let sections = input.sections;
  if (!sections && input.body) {
    sections = [bodyToSection(input.body)];
  }

  // Compute derived fields
  const body = sections ? sectionsToBody(sections) : (input.body || '');
  // Prefer extracting featured image from hero section (most up-to-date)
  const featuredImage = (sections ? extractFeaturedImage(sections) : null) || input.featuredImage;
  const excerpt = input.excerpt || extractExcerpt(sections);
  const readingTime = estimateReadingTime(body);

  const record: BlogRecord = {
    pk,
    sk,
    slug: input.slug,
    title: input.title,
    sections,
    body,
    featuredImage,
    excerpt,
    author: input.author || existing?.author || 'JHR Photography',
    publishedAt: existing?.publishedAt || (status === 'published' ? now : ''),
    scheduledPublishAt: input.scheduledPublishAt,
    readingTime,
    tags: input.tags || existing?.tags || [],
    categories: input.categories || existing?.categories || [],
    status,
    seo: input.seo || existing?.seo,
    seoMetadata: input.seoMetadata || existing?.seoMetadata,
    structuredData: input.structuredData || existing?.structuredData,
    geoMetadata: input.geoMetadata || existing?.geoMetadata,
    version: (existing?.version || 0) + 1,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: existing?.createdBy || userId,
    updatedBy: userId,
  };

  await putItem(record);

  // Strip DynamoDB keys from the returned object
  const { pk: _pk, sk: _sk, ...cleanPost } = record;
  return cleanPost;
}

/**
 * Publish a blog post (copies draft to published).
 *
 * @param slug - Blog post slug
 * @param userId - Optional user ID for audit trail
 * @returns Published BlogPost or undefined if no draft exists
 */
export async function publishBlog(
  slug: string,
  userId?: string
): Promise<BlogPost | undefined> {
  // Get the draft content
  const draft = await getBlogContent(slug, 'draft');

  if (!draft) {
    // Try legacy format
    const pk = generatePk(slug);
    const legacyRecord = await getItem<BlogRecord>(pk, 'post');
    if (legacyRecord) {
      // Migrate and publish
      const migrated = migrateLegacyRecord(legacyRecord);
      return saveBlogPost(
        {
          slug: migrated.slug,
          title: migrated.title,
          sections: migrated.sections,
          body: migrated.body,
          featuredImage: migrated.featuredImage,
          excerpt: migrated.excerpt,
          author: migrated.author,
          tags: migrated.tags,
          categories: migrated.categories,
          seoMetadata: migrated.seoMetadata,
          structuredData: migrated.structuredData,
          geoMetadata: migrated.geoMetadata,
        },
        'published',
        userId
      );
    }
    return undefined;
  }

  const now = new Date().toISOString();
  const pk = generatePk(slug);

  // Create published record
  const publishedRecord: BlogRecord = {
    pk,
    sk: 'published',
    slug: draft.slug,
    title: draft.title,
    sections: draft.sections,
    body: draft.body,
    featuredImage: draft.featuredImage,
    excerpt: draft.excerpt,
    author: draft.author,
    publishedAt: draft.publishedAt || now,
    readingTime: draft.readingTime,
    tags: draft.tags,
    categories: draft.categories,
    status: 'published',
    seo: draft.seo,
    seoMetadata: draft.seoMetadata,
    structuredData: draft.structuredData,
    geoMetadata: draft.geoMetadata,
    version: (draft.version || 0) + 1,
    createdAt: draft.createdAt,
    updatedAt: now,
    createdBy: draft.createdBy,
    updatedBy: userId,
  };

  await putItem(publishedRecord);

  // Strip DynamoDB keys from the returned object
  const { pk: _pk, sk: _sk, ...cleanPost } = publishedRecord;
  return cleanPost;
}

/**
 * Unpublish a blog post (deletes published version, keeps draft).
 *
 * @param slug - Blog post slug
 * @returns true if unpublished, false if not found
 */
export async function unpublishBlog(slug: string): Promise<boolean> {
  const pk = generatePk(slug);

  // Check if published version exists
  const published = await getItem<BlogRecord>(pk, 'published');
  if (!published) {
    return false;
  }

  // Delete the published version
  await deleteItem(pk, 'published');

  // Update draft status if exists
  const draft = await getItem<BlogRecord>(pk, 'draft');
  if (draft) {
    draft.status = 'draft';
    draft.updatedAt = new Date().toISOString();
    await putItem(draft);
  }

  return true;
}

/**
 * List all blog posts with optional status filter.
 *
 * @param status - Optional status filter
 * @returns Array of BlogSummary
 */
export async function listBlogs(status?: BlogPostStatus): Promise<BlogSummary[]> {
  // Scan all blog posts
  const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');

  // Group by slug
  const blogsBySlug = new Map<string, BlogRecord[]>();
  for (const record of records) {
    const existing = blogsBySlug.get(record.slug) || [];
    existing.push(record);
    blogsBySlug.set(record.slug, existing);
  }

  const summaries: BlogSummary[] = [];

  for (const [slug, versions] of blogsBySlug.entries()) {
    // Find draft and published versions
    const draft = versions.find(v => v.sk === 'draft');
    const published = versions.find(v => v.sk === 'published');
    const legacy = versions.find(v => v.sk === 'post');

    // Use the most relevant version for display
    // When filtering for published, prefer the published record to get correct featured images
    const displayRecord = (status === 'published')
      ? (published || draft || legacy)
      : (draft || published || legacy);
    if (!displayRecord) continue;

    // Handle legacy records - migrate on read
    const record = displayRecord.sk === 'post' ? migrateLegacyRecord(displayRecord) : displayRecord;

    // Apply status filter if provided
    if (status) {
      const hasMatchingStatus = (status === 'draft' && (draft || legacy)) ||
        (status === 'published' && (published || (legacy?.status === 'published'))) ||
        (status === 'scheduled' && record.scheduledPublishAt);
      if (!hasMatchingStatus) continue;
    }

    // Determine current status for display
    let displayStatus: BlogPostStatus = 'draft';
    if (record.scheduledPublishAt && new Date(record.scheduledPublishAt) > new Date()) {
      displayStatus = 'scheduled';
    } else if (published || (legacy?.status === 'published')) {
      displayStatus = 'published';
    }

    summaries.push({
      slug,
      title: record.title,
      status: displayStatus,
      updatedAt: record.updatedAt,
      hasDraft: !!(draft || legacy),
      hasPublished: !!(published || (legacy?.status === 'published')),
      featuredImage: record.featuredImage || extractFeaturedImage(record.sections),
      sectionCount: record.sections?.length || 0,
      excerpt: record.excerpt || extractExcerpt(record.sections),
      author: record.author,
      publishedAt: record.publishedAt,
      scheduledPublishAt: record.scheduledPublishAt,
      tags: record.tags || [],
      categories: record.categories || [],
    });
  }

  // Sort by updated date, most recent first
  summaries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return summaries;
}

/**
 * Delete a blog post (both draft and published versions).
 *
 * @param slug - Blog post slug
 * @returns true if deleted, false if not found
 */
export async function deleteBlog(slug: string): Promise<boolean> {
  const pk = generatePk(slug);

  // Try to delete all versions
  const deleted: boolean[] = [];

  try {
    await deleteItem(pk, 'draft');
    deleted.push(true);
  } catch {
    deleted.push(false);
  }

  try {
    await deleteItem(pk, 'published');
    deleted.push(true);
  } catch {
    deleted.push(false);
  }

  try {
    await deleteItem(pk, 'post');
    deleted.push(true);
  } catch {
    deleted.push(false);
  }

  return deleted.some(d => d);
}

/**
 * Check if a blog post has unpublished changes.
 *
 * @param slug - Blog post slug
 * @returns true if draft is newer than published, or if only draft exists
 */
export async function hasUnpublishedChanges(slug: string): Promise<boolean> {
  const draft = await getBlogContent(slug, 'draft');
  const published = await getBlogContent(slug, 'published');

  if (!draft) {
    return false;
  }

  if (!published) {
    return true;
  }

  return new Date(draft.updatedAt) > new Date(published.updatedAt);
}

/**
 * Get all scheduled blog posts that are due for publishing.
 *
 * @returns Array of BlogPost that should be published now
 */
export async function getScheduledPostsDue(): Promise<BlogPost[]> {
  const now = new Date();
  const allBlogs = await listBlogs();

  const duePosts: BlogPost[] = [];

  for (const summary of allBlogs) {
    if (summary.scheduledPublishAt && new Date(summary.scheduledPublishAt) <= now) {
      const post = await getBlogContent(summary.slug, 'draft');
      if (post && post.scheduledPublishAt) {
        duePosts.push(post);
      }
    }
  }

  return duePosts;
}

/**
 * Search blog posts by keyword.
 *
 * Searches title, excerpt, tags, categories, and body content.
 *
 * @param query - Search query string
 * @param status - Optional status filter
 * @returns Array of matching BlogSummary
 */
export async function searchBlogs(
  query: string,
  status?: BlogPostStatus
): Promise<BlogSummary[]> {
  if (!query || query.trim().length === 0) {
    return listBlogs(status);
  }

  const lowerQuery = query.toLowerCase().trim();
  const allBlogs = await listBlogs(status);

  return allBlogs.filter(blog => {
    // Search in title
    if (blog.title.toLowerCase().includes(lowerQuery)) return true;

    // Search in excerpt
    if (blog.excerpt?.toLowerCase().includes(lowerQuery)) return true;

    // Search in tags
    if (blog.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

    // Search in categories
    if (blog.categories.some(cat => cat.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}
