import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMediaUsage, getMedia } from '@/lib/media';

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

// GET - Get usage locations for a media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mediaId } = await params;

    // Verify media exists
    const media = await getMedia(mediaId);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Get usage locations
    const usedIn = await getMediaUsage(mediaId);

    return NextResponse.json({
      mediaId,
      usedIn,
      totalUsage: usedIn.length,
    });
  } catch (error) {
    console.error('Error getting media usage:', error);
    return NextResponse.json({ error: 'Failed to get media usage' }, { status: 500 });
  }
}
