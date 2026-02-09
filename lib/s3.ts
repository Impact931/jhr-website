import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * S3 configuration and helper functions for JHR Photography CMS
 * Handles image uploads and retrieval with presigned URLs
 */

// Environment configuration
const region = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';
const bucketName = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || '';

// Build explicit credentials if CUSTOM_AWS env vars are set (Amplify reserves AWS_ prefix)
const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

// Create S3 client
export const s3Client = new S3Client({
  region,
  ...customCredentials,
});

/**
 * Generate a presigned URL for uploading a file to S3
 * @param key - The S3 object key (path/filename)
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned upload URL
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading/viewing a file from S3
 * @param key - The S3 object key (path/filename)
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned download URL
 */
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Get the public URL for an S3 object via CloudFront
 * Falls back to direct S3 URL if CloudFront domain is not configured
 * @param key - The S3 object key (path/filename)
 * @returns Public URL for the object
 */
export function getPublicUrl(key: string): string {
  if (cloudFrontDomain) {
    return `https://${cloudFrontDomain}/${key}`;
  }
  // Fallback to direct S3 URL (not recommended for production)
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Generate a unique S3 key for an uploaded file
 * Uses timestamp and random string for uniqueness
 * @param filename - Original filename
 * @param folder - Optional folder path (e.g., 'images', 'uploads')
 * @returns Unique S3 key
 */
export function generateS3Key(filename: string, folder: string = 'uploads'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${folder}/${timestamp}-${randomStr}-${sanitizedFilename}`;
}

/**
 * Generate S3 keys for media library variants
 * @param mediaId - Unique media identifier
 * @param variant - The variant type (original, full, medium, thumbnail)
 * @param filename - Original filename (used for originals)
 * @returns S3 key path
 */
export function generateMediaKey(
  mediaId: string,
  variant: 'original' | 'full' | 'medium' | 'thumbnail',
  filename?: string
): string {
  if (variant === 'original') {
    const sanitized = (filename || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    return `media/originals/${mediaId}/${sanitized}`;
  }
  return `media/variants/${mediaId}/${variant}.webp`;
}

/**
 * Generate S3 key for self-hosted video
 * @param mediaId - Unique media identifier
 * @param filename - Original video filename
 * @returns S3 key path
 */
export function generateVideoKey(mediaId: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `media/videos/${mediaId}/${sanitized}`;
}

/**
 * Generate S3 key for uploaded document (PDF, etc.)
 * @param mediaId - Unique media identifier
 * @param filename - Original document filename
 * @returns S3 key path
 */
export function generateDocumentKey(mediaId: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `media/documents/${mediaId}/${sanitized}`;
}

// Export configuration for use in other modules
export { bucketName, region, cloudFrontDomain };
