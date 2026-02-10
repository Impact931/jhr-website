/**
 * Venues Solution Page Content Schema
 *
 * Defines the editable structure for the Venues (For Venue Coordinators) solution page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/solutions/venues/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | venues-solution:hero
 * 1          | What Venues Need              | EditableFeatureGrid       | venues-solution:venue-needs
 * 2          | Why Partner with JHR          | EditableFeatureGrid       | venues-solution:partnership
 * 3          | Services for Your Clients     | EditableFeatureGrid       | venues-solution:services
 * 4          | Our Nashville Venue Experience | EditableFeatureGrid       | venues-solution:venue-experience
 * 5          | FAQs                          | EditableFAQ               | venues-solution:faqs
 * 6          | Final CTA                     | EditableCTA               | venues-solution:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: venues-solution:{sectionId}:{elementId}
 *
 * NOTE: The "Why Partner with JHR" section is a 2-column text + checklist layout on the page.
 * Mapped to a feature-grid with CheckCircle icons for editability.
 * The "Our Nashville Venue Experience" section shows linked venue cards — mapped as
 * a feature-grid with Building icons.
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
export const VSOL_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Venue coordinator photography solutions by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'A Photography Partner Who Knows Your Space',
  subtitle: 'For Venue Coordinators',
  description:
    'When clients ask for photography recommendations, you need vendors you can trust. JHR Photography understands venue operations, respects your protocols, and consistently delivers quality that reflects well on everyone involved.',
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
    { text: 'Request Vendor Information', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'secondary' },
  ],
};

/**
 * Section 1: What Venues Need from Photography Partners
 * Maps to: 4 need cards in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const VSOL_VENUE_NEEDS: FeatureGridSectionContent = {
  id: 'venue-needs',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'What venues need from photography partners',
    sectionId: 'venue-needs',
    dataSectionName: 'venue-needs',
  },
  heading: 'What Venues Need from Photography Partners',
  subheading:
    'Your preferred vendor list reflects your standards. Every recommendation is a reflection of your judgment.',
  columns: 2,
  features: [
    {
      id: 'venue-needs-card-0',
      icon: 'Building',
      title: 'Venue-Aware Professionals',
      description:
        'Photographers who understand your space, your policies, and your operational requirements. No explaining the basics.',
    },
    {
      id: 'venue-needs-card-1',
      icon: 'Clock',
      title: 'Reliable Recommendations',
      description:
        'When you recommend a vendor, your reputation is on the line. You need photographers who will show up, perform, and make you look good.',
    },
    {
      id: 'venue-needs-card-2',
      icon: 'Users',
      title: 'Easy Coordination',
      description:
        'Vendors who handle their own paperwork, know your staff, and work seamlessly with your AV and catering teams.',
    },
    {
      id: 'venue-needs-card-3',
      icon: 'Star',
      title: 'Consistent Quality',
      description:
        'Every client should receive the same professional experience. No variance based on which photographer happens to be available.',
    },
  ],
};

/**
 * Section 2: Why Partner with JHR
 * Maps to: 2-column text + checklist layout on page
 * Component: EditableFeatureGrid (2 columns, CheckCircle icons)
 */
