import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface YouTubeChannelStats {
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration?: string;
}

interface YouTubeConnectedResponse {
  connected: true;
  platform: 'youtube';
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    customUrl?: string;
  };
  statistics: YouTubeChannelStats;
  recentVideos: YouTubeVideo[];
}

interface YouTubeDisconnectedResponse {
  connected: false;
  platform: 'youtube';
}

type YouTubeResponse = YouTubeConnectedResponse | YouTubeDisconnectedResponse;

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY;

  // Check if credentials are configured
  if (!channelId || !apiKey) {
    const response: YouTubeDisconnectedResponse = {
      connected: false,
      platform: 'youtube',
    };
    return NextResponse.json(response);
  }

  try {
    // Fetch channel info and statistics
    const channelRes = await fetch(
      `${YOUTUBE_API}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!channelRes.ok) {
      console.error('YouTube API channel error:', await channelRes.text());
      return NextResponse.json(
        { connected: false, platform: 'youtube', error: 'Failed to fetch channel data' },
        { status: 502 }
      );
    }

    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return NextResponse.json(
        { connected: false, platform: 'youtube', error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Fetch recent videos (search for uploads)
    const videosRes = await fetch(
      `${YOUTUBE_API}/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&type=video&key=${apiKey}`
    );

    let recentVideos: YouTubeVideo[] = [];

    if (videosRes.ok) {
      const videosData = await videosRes.json();
      const videoIds = (videosData.items || [])
        .map((item: Record<string, Record<string, string>>) => item.id?.videoId)
        .filter(Boolean)
        .join(',');

      // Fetch video statistics
      if (videoIds) {
        const statsRes = await fetch(
          `${YOUTUBE_API}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
        );

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          recentVideos = (statsData.items || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => ({
              id: item.id,
              title: item.snippet?.title || '',
              description: item.snippet?.description || '',
              thumbnailUrl:
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.default?.url ||
                '',
              publishedAt: item.snippet?.publishedAt || '',
              viewCount: parseInt(item.statistics?.viewCount || '0', 10),
              likeCount: parseInt(item.statistics?.likeCount || '0', 10),
              commentCount: parseInt(item.statistics?.commentCount || '0', 10),
              duration: item.contentDetails?.duration,
            })
          );
        }
      }
    }

    const response: YouTubeConnectedResponse = {
      connected: true,
      platform: 'youtube',
      channel: {
        id: channel.id,
        title: channel.snippet?.title || '',
        description: channel.snippet?.description || '',
        thumbnailUrl:
          channel.snippet?.thumbnails?.medium?.url ||
          channel.snippet?.thumbnails?.default?.url ||
          '',
        customUrl: channel.snippet?.customUrl,
      },
      statistics: {
        subscriberCount: parseInt(channel.statistics?.subscriberCount || '0', 10),
        viewCount: parseInt(channel.statistics?.viewCount || '0', 10),
        videoCount: parseInt(channel.statistics?.videoCount || '0', 10),
      },
      recentVideos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { connected: false, platform: 'youtube', error: 'Failed to connect to YouTube API' },
      { status: 502 }
    );
  }
}
