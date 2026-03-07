import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json({ connected: false });
  }

  // Parse days param (default 7, max 90)
  const daysParam = req.nextUrl.searchParams.get('days');
  let days = daysParam ? parseInt(daysParam, 10) : 7;
  if (isNaN(days) || days < 1) days = 7;
  if (days > 90) days = 90;

  const client = new BetaAnalyticsDataClient({
    keyFilename:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE ||
      './google-service-account.json',
  });

  const property = `properties/${propertyId}`;
  const dateRange = {
    startDate: `${days}daysAgo`,
    endDate: 'today',
  };

  try {
    // Run all four reports in parallel
    const [overviewRes, topPagesRes, trafficSourcesRes, formVisitsRes] =
      await Promise.all([
        // 1. Traffic overview by date
        client.runReport({
          property,
          dateRanges: [dateRange],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date', orderType: 'ALPHANUMERIC' } }],
        }),

        // 2. Top pages
        client.runReport({
          property,
          dateRanges: [dateRange],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'activeUsers' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),

        // 3. Traffic sources
        client.runReport({
          property,
          dateRanges: [dateRange],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        }),

        // 4. Form page visits (pagePath contains "contact" or "book")
        client.runReport({
          property,
          dateRanges: [dateRange],
          dimensions: [{ name: 'pagePath' }, { name: 'pageReferrer' }],
          metrics: [{ name: 'screenPageViews' }],
          dimensionFilter: {
            orGroup: {
              expressions: [
                {
                  filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                      matchType: 'CONTAINS',
                      value: 'contact',
                    },
                  },
                },
                {
                  filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                      matchType: 'CONTAINS',
                      value: 'book',
                    },
                  },
                },
              ],
            },
          },
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        }),
      ]);

    // --- Parse overview ---
    const overviewRows = overviewRes[0].rows || [];
    let totalUsers = 0;
    let totalSessions = 0;
    let totalPageViews = 0;
    let totalBounceRateWeighted = 0;
    let totalDurationWeighted = 0;

    const daily = overviewRows.map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value || '';
      // GA4 returns date as YYYYMMDD — format to YYYY-MM-DD
      const date = rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;

      const activeUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const sessions = parseInt(row.metricValues?.[1]?.value || '0', 10);
      const pageViews = parseInt(row.metricValues?.[2]?.value || '0', 10);
      const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0');
      const avgSessionDuration = parseFloat(row.metricValues?.[4]?.value || '0');

      totalUsers += activeUsers;
      totalSessions += sessions;
      totalPageViews += pageViews;
      totalBounceRateWeighted += bounceRate * sessions;
      totalDurationWeighted += avgSessionDuration * sessions;

      return {
        date,
        activeUsers,
        sessions,
        pageViews,
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgSessionDuration: Math.round(avgSessionDuration),
      };
    });

    const totals = {
      activeUsers: totalUsers,
      sessions: totalSessions,
      pageViews: totalPageViews,
      bounceRate:
        totalSessions > 0
          ? Math.round((totalBounceRateWeighted / totalSessions) * 100) / 100
          : 0,
      avgSessionDuration:
        totalSessions > 0
          ? Math.round(totalDurationWeighted / totalSessions)
          : 0,
    };

    // --- Parse top pages ---
    const topPages = (topPagesRes[0].rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
      users: parseInt(row.metricValues?.[1]?.value || '0', 10),
    }));

    // --- Parse traffic sources ---
    const trafficSources = (trafficSourcesRes[0].rows || []).map((row) => ({
      channel: row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
      users: parseInt(row.metricValues?.[1]?.value || '0', 10),
    }));

    // --- Parse form page visits ---
    const formPageVisits = (formVisitsRes[0].rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      referrer: row.dimensionValues?.[1]?.value || '',
      pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
    }));

    // Compute actual date strings for the response
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    return NextResponse.json({
      connected: true,
      dateRange: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
      },
      overview: { daily, totals },
      topPages,
      trafficSources,
      formPageVisits,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown GA4 error';
    console.error('GA4 API error:', message);
    return NextResponse.json(
      { error: `GA4 request failed: ${message}` },
      { status: 502 }
    );
  }
}
