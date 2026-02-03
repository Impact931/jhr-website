/**
 * Structured Data (JSON-LD) Generators for SEO
 *
 * Generates schema.org structured data for pages:
 * - Organization: Business identity and contact info
 * - FAQPage: FAQ sections with Question/Answer pairs
 * - BreadcrumbList: Navigation breadcrumbs for search results
 * - WebPage: Page-level metadata with sections
 *
 * Usage:
 *   import { generatePageStructuredData } from '@/lib/structured-data';
 *   const schemas = generatePageStructuredData({ slug, title, description, sections, breadcrumbs });
 *   // Render each schema as a <script type="application/ld+json"> in <head>
 */

import type {
  PageSectionContent,
  FAQSectionContent,
  PageSEOMetadata,
} from '@/types/inline-editor';

// ============================================================================
// Constants
// ============================================================================

const SITE_URL = 'https://jhr-photography.com';
const BUSINESS_NAME = 'JHR Photography';
const BUSINESS_PHONE = '+1-615-555-0123';
const BUSINESS_EMAIL = 'info@jhr-photography.com';
const BUSINESS_LOGO = `${SITE_URL}/images/jhr-logo-white.png`;

// ============================================================================
// Types
// ============================================================================

/** A breadcrumb item for BreadcrumbList schema. */
export interface BreadcrumbItem {
  /** Display name for the breadcrumb. */
  name: string;
  /** URL path (relative or absolute). Relative paths are resolved against SITE_URL. */
  url: string;
}

/** Input for generating all structured data for a page. */
export interface PageStructuredDataInput {
  /** Page URL slug (e.g., "home", "about", "services"). */
  slug: string;
  /** Page title. */
  title: string;
  /** Page meta description. */
  description: string;
  /** Page sections (used to extract FAQ structured data). */
  sections?: PageSectionContent[];
  /** Breadcrumb trail for this page. If not provided, defaults to Home > Page. */
  breadcrumbs?: BreadcrumbItem[];
  /** Page SEO metadata (for OG image, canonical URL). */
  seo?: PageSEOMetadata;
  /** ISO date string of last modification. */
  dateModified?: string;
}

/** A single JSON-LD schema object ready for serialization. */
export interface StructuredDataSchema {
  /** Schema type identifier for debugging (e.g., "Organization", "FAQPage"). */
  type: string;
  /** The JSON-LD object to serialize. */
  data: Record<string, unknown>;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Strips HTML tags from a string for use in structured data.
 * Schema.org expects plain text in most fields.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Resolves a URL path to an absolute URL.
 * If the path is already absolute (starts with http), returns as-is.
 */
function resolveUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

// ============================================================================
// Schema Generators
// ============================================================================

/**
 * Generates Organization schema for JHR Photography.
 * Includes business identity, contact info, address, service area, and social links.
 *
 * Schema type: ProfessionalService (subtype of Organization)
 * @see https://schema.org/ProfessionalService
 */
export function generateOrganizationSchema(): StructuredDataSchema {
  return {
    type: 'Organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: BUSINESS_LOGO,
        width: 300,
        height: 60,
      },
      image: BUSINESS_LOGO,
      description:
        "Nashville's trusted partner for corporate event photography, headshot activations, and conference media coverage.",
      telephone: BUSINESS_PHONE,
      email: BUSINESS_EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nashville',
        addressRegion: 'TN',
        postalCode: '37203',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 36.1627,
        longitude: -86.7816,
      },
      areaServed: [
        { '@type': 'City', name: 'Nashville' },
        { '@type': 'State', name: 'Tennessee' },
        { '@type': 'Country', name: 'United States' },
      ],
      priceRange: '$$$$',
      knowsAbout: [
        'Corporate Event Photography',
        'Professional Headshots',
        'Conference Photography',
        'Trade Show Photography',
        'Headshot Activations',
      ],
      sameAs: [
        'https://www.linkedin.com/company/jhr-photography',
        'https://www.instagram.com/jhrphotography',
        'https://www.facebook.com/jhrphotography',
      ],
    },
  };
}

/**
 * Generates FAQPage schema from FAQ sections.
 * Extracts all FAQ items from page sections and combines them into a single FAQPage entity.
 *
 * @param sections - Page sections to scan for FAQ content.
 * @returns FAQPage schema, or null if no FAQ items are found.
 * @see https://schema.org/FAQPage
 */
