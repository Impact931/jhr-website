/**
 * Google Search Console — Shared Utilities
 *
 * Extracted from /api/admin/gsc/route.ts for reuse by the
 * Content Queue API and SEO Engine.
 */

import { getItem, putItem } from '@/lib/dynamodb';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GSCToken {
  pk: string;
  sk: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  connectedAt: string;
  connectedBy: string;
}

export interface GSCSearchRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// ─── Tracked Keywords ───────────────────────────────────────────────────────

export const TRACKED_KEYWORDS = [
  'Nashville corporate event photographer',
  'Nashville conference photographer',
  'Gaylord Opryland event photographer',
  'Music City Center photographer',
  'Nashville headshot activation',
  'Conference headshot lounge Nashville',
  'Nashville trade show photographer',
  'Executive headshots Nashville',
  'Nashville convention photographer',
  'corporate event photography Nashville',
];

// ─── Token Management ───────────────────────────────────────────────────────

/**
 * Retrieves the stored GSC OAuth token from DynamoDB.
 * Returns null if not connected.
 */
export async function getStoredToken(): Promise<GSCToken | null> {
  const token = await getItem<GSCToken>('SETTINGS#gsc', 'oauth-token');
  if (!token || !token.refreshToken) return null;
  return token;
}

/**
 * Refreshes the access token using the stored refresh token.
 * Updates DynamoDB with the new access token.
 */
export async function getValidAccessToken(token: GSCToken): Promise<string> {
  // If current token is still valid (with 5 min buffer), use it
  if (token.accessToken && token.expiresAt > Date.now() + 5 * 60 * 1000) {
    return token.accessToken;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: token.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Token refresh failed:', errText);
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();

  // Update stored token
  await putItem({
    ...token,
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  });

  return data.access_token;
}

// ─── Search Analytics ───────────────────────────────────────────────────────

/**
 * Fetches search analytics data from Google Search Console API.
 */
export async function fetchSearchAnalytics(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = ['query', 'page'],
  rowLimit = 100
): Promise<GSCSearchRow[]> {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('GSC API error:', errText);
    throw new Error(`GSC API error: ${response.status}`);
  }

  const data = await response.json();
  return data.rows || [];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

/**
 * Returns start/end date strings for last N days (accounting for GSC 2-day lag).
 */
export function getDateRange(days: number): { start: string; end: string } {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2); // GSC data has ~2 day lag
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);
  return { start: formatDate(startDate), end: formatDate(endDate) };
}

/**
 * Check if GSC is connected (has stored OAuth token).
 */
export async function isConnected(): Promise<boolean> {
  const token = await getStoredToken();
  return token !== null;
}
