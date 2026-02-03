/**
 * Blog Post Types
 *
 * Defines the BlogPost type used across the blog listing page,
 * individual post pages, and blog API endpoints.
 */

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
export type BlogPostStatus = 'draft' | 'published';

/** A blog post record. */
export interface BlogPost {
  /** URL-safe slug (used as primary identifier). */
  slug: string;
  /** Post title. */
  title: string;
  /** HTML body content. */
  body: string;
  /** Featured image URL (full-width hero). */
  featuredImage?: string;
  /** Short excerpt for listing cards (150-200 chars). */
  excerpt?: string;
  /** Author name. */
  author: string;
  /** ISO date string of publication. */
  publishedAt: string;
  /** Estimated reading time in minutes. */
  readingTime?: number;
  /** Tags for categorization. */
  tags: string[];
  /** Categories for broader grouping. */
  categories: string[];
  /** Publication status. */
  status: BlogPostStatus;
  /** AI-generated SEO metadata. */
  seoMetadata?: BlogPostSEOMetadata;
  /** JSON-LD structured data. */
  structuredData?: BlogPostStructuredData;
  /** GEO metadata for AI discovery. */
  geoMetadata?: BlogPostGEOMetadata;
  /** ISO date string of creation. */
  createdAt: string;
  /** ISO date string of last update. */
  updatedAt: string;
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
