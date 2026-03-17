/**
 * Google Search Console — Shared Utilities
 *
 * Supports two auth methods:
 *   1. Service account (preferred) — uses GOOGLE_SERVICE_ACCOUNT_KEY_JSON or key file
 *   2. OAuth token (legacy) — stored in DynamoDB, requires manual consent flow
 */

import { getItem, putItem } from '@/lib/dynamodb';
import { createSign } from 'crypto';

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

// ─── GSC Property URL ───────────────────────────────────────────────────────

/** GSC uses domain property format */
export const GSC_SITE_URL = 'sc-domain:jhr-photography.com';

// ─── Service Account Auth ───────────────────────────────────────────────────

let _saTokenCache: { token: string; expiresAt: number } | null = null;

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id: string;
}

function getServiceAccountKey(): ServiceAccountKey | null {
  // Try env var first (Amplify)
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyJson) {
    try {
      return JSON.parse(keyJson);
    } catch {
      console.warn('[GSC] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY_JSON');
    }
  }

  // Try B64 encoded
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;
  if (keyB64) {
    try {
      return JSON.parse(Buffer.from(keyB64, 'base64').toString());
    } catch {
      console.warn('[GSC] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY_B64');
    }
  }

  // Try file (local dev)
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './google-service-account.json';
    const resolved = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(resolved)) {
      return JSON.parse(fs.readFileSync(resolved, 'utf-8'));
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Get an access token via service account JWT.
 * Caches the token for its lifetime.
 */
async function getServiceAccountToken(): Promise<string | null> {
  // Return cached token if still valid
  if (_saTokenCache && _saTokenCache.expiresAt > Date.now() + 60_000) {
    return _saTokenCache.token;
  }

  const sa = getServiceAccountKey();
  if (!sa) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claims = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claims}`);
  const signature = sign.sign(sa.private_key, 'base64url');

  const jwt = `${header}.${claims}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    console.error('[GSC] Service account token exchange failed:', await response.text());
    return null;
  }

  const data = await response.json();
  _saTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
  return data.access_token;
}

// ─── OAuth Token Management (Legacy) ────────────────────────────────────────

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

  await putItem({
    ...token,
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  });

  return data.access_token;
}

// ─── Unified Access Token ───────────────────────────────────────────────────

/**
 * Get a valid GSC access token — tries service account first, falls back to OAuth.
 */
export async function getGSCAccessToken(): Promise<string | null> {
  // 1. Try service account (no DynamoDB dependency, no consent flow)
  const saToken = await getServiceAccountToken();
  if (saToken) return saToken;

  // 2. Fall back to stored OAuth token
  const oauthToken = await getStoredToken();
  if (oauthToken) {
    try {
      return await getValidAccessToken(oauthToken);
    } catch {
      console.warn('[GSC] OAuth token refresh failed');
    }
  }

  return null;
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
  endDate.setDate(endDate.getDate() - 2);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);
  return { start: formatDate(startDate), end: formatDate(endDate) };
}

/**
 * Check if GSC is connected (service account or OAuth token).
 */
export async function isConnected(): Promise<boolean> {
  // Service account check (no network call needed)
  if (getServiceAccountKey()) return true;
  // Fallback: OAuth token
  const token = await getStoredToken();
  return token !== null;
}
