/**
 * Headshot Activation Service Page Content Schema
 *
 * Defines the editable structure for the Headshot Activation service page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/headshot-activation/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | headshot-activation:hero
 * 1          | Problem / Solution            | EditableFeatureGrid       | headshot-activation:problem-solution
 * 2          | How It Works                  | EditableFeatureGrid       | headshot-activation:how-it-works
 * 3          | Features (Built for Volume)   | EditableFeatureGrid       | headshot-activation:features
 * 4          | Professional Results Gallery  | EditableImageGallery      | headshot-activation:gallery
 * 5          | FAQs                          | EditableFAQ               | headshot-activation:faqs
 * 6          | Final CTA                     | EditableCTA               | headshot-activation:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: headshot-activation:{sectionId}:{elementId}
 *
 * Note: The ROI Calculator section is a custom interactive component and is
 * not represented in the schema. It remains a static component on the page.
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
export const HA_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Headshot activation service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Turn Your Booth Into the Must-Visit Destination',
  subtitle: 'Headshot Activation\u2122',
  description:
    'Professional headshots delivered in minutes. Drive traffic, capture leads, and give every attendee an instant professional asset they\u2019ll actually use. No gimmicks\u2014just genuine value that keeps your booth packed.',
  backgroundImage: {
    src: '/images/generated/service-headshot-activation.jpg',
    alt: 'Professional headshot activation at trade show',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
  ],
};

/**
 * Section 1: Problem / Solution
 * Maps to: Left problem text + right outcomes checklist
 * Component: EditableFeatureGrid (used for outcomes list)
 */
export const HA_PROBLEM_SOLUTION: FeatureGridSectionContent = {
  id: 'problem-solution',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'The problem with trade show giveaways and headshot activation solution',
    sectionId: 'problem-solution',
    dataSectionName: 'problem-solution',
  },
  heading: 'The Problem with Trade Show Giveaways',
  subheading:
    'Stress balls end up in trash cans. Branded pens disappear. A professional headshot is different\u2014it\u2019s immediately valuable. People actually need one.',
  columns: 2,
  features: [
    {
      id: 'problem-solution-card-0',
      icon: 'CheckCircle',
      title: 'Drive Booth Traffic',
      description: 'Drive consistent booth traffic throughout the event.',
    },
    {
      id: 'problem-solution-card-1',
      icon: 'CheckCircle',
      title: 'Generate Qualified Leads',
      description: 'Generate qualified leads with captured contact data.',
    },
    {
      id: 'problem-solution-card-2',
      icon: 'CheckCircle',
      title: 'Shareable Content',
      description: 'Create shareable content that promotes your brand.',
    },
    {
      id: 'problem-solution-card-3',
      icon: 'CheckCircle',
      title: 'Immediate Value',
      description: 'Provide immediate value to attendees and stand out from generic giveaways.',
    },
  ],
};

/**
 * Section 2: How It Works
 * Maps to: 4-step process in cards
 * Component: EditableFeatureGrid (4 columns)
 */
export const HA_HOW_IT_WORKS: FeatureGridSectionContent = {
  id: 'how-it-works',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'How headshot activation works step by step',
    sectionId: 'how-it-works',
    dataSectionName: 'how-it-works',
  },
  heading: 'How It Works',
  subheading: 'A streamlined process that keeps lines moving and attendees happy.',
  columns: 4,
  features: [
    {
      id: 'how-it-works-card-0',
      icon: 'ClipboardList',
      title: 'Check-In',
      description:
        'Attendee provides contact info at your branded station. Data flows to your CRM in real-time.',
    },
    {
      id: 'how-it-works-card-1',
      icon: 'Camera',
      title: 'Photography',
      description:
        'Quick, professional session with our photographer. Multiple poses captured in under 2 minutes.',
    },
    {
      id: 'how-it-works-card-2',
      icon: 'Monitor',
      title: 'Selection',
      description:
        'Attendee chooses their favorite image from the options on screen.',
    },
    {
      id: 'how-it-works-card-3',
      icon: 'Smartphone',
      title: 'Delivery',
      description:
        'AI-retouched, branded image delivered to their phone within minutes.',
    },
  ],
};

/**
 * Section 3: Features (Built for High-Volume Events)
 * Maps to: 2x2 feature cards with icons
 * Component: EditableFeatureGrid (2 columns)
 */
