/**
 * Exhibitors & Sponsors Solution Page Content Schema
 *
 * Defines the editable structure for the Exhibitors & Sponsors solution page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/solutions/exhibitors-sponsors/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | exhibitors-sponsors:hero
 * 1          | The Trade Show Challenge      | EditableFeatureGrid       | exhibitors-sponsors:challenges
 * 2          | The Headshot Advantage         | EditableFeatureGrid       | exhibitors-sponsors:advantage
 * 3          | How It Works                  | EditableFeatureGrid       | exhibitors-sponsors:process
 * 4          | Real Results                  | EditableFeatureGrid       | exhibitors-sponsors:results
 * 5          | FAQs                          | EditableFAQ               | exhibitors-sponsors:faqs
 * 6          | Final CTA                     | EditableCTA               | exhibitors-sponsors:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: exhibitors-sponsors:{sectionId}:{elementId}
 *
 * NOTE: The "Headshot Advantage" section is a 2-column text + checklist layout on the page.
 * Mapped to a feature-grid with CheckCircle icons for editability.
 * The "Real Results" section shows stat cards — mapped as feature-grid items.
 * The ROI Calculator is an interactive component not representable as a schema section.
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
export const EXSP_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Exhibitor and sponsor photography solutions by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Stop Hoping for Booth Traffic',
  subtitle: 'For Exhibitors & Sponsors',
  description:
    'You\u2019ve spent thousands on booth space. You\u2019ve got great products and a sharp team. But half the conference is walking right by. What if you had something everyone at the show actually wanted?',
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
    { text: 'Learn About Headshot Activation', href: '/services/headshot-activation', variant: 'secondary' },
  ],
};

/**
 * Section 1: The Trade Show Challenge
 * Maps to: 4 challenge cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const EXSP_CHALLENGES: FeatureGridSectionContent = {
  id: 'challenges',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Common trade show challenges for exhibitors and sponsors',
    sectionId: 'challenges',
    dataSectionName: 'challenges',
  },
  heading: 'The Trade Show Challenge',
  subheading:
    'You\u2019re competing for attention with hundreds of other exhibitors. Most booths blend together in attendees\u2019 minds.',
  columns: 2,
  features: [
    {
      id: 'challenges-card-0',
      icon: 'Users',
      title: 'Empty Booth Syndrome',
      description:
        'You invested thousands in booth space and setup. Now you\u2019re watching attendees walk by while your team stands waiting.',
    },
    {
      id: 'challenges-card-1',
      icon: 'Database',
      title: 'Badge Scans Aren\u2019t Leads',
      description:
        'A badge scan tells you someone stopped. It doesn\u2019t tell you they\u2019re interested, qualified, or likely to respond.',
    },
    {
      id: 'challenges-card-2',
      icon: 'TrendingUp',
      title: 'Proving Event ROI',
      description:
        'Leadership wants metrics. You need more than foot traffic\u2014you need data that connects to pipeline.',
    },
    {
      id: 'challenges-card-3',
      icon: 'Share2',
      title: 'Content That Disappears',
      description:
        'Generic giveaways end up in trash cans. Your brand investment leaves no lasting impression.',
    },
  ],
};

/**
 * Section 2: The Headshot Advantage
 * Maps to: 2-column text + checklist layout on page
 * Component: EditableFeatureGrid (2 columns, CheckCircle icons)
 */
export const EXSP_ADVANTAGE: FeatureGridSectionContent = {
  id: 'advantage',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'The headshot advantage for exhibitor booth traffic',
    sectionId: 'advantage',
    dataSectionName: 'advantage',
  },
  heading: 'The Headshot Advantage',
  subheading:
    'A professional headshot is something everyone at the conference actually needs. Not a stress ball that ends up in a drawer\u2014a real professional asset they\u2019ll use on LinkedIn, their company website, and more.',
  columns: 2,
  features: [
    {
      id: 'advantage-card-0',
      icon: 'CheckCircle',
      title: 'Consistent booth traffic throughout the event',
      description: 'Attendees actively seek out booths offering headshots.',
    },
    {
      id: 'advantage-card-1',
      icon: 'CheckCircle',
      title: 'Qualified leads with captured contact data',
      description: 'Every headshot recipient provides name, email, phone, and company.',
    },
    {
      id: 'advantage-card-2',
      icon: 'CheckCircle',
      title: 'Instant delivery that delights attendees',
      description: 'AI-retouched, branded images sent before they leave your booth.',
    },
    {
      id: 'advantage-card-3',
      icon: 'CheckCircle',
      title: 'Shareable content that extends brand reach',
      description: 'When attendees share their headshot on LinkedIn, your brand travels with it.',
    },
    {
      id: 'advantage-card-4',
      icon: 'CheckCircle',
      title: 'Real-time data feed to your sales team',
      description: 'Contact information flows to your CRM as attendees check in.',
    },
    {
      id: 'advantage-card-5',
      icon: 'CheckCircle',
      title: 'A booth experience people talk about',
      description: 'Word of mouth drives additional traffic throughout the event.',
    },
  ],
};

