'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Copy,
  ExternalLink,
  Pencil,
  Trash2,
  Check,
  Loader2,
  Calendar,
  HardDrive,
  Maximize2,
  Tag,
  FileText,
  Link as LinkIcon,
  Search,
  Type,
  AlignLeft,
  Hash,
  RefreshCw,
} from 'lucide-react';
import { MediaItemData } from './MediaItem';

interface MediaUsage {
  pageId: string;
  pageName: string;
  sectionId: string;
  sectionName: string;
  url: string;
}

interface MediaDetailModalProps {
  item: MediaItemData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (mediaId: string, updates: {
    name?: string;
    alt?: string;
    title?: string;
    caption?: string;
    keywords?: string[];
    description?: string;
  }) => Promise<void>;
  onDelete?: (item: MediaItemData) => void;
}

export function MediaDetailModal({
  item,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: MediaDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usageLocations, setUsageLocations] = useState<MediaUsage[]>([]);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    alt: '',
    title: '',
    caption: '',
    keywords: '',
    description: '',
  });

  useEffect(() => {
    if (item) {
      setEditForm({
        name: item.name || '',
        alt: item.alt || '',
        title: item.title || '',
        caption: item.caption || '',
        keywords: item.keywords?.join(', ') || '',
        description: item.description || '',
      });
      // Load usage locations
      loadUsageLocations(item.mediaId);
    }
  }, [item]);

  const loadUsageLocations = async (mediaId: string) => {
    setIsLoadingUsage(true);
    try {
      const response = await fetch(`/api/admin/media/${mediaId}/usage`);
      if (response.ok) {
        const data = await response.json();
        setUsageLocations(data.usedIn || []);
      }
    } catch (error) {
      console.error('Failed to load usage:', error);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  if (!isOpen || !item) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'External';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    try {
      await onUpdate(item.mediaId, {
        name: editForm.name,
        alt: editForm.alt,
        title: editForm.title,
        caption: editForm.caption,
        keywords: editForm.keywords ? editForm.keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined,
        description: editForm.description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (usageLocations.length > 0) {
      const confirmed = confirm(
        `This image is used in ${usageLocations.length} location(s). Deleting it may break those pages. Are you sure you want to delete it?`
      );
      if (!confirmed) return;
    } else if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    if (onDelete) {
      onDelete(item);
      onClose();
    }
  };

  const originalSize = item.originalSize;
  const compressionRatio = originalSize && item.size ? (originalSize / item.size).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-jhr-black-lighter">
          <h3 className="text-lg font-semibold text-jhr-white truncate pr-4">
            {isEditing ? 'Edit Media Details' : 'Image Details'}
          </h3>
          <div className="flex items-center gap-2">
            {!isEditing && onUpdate && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-jhr-white-dim hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-jhr-white-dim hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Image Preview & Actions */}
            <div className="space-y-4">
              <div className="relative aspect-video bg-jhr-black rounded-lg overflow-hidden">
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.alt || item.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-jhr-black-lighter rounded-lg text-jhr-white hover:bg-jhr-gold/20 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </>
                  )}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-jhr-black-lighter rounded-lg text-jhr-white hover:bg-jhr-gold/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
              </div>

              {/* File Info Section */}
              <div className="bg-jhr-black rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-jhr-white-dim uppercase tracking-wide">File Information</h4>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-jhr-white-dim">File Name</p>
                    <p className="text-jhr-white font-medium truncate" title={item.name}>{item.name}</p>
                  </div>

                  <div>
                    <p className="text-jhr-white-dim">File Size</p>
                    <p className="text-jhr-white font-medium">
                      {formatFileSize(item.size)}
                      {originalSize && item.size !== originalSize && (
                        <span className="text-green-400 text-xs ml-1">
                          ({compressionRatio}x compressed from {formatFileSize(originalSize)})
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-jhr-white-dim">Dimensions</p>
                    <p className="text-jhr-white font-medium">
                      {item.width && item.height ? `${item.width} × ${item.height} px` : 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-jhr-white-dim">Uploaded</p>
                    <p className="text-jhr-white font-medium text-xs">{formatDate(item.uploadedAt)}</p>
                  </div>
                </div>

                {/* URL */}
                <div className="pt-2 border-t border-jhr-black-lighter">
                  <p className="text-jhr-white-dim text-sm mb-1">Storage URL</p>
                  <div className="p-2 bg-jhr-black-lighter rounded">
                    <code className="text-xs text-jhr-gold break-all">{item.url}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - SEO & Usage */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <FileText className="w-4 h-4" />
                        File Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:border-jhr-gold"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <Type className="w-4 h-4" />
                        Alt Text <span className="text-jhr-gold text-xs">(Required for SEO)</span>
                      </label>
                      <textarea
                        value={editForm.alt}
                        onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                        rows={2}
                        placeholder="Describe the image for screen readers and search engines"
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold resize-none"
                      />
                      <p className="text-xs text-jhr-white-dim mt-1">
                        {editForm.alt.length}/125 characters (recommended max)
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <Tag className="w-4 h-4" />
                        Title Attribute
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Tooltip text shown on hover"
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <AlignLeft className="w-4 h-4" />
                        Caption
                      </label>
                      <textarea
                        value={editForm.caption}
                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                        rows={2}
                        placeholder="Optional caption to display below the image"
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold resize-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <Hash className="w-4 h-4" />
                        Keywords <span className="text-jhr-gold text-xs">(SEO)</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.keywords}
                        onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                        placeholder="corporate, headshot, Nashville, event photography"
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold"
                      />
                      <p className="text-xs text-jhr-white-dim mt-1">
                        Comma-separated keywords for search and organization
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-jhr-white-dim mb-1">
                        <Search className="w-4 h-4" />
                        Description <span className="text-jhr-gold text-xs">(SEO)</span>
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        placeholder="Detailed description for search engines and image galleries"
                        className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold resize-none"
                      />
                    </div>
                  </div>

                  {/* Edit Actions */}
                  <div className="flex gap-3 pt-4 border-t border-jhr-black-lighter">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black font-medium rounded-lg hover:bg-jhr-gold-light transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-jhr-white-dim hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* SEO Metadata Section */}
                  <div className="bg-jhr-black rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-jhr-white-dim uppercase tracking-wide">SEO & Metadata</h4>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-jhr-white-dim flex items-center gap-1">
                          <Type className="w-3 h-3" /> Alt Text
                        </p>
                        <p className="text-jhr-white text-sm">
                          {item.alt || <span className="text-amber-400 italic">Not set - important for SEO!</span>}
                        </p>
                      </div>

                      {item.title && (
                        <div>
                          <p className="text-xs text-jhr-white-dim flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Title
                          </p>
                          <p className="text-jhr-white text-sm">{item.title}</p>
                        </div>
                      )}

                      {item.caption && (
                        <div>
                          <p className="text-xs text-jhr-white-dim flex items-center gap-1">
                            <AlignLeft className="w-3 h-3" /> Caption
                          </p>
                          <p className="text-jhr-white text-sm">{item.caption}</p>
                        </div>
                      )}

                      {item.keywords && item.keywords.length > 0 && (
                        <div>
                          <p className="text-xs text-jhr-white-dim flex items-center gap-1 mb-1">
                            <Hash className="w-3 h-3" /> Keywords
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.keywords.map((kw: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-jhr-black-lighter text-jhr-white text-xs rounded"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.description && (
                        <div>
                          <p className="text-xs text-jhr-white-dim flex items-center gap-1">
                            <Search className="w-3 h-3" /> Description
                          </p>
                          <p className="text-jhr-white text-sm">{item.description}</p>
                        </div>
                      )}

                      {!item.alt && (!item.keywords || item.keywords.length === 0) && !item.description && (
                        <p className="text-amber-400 text-sm italic">
                          Add alt text, keywords, and description to improve SEO
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Usage Locations Section */}
                  <div className="bg-jhr-black rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-jhr-white-dim uppercase tracking-wide flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Used On ({usageLocations.length} pages)
                      </h4>
                      <button
                        onClick={() => loadUsageLocations(item.mediaId)}
                        disabled={isLoadingUsage}
                        className="p-1 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                        title="Refresh usage"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingUsage ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    {isLoadingUsage ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-jhr-white-dim" />
                      </div>
                    ) : usageLocations.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {usageLocations.map((usage, index) => (
                          <Link
                            key={index}
                            href={usage.url}
                            target="_blank"
                            className="flex items-center justify-between p-2 bg-jhr-black-lighter rounded hover:bg-jhr-gold/10 transition-colors group"
                          >
                            <div>
                              <p className="text-jhr-white text-sm font-medium group-hover:text-jhr-gold">
                                {usage.pageName}
                              </p>
                              <p className="text-jhr-white-dim text-xs">{usage.sectionName}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-jhr-white-dim group-hover:text-jhr-gold" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-jhr-white-dim text-sm italic py-2">
                        This image is not currently used on any pages
                      </p>
                    )}
                  </div>

                  {/* Quick Edit Button */}
                  {onUpdate && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-jhr-gold/10 border border-jhr-gold/30 text-jhr-gold rounded-lg hover:bg-jhr-gold/20 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit SEO & Metadata
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
