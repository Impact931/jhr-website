/**
 * Headshot Activation Service Page Content Schema
 *
 * Defines the editable structure for the Headshot Activation service page.
 * Maps each section to an editable component type with default content.
 *
 * Two primary audiences:
 *  1. Exhibitors / Field Marketers (booth traffic, lead capture, ROI)
 *  2. Event Hosts / Corporate Organizers (attendee benefit, brand elevation)
 *
 * ============================================================================
 * SECTION MAP: Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|-------------------------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | headshot-activation:hero
 * 1          | Stats Bar                     | EditableStats             | headshot-activation:stats
 * 2          | The Booth Problem (Empathy)   | EditableTextBlock         | headshot-activation:problem
 * 3          | How It Works (Solution)       | EditableFeatureGrid       | headshot-activation:solution
 * 4          | Gallery Strip 1               | EditableFeatureGrid       | headshot-activation:gallery-strip-1
 * 5          | Two Ways to Activate          | EditableTabbedContent     | headshot-activation:use-cases
 * 6          | What's Included               | EditableFeatureGrid       | headshot-activation:whats-included
 * 7          | Gallery Strip 2               | EditableFeatureGrid       | headshot-activation:gallery-strip-2
 * 8          | Headshot Styles               | EditableFeatureGrid       | headshot-activation:headshot-styles
 * 9          | Social Proof                  | EditableTestimonials      | headshot-activation:social-proof
 * 10         | FAQs                          | EditableFAQ               | headshot-activation:faqs
 * 11         | Final CTA                     | EditableCTA               | headshot-activation:final-cta
 *
 * Note: The ROI Calculator is a custom interactive component embedded
 * in the page between sections 5 and 6. It is not represented in the schema.
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: headshot-activation:{sectionId}:{elementId}
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  StatsSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  TabbedContentSectionContent,
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
export const HA_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Headshot activation service by JHR Photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'Turn Your Booth Into the Most Popular Spot on the Floor',
  subtitle: 'Headshot Activation\u2122',
  description:
    'A Headshot Activation isn\u2019t a photo booth \u2014 it\u2019s a professional engagement system that draws a crowd, captures qualified leads, and gives every attendee something they actually value. Your sales team gets natural conversations. Your attendees get a polished headshot they\u2019ll use for months. And your booth becomes the one everyone\u2019s talking about.',
  backgroundImage: {
    src: '/images/generated/service-headshot-activation.jpg',
    alt: 'Professional headshot activation at trade show booth',
  },
  buttons: [
    { text: 'Talk With Our Team', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
    { text: 'Check Availability', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'secondary' },
  ],
};

/**
 * Section 1: Stats Bar
 * Component: EditableStats
 */