export function generateFAQPageSchema(
  sections: PageSectionContent[]
): StructuredDataSchema | null {
  // Collect all FAQ sections
  const faqSections = sections.filter(
    (s): s is FAQSectionContent => s.type === 'faq'
  );

  if (faqSections.length === 0) return null;

  // Flatten all FAQ items across sections
  const allItems = faqSections.flatMap((section) => section.items);
  if (allItems.length === 0) return null;

  return {
    type: 'FAQPage',
    data: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: stripHtml(item.answer),
        },
      })),
    },
  };
}

/**
 * Generates BreadcrumbList schema for page navigation.
 * Helps search engines understand page hierarchy and display breadcrumbs in SERPs.
 *
 * @param breadcrumbs - Ordered array of breadcrumb items (first = root, last = current page).
 * @returns BreadcrumbList schema.
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbListSchema(
  breadcrumbs: BreadcrumbItem[]
): StructuredDataSchema {
  return {
    type: 'BreadcrumbList',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: resolveUrl(crumb.url),
      })),
    },
  };
}

/**
 * Generates WebPage schema for the current page.
 * Includes page identity, relationship to organization, description, and modification date.
 *
 * @param options - Page metadata.
 * @returns WebPage schema.
 * @see https://schema.org/WebPage
 */
export function generateWebPageSchema(options: {
  slug: string;
  title: string;
  description: string;
  seo?: PageSEOMetadata;
  dateModified?: string;
  sections?: PageSectionContent[];
}): StructuredDataSchema {
  const { slug, title, description, seo, dateModified, sections } = options;

  const pageUrl =
    seo?.canonicalUrl || resolveUrl(slug === 'home' ? '/' : `/${slug}`);

  const webPage: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description: description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    about: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
  };

  // Add OG image as primary image
  if (seo?.ogImage) {
    webPage.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: resolveUrl(seo.ogImage),
    };
  }

  // Add modification date
  if (dateModified) {
    webPage.dateModified = dateModified;
  }

  // Add main entity references for FAQ sections
  if (sections) {
    const hasFAQ = sections.some((s) => s.type === 'faq');
    if (hasFAQ) {
      webPage.mainEntity = {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faqpage`,
      };
    }
  }

  return {
    type: 'WebPage',
    data: webPage,
  };
}

// ============================================================================
// Composite Generator
// ============================================================================

/**
 * Generates all relevant structured data schemas for a page.
 * This is the main entry point for page-level structured data generation.
 *
 * Returns an array of schemas that should each be rendered as a
 * <script type="application/ld+json"> tag in the page head.
 *
 * @param input - Page metadata and content for schema generation.
 * @returns Array of structured data schemas.
 */
export function generatePageStructuredData(
  input: PageStructuredDataInput
): StructuredDataSchema[] {
  const { slug, title, description, sections, breadcrumbs, seo, dateModified } =
    input;

  const schemas: StructuredDataSchema[] = [];

  // 1. Organization schema (always included for business pages)
  schemas.push(generateOrganizationSchema());

  // 2. WebPage schema
  schemas.push(
    generateWebPageSchema({
      slug,
      title,
      description,
      seo,
      dateModified,
      sections,
    })
  );

  // 3. BreadcrumbList schema
  const effectiveBreadcrumbs = breadcrumbs || [
    { name: 'Home', url: '/' },
    ...(slug !== 'home'
      ? [{ name: title, url: `/${slug}` }]
      : []),
  ];
  if (effectiveBreadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbListSchema(effectiveBreadcrumbs));
  }

  // 4. FAQPage schema (if page has FAQ sections)
  if (sections && sections.length > 0) {
    const faqSchema = generateFAQPageSchema(sections);
    if (faqSchema) {
      schemas.push(faqSchema);
    }
  }

  return schemas;
}

// ============================================================================
// React Helper: Render schemas as script tags
// ============================================================================

/**
 * Generates an array of JSON-LD script tag content strings.
 * Use with dangerouslySetInnerHTML in Next.js <script> tags.
 *
 * @param schemas - Array of structured data schemas.
 * @returns Array of JSON strings ready for script tags.
 */
export function serializeSchemas(schemas: StructuredDataSchema[]): string[] {
  return schemas.map((schema) => JSON.stringify(schema.data));
}
