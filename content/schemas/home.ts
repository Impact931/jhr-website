/**
 * Homepage Content Schema
 *
 * Defines the editable structure for the JHR Photography homepage.
 * Maps each homepage section to an editable component type with default
 * content matching the approved homepage copy from content guidance.
 *
 * ============================================================================
 * SECTION MAP: Homepage Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Homepage Section              | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | home:hero
 * 1          | Trust Bar                     | EditableFeatureGrid       | home:trust-bar
 * 2          | Empathy Cards                 | EditableFeatureGrid       | home:empathy
 * 3          | How It Works (Journey)        | EditableFeatureGrid       | home:how-it-works
 * 4          | Services                      | EditableFeatureGrid       | home:services
 * 5          | Local Authority               | EditableCTA               | home:local-authority
 * 6          | Testimonials                  | EditableTestimonials      | home:testimonials
 * 7          | Team Extension                | EditableStats             | home:team-extension
 * 8          | Success Outcomes              | EditableFeatureGrid       | home:outcomes
 * 9          | Final CTA                     | EditableCTA               | home:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: home:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
  StatsSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner (LOCKED COPY)
 * Component: EditableHero
 */
export const HOME_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography hero banner - Nashville corporate event media',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Your Event Media Should Make You Look Like the Pro.',
  subtitle: 'We help busy event planners deliver high-value event media and headshots with certified, Nashville-based operators who know the venues, represent national brands, and align with your production timeline \u2014 so every image reflects the experience and value you worked hard to create.',
  backgroundImage: {
    src: '/images/generated/hero-homepage.jpg',
    alt: 'JHR Photography operator working seamlessly at a Nashville corporate event',
  },
  buttons: [
    { text: 'Talk With Our Team', href: '/schedule', variant: 'primary' },
    { text: 'Check Availability', href: '/contact', variant: 'secondary' },
  ],
};

/**
 * Section 1: Trust Bar
 * "Trusted by event teams at" + venue/client logos
 * Component: EditableFeatureGrid (compact mode, 3 columns)
 */
export const HOME_TRUST_BAR: FeatureGridSectionContent = {
  id: 'trust-bar',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Trusted by event teams at leading Nashville venues',
    sectionId: 'trust-bar',
    dataSectionName: 'trust-bar',
  },
  heading: 'Trusted by event teams at',
  columns: 3,
  displayMode: 'logo-scroll',
  features: [
    {
      id: 'trust-bar-card-0',
      icon: 'Building2',
      title: 'Gaylord Opryland',
      description: 'Approved operators at Nashville\u2019s premier convention resort.',
    },
    {
      id: 'trust-bar-card-1',
      icon: 'Building2',
      title: 'Music City Center',
      description: 'Experienced at Nashville\u2019s largest convention center.',
    },
    {
      id: 'trust-bar-card-2',
      icon: 'Building2',
      title: 'Nashville\u2019s Top Venues',
      description: 'Renaissance, Omni, JW Marriott, and more.',
    },
  ],
};

/**
 * Section 2: Empathy Cards ("Confidence Instead of Guesswork")
 * Addresses the villain: uncertainty
 * Component: EditableFeatureGrid (3 columns)
 */
export const HOME_EMPATHY: FeatureGridSectionContent = {
  id: 'empathy',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Common event media uncertainties we solve',
    sectionId: 'empathy',
    dataSectionName: 'empathy',
  },
  heading: 'Confidence Instead of Guesswork',
  subheading:
    'You\u2019ve invested months into this event. The last thing you need is to wonder whether the media will reflect the work you\u2019ve put in \u2014 or whether it will become one more thing you have to manage.',
  columns: 3,
  features: [
    {
      id: 'empathy-card-0',
      icon: 'Shield',
      title: 'Will it represent our brand?',
      description:
        'You need media that matches the quality and standards your organization is known for. Not someone else\u2019s creative interpretation \u2014 your brand, represented the right way.',
    },
    {
      id: 'empathy-card-1',
      icon: 'ClipboardList',
      title: 'Will I have to manage this?',
      description:
        'You\u2019re already coordinating vendors, timelines, and stakeholders. Media should integrate into your production flow, not become another item on your checklist.',
    },
    {
      id: 'empathy-card-2',
      icon: 'Clock',
      title: 'Will it be ready when I need it?',
      description:
        'Sponsors expect assets. Marketing has deadlines. You need delivery you can count on \u2014 not a timeline that depends on someone else\u2019s schedule.',
    },
  ],
};

/**
 * Section 3: How It Works ("A Clear Path to Confident Delivery")
 * 3-step process
 * Component: EditableFeatureGrid (3 columns)
 */
