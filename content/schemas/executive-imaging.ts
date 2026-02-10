/**
 * Executive Imaging Service Page Content Schema
 *
 * Defines the editable structure for the Executive Imaging service page.
 * Maps each section to an editable component type with default content.
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | executive-imaging:hero
 * 1          | Problem (DIY Headshots)        | EditableFeatureGrid       | executive-imaging:problem
 * 2          | Solution (Professional)        | EditableFeatureGrid       | executive-imaging:solution
 * 3          | Two Tiers                      | EditableFeatureGrid       | executive-imaging:two-tiers
 * 4          | Event Pairing CTA              | EditableCTA               | executive-imaging:event-pairing
 * 5          | Headshot Styles                | EditableFeatureGrid       | executive-imaging:headshot-styles
 * 6          | Social Proof (Testimonials)    | EditableTestimonials      | executive-imaging:social-proof
 * 7          | FAQs                           | EditableFAQ               | executive-imaging:faqs
 * 8          | Final CTA                      | EditableCTA               | executive-imaging:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: executive-imaging:{sectionId}:{elementId}
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
export const EI_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Executive imaging service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Your Leadership Team, Represented the Right Way',
  subtitle: 'Executive Imaging\u2122',
  description:
    'Outdated headshots undermine credibility. Inconsistent photos fragment your brand. We bring professional imaging to your location \u2014 on your schedule, aligned to your brand standards, and delivered with the efficiency your team expects.',
  backgroundImage: {
    src: '/images/generated/service-corporate-headshots.jpg',
    alt: 'Executive imaging session for leadership team',
  },
  buttons: [
    { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Problem (The Problem with DIY Headshots)
 * Component: EditableFeatureGrid (3 columns)
 */
export const EI_PROBLEM: FeatureGridSectionContent = {
  id: 'problem',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'The problem with DIY headshots for executive teams',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'The Problem with DIY Headshots',
  subheading:
    'Half your team has photos from 2018. Some used their phone camera. Others cropped vacation photos. First impressions matter \u2014 inconsistent headshots signal disorganization.',
  columns: 3,
  features: [
    {
      id: 'problem-card-0',
      icon: 'AlertCircle',
      title: 'Inconsistent Brand Image',
      description:
        'Different backgrounds, lighting, and quality across your team\u2019s headshots creates a fragmented professional presence.',
    },
    {
      id: 'problem-card-1',
      icon: 'Clock',
      title: 'Time and Coordination Burden',
      description:
        'Sending team members to individual photo sessions means lost productivity and scheduling headaches.',
    },
    {
      id: 'problem-card-2',
      icon: 'Shield',
      title: 'Quality That Doesn\u2019t Match Your Brand',
      description:
        'DIY solutions and phone camera headshots don\u2019t represent the caliber of your organization or your people.',
    },
  ],
};

/**
 * Section 2: Solution (Professional Imaging, Simplified)
 * Component: EditableFeatureGrid (2 columns)
 */
export const EI_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Professional executive imaging solution simplified',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'Professional Imaging, Simplified',
  subheading:
    'We bring the setup, the direction, and the experience to you \u2014 so your team gets consistent, brand-aligned headshots without the production hassle.',
  columns: 2,
  features: [
    {
      id: 'solution-card-0',
      icon: 'Building2',
      title: 'On-Site Convenience',
      description:
        'We bring our complete studio setup to your location. Minimal disruption, maximum participation.',
    },
    {
      id: 'solution-card-1',
      icon: 'Users',
      title: 'Scalable for Any Team',
      description:
        'From executive teams of 5 to organizations of 50+. Same quality, same consistency, regardless of size.',
    },
    {
      id: 'solution-card-2',
      icon: 'Sparkles',
      title: 'AI-Enhanced Processing',
      description:
        'Professional retouching applied to every image. Consistent quality across your entire team.',
    },
    {
      id: 'solution-card-3',
      icon: 'Send',
      title: 'Fast, Organized Delivery',
      description:
        'Edited headshots delivered within 5-7 business days. All images formatted and ready for use across platforms.',
    },
  ],
};

/**
 * Section 3: Two Programs, One Standard of Quality
 * Component: EditableFeatureGrid (2 columns)
 */
