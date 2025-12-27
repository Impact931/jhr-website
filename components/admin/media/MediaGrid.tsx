'use client';

import React from 'react';
import { MediaItem, MediaItemData } from './MediaItem';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface MediaGridProps {
  items: MediaItemData[];
  isLoading?: boolean;
  selectedItems?: Set<string>;
  selectionMode?: boolean;
  onSelect?: (item: MediaItemData) => void;
  onEdit?: (item: MediaItemData) => void;
  onDelete?: (item: MediaItemData) => void;
  onCopyUrl?: (url: string) => void;
  emptyMessage?: string;
}

export function MediaGrid({
  items,
  isLoading = false,
  selectedItems = new Set(),
  selectionMode = false,
  onSelect,
  onEdit,
  onDelete,
  onCopyUrl,
  emptyMessage = 'No media files found',
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-jhr-black-lighter rounded-xl flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-jhr-white-dim" />
        </div>
        <p className="text-jhr-white-dim">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaItem
          key={item.mediaId}
          item={item}
          isSelected={selectedItems.has(item.mediaId)}
          selectionMode={selectionMode}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyUrl={onCopyUrl}
        />
      ))}
    </div>
  );
}
