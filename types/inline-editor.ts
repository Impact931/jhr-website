/**
 * Types for the frontend inline editor system
 *
 * Content Schema Architecture:
 * - PageSchema holds an ordered array of PageSection items
 * - Each PageSection has a SectionType discriminator with type-specific content
 * - Sections contain editable fields with AI-friendly descriptions and constraints
 * - SEO attributes (aria-label, data-section-name, id) are attached per section
 *
 * Content Key Format: {pageSlug}:{sectionId}:{elementId}
 * Example: "home:hero-1:title", "about:features-1:card-0-title"
 */

// ============================================================================
// Section Types - Discriminated Union
// ============================================================================

/**
 * All supported inline editor section types.
 * Each maps to an editable component in /components/inline-editor/.
 */
export type InlineSectionType =
  | 'hero'
  | 'text-block'
  | 'feature-grid'
  | 'image-gallery'
  | 'cta'
  | 'testimonials'
  | 'faq'
  | 'columns';

/**
 * Variant options for hero sections.
 * - full-height: 100vh hero with overlay
 * - half-height: 50vh hero
 * - banner: Compact banner style
 */
export type HeroVariant = 'full-height' | 'half-height' | 'banner';

/**
 * Layout options for image galleries.
 * - grid: CSS grid layout
 * - slider: Horizontal scrolling carousel
 * - masonry: Pinterest-style masonry layout
 */
export type GalleryLayout = 'grid' | 'slider' | 'masonry' | 'single';

/**
 * Layout options for feature grids.
 * Number represents columns on desktop.
 */
export type FeatureGridColumns = 2 | 3 | 4;

/**
 * Layout options for testimonial sections.
 * - single: One testimonial at a time
 * - carousel: Horizontal scrolling
 * - grid: Multi-column grid
 */
export type TestimonialLayout = 'single' | 'carousel' | 'grid';

/**
 * Background style for CTA sections.
 * - solid: Single color background
 * - gradient: CSS gradient background
 * - image: Background image with overlay
 */
export type CTABackground = 'solid' | 'gradient' | 'image';

/**
 * Layout options for columns sections.
 * Defines how columns are sized relative to each other.
 */
export type ColumnsLayout =
  | 'equal-2'   // 50/50
  | '1/3-2/3'   // 33/67
  | '2/3-1/3'   // 67/33
  | '1/4-3/4'   // 25/75
  | '3/4-1/4'   // 75/25
  | 'equal-3';  // 33/33/33

/**
 * A single column within a columns section.
 * Contains an ordered array of child sections.
 */
export interface ColumnData {
  /** Ordered child sections within this column. */
  sections: PageSectionContent[];
}

// ============================================================================
// SEO Attributes (per-section)
// ============================================================================

/**
 * SEO and accessibility attributes for each page section.
 * These are rendered as HTML attributes on the section wrapper element.
 *
 * AI hint: When generating content, provide a concise aria-label describing
 * the section purpose and a kebab-case sectionName for anchor linking.
 */
export interface SectionSEOAttributes {
  /** Accessible label describing the section purpose. Max 120 characters.
   *  Example: "Photography services hero banner" */
  ariaLabel?: string;
  /** HTML id for anchor links. Kebab-case, unique per page.
   *  Example: "services-hero", "about-features" */
  sectionId?: string;
  /** Machine-readable section name for data attributes.
   *  Example: "hero", "feature-grid", "testimonials" */
  dataSectionName?: string;
}

// ============================================================================
// Editable Field Types
// ============================================================================

/**
 * A CTA button with editable text and link.
 * AI constraint: text max 40 characters, href must be valid URL or relative path.
 */
export interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/**
 * An image with editable source, alt text, and optional caption.
 * AI constraint: alt text max 125 characters (for screen readers),
 * caption max 200 characters.
 */
export interface EditableImageField {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** Vertical position for object-fit: cover (0-100, where 0=top, 50=center, 100=bottom). */
  positionY?: number;
}