export const HOME_HOW_IT_WORKS: FeatureGridSectionContent = {
  id: 'how-it-works',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How working with JHR Photography works - three simple steps',
    sectionId: 'how-it-works',
    dataSectionName: 'how-it-works',
  },
  heading: 'A Clear Path to Confident Delivery',
  subheading: 'We\u2019ve done this hundreds of times. The process is simple because it\u2019s designed to be.',
  columns: 3,
  displayMode: 'journey',
  features: [
    {
      id: 'how-it-works-card-0',
      icon: 'Phone',
      title: 'We Connect and Align',
      description:
        'A quick conversation to understand what you\u2019re trying to accomplish, what matters most, and how we can support your timeline and brand standards.',
    },
    {
      id: 'how-it-works-card-1',
      icon: 'Camera',
      title: 'We Handle the Execution',
      description:
        'Our certified operators show up prepared, professional, and already familiar with your venue. You focus on your event. We handle the media.',
    },
    {
      id: 'how-it-works-card-2',
      icon: 'Send',
      title: 'You Get Assets You Can Use',
      description:
        'Professional media delivered on time, on brand, and ready for your marketing, communications, and sponsors \u2014 no back-and-forth required.',
    },
  ],
};

/**
 * Section 4: Services ("Media That Matches the Experience")
 * 4 service cards linking to service pages
 * Component: EditableFeatureGrid (2 columns)
 */
export const HOME_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'JHR Photography services overview',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Media That Matches the Experience',
  subheading:
    'Every service is designed around one question: how does this help you deliver an event that looks as professional as the work you put into it?',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Camera',
      title: 'Conference & Event Media',
      description:
        'Turn your event into a year of content. Capture the keynotes, the connections, and the moments between \u2014 delivered as a professional media library your team can use all year.',
      link: { text: 'Learn How This Works \u2192', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-card-1',
      icon: 'Users',
      title: 'Headshot Activations',
      description:
        'Be the most popular booth on the floor. A professional activation that draws a crowd, gives attendees something they actually value, and provides your sales team with warm leads.',
      link: { text: 'Learn How This Works \u2192', href: '/services/headshot-activation' },
    },
    {
      id: 'services-card-2',
      icon: 'UserCircle',
      title: 'Executive Imaging',
      description:
        'Your leadership team, represented the right way. Professional imaging aligned to your brand standards, delivered efficiently, and designed to support recruiting and communications.',
      link: { text: 'Learn How This Works \u2192', href: '/services/executive-imaging' },
    },
    {
      id: 'services-card-3',
      icon: 'Video',
      title: 'Trade-Show Media',
      description:
        'Media that proves the investment was worth it. Comprehensive trade-show documentation that gives sponsors the assets they expect and captures the energy of your show floor.',
      link: { text: 'Learn How This Works \u2192', href: '/services/trade-show-media' },
    },
  ],
};

/**
 * Section 5: Local Authority
 * "Local Operators. National Brand Expectations."
 * Component: EditableCTA (image background variant)
 */
export const HOME_LOCAL_AUTHORITY: CTASectionContent = {
  id: 'local-authority',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Nashville-based certified operators with local venue expertise',
    sectionId: 'local-authority',
    dataSectionName: 'local-authority',
  },
  headline: 'Local Operators. National Brand Expectations.',
  subtext:
    'We know the venues, the staff, the loading docks, and the lighting. We know where to be and when to be there \u2014 because we\u2019ve been in these rooms before, working alongside teams just like yours. That means less coordination on your end. No orientation needed. No guesswork about logistics.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-venues.jpg',
  primaryButton: {
    text: 'Explore Our Venue Experience',
    href: '/venues',
    variant: 'primary',
  },
};

/**
 * Section 6: Testimonials ("They Felt the Difference")
 * 3 testimonials in grid layout
 * Component: EditableTestimonials (grid layout)
 */
export const HOME_TESTIMONIALS: TestimonialsSectionContent = {
  id: 'testimonials',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Client testimonials from event planners who worked with JHR Photography',
    sectionId: 'testimonials',
    dataSectionName: 'testimonials',
  },
  heading: 'They Felt the Difference',
  layout: 'carousel',
  testimonials: [
    {
      id: 'testimonials-0',
      quote:
        'Working with JHR was seamless. They operated like part of our team \u2014 no oversight needed, no surprises. Our client was thrilled with the media, and honestly, it made us look great.',
      authorName: 'Event Director',
      authorTitle: 'National Event Agency',
    },
    {
      id: 'testimonials-1',
      quote:
        'The assets from our conference are still being used across marketing and recruiting eight months later. That\u2019s never happened with any photographer we\u2019ve hired before.',
      authorName: 'Marketing Director',
      authorTitle: 'Enterprise Organization',
    },
    {
      id: 'testimonials-2',
      quote:
        'Our booth had a line the entire conference. The headshot activation drove more engagement than anything we\u2019ve tried in five years of exhibiting.',
      authorName: 'Field Marketing Manager',
      authorTitle: 'National Brand Exhibitor',
    },
  ],
};

/**
 * Section 7: Team Extension ("We Work Like Part of Your Team")
 * Copy + animated stats counters
 * Component: EditableStats
 */
