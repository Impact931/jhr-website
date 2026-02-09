/**
 * Content Management System Types for JHR Photography
 * Used for page content stored in DynamoDB
 */

/**
 * Content status - represents the publishing state of content
 */
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

/**
 * Section types available in the content editor
 */
export type SectionType = 'text' | 'image' | 'structured';

/**
 * Base section with common properties
 */
interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
}

/**
 * Text section - rich text content (HTML from Tiptap editor)
 */
export interface TextSection extends BaseSection {
  type: 'text';
  content: string; // HTML content
}

/**
 * Image section - single image with optional caption
 */
export interface ImageSection extends BaseSection {
  type: 'image';
  src: string; // S3/CloudFront URL
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * Structured section - key-value data (e.g., pricing, stats)
 */
export interface StructuredSection extends BaseSection {
  type: 'structured';
  name: string; // Section identifier (e.g., 'pricing', 'stats')
  data: Record<string, unknown>;
}

/**
 * Union type for all content sections
 */
export type ContentSection = TextSection | ImageSection | StructuredSection;

/**
 * SEO and social metadata for a page
 */
export interface ContentMetadata {
  title: string;
  description: string;
  ogImage?: string; // S3/CloudFront URL for Open Graph image
  keywords?: string[];
}

/**
 * Complete page content structure
 * Stored in DynamoDB with pk/sk pattern
 */
export interface PageContent {
  pk: string; // Format: PAGE#{slug}
  sk: string; // Format: {status} (draft or published)
  slug: string;
  status: ContentStatus;
  sections: ContentSection[];
  metadata: ContentMetadata;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy?: string; // User ID
  updatedBy?: string; // User ID
}

/**
 * Input type for creating/updating page content
 * Omits auto-generated fields
 */
export interface PageContentInput {
  slug: string;
  sections: ContentSection[];
  metadata: ContentMetadata;
}

/**
 * Summary type for page listings
 */
export interface PageSummary {
  slug: string;
  title: string;
  status: ContentStatus;
  updatedAt: string;
  hasDraft: boolean;
  hasPublished: boolean;
}

// ============================================================================
// Section-Based Page Content (Inline Editor)
// ============================================================================

import type { PageSectionContent, PageSEOMetadata, InlineSectionType } from './inline-editor';

/**
 * Valid inline section types for validation.
 */
export const VALID_SECTION_TYPES: InlineSectionType[] = [
  'hero', 'text-block', 'feature-grid', 'image-gallery', 'cta', 'testimonials', 'faq', 'columns', 'stats',
];

/**
 * Section-based page content stored in DynamoDB.
 * Uses the same pk/sk pattern as PageContent but stores PageSectionContent[] sections
 * and PageSEOMetadata for richer inline editor support.
 */
export interface SectionPageContent {
  pk: string;            // Format: PAGE#{slug}
  sk: string;            // Format: sections#{status}
  slug: string;
  status: ContentStatus;
  sections: PageSectionContent[];
  seo: PageSEOMetadata;
  version: number;       // Optimistic concurrency version
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  createdBy?: string;    // User ID
  updatedBy?: string;    // User ID
}

/**
 * Input type for saving section-based page content.
 * Omits auto-generated fields (pk, sk, timestamps).
 */
export interface SectionPageContentInput {
  slug: string;
  sections: PageSectionContent[];
  seo: PageSEOMetadata;
  version?: number;      // For optimistic concurrency; omit for new content
}
