/**
 * Homepage Content Schema
 *
 * Defines the editable structure for the JHR Photography homepage.
 * Maps each homepage section to an editable component type with default
 * content matching the current static homepage (/app/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Homepage Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Homepage Section              | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | home:hero
 * 1          | Photographer Trust Badges     | EditableFeatureGrid       | home:trust-badges
 * 2          | ICP Routing ("Choose Outcome")| EditableFeatureGrid       | home:icp-routing
 * 3          | Services Overview             | EditableFeatureGrid       | home:services
 * 4          | Venue Fluency                 | EditableCTA               | home:venue-fluency
 * 5          | How It Works (Process)        | EditableFeatureGrid       | home:process
 * 6          | Gallery Preview               | EditableImageGallery      | home:gallery
 * 7          | Social Proof (Testimonials)   | EditableTestimonials      | home:social-proof
 * 8          | Final CTA                     | EditableCTA               | home:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: home:{sectionId}:{elementId}
 *
 * Examples:
 *   home:hero:title              - Hero headline text
 *   home:hero:subtitle           - Hero subtitle text
 *   home:hero:description        - Hero description paragraph
 *   home:hero:backgroundImage    - Hero background image
 *   home:hero:primaryCta-text    - Hero primary CTA button text
 *   home:hero:primaryCta-href    - Hero primary CTA button link
 *   home:hero:secondaryCta-text  - Hero secondary CTA button text
 *   home:hero:secondaryCta-href  - Hero secondary CTA button link
 *   home:icp-routing:heading     - ICP section heading
 *   home:icp-routing:subheading  - ICP section subheading
 *   home:icp-routing:features    - ICP section feature cards (JSON array)
 *   home:services:heading        - Services section heading
 *   home:services:subheading     - Services section subheading
 *   home:services:features       - Services feature cards (JSON array)
 *   home:gallery:heading         - Gallery section heading
 *   home:gallery:images          - Gallery images (JSON array)
 *   home:social-proof:heading    - Testimonials section heading
 *   home:social-proof:testimonials - Testimonials (JSON array)
 *   home:final-cta:headline      - Final CTA headline
 *   home:final-cta:subtext       - Final CTA subtext
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <HeroBanner> in /app/page.tsx (lines 24-50)
 * Component: EditableHero
 *
 * Includes title, subtitle, description, background image, two CTAs,
 * and trust signal badges rendered as children.
 */
export const HOME_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography hero banner - Nashville corporate event photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Stop Worrying About Your Media Vendor.',
  subtitle: 'Planning a high-stakes event in Nashville?',
  description:
    'JHR Photography is Nashville\u2019s trusted partner for corporate event photography and headshot activations. We remove the friction so you can focus on what matters\u2014delivering an exceptional event.',
  backgroundImage: {
    src: '/images/generated/hero-homepage.jpg',
    alt: 'Professional corporate event photography at Nashville convention center',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
    { text: 'Explore Our Services', href: '/services', variant: 'secondary' },
  ],
};

/**
 * Section 1: Photographer Trust Badges
 * Maps to: <PhotographerTrustBadges> in /app/page.tsx (lines 53-61)
 * Component: EditableFeatureGrid (compact mode, 3 columns)
 *
 * This section uses a dedicated PhotographerTrustBadges component on the
 * current homepage. In CMS mode we represent it as a feature grid so the
 * title and subtitle are editable. The badge content itself is part of
 * the PhotographerTrustBadges component and would need deeper integration
 * for full inline editing.
 */
export const HOME_TRUST_BADGES: FeatureGridSectionContent = {
  id: 'trust-badges',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Professional photographer trust indicators',
    sectionId: 'trust-badges',
    dataSectionName: 'trust-badges',
  },
  heading: 'Professional Photographers You Can Trust',
  subheading: 'Our Team',
  columns: 3,
  features: [
    {
      id: 'trust-badges-card-0',
      icon: 'CheckCircle',
      title: 'Venue-Fluent',
      description: 'We know Nashville\u2019s premier event venues inside and out.',
    },
    {
      id: 'trust-badges-card-1',
      icon: 'CheckCircle',
      title: 'Agency-Grade Execution',
      description: 'Professional reliability that DMCs and agencies depend on.',
    },
    {
      id: 'trust-badges-card-2',
      icon: 'CheckCircle',
      title: 'AI-Accelerated Delivery',
      description: 'AI-retouched assets delivered faster than traditional workflows.',
    },
  ],
};

/**
 * Section 2: ICP Routing ("What Brings You Here Today?")
 * Maps to: "Choose Your Outcome" section in /app/page.tsx (lines 64-133)
 * Component: EditableFeatureGrid (3 columns)
 *
 * Three audience-specific cards linking to solutions pages:
 * - DMCs/Agencies -> /solutions/dmcs-agencies
 * - Exhibitors/Sponsors -> /solutions/exhibitors-sponsors
 * - Associations -> /solutions/associations
 */
