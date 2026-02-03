/**
 * Corporate Headshot Program Service Page Content Schema
 *
 * Defines the editable structure for the Corporate Headshot Program service page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/corporate-headshot-program/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | corporate-headshot-program:hero
 * 1          | Problem / Solution            | EditableFeatureGrid       | corporate-headshot-program:problem-solution
 * 2          | Benefits Grid (How It Works)  | EditableFeatureGrid       | corporate-headshot-program:benefits
 * 3          | The Process                   | EditableFeatureGrid       | corporate-headshot-program:process
 * 4          | Sample Gallery                | EditableImageGallery      | corporate-headshot-program:gallery
 * 5          | FAQs                          | EditableFAQ               | corporate-headshot-program:faqs
 * 6          | Final CTA                     | EditableCTA               | corporate-headshot-program:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: corporate-headshot-program:{sectionId}:{elementId}
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
export const CHP_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Corporate headshot program service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Professional Headshots for Your Entire Team',
  subtitle: 'Corporate Headshot Program\u2122',
  description:
    'Outdated headshots undermine credibility. Inconsistent photos fragment your brand. We bring a professional studio to your office and deliver consistent, polished headshots that represent your organization at its best.',
  backgroundImage: {
    src: '/images/generated/service-corporate-headshots.jpg',
    alt: 'Corporate headshot session in office',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: Problem / Solution
 * Maps to: Left text + right outcomes checklist
 * Component: EditableFeatureGrid (used for the outcomes checklist)
 */
export const CHP_PROBLEM_SOLUTION: FeatureGridSectionContent = {
  id: 'problem-solution',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'The problem with DIY headshots and our solution',
    sectionId: 'problem-solution',
    dataSectionName: 'problem-solution',
  },
  heading: 'The Problem with DIY Headshots',
  subheading:
    'Half your team has photos from 2018. Some used their phone camera. Others cropped vacation photos. First impressions matter\u2014inconsistent headshots signal disorganization.',
  columns: 2,
  features: [
    {
      id: 'problem-solution-card-0',
      icon: 'CheckCircle',
      title: 'Unified Professional Image',
      description: 'Unified professional image across all platforms.',
    },
    {
      id: 'problem-solution-card-1',
      icon: 'CheckCircle',
      title: 'Updated Headshots',
      description: 'Updated headshots for website, LinkedIn, and internal directories.',
    },
    {
      id: 'problem-solution-card-2',
      icon: 'CheckCircle',
      title: 'Consistent Brand Representation',
      description: 'Consistent brand representation at scale.',
    },
    {
      id: 'problem-solution-card-3',
      icon: 'CheckCircle',
      title: 'Minimal Disruption',
      description: 'Minimal disruption to daily operations with quick turnaround.',
    },
  ],
};

/**
 * Section 2: Benefits Grid (How It Works)
 * Maps to: 2x2 benefit cards with icons
 * Component: EditableFeatureGrid (2 columns)
 */
export const CHP_BENEFITS: FeatureGridSectionContent = {
  id: 'benefits',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'How the corporate headshot program works',
    sectionId: 'benefits',
    dataSectionName: 'benefits',
  },
  heading: 'How It Works',
  subheading: 'A turnkey solution designed for busy organizations.',
  columns: 2,
  features: [
    {
      id: 'benefits-card-0',
      icon: 'Building2',
      title: 'On-Site Convenience',
      description:
        'We come to you. Our mobile studio sets up in your office, minimizing disruption and maximizing participation.',
    },
    {
      id: 'benefits-card-1',
      icon: 'Users',
      title: 'Scalable for Any Team',
      description:
        'From executive teams of 10 to organizations of 500+. Same quality, same consistency, regardless of size.',
    },
    {
      id: 'benefits-card-2',
      icon: 'Calendar',
      title: 'Flexible Scheduling',
      description:
        'Half-day, full-day, or multi-day sessions based on your team size. We work around your operational needs.',
    },
    {
      id: 'benefits-card-3',
      icon: 'ImageIcon',
      title: 'Consistent Brand Standards',
      description:
        'Every headshot matches your brand guidelines\u2014same lighting, same background, same professional look across your entire organization.',
    },
  ],
};

/**
 * Section 3: The Process
 * Maps to: 4-step timeline
 * Component: EditableFeatureGrid (4 columns)
 */
