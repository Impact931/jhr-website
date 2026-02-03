import { NextRequest, NextResponse } from 'next/server';
import { generateMediaId, createMediaItem } from '@/lib/media';
import type { VideoEmbedRequest, VideoEmbedResponse, VideoProvider } from '@/types/media';

/**
 * POST /api/admin/media/video-embed — Parse a video URL and create embed record
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VideoEmbedRequest;

    if (!body.url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    const parsed = parseVideoUrl(body.url);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Unsupported video URL. Supported: YouTube, Vimeo' },
        { status: 400 }
      );
    }

    // Fetch oEmbed data for thumbnail/title
    const oembed = await fetchOEmbed(parsed.provider, body.url);

    const mediaId = generateMediaId();
    const now = new Date().toISOString();

    // Create media record for the embed
    await createMediaItem({
      mediaId,
      filename: oembed?.title || `${parsed.provider}-${parsed.videoId}`,
      mimeType: 'video/embed',
      mediaType: 'video',
      status: 'ready',
      source: 'embed',
      s3Key: '',
      variants: {},
      fileSize: 0,
      tags: [],
      publicUrl: body.url,
      thumbnailUrl: oembed?.thumbnailUrl || parsed.thumbnailUrl,
      videoEmbed: {
        provider: parsed.provider,
        videoId: parsed.videoId,
        embedUrl: parsed.embedUrl,
        thumbnailUrl: oembed?.thumbnailUrl || parsed.thumbnailUrl,
        title: oembed?.title,
      },
      createdAt: now,
      updatedAt: now,
    });

    const response: VideoEmbedResponse = {
      provider: parsed.provider,
      videoId: parsed.videoId,
      embedUrl: parsed.embedUrl,
      thumbnailUrl: oembed?.thumbnailUrl || parsed.thumbnailUrl,
      title: oembed?.title,
    };

    return NextResponse.json({ ...response, mediaId });
  } catch (error) {
    console.error('Error creating video embed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
}

function parseVideoUrl(url: string): ParsedVideo | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  return null;
}

async function fetchOEmbed(
  provider: VideoProvider,
  url: string
): Promise<{ title?: string; thumbnailUrl?: string } | null> {
  try {
    let oembedUrl: string;
    if (provider === 'youtube') {
      oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    } else if (provider === 'vimeo') {
      oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
    } else {
      return null;
    }

    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch {
    return null;
  }
}
