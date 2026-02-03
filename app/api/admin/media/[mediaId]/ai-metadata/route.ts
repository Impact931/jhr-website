import { NextRequest, NextResponse } from 'next/server';
import { getMediaItem, updateMediaItem } from '@/lib/media';
import { generateImageMetadata } from '@/lib/media-ai';

interface RouteParams {
  params: Promise<{ mediaId: string }>;
}

/**
 * POST /api/admin/media/[mediaId]/ai-metadata — Generate AI metadata for an image
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { mediaId } = await params;
    const item = await getMediaItem(mediaId);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (item.mediaType !== 'image') {
      return NextResponse.json(
        { error: 'AI metadata is only available for images' },
        { status: 400 }
      );
    }

    // Use the public URL or thumbnail for AI analysis
    const imageUrl = item.publicUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL available for analysis' },
        { status: 400 }
      );
    }

    const metadata = await generateImageMetadata(imageUrl);

    // Update the media item with AI metadata
    const updated = await updateMediaItem(mediaId, {
      aiMetadata: {
        ...metadata,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4o-mini',
      },
      // Auto-fill alt text if not set
      ...(item.alt ? {} : { alt: metadata.altText }),
      // Merge AI tags with existing tags
      tags: Array.from(new Set([...item.tags, ...metadata.tags])),
    });

    return NextResponse.json({ metadata, item: updated });
  } catch (error) {
    console.error('Error generating AI metadata:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
