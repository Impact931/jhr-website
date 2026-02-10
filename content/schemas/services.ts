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
 * 1          | Discovery Pathways            | EditableFeatureGrid       | services:discovery-pathways
 * 2          | Not Sure? Reassurance CTA     | EditableCTA               | services:not-sure-cta
 * 3          | Stats Credibility Bar         | EditableStats             | services:stats
 * 4          | Guide Credibility             | EditableFeatureGrid       | services:guide-credibility
 * 5          | Quick Reference               | EditableFeatureGrid       | services:quick-reference
 * 6          | Final CTA                     | EditableCTA               | services:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: services:{sectionId}:{elementId}
 *
 * Examples:
 *   services:hero:title                      - Hero headline text
 *   services:hero:subtitle                   - Hero eyebrow text
 *   services:hero:description                - Hero lead paragraph
 *   services:discovery-pathways:features     - Pathway cards (JSON array)
 *   services:not-sure-cta:headline           - Not Sure CTA headline
 *   services:stats:stats                     - Credibility metrics (JSON array)
 *   services:guide-credibility:features      - Credibility value blocks (JSON array)
 *   services:quick-reference:features        - Quick reference service links (JSON array)
 *   services:final-cta:headline              - Final CTA headline
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  StatsSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/services/page.tsx
 * Component: EditableHero (split variant with image right)
 */
export const SERVICES_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography services - The right media partner for what you\'re planning',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'split',
  imagePosition: 'right',
  title: 'The Right Media Partner <em class="text-jhr-gold not-italic">for What You\u2019re Planning</em>',
  subtitle: 'Our Services',
  description:
    'Every event has different pressures, different stakeholders, and different definitions of success. We\u2019ve structured our services around the situations event professionals actually face \u2014 so you can find exactly what you need without sorting through what you don\u2019t.',
  backgroundImage: {
    src: '/images/generated/hero-services.jpg',
    alt: 'Professional photographer at corporate event',
  },
  buttons: [
    { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Discovery Pathways ("What Are You Planning?")
 * Maps to: Pathway cards grid in /app/services/page.tsx
 * Component: EditableFeatureGrid (alternating 2-col layout with images)
 *
 * Four pathway cards that guide visitors to the right service based on their situation.
 */
export const SERVICES_DISCOVERY_PATHWAYS: FeatureGridSectionContent = {
  id: 'discovery-pathways',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'What are you planning - service discovery pathways',
    sectionId: 'discovery-pathways',
    dataSectionName: 'discovery-pathways',
  },
  heading: 'What Are You Planning?',
  subheading:
    'Select the scenario that\u2019s closest to your situation. We\u2019ll show you exactly how we support it.',
  displayMode: 'alternating',
  columns: 2,
  features: [
    {
      id: 'discovery-pathways-card-0',
      icon: 'Building',
      title: 'You\u2019re running a multi-day conference and need media that actually gets used afterward.',
      description: '',
      link: { text: 'Learn More', href: '/services/corporate-event-coverage' },
      image: { src: '/images/generated/placeholder.jpg', alt: 'Multi-day conference media coverage' },
    },
    {
      id: 'discovery-pathways-card-1',
      icon: 'Users',
      title: 'You\u2019re exhibiting and need your booth to actually drive engagement \u2014 not just exist on the floor.',
      description: '',
      link: { text: 'Learn More', href: '/services/headshot-activation' },
      image: { src: '/images/generated/placeholder.jpg', alt: 'Trade show booth engagement activation' },
    },
    {
      id: 'discovery-pathways-card-2',
      icon: 'UserCircle',
      title: 'Your leadership team needs updated headshots that actually represent the organization well.',
      description: '',
      link: { text: 'Learn More', href: '/services/executive-imaging' },
      image: { src: '/images/generated/placeholder.jpg', alt: 'Executive headshot photography session' },
    },
    {
      id: 'discovery-pathways-card-3',
      icon: 'Video',
      title: 'You need video content from your event that works for marketing, social, and leadership messaging.',
      description: '',
      link: { text: 'Learn More', href: '/services/event-video-systems' },
      image: { src: '/images/generated/placeholder.jpg', alt: 'Event video production and marketing content' },
    },
  ],
};

/**
 * Section 2: "Not Sure?" Reassurance CTA
 * Maps to: Reassurance block in /app/services/page.tsx
 * Component: EditableCTA (solid background variant)
 */
export const SERVICES_NOT_SURE_CTA: CTASectionContent = {
  id: 'not-sure-cta',
  type: 'cta',
  order: 2,
  seo: {
    ariaLabel: 'Not sure which service fits your event - talk with our team',
    sectionId: 'not-sure-cta',
    dataSectionName: 'not-sure-cta',
  },
  headline: 'Not Sure Which Fits Your Event?',
  subtext:
    'That\u2019s completely fine \u2014 most of the planners we work with start with a quick conversation. Tell us about your event, your timeline, and what matters most. We\u2019ll recommend the right approach and give you a clear picture of what to expect. No pressure. No long proposals. Just a straightforward conversation with someone who\u2019s done this before.',
  backgroundType: 'solid',
  backgroundValue: '#1A1A1A',
  primaryButton: {
    text: 'Talk With Our Team',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

/**
 * Section 3: Stats Credibility Bar
 * Component: EditableStats (animated counter bar)
 */
export const SERVICES_STATS: StatsSectionContent = {
  id: 'stats',
  type: 'stats',
  order: 3,
  seo: {
    ariaLabel: 'JHR Photography credibility metrics',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  stats: [
    { id: 'stat-0', value: 15, suffix: '+', label: 'Years Experience' },
    { id: 'stat-1', value: 1000, suffix: '+', label: 'Events Covered' },
    { id: 'stat-2', value: 12, suffix: '+', label: 'Nashville Venues' },
    { id: 'stat-3', value: 100, suffix: '%', label: 'Client Satisfaction' },
  ],
};

/**
 * Section 4: Guide Credibility ("How We're Different")
 * Maps to: Value blocks grid in /app/services/page.tsx
 * Component: EditableFeatureGrid (2 columns, glass card variant)
 *
 * Four value blocks explaining why event teams choose JHR.
 */
export const SERVICES_GUIDE_CREDIBILITY: FeatureGridSectionContent = {
  id: 'guide-credibility',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Built for the way events actually work - why event teams choose JHR',
    sectionId: 'guide-credibility',
    dataSectionName: 'guide-credibility',
  },
  heading: 'Built for the Way Events Actually Work',
  subheading: 'Why Event Teams Choose JHR',
  columns: 2,
  cardVariant: 'glass',
  features: [
    {
      id: 'guide-credibility-card-0',
      icon: 'CheckCircle',
      title: 'Certified, Not Contracted',
      description:
        'Every JHR operator is certified, vetted, and trained to represent national brands in high-stakes environments.',
    },
    {
      id: 'guide-credibility-card-1',
      icon: 'CheckCircle',
      title: 'Nashville Venues, Known by Heart',
      description:
        'Gaylord Opryland, Music City Center, the Renaissance, the Ryman \u2014 we\u2019ve worked these rooms hundreds of times.',
    },
    {
      id: 'guide-credibility-card-2',
      icon: 'CheckCircle',
      title: 'Aligned to Your Timeline, Not Ours',
      description:
        'We deliver on your schedule. Photography galleries in 72 hours. Video in 21 business days. Same-day highlights when you need them.',
    },
    {
      id: 'guide-credibility-card-3',
      icon: 'CheckCircle',
      title: 'One Team, Complete Coverage',
      description:
        'Photography, video, headshot activations, and social content \u2014 all coordinated through a single partner.',
    },
  ],
};

/**
 * Section 5: Quick Reference
 * Maps to: Service links grid in /app/services/page.tsx
 * Component: EditableFeatureGrid (3 columns, service-specific icons)
 *
 * Six service items with links to individual service pages.
 */
export const SERVICES_QUICK_REFERENCE: FeatureGridSectionContent = {
  id: 'quick-reference',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'Quick reference to all JHR Photography services',
    sectionId: 'quick-reference',
    dataSectionName: 'quick-reference',
  },
  heading: 'Quick Reference',
  columns: 3,
  features: [
    {
      id: 'quick-reference-card-0',
      icon: 'Camera',
      title: 'Corporate Event Coverage\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'quick-reference-card-1',
      icon: 'Building',
      title: 'Convention Media Services\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/convention-media' },
    },
    {
      id: 'quick-reference-card-2',
      icon: 'Sparkles',
      title: 'Headshot Activation\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/headshot-activation' },
    },
    {
      id: 'quick-reference-card-3',
      icon: 'UserCircle',
      title: 'Executive Imaging\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/executive-imaging' },
    },
    {
      id: 'quick-reference-card-4',
      icon: 'BarChart',
      title: 'Trade-Show Media Services\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/trade-show-media' },
    },
    {
      id: 'quick-reference-card-5',
      icon: 'Video',
      title: 'Event Video Systems\u2122',
      description: '',
      link: { text: 'Learn More', href: '/services/event-video-systems' },
    },
  ],
};

