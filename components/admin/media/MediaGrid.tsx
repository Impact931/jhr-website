'use client';

import { Image as ImageIcon, Video, FileText, Calendar } from 'lucide-react';
import MediaCard from './MediaCard';
import type { MediaItem } from '@/types/media';

interface MediaGridProps {
  items: MediaItem[];
  selectedIds: Set<string>;
  onSelect: (mediaId: string, multi: boolean) => void;
  onItemClick: (item: MediaItem) => void;
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaGrid({
  items,
  selectedIds,
  onSelect,
  onItemClick,
  viewMode,
  isLoading,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-jhr-black-lighter" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-jhr-black-lighter rounded w-3/4" />
              <div className="h-3 bg-jhr-black-lighter rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
          <ImageIcon className="w-8 h-8 text-jhr-white-dim" />
        </div>
        <p className="text-jhr-white font-medium">No media found</p>
        <p className="text-sm text-jhr-white-dim mt-1">
          Upload images or adjust your filters.
        </p>
      </div>
    );
  }

  const handleListDragStart = (e: React.DragEvent, item: MediaItem) => {
    const isSelected = selectedIds.has(item.mediaId);
    const ids = isSelected && selectedIds.size > 1
      ? Array.from(selectedIds)
      : [item.mediaId];
    e.dataTransfer.setData('application/x-media-ids', JSON.stringify(ids));
    e.dataTransfer.effectAllowed = 'move';
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_100px_100px_120px] gap-4 px-4 py-2 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
          <div className="w-6" />
          <div>Name</div>
          <div>Size</div>
          <div>Type</div>
          <div>Date</div>
        </div>
        {items.map((item) => (
          <div
            key={item.mediaId}
            draggable
            onDragStart={(e) => handleListDragStart(e, item)}
            onClick={() => onItemClick(item)}
            className={`grid grid-cols-[auto_1fr_100px_100px_120px] gap-4 items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedIds.has(item.mediaId)
                ? 'bg-jhr-gold/10 border border-jhr-gold/30'
                : 'hover:bg-jhr-black-lighter border border-transparent'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(item.mediaId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.mediaId, e.shiftKey || e.metaKey);
              }}
              readOnly
              className="w-4 h-4 rounded border-jhr-black-lighter accent-jhr-gold"
            />
            <div className="flex items-center gap-3 min-w-0">
              {item.thumbnailUrl || item.publicUrl ? (
                <img
                  src={item.thumbnailUrl || item.publicUrl}
                  alt=""
                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-jhr-black-lighter flex items-center justify-center flex-shrink-0">
                  {item.mediaType === 'video' ? (
                    <Video className="w-4 h-4 text-jhr-white-dim" />
                  ) : item.mediaType === 'document' ? (
                    <FileText className="w-4 h-4 text-jhr-white-dim" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-jhr-white-dim" />
                  )}
                </div>
              )}
              <span className="text-sm text-jhr-white truncate">
                {item.title || item.filename}
              </span>
            </div>
            <span className="text-sm text-jhr-white-dim">
              {formatFileSize(item.fileSize)}
            </span>
            <span className="text-sm text-jhr-white-dim capitalize">{item.mediaType}</span>
            <span className="text-sm text-jhr-white-dim">
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <MediaCard
          key={item.mediaId}
          item={item}
          isSelected={selectedIds.has(item.mediaId)}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
