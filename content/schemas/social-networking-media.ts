/**
 * Social & Networking Event Media Page Content Schema
 *
 * Defines the editable structure for the Social & Networking Event Media page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/social-networking-media/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner (half-height)     | EditableHero              | social-networking-media:hero
 * 1          | Stats Bar                     | EditableStats             | social-networking-media:stats
 * 2          | Why Networking Events Get...   | EditableTextBlock         | social-networking-media:problem
 * 3          | Social-First Event Coverage    | EditableFeatureGrid       | social-networking-media:solution
 * 4          | Events We Cover               | EditableFeatureGrid       | social-networking-media:use-cases
 * 5          | What's Included               | EditableFeatureGrid       | social-networking-media:whats-included
 * 6          | Add Social Video              | EditableCTA               | social-networking-media:video-pairing
 * 7          | Social Proof                  | EditableTestimonials      | social-networking-media:social-proof
 * 8          | FAQs                          | EditableFAQ               | social-networking-media:faqs
 * 9          | Final CTA (gradient)          | EditableCTA               | social-networking-media:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: social-networking-media:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  StatsSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  TestimonialsSectionContent,
  FAQSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner (half-height for variety)
 * Component: EditableHero
 */
export const SNM_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Social and networking event media by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Your Networking Event Deserves More Than Phone Photos',
  subtitle: 'Social & Networking Event Media',
  description:
    'Receptions, cocktail hours, networking mixers, and association meetups deserve professional coverage. We capture the energy, the connections, and the moments that make your event worth attending \u2014 delivered fast for social and follow-up communications.',
  backgroundImage: {
    src: '/images/generated/event-networking.jpg',
    alt: 'Professional photography at a social networking event',
  },
  buttons: [
    { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Stats Bar
 * Component: EditableStats
 */
export const SNM_STATS: StatsSectionContent = {
  id: 'stats',
  type: 'stats',
  order: 1,
  seo: {
    ariaLabel: 'Social and networking event media key statistics',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  stats: [
    { id: 'stat-0', value: 2, suffix: '-4 hrs', label: 'Typical Coverage' },
    { id: 'stat-1', value: 40, suffix: '+', label: 'Same-Evening Photos' },
    { id: 'stat-2', value: 3, suffix: 'x', label: 'Social Engagement Lift' },
    { id: 'stat-3', value: 100, suffix: '%', label: 'Social-Optimized' },
  ],
};

/**
 * Section 2: Why Networking Events Get Overlooked (Problem/Empathy)
 * Component: EditableTextBlock (centered)
 */
export const SNM_PROBLEM: TextBlockSectionContent = {
  id: 'problem',
  type: 'text-block',
  order: 2,
  seo: {
    ariaLabel: 'Why networking events get overlooked and deserve better coverage',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'Why Networking Events Get Overlooked',
  alignment: 'center',
  content:
    '<p>Networking events are where relationships start. But they\u2019re often the least documented part of your program \u2014 which means the moments that matter most are the ones you can\u2019t share.</p><p>Blurry phone photos don\u2019t represent the energy of your event. Social content can\u2019t wait weeks for delivery. And your attendees deserve professional coverage that makes them feel valued.</p>',
};

/**
 * Section 3: Social-First Event Coverage (Solution)
 * Component: EditableFeatureGrid (horizontal display)
 */
export const SNM_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Social-first event coverage solutions from JHR Photography',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'Social-First Event Coverage',
  subheading:
    'Fast-turn, social-optimized media coverage designed for shorter events and recurring programs.',
  displayMode: 'horizontal',
  columns: 2,
  features: [
    {
      id: 'solution-card-0',
      icon: 'Camera',
      title: 'Professional Candid Coverage',
      description:
        'Natural, unposed photography that captures genuine interactions, energy, and atmosphere. No awkward group shots \u2014 real moments.',
    },
    {
      id: 'solution-card-1',
      icon: 'Clock',
      title: 'Same-Evening Delivery',
      description:
        'Edited highlights delivered within hours of event conclusion. Post to social while the energy is still fresh.',
    },
    {
      id: 'solution-card-2',
      icon: 'Share2',
      title: 'Social-Optimized Assets',
      description:
        'Images formatted and optimized for LinkedIn, Instagram, and other platforms. Ready to post immediately.',
    },
    {
      id: 'solution-card-3',
      icon: 'Repeat',
      title: 'Recurring Event Programs',
      description:
        'Monthly networking series, quarterly meetups, and ongoing programs with consistent quality and familiar faces.',
    },
  ],
};

/**
 * Section 4: Events We Cover (Use Cases)
 * Component: EditableFeatureGrid (alternating with images)
 */
export const SNM_USE_CASES: FeatureGridSectionContent = {
  id: 'use-cases',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Social and networking event types covered by JHR Photography',
    sectionId: 'use-cases',
    dataSectionName: 'use-cases',
  },
  heading: 'Events We Cover',
  subheading:
    'Social and networking media coverage for the events where relationships happen.',
  displayMode: 'alternating',
  columns: 2,
  features: [
    {
      id: 'use-cases-card-0',
      icon: 'Wine',
      title: 'Cocktail Receptions',
      description:
        'Welcome receptions, sponsor mixers, and evening events with professional, atmospheric coverage.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Professional photography at a cocktail reception' },
    },
    {
      id: 'use-cases-card-1',
      icon: 'Users',
      title: 'Networking Mixers',
      description:
        'Industry meetups, professional networking events, and business social gatherings.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Networking mixer event photography' },
    },
    {
      id: 'use-cases-card-2',
      icon: 'Building',
      title: 'Association Events',
      description:
        'Chapter meetings, member mixers, board receptions, and association social functions.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Association event professional media coverage' },
    },
    {
      id: 'use-cases-card-3',
      icon: 'Calendar',
      title: 'Recurring Programs',
      description:
        'Monthly or quarterly event series with consistent professional coverage and recurring relationship pricing.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Recurring event program photography' },
    },
  ],
};

