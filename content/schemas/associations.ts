/**
 * Associations & Conferences Solution Page Content Schema
 *
 * Defines the editable structure for the Associations solution page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/solutions/associations/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | associations:hero
 * 1          | Member-Centric Photography    | EditableFeatureGrid       | associations:member-benefits
 * 2          | What You Get                  | EditableFeatureGrid       | associations:outcomes
 * 3          | Services for Associations     | EditableFeatureGrid       | associations:services
 * 4          | Nashville Expertise           | EditableFeatureGrid       | associations:nashville-expertise
 * 5          | FAQs                          | EditableFAQ               | associations:faqs
 * 6          | Final CTA                     | EditableCTA               | associations:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: associations:{sectionId}:{elementId}
 *
 * NOTE: The "What You Get" section is a 2-column text + checklist layout on the page.
 * It is mapped to a feature-grid with CheckCircle icons for schema editability.
 * The "Nashville Expertise" section includes venue link cards on the page — mapped
 * as a feature-grid with Building icons for schema editability.
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
export const ASSOC_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Associations and conferences photography solutions by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Give Your Members Something They\u2019ll Actually Value',
  subtitle: 'For Associations & Conferences',
  description:
    'Your conference is more than sessions and networking\u2014it\u2019s a demonstration of member value. JHR helps you document the experience, celebrate achievements, and provide benefits members talk about long after they return home.',
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
    { text: 'Request Information', href: '/contact', variant: 'secondary' },
  ],
};

/**
 * Section 1: Member-Centric Photography
 * Maps to: 4 benefit cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const ASSOC_MEMBER_BENEFITS: FeatureGridSectionContent = {
  id: 'member-benefits',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Member-centric photography benefits for associations',
    sectionId: 'member-benefits',
    dataSectionName: 'member-benefits',
  },
  heading: 'Member-Centric Photography',
  subheading:
    'Every photo we take should demonstrate value\u2014to members, to sponsors, and to stakeholders.',
  columns: 2,
  features: [
    {
      id: 'member-benefits-card-0',
      icon: 'Camera',
      title: 'Professional Headshots as Member Benefit',
      description:
        'Offer attendees complimentary professional headshots. A tangible benefit that members appreciate and use long after the conference ends.',
    },
    {
      id: 'member-benefits-card-1',
      icon: 'Award',
      title: 'Awards & Recognition Coverage',
      description:
        'Document award ceremonies, honors, and member achievements. These moments matter to recipients and demonstrate association value.',
    },
    {
      id: 'member-benefits-card-2',
      icon: 'Heart',
      title: 'Community Documentation',
      description:
        'Capture the networking, learning, and fellowship that make your conference valuable. Photos that tell the story of your community.',
    },
    {
      id: 'member-benefits-card-3',
      icon: 'Calendar',
      title: 'Multi-Day Consistency',
      description:
        'Same team, same quality, every day. We maintain energy and consistency across 3-5 day conferences.',
    },
  ],
};

/**
 * Section 2: What You Get (Outcomes)
 * Maps to: 2-column text + checklist layout on page
 * Component: EditableFeatureGrid (2 columns, CheckCircle icons)
 */
export const ASSOC_OUTCOMES: FeatureGridSectionContent = {
  id: 'outcomes',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Outcomes and deliverables for association photography',
    sectionId: 'outcomes',
    dataSectionName: 'outcomes',
  },
  heading: 'What You Get',
  subheading:
    'Photography isn\u2019t just documentation\u2014it\u2019s proof of value. When the board asks about conference ROI, you\u2019ll have more than attendance numbers.',
  columns: 2,
  features: [
    {
      id: 'outcomes-card-0',
      icon: 'CheckCircle',
      title: 'Tangible member benefit that drives attendance',
      description: 'Professional headshots give members a reason to attend and a takeaway they actually use.',
    },
    {
      id: 'outcomes-card-1',
      icon: 'CheckCircle',
      title: 'Professional documentation of speakers and sessions',
      description: 'Multi-angle coverage of all main stage and breakout presentations.',
    },
    {
      id: 'outcomes-card-2',
      icon: 'CheckCircle',
      title: 'Awards ceremony coverage members treasure',
      description: 'Moments of recognition captured with care and delivered quickly.',
    },
    {
      id: 'outcomes-card-3',
      icon: 'CheckCircle',
      title: 'Social media content throughout the event',
      description: 'Same-day highlights for real-time social sharing during your conference.',
    },
    {
      id: 'outcomes-card-4',
      icon: 'CheckCircle',
      title: 'Marketing assets for next year\u2019s promotion',
      description: 'A curated gallery that showcases the value of attendance for future marketing.',
    },
    {
      id: 'outcomes-card-5',
      icon: 'CheckCircle',
      title: 'Stakeholder reporting visuals',
      description: 'Visual proof of a successful event for board presentations and sponsor reports.',
    },
  ],
};

/**
 * Section 3: Services for Associations
 * Maps to: 3 service cards with links
 * Component: EditableFeatureGrid (3 columns)
 */
