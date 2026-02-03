'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Sparkles,
  ExternalLink,
  Copy,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import MediaTagInput from './MediaTagInput';
import MediaAIPanel from './MediaAIPanel';
import type { MediaItem, MediaUsage } from '@/types/media';

interface MediaDetailPanelProps {
  item: MediaItem | null;
  onClose: () => void;
  onSave: (mediaId: string, updates: Record<string, unknown>) => Promise<void>;
  onDelete: (mediaId: string) => Promise<void>;
  onGenerateAI: (mediaId: string) => Promise<void>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaDetailPanel({
  item,
  onClose,
  onSave,
  onDelete,
  onGenerateAI,
}: MediaDetailPanelProps) {
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [usage, setUsage] = useState<MediaUsage[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setAlt(item.alt || '');
      setCaption(item.caption || '');
      setTags(item.tags || []);
      setShowDeleteConfirm(false);

      // Fetch usage
      fetch(`/api/admin/media/${item.mediaId}`)
        .then((r) => r.json())
        .then((data) => setUsage(data.usage || []))
        .catch(() => setUsage([]));
    }
  }, [item]);

  if (!item) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(item.mediaId, { title, alt, caption, tags });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(item.mediaId);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(item.publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewSrc = item.thumbnailUrl || item.publicUrl;
  const isVideo = item.mediaType === 'video';

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-jhr-black-light border-l border-jhr-black-lighter shadow-2xl z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-jhr-black-lighter">
        <h3 className="text-lg font-display font-bold text-jhr-white truncate">
          Media Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Preview */}
        <div className="aspect-video rounded-lg overflow-hidden bg-jhr-black-lighter">
          {previewSrc ? (
            isVideo && item.videoEmbed ? (
              <iframe
                src={item.videoEmbed.embedUrl}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <img
                src={previewSrc}
                alt={item.alt || item.filename}
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isVideo ? (
                <Video className="w-12 h-12 text-jhr-white-dim/50" />
              ) : (
                <ImageIcon className="w-12 h-12 text-jhr-white-dim/50" />
              )}
            </div>
          )}
        </div>

        {/* URL copy */}
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={item.publicUrl}
            className="flex-1 px-3 py-1.5 bg-jhr-black border border-jhr-black-lighter rounded-lg text-xs text-jhr-white-dim truncate"
          />
          <button
            onClick={copyUrl}
            className="p-1.5 rounded-lg border border-jhr-black-lighter hover:bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white"
            title="Copy URL"
          >
            {copied ? (
              <span className="text-xs text-green-400 px-1">Copied</span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* File info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-jhr-white-dim">Filename</span>
            <p className="text-jhr-white truncate">{item.filename}</p>
          </div>
          <div>
            <span className="text-jhr-white-dim">Size</span>
            <p className="text-jhr-white">{formatFileSize(item.fileSize)}</p>
          </div>
          <div>
            <span className="text-jhr-white-dim">Type</span>
            <p className="text-jhr-white">{item.mimeType}</p>
          </div>
          {item.dimensions && (
            <div>
              <span className="text-jhr-white-dim">Dimensions</span>
              <p className="text-jhr-white">
                {item.dimensions.width} x {item.dimensions.height}
              </p>
            </div>
          )}
          <div>
            <span className="text-jhr-white-dim">Status</span>
            <p className="text-jhr-white capitalize">{item.status}</p>
          </div>
          <div>
            <span className="text-jhr-white-dim">Uploaded</span>
            <p className="text-jhr-white">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title..."
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:ring-2 focus:ring-jhr-gold/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">
              Alt Text
            </label>
            <textarea
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for accessibility..."
              rows={2}
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption..."
              rows={2}
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">
              Tags
            </label>
            <MediaTagInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* AI Metadata */}
        {item.mediaType === 'image' && (
          <MediaAIPanel item={item} onGenerate={() => onGenerateAI(item.mediaId)} />
        )}

        {/* EXIF data */}
        {item.exifData && Object.keys(item.exifData).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-jhr-white mb-2">EXIF Data</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {item.exifData.camera && (
                <div>
                  <span className="text-jhr-white-dim">Camera</span>
                  <p className="text-jhr-white">{item.exifData.camera}</p>
                </div>
              )}
              {item.exifData.lens && (
                <div>
                  <span className="text-jhr-white-dim">Lens</span>
                  <p className="text-jhr-white">{item.exifData.lens}</p>
                </div>
              )}
              {item.exifData.focalLength && (
                <div>
                  <span className="text-jhr-white-dim">Focal Length</span>
                  <p className="text-jhr-white">{item.exifData.focalLength}</p>
                </div>
              )}
              {item.exifData.aperture && (
                <div>
                  <span className="text-jhr-white-dim">Aperture</span>
                  <p className="text-jhr-white">{item.exifData.aperture}</p>
                </div>
              )}
              {item.exifData.shutterSpeed && (
                <div>
                  <span className="text-jhr-white-dim">Shutter</span>
                  <p className="text-jhr-white">{item.exifData.shutterSpeed}</p>
                </div>
              )}
              {item.exifData.iso && (
                <div>
                  <span className="text-jhr-white-dim">ISO</span>
                  <p className="text-jhr-white">{item.exifData.iso}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usage */}
        {usage.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-jhr-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Used on {usage.length} page(s)
            </h4>
            <div className="space-y-1">
              {usage.map((u) => (
                <div
                  key={u.sk}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-jhr-black text-sm"
                >
                  <span className="text-jhr-white">{u.page}</span>
                  <span className="text-jhr-white-dim">/ {u.section}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-jhr-black-lighter space-y-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-jhr-black-lighter text-jhr-white-dim hover:bg-jhr-black-lighter transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Confirm Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
