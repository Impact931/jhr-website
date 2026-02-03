'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import type { MediaUploadResponse } from '@/types/media';

interface MediaUploadZoneProps {
  onUploadComplete: (mediaId: string) => void;
  accept?: string;
  maxSizeMB?: number;
  compact?: boolean;
}

interface UploadFile {
  id: string;
  file: File;
  status: 'queued' | 'hashing' | 'checking' | 'uploading' | 'completing' | 'done' | 'error' | 'duplicate';
  progress: number;
  error?: string;
  previewUrl?: string;
  mediaId?: string;
}

const MAX_CONCURRENT = 2;

/** Max dimension for optimized web images */
const MAX_WEB_DIMENSION = 2400;
const WEBP_QUALITY = 0.82;

/**
 * Compute SHA-256 in chunks to avoid blocking the main thread.
 */
async function computeSHA256(file: File): Promise<string> {
  // For files under 5MB, do it in one pass (fast enough)
  if (file.size < 5 * 1024 * 1024) {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // For larger files, use a simpler hash based on first/last chunks + size
  // This avoids reading the entire file into memory
  const chunkSize = 1024 * 1024; // 1MB
  const firstChunk = file.slice(0, chunkSize);
  const lastChunk = file.slice(Math.max(0, file.size - chunkSize));
  const sizeStr = new TextEncoder().encode(String(file.size));

  const parts = await Promise.all([
    firstChunk.arrayBuffer(),
    lastChunk.arrayBuffer(),
  ]);

  const combined = new Uint8Array(parts[0].byteLength + parts[1].byteLength + sizeStr.byteLength);
  combined.set(new Uint8Array(parts[0]), 0);
  combined.set(new Uint8Array(parts[1]), parts[0].byteLength);
  combined.set(sizeStr, parts[0].byteLength + parts[1].byteLength);

  const hash = await crypto.subtle.digest('SHA-256', combined);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Optimize an image client-side: resize to max dimension, convert to WebP.
 * Yields to the main thread periodically.
 */
async function optimizeImage(file: File): Promise<File> {
  if (!file.type.match(/^image\/(jpeg|png|tiff|webp)$/)) return file;
  // Skip very large files — canvas struggles with files over ~15MB
  if (file.size > 15 * 1024 * 1024) return file;

  const blobUrl = URL.createObjectURL(file);

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;

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

export default function MediaUploadZone({
  onUploadComplete,
  accept = 'image/jpeg,image/png,image/gif,image/webp,image/tiff,video/mp4,video/webm',
  maxSizeMB = 50,
  compact = false,
}: MediaUploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeCountRef = useRef(0);
  const queueRef = useRef<UploadFile[]>([]);

  const updateFile = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const processNext = useCallback(() => {
    if (activeCountRef.current >= MAX_CONCURRENT || queueRef.current.length === 0) return;
    const next = queueRef.current.shift();
    if (next) {
      activeCountRef.current++;
      uploadSingleFile(next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadSingleFile = useCallback(
    async (uploadFile: UploadFile) => {
      const { id, file } = uploadFile;

      try {
        // Validate file size upfront
        if (file.size > maxSizeMB * 1024 * 1024) {
          updateFile(id, {
            status: 'error',
            error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB, max ${maxSizeMB}MB)`,
          });
          return;
        }

        // Step 1: Compute hash
        updateFile(id, { status: 'hashing', progress: 5 });
        // Yield to main thread before expensive operation
        await new Promise((r) => setTimeout(r, 0));
        const contentHash = await computeSHA256(file);

        // Step 2: Check for duplicate
        updateFile(id, { status: 'checking', progress: 10 });
        const dupRes = await fetch('/api/admin/media/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentHash }),
        });
        if (dupRes.ok) {
          const dupData = await dupRes.json();
          if (dupData.isDuplicate) {
            updateFile(id, {
              status: 'duplicate',
              error: `Duplicate of "${dupData.existingMedia?.filename}"`,
              mediaId: dupData.existingMedia?.mediaId,
            });
            return;
          }
        }

        // Step 2.5: Optimize image
        updateFile(id, { status: 'uploading', progress: 12 });
        await new Promise((r) => setTimeout(r, 0));
        const optimizedFile = await optimizeImage(file);

        // Step 3: Get presigned URL
        updateFile(id, { progress: 15 });
        const uploadRes = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: optimizedFile.name,
            contentType: optimizedFile.type,
            fileSize: optimizedFile.size,
            contentHash,
          }),
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Failed to get upload URL');
        }

        const { uploadUrl, mediaId } = (await uploadRes.json()) as MediaUploadResponse;
        updateFile(id, { mediaId, progress: 25 });

        // Step 4: Upload to S3
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const pct = 25 + (e.loaded / e.total) * 60;
              updateFile(id, { progress: pct });
            }
          });
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`S3 upload failed (${xhr.status})`));
          });
          xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
          xhr.addEventListener('timeout', () => reject(new Error('Upload timed out')));
          xhr.timeout = 300000; // 5 min timeout
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', optimizedFile.type);
          xhr.send(optimizedFile);
        });

        // Step 5: Mark complete
        updateFile(id, { status: 'completing', progress: 90 });
        await fetch('/api/admin/media/upload/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaId, fileSize: optimizedFile.size }),
        });

        updateFile(id, { status: 'done', progress: 100 });
        onUploadComplete(mediaId);
      } catch (err) {
        updateFile(id, {
          status: 'error',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
      } finally {
        activeCountRef.current--;
        processNext();
      }
    },
    [updateFile, onUploadComplete, maxSizeMB, processNext]
  );

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadFile[] = Array.from(fileList).map((file) => {
        const previewUrl = file.type.startsWith('image/') && file.size < 10 * 1024 * 1024
          ? URL.createObjectURL(file)
          : undefined;

        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          status: 'queued' as const,
          progress: 0,
          previewUrl,
        };
      });

      setFiles((prev) => [...newFiles, ...prev]);

      // Add to queue and process
      queueRef.current.push(...newFiles);
      // Start up to MAX_CONCURRENT
      for (let i = 0; i < MAX_CONCURRENT; i++) {
        processNext();
      }
    },
    [processNext]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
    // Also remove from queue if still queued
    queueRef.current = queueRef.current.filter((f) => f.id !== id);
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          // Reset so the same file can be selected again
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          compact ? 'p-4' : 'p-8'
        } ${
          isDragOver
            ? 'border-jhr-gold bg-jhr-gold/10'
            : 'border-jhr-black-lighter bg-jhr-black-light hover:border-jhr-gold/50 hover:bg-jhr-black-lighter'
        }`}
      >
        <Upload
          className={`${compact ? 'w-6 h-6 mb-1' : 'w-10 h-10 mb-3'} ${
            isDragOver ? 'text-jhr-gold' : 'text-jhr-white-dim'
          }`}
        />
        <p className={`text-jhr-white font-medium ${compact ? 'text-sm' : ''}`}>
          {isDragOver ? 'Drop files here' : 'Drag & drop files'}
        </p>
        <p className={`text-jhr-white-dim ${compact ? 'text-xs' : 'text-sm'}`}>
          or click to browse (max {maxSizeMB}MB)
        </p>
      </div>

      {/* Upload progress list */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-jhr-black-lighter"
            >
              {/* Preview */}
              {f.previewUrl ? (
                <img
                  src={f.previewUrl}
                  alt=""
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-jhr-black flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-jhr-white-dim" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-jhr-white truncate">{f.file.name}</p>
                <p className="text-[10px] text-jhr-white-dim">
                  {(f.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                {f.status === 'done' ? (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Complete
                  </p>
                ) : f.status === 'error' ? (
                  <p className="text-xs text-red-400">{f.error}</p>
                ) : f.status === 'duplicate' ? (
                  <p className="text-xs text-yellow-400">{f.error}</p>
                ) : f.status === 'queued' ? (
                  <p className="text-xs text-jhr-white-dim">Queued...</p>
                ) : (
                  <div className="mt-1">
                    <div className="w-full h-1 bg-jhr-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-jhr-gold transition-all duration-300"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-jhr-white-dim mt-0.5 capitalize">{f.status}...</p>
                  </div>
                )}
              </div>

              {/* Remove */}
              {(f.status === 'done' || f.status === 'error' || f.status === 'duplicate' || f.status === 'queued') && (
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1 rounded hover:bg-jhr-black text-jhr-white-dim hover:text-jhr-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