export const HOME_TEAM_EXTENSION: StatsSectionContent = {
  id: 'team-extension',
  type: 'stats',
  order: 7,
  seo: {
    ariaLabel: 'JHR Photography operates as an extension of your event team',
    sectionId: 'team-extension',
    dataSectionName: 'team-extension',
  },
  heading: 'We Work Like Part of Your Team',
  subheading:
    'We\u2019re not showing up as an outside vendor who needs to be briefed, oriented, and managed. We operate as a local extension of your team \u2014 aligned with your goals, familiar with your venue, and ready to execute from the moment we arrive.',
  stats: [
    {
      id: 'team-extension-stat-0',
      value: 200,
      suffix: '+',
      label: 'Corporate events in Nashville',
    },
    {
      id: 'team-extension-stat-1',
      value: 72,
      suffix: 'hr',
      label: 'Standard photo delivery window',
    },
    {
      id: 'team-extension-stat-2',
      value: 100,
      suffix: '%',
      label: 'Certified, vetted operators',
    },
    {
      id: 'team-extension-stat-3',
      value: 15,
      suffix: '+',
      label: 'Nashville venues we know by heart',
    },
  ],
};

/**
 * Section 8: Success Outcomes ("What Success Looks Like for You")
 * 4 outcome cards
 * Component: EditableFeatureGrid (4 columns)
 */
export const HOME_OUTCOMES: FeatureGridSectionContent = {
  id: 'outcomes',
  type: 'feature-grid',
  order: 8,
  seo: {
    ariaLabel: 'What success looks like when you work with JHR Photography',
    sectionId: 'outcomes',
    dataSectionName: 'outcomes',
  },
  heading: 'What Success Looks Like for You',
  columns: 4,
  features: [
    {
      id: 'outcomes-card-0',
      icon: 'CheckCircle',
      title: 'Media That Gets Used',
      description:
        'Professional assets your marketing, recruiting, and communications teams actually want to share \u2014 not files that sit in a folder.',
    },
    {
      id: 'outcomes-card-1',
      icon: 'CheckCircle',
      title: 'Delivered On Time',
      description:
        'Clear timelines, no chasing. Your gallery arrives when promised \u2014 ready for sponsors, stakeholders, and social.',
    },
    {
      id: 'outcomes-card-2',
      icon: 'CheckCircle',
      title: 'You Look Like a Pro',
      description:
        'Stakeholders, sponsors, and attendees see the quality and ask who handled the media. You made the right call.',
    },
    {
      id: 'outcomes-card-3',
      icon: 'CheckCircle',
      title: 'Happy to Recommend',
      description:
        'The experience was seamless enough that you\u2019d mention us without hesitation the next time someone asks.',
    },
  ],
};

/**
 * Section 9: Final CTA
 * Component: EditableCTA
 */
export const HOME_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 9,
  seo: {
    ariaLabel: 'Contact JHR Photography to discuss your event media needs',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Your Event Deserves Media That Matches the Work You Put In.',
  subtext:
    'Tell us about your event. We\u2019ll show you exactly how we can support your timeline, your brand, and your team.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-keynote.jpg',
  primaryButton: {
    text: 'Talk With Our Team',
    href: '/schedule',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Check Availability',
    href: '/contact',
    variant: 'secondary',
  },
};

// ============================================================================
// Complete Homepage Schema
// ============================================================================

/**
 * All homepage sections in display order.
 * Used by the ContentContext to initialize the page editor with default content.
 */
export const HOME_SECTIONS: PageSectionContent[] = [
  HOME_HERO,
  HOME_TRUST_BAR,
  HOME_EMPATHY,
  HOME_HOW_IT_WORKS,
  HOME_SERVICES,
  HOME_LOCAL_AUTHORITY,
  HOME_TESTIMONIALS,
  HOME_TEAM_EXTENSION,
  HOME_OUTCOMES,
  HOME_FINAL_CTA,
];

/**
 * Complete homepage PageSchema with SEO metadata and sections.
 * This is the canonical default content for the homepage.
 * When no CMS content exists in the database, this schema is used as fallback.
 */
export const HOME_PAGE_SCHEMA: PageSchema = {
  slug: 'home',
  name: 'Homepage',
  seo: {
    pageTitle: 'JHR Photography | Nashville Event Media & Headshot Activations',
    metaDescription:
      'Your event media should make you look like the pro. Certified Nashville-based operators for corporate event photography, headshot activations, and executive imaging.',
    ogImage: '/images/generated/hero-homepage.jpg',
    ogTitle: 'JHR Photography - Event Media That Matches the Experience',
    ogDescription:
      'Professional corporate event media and headshot activations in Nashville. Talk with our team today.',
    primarySEOFocus: 'Nashville corporate event photography',
    secondarySEOSignals: ['headshot activation Nashville', 'convention photographer Nashville', 'corporate event media'],
    geoEntitySignals: ['Nashville TN', 'Music City Center', 'Gaylord Opryland', 'Nashville convention photography'],
    trustAuthoritySignal: 'Certified Nashville-based event media operators serving national brands at top convention venues.',
  },
  sections: HOME_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helper: Get section by ID
// ============================================================================

/**
 * Look up a homepage section by its ID.
 */
export function getHomeSectionById(sectionId: string): PageSectionContent | undefined {
  return HOME_SECTIONS.find((s) => s.id === sectionId);
}

/**
 * Get the content key prefix for a homepage section.
 * Format: "home:{sectionId}"
 */
export function getHomeContentKeyPrefix(sectionId: string): string {
  return `home:${sectionId}`;
}
