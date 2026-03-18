import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName, region, cloudFrontDomain } from '@/lib/s3';

/**
 * Upload a PDF to S3 and return the public download URL (via CloudFront if available).
 */
export async function uploadPdfToS3(
  pdfBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const key = `sow/${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename="${fileName}"`,
    })
  );

  if (cloudFrontDomain) {
    return `https://${cloudFrontDomain}/${key}`;
  }
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}
