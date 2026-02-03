import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl, generateS3Key } from '@/lib/s3';

/**
 * POST /api/admin/images/upload
 * Generate a presigned URL for uploading an image to S3
 *
 * Request body:
 * - filename: Original filename (required)
 * - contentType: MIME type of the file (required)
 *
 * Response:
 * - uploadUrl: Presigned URL for uploading to S3
 * - publicUrl: Public URL for accessing the uploaded image
 * - key: S3 object key for reference
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType } = body;

    // Validate filename parameter
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: filename' },
        { status: 400 }
      );
    }

    // Validate contentType parameter
    if (!contentType || typeof contentType !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: contentType' },
        { status: 400 }
      );
    }

    // Validate contentType is an image type
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'contentType must be an image type (e.g., image/jpeg, image/png)' },
        { status: 400 }
      );
    }

    // Generate a unique S3 key for this upload
    const key = generateS3Key(filename, 'images');

    // Generate presigned upload URL
    const uploadUrl = await generatePresignedUploadUrl(key, contentType);

    // Generate the public URL for accessing the image after upload
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