export const HOME_ICP_ROUTING: FeatureGridSectionContent = {
  id: 'icp-routing',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Choose your path based on your event needs',
    sectionId: 'icp-routing',
    dataSectionName: 'icp-routing',
  },
  heading: 'What Brings You Here Today?',
  subheading:
    'We serve different clients with different needs. Choose the path that fits your situation.',
  columns: 3,
  features: [
    {
      id: 'icp-routing-card-0',
      icon: 'Shield',
      title: 'I need reliable execution for my client.',
      description:
        'You\u2019re a DMC, agency, or production company managing an event in Nashville. You need a vendor who won\u2019t let you down.',
      link: { text: 'Solutions for Agencies', href: '/solutions/dmcs-agencies' },
    },
    {
      id: 'icp-routing-card-1',
      icon: 'Zap',
      title: 'I need to drive traffic and generate leads.',
      description:
        'You\u2019re an exhibitor or sponsor looking to maximize booth engagement and capture qualified leads at your next event.',
      link: { text: 'Solutions for Exhibitors', href: '/solutions/exhibitors-sponsors' },
    },
    {
      id: 'icp-routing-card-2',
      icon: 'Calendar',
      title: 'I need a meaningful member benefit.',
      description:
        'You\u2019re planning a conference and want to deliver real value to attendees while elevating your event experience.',
      link: { text: 'Solutions for Associations', href: '/solutions/associations' },
    },
  ],
};

/**
 * Section 3: Services Overview ("Outcome-Based Media Systems")
 * Maps to: Services grid in /app/page.tsx (lines 136-296)
 * Component: EditableFeatureGrid (2 columns)
 *
 * Four service cards with images, descriptions, and bullet points:
 * - Headshot Activation
 * - Corporate Event Coverage
 * - Corporate Headshot Program
 * - Event Video Systems
 *
 * Note: The current homepage uses image cards with bullet lists, which is
 * richer than a standard FeatureGrid. The feature grid provides title/icon/
 * description/link per card. Image-based service cards may need a custom
 * variant or the EditableImageGallery component in a future iteration.
 */
export const HOME_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'JHR Photography services overview',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Outcome-Based Media Systems',
  subheading:
    'We don\u2019t sell hours or photographers. We deliver complete media systems designed for specific outcomes.',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Camera',
      title: 'Headshot Activation\u2122',
      description:
        'Turn your booth into a destination with high-engagement headshot stations. 300+ attendees processed per day with real-time lead capture.',
      link: { text: 'Learn more', href: '/services/headshot-activation' },
    },
    {
      id: 'services-card-1',
      icon: 'Camera',
      title: 'Corporate Event Coverage\u2122',
      description:
        'Comprehensive documentation with the professionalism your brand demands. Multi-day coverage with same-day highlight delivery.',
      link: { text: 'Learn more', href: '/services/corporate-event-coverage' },
    },
    {
      id: 'services-card-2',
      icon: 'Camera',
      title: 'Corporate Headshot Program\u2122',
      description:
        'Consistent, on-brand headshots for your entire team. On-site at your office, AI-retouched, ready for LinkedIn.',
      link: { text: 'Learn more', href: '/services/corporate-headshot-program' },
    },
    {
      id: 'services-card-3',
      icon: 'Camera',
      title: 'Event Video Systems\u2122',
      description:
        'Capture the motion and emotion of your event. Keynote and session capture with social-ready highlight clips.',
      link: { text: 'Learn more', href: '/services/event-video-systems' },
    },
  ],
};

/**
 * Section 4: Venue Fluency
 * Maps to: Venue section in /app/page.tsx (lines 299-360)
 * Component: EditableCTA (image background variant)
 *
 * Split layout with text on the left and a 2x2 venue image grid on the
 * right. Uses background image with dark overlay. The venue image grid
 * is custom content that goes beyond a simple CTA. In CMS mode, the
 * headline, subtext, and background are editable. The venue grid would
 * need deeper integration for full inline editing.
 */
export const HOME_VENUE_FLUENCY: CTASectionContent = {
  id: 'venue-fluency',
  type: 'cta',
  order: 4,
  seo: {
    ariaLabel: 'Nashville venue fluency and experience',
    sectionId: 'venue-fluency',
    dataSectionName: 'venue-fluency',
  },
  headline: 'We Know Nashville\u2019s Premier Venues',
  subtext:
    'When you\u2019re planning from out of state, you need a partner who knows the terrain. We\u2019ve worked extensively at Nashville\u2019s top convention and event venues\u2014we know the marshaling yards, the loading docks, the lighting challenges, and the people who run them.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-venues.jpg',
  primaryButton: {
    text: 'Explore Our Venue Experience',
    href: '/venues',
    variant: 'primary',
  },
};

/**
 * Section 5: How It Works (Process Timeline)
 * Maps to: ProcessTimeline in /app/page.tsx (lines 363-400)
 * Component: EditableFeatureGrid (3 columns)
 *
 * Three-step process:
 * 1. Strategy Call (Phone icon)
 * 2. Logistics Takeover (FileText icon)
 * 3. Asset Delivery (Camera icon)
 *
 * Uses ProcessTimeline component on current homepage. In CMS mode, mapped
 * to a feature grid for editable steps.
 */
