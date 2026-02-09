/**
 * Event Video Systems Service Page Content Schema
 *
 * Defines the editable structure for the Event Video Systems service page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/event-video-systems/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | event-video-systems:hero
 * 1          | Why Event Video Matters        | EditableFeatureGrid       | event-video-systems:value-prop
 * 2          | Video Services                | EditableFeatureGrid       | event-video-systems:services
 * 3          | Common Applications           | EditableFeatureGrid       | event-video-systems:use-cases
 * 4          | How We Work (Process)         | EditableFeatureGrid       | event-video-systems:process
 * 5          | Gallery                       | EditableImageGallery      | event-video-systems:gallery
 * 6          | FAQs                          | EditableFAQ               | event-video-systems:faqs
 * 7          | Final CTA                     | EditableCTA               | event-video-systems:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: event-video-systems:{sectionId}:{elementId}
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
export const EVS_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Event video systems service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Your Event Deserves More Than Photos',
  subtitle: 'Event Video Systems\u2122',
  description:
    'Great events end. Great video extends their impact. Capture keynotes for training libraries, testimonials for marketing, and highlights that promote next year\u2019s event before this one\u2019s even over.',
  backgroundImage: {
    src: '/images/generated/service-event-video.jpg',
    alt: 'Professional video production at corporate event',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: Why Event Video Matters (Value Proposition)
 * Maps to: Left text + right video preview image with outcomes checklist
 * Component: EditableFeatureGrid (used for outcomes list)
 */
export const EVS_VALUE_PROP: FeatureGridSectionContent = {
  id: 'value-prop',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Why event video matters for your organization',
    sectionId: 'value-prop',
    dataSectionName: 'value-prop',
  },
  heading: 'Why Event Video Matters',
  subheading:
    'You spend months planning an event. Attendees experience it for a few days. Then it\u2019s over. Video changes that equation.',
  columns: 2,
  features: [
    {
      id: 'value-prop-card-0',
      icon: 'CheckCircle',
      title: 'Extended Event ROI',
      description: 'Extended event ROI through lasting video content.',
    },
    {
      id: 'value-prop-card-1',
      icon: 'CheckCircle',
      title: 'Keynote Archives',
      description: 'Professional keynote archives for internal use.',
    },
    {
      id: 'value-prop-card-2',
      icon: 'CheckCircle',
      title: 'Promotional Material',
      description: 'Compelling promotional material for future events.',
    },
    {
      id: 'value-prop-card-3',
      icon: 'CheckCircle',
      title: 'Authentic Testimonials',
      description: 'Authentic testimonials for marketing campaigns.',
    },
  ],
};

/**
 * Section 2: Video Services
 * Maps to: 2x2 service cards grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const EVS_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Event video services offered by JHR Photography',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Video Services',
  subheading:
    'Each system can be added to any photography service or booked independently. One coordinated team handles everything.',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Video',
      title: 'Keynote Capture',
      description:
        'Multi-camera coverage of your keynotes and general sessions. Professional audio capture ensures every word comes through clearly.',
    },
    {
      id: 'services-card-1',
      icon: 'Film',
      title: 'Highlight Reels',
      description:
        'Condensed event stories that capture the energy and key moments. Perfect for social media, stakeholder reports, and next year\u2019s promotion.',
    },
    {
      id: 'services-card-2',
      icon: 'Mic',
      title: 'Attendee Testimonials',
      description:
        'On-site testimonial capture with professional lighting and sound. Real voices telling real stories about your event\u2019s impact.',
    },
    {
      id: 'services-card-3',
      icon: 'Share2',
      title: 'Social-Ready Clips',
      description:
        'Short-form content optimized for LinkedIn, Instagram, and other platforms. Delivered in formats ready for immediate posting.',
    },
  ],
};

/**
 * Section 3: Common Applications (Use Cases)
 * Maps to: 3-column use case cards
 * Component: EditableFeatureGrid (3 columns)
 */
export const EVS_USE_CASES: FeatureGridSectionContent = {
  id: 'use-cases',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Common applications for event video content',
    sectionId: 'use-cases',
    dataSectionName: 'use-cases',
  },
  heading: 'Common Applications',
  subheading: 'How organizations use event video to extend ROI.',
  columns: 3,
  features: [
    {
      id: 'use-cases-card-0',
      icon: 'GraduationCap',
      title: 'Internal Training',
      description:
        'Keynote recordings become on-demand training for team members who couldn\u2019t attend. Build a library of leadership content.',
    },
    {
      id: 'use-cases-card-1',
      icon: 'Megaphone',
      title: 'Event Promotion',
      description:
        'This year\u2019s highlight reel sells next year\u2019s tickets. Show prospects exactly what they\u2019ll experience.',
    },
    {
      id: 'use-cases-card-2',
      icon: 'BarChart',
      title: 'Stakeholder Reporting',
      description:
        'A 3-minute highlight reel communicates event success better than any slide deck. Show the board what happened.',
    },
  ],
};

