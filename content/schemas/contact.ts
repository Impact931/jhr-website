/**
 * Contact Page Content Schema
 *
 * Defines the editable structure for the JHR Photography contact page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/contact/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Contact Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | contact:hero
 * 1          | Contact Info + Form            | EditableTextBlock          | contact:info
 *
 * Note: The contact form itself is an interactive component (state, validation,
 * API submission) that is not representable as a schema section. Only the
 * surrounding text content is editable.
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: contact:{sectionId}:{elementId}
 *
 * Examples:
 *   contact:hero:title              - Hero headline text
 *   contact:hero:subtitle           - Hero subtitle text
 *   contact:info:heading            - Contact info section heading
 *   contact:info:content            - Contact info descriptive text
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/contact/page.tsx
 * Component: EditableHero
 */
export const CONTACT_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Contact JHR Photography - Get in touch for event photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Let\'s Talk About Your Event',
  subtitle: 'Get in Touch',
  description:
    'Have a question or ready to discuss your event? Fill out the form and we\'ll get back to you within one business day.',
  backgroundImage: {
    src: '/images/generated/event-keynote.jpg',
    alt: 'Corporate keynote event',
  },
  buttons: [],
};

/**
 * Section 1: Contact Information
 * Maps to: Contact info column in /app/contact/page.tsx
 * Component: EditableTextBlock
 *
 * The left column contains contact details (email, phone, location) and
 * descriptive text. The right column is the interactive form component,
 * which is not schema-representable.
 */
export const CONTACT_INFO: TextBlockSectionContent = {
  id: 'info',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'JHR Photography contact information',
    sectionId: 'info',
    dataSectionName: 'info',
  },
  heading: 'Contact Information',
  content:
    '<p>Prefer a direct conversation? Use the information below to reach us directly, or schedule a strategy call for a more in-depth discussion.</p>' +
    '<p><strong>Email:</strong> info@jhr-photography.com</p>' +
    '<p><strong>Phone:</strong> (615) 555-0123</p>' +
    '<p><strong>Location:</strong> Nashville, Tennessee</p>',
  alignment: 'left',
};

// ============================================================================
// Complete Contact Page Schema
// ============================================================================

export const CONTACT_SECTIONS: PageSectionContent[] = [
  CONTACT_HERO,
  CONTACT_INFO,
];

export const CONTACT_PAGE_SCHEMA: PageSchema = {
  slug: 'contact',
  name: 'Contact',
  seo: {
    pageTitle: 'Contact JHR Photography | Nashville Event Photography Inquiries',
    metaDescription:
      'Get in touch with JHR Photography for corporate event photography, headshot activations, and video services in Nashville. Response within one business day.',
    ogImage: '/images/generated/event-keynote.jpg',
    ogTitle: 'Contact JHR Photography - Let\'s Talk About Your Event',
    ogDescription:
      'Ready to discuss your event? Contact JHR Photography for reliable corporate event photography in Nashville.',
  },
  sections: CONTACT_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getContactSectionById(sectionId: string): PageSectionContent | undefined {
  return CONTACT_SECTIONS.find((s) => s.id === sectionId);
}

export function getContactContentKeyPrefix(sectionId: string): string {
  return `contact:${sectionId}`;
}
