/**
 * Convention Media Services Page Content Schema
 *
 * Defines the editable structure for the Convention Media Services page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/convention-media/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | convention-media:hero
 * 1          | Stats Bar                     | EditableStats             | convention-media:stats
 * 2          | The Convention Media Challenge | EditableTextBlock         | convention-media:problem
 * 3          | How Convention Coverage Works  | EditableFeatureGrid       | convention-media:how-it-works
 * 4          | What's Included               | EditableFeatureGrid       | convention-media:whats-included
 * 5          | Convention Types We Cover      | EditableFeatureGrid       | convention-media:event-types
 * 6          | Social Proof                  | EditableTestimonials      | convention-media:social-proof
 * 7          | FAQs                          | EditableFAQ               | convention-media:faqs
 * 8          | Final CTA                     | EditableCTA               | convention-media:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: convention-media:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  StatsSectionContent,
  FeatureGridSectionContent,
  TestimonialsSectionContent,
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
export const CM_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Convention media services by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Your Convention Deserves a Media Partner Who Gets the Scale',
  subtitle: 'Convention Media Services\u2122',
  description:
    'Multi-day conventions move fast. You need a team that understands the pace, knows the venue, and delivers assets your stakeholders, sponsors, and marketing teams can use \u2014 without adding to your coordination burden.',
  backgroundImage: {
    src: '/images/generated/service-event-coverage.jpg',
    alt: 'Professional convention media coverage at large-scale event',
  },
  buttons: [
    { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Stats Bar
 * Component: EditableStats
 */
export const CM_STATS: StatsSectionContent = {
  id: 'stats',
  type: 'stats',
  order: 1,
  seo: {
    ariaLabel: 'Convention media coverage statistics and credentials',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  stats: [
    { id: 'stat-0', value: 500, suffix: '+', label: 'Conventions Covered' },
    { id: 'stat-1', value: 50000, suffix: '+', label: 'Photos Delivered' },
    { id: 'stat-2', value: 24, suffix: 'hr', label: 'Same-Day Turnaround' },
    { id: 'stat-3', value: 12, suffix: '+', label: 'Nashville Venues' },
  ],
};

/**
 * Section 2: The Convention Media Challenge (Problem/Empathy)
 * Component: EditableTextBlock (centered)
 */
export const CM_PROBLEM: TextBlockSectionContent = {
  id: 'problem',
  type: 'text-block',
  order: 2,
  seo: {
    ariaLabel: 'The convention media challenge and why it matters',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'The Convention Media Challenge',
  alignment: 'center',
  content:
    '<p>You\u2019ve invested months coordinating this event. The media coverage shouldn\u2019t be another thing to manage.</p>' +
    '<p>Conventions have dozens of concurrent sessions, exhibit halls, networking events, and keynotes. You need a team that can cover it all without missing critical moments.</p>' +
    '<p>Sponsors want assets before the convention ends. Marketing needs social content in real-time. You can\u2019t wait weeks for your media.</p>' +
    '<p>Your media team should know the venue, the staff, and the logistics \u2014 so they integrate into your operation, not complicate it.</p>',
};

/**
 * Section 3: How Convention Coverage Works
 * Component: EditableFeatureGrid (alternating, 2 columns, numbered steps)
 */
export const CM_HOW_IT_WORKS: FeatureGridSectionContent = {
  id: 'how-it-works',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How convention media coverage works with JHR Photography',
    sectionId: 'how-it-works',
    dataSectionName: 'how-it-works',
  },
  heading: 'How Convention Coverage Works',
  subheading: 'A proven process designed for multi-day, multi-venue events.',
  columns: 2,
  displayMode: 'alternating',
  showStepNumbers: true,
  features: [
    {
      id: 'how-it-works-card-0',
      icon: 'Phone',
      title: 'Pre-Convention Planning',
      description:
        'We review your event schedule, identify priority moments, coordinate with venue contacts, and create a comprehensive coverage plan.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Pre-convention planning and coordination' },
    },
    {
      id: 'how-it-works-card-1',
      icon: 'Camera',
      title: 'On-Site Execution',
      description:
        'Our team deploys across your convention \u2014 keynotes, breakouts, exhibit hall, networking events \u2014 with same-day highlight delivery.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'On-site convention photography coverage' },
    },
    {
      id: 'how-it-works-card-2',
      icon: 'Send',
      title: 'Post-Convention Delivery',
      description:
        'Complete media library delivered within 5-7 business days. Same-day social highlights available throughout the event.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Post-convention media delivery and library' },
    },
  ],
};

/**
 * Section 4: What's Included
 * Component: EditableFeatureGrid (2 columns)
 */
export const CM_WHATS_INCLUDED: FeatureGridSectionContent = {
  id: 'whats-included',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'What is included in convention media coverage',
    sectionId: 'whats-included',
    dataSectionName: 'whats-included',
  },
  heading: 'What\u2019s Included',
  columns: 2,
  features: [
    {
      id: 'whats-included-card-0',
      icon: 'Camera',
      title: 'Multi-Session Coverage',
      description:
        'Keynotes, breakouts, workshops, and general sessions captured with professional quality across all concurrent tracks.',
    },
    {
      id: 'whats-included-card-1',
      icon: 'Clock',
      title: 'Same-Day Highlights',
      description:
        'Edited highlight images delivered daily for social media, press releases, and sponsor communications.',
    },
    {
      id: 'whats-included-card-2',
      icon: 'FileImage',
      title: 'Complete Media Library',
      description:
        'Full edited gallery organized by session, day, and event type \u2014 ready for marketing, stakeholder reports, and archives.',
    },
    {
      id: 'whats-included-card-3',
      icon: 'Video',
      title: 'Video Systems Integration',
      description:
        'Add Event Video Systems for keynote capture, highlight reels, and social-ready video content from the same coordinated team.',
      link: { text: 'Learn About Video Systems', href: '/services/event-video-systems' },
    },
  ],
};