/**
 * Section 4: How We Work (Process)
 * Maps to: 4-step timeline
 * Component: EditableFeatureGrid (4 columns)
 */
export const EVS_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Event video production process',
    sectionId: 'process',
    dataSectionName: 'process',
  },
  heading: 'How We Work',
  columns: 4,
  features: [
    {
      id: 'process-card-0',
      icon: 'ClipboardList',
      title: 'Pre-Production',
      description:
        'We review your event schedule, identify key capture moments, and coordinate with your AV team on audio feeds and positioning.',
    },
    {
      id: 'process-card-1',
      icon: 'Video',
      title: 'On-Site Capture',
      description:
        'Our video team works alongside our photography team (if applicable), capturing footage throughout the event without disruption.',
    },
    {
      id: 'process-card-2',
      icon: 'Scissors',
      title: 'Post-Production',
      description:
        'Professional editing, color grading, audio mixing, and graphics. We deliver polished content ready for its intended use.',
    },
    {
      id: 'process-card-3',
      icon: 'Send',
      title: 'Delivery',
      description:
        'Files delivered in all formats you need\u2014archival masters, web versions, and platform-specific exports for social media.',
    },
  ],
};

/**
 * Section 5: Gallery
 * Component: EditableImageGallery
 */
export const EVS_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 5,
  seo: {
    ariaLabel: 'Event video production portfolio samples',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Our Video Work',
  layout: 'grid',
  images: [
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote speaker video capture setup' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Awards ceremony video production' },
    { src: '/images/generated/event-trade-show.jpg', alt: 'Trade show video documentation' },
    { src: '/images/generated/event-networking.jpg', alt: 'Networking event video highlights' },
    { src: '/images/generated/venue-music-city-center.jpg', alt: 'Convention center video production' },
    { src: '/images/generated/venue-gaylord-opryland.jpg', alt: 'Resort event video coverage' },
  ],
};

/**
 * Section 6: FAQs
 * Component: EditableFAQ
 */
export const EVS_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 6,
  seo: {
    ariaLabel: 'Frequently asked questions about event video systems',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'Can you add video to our photography package?',
      answer:
        'Yes. Video can be added to any photography package or booked independently. Many clients start with event coverage photography and add video for key elements like keynotes or testimonials.',
    },
    {
      id: 'faqs-item-1',
      question: 'How quickly can we receive the highlight reel?',
      answer:
        'Standard turnaround for highlight reels is 2-3 weeks. For events requiring faster delivery, we offer expedited editing\u2014discuss your timeline during our strategy call.',
    },
    {
      id: 'faqs-item-2',
      question: 'What\u2019s included in keynote capture?',
      answer:
        'Multi-camera coverage (typically 2-3 cameras), professional audio capture from the venue feed plus backup recording, and basic editing including intro/outro, lower thirds, and clean cuts.',
    },
    {
      id: 'faqs-item-3',
      question: 'Do you bring your own audio equipment?',
      answer:
        'We connect to your venue\u2019s audio feed for the cleanest sound, but always bring backup recording equipment. For testimonials and interviews, we use professional wireless microphones.',
    },
    {
      id: 'faqs-item-4',
      question: 'What formats do you deliver in?',
      answer:
        'Standard delivery includes high-resolution files for archival, web-optimized versions for your site, and platform-specific exports for social media (LinkedIn, Instagram, YouTube, etc.).',
    },
  ],
};

/**
 * Section 7: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const EVS_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 7,
  seo: {
    ariaLabel: 'Schedule a strategy call for event video services',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss Your Video Needs',
  subtext:
    'Every event has different video requirements. Schedule a call and we\u2019ll discuss what makes sense for your goals and budget.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-awards-ceremony.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const EVS_SECTIONS: PageSectionContent[] = [
  EVS_HERO,
  EVS_VALUE_PROP,
  EVS_SERVICES,
  EVS_USE_CASES,
  EVS_PROCESS,
  EVS_GALLERY,
  EVS_FAQS,
  EVS_FINAL_CTA,
];

export const EVENT_VIDEO_SYSTEMS_PAGE_SCHEMA: PageSchema = {
  slug: 'event-video-systems',
  name: 'Event Video Systems',
  seo: {
    pageTitle: 'Event Video Systems | JHR Photography',
    metaDescription:
      'Professional event video production in Nashville. Keynote capture, highlight reels, testimonial videos, and social-ready clips for corporate events.',
    ogImage: '/images/generated/service-event-video.jpg',
    ogTitle: 'Event Video Systems\u2122 - JHR Photography',
    ogDescription:
      'Your event deserves more than photos. Capture keynotes, testimonials, and highlights that extend your event\u2019s impact.',
  },
  sections: EVS_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getEVSSectionById(sectionId: string): PageSectionContent | undefined {
  return EVS_SECTIONS.find((s) => s.id === sectionId);
}

export function getEVSContentKeyPrefix(sectionId: string): string {
  return `event-video-systems:${sectionId}`;
}
