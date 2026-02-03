/**
 * Venue Detail Page Content Schema (Reusable)
 *
 * Defines the editable structure for individual venue pages.
 * This is a reusable schema — each venue shares the same section structure
 * but with venue-specific default content.
 *
 * All 8 venue pages follow a consistent pattern:
 *   Hero → Gallery → Experience/Challenges → Spaces → Services → FAQs → CTA
 *
 * The two "original" venues (Music City Center, Gaylord Opryland) use PageHero
 * with images and animations. The remaining 6 use a simpler gradient-dark hero
 * with a Building icon placeholder image. The schema abstracts this difference.
 *
 * ============================================================================
 * SECTION MAP: Venue Detail Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | venue-{slug}:hero
 * 1          | Gallery                       | EditableImageGallery      | venue-{slug}:gallery
 * 2          | Experience / Challenges       | EditableFeatureGrid       | venue-{slug}:experience
 * 3          | Venue Spaces                  | EditableFeatureGrid       | venue-{slug}:spaces
 * 4          | Services at Venue             | EditableFeatureGrid       | venue-{slug}:services
 * 5          | FAQs                          | EditableFAQ               | venue-{slug}:faqs
 * 6          | Final CTA                     | EditableCTA               | venue-{slug}:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: venue-{slug}:{sectionId}:{elementId}
 *
 * Examples:
 *   venue-music-city-center:hero:title       - Venue hero headline
 *   venue-gaylord-opryland:experience:features - Experience checklist items
 *   venue-omni-hotel-nashville:faqs:items    - FAQ items
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  ImageGallerySectionContent,
  FeatureGridSectionContent,
  FAQSectionContent,
  CTASectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Venue Data Interface
// ============================================================================

/**
 * Venue-specific data used to populate the reusable schema.
 * Each venue provides its own data, and the schema builder
 * generates the sections from this data.
 */
export interface VenueData {
  slug: string;
  name: string;
  location: string;
  address: string;
  subtitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  galleryImages: { src: string; alt: string }[];
  experienceHeading: string;
  experienceDescription: string;
  experienceSecondary: string;
  experienceListHeading: string;
  experienceItems: string[];
  spaces: string[];
  services: { title: string; description: string; href: string; icon: string }[];
  faqs: { question: string; answer: string }[];
  ctaHeadline: string;
  ctaSubtext: string;
  ctaBackgroundImage: string;
}

// ============================================================================
// Schema Builder
// ============================================================================

/**
 * Build a complete venue detail page schema from venue-specific data.
 */
