import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.CONTRACTS_BUCKET_NAME || 'jhr-contracts';
const REGION = process.env.S3_BUCKET_REGION || process.env.CUSTOM_AWS_REGION || process.env.AWS_REGION || 'us-east-1';

// Build credentials matching Amplify pattern (CUSTOM_AWS_* prefix)
const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

const s3 = new S3Client({ region: REGION, ...customCredentials });

/**
 * Upload a PDF to the jhr-contracts S3 bucket and return the public URL.
 */
export async function uploadPdfToS3(
  pdfBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const key = `sow/${fileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename="${fileName}"`,
    })
  );

  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}
