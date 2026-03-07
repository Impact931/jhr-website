/**
 * 404 Not Found Page Content Schema
 *
 * Defines the editable structure for the 404 page.
 * Simple layout: hero with background image, heading, message, and nav links.
 *
 * ============================================================================
 * SECTION MAP
 * ============================================================================
 *
 * Section #  | Page Section     | Editable Component  | Content Key Prefix
 * -----------|------------------|---------------------|--------------------
 * 0 (hero)   | Hero Banner      | EditableHero        | not-found:hero
 * 1          | Navigation Links | EditableFeatureGrid | not-found:nav
 */

import type {
  PageSchema,
  PageSectionContent,
  HeroSectionContent,
  FeatureGridSectionContent,
} from '@/types/inline-editor';

/**
 * Section 0: Hero Banner
 * Full-screen hero with background image, heading, and message.
 */
export const NOT_FOUND_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'Page not found',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'full-height',
  title: 'Page Not Found',
  subtitle: '404',
  description:
    'The page you\u2019re looking for doesn\u2019t exist or has been moved. Let\u2019s get you back on track.',
  backgroundImage: {
    src: '/images/generated/hero-homepage.jpg',
    alt: 'JHR Photography Nashville event photography',
  },
  buttons: [
    { text: 'Back to Home', href: '/', variant: 'primary' },
    { text: 'View Our Services', href: '/services', variant: 'secondary' },
  ],
};

/**
 * Section 1: Quick Navigation Links
 * Feature grid with links to key pages.
 */
export const NOT_FOUND_NAV: FeatureGridSectionContent = {
  id: 'nav',
  type: 'feature-grid',
  order: 1,
  seo: {
    ariaLabel: 'Quick navigation links',
    sectionId: 'nav',
    dataSectionName: 'nav',
  },
  heading: 'Looking for Something Specific?',
  columns: 3,
  cardVariant: 'glass',
  features: [
    {
      id: 'nav-card-0',
      icon: 'Camera',
      title: 'Services',
      description: 'Explore our full range of corporate event photography and media services.',
      link: { text: 'View Services', href: '/services' },
    },
    {
      id: 'nav-card-1',
      icon: 'MapPin',
      title: 'Nashville Venues',
      description: 'See our venue-specific photography guides for Nashville\u2019s top event spaces.',
      link: { text: 'Browse Venues', href: '/venues' },
    },
    {
      id: 'nav-card-2',
      icon: 'BookOpen',
      title: 'Blog',
      description: 'Tips, guides, and insider knowledge for corporate event photography.',
      link: { text: 'Read Blog', href: '/blog' },
    },
    {
      id: 'nav-card-3',
      icon: 'Users',
      title: 'About Our Team',
      description: 'Meet the certified media operators behind JHR Photography.',
      link: { text: 'Meet the Team', href: '/team' },
    },
    {
      id: 'nav-card-4',
      icon: 'HelpCircle',
      title: 'FAQs',
      description: 'Answers to common questions about our services and process.',
      link: { text: 'View FAQs', href: '/faqs' },
    },
    {
      id: 'nav-card-5',
      icon: 'Mail',
      title: 'Contact Us',
      description: 'Get in touch to discuss your event photography needs.',
      link: { text: 'Contact', href: '/contact' },
    },
  ],
};

// ============================================================================
// Complete Page Schema
// ============================================================================

export const NOT_FOUND_SECTIONS: PageSectionContent[] = [
  NOT_FOUND_HERO,
  NOT_FOUND_NAV,
];

export const NOT_FOUND_PAGE_SCHEMA: PageSchema = {
  slug: 'not-found',
  name: '404 Not Found',
  seo: {
    pageTitle: 'Page Not Found | JHR Photography',
    metaDescription:
      'The page you were looking for could not be found. Browse JHR Photography services, venues, and blog.',
  },
  sections: NOT_FOUND_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};
