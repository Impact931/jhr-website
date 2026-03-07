/**
 * Server-side content fetcher for SSR pages.
 * Fetches published content from DynamoDB at request time,
 * falls back to schema defaults if unavailable.
 */

import { getPageSections } from './content';
import { getSchemaBySlug } from '@/content/schema-registry';
import { ContentStatus } from '@/types/content';
import type { PageSectionContent } from '@/types/inline-editor';

/**
 * Fetch sections for a page server-side.
 * - Tries DynamoDB published content first
 * - Falls back to schema defaults
 * - Never throws — always returns content
 */
export async function getSSRSections(slug: string): Promise<PageSectionContent[]> {
  try {
    const published = await getPageSections(slug, ContentStatus.PUBLISHED);
    if (published?.sections?.length) {
      return published.sections;
    }
  } catch {
    // DynamoDB unavailable — fall through to schema defaults
  }

  // Fall back to schema defaults
  const schema = getSchemaBySlug(slug);
  return schema?.sections ?? [];
}