export const VSOL_PARTNERSHIP: FeatureGridSectionContent = {
  id: 'partnership',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Why venues should partner with JHR Photography',
    sectionId: 'partnership',
    dataSectionName: 'partnership',
  },
  heading: 'Why Partner with JHR',
  subheading:
    'We\u2019ve worked extensively at Nashville\u2019s premier venues\u2014Music City Center, Gaylord Opryland, the downtown hotels. We understand the operational realities, the lighting challenges, and the expectations.',
  columns: 2,
  features: [
    {
      id: 'partnership-card-0',
      icon: 'CheckCircle',
      title: 'Fully insured and EAC-compliant',
      description: 'All paperwork, insurance, and venue requirements handled proactively.',
    },
    {
      id: 'partnership-card-1',
      icon: 'CheckCircle',
      title: 'Knowledge of your specific venue and spaces',
      description: 'We know the lighting, the layouts, and the logistics of your property.',
    },
    {
      id: 'partnership-card-2',
      icon: 'CheckCircle',
      title: 'Professional appearance and conduct',
      description: 'We show up in uniform, introduce ourselves, and work invisibly.',
    },
    {
      id: 'partnership-card-3',
      icon: 'CheckCircle',
      title: 'Clear communication and reliable timing',
      description: 'You always know when we\u2019re arriving and what to expect.',
    },
    {
      id: 'partnership-card-4',
      icon: 'CheckCircle',
      title: 'Images that showcase your venue beautifully',
      description: 'Our work makes your space look its best in every photo.',
    },
    {
      id: 'partnership-card-5',
      icon: 'CheckCircle',
      title: 'Coordination with your operations team',
      description: 'We fit into your ecosystem\u2014not the other way around.',
    },
  ],
};

/**
 * Section 3: Services for Your Clients
 * Maps to: 4 service cards with links in 2-column grid
 * Component: EditableFeatureGrid (2 columns)
 */
export const VSOL_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Photography services for venue clients',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Services for Your Clients',
  subheading: 'Professional photography solutions for events at your venue.',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Camera',
      title: 'Event Coverage',
      description:
        'Comprehensive photography for conferences, galas, and corporate events. Same-day highlights available.',
      link: { text: 'Learn more', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-card-1',
      icon: 'Users',
      title: 'Headshot Activation',
      description:
        'High-volume professional headshots for trade shows and conferences. Great sponsor activation option.',
      link: { text: 'Learn more', href: '/services/headshot-activation' },
    },
    {
      id: 'services-card-2',
      icon: 'Video',
      title: 'Event Video',
      description:
        'Keynote capture, highlight reels, and testimonials. Professional video that extends event value.',
      link: { text: 'Learn more', href: '/services/event-video-systems' },
    },
    {
      id: 'services-card-3',
      icon: 'Image',
      title: 'Venue Photography',
      description:
        'Professional documentation of your spaces for marketing materials. Empty spaces and events-in-progress.',
      link: { text: 'Contact us', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105' },
    },
  ],
};

/**
 * Section 4: Our Nashville Venue Experience
 * Maps to: 4-column grid of 8 linked venue cards
 * Component: EditableFeatureGrid (4 columns, Building icons)
 */
export const VSOL_VENUE_EXPERIENCE: FeatureGridSectionContent = {
  id: 'venue-experience',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'JHR Photography Nashville venue experience',
    sectionId: 'venue-experience',
    dataSectionName: 'venue-experience',
  },
  heading: 'Our Nashville Venue Experience',
  subheading: 'We know Nashville\u2019s event spaces inside and out.',
  columns: 4,
  features: [
    {
      id: 'venue-experience-card-0',
      icon: 'Building',
      title: 'Music City Center',
      description: 'Downtown Nashville convention center',
      link: { text: 'View venue', href: '/venues/music-city-center' },
    },
    {
      id: 'venue-experience-card-1',
      icon: 'Building',
      title: 'Gaylord Opryland',
      description: 'Music Valley resort and convention center',
      link: { text: 'View venue', href: '/venues/gaylord-opryland' },
    },
    {
      id: 'venue-experience-card-2',
      icon: 'Building',
      title: 'Omni Hotel',
      description: 'Downtown Nashville hotel and event space',
      link: { text: 'View venue', href: '/venues/omni-hotel-nashville' },
    },
    {
      id: 'venue-experience-card-3',
      icon: 'Building',
      title: 'JW Marriott',
      description: 'Downtown Nashville luxury hotel',
      link: { text: 'View venue', href: '/venues/jw-marriott-nashville' },
    },
    {
      id: 'venue-experience-card-4',
      icon: 'Building',
      title: 'Renaissance Hotel',
      description: 'Downtown Nashville hotel and conference center',
      link: { text: 'View venue', href: '/venues/renaissance-hotel-nashville' },
    },
    {
      id: 'venue-experience-card-5',
      icon: 'Building',
      title: 'Embassy Suites',
      description: 'Nashville hotel and event space',
      link: { text: 'View venue', href: '/venues/embassy-suites-nashville' },
    },
    {
      id: 'venue-experience-card-6',
      icon: 'Building',
      title: 'City Winery',
      description: 'Nashville unique event venue',
      link: { text: 'View venue', href: '/venues/city-winery-nashville' },
    },
    {
      id: 'venue-experience-card-7',
      icon: 'Building',
      title: 'Belmont University',
      description: 'Nashville university event spaces',
      link: { text: 'View venue', href: '/venues/belmont-university' },
    },
  ],
};