/**
 * Section 3: How It Works
 * Maps to: 4-step process in 4-column grid
 * Component: EditableFeatureGrid (4 columns)
 * NOTE: On the page, steps display with numbered badges (01, 02, etc.)
 * Schema maps them as feature-grid items with sequential icons.
 */
export const EXSP_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How headshot activation works for exhibitors',
    sectionId: 'process',
    dataSectionName: 'process',
  },
  heading: 'How It Works',
  subheading: 'A streamlined process designed for high-volume trade shows.',
  columns: 4,
  features: [
    {
      id: 'process-card-0',
      icon: 'UserPlus',
      title: 'Attendee Arrives',
      description:
        'Attracted by signage or word of mouth, attendees approach your booth.',
    },
    {
      id: 'process-card-1',
      icon: 'ClipboardCheck',
      title: 'Check-In',
      description:
        'Quick registration captures contact info. Data flows to your CRM in real-time.',
    },
    {
      id: 'process-card-2',
      icon: 'Camera',
      title: 'Photo Session',
      description:
        'Professional headshot captured in under 2 minutes. Multiple poses, their choice.',
    },
    {
      id: 'process-card-3',
      icon: 'Send',
      title: 'Instant Delivery',
      description:
        'AI-retouched, branded image sent to their phone before they leave.',
    },
  ],
};

/**
 * Section 4: Real Results
 * Maps to: 3 stat cards on page
 * Component: EditableFeatureGrid (3 columns)
 * NOTE: On the page these render as large stat numbers with labels.
 * Schema maps them as feature-grid items for editability.
 */
export const EXSP_RESULTS: FeatureGridSectionContent = {
  id: 'results',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Real results from headshot activations for exhibitors',
    sectionId: 'results',
    dataSectionName: 'results',
  },
  heading: 'Real Results',
  subheading: 'What our exhibitor clients have experienced.',
  columns: 3,
  features: [
    {
      id: 'results-card-0',
      icon: 'Users',
      title: '300+',
      description: 'Booth visits per day',
    },
    {
      id: 'results-card-1',
      icon: 'Target',
      title: '100%',
      description: 'Contact capture rate',
    },
    {
      id: 'results-card-2',
      icon: 'Zap',
      title: 'Minutes',
      description: 'From photo to delivery',
    },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const EXSP_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about headshot activation for exhibitors',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Common Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How does this drive booth traffic?',
      answer:
        'Professional headshots are universally valuable\u2014everyone needs one for LinkedIn, company profiles, or speaking submissions. Attendees actively seek out booths offering headshots because they want what you\u2019re giving, not just a chance to spin a wheel.',
    },
    {
      id: 'faqs-item-1',
      question: 'What data do we get from attendees?',
      answer:
        'At check-in, we capture name, email, phone, and company. Fields are customizable\u2014you can add job title, specific interests, or qualification questions. Data flows to you in real-time during the event.',
    },
    {
      id: 'faqs-item-2',
      question: 'How quickly do attendees receive their photos?',
      answer:
        'Within minutes. Attendees receive their AI-retouched, branded headshot via text or email before they leave your booth. This instant gratification creates a memorable positive experience associated with your brand.',
    },
    {
      id: 'faqs-item-3',
      question: 'Can the photos be branded with our company?',
      answer:
        'Absolutely. We apply your logo, brand colors, and messaging to every image. When attendees share their new headshot on LinkedIn, your brand travels with it.',
    },
    {
      id: 'faqs-item-4',
      question: 'How many people can you photograph in a day?',
      answer:
        'Our standard setup handles 300+ attendees per day. For high-traffic trade shows, we can scale to 500+ with premium configuration and additional staff.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (gradient background)
 */
export const EXSP_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call for exhibitor headshot activation',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Ready to Stand Out at Your Next Event?',
  subtext:
    'Let\u2019s discuss your trade show or sponsorship activation. We\u2019ll help you understand how Headshot Activation can drive traffic and generate leads for your brand.',
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a2e 100%)',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const EXSP_SECTIONS: PageSectionContent[] = [
  EXSP_HERO,
  EXSP_CHALLENGES,
  EXSP_ADVANTAGE,
  EXSP_PROCESS,
  EXSP_RESULTS,
  EXSP_FAQS,
  EXSP_FINAL_CTA,
];

export const EXHIBITORS_SPONSORS_PAGE_SCHEMA: PageSchema = {
  slug: 'exhibitors-sponsors',
  name: 'Exhibitors & Sponsors',
  seo: {
    pageTitle: 'Exhibitors & Sponsors | JHR Photography',
    metaDescription:
      'Drive booth traffic and capture qualified leads with Headshot Activation. Professional headshots as a trade show engagement strategy.',
    ogImage: '/images/generated/solution-exhibitors.jpg',
    ogTitle: 'Exhibitor & Sponsor Booth Activation - JHR Photography',
    ogDescription:
      'Stop hoping for booth traffic. Headshot Activation drives consistent visitors and captures qualified leads at your trade show booth.',
  },
  sections: EXSP_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getEXSPSectionById(sectionId: string): PageSectionContent | undefined {
  return EXSP_SECTIONS.find((s) => s.id === sectionId);
}

export function getEXSPContentKeyPrefix(sectionId: string): string {
  return `exhibitors-sponsors:${sectionId}`;
}
