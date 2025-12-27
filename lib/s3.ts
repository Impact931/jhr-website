import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

// Generate a presigned URL for uploading an image
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

// Get the public URL for an image (uses CloudFront if configured)
export function getPublicUrl(key: string, useCloudFront: boolean = true): string {
  if (useCloudFront && CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
}

// Get the CloudFront URL for an existing S3 URL
export function getCloudFrontUrl(s3Url: string): string {
  if (!CLOUDFRONT_DOMAIN) return s3Url;

  // Extract key from S3 URL
  const s3Pattern = new RegExp(`https://${BUCKET_NAME}\\.s3\\.${BUCKET_REGION}\\.amazonaws\\.com/(.+)`);
  const match = s3Url.match(s3Pattern);

  if (match && match[1]) {
    return `https://${CLOUDFRONT_DOMAIN}/${match[1]}`;
  }

  return s3Url;
}

// Check if CloudFront is configured
export function isCloudFrontEnabled(): boolean {
  return !!CLOUDFRONT_DOMAIN;
}

// Delete an image from S3
export async function deleteImage(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

// Generate a unique key for an image upload
export function generateImageKey(
  pageId: string,
  sectionId: string,
  originalFilename: string
): string {
  const timestamp = Date.now();
  const ext = originalFilename.split('.').pop() || 'jpg';
  const sanitizedFilename = originalFilename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase()
    .slice(0, 50);

  return `content/${pageId}/${sectionId}/${sanitizedFilename}-${timestamp}.${ext}`;
}
