/**
 * Schedule Page Content Schema
 *
 * Defines the editable structure for the JHR Photography schedule/booking page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/schedule/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Schedule Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | schedule:hero
 * 1          | What to Expect                 | EditableFeatureGrid       | schedule:what-to-expect
 * 2          | What We'll Cover               | EditableFeatureGrid       | schedule:topics
 * 3          | Questions About the Call        | EditableFAQ               | schedule:faqs
 *
 * Note: The calendar embed/widget is an interactive component placeholder
 * that is not representable as a schema section. Only surrounding text is editable.
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: schedule:{sectionId}:{elementId}
 *
 * Examples:
 *   schedule:hero:title                 - Hero headline text
 *   schedule:hero:subtitle              - Hero subtitle text
 *   schedule:what-to-expect:heading     - What to expect section heading
 *   schedule:what-to-expect:features    - Expect items (JSON array)
 *   schedule:topics:heading             - Topics section heading
 *   schedule:topics:features            - Topic items (JSON array)
 *   schedule:faqs:heading               - FAQ section heading
 *   schedule:faqs:items                 - FAQ items (JSON array)
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  FAQSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/schedule/page.tsx
 * Component: EditableHero
 */
export const SCHEDULE_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Schedule a strategy call with JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Schedule a Strategy Call',
  subtitle: 'Let\'s Connect',
  description:
    'Book a 15-minute call with Jayson to discuss your event. We\'ll talk through your venue, timeline, and goals\u2014no pressure, no hard sell. Just a conversation to see if we\'re a good fit.',
  backgroundImage: {
    src: '/images/generated/hero-services.jpg',
    alt: 'Professional event photography',
  },
  buttons: [],
};

/**
 * Section 1: What to Expect
 * Maps to: "What to Expect" section in /app/schedule/page.tsx
 * Component: EditableFeatureGrid (3 columns)
 *
 * Three items describing the call format: duration, medium, and scheduling flexibility.
 */
export const SCHEDULE_WHAT_TO_EXPECT: FeatureGridSectionContent = {
  id: 'what-to-expect',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'What to expect from a strategy call with JHR Photography',
    sectionId: 'what-to-expect',
    dataSectionName: 'what-to-expect',
  },
  heading: 'What to Expect',
  subheading:
    'This is a discovery conversation, not a sales call. We\'ll discuss your event and see if there\'s a fit. If JHR isn\'t right for what you need, we\'ll tell you\u2014and potentially point you toward someone who is.',
  columns: 3,
  features: [
    {
      id: 'what-to-expect-card-0',
      icon: 'Clock',
      title: '15 minutes',
      description: 'Quick and focused\u2014we respect your time',
    },
    {
      id: 'what-to-expect-card-1',
      icon: 'Video',
      title: 'Video or Phone',
      description: 'Your choice of Zoom, Google Meet, or phone call',
    },
    {
      id: 'what-to-expect-card-2',
      icon: 'Calendar',
      title: 'Flexible Scheduling',
      description: 'Available weekdays and some evenings',
    },
  ],
};

/**
 * Section 2: What We'll Cover
 * Maps to: "What We'll Cover" checklist in /app/schedule/page.tsx
 * Component: EditableFeatureGrid (2 columns)
 *
 * Four checklist items mapped as feature grid cards with CheckCircle icons.
 */
export const SCHEDULE_TOPICS: FeatureGridSectionContent = {
  id: 'topics',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Topics covered during the strategy call',
    sectionId: 'topics',
    dataSectionName: 'topics',
  },
  heading: 'What We\'ll Cover',
  columns: 2,
  features: [
    {
      id: 'topics-card-0',
      icon: 'CheckCircle',
      title: 'Your event type and venue',
      description: 'Understanding the logistics and venue requirements for your event.',
    },
    {
      id: 'topics-card-1',
      icon: 'CheckCircle',
      title: 'Specific goals and outcomes you need',
      description: 'Aligning our services with what you want to achieve.',
    },
    {
      id: 'topics-card-2',
      icon: 'CheckCircle',
      title: 'Timeline and logistics considerations',
      description: 'Planning the operational details for seamless execution.',
    },
    {
      id: 'topics-card-3',
      icon: 'CheckCircle',
      title: 'How JHR can help (or if we\'re not the right fit)',
      description: 'Honest assessment of whether our services match your needs.',
    },
  ],
};

/**
 * Section 3: Questions About the Call
 * Maps to: FAQ section in /app/schedule/page.tsx
 * Component: EditableFAQ
 */
export const SCHEDULE_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 3,
  seo: {
    ariaLabel: 'Questions about scheduling a strategy call',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Questions About the Call?',
  items: [
    {
      id: 'faqs-faq-0',
      question: 'Is this a sales call?',
      answer:
        'No. This is a discovery conversation. We\'ll talk about your event and see if there\'s a fit. If JHR isn\'t right for what you need, we\'ll tell you\u2014and potentially point you toward someone who is.',
    },
    {
      id: 'faqs-faq-1',
      question: 'Will I get a quote on the call?',
      answer:
        'We don\'t do ballpark pricing on calls. After we understand your event fully, we\'ll send a detailed proposal that addresses your specific needs. This ensures you get accurate information, not guesswork.',
    },
    {
      id: 'faqs-faq-2',
      question: 'What if I need to reschedule?',
      answer:
        'No problem. You\'ll receive a confirmation email with a link to reschedule or cancel. We understand plans change\u2014just give us reasonable notice if you can.',
    },
  ],
};

// ============================================================================
// Complete Schedule Page Schema
// ============================================================================

export const SCHEDULE_SECTIONS: PageSectionContent[] = [
  SCHEDULE_HERO,
  SCHEDULE_WHAT_TO_EXPECT,
  SCHEDULE_TOPICS,
  SCHEDULE_FAQS,
];

export const SCHEDULE_PAGE_SCHEMA: PageSchema = {
  slug: 'schedule',
  name: 'Schedule',
  seo: {
    pageTitle: 'Schedule a Strategy Call | JHR Photography Nashville',
    metaDescription:
      'Book a free 15-minute strategy call with JHR Photography. Discuss your Nashville event, venue, and goals. No pressure, no hard sell.',
    ogImage: '/images/generated/hero-services.jpg',
    ogTitle: 'Schedule a Strategy Call - JHR Photography',
    ogDescription:
      'Book a 15-minute call to discuss your corporate event photography needs in Nashville. Free consultation with Jayson Rivas.',
  },
  sections: SCHEDULE_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getScheduleSectionById(sectionId: string): PageSectionContent | undefined {
  return SCHEDULE_SECTIONS.find((s) => s.id === sectionId);
}

export function getScheduleContentKeyPrefix(sectionId: string): string {
  return `schedule:${sectionId}`;
}
