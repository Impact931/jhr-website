/**
 * Lambda Media Processor
 * Triggered by S3 upload events on the media/originals/ prefix
 *
 * Responsibilities:
 * 1. Generate WebP variants (thumbnail 300px, medium 800px, full-res)
 * 2. Extract EXIF metadata
 * 3. Compute content hash (SHA-256)
 * 4. Update DynamoDB media record with variants, EXIF, dimensions, and status
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import sharp from 'sharp';
import { createHash } from 'crypto';
import type { S3Event, S3Handler } from 'aws-lambda';

const s3 = new S3Client({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';

interface VariantConfig {
  name: string;
  width: number; // 0 = original width
  key: string;
}

const VARIANTS: VariantConfig[] = [
  { name: 'thumbnail', width: 300, key: 'thumbnail' },
  { name: 'medium', width: 800, key: 'medium' },
  { name: 'full', width: 0, key: 'full' },
];

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    console.log(`Processing: ${bucket}/${key}`);

    // Extract mediaId from key: media/originals/{mediaId}/{filename}
    const keyParts = key.split('/');
    if (keyParts.length < 4 || keyParts[0] !== 'media' || keyParts[1] !== 'originals') {
      console.log(`Skipping non-media key: ${key}`);
      continue;
    }
    const mediaId = keyParts[2];

    try {
      // Fetch original from S3
      const getResult = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
      const bodyBytes = await getResult.Body!.transformToByteArray();
      const buffer = Buffer.from(bodyBytes);

      // Compute SHA-256 content hash
      const contentHash = createHash('sha256').update(buffer).digest('hex');

      // Get image metadata with Sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();

      const dimensions = {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };

      // Extract EXIF data
      const exifData: Record<string, unknown> = {};
      if (metadata.exif) {
        try {
          // Sharp exposes raw EXIF — parse common fields
          const exifInfo = await sharp(buffer).metadata();
          // Note: For full EXIF, you'd use a library like exifr
          // Sharp gives us basic orientation and density info
          if (exifInfo.density) {
            exifData.density = exifInfo.density;
          }
        } catch {
          // EXIF extraction failed, continue without it
        }
      }

      // Generate variants
      const variants: Record<string, string> = { original: key };
      const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || '';

      for (const variant of VARIANTS) {
        const variantKey = `media/variants/${mediaId}/${variant.key}.webp`;

        let pipeline = sharp(buffer);

        if (variant.width > 0 && dimensions.width > variant.width) {
          pipeline = pipeline.resize(variant.width, undefined, {
            withoutEnlargement: true,
          });
        }

        const webpBuffer = await pipeline.webp({ quality: 82 }).toBuffer();

        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: variantKey,
            Body: webpBuffer,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
          })
        );

        variants[variant.key] = variantKey;
        console.log(`Created variant: ${variantKey} (${webpBuffer.length} bytes)`);
      }

      // Compute public URLs
      const getUrl = (k: string) =>
        cloudFrontDomain
          ? `https://${cloudFrontDomain}/${k}`
          : `https://${bucket}.s3.amazonaws.com/${k}`;

      // Update DynamoDB record
      await ddb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { pk: `MEDIA#${mediaId}`, sk: 'metadata' },
          UpdateExpression: `SET #status = :status, variants = :variants, dimensions = :dimensions, contentHash = :contentHash, thumbnailUrl = :thumbnailUrl, publicUrl = :publicUrl, updatedAt = :updatedAt`,
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':status': 'ready',
            ':variants': variants,
            ':dimensions': dimensions,
            ':contentHash': contentHash,
            ':thumbnailUrl': getUrl(variants.thumbnail),
            ':publicUrl': getUrl(variants.full),
            ':updatedAt': new Date().toISOString(),
          },
        })
      );

      console.log(`Successfully processed media ${mediaId}`);
    } catch (error) {
      console.error(`Error processing media ${mediaId}:`, error);

      // Update status to error
      try {
        await ddb.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { pk: `MEDIA#${mediaId}`, sk: 'metadata' },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
              ':status': 'error',
              ':updatedAt': new Date().toISOString(),
            },
          })
        );
      } catch {
        console.error('Failed to update error status');
      }
    }
  }
};
