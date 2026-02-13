/**
 * About Page Content Schema
 *
 * Defines the editable structure for the JHR Photography about page.
 * Maps each section to an editable component type with default content
 * matching the current static page (/app/about/page.tsx).
 *
 * ============================================================================
 * SECTION MAP: About Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                  | Editable Component        | Content Key Prefix
 * -----------|-------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner                   | EditableHero              | about:hero
 * 1          | Meet Jayson Rivas (Guide)      | EditableTextBlock          | about:guide
 * 2          | How We Operate (Values)        | EditableFeatureGrid       | about:values
 * 3          | Why Event Pros Choose JHR      | EditableFeatureGrid       | about:why-jhr
 * 4          | Stats Section                  | EditableStats             | about:stats
 * 5          | Certified Media Operators      | EditableTeamGrid          | about:team
 * 6          | Final CTA                      | EditableCTA               | about:final-cta
 *
 * ============================================================================
 * CONTENT KEY NAMING CONVENTION
 * ============================================================================
 *
 * Format: about:{sectionId}:{elementId}
 *
 * Examples:
 *   about:hero:title              - Hero headline text
 *   about:hero:subtitle           - Hero subtitle text
 *   about:guide:heading           - Guide section heading
 *   about:guide:content           - Guide section rich text
 *   about:values:heading          - Values section heading
 *   about:values:features         - Values feature cards (JSON array)
 *   about:why-jhr:heading         - Why JHR section heading
 *   about:why-jhr:features        - Why JHR feature cards (JSON array)
 *   about:stats:features          - Stats grid (JSON array)
 *   about:final-cta:headline      - Final CTA headline
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
  StatsSectionContent,
  TeamGridSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Maps to: <PageHero> in /app/about/page.tsx
 * Component: EditableHero
 */
export const ABOUT_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'About JHR Photography - Nashville corporate event photography',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'half-height',
  title: 'We Understand the Pressure You\'re Under',
  subtitle: 'About JHR Photography',
  description:
    'You\'re not looking for a photographer. You\'re looking for a partner who removes worry, delivers reliably, and makes you look good to your stakeholders.',
  backgroundImage: {
    src: '/images/generated/hero-about.jpg',
    alt: 'Professional photographer with camera',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Meet Jayson Rivas (The Guide)
 * Maps to: "Meet Jayson Rivas" section in /app/about/page.tsx
 * Component: EditableTextBlock
 *
 * Two-column layout with text on the left and portrait image on the right.
 * The image is part of the page template; the text block captures the
 * editable heading and paragraphs.
 */
export const ABOUT_GUIDE: TextBlockSectionContent = {
  id: 'guide',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'Meet Jayson Rivas - JHR Photography founder',
    sectionId: 'guide',
    dataSectionName: 'guide',
  },
  heading: 'Meet Jayson Rivas',
  content:
    '<p>Before JHR Photography, Jayson spent decades as a Green Beret in the U.S. Army Special Forces. That background shaped everything about how we operate: meticulous planning, calm under pressure, and flawless execution when it matters most.</p>' +
    '<p>After retiring from the military, Jayson channeled his passion for photography into building a business that serves high-stakes, high-pressure events. He understands that for event planners, there\'s no room for error\u2014your reputation is on the line with every execution.</p>' +
    '<p>JHR Photography exists because Jayson believes event professionals deserve a media partner who operates at their level\u2014not a creative who shows up hoping for the best, but an operator who arrives prepared to deliver.</p>',
  alignment: 'left',
};

/**
 * Section 2: How We Operate (Values)
 * Maps to: Values grid in /app/about/page.tsx
 * Component: EditableFeatureGrid (3 columns)
 *
 * Three value cards: Reliability First, Empathy Driven, Outcomes Over Process.
 */
