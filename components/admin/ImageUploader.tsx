'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

interface UploadState {
  status: 'idle' | 'optimizing' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  previewUrl?: string;
}

// ============================================================================
// Image Optimization (match MediaUploadZone quality settings)
// ============================================================================

/** Max dimension for optimized web images */
const MAX_WEB_DIMENSION = 2400;
const WEBP_QUALITY = 0.82;

/**
 * Optimize an image client-side: resize to max dimension, convert to WebP.
 * Maintains high quality for photography while reducing file size.
 */
async function optimizeImage(file: File): Promise<File> {
  // Only optimize supported image types
  if (!file.type.match(/^image\/(jpeg|png|tiff|webp)$/)) return file;
  // Skip very large files — canvas struggles with files over ~15MB
  if (file.size > 15 * 1024 * 1024) return file;

  const blobUrl = URL.createObjectURL(file);

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;

        // Only resize if exceeds max dimension
        if (width > MAX_WEB_DIMENSION || height > MAX_WEB_DIMENSION) {
          const scale = MAX_WEB_DIMENSION / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            // Only use optimized version if it's actually smaller
            if (!blob || blob.size >= file.size) {
              resolve(file);
            } else {
              const optimizedName = file.name.replace(/\.[^.]+$/, '.webp');
              resolve(new File([blob], optimizedName, { type: 'image/webp' }));
            }
          },
          'image/webp',
          WEBP_QUALITY
        );
      };
      img.onerror = () => resolve(file);
      img.src = blobUrl;
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export default function ImageUploader({
  onUpload,
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: validationError,
      });
      return;
    }

    // Create preview URL for immediate feedback
    const previewUrl = URL.createObjectURL(file);

    // Step 1: Optimize image (resize & convert to WebP)
    setUploadState({
      status: 'optimizing',
      progress: 0,
      previewUrl,
    });

    let optimizedFile: File;
    try {
      optimizedFile = await optimizeImage(file);
      setUploadState((prev) => ({ ...prev, progress: 10 }));
    } catch {
      // If optimization fails, use original
      optimizedFile = file;
    }

    setUploadState((prev) => ({ ...prev, status: 'uploading' }));

    try {
      // Step 2: Get presigned URL from media upload API (proper endpoint with Lambda processing)
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: optimizedFile.name,
          contentType: optimizedFile.type,
          size: optimizedFile.size,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { uploadUrl, publicUrl, mediaId } = await response.json();
      setUploadState((prev) => ({ ...prev, progress: 30 }));

      // Step 3: Upload optimized file directly to S3 using presigned URL
      const uploadResponse = await uploadToS3WithProgress(
        uploadUrl,
        optimizedFile,
        (progress) => {
          // Map S3 upload progress from 30% to 85%
          const mappedProgress = 30 + progress * 0.55;
          setUploadState((prev) => ({ ...prev, progress: mappedProgress }));
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // Step 4: Mark upload complete (triggers Lambda for variant generation)
      const completeResponse = await fetch('/api/admin/media/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });

      if (!completeResponse.ok) {
        console.warn('Failed to mark upload complete, but file is uploaded');
      }

      setUploadState({
        status: 'success',
        progress: 100,
        previewUrl,
      });

      // Call the onUpload callback with the public URL
      onUpload(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        previewUrl,
      });
    }
  }, [maxSizeBytes, onUpload]);

  const uploadToS3WithProgress = (
    url: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        resolve(new Response(xhr.response, { status: xhr.status }));
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { status, progress, error, previewUrl } = uploadState;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {status === 'idle' && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center p-8
            border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-200
            ${
              isDragOver
                ? 'border-jhr-gold bg-jhr-gold/10'
                : 'border-jhr-black-lighter bg-jhr-black-light hover:border-jhr-gold/50 hover:bg-jhr-black-lighter'
            }
          `}
        >
          <Upload
            className={`w-10 h-10 mb-3 ${
              isDragOver ? 'text-jhr-gold' : 'text-jhr-white-dim'
            }`}
          />
          <p className="text-jhr-white font-medium mb-1">
            {isDragOver ? 'Drop image here' : 'Drag & drop an image'}
          </p>
          <p className="text-jhr-white-dim text-sm">
            or click to browse (max {maxSizeMB}MB)
          </p>
        </div>
      )}

      {(status === 'optimizing' || status === 'uploading') && (
        <div className="relative flex flex-col items-center justify-center p-8 border-2 border-jhr-gold/50 rounded-xl bg-jhr-black-light">
          {previewUrl && (
            <div className="relative w-20 h-20 mb-4 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
              </div>
            </div>
          )}
          {!previewUrl && (
            <Loader2 className="w-10 h-10 mb-3 text-jhr-gold animate-spin" />
          )}
          <p className="text-jhr-white font-medium mb-2">
            {status === 'optimizing' ? 'Optimizing image...' : 'Uploading...'}
          </p>
          <div className="w-full max-w-xs bg-jhr-black-lighter rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-jhr-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-jhr-white-dim text-sm mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      {status === 'success' && (
        <div className="relative p-4 border-2 border-green-500/50 rounded-xl bg-jhr-black-light">
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-1 rounded-full bg-jhr-black-lighter hover:bg-jhr-black text-jhr-white-dim hover:text-jhr-white transition-colors"
            title="Upload another image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            {previewUrl && (
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={previewUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!previewUrl && (
              <div className="w-16 h-16 rounded-lg bg-jhr-black-lighter flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-8 h-8 text-jhr-white-dim" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-green-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Upload complete
              </p>
              <p className="text-jhr-white-dim text-sm truncate">
                Click X to upload another image
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="relative p-4 border-2 border-red-500/50 rounded-xl bg-jhr-black-light">
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-1 rounded-full bg-jhr-black-lighter hover:bg-jhr-black text-jhr-white-dim hover:text-jhr-white transition-colors"
            title="Try again"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-red-400 font-medium">Upload failed</p>
              <p className="text-jhr-white-dim text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
