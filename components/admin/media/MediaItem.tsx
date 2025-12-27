'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MoreVertical, Pencil, Trash2, Copy, ExternalLink, Play } from 'lucide-react';

export interface MediaItemData {
  mediaId: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size: number;
  originalSize?: number;
  alt?: string;
  title?: string;
  caption?: string;
  keywords?: string[];
  description?: string;
  tags?: string[];
  uploadedAt: string;
}

interface MediaItemProps {
  item: MediaItemData;
  isSelected?: boolean;
  onSelect?: (item: MediaItemData) => void;
  onEdit?: (item: MediaItemData) => void;
  onDelete?: (item: MediaItemData) => void;
  onCopyUrl?: (url: string) => void;
  selectionMode?: boolean;
}

export function MediaItem({
  item,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onCopyUrl,
  selectionMode = false,
}: MediaItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect(item);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'External';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const thumbnailSrc = item.thumbnailUrl || item.url;

  return (
    <div
      onClick={handleClick}
      className={`
        group relative bg-jhr-black-light border rounded-xl overflow-hidden transition-all
        ${selectionMode ? 'cursor-pointer' : ''}
        ${isSelected
          ? 'border-jhr-gold ring-2 ring-jhr-gold/50'
          : 'border-jhr-black-lighter hover:border-jhr-gold/30'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-jhr-black">
        {!imageError ? (
          <Image
            src={thumbnailSrc}
            alt={item.alt || item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-jhr-white-dim">
            <span className="text-sm">Failed to load</span>
          </div>
        )}

        {/* Video indicator */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Selection checkbox */}
        {selectionMode && (
          <div className="absolute top-2 left-2">
            <div className={`
              w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
              ${isSelected
                ? 'bg-jhr-gold border-jhr-gold'
                : 'bg-black/50 border-white/50 group-hover:border-white'
              }
            `}>
              {isSelected && (
                <svg className="w-4 h-4 text-jhr-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        {!selectionMode && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-2 bg-jhr-gold text-jhr-black rounded-lg hover:bg-jhr-gold-light transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onCopyUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyUrl(item.url);
                }}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Menu button */}
        {!selectionMode && (
          <div className="absolute top-2 right-2">
            <button
              onClick={handleMenuClick}
              className="p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-8 z-20 w-48 bg-jhr-black-light border border-jhr-black-lighter rounded-lg shadow-xl py-1">
                  {onEdit && (
                    <button
                      onClick={() => handleAction(() => onEdit(item))}
                      className="w-full px-4 py-2 text-left text-sm text-jhr-white hover:bg-jhr-black-lighter flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit details
                    </button>
                  )}
                  {onCopyUrl && (
                    <button
                      onClick={() => handleAction(() => onCopyUrl(item.url))}
                      className="w-full px-4 py-2 text-left text-sm text-jhr-white hover:bg-jhr-black-lighter flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </button>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-sm text-jhr-white hover:bg-jhr-black-lighter flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in new tab
                  </a>
                  {onDelete && (
                    <>
                      <div className="my-1 border-t border-jhr-black-lighter" />
                      <button
                        onClick={() => handleAction(() => onDelete(item))}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-jhr-black-lighter flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-jhr-white font-medium truncate" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-jhr-white-dim">
            {formatFileSize(item.size)}
          </span>
          <span className="text-xs text-jhr-white-dim">
            {formatDate(item.uploadedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
