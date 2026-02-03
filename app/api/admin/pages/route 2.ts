/**
 * Admin Pages API Route
 * Lists all site pages with their CMS status (draft/published)
 */

import { NextResponse } from 'next/server';
import { getPageContent } from '@/lib/content';
import { ContentStatus } from '@/types/content';

// Static list of all site pages
const sitePages = [
  // Main Pages
  { name: 'Homepage', slug: 'home', path: '/', category: 'Main' },
  { name: 'About', slug: 'about', path: '/about', category: 'Main' },
  { name: 'Contact', slug: 'contact', path: '/contact', category: 'Main' },
  { name: 'FAQs', slug: 'faqs', path: '/faqs', category: 'Main' },
  { name: 'Schedule', slug: 'schedule', path: '/schedule', category: 'Main' },

  // Services
  { name: 'Services', slug: 'services', path: '/services', category: 'Services' },
  { name: 'Corporate Event Coverage', slug: 'corporate-event-coverage', path: '/services/corporate-event-coverage', category: 'Services' },
  { name: 'Corporate Headshot Program', slug: 'corporate-headshot-program', path: '/services/corporate-headshot-program', category: 'Services' },
  { name: 'Event Video Systems', slug: 'event-video-systems', path: '/services/event-video-systems', category: 'Services' },
  { name: 'Headshot Activation', slug: 'headshot-activation', path: '/services/headshot-activation', category: 'Services' },

  // Solutions
  { name: 'Associations', slug: 'associations', path: '/solutions/associations', category: 'Solutions' },
  { name: 'DMCs & Agencies', slug: 'dmcs-agencies', path: '/solutions/dmcs-agencies', category: 'Solutions' },
  { name: 'Exhibitors & Sponsors', slug: 'exhibitors-sponsors', path: '/solutions/exhibitors-sponsors', category: 'Solutions' },
  { name: 'Venues', slug: 'venues-solution', path: '/solutions/venues', category: 'Solutions' },

  // Venues
  { name: 'Venues Overview', slug: 'venues', path: '/venues', category: 'Venues' },
  { name: 'Belmont University', slug: 'belmont-university', path: '/venues/belmont-university', category: 'Venues' },
  { name: 'City Winery Nashville', slug: 'city-winery-nashville', path: '/venues/city-winery-nashville', category: 'Venues' },
  { name: 'Embassy Suites Nashville', slug: 'embassy-suites-nashville', path: '/venues/embassy-suites-nashville', category: 'Venues' },
  { name: 'Gaylord Opryland', slug: 'gaylord-opryland', path: '/venues/gaylord-opryland', category: 'Venues' },
  { name: 'JW Marriott Nashville', slug: 'jw-marriott-nashville', path: '/venues/jw-marriott-nashville', category: 'Venues' },
  { name: 'Music City Center', slug: 'music-city-center', path: '/venues/music-city-center', category: 'Venues' },
  { name: 'Omni Hotel Nashville', slug: 'omni-hotel-nashville', path: '/venues/omni-hotel-nashville', category: 'Venues' },
  { name: 'Renaissance Hotel Nashville', slug: 'renaissance-hotel-nashville', path: '/venues/renaissance-hotel-nashville', category: 'Venues' },
];

export interface PageWithStatus {
  name: string;
  slug: string;
  path: string;
  category: string;
  status: 'published' | 'draft' | 'no-content';
  lastModified: string | null;
  hasDraft: boolean;
  hasPublished: boolean;
}

/**
 * GET /api/admin/pages
 * Returns list of all site pages with their CMS status
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Fetch content status for all pages in parallel
    const pagesWithStatus: PageWithStatus[] = await Promise.all(
      sitePages.map(async (page) => {
        // Fetch both draft and published versions
        const [draft, published] = await Promise.all([
          getPageContent(page.slug, ContentStatus.DRAFT),
          getPageContent(page.slug, ContentStatus.PUBLISHED),
        ]);

        const hasDraft = !!draft;
        const hasPublished = !!published;

        // Determine status priority: published > draft > no-content
        let status: 'published' | 'draft' | 'no-content';
        if (hasPublished) {
          status = 'published';
        } else if (hasDraft) {
          status = 'draft';
        } else {
          status = 'no-content';
        }

        // Use the most recent update timestamp
        const draftTime = draft?.updatedAt ? new Date(draft.updatedAt).getTime() : 0;
        const publishedTime = published?.updatedAt ? new Date(published.updatedAt).getTime() : 0;
        const lastModified = draftTime > publishedTime
          ? draft?.updatedAt || null
          : published?.updatedAt || null;

        return {
          name: page.name,
          slug: page.slug,
          path: page.path,
          category: page.category,
          status,
          lastModified,
          hasDraft,
          hasPublished,
        };
      })
    );

    return NextResponse.json({ pages: pagesWithStatus });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
