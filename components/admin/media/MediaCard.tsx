'use client';

import { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  FileText,
  Check,
  MoreVertical,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { MediaItem } from '@/types/media';

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  selectedIds: Set<string>;
  onSelect: (mediaId: string, multi: boolean) => void;
  onClick: (item: MediaItem) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaCard({ item, isSelected, selectedIds, onSelect, onClick }: MediaCardProps) {
  const isDocument = item.mediaType === 'document';
  const thumbnailSrc = isDocument ? undefined : (item.thumbnailUrl || item.publicUrl);
  const isVideo = item.mediaType === 'video';
  const hasAI = !!item.aiMetadata?.altText;

  const handleDragStart = (e: React.DragEvent) => {
    // If this card is selected, drag all selected IDs; otherwise just this one
    const ids = isSelected && selectedIds.size > 1
      ? Array.from(selectedIds)
      : [item.mediaId];
    e.dataTransfer.setData('application/x-media-ids', JSON.stringify(ids));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`group relative bg-jhr-black-light rounded-xl border overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? 'border-jhr-gold ring-2 ring-jhr-gold/30'
          : 'border-jhr-black-lighter hover:border-jhr-gold/50'
      }`}
    >
      {/* Selection checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.mediaId, e.shiftKey || e.metaKey);
        }}
        className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-jhr-gold border-jhr-gold'
            : 'border-white/40 bg-black/30 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isSelected && <Check className="w-4 h-4 text-jhr-black" />}
      </button>

      {/* Thumbnail */}
      <div className="aspect-video relative bg-jhr-black-lighter" onClick={() => onClick(item)}>
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={item.alt || item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isVideo ? (
              <Video className="w-12 h-12 text-jhr-white-dim/50" />
            ) : isDocument ? (
              <FileText className="w-12 h-12 text-jhr-white-dim/50" />
            ) : (
              <ImageIcon className="w-12 h-12 text-jhr-white-dim/50" />
            )}
          </div>
        )}

        {/* Status badge */}
        {item.status !== 'ready' && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            {item.status}
          </div>
        )}

        {/* Video badge */}
        {isVideo && item.status === 'ready' && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 flex items-center gap-1">
            <Video className="w-3 h-3" />
            Video
          </div>
        )}

        {/* Document badge */}
        {isDocument && item.status === 'ready' && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            PDF
          </div>
        )}

        {/* AI badge */}
        {hasAI && (
          <div className="absolute bottom-2 right-2 p-1 rounded-full bg-purple-500/20">
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1.5 rounded-lg bg-jhr-gold text-jhr-black text-sm font-medium">
            View Details
          </span>
        </div>
      </div>

      {/* File info */}
      <div className="p-3" onClick={() => onClick(item)}>
        <p className="text-sm font-medium text-jhr-white truncate" title={item.filename}>
          {item.title || item.filename}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-jhr-white-dim">
          <span>{formatFileSize(item.fileSize)}</span>
          {item.dimensions && (
            <span>{item.dimensions.width}x{item.dimensions.height}</span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[10px] bg-jhr-black-lighter text-jhr-white-dim"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] text-jhr-white-dim">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