export const ABOUT_VALUES: FeatureGridSectionContent = {
  id: 'values',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'JHR Photography core values and operating principles',
    sectionId: 'values',
    dataSectionName: 'values',
  },
  heading: 'How We Operate',
  subheading:
    'Our approach is shaped by military discipline and a deep respect for the professionals we serve.',
  columns: 3,
  features: [
    {
      id: 'values-card-0',
      icon: 'Shield',
      title: 'Reliability First',
      description:
        'We show up prepared, on time, every time. No excuses. Our logistics are planned to the minute, and we build in redundancy for everything that matters.',
    },
    {
      id: 'values-card-1',
      icon: 'Heart',
      title: 'Empathy Driven',
      description:
        'We know you\'re juggling a thousand details. We don\'t add to your stress\u2014we remove it. Our job is to make your job easier, not to showcase our creative ego.',
    },
    {
      id: 'values-card-2',
      icon: 'Zap',
      title: 'Outcomes Over Process',
      description:
        'We don\'t talk about gear, hours, or creative vision. We talk about what you need to achieve and how we deliver it. Your success is our only metric.',
    },
  ],
};

/**
 * Section 3: Why Event Professionals Choose JHR
 * Maps to: "Why JHR" section in /app/about/page.tsx
 * Component: EditableFeatureGrid (single column, stacked cards)
 *
 * Three text cards explaining JHR's differentiators.
 * Mapped as a 2-column feature grid to keep within FeatureGridColumns type (2 | 3 | 4).
 */
export const ABOUT_WHY_JHR: FeatureGridSectionContent = {
  id: 'why-jhr',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'Why event professionals choose JHR Photography',
    sectionId: 'why-jhr',
    dataSectionName: 'why-jhr',
  },
  heading: 'Why Event Professionals Choose JHR',
  columns: 2,
  features: [
    {
      id: 'why-jhr-card-0',
      icon: 'CheckCircle',
      title: 'We Speak Your Language',
      description:
        'EAC forms, marshaling yards, drayage, union jurisdictions\u2014we know the operational vocabulary of major events. You\'re partnering with someone who already understands.',
    },
    {
      id: 'why-jhr-card-1',
      icon: 'CheckCircle',
      title: 'We Know Nashville\'s Venues',
      description:
        'Music City Center, Gaylord Opryland, the downtown hotels\u2014we\'ve worked them all extensively. We know the quirks, the contacts, and the best spots for every type of shot.',
    },
    {
      id: 'why-jhr-card-2',
      icon: 'CheckCircle',
      title: 'We Deliver Without Drama',
      description:
        'Our team arrives in uniform, on schedule, with backup equipment and clear communication protocols. When the event is over, you get your assets fast\u2014not excuses about editing timelines.',
    },
  ],
};

/**
 * Section 4: Stats Section
 * Maps to: Stats counters in /app/about/page.tsx
 * Component: EditableStats (animated counters)
 */
export const ABOUT_STATS: StatsSectionContent = {
  id: 'stats',
  type: 'stats',
  order: 4,
  seo: {
    ariaLabel: 'JHR Photography key statistics and achievements',
    sectionId: 'stats',
    dataSectionName: 'stats',
  },
  stats: [
    { id: 'stat-0', value: 500, suffix: '+', label: 'Events Covered' },
    { id: 'stat-1', value: 15000, suffix: '+', label: 'Headshots Delivered' },
    { id: 'stat-2', value: 100, suffix: '%', label: 'On-Time Delivery' },
    { id: 'stat-3', value: 10, suffix: '+', label: 'Years Experience' },
  ],
};

/**
 * Section 5: Certified Media Operators (Team Grid)
 * Component: EditableTeamGrid
 *
 * Interactive "baseball card" flip cards for each team member.
 * 10 members: Jayson (founder) + 9 certified operators.
 */