/**
 * A feature/blurb card with icon, title, description, and optional link.
 * AI constraint: title max 60 characters, description max 200 characters.
 */
export interface FeatureCard {
  id: string;
  /** Lucide icon name (e.g., "Camera", "Star", "Shield"). */
  icon: string;
  /** Feature title. Max 60 characters. Rendered as h3. */
  title: string;
  /** Feature description. Max 200 characters. Rendered as p. */
  description: string;
  /** Optional link for the card. */
  link?: { text: string; href: string };
}

/**
 * A testimonial entry.
 * AI constraint: quote max 500 characters, authorName max 60 characters,
 * authorTitle max 80 characters.
 */
export interface Testimonial {
  id: string;
  /** The quote text. Max 500 characters. */
  quote: string;
  /** Author's name. Max 60 characters. */
  authorName: string;
  /** Author's title/role. Max 80 characters. */
  authorTitle: string;
  /** Author's photo. */
  authorImage?: EditableImageField;
}

/**
 * A FAQ item with question and rich text answer.
 * AI constraint: question max 150 characters, answer max 1000 characters (HTML).
 */
export interface FAQItem {
  id: string;
  /** The question. Rendered as h3. Max 150 characters. */
  question: string;
  /** The answer. Supports rich text HTML. Max 1000 characters. */
  answer: string;
}

// ============================================================================
// Section Content Types (discriminated by type field)
// ============================================================================

/** Base fields shared by all sections. */
export interface BaseSectionContent {
  /** Unique section ID within the page. Format: "{type}-{index}" */
  id: string;
  /** Section type discriminator. */
  type: InlineSectionType;
  /** Display order (0-based). */
  order: number;
  /** SEO attributes for this section. */
  seo: SectionSEOAttributes;
}

/**
 * Hero section content.
 * Used for page-level hero banners with title, subtitle, background, and CTAs.
 *
 * AI hint: Title should be compelling (max 80 chars), subtitle supporting (max 120 chars),
 * description provides detail (max 300 chars HTML).
 */
export interface HeroSectionContent extends BaseSectionContent {
  type: 'hero';
  /** Hero display variant. */
  variant: HeroVariant;
  /** Main headline. Rendered as h1. Max 80 characters. */
  title: string;
  /** Supporting subtitle. Rendered as p.text-lg. Max 120 characters. */
  subtitle: string;
  /** Optional descriptive text. Supports rich text HTML. Max 300 characters. */
  description?: string;
  /** Background image for the hero. */
  backgroundImage?: EditableImageField;
  /** Call-to-action buttons. Max 2 buttons. */
  buttons: CTAButton[];
}

/**
 * Text block section content.
 * Free-form rich text content with optional heading.
 *
 * AI hint: heading max 100 characters, content is full HTML with semantic elements.
 */
