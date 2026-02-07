/**
 * Blog Post Types
 *
 * Defines the BlogPost type used across the blog listing page,
 * individual post pages, and blog API endpoints.
 *
 * Blog posts use the same section-based content structure as pages,
 * enabling inline editing, image galleries, and MediaPicker integration.
 */

import type { PageSectionContent, PageSEOMetadata } from './inline-editor';

/** SEO metadata for a blog post. */
export interface BlogPostSEOMetadata {
  /** Meta title for search engines (50-60 chars). */
  metaTitle: string;
  /** Meta description for search engines (150-160 chars). */
  metaDescription: string;
  /** Keywords for SEO (5-10). */
  keywords: string[];
  /** OpenGraph title optimized for social sharing. */
  ogTitle: string;
  /** OpenGraph description optimized for social sharing. */
  ogDescription: string;
  /** OpenGraph image URL. */
  ogImage?: string;
}

/** JSON-LD structured data for a blog post. */
export interface BlogPostStructuredData {
  /** Schema.org BlogPosting headline. */
  headline: string;
  /** ISO date string of publication. */
  datePublished: string;
  /** Author name. */
  author: string;
  /** Featured image URL. */
  image?: string;
  /** Publisher name. */
  publisher: string;
  /** Meta description for structured data. */
  description: string;
  /** Summary of article body for structured data. */
  articleBodySummary?: string;
}

/** GEO (Generative Engine Optimization) metadata for AI crawlers. */
export interface BlogPostGEOMetadata {
  /** Topic classification (e.g., "Corporate Photography", "Event Planning"). */
  topicClassification: string[];
  /** Extracted entities: people, places, organizations. */
  entities: {
    people: string[];
    places: string[];
    organizations: string[];
  };
  /** Content summary optimized for AI crawlers. */
  contentSummary: string;
}

/** Blog post status. */
export type BlogPostStatus = 'draft' | 'published' | 'scheduled';

/**
 * DynamoDB sort key type for blog posts.
 * - 'draft': Working copy for editing
 * - 'published': Live public version
 * - 'post': Legacy format (single record, will be migrated)
 */
export type BlogPostSK = 'draft' | 'published' | 'post';

/**
 * A blog post record.
 *
 * Blog posts now use the same section-based structure as pages,
 * enabling inline editing, galleries, and MediaPicker integration.
 *
 * The `body` field is kept for backward compatibility but should be
 * derived from sections using `sectionsToBody()`.
 */
export interface BlogPost {
  // ============================================================================
  // DynamoDB Keys
  // ============================================================================
  /** DynamoDB partition key: BLOG#{slug} */
  pk?: string;
  /** DynamoDB sort key: 'draft' | 'published' (or 'post' for legacy records) */
  sk?: BlogPostSK;

  // ============================================================================
  // Core Identification
  // ============================================================================
  /** URL-safe slug (used as primary identifier). */
  slug: string;
  /** Post title. */
  title: string;

  // ============================================================================
  // Section-Based Content (New Architecture)
  // ============================================================================
  /**
   * Ordered array of page sections.
   * Uses the same PageSectionContent types as regular pages.
   * Enables inline editing, galleries, and full MediaPicker support.
   */
  sections?: PageSectionContent[];

  /**
   * Page-level SEO metadata using the same structure as pages.
   * Takes precedence over legacy seoMetadata when both exist.
   */
  seo?: PageSEOMetadata;

  /**
   * Version number for optimistic concurrency control.
   * Incremented on each save to prevent overwrites.
   */
  version?: number;

  // ============================================================================
  // Legacy Content Fields (Backward Compatibility)
  // ============================================================================
  /**
   * HTML body content.
   * @deprecated Use `sections` array instead. This field is computed from
   * sections using `sectionsToBody()` for backward compatibility.
   */
  body: string;

  /** Featured image URL (full-width hero).
   * @deprecated Use hero section backgroundImage instead. */
  featuredImage?: string;

