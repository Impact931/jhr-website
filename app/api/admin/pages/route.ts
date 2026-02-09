/**
 * Admin Pages API Route
 * Lists all site pages with their CMS status (draft/published)
 */

import { NextResponse } from 'next/server';
import { getPageContent, getPageSections } from '@/lib/content';
import { ContentStatus } from '@/types/content';
import { ALL_SCHEMA_SLUGS } from '@/content/schema-registry';

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
  { name: 'Convention Media Services', slug: 'convention-media', path: '/services/convention-media', category: 'Services' },
  { name: 'Trade-Show Media Services', slug: 'trade-show-media', path: '/services/trade-show-media', category: 'Services' },
  { name: 'Headshot Activation', slug: 'headshot-activation', path: '/services/headshot-activation', category: 'Services' },
  { name: 'Executive Imaging', slug: 'executive-imaging', path: '/services/executive-imaging', category: 'Services' },
  { name: 'Social & Networking Media', slug: 'social-networking-media', path: '/services/social-networking-media', category: 'Services' },
  { name: 'Event Video Systems', slug: 'event-video-systems', path: '/services/event-video-systems', category: 'Services' },

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
        // Fetch both draft and published versions (check both legacy and section-based content)
        const [draft, published, sectionDraft, sectionPublished] = await Promise.all([
          getPageContent(page.slug, ContentStatus.DRAFT),
          getPageContent(page.slug, ContentStatus.PUBLISHED),
          getPageSections(page.slug, ContentStatus.DRAFT),
          getPageSections(page.slug, ContentStatus.PUBLISHED),
        ]);

        // Check if page has schema defaults (considered as having content)
        const hasSchema = ALL_SCHEMA_SLUGS.includes(page.slug);

        // A page has a draft if either legacy or section-based draft exists
        const hasDraft = !!draft || !!sectionDraft;
        // A page is published if either legacy or section-based published exists
        const hasPublished = !!published || !!sectionPublished;

        // Determine status priority: published > draft > schema-defaults > no-content
        let status: 'published' | 'draft' | 'no-content';
        if (hasPublished) {
          status = 'published';
        } else if (hasDraft) {
          status = 'draft';
        } else if (hasSchema) {
          // Pages with schema defaults show as "published" since they have displayable content
          status = 'published';
        } else {
          status = 'no-content';
        }

        // Use the most recent update timestamp from any content type
        const timestamps = [
          draft?.updatedAt ? new Date(draft.updatedAt).getTime() : 0,
          published?.updatedAt ? new Date(published.updatedAt).getTime() : 0,
          sectionDraft?.updatedAt ? new Date(sectionDraft.updatedAt).getTime() : 0,
          sectionPublished?.updatedAt ? new Date(sectionPublished.updatedAt).getTime() : 0,
        ];
        const maxTime = Math.max(...timestamps);
        let lastModified: string | null = null;
        if (maxTime > 0) {
          // Find which content has this timestamp
          if (draft?.updatedAt && new Date(draft.updatedAt).getTime() === maxTime) {
            lastModified = draft.updatedAt;
          } else if (published?.updatedAt && new Date(published.updatedAt).getTime() === maxTime) {
            lastModified = published.updatedAt;
          } else if (sectionDraft?.updatedAt && new Date(sectionDraft.updatedAt).getTime() === maxTime) {
            lastModified = sectionDraft.updatedAt;
          } else if (sectionPublished?.updatedAt && new Date(sectionPublished.updatedAt).getTime() === maxTime) {
            lastModified = sectionPublished.updatedAt;
          }
        }

        return {
          name: page.name,
          slug: page.slug,
          path: page.path,
          category: page.category,
          status,
          lastModified,
          hasDraft,
          hasPublished: hasPublished || hasSchema,
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
