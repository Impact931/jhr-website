/**
 * Schema Registry — Central mapping of site slug → PageSchema
 *
 * Used by the seed API to push schema defaults into DynamoDB,
 * and by the admin pages API to know which pages have schema content.
 *
 * KEY GOTCHA: Venue detail pages use the bare slug for DynamoDB
 * (e.g., 'music-city-center'), not the schema's internal slug
 * ('venue-music-city-center'). Map keys use the site/DynamoDB slug.
 */

import type { PageSchema } from '@/types/inline-editor';

// Standard page schemas (20)
import { HOME_PAGE_SCHEMA } from './schemas/home';
import { ABOUT_PAGE_SCHEMA } from './schemas/about';
import { TEAM_PAGE_SCHEMA } from './schemas/team';
import { CONTACT_PAGE_SCHEMA } from './schemas/contact';
import { FAQS_PAGE_SCHEMA } from './schemas/faqs';
import { SCHEDULE_PAGE_SCHEMA } from './schemas/schedule';
import { SERVICES_PAGE_SCHEMA } from './schemas/services';
import { CORPORATE_EVENT_COVERAGE_PAGE_SCHEMA } from './schemas/corporate-event-coverage';
import { CONVENTION_MEDIA_PAGE_SCHEMA } from './schemas/convention-media';
import { TRADE_SHOW_MEDIA_PAGE_SCHEMA } from './schemas/trade-show-media';
import { HEADSHOT_ACTIVATION_PAGE_SCHEMA } from './schemas/headshot-activation';
import { EXECUTIVE_IMAGING_PAGE_SCHEMA } from './schemas/executive-imaging';
import { SOCIAL_NETWORKING_MEDIA_PAGE_SCHEMA } from './schemas/social-networking-media';
import { EVENT_VIDEO_SYSTEMS_PAGE_SCHEMA } from './schemas/event-video-systems';
import { ASSOCIATIONS_PAGE_SCHEMA } from './schemas/associations';
import { DMCS_AGENCIES_PAGE_SCHEMA } from './schemas/dmcs-agencies';
import { EXHIBITORS_SPONSORS_PAGE_SCHEMA } from './schemas/exhibitors-sponsors';
import { VENUES_SOLUTION_PAGE_SCHEMA } from './schemas/venues-solution';
import { VENUES_PAGE_SCHEMA } from './schemas/venues';
import { CORPORATE_HEADSHOT_PROGRAM_PAGE_SCHEMA } from './schemas/corporate-headshot-program';

// Venue detail schemas (8)
import {
  MUSIC_CITY_CENTER_SCHEMA,
  GAYLORD_OPRYLAND_SCHEMA,
  RENAISSANCE_HOTEL_SCHEMA,
  OMNI_HOTEL_SCHEMA,
  JW_MARRIOTT_SCHEMA,
  EMBASSY_SUITES_SCHEMA,
  CITY_WINERY_SCHEMA,
  BELMONT_UNIVERSITY_SCHEMA,
} from './schemas/venue-detail';

/**
 * Central registry: site slug → PageSchema.
 *
 * 20 standard pages + 8 venue detail pages = 28 total.
 * Note: 'corporate-headshot-program' is the legacy slug (301 redirects
 * to executive-imaging), but its schema is still included for seeding.
 */
export const SCHEMA_REGISTRY: Map<string, PageSchema> = new Map([
  // Main pages
  ['home', HOME_PAGE_SCHEMA],
  ['about', ABOUT_PAGE_SCHEMA],
  ['team', TEAM_PAGE_SCHEMA],
  ['contact', CONTACT_PAGE_SCHEMA],
  ['faqs', FAQS_PAGE_SCHEMA],
  ['schedule', SCHEDULE_PAGE_SCHEMA],

  // Services
  ['services', SERVICES_PAGE_SCHEMA],
  ['corporate-event-coverage', CORPORATE_EVENT_COVERAGE_PAGE_SCHEMA],
  ['convention-media', CONVENTION_MEDIA_PAGE_SCHEMA],
  ['trade-show-media', TRADE_SHOW_MEDIA_PAGE_SCHEMA],
  ['headshot-activation', HEADSHOT_ACTIVATION_PAGE_SCHEMA],
  ['executive-imaging', EXECUTIVE_IMAGING_PAGE_SCHEMA],
  ['social-networking-media', SOCIAL_NETWORKING_MEDIA_PAGE_SCHEMA],
  ['event-video-systems', EVENT_VIDEO_SYSTEMS_PAGE_SCHEMA],

  // Solutions
  ['associations', ASSOCIATIONS_PAGE_SCHEMA],
  ['dmcs-agencies', DMCS_AGENCIES_PAGE_SCHEMA],
  ['exhibitors-sponsors', EXHIBITORS_SPONSORS_PAGE_SCHEMA],
  ['venues-solution', VENUES_SOLUTION_PAGE_SCHEMA],

  // Venues overview
  ['venues', VENUES_PAGE_SCHEMA],

  // Legacy slug (301 redirect to executive-imaging)
  ['corporate-headshot-program', CORPORATE_HEADSHOT_PROGRAM_PAGE_SCHEMA],

  // Venue detail pages (key = bare slug used in DynamoDB)
  ['music-city-center', MUSIC_CITY_CENTER_SCHEMA],
  ['gaylord-opryland', GAYLORD_OPRYLAND_SCHEMA],
  ['renaissance-hotel-nashville', RENAISSANCE_HOTEL_SCHEMA],
  ['omni-hotel-nashville', OMNI_HOTEL_SCHEMA],
  ['jw-marriott-nashville', JW_MARRIOTT_SCHEMA],
  ['embassy-suites-nashville', EMBASSY_SUITES_SCHEMA],
  ['city-winery-nashville', CITY_WINERY_SCHEMA],
  ['belmont-university', BELMONT_UNIVERSITY_SCHEMA],
]);

/** All slugs with schema content. */
export const ALL_SCHEMA_SLUGS: string[] = Array.from(SCHEMA_REGISTRY.keys());

/** Look up a PageSchema by site slug. */
export function getSchemaBySlug(slug: string): PageSchema | undefined {
  return SCHEMA_REGISTRY.get(slug);
}
