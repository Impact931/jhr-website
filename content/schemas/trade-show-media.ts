/**
 * Trade-Show Media Services Page Content Schema
 *
 * Defines the editable structure for the Trade-Show Media Services page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/trade-show-media/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | trade-show-media:hero
 * 1          | The Trade Show Media Gap       | EditableFeatureGrid       | trade-show-media:problem
 * 2          | How JHR Covers Trade Shows    | EditableFeatureGrid       | trade-show-media:solution
 * 3          | What's Included               | EditableFeatureGrid       | trade-show-media:whats-included
 * 4          | Add Video CTA                 | EditableCTA               | trade-show-media:video-pairing
 * 5          | Pair With Headshot Activation  | EditableFeatureGrid       | trade-show-media:exhibitor-crossover
 * 6          | Social Proof                  | EditableTestimonials      | trade-show-media:social-proof
 * 7          | FAQs                          | EditableFAQ               | trade-show-media:faqs
 * 8          | Final CTA                     | EditableCTA               | trade-show-media:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: trade-show-media:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
  FAQSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Component: EditableHero
 */
export const TSM_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Trade-show media services by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Media That Proves the Investment Was Worth It',
  subtitle: 'Trade-Show Media Services\u2122',
  description:
    'Trade shows are high-stakes, fast-moving environments. You need a media partner who understands exhibitor expectations, sponsor deliverables, and the energy of the show floor \u2014 and delivers assets that justify the investment.',
  backgroundImage: {
    src: '/images/generated/event-trade-show.jpg',
    alt: 'Professional trade show photography on the show floor',
  },
  buttons: [
    { text: 'Talk With Our Team', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: The Trade Show Media Gap (Problem)
 * Maps to: 3 problem cards in 3-column grid
 * Component: EditableFeatureGrid (3 columns)
 */
export const TSM_PROBLEM: FeatureGridSectionContent = {
  id: 'problem',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'The trade show media gap that exhibitors and organizers face',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'The Trade Show Media Gap',
  subheading:
    'Exhibitors expect assets. Sponsors want proof of engagement. Marketing needs content that performs. And you\u2019re trying to coordinate all of it during the busiest week of your year.',
  columns: 3,
  features: [
    {
      id: 'problem-card-0',
      icon: 'Shield',
      title: 'Sponsor & Exhibitor Deliverables',
      description:
        'Sponsors and exhibitors expect professional documentation of their presence. Without it, renewals become harder and relationships weaken.',
    },
    {
      id: 'problem-card-1',
      icon: 'Clock',
      title: 'Real-Time Content Needs',
      description:
        'Social media, press releases, and sponsor communications all need content during the show \u2014 not weeks after it ends.',
    },
    {
      id: 'problem-card-2',
      icon: 'BarChart',
      title: 'Proving Event ROI',
      description:
        'A comprehensive media library is the most tangible proof of your show\u2019s value to exhibitors, sponsors, and stakeholders.',
    },
  ],
};

/**
 * Section 2: How JHR Covers Trade Shows (Solution)
 * Maps to: 4 solution cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const TSM_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'How JHR Photography covers trade shows with integrated media',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'How JHR Covers Trade Shows',
  subheading:
    'We deploy as an integrated media team \u2014 covering the show floor, exhibitor booths, keynotes, and networking events with same-day delivery.',
  columns: 2,
  features: [
    {
      id: 'solution-card-0',
      icon: 'Camera',
      title: 'Show Floor Coverage',
      description:
        'Comprehensive documentation of exhibitor booths, attendee engagement, sponsor activations, and the overall energy of the trade show floor.',
    },
    {
      id: 'solution-card-1',
      icon: 'Clock',
      title: 'Same-Day Highlights',
      description:
        'Edited highlight images delivered daily for social media, exhibitor communications, and real-time marketing during the show.',
    },
    {
      id: 'solution-card-2',
      icon: 'FileImage',
      title: 'Exhibitor Asset Packages',
      description:
        'Customized photo packages for individual exhibitors and sponsors \u2014 ready-to-use assets that support their post-show marketing.',
    },
    {
      id: 'solution-card-3',
      icon: 'Users',
      title: 'Complete Show Documentation',
      description:
        'Full media library organized by exhibitor, session, and event type. Professional post-show content for stakeholder reports and future promotion.',
    },
  ],
};

/**
 * Section 3: What's Included in Trade-Show Coverage
 * Maps to: 4 inclusion cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const TSM_WHATS_INCLUDED: FeatureGridSectionContent = {
  id: 'whats-included',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'What is included in trade-show media coverage from JHR Photography',
    sectionId: 'whats-included',
    dataSectionName: 'whats-included',
  },
  heading: 'What\u2019s Included in Trade-Show Coverage',
  columns: 2,
  features: [
    {
      id: 'whats-included-card-0',
      icon: 'CheckCircle',
      title: 'Multi-Day Coverage',
      description:
        'Consistent team across all show days. Setup through teardown documentation.',
    },
    {
      id: 'whats-included-card-1',
      icon: 'CheckCircle',
      title: 'Exhibitor Documentation',
      description:
        'Individual booth photography for every exhibitor in your show.',
    },
    {
      id: 'whats-included-card-2',
      icon: 'CheckCircle',
      title: 'Session & Keynote Coverage',
      description:
        'Professional documentation of all educational sessions, keynotes, and panel discussions.',
    },
    {
      id: 'whats-included-card-3',
      icon: 'CheckCircle',
      title: 'Networking & Social Events',
      description:
        'Evening receptions, networking mixers, and social events captured with the same professional quality.',
    },
  ],
};

/**
 * Section 4: Add Video to Your Trade Show Coverage
 * Component: EditableCTA (solid background variant)
 */
export const TSM_VIDEO_PAIRING: CTASectionContent = {
  id: 'video-pairing',
  type: 'cta',
  order: 4,
  seo: {
    ariaLabel: 'Add video coverage to your trade show media package',
    sectionId: 'video-pairing',
    dataSectionName: 'video-pairing',
  },
  headline: 'Add Video to Your Trade Show Coverage',
  subtext:
    'Highlight reels, exhibitor testimonials, and social-ready clips from the same coordinated team. One vendor, complete coverage.',
  backgroundType: 'solid',
  backgroundValue: '#1A1A1A',
  primaryButton: {
    text: 'Learn About Video Systems',
    href: '/services/event-video-systems',
    variant: 'primary',
  },
};

/**
 * Section 5: Pair With Headshot Activation (Exhibitor Crossover)
 * Maps to: 2 crossover cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const TSM_EXHIBITOR_CROSSOVER: FeatureGridSectionContent = {
  id: 'exhibitor-crossover',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'Pair trade show media with headshot activation for exhibitor engagement',
    sectionId: 'exhibitor-crossover',
    dataSectionName: 'exhibitor-crossover',
  },
  heading: 'Pair With Headshot Activation',
  subheading:
    'Add a Headshot Activation to your trade show and turn your booth into the must-visit destination on the floor.',
  columns: 2,
  features: [
    {
      id: 'exhibitor-crossover-card-0',
      icon: 'Camera',
      title: 'Drive Booth Traffic',
      description:
        'Professional headshots create a line at your booth. Attendees get immediate value, you get qualified leads.',
      link: { text: 'Learn About Headshot Activations', href: '/services/headshot-activation' },
    },
    {
      id: 'exhibitor-crossover-card-1',
      icon: 'Users',
      title: 'Integrated Lead Capture',
      description:
        'Contact data captured at check-in flows directly to your CRM. Your sales team gets warm leads during the show.',
    },
  ],
};

/**
 * Section 6: Social Proof (Testimonials)
 * Component: EditableTestimonials (grid layout)
 */
export const TSM_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Testimonials from trade show organizers who chose JHR Photography',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Trade Show Organizers Choose JHR',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'JHR delivered exhibitor photo packages that our sponsors actually used in their post-show marketing. That never happened before.',
      authorName: 'Show Director',
      authorTitle: 'Industry Trade Show',
    },
    {
      id: 'social-proof-1',
      quote:
        'Having professional same-day content during the show transformed our social media presence and sponsor communications.',
      authorName: 'Event Manager',
      authorTitle: 'National Conference',
    },
  ],
};

