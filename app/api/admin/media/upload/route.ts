import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/s3';
import { generateMediaId, createMediaItem, getCollection, updateCollection } from '@/lib/media';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  MAX_DOCUMENT_SIZE_MB,
} from '@/types/media';
import type { MediaUploadRequest, MediaUploadResponse, MediaType } from '@/types/media';

/**
 * POST /api/admin/media/upload — Generate presigned URL and create media record
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MediaUploadRequest;
    const { filename, contentType, fileSize, contentHash, collectionId } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Determine media type
    const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(contentType);
    const isVideo = (ALLOWED_VIDEO_TYPES as readonly string[]).includes(contentType);
    const isDocument = (ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(contentType);
    if (!isImage && !isVideo && !isDocument) {
      return NextResponse.json(
        { error: `Unsupported file type: ${contentType}` },
        { status: 400 }
      );
    }

    const mediaType: MediaType = isImage ? 'image' : isVideo ? 'video' : 'document';
    const maxSize = isImage ? MAX_IMAGE_SIZE_MB : isVideo ? MAX_VIDEO_SIZE_MB : MAX_DOCUMENT_SIZE_MB;
    if (fileSize && fileSize > maxSize * 1024 * 1024) {
      return NextResponse.json(
        { error: `File exceeds maximum size of ${maxSize}MB` },
        { status: 400 }
      );
    }

    const mediaId = generateMediaId();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = mediaType === 'image' ? 'media/originals' : mediaType === 'video' ? 'media/videos' : 'media/documents';
    const s3Key = `${folder}/${mediaId}/${sanitizedFilename}`;

    // Generate presigned URL — this is the critical path
    const uploadUrl = await generatePresignedUploadUrl(s3Key, contentType);
    const publicUrl = getPublicUrl(s3Key);

    // Create media record in DynamoDB — best-effort, don't block upload
    const now = new Date().toISOString();
    try {
      await createMediaItem({
        mediaId,
        filename,
        mimeType: contentType,
        mediaType,
        status: 'uploading',
        source: 'upload',
        s3Key,
        variants: { original: s3Key },
        fileSize: fileSize || 0,
        contentHash,
        collectionId: collectionId || undefined,
        tags: [],
        publicUrl,
        createdAt: now,
        updatedAt: now,
      });
      // Increment folder mediaCount
      if (collectionId) {
        const col = await getCollection(collectionId);
        if (col) {
          await updateCollection(collectionId, { mediaCount: col.mediaCount + 1 });
        }
      }
    } catch (dbError) {
      // Log but don't fail — the S3 upload can still proceed
      console.warn('Failed to create DynamoDB media record:', dbError);
    }

    const response: MediaUploadResponse = {
      uploadUrl,
      publicUrl,
      s3Key,
      mediaId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