export const HA_STATS: StatsSectionContent = {
  id: 'stats',
  type: 'stats',
  order: 1,
  seo: {
    ariaLabel: 'Key activation metrics',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  stats: [
    { id: 'stat-0', value: 5, suffix: '+ min', label: 'Avg. Dwell Time' },
    { id: 'stat-1', value: 150, suffix: '+', label: 'Headshots per Day' },
    { id: 'stat-2', value: 5, prefix: '< ', suffix: ' min', label: 'Delivery to Attendee' },
    { id: 'stat-3', value: 100, suffix: '%', label: 'White-Label Branded' },
  ],
};

/**
 * Section 2: The Booth Problem (Empathy)
 * Component: EditableTextBlock (centered)
 */
export const HA_PROBLEM: TextBlockSectionContent = {
  id: 'problem',
  type: 'text-block',
  order: 2,
  seo: {
    ariaLabel: 'The problem with traditional trade show engagement',
    sectionId: 'problem',
    dataSectionName: 'problem',
  },
  heading: 'Swag Gets Ignored. Badge Scans Go Cold. Your Booth Deserves Better.',
  alignment: 'center',
  content:
    '<p>You\u2019ve invested serious budget into your exhibit space \u2014 the booth, the travel, the team. But traditional engagement tactics don\u2019t hold attention. People grab the pen, scan the badge, and move on. You\u2019re left with a stack of cold contacts and nothing that tells your sales team who actually cared.</p><p><em>What if your booth offered something people genuinely wanted \u2014 and stayed for?</em></p>',
};

/**
 * Section 3: How It Works (The Solution - 4 Key Moments)
 * Component: EditableFeatureGrid (alternating layout with images)
 */
export const HA_SOLUTION: FeatureGridSectionContent = {
  id: 'solution',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How a headshot activation works - four key moments',
    sectionId: 'solution',
    dataSectionName: 'solution',
  },
  heading: 'A Professional Experience Attendees Line Up For',
  subheading:
    'A Headshot Activation is a turnkey, on-site professional headshot experience deployed directly at your booth or event space. We bring the lighting, the equipment, the professional direction, and the Camera Ready Touchup Service\u2122 \u2014 everything needed to make attendees feel like a VIP the moment they step in.',
  columns: 2,
  displayMode: 'alternating',
  features: [
    {
      id: 'solution-card-0',
      icon: 'Sparkles',
      title: 'The Draw',
      description:
        'Professional lighting and energy create a visual beacon on the show floor. Attendees notice \u2014 and they come to you. Average dwell time at an activated booth runs five minutes or more, compared to seconds for traditional setups.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Activation drawing a crowd on the trade show floor' },
    },
    {
      id: 'solution-card-1',
      icon: 'Heart',
      title: 'The Experience',
      description:
        'Every attendee gets professional direction, confidence coaching, and a Camera Ready Touchup Service\u2122 before stepping in front of the camera. They feel prepared, valued, and taken care of \u2014 and that feeling gets associated with your brand.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Attendee receiving Camera Ready Touchup before headshot' },
    },
    {
      id: 'solution-card-2',
      icon: 'Image',
      title: 'The Asset',
      description:
        'Each attendee walks away with a polished, professionally retouched headshot delivered directly to them \u2014 typically within minutes. This isn\u2019t a novelty photo. It\u2019s something they\u2019ll actually use on LinkedIn, company bios, and professional profiles for months.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Professional headshot being delivered to attendee' },
    },
    {
      id: 'solution-card-3',
      icon: 'Database',
      title: 'The Data',
      description:
        'Every headshot captured includes integrated lead capture. Your sales team gets real contact data attached to a positive, memorable experience \u2014 not a cold badge scan they\u2019ll never follow up on.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Lead capture data dashboard from headshot activation' },
    },
  ],
};

/**
 * Section 4: Gallery Strip 1 (scrolling headshot examples)
 * Component: EditableFeatureGrid (logo-scroll)
 */
export const HA_GALLERY_STRIP_1: FeatureGridSectionContent = {
  id: 'gallery-strip-1',
  type: 'feature-grid',
  order: 4,
  seo: {
    ariaLabel: 'Professional headshot examples',
    sectionId: 'gallery-strip-1',
    dataSectionName: 'gallery-strip-1',
  },
  columns: 4,
  displayMode: 'logo-scroll',
  features: [
    { id: 'hs-strip-1-0', icon: 'User', title: 'Corporate headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Corporate headshot example' } },
    { id: 'hs-strip-1-1', icon: 'User', title: 'Executive portrait', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Executive portrait example' } },
    { id: 'hs-strip-1-2', icon: 'User', title: 'Legal professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Legal professional headshot' } },
    { id: 'hs-strip-1-3', icon: 'User', title: 'Tech professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Tech professional headshot' } },
    { id: 'hs-strip-1-4', icon: 'User', title: 'Finance headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Finance professional headshot' } },
    { id: 'hs-strip-1-5', icon: 'User', title: 'Healthcare headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Healthcare professional headshot' } },
    { id: 'hs-strip-1-6', icon: 'User', title: 'Real estate headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Real estate agent headshot' } },
    { id: 'hs-strip-1-7', icon: 'User', title: 'Sales professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Sales professional headshot' } },
    { id: 'hs-strip-1-8', icon: 'User', title: 'Creative professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Creative professional headshot' } },
    { id: 'hs-strip-1-9', icon: 'User', title: 'Casual professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Casual professional headshot' } },
  ],
};

/**
 * Section 5: Two Ways to Activate (Use Cases)
 * Component: EditableTabbedContent (2 tabs)
 */
