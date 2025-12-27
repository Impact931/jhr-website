import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createMedia, listMedia } from '@/lib/media';

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const BUCKET_REGION = process.env.S3_BUCKET_REGION || 'us-east-1';

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

// Get MIME type from file extension
function getMimeType(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Determine if file is image or video
function getMediaType(mimeType: string): 'image' | 'video' {
  return mimeType.startsWith('video/') ? 'video' : 'image';
}

// POST - Scan S3 bucket and import existing files to media library
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { prefix = '' } = await request.json().catch(() => ({}));

    // Get existing media items to avoid duplicates
    const { items: existingMedia } = await listMedia({ limit: 1000 });
    const existingS3Keys = new Set(existingMedia.map(m => m.s3Key).filter(Boolean));

    // List objects in S3 bucket
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];

    // Filter for media files and exclude already imported
    const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'];
    const newFiles = objects.filter(obj => {
      if (!obj.Key) return false;
      const ext = obj.Key.split('.').pop()?.toLowerCase() || '';
      if (!mediaExtensions.includes(ext)) return false;
      if (existingS3Keys.has(obj.Key)) return false;
      return true;
    });

    // Import new files
    const imported: string[] = [];
    const errors: string[] = [];

    for (const obj of newFiles) {
      if (!obj.Key) continue;

      try {
        const mimeType = getMimeType(obj.Key);
        const type = getMediaType(mimeType);
        const name = obj.Key.split('/').pop() || obj.Key;
        const url = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${obj.Key}`;

        await createMedia({
          name,
          type,
          mimeType,
          s3Key: obj.Key,
          url,
          size: obj.Size || 0,
          folderId: 'root',
        });

        imported.push(obj.Key);
      } catch (err) {
        errors.push(obj.Key);
        console.error(`Failed to import ${obj.Key}:`, err);
      }
    }

    return NextResponse.json({
      scanned: objects.length,
      imported: imported.length,
      skipped: objects.length - newFiles.length,
      errors: errors.length,
      importedFiles: imported,
    });
  } catch (error) {
    console.error('Error scanning S3:', error);
    return NextResponse.json({ error: 'Failed to scan S3 bucket' }, { status: 500 });
  }
}

// GET - List S3 bucket contents without importing
export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 100,
    });

    const response = await s3Client.send(command);
    const objects = (response.Contents || []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified?.toISOString(),
      url: `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${obj.Key}`,
    }));

    return NextResponse.json({
      objects,
      isTruncated: response.IsTruncated,
      nextToken: response.NextContinuationToken,
    });
  } catch (error) {
    console.error('Error listing S3:', error);
    return NextResponse.json({ error: 'Failed to list S3 bucket' }, { status: 500 });
  }
}
