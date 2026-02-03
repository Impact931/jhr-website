/**
 * Corporate Event Coverage Service Page Content Schema
 *
 * Defines the editable structure for the Corporate Event Coverage service page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/corporate-event-coverage/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | corporate-event-coverage:hero
 * 1          | What Makes JHR Different       | EditableFeatureGrid       | corporate-event-coverage:differentiators
 * 2          | What We Cover                 | EditableFeatureGrid       | corporate-event-coverage:coverage-areas
 * 3          | Our Process                   | EditableFeatureGrid       | corporate-event-coverage:process
 * 4          | Gallery                       | EditableImageGallery      | corporate-event-coverage:gallery
 * 5          | FAQs                          | EditableFAQ               | corporate-event-coverage:faqs
 * 6          | Final CTA                     | EditableCTA               | corporate-event-coverage:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: corporate-event-coverage:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  FAQSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Component: EditableHero
 */
export const CEC_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Corporate event coverage service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Your Event, Documented Without Drama',
  subtitle: 'Corporate Event Coverage\u2122',
  description:
    'You have enough to manage. Photography shouldn\u2019t add to your stress. We show up prepared, work invisibly, and deliver assets you can actually use\u2014on time and on brand.',
  backgroundImage: {
    src: '/images/generated/service-event-coverage.jpg',
    alt: 'Professional event photography at corporate conference',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: What Makes JHR Different (Deliverables)
 * Maps to: Left text + right deliverable cards
 * Component: EditableFeatureGrid (2 columns)
 */
export const CEC_DIFFERENTIATORS: FeatureGridSectionContent = {
  id: 'differentiators',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'What makes JHR Photography different for event coverage',
    sectionId: 'differentiators',
    dataSectionName: 'differentiators',
  },
  heading: 'What Makes JHR Different',
  subheading:
    'Our background in high-stakes operations means we bring agency-grade planning, redundant equipment, and professional protocols to every event.',
  columns: 2,
  features: [
    {
      id: 'differentiators-card-0',
      icon: 'Camera',
      title: 'Comprehensive Coverage',
      description:
        'Keynotes, breakouts, networking, exhibitor interactions, VIP moments\u2014we capture the full story of your event from setup to breakdown.',
    },
    {
      id: 'differentiators-card-1',
      icon: 'Clock',
      title: 'Same-Day Delivery',
      description:
        'Edited highlights delivered within hours of your event\u2019s conclusion. Perfect for social media, press releases, and immediate marketing needs.',
    },
    {
      id: 'differentiators-card-2',
      icon: 'Shield',
      title: 'Redundant Systems',
      description:
        'Backup equipment, backup memory, backup everything. Our protocols assume something will fail\u2014and plan accordingly.',
    },
    {
      id: 'differentiators-card-3',
      icon: 'FileImage',
      title: 'Full Gallery in 5-7 Days',
      description:
        'Complete edited gallery delivered within one week. Every image professionally processed and ready for use.',
    },
  ],
};

/**
 * Section 2: What We Cover (Coverage Areas)
 * Maps to: Checklist + 4-image grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const CEC_COVERAGE_AREAS: FeatureGridSectionContent = {
  id: 'coverage-areas',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Event coverage areas and capabilities',
    sectionId: 'coverage-areas',
    dataSectionName: 'coverage-areas',
  },
  heading: 'What We Cover',
  subheading:
    'We work from your priorities. Before the event, we\u2019ll review your shot list, identify must-capture moments, and align on what success looks like.',
  columns: 2,
  features: [
    {
      id: 'coverage-areas-card-0',
      icon: 'CheckCircle',
      title: 'Keynote and General Sessions',
      description: 'Multi-angle coverage of all main stage presentations and speakers.',
    },
    {
      id: 'coverage-areas-card-1',
      icon: 'CheckCircle',
      title: 'Breakout Sessions and Workshops',
      description: 'Candid and staged coverage of educational sessions and workshops.',
    },
    {
      id: 'coverage-areas-card-2',
      icon: 'CheckCircle',
      title: 'Networking and Candid Moments',
      description: 'Natural, unposed photography of attendee interactions and engagement.',
    },
    {
      id: 'coverage-areas-card-3',
      icon: 'CheckCircle',
      title: 'VIP and Executive Coverage',
      description: 'Dedicated coverage of VIP interactions, sponsor events, and executive meetings.',
    },
  ],
};

/**
 * Section 3: Our Process
 * Maps to: 4-step timeline
 * Component: EditableFeatureGrid (4 columns)
 */
