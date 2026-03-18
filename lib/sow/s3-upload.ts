import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';

const BUCKET = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const REGION = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';

/**
 * Upload a PDF to S3 and return the public download URL (via CloudFront if available).
 */
export async function uploadPdfToS3(
  pdfBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const key = `sow/${fileName}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentDisposition: `inline; filename="${fileName}"`,
      })
    );

    if (CLOUDFRONT_DOMAIN) {
      return `https://${CLOUDFRONT_DOMAIN}/${key}`;
    }
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error('S3 PDF upload failed:', err);
    return null;
  }
}