export const ABOUT_TEAM: TeamGridSectionContent = {
  id: 'team',
  type: 'team-grid',
  order: 5,
  seo: {
    ariaLabel: 'JHR Photography certified media operators team members',
    sectionId: 'team',
    dataSectionName: 'team',
  },
  heading: 'Certified Media Operators',
  subheading: 'Every JHR operator is vetted, trained, and certified to our standard. No freelancers. No surprises. Just professionals who deliver.',
  columns: 3,
  showRecruitmentCTA: true,
  recruitmentHeading: 'Join Our Team',
  recruitmentDescription: 'We\'re always looking for disciplined, talented media professionals to join our certified operator network.',
  recruitmentButton: { text: 'Apply Now', href: '/contact', variant: 'primary' },
  members: [
    {
      id: 'member-jayson',
      name: 'Jayson Rivas',
      role: 'Founder & Lead Operator',
      bio: 'Former Green Beret turned event media professional. Jayson built JHR Photography on military-grade reliability and a deep understanding of what event professionals need. He personally leads coverage for marquee events.',
      specialties: ['Corporate Events', 'Executive Portraits', 'Convention Coverage'],
      badges: [
        { id: 'b-j1', label: 'Music City Center', category: 'venue' },
        { id: 'b-j2', label: 'Gaylord Opryland', category: 'venue' },
        { id: 'b-j3', label: '500+ Events', category: 'performance' },
        { id: 'b-j4', label: 'Lead Certified', category: 'certification' },
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/jhrphotography' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/jaysonrivas' },
        { platform: 'website', url: 'https://jhrphotography.com' },
      ],
      order: 0,
    },
    {
      id: 'member-02',
      name: 'Operator 2',
      role: 'Senior Photographer',
      bio: 'Experienced event photographer specializing in corporate conferences and trade shows. Known for capturing candid moments that tell the story of your event.',
      specialties: ['Event Photography', 'Trade Shows'],
      badges: [
        { id: 'b-02-1', label: 'Certified Operator', category: 'certification' },
      ],
      socialLinks: [],
      order: 1,
    },
    {
      id: 'member-03',
      name: 'Operator 3',
      role: 'Videographer',
      bio: 'Cinematic event videographer with a talent for turning corporate moments into compelling visual stories. Specializes in same-day highlight reels.',
      specialties: ['Video Production', 'Highlight Reels'],
      badges: [
        { id: 'b-03-1', label: 'Certified Operator', category: 'certification' },
        { id: 'b-03-2', label: 'Video Specialist', category: 'specialty' },
      ],
      socialLinks: [],
      order: 2,
    },
    {
      id: 'member-04',
      name: 'Operator 4',
      role: 'Headshot Specialist',
      bio: 'High-volume headshot professional who thrives in fast-paced activation environments. Delivers polished, on-brand portraits with rapid turnaround.',
      specialties: ['Headshot Activations', 'Portrait Photography'],
      badges: [
        { id: 'b-04-1', label: 'Certified Operator', category: 'certification' },
        { id: 'b-04-2', label: '10K+ Headshots', category: 'performance' },
      ],
      socialLinks: [],
      order: 3,
    },
    {
      id: 'member-05',
      name: 'Operator 5',
      role: 'Event Photographer',
      bio: 'Detail-oriented photographer who excels at capturing the full scope of large-scale events. From keynotes to breakout sessions, nothing gets missed.',
      specialties: ['Convention Coverage', 'Breakout Sessions'],
      badges: [
        { id: 'b-05-1', label: 'Certified Operator', category: 'certification' },
      ],
      socialLinks: [],
      order: 4,
    },
    {
      id: 'member-06',
      name: 'Operator 6',
      role: 'Social Media Specialist',
      bio: 'Real-time content creator who captures, edits, and delivers social-ready assets during your event. Keeps your feeds active while you focus on execution.',
      specialties: ['Social Media', 'Real-Time Delivery'],
      badges: [
        { id: 'b-06-1', label: 'Certified Operator', category: 'certification' },
        { id: 'b-06-2', label: 'Social Media Pro', category: 'specialty' },
      ],
      socialLinks: [],
      order: 5,
    },
    {
      id: 'member-07',
      name: 'Operator 7',
      role: 'Event Photographer',
      bio: 'Versatile photographer comfortable in any venue environment. Brings calm professionalism and consistent quality to every assignment.',
      specialties: ['Corporate Events', 'Galas'],
      badges: [
        { id: 'b-07-1', label: 'Certified Operator', category: 'certification' },
      ],
      socialLinks: [],
      order: 6,
    },
    {
      id: 'member-08',
      name: 'Operator 8',
      role: 'Videographer',
      bio: 'Technical video specialist who manages multi-camera setups for conferences and keynotes. Expert in live-streaming and post-production.',
      specialties: ['Multi-Camera', 'Live Streaming'],
      badges: [
        { id: 'b-08-1', label: 'Certified Operator', category: 'certification' },
        { id: 'b-08-2', label: 'AV Specialist', category: 'specialty' },
      ],
      socialLinks: [],
      order: 7,
    },
    {
      id: 'member-09',
      name: 'Operator 9',
      role: 'Event Photographer',
      bio: 'Reliable, punctual, and detail-focused. Thrives in high-pressure event environments and consistently delivers exceptional coverage.',
      specialties: ['Event Photography', 'Networking Events'],
      badges: [
        { id: 'b-09-1', label: 'Certified Operator', category: 'certification' },
      ],
      socialLinks: [],
      order: 8,
    },
    {
      id: 'member-10',
      name: 'Operator 10',
      role: 'Photographer & Editor',
      bio: 'Dual-role operator who shoots and edits, enabling faster turnaround. Specializes in on-site editing for same-day delivery requirements.',
      specialties: ['Photography', 'On-Site Editing'],
      badges: [
        { id: 'b-10-1', label: 'Certified Operator', category: 'certification' },
        { id: 'b-10-2', label: 'Same-Day Delivery', category: 'performance' },
      ],
      socialLinks: [],
      order: 9,
    },
  ],
};

