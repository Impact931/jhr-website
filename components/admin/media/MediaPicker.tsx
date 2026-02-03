'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import MediaGrid from './MediaGrid';
import MediaToolbar from './MediaToolbar';
import MediaUploadZone from './MediaUploadZone';
import type { MediaItem, MediaFilterState, MediaPickerOptions, MediaPickerResult } from '@/types/media';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: MediaPickerResult[]) => void;
  options?: MediaPickerOptions;
}

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  options = {},
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState<MediaFilterState>({
    tags: [],
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    mediaType: options.allowedTypes?.length === 1 ? options.allowedTypes[0] : undefined,
  });
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingMediaIdsRef = useRef<string[]>([]);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.mediaType) params.set('mediaType', filters.mediaType);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedIds(new Set());
      pendingMediaIdsRef.current = [];
    }
  }, [isOpen, fetchMedia]);

  // Escape key to close modal — always responsive
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  const handleSelect = useCallback(
    (mediaId: string, multi: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (options.multiple || multi) {
          if (next.has(mediaId)) next.delete(mediaId);
          else {
            if (options.maxSelections && next.size >= options.maxSelections) return prev;
            next.add(mediaId);
          }
        } else {
          if (next.has(mediaId)) next.clear();
          else {
            next.clear();
            next.add(mediaId);
          }
        }
        return next;
      });
    },
    [options.multiple, options.maxSelections]
  );

  const handleConfirm = () => {
    const results: MediaPickerResult[] = items
      .filter((i) => selectedIds.has(i.mediaId))
      .map((i) => ({
        mediaId: i.mediaId,
        publicUrl: i.publicUrl,
        alt: i.alt,
        thumbnailUrl: i.thumbnailUrl,
        dimensions: i.dimensions,
      }));
    onSelect(results);
    onClose();
  };

  // Debounced media refresh — batches multiple upload completions into one fetch
  const debouncedFetchMedia = useCallback(() => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      fetchMedia();
      fetchTimeoutRef.current = null;
    }, 500);
  }, [fetchMedia]);

  const handleUploadComplete = useCallback((mediaId: string) => {
    pendingMediaIdsRef.current.push(mediaId);
    // Select the most recently uploaded item
    setSelectedIds(new Set([mediaId]));
    // Debounce the re-fetch so multiple uploads don't cause a storm
    debouncedFetchMedia();
    setShowUpload(false);
  }, [debouncedFetchMedia]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-jhr-black-lighter">
          <h2 className="text-lg font-display font-bold text-jhr-white">
            {showUpload ? 'Upload Media' : 'Select Media'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showUpload
                  ? 'bg-jhr-black-lighter text-jhr-white'
                  : 'bg-jhr-gold text-jhr-black hover:bg-jhr-gold/90'
              }`}
            >
              {showUpload ? (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Browse Library
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload New
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {showUpload ? (
            <MediaUploadZone onUploadComplete={handleUploadComplete} />
          ) : (
            <div className="space-y-4">
              <MediaToolbar
                filters={filters}
                onFilterChange={(update) =>
                  setFilters((prev) => ({ ...prev, ...update }))
                }
                viewMode="grid"
                onViewModeChange={() => {}}
                totalCount={items.length}
              />
              <MediaGrid
                items={items}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onItemClick={(item) => handleSelect(item.mediaId, false)}
                viewMode="grid"
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {!showUpload && (
          <div className="flex items-center justify-between p-4 border-t border-jhr-black-lighter">
            <span className="text-sm text-jhr-white-dim">
              {selectedIds.size > 0
                ? `${selectedIds.size} selected`
                : 'Select an image to insert'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-jhr-black-lighter text-sm text-jhr-white-dim hover:bg-jhr-black-lighter transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black text-sm font-medium hover:bg-jhr-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Insert Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
