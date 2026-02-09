/**
 * Corporate Event Coverage Service Page Content Schema
 *
 * Full layout overhaul matching v3 reference document.
 * 15 sections: hero, logo marquee, problem text, solution grid, portfolio gallery,
 * event types, after-hours columns, filmstrip gallery, process journey,
 * deliverables grid, multi-day callout, video bundling, testimonials, FAQs, final CTA.
 *
 * ============================================================================
 * SECTION MAP
 * ============================================================================
 *
 * #  | Section                          | Component              | ID
 * ---|----------------------------------|------------------------|-------------------
 * 0  | Hero (full-height)               | EditableHero           | hero
 * 1  | Logo Marquee                     | EditableFeatureGrid    | logo-marquee
 * 2  | The Real Cost (problem)          | EditableTextBlock      | problem
 * 3  | What We Deliver (solution)       | EditableFeatureGrid    | solution
 * 4  | Coverage Gallery (grid)          | EditableImageGallery   | gallery
 * 5  | Events We Cover                  | EditableFeatureGrid    | event-types
 * 6  | After Hours (columns: text+img)  | EditableColumns        | after-hours
 * 7  | Filmstrip Gallery                | EditableImageGallery   | filmstrip
 * 8  | How It Works (journey)           | EditableFeatureGrid    | how-it-works
 * 9  | What's Included (deliverables)   | EditableFeatureGrid    | deliverables
 * 10 | Multi-Day Callout                | EditableTextBlock      | multi-day
 * 11 | Video Bundling                   | EditableFeatureGrid    | video-bundling
 * 12 | Testimonials                     | EditableTestimonials   | social-proof
 * 13 | FAQs                             | EditableFAQ            | faqs
 * 14 | Final CTA                        | EditableCTA            | final-cta
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
  TextBlockSectionContent,
  ImageGallerySectionContent,
  ColumnsSectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
  FAQSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section 0: Hero (full-height)
// ============================================================================

export const CEC_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Corporate event coverage service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Your Event Took Months to Plan. The Media Should Prove It.',
  subtitle: 'Corporate Event Coverage\u2122',
  description:
    '<p>When your organization invests in bringing people together \u2014 for a conference, an annual meeting, a leadership retreat, or a training summit \u2014 the media should capture more than what happened. It should capture why it mattered. We help internal teams and event owners deliver professional, on-brand documentation that serves your organization long after the last session ends.</p><p>Photography and media coverage for conferences, off-sites, association events, training programs, and corporate milestones \u2014 executed by certified, Nashville-based operators who understand executive audiences and organizational standards.</p>',
  backgroundImage: {
    src: '/images/generated/service-event-coverage.jpg',
    alt: 'Professional event photography at corporate conference in Nashville',
  },
  buttons: [
    { text: 'Talk With Our Team', href: '/schedule', variant: 'primary' },
    { text: 'Check Availability', href: '/contact', variant: 'secondary' },
  ],
};

// ============================================================================
// Section 1: Logo Marquee
// ============================================================================

export const CEC_LOGO_MARQUEE: FeatureGridSectionContent = {
  id: 'logo-marquee',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Trusted by leading organizations',
    sectionId: 'logo-marquee',
    dataSectionName: 'logo-marquee',
  },
  columns: 4,
  displayMode: 'logo-scroll',
  features: [
    { id: 'logo-0', icon: 'Building2', title: 'Nissan', description: '' },
    { id: 'logo-1', icon: 'Building2', title: 'Bridgestone', description: '' },
    { id: 'logo-2', icon: 'Building2', title: 'HCA Healthcare', description: '' },
    { id: 'logo-3', icon: 'Building2', title: 'Deloitte', description: '' },
    { id: 'logo-4', icon: 'Building2', title: 'Vanderbilt', description: '' },
    { id: 'logo-5', icon: 'Building2', title: 'Asurion', description: '' },
    { id: 'logo-6', icon: 'Building2', title: 'Amazon', description: '' },
    { id: 'logo-7', icon: 'Building2', title: 'Nashville Convention Bureau', description: '' },
    { id: 'logo-8', icon: 'Building2', title: 'Pinnacle Financial', description: '' },
    { id: 'logo-9', icon: 'Building2', title: 'Ingram Industries', description: '' },
  ],
};

// ============================================================================
// Section 2: The Real Cost (Problem — text block)
// ============================================================================

export const CEC_PROBLEM: TextBlockSectionContent = {
  id: 'problem',
  type: 'text-block',
  order: 2,
  seo: {
    ariaLabel: 'Why intentional event media coverage matters',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'Months of Work Shouldn\u2019t Vanish When the Lights Go Down',
  content:
    '<p>You coordinated the speakers, managed the budget, aligned the stakeholders, and made sure every detail landed. But without intentional media coverage, a three-day conference becomes a memory instead of an asset. The photos end up in a folder no one opens. The keynote moments go undocumented. The content your marketing and recruiting teams could have used for the next twelve months never gets captured.</p><p><em>The event happened. But without the right media, the value of the event stays in the room.</em></p>',
  alignment: 'center',
};

// ============================================================================
// Section 3: What We Deliver (Solution — 2-col feature grid)
// ============================================================================

export const CEC_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'What corporate event coverage delivers',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'A Professional Media Library From a Single Event',
  subheading:
    'Corporate Event Coverage isn\u2019t just "having a photographer there." It\u2019s intentional documentation designed to produce assets your organization can use across marketing, recruiting, internal communications, and stakeholder reporting \u2014 all year long.',
  columns: 2,
  features: [
    {
      id: 'solution-card-0',
      icon: 'Presentation',
      title: 'The Big Stage',
      description:
        'General sessions, keynote speakers, panel discussions, and main stage programming. We document the moments your attendees came for \u2014 and the ones your leadership team wants to see reflected in every piece of content that follows.',
    },
    {
      id: 'solution-card-1',
      icon: 'BookOpen',
      title: 'The Breakout Rooms',
      description:
        'Workshops, training sessions, certification programs, and smaller group programming. These are the rooms where real engagement happens, and they\u2019re often the most underdocumented part of any event.',
    },
    {
      id: 'solution-card-2',
      icon: 'MessageCircle',
      title: 'The In-Between',
      description:
        'Hallway conversations, registration energy, attendee interactions, sponsor moments, and the unscripted connections that make an event feel alive. This is where your best social and recruiting content comes from.',
    },
    {
      id: 'solution-card-3',
      icon: 'Tag',
      title: 'The Branded Details',
      description:
        'Signage, stage design, sponsor recognition, environmental branding, and the visual details your team spent weeks building. These images serve your sponsors, your partners, and your internal reporting.',
    },
  ],
};

// ============================================================================
// Section 4: Portfolio Gallery ("Coverage That Tells the Full Story")
// ============================================================================

export const CEC_GALLERY: ImageGallerySectionContent = {
  id: 'gallery',
  type: 'image-gallery',
  order: 4,
  seo: {
    ariaLabel: 'Corporate event photography portfolio gallery',
    sectionId: 'gallery',
    dataSectionName: 'gallery',
  },
  heading: 'Coverage That Tells the Full Story',
  layout: 'masonry',
  images: [
    { src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', alt: 'Keynote speaker at corporate conference', caption: 'Keynote Sessions' },
    { src: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80', alt: 'Conference networking event', caption: 'Networking' },
    { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', alt: 'Panel discussion at corporate event', caption: 'Panels' },
    { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', alt: 'Main stage at conference', caption: 'Main Stage' },
    { src: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=1200&q=80', alt: 'Breakout session workshop', caption: 'Breakout Sessions' },
    { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80', alt: 'Candid moment at corporate event', caption: 'Candid Moments' },
  ],
};

// ============================================================================
// Section 5: Events We Cover (feature grid)
// ============================================================================

export const CEC_EVENT_TYPES: FeatureGridSectionContent = {
  id: 'event-types',
  type: 'feature-grid',
  order: 5,
  seo: {
    ariaLabel: 'Types of corporate events we cover',
    sectionId: 'event-types',
    dataSectionName: 'event-types',
  },
  heading: 'Built for the Events That Define Your Organization',
  subheading:
    'Every organization brings people together differently. Here\u2019s how we support the events that matter most to yours.',
  columns: 2,
  features: [
    {
      id: 'event-type-0',
      icon: 'CalendarDays',
      title: 'Annual Conferences & Association Events',
      description:
        'Your annual meeting is the one event your members, employees, or stakeholders judge your organization by. We capture the keynotes, the awards, the networking, and the energy \u2014 delivering a media library that supports communications and reporting for the year ahead.',
    },
    {
      id: 'event-type-1',
      icon: 'Users',
      title: 'Leadership Off-Sites & Retreats',
      description:
        'Smaller audiences, higher stakes. These events produce the strategic conversations and team-building moments your leadership team wants documented \u2014 but documented carefully. We understand executive audiences and the discretion required.',
    },
    {
      id: 'event-type-2',
      icon: 'GraduationCap',
      title: 'Training & Certification Programs',
      description:
        'When your organization invests in developing its people, the media should reflect that investment. We document the sessions, the instructors, and the moments of engagement \u2014 content your HR and L&D teams can use for recruiting and reporting.',
    },
    {
      id: 'event-type-3',
      icon: 'Award',
      title: 'Milestones, Awards & Recognition Events',
      description:
        'Company anniversaries, award ceremonies, employee recognition programs, and milestone celebrations. These events tell your organization\u2019s story \u2014 and the media should match the significance.',
    },
    {
      id: 'event-type-4',
      icon: 'Calendar',
      title: 'Multi-Day Conventions & Summits',
      description:
        'Multi-day events require consistent documentation across the full arc of the program. We maintain coverage quality and energy from opening session to closing remarks, delivering a unified gallery that tells the complete story.',
    },
  ],
};

// ============================================================================
// Section 6: After Hours (columns — text left, image right)
// ============================================================================

const afterHoursText: TextBlockSectionContent = {
  id: 'after-hours-text',
  type: 'text-block',
  order: 0,
  seo: { dataSectionName: 'after-hours-text' },
  heading: 'Your Event Doesn\u2019t Stop When the Sessions End',
  content:
    '<p>Most corporate events include a social component \u2014 a welcome reception, a networking dinner, a happy hour, a closing celebration. These moments produce some of the most shareable, authentic content of the entire program. But they require a different approach than daytime session coverage.</p>' +
    '<p>Our Social & Networking Media Package\u2122 is designed specifically for these high-energy, fast-moving environments. We capture the candid interactions, the group photos, the venue atmosphere, and the brand moments \u2014 then deliver same-day highlights and ready-to-post social content so your marketing team can share while the event is still trending.</p>' +
    '<ul><li>Up to 3 hours of dedicated social event coverage</li>' +
    '<li>Same-day highlight delivery (5\u201310 images for immediate posting)</li>' +
    '<li>2 Instagram Reels (rapid-produced video/photo compilations)</li>' +
    '<li>24-hour full gallery delivery</li>' +
    '<li>Designed for social media and marketing collateral \u2014 not just documentation</li></ul>' +
    '<p><a href="/services/social-networking-media">Learn More About Social & Networking Media \u2192</a></p>' +
    '<p><em>Or ask about bundling it with your event coverage \u2014 most multi-day events include both.</em></p>',
  alignment: 'left',
};

const afterHoursImage: ImageGallerySectionContent = {
  id: 'after-hours-image',
  type: 'image-gallery',
  order: 0,
  seo: { dataSectionName: 'after-hours-image' },
  layout: 'single',
  images: [
    {
      src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
      alt: 'Networking reception at corporate event',
    },
  ],
};

export const CEC_AFTER_HOURS: ColumnsSectionContent = {
  id: 'after-hours',
  type: 'columns',
  order: 6,
  seo: {
    ariaLabel: 'Social and networking media coverage for corporate events',
    sectionId: 'after-hours',
    dataSectionName: 'after-hours',
  },
  layout: 'equal-2',
  columns: [
    { sections: [afterHoursText] },
    { sections: [afterHoursImage] },
  ],
};

// ============================================================================
// Section 7: Filmstrip Gallery ("Moments That Define the Experience")
// ============================================================================

export const CEC_FILMSTRIP: ImageGallerySectionContent = {
  id: 'filmstrip',
  type: 'image-gallery',
  order: 7,
  seo: {
    ariaLabel: 'Event highlight moments filmstrip gallery',
    sectionId: 'filmstrip',
    dataSectionName: 'filmstrip',
  },
  heading: 'Moments That Define the Experience',
  layout: 'filmstrip',
  images: [
    { src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=640&q=80', alt: 'Speaker on stage at leadership summit', caption: 'Keynote Address' },
    { src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=640&q=80', alt: 'Team group photo at awards gala', caption: 'Team Recognition' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=640&q=80', alt: 'Audience engaged at national conference', caption: 'Audience Engagement' },
    { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&q=80', alt: 'Executive networking at industry reception', caption: 'Executive Networking' },
    { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80', alt: 'Conference wide shot at Music City Center', caption: 'Venue Coverage' },
    { src: 'https://images.unsplash.com/photo-1587825140708-dfaf18c4f4d4?w=640&q=80', alt: 'Award ceremony at corporate gala', caption: 'Award Presentation' },
    { src: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=640&q=80', alt: 'Breakout session at training workshop', caption: 'Breakout Sessions' },
    { src: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=640&q=80', alt: 'Sponsor activation at trade show', caption: 'Sponsor Activation' },
  ],
};

// ============================================================================
// Section 8: How It Works (journey display mode)
// ============================================================================

export const CEC_HOW_IT_WORKS: FeatureGridSectionContent = {
  id: 'how-it-works',
  type: 'feature-grid',
  order: 8,
  seo: {
    ariaLabel: 'How corporate event coverage works with JHR Photography',
    sectionId: 'how-it-works',
    dataSectionName: 'how-it-works',
  },
  heading: 'A Clear Process From Planning to Delivery',
  subheading:
    'We\u2019ve covered hundreds of corporate events in Nashville. The process is simple because it\u2019s been refined through repetition.',
  columns: 3,
  displayMode: 'journey',
  features: [
    {
      id: 'how-it-works-card-0',
      icon: 'Phone',
      title: 'We Align on What Matters',
      description:
        'A focused conversation about your event \u2014 the programming, the stakeholders, the moments that matter most, and how the media will be used afterward. We build our coverage plan around your priorities, not a generic shot list.',
    },
    {
      id: 'how-it-works-card-1',
      icon: 'Camera',
      title: 'We Deploy and Execute',
      description:
        'Our certified operators arrive prepared \u2014 familiar with the venue, aligned to your brand standards, and ready to integrate into your event flow. You won\u2019t need to direct us. We know what to capture and when.',
    },
    {
      id: 'how-it-works-card-2',
      icon: 'Send',
      title: 'You Receive a Curated Gallery',
      description:
        'A professionally curated gallery delivered within 72 hours \u2014 organized, retouched, and ready for your marketing team, your sponsors, your internal comms, and your leadership. Same-day highlights available for immediate social posting.',
    },
  ],
};

// ============================================================================
// Section 9: What's Included (deliverables — 2-col feature grid)
// ============================================================================

export const CEC_DELIVERABLES: FeatureGridSectionContent = {
  id: 'deliverables',
  type: 'feature-grid',
  order: 9,
  seo: {
    ariaLabel: 'What is included in corporate event coverage',
    sectionId: 'deliverables',
    dataSectionName: 'deliverables',
  },
  heading: 'Complete Coverage. Professional Delivery. No Gaps.',
  subheading:
    'Every Corporate Event Coverage engagement is designed to capture the full story of your event \u2014 not just the highlights. Here\u2019s what your organization receives.',
  columns: 2,
  features: [
    { id: 'deliv-0', icon: 'CheckCircle', title: 'Certified Operator, Full Day', description: 'A JHR certified operator deployed for the full duration of your event. Trained, vetted, and experienced with Nashville\u2019s top corporate venues.' },
    { id: 'deliv-1', icon: 'CheckCircle', title: 'Keynote & General Session Coverage', description: 'Main stage programming documented with attention to speaker moments, audience engagement, and environmental context.' },
    { id: 'deliv-2', icon: 'CheckCircle', title: 'Breakout & Workshop Coverage', description: 'Smaller sessions captured with the same professionalism as the main stage. We rotate through your programming to ensure full representation.' },
    { id: 'deliv-3', icon: 'CheckCircle', title: 'Networking & Candid Documentation', description: 'The hallway conversations, the registration energy, the coffee break connections. These moments produce some of your most valuable content.' },
    { id: 'deliv-4', icon: 'CheckCircle', title: 'Sponsor & Brand Imaging', description: 'Signage, branding, sponsor activations, and exhibitor presence documented for partner reporting and stakeholder communications.' },
    { id: 'deliv-5', icon: 'CheckCircle', title: 'Same-Day Highlights', description: '5\u201310 curated images delivered the same day for immediate social media posting and real-time event promotion.' },
    { id: 'deliv-6', icon: 'CheckCircle', title: 'Curated Gallery \u2014 72-Hour Delivery', description: 'Your full event gallery, professionally curated and retouched, delivered within 72 hours of event completion.' },
    { id: 'deliv-7', icon: 'CheckCircle', title: 'Full Commercial License', description: 'Every image delivered with a Standard Commercial License covering website, social media, internal communications, recruiting, and partner sharing.' },
    { id: 'deliv-8', icon: 'CheckCircle', title: 'Final Frame Guarantee\u2122', description: 'Every delivered image meets JHR\u2019s professional quality standard. If it doesn\u2019t meet the mark, we make it right.' },
  ],
};

// ============================================================================
// Section 10: Multi-Day Callout (text block)
// ============================================================================

export const CEC_MULTI_DAY: TextBlockSectionContent = {
  id: 'multi-day',
  type: 'text-block',
  order: 10,
  seo: {
    ariaLabel: 'Multi-day event coverage capabilities',
    sectionId: 'multi-day',
    dataSectionName: 'multi-day',
  },
  heading: 'Multi-Day Events and Concurrent Sessions? We\u2019ve Done This Before.',
  content:
    '<p>If your event spans multiple days, runs concurrent breakout sessions, or requires coverage across different venue spaces, we scale to match. Additional operators deploy seamlessly \u2014 coordinated through a single JHR team, delivering a unified gallery that covers the full scope of your program.</p>' +
    '<p>You don\u2019t manage multiple vendors. You don\u2019t brief separate photographers. You talk to one team, and the coverage matches the complexity of your event.</p>' +
    '<p><em>We\u2019ll discuss your event\u2019s format during our planning conversation and recommend the right operator count and coverage structure based on your programming.</em></p>',
  alignment: 'left',
};

// ============================================================================
// Section 11: Video Bundling (3-col feature grid)
// ============================================================================

export const CEC_VIDEO_BUNDLING: FeatureGridSectionContent = {
  id: 'video-bundling',
  type: 'feature-grid',
  order: 11,
  seo: {
    ariaLabel: 'Add video to your corporate event coverage',
    sectionId: 'video-bundling',
    dataSectionName: 'video-bundling',
  },
  heading: 'Photography + Video. One Team. One Coordinated Delivery.',
  subheading:
    'Most corporate events benefit from more than photography alone. When you add an Event Video System \u2014 whether it\u2019s a highlight reel, attendee testimonials, or executive leadership messaging \u2014 you get a complete media library from one coordinated team.',
  columns: 3,
  features: [
    {
      id: 'video-0',
      icon: 'Video',
      title: 'Event Highlight System\u2122',
      description:
        'A professionally edited 2-minute video capturing the energy and story of your event. Ideal for post-event marketing, social media, and member communications.',
      link: { text: 'Learn about Event Video Systems', href: '/services/event-video-systems' },
    },
    {
      id: 'video-1',
      icon: 'Mic',
      title: 'Event Highlight + Vox System\u2122',
      description:
        'Everything in the Highlight System plus up to 4 on-site attendee or speaker interviews. Adds authentic voices to your event story.',
      link: { text: 'Learn about Event Video Systems', href: '/services/event-video-systems' },
    },
    {
      id: 'video-2',
      icon: 'Clapperboard',
      title: 'Executive Story System\u2122',
      description:
        'Dedicated multi-camera interview production for leadership messaging, recruiting content, and brand storytelling. Evergreen content for 12\u201318 months.',
      link: { text: 'Learn about Event Video Systems', href: '/services/event-video-systems' },
    },
  ],
};

// ============================================================================
// Section 12: Testimonials (carousel, light variant)
// ============================================================================

export const CEC_TESTIMONIALS: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 12,
  seo: {
    ariaLabel: 'Client testimonials for corporate event coverage',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'The Media Matched the Event',
  layout: 'carousel',
  cardVariant: 'light',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'JHR covered our three-day annual conference and delivered a gallery our marketing team has used every month since. That\u2019s never happened with a photographer before.',
      authorName: 'Conference Director',
      authorTitle: 'National Association',
    },
    {
      id: 'social-proof-1',
      quote:
        'They operated like part of our team. No direction needed, no missed moments. Our sponsors were thrilled with the documentation they received.',
      authorName: 'Event Manager',
      authorTitle: 'Enterprise Marketing',
    },
    {
      id: 'social-proof-2',
      quote:
        'The media supported our member engagement all year. Sponsors saw their visibility documented professionally, and our board finally had content that reflected the scale of what we produce.',
      authorName: 'Executive Director',
      authorTitle: 'Industry Association',
    },
  ],
};

// ============================================================================
// Section 13: FAQs (expanded — 13 questions)
// ============================================================================

export const CEC_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 13,
  seo: {
    ariaLabel: 'Frequently asked questions about corporate event coverage',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Corporate Event Coverage FAQs',
  items: [
    {
      id: 'faq-0',
      question: 'What\u2019s the difference between Corporate Event Coverage and Trade-Show Media Services?',
      answer:
        '<p>Corporate Event Coverage is designed for events where your organization is the host \u2014 conferences, annual meetings, leadership retreats, training summits, and association events. The focus is on your programming, your speakers, your attendees, and your organizational brand. Trade-Show Media Services is designed for exhibitor environments where the focus is on booth coverage, sponsor documentation, and show floor energy. If you\u2019re hosting the event, Corporate Event Coverage is the right fit. If you\u2019re exhibiting at someone else\u2019s event, <a href="/services/trade-show-media">Trade-Show Media Services</a> is built for that.</p>',
    },
    {
      id: 'faq-1',
      question: 'We have breakout sessions running at the same time. Can you cover all of them?',
      answer:
        '<p>Yes. For events with concurrent programming, we deploy additional operators so sessions happening simultaneously all receive professional coverage. We\u2019ll discuss your schedule during planning and recommend the right number of operators. You\u2019ll receive a single unified gallery \u2014 not separate deliveries from separate photographers.</p>',
    },
    {
      id: 'faq-2',
      question: 'How do you decide what to cover during a full-day event?',
      answer:
        '<p>We build a coverage plan based on your priorities during our alignment conversation. We ask about the moments that matter most to your stakeholders \u2014 the keynote speakers, the CEO address, the breakout content, the sponsor activations, the networking interactions. We don\u2019t need a shot list from you \u2014 we need to understand what success looks like for your organization.</p>',
    },
    {
      id: 'faq-3',
      question: 'Our event includes a networking reception and a social dinner. Is that covered?',
      answer:
        '<p>It can be. If your event includes social functions \u2014 welcome receptions, happy hours, dinners, award galas \u2014 we offer our <a href="/services/social-networking-media">Social & Networking Media Package\u2122</a> specifically designed for those environments. It\u2019s a different format than daytime session coverage: faster pace, social-first content, same-day highlights, and ready-to-post reels. Most multi-day events bundle it with Corporate Event Coverage so the full program is documented by one team.</p>',
    },
    {
      id: 'faq-4',
      question: 'How quickly do we receive our photos?',
      answer:
        '<p>Same-day highlights \u2014 5 to 10 curated images \u2014 are delivered during or immediately after each day\u2019s programming for real-time social media posting. Your full curated gallery is delivered within 72 hours of event completion. For multi-day events, we can deliver day-by-day galleries if your marketing team needs assets rolling out during the event.</p>',
    },
    {
      id: 'faq-5',
      question: 'Can we use the photos for our website, social media, and marketing materials?',
      answer:
        '<p>Yes. Every Corporate Event Coverage engagement includes a Standard Commercial License that covers your owned media \u2014 website, social channels, internal presentations, member communications, recruiting materials, and sponsor or partner sharing. If you need extended rights for broadcast or paid advertising, we can discuss Extended Licensing.</p>',
    },
    {
      id: 'faq-6',
      question: 'Do you understand executive audiences? Our leadership team will be front and center.',
      answer:
        '<p>We do \u2014 and this is one of the reasons organizations choose JHR over general event photographers. Our operators are trained to work in executive environments with discretion, professionalism, and awareness of how leadership wants to be represented. If your event includes dedicated executive headshots, those are handled through our <a href="/services/executive-imaging">Executive Imaging\u2122</a> service, which can be bundled with event coverage.</p>',
    },
    {
      id: 'faq-7',
      question: 'We\u2019re an association with annual events. Can you handle recurring coverage year over year?',
      answer:
        '<p>Yes, and this is where a long-term partnership creates real value. When we cover your event year after year, we already know the venue, the programming rhythm, the stakeholders, and the brand standards. There\u2019s no ramp-up. Your second year with JHR is smoother than the first, and it keeps getting better.</p>',
    },
    {
      id: 'faq-8',
      question: 'Can you also capture video at our event?',
      answer:
        '<p>Yes. We offer several <a href="/services/event-video-systems">Event Video Systems\u2122</a> that pair directly with photography coverage \u2014 including highlight reels, attendee testimonials, and dedicated executive interview production. When bundled, photography and video are coordinated by a single team with a unified delivery timeline.</p>',
    },
    {
      id: 'faq-9',
      question: 'What Nashville venues do you work in?',
      answer:
        '<p>We\u2019ve covered corporate events at virtually every major Nashville venue \u2014 including <a href="/venues/gaylord-opryland">Gaylord Opryland</a>, <a href="/venues/music-city-center">Music City Center</a>, <a href="/venues/renaissance-hotel-nashville">Renaissance Nashville</a>, the JW Marriott, the Grand Hyatt, the Omni, Loews Vanderbilt, and dozens of others. We know the layouts, the lighting conditions, the load-in logistics, and the staff.</p>',
    },
    {
      id: 'faq-10',
      question: 'How far in advance should we book event coverage?',
      answer:
        '<p>For major conferences and multi-day events, we recommend 6\u20138 weeks minimum. For single-day events, 3\u20134 weeks is usually sufficient. Nashville\u2019s convention calendar fills up fast \u2014 especially during peak season (spring and fall) \u2014 so earlier is always better. Reach out even if your timeline is tight. We\u2019ll be direct about whether we can support it.</p>',
    },
    {
      id: 'faq-11',
      question: 'Do we need to provide a detailed shot list?',
      answer:
        '<p>No. We don\u2019t work from prescriptive shot lists \u2014 we work from a shared understanding of your priorities and stakeholders. During our alignment conversation, we\u2019ll learn what matters most and build our coverage plan around that. Our operators are trained to recognize and capture the moments that serve your brand. That said, if there are specific must-capture moments, we absolutely want to know about them in advance.</p>',
    },
  ],
};

// ============================================================================
// Section 14: Final CTA
// ============================================================================

export const CEC_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 14,
  seo: {
    ariaLabel: 'Schedule a strategy call for corporate event coverage',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Your Organization\u2019s Next Event Deserves Media That Lasts.',
  subtext:
    'Tell us about your event \u2014 the venue, the timeline, and what your team needs from the media. We\u2019ll show you exactly how we support it and give you a clear picture of what to expect.',
  backgroundType: 'solid',
  backgroundValue: '#111318',
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
// Complete Page Schema
// ============================================================================

export const CEC_SECTIONS: PageSectionContent[] = [
  CEC_HERO,
  CEC_LOGO_MARQUEE,
  CEC_PROBLEM,
  CEC_SOLUTION,
  CEC_GALLERY,
  CEC_EVENT_TYPES,
  CEC_AFTER_HOURS,
  CEC_FILMSTRIP,
  CEC_HOW_IT_WORKS,
  CEC_DELIVERABLES,
  CEC_MULTI_DAY,
  CEC_VIDEO_BUNDLING,
  CEC_TESTIMONIALS,
  CEC_FAQS,
  CEC_FINAL_CTA,
];

export const CORPORATE_EVENT_COVERAGE_PAGE_SCHEMA: PageSchema = {
  slug: 'corporate-event-coverage',
  name: 'Corporate Event Coverage',
  seo: {
    pageTitle: 'Corporate Event Coverage | JHR Photography',
    metaDescription:
      'Professional corporate event photography in Nashville. Same-day highlights, 72-hour gallery delivery, and comprehensive coverage for conferences, summits, and organizational events.',
    ogImage: '/images/generated/service-event-coverage.jpg',
    ogTitle: 'Corporate Event Coverage\u2122 - JHR Photography',
    ogDescription:
      'Your event took months to plan. The media should prove it. Professional event coverage with same-day delivery in Nashville.',
    primarySEOFocus: 'corporate event photography Nashville',
    secondarySEOSignals: [
      'conference photographer Nashville',
      'corporate event coverage',
      'same-day event photos',
      'association event photography',
    ],
    geoEntitySignals: [
      'Nashville TN',
      'Music City Center',
      'Gaylord Opryland',
      'JW Marriott Nashville',
    ],
  },
  sections: CEC_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 2,
};

// ============================================================================
// Helpers
// ============================================================================

export function getCECSectionById(sectionId: string): PageSectionContent | undefined {
  return CEC_SECTIONS.find((s) => s.id === sectionId);
}

export function getCECContentKeyPrefix(sectionId: string): string {
  return `corporate-event-coverage:${sectionId}`;
}
