/**
 * About Page Content Schema
 *
 * Defines the editable structure for the JHR Photography about page.
 * Company-focused: vision, mission, values, and the JHR story.
 * Team/operator content lives on the dedicated Team page.
 *
 * ============================================================================
 * SECTION MAP: About Page Sections -> Editable Components
 * ============================================================================
 *
 * Section #  | Page Section                        | Editable Component        | Content Key Prefix
 * -----------|-------------------------------------|---------------------------|----------------------------
 * 0 (hero)   | Hero Banner (split)                 | EditableHero              | about:hero
 * 1          | Origin Story (Guide intro)           | EditableTextBlock          | about:guide
 * 2          | Our Mission (3 pillars)              | EditableFeatureGrid       | about:mission
 * 3          | What We Stand For (values)           | EditableFeatureGrid       | about:values
 * 4          | Why Event Pros Choose JHR            | EditableFeatureGrid       | about:why-jhr
 * 5          | Team Link CTA                        | EditableCTA               | about:team-link
 * 6          | Final CTA                            | EditableCTA               | about:final-cta
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  CTASectionContent,
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
/**
 * Section 2: Our Mission
 * Component: EditableFeatureGrid (3-column)
 *
 * Three pillars: mission statement, vision, and the standard.
 */
export const ABOUT_MISSION: FeatureGridSectionContent = {
  id: 'mission',
  type: 'feature-grid',
  order: 2,
  seo: {
    ariaLabel: 'JHR Photography mission, vision, and standard',
    sectionId: 'mission',
    dataSectionName: 'mission',
  },
  heading: 'Our Mission',
  subheading: 'The principles that drive every event, every deliverable, every interaction.',
  columns: 3,
  features: [
    {
      id: 'mission-card-0',
      icon: 'Target',
      title: 'Our Mission',
      description:
        'Remove media uncertainty. Deploy local, certified professionals. Capture what matters. We exist to give event professionals one less thing to worry about — and one more thing to be proud of.',
    },
    {
      id: 'mission-card-1',
      icon: 'Eye',
      title: 'Our Vision',
      description:
        'To be Nashville\'s most trusted media partner for event professionals — setting the standard that others follow. Not the biggest. Not the cheapest. The most reliable.',
    },
    {
      id: 'mission-card-2',
      icon: 'Award',
      title: 'The Standard',
      description:
        'Every interaction, every deliverable, every event is measured against one question: would we stake our name on this? If the answer isn\'t yes, it doesn\'t leave our hands.',
    },
  ],
};

/**
 * Section 3: What We Stand For
 * Component: EditableFeatureGrid (4-column)
 *
 * Core values that define how JHR operates.
 */
export const ABOUT_VALUES: FeatureGridSectionContent = {
  id: 'values',
  type: 'feature-grid',
  order: 3,
  seo: {
    ariaLabel: 'JHR Photography core values',
    sectionId: 'values',
    dataSectionName: 'values',
  },
  heading: 'What We Stand For',
  subheading: 'These aren\'t words on a wall. They\'re how we show up — every event, every time.',
  columns: 4,
  features: [
    {
      id: 'values-card-0',
      icon: 'Shield',
      title: 'Reliability',
      description:
        'Show up prepared, deliver on time, no excuses. When you hire JHR, you\'re hiring a team that treats your event like their reputation depends on it — because it does.',
    },
    {
      id: 'values-card-1',
      icon: 'Briefcase',
      title: 'Entrepreneurial Excellence',
      description:
        'Three generations of business builders. Your name is your brand. We bring the same ownership mentality to your event that we bring to our own company.',
    },
    {
      id: 'values-card-2',
      icon: 'Target',
      title: 'Discipline',
      description:
        'Military-grade precision applied to creative work. Protocols, preparation, and accountability aren\'t restrictions — they\'re what make excellence repeatable.',
    },
    {
      id: 'values-card-3',
      icon: 'Heart',
      title: 'Family-First Steadiness',
      description:
        'The same values that hold a family together — showing up when it matters, doing what you said you\'d do — hold this company together.',
    },
  ],
};

export const ABOUT_WHY_JHR: FeatureGridSectionContent = {
  id: 'why-jhr',
  type: 'feature-grid',
  order: 4,
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
 * Section 5: Team Link CTA
 * Component: EditableCTA
 *
 * Simple bridge to the Team page.
 */
export const ABOUT_TEAM_LINK: CTASectionContent = {
  id: 'team-link',
  type: 'cta',
  order: 5,
  seo: {
    ariaLabel: 'Meet the JHR Photography team',
    sectionId: 'team-link',
    dataSectionName: 'team-link',
  },
  headline: 'The People Behind the Standard',
  subtext:
    'Every JHR operator is vetted, trained in our studio, and certified before they ever step on-site for your event. Meet the team that makes it happen.',
  backgroundType: 'gradient',
  backgroundValue: 'from-jhr-black via-jhr-black-light to-jhr-black',
  primaryButton: {
    text: 'Meet Our Operators',
    href: '/team',
    variant: 'primary',
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
  order: 6, // Final CTA
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
  ABOUT_MISSION,
  ABOUT_VALUES,
  ABOUT_WHY_JHR,
  ABOUT_TEAM_LINK,
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