/**
 * Section 7: FAQs
 * Component: EditableFAQ
 */
export const TSM_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 7,
  seo: {
    ariaLabel: 'Frequently asked questions about trade show media services',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'Do you photograph individual exhibitor booths?',
      answer:
        'Yes. We systematically photograph every exhibitor booth, creating individual asset packages that exhibitors can use for their own marketing. This is a high-value deliverable that strengthens exhibitor relationships.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you deliver photos during the show?',
      answer:
        'Absolutely. We provide same-day edited highlights \u2014 ready for social media, press releases, and sponsor communications within hours.',
    },
    {
      id: 'faqs-item-2',
      question: 'How do you handle multi-day trade shows?',
      answer:
        'We maintain the same team throughout the show, ensuring consistency and familiarity. Rolling deliveries provide usable content each day.',
    },
    {
      id: 'faqs-item-3',
      question: 'What\u2019s the difference between trade show coverage and corporate event coverage?',
      answer:
        'Trade show coverage is designed around exhibitor and sponsor deliverables, booth documentation, and show floor energy. Corporate event coverage focuses on keynotes, sessions, and organizational storytelling. Many events benefit from both.',
    },
    {
      id: 'faqs-item-4',
      question: 'Can we add headshot activations to our trade show?',
      answer:
        'Yes \u2014 it\u2019s one of our most popular pairings. A Headshot Activation at your booth drives traffic, captures leads, and gives attendees immediate professional value.',
    },
  ],
};

/**
 * Section 8: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const TSM_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a consultation for trade show media coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Plan Your Trade Show Coverage',
  subtext:
    'Tell us about your show \u2014 dates, venue, exhibitor count, and priorities. We\u2019ll build a coverage plan that delivers for every stakeholder.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-trade-show.jpg',
  primaryButton: {
    text: 'Talk With Our Team',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const TSM_SECTIONS: PageSectionContent[] = [
  TSM_HERO,
  TSM_PROBLEM,
  TSM_SOLUTION,
  TSM_WHATS_INCLUDED,
  TSM_VIDEO_PAIRING,
  TSM_EXHIBITOR_CROSSOVER,
  TSM_SOCIAL_PROOF,
  TSM_FAQS,
  TSM_FINAL_CTA,
];

export const TRADE_SHOW_MEDIA_PAGE_SCHEMA: PageSchema = {
  slug: 'trade-show-media',
  name: 'Trade-Show Media Services',
  seo: {
    pageTitle: 'Trade-Show Media Services | JHR Photography',
    metaDescription:
      'Professional trade show photography and media coverage in Nashville. Exhibitor documentation, same-day highlights, and comprehensive show floor coverage.',
    ogImage: '/images/generated/event-trade-show.jpg',
    ogTitle: 'Trade-Show Media Services\u2122 - JHR Photography',
    ogDescription:
      'Professional trade show media coverage with exhibitor documentation, same-day highlights, and comprehensive show floor photography.',
  },
  sections: TSM_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getTSMSectionById(sectionId: string): PageSectionContent | undefined {
  return TSM_SECTIONS.find((s) => s.id === sectionId);
}

export function getTSMContentKeyPrefix(sectionId: string): string {
  return `trade-show-media:${sectionId}`;
}
