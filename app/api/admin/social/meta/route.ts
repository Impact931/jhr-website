import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface MetaInsights {
  reach: number;
  impressions: number;
  profileViews: number;
  websiteClicks: number;
}

interface MetaMedia {
  id: string;
  caption?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
}

interface MetaConnectedResponse {
  connected: true;
  platform: 'instagram' | 'facebook';
  account: {
    id: string;
    name: string;
    username?: string;
    followersCount: number;
    mediaCount: number;
    profilePictureUrl?: string;
  };
  insights: MetaInsights;
  recentMedia: MetaMedia[];
}

interface MetaDisconnectedResponse {
  connected: false;
  platform: 'instagram' | 'facebook';
}

type MetaResponse = MetaConnectedResponse | MetaDisconnectedResponse;

const META_GRAPH_API = 'https://graph.facebook.com/v19.0';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.IG_BUSINESS_USER_ID;
  const platform = new URL('http://localhost').searchParams.get('platform') || 'instagram';

  // Check if credentials are configured
  if (!accessToken || !igUserId) {
    const response: MetaDisconnectedResponse = {
      connected: false,
      platform: 'instagram',
    };
    return NextResponse.json(response);
  }

  try {
    // Fetch Instagram Business Account info
    const accountRes = await fetch(
      `${META_GRAPH_API}/${igUserId}?fields=id,name,username,followers_count,media_count,profile_picture_url&access_token=${accessToken}`
    );

    if (!accountRes.ok) {
      console.error('Meta API account error:', await accountRes.text());
      return NextResponse.json(
        { connected: false, platform: 'instagram', error: 'Failed to fetch account data' },
        { status: 502 }
      );
    }

    const accountData = await accountRes.json();

    // Fetch insights (last 7 days)
    const insightsRes = await fetch(
      `${META_GRAPH_API}/${igUserId}/insights?metric=reach,impressions,profile_views,website_clicks&period=day&since=${getDateNDaysAgo(7)}&until=${getTodayDate()}&access_token=${accessToken}`
    );

    const insights: MetaInsights = {
      reach: 0,
      impressions: 0,
      profileViews: 0,
      websiteClicks: 0,
    };

    if (insightsRes.ok) {
      const insightsData = await insightsRes.json();
      if (insightsData.data) {
        for (const metric of insightsData.data) {
          const total = metric.values?.reduce(
            (sum: number, v: { value: number }) => sum + (v.value || 0),
            0
          ) || 0;

          switch (metric.name) {
            case 'reach':
              insights.reach = total;
              break;
            case 'impressions':
              insights.impressions = total;
              break;
            case 'profile_views':
              insights.profileViews = total;
              break;
            case 'website_clicks':
              insights.websiteClicks = total;
              break;
          }
        }
      }
    }

    // Fetch recent media
    const mediaRes = await fetch(
      `${META_GRAPH_API}/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=12&access_token=${accessToken}`
    );

    let recentMedia: MetaMedia[] = [];
    if (mediaRes.ok) {
      const mediaData = await mediaRes.json();
      recentMedia = (mediaData.data || []).map((item: Record<string, unknown>) => ({
        id: item.id,
        caption: item.caption,
        mediaType: item.media_type,
        mediaUrl: item.media_url,
        thumbnailUrl: item.thumbnail_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
        likeCount: item.like_count || 0,
        commentsCount: item.comments_count || 0,
      }));
    }

    const response: MetaConnectedResponse = {
      connected: true,
      platform: 'instagram',
      account: {
        id: accountData.id,
        name: accountData.name || accountData.username,
        username: accountData.username,
        followersCount: accountData.followers_count || 0,
        mediaCount: accountData.media_count || 0,
        profilePictureUrl: accountData.profile_picture_url,
      },
      insights,
      recentMedia,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Meta API error:', error);
    return NextResponse.json(
      { connected: false, platform: 'instagram', error: 'Failed to connect to Meta API' },
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