export const ASSOC_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Photography services available for associations',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Services for Associations',
  subheading: 'Comprehensive solutions for annual conferences and member events.',
  columns: 3,
  features: [
    {
      id: 'services-card-0',
      icon: 'Camera',
      title: 'Conference Coverage',
      description:
        'Keynotes, breakouts, networking, awards\u2014comprehensive documentation of your entire event.',
      link: { text: 'Learn more', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-card-1',
      icon: 'Users',
      title: 'Member Headshots',
      description:
        'Professional headshots as a member benefit. Instantly delivered and branded to your association.',
      link: { text: 'Learn more', href: '/services/headshot-activation' },
    },
    {
      id: 'services-card-2',
      icon: 'Video',
      title: 'Event Video',
      description:
        'Keynote capture, highlights, and testimonials that extend conference value for members who couldn\u2019t attend.',
      link: { text: 'Learn more', href: '/services/event-video-systems' },
    },
  ],
};

/**
 * Section 4: Nashville Expertise
 * Maps to: 2-column text + venue card grid on page
 * Component: EditableFeatureGrid (2 columns, Building icons)
 * NOTE: On the page this renders as text + linked venue cards. Schema maps venue cards
 * as feature-grid items with Building icons for editability.
 */
export const ASSOC_NASHVILLE_EXPERTISE: FeatureGridSectionContent = {
  id: 'nashville-expertise',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'JHR Photography Nashville venue expertise',
    sectionId: 'nashville-expertise',
    dataSectionName: 'nashville-expertise',
  },
  heading: 'Nashville Expertise',
  subheading:
    'If your association is meeting in Nashville, you need a partner who knows the terrain. We\u2019ve worked extensively at Music City Center, Gaylord Opryland, and all major Nashville venues.',
  columns: 2,
  features: [
    {
      id: 'nashville-expertise-card-0',
      icon: 'Building',
      title: 'Music City Center',
      description: 'Downtown Nashville',
      link: { text: 'View venue', href: '/venues/music-city-center' },
    },
    {
      id: 'nashville-expertise-card-1',
      icon: 'Building',
      title: 'Gaylord Opryland',
      description: 'Music Valley',
      link: { text: 'View venue', href: '/venues/gaylord-opryland' },
    },
    {
      id: 'nashville-expertise-card-2',
      icon: 'Building',
      title: 'Omni Hotel',
      description: 'Downtown Nashville',
      link: { text: 'View venue', href: '/venues/omni-hotel-nashville' },
    },
    {
      id: 'nashville-expertise-card-3',
      icon: 'Building',
      title: 'JW Marriott',
      description: 'Downtown Nashville',
      link: { text: 'View venue', href: '/venues/jw-marriott-nashville' },
    },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const ASSOC_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about association photography services',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Common Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'How do headshots work as a member benefit?',
      answer:
        'We set up a Headshot Activation station at your conference where members can receive a complimentary professional headshot. It\u2019s branded to your association, delivered instantly, and creates a memorable experience that members talk about.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you handle multi-day conferences?',
      answer:
        'Multi-day events are our specialty. We maintain the same team throughout, establish consistent workflows, and deliver rolling galleries so you have content each day. Our stamina across 3-5 day conferences is what association planners appreciate most.',
    },
    {
      id: 'faqs-item-2',
      question: 'How do you handle awards ceremonies?',
      answer:
        'We understand these moments matter to recipients. We coordinate shot lists in advance, position for optimal angles, and deliver images quickly so winners can share their recognition while the excitement is fresh.',
    },
    {
      id: 'faqs-item-3',
      question: 'What about speaker documentation?',
      answer:
        'We capture keynotes, breakouts, and panel discussions. Images are delivered quickly for social media use during the conference and post-event marketing.',
    },
    {
      id: 'faqs-item-4',
      question: 'How can photos support stakeholder reporting?',
      answer:
        'A well-curated gallery demonstrates conference value better than any spreadsheet. We provide images that show engaged attendees, packed sessions, and meaningful interactions\u2014visual proof of a successful event.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (gradient background)
 */
export const ASSOC_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call for association conference photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss Your Annual Conference',
  subtext:
    'Every association has different needs. Schedule a call and we\u2019ll discuss your conference, your members, and how we can help deliver value that extends beyond the event.',
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

export const ASSOC_SECTIONS: PageSectionContent[] = [
  ASSOC_HERO,
  ASSOC_MEMBER_BENEFITS,
  ASSOC_OUTCOMES,
  ASSOC_SERVICES,
  ASSOC_NASHVILLE_EXPERTISE,
  ASSOC_FAQS,
  ASSOC_FINAL_CTA,
];

export const ASSOCIATIONS_PAGE_SCHEMA: PageSchema = {
  slug: 'associations',
  name: 'Associations & Conferences',
  seo: {
    pageTitle: 'Associations & Conferences | JHR Photography',
    metaDescription:
      'Professional photography for association conferences in Nashville. Member headshots, awards coverage, and comprehensive event documentation.',
    ogImage: '/images/generated/solution-associations.jpg',
    ogTitle: 'Association Conference Photography - JHR Photography',
    ogDescription:
      'Give your members something they\u2019ll actually value. Professional photography that demonstrates conference ROI.',
  },
  sections: ASSOC_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getAssocSectionById(sectionId: string): PageSectionContent | undefined {
  return ASSOC_SECTIONS.find((s) => s.id === sectionId);
}

export function getAssocContentKeyPrefix(sectionId: string): string {
  return `associations:${sectionId}`;
}