/**
 * Section 5: What's Included
 * Component: EditableFeatureGrid (default grid with CheckCircle icons)
 */
export const SNM_WHATS_INCLUDED: FeatureGridSectionContent = {
  id: 'whats-included',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'What is included in social and networking event media coverage',
    sectionId: 'whats-included',
    dataSectionName: 'whats-included',
  },
  heading: 'What\u2019s Included',
  columns: 2,
  features: [
    {
      id: 'whats-included-card-0',
      icon: 'CheckCircle',
      title: '2-4 Hour Coverage',
      description:
        'Professional photographer dedicated to your event for the full duration.',
    },
    {
      id: 'whats-included-card-1',
      icon: 'CheckCircle',
      title: 'Same-Evening Delivery',
      description:
        '20-40 edited highlight images delivered within hours of event conclusion.',
    },
    {
      id: 'whats-included-card-2',
      icon: 'CheckCircle',
      title: 'Social-Ready Formats',
      description:
        'All images optimized for social media platforms with proper sizing and formatting.',
    },
    {
      id: 'whats-included-card-3',
      icon: 'CheckCircle',
      title: 'Full Gallery in 3-5 Days',
      description:
        'Complete edited gallery delivered within one week for marketing and archives.',
    },
  ],
};

/**
 * Section 6: Video Pairing CTA
 * Component: EditableCTA (solid background variant)
 */
export const SNM_VIDEO_PAIRING: CTASectionContent = {
  id: 'video-pairing',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Add social video to your networking event coverage',
    sectionId: 'video-pairing',
    dataSectionName: 'video-pairing',
  },
  headline: 'Add Social Video to Your Event',
  subtext:
    'Short-form video clips optimized for social media from the same professional team. Attendee soundbites, atmosphere shots, and event energy \u2014 ready to post.',
  backgroundType: 'solid',
  backgroundValue: '#1A1A1A',
  primaryButton: {
    text: 'Learn About Video Systems',
    href: '/services/event-video-systems',
    variant: 'primary',
  },
};

/**
 * Section 7: Social Proof (Testimonials)
 * Component: EditableTestimonials (grid layout)
 */