  // ============================================================================
  // Blog-Specific Metadata
  // ============================================================================
  /** Short excerpt for listing cards (150-200 chars). */
  excerpt?: string;
  /** Author name. */
  author: string;
  /** ISO date string of publication. */
  publishedAt: string;
  /** Scheduled publish date for future publication. */
  scheduledPublishAt?: string;
  /** Estimated reading time in minutes. */
  readingTime?: number;
  /** Tags for categorization. */
  tags: string[];
  /** Categories for broader grouping. */
  categories: string[];
  /** Publication status. */
  status: BlogPostStatus;

  // ============================================================================
  // SEO & Structured Data
  // ============================================================================
  /** AI-generated SEO metadata (legacy format). */
  seoMetadata?: BlogPostSEOMetadata;
  /** JSON-LD structured data. */
  structuredData?: BlogPostStructuredData;
  /** GEO metadata for AI discovery. */
  geoMetadata?: BlogPostGEOMetadata;

  // ============================================================================
  // Timestamps & Audit
  // ============================================================================
  /** ISO date string of creation. */
  createdAt: string;
  /** ISO date string of last update. */
  updatedAt: string;
  /** User ID who created the post. */
  createdBy?: string;
  /** User ID who last updated the post. */
  updatedBy?: string;
}

/**
 * Generates a URL-safe slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimates reading time based on word count.
 * Assumes average reading speed of 200 words per minute.
 */