export interface TextBlockSectionContent extends BaseSectionContent {
  type: 'text-block';
  /** Optional section heading. Rendered as h2. Max 100 characters. */
  heading?: string;
  /** Rich text HTML content. Supports h2-h6, p, ul, ol, a, strong, em, img. */
  content: string;
  /** Text alignment. */
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Feature grid section content.
 * A grid of feature/blurb cards with icons.
 *
 * AI hint: heading max 100 characters, subheading max 200 characters.
 * Recommended 3-6 features for visual balance.
 */
export interface FeatureGridSectionContent extends BaseSectionContent {
  type: 'feature-grid';
  /** Section heading. Rendered as h2. Max 100 characters. */
  heading?: string;
  /** Section subheading. Rendered as p. Max 200 characters. */
  subheading?: string;
  /** Number of columns on desktop. */
  columns: FeatureGridColumns;
  /** Feature cards. Recommended 3-6 items. */
  features: FeatureCard[];
}

/**
 * Image gallery section content.
 * A collection of images in various layouts.
 *
 * AI hint: heading max 100 characters. Provide descriptive alt text for accessibility.
 */
export interface ImageGallerySectionContent extends BaseSectionContent {
  type: 'image-gallery';
  /** Section heading. Rendered as h2. Max 100 characters. */
  heading?: string;
  /** Gallery layout. */
  layout: GalleryLayout;
  /** Gallery images. */
  images: EditableImageField[];
}

/**
 * CTA (Call to Action) section content.
 * Prominent section designed to drive user action.
 *
 * AI hint: headline max 80 characters, subtext max 200 characters.
 */
export interface CTASectionContent extends BaseSectionContent {
  type: 'cta';
  /** CTA headline. Rendered as h2. Max 80 characters. */
  headline: string;
  /** Supporting text. Rendered as p. Max 200 characters. */
  subtext: string;
  /** Background style. */
  backgroundType: CTABackground;
  /** Background value: hex color, CSS gradient, or image URL. */
  backgroundValue: string;
  /** Vertical position for background image (0-100, 0=top, 50=center, 100=bottom). */
  imagePositionY?: number;
  /** Primary CTA button. */
  primaryButton: CTAButton;
  /** Optional secondary button. */
  secondaryButton?: CTAButton;
}

/**
 * Testimonials section content.
 * Customer/client testimonials in various layouts.
 *
 * AI hint: heading max 100 characters. Testimonials should feel authentic.
 */
export interface TestimonialsSectionContent extends BaseSectionContent {
  type: 'testimonials';
  /** Section heading. Rendered as h2. Max 100 characters. */
  heading?: string;
  /** Display layout. */
  layout: TestimonialLayout;
  /** Card color variant. 'dark' = dark card (default), 'light' = white card with shadow. */
  cardVariant?: 'dark' | 'light';
  /** Testimonial entries. */
  testimonials: Testimonial[];
}

/**
 * FAQ section content.
 * Accordion-style FAQ items that generate JSON-LD structured data.
 *
 * AI hint: heading max 100 characters. Questions should be natural language.
 * Answers support rich text HTML.
 */
export interface FAQSectionContent extends BaseSectionContent {
  type: 'faq';
  /** Section heading. Rendered as h2. Max 100 characters. */
  heading?: string;
  /** FAQ items. */
  items: FAQItem[];
}

/**
 * Columns section content.
 * A multi-column layout container that holds child sections side-by-side.
 * Columns collapse to single column on mobile.
 *
 * AI hint: This is a layout container — it does not have its own text content.
 * Child sections are regular section types (except hero and columns, which are excluded).
 */
export interface ColumnsSectionContent extends BaseSectionContent {
  type: 'columns';
  /** Column layout preset. */
  layout: ColumnsLayout;
  /** Array of columns, each containing child sections. */
  columns: ColumnData[];
}

/**
 * Union of all section content types.
 * Use the `type` field as discriminator for type narrowing.
 */
export type PageSectionContent =
  | HeroSectionContent
  | TextBlockSectionContent
  | FeatureGridSectionContent
  | ImageGallerySectionContent
  | CTASectionContent
  | TestimonialsSectionContent
  | FAQSectionContent
  | ColumnsSectionContent;

// ============================================================================
// Page Schema
// ============================================================================

/**
 * Page-level SEO metadata.
 * AI constraint: title 50-60 chars, description 150-160 chars.
 */
export interface PageSEOMetadata {
  /** Page title for <title> tag. 50-60 characters recommended. */
  pageTitle: string;
  /** Meta description. 150-160 characters recommended. */
  metaDescription: string;
  /** Open Graph image URL. */
  ogImage?: string;
  /** Open Graph title (defaults to pageTitle if not set). */
  ogTitle?: string;
  /** Open Graph description (defaults to metaDescription if not set). */
  ogDescription?: string;
  /** Canonical URL. */
  canonicalUrl?: string;
}

/**
 * Complete page schema for the inline editor.
 * Represents the full editable structure of a page as an ordered array of sections.
 *
 * AI hint: This is the top-level structure. Each section has its own type and content.
 * Sections are ordered by the `order` field and rendered sequentially.
 */
export interface PageSchema {
  /** Unique page identifier (URL slug). */
  slug: string;
  /** Display name for the page. */
  name: string;
  /** Page-level SEO metadata. */
  seo: PageSEOMetadata;
  /** Ordered array of page sections. Sort by `order` field. */
  sections: PageSectionContent[];
  /** ISO timestamp of last edit. */
  updatedAt: string;
  /** User ID of last editor. */
  updatedBy?: string;
  /** Content version for conflict detection. */
  version: number;
}

// ============================================================================
// Default Content Generators (for new sections)
// ============================================================================

/**
 * Creates a default section of the given type with placeholder content.
 * Used when adding new sections via AddSectionModal.
 */
export function createDefaultSection(
  type: InlineSectionType,
  order: number
): PageSectionContent {
  const id = `${type}-${Date.now()}`;
  const baseSeo: SectionSEOAttributes = {
    ariaLabel: '',
    sectionId: id,
    dataSectionName: type,
  };

  switch (type) {
    case 'hero':
      return {
        id,
        type: 'hero',
        order,
        seo: baseSeo,
        variant: 'full-height',
        title: 'Your Headline Here',
        subtitle: 'Supporting subtitle text',
        description: '',
        buttons: [{ text: 'Get Started', href: '#', variant: 'primary' }],
      };
    case 'text-block':
      return {
        id,
        type: 'text-block',
        order,
        seo: baseSeo,
        content: '<p>Enter your content here...</p>',
        alignment: 'left',
      };
    case 'feature-grid':
      return {
        id,
        type: 'feature-grid',
        order,
        seo: baseSeo,
        columns: 3,
        features: [
          {
            id: `${id}-card-0`,
            icon: 'Camera',
            title: 'Feature One',
            description: 'Describe this feature.',
          },
          {
            id: `${id}-card-1`,
            icon: 'Star',
            title: 'Feature Two',
            description: 'Describe this feature.',
          },
          {
            id: `${id}-card-2`,
            icon: 'Shield',
            title: 'Feature Three',
            description: 'Describe this feature.',
          },
        ],
      };
    case 'image-gallery':
      return {
        id,
        type: 'image-gallery',
        order,
        seo: baseSeo,
        layout: 'grid',
        images: [],
      };
    case 'cta':
      return {
        id,
        type: 'cta',
        order,
        seo: baseSeo,
        headline: 'Ready to Get Started?',
        subtext: 'Contact us today for a free consultation.',
        backgroundType: 'solid',
        backgroundValue: '#0A0A0A',
        primaryButton: { text: 'Contact Us', href: '/contact', variant: 'primary' },
      };
    case 'testimonials':
      return {
        id,
        type: 'testimonials',
        order,
        seo: baseSeo,
        layout: 'carousel',
        testimonials: [
          {
            id: `${id}-testimonial-0`,
            quote: 'Add a testimonial quote here.',
            authorName: 'Client Name',
            authorTitle: 'Position, Company',
          },
        ],
      };
    case 'faq':
      return {
        id,
        type: 'faq',
        order,
        seo: baseSeo,
        items: [
          {
            id: `${id}-faq-0`,
            question: 'What is your first question?',
            answer: '<p>Provide a helpful answer here.</p>',
          },
        ],
      };
    case 'columns':
      return {
        id,
        type: 'columns',
        order,
        seo: baseSeo,
        layout: 'equal-2',
        columns: [
          { sections: [] },
          { sections: [] },
        ],
      };
  }
}

/**
 * AI-friendly field constraints for content generation.
 * Maps section type + field name to constraints.
 * LLMs can use this to generate content that fits the schema.
 */
export const FIELD_CONSTRAINTS: Record<string, { maxLength?: number; allowedTags?: string[]; description: string }> = {
  'hero.title': { maxLength: 80, description: 'Main page headline, compelling and action-oriented. Rendered as h1.' },
  'hero.subtitle': { maxLength: 120, description: 'Supporting text below headline. Rendered as paragraph.' },
  'hero.description': { maxLength: 300, allowedTags: ['p', 'strong', 'em', 'a'], description: 'Optional detail text with basic formatting.' },
  'text-block.heading': { maxLength: 100, description: 'Section heading. Rendered as h2.' },
  'text-block.content': { allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'img', 'blockquote'], description: 'Rich text HTML content.' },
  'feature-grid.heading': { maxLength: 100, description: 'Grid section heading. Rendered as h2.' },
  'feature-grid.subheading': { maxLength: 200, description: 'Supporting text below grid heading.' },
  'feature-card.title': { maxLength: 60, description: 'Feature card title. Rendered as h3.' },
  'feature-card.description': { maxLength: 200, description: 'Feature card description text.' },
  'image.alt': { maxLength: 125, description: 'Image alt text for accessibility and SEO.' },
  'image.caption': { maxLength: 200, description: 'Optional image caption text.' },
  'cta.headline': { maxLength: 80, description: 'CTA headline, action-oriented. Rendered as h2.' },
  'cta.subtext': { maxLength: 200, description: 'CTA supporting text.' },
  'cta-button.text': { maxLength: 40, description: 'Button label text.' },
  'testimonial.quote': { maxLength: 500, description: 'Customer testimonial quote text.' },
  'testimonial.authorName': { maxLength: 60, description: 'Testimonial author name.' },
  'testimonial.authorTitle': { maxLength: 80, description: 'Author title/role and company.' },
  'faq.question': { maxLength: 150, description: 'FAQ question in natural language.' },
  'faq.answer': { maxLength: 1000, allowedTags: ['p', 'ul', 'ol', 'li', 'a', 'strong', 'em'], description: 'FAQ answer with basic rich text formatting.' },
  'seo.ariaLabel': { maxLength: 120, description: 'Accessible label describing section purpose.' },
  'seo.pageTitle': { maxLength: 60, description: 'Page title for browser tab and search results.' },
  'seo.metaDescription': { maxLength: 160, description: 'Page meta description for search results.' },
};