export const EI_TWO_TIERS: FeatureGridSectionContent = {
  id: 'two-tiers',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Two executive imaging programs for teams of any size',
    sectionId: 'two-tiers',
    dataSectionName: 'two-tiers',
  },
  heading: 'Two Programs, One Standard of Quality',
  subheading:
    'Whether you need headshots for a small leadership team or an entire department, we have a program designed for your scale.',
  columns: 2,
  features: [
    {
      id: 'two-tiers-card-0',
      icon: 'UserCircle',
      title: 'Executive Imaging',
      description:
        'For teams of 1-15. Individual sessions with personalized direction, multiple poses, and on-screen selection. Includes Camera Ready Touchup Service\u2122.',
      link: { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105' },
    },
    {
      id: 'two-tiers-card-1',
      icon: 'Users',
      title: 'Executive Group Imaging Experience',
      description:
        'For groups of 16-50+. Streamlined group sessions with consistent brand standards across your entire team. Volume efficiency with individual quality.',
      link: { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105' },
    },
  ],
};

/**
 * Section 4: Event Pairing CTA
 * Component: EditableCTA (solid background)
 */
export const EI_EVENT_PAIRING: CTASectionContent = {
  id: 'event-pairing',
  type: 'cta',
  order: 4,
  seo: {
    ariaLabel: 'Pair executive imaging with your next corporate event',
    sectionId: 'event-pairing',
    dataSectionName: 'event-pairing',
  },
  headline: 'Pair Executive Imaging With Your Next Event',
  subtext:
    'Add headshot sessions to your conference or corporate event. Attendees get professional headshots, you get additional engagement and value \u2014 all handled by the same team already on-site.',
  backgroundType: 'solid',
  backgroundValue: '#1A1A1A',
  primaryButton: {
    text: 'See Event Coverage',
    href: '/services/corporate-event-coverage',
    variant: 'primary',
  },
};

/**
 * Section 5: Headshot Styles
 * Component: EditableFeatureGrid (3 columns)
 */
export const EI_HEADSHOT_STYLES: FeatureGridSectionContent = {
  id: 'headshot-styles',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'Executive headshot style options',
    sectionId: 'headshot-styles',
    dataSectionName: 'headshot-styles',
  },
  heading: 'Headshot Styles',
  subheading:
    'Choose the look that matches your brand. Every style delivered with consistent quality and professional retouching.',
  columns: 3,
  features: [
    {
      id: 'headshot-styles-card-0',
      icon: 'Camera',
      title: 'Classic Corporate',
      description:
        'Clean, professional look with solid background. The standard for corporate websites, LinkedIn profiles, and marketing materials.',
    },
    {
      id: 'headshot-styles-card-1',
      icon: 'Camera',
      title: 'Environmental Portrait',
      description:
        'Natural setting that shows personality while maintaining professionalism. Great for about pages and thought leadership content.',
    },
    {
      id: 'headshot-styles-card-2',
      icon: 'Camera',
      title: 'Studio Editorial',
      description:
        'Elevated, magazine-quality portraits for executive teams, board members, and leadership communications.',
    },
  ],
};

/**
 * Section 6: Social Proof (Testimonials)
 * Component: EditableTestimonials (grid layout)
 */
export const EI_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Client testimonials for executive imaging services',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Teams Trust JHR for Executive Imaging',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'We had 30 team members photographed in one afternoon. Everyone looks consistent and professional \u2014 exactly what we needed for the website refresh.',
      authorName: 'HR Director',
      authorTitle: 'Enterprise Organization',
    },
    {
      id: 'social-proof-1',
      quote:
        'The efficiency was remarkable. Each session took 10 minutes, and the results were better than any studio we\u2019ve used before.',
      authorName: 'Marketing Manager',
      authorTitle: 'Professional Services Firm',
    },
  ],
};

/**
 * Section 7: FAQs
 * Component: EditableFAQ
 */
export const EI_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 7,
  seo: {
    ariaLabel: 'Frequently asked questions about executive imaging',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How long does each session take per person?',
      answer:
        'Individual sessions take approximately 10-15 minutes, including multiple poses and on-screen selection. For group programs, we schedule in efficient time slots to keep things moving smoothly.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you match our existing brand guidelines?',
      answer:
        'Absolutely. Before the session, we\u2019ll review your brand standards \u2014 preferred backgrounds, lighting style, and any specific requirements. Every headshot will align with your established look.',
    },
    {
      id: 'faqs-item-2',
      question: 'What if some team members can\u2019t make the scheduled day?',
      answer:
        'We plan for this. We can schedule makeup sessions, and our consistent setup means additional photos will match perfectly with the original batch.',
    },
    {
      id: 'faqs-item-3',
      question: 'What\u2019s included in the Camera Ready Touchup Service?',
      answer:
        'Professional retouching applied to every image \u2014 skin smoothing, blemish removal, color correction, and lighting optimization. The goal is natural and polished, not artificially enhanced.',
    },
    {
      id: 'faqs-item-4',
      question: 'What space do you need for the setup?',
      answer:
        'A room or area approximately 15x15 feet works well. We bring all equipment \u2014 lights, backdrop, and everything else. You just provide the space and the people.',
    },
  ],
};

/**
 * Section 8: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const EI_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a consultation for executive imaging services',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Ready to Update Your Team\u2019s Image?',
  subtext:
    'Let\u2019s discuss your organization\u2019s needs. We\u2019ll create a custom plan that fits your schedule and delivers consistent, professional results.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/service-corporate-headshots.jpg',
  primaryButton: {
    text: 'Talk With Our Team',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const EI_SECTIONS: PageSectionContent[] = [
  EI_HERO,
  EI_PROBLEM,
  EI_SOLUTION,
  EI_TWO_TIERS,
  EI_EVENT_PAIRING,
  EI_HEADSHOT_STYLES,
  EI_SOCIAL_PROOF,
  EI_FAQS,
  EI_FINAL_CTA,
];

export const EXECUTIVE_IMAGING_PAGE_SCHEMA: PageSchema = {
  slug: 'executive-imaging',
  name: 'Executive Imaging',
  seo: {
    pageTitle: 'Executive Imaging | JHR Photography',
    metaDescription:
      'Professional executive headshots and group imaging in Nashville. On-site sessions, brand-aligned results, and AI-enhanced delivery for teams of any size.',
    ogImage: '/images/generated/service-corporate-headshots.jpg',
    ogTitle: 'Executive Imaging\u2122 - JHR Photography',
    ogDescription:
      'Professional executive headshots for your leadership team. On-site sessions, brand-aligned results, and AI-enhanced delivery.',
  },
  sections: EI_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getEISectionById(sectionId: string): PageSectionContent | undefined {
  return EI_SECTIONS.find((s) => s.id === sectionId);
}

export function getEIContentKeyPrefix(sectionId: string): string {
  return `executive-imaging:${sectionId}`;
}
