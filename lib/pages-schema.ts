/**
 * Website Pages Schema
 * Defines all editable pages and their sections for the admin panel
 */

export interface PageSection {
  id: string;
  name: string;
  description?: string;
  editableFields: EditableField[];
}

export interface EditableField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'html';
  description?: string;
}

export interface PageSchema {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 'main' | 'services' | 'solutions' | 'venues';
  sections: PageSection[];
}

// All website pages with their editable sections
export const pagesSchema: PageSchema[] = [
  // Main Pages
  {
    id: 'home',
    name: 'Home',
    path: '/',
    description: 'Main landing page with hero, services overview, and testimonials',
    category: 'main',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Main banner with headline and CTA',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'title', label: 'Main Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'trust1', label: 'Trust Badge 1', type: 'text' },
          { key: 'trust2', label: 'Trust Badge 2', type: 'text' },
          { key: 'trust3', label: 'Trust Badge 3', type: 'text' },
        ],
      },
      {
        id: 'services',
        name: 'Services Section',
        editableFields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'description', label: 'Section Description', type: 'textarea' },
        ],
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        editableFields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'quote', label: 'Testimonial Quote', type: 'textarea' },
          { key: 'attribution', label: 'Attribution', type: 'text' },
        ],
      },
      {
        id: 'cta',
        name: 'Call to Action',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'CTA Title', type: 'text' },
          { key: 'description', label: 'CTA Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    description: 'Company story, team, and mission',
    category: 'main',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ],
      },
      {
        id: 'story',
        name: 'Our Story',
        editableFields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'content', label: 'Story Content', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    description: 'Contact form and information',
    category: 'main',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'faqs',
    name: 'FAQs',
    path: '/faqs',
    description: 'Frequently asked questions',
    category: 'main',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'schedule',
    name: 'Schedule a Call',
    path: '/schedule',
    description: 'Strategy call booking page',
    category: 'main',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },

  // Services Pages
  {
    id: 'services',
    name: 'Services Overview',
    path: '/services',
    description: 'All services overview page',
    category: 'services',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'headshot-activation',
    name: 'Headshot Activation',
    path: '/services/headshot-activation',
    description: 'Event headshot activation service',
    category: 'services',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'corporate-event-coverage',
    name: 'Corporate Event Coverage',
    path: '/services/corporate-event-coverage',
    description: 'Full event photography coverage',
    category: 'services',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'corporate-headshot-program',
    name: 'Corporate Headshot Program',
    path: '/services/corporate-headshot-program',
    description: 'On-site corporate headshot sessions',
    category: 'services',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'event-video-systems',
    name: 'Event Video Systems',
    path: '/services/event-video-systems',
    description: 'Video production and live streaming',
    category: 'services',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },

  // Solutions Pages
  {
    id: 'associations',
    name: 'Associations',
    path: '/solutions/associations',
    description: 'Solutions for associations and organizations',
    category: 'solutions',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'dmcs-agencies',
    name: 'DMCs & Agencies',
    path: '/solutions/dmcs-agencies',
    description: 'Solutions for DMCs and event agencies',
    category: 'solutions',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'exhibitors-sponsors',
    name: 'Exhibitors & Sponsors',
    path: '/solutions/exhibitors-sponsors',
    description: 'Solutions for exhibitors and sponsors',
    category: 'solutions',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'solutions-venues',
    name: 'Venues (Solutions)',
    path: '/solutions/venues',
    description: 'Solutions for venue partners',
    category: 'solutions',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },

  // Venue Pages
  {
    id: 'venues',
    name: 'Venues Overview',
    path: '/venues',
    description: 'All venue partners overview',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'music-city-center',
    name: 'Music City Center',
    path: '/venues/music-city-center',
    description: 'Music City Center venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'gaylord-opryland',
    name: 'Gaylord Opryland',
    path: '/venues/gaylord-opryland',
    description: 'Gaylord Opryland Resort venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'jw-marriott-nashville',
    name: 'JW Marriott Nashville',
    path: '/venues/jw-marriott-nashville',
    description: 'JW Marriott Nashville venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'omni-hotel-nashville',
    name: 'Omni Hotel Nashville',
    path: '/venues/omni-hotel-nashville',
    description: 'Omni Hotel Nashville venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'renaissance-hotel-nashville',
    name: 'Renaissance Hotel Nashville',
    path: '/venues/renaissance-hotel-nashville',
    description: 'Renaissance Hotel Nashville venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'embassy-suites-nashville',
    name: 'Embassy Suites Nashville',
    path: '/venues/embassy-suites-nashville',
    description: 'Embassy Suites Nashville venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'city-winery-nashville',
    name: 'City Winery Nashville',
    path: '/venues/city-winery-nashville',
    description: 'City Winery Nashville venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'belmont-university',
    name: 'Belmont University',
    path: '/venues/belmont-university',
    description: 'Belmont University venue page',
    category: 'venues',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        editableFields: [
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
];

// Helper functions
export function getPageById(id: string): PageSchema | undefined {
  return pagesSchema.find(page => page.id === id);
}

export function getPagesByCategory(category: PageSchema['category']): PageSchema[] {
  return pagesSchema.filter(page => page.category === category);
}

export function getAllPages(): PageSchema[] {
  return pagesSchema;
}

export function getPageCount(): number {
  return pagesSchema.length;
}

export const categoryLabels: Record<PageSchema['category'], string> = {
  main: 'Main Pages',
  services: 'Services',
  solutions: 'Solutions',
  venues: 'Venues',
};