/**
 * List of all available section types with display metadata.
 * Used by AddSectionModal to show available options.
 */
export const SECTION_TYPE_META: Record<InlineSectionType, { label: string; description: string; icon: string }> = {
  'hero': { label: 'Hero Banner', description: 'Full-width hero with title, subtitle, image, and CTAs', icon: 'Layout' },
  'text-block': { label: 'Text Block', description: 'Free-form rich text content with optional heading', icon: 'Type' },
  'feature-grid': { label: 'Feature Grid', description: 'Grid of feature cards with icons and descriptions', icon: 'Grid3X3' },
  'image-gallery': { label: 'Image Gallery', description: 'Image collection in grid, slider, or masonry layout', icon: 'Images' },
  'cta': { label: 'Call to Action', description: 'Prominent section with headline and action buttons', icon: 'MousePointerClick' },
  'testimonials': { label: 'Testimonials', description: 'Customer testimonials in various layouts', icon: 'Quote' },
  'faq': { label: 'FAQ', description: 'Frequently asked questions with accordion layout', icon: 'HelpCircle' },
  'columns': { label: 'Columns', description: 'Multi-column layout with side-by-side content sections', icon: 'Columns' },
};

// ============================================================================
// Existing Types (Edit Mode, Pending Changes, Context Values)
// ============================================================================

