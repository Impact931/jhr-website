import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.S3_BUCKET_NAME || 'jhr-photography-assets';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const REGION = process.env.S3_BUCKET_REGION || process.env.CUSTOM_AWS_REGION || process.env.AWS_REGION || 'us-east-1';

const s3 = new S3Client({
  region: REGION,
  ...(process.env.CUSTOM_AWS_ACCESS_KEY_ID
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY || '',
        },
      }
    : {}),
});

/**
 * Upload a PDF to S3 and return the public download URL (via CloudFront if available).
 */
export async function uploadPdfToS3(
  pdfBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const key = `sow/${fileName}`;

  try {
    await s3.send(
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