export const HA_USE_CASES: TabbedContentSectionContent = {
  id: 'use-cases',
  type: 'tabbed-content',
  order: 5,
  seo: {
    ariaLabel: 'Two ways to use headshot activation - exhibitors and event hosts',
    sectionId: 'use-cases',
    dataSectionName: 'use-cases',
  },
  heading: 'Two Ways to Activate',
  variant: 'dark',
  tabs: [
    {
      id: 'use-cases-tab-0',
      tabLabel: 'For Exhibitors & Sponsors',
      heading: 'Drive Booth Traffic and Capture Qualified Leads',
      bodyParagraphs: [
        'Deploy a Headshot Activation at your trade show booth to create a high-energy destination attendees seek out. Your sales team gets natural, extended conversations with people who chose to engage \u2014 not people you chased down in the aisle.',
        'This is the setup that turns a six-figure booth investment into measurable results.',
      ],
      listItems: [
        'Professional activation station with signature lighting',
        'Camera Ready Touchup Service\u2122 (included full-day)',
        'Integrated lead capture with real-time data delivery',
        'Direct-to-attendee headshot delivery',
        'White-label branding on gallery and images',
        'Same-day social sharing capability',
      ],
      tags: 'Trade shows \u00b7 Conventions \u00b7 Exhibitor booths \u00b7 Sponsor activations \u00b7 Product launches',
      cta: {
        text: 'Talk With Our Team',
        href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
      },
      image: {
        src: '/images/generated/service-headshot-activation.jpg',
        alt: 'Trade show headshot activation booth with professional lighting',
        position: 'right',
      },
    },
    {
      id: 'use-cases-tab-1',
      tabLabel: 'For Event Hosts & Corporate Programs',
      heading: 'Offer Your Attendees Something They\u2019ll Actually Thank You For',
      bodyParagraphs: [
        'Add a Headshot Activation to your conference, corporate event, or tenant appreciation program as a premium attendee benefit. Attendees get a professional headshot update they\u2019ve been meaning to get for months \u2014 and your organization gets credit for providing it.',
        'This is the model companies like Cushman & Wakefield have used to strengthen tenant relationships and elevate their event experience.',
      ],
      listItems: [
        'Full-service headshot experience for attendees or tenants',
        'Camera Ready Touchup Service\u2122 (included)',
        'Professional direction and confidence coaching',
        'Direct-to-individual delivery',
        'Branded gallery with your organization\u2019s identity',
        'Scalable for 50 to 500+ participants',
      ],
      tags: 'Annual conferences \u00b7 Corporate appreciation events \u00b7 Tenant programs \u00b7 Employee engagement \u00b7 Client hospitality',
      cta: {
        text: 'Talk With Our Team',
        href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
      },
      image: {
        src: '/images/generated/service-headshot-activation.jpg',
        alt: 'Corporate event headshot activation for attendees',
        position: 'right',
      },
    },
  ],
};

/**
 * Section 6: What's Included
 * Component: EditableFeatureGrid (2 columns)
 */
export const HA_WHATS_INCLUDED: FeatureGridSectionContent = {
  id: 'whats-included',
  type: 'feature-grid',
  order: 6,
  seo: {
    ariaLabel: 'What is included in a headshot activation from JHR Photography',
    sectionId: 'whats-included',
    dataSectionName: 'whats-included',
  },
  heading: 'Everything You Need. Nothing You Have to Manage.',
  subheading:
    'A Headshot Activation is fully turnkey. We bring the equipment, the team, and the expertise. You provide the space and the attendees.',
  columns: 2,
  features: [
    {
      id: 'whats-included-card-0',
      icon: 'CheckCircle',
      title: 'Professional Backdrop & Signature Lighting',
      description:
        'Our setup creates the visual presence that draws attendees to your space.',
    },
    {
      id: 'whats-included-card-1',
      icon: 'CheckCircle',
      title: 'Camera Ready Touchup Service\u2122',
      description:
        'A professional touchup artist on-site all day, ensuring every attendee feels confident before they step in front of the camera.',
    },
    {
      id: 'whats-included-card-2',
      icon: 'CheckCircle',
      title: 'Professional Direction & Coaching',
      description:
        'Our operators coach expressions, adjust posture, and make every person feel comfortable in under a minute.',
    },
    {
      id: 'whats-included-card-3',
      icon: 'CheckCircle',
      title: 'Tethered Workflow with Live Selection',
      description:
        'Attendees see their images immediately and select their favorite on the spot.',
    },
    {
      id: 'whats-included-card-4',
      icon: 'CheckCircle',
      title: 'Direct-to-Attendee Delivery',
      description:
        'Polished, retouched headshots delivered directly to each attendee \u2014 typically within minutes.',
    },
    {
      id: 'whats-included-card-5',
      icon: 'CheckCircle',
      title: 'Lead Capture Integration',
      description:
        'Contact data captured seamlessly as part of the experience, delivered to your team in real time.',
    },
    {
      id: 'whats-included-card-6',
      icon: 'CheckCircle',
      title: 'White-Label Gallery & Branding',
      description:
        'Your brand on every touchpoint. Gallery, delivery emails, and image overlays all carry your identity.',
    },
    {
      id: 'whats-included-card-7',
      icon: 'CheckCircle',
      title: 'Final Frame Guarantee\u2122',
      description:
        'Every delivered image meets JHR\u2019s professional quality standard. Period.',
    },
  ],
};

