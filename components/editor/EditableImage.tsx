'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useEditor } from '@/context/EditorContext';
import { useEditableContent } from '@/hooks/useEditableContent';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface EditableImageProps {
  pageId?: string;
  sectionId: string;
  contentKey: string;
  defaultSrc?: string;
  src?: string;  // Alias for defaultSrc
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export function EditableImage({
  pageId = 'default',
  sectionId,
  contentKey,
  defaultSrc,
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  objectFit = 'cover',
}: EditableImageProps) {
  // Support both defaultSrc and src props
  const resolvedDefaultSrc = defaultSrc ?? src ?? '';
  const { isEditorMode, updateContent, pendingChanges } = useEditor();
  const { value: savedSrc, isLoading } = useEditableContent(pageId, sectionId, contentKey, resolvedDefaultSrc);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localSrc, setLocalSrc] = useState(resolvedDefaultSrc);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track if mounted for portal rendering (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update local src when saved content loads
  useEffect(() => {
    if (!isLoading && savedSrc !== resolvedDefaultSrc) {
      setLocalSrc(savedSrc);
    }
  }, [savedSrc, isLoading, resolvedDefaultSrc]);

  // Check for pending changes
  const changeKey = `${pageId}:${sectionId}:${contentKey}`;
  const pendingValue = pendingChanges.get(changeKey)?.value;
  const displaySrc = pendingValue ?? localSrc;

  // Update local src when pending changes update
  useEffect(() => {
    if (pendingValue) {
      setLocalSrc(pendingValue);
    }
  }, [pendingValue]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditorMode) return;
    setShowUploadModal(true);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadProgress(10);

    try {
      console.log('Getting presigned URL...');

      // Get presigned upload URL with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          pageId,
          sectionId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Presigned URL error:', errorText);
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await response.json();
      console.log('Got presigned URL, uploading to S3...');
      setUploadProgress(30);

      // Upload to S3 with timeout
      const uploadController = new AbortController();
      const uploadTimeoutId = setTimeout(() => uploadController.abort(), 60000);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        signal: uploadController.signal,
      });

      clearTimeout(uploadTimeoutId);

      if (!uploadResponse.ok) {
        console.error('S3 upload failed:', uploadResponse.status, uploadResponse.statusText);
        throw new Error('Failed to upload image to S3');
      }

      console.log('Upload successful! Public URL:', publicUrl);
      setUploadProgress(100);

      // Update content with new image URL
      updateContent(pageId, sectionId, contentKey, publicUrl, 'image');

      // Small delay to show 100% progress
      await new Promise(resolve => setTimeout(resolve, 500));

      setShowUploadModal(false);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Upload timed out. Please try again.');
      } else {
        alert('Failed to upload image. Please check the console for details.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [pageId, sectionId, contentKey, updateContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const closeModal = () => {
    setShowUploadModal(false);
    setPreviewUrl(null);
  };

  // Render the image
  const imageElement = fill ? (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      className={`${className} ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}`}
      priority={priority}
      sizes={sizes}
    />
  ) : (
    <Image
      src={displaySrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );

  if (!isEditorMode) {
    return fill ? (
      <div ref={containerRef} className="absolute inset-0">
        {imageElement}
      </div>
    ) : (
      imageElement
    );
  }

  return (
    <>
      {/* Wrapper - for fill images we need absolute positioning */}
      {fill ? (
        <div ref={containerRef} className="absolute inset-0">
          {imageElement}
          {/* Clickable edit overlay - positioned above image */}
          <div
            className="absolute inset-0 z-[50] cursor-pointer group"
            onClick={handleClick}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="bg-jhr-gold text-jhr-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <Camera className="w-5 h-5" />
                Change Background
              </div>
            </div>

            {/* Edit indicator */}
            <span className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-jhr-gold text-jhr-black p-2 rounded-full pointer-events-none">
              <Camera className="w-4 h-4" />
            </span>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative inline-block cursor-pointer group"
          onClick={handleClick}
        >
          {imageElement}

          {/* Edit overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-jhr-gold text-jhr-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
              <Camera className="w-5 h-5" />
              Change Image
            </div>
          </div>

          {/* Edit indicator */}
          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-jhr-gold text-jhr-black p-2 rounded-full">
            <Camera className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* Upload Modal - Rendered via Portal to escape stacking context */}
      {showUploadModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80" onClick={closeModal}>
          <div
            className="bg-jhr-black-light border border-jhr-gold/30 rounded-xl p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Change Image</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current image preview */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Current Image:</p>
              <div className="relative aspect-video bg-jhr-black rounded-lg overflow-hidden">
                <Image
                  src={previewUrl || displaySrc}
                  alt={alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Upload area */}
            <div
              className="border-2 border-dashed border-jhr-gold/30 hover:border-jhr-gold/60 rounded-lg p-8 text-center transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-jhr-gold animate-spin" />
                  <p className="text-white">Uploading... {uploadProgress}%</p>
                  <div className="w-full bg-jhr-black rounded-full h-2">
                    <div
                      className="bg-jhr-gold h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-jhr-gold mx-auto mb-3" />
                  <p className="text-white mb-1">Drag & drop an image here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                  <p className="text-gray-500 text-xs mt-2">Supports: JPG, PNG, WebP, GIF</p>
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
