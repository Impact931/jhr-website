import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createMedia, listMedia } from '@/lib/media';
import fs from 'fs/promises';
import path from 'path';

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
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Recursively get all image files in a directory
async function getImageFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  async function scan(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (imageExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error);
    }
  }

  await scan(dir);
  return files;
}

// POST - Import public images to S3 and media library
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');

    // Get all image files
    const imageFiles = await getImageFiles(publicImagesDir);

    // Get existing media to avoid duplicates
    const { items: existingMedia } = await listMedia({ limit: 1000 });
    const existingNames = new Set(existingMedia.map(m => m.name));

    const imported: string[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    for (const filePath of imageFiles) {
      const filename = path.basename(filePath);
      const relativePath = path.relative(publicImagesDir, filePath);

      // Skip if already imported
      if (existingNames.has(filename)) {
        skipped.push(filename);
        continue;
      }

      try {
        // Read file
        const fileBuffer = await fs.readFile(filePath);
        const stats = await fs.stat(filePath);
        const mimeType = getMimeType(filename);

        // Upload to S3
        const s3Key = `public-images/${relativePath.replace(/\\/g, '/')}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        const publicUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${s3Key}`;

        // Create media record
        await createMedia({
          name: filename,
          type: 'image',
          mimeType,
          s3Key,
          url: publicUrl,
          size: stats.size,
          folderId: 'root',
          alt: filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''),
        });

        imported.push(filename);
      } catch (err) {
        errors.push(filename);
        console.error(`Failed to import ${filename}:`, err);
      }
    }

    return NextResponse.json({
      total: imageFiles.length,
      imported: imported.length,
      skipped: skipped.length,
      errors: errors.length,
      importedFiles: imported,
    });
  } catch (error) {
    console.error('Error importing public images:', error);
    return NextResponse.json({ error: 'Failed to import public images' }, { status: 500 });
  }
}
