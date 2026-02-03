'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import type { ContentContextValue, PendingChange, SaveState, PublishState, ContentKeyParts, PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';
import { parseContentKey } from '@/types/inline-editor';
import { usePathname } from 'next/navigation';
import { loadPageContent, savePageContent } from '@/lib/local-content-store';
import { useEditMode } from './EditModeContext';

const ContentContext = createContext<ContentContextValue | null>(null);

const AUTO_SAVE_DELAY = 2000; // 2 seconds debounce — localStorage is synchronous and fast

interface ContentProviderProps {
  children: ReactNode;
}

/**
 * Recompute order fields so they match array position (0-based).
 */
function reindexSections(sections: PageSectionContent[]): PageSectionContent[] {
  return sections.map((section, i) => {
    if (section.order === i) return section;
    return { ...section, order: i } as PageSectionContent;
  });
}

/**
 * Strip ALL HTML tags and decode entities → plain text.
 * Used for fields that must be plain text (title, subtitle, heading, etc.).
 */
function stripAllHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Clean inline HTML: strip block-level tags (including <p> with any attributes),
 * but KEEP inline formatting tags (<strong>, <em>, <span>, etc.) so bold/italic/font persist.
 * Used for fields that support inline formatting but not block structure.
 */
function cleanInlineHtml(html: string): string {
  let result = html;

  // 1. Strip block-level tags including <p> (keep their inner content).
  //    Handles tags with attributes like <p class="tiptap-paragraph">.
  const blockTags = 'p|div|h[1-6]|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|pre|hr|figure|figcaption|section|article|nav|aside|header|footer|main|form|fieldset';
  result = result.replace(new RegExp(`<\\/?(${blockTags})(\\s[^>]*)?>`, 'gi'), '');

  // 2. Decode common HTML entities
  result = result
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return result.trim();
}

/**
 * Sanitize sections loaded from localStorage by stripping HTML from plain text fields.
 * Plain text fields get ALL HTML removed. Rich text fields (content, answers) are untouched.
 */
function sanitizeSections(sections: PageSectionContent[]): PageSectionContent[] {
  const cloned: PageSectionContent[] = JSON.parse(JSON.stringify(sections));
  const plainTextFields = ['title', 'subtitle', 'description', 'heading', 'subheading', 'headline', 'subtext'];

  for (const section of cloned) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = section as any;

    // Strip ALL HTML from top-level plain text fields
    for (const field of plainTextFields) {
      if (typeof s[field] === 'string' && s[field].includes('<')) {
        s[field] = stripAllHtml(s[field]);
      }
    }

    // Strip from hero buttons
    if (section.type === 'hero' && Array.isArray(s.buttons)) {
      for (const btn of s.buttons) {
        if (typeof btn?.text === 'string' && btn.text.includes('<')) {
          btn.text = stripAllHtml(btn.text);
        }
      }
    }

    // Strip from CTA buttons
    if (section.type === 'cta') {
      for (const key of ['primaryButton', 'secondaryButton']) {
        if (typeof s[key]?.text === 'string' && s[key].text.includes('<')) {
          s[key].text = stripAllHtml(s[key].text);
        }
      }
    }

    // Strip from feature-grid cards
    if (section.type === 'feature-grid' && Array.isArray(s.features)) {
      for (const f of s.features) {
        if (typeof f?.title === 'string' && f.title.includes('<')) f.title = stripAllHtml(f.title);
        if (typeof f?.description === 'string' && f.description.includes('<')) f.description = stripAllHtml(f.description);
      }
    }

    // Strip from FAQ items (questions only; answers are rich text)
    if (section.type === 'faq' && Array.isArray(s.items)) {
      for (const item of s.items) {
        if (typeof item?.question === 'string' && item.question.includes('<')) item.question = stripAllHtml(item.question);
      }
    }

    // Strip from testimonials
    if (section.type === 'testimonials' && Array.isArray(s.testimonials)) {
      for (const t of s.testimonials) {
        if (typeof t?.quote === 'string' && t.quote.includes('<')) t.quote = stripAllHtml(t.quote);
        if (typeof t?.authorName === 'string' && t.authorName.includes('<')) t.authorName = stripAllHtml(t.authorName);
        if (typeof t?.authorTitle === 'string' && t.authorTitle.includes('<')) t.authorTitle = stripAllHtml(t.authorTitle);
      }
    }
  }

  return cloned;
}

