import type { PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';

const KEY_PREFIX = 'jhr-content';

function sectionsKey(slug: string): string {
  return `${KEY_PREFIX}-${slug}-sections`;
}

function seoKey(slug: string): string {
  return `${KEY_PREFIX}-${slug}-seo`;
}

function safeParse<T>(json: string | null): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__ls_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export interface StoredPageContent {
  sections: PageSectionContent[];
  seo: PageSEOMetadata | null;
  updatedAt: string;
}

/**
 * Load saved page content from localStorage.
 * Returns null if nothing is saved for this slug.
 */
export function loadPageContent(slug: string): StoredPageContent | null {
  if (!isLocalStorageAvailable()) return null;

  const rawSections = localStorage.getItem(sectionsKey(slug));
  if (!rawSections) return null;

  const sections = safeParse<PageSectionContent[]>(rawSections);
  if (!sections) return null;

  const seo = safeParse<PageSEOMetadata>(localStorage.getItem(seoKey(slug)));
  return {
    sections,
    seo,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Save page content to localStorage.
 */
export function savePageContent(
  slug: string,
  sections: PageSectionContent[],
  seo?: PageSEOMetadata
): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(sectionsKey(slug), JSON.stringify(sections));
    if (seo) {
      localStorage.setItem(seoKey(slug), JSON.stringify(seo));
    }
    return true;
  } catch (e) {
    console.error('Failed to save content to localStorage:', e);
    return false;
  }
}

/**
 * Delete saved content for a page slug.
 */
export function deletePageContent(slug: string): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(sectionsKey(slug));
  localStorage.removeItem(seoKey(slug));
}

/**
 * List all page slugs that have saved content.
 */
export function listSavedPages(): string[] {
  if (!isLocalStorageAvailable()) return [];

  const slugs: string[] = [];
  const suffix = '-sections';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEY_PREFIX + '-') && key.endsWith(suffix)) {
      const slug = key.slice((KEY_PREFIX + '-').length, -suffix.length);
      slugs.push(slug);
    }
  }
  return slugs;
}

/**
 * Export all saved content as a JSON-serializable object.
 */
export function exportAllContent(): Record<string, StoredPageContent> {
  const pages = listSavedPages();
  const result: Record<string, StoredPageContent> = {};
  for (const slug of pages) {
    const content = loadPageContent(slug);
    if (content) {
      result[slug] = content;
    }
  }
  return result;
}

/**
 * Import content from a previously exported JSON object.
 * Overwrites any existing saved content for the imported slugs.
 */
export function importAllContent(data: Record<string, StoredPageContent>): { imported: string[]; failed: string[] } {
  const imported: string[] = [];
  const failed: string[] = [];

  for (const [slug, content] of Object.entries(data)) {
    if (content?.sections && Array.isArray(content.sections)) {
      const ok = savePageContent(slug, content.sections, content.seo ?? undefined);
      if (ok) {
        imported.push(slug);
      } else {
        failed.push(slug);
      }
    } else {
      failed.push(slug);
    }
  }

  return { imported, failed };
}
