import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const META_GRAPH_API = 'https://graph.facebook.com/v19.0';

interface DailyMetric {
  date: string;
  value: number;
}

interface FacebookPageResponse {
  connected: true;
  page: {
    name: string;
    followersCount: number;
    fanCount: number;
  };
  metrics: {
    pageViews: DailyMetric[];
    reactions: DailyMetric[];
  };
}

interface FacebookDisconnectedResponse {
  connected: false;
}

type FacebookResponse = FacebookPageResponse | FacebookDisconnectedResponse;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    const response: FacebookDisconnectedResponse = { connected: false };
    return NextResponse.json(response);
  }

  const pageId = process.env.FB_PAGE_ID || '977926968925539';

  // Parse days param (default 7, max 90)
  const { searchParams } = new URL(request.url);
  const daysParam = parseInt(searchParams.get('days') || '7', 10);
  const days = Math.min(Math.max(1, isNaN(daysParam) ? 7 : daysParam), 90);

  const since = getDateNDaysAgo(days);
  const until = getTodayDate();

  try {
    // Fetch page info and insights in parallel
    const [pageRes, insightsRes] = await Promise.all([
      fetch(
        `${META_GRAPH_API}/${pageId}?fields=followers_count,fan_count,name&access_token=${accessToken}`
      ),
      fetch(
        `${META_GRAPH_API}/${pageId}/insights?metric=page_views_total,page_actions_post_reactions_total&period=day&since=${since}&until=${until}&access_token=${accessToken}`
      ),
    ]);

    if (!pageRes.ok) {
      console.error('Facebook Page API error:', await pageRes.text());
      return NextResponse.json(
        { connected: false, error: 'Failed to fetch page data' },
        { status: 502 }
      );
    }

    const pageData = await pageRes.json();

    let pageViews: DailyMetric[] = [];
    let reactions: DailyMetric[] = [];

    if (insightsRes.ok) {
      const insightsData = await insightsRes.json();
      if (insightsData.data) {
        for (const metric of insightsData.data) {
          const dailyValues: DailyMetric[] = (metric.values || []).map(
            (v: { end_time: string; value: number | Record<string, number> }) => ({
              date: v.end_time.split('T')[0],
              value: typeof v.value === 'object' && v.value !== null
                ? Object.values(v.value).reduce((sum, n) => sum + (n || 0), 0)
                : (v.value || 0),
            })
          );

          switch (metric.name) {
            case 'page_views_total':
              pageViews = dailyValues;
              break;
            case 'page_actions_post_reactions_total':
              reactions = dailyValues;
              break;
          }
        }
      }
    } else {
      console.error('Facebook Insights API error:', await insightsRes.text());
    }

    const response: FacebookPageResponse = {
      connected: true,
      page: {
        name: pageData.name || '',
        followersCount: pageData.followers_count || 0,
        fanCount: pageData.fan_count || 0,
      },
      metrics: {
        pageViews,
        reactions,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Facebook API error:', error);
    return NextResponse.json(
      { connected: false, error: 'Failed to connect to Facebook API' },
      { status: 502 }
    );
  }
}

function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