/**
 * Section 7: Gallery Strip 2 (scrolling headshot examples)
 * Component: EditableFeatureGrid (logo-scroll)
 */
export const HA_GALLERY_STRIP_2: FeatureGridSectionContent = {
  id: 'gallery-strip-2',
  type: 'feature-grid',
  order: 7,
  seo: {
    ariaLabel: 'More professional headshot examples',
    sectionId: 'gallery-strip-2',
    dataSectionName: 'gallery-strip-2',
  },
  columns: 4,
  displayMode: 'logo-scroll',
  features: [
    { id: 'hs-strip-2-0', icon: 'User', title: 'Corporate headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Corporate headshot example' } },
    { id: 'hs-strip-2-1', icon: 'User', title: 'Executive portrait', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Executive portrait example' } },
    { id: 'hs-strip-2-2', icon: 'User', title: 'Legal professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Legal professional headshot' } },
    { id: 'hs-strip-2-3', icon: 'User', title: 'Tech professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Tech professional headshot' } },
    { id: 'hs-strip-2-4', icon: 'User', title: 'Finance headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Finance professional headshot' } },
    { id: 'hs-strip-2-5', icon: 'User', title: 'Healthcare headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Healthcare professional headshot' } },
    { id: 'hs-strip-2-6', icon: 'User', title: 'Real estate headshot', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Real estate agent headshot' } },
    { id: 'hs-strip-2-7', icon: 'User', title: 'Sales professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Sales professional headshot' } },
    { id: 'hs-strip-2-8', icon: 'User', title: 'Creative professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Creative professional headshot' } },
    { id: 'hs-strip-2-9', icon: 'User', title: 'Casual professional', description: '', image: { src: '/images/generated/placeholder.jpg', alt: 'Casual professional headshot' } },
  ],
};

/**
 * Section 8: Headshot Styles
 * Component: EditableFeatureGrid (3 columns with images)
 */
export const HA_HEADSHOT_STYLES: FeatureGridSectionContent = {
  id: 'headshot-styles',
  type: 'feature-grid',
  order: 8,
  seo: {
    ariaLabel: 'Professional headshot styles available in activation events',
    sectionId: 'headshot-styles',
    dataSectionName: 'headshot-styles',
  },
  heading: 'Professional Headshots Tailored to Your Industry',
  subheading:
    'Not every headshot looks the same \u2014 because not every professional needs the same image. Our operators tailor the approach to match the attendee\u2019s industry and personal brand.',
  columns: 3,
  features: [
    {
      id: 'headshot-styles-card-0',
      icon: 'Briefcase',
      title: 'Corporate Headshot',
      description:
        'The standard for enterprise professionals \u2014 clean background, polished lighting, and a confident, approachable expression.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Corporate headshot example' },
    },
    {
      id: 'headshot-styles-card-1',
      icon: 'Scale',
      title: 'Legal & Finance Headshot',
      description:
        'Authority and trust. Tailored for attorneys, bankers, financial advisors, and consultants who need credibility and professionalism.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Legal and finance headshot example' },
    },
    {
      id: 'headshot-styles-card-2',
      icon: 'Smile',
      title: 'Casual Professional Headshot',
      description:
        'Modern and approachable. Ideal for tech, creative, and startup professionals who want to look polished without looking stiff.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Casual professional headshot example' },
    },
    {
      id: 'headshot-styles-card-3',
      icon: 'Crown',
      title: 'Executive Portrait',
      description:
        'Elevated and intentional. For C-suite, board members, and senior leadership who need an image that matches their role.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Executive portrait example' },
    },
    {
      id: 'headshot-styles-card-4',
      icon: 'Home',
      title: 'Real Estate & Sales Headshot',
      description:
        'Warm, confident, and client-facing. Designed for professionals whose headshot IS their first impression.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Real estate headshot example' },
    },
    {
      id: 'headshot-styles-card-5',
      icon: 'HeartPulse',
      title: 'Healthcare Professional Headshot',
      description:
        'Clean, trustworthy, and approachable. For physicians, practitioners, and healthcare administrators.',
      image: { src: '/images/generated/placeholder.jpg', alt: 'Healthcare professional headshot example' },
    },
  ],
};

