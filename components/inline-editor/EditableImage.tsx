'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';

interface EditableImageProps {
  contentKey: string;
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function EditableImage({
  contentKey,
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority,
}: EditableImageProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Get the display src: pending change > original
  const pendingChange = pendingChanges.get(contentKey);
  const displaySrc = pendingChange?.newValue || src;

  const handleClick = useCallback(() => {
    if (!canEdit) return;
    setIsPickerOpen(true);
  }, [canEdit]);

  const handleMediaSelect = useCallback((results: MediaPickerResult[]) => {
    if (results.length > 0) {
      updateContent(contentKey, results[0].publicUrl, 'image');
    }
    setIsPickerOpen(false);
  }, [contentKey, updateContent]);

  const handleClose = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  // Detect if the src is an external URL (S3, CloudFront, etc.)
  const isExternal = displaySrc.startsWith('http://') || displaySrc.startsWith('https://');

  // Render image: use raw <img> for external URLs to bypass Next.js image optimization proxy,
  // use Next.js <Image> for local paths (which are already optimized at build time)
  const renderImage = () => {
    if (isExternal) {
      if (fill) {
        return (
          <img
            src={displaySrc}
            alt={alt}
            className={`${className} absolute inset-0 w-full h-full`}
            loading={priority ? 'eager' : 'lazy'}
          />
        );
      }
      return (
        <img
          src={displaySrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
        />
      );
    }
    const imageProps = {
      src: displaySrc,
      alt,
      className,
      priority,
      ...(fill ? { fill: true as const } : { width, height }),
    };
    return <Image {...imageProps} />;
  };

  // In view mode, just render normally
  if (!isEditMode) {
    return renderImage();
  }

  // In edit mode, add overlay
  return (
    <>
      <div className="relative group">
        {renderImage()}

        {/* Edit overlay */}
        {canEdit && (
          <div
            onClick={handleClick}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <Camera className="w-8 h-8" />
              <span className="text-sm font-medium">Click to replace</span>
            </div>
          </div>
        )}

        {/* Gold border indicator */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-jhr-gold/60 pointer-events-none transition-colors" />
        )}
      </div>

      {/* Media picker modal */}
      <MediaPicker
        isOpen={isPickerOpen}
        onClose={handleClose}
        onSelect={handleMediaSelect}
        options={{ allowedTypes: ['image'] }}
      />
    </>
  );
}
