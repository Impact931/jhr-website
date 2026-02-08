'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import type {
  ContentContextValue,
  PageSectionContent,
  PageSEOMetadata,
  PendingChange,
  SaveState,
  PublishState,
} from '@/types/inline-editor';
import type { BlogPost, BlogPostStatus } from '@/types/blog';
import { parseContentKey } from '@/types/inline-editor';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { ContentContext } from '@/context/inline-editor/ContentContext';

// ============================================================================
// Types
// ============================================================================

export interface BlogMetadata {
  author: string;
  tags: string[];
  categories: string[];
  excerpt?: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
  status: BlogPostStatus;
}

export interface BlogContentContextValue {
  // Blog identification
  slug: string;
  version: number;

  // Section-level content management (like pages)
  sections: PageSectionContent[];
  changedSectionIds: Set<string>;
  hasSectionChanges: boolean;
  loadSections: (sections: PageSectionContent[]) => void;
  addSection: (section: PageSectionContent, atIndex: number) => void;
  updateSection: (sectionId: string, updates: Partial<PageSectionContent>) => void;
  replaceSection: (sectionId: string, section: PageSectionContent) => void;
  deleteSection: (sectionId: string) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
  getSection: (sectionId: string) => PageSectionContent | undefined;

  // Field-level change tracking
  pendingChanges: Map<string, PendingChange>;
  updateContent: (contentKey: string, value: string, type: 'text' | 'image') => void;
  discardChange: (contentKey: string) => void;
  discardAllChanges: () => void;
  hasUnsavedChanges: boolean;
  pendingCount: number;

  // Page-level SEO metadata
  seo: PageSEOMetadata;
  updateSEO: (updates: Partial<PageSEOMetadata>) => void;

  // Blog-specific metadata
  metadata: BlogMetadata;
  updateMetadata: (updates: Partial<BlogMetadata>) => void;

  // Save/publish state
  saveState: SaveState;
  publishState: PublishState;
  save: () => Promise<void>;
  publish: () => Promise<void>;

  // Load full blog post
  loadBlogPost: (post: BlogPost) => void;
}

const BlogContentContext = createContext<BlogContentContextValue | null>(null);

// ============================================================================
// Constants
// ============================================================================

const AUTO_SAVE_DELAY = 2000; // 2 seconds debounce
const LOCALSTORAGE_KEY_PREFIX = 'jhr-blog-draft-';

// ============================================================================
// Utility Functions
// ============================================================================

function reindexSections(sections: PageSectionContent[]): PageSectionContent[] {
  return sections.map((section, i) => {
    if (section.order === i) return section;
    return { ...section, order: i } as PageSectionContent;
  });
}

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

function applyFieldToSection(section: PageSectionContent, elementId: string, value: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = section as any;

  const plainTextFields = ['title', 'subtitle', 'description', 'heading', 'subheading', 'headline', 'subtext'];
  if (plainTextFields.includes(elementId)) {
    s[elementId] = stripAllHtml(value);
    return;
  }
  if (elementId === 'content') {
    s[elementId] = value;
    return;
  }
  if (elementId === 'columns') { s.columns = Number(value) || s.columns; return; }
  if (elementId === 'layout') { s.layout = value; return; }
  if (elementId === 'backgroundType') { s.backgroundType = value; return; }
  if (elementId === 'backgroundValue') { s.backgroundValue = value; return; }
  if (elementId === 'features' || elementId === 'items' || elementId === 'images' || elementId === 'testimonials') {
    try { s[elementId] = JSON.parse(value); } catch { /* keep existing */ }
    return;
  }
  if (elementId === 'backgroundImage' && section.type === 'hero') {
    s.backgroundImage = { ...(s.backgroundImage || { alt: '' }), src: value };
    return;
  }

  const heroCta = elementId.match(/^(primaryCta|secondaryCta)-(text|href)$/);
  if (heroCta && section.type === 'hero') {
    const idx = heroCta[1] === 'primaryCta' ? 0 : 1;
    const field = heroCta[2];
    if (s.buttons?.[idx]) { s.buttons[idx][field] = field === 'text' ? stripAllHtml(value) : value; }
    return;
  }

  const ctaBtn = elementId.match(/^(primaryButton|secondaryButton)-(text|href|variant)$/);
  if (ctaBtn && section.type === 'cta') {
    const key = ctaBtn[1];
    const field = ctaBtn[2];
    if (!s[key]) s[key] = { text: '', href: '#', variant: 'primary' };
    s[key][field] = field === 'text' ? stripAllHtml(value) : value;
    return;
  }

  const cardMatch = elementId.match(/^card-(.+)-(title|description|icon)$/);
  if (cardMatch && section.type === 'feature-grid') {
    const cardId = cardMatch[1];
    const field = cardMatch[2];
    const card = s.features?.find((f: { id: string }) => f.id === cardId);
    if (card) { card[field] = stripAllHtml(value); }
    return;
  }

  const faqMatch = elementId.match(/^faq-(.+)-(question|answer)$/);
  if (faqMatch && section.type === 'faq') {
    const itemId = faqMatch[1];
    const field = faqMatch[2];
    const item = s.items?.find((f: { id: string }) => f.id === itemId);
    if (item) { item[field] = field === 'answer' ? value : stripAllHtml(value); }
    return;
  }

  const testMatch = elementId.match(/^testimonial-(.+)-(quote|authorName|authorTitle)$/);
  if (testMatch && section.type === 'testimonials') {
    const tId = testMatch[1];
    const field = testMatch[2];
    const t = s.testimonials?.find((f: { id: string }) => f.id === tId);
    if (t) { t[field] = stripAllHtml(value); }
    return;
  }
}

