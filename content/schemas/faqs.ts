/**
 * FAQs Page Content Schema
 *
 * Defines the editable structure for the JHR Photography FAQs page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/faqs/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: FAQs Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | faqs:hero
 * 1          | General FAQs                   | EditableFAQ               | faqs:general
 * 2          | Headshot Activation FAQs        | EditableFAQ               | faqs:headshot-activation
 * 3          | Event Coverage FAQs             | EditableFAQ               | faqs:event-coverage
 * 4          | Logistics & Process FAQs        | EditableFAQ               | faqs:logistics
 * 5          | Pricing & Booking FAQs          | EditableFAQ               | faqs:pricing
 * 6          | Final CTA                      | EditableCTA               | faqs:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: faqs:{sectionId}:{elementId}
 *
 * Examples:
 *   faqs:hero:title              - Hero headline text
 *   faqs:general:heading         - General FAQ category heading
 *   faqs:general:items           - General FAQ items (JSON array)
 *   faqs:final-cta:headline      - Final CTA headline
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FAQSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/faqs/page.tsx
 * Component: EditableHero
 */
export const FAQS_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Frequently asked questions about JHR Photography services',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Frequently Asked Questions',
  subtitle: 'FAQs',
  description:
    'Answers to common questions about working with JHR Photography. Can\'t find what you\'re looking for? Schedule a call and we\'ll address your specific situation.',
  backgroundImage: {
    src: '/images/generated/event-networking.jpg',
    alt: 'Corporate event networking',
  },
  buttons: [],
};

/**
 * Section 1: General FAQs
 * Maps to: "General" category in /app/faqs/page.tsx
 * Component: EditableFAQ
 */
export const FAQS_GENERAL: FAQSectionContent = {
  id: 'general',
  type: 'faq',
  order: 1,
  seo: {
    ariaLabel: 'General frequently asked questions about JHR Photography',
    sectionId: 'general',
    dataSectionName: 'general',
  },
  heading: 'General',
  items: [
    {
      id: 'general-faq-0',
      question: 'What makes JHR different from other event photographers?',
      answer:
        'We operate as a logistics-first media partner, not just a creative service. Our background in high-stakes operations means we bring agency-grade planning, redundant equipment, and professional protocols to every event. We know Nashville\'s venues inside and out, and we communicate in the language of event professionals\u2014EAC forms, marshaling yards, load-in schedules.',
    },
    {
      id: 'general-faq-1',
      question: 'What areas do you serve?',
      answer:
        'We\'re based in Nashville and serve events throughout Middle Tennessee. For national conferences and trade shows, we work with clients flying in from across the country who need a reliable local partner. We\'ve supported events at Music City Center, Gaylord Opryland, and all major Nashville venues.',
    },
    {
      id: 'general-faq-2',
      question: 'How far in advance should I book?',
      answer:
        'For large conferences and trade shows, we recommend reaching out 2-3 months in advance to ensure availability and allow time for proper logistics planning. For smaller corporate events, 4-6 weeks is typically sufficient. That said, contact us even if you\'re on a tight timeline\u2014we may be able to accommodate.',
    },
  ],
};

/**
 * Section 2: Headshot Activation FAQs
 * Maps to: "Headshot Activation" category in /app/faqs/page.tsx
 * Component: EditableFAQ
 */
export const FAQS_HEADSHOT_ACTIVATION: FAQSectionContent = {
  id: 'headshot-activation',
  type: 'faq',
  order: 2,
  seo: {
    ariaLabel: 'Headshot activation service FAQs',
    sectionId: 'headshot-activation',
    dataSectionName: 'headshot-activation',
  },
  heading: 'Headshot Activation',
  items: [
    {
      id: 'headshot-activation-faq-0',
      question: 'How many attendees can you photograph in a day?',
      answer:
        'Our standard Headshot Activation setup can process 300+ attendees per day. For high-volume events, we can scale to 500+ with our premium configuration and additional staff. Each attendee spends approximately 5 minutes at the station, including check-in, photography, and image selection.',
    },
    {
      id: 'headshot-activation-faq-1',
      question: 'How quickly are photos delivered?',
      answer:
        'Attendees receive their AI-retouched, branded images within minutes of their session. The delivery is instant\u2014directly to their phone via text or email. This speed is critical for trade show environments where immediate gratification drives engagement and social sharing.',
    },
    {
      id: 'headshot-activation-faq-2',
      question: 'What data do you capture for lead generation?',
      answer:
        'At check-in, we capture the attendee\'s name, email, phone number, and company (customizable fields). This data is delivered to you in real-time, allowing your sales team to follow up with warm leads during or immediately after the event. All data is handled in compliance with privacy regulations.',
    },
  ],
};

/**
 * Section 3: Event Coverage FAQs
 * Maps to: "Event Coverage" category in /app/faqs/page.tsx
 * Component: EditableFAQ
 */