export interface EditModeState {
  isEditMode: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface PendingChange {
  contentKey: string;
  type: 'text' | 'image';
  originalValue: string;
  newValue: string;
  timestamp: number;
}

export interface SaveState {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  error: string | null;
}

export interface PublishState {
  status: 'idle' | 'confirming' | 'publishing' | 'published' | 'error';
  error: string | null;
}

/**
 * Loading state for content fetched from the API.
 * - 'idle': No load attempted yet
 * - 'loading': Fetching from API in background
 * - 'loaded': API data received and applied
 * - 'error': API fetch failed (localStorage/defaults are still in use)
 */
export type ContentLoadState = 'idle' | 'loading' | 'loaded' | 'error';

export interface ContentContextValue {
  // --- Existing field-level change tracking (EditableText / EditableImage) ---
  pendingChanges: Map<string, PendingChange>;
  updateContent: (contentKey: string, value: string, type: 'text' | 'image') => void;
  discardChange: (contentKey: string) => void;
  discardAllChanges: () => void;
  saveState: SaveState;
  publishState: PublishState;
  publish: () => Promise<void>;
  /** Manually trigger a save (bypasses auto-save debounce). */
  save: () => Promise<void>;
  hasUnsavedChanges: boolean;
  pendingCount: number;

  // --- Page-level SEO metadata ---
  /** Current page SEO metadata. */
  pageSEO: PageSEOMetadata;
  /** Update page SEO metadata (partial merge). */
  updatePageSEO: (updates: Partial<PageSEOMetadata>) => void;

