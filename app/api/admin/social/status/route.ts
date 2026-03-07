import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const platforms = [];

  // Instagram
  const igToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.IG_BUSINESS_USER_ID;
  platforms.push({
    name: 'Instagram',
    connected: !!(igToken && igUserId),
  });

  // Facebook (uses same Meta token)
  const fbPageToken = process.env.META_PAGE_ACCESS_TOKEN;
  platforms.push({
    name: 'Facebook',
    connected: !!fbPageToken,
  });

  // YouTube
  const ytChannelId = process.env.YOUTUBE_CHANNEL_ID;
  const ytApiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY;
  platforms.push({
    name: 'YouTube',
    connected: !!(ytChannelId && ytApiKey),
  });

  return NextResponse.json({ platforms });
}