/**
 * Apply a single field-level pending change into a section object (mutates in place).
 * Maps elementId suffixes to the correct section fields.
 */
function applyFieldToSection(section: PageSectionContent, elementId: string, value: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = section as any;

  // --- Direct top-level fields (shared across types) ---
  // Fields rendered as plain text — strip ALL HTML from Tiptap output
  const plainTextFields = ['title', 'subtitle', 'description', 'heading', 'subheading', 'headline', 'subtext'];
  if (plainTextFields.includes(elementId)) {
    s[elementId] = stripAllHtml(value);
    return;
  }
  // Fields rendered as rich HTML — keep as-is
  if (elementId === 'content') {
    s[elementId] = value;
    return;
  }

  // --- Scalar config fields ---
  if (elementId === 'columns') { s.columns = Number(value) || s.columns; return; }
  if (elementId === 'layout') { s.layout = value; return; }
  if (elementId === 'backgroundType') { s.backgroundType = value; return; }
  if (elementId === 'backgroundValue') { s.backgroundValue = value; return; }

  // --- Serialized JSON array fields (features, items, images, testimonials) ---
  if (elementId === 'features' || elementId === 'items' || elementId === 'images' || elementId === 'testimonials') {
    try { s[elementId] = JSON.parse(value); } catch { /* keep existing */ }
    return;
  }

  // --- Background image ---
  if (elementId === 'backgroundImage') {
    if (section.type === 'hero') {
      s.backgroundImage = { ...(s.backgroundImage || { alt: '' }), src: value };
    }
    return;
  }

  // --- Hero CTA buttons: primaryCta-text, primaryCta-href, secondaryCta-text, secondaryCta-href ---
  const heroCta = elementId.match(/^(primaryCta|secondaryCta)-(text|href)$/);
  if (heroCta && section.type === 'hero') {
    const idx = heroCta[1] === 'primaryCta' ? 0 : 1;
    const field = heroCta[2];
    if (s.buttons?.[idx]) { s.buttons[idx][field] = field === 'text' ? stripAllHtml(value) : value; }
    return;
  }

  // --- CTA section buttons: primaryButton-text/href/variant, secondaryButton-text/href/variant ---
  const ctaBtn = elementId.match(/^(primaryButton|secondaryButton)-(text|href|variant)$/);
  if (ctaBtn && section.type === 'cta') {
    const key = ctaBtn[1]; // 'primaryButton' or 'secondaryButton'
    const field = ctaBtn[2];
    if (!s[key]) s[key] = { text: '', href: '#', variant: 'primary' };
    s[key][field] = field === 'text' ? stripAllHtml(value) : value;
    return;
  }

  // --- Feature card fields: card-{id}-title, card-{id}-description ---
  const cardMatch = elementId.match(/^card-(.+)-(title|description|icon)$/);
  if (cardMatch && section.type === 'feature-grid') {
    const cardId = cardMatch[1];
    const field = cardMatch[2];
    const card = s.features?.find((f: { id: string }) => f.id === cardId);
    if (card) { card[field] = stripAllHtml(value); }
    return;
  }

  // --- FAQ item fields: faq-{id}-question, faq-{id}-answer ---
  const faqMatch = elementId.match(/^faq-(.+)-(question|answer)$/);
  if (faqMatch && section.type === 'faq') {
    const itemId = faqMatch[1];
    const field = faqMatch[2];
    const item = s.items?.find((f: { id: string }) => f.id === itemId);
    // answers support rich text, questions are plain text
    if (item) { item[field] = field === 'answer' ? value : stripAllHtml(value); }
    return;
  }

  // --- Testimonial fields: testimonial-{id}-quote/authorName/authorTitle ---
  const testMatch = elementId.match(/^testimonial-(.+)-(quote|authorName|authorTitle)$/);
  if (testMatch && section.type === 'testimonials') {
    const tId = testMatch[1];
    const field = testMatch[2];
    const t = s.testimonials?.find((f: { id: string }) => f.id === tId);
    if (t) { t[field] = stripAllHtml(value); }
    return;
  }
}

