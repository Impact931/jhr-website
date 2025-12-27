import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { createMedia, findMediaByName, updateMedia, CreateMediaInput } from '@/lib/media';
import {
  optimizeImage,
  generateThumbnail,
  validateImage,
  getImageMetadata,
  needsOptimization,
  formatBytes,
} from '@/lib/image-optimization';

// Target max file size: 1MB (adjustable)
const TARGET_MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const BUCKET_REGION = process.env.S3_BUCKET_REGION || 'us-east-1';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

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

// Upload buffer to S3 and return URL (CloudFront if available, otherwise S3)
async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  cacheControl?: string
): Promise<string> {
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: cacheControl || 'public, max-age=31536000, immutable',
  }));

  // Return CloudFront URL if configured, otherwise S3 URL
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
}

// POST - Upload a media file with optimization
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderId = (formData.get('folderId') as string) || 'root';
    const alt = formData.get('alt') as string | undefined;
    const tagsStr = formData.get('tags') as string | undefined;
    const optimize = formData.get('optimize') !== 'false'; // Default to true
    const replaceExisting = formData.get('replaceExisting') === 'true'; // For duplicate handling

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for upload)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    // Check for duplicate by filename
    const existingMedia = await findMediaByName(file.name);
    if (existingMedia && !replaceExisting) {
      // Return warning about duplicate
      return NextResponse.json({
        warning: 'duplicate',
        message: `An image with a similar name "${existingMedia.name}" already exists.`,
        existingMedia: {
          mediaId: existingMedia.mediaId,
          name: existingMedia.name,
          url: existingMedia.url,
          uploadedAt: existingMedia.uploadedAt,
          size: existingMedia.size,
        },
      }, { status: 409 }); // 409 Conflict
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer) as Buffer<ArrayBuffer>;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    const mediaId = existingMedia && replaceExisting ? existingMedia.mediaId : uuidv4();
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'bin';
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase()
      .slice(0, 50);

    let finalBuffer: Buffer<ArrayBuffer> = fileBuffer;
    let finalContentType = file.type;
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;
    const originalSize = file.size;

    // Process images
    if (isImage) {
      // Validate image
      const validation = await validateImage(fileBuffer);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const metadata = await getImageMetadata(fileBuffer);
      width = metadata.width;
      height = metadata.height;

      // Optimize if requested and not a GIF (preserve GIF animation)
      // Also optimize if file is larger than target (1MB)
      const shouldOptimize = optimize && file.type !== 'image/gif' &&
        (needsOptimization(file.size, width, height, { maxFileSize: TARGET_MAX_FILE_SIZE }) || optimize);

      if (shouldOptimize) {
        const optimized = await optimizeImage(fileBuffer, {
          maxWidth: 2400,
          maxHeight: 2400,
          quality: 85,
          format: 'jpeg', // JPEG for photos (better compatibility than WebP)
          maxFileSize: TARGET_MAX_FILE_SIZE,
        });

        finalBuffer = optimized.buffer as Buffer<ArrayBuffer>;
        finalContentType = optimized.format === 'jpeg' ? 'image/jpeg' : `image/${optimized.format}`;
        width = optimized.width;
        height = optimized.height;

        console.log(`Optimized ${file.name}: ${formatBytes(originalSize)} -> ${formatBytes(optimized.size)} (${optimized.compressionRatio?.toFixed(1)}x compression)`);
      }

      // Generate thumbnail
      try {
        const thumb = await generateThumbnail(fileBuffer, 400);
        const thumbKey = `media/thumbnails/${mediaId}-thumb.webp`;
        thumbnailUrl = await uploadToS3(thumb.buffer, thumbKey, 'image/webp');
      } catch (thumbError) {
        console.error('Failed to generate thumbnail:', thumbError);
        // Continue without thumbnail
      }
    }

    // Upload main file
    const fileExt = finalContentType === 'image/jpeg' ? 'jpg' :
                    finalContentType === 'image/webp' ? 'webp' : ext;
    const s3Key = `media/${folderId === 'root' ? '' : folderId + '/'}${sanitizedName}-${timestamp}.${fileExt}`;
    const publicUrl = await uploadToS3(finalBuffer, s3Key, finalContentType);

    // Parse tags
    let tags: string[] | undefined;
    if (tagsStr) {
      tags = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    let media;

    if (existingMedia && replaceExisting) {
      // Update existing media record
      media = await updateMedia(existingMedia.mediaId, {
        name: file.name,
        mimeType: finalContentType,
        s3Key,
        url: publicUrl,
        thumbnailUrl,
        size: finalBuffer.length,
        originalSize,
        width,
        height,
        folderId,
        alt: alt || existingMedia.alt,
        tags: tags || existingMedia.tags,
      });
    } else {
      // Create new media record in DynamoDB
      const mediaInput: CreateMediaInput = {
        name: file.name,
        type: isVideo ? 'video' : 'image',
        mimeType: finalContentType,
        s3Key,
        url: publicUrl,
        thumbnailUrl,
        size: finalBuffer.length,
        originalSize,
        width,
        height,
        folderId,
        alt,
        tags,
      };

      media = await createMedia(mediaInput);
    }

    const compressionPercent = originalSize > 0
      ? ((1 - finalBuffer.length / originalSize) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      media,
      replaced: existingMedia && replaceExisting,
      optimized: isImage && file.type !== 'image/gif' && finalBuffer.length < originalSize,
      originalSize,
      originalSizeFormatted: formatBytes(originalSize),
      finalSize: finalBuffer.length,
      finalSizeFormatted: formatBytes(finalBuffer.length),
      compressionRatio: `${compressionPercent}%`,
    }, { status: existingMedia && replaceExisting ? 200 : 201 });

  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