export const SNM_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 7,
  seo: {
    ariaLabel: 'Testimonials from event hosts who trust JHR Photography',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Event Hosts Love Working With JHR',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'Our monthly networking events went from having no photos to having professional content we can share immediately. It\u2019s transformed our social media presence.',
      authorName: 'Community Manager',
      authorTitle: 'Professional Association',
    },
    {
      id: 'social-proof-1',
      quote:
        'The same-evening delivery means our LinkedIn posts go up while people are still talking about the event. Engagement has tripled.',
      authorName: 'Event Coordinator',
      authorTitle: 'Industry Network',
    },
    {
      id: 'social-proof-2',
      quote:
        'We use JHR for our quarterly mixers. Having the same photographer who knows our community makes every event feel cohesive. The photos are always on-brand and ready to post.',
      authorName: 'Membership Director',
      authorTitle: 'Nashville Professional Network',
    },
  ],
};

/**
 * Section 8: FAQs
 * Component: EditableFAQ
 */
export const SNM_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 8,
  seo: {
    ariaLabel: 'Frequently asked questions about social and networking event media',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How quickly do we get the photos?',
      answer:
        'Same-evening delivery for highlights \u2014 typically 20-40 edited images within hours of the event. Full gallery within 3-5 business days.',
    },
    {
      id: 'faqs-item-1',
      question: 'Is this just for big events?',
      answer:
        'Not at all. Social and networking coverage is designed for events of 30-200 attendees. It\u2019s perfect for the events that happen regularly and deserve consistent professional coverage.',
    },
    {
      id: 'faqs-item-2',
      question: 'Do you offer recurring event pricing?',
      answer:
        'Yes. For monthly or quarterly event series, we offer recurring relationship pricing that makes consistent professional coverage affordable and predictable.',
    },
    {
      id: 'faqs-item-3',
      question: 'Can you cover our event plus do headshots?',
      answer:
        'Absolutely. We can add a Headshot Activation component to your networking event \u2014 giving attendees professional headshots while you capture the social energy.',
    },
    {
      id: 'faqs-item-4',
      question: 'What if our event is only 2 hours?',
      answer:
        'That\u2019s ideal for social and networking coverage. We offer 2-4 hour coverage blocks designed specifically for shorter events.',
    },
  ],
};

/**
 * Section 9: Final CTA (gradient background)
 * Component: EditableCTA
 */
export const SNM_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 9,
  seo: {
    ariaLabel: 'Schedule a conversation about social and networking event coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Cover Your Next Event',
  subtext:
    'Tell us about your networking event or social gathering. We\u2019ll show you how professional coverage can elevate the experience for everyone involved.',
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

export const SNM_SECTIONS: PageSectionContent[] = [
  SNM_HERO,
  SNM_STATS,
  SNM_PROBLEM,
  SNM_SOLUTION,
  SNM_USE_CASES,
  SNM_WHATS_INCLUDED,
  SNM_VIDEO_PAIRING,
  SNM_SOCIAL_PROOF,
  SNM_FAQS,
  SNM_FINAL_CTA,
];

export const SOCIAL_NETWORKING_MEDIA_PAGE_SCHEMA: PageSchema = {
  slug: 'social-networking-media',
  name: 'Social & Networking Event Media',
  seo: {
    pageTitle: 'Social & Networking Event Media | JHR Photography',
    metaDescription:
      'Professional photography for networking events, cocktail hours, and social gatherings in Nashville. Same-evening delivery and social-optimized content.',
    ogImage: '/images/generated/event-networking.jpg',
    ogTitle: 'Social & Networking Event Media - JHR Photography',
    ogDescription:
      'Your networking event deserves more than phone photos. Professional coverage with same-evening delivery and social-optimized assets.',
  },
  sections: SNM_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getSNMSectionById(sectionId: string): PageSectionContent | undefined {
  return SNM_SECTIONS.find((s) => s.id === sectionId);
}

export function getSNMContentKeyPrefix(sectionId: string): string {
  return `social-networking-media:${sectionId}`;
}
