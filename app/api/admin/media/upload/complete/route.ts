import { NextRequest, NextResponse } from 'next/server';
import { getMediaItem, updateMediaItem } from '@/lib/media';
import type { MediaUploadCompleteRequest } from '@/types/media';

/**
 * POST /api/admin/media/upload/complete — Mark upload as complete, trigger processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MediaUploadCompleteRequest;
    const { mediaId, fileSize } = body;

    if (!mediaId) {
      return NextResponse.json({ error: 'mediaId is required' }, { status: 400 });
    }

    const item = await getMediaItem(mediaId);
    if (!item) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    // Mark as ready immediately (Lambda will upgrade variants later if deployed)
    const updates: Record<string, unknown> = {
      status: 'ready',
    };
    if (fileSize) {
      updates.fileSize = fileSize;
    }

    const updated = await updateMediaItem(mediaId, updates as Parameters<typeof updateMediaItem>[1]);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error completing upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
