/**
 * Venues Hub Page Content Schema
 *
 * Defines the editable structure for the JHR Photography venues hub page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/venues/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Venues Hub Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | venues:hero
 * 1          | Why Venue Fluency Matters      | EditableFeatureGrid       | venues:venue-fluency
 * 2          | Venues Grid                   | EditableFeatureGrid       | venues:venues-grid
 * 3          | Final CTA                     | EditableCTA               | venues:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: venues:{sectionId}:{elementId}
 *
 * Examples:
 *   venues:hero:title              - Hero headline text
 *   venues:hero:subtitle           - Hero subtitle text
 *   venues:venue-fluency:features  - Venue fluency info cards (JSON array)
 *   venues:venues-grid:features    - Venue cards (JSON array)
 *   venues:final-cta:headline      - Final CTA headline
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
 * Maps to: <PageHero> in /app/venues/page.tsx
 * Component: EditableHero
 */
export const VENUES_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography venues - Nashville venue expertise',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'We Know Nashville\u2019s Premier Venues',
  subtitle: 'Venue Fluency',
  description:
    'When you\u2019re planning from out of state, you need a partner who knows the terrain. We\u2019ve worked extensively at Nashville\u2019s top convention and event venues\u2014we know the marshaling yards, the loading docks, the lighting challenges, and the people who run them.',
  backgroundImage: {
    src: '/images/generated/hero-venues.jpg',
    alt: 'Nashville skyline at twilight',
  },
  buttons: [],
};

/**
 * Section 1: Why Venue Fluency Matters
 * Maps to: 2-column layout with 3 info boxes in /app/venues/page.tsx
 * Component: EditableFeatureGrid (3 columns — mapped as single-column cards but using 3 for schema)
 *
 * Left column has heading + description text, right column has 3 info cards.
 * Mapped as a feature-grid with the heading/subheading capturing left column text.
 */
export const VENUES_FLUENCY: FeatureGridSectionContent = {
  id: 'venue-fluency',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Why venue fluency matters for event photography',
    sectionId: 'venue-fluency',
    dataSectionName: 'venue-fluency',
  },
  heading: 'Why Venue Fluency Matters',
  subheading:
    'Every venue has its quirks\u2014unique lighting conditions, specific load-in procedures, vendor restrictions, and operational nuances. A photographer unfamiliar with these details creates risk for your event. We eliminate that risk by knowing Nashville\u2019s venues inside and out.',
  columns: 3,
  features: [
    {
      id: 'venue-fluency-card-0',
      icon: 'Truck',
      title: 'Logistics Mastery',
      description:
        'We know EAC requirements, marshaling yard procedures, and load-in protocols for each venue. No delays, no surprises.',
    },
    {
      id: 'venue-fluency-card-1',
      icon: 'Sun',
      title: 'Lighting Knowledge',
      description:
        'From Gaylord\u2019s challenging atriums to convention center exhibit halls, we bring equipment calibrated to each environment.',
    },
    {
      id: 'venue-fluency-card-2',
      icon: 'Users',
      title: 'Relationship Network',
      description:
        'We know the venue staff, the preferred contractors, and the decision-makers. This network helps us solve problems fast.',
    },
  ],
};

/**
 * Section 2: Venues Grid
 * Maps to: 8-card venues grid in /app/venues/page.tsx
 * Component: EditableFeatureGrid (2 columns)
 *
 * Each venue card has name, location, description, features, and link.
 * Mapped as FeatureGrid with Building icons and links to individual venue pages.
 */
