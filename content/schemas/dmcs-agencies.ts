/**
 * DMCs & Agencies Solution Page Content Schema
 *
 * Defines the editable structure for the DMCs & Agencies solution page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/solutions/dmcs-agencies/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | dmcs-agencies:hero
 * 1          | We Understand Your Reality    | EditableFeatureGrid       | dmcs-agencies:pain-points
 * 2          | A Partner, Not Just a Vendor   | EditableFeatureGrid       | dmcs-agencies:partnership
 * 3          | Services for Your Clients     | EditableFeatureGrid       | dmcs-agencies:services
 * 4          | FAQs                          | EditableFAQ               | dmcs-agencies:faqs
 * 5          | Final CTA                     | EditableCTA               | dmcs-agencies:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: dmcs-agencies:{sectionId}:{elementId}
 *
 * NOTE: The "A Partner, Not Just a Vendor" section is a 2-column text + checklist
 * layout on the page. Mapped to a feature-grid with CheckCircle icons for editability.
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
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
export const DMC_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'DMCs and agencies photography solutions by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Your Reputation Depends on Your Vendors',
  subtitle: 'For DMCs & Agencies',
  description:
    'You\u2019ve built trust over years. One unreliable vendor can damage that in a day. JHR Photography operates as an extension of your team\u2014professional, prepared, and consistent every time.',
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
    { text: 'Request Information', href: '/contact', variant: 'secondary' },
  ],
};

/**
 * Section 1: We Understand Your Reality
 * Maps to: 4 pain point cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const DMC_PAIN_POINTS: FeatureGridSectionContent = {
  id: 'pain-points',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Understanding DMC and agency challenges with photography vendors',
    sectionId: 'pain-points',
    dataSectionName: 'pain-points',
  },
  heading: 'We Understand Your Reality',
  subheading:
    'Managing corporate events means managing countless details and stakeholders. Every vendor choice is a risk calculation.',
  columns: 2,
  features: [
    {
      id: 'pain-points-card-0',
      icon: 'Shield',
      title: 'You Can\u2019t Afford Surprises',
      description:
        'Your reputation rides on every vendor you recommend. A photographer who shows up late, misses shots, or delivers inconsistent quality reflects directly on you.',
    },
    {
      id: 'pain-points-card-1',
      icon: 'Clock',
      title: 'Tight Timelines Are Normal',
      description:
        'You\u2019re often brought in late or dealing with shifting requirements. You need vendors who can adapt without drama.',
    },
    {
      id: 'pain-points-card-2',
      icon: 'FileCheck',
      title: 'Paperwork Matters',
      description:
        'EAC forms, insurance certificates, venue requirements\u2014administrative compliance isn\u2019t optional, it\u2019s table stakes.',
    },
    {
      id: 'pain-points-card-3',
      icon: 'Users',
      title: 'Your Client Is Watching',
      description:
        'Every interaction with your vendors reflects on your professionalism. You need partners who represent you well.',
    },
  ],
};

/**
 * Section 2: A Partner, Not Just a Vendor
 * Maps to: 2-column text + checklist layout on page
 * Component: EditableFeatureGrid (2 columns, CheckCircle icons)
 */
export const DMC_PARTNERSHIP: FeatureGridSectionContent = {
  id: 'partnership',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Why JHR Photography is a reliable partner for DMCs and agencies',
    sectionId: 'partnership',
    dataSectionName: 'partnership',
  },
  heading: 'A Partner, Not Just a Vendor',
  subheading:
    'JHR Photography was built by someone who understands operational pressure. Jayson\u2019s background in military logistics translates directly to event execution\u2014meticulous planning, redundant systems, and calm under pressure.',
  columns: 2,
  features: [
    {
      id: 'partnership-card-0',
      icon: 'CheckCircle',
      title: 'Consistent, repeatable execution across events',
      description: 'Same quality, same professionalism, every time you recommend us.',
    },
    {
      id: 'partnership-card-1',
      icon: 'CheckCircle',
      title: 'Professional appearance and conduct at all times',
      description: 'We show up in uniform, on time, and prepared for anything.',
    },
    {
      id: 'partnership-card-2',
      icon: 'CheckCircle',
      title: 'Complete paperwork compliance without reminders',
      description: 'EAC forms, insurance certs, and venue requirements handled proactively.',
    },
    {
      id: 'partnership-card-3',
      icon: 'CheckCircle',
      title: 'Flexible response to changing requirements',
      description: 'We adapt to shifting needs without drama or excuses.',
    },
    {
      id: 'partnership-card-4',
      icon: 'CheckCircle',
      title: 'Clear communication before, during, and after events',
      description: 'You always know what\u2019s happening and what to expect.',
    },
    {
      id: 'partnership-card-5',
      icon: 'CheckCircle',
      title: 'Delivery timelines you can count on',
      description: 'Same-day highlights and full galleries delivered on schedule.',
    },
  ],
};

