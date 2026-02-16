/**
 * About Page Content Schema
 *
 * Defines the editable structure for the JHR Photography about page.
 * This is the "Guide" page in the StoryBrand framework — it establishes
 * Jayson as the guide who understands the client's pressure, demonstrates
 * authority through story and philosophy, shows how the team is built,
 * and invites the client into the next step.
 *
 * ============================================================================
 * SECTION MAP: About Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                        | Editable Component        | Content Key Prefix
 * -----------|-------------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner (split)                 | EditableHero              | about:hero
 * 1          | Origin Story (Guide intro)           | EditableTextBlock          | about:guide
 * 2          | Our Philosophy (differentiators)     | EditableFeatureGrid       | about:why-jhr
 * 3          | How We Develop Operators             | EditableFeatureGrid       | about:operator-program
 * 4          | Stats Section                        | EditableStats             | about:stats
 * 5          | Meet Our Operators CTA               | EditableCTA               | about:team-cta
 * 6          | Final CTA                            | EditableCTA               | about:final-cta
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
  StatsSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// Section Definitions
// ============================================================================

/**
 * Section 0: Hero Banner
 * Component: EditableHero (split variant)
 *
 * StoryBrand: Opens with empathy. The client is the hero —
 * we acknowledge their pressure before talking about ourselves.
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
  variant: 'split',
  imagePosition: 'right',
  title: 'We Understand the Pressure You\'re Under',
  subtitle: 'About JHR Photography',
  description:
    'You\'re not looking for a photographer. You\'re looking for a partner who removes worry, delivers reliably, and makes you look good to your stakeholders.',
  backgroundImage: {
    src: '/images/generated/hero-about.jpg',
    alt: 'Jayson Rivas photographing a corporate event in Nashville',
  },
  buttons: [
    { text: 'Schedule a Strategy Call', href: 'https://potent-apparatus-4da.notion.site/2e4c2a32df0d80d586d8e924d98f02ca?pvs=105', variant: 'primary' },
  ],
};

/**
 * Section 1: Origin Story — Meet Jayson Rivas
 * Component: EditableTextBlock
 *
 * StoryBrand: Establishes the Guide. Not a resume — a story that
 * connects military discipline, family values, entrepreneurial DNA,
 * and a genuine understanding of what's at stake for the client.
 */
export const ABOUT_GUIDE: TextBlockSectionContent = {
  id: 'guide',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'Meet Jayson Rivas - JHR Photography founder and Green Beret',
    sectionId: 'guide',
    dataSectionName: 'guide',
  },
  heading: 'Meet Jayson Rivas',
  content:
    '<p>Jayson spent decades as a Green Beret in the U.S. Army Special Forces. Not the kind of service where you follow a script — the kind where you build teams from scratch in unfamiliar environments, with limited resources, and figure out how to win anyway. That\'s the DNA behind everything JHR Photography does.</p>' +
    '<p>But the story didn\'t start in the military. Jayson comes from a family of entrepreneurs going back to the 1960s — people who built businesses with their hands, served their communities, and understood that your name is your brand. That heritage shaped a simple belief: if someone trusts you with their business, you don\'t cut corners. You deliver.</p>' +
    '<p>Today, Jayson is married 24 years with six kids, two granddaughters, and a fat basset hound who runs the house. The same values that hold a family together — reliability, showing up when it matters, doing what you said you\'d do — are the values that hold this company together.</p>' +
    '<p>JHR Photography exists because Jayson saw event professionals getting let down by media vendors who didn\'t understand the stakes. You\'ve spent months coordinating speakers, managing budgets, aligning stakeholders. The last thing you need is a photographer who treats your event like a side gig. You deserve a partner who operates at your level — someone who arrives prepared, executes under pressure, and delivers assets you\'re proud to share with leadership.</p>',
  alignment: 'left',
};

/**
 * Section 2: Our Philosophy — Why Event Professionals Choose JHR
 * Component: EditableFeatureGrid (3-column default)
 *
 * StoryBrand: Authority through differentiation.
 * Three pillars that show why JHR operates differently.
 */