export const CEC_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'JHR Photography event coverage process',
    sectionId: 'process',
    dataSectionName: 'process',
  },
  heading: 'Our Process',
  subheading: 'Clear, professional, and designed around your needs.',
  columns: 4,
  features: [
    {
      id: 'process-card-0',
      icon: 'Phone',
      title: 'Strategy Call',
      description:
        'We discuss your event, venue, priorities, and expectations. No pressure, no hard sell\u2014just a conversation to see if we\u2019re a good fit.',
    },
    {
      id: 'process-card-1',
      icon: 'FileText',
      title: 'Pre-Event Planning',
      description:
        'We review your shot list, coordinate with venue contacts, and finalize logistics. You\u2019ll know exactly what to expect.',
    },
    {
      id: 'process-card-2',
      icon: 'Camera',
      title: 'Day-Of Execution',
      description:
        'We arrive early, work invisibly, and capture everything on your list\u2014plus the candid moments you didn\u2019t anticipate.',
    },
    {
      id: 'process-card-3',
      icon: 'Send',
      title: 'Delivery',
      description:
        'Same-day highlights within hours. Full edited gallery within 5-7 days. All images formatted and ready for use.',
    },
  ],
};

/**
 * Section 4: Gallery
 * Component: EditableImageGallery
 */
export const CEC_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 4,
  seo: {
    ariaLabel: 'Corporate event photography portfolio samples',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Our Event Photography',
  layout: 'grid',
  images: [
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote speaker at corporate conference' },
    { src: '/images/generated/event-trade-show.jpg', alt: 'Trade show floor photography' },
    { src: '/images/generated/event-networking.jpg', alt: 'Networking event photography' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Awards ceremony photography' },
    { src: '/images/generated/venue-hotel-ballroom.jpg', alt: 'Corporate gala in hotel ballroom' },
    { src: '/images/generated/venue-music-city-center.jpg', alt: 'Convention center event coverage' },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const CEC_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about corporate event coverage',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'Do you offer same-day delivery?',
      answer:
        'Yes. We deliver 20-50 edited highlight images within hours of the event\u2019s conclusion. This is ideal for social media, press, and immediate marketing use. The full gallery follows within 5-7 business days.',
    },
    {
      id: 'faqs-item-1',
      question: 'How do you handle multi-day events?',
      answer:
        'Multi-day events are our specialty. We maintain the same team throughout, establish consistent workflows, and deliver rolling galleries so you have usable content each day. Our stamina and consistency across 3-5 day conferences is what event planners appreciate most.',
    },
    {
      id: 'faqs-item-2',
      question: 'What\u2019s your backup plan for equipment failures?',
      answer:
        'We bring backup equipment to every shoot\u2014cameras, lighting, batteries, memory cards. Our protocols assume something will fail and plan accordingly. In over a decade of events, we\u2019ve never missed a critical moment due to equipment issues.',
    },
    {
      id: 'faqs-item-3',
      question: 'Can you work from a shot list?',
      answer:
        'Absolutely. We prefer it. Before the event, we\u2019ll review your priorities, required shots, and must-capture moments. We work systematically through your list while staying alert for spontaneous opportunities.',
    },
    {
      id: 'faqs-item-4',
      question: 'How do you coordinate with event staff?',
      answer:
        'We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We\u2019re experienced working alongside AV teams, venue staff, and security. We fit into your event\u2014not the other way around.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const CEC_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call for corporate event coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss Your Event',
  subtext:
    'Every event is different. Schedule a call and we\u2019ll talk through your venue, timeline, and specific needs. No obligation\u2014just a conversation.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/venue-hotel-ballroom.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const CEC_SECTIONS: PageSectionContent[] = [
  CEC_HERO,
  CEC_DIFFERENTIATORS,
  CEC_COVERAGE_AREAS,
  CEC_PROCESS,
  CEC_GALLERY,
  CEC_FAQS,
  CEC_FINAL_CTA,
];

export const CORPORATE_EVENT_COVERAGE_PAGE_SCHEMA: PageSchema = {
  slug: 'corporate-event-coverage',
  name: 'Corporate Event Coverage',
  seo: {
    pageTitle: 'Corporate Event Coverage | JHR Photography',
    metaDescription:
      'Professional corporate event photography in Nashville. Same-day delivery, redundant systems, and comprehensive coverage from keynotes to candid moments.',
    ogImage: '/images/generated/service-event-coverage.jpg',
    ogTitle: 'Corporate Event Coverage\u2122 - JHR Photography',
    ogDescription:
      'Your event, documented without drama. Professional event photography with same-day delivery and agency-grade execution.',
  },
  sections: CEC_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getCECSectionById(sectionId: string): PageSectionContent | undefined {
  return CEC_SECTIONS.find((s) => s.id === sectionId);
}

export function getCECContentKeyPrefix(sectionId: string): string {
  return `corporate-event-coverage:${sectionId}`;
}
