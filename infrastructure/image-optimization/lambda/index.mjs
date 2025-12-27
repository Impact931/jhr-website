import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.SOURCE_BUCKET || 'jhr-website-images';
const MAX_SIZE = parseInt(process.env.MAX_IMAGE_SIZE) || 1048576; // 1MB
const MAX_WIDTH = parseInt(process.env.MAX_WIDTH) || 2400;
const MAX_HEIGHT = parseInt(process.env.MAX_HEIGHT) || 2400;
const QUALITY = parseInt(process.env.QUALITY) || 85;

// Supported formats
const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'];

/**
 * Parse query parameters for image transformation
 */
function parseParams(queryString) {
  const params = new URLSearchParams(queryString || '');
  return {
    width: params.get('w') || params.get('width'),
    height: params.get('h') || params.get('height'),
    quality: params.get('q') || params.get('quality'),
    format: params.get('f') || params.get('format'),
    fit: params.get('fit') || 'inside', // cover, contain, fill, inside, outside
  };
}

/**
 * Get the best output format based on Accept header
 */
function getBestFormat(acceptHeader, originalFormat) {
  if (!acceptHeader) return originalFormat === 'png' ? 'png' : 'jpeg';

  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';

  return originalFormat === 'png' ? 'png' : 'jpeg';
}

/**
 * Main handler for image optimization
 */
export async function handler(event) {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Parse the request
    const path = event.rawPath || event.path || '';
    const queryString = event.rawQueryString || '';
    const acceptHeader = event.headers?.accept || event.headers?.Accept || '';

    // Remove /optimized/ prefix if present
    let imagePath = path.replace(/^\/optimized\//, '').replace(/^\//, '');

    if (!imagePath) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image path provided' }),
      };
    }

    // Parse transformation parameters
    const params = parseParams(queryString);
    const width = params.width ? parseInt(params.width) : null;
    const height = params.height ? parseInt(params.height) : null;
    const quality = params.quality ? parseInt(params.quality) : QUALITY;

    // Get original image from S3
    console.log(`Fetching image: ${imagePath} from bucket: ${BUCKET}`);

    const getCommand = new GetObjectCommand({
      Bucket: BUCKET,
      Key: imagePath,
    });

    let s3Response;
    try {
      s3Response = await s3Client.send(getCommand);
    } catch (err) {
      console.error('S3 GetObject error:', err);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Image not found', path: imagePath }),
      };
    }

    // Get the image buffer
    const chunks = [];
    for await (const chunk of s3Response.Body) {
      chunks.push(chunk);
    }
    const originalBuffer = Buffer.concat(chunks);
    const originalSize = originalBuffer.length;

    // Get original format
    const metadata = await sharp(originalBuffer).metadata();
    const originalFormat = metadata.format || 'jpeg';

    // Determine output format
    let outputFormat = params.format || getBestFormat(acceptHeader, originalFormat);
    if (!SUPPORTED_FORMATS.includes(outputFormat)) {
      outputFormat = 'jpeg';
    }

    // Calculate dimensions
    let targetWidth = width || metadata.width;
    let targetHeight = height || metadata.height;

    // Apply max dimensions
    if (targetWidth > MAX_WIDTH) targetWidth = MAX_WIDTH;
    if (targetHeight > MAX_HEIGHT) targetHeight = MAX_HEIGHT;

    // Build sharp pipeline
    let pipeline = sharp(originalBuffer)
      .rotate() // Auto-rotate based on EXIF
      .resize(targetWidth, targetHeight, {
        fit: params.fit,
        withoutEnlargement: true,
      });

    // Apply format-specific settings
    let currentQuality = quality;
    switch (outputFormat) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true, progressive: true });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: currentQuality, effort: 4 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: currentQuality, effort: 4 });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
        break;
      default:
        pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true });
    }

    let optimizedBuffer = await pipeline.toBuffer();

    // If still too large, reduce quality iteratively (skip for PNG)
    if (optimizedBuffer.length > MAX_SIZE && outputFormat !== 'png') {
      while (optimizedBuffer.length > MAX_SIZE && currentQuality > 40) {
        currentQuality -= 10;

        pipeline = sharp(originalBuffer)
          .rotate()
          .resize(targetWidth, targetHeight, {
            fit: params.fit,
            withoutEnlargement: true,
          });

        if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
          pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true, progressive: true });
        } else if (outputFormat === 'webp') {
          pipeline = pipeline.webp({ quality: currentQuality, effort: 4 });
        } else if (outputFormat === 'avif') {
          pipeline = pipeline.avif({ quality: currentQuality, effort: 4 });
        }

        optimizedBuffer = await pipeline.toBuffer();
      }

      // If still too large, reduce dimensions
      if (optimizedBuffer.length > MAX_SIZE) {
        const reductionRatio = Math.sqrt(MAX_SIZE / optimizedBuffer.length) * 0.9;
        targetWidth = Math.round(targetWidth * reductionRatio);
        targetHeight = Math.round(targetHeight * reductionRatio);
        currentQuality = quality;

        pipeline = sharp(originalBuffer)
          .rotate()
          .resize(targetWidth, targetHeight, {
            fit: params.fit,
            withoutEnlargement: true,
          });

        if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
          pipeline = pipeline.jpeg({ quality: currentQuality, mozjpeg: true, progressive: true });
        } else if (outputFormat === 'webp') {
          pipeline = pipeline.webp({ quality: currentQuality, effort: 4 });
        } else if (outputFormat === 'avif') {
          pipeline = pipeline.avif({ quality: currentQuality, effort: 4 });
        }

        optimizedBuffer = await pipeline.toBuffer();
      }
    }

    // Log optimization results
    const compressionRatio = (originalSize / optimizedBuffer.length).toFixed(2);
    console.log(`Optimized: ${imagePath} | ${originalSize} -> ${optimizedBuffer.length} bytes (${compressionRatio}x) | Format: ${outputFormat}`);

    // Return the optimized image
    const contentType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Original-Size': originalSize.toString(),
        'X-Optimized-Size': optimizedBuffer.length.toString(),
        'X-Compression-Ratio': compressionRatio,
      },
      body: optimizedBuffer.toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message }),
    };
  }
}
