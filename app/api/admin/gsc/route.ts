import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItem, putItem } from '@/lib/dynamodb';

/** Pre-configured keywords to track for JHR Photography */
const TRACKED_KEYWORDS = [
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

interface GSCToken {
  pk: string;
  sk: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  connectedAt: string;
  connectedBy: string;
}

interface GSCSearchRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Refreshes the access token using the stored refresh token.
 * Updates DynamoDB with the new access token.
 */
async function getValidAccessToken(token: GSCToken): Promise<string> {
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

/**
 * Fetches search analytics data from Google Search Console API.
 */
async function fetchSearchAnalytics(
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

/**
 * GET /api/admin/gsc
 * Fetches GSC data. Query param `type` determines the data type:
 * - searchAnalytics: Top queries and pages
 * - keywords: Tracked keyword positions
 * - status: Connection status only
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'searchAnalytics';

  // Check for stored OAuth token
  const token = await getItem<GSCToken>('SETTINGS#gsc', 'oauth-token');

  if (!token || !token.refreshToken) {
    return NextResponse.json({ connected: false });
  }

  // For status check, just confirm connection
  if (type === 'status') {
    return NextResponse.json({
      connected: true,
      connectedAt: token.connectedAt,
      connectedBy: token.connectedBy,
    });
  }

  const siteUrl = process.env.GSC_PROPERTY_URL || 'https://jhr-photography.com';

  try {
    const accessToken = await getValidAccessToken(token);

    // Calculate date range (last 7 days)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // GSC data has ~2 day lag
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (type === 'keywords') {
      // Fetch data filtered to tracked keywords
      const rows = await fetchSearchAnalytics(
        accessToken,
        siteUrl,
        start,
        end,
        ['query'],
        1000
      );

      // Filter to tracked keywords (case-insensitive)
      const keywordData = TRACKED_KEYWORDS.map((keyword) => {
        const row = rows.find(
          (r) => r.keys[0]?.toLowerCase() === keyword.toLowerCase()
        );
        return {
          keyword,
          position: row ? Math.round(row.position * 10) / 10 : null,
          clicks: row?.clicks ?? 0,
          impressions: row?.impressions ?? 0,
          ctr: row ? Math.round(row.ctr * 10000) / 100 : 0,
        };
      });

      // Also fetch previous 7 days for change calculation
      const prevEnd = new Date(startDate);
      prevEnd.setDate(prevEnd.getDate() - 1);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);

      const prevRows = await fetchSearchAnalytics(
        accessToken,
        siteUrl,
        formatDate(prevStart),
        formatDate(prevEnd),
        ['query'],
        1000
      );

      const keywordDataWithChange = keywordData.map((kd) => {
        const prevRow = prevRows.find(
          (r) => r.keys[0]?.toLowerCase() === kd.keyword.toLowerCase()
        );
        const prevPosition = prevRow ? Math.round(prevRow.position * 10) / 10 : null;
        let change: number | null = null;
        if (kd.position !== null && prevPosition !== null) {
          // Positive change = improved (went up), negative = declined
          change = Math.round((prevPosition - kd.position) * 10) / 10;
        }
        return { ...kd, change };
      });

      return NextResponse.json({
        connected: true,
        type: 'keywords',
        dateRange: { start, end },
        keywords: keywordDataWithChange,
      });
    }

    if (type === 'searchAnalytics') {
      // Fetch top queries and pages
      const [queryRows, pageRows] = await Promise.all([
        fetchSearchAnalytics(accessToken, siteUrl, start, end, ['query'], 50),
        fetchSearchAnalytics(accessToken, siteUrl, start, end, ['page'], 50),
      ]);

      // Calculate totals
      const totals = pageRows.reduce(
        (acc, row) => ({
          clicks: acc.clicks + row.clicks,
          impressions: acc.impressions + row.impressions,
          ctrSum: acc.ctrSum + row.ctr * row.impressions,
          positionSum: acc.positionSum + row.position * row.impressions,
        }),
        { clicks: 0, impressions: 0, ctrSum: 0, positionSum: 0 }
      );

      const avgCtr =
        totals.impressions > 0
          ? Math.round((totals.ctrSum / totals.impressions) * 10000) / 100
          : 0;
      const avgPosition =
        totals.impressions > 0
          ? Math.round((totals.positionSum / totals.impressions) * 10) / 10
          : 0;

      return NextResponse.json({
        connected: true,
        type: 'searchAnalytics',
        dateRange: { start, end },
        totals: {
          clicks: totals.clicks,
          impressions: totals.impressions,
          avgCtr,
          avgPosition,
        },
        queries: queryRows.map((r) => ({
          query: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: Math.round(r.ctr * 10000) / 100,
          position: Math.round(r.position * 10) / 10,
        })),
        pages: pageRows.map((r) => ({
          page: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: Math.round(r.ctr * 10000) / 100,
          position: Math.round(r.position * 10) / 10,
        })),
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (err) {
    console.error('GSC API error:', err);
    return NextResponse.json(
      {
        connected: true,
        error: err instanceof Error ? err.message : 'Failed to fetch GSC data',
      },
      { status: 500 }
    );
  }
}