/**
 * Section 6: Final CTA
 * Maps to: Bottom CTA section in /app/services/page.tsx
 * Component: EditableCTA (gradient background variant)
 */
export const SERVICES_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Talk with JHR Photography about your event media needs',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Every Event Deserves a Media Partner Who Gets It Right.',
  subtext:
    'Tell us what you\u2019re working on. We\u2019ll tell you exactly how we can help \u2014 and what it looks like when the media matches the event.',
  backgroundType: 'gradient',
  backgroundValue: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), linear-gradient(180deg, #0B0C0F 0%, #0B0C0F 100%)',
  primaryButton: {
    text: 'Talk With Our Team',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Check Availability',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'secondary',
  },
};

// ============================================================================
// Complete Services Hub Schema
// ============================================================================

export const SERVICES_SECTIONS: PageSectionContent[] = [
  SERVICES_HERO,
  SERVICES_DISCOVERY_PATHWAYS,
  SERVICES_NOT_SURE_CTA,
  SERVICES_STATS,
  SERVICES_GUIDE_CREDIBILITY,
  SERVICES_QUICK_REFERENCE,
  SERVICES_FINAL_CTA,
];

export const SERVICES_PAGE_SCHEMA: PageSchema = {
  slug: 'services',
  name: 'Services',
  seo: {
    pageTitle: 'Services | JHR Photography',
    metaDescription:
      'The right media partner for what you\'re planning. Professional event photography, headshot activations, executive imaging, and video systems in Nashville.',
    ogImage: '/images/generated/hero-services.jpg',
    ogTitle: 'Services | JHR Photography',
    ogDescription:
      'The right media partner for what you\'re planning. Professional event photography, headshot activations, executive imaging, and video systems in Nashville.',
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
