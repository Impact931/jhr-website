/**
 * Corporate Event Coverage Service Page Content Schema
 *
 * Defines the editable structure for the Corporate Event Coverage service page.
 * Updated content from content guidance — focuses on internal event owners
 * and organizational events (conferences, retreats, training, milestones).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | corporate-event-coverage:hero
 * 1          | Problem / Empathy             | EditableFeatureGrid       | corporate-event-coverage:problem
 * 2          | Solution (What We Deliver)    | EditableFeatureGrid       | corporate-event-coverage:solution
 * 3          | How It Works                  | EditableFeatureGrid       | corporate-event-coverage:how-it-works
 * 4          | What's Included               | EditableFeatureGrid       | corporate-event-coverage:whats-included
 * 5          | Video Systems CTA             | EditableCTA               | corporate-event-coverage:video-cta
 * 6          | Social Proof                  | EditableTestimonials      | corporate-event-coverage:social-proof
 * 7          | FAQs                          | EditableFAQ               | corporate-event-coverage:faqs
 * 8          | Final CTA                     | EditableCTA               | corporate-event-coverage:final-cta
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
  title: 'Your Event Took Months to Plan. The Media Should Prove It.',
  subtitle: 'Corporate Event Coverage\u2122',
  description:
    'When your organization invests in bringing people together \u2014 for a conference, an annual meeting, a leadership retreat, or a training summit \u2014 the media should capture more than what happened. It should capture why it mattered.',
  backgroundImage: {
    src: '/images/generated/service-event-coverage.jpg',
    alt: 'Professional event photography at corporate conference in Nashville',
  },
  buttons: [
    { text: 'Talk With Our Team', href: '/schedule', variant: 'primary' },
    { text: 'Check Availability', href: '/contact', variant: 'secondary' },
  ],
};

export const CEC_PROBLEM: FeatureGridSectionContent = {
  id: 'problem',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Why intentional event media coverage matters',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'Months of Work Shouldn\u2019t Vanish When the Lights Go Down',
  subheading:
    'You coordinated the speakers, managed the budget, aligned the stakeholders, and made sure every detail landed. But without intentional media coverage, a three-day conference becomes a memory instead of an asset.',
  columns: 3,
  features: [
    {
      id: 'problem-card-0',
      icon: 'FolderOpen',
      title: 'Content That Sits in a Folder',
      description:
        'Without intentional documentation, event photos end up in a drive no one opens. The moments your marketing team could have used for twelve months never get captured.',
    },
    {
      id: 'problem-card-1',
      icon: 'Clock',
      title: 'Value That Stays in the Room',
      description:
        'The event happened. The keynotes were powerful. The networking was genuine. But without the right media, all that value stays in the room and fades.',
    },
    {
      id: 'problem-card-2',
      icon: 'Users',
      title: 'Stakeholder Expectations',
      description:
        'Sponsors want visibility. Leadership wants documentation. Marketing needs content. Everyone expects professional media \u2014 but someone has to make sure it actually happens.',
    },
  ],
};

export const CEC_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'What corporate event coverage delivers',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'A Professional Media Library From a Single Event',
  subheading:
    'Corporate Event Coverage isn\u2019t just "having a photographer there." It\u2019s intentional documentation designed to produce assets your organization can use across marketing, recruiting, internal communications, and stakeholder reporting \u2014 all year long.',
  columns: 2,
  features: [
    {
      id: 'solution-card-0',
      icon: 'Presentation',
      title: 'The Big Stage',
      description:
        'General sessions, keynote speakers, panel discussions, and main stage programming. We document the moments your attendees came for.',
    },
    {
      id: 'solution-card-1',
      icon: 'BookOpen',
      title: 'The Breakout Rooms',
      description:
        'Workshops, training sessions, and smaller group programming. These are the rooms where real engagement happens \u2014 and they\u2019re often the most underdocumented.',
    },
    {
      id: 'solution-card-2',
      icon: 'MessageCircle',
      title: 'The In-Between',
      description:
        'Hallway conversations, registration energy, attendee interactions, and the unscripted connections that make an event feel alive. Your best social and recruiting content lives here.',
    },
    {
      id: 'solution-card-3',
      icon: 'Tag',
      title: 'The Branded Details',
      description:
        'Signage, stage design, sponsor recognition, and environmental branding. These images serve your sponsors, your partners, and your internal reporting.',
    },
  ],
};

export const CEC_HOW_IT_WORKS: FeatureGridSectionContent = {
  id: 'how-it-works',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How corporate event coverage works with JHR Photography',
    sectionId: 'how-it-works',
    dataSectionName: 'how-it-works',
  },
  heading: 'A Clear Process From Planning to Delivery',
  subheading: 'We\u2019ve covered hundreds of corporate events in Nashville. The process is simple because it\u2019s been refined through repetition.',
  columns: 3,
  features: [
    {
      id: 'how-it-works-card-0',
      icon: 'Phone',
      title: 'We Align on What Matters',
      description:
        'A focused conversation about your event \u2014 the programming, the stakeholders, the moments that matter most, and how the media will be used afterward.',
    },
    {
      id: 'how-it-works-card-1',
      icon: 'Camera',
      title: 'We Deploy and Execute',
      description:
        'Our certified operators arrive prepared \u2014 familiar with the venue, aligned to your brand standards, and ready to integrate into your event flow.',
    },
    {
      id: 'how-it-works-card-2',
      icon: 'Send',
      title: 'You Receive a Curated Gallery',
      description:
        'A professionally curated gallery delivered within 72 hours \u2014 organized, retouched, and ready for marketing, sponsors, and leadership. Same-day highlights available.',
    },
  ],
};

export const CEC_WHATS_INCLUDED: FeatureGridSectionContent = {
  id: 'whats-included',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'What is included in corporate event coverage',
    sectionId: 'whats-included',
    dataSectionName: 'whats-included',
  },
  heading: 'Complete Coverage. Professional Delivery. No Gaps.',
  subheading: 'Every Corporate Event Coverage engagement is designed to capture the full story of your event \u2014 not just the highlights.',
  columns: 2,
  features: [
    {
      id: 'whats-included-card-0',
      icon: 'CheckCircle',
      title: 'Certified Operator, Full Day',
      description: 'A JHR certified operator deployed for the full duration of your event. Trained, vetted, and experienced with Nashville\u2019s top corporate venues.',
    },
    {
      id: 'whats-included-card-1',
      icon: 'CheckCircle',
      title: 'Same-Day Highlights',
      description: '5\u201310 curated images delivered the same day for immediate social media posting and real-time event promotion.',
    },
    {
      id: 'whats-included-card-2',
      icon: 'CheckCircle',
      title: 'Curated Gallery \u2014 72-Hour Delivery',
      description: 'Your full event gallery, professionally curated and retouched, delivered within 72 hours of event completion.',
    },
    {
      id: 'whats-included-card-3',
      icon: 'CheckCircle',
      title: 'Full Commercial License',
      description: 'Every image delivered with a Standard Commercial License covering website, social media, internal communications, recruiting, and partner sharing.',
    },
  ],
};

export const CEC_VIDEO_CTA: CTASectionContent = {
  id: 'video-cta',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Add event video systems to your coverage',
    sectionId: 'video-cta',
    dataSectionName: 'video-cta',
  },
  headline: 'Add Video to Your Event Coverage',
  subtext:
    'Keynote capture, highlight reels, attendee testimonials, and social-ready clips \u2014 from the same coordinated team already on-site. One vendor, complete coverage.',
  backgroundType: 'solid',
  backgroundValue: '#1A1A1A',
  primaryButton: {
    text: 'Learn About Video Systems',
    href: '/services/event-video-systems',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Talk With Our Team',
    href: '/schedule',
    variant: 'secondary',
  },
};

export const CEC_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Client testimonials for corporate event coverage',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Event Teams Trust JHR',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'JHR covered our three-day annual conference and delivered a gallery our marketing team has used every month since. That\u2019s never happened with a photographer before.',
      authorName: 'Conference Director',
      authorTitle: 'National Association',
    },
    {
      id: 'social-proof-1',
      quote:
        'They operated like part of our team. No direction needed, no missed moments. Our sponsors were thrilled with the documentation they received.',
      authorName: 'Event Manager',
      authorTitle: 'Enterprise Marketing',
    },
  ],
};

export const CEC_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 7,
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
        'Yes. We deliver 5\u201310 curated highlight images within hours of the event\u2019s conclusion. These are edited and ready for social media, press, and immediate marketing use. The full gallery follows within 72 hours.',
    },
    {
      id: 'faqs-item-1',
      question: 'How do you handle multi-day events?',
      answer:
        'Multi-day events are our specialty. We maintain the same team throughout, establish consistent workflows, and deliver rolling galleries so you have usable content each day.',
    },
    {
      id: 'faqs-item-2',
      question: 'What\u2019s included in the commercial license?',
      answer:
        'Every image comes with a Standard Commercial License covering your website, social media, internal communications, recruiting materials, and sponsor/partner sharing. No additional fees or usage restrictions.',
    },
    {
      id: 'faqs-item-3',
      question: 'Can you work from a shot list?',
      answer:
        'Absolutely. We prefer it. Before the event, we\u2019ll review your priorities, required shots, and must-capture moments. We work systematically through your list while staying alert for spontaneous opportunities.',
    },
    {
      id: 'faqs-item-4',
      question: 'What\u2019s the difference between corporate event coverage and trade-show media?',
      answer:
        'Corporate event coverage is designed for events your organization hosts \u2014 conferences, retreats, training summits. Trade-show media is built around exhibitor deliverables, show floor documentation, and sponsor assets. Many organizations benefit from both.',
    },
  ],
};

export const CEC_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a strategy call for corporate event coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Plan Your Event Coverage',
  subtext:
    'Tell us about your event \u2014 the dates, the venue, the programming, and what matters most. We\u2019ll create a coverage plan that ensures nothing gets missed.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/venue-hotel-ballroom.jpg',
  primaryButton: {
    text: 'Talk With Our Team',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const CEC_SECTIONS: PageSectionContent[] = [
  CEC_HERO,
  CEC_PROBLEM,
  CEC_SOLUTION,
  CEC_HOW_IT_WORKS,
  CEC_WHATS_INCLUDED,
  CEC_VIDEO_CTA,
  CEC_SOCIAL_PROOF,
  CEC_FAQS,
  CEC_FINAL_CTA,
];

export const CORPORATE_EVENT_COVERAGE_PAGE_SCHEMA: PageSchema = {
  slug: 'corporate-event-coverage',
  name: 'Corporate Event Coverage',
  seo: {
    pageTitle: 'Corporate Event Coverage | JHR Photography',
    metaDescription:
      'Professional corporate event photography in Nashville. Same-day highlights, 72-hour gallery delivery, and comprehensive coverage for conferences, summits, and organizational events.',
    ogImage: '/images/generated/service-event-coverage.jpg',
    ogTitle: 'Corporate Event Coverage\u2122 - JHR Photography',
    ogDescription:
      'Your event took months to plan. The media should prove it. Professional event coverage with same-day delivery in Nashville.',
    primarySEOFocus: 'corporate event photography Nashville',
    secondarySEOSignals: ['conference photographer Nashville', 'corporate event coverage', 'same-day event photos'],
    geoEntitySignals: ['Nashville TN', 'Music City Center', 'Gaylord Opryland'],
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
