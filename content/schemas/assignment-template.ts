import type { PageSchema, HeroSectionContent, TextBlockSectionContent } from '@/types/inline-editor';

const ASSIGNMENT_HERO: HeroSectionContent = {
  id: 'hero',
  type: 'hero',
  order: 0,
  seo: {
    ariaLabel: 'JHR Photography Assignment Offer',
    sectionId: 'hero',
    dataSectionName: 'hero',
  },
  variant: 'banner',
  title: 'Assignment Offer',
  subtitle: 'JHR Photography Operator Assignment Sheet',
  backgroundImage: {
    src: '/images/hero-corporate-event.jpg',
    alt: 'JHR Photography event coverage',
  },
  buttons: [],
};

const ASSIGNMENT_INSTRUCTIONS: TextBlockSectionContent = {
  id: 'instructions',
  type: 'text-block',
  order: 1,
  seo: {
    ariaLabel: 'Assignment instructions and policies',
    sectionId: 'instructions',
    dataSectionName: 'instructions',
  },
  heading: 'Before You Accept',
  content: '<p>Please review the assignment details above carefully before responding. By accepting this assignment, you agree to:</p><ul><li>Arrive at the venue by the listed show time</li><li>Wear the specified attire and bring the required gear</li><li>Follow the assignment briefing and any on-site instructions from the POC</li><li>Deliver photos per JHR Photography standards and timelines</li></ul><p>If you have questions about the assignment, contact the ops manager before responding.</p>',
  alignment: 'left',
};

const ASSIGNMENT_FOOTER: TextBlockSectionContent = {
  id: 'footer-info',
  type: 'text-block',
  order: 2,
  seo: {
    ariaLabel: 'JHR Photography contact information',
    sectionId: 'footer-info',
    dataSectionName: 'footer-info',
  },
  heading: 'Questions?',
  content: '<p>Contact the JHR Photography team if you need help with this assignment.</p>',
  alignment: 'center',
};

export const ASSIGNMENT_TEMPLATE_SECTIONS = [
  ASSIGNMENT_HERO,
  ASSIGNMENT_INSTRUCTIONS,
  ASSIGNMENT_FOOTER,
];

export const ASSIGNMENT_TEMPLATE_PAGE_SCHEMA: PageSchema = {
  slug: 'assignment-template',
  name: 'Assignment Template',
  seo: {
    pageTitle: 'Assignment | JHR Photography',
    metaDescription: 'JHR Photography operator assignment sheet.',
    ogImage: '',
    ogTitle: 'Assignment | JHR Photography',
    ogDescription: 'Operator assignment details.',
  },
  sections: ASSIGNMENT_TEMPLATE_SECTIONS,
  updatedAt: new Date().toISOString(),
  version: 1,
};
