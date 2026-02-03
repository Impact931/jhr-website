/**
 * About Page Content Schema
 *
 * Defines the editable structure for the JHR Photography about page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/about/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: About Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | about:hero
 * 1          | Meet Jayson Rivas (Guide)      | EditableTextBlock          | about:guide
 * 2          | How We Operate (Values)        | EditableFeatureGrid       | about:values
 * 3          | Why Event Pros Choose JHR      | EditableFeatureGrid       | about:why-jhr
 * 4          | Stats Section                  | EditableFeatureGrid       | about:stats
 * 5          | Final CTA                      | EditableCTA               | about:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: about:{sectionId}:{elementId}
 *
 * Examples:
 *   about:hero:title              - Hero headline text
 *   about:hero:subtitle           - Hero subtitle text
 *   about:guide:heading           - Guide section heading
 *   about:guide:content           - Guide section rich text
 *   about:values:heading          - Values section heading
 *   about:values:features         - Values feature cards (JSON array)
 *   about:why-jhr:heading         - Why JHR section heading
 *   about:why-jhr:features        - Why JHR feature cards (JSON array)
 *   about:stats:features          - Stats grid (JSON array)
 *   about:final-cta:headline      - Final CTA headline
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/about/page.tsx
 * Component: EditableHero
 */
export const ABOUT_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'About JHR Photography - Nashville corporate event photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'We Understand the Pressure You\'re Under',
  subtitle: 'About JHR Photography',
  description:
    'You\'re not looking for a photographer. You\'re looking for a partner who removes worry, delivers reliably, and makes you look good to your stakeholders.',
  backgroundImage: {
    src: '/images/generated/hero-about.jpg',
    alt: 'Professional photographer with camera',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: Meet Jayson Rivas (The Guide)
 * Maps to: "Meet Jayson Rivas" section in /app/about/page.tsx
 * Component: EditableTextBlock
 *
 * Two-column layout with text on the left and portrait image on the right.
 * The image is part of the page template; the text block captures the
 * editable heading and paragraphs.
 */
export const ABOUT_GUIDE: TextBlockSectionContent = {
  id: 'guide',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'Meet Jayson Rivas - JHR Photography founder',
    sectionId: 'guide',
    dataSectionName: 'guide',
  },
  heading: 'Meet Jayson Rivas',
  content:
    '<p>Before JHR Photography, Jayson spent decades as a Green Beret in the U.S. Army Special Forces. That background shaped everything about how we operate: meticulous planning, calm under pressure, and flawless execution when it matters most.</p>' +
    '<p>After retiring from the military, Jayson channeled his passion for photography into building a business that serves high-stakes, high-pressure events. He understands that for event planners, there\'s no room for error\u2014your reputation is on the line with every execution.</p>' +
    '<p>JHR Photography exists because Jayson believes event professionals deserve a media partner who operates at their level\u2014not a creative who shows up hoping for the best, but an operator who arrives prepared to deliver.</p>',
  alignment: 'left',
};

/**
 * Section 2: How We Operate (Values)
 * Maps to: Values grid in /app/about/page.tsx
 * Component: EditableFeatureGrid (3 columns)
 *
 * Three value cards: Reliability First, Empathy Driven, Outcomes Over Process.
 */
export const ABOUT_VALUES: FeatureGridSectionContent = {
  id: 'values',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'JHR Photography core values and operating principles',
    sectionId: 'values',
    dataSectionName: 'values',
  },
  heading: 'How We Operate',
  subheading:
    'Our approach is shaped by military discipline and a deep respect for the professionals we serve.',
  columns: 3,
  features: [
    {
      id: 'values-card-0',
      icon: 'Shield',
      title: 'Reliability First',
      description:
        'We show up prepared, on time, every time. No excuses. Our logistics are planned to the minute, and we build in redundancy for everything that matters.',
    },
    {
      id: 'values-card-1',
      icon: 'Heart',
      title: 'Empathy Driven',
      description:
        'We know you\'re juggling a thousand details. We don\'t add to your stress\u2014we remove it. Our job is to make your job easier, not to showcase our creative ego.',
    },
    {
      id: 'values-card-2',
      icon: 'Zap',
      title: 'Outcomes Over Process',
      description:
        'We don\'t talk about gear, hours, or creative vision. We talk about what you need to achieve and how we deliver it. Your success is our only metric.',
    },
  ],
};

