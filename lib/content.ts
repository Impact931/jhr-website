/**
 * Content Service Layer for JHR Photography CMS
 * Provides CRUD operations for page content using DynamoDB
 */

import { getItem, putItem, queryItems } from './dynamodb';
import {
  PageContent,
  PageContentInput,
  PageSummary,
  ContentStatus,
  SectionPageContent,
  SectionPageContentInput,
  VALID_SECTION_TYPES,
} from '@/types/content';
import type { PageSectionContent, InlineSectionType } from '@/types/inline-editor';

/**
 * Generate partition key for a page
 */
function generatePk(slug: string): string {
  return `PAGE#${slug}`;
}

/**
 * Get page content by slug and status
 * @param slug - Page slug (e.g., 'home', 'about')
 * @param status - Content status (draft or published)
 * @returns PageContent if found, undefined otherwise
 */
export async function getPageContent(
  slug: string,
  status: ContentStatus = ContentStatus.DRAFT
): Promise<PageContent | undefined> {
  const pk = generatePk(slug);
  const sk = status;

  return getItem<PageContent>(pk, sk);
}

/**
 * Save page content (creates or updates)
 * @param slug - Page slug
 * @param input - Page content input (sections and metadata)
 * @param status - Content status (default: draft)
 * @param userId - Optional user ID for audit trail
 * @returns Saved PageContent
 */
export async function savePageContent(
  slug: string,
  input: PageContentInput,
  status: ContentStatus = ContentStatus.DRAFT,
  userId?: string
): Promise<PageContent> {
  const pk = generatePk(slug);
  const sk = status;
  const now = new Date().toISOString();

  // Check if existing content exists to preserve createdAt
  const existing = await getItem<PageContent>(pk, sk);

  const content: PageContent = {
    pk,
    sk,
    slug,
    status,
    sections: input.sections,
    metadata: input.metadata,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: existing?.createdBy || userId,
    updatedBy: userId,
  };

  return putItem(content);
}

/**
 * Publish page content (copies draft to published)
 * @param slug - Page slug to publish
 * @param userId - Optional user ID for audit trail
 * @returns Published PageContent or undefined if no draft exists
 */
export async function publishPage(
  slug: string,
  userId?: string
): Promise<PageContent | undefined> {
  // Get the draft content
  const draft = await getPageContent(slug, ContentStatus.DRAFT);

  if (!draft) {
    return undefined;
  }

  // Save as published content
  const published = await savePageContent(
    slug,
    {
      slug: draft.slug,
      sections: draft.sections,
      metadata: draft.metadata,
    },
    ContentStatus.PUBLISHED,
    userId
  );

  return published;
}

/**
 * List all pages with their status summary
 * Groups draft and published versions by slug
 * @returns Array of PageSummary
 */
export async function listPages(): Promise<PageSummary[]> {
  // Query all items with PAGE# prefix
  // Note: This uses a scan-like approach - for larger datasets,
  // consider using a GSI with a fixed pk like "PAGES" and sk as slug#status
  const allContent = await queryItems<PageContent>('PAGE#');

  // Since queryItems with just a prefix won't work for partition keys,
  // we need to maintain a separate index for listing pages.
  // For now, we'll use a different approach: query a "pages list" item
  // that we update whenever content is saved.

  // Alternative: Use a GSI or maintain a pages index
  // For MVP, let's query known page slugs
  // In production, you'd use a GSI with type=PAGE as pk

  // Since we can't scan efficiently, let's query the known static pages
  const knownSlugs = ['home', 'about', 'contact', 'services', 'gallery', 'pricing'];

  const summaries: PageSummary[] = [];

  for (const slug of knownSlugs) {
    const pk = generatePk(slug);
    const items = await queryItems<PageContent>(pk);

    if (items.length === 0) {
      continue;
    }

    const draft = items.find((item) => item.status === ContentStatus.DRAFT);
    const published = items.find((item) => item.status === ContentStatus.PUBLISHED);

    // Use the most recently updated version for display
    const mostRecent = draft && published
      ? new Date(draft.updatedAt) > new Date(published.updatedAt) ? draft : published
      : draft || published;

    if (mostRecent) {
      summaries.push({
        slug,
        title: mostRecent.metadata.title,
        status: mostRecent.status,
        updatedAt: mostRecent.updatedAt,
        hasDraft: !!draft,
        hasPublished: !!published,
      });
    }
  }

  // Sort by updated date, most recent first
  summaries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return summaries;
}

/**
 * Check if a page has unpublished changes
 * @param slug - Page slug to check
 * @returns true if draft is newer than published, or if only draft exists
 */
export async function hasUnpublishedChanges(slug: string): Promise<boolean> {
  const draft = await getPageContent(slug, ContentStatus.DRAFT);
  const published = await getPageContent(slug, ContentStatus.PUBLISHED);

  if (!draft) {
    return false;
  }

  if (!published) {
    return true;
  }

  return new Date(draft.updatedAt) > new Date(published.updatedAt);
}

// ============================================================================
// Section-Based Content API (Inline Editor)
// ============================================================================

