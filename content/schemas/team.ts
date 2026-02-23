/**
 * Team Page Content Schema
 *
 * Defines the editable structure for the JHR Photography team page.
 * The team-grid section was moved from the about page to give the team
 * its own dedicated page.
 *
 * ============================================================================
 * SECTION MAP: Team Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                        | Editable Component        | Content Key Prefix
 * -----------|-------------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner (split)                 | EditableHero              | team:hero
 * 1          | Team Overview                       | EditableTextBlock          | team:team-overview
 * 2          | Meet the Team (Grid)                | EditableTeamGrid          | team:team
 * 3          | How We Develop Operators             | EditableFeatureGrid       | team:operator-program
 * 4          | Stats Section                        | EditableStats             | team:stats
 * 5          | Join Our Team CTA                   | EditableCTA               | team:team-cta
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
 * Component: EditableHero (split variant)
 */
export const TEAM_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Meet the JHR Photography team - certified media operators',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'split',
  imagePosition: 'right',
  title: 'Certified Operators. Not Freelancers.',
  subtitle: 'Meet Our Team',
  description:
    'Every JHR operator is recruited through military and professional networks, trained to our standard, and held accountable after every event. When they show up to your event, they\'re ready.',
  backgroundImage: {
    src: '/images/generated/hero-about.jpg',
    alt: 'JHR Photography team at a corporate event',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Team Overview
 * Component: EditableTextBlock
 *
 * Brief overview of the operator model and what makes the team different.
 */
export const TEAM_OVERVIEW: TextBlockSectionContent = {
  id: 'team-overview',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'How the JHR Photography operator model works',
    sectionId: 'team-overview',
    dataSectionName: 'team-overview',
  },
  heading: 'Built Different. On Purpose.',
  content:
    '<p>Most photography companies hire whoever\'s available. We don\'t. Every JHR operator is personally vetted, trained through our certification program, and deployed with a detailed mission brief for your event.</p>' +
    '<p>Our team comes from military, first-responder, and professional media backgrounds\u2014people who understand that reliability isn\'t optional when your reputation is on the line. They arrive in uniform, on time, with backup equipment and clear communication protocols.</p>' +
    '<p>The result: consistent, professional coverage at every event, no matter how many operators we deploy.</p>',
  alignment: 'left',
};

/**
 * Section 2: Team Grid (moved from about page)
 * Component: EditableTeamGrid
 *
 * Interactive "baseball card" flip cards for each team member.
 * 10 members: Jayson (founder) + 9 certified operators.
 */
export const TEAM_GRID: TeamGridSectionContent = {
  id: 'team',
  type: 'team-grid',
  order: 2,
  seo: {
    ariaLabel: 'JHR Photography certified media operators team members',
    sectionId: 'team',
    dataSectionName: 'team',
  },
  heading: 'Meet the Team',
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
 * Section 3: How We Develop Certified Media Operators
 * Component: EditableFeatureGrid (alternating layout with step numbers)
 *
 * Moved from About page — shows clients exactly how JHR ensures
 * consistent quality through the force multiplier philosophy.
 */
export const TEAM_OPERATOR_PROGRAM: FeatureGridSectionContent = {
  id: 'operator-program',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'How JHR Photography develops certified media operators',
    sectionId: 'operator-program',
    dataSectionName: 'operator-program',
  },
  heading: 'How We Develop Certified Media Operators',
  subheading:
    'In Special Forces, Jayson was a force multiplier — training people to succeed on their own with little or no resources. That\'s exactly how we build our team. No shortcuts. No hoping for the best.',
  columns: 2,
  displayMode: 'alternating',
  showStepNumbers: true,
  features: [
    {
      id: 'op-card-0',
      icon: 'Users',
      title: 'Recruited From Professional Networks',
      description:
        'We don\'t post on staffing marketplaces. Every operator comes through referral, military and first-responder networks, or direct vetting. We\'re looking for discipline and character first — camera skills can be sharpened. Attitude can\'t.',
    },
    {
      id: 'op-card-1',
      icon: 'Camera',
      title: 'Trained in Our Studio on Fundamentals',
      description:
        'We have a full studio where operators work on the basics and fundamentals of photography — composition, lighting, exposure, equipment handling. But it doesn\'t stop at technical skills. Our people have to think like the client, anticipate needs before they\'re spoken, and deliver the value event professionals deserve.',
    },
    {
      id: 'op-card-2',
      icon: 'BookOpen',
      title: 'Workshops, Classes, and Brand Voice',
      description:
        'This isn\'t just about taking good photos. We run workshops and classes that cover customer service, communication protocols, venue etiquette, and the JHR brand voice. Every operator learns to represent not just themselves, but your brand and ours — professionally, consistently, every time.',
    },
    {
      id: 'op-card-3',
      icon: 'Repeat',
      title: 'Left Seat, Right Seat — Proven Before Deployed',
      description:
        'Before an operator works your event solo, they do ride-alongs. Left seat, right seat — like an internship. They shadow certified operators, then take the lead while being observed. We don\'t clear anyone for deployment until they can consistently produce quality work to standard and execute with the brand voice. It\'s no different than how Jayson built teams in the military. It\'s just a lot more fun.',
    },
  ],
};

/**
 * Section 4: Stats Section
 * Component: EditableStats (animated counters)
 *
 * Moved from About page — quantified social proof.
 */
export const TEAM_STATS: StatsSectionContent = {
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
 * Section 5: Join Our Team CTA
 * Component: EditableCTA
 */
export const TEAM_CTA: CTASectionContent = {
  id: 'team-cta',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Work with JHR Photography - schedule a strategy call',
    sectionId: 'team-cta',
    dataSectionName: 'team-cta',
  },
  headline: 'Ready to Work With a Team That Delivers?',
  subtext:
    'Schedule a strategy call with Jayson. We\'ll discuss your event, understand your challenges, and show you exactly how the JHR team can help.',
  backgroundType: 'image',
  backgroundValue: '/images/generated/hero-homepage.jpg',
  primaryButton: {
    text: 'Schedule a Strategy Call',
    href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105',
    variant: 'primary',
  },
};

// ============================================================================
// Complete Team Page Schema
// ============================================================================

export const TEAM_SECTIONS: PageSectionContent[] = [
  TEAM_HERO,
  TEAM_OVERVIEW,
  TEAM_GRID,
  TEAM_OPERATOR_PROGRAM,
  TEAM_STATS,
  TEAM_CTA,
];

export const TEAM_PAGE_SCHEMA: PageSchema = {
  slug: 'team',
  name: 'Team',
  seo: {
    pageTitle: 'Our Team | JHR Photography — Certified Media Operators',
    metaDescription:
      'Meet the JHR Photography team. Every operator is recruited, trained, and certified to deliver reliable, professional event media coverage in Nashville.',
    ogImage: '/images/generated/hero-about.jpg',
    ogTitle: 'Our Team — JHR Photography Certified Media Operators',
    ogDescription:
      'Meet the certified media operators behind JHR Photography. Recruited from military and professional networks, trained to our standard.',
  },
  sections: TEAM_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};
