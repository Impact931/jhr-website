'use client';

import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  /** Object position for fill mode (e.g., "center 30%", "center top"). */
  objectPosition?: string;
}

/**
 * SmartImage: renders Next.js <Image> for local paths and raw <img> for external URLs.
 * External URLs (S3, CloudFront) bypass the /_next/image optimization proxy which
 * requires remotePatterns config and can fail with 400 if not configured.
 */
export default function SmartImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority,
  quality,
  objectPosition,
}: SmartImageProps) {
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  if (isExternal) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`${className} absolute inset-0 w-full h-full`}
          style={objectPosition ? { objectPosition } : undefined}
          loading={priority ? 'eager' : 'lazy'}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
      priority={priority}
      quality={quality}
    />
  );
}