export const CHP_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Corporate headshot program process steps',
    sectionId: 'process',
    dataSectionName: 'process',
  },
  heading: 'The Process',
  columns: 4,
  features: [
    {
      id: 'process-card-0',
      icon: 'Search',
      title: 'Discovery & Planning',
      description:
        'We discuss your team size, brand guidelines, and scheduling needs. We\u2019ll create a detailed plan that minimizes disruption.',
    },
    {
      id: 'process-card-1',
      icon: 'Calendar',
      title: 'Schedule Coordination',
      description:
        'We work with your team to create a session schedule. Each person books a convenient time slot\u2014no chaos, no confusion.',
    },
    {
      id: 'process-card-2',
      icon: 'Camera',
      title: 'On-Site Sessions',
      description:
        'We set up our mobile studio in your space. Team members cycle through for their sessions\u2014quick, professional, and painless.',
    },
    {
      id: 'process-card-3',
      icon: 'Send',
      title: 'Editing & Delivery',
      description:
        'Professional editing ensures every photo meets your brand standards. Delivered in all formats you need within 5-7 days.',
    },
  ],
};

/**
 * Section 4: Sample Gallery (Consistent Quality at Scale)
 * Maps to: 8-image headshot grid
 * Component: EditableImageGallery (grid layout)
 */
export const CHP_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 4,
  seo: {
    ariaLabel: 'Sample corporate headshots showing consistent quality',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Consistent Quality at Scale',
  layout: 'grid',
  images: [
    { src: '/images/generated/gallery-headshot-1.jpg', alt: 'Professional corporate headshot 1' },
    { src: '/images/generated/gallery-headshot-2.jpg', alt: 'Professional corporate headshot 2' },
    { src: '/images/generated/gallery-headshot-3.jpg', alt: 'Professional corporate headshot 3' },
    { src: '/images/generated/gallery-headshot-1.jpg', alt: 'Professional corporate headshot 4' },
    { src: '/images/generated/gallery-headshot-2.jpg', alt: 'Professional corporate headshot 5' },
    { src: '/images/generated/gallery-headshot-3.jpg', alt: 'Professional corporate headshot 6' },
    { src: '/images/generated/gallery-headshot-1.jpg', alt: 'Professional corporate headshot 7' },
    { src: '/images/generated/gallery-headshot-2.jpg', alt: 'Professional corporate headshot 8' },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const CHP_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about corporate headshot programs',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How long does each session take per person?',
      answer:
        'Each individual session takes approximately 10-15 minutes, including setup, multiple poses, and on-screen selection. We schedule in slots to keep things moving smoothly without rushing anyone.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you match our existing brand guidelines?',
      answer:
        'Absolutely. Before the session, we\u2019ll review your brand standards\u2014preferred backgrounds, lighting style, and any specific requirements. Every headshot will align with your established look.',
    },
    {
      id: 'faqs-item-2',
      question: 'What if some team members can\u2019t make the scheduled day?',
      answer:
        'We plan for this. We can schedule makeup sessions, and our consistent setup means additional photos will match perfectly with the original batch.',
    },
    {
      id: 'faqs-item-3',
      question: 'How quickly do we receive the final images?',
      answer:
        'Edited headshots are typically delivered within 5-7 business days. For larger organizations or rush needs, we can discuss expedited timelines.',
    },
    {
      id: 'faqs-item-4',
      question: 'What space do you need for the setup?',
      answer:
        'A room or area approximately 15x15 feet works well. We bring all equipment\u2014lights, backdrop, and everything else. You just provide the space and the people.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const CHP_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call for corporate headshot program',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Ready to Update Your Team\u2019s Image?',
  subtext:
    'Let\u2019s discuss your organization\u2019s needs. We\u2019ll create a custom plan that fits your schedule and delivers consistent, professional results.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/venue-conference-room.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const CHP_SECTIONS: PageSectionContent[] = [
  CHP_HERO,
  CHP_PROBLEM_SOLUTION,
  CHP_BENEFITS,
  CHP_PROCESS,
  CHP_GALLERY,
  CHP_FAQS,
  CHP_FINAL_CTA,
];

export const CORPORATE_HEADSHOT_PROGRAM_PAGE_SCHEMA: PageSchema = {
  slug: 'corporate-headshot-program',
  name: 'Corporate Headshot Program',
  seo: {
    pageTitle: 'Corporate Headshot Program | JHR Photography',
    metaDescription:
      'On-site corporate headshot photography for teams of any size in Nashville. Consistent, brand-aligned headshots with minimal disruption to your operations.',
    ogImage: '/images/generated/service-corporate-headshots.jpg',
    ogTitle: 'Corporate Headshot Program\u2122 - JHR Photography',
    ogDescription:
      'Professional headshots for your entire team. We bring the studio to your office and deliver consistent, polished results.',
  },
  sections: CHP_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getCHPSectionById(sectionId: string): PageSectionContent | undefined {
  return CHP_SECTIONS.find((s) => s.id === sectionId);
}

export function getCHPContentKeyPrefix(sectionId: string): string {
  return `corporate-headshot-program:${sectionId}`;
}
