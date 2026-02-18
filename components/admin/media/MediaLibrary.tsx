'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, ChevronRight } from 'lucide-react';
import MediaGrid from './MediaGrid';
import MediaToolbar from './MediaToolbar';
import MediaUploadZone from './MediaUploadZone';
import MediaDetailPanel from './MediaDetailPanel';
import MediaFolderTree from './MediaFolderTree';
import BulkActionBar from './BulkActionBar';
import VideoEmbedInput from './VideoEmbedInput';
import MediaStorageDashboard from './MediaStorageDashboard';
import type { MediaItem, MediaCollection, MediaFilterState, MediaListResponse } from '@/types/media';

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [filters, setFilters] = useState<MediaFilterState>({
    tags: [],
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const fetchMedia = useCallback(async (append = false) => {
    if (!append) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.mediaType) params.set('mediaType', filters.mediaType);
      if (filters.collectionId) params.set('collectionId', filters.collectionId);
      if (filters.tags.length) params.set('tag', filters.tags[0]);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('limit', '24');
      if (append && cursor) params.set('cursor', cursor);

      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data: MediaListResponse = await res.json();
        if (append) {
          setItems((prev) => [...prev, ...data.items]);
        } else {
          setItems(data.items);
        }
        setCursor(data.cursor);
        setTotal(data.total || data.items.length);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [filters, cursor]);

  // Refetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => fetchMedia(), filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [filters.search, filters.mediaType, filters.collectionId, filters.sortBy, filters.sortOrder]);

  const handleSelect = useCallback((mediaId: string, multi: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (multi) {
        if (next.has(mediaId)) next.delete(mediaId);
        else next.add(mediaId);
      } else {
        if (next.has(mediaId) && next.size === 1) next.clear();
        else {
          next.clear();
          next.add(mediaId);
        }
      }
      return next;
    });
  }, []);

  const handleItemClick = useCallback((item: MediaItem) => {
    setDetailItem(item);
  }, []);

  const handleSave = useCallback(async (mediaId: string, updates: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/media/${mediaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) =>
        prev.map((i) => (i.mediaId === mediaId ? updated : i))
      );
      setDetailItem(updated);
    }
  }, []);

  const handleDelete = useCallback(async (mediaId: string) => {
    const res = await fetch(`/api/admin/media/${mediaId}?force=true`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.mediaId !== mediaId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(mediaId);
        return next;
      });
      setDetailItem(null);
    }
  }, []);

  const handleGenerateAI = useCallback(async (mediaId: string) => {
    const res = await fetch(`/api/admin/media/${mediaId}/ai-metadata`, {
      method: 'POST',
    });
    if (res.ok) {
      const { item } = await res.json();
      if (item) {
        setItems((prev) => prev.map((i) => (i.mediaId === mediaId ? item : i)));
        setDetailItem(item);
      }
    }
  }, []);

  const handleUploadComplete = useCallback(
    (mediaId: string) => {
      fetchMedia();
      setStatsRefreshKey((k) => k + 1);
    },
    [fetchMedia]
  );

  const handleBulkTag = useCallback(
    async (tags: string[]) => {
      await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tag',
          mediaIds: Array.from(selectedIds),
          tags,
        }),
      });
      fetchMedia();
      setSelectedIds(new Set());
    },
    [selectedIds, fetchMedia]
  );

  const handleBulkMove = useCallback(
    async (collectionId: string) => {
      await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          mediaIds: Array.from(selectedIds),
          collectionId,
        }),
      });
      fetchMedia();
      fetchCollections();
      setSelectedIds(new Set());
    },
    [selectedIds, fetchMedia, fetchCollections]
  );

  const handleBulkDelete = useCallback(async () => {
    await fetch('/api/admin/media/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        mediaIds: Array.from(selectedIds),
      }),
    });
    fetchMedia();
    setSelectedIds(new Set());
    setDetailItem(null);
  }, [selectedIds, fetchMedia]);

  const handleDropMedia = useCallback(
    async (mediaIds: string[], collectionId: string | undefined) => {
      await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          mediaIds,
          collectionId: collectionId || '',
        }),
      });
      fetchMedia();
      fetchCollections();
      setSelectedIds(new Set());
    },
    [fetchMedia, fetchCollections]
  );

  const handleMoveToFolder = useCallback(
    async (mediaId: string, collectionId: string | undefined) => {
      await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          mediaIds: [mediaId],
          collectionId: collectionId || '',
        }),
      });
      // Update the detail item locally
      setDetailItem((prev) =>
        prev && prev.mediaId === mediaId
          ? { ...prev, collectionId: collectionId || '' }
          : prev
      );
      setItems((prev) =>
        prev.map((i) =>
          i.mediaId === mediaId ? { ...i, collectionId: collectionId || '' } : i
        )
      );
      fetchCollections();
    },
    [fetchCollections]
  );

  // Build breadcrumb path from current collectionId
  const buildBreadcrumb = (): { id: string | undefined; name: string }[] => {
    if (!filters.collectionId) return [];
    const path: { id: string | undefined; name: string }[] = [];
    let currentId: string | undefined = filters.collectionId;
    while (currentId) {
      const col = collections.find((c) => c.collectionId === currentId);
      if (!col) break;
      path.unshift({ id: col.collectionId, name: col.name });
      currentId = col.parentId;
    }
    return path;
  };

  const breadcrumb = buildBreadcrumb();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Media Library
          </h1>
          <p className="mt-1 text-body-md text-jhr-white-dim">
            Manage images and videos. {total} items total.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowVideoEmbed(!showVideoEmbed); setShowUpload(false); }}
            className="px-3 py-2 rounded-lg border border-jhr-black-lighter text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
          >
            Embed Video
          </button>
          <button
            onClick={() => { setShowUpload(!showUpload); setShowVideoEmbed(false); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <MediaUploadZone onUploadComplete={handleUploadComplete} collectionId={filters.collectionId} />
      )}

      {/* Video embed */}
      {showVideoEmbed && (
        <VideoEmbedInput
          onEmbed={(mediaId) => {
            handleUploadComplete(mediaId);
            setShowVideoEmbed(false);
          }}
        />
      )}

      {/* Storage dashboard */}
      <MediaStorageDashboard refreshKey={statsRefreshKey} />

      {/* Main content area */}
      <div className="flex gap-6">
        {/* Sidebar - Folder tree */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-4">
            <h3 className="text-sm font-medium text-jhr-white-dim mb-2 px-3">
              Collections
            </h3>
            <MediaFolderTree
              selectedCollectionId={filters.collectionId}
              onSelectCollection={(id) =>
                setFilters((prev) => ({ ...prev, collectionId: id }))
              }
              onDropMedia={handleDropMedia}
              collections={collections}
              onCollectionsChange={fetchCollections}
            />
          </div>
        </div>

        {/* Main grid */}
        <div className="flex-1 space-y-4">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="flex items-center gap-1 text-sm">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, collectionId: undefined }))}
                className="text-jhr-white-dim hover:text-jhr-white transition-colors"
              >
                All Media
              </button>
              {breadcrumb.map((crumb) => (
                <span key={crumb.id} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-jhr-white-dim" />
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, collectionId: crumb.id }))}
                    className={`transition-colors ${
                      crumb.id === filters.collectionId
                        ? 'text-jhr-gold font-medium'
                        : 'text-jhr-white-dim hover:text-jhr-white'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </nav>
          )}

          <MediaToolbar
            filters={filters}
            onFilterChange={(update) =>
              setFilters((prev) => ({ ...prev, ...update }))
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={total}
          />

          <MediaGrid
            items={items}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onItemClick={handleItemClick}
            viewMode={viewMode}
            isLoading={isLoading}
          />

          {/* Load more */}
          {cursor && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => fetchMedia(true)}
                className="px-6 py-2 rounded-lg border border-jhr-black-lighter text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {detailItem && (
        <MediaDetailPanel
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          onGenerateAI={handleGenerateAI}
          collections={collections}
          onMoveToFolder={handleMoveToFolder}
        />
      )}

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onBulkTag={handleBulkTag}
        onBulkMove={handleBulkMove}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