/**
 * Section 5: Final CTA
 * Maps to: Bottom CTA in /app/about/page.tsx
 * Component: EditableCTA (image background variant)
 */
export const ABOUT_FINAL_CTA: CTASectionContent = {
  id: 'final-cta',
  type: 'cta',
  order: 6,
  seo: {
    ariaLabel: 'Schedule a strategy call with JHR Photography',
    sectionId: 'final-cta',
    dataSectionName: 'final-cta',
  },
  headline: 'Let\'s Talk About Your Event',
  subtext:
    'Schedule a strategy call with Jayson. We\'ll discuss your event, understand your challenges, and show you exactly how JHR can help.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-homepage.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete About Page Schema
// ============================================================================

export const ABOUT_SECTIONS: PageSectionContent[] = [
  ABOUT_HERO,
  ABOUT_GUIDE,
  ABOUT_VALUES,
  ABOUT_WHY_JHR,
  ABOUT_STATS,
  ABOUT_TEAM,
  ABOUT_FINAL_CTA,
];

export const ABOUT_PAGE_SCHEMA: PageSchema = {
  slug: 'about',
  name: 'About',
  seo: {
    pageTitle: 'About JHR Photography | Nashville Corporate Event Photography',
    metaDescription:
      'Meet Jayson Rivas and the JHR Photography team. Military-trained reliability, venue fluency, and outcome-driven event photography in Nashville.',
    ogImage: '/images/generated/hero-about.jpg',
    ogTitle: 'About JHR Photography - We Understand the Pressure You\'re Under',
    ogDescription:
      'Nashville\'s trusted partner for corporate event photography. Military-trained reliability meets professional event media.',
  },
  sections: ABOUT_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// Helpers
// ============================================================================

export function getAboutSectionById(sectionId: string): PageSectionContent | undefined {
  return ABOUT_SECTIONS.find((s) => s.id === sectionId);
}

export function getAboutContentKeyPrefix(sectionId: string): string {
  return `about:${sectionId}`;
}