/**
 * Section 9: Social Proof (Testimonials)
 * Component: EditableTestimonials (grid layout)
 */
export const HA_SOCIAL_PROOF: TestimonialsSectionContent = {
  id: 'social-proof',
  type: 'testimonials',
  order: 9,
  seo: {
    ariaLabel: 'What happens when you activate - testimonials from exhibitors and event hosts',
    sectionId: 'social-proof',
    dataSectionName: 'social-proof',
  },
  heading: 'What Happens When You Activate',
  layout: 'grid',
  testimonials: [
    {
      id: 'social-proof-0',
      quote:
        'The Headshot Activation completely changed the energy at our booth. We had a line all three days, and our sales team had more meaningful conversations than any previous show.',
      authorName: 'Field Marketing Director',
      authorTitle: 'Enterprise Exhibitor',
    },
    {
      id: 'social-proof-1',
      quote:
        'We added the activation to our annual conference as an attendee benefit. People genuinely thanked us \u2014 some said it was the highlight of the event. We\u2019ve already booked again for next year.',
      authorName: 'Events Manager',
      authorTitle: 'Corporate Program Host',
    },
    {
      id: 'social-proof-2',
      quote:
        'I wasn\u2019t expecting much \u2014 but the touchup, the coaching, and the quality blew me away. I updated my LinkedIn that night.',
      authorName: 'Conference Attendee',
      authorTitle: 'National Sales Summit 2024',
    },
  ],
};

/**
 * Section 10: FAQs
 * Component: EditableFAQ
 */
export const HA_FAQS: FAQSectionContent = {
  id: 'faqs',
  type: 'faq',
  order: 10,
  seo: {
    ariaLabel: 'Frequently asked questions about headshot activations',
    sectionId: 'faqs',
    dataSectionName: 'faqs',
  },
  heading: 'Headshot Activation FAQs',
  items: [
    {
      id: 'faqs-item-0',
      question: 'What\u2019s the difference between a Headshot Activation and a regular headshot session?',
      answer:
        'A Headshot Activation is a professional engagement system designed for live events \u2014 trade shows, conferences, and corporate programs. It\u2019s not a studio session. We deploy a complete setup at your event: professional lighting, a Camera Ready Touchup Service, live image selection, and direct-to-attendee delivery. The goal isn\u2019t just headshots \u2014 it\u2019s booth traffic, attendee engagement, and lead capture, all wrapped in a professional experience people genuinely enjoy. If you\u2019re looking for dedicated headshots for your leadership team or small group in a controlled setting, that\u2019s our Executive Imaging\u2122 service.',
    },
    {
      id: 'faqs-item-1',
      question: 'How many headshots can you handle in a day?',
      answer:
        'A single operator can comfortably handle 100\u2013150 attendees in a full-day activation, depending on the flow of your event. For higher-volume events, we add operators to increase throughput without sacrificing the quality of the experience. We\u2019ll discuss expected attendance during our planning conversation and recommend the right setup.',
    },
    {
      id: 'faqs-item-2',
      question: 'Do attendees need to schedule a time slot?',
      answer:
        'It depends on the format. For trade show activations, we typically run open-flow \u2014 attendees walk up when they\u2019re ready, which keeps the booth energy high and the line moving. For corporate events or tenant programs where you want every attendee to participate, we can set up scheduled time slots to ensure smooth rotation and full coverage.',
    },
    {
      id: 'faqs-item-3',
      question: 'What headshot styles do you offer within an activation?',
      answer:
        'Our operators tailor the approach to each attendee based on their industry and professional needs. Common styles include corporate headshots, legal and finance headshots, casual professional headshots, and executive portraits. The beauty of a live activation is that attendees across different industries can each get a result that fits their personal brand \u2014 all within the same event.',
    },
    {
      id: 'faqs-item-4',
      question: 'How fast do attendees receive their headshots?',
      answer:
        'Most attendees receive their polished, retouched headshot within minutes of their session. We use a tethered workflow with live selection \u2014 attendees choose their favorite image on the spot, and it\u2019s delivered directly to them via email or text. No waiting days for proofs.',
    },
    {
      id: 'faqs-item-5',
      question: 'What does the Camera Ready Touchup Service include?',
      answer:
        'A professional hair and makeup touchup artist is on-site for the full activation. Every attendee gets a quick touchup before stepping in front of the camera \u2014 it takes about two minutes and dramatically increases confidence and quality of results. This is included with every Headshot Activation.',
    },
    {
      id: 'faqs-item-6',
      question: 'Can we brand the activation with our company\u2019s identity?',
      answer:
        'Yes \u2014 every touchpoint is white-labeled to your brand. The delivery gallery, the email notifications, and image overlays can all carry your logo and brand colors. For exhibitors, this means every headshot your attendees share on LinkedIn carries your brand with it.',
    },
    {
      id: 'faqs-item-7',
      question: 'We\u2019re hosting a corporate event and want to offer headshots as an attendee benefit \u2014 not for lead capture. Does this still work?',
      answer:
        'Absolutely. This is one of the most popular ways organizations use Headshot Activations outside of trade shows. Companies like property management firms, corporate campuses, and large employers book activations as a premium benefit for tenants, employees, or conference attendees. The setup is the same \u2014 professional lighting, Camera Ready Touchup Service, direct delivery \u2014 but the focus shifts from lead capture to attendee value and relationship building.',
    },
    {
      id: 'faqs-item-8',
      question: 'How much space does the activation require?',
      answer:
        'A standard Headshot Activation setup requires approximately a 10x10 foot area \u2014 roughly the size of a standard trade show booth. For larger activations with multiple operators or a dedicated Camera Ready Touchup station, we may need a 10x20 space.',
    },
    {
      id: 'faqs-item-9',
      question: 'Can you integrate with our CRM or lead capture system?',
      answer:
        'Yes. We can integrate lead capture data with most standard CRM platforms and event lead retrieval systems. During planning, we\u2019ll confirm the integration method that works best for your setup \u2014 whether that\u2019s direct API integration, CSV export, or real-time data delivery to your sales team on the floor.',
    },
    {
      id: 'faqs-item-10',
      question: 'How far in advance should we book?',
      answer:
        'We recommend booking at least 4\u20136 weeks before your event to ensure operator availability and allow time for branding coordination. For large conventions or multi-day activations, 8\u201312 weeks is ideal. That said, if your event is sooner, reach out anyway \u2014 we\u2019ll do our best to accommodate.',
    },
    {
      id: 'faqs-item-11',
      question: 'What happens if our event date changes or we need to reschedule?',
      answer:
        'We understand events shift. If your date changes, let us know as soon as possible and we\u2019ll work to accommodate the new timeline. We\u2019re flexible with rescheduling as long as operator availability allows.',
    },
  ],
};