/**
 * Section 3: Why Event Professionals Choose JHR
 * Maps to: "Why JHR" section in /app/about/page.tsx
 * Component: EditableFeatureGrid (single column, stacked cards)
 *
 * Three text cards explaining JHR's differentiators.
 * Mapped as a 2-column feature grid to keep within FeatureGridColumns type (2 | 3 | 4).
 */
export const ABOUT_WHY_JHR: FeatureGridSectionContent = {
  id: 'why-jhr',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Why event professionals choose JHR Photography',
    sectionId: 'why-jhr',
    dataSectionName: 'why-jhr',
  },
  heading: 'Why Event Professionals Choose JHR',
  columns: 2,
  features: [
    {
      id: 'why-jhr-card-0',
      icon: 'CheckCircle',
      title: 'We Speak Your Language',
      description:
        'EAC forms, marshaling yards, drayage, union jurisdictions\u2014we know the operational vocabulary of major events. You\'re partnering with someone who already understands.',
    },
    {
      id: 'why-jhr-card-1',
      icon: 'CheckCircle',
      title: 'We Know Nashville\'s Venues',
      description:
        'Music City Center, Gaylord Opryland, the downtown hotels\u2014we\'ve worked them all extensively. We know the quirks, the contacts, and the best spots for every type of shot.',
    },
    {
      id: 'why-jhr-card-2',
      icon: 'CheckCircle',
      title: 'We Deliver Without Drama',
      description:
        'Our team arrives in uniform, on schedule, with backup equipment and clear communication protocols. When the event is over, you get your assets fast\u2014not excuses about editing timelines.',
    },
  ],
};

/**
 * Section 4: Stats Section
 * Maps to: Stats grid in /app/about/page.tsx
 * Component: EditableFeatureGrid (4 columns)
 *
 * Four stat items with stat values as titles. Background image overlay.
 */
export const ABOUT_STATS: FeatureGridSectionContent = {
  id: 'stats',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'JHR Photography key statistics and achievements',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  heading: '',
  columns: 4,
  features: [
    {
      id: 'stats-card-0',
      icon: 'Camera',
      title: '500+',
      description: 'Events Covered',
    },
    {
      id: 'stats-card-1',
      icon: 'Camera',
      title: '15K+',
      description: 'Headshots Delivered',
    },
    {
      id: 'stats-card-2',
      icon: 'CheckCircle',
      title: '100%',
      description: 'On-Time Delivery',
    },
    {
      id: 'stats-card-3',
      icon: 'Calendar',
      title: '10+',
      description: 'Years Experience',
    },
  ],
};

/**
 * Section 5: Final CTA
 * Maps to: Bottom CTA in /app/about/page.tsx
 * Component: EditableCTA (image background variant)
 */
export const ABOUT_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Schedule a strategy call with JHR Photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\'s Talk About Your Event',
  subtext:
    'Schedule a strategy call with Jayson. We\'ll discuss your event, understand your challenges, and show you exactly how JHR can help.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-homepage.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete About Page Schema
// ============================================================================

export const ABOUT_SECTIONS: PageSectionContent[] = [
  ABOUT_HERO,
  ABOUT_GUIDE,
  ABOUT_VALUES,
  ABOUT_WHY_JHR,
  ABOUT_STATS,
  ABOUT_FINAL_CTA,
];

export const ABOUT_PAGE_SCHEMA: PageSchema = {
  slug: 'about',
  name: 'About',
  seo: {
    pageTitle: 'About JHR Photography | Nashville Corporate Event Photography',
    metaDescription:
      'Meet Jayson Rivas and the JHR Photography team. Military-trained reliability, venue fluency, and outcome-driven event photography in Nashville.',
    ogImage: '/images/generated/hero-about.jpg',
    ogTitle: 'About JHR Photography - We Understand the Pressure You\'re Under',
    ogDescription:
      'Nashville\'s trusted partner for corporate event photography. Military-trained reliability meets professional event media.',
  },
  sections: ABOUT_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getAboutSectionById(sectionId: string): PageSectionContent | undefined {
  return ABOUT_SECTIONS.find((s) => s.id === sectionId);
}

export function getAboutContentKeyPrefix(sectionId: string): string {
  return `about:${sectionId}`;
}
