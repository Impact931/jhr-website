import sharp from 'sharp';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'auto';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  maxFileSize?: number;  // Target max file size in bytes
}

export interface OptimizedImageResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  size: number;
  originalSize?: number;
  compressionRatio?: number;
}

export interface ThumbnailResult {
  buffer: Buffer;
  width: number;
  height: number;
}

// Default optimization settings
const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 2400,
  maxHeight: 2400,
  quality: 85,
  format: 'auto',
  fit: 'inside',
  maxFileSize: 1024 * 1024, // 1MB default
};

// Thumbnail settings
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 80;

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Check if image needs optimization based on size and dimensions
 */
export function needsOptimization(
  size: number,
  width?: number,
  height?: number,
  options: ImageOptimizationOptions = {}
): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file size
  if (size > (opts.maxFileSize || DEFAULT_OPTIONS.maxFileSize!)) {
    return true;
  }

  // Check dimensions
  if (width && opts.maxWidth && width > opts.maxWidth) {
    return true;
  }
  if (height && opts.maxHeight && height > opts.maxHeight) {
    return true;
  }

  return false;
}

/**
 * Optimize an image buffer with the given options
 * Includes iterative quality reduction to meet maxFileSize target
 */
export async function optimizeImage(
  input: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalSize = input.length;

  // Get original metadata
  const metadata = await sharp(input).metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // Determine output format
  let outputFormat = opts.format;
  if (outputFormat === 'auto') {
    // Keep PNG for images with transparency, use JPEG for photos
    if (metadata.format === 'png' && metadata.hasAlpha) {
      outputFormat = 'png';
    } else {
      outputFormat = 'jpeg'; // JPEG for best compatibility with high quality
    }
  }

  // Calculate new dimensions while maintaining aspect ratio
  let width = originalWidth;
  let height = originalHeight;

  if (opts.maxWidth && opts.maxHeight) {
    if (width > opts.maxWidth || height > opts.maxHeight) {
      const widthRatio = opts.maxWidth / width;
      const heightRatio = opts.maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
  }

  // Start with base quality
  let quality = opts.quality || 85;
  let outputBuffer: Buffer;

  // Build the sharp pipeline
  const buildPipeline = (q: number, w: number, h: number) => {
    let pipeline = sharp(input)
      .rotate() // Auto-rotate based on EXIF
      .resize(w, h, {
        fit: opts.fit || 'inside',
        withoutEnlargement: true,
      });

    // Apply format-specific optimizations
    switch (outputFormat) {
      case 'jpeg':
        pipeline = pipeline.jpeg({
          quality: q,
          mozjpeg: true,        // Use mozjpeg for better compression
          progressive: true,    // Progressive loading
        });
        break;
      case 'webp':
        pipeline = pipeline.webp({
          quality: q,
          effort: 6,            // Compression effort (0-6)
          smartSubsample: true,
        });
        break;
      case 'png':
        pipeline = pipeline.png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: !metadata.hasAlpha, // Use palette for non-alpha
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({
          quality: q,
          effort: 6,
        });
        break;
    }

    return pipeline;
  };

  outputBuffer = await buildPipeline(quality, width, height).toBuffer();

  // If still too large and not PNG, reduce quality iteratively
  const maxFileSize = opts.maxFileSize || DEFAULT_OPTIONS.maxFileSize!;
  if (outputBuffer.length > maxFileSize && outputFormat !== 'png') {
    // First try reducing quality
    while (outputBuffer.length > maxFileSize && quality > 40) {
      quality -= 10;
      outputBuffer = await buildPipeline(quality, width, height).toBuffer();
    }

    // If still too large, reduce dimensions
    if (outputBuffer.length > maxFileSize) {
      const reductionRatio = Math.sqrt(maxFileSize / outputBuffer.length) * 0.9; // 10% margin
      width = Math.round(width * reductionRatio);
      height = Math.round(height * reductionRatio);
      quality = opts.quality || 85; // Reset quality
      outputBuffer = await buildPipeline(quality, width, height).toBuffer();

      // Final quality adjustment if still too large
      while (outputBuffer.length > maxFileSize && quality > 50) {
        quality -= 5;
        outputBuffer = await buildPipeline(quality, width, height).toBuffer();
      }
    }
  }

  // Get final dimensions
  const finalMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    width: finalMetadata.width || width,
    height: finalMetadata.height || height,
    format: outputFormat || 'jpeg',
    size: outputBuffer.length,
    originalSize,
    compressionRatio: originalSize / outputBuffer.length,
  };
}

/**
 * Generate a thumbnail for an image
 */
export async function generateThumbnail(
  input: Buffer,
  size: number = THUMBNAIL_SIZE
): Promise<ThumbnailResult> {
  const buffer = await sharp(input)
    .rotate() // Auto-rotate based on EXIF
    .resize({
      width: size,
      height: size,
      fit: 'cover',
      position: 'centre',
    })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toBuffer();

  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    width: metadata.width || size,
    height: metadata.height || size,
  };
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(input: Buffer): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha: boolean;
}> {
  const metadata = await sharp(input).metadata();

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: input.length,
    hasAlpha: metadata.hasAlpha || false,
  };
}

/**
 * Determine the best output format based on input
 */
export function getBestOutputFormat(
  mimeType: string,
  hasTransparency: boolean
): 'webp' | 'jpeg' | 'png' {
  // Use WebP as default (good quality, small size, supports transparency)
  // Fall back to PNG for transparency if WebP not suitable
  // Use JPEG for photos without transparency

  if (hasTransparency) {
    return 'webp'; // WebP supports transparency
  }

  // For photos, WebP gives best compression
  return 'webp';
}

/**
 * Generate multiple sizes for responsive images
 */
export async function generateResponsiveSizes(
  input: Buffer,
  sizes: number[] = [480, 768, 1024, 1440, 1920]
): Promise<Map<number, OptimizedImageResult>> {
  const results = new Map<number, OptimizedImageResult>();
  const metadata = await sharp(input).metadata();
  const originalWidth = metadata.width || 1920;

  for (const size of sizes) {
    // Skip sizes larger than original
    if (size > originalWidth) continue;

    const result = await optimizeImage(input, {
      maxWidth: size,
      format: 'webp',
      quality: 85,
    });

    results.set(size, result);
  }

  return results;
}

/**
 * Validate that a buffer is a valid image
 */
export async function validateImage(input: Buffer): Promise<{
  valid: boolean;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
  };
}> {
  try {
    const metadata = await sharp(input).metadata();

    if (!metadata.width || !metadata.height) {
      return { valid: false, error: 'Invalid image dimensions' };
    }

    // Check for reasonable dimensions
    if (metadata.width > 10000 || metadata.height > 10000) {
      return { valid: false, error: 'Image dimensions too large (max 10000px)' };
    }

    // Check format
    const supportedFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
    if (!metadata.format || !supportedFormats.includes(metadata.format)) {
      return { valid: false, error: `Unsupported image format: ${metadata.format}` };
    }

    return {
      valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    };
  } catch (error) {
    return { valid: false, error: 'Failed to parse image file' };
  }
}

/**
 * Strip EXIF data from an image (for privacy)
 */
export async function stripExifData(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate() // Apply EXIF rotation before stripping
    .withMetadata({
      // Keep only essential metadata
      orientation: undefined,
    })
    .toBuffer();
}
