/**
 * Event Video Systems Service Page Content Schema
 *
 * Defines the editable structure for the Event Video Systems service page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/services/event-video-systems/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | event-video-systems:hero
 * 1          | Why Event Video Matters        | EditableFeatureGrid       | event-video-systems:value-prop
 * 2          | Video Services                | EditableFeatureGrid       | event-video-systems:services
 * 3          | Common Applications           | EditableFeatureGrid       | event-video-systems:use-cases
 * 4          | How We Work (Process)         | EditableFeatureGrid       | event-video-systems:process
 * 5          | Gallery                       | EditableImageGallery      | event-video-systems:gallery
 * 6          | Social Proof                  | EditableTestimonials      | event-video-systems:social-proof
 * 7          | FAQs                          | EditableFAQ               | event-video-systems:faqs
 * 8          | Final CTA                     | EditableCTA               | event-video-systems:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: event-video-systems:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  TestimonialsSectionContent,
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
export const EVS_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Event video systems service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Your Event Deserves More Than Photos',
  subtitle: 'Event Video Systems\u2122',
  description:
    'Great events end. Great video extends their impact. Capture keynotes for training libraries, testimonials for marketing, and highlights that promote next year\u2019s event before this one\u2019s even over.',
  backgroundImage: {
    src: '/images/generated/service-event-video.jpg',
    alt: 'Professional video production at corporate event',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Why Event Video Matters (Value Proposition)
 * Maps to: Left text + right video preview image with outcomes checklist
 * Component: EditableFeatureGrid (alternating 2-col layout with images)
 */
export const EVS_VALUE_PROP: FeatureGridSectionContent = {
  id: 'value-prop',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Why event video matters for your organization',
    sectionId: 'value-prop',
    dataSectionName: 'value-prop',
  },
  heading: 'Why Event Video Matters',
  subheading:
    'You spend months planning an event. Attendees experience it for a few days. Then it\u2019s over. Video changes that equation.',
  displayMode: 'alternating',
  columns: 2,
  features: [
    {
      id: 'value-prop-card-0',
      icon: 'CheckCircle',
      title: 'Extended Event ROI',
      description: 'Extended event ROI through lasting video content.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Extended event ROI through video content' },
    },
    {
      id: 'value-prop-card-1',
      icon: 'CheckCircle',
      title: 'Keynote Archives',
      description: 'Professional keynote archives for internal use.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Professional keynote recording archives' },
    },
    {
      id: 'value-prop-card-2',
      icon: 'CheckCircle',
      title: 'Promotional Material',
      description: 'Compelling promotional material for future events.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Event promotional video material' },
    },
    {
      id: 'value-prop-card-3',
      icon: 'CheckCircle',
      title: 'Authentic Testimonials',
      description: 'Authentic testimonials for marketing campaigns.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Authentic attendee testimonial capture' },
    },
  ],
};

/**
 * Section 2: Video Services
 * Maps to: Horizontal service cards
 * Component: EditableFeatureGrid (horizontal layout)
 */
export const EVS_SERVICES: FeatureGridSectionContent = {
  id: 'services',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Event video services offered by JHR Photography',
    sectionId: 'services',
    dataSectionName: 'services',
  },
  heading: 'Video Services',
  subheading:
    'Each system can be added to any photography service or booked independently. One coordinated team handles everything.',
  displayMode: 'horizontal',
  columns: 2,
  features: [
    {
      id: 'services-card-0',
      icon: 'Video',
      title: 'Keynote Capture',
      description:
        'Multi-camera coverage of your keynotes and general sessions. Professional audio capture ensures every word comes through clearly.',
    },
    {
      id: 'services-card-1',
      icon: 'Film',
      title: 'Highlight Reels',
      description:
        'Condensed event stories that capture the energy and key moments. Perfect for social media, stakeholder reports, and next year\u2019s promotion.',
    },
    {
      id: 'services-card-2',
      icon: 'Mic',
      title: 'Attendee Testimonials',
      description:
        'On-site testimonial capture with professional lighting and sound. Real voices telling real stories about your event\u2019s impact.',
    },
    {
      id: 'services-card-3',
      icon: 'Share2',
      title: 'Social-Ready Clips',
      description:
        'Short-form content optimized for LinkedIn, Instagram, and other platforms. Delivered in formats ready for immediate posting.',
    },
  ],
};

/**
 * Section 3: Common Applications (Use Cases)
 * Maps to: 3-column use case cards
 * Component: EditableFeatureGrid (3 columns, default layout)
 */
