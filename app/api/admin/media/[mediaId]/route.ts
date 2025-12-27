import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMedia, updateMedia, deleteMedia, getVersionedUrl } from '@/lib/media';
import { deleteImage } from '@/lib/s3';

// Verify editor session
async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('editor_session');

  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, 'base64').toString();
    return decoded.startsWith('editor:');
  } catch {
    return false;
  }
}

// GET - Get a single media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mediaId } = await params;
    const media = await getMedia(mediaId);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Include versioned URL for cache-busting
    return NextResponse.json({
      media: {
        ...media,
        versionedUrl: getVersionedUrl(media),
      },
    });
  } catch (error) {
    console.error('Error getting media:', error);
    return NextResponse.json({ error: 'Failed to get media' }, { status: 500 });
  }
}

// PUT - Update a media item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mediaId } = await params;
    const body = await request.json();

    // Only allow updating certain fields
    const allowedUpdates = ['name', 'alt', 'title', 'caption', 'keywords', 'description', 'tags', 'folderId'];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const media = await updateMedia(mediaId, updates);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({
      media: {
        ...media,
        versionedUrl: getVersionedUrl(media),
      },
    });
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// DELETE - Delete a media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mediaId } = await params;

    // Get media first to get S3 key
    const media = await getMedia(mediaId);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete from S3 if it has an S3 key
    if (media.s3Key) {
      try {
        await deleteImage(media.s3Key);
      } catch (s3Error) {
        console.error('Failed to delete from S3:', s3Error);
        // Continue with DynamoDB deletion even if S3 fails
      }
    }

    // Delete from DynamoDB
    const deleted = await deleteMedia(mediaId);

    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