export const ABOUT_WHY_JHR: FeatureGridSectionContent = {
  id: 'why-jhr',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'Why event professionals choose JHR Photography',
    sectionId: 'why-jhr',
    dataSectionName: 'why-jhr',
  },
  heading: 'Why Event Professionals Choose JHR',
  subheading: 'It\'s not about the camera. It\'s about the standard behind it.',
  columns: 3,
  features: [
    {
      id: 'why-jhr-card-0',
      icon: 'MessageSquare',
      title: 'We Speak Your Language',
      description:
        'EAC forms, marshaling yards, drayage, union jurisdictions — we know the operational vocabulary of major events. You\'re not explaining the basics. You\'re partnering with someone who already understands what\'s at stake.',
    },
    {
      id: 'why-jhr-card-1',
      icon: 'MapPin',
      title: 'We Know Nashville\'s Venues',
      description:
        'Music City Center, Gaylord Opryland, the downtown hotels — we\'ve worked them all extensively. We know the loading docks, the lighting quirks, the venue contacts, and the best angles for every type of shot.',
    },
    {
      id: 'why-jhr-card-2',
      icon: 'Shield',
      title: 'We Deliver Without Drama',
      description:
        'Our team arrives in uniform, on schedule, with backup equipment and clear communication protocols. When the event is over, you get your assets fast — not excuses about editing timelines.',
    },
  ],
};

/**
 * Section 3: How We Develop Certified Media Operators
 * Component: EditableFeatureGrid (alternating layout with step numbers)
 *
 * StoryBrand: The Plan. Shows clients exactly how JHR ensures consistent
 * quality — the force multiplier philosophy from Special Forces applied
 * to media operator development.
 */
export const ABOUT_OPERATOR_PROGRAM: FeatureGridSectionContent = {
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
 * StoryBrand: Social proof — quantified authority.
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
 * Section 5: Meet Our Operators CTA
 * Component: EditableCTA
 *
 * Bridge to the Team page + invitation for photographers to join.
 * Dual buttons: meet the team / interested in joining.
 */
export const ABOUT_TEAM_CTA: CTASectionContent = {
  id: 'team-cta',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Meet the JHR Photography team or join our operator network',
    sectionId: 'team-cta',
    dataSectionName: 'team-cta',
  },
  headline: 'The People Behind the Standard',
  subtext:
    'Every JHR operator is vetted, trained in our studio, and certified before they ever step on-site for your event. Want to see who\'s behind the camera — or interested in joining our team?',
  backgroundType: 'gradient',
  backgroundValue: 'from-jhr-black via-jhr-black-light to-jhr-black',
  primaryButton: {
    text: 'Meet Our Operators',
    href: '/team',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Join Our Team',
    href: '/contact',
    variant: 'secondary',
  },
};

/**
 * Section 6: Final CTA
 * Component: EditableCTA (image background variant)
 *
 * StoryBrand: Direct call to action — the next step is clear.
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
  ABOUT_WHY_JHR,
  ABOUT_OPERATOR_PROGRAM,
  ABOUT_STATS,
  ABOUT_TEAM_CTA,
  ABOUT_FINAL_CTA,
];

export const ABOUT_PAGE_SCHEMA: PageSchema = {
  slug: 'about',
  name: 'About',
  seo: {
    pageTitle: 'About JHR Photography | Nashville Corporate Event Photography',
    metaDescription:
      'Meet Jayson Rivas — Green Beret turned event media professional. JHR Photography brings military-grade reliability, family values, and trained operators to Nashville\'s biggest events.',
    ogImage: '/images/generated/hero-about.jpg',
    ogTitle: 'About JHR Photography — We Understand the Pressure You\'re Under',
    ogDescription:
      'Nashville\'s trusted partner for corporate event photography. Military-trained reliability, entrepreneurial values, and certified media operators.',
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
