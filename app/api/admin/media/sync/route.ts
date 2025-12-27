import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { listMedia, updateMedia } from '@/lib/media';

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';

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

// Get actual file size from S3
async function getS3FileInfo(s3Key: string): Promise<{ size: number } | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    const response = await s3Client.send(command);
    return {
      size: response.ContentLength || 0,
    };
  } catch (error) {
    console.error(`Failed to get S3 info for ${s3Key}:`, error);
    return null;
  }
}

// Extract S3 key from URL
function extractS3Key(url: string): string | null {
  // CloudFront URL: https://d2kcvv1z8cjmc8.cloudfront.net/path/to/file.jpg
  // S3 URL: https://jhr-website-images.s3.us-east-1.amazonaws.com/path/to/file.jpg

  const cloudFrontMatch = url.match(/cloudfront\.net\/(.+)$/);
  if (cloudFrontMatch) return cloudFrontMatch[1];

  const s3Match = url.match(/\.amazonaws\.com\/(.+)$/);
  if (s3Match) return s3Match[1];

  return null;
}

// POST - Sync all media metadata from S3
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const mediaId = body.mediaId; // Optional: sync single item

    let items;
    if (mediaId) {
      // Sync single item - we'll handle this through the list
      const result = await listMedia({ limit: 1000 });
      items = result.items.filter(item => item.mediaId === mediaId);
    } else {
      // Sync all
      const result = await listMedia({ limit: 1000 });
      items = result.items;
    }

    const results = {
      total: items.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      details: [] as Array<{ name: string; oldSize: number; newSize: number; status: string }>,
    };

    for (const item of items) {
      // Skip external videos
      if (!item.s3Key || item.type === 'video') {
        results.skipped++;
        continue;
      }

      // Get S3 key from URL or stored key
      const s3Key = item.s3Key || extractS3Key(item.url);
      if (!s3Key) {
        results.skipped++;
        continue;
      }

      const s3Info = await getS3FileInfo(s3Key);
      if (!s3Info) {
        results.errors++;
        results.details.push({
          name: item.name,
          oldSize: item.size,
          newSize: 0,
          status: 'error',
        });
        continue;
      }

      // Check if size changed
      if (s3Info.size !== item.size) {
        // Store original size if not already stored
        const originalSize = item.originalSize || item.size;

        await updateMedia(item.mediaId, {
          size: s3Info.size,
          originalSize: originalSize,
        });

        results.updated++;
        results.details.push({
          name: item.name,
          oldSize: item.size,
          newSize: s3Info.size,
          status: 'updated',
        });
      } else {
        results.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.updated} items, skipped ${results.skipped}, ${results.errors} errors`,
      results,
    });
  } catch (error) {
    console.error('Error syncing media:', error);
    return NextResponse.json({ error: 'Failed to sync media' }, { status: 500 });
  }
}
