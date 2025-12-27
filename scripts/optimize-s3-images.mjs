#!/usr/bin/env node

/**
 * S3 Image Optimization Script
 *
 * This script optimizes existing large images in S3:
 * - Fetches images larger than TARGET_SIZE
 * - Optimizes them using Sharp
 * - Re-uploads the optimized versions
 * - Preserves original as backup if desired
 */

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Configuration
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const REGION = process.env.S3_BUCKET_REGION || 'us-east-1';
const TARGET_SIZE = 1 * 1024 * 1024; // 1MB target
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;
const QUALITY = 85;
const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP = process.argv.includes('--backup');

const s3Client = new S3Client({ region: REGION });

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Get all objects from S3
async function listAllObjects(prefix = '') {
  const objects = [];
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      objects.push(...response.Contents);
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

// Download object from S3
async function downloadObject(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  const chunks = [];

  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

// Upload object to S3
async function uploadObject(key, buffer, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3Client.send(command);
}

// Backup original file
async function backupObject(key) {
  const backupKey = `backups/${key}`;
  const command = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${key}`,
    Key: backupKey,
  });

  await s3Client.send(command);
  return backupKey;
}

// Optimize image
async function optimizeImage(buffer, key) {
  const metadata = await sharp(buffer).metadata();
  const originalFormat = metadata.format || 'jpeg';

  // Skip GIFs (preserve animation)
  if (originalFormat === 'gif') {
    return null;
  }

  let width = metadata.width;
  let height = metadata.height;

  // Apply max dimensions
  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Start with target quality
  let quality = QUALITY;
  let optimizedBuffer;

  // Determine output format (JPEG for photos, PNG for transparency)
  const hasAlpha = originalFormat === 'png' && metadata.channels === 4;
  const outputFormat = hasAlpha ? 'png' : 'jpeg';

  // Build sharp pipeline
  let pipeline = sharp(buffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });

  if (outputFormat === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true, progressive: true });
  } else {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }

  optimizedBuffer = await pipeline.toBuffer();

  // If still too large and JPEG, reduce quality iteratively
  if (outputFormat === 'jpeg' && optimizedBuffer.length > TARGET_SIZE) {
    while (optimizedBuffer.length > TARGET_SIZE && quality > 40) {
      quality -= 10;
      optimizedBuffer = await sharp(buffer)
        .rotate()
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true, progressive: true })
        .toBuffer();
    }

    // If still too large, reduce dimensions
    if (optimizedBuffer.length > TARGET_SIZE) {
      const reductionRatio = Math.sqrt(TARGET_SIZE / optimizedBuffer.length) * 0.9;
      width = Math.round(width * reductionRatio);
      height = Math.round(height * reductionRatio);
      quality = QUALITY;

      optimizedBuffer = await sharp(buffer)
        .rotate()
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true, progressive: true })
        .toBuffer();
    }
  }

  return {
    buffer: optimizedBuffer,
    format: outputFormat,
    contentType: outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png',
    width,
    height,
    quality,
  };
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('JHR S3 Image Optimization Script');
  console.log('='.repeat(60));
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Target Size: ${formatBytes(TARGET_SIZE)}`);
  console.log(`Max Dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}`);
  console.log(`Quality: ${QUALITY}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`Backup: ${BACKUP ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));
  console.log('');

  // List all objects
  console.log('Scanning S3 bucket...');
  const allObjects = await listAllObjects();

  // Filter for images larger than target
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const largeImages = allObjects.filter(obj => {
    const key = obj.Key.toLowerCase();
    const isImage = imageExtensions.some(ext => key.endsWith(ext));
    const isLarge = obj.Size > TARGET_SIZE;
    const isNotBackup = !key.startsWith('backups/');
    return isImage && isLarge && isNotBackup;
  });

  console.log(`Found ${allObjects.length} total objects`);
  console.log(`Found ${largeImages.length} images larger than ${formatBytes(TARGET_SIZE)}`);
  console.log('');

  if (largeImages.length === 0) {
    console.log('No images need optimization!');
    return;
  }

  // Sort by size (largest first)
  largeImages.sort((a, b) => b.Size - a.Size);

  // Show summary
  console.log('Images to optimize:');
  console.log('-'.repeat(60));
  for (const obj of largeImages) {
    console.log(`  ${obj.Key} (${formatBytes(obj.Size)})`);
  }
  console.log('-'.repeat(60));
  console.log('');

  if (DRY_RUN) {
    console.log('DRY RUN - No changes will be made');
    return;
  }

  // Process each image
  let totalOriginal = 0;
  let totalOptimized = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const obj of largeImages) {
    const key = obj.Key;
    console.log(`\nProcessing: ${key}`);
    console.log(`  Original size: ${formatBytes(obj.Size)}`);

    try {
      // Download
      const buffer = await downloadObject(key);
      totalOriginal += buffer.length;

      // Optimize
      const result = await optimizeImage(buffer, key);

      if (!result) {
        console.log('  Skipped (GIF or unsupported format)');
        continue;
      }

      console.log(`  Optimized size: ${formatBytes(result.buffer.length)}`);
      console.log(`  Compression: ${((1 - result.buffer.length / buffer.length) * 100).toFixed(1)}%`);
      console.log(`  Dimensions: ${result.width}x${result.height}`);
      console.log(`  Quality: ${result.quality}`);

      // Backup if requested
      if (BACKUP) {
        const backupKey = await backupObject(key);
        console.log(`  Backed up to: ${backupKey}`);
      }

      // Determine new key (change extension if format changed)
      let newKey = key;
      if (result.format === 'jpeg' && !key.toLowerCase().endsWith('.jpg') && !key.toLowerCase().endsWith('.jpeg')) {
        newKey = key.replace(/\.[^.]+$/, '.jpg');
      }

      // Upload optimized version
      await uploadObject(newKey, result.buffer, result.contentType);
      console.log(`  Uploaded: ${newKey}`);

      totalOptimized += result.buffer.length;
      successCount++;

    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errorCount++;
    }
  }

  // Summary
  console.log('\n');
  console.log('='.repeat(60));
  console.log('OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Images processed: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total original size: ${formatBytes(totalOriginal)}`);
  console.log(`Total optimized size: ${formatBytes(totalOptimized)}`);
  console.log(`Total savings: ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
}

// Run
main().catch(console.error);
