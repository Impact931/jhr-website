/**
 * Video URL parsing utilities for YouTube and Vimeo
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'unknown';

export interface VideoInfo {
  provider: VideoProvider;
  videoId: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  thumbnailUrlHigh?: string;
}

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

// Vimeo URL patterns
const VIMEO_PATTERNS = [
  /vimeo\.com\/(\d+)/,
  /player\.vimeo\.com\/video\/(\d+)/,
];

/**
 * Parse a video URL and extract provider info
 */
export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null;

  // Try YouTube patterns
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        provider: 'youtube',
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        thumbnailUrlHigh: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }
  }

  // Try Vimeo patterns
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        provider: 'vimeo',
        videoId,
        url: `https://vimeo.com/${videoId}`,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        // Vimeo thumbnails require API call, use placeholder
        thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
        thumbnailUrlHigh: `https://vumbnail.com/${videoId}_large.jpg`,
      };
    }
  }

  return null;
}

/**
 * Check if a URL is a supported video URL
 */
export function isVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null;
}

/**
 * Get the video provider from a URL
 */
export function getVideoProvider(url: string): VideoProvider {
  const info = parseVideoUrl(url);
  return info?.provider || 'unknown';
}

/**
 * Generate an embed iframe HTML for a video
 */
export function getVideoEmbed(
  url: string,
  options?: {
    width?: number | string;
    height?: number | string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
  }
): string | null {
  const info = parseVideoUrl(url);
  if (!info) return null;

  const width = options?.width || '100%';
  const height = options?.height || 315;
  const autoplay = options?.autoplay ? '1' : '0';
  const muted = options?.muted ? '1' : '0';
  const loop = options?.loop ? '1' : '0';

  let embedUrl = info.embedUrl;

  if (info.provider === 'youtube') {
    const params = new URLSearchParams({
      autoplay,
      mute: muted,
      loop,
      rel: '0', // Don't show related videos
      modestbranding: '1',
    });
    if (options?.loop) {
      params.set('playlist', info.videoId);
    }
    embedUrl += `?${params.toString()}`;
  } else if (info.provider === 'vimeo') {
    const params = new URLSearchParams({
      autoplay,
      muted,
      loop,
      byline: '0',
      portrait: '0',
    });
    embedUrl += `?${params.toString()}`;
  }

  return `<iframe
    width="${width}"
    height="${height}"
    src="${embedUrl}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>`;
}

/**
 * Get thumbnail URL for a video
 */
export function getVideoThumbnail(url: string, highQuality: boolean = false): string | null {
  const info = parseVideoUrl(url);
  if (!info) return null;

  return highQuality && info.thumbnailUrlHigh ? info.thumbnailUrlHigh : info.thumbnailUrl;
}

/**
 * Validate a video URL format
 */
export function validateVideoUrl(url: string): {
  valid: boolean;
  error?: string;
  info?: VideoInfo;
} {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    new URL(url); // Validate URL format
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  const info = parseVideoUrl(url);
  if (!info) {
    return {
      valid: false,
      error: 'URL must be a valid YouTube or Vimeo link'
    };
  }

  return { valid: true, info };
}

/**
 * Extract video ID from a URL
 */
export function extractVideoId(url: string): string | null {
  const info = parseVideoUrl(url);
  return info?.videoId || null;
}

/**
 * Generate video metadata from URL
 */
export function getVideoMetadata(url: string): {
  provider: VideoProvider;
  videoId: string;
  thumbnailUrl: string;
  embedUrl: string;
} | null {
  const info = parseVideoUrl(url);
  if (!info) return null;

  return {
    provider: info.provider,
    videoId: info.videoId,
    thumbnailUrl: info.thumbnailUrl,
    embedUrl: info.embedUrl,
  };
}