export function buildVenueDetailSchema(venue: VenueData): PageSchema {
  const pageSlug = `venue-${venue.slug}`;

  const hero: HeroSectionContent = {
    id: 'hero',
    type: 'hero',
    order: 0,
    seo: {
      ariaLabel: `${venue.name} event photography by JHR Photography`,
      sectionId: 'hero',
      dataSectionName: 'hero',
    },
    variant: 'half-height',
    title: venue.name,
    subtitle: venue.subtitle,
    description: venue.description,
    backgroundImage: {
      src: venue.heroImage,
      alt: venue.heroImageAlt,
    },
    buttons: [
      { text: 'Schedule a Strategy Call', href: '/schedule', variant: 'primary' },
    ],
  };

  const gallery: ImageGallerySectionContent = {
    id: 'gallery',
    type: 'image-gallery',
    order: 1,
    seo: {
      ariaLabel: `${venue.name} event photography gallery`,
      sectionId: 'gallery',
      dataSectionName: 'gallery',
    },
    heading: undefined,
    layout: 'grid',
    images: venue.galleryImages.map((img) => ({
      src: img.src,
      alt: img.alt,
    })),
  };

  const experience: FeatureGridSectionContent = {
    id: 'experience',
    type: 'feature-grid',
    order: 2,
    seo: {
      ariaLabel: `JHR Photography experience at ${venue.name}`,
      sectionId: 'experience',
      dataSectionName: 'experience',
    },
    heading: venue.experienceHeading,
    subheading: venue.experienceDescription,
    columns: 2,
    features: venue.experienceItems.map((item, i) => ({
      id: `experience-card-${i}`,
      icon: 'CheckCircle',
      title: item,
      description: '',
    })),
  };

  const spaces: FeatureGridSectionContent = {
    id: 'spaces',
    type: 'feature-grid',
    order: 3,
    seo: {
      ariaLabel: `Event spaces at ${venue.name}`,
      sectionId: 'spaces',
      dataSectionName: 'spaces',
    },
    heading: 'Spaces We\u2019ve Covered',
    columns: 3,
    features: venue.spaces.map((space, i) => ({
      id: `spaces-card-${i}`,
      icon: 'Building',
      title: space,
      description: '',
    })),
  };

  const services: FeatureGridSectionContent = {
    id: 'services',
    type: 'feature-grid',
    order: 4,
    seo: {
      ariaLabel: `Photography services available at ${venue.name}`,
      sectionId: 'services',
      dataSectionName: 'services',
    },
    heading: `Services at ${venue.name}`,
    columns: 3,
    features: venue.services.map((svc, i) => ({
      id: `services-card-${i}`,
      icon: svc.icon,
      title: svc.title,
      description: svc.description,
      link: { text: 'Learn More', href: svc.href },
    })),
  };

  const faqs: FAQSectionContent = {
    id: 'faqs',
    type: 'faq',
    order: 5,
    seo: {
      ariaLabel: `Frequently asked questions about photography at ${venue.name}`,
      sectionId: 'faqs',
      dataSectionName: 'faqs',
    },
    heading: `${venue.name} FAQs`,
    items: venue.faqs.map((faq, i) => ({
      id: `faqs-faq-${i}`,
      question: faq.question,
      answer: faq.answer,
    })),
  };

  const finalCta: CTASectionContent = {
    id: 'final-cta',
    type: 'cta',
    order: 6,
    seo: {
      ariaLabel: `Schedule a strategy call for your ${venue.name} event`,
      sectionId: 'final-cta',
      dataSectionName: 'final-cta',
    },
    headline: venue.ctaHeadline,
    subtext: venue.ctaSubtext,
    backgroundType: 'image',
    backgroundValue: venue.ctaBackgroundImage,
    primaryButton: {
      text: 'Schedule a Strategy Call',
      href: '/schedule',
      variant: 'primary',
    },
  };

  const sections: PageSectionContent[] = [
    hero,
    gallery,
    experience,
    spaces,
    services,
    faqs,
    finalCta,
  ];

  return {
    slug: pageSlug,
    name: venue.name,
    seo: {
      pageTitle: `${venue.name} | Event Photography | JHR Photography`,
      metaDescription: `Professional event photography at ${venue.name} in Nashville. ${venue.subtitle}. We know the venue inside and out.`,
      ogImage: venue.heroImage,
      ogTitle: `${venue.name} Event Photography | JHR Photography`,
      ogDescription: `JHR Photography has extensive experience at ${venue.name}. ${venue.subtitle}.`,
    },
    sections,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

// ============================================================================
// Venue-Specific Data
// ============================================================================

export const MUSIC_CITY_CENTER_DATA: VenueData = {
  slug: 'music-city-center',
  name: 'Music City Center',
  location: 'Downtown Nashville',
  address: '201 Rep. John Lewis Way S, Nashville, TN 37203',
  subtitle: 'Nashville\u2019s Premier Convention Center',
  description:
    'Nashville\u2019s premier convention center and the anchor of downtown\u2019s entertainment district. At 2.1 million square feet, Music City Center hosts some of the largest conferences and trade shows in the Southeast.',
  heroImage: '/images/generated/venue-music-city-center.jpg',
  heroImageAlt: 'Music City Center convention center',
  galleryImages: [
    { src: '/images/generated/event-trade-show.jpg', alt: 'Music City Center event 1' },
    { src: '/images/generated/event-keynote.jpg', alt: 'Music City Center event 2' },
    { src: '/images/generated/event-networking.jpg', alt: 'Music City Center event 3' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Music City Center event 4' },
  ],
  experienceHeading: 'Our Experience at Music City Center',
  experienceDescription:
    'We\u2019ve documented countless events at Music City Center\u2014from massive trade shows filling multiple exhibit halls to intimate executive meetings in the upper-level conference rooms.',
  experienceSecondary:
    'This isn\u2019t our first time walking through the marshaling yard or coordinating with the operations team. We know the venue, we know the protocols, and we know how to deliver without creating friction for your event.',
  experienceListHeading: 'What We Know',
  experienceItems: [
    'Extensive experience with convention-scale events',
    'Knowledge of marshaling yard procedures and load-in protocols',
    'Familiarity with hand-carry policies and restrictions',
    'Relationships with venue operations staff',
    'Understanding of lighting conditions in each space',
    'Coordination with venue-preferred AV providers',
  ],
  spaces: [
    'Grand Ballroom',
    'Davidson Ballroom',
    'Exhibit Halls A-D',
    'Meeting rooms (52 total)',
    'Outdoor terraces',
    'Pre-function spaces',
  ],
  services: [
    { title: 'Event Coverage', description: 'Comprehensive documentation of conferences, trade shows, and corporate events.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'High-volume professional headshots for trade show booths and sponsorships.', href: '/services/headshot-activation', icon: 'Users' },
    { title: 'Event Video', description: 'Keynote capture, highlight reels, and testimonials.', href: '/services/event-video-systems', icon: 'Video' },
  ],
  faqs: [
    {
      question: 'What\u2019s unique about photographing at Music City Center?',
      answer:
        'Music City Center is a massive, modern facility with excellent lighting in most spaces. The main challenge is scale\u2014coordinating coverage across multiple exhibit halls and meeting rooms requires planning and communication. We\u2019ve developed workflows that ensure comprehensive coverage without missing critical moments.',
    },
    {
      question: 'Do you handle EAC requirements for Music City Center?',
      answer:
        'Yes. We\u2019re experienced with Music City Center\u2019s Exhibitor Appointed Contractor (EAC) process. We handle our own paperwork, carry appropriate insurance, and coordinate directly with the show management office as needed.',
    },
    {
      question: 'How do you handle the marshaling yard?',
      answer:
        'We understand the marshaling yard procedures, timing windows, and hand-carry policies. For larger equipment, we coordinate load-in schedules with your general contractor. For most events, we arrive with portable equipment that doesn\u2019t require freight handling.',
    },
    {
      question: 'Can you photograph multiple concurrent sessions?',
      answer:
        'Yes. For large conferences with concurrent breakout sessions, we plan coverage strategically\u2014prioritizing based on your shot list and deploying team members across locations as needed.',
    },
  ],
  ctaHeadline: 'Planning an Event at Music City Center?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can help ensure a smooth, successful execution. We know the venue\u2014you focus on the program.',
  ctaBackgroundImage: '/images/generated/venue-music-city-center.jpg',
};

export const GAYLORD_OPRYLAND_DATA: VenueData = {
  slug: 'gaylord-opryland',
  name: 'Gaylord Opryland Resort',
  location: 'Music Valley, Nashville',
  address: '2800 Opryland Dr, Nashville, TN 37214',
  subtitle: 'Nashville\u2019s Iconic Resort & Convention Center',
  description:
    'A destination unto itself, Gaylord Opryland is one of the largest non-gaming hotels in the country. Its stunning indoor atriums, extensive meeting space, and world-class hospitality make it a premier choice for national conferences.',
  heroImage: '/images/generated/venue-gaylord-opryland.jpg',
  heroImageAlt: 'Gaylord Opryland Resort atrium',
  galleryImages: [
    { src: '/images/generated/venue-gaylord-opryland.jpg', alt: 'Gaylord Opryland event 1' },
    { src: '/images/generated/event-networking.jpg', alt: 'Gaylord Opryland event 2' },
    { src: '/images/generated/venue-hotel-ballroom.jpg', alt: 'Gaylord Opryland event 3' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Gaylord Opryland event 4' },
  ],
  experienceHeading: 'Our Gaylord Opryland Experience',
  experienceDescription:
    'We\u2019ve worked extensively at Gaylord Opryland\u2014from corporate galas in the Tennessee Ballroom to trade shows in the Ryman Exhibit Halls to intimate breakouts overlooking the Delta Atrium.',
  experienceSecondary:
    'We know the property, we know the staff, and we know how to deliver exceptional photography despite the unique challenges. Your event is in experienced hands.',
  experienceListHeading: 'What We Bring',
  experienceItems: [
    'EAC-compliant with proper insurance and credentials',
    'Deep familiarity with atrium lighting conditions',
    'Knowledge of vendor policies and restrictions',
    'Relationships with hotel operations staff',
    'Experience across all major event spaces',
    'Understanding of guest flow and photo opportunities',
  ],
  spaces: [
    'Delta Atrium',
    'Garden Conservatory',
    'Cascades Atrium',
    'Ryman Exhibit Halls',
    'Tennessee Ballroom',
    'Presidential Ballroom',
    'Multiple breakout rooms',
  ],
  services: [
    { title: 'Event Coverage', description: 'Comprehensive documentation adapted to Gaylord\u2019s unique spaces and lighting.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'High-volume headshots with controlled lighting that bypasses atrium challenges.', href: '/services/headshot-activation', icon: 'Users' },
    { title: 'Event Video', description: 'Keynotes, highlights, and testimonials capturing Gaylord\u2019s stunning environments.', href: '/services/event-video-systems', icon: 'Video' },
  ],
  faqs: [
    {
      question: 'How do you handle the lighting in the atriums?',
      answer:
        'The Delta, Cascades, and Garden Conservatory atriums have mixed lighting that changes throughout the day. We bring professional lighting equipment and calibrate settings based on the specific space and time of your event. Our experience here means we know exactly what to expect.',
    },
    {
      question: 'Are you familiar with Gaylord\u2019s vendor requirements?',
      answer:
        'Yes. We understand Gaylord\u2019s EAC (Exhibitor Appointed Contractor) process, carry appropriate insurance, and coordinate with hotel management as needed. We\u2019ve worked with their events team many times and know the protocols.',
    },
    {
      question: 'Can you photograph events in multiple areas of the resort?',
      answer:
        'Absolutely. We\u2019re familiar with the entire property\u2014from the ballrooms to the atriums to the outdoor spaces. We plan coverage strategically to capture your event wherever it takes you.',
    },
    {
      question: 'What about the humidity in the indoor gardens?',
      answer:
        'The lush indoor environments do create humidity challenges. We take precautions with equipment, allowing proper acclimation time and using protective measures. This isn\u2019t our first time dealing with it.',
    },
  ],
  ctaHeadline: 'Planning an Event at Gaylord Opryland?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can navigate Gaylord\u2019s unique requirements together. We\u2019ve done it before\u2014many times.',
  ctaBackgroundImage: '/images/generated/venue-gaylord-opryland.jpg',
};

export const RENAISSANCE_HOTEL_DATA: VenueData = {
  slug: 'renaissance-hotel-nashville',
  name: 'Renaissance Nashville Hotel',
  location: 'Downtown Nashville',
  address: '611 Commerce St, Nashville, TN 37203',
  subtitle: 'Convention Center Hotel Photography',
  description:
    'Connected directly to the Music City Center, the Renaissance Nashville is the go-to hotel for convention attendees. Its proximity and premium spaces make it ideal for overflow meetings, hospitality suites, and executive events.',
  heroImage: '/images/generated/venue-hotel-ballroom.jpg',
  heroImageAlt: 'Renaissance Nashville Hotel event space',
  galleryImages: [
    { src: '/images/generated/venue-hotel-ballroom.jpg', alt: 'Renaissance Nashville grand ballroom event setup' },
    { src: '/images/generated/event-networking.jpg', alt: 'Convention networking event at Renaissance Nashville' },
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote presentation at Renaissance Nashville' },
  ],
  experienceHeading: 'Convention-Ready Photography',
  experienceDescription:
    'The Renaissance Nashville exists in partnership with Music City Center. Convention attendees stay here, meet here, and network here. We understand this dynamic and coordinate coverage accordingly.',
  experienceSecondary:
    'Whether you need executive meeting documentation, hospitality suite photography, or seamless coverage between hotel and convention center, we\u2019ve done it before.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Seamless coordination between hotel and Music City Center',
    'Familiarity with hotel operations and staff',
    'Knowledge of lighting conditions in each space',
    'Experience with executive meetings and hospitality events',
    'Understanding of convention overflow dynamics',
  ],
  spaces: [
    'Grand Ballroom',
    'Nashville Ballroom',
    'Meeting rooms',
    'Executive boardrooms',
    'Pre-function areas',
    'Hospitality suites',
  ],
  services: [
    { title: 'Event Coverage', description: 'Executive meetings, receptions, and convention overflow events.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'Professional headshots for conference hospitality activations.', href: '/services/headshot-activation', icon: 'Camera' },
    { title: 'Event Video', description: 'Testimonials, executive interviews, and highlights.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'Can you cover events at both Renaissance and Music City Center?',
      answer:
        'Yes\u2014this is common for conventions. We can coordinate coverage between the hotel and convention center, ensuring nothing is missed as your event spans both properties.',
    },
    {
      question: 'What types of events do you photograph at the Renaissance?',
      answer:
        'Everything from executive breakfasts and board meetings to hospitality suites and reception dinners. The hotel hosts a wide variety of corporate gatherings that complement the larger convention activities next door.',
    },
    {
      question: 'How do you handle events that span multiple floors?',
      answer:
        'We plan coverage strategically based on your schedule, positioning team members where they\u2019re needed and using the hotel\u2019s efficient elevator system to move between locations as required.',
    },
  ],
  ctaHeadline: 'Planning an Event at Renaissance Nashville?',
  ctaSubtext:
    'Let\u2019s discuss your event\u2014whether it\u2019s at the Renaissance alone or spanning both the hotel and Music City Center.',
  ctaBackgroundImage: '/images/generated/venue-hotel-ballroom.jpg',
};

export const OMNI_HOTEL_DATA: VenueData = {
  slug: 'omni-hotel-nashville',
  name: 'Omni Nashville Hotel',
  location: 'Downtown Nashville',
  address: '250 Rep. John Lewis Way S, Nashville, TN 37203',
  subtitle: 'Luxury Event Photography Downtown',
  description:
    'A luxury property in the heart of downtown Nashville, the Omni is connected to the Country Music Hall of Fame and offers premium event spaces with exceptional service standards. It\u2019s the choice for high-end corporate gatherings.',
  heroImage: '/images/generated/venue-hotel-ballroom.jpg',
  heroImageAlt: 'Omni Nashville Hotel event space',
  galleryImages: [
    { src: '/images/generated/venue-hotel-ballroom.jpg', alt: 'Omni Nashville luxury event space' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Awards ceremony at Omni Nashville' },
    { src: '/images/generated/event-networking.jpg', alt: 'Corporate reception at Omni Nashville' },
  ],
  experienceHeading: 'Photography for Premium Events',
  experienceDescription:
    'The Omni Nashville sets a high bar for service and sophistication. Events here expect premium everything\u2014including photography. We understand these expectations and deliver accordingly.',
  experienceSecondary:
    'From corporate galas to executive retreats, we\u2019ve documented countless events at the Omni. We know the spaces, we know the staff, and we know how to capture images worthy of this venue.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Understanding of luxury service expectations',
    'Photography that matches the venue\u2019s premium standards',
    'Familiarity with hotel operations and staff',
    'Experience with high-profile corporate events',
    'Knowledge of rooftop and unique space logistics',
    'Coordination with Omni\u2019s events team',
  ],
  spaces: [
    'Broadway Ballroom',
    'Mockingbird Theater',
    'Rooftop venues',
    'Executive boardrooms',
    'Pre-function spaces',
    'Private dining rooms',
  ],
  services: [
    { title: 'Event Coverage', description: 'Premium documentation for galas, receptions, and corporate gatherings.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'Professional headshots for executive events and hospitality activations.', href: '/services/headshot-activation', icon: 'Camera' },
    { title: 'Event Video', description: 'Cinematic captures that showcase the venue\u2019s elegance.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'How do you approach photography at a luxury property?',
      answer:
        'Luxury venues demand luxury execution. We understand the service standards at properties like the Omni and deliver accordingly\u2014professional appearance, discrete presence, and photography quality that matches the venue\u2019s brand.',
    },
    {
      question: 'Can you photograph rooftop events?',
      answer:
        'Yes. The Omni\u2019s rooftop spaces are stunning but present unique lighting and weather considerations. We plan for variable conditions and bring equipment appropriate for outdoor environments.',
    },
    {
      question: 'What about events in the connected Country Music Hall of Fame?',
      answer:
        'We can coordinate coverage between the Omni and the Hall of Fame for events that span both properties. The venues work closely together, and so do we.',
    },
  ],
  ctaHeadline: 'Planning an Event at Omni Nashville?',
  ctaSubtext:
    'Let\u2019s discuss your event and ensure your photography matches the venue\u2019s premium standards.',
  ctaBackgroundImage: '/images/generated/venue-hotel-ballroom.jpg',
};

export const JW_MARRIOTT_DATA: VenueData = {
  slug: 'jw-marriott-nashville',
  name: 'JW Marriott Nashville',
  location: 'Downtown Nashville',
  address: '201 8th Ave S, Nashville, TN 37203',
  subtitle: 'Corporate Event Photography Downtown',
  description:
    'Nashville\u2019s largest hotel with over 500 rooms and extensive event facilities. The JW Marriott offers modern spaces, state-of-the-art technology, and premium service for corporate events of all sizes.',
  heroImage: '/images/generated/venue-hotel-ballroom.jpg',
  heroImageAlt: 'JW Marriott Nashville event space',
  galleryImages: [
    { src: '/images/generated/venue-hotel-ballroom.jpg', alt: 'JW Marriott Nashville grand ballroom' },
    { src: '/images/generated/event-trade-show.jpg', alt: 'Corporate conference at JW Marriott Nashville' },
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote session at JW Marriott Nashville' },
  ],
  experienceHeading: 'Modern Venue, Proven Experience',
  experienceDescription:
    'The JW Marriott is one of Nashville\u2019s newest and most capable event properties. Its modern design, excellent lighting, and efficient layout make it a pleasure to photograph.',
  experienceSecondary:
    'We\u2019ve documented countless corporate events here\u2014from intimate executive meetings to large-scale conferences. We know the spaces, we know the staff, and we deliver consistently excellent results.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Extensive experience in all major event spaces',
    'Knowledge of the hotel\u2019s modern lighting systems',
    'Coordination with JW Marriott events team',
    'Experience with large-scale corporate gatherings',
    'Understanding of multi-floor event logistics',
    'Familiarity with hotel operations and protocols',
  ],
  spaces: [
    'Grand Ballroom',
    'Junior Ballrooms',
    'Meeting rooms (30+)',
    'Executive boardrooms',
    'Pre-function areas',
    'Rooftop bar (private events)',
  ],
  services: [
    { title: 'Event Coverage', description: 'Comprehensive documentation of corporate events in modern spaces.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'Professional headshots for conference activations.', href: '/services/headshot-activation', icon: 'Camera' },
    { title: 'Event Video', description: 'Keynotes, highlights, and testimonials.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'What makes the JW Marriott good for photography?',
      answer:
        'The JW Marriott is a modern property with excellent built-in lighting in most spaces. The neutral decor provides clean backgrounds, and the large ballroom can accommodate substantial productions. It\u2019s one of the more photographer-friendly venues in Nashville.',
    },
    {
      question: 'Can you handle large corporate events here?',
      answer:
        'Yes. The JW Marriott hosts some of Nashville\u2019s largest corporate gatherings. We plan coverage strategically, position team members across locations, and use the hotel\u2019s efficient layout to move quickly between spaces.',
    },
    {
      question: 'How do you coordinate with hotel staff?',
      answer:
        'We establish clear communication with the hotel\u2019s events team before the event. We\u2019re familiar with their protocols, respect their operations, and work seamlessly alongside their staff.',
    },
  ],
  ctaHeadline: 'Planning an Event at JW Marriott Nashville?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can deliver exceptional photography in this modern venue.',
  ctaBackgroundImage: '/images/generated/venue-hotel-ballroom.jpg',
};

export const EMBASSY_SUITES_DATA: VenueData = {
  slug: 'embassy-suites-nashville',
  name: 'Embassy Suites Nashville Downtown',
  location: 'Downtown Nashville',
  address: '1811 Broadway, Nashville, TN 37203',
  subtitle: 'Corporate Event Photography Downtown',
  description:
    'A versatile property popular with corporate groups, Embassy Suites offers functional event spaces with the convenience of an all-suites hotel. Its central location and practical layout make it ideal for business meetings and mid-size corporate events.',
  heroImage: '/images/generated/venue-conference-room.jpg',
  heroImageAlt: 'Embassy Suites Nashville event space',
  galleryImages: [
    { src: '/images/generated/venue-conference-room.jpg', alt: 'Embassy Suites Nashville conference room' },
    { src: '/images/generated/event-networking.jpg', alt: 'Corporate meeting at Embassy Suites Nashville' },
    { src: '/images/generated/gallery-headshot-1.jpg', alt: 'Professional headshot at Embassy Suites Nashville' },
  ],
  experienceHeading: 'Practical Photography for Practical Events',
  experienceDescription:
    'Embassy Suites attracts organizations that value function over flash. Corporate meetings, training programs, and business gatherings that need documentation without drama.',
  experienceSecondary:
    'We understand this mindset. We show up, work efficiently, deliver quality images, and stay out of the way. No pretense\u2014just professional photography that serves your needs.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Familiarity with the property\u2019s versatile spaces',
    'Knowledge of atrium lighting conditions',
    'Experience with corporate meetings and trainings',
    'Coordination with hotel events staff',
    'Understanding of mid-size event logistics',
  ],
  spaces: [
    'Atrium',
    'Ballroom',
    'Conference rooms',
    'Boardrooms',
    'Pre-function areas',
  ],
  services: [
    { title: 'Event Coverage', description: 'Documentation of meetings, trainings, and corporate events.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Team Headshots', description: 'On-site headshot sessions during corporate gatherings.', href: '/services/corporate-headshot-program', icon: 'Camera' },
    { title: 'Event Video', description: 'Training captures and corporate communications.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'What types of events do you photograph at Embassy Suites?',
      answer:
        'Primarily corporate meetings, training sessions, and mid-size business events. The property attracts practical-minded organizations who need functional space and good value\u2014and we deliver photography that matches those priorities.',
    },
    {
      question: 'How do you handle the atrium environment?',
      answer:
        'The Embassy Suites atrium has mixed lighting that varies with time of day. We\u2019re experienced with this environment and adjust settings accordingly. For controlled portrait work, we use our own lighting equipment.',
    },
    {
      question: 'Can you accommodate quick-turnaround needs?',
      answer:
        'Yes. We understand that corporate events often need images quickly for same-day communications or social media. We can deliver highlight images within hours when needed.',
    },
  ],
  ctaHeadline: 'Planning an Event at Embassy Suites Nashville?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can provide practical, professional photography that serves your needs.',
  ctaBackgroundImage: '/images/generated/venue-conference-room.jpg',
};

export const CITY_WINERY_DATA: VenueData = {
  slug: 'city-winery-nashville',
  name: 'City Winery Nashville',
  location: 'Downtown Nashville',
  address: '609 Lafayette St, Nashville, TN 37203',
  subtitle: 'Unique Event Photography Downtown',
  description:
    'A unique venue combining event space with dining and live entertainment. City Winery offers an intimate atmosphere that\u2019s perfect for corporate dinners, networking receptions, and special celebrations with Nashville character.',
  heroImage: '/images/generated/event-networking.jpg',
  heroImageAlt: 'City Winery Nashville event space',
  galleryImages: [
    { src: '/images/generated/event-networking.jpg', alt: 'Networking reception at City Winery Nashville' },
    { src: '/images/generated/event-awards-ceremony.jpg', alt: 'Corporate dinner at City Winery Nashville' },
    { src: '/images/generated/gallery-headshot-2.jpg', alt: 'Executive portrait at City Winery Nashville' },
  ],
  experienceHeading: 'Capturing Nashville Character',
  experienceDescription:
    'City Winery isn\u2019t a typical corporate event space\u2014it\u2019s a venue with personality. The wine, the music, the intimate atmosphere all contribute to a unique experience worth documenting.',
  experienceSecondary:
    'We understand how to capture this character in photos. The moody lighting, the barrel room textures, the live performance energy\u2014we preserve these elements while still delivering the professional documentation you need.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Expertise with low-light entertainment environments',
    'Understanding of the venue\u2019s intimate atmosphere',
    'Experience with corporate dinners and receptions',
    'Coordination with venue events staff',
    'Knowledge of best photo locations throughout the space',
  ],
  spaces: [
    'Main venue / music hall',
    'Barrel room',
    'Private dining rooms',
    'Restaurant space',
    'Outdoor patio',
  ],
  services: [
    { title: 'Event Coverage', description: 'Corporate dinners, receptions, and celebrations with Nashville flair.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'Professional headshots during networking events and receptions.', href: '/services/headshot-activation', icon: 'Camera' },
    { title: 'Event Video', description: 'Highlights capturing the venue\u2019s unique atmosphere.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'How do you handle the low-light environment?',
      answer:
        'City Winery has moody, atmospheric lighting that creates ambiance\u2014but challenges photographers. We bring professional equipment designed for low-light conditions and know how to capture the venue\u2019s character without disrupting the mood.',
    },
    {
      question: 'Can you photograph during live performances?',
      answer:
        'Yes. We\u2019re experienced working around live entertainment. We position ourselves strategically, work quietly, and capture moments without interfering with the show or distracting guests.',
    },
    {
      question: 'What about the barrel room for private events?',
      answer:
        'The barrel room is a unique space with beautiful character. We\u2019ve photographed many private dinners and receptions there, and we know how to make the wine barrel backdrop work beautifully in photos.',
    },
  ],
  ctaHeadline: 'Planning an Event at City Winery?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can capture the unique character of this Nashville venue.',
  ctaBackgroundImage: '/images/generated/event-networking.jpg',
};

export const BELMONT_UNIVERSITY_DATA: VenueData = {
  slug: 'belmont-university',
  name: 'Belmont University',
  location: 'Belmont/Hillsboro, Nashville',
  address: '1900 Belmont Blvd, Nashville, TN 37212',
  subtitle: 'Academic & Corporate Event Photography',
  description:
    'A beautiful campus with diverse event spaces, from the grand Curb Event Center to intimate academic venues. Belmont hosts academic conferences, corporate retreats, and special events in a distinctive collegiate setting.',
  heroImage: '/images/generated/event-keynote.jpg',
  heroImageAlt: 'Belmont University campus event',
  galleryImages: [
    { src: '/images/generated/event-keynote.jpg', alt: 'Keynote presentation at Belmont University' },
    { src: '/images/generated/event-trade-show.jpg', alt: 'Academic conference at Belmont University' },
    { src: '/images/generated/gallery-headshot-3.jpg', alt: 'Professional headshot at Belmont University event' },
  ],
  experienceHeading: 'Campus Photography Expertise',
  experienceDescription:
    'Belmont University offers a unique setting\u2014historic architecture, modern facilities, and a beautiful campus that provides distinctive backdrops for corporate and academic events.',
  experienceSecondary:
    'We\u2019ve worked throughout the campus, from the grand Curb Event Center to intimate seminar rooms. We understand the university environment and deliver photography that captures both the event and the setting.',
  experienceListHeading: 'Our Experience',
  experienceItems: [
    'Knowledge of Belmont\u2019s diverse campus venues',
    'Experience with academic conferences and symposiums',
    'Understanding of university protocols and access',
    'Photography for corporate retreats on campus',
    'Coordination with Belmont events staff',
    'Coverage of performances and special events',
  ],
  spaces: [
    'Curb Event Center',
    'McAfee Concert Hall',
    'Massey Performing Arts Center',
    'Johnson Center',
    'Academic conference rooms',
    'Campus outdoor venues',
  ],
  services: [
    { title: 'Event Coverage', description: 'Conferences, retreats, and academic events in a collegiate setting.', href: '/services/corporate-event-coverage', icon: 'Camera' },
    { title: 'Headshot Activation', description: 'Professional headshots for conference attendees and participants.', href: '/services/headshot-activation', icon: 'Camera' },
    { title: 'Event Video', description: 'Keynotes, performances, and campus event highlights.', href: '/services/event-video-systems', icon: 'Camera' },
  ],
  faqs: [
    {
      question: 'What types of events do you photograph at Belmont?',
      answer:
        'Everything from academic conferences and corporate retreats to performances at the Curb Event Center and McAfee Concert Hall. Belmont hosts a wide variety of events, and we\u2019ve covered most types.',
    },
    {
      question: 'How do you navigate the campus logistics?',
      answer:
        'We\u2019re familiar with Belmont\u2019s campus, including parking, venue access, and the university\u2019s operational protocols. We coordinate with Belmont\u2019s events team in advance to ensure smooth execution.',
    },
    {
      question: 'Can you cover events in multiple campus locations?',
      answer:
        'Yes. We plan coverage strategically across venues, understanding the walking times and logistics of moving between locations. We ensure nothing is missed even when events span multiple buildings.',
    },
  ],
  ctaHeadline: 'Planning an Event at Belmont University?',
  ctaSubtext:
    'Let\u2019s discuss your event and how we can capture it within this beautiful campus setting.',
  ctaBackgroundImage: '/images/generated/event-keynote.jpg',
};

// ============================================================================
// All Venue Data
// ============================================================================

export const ALL_VENUE_DATA: VenueData[] = [
  MUSIC_CITY_CENTER_DATA,
  GAYLORD_OPRYLAND_DATA,
  RENAISSANCE_HOTEL_DATA,
  OMNI_HOTEL_DATA,
  JW_MARRIOTT_DATA,
  EMBASSY_SUITES_DATA,
  CITY_WINERY_DATA,
  BELMONT_UNIVERSITY_DATA,
];

// ============================================================================
// Pre-built Schemas
// ============================================================================

export const MUSIC_CITY_CENTER_SCHEMA = buildVenueDetailSchema(MUSIC_CITY_CENTER_DATA);
export const GAYLORD_OPRYLAND_SCHEMA = buildVenueDetailSchema(GAYLORD_OPRYLAND_DATA);
export const RENAISSANCE_HOTEL_SCHEMA = buildVenueDetailSchema(RENAISSANCE_HOTEL_DATA);
export const OMNI_HOTEL_SCHEMA = buildVenueDetailSchema(OMNI_HOTEL_DATA);
export const JW_MARRIOTT_SCHEMA = buildVenueDetailSchema(JW_MARRIOTT_DATA);
export const EMBASSY_SUITES_SCHEMA = buildVenueDetailSchema(EMBASSY_SUITES_DATA);
export const CITY_WINERY_SCHEMA = buildVenueDetailSchema(CITY_WINERY_DATA);
export const BELMONT_UNIVERSITY_SCHEMA = buildVenueDetailSchema(BELMONT_UNIVERSITY_DATA);

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get a venue schema by slug.
 */
export function getVenueSchemaBySlug(slug: string): PageSchema | undefined {
  const venue = ALL_VENUE_DATA.find((v) => v.slug === slug);
  if (!venue) return undefined;
  return buildVenueDetailSchema(venue);
}

/**
 * Get a section from a venue's schema by section ID.
 */
export function getVenueSectionById(slug: string, sectionId: string): PageSectionContent | undefined {
  const schema = getVenueSchemaBySlug(slug);
  if (!schema) return undefined;
  return schema.sections.find((s) => s.id === sectionId);
}

/**
 * Get the content key prefix for a venue section.
 */
export function getVenueContentKeyPrefix(slug: string, sectionId: string): string {
  return `venue-${slug}:${sectionId}`;
}