export function estimateReadingTime(htmlBody: string): number {
  const text = htmlBody.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Formats a date string for display.
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================================
// Section/Body Conversion Helpers
// ============================================================================

/**
 * Converts sections array to HTML body for backward compatibility.
 *
 * Extracts text content from text-block sections and concatenates them.
 * Hero sections contribute their description if present.
 *
 * @param sections - Array of page sections
 * @returns HTML string representing the body content
 */
export function sectionsToBody(sections: PageSectionContent[]): string {
  if (!sections || sections.length === 0) {
    return '';
  }

  const bodyParts: string[] = [];

  for (const section of sections) {
    switch (section.type) {
      case 'text-block':
        if (section.heading) {
          bodyParts.push(`<h2>${section.heading}</h2>`);
        }
        bodyParts.push(section.content);
        break;
      case 'hero':
        if (section.description) {
          bodyParts.push(section.description);
        }
        break;
      case 'faq':
        // Convert FAQ items to content
        for (const item of section.items) {
          bodyParts.push(`<h3>${item.question}</h3>`);
          bodyParts.push(item.answer);
        }
        break;
      // Other section types don't contribute to plain body text
    }
  }

  return bodyParts.join('\n');
}

/**
 * Wraps HTML body content in a text-block section for migration.
 *
 * Used when migrating legacy blog posts that only have a body field
 * to the new sections-based format.
 *
 * @param body - HTML body content
 * @param id - Optional section ID (defaults to 'text-block-{timestamp}')
 * @returns A text-block section containing the body content
 */
export function bodyToSection(body: string, id?: string): PageSectionContent {
  return {
    id: id || `text-block-${Date.now()}`,
    type: 'text-block',
    order: 0,
    seo: {
      ariaLabel: 'Blog post content',
      sectionId: id || `text-block-${Date.now()}`,
      dataSectionName: 'text-block',
    },
    content: body || '<p></p>',
    alignment: 'left',
  };
}

/**
 * Decodes URL if it contains URL-encoded characters.
 * Handles edge cases like double-encoding.
 */
function decodeImageUrl(url: string): string {
  try {
    // Check if URL contains encoded characters
    if (url.includes('%')) {
      return decodeURIComponent(url);
    }
    return url;
  } catch {
    // If decode fails, return original
    return url;
  }
}

/**
 * Extracts featured image from sections (hero background or first image-gallery).
 *
 * @param sections - Array of page sections
 * @returns Featured image URL or undefined
 */
export function extractFeaturedImage(sections?: PageSectionContent[]): string | undefined {
  if (!sections || sections.length === 0) {
    return undefined;
  }

  // First, look for hero section with background image
  const heroSection = sections.find(s => s.type === 'hero');
  if (heroSection && heroSection.type === 'hero' && heroSection.backgroundImage?.src) {
    return decodeImageUrl(heroSection.backgroundImage.src);
  }

  // Fall back to first image in any image-gallery
  const gallerySection = sections.find(s => s.type === 'image-gallery');
  if (gallerySection && gallerySection.type === 'image-gallery' && gallerySection.images[0]?.src) {
    return decodeImageUrl(gallerySection.images[0].src);
  }

  return undefined;
}

/**
 * Extracts excerpt from sections (first text-block content).
 *
 * @param sections - Array of page sections
 * @param maxLength - Maximum excerpt length (default 200)
 * @returns Excerpt string or undefined
 */
export function extractExcerpt(sections?: PageSectionContent[], maxLength = 200): string | undefined {
  if (!sections || sections.length === 0) {
    return undefined;
  }

  // Look for first text-block section
  const textSection = sections.find(s => s.type === 'text-block');
  if (textSection && textSection.type === 'text-block') {
    // Strip HTML tags and truncate
    const plainText = textSection.content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Truncate at word boundary
    const truncated = plainText.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
  }

  return undefined;
}

/**
 * Creates default sections for a new blog post.
 *
 * Includes:
 * - Hero section for featured image and title display
 * - Text-block section for main content
 *
 * @param title - Blog post title
 * @param featuredImage - Optional featured image URL
 * @returns Array of default sections
 */
export function createDefaultBlogSections(
  title: string,
  featuredImage?: string
): PageSectionContent[] {
  const heroSection: PageSectionContent = {
    id: `hero-${Date.now()}`,
    type: 'hero',
    order: 0,
    seo: {
      ariaLabel: 'Blog post header',
      sectionId: 'blog-hero',
      dataSectionName: 'hero',
    },
    variant: 'half-height',
    title: title || 'Untitled Post',
    subtitle: '',
    description: '',
    buttons: [],
    ...(featuredImage && {
      backgroundImage: {
        src: featuredImage,
        alt: title || 'Featured image',
      },
    }),
  };

  const textSection: PageSectionContent = {
    id: `text-block-${Date.now() + 1}`,
    type: 'text-block',
    order: 1,
    seo: {
      ariaLabel: 'Blog post content',
      sectionId: 'blog-content',
      dataSectionName: 'text-block',
    },
    content: '<p>Start writing your blog post here...</p>',
    alignment: 'left',
  };

  return [heroSection, textSection];
}

/**
 * Converts a legacy blog post (body field only) to section-based format.
 *
 * @param post - Legacy blog post with body field
 * @returns Blog post with sections array populated
 */
export function migrateLegacyBlogPost(post: BlogPost): BlogPost {
  // If already has sections, return as-is
  if (post.sections && post.sections.length > 0) {
    return post;
  }

  const sections: PageSectionContent[] = [];

  // Create hero section with featured image
  const heroSection: PageSectionContent = {
    id: `hero-${Date.now()}`,
    type: 'hero',
    order: 0,
    seo: {
      ariaLabel: 'Blog post header',
      sectionId: 'blog-hero',
      dataSectionName: 'hero',
    },
    variant: 'half-height',
    title: post.title,
    subtitle: '',
    description: '',
    buttons: [],
    ...(post.featuredImage && {
      backgroundImage: {
        src: post.featuredImage,
        alt: post.title,
      },
    }),
  };
  sections.push(heroSection);

  // Create text-block section with body content
  if (post.body) {
    const textSection = bodyToSection(post.body, `text-block-${Date.now() + 1}`);
    textSection.order = 1;
    sections.push(textSection);
  }

  return {
    ...post,
    sections,
    version: post.version || 1,
  };
}
