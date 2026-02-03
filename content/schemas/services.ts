/**
 * Services Hub Page Content Schema
 *
 * Defines the editable structure for the JHR Photography services hub page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Services Hub Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | services:hero
 * 1          | Services Grid                 | EditableFeatureGrid       | services:services-grid
 * 2          | Final CTA                     | EditableCTA               | services:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: services:{sectionId}:{elementId}
 *
 * Examples:
 *   services:hero:title              - Hero headline text
 *   services:hero:subtitle           - Hero subtitle text
 *   services:hero:description        - Hero description paragraph
 *   services:services-grid:features  - Services cards (JSON array)
 *   services:final-cta:headline      - Final CTA headline
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/services/page.tsx
 * Component: EditableHero
 */
export const SERVICES_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography services - Outcome-based media systems',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Outcome-Based Media Systems',
  subtitle: 'Our Services',
  description:
    'We don\u2019t sell hours or photographers. We deliver complete media systems designed for specific business outcomes. Each service removes friction, drives engagement, and delivers measurable results.',
  backgroundImage: {
    src: '/images/generated/hero-services.jpg',
    alt: 'Professional photographer at corporate event',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: Services Grid
 * Maps to: Services cards grid in /app/services/page.tsx
 * Component: EditableFeatureGrid (2 columns)
 *
 * Four service cards with icon, name, tagline, description, outcomes, and link.
 * The current page uses image cards with detailed sub-content. In CMS mode,
 * we represent the core editable fields via FeatureGrid.
 */
export const SERVICES_GRID: FeatureGridSectionContent = {
  id: 'services-grid',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'JHR Photography service offerings',
    sectionId: 'services-grid',
    dataSectionName: 'services-grid',
  },
  heading: 'Our Services',
  subheading:
    'Each service is designed to remove friction, drive engagement, and deliver measurable results.',
  columns: 2,
  features: [
    {
      id: 'services-grid-card-0',
      icon: 'Camera',
      title: 'Headshot Activation\u2122',
      description:
        'High-engagement headshot stations that drive traffic, extend dwell time, and deliver qualified leads. AI-accelerated delivery puts branded assets in attendees\u2019 hands in seconds.',
      link: { text: 'Learn More', href: '/services/headshot-activation' },
    },
    {
      id: 'services-grid-card-1',
      icon: 'Building',
      title: 'Corporate Event Coverage\u2122',
      description:
        'Professional event photography that captures the energy, engagement, and key moments of your event. Multi-day capabilities with same-day delivery options.',
      link: { text: 'Learn More', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-grid-card-2',
      icon: 'Users',
      title: 'Corporate Headshot Program\u2122',
      description:
        'We come to your office and deliver polished, consistent headshots for your entire team. Perfect for website updates, LinkedIn refreshes, and marketing materials.',
      link: { text: 'Learn More', href: '/services/corporate-headshot-program' },
    },
    {
      id: 'services-grid-card-3',
      icon: 'Video',
      title: 'Event Video Systems\u2122',
      description:
        'From keynote documentation to social-ready highlight reels, we deliver video content that extends your event\u2019s impact far beyond the venue.',
      link: { text: 'Learn More', href: '/services/event-video-systems' },
    },
  ],
};

/**
 * Section 2: Final CTA
 * Maps to: Bottom CTA section in /app/services/page.tsx
 * Component: EditableCTA (image background variant)
 */
export const SERVICES_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 2,
  seo: {
    ariaLabel: 'Schedule a strategy call with JHR Photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Not Sure Which Service Fits?',
  subtext:
    'Let\u2019s talk through your event and goals. We\u2019ll help you identify the right approach\u2014no pressure, no hard sell.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-networking.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Services Hub Schema
// ============================================================================

export const SERVICES_SECTIONS: PageSectionContent[] = [
  SERVICES_HERO,
  SERVICES_GRID,
  SERVICES_FINAL_CTA,
];

export const SERVICES_PAGE_SCHEMA: PageSchema = {
  slug: 'services',
  name: 'Services',
  seo: {
    pageTitle: 'Our Services | JHR Photography',
    metaDescription:
      'Outcome-based media systems for corporate events. Headshot activations, event coverage, corporate headshot programs, and event video systems in Nashville.',
    ogImage: '/images/generated/hero-services.jpg',
    ogTitle: 'JHR Photography Services - Outcome-Based Media Systems',
    ogDescription:
      'Professional corporate event photography and headshot services in Nashville. Designed for specific business outcomes.',
  },
  sections: SERVICES_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getServicesSectionById(sectionId: string): PageSectionContent | undefined {
  return SERVICES_SECTIONS.find((s) => s.id === sectionId);
}

export function getServicesContentKeyPrefix(sectionId: string): string {
  return `services:${sectionId}`;
}