function mergePendingIntoSections(
  sections: PageSectionContent[],
  pendingChanges: Map<string, PendingChange>,
): PageSectionContent[] {
  if (pendingChanges.size === 0) return sections;

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

// ============================================================================
// Provider Component
// ============================================================================

interface BlogContentProviderProps {
  children: ReactNode;
  initialSlug?: string;
  initialPost?: BlogPost;
}

export function BlogContentProvider({
  children,
  initialSlug = '',
  initialPost,
}: BlogContentProviderProps) {
  const { canEdit } = useEditMode();

  // Blog identification
  const [slug, setSlug] = useState(initialSlug);
  const [version, setVersion] = useState(initialPost?.version || 1);

  // Sections
  const [sections, setSections] = useState<PageSectionContent[]>(
    initialPost?.sections || []
  );
  const [changedSectionIds, setChangedSectionIds] = useState<Set<string>>(new Set());
  const [sectionStructureChanged, setSectionStructureChanged] = useState(false);

  // Field-level changes
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());

  // SEO metadata
  const [seo, setSeo] = useState<PageSEOMetadata>(
    initialPost?.seo || {
      pageTitle: initialPost?.title || '',
      metaDescription: initialPost?.excerpt || '',
      ogImage: initialPost?.featuredImage || '',
      ogTitle: initialPost?.title || '',
      ogDescription: initialPost?.excerpt || '',
    }
  );
  const [seoChanged, setSeoChanged] = useState(false);

  // Blog metadata
  const [metadata, setMetadata] = useState<BlogMetadata>({
    author: initialPost?.author || 'JHR Photography',
    tags: initialPost?.tags || [],
    categories: initialPost?.categories || [],
    excerpt: initialPost?.excerpt,
    publishedAt: initialPost?.publishedAt,
    scheduledPublishAt: initialPost?.scheduledPublishAt,
    status: initialPost?.status || 'draft',
  });
  const [metadataChanged, setMetadataChanged] = useState(false);

  // Save/publish state
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
  });
  const [publishState, setPublishState] = useState<PublishState>({
    status: 'idle',
    error: null,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Computed values
  const hasUnsavedChanges = pendingChanges.size > 0 || changedSectionIds.size > 0 || sectionStructureChanged || seoChanged || metadataChanged;
  const hasSectionChanges = changedSectionIds.size > 0 || sectionStructureChanged;
  const pendingCount = pendingChanges.size;

  // ============================================================================
  // localStorage helpers
  // ============================================================================

  const saveToLocalStorage = useCallback((slugToSave: string, data: {
    sections: PageSectionContent[];
    seo: PageSEOMetadata;
    metadata: BlogMetadata;
    version: number;
  }) => {
    try {
      localStorage.setItem(
        `${LOCALSTORAGE_KEY_PREFIX}${slugToSave}`,
        JSON.stringify({ ...data, savedAt: new Date().toISOString() })
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadFromLocalStorage = useCallback((slugToLoad: string) => {
    try {
      const saved = localStorage.getItem(`${LOCALSTORAGE_KEY_PREFIX}${slugToLoad}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  }, []);

  const clearLocalStorage = useCallback((slugToClear: string) => {
    try {
      localStorage.removeItem(`${LOCALSTORAGE_KEY_PREFIX}${slugToClear}`);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // ============================================================================
  // Load operations
  // ============================================================================

  const loadSections = useCallback((incoming: PageSectionContent[]) => {
    const sorted = [...incoming].sort((a, b) => a.order - b.order);
    setSections(reindexSections(sorted));
    setChangedSectionIds(new Set());
    setSectionStructureChanged(false);
  }, []);

  const loadBlogPost = useCallback((post: BlogPost) => {
    setSlug(post.slug);
    setVersion(post.version || 1);

    // Check localStorage for unsaved changes
    const saved = loadFromLocalStorage(post.slug);
    if (saved && saved.version === post.version) {
      // Use localStorage version if it matches the server version
      setSections(reindexSections(saved.sections || []));
      setSeo(saved.seo || {
        pageTitle: post.title,
        metaDescription: post.excerpt || '',
        ogImage: post.featuredImage || '',
        ogTitle: post.title,
        ogDescription: post.excerpt || '',
      });
      setMetadata(saved.metadata || {
        author: post.author || 'JHR Photography',
        tags: post.tags || [],
        categories: post.categories || [],
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        scheduledPublishAt: post.scheduledPublishAt,
        status: post.status || 'draft',
      });
    } else {
      // Use server version
      const sorted = [...(post.sections || [])].sort((a, b) => a.order - b.order);
      setSections(reindexSections(sorted));
      setSeo({
        pageTitle: post.seo?.pageTitle || post.title,
        metaDescription: post.seo?.metaDescription || post.excerpt || '',
        ogImage: post.seo?.ogImage || post.featuredImage || '',
        ogTitle: post.seo?.ogTitle || post.title,
        ogDescription: post.seo?.ogDescription || post.excerpt || '',
      });
      setMetadata({
        author: post.author || 'JHR Photography',
        tags: post.tags || [],
        categories: post.categories || [],
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        scheduledPublishAt: post.scheduledPublishAt,
        status: post.status || 'draft',
      });
    }

    // Reset change tracking
    setPendingChanges(new Map());
    setChangedSectionIds(new Set());
    setSectionStructureChanged(false);
    setSeoChanged(false);
    setMetadataChanged(false);
  }, [loadFromLocalStorage]);

  // ============================================================================
  // Section operations
  // ============================================================================

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

  const updateSection = useCallback((sectionId: string, updates: Partial<PageSectionContent>) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, ...updates } as PageSectionContent;
      })
    );
    setChangedSectionIds((prev) => new Set(prev).add(sectionId));
  }, [canEdit]);

  const replaceSection = useCallback((sectionId: string, section: PageSectionContent) => {
    if (!canEdit) return;

    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...section, order: s.order } as PageSectionContent : s))
    );
    setChangedSectionIds((prev) => new Set(prev).add(sectionId));
  }, [canEdit]);

  const deleteSection = useCallback((sectionId: string) => {
    if (!canEdit) return;

    setSections((prev) => reindexSections(prev.filter((s) => s.id !== sectionId)));
    setChangedSectionIds((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
    setSectionStructureChanged(true);
  }, [canEdit]);

  const moveSectionUp = useCallback((index: number) => {
    if (!canEdit || index <= 0) return;

    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return reindexSections(next);
    });
    setSectionStructureChanged(true);
  }, [canEdit]);

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

  const getSection = useCallback((sectionId: string): PageSectionContent | undefined => {
    return sections.find((s) => s.id === sectionId);
  }, [sections]);

  // ============================================================================
  // Field-level operations
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
    setSeoChanged(false);
    setMetadataChanged(false);
  }, []);

  // ============================================================================
  // SEO/Metadata operations
  // ============================================================================

  const updateSEO = useCallback((updates: Partial<PageSEOMetadata>) => {
    if (!canEdit) return;
    setSeo((prev) => ({ ...prev, ...updates }));
    setSeoChanged(true);
  }, [canEdit]);

  const updateMetadata = useCallback((updates: Partial<BlogMetadata>) => {
    if (!canEdit) return;
    setMetadata((prev) => ({ ...prev, ...updates }));
    setMetadataChanged(true);
  }, [canEdit]);

  // ============================================================================
  // Save operation
  // ============================================================================

  const save = useCallback(async () => {
    if (!hasUnsavedChanges || !slug) return;

    setSaveState({ status: 'saving', lastSaved: null, error: null });

    try {
      // Merge field-level changes into sections
      const mergedSections = mergePendingIntoSections(sections, pendingChanges);

      // --- Primary store: localStorage (synchronous, never fails) ---
      saveToLocalStorage(slug, {
        sections: mergedSections,
        seo,
        metadata,
        version,
      });

      // Update live sections state with merged data so edits are baked in
      setSections(mergedSections);

      // Clear all change tracking immediately on localStorage success
      // (matches ContentContext page save behavior)
      setPendingChanges(new Map());
      setChangedSectionIds(new Set());
      setSectionStructureChanged(false);
      setSeoChanged(false);
      setMetadataChanged(false);

      setSaveState({
        status: 'saved',
        lastSaved: new Date(),
        error: null,
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveState((prev) => ({ ...prev, status: 'idle' }));
      }, 3000);

      // --- Persist to DynamoDB via admin API (background, non-blocking) ---
      if (canEdit) {
        try {
          const response = await fetch(`/api/admin/blog/${slug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sections: mergedSections,
              seo,
              excerpt: metadata.excerpt,
              tags: metadata.tags,
              categories: metadata.categories,
              scheduledPublishAt: metadata.scheduledPublishAt,
              // Don't send version — avoids concurrency conflicts for single-user CMS
            }),
          });

          if (response.ok) {
            const result = await response.json();
            // Update version from server response
            if (result.post?.version) {
              setVersion(result.post.version);
            }
            // Clear localStorage after successful API save
            clearLocalStorage(slug);
          } else {
            console.warn(`[BlogContentContext] API save returned ${response.status} — localStorage succeeded`);
          }
        } catch (apiErr) {
          console.warn('[BlogContentContext] API save failed — localStorage succeeded:', apiErr);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveState({
        status: 'error',
        lastSaved: null,
        error: error instanceof Error ? error.message : 'Failed to save',
      });

      setTimeout(() => {
        setSaveState((prev) => ({ ...prev, status: 'idle' }));
      }, 5000);
    }
  }, [hasUnsavedChanges, slug, sections, pendingChanges, seo, metadata, version, canEdit, saveToLocalStorage, clearLocalStorage]);

  // ============================================================================
  // Publish operation
  // ============================================================================

  const publish = useCallback(async () => {
    // First save any pending changes
    if (hasUnsavedChanges) {
      await save();
    }

    setPublishState({ status: 'publishing', error: null });

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'publish' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish');
      }

      // Update local metadata
      setMetadata((prev) => ({
        ...prev,
        status: 'published',
        publishedAt: new Date().toISOString(),
      }));

      setPublishState({ status: 'published', error: null });

      setTimeout(() => {
        setPublishState({ status: 'idle', error: null });
      }, 3000);

    } catch (error) {
      console.error('Publish error:', error);
      setPublishState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to publish',
      });

      setTimeout(() => {
        setPublishState({ status: 'idle', error: null });
      }, 5000);
    }
  }, [hasUnsavedChanges, save, slug]);

  // ============================================================================
  // Auto-save with debounce
  // ============================================================================

  useEffect(() => {
    if (!hasUnsavedChanges || !slug) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, slug, save]);

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
  // Force-save via keyboard shortcut
  // ============================================================================

  useEffect(() => {
    const handleForceSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      save();
    };

    window.addEventListener('jhr-force-save', handleForceSave);
    return () => window.removeEventListener('jhr-force-save', handleForceSave);
  }, [save]);

  // ============================================================================
  // Context value
  // ============================================================================

  const value: BlogContentContextValue = {
    // Blog identification
    slug,
    version,

    // Sections
    sections,
    changedSectionIds,
    hasSectionChanges,
    loadSections,
    addSection,
    updateSection,
    replaceSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    getSection,

    // Field-level
    pendingChanges,
    updateContent,
    discardChange,
    discardAllChanges,
    hasUnsavedChanges,
    pendingCount,

    // SEO
    seo,
    updateSEO,

    // Blog metadata
    metadata,
    updateMetadata,

    // Save/publish
    saveState,
    publishState,
    save,
    publish,

    // Load
    loadBlogPost,
  };

  // Bridge: provide ContentContext so all Editable* components (which call
  // useContent()) read/write from the blog context instead of the outer
  // layout-level ContentProvider. This prevents edits going to the wrong
  // context and being lost on auto-save.
  const contentBridge: ContentContextValue = {
    pendingChanges,
    updateContent,
    discardChange,
    discardAllChanges,
    saveState,
    publishState,
    publish,
    save,
    hasUnsavedChanges,
    pendingCount,
    pageSEO: seo,
    updatePageSEO: updateSEO,
    contentLoadState: 'loaded',
    pageSlug: slug,
    sections,
    changedSectionIds,
    hasSectionChanges,
    loadSections,
    loadSectionsForPage: () => {},
    addSection,
    updateSection,
    replaceSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    getSection,
    addSectionToColumn: () => {},
    removeSectionFromColumn: () => {},
    moveSectionBetweenColumns: () => {},
  };

  return (
    <BlogContentContext.Provider value={value}>
      <ContentContext.Provider value={contentBridge}>
        {children}
      </ContentContext.Provider>
    </BlogContentContext.Provider>
  );
}

export function useBlogContent(): BlogContentContextValue {
  const context = useContext(BlogContentContext);
  if (!context) {
    throw new Error('useBlogContent must be used within a BlogContentProvider');
  }
  return context;
}

export { BlogContentContext };