  // --- Content loading state ---
  /** Whether content has been loaded from the API. */
  contentLoadState: ContentLoadState;

  // --- Section-based content management ---
  /** Current page sections array. Empty until loadSections is called. */
  sections: PageSectionContent[];
  /** IDs of sections that have been modified since last save. */
  changedSectionIds: Set<string>;
  /** Whether any section-level changes exist (add/delete/reorder/update). */
  hasSectionChanges: boolean;

  /** Current page slug being edited. */
  pageSlug: string;
  /** Load sections into context (e.g., from API response). */
  loadSections: (sections: PageSectionContent[]) => void;
  /** Load sections for a specific page, restoring from localStorage if available. */
  loadSectionsForPage: (slug: string, defaults: PageSectionContent[]) => void;
  /** Add a new section at the given order index. Shifts subsequent sections. */
  addSection: (section: PageSectionContent, atIndex: number) => void;
  /** Update a section by ID with a partial content patch. */
  updateSection: (sectionId: string, updates: Partial<PageSectionContent>) => void;
  /** Replace a section entirely by ID. */
  replaceSection: (sectionId: string, section: PageSectionContent) => void;
  /** Delete a section by ID. */
  deleteSection: (sectionId: string) => void;
  /** Move a section up (swap with previous). */
  moveSectionUp: (index: number) => void;
  /** Move a section down (swap with next). */
  moveSectionDown: (index: number) => void;
  /** Get a section by ID. */
  getSection: (sectionId: string) => PageSectionContent | undefined;

  // --- Column child section management ---
  /** Add a child section to a specific column within a columns section. */
  addSectionToColumn: (parentId: string, colIndex: number, section: PageSectionContent) => void;
  /** Remove a child section from a specific column within a columns section. */
  removeSectionFromColumn: (parentId: string, colIndex: number, sectionId: string) => void;
  /** Move a child section between columns (or reorder within the same column). */
  moveSectionBetweenColumns: (parentId: string, fromCol: number, toCol: number, sectionId: string, targetIndex: number) => void;
}

export interface EditModeContextValue {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  isAuthenticated: boolean;
  user: UserInfo | null;
  canEdit: boolean;
}

// Content key format: {pageSlug}:{sectionId}:{elementId}
// Examples: "home:hero:title", "about:bio:paragraph-1"
export interface ContentKeyParts {
  pageSlug: string;
  sectionId: string;
  elementId: string;
}

export function parseContentKey(key: string): ContentKeyParts {
  const parts = key.split(':');
  return {
    pageSlug: parts[0] || '',
    sectionId: parts[1] || '',
    elementId: parts.slice(2).join(':') || '',
  };
}

export function buildContentKey(pageSlug: string, sectionId: string, elementId: string): string {
  return `${pageSlug}:${sectionId}:${elementId}`;
}