/**
 * Section 5: Convention Types We Cover
 * Component: EditableFeatureGrid (horizontal, 2 columns)
 */
export const CM_EVENT_TYPES: FeatureGridSectionContent = {
  id: 'event-types',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'Convention and event types covered by JHR Photography',
    sectionId: 'event-types',
    dataSectionName: 'event-types',
  },
  heading: 'Convention Types We Cover',
  columns: 2,
  displayMode: 'horizontal',
  features: [
    {
      id: 'event-types-card-0',
      icon: 'Building',
      title: 'Industry Conventions',
      description:
        'Large-scale annual conventions with exhibit halls, keynotes, and hundreds of concurrent sessions.',
    },
    {
      id: 'event-types-card-1',
      icon: 'Users',
      title: 'Professional Conferences',
      description:
        'Multi-day conferences focused on education, networking, and professional development.',
    },
    {
      id: 'event-types-card-2',
      icon: 'Calendar',
      title: 'Association Events',
      description:
        'Annual meetings, board gatherings, and member-focused events for professional associations.',
    },
    {
      id: 'event-types-card-3',
      icon: 'Megaphone',
      title: 'Corporate Conferences',
      description:
        'Internal conferences, leadership summits, and company-wide events requiring comprehensive documentation.',
    },
  ],
};

/**
 * Section 6: Social Proof (Testimonials)
 * Component: EditableTestimonials (grid layout)
 */
export const CM_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Testimonials from convention planners who trust JHR Photography',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Convention Planners Trust JHR',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'The JHR team covered our three-day convention like they\u2019d been doing it for years. Multiple sessions running simultaneously and they didn\u2019t miss a moment.',
      authorName: 'Convention Director',
      authorTitle: 'National Association',
    },
    {
      id: 'social-proof-1',
      quote:
        'Having same-day highlights for social media during the convention was a game-changer for sponsor engagement.',
      authorName: 'Marketing Manager',
      authorTitle: 'Industry Convention',
    },
    {
      id: 'social-proof-2',
      quote:
        'The pre-convention planning was incredible. They mapped out every session, every venue area, and every critical moment. Nothing was left to chance.',
      authorName: 'Event Coordinator',
      authorTitle: 'Technology Convention',
    },
  ],
};

/**
 * Section 7: FAQs
 * Component: EditableFAQ
 */
export const CM_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 7,
  seo: {
    ariaLabel: 'Frequently asked questions about convention media services',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How do you handle multiple concurrent sessions?',
      answer:
        'We deploy teams across your convention based on your priority schedule. Our pre-convention planning identifies which sessions need dedicated coverage and which can be captured in rotation.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you deliver photos during the convention?',
      answer:
        'Yes. We provide same-day edited highlights \u2014 typically 20-50 images per day \u2014 delivered within hours of each day\u2019s events. These are ready for social media, press, and sponsor communications.',
    },
    {
      id: 'faqs-item-2',
      question: 'How do you coordinate with our convention team?',
      answer:
        'We assign a dedicated lead who coordinates directly with your event team. We integrate into your communication channels and follow your protocols \u2014 we fit into your operation, not the other way around.',
    },
    {
      id: 'faqs-item-3',
      question: 'What venues do you cover conventions at?',
      answer:
        'We\u2019re experienced at Nashville\u2019s major convention venues including Music City Center, Gaylord Opryland, and the Renaissance. We know the spaces, the staff, and the logistics.',
    },
    {
      id: 'faqs-item-4',
      question: 'Can you add video to convention coverage?',
      answer:
        'Absolutely. Our Event Video Systems integrate seamlessly with photography coverage \u2014 one coordinated team handling both. Common additions include keynote capture, highlight reels, and attendee testimonials.',
    },
  ],
};

/**
 * Section 8: Final CTA
 * Component: EditableCTA (gradient background variant)
 */
export const CM_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a conversation about convention media coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Plan Your Convention Coverage',
  subtext:
    'Tell us about your convention \u2014 dates, venue, and priorities. We\u2019ll create a coverage plan that ensures nothing gets missed.',
  backgroundType: 'gradient',
  backgroundValue: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), linear-gradient(180deg, #0B0C0F 0%, #0B0C0F 100%)',
  primaryButton: {
    text: 'Talk With Our Team',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const CM_SECTIONS: PageSectionContent[] = [
  CM_HERO,
  CM_STATS,
  CM_PROBLEM,
  CM_HOW_IT_WORKS,
  CM_WHATS_INCLUDED,
  CM_EVENT_TYPES,
  CM_SOCIAL_PROOF,
  CM_FAQS,
  CM_FINAL_CTA,
];

export const CONVENTION_MEDIA_PAGE_SCHEMA: PageSchema = {
  slug: 'convention-media',
  name: 'Convention Media Services',
  seo: {
    pageTitle: 'Convention Media Services | JHR Photography',
    metaDescription:
      'Professional convention media coverage in Nashville. Multi-day documentation, same-day highlights, and comprehensive media libraries for conventions and conferences.',
    ogImage: '/images/generated/service-event-coverage.jpg',
    ogTitle: 'Convention Media Services\u2122 - JHR Photography',
    ogDescription:
      'Your convention deserves a media partner who gets the scale. Multi-day coverage with same-day highlights and comprehensive media delivery.',
  },
  sections: CM_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getCMSectionById(sectionId: string): PageSectionContent | undefined {
  return CM_SECTIONS.find((s) => s.id === sectionId);
}

export function getCMContentKeyPrefix(sectionId: string): string {
  return `convention-media:${sectionId}`;
}
