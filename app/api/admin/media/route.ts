import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  listMedia,
  createMedia,
  searchMedia,
  getMediaStats,
  CreateMediaInput
} from '@/lib/media';
import { parseVideoUrl } from '@/lib/video';

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

// GET - List media items
export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || undefined;
    const type = searchParams.get('type') as 'image' | 'video' | undefined;
    const search = searchParams.get('search');
    const stats = searchParams.get('stats') === 'true';

    // If stats requested, return media statistics
    if (stats) {
      const mediaStats = await getMediaStats();
      return NextResponse.json({ stats: mediaStats });
    }

    // If search query provided, search media
    if (search) {
      const items = await searchMedia(search);
      return NextResponse.json({ items, total: items.length });
    }

    // List media with filters
    const result = await listMedia({ folderId, type, limit: 100 });

    return NextResponse.json({
      items: result.items,
      total: result.items.length,
      hasMore: !!result.lastKey,
    });
  } catch (error) {
    console.error('Error listing media:', error);
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}

// POST - Create a new media item (for external videos)
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, externalUrl, folderId = 'root', alt, tags } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // If external URL provided, parse video info
    if (externalUrl) {
      const videoInfo = parseVideoUrl(externalUrl);
      if (!videoInfo) {
        return NextResponse.json(
          { error: 'Invalid video URL. Only YouTube and Vimeo are supported.' },
          { status: 400 }
        );
      }

      const mediaInput: CreateMediaInput = {
        name,
        type: 'video',
        mimeType: 'video/external',
        s3Key: null,
        url: videoInfo.url,
        thumbnailUrl: videoInfo.thumbnailUrl,
        size: 0,
        folderId,
        externalUrl: videoInfo.url,
        alt,
        tags,
      };

      const media = await createMedia(mediaInput);
      return NextResponse.json({ media }, { status: 201 });
    }

    // For regular file uploads, use the /upload endpoint
    return NextResponse.json(
      { error: 'Use /api/admin/media/upload for file uploads' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}
