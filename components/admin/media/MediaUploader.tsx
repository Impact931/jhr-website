'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'duplicate';
  error?: string;
  duplicateInfo?: {
    mediaId: string;
    name: string;
    url: string;
    uploadedAt: string;
    size: number;
  };
}

interface MediaUploaderProps {
  folderId?: string;
  onUploadComplete?: () => void;
  onClose?: () => void;
}

export function MediaUploader({
  folderId = 'root',
  onUploadComplete,
  onClose,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadingFiles: UploadingFile[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...uploadingFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFile = async (uploadingFile: UploadingFile, replaceExisting: boolean = false): Promise<boolean> => {
    const formData = new FormData();
    formData.append('file', uploadingFile.file);
    formData.append('folderId', folderId);
    if (replaceExisting) {
      formData.append('replaceExisting', 'true');
    }

    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id ? { ...f, status: 'uploading', progress: 10 } : f
        )
      );

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Handle duplicate warning
      if (response.status === 409 && data.warning === 'duplicate') {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadingFile.id
              ? {
                  ...f,
                  status: 'duplicate',
                  duplicateInfo: data.existingMedia,
                }
              : f
          )
        );
        return false;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Show optimization info
      const optimizationInfo = data.optimized
        ? ` (optimized: ${data.originalSizeFormatted} → ${data.finalSizeFormatted})`
        : '';

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id
            ? {
                ...f,
                status: 'success',
                progress: 100,
                error: optimizationInfo || undefined,
              }
            : f
        )
      );

      return true;
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        )
      );
      return false;
    }
  };

  const handleReplace = async (uploadingFile: UploadingFile) => {
    await uploadFile(uploadingFile, true);
    onUploadComplete?.();
  };

  const handleSkip = (id: string) => {
    removeFile(id);
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    setIsUploading(false);

    // Check if all completed (no duplicates or errors)
    const hasIssues = files.some((f) => f.status === 'duplicate' || f.status === 'error');
    if (!hasIssues) {
      onUploadComplete?.();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-jhr-gold" />;
    }
    if (file.type.startsWith('video/')) {
      return <Video className="w-5 h-5 text-blue-400" />;
    }
    return <Upload className="w-5 h-5 text-jhr-white-dim" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const duplicateCount = files.filter((f) => f.status === 'duplicate').length;

  return (
    <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging
            ? 'border-jhr-gold bg-jhr-gold/10'
            : 'border-jhr-black-lighter hover:border-jhr-gold/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />

        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-jhr-gold' : 'text-jhr-white-dim'}`} />
        <p className="text-jhr-white mb-2">
          Drag and drop files here, or{' '}
          <label htmlFor="media-upload" className="text-jhr-gold cursor-pointer hover:underline">
            browse
          </label>
        </p>
        <p className="text-sm text-jhr-white-dim">
          Supports: JPG, PNG, WebP, GIF, MP4, WebM (max 50MB)
        </p>
        <p className="text-xs text-jhr-white-dim mt-1">
          Images over 1MB will be automatically optimized
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-jhr-white">
              Files ({files.length})
              {successCount > 0 && (
                <span className="text-green-400 ml-2">{successCount} uploaded</span>
              )}
              {errorCount > 0 && (
                <span className="text-red-400 ml-2">{errorCount} failed</span>
              )}
              {duplicateCount > 0 && (
                <span className="text-amber-400 ml-2">{duplicateCount} duplicate{duplicateCount !== 1 ? 's' : ''}</span>
              )}
            </h4>
            {pendingCount > 0 && (
              <button
                onClick={uploadAll}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black font-medium rounded-lg hover:bg-jhr-gold-light transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {pendingCount} file{pendingCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {files.map((file) => (
              <div key={file.id}>
                <div
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    ${file.status === 'error' ? 'bg-red-500/10' : ''}
                    ${file.status === 'duplicate' ? 'bg-amber-500/10' : ''}
                    ${file.status !== 'error' && file.status !== 'duplicate' ? 'bg-jhr-black-lighter' : ''}
                  `}
                >
                  {getFileIcon(file.file)}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-jhr-white truncate">{file.file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-jhr-white-dim">
                        {formatFileSize(file.file.size)}
                      </span>
                      {file.status === 'uploading' && (
                        <div className="flex-1 h-1 bg-jhr-black rounded-full overflow-hidden">
                          <div
                            className="h-full bg-jhr-gold transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      {file.status === 'error' && (
                        <span className="text-xs text-red-400">{file.error}</span>
                      )}
                      {file.status === 'success' && file.error && (
                        <span className="text-xs text-green-400">{file.error}</span>
                      )}
                    </div>
                  </div>

                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-jhr-white-dim hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {file.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-jhr-gold animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  {file.status === 'duplicate' && (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                {/* Duplicate warning with options */}
                {file.status === 'duplicate' && file.duplicateInfo && (
                  <div className="ml-8 mt-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400 mb-2">
                      A similar image already exists:
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-jhr-black rounded overflow-hidden flex-shrink-0">
                        <img
                          src={file.duplicateInfo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-jhr-white-dim">
                        <p className="text-jhr-white">{file.duplicateInfo.name}</p>
                        <p>Uploaded: {formatDate(file.duplicateInfo.uploadedAt)}</p>
                        <p>Size: {formatFileSize(file.duplicateInfo.size)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReplace(file)}
                        className="flex-1 px-3 py-1.5 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors"
                      >
                        Replace Existing
                      </button>
                      <button
                        onClick={() => handleSkip(file.id)}
                        className="flex-1 px-3 py-1.5 bg-jhr-black-lighter text-jhr-white-dim text-sm rounded hover:text-white transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {onClose && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-jhr-white-dim hover:text-white transition-colors"
          >
            {files.length > 0 && successCount === files.length ? 'Done' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
}