export const EVS_USE_CASES: FeatureGridSectionContent = {
  id: 'use-cases',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Ways to leverage event video for extended ROI',
    sectionId: 'use-cases',
    dataSectionName: 'use-cases',
  },
  heading: 'Extend Your Event ROI With Video',
  subheading: 'Your event happens once. The content it produces should work for you all year. Here\u2019s how smart marketers turn one event into months of leverage.',
  columns: 3,
  features: [
    {
      id: 'use-cases-card-0',
      icon: 'GraduationCap',
      title: 'Training & Development Libraries',
      description:
        'Turn keynotes and breakout sessions into on-demand training content. One event builds a leadership library that onboards and develops your team year-round.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Corporate training video library from event keynotes' },
    },
    {
      id: 'use-cases-card-1',
      icon: 'MessageSquare',
      title: 'Testimonial & Case Study Content',
      description:
        'Capture authentic attendee reactions and speaker endorsements on-site while the energy is real. Nothing sells like an unscripted testimonial recorded in the moment.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Attendee testimonial being recorded at event' },
    },
    {
      id: 'use-cases-card-2',
      icon: 'Mic',
      title: 'Tradeshow & Expo Interviews',
      description:
        'Pull exhibitors, sponsors, and thought leaders aside for quick on-camera interviews. Produce content that strengthens partnerships and builds authority in your space.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Professional interview at tradeshow exhibit booth' },
    },
    {
      id: 'use-cases-card-3',
      icon: 'Smartphone',
      title: 'Social Media Shorts & Reels',
      description:
        'Repurpose event footage into vertical clips optimized for LinkedIn, Instagram, and TikTok. Drip content for weeks and keep your audience engaged long after the event ends.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Social media video content from corporate event' },
    },
    {
      id: 'use-cases-card-4',
      icon: 'PieChart',
      title: 'Investor & Stakeholder Reports',
      description:
        'A 90-second highlight reel says more than a 40-page deck. Show your board, sponsors, and investors the energy, turnout, and impact they funded.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Event highlight reel for stakeholder presentation' },
    },
    {
      id: 'use-cases-card-5',
      icon: 'Ticket',
      title: 'Next-Event Promotion',
      description:
        'This year\u2019s footage becomes next year\u2019s best marketing asset. Sell registrations, attract sponsors, and build FOMO with proof of what they missed.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Promotional video driving event registration' },
    },
  ],
};

/**
 * Section 4: How We Work (Process)
 * Maps to: 4-step journey timeline
 * Component: EditableFeatureGrid (journey layout, 4 columns)
 */
export const EVS_PROCESS: FeatureGridSectionContent = {
  id: 'process',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Event video production process',
    sectionId: 'process',
    dataSectionName: 'process',
  },
  heading: 'How We Work',
  displayMode: 'journey',
  columns: 4,
  features: [
    {
      id: 'process-card-0',
      icon: 'ClipboardList',
      title: 'Pre-Production',
      description:
        'We review your event schedule, identify key capture moments, and coordinate with your AV team on audio feeds and positioning.',
    },
    {
      id: 'process-card-1',
      icon: 'Video',
      title: 'On-Site Capture',
      description:
        'Our video team works alongside our photography team (if applicable), capturing footage throughout the event without disruption.',
    },
    {
      id: 'process-card-2',
      icon: 'Scissors',
      title: 'Post-Production',
      description:
        'Professional editing, color grading, audio mixing, and graphics. We deliver polished content ready for its intended use.',
    },
    {
      id: 'process-card-3',
      icon: 'Send',
      title: 'Delivery',
      description:
        'Files delivered in all formats you need\u2014archival masters, web versions, and platform-specific exports for social media.',
    },
  ],
};

/**
 * Section 5: Gallery
 * Component: EditableImageGallery
 */
export const EVS_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 5,
  seo: {
    ariaLabel: 'Event video production portfolio samples',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Our Video Work',
  layout: 'grid',
  images: [
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote speaker video capture setup' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Awards ceremony video production' },
    { src: '/images/generated/event-trade-show.jpg', alt: 'Trade show video documentation' },
    { src: '/images/generated/event-networking.jpg', alt: 'Networking event video highlights' },
    { src: '/images/generated/venue-music-city-center.jpg', alt: 'Convention center video production' },
    { src: '/images/generated/venue-gaylord-opryland.jpg', alt: 'Resort event video coverage' },
  ],
};