/**
 * Section 11: Final CTA
 * Component: EditableCTA (gradient background variant)
 */
export const HA_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 11,
  seo: {
    ariaLabel: 'Talk with JHR Photography about headshot activation for your event',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Your Booth Should Be the One Everyone\u2019s Talking About.',
  subtext:
    'Tell us about your event \u2014 the venue, the timeline, and what you\u2019re trying to accomplish. We\u2019ll show you exactly how a Headshot Activation supports your goals and give you a clear picture of what to expect.',
  backgroundType: 'gradient',
  backgroundValue:
    'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), linear-gradient(180deg, #0B0C0F 0%, #0B0C0F 100%)',
  primaryButton: {
    text: 'Talk With Our Team',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Check Availability',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'secondary',
  },
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const HA_SECTIONS: PageSectionContent[] = [
  HA_HERO,
  HA_STATS,
  HA_PROBLEM,
  HA_SOLUTION,
  HA_GALLERY_STRIP_1,
  HA_USE_CASES,
  HA_WHATS_INCLUDED,
  HA_GALLERY_STRIP_2,
  HA_HEADSHOT_STYLES,
  HA_SOCIAL_PROOF,
  HA_FAQS,
  HA_FINAL_CTA,
];

export const HEADSHOT_ACTIVATION_PAGE_SCHEMA: PageSchema = {
  slug: 'headshot-activation',
  name: 'Headshot Activation',
  seo: {
    pageTitle: 'Headshot Activation | JHR Photography',
    metaDescription:
      'Turn your trade show booth into the most popular destination on the floor. Professional headshot activations with lead capture, Camera Ready Touchup Service, and instant delivery in Nashville.',
    ogImage: '/images/generated/service-headshot-activation.jpg',
    ogTitle: 'Headshot Activation\u2122 - JHR Photography',
    ogDescription:
      'A professional engagement system that draws a crowd, captures qualified leads, and gives every attendee something they actually value.',
  },
  sections: HA_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getHASectionById(sectionId: string): PageSectionContent | undefined {
  return HA_SECTIONS.find((s) => s.id === sectionId);
}

export function getHAContentKeyPrefix(sectionId: string): string {
  return `headshot-activation:${sectionId}`;
}