export const FAQS_EVENT_COVERAGE: FAQSectionContent = {
  id: 'event-coverage',
  type: 'faq',
  order: 3,
  seo: {
    ariaLabel: 'Event coverage service FAQs',
    sectionId: 'event-coverage',
    dataSectionName: 'event-coverage',
  },
  heading: 'Event Coverage',
  items: [
    {
      id: 'event-coverage-faq-0',
      question: 'Do you offer same-day delivery?',
      answer:
        'Yes. For event coverage, we offer same-day delivery of edited highlights\u2014typically 20-50 images selected and processed within hours of the event\'s conclusion. This is ideal for social media, press, and immediate marketing use. Full galleries are delivered within 5-7 business days.',
    },
    {
      id: 'event-coverage-faq-1',
      question: 'What\'s included in corporate event coverage?',
      answer:
        'Our coverage includes arrival/setup documentation, keynote and breakout session photography, candid networking moments, exhibitor and sponsor coverage, and VIP interactions. We work from a shot list aligned with your priorities and deliver images that tell the story of your event.',
    },
    {
      id: 'event-coverage-faq-2',
      question: 'Do you provide video services?',
      answer:
        'Yes. Our Event Video Systems service includes keynote capture, highlight reels, attendee testimonials, and social-ready clips. Video can be added to any photography package or booked independently.',
    },
  ],
};

/**
 * Section 4: Logistics & Process FAQs
 * Maps to: "Logistics & Process" category in /app/faqs/page.tsx
 * Component: EditableFAQ
 */
export const FAQS_LOGISTICS: FAQSectionContent = {
  id: 'logistics',
  type: 'faq',
  order: 4,
  seo: {
    ariaLabel: 'Logistics and process FAQs',
    sectionId: 'logistics',
    dataSectionName: 'logistics',
  },
  heading: 'Logistics & Process',
  items: [
    {
      id: 'logistics-faq-0',
      question: 'Are you familiar with venue-specific requirements?',
      answer:
        'Absolutely. We\'re well-versed in the operational requirements of Nashville\'s major venues. We handle EAC (Exhibitor Appointed Contractor) paperwork, understand marshaling yard procedures, carry appropriate insurance, and know the contact protocols for each property. This venue fluency eliminates friction for you.',
    },
    {
      id: 'logistics-faq-1',
      question: 'What happens if there\'s an equipment failure?',
      answer:
        'We bring backup equipment to every shoot\u2014cameras, lighting, batteries, memory cards. Our protocols assume something will fail and plan accordingly. In over a decade of events, we\'ve never missed a critical moment due to equipment issues.',
    },
    {
      id: 'logistics-faq-2',
      question: 'How do you handle multi-day events?',
      answer:
        'Multi-day events are our specialty. We establish consistent workflows, maintain the same team throughout (when possible), and deliver rolling galleries so you have usable content each day. Our stamina and consistency across 3-5 day conferences is what event planners appreciate most.',
    },
  ],
};

/**
 * Section 5: Pricing & Booking FAQs
 * Maps to: "Pricing & Booking" category in /app/faqs/page.tsx
 * Component: EditableFAQ
 */
export const FAQS_PRICING: FAQSectionContent = {
  id: 'pricing',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Pricing and booking FAQs',
    sectionId: 'pricing',
    dataSectionName: 'pricing',
  },
  heading: 'Pricing & Booking',
  items: [
    {
      id: 'pricing-faq-0',
      question: 'How does your pricing work?',
      answer:
        'We price based on outcomes, not hours. Each service (Headshot Activation, Event Coverage, etc.) is a productized offering with clear deliverables. After our strategy call, we provide a detailed proposal specific to your event. We don\'t do ballpark pricing because every event is different.',
    },
    {
      id: 'pricing-faq-1',
      question: 'Do you require a deposit?',
      answer:
        'Yes. We require a 50% deposit to secure your date, with the balance due before the event. For large events with significant equipment and staffing commitments, we may adjust this structure. All terms are clearly outlined in our service agreement.',
    },
    {
      id: 'pricing-faq-2',
      question: 'What\'s your cancellation policy?',
      answer:
        'We understand plans change. Cancellations more than 30 days out receive a full refund of the deposit. Within 30 days, we work with you on rescheduling or partial credits. Force majeure situations are handled case-by-case with understanding that neither party benefits from impossible circumstances.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Maps to: Bottom CTA in /app/faqs/page.tsx
 * Component: EditableCTA (image background variant)
 */
export const FAQS_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Contact JHR Photography for additional questions',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Still Have Questions?',
  subtext:
    'Every event is unique. Schedule a strategy call and we\'ll address your specific situation, venue, and requirements.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-services.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Send Us a Message',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'secondary',
  },
};

// ============================================================================
// Complete FAQs Page Schema
// ============================================================================

export const FAQS_SECTIONS: PageSectionContent[] = [
  FAQS_HERO,
  FAQS_GENERAL,
  FAQS_HEADSHOT_ACTIVATION,
  FAQS_EVENT_COVERAGE,
  FAQS_LOGISTICS,
  FAQS_PRICING,
  FAQS_FINAL_CTA,
];

export const FAQS_PAGE_SCHEMA: PageSchema = {
  slug: 'faqs',
  name: 'FAQs',
  seo: {
    pageTitle: 'FAQs | JHR Photography - Nashville Event Photography Questions',
    metaDescription:
      'Answers to common questions about JHR Photography services, pricing, logistics, headshot activations, and event coverage in Nashville.',
    ogImage: '/images/generated/event-networking.jpg',
    ogTitle: 'Frequently Asked Questions - JHR Photography',
    ogDescription:
      'Find answers about corporate event photography, headshot activations, pricing, and logistics for Nashville events.',
  },
  sections: FAQS_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getFaqsSectionById(sectionId: string): PageSectionContent | undefined {
  return FAQS_SECTIONS.find((s) => s.id === sectionId);
}

export function getFaqsContentKeyPrefix(sectionId: string): string {
  return `faqs:${sectionId}`;
}