/**
 * Section 5: FAQs
 * Component: EditableFAQ
 */
export const VSOL_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 5,
  seo: {
    ariaLabel: 'Frequently asked questions about venue photography partnerships',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Common Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'Are you familiar with venue vendor requirements?',
      answer:
        'Yes. We understand EAC processes, insurance requirements, load-in procedures, and union considerations for Nashville\u2019s major venues. We handle our paperwork and coordinate with venue contacts as needed.',
    },
    {
      id: 'faqs-item-1',
      question: 'Can you be added to our preferred vendor list?',
      answer:
        'Absolutely. We\u2019d welcome the opportunity to discuss our qualifications and how we can serve your clients. We can provide insurance certificates, references, and portfolio samples.',
    },
    {
      id: 'faqs-item-2',
      question: 'How do you coordinate with venue staff?',
      answer:
        'We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We\u2019re experienced working alongside AV teams, catering staff, and venue operations. We fit into your ecosystem\u2014not the other way around.',
    },
    {
      id: 'faqs-item-3',
      question: 'What if a client needs last-minute photography?',
      answer:
        'We understand events change. While we prefer advance booking, we can often accommodate last-minute needs. Contact us and we\u2019ll do our best to help your client.',
    },
    {
      id: 'faqs-item-4',
      question: 'Do you photograph the venue itself for marketing purposes?',
      answer:
        'Yes. We can provide venue photography for your marketing materials\u2014both empty space documentation and event-in-progress images that show your venue at its best.',
    },
  ],
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (gradient background)
 */
export const VSOL_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a partnership discussion with JHR Photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss a Partnership',
  subtext:
    'Schedule a conversation about adding JHR to your preferred vendor list. We\u2019re happy to provide credentials, references, and portfolio samples.',
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

export const VSOL_SECTIONS: PageSectionContent[] = [
  VSOL_HERO,
  VSOL_VENUE_NEEDS,
  VSOL_PARTNERSHIP,
  VSOL_SERVICES,
  VSOL_VENUE_EXPERIENCE,
  VSOL_FAQS,
  VSOL_FINAL_CTA,
];

export const VENUES_SOLUTION_PAGE_SCHEMA: PageSchema = {
  slug: 'venues-solution',
  name: 'For Venue Coordinators',
  seo: {
    pageTitle: 'For Venue Coordinators | JHR Photography',
    metaDescription:
      'A photography partner who knows your space. EAC-compliant, venue-aware, and trusted by Nashville\u2019s premier event venues.',
    ogImage: '/images/generated/solution-venues.jpg',
    ogTitle: 'Venue Photography Partnership - JHR Photography',
    ogDescription:
      'When clients ask for photography recommendations, recommend a partner who knows your space and delivers consistently.',
  },
  sections: VSOL_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getVSOLSectionById(sectionId: string): PageSectionContent | undefined {
  return VSOL_SECTIONS.find((s) => s.id === sectionId);
}

export function getVSOLContentKeyPrefix(sectionId: string): string {
  return `venues-solution:${sectionId}`;
}