/**
 * Section 3: Services for Your Clients
 * Maps to: 4 service cards with links in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const DMC_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Photography services for DMC and agency clients',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Services for Your Clients',
  subheading: 'Outcome-based media systems that deliver measurable results.',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Camera',
      title: 'Corporate Event Coverage',
      description:
        'Comprehensive documentation of conferences, trade shows, and corporate events. Same-day highlights available.',
      link: { text: 'Learn more', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-card-1',
      icon: 'Users',
      title: 'Headshot Activation',
      description:
        'High-volume professional headshots with instant delivery. Drive booth traffic and capture leads for your clients.',
      link: { text: 'Learn more', href: '/services/headshot-activation' },
    },
    {
      id: 'services-card-2',
      icon: 'Video',
      title: 'Event Video Systems',
      description:
        'Keynote capture, highlight reels, and testimonials that extend event ROI long after the venue clears.',
      link: { text: 'Learn more', href: '/services/event-video-systems' },
    },
    {
      id: 'services-card-3',
      icon: 'Building',
      title: 'Nashville Venue Expertise',
      description:
        'We know Music City Center, Gaylord Opryland, and every major venue. Our local knowledge reduces your logistics burden.',
      link: { text: 'View venues', href: '/venues' },
    },
  ],
};

/**
 * Section 4: FAQs
 * Component: EditableFAQ
 */
export const DMC_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 4,
  seo: {
    ariaLabel: 'Frequently asked questions about photography services for DMCs and agencies',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Common Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How do you handle EAC requirements?',
      answer:
        'We\u2019re experienced with Nashville\u2019s major venues and understand EAC (Exhibitor Appointed Contractor) processes completely. We handle our own paperwork, carry appropriate insurance, and coordinate directly with venue contacts as needed.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you work on tight timelines?',
      answer:
        'Yes. We understand that DMCs often receive final requirements close to event dates. We can typically accommodate last-minute additions or changes as long as we have clear communication about priorities.',
    },
    {
      id: 'faqs-item-2',
      question: 'Do you have experience with high-profile corporate clients?',
      answer:
        'Yes. We\u2019ve worked with DMCs supporting Fortune 500 companies, national associations, and high-stakes corporate events. We understand discretion, professionalism, and the stakes involved.',
    },
    {
      id: 'faqs-item-3',
      question: 'How do you handle communication during events?',
      answer:
        'We establish clear communication protocols before the event. You\u2019ll have direct contact with our lead photographer, and we provide updates as needed throughout the event without requiring constant oversight.',
    },
  ],
};

/**
 * Section 5: Final CTA
 * Component: EditableCTA (gradient background)
 */
export const DMC_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Schedule a strategy call for DMC and agency photography needs',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss Your Upcoming Events',
  subtext:
    'Schedule a call and we\u2019ll talk through your client\u2019s needs. No pressure\u2014just a conversation to see if we\u2019re a good fit for your preferred vendor list.',
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a2e 100%)',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const DMC_SECTIONS: PageSectionContent[] = [
  DMC_HERO,
  DMC_PAIN_POINTS,
  DMC_PARTNERSHIP,
  DMC_SERVICES,
  DMC_FAQS,
  DMC_FINAL_CTA,
];

export const DMCS_AGENCIES_PAGE_SCHEMA: PageSchema = {
  slug: 'dmcs-agencies',
  name: 'DMCs & Agencies',
  seo: {
    pageTitle: 'DMCs & Agencies | JHR Photography',
    metaDescription:
      'Reliable event photography for DMCs and agencies in Nashville. EAC-compliant, professionally executed, and consistently delivered.',
    ogImage: '/images/generated/solution-dmcs.jpg',
    ogTitle: 'Photography for DMCs & Agencies - JHR Photography',
    ogDescription:
      'Your reputation depends on your vendors. JHR operates as an extension of your team\u2014professional, prepared, and consistent.',
  },
  sections: DMC_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getDMCSectionById(sectionId: string): PageSectionContent | undefined {
  return DMC_SECTIONS.find((s) => s.id === sectionId);
}

export function getDMCContentKeyPrefix(sectionId: string): string {
  return `dmcs-agencies:${sectionId}`;
}
