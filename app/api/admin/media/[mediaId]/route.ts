import { NextRequest, NextResponse } from 'next/server';
import { getMediaItem, updateMediaItem, deleteMediaItem, getMediaUsage } from '@/lib/media';
import type { MediaUpdateRequest } from '@/types/media';

interface RouteParams {
  params: Promise<{ mediaId: string }>;
}

/**
 * GET /api/admin/media/[mediaId] — Get single media item with usage data
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { mediaId } = await params;
    const item = await getMediaItem(mediaId);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const usage = await getMediaUsage(mediaId);
    return NextResponse.json({ ...item, usage });
  } catch (error) {
    console.error('Error getting media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/media/[mediaId] — Update media metadata
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { mediaId } = await params;
    const body = (await request.json()) as MediaUpdateRequest;

    const updated = await updateMediaItem(mediaId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/media/[mediaId] — Delete media item
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { mediaId } = await params;

    // Check usage before delete
    const usage = await getMediaUsage(mediaId);
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (usage.length > 0 && !force) {
      return NextResponse.json(
        {
          error: 'Media is in use',
          usage,
          message: `This media is used on ${usage.length} page(s). Add ?force=true to delete anyway.`,
        },
        { status: 409 }
      );
    }

    const deleted = await deleteMediaItem(mediaId);
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