/**
 * Generate sort key for section-based content.
 * Uses "sections#{status}" to avoid collisions with legacy content items.
 */
function generateSectionSk(status: ContentStatus): string {
  return `sections#${status}`;
}

/**
 * Validate a section has the required fields for its type.
 * Returns an error message string, or null if valid.
 */
export function validateSection(section: PageSectionContent): string | null {
  if (!section.id || typeof section.id !== 'string') {
    return 'Section must have a string id';
  }
  if (!VALID_SECTION_TYPES.includes(section.type as InlineSectionType)) {
    return `Invalid section type: ${section.type}. Must be one of: ${VALID_SECTION_TYPES.join(', ')}`;
  }
  if (typeof section.order !== 'number' || section.order < 0) {
    return `Section "${section.id}" must have a non-negative order number`;
  }

  // Type-specific validation
  switch (section.type) {
    case 'hero':
      if (!section.title || typeof section.title !== 'string') {
        return `Hero section "${section.id}" must have a title`;
      }
      if (!section.subtitle || typeof section.subtitle !== 'string') {
        return `Hero section "${section.id}" must have a subtitle`;
      }
      if (!Array.isArray(section.buttons)) {
        return `Hero section "${section.id}" must have a buttons array`;
      }
      break;
    case 'text-block':
      if (typeof section.content !== 'string') {
        return `Text block section "${section.id}" must have content`;
      }
      break;
    case 'feature-grid':
      if (!Array.isArray(section.features)) {
        return `Feature grid section "${section.id}" must have a features array`;
      }
      break;
    case 'image-gallery':
      if (!Array.isArray(section.images)) {
        return `Image gallery section "${section.id}" must have an images array`;
      }
      break;
    case 'cta':
      if (!section.headline || typeof section.headline !== 'string') {
        return `CTA section "${section.id}" must have a headline`;
      }
      if (!section.primaryButton || typeof section.primaryButton !== 'object') {
        return `CTA section "${section.id}" must have a primaryButton`;
      }
      break;
    case 'testimonials':
      if (!Array.isArray(section.testimonials)) {
        return `Testimonials section "${section.id}" must have a testimonials array`;
      }
      break;
    case 'faq':
      if (!Array.isArray(section.items)) {
        return `FAQ section "${section.id}" must have an items array`;
      }
      break;
  }

  return null;
}

/**
 * Validate an array of sections.
 * Returns the first error found, or null if all valid.
 */
export function validateSections(sections: PageSectionContent[]): string | null {
  // Check for duplicate IDs
  const ids = new Set<string>();
  for (const section of sections) {
    if (ids.has(section.id)) {
      return `Duplicate section ID: ${section.id}`;
    }
    ids.add(section.id);

    const error = validateSection(section);
    if (error) return error;
  }
  return null;
}

/**
 * Get section-based page content by slug and status.
 * @param slug - Page slug (e.g., 'home', 'about')
 * @param status - Content status (draft or published)
 * @returns SectionPageContent if found, undefined otherwise
 */
export async function getPageSections(
  slug: string,
  status: ContentStatus = ContentStatus.DRAFT
): Promise<SectionPageContent | undefined> {
  const pk = generatePk(slug);
  const sk = generateSectionSk(status);

  return getItem<SectionPageContent>(pk, sk);
}

/**
 * Save section-based page content (creates or updates).
 * Preserves section IDs for stable references.
 * @param slug - Page slug
 * @param input - Section-based content input (sections and SEO metadata)
 * @param status - Content status (default: draft)
 * @param userId - Optional user ID for audit trail
 * @returns Saved SectionPageContent
 */
export async function savePageSections(
  slug: string,
  input: SectionPageContentInput,
  status: ContentStatus = ContentStatus.DRAFT,
  userId?: string
): Promise<SectionPageContent> {
  const pk = generatePk(slug);
  const sk = generateSectionSk(status);
  const now = new Date().toISOString();

  // Check if existing content exists to preserve createdAt and version
  const existing = await getItem<SectionPageContent>(pk, sk);

  // Ensure sections have stable IDs - preserve existing IDs where they match
  const sections = input.sections.map((section, index) => ({
    ...section,
    order: index, // Reindex to match array position
  })) as PageSectionContent[];

  const content: SectionPageContent = {
    pk,
    sk,
    slug,
    status,
    sections,
    seo: input.seo,
    version: (existing?.version ?? 0) + 1,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: existing?.createdBy || userId,
    updatedBy: userId,
  };

  return putItem(content);
}

/**
 * Publish section-based page content (copies draft to published).
 * @param slug - Page slug to publish
 * @param userId - Optional user ID for audit trail
 * @returns Published SectionPageContent or undefined if no draft exists
 */
export async function publishPageSections(
  slug: string,
  userId?: string
): Promise<SectionPageContent | undefined> {
  const draft = await getPageSections(slug, ContentStatus.DRAFT);

  if (!draft) {
    return undefined;
  }

  return savePageSections(
    slug,
    {
      slug: draft.slug,
      sections: draft.sections,
      seo: draft.seo,
      version: draft.version,
    },
    ContentStatus.PUBLISHED,
    userId
  );
}