export const HOME_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'How working with JHR Photography works',
    sectionId: 'how-it-works',
    dataSectionName: 'process',
  },
  heading: 'A Clear Path to Success',
  subheading:
    'Working with JHR is straightforward. We take the burden off your plate so you can focus on your event.',
  columns: 3,
  features: [
    {
      id: 'process-card-0',
      icon: 'Phone',
      title: 'Strategy Call',
      description:
        'We schedule a brief consultation to align on your specific logistics, venue constraints, and goals. We identify potential friction points before they happen.',
    },
    {
      id: 'process-card-1',
      icon: 'FileText',
      title: 'Logistics Takeover',
      description:
        'Our team handles the heavy lifting\u2014coordinating with venues, managing equipment logistics, and executing the onsite activation with uniformed, professional staff.',
    },
    {
      id: 'process-card-2',
      icon: 'Camera',
      title: 'Asset Delivery',
      description:
        'You receive AI-retouched assets and granular data instantly, ready for your post-event marketing sequences. No delays, no surprises.',
    },
  ],
};

/**
 * Section 6: Gallery Preview ("Our Work")
 * Maps to: Gallery grid in /app/page.tsx (lines 403-439)
 * Component: EditableImageGallery (grid layout, 4 columns)
 *
 * 8 images in a 2x4 grid showcasing event photography:
 * - Keynote speaker, trade show, networking, awards ceremony
 * - 3 headshot samples, hotel ballroom
 */
export const HOME_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 6,
  seo: {
    ariaLabel: 'JHR Photography event gallery preview',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Event Photography That Delivers',
  layout: 'grid',
  images: [
    {
      src: '/images/generated/event-keynote.jpg',
      alt: 'Keynote speaker at corporate conference',
    },
    {
      src: '/images/generated/event-trade-show.jpg',
      alt: 'Trade show floor photography',
    },
    {
      src: '/images/generated/event-networking.jpg',
      alt: 'Networking event photography',
    },
    {
      src: '/images/generated/event-awards-ceremony.jpg',
      alt: 'Awards ceremony photography',
    },
    {
      src: '/images/generated/gallery-headshot-1.jpg',
      alt: 'Professional corporate headshot',
    },
    {
      src: '/images/generated/gallery-headshot-2.jpg',
      alt: 'Executive portrait',
    },
    {
      src: '/images/generated/gallery-headshot-3.jpg',
      alt: 'Business professional headshot',
    },
    {
      src: '/images/generated/venue-hotel-ballroom.jpg',
      alt: 'Corporate gala photography',
    },
  ],
};

/**
 * Section 7: Social Proof (Testimonials)
 * Maps to: Testimonial section in /app/page.tsx (lines 442-464)
 * Component: EditableTestimonials (single layout)
 *
 * Currently shows one testimonial in a centered, light-background layout.
 * The light background is a CSS detail (section-light class) that would
 * be preserved in the page template.
 */
export const HOME_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 7,
  seo: {
    ariaLabel: 'Client testimonials for JHR Photography',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Event Professionals Choose JHR',
  layout: 'single',
  testimonials: [
    {
      id: 'social-proof-testimonial-0',
      quote:
        'Working with Jayson and his team was seamless. They understood our needs, showed up prepared, and delivered exceptional results. Our attendees loved the headshot activation.',
      authorName: 'Event Director',
      authorTitle: 'National Association Conference',
    },
  ],
};

/**
 * Section 8: Final CTA
 * Maps to: Bottom CTA in /app/page.tsx (lines 467-492)
 * Component: EditableCTA (image background variant)
 *
 * Full-width CTA with background image, headline, subtext, and a single
 * primary button linking to /schedule.
 */
export const HOME_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a strategy call with JHR Photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Ready to Remove the Worry?',
  subtext:
    'Let\u2019s talk about your event. Schedule a strategy call and discover how JHR can deliver the professional reliability and results your event deserves.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/event-keynote.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: '/schedule',
    variant: 'primary',
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
  HOME_TRUST_BADGES,
  HOME_ICP_ROUTING,
  HOME_SERVICES,
  HOME_VENUE_FLUENCY,
  HOME_PROCESS,
  HOME_GALLERY,
  HOME_SOCIAL_PROOF,
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
    pageTitle: 'JHR Photography | Nashville Corporate Event Photography & Headshots',
    metaDescription:
      'Nashville\u2019s trusted partner for corporate event photography and headshot activations. Venue-fluent, agency-grade execution, AI-accelerated delivery.',
    ogImage: '/images/generated/hero-homepage.jpg',
    ogTitle: 'JHR Photography - Stop Worrying About Your Media Vendor',
    ogDescription:
      'Professional corporate event photography and headshot activations in Nashville. Schedule a strategy call today.',
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
 * Useful for targeted section updates without loading the full schema.
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