/**
 * Deep-clone sections and apply all pendingChanges into them.
 * Returns a new array with edits baked in.
 */
function mergePendingIntoSections(
  sections: PageSectionContent[],
  pendingChanges: Map<string, PendingChange>,
): PageSectionContent[] {
  if (pendingChanges.size === 0) return sections;

  // Deep clone so we can mutate safely
  const cloned: PageSectionContent[] = JSON.parse(JSON.stringify(sections));

  pendingChanges.forEach((change) => {
    const { sectionId, elementId } = parseContentKey(change.contentKey);
    const section = cloned.find((s) => s.id === sectionId);
    if (section && elementId) {
      applyFieldToSection(section, elementId, change.newValue);
    }
  });

  return cloned;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const { canEdit } = useEditMode();
  const pathname = usePathname();

  // --- Existing field-level pending changes ---
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
  });
  const [publishState, setPublishState] = useState<PublishState>({
    status: 'idle',
    error: null,
  });

  // --- Page-level SEO state ---
  const [pageSEO, setPageSEO] = useState<PageSEOMetadata>({
    pageTitle: '',
    metaDescription: '',
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
  });
  const [pageSEOChanged, setPageSEOChanged] = useState(false);

  // --- Page slug state ---
  const [pageSlug, setPageSlug] = useState<string>('');

  // --- Section-level state ---
  const [sections, setSections] = useState<PageSectionContent[]>([]);
  const [changedSectionIds, setChangedSectionIds] = useState<Set<string>>(new Set());
  const [sectionStructureChanged, setSectionStructureChanged] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = pendingChanges.size > 0 || changedSectionIds.size > 0 || sectionStructureChanged || pageSEOChanged;
  const hasSectionChanges = changedSectionIds.size > 0 || sectionStructureChanged || pageSEOChanged;
  const pendingCount = pendingChanges.size;

  // ============================================================================
  // Field-level operations (existing - EditableText / EditableImage)
  // ============================================================================

  const updateContent = useCallback((contentKey: string, value: string, type: 'text' | 'image') => {
    if (!canEdit) return;

    setPendingChanges((prev) => {
      const next = new Map(prev);
      const existing = next.get(contentKey);

      next.set(contentKey, {
        contentKey,
        type,
        originalValue: existing?.originalValue || value,
        newValue: value,
        timestamp: Date.now(),
      });

      return next;
    });
  }, [canEdit]);

  const discardChange = useCallback((contentKey: string) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.delete(contentKey);
      return next;
    });
  }, []);

  const discardAllChanges = useCallback(() => {
    setPendingChanges(new Map());
    setChangedSectionIds(new Set());
    setSectionStructureChanged(false);
    setPageSEOChanged(false);
  }, []);

  /** Update page-level SEO metadata (partial merge). */
  const updatePageSEO = useCallback((updates: Partial<PageSEOMetadata>) => {
    if (!canEdit) return;
    setPageSEO((prev) => ({ ...prev, ...updates }));
    setPageSEOChanged(true);
  }, [canEdit]);

  // ============================================================================
  // Section-level operations (new)
  // ============================================================================

  /** Load sections into context (e.g., from API). Resets change tracking. */
  const loadSections = useCallback((incoming: PageSectionContent[]) => {
    const sorted = [...incoming].sort((a, b) => a.order - b.order);
    setSections(reindexSections(sorted));
    setChangedSectionIds(new Set());
    setSectionStructureChanged(false);
  }, []);

  /** Load sections for a specific page, restoring from localStorage if available. */
  const loadSectionsForPage = useCallback((slug: string, defaults: PageSectionContent[]) => {
    setPageSlug(slug);
    const saved = loadPageContent(slug);
    // Sanitize localStorage data to strip stale HTML from plain text fields
    const incoming = saved?.sections ? sanitizeSections(saved.sections) : defaults;
    const sorted = [...incoming].sort((a, b) => a.order - b.order);
    setSections(reindexSections(sorted));
    setChangedSectionIds(new Set());
    setSectionStructureChanged(false);
    if (saved?.seo) {
      setPageSEO(saved.seo);
      setPageSEOChanged(false);
    }
  }, []);

  /** Add a new section at a given index. */
  const addSection = useCallback((section: PageSectionContent, atIndex: number) => {
    if (!canEdit) return;

    setSections((prev) => {
      const next = [...prev];
      const clampedIndex = Math.min(Math.max(0, atIndex), next.length);
      next.splice(clampedIndex, 0, section);
      return reindexSections(next);
    });
    setChangedSectionIds((prev) => new Set(prev).add(section.id));
    setSectionStructureChanged(true);
  }, [canEdit]);

  /** Update a section by ID with a partial content patch. */
  const updateSection = useCallback((sectionId: string, updates: Partial<PageSectionContent>) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        // Merge updates into the section while preserving the discriminated type
        return { ...s, ...updates } as PageSectionContent;
      })
    );
    setChangedSectionIds((prev) => new Set(prev).add(sectionId));
  }, [canEdit]);

  /** Replace a section entirely by ID. */
  const replaceSection = useCallback((sectionId: string, section: PageSectionContent) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...section, order: s.order } as PageSectionContent : s))
    );
    setChangedSectionIds((prev) => new Set(prev).add(sectionId));
  }, [canEdit]);

  /** Delete a section by ID. */
  const deleteSection = useCallback((sectionId: string) => {
    if (!canEdit) return;

    setSections((prev) => reindexSections(prev.filter((s) => s.id !== sectionId)));
    setChangedSectionIds((prev) => {
      const next = new Set(prev);
      next.delete(sectionId); // no need to track deleted section
      return next;
    });
    setSectionStructureChanged(true);
  }, [canEdit]);

  /** Move a section up (swap with previous). */
  const moveSectionUp = useCallback((index: number) => {
    if (!canEdit || index <= 0) return;

    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return reindexSections(next);
    });
    setSectionStructureChanged(true);
  }, [canEdit]);

  /** Move a section down (swap with next). */
  const moveSectionDown = useCallback((index: number) => {
    if (!canEdit) return;

    setSections((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return reindexSections(next);
    });
    setSectionStructureChanged(true);
  }, [canEdit]);

  /** Get a section by ID. */
  const getSection = useCallback((sectionId: string): PageSectionContent | undefined => {
    return sections.find((s) => s.id === sectionId);
  }, [sections]);

  // ============================================================================
  // Save (draft) - handles both field-level and section-level changes
  // ============================================================================

  const saveChanges = useCallback(async () => {
    if (pendingChanges.size === 0 && !hasSectionChanges) return;

    setSaveState({ status: 'saving', lastSaved: null, error: null });

    try {
      // Merge field-level pending changes into sections before saving
      const mergedSections = mergePendingIntoSections(sections, pendingChanges);

      // --- Primary store: localStorage ---
      const slug = pageSlug || 'home';
      const localSaved = savePageContent(slug, mergedSections, pageSEO);
      if (!localSaved) {
        throw new Error('Failed to save to localStorage');
      }

      // Update live sections state with merged data so edits are baked in
      setSections(mergedSections);

      // Clear all change tracking on localStorage success
      setPendingChanges(new Map());
      setChangedSectionIds(new Set());
      setSectionStructureChanged(false);
      setPageSEOChanged(false);
      setSaveState({
        status: 'saved',
        lastSaved: new Date(),
        error: null,
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveState((prev) => ({ ...prev, status: 'idle' }));
      }, 3000);

      // --- Optional: attempt API save (non-blocking) ---
      if (mergedSections.length > 0) {
        fetch('/api/admin/content/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            sections: mergedSections,
            seo: {
              pageTitle: pageSEO.pageTitle || slug,
              metaDescription: pageSEO.metaDescription || '',
              ogImage: pageSEO.ogImage || '',
              ogTitle: pageSEO.ogTitle || '',
              ogDescription: pageSEO.ogDescription || '',
            },
            status: 'draft',
          }),
        }).catch(() => {
          // API not available — localStorage already succeeded
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveState({
        status: 'error',
        lastSaved: null,
        error: error instanceof Error ? error.message : 'Failed to save',
      });

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setSaveState((prev) => ({ ...prev, status: 'idle' }));
      }, 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingChanges, hasSectionChanges, pageSEO, pageSlug, sections]);

  // ============================================================================
  // Auto-save with debounce
  // ============================================================================

  useEffect(() => {
    if (pendingChanges.size === 0 && !hasSectionChanges) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveChanges();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pendingChanges, hasSectionChanges, saveChanges]);

  // ============================================================================
  // Publish
  // ============================================================================

  const publish = useCallback(async () => {
    // First save any pending changes
    if (pendingChanges.size > 0 || hasSectionChanges) {
      await saveChanges();
    }

    setPublishState({ status: 'publishing', error: null });

    try {
      // For demo, we'll just set success
      setPublishState({ status: 'published', error: null });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setPublishState({ status: 'idle', error: null });
      }, 3000);

    } catch (error) {
      console.error('Publish error:', error);
      setPublishState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to publish',
      });

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setPublishState({ status: 'idle', error: null });
      }, 5000);
    }
  }, [pendingChanges, hasSectionChanges, saveChanges]);

  // ============================================================================
  // Warn before leaving with unsaved changes
  // ============================================================================

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ============================================================================
  // Force-save via keyboard shortcut (Cmd+S dispatches custom event)
  // ============================================================================

  useEffect(() => {
    const handleForceSave = () => {
      // Cancel pending auto-save timeout and save immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      saveChanges();
    };

    window.addEventListener('jhr-force-save', handleForceSave);
    return () => window.removeEventListener('jhr-force-save', handleForceSave);
  }, [saveChanges]);

  // ============================================================================
  // Save on client-side navigation (beforeunload doesn't fire for SPA nav)
  // ============================================================================

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Route changed — flush any pending changes immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      // Synchronous localStorage save using current refs
      const slug = pageSlug || 'home';
      if (pendingChanges.size > 0 || changedSectionIds.size > 0 || sectionStructureChanged) {
        const merged = mergePendingIntoSections(sections, pendingChanges);
        savePageContent(slug, merged, pageSEO);
        setPendingChanges(new Map());
        setChangedSectionIds(new Set());
        setSectionStructureChanged(false);
        setPageSEOChanged(false);
      }
      prevPathname.current = pathname;
    }
  }, [pathname, pageSlug, pendingChanges, sections, pageSEO, changedSectionIds, sectionStructureChanged]);

  // ============================================================================
  // Context value
  // ============================================================================

  const value: ContentContextValue = {
    // Field-level
    pendingChanges,
    updateContent,
    discardChange,
    discardAllChanges,
    saveState,
    publishState,
    publish,
    save: saveChanges,
    hasUnsavedChanges,
    pendingCount,

    // Page SEO
    pageSEO,
    updatePageSEO,

    // Section-level
    pageSlug,
    sections,
    changedSectionIds,
    hasSectionChanges,
    loadSections,
    loadSectionsForPage,
    addSection,
    updateSection,
    replaceSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    getSection,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

export { ContentContext };