export const VENUES_GRID: FeatureGridSectionContent = {
  id: 'venues-grid',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Nashville venues where JHR Photography has experience',
    sectionId: 'venues-grid',
    dataSectionName: 'venues-grid',
  },
  heading: 'Our Venue Experience',
  columns: 2,
  features: [
    {
      id: 'venues-grid-card-0',
      icon: 'Building',
      title: 'Music City Center',
      description:
        'Nashville\u2019s premier convention center. We know the marshaling yard procedures, the hand-carry policies, and every corner of this 2.1 million square foot facility.',
      link: { text: 'View Venue', href: '/venues/music-city-center' },
    },
    {
      id: 'venues-grid-card-1',
      icon: 'Building',
      title: 'Gaylord Opryland',
      description:
        'A unique venue with challenging lighting conditions. We\u2019re EAC-ready and understand the strict vendor policies, atrium humidity, and mixed lighting environments.',
      link: { text: 'View Venue', href: '/venues/gaylord-opryland' },
    },
    {
      id: 'venues-grid-card-2',
      icon: 'Building',
      title: 'Renaissance Hotel',
      description:
        'Connected to the Music City Center, the Renaissance offers seamless access for convention attendees. We coordinate across both properties effortlessly.',
      link: { text: 'View Venue', href: '/venues/renaissance-hotel-nashville' },
    },
    {
      id: 'venues-grid-card-3',
      icon: 'Building',
      title: 'Omni Hotel',
      description:
        'A luxury property in the heart of downtown. We understand the service expectations and deliver photography that matches the venue\u2019s standards.',
      link: { text: 'View Venue', href: '/venues/omni-hotel-nashville' },
    },
    {
      id: 'venues-grid-card-4',
      icon: 'Building',
      title: 'JW Marriott',
      description:
        'Nashville\u2019s largest hotel with extensive event spaces. We\u2019ve documented countless corporate events and galas in this premium property.',
      link: { text: 'View Venue', href: '/venues/jw-marriott-nashville' },
    },
    {
      id: 'venues-grid-card-5',
      icon: 'Building',
      title: 'Embassy Suites',
      description:
        'A versatile property popular with corporate groups. We know the logistics and deliver consistent results across their event spaces.',
      link: { text: 'View Venue', href: '/venues/embassy-suites-nashville' },
    },
    {
      id: 'venues-grid-card-6',
      icon: 'Building',
      title: 'City Winery',
      description:
        'A unique venue combining event space with dining and entertainment. We capture the energy and intimate atmosphere perfectly.',
      link: { text: 'View Venue', href: '/venues/city-winery-nashville' },
    },
    {
      id: 'venues-grid-card-7',
      icon: 'Building',
      title: 'Belmont University',
      description:
        'A beautiful campus with diverse event spaces. From academic conferences to corporate retreats, we know the campus and its possibilities.',
      link: { text: 'View Venue', href: '/venues/belmont-university' },
    },
  ],
};

/**
 * Section 3: Final CTA
 * Maps to: Bottom CTA section in /app/venues/page.tsx
 * Component: EditableCTA (image background variant)
 */
export const VENUES_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 3,
  seo: {
    ariaLabel: 'Schedule a strategy call for your Nashville venue event',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Planning an Event at a Nashville Venue?',
  subtext:
    'Let\u2019s discuss your event and venue. We\u2019ll share what we know about the space and how we can help ensure a smooth, successful execution.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/venue-hotel-ballroom.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Venues Hub Schema
// ============================================================================

export const VENUES_SECTIONS: PageSectionContent[] = [
  VENUES_HERO,
  VENUES_FLUENCY,
  VENUES_GRID,
  VENUES_FINAL_CTA,
];

export const VENUES_PAGE_SCHEMA: PageSchema = {
  slug: 'venues',
  name: 'Venues',
  seo: {
    pageTitle: 'Nashville Event Venues | JHR Photography',
    metaDescription:
      'We know Nashville\u2019s premier event venues inside and out. Music City Center, Gaylord Opryland, and more. Venue fluency that eliminates risk for your event.',
    ogImage: '/images/generated/hero-venues.jpg',
    ogTitle: 'JHR Photography - Nashville Venue Expertise',
    ogDescription:
      'Professional event photography at Nashville\u2019s top venues. We know the spaces, the staff, and the logistics.',
  },
  sections: VENUES_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getVenuesSectionById(sectionId: string): PageSectionContent | undefined {
  return VENUES_SECTIONS.find((s) => s.id === sectionId);
}

export function getVenuesContentKeyPrefix(sectionId: string): string {
  return `venues:${sectionId}`;
}
