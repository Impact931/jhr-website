/**
 * Link Policy — Competitor Blocklist & Partner Preferences
 *
 * Controls which external domains may be linked to in generated articles.
 * Direct competitors in the Nashville event photography market must never
 * receive outbound links (avoid giving them referral traffic or authority).
 */

// Domains that must NEVER be linked to in generated articles
// (direct competitors in Nashville event photography market)
export const COMPETITOR_BLOCKLIST: string[] = [
  // Will be populated from competitor intelligence data
  // Add known competitors here
];

// Preferred partner domains — prioritize linking to these
export const PREFERRED_PARTNERS = [
  {
    domain: 'nashvilleadventures.com',
    name: 'Nashville Adventures',
    backlink: true,
    description: 'Nashville tourism and activities partner — mutual backlink agreement',
  },
  {
    domain: 'visitmusiccity.com',
    name: 'Visit Music City',
    backlink: false,
    description: 'Nashville Convention & Visitors Corp — official Nashville destination marketing',
  },
  {
    domain: 'nashvillechamber.com',
    name: 'Nashville Area Chamber of Commerce',
    backlink: false,
    description: 'Nashville business community and economic development',
  },
];

// Nashville event photography competitor domains (do not link to these)
export const NASHVILLE_PHOTO_COMPETITORS: string[] = [
  // These will be populated by competitor intelligence
  // Example patterns to match:
  // Any domain containing 'photographer' or 'photography' + 'nashville'
];

export function isCompetitorDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return (
    COMPETITOR_BLOCKLIST.some((d) => lower.includes(d)) ||
    NASHVILLE_PHOTO_COMPETITORS.some((d) => lower.includes(d))
  );
}

export function isPreferredPartner(domain: string): boolean {
  const lower = domain.toLowerCase();
  return PREFERRED_PARTNERS.some((p) => lower.includes(p.domain));
}