export const HA_FEATURES: FeatureGridSectionContent = {
  id: 'features',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Headshot activation features for high-volume events',
    sectionId: 'features',
    dataSectionName: 'features',
  },
  heading: 'Built for High-Volume Events',
  subheading: 'Every detail engineered for speed, quality, and reliability.',
  columns: 2,
  features: [
    {
      id: 'features-card-0',
      icon: 'Users',
      title: '300+ Attendees Per Day',
      description:
        'Our streamlined process handles high-volume events with ease. Each attendee spends approximately 5 minutes from check-in to delivery.',
    },
    {
      id: 'features-card-1',
      icon: 'Smartphone',
      title: 'Instant Delivery',
      description:
        'AI-retouched, branded images delivered directly to attendees\u2019 phones within minutes. No waiting, no follow-up required.',
    },
    {
      id: 'features-card-2',
      icon: 'Database',
      title: 'Real-Time Lead Capture',
      description:
        'Capture name, email, phone, and company at check-in. Your sales team gets warm leads during the event, not days later.',
    },
    {
      id: 'features-card-3',
      icon: 'Sparkles',
      title: 'AI-Enhanced Retouching',
      description:
        'Professional-grade retouching applied automatically. Every attendee leaves with a polished, usable headshot.',
    },
  ],
};

/**
 * Section 4: Professional Results Gallery
 * Maps to: 3-image headshot gallery
 * Component: EditableImageGallery (grid layout)
 */
export const HA_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 4,
  seo: {
    ariaLabel: 'Professional headshot activation results gallery',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Professional Results',
  layout: 'grid',
  images: [
    { src: '/images/generated/gallery-headshot-1.jpg', alt: 'Professional headshot example 1' },
    { src: '/images/generated/gallery-headshot-2.jpg', alt: 'Professional headshot example 2' },
    { src: '/images/generated/gallery-headshot-3.jpg', alt: 'Professional headshot example 3' },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const HA_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about headshot activations',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How many headshots can you do in a day?',
      answer:
        'Our standard setup handles 300+ attendees per day. For high-volume events, we can scale to 500+ with additional equipment and staff. We\u2019ll discuss your expected traffic and plan accordingly.',
    },
    {
      id: 'faqs-item-1',
      question: 'How quickly do attendees receive their photos?',
      answer:
        'Within minutes. Attendees receive their AI-retouched, branded images via text or email before they leave your booth. This instant gratification is key to the activation\u2019s success.',
    },
    {
      id: 'faqs-item-2',
      question: 'What data do you capture for lead generation?',
      answer:
        'At check-in, we capture name, email, phone number, and company (fields are customizable). This data is delivered to you in real-time via your preferred method\u2014spreadsheet, webhook, or direct CRM integration.',
    },
    {
      id: 'faqs-item-3',
      question: 'Can you add our branding to the photos?',
      answer:
        'Absolutely. We apply your logo, brand colors, and any required messaging to every image. Attendees share branded content, extending your reach beyond the event.',
    },
    {
      id: 'faqs-item-4',
      question: 'What equipment do you bring?',
      answer:
        'We bring everything: professional lighting, backdrop system, camera equipment, processing workstation, and all cables and backup gear. We operate self-sufficiently\u2014you just provide the space.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (image background variant)
 */
export const HA_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call for headshot activation',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Ready to Transform Your Next Event?',
  subtext:
    'Let\u2019s discuss your event, venue, and goals. We\u2019ll show you exactly how Headshot Activation can drive traffic and generate leads for your brand.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-keynote.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const HA_SECTIONS: PageSectionContent[] = [
  HA_HERO,
  HA_PROBLEM_SOLUTION,
  HA_HOW_IT_WORKS,
  HA_FEATURES,
  HA_GALLERY,
  HA_FAQS,
  HA_FINAL_CTA,
];

export const HEADSHOT_ACTIVATION_PAGE_SCHEMA: PageSchema = {
  slug: 'headshot-activation',
  name: 'Headshot Activation',
  seo: {
    pageTitle: 'Headshot Activation | JHR Photography',
    metaDescription:
      'Turn your trade show booth into a must-visit destination with professional headshot activations. 300+ attendees per day with real-time lead capture in Nashville.',
    ogImage: '/images/generated/service-headshot-activation.jpg',
    ogTitle: 'Headshot Activation\u2122 - JHR Photography',
    ogDescription:
      'Professional headshots delivered in minutes. Drive traffic, capture leads, and give attendees instant value at your next event.',
  },
  sections: HA_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getHASectionById(sectionId: string): PageSectionContent | undefined {
  return HA_SECTIONS.find((s) => s.id === sectionId);
}

export function getHAContentKeyPrefix(sectionId: string): string {
  return `headshot-activation:${sectionId}`;
}