/**
 * Section 6: Social Proof (Testimonials)
 * Component: EditableTestimonials
 */
export const EVS_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 6,
  seo: {
    ariaLabel: 'Testimonials from event organizers about video services',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'Event Organizers Trust JHR Video',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote: 'The keynote capture was flawless. Multi-camera setup, perfect audio, and the edited version was ready in two weeks. Our training library just doubled in value.',
      authorName: 'VP of Learning',
      authorTitle: 'Enterprise Technology Company',
    },
    {
      id: 'social-proof-1',
      quote: 'Having one team handle both photography and video meant zero coordination headaches. They moved through the event like they\u2019d been part of our staff for years.',
      authorName: 'Conference Director',
      authorTitle: 'National Association',
    },
    {
      id: 'social-proof-2',
      quote: 'The highlight reel sold out next year\u2019s conference before we even opened registration. That\u2019s the ROI of professional event video.',
      authorName: 'Marketing Director',
      authorTitle: 'Industry Summit',
    },
  ],
};

/**
 * Section 7: FAQs
 * Component: EditableFAQ
 */
export const EVS_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 7,
  seo: {
    ariaLabel: 'Frequently asked questions about event video systems',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Frequently Asked Questions',
  items: [
    {
      id: 'faqs-item-0',
      question: 'Can you add video to our photography package?',
      answer:
        'Yes. Video can be added to any photography package or booked independently. Many clients start with event coverage photography and add video for key elements like keynotes or testimonials.',
    },
    {
      id: 'faqs-item-1',
      question: 'How quickly can we receive the highlight reel?',
      answer:
        'Standard turnaround for highlight reels is 2-3 weeks. For events requiring faster delivery, we offer expedited editing\u2014discuss your timeline during our strategy call.',
    },
    {
      id: 'faqs-item-2',
      question: 'What\u2019s included in keynote capture?',
      answer:
        'Multi-camera coverage (typically 2-3 cameras), professional audio capture from the venue feed plus backup recording, and basic editing including intro/outro, lower thirds, and clean cuts.',
    },
    {
      id: 'faqs-item-3',
      question: 'Do you bring your own audio equipment?',
      answer:
        'We connect to your venue\u2019s audio feed for the cleanest sound, but always bring backup recording equipment. For testimonials and interviews, we use professional wireless microphones.',
    },
    {
      id: 'faqs-item-4',
      question: 'What formats do you deliver in?',
      answer:
        'Standard delivery includes high-resolution files for archival, web-optimized versions for your site, and platform-specific exports for social media (LinkedIn, Instagram, YouTube, etc.).',
    },
  ],
};

/**
 * Section 8: Final CTA
 * Component: EditableCTA (gradient background variant)
 */
export const EVS_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 8,
  seo: {
    ariaLabel: 'Schedule a strategy call for event video services',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\u2019s Discuss Your Video Needs',
  subtext:
    'Every event has different video requirements. Schedule a call and we\u2019ll discuss what makes sense for your goals and budget.',
  backgroundType: 'gradient',
  backgroundValue: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), linear-gradient(180deg, #0B0C0F 0%, #0B0C0F 100%)',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const EVS_SECTIONS: PageSectionContent[] = [
  EVS_HERO,
  EVS_VALUE_PROP,
  EVS_SERVICES,
  EVS_USE_CASES,
  EVS_PROCESS,
  EVS_GALLERY,
  EVS_SOCIAL_PROOF,
  EVS_FAQS,
  EVS_FINAL_CTA,
];

export const EVENT_VIDEO_SYSTEMS_PAGE_SCHEMA: PageSchema = {
  slug: 'event-video-systems',
  name: 'Event Video Systems',
  seo: {
    pageTitle: 'Event Video Systems | JHR Photography',
    metaDescription:
      'Professional event video production in Nashville. Keynote capture, highlight reels, testimonial videos, and social-ready clips for corporate events.',
    ogImage: '/images/generated/service-event-video.jpg',
    ogTitle: 'Event Video Systems\u2122 - JHR Photography',
    ogDescription:
      'Your event deserves more than photos. Capture keynotes, testimonials, and highlights that extend your event\u2019s impact.',
  },
  sections: EVS_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getEVSSectionById(sectionId: string): PageSectionContent | undefined {
  return EVS_SECTIONS.find((s) => s.id === sectionId);
}

export function getEVSContentKeyPrefix(sectionId: string): string {
  return `event-video-systems:${sectionId}`;
}
