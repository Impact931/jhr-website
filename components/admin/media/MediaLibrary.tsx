'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MediaGrid } from './MediaGrid';
import { MediaUploader } from './MediaUploader';
import { FolderTree } from './FolderTree';
import { MediaDetailModal } from './MediaDetailModal';
import { MediaItemData } from './MediaItem';
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  FolderPlus,
  X,
  Image as ImageIcon,
  Video,
  CheckSquare,
  Square,
  Loader2,
  RefreshCw,
  Download,
} from 'lucide-react';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'image' | 'video';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

function CreateFolderModal({ isOpen, onClose, onSubmit }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await onSubmit(name.trim());
    setIsSubmitting(false);
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-jhr-white">Create Folder</h3>
          <button onClick={onClose} className="text-jhr-white-dim hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold"
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-jhr-white-dim hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black font-medium rounded-lg hover:bg-jhr-gold-light transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItemData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set('search', searchQuery);
      } else if (selectedFolderId !== 'root') {
        params.set('folderId', selectedFolderId);
      }
      if (filterType !== 'all') {
        params.set('type', filterType);
      }

      const response = await fetch(`/api/admin/media?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch media');

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFolderId, filterType]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleEdit = (item: MediaItemData) => {
    setSelectedItem(item);
  };

  const handleUpdateMedia = async (
    mediaId: string,
    updates: { name?: string; alt?: string; tags?: string[] }
  ) => {
    try {
      const response = await fetch(`/api/admin/media/${mediaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update');

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.mediaId === mediaId ? { ...item, ...updates } : item
        )
      );
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  };

  const handleImportFromS3 = async () => {
    setIsImporting(true);
    setImportStatus('Scanning S3 bucket...');
    try {
      const response = await fetch('/api/admin/media/scan-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Failed to import');

      const data = await response.json();
      setImportStatus(`Imported ${data.imported} files from S3`);

      // Refresh media list
      if (data.imported > 0) {
        fetchMedia();
      }

      // Clear status after a few seconds
      setTimeout(() => setImportStatus(null), 5000);
    } catch (error) {
      console.error('Error importing from S3:', error);
      setImportStatus('Import failed. Check console for details.');
      setTimeout(() => setImportStatus(null), 5000);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportPublicImages = async () => {
    setIsImporting(true);
    setImportStatus('Importing website images to S3...');
    try {
      const response = await fetch('/api/admin/media/import-public', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to import');

      const data = await response.json();
      setImportStatus(`Imported ${data.imported} website images (${data.skipped} already existed)`);

      // Refresh media list
      if (data.imported > 0) {
        fetchMedia();
      }

      // Clear status after a few seconds
      setTimeout(() => setImportStatus(null), 5000);
    } catch (error) {
      console.error('Error importing public images:', error);
      setImportStatus('Import failed. Check console for details.');
      setTimeout(() => setImportStatus(null), 5000);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportAll = async () => {
    setIsImporting(true);
    setImportStatus('Importing all images...');

    try {
      // First import public images
      setImportStatus('Step 1/2: Importing website images...');
      const publicResponse = await fetch('/api/admin/media/import-public', {
        method: 'POST',
      });
      const publicData = publicResponse.ok ? await publicResponse.json() : { imported: 0 };

      // Then import from S3
      setImportStatus('Step 2/2: Scanning S3 bucket...');
      const s3Response = await fetch('/api/admin/media/scan-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const s3Data = s3Response.ok ? await s3Response.json() : { imported: 0 };

      const totalImported = (publicData.imported || 0) + (s3Data.imported || 0);
      setImportStatus(`Done! Imported ${totalImported} total images`);

      // Refresh media list
      if (totalImported > 0) {
        fetchMedia();
      }

      setTimeout(() => setImportStatus(null), 5000);
    } catch (error) {
      console.error('Error importing:', error);
      setImportStatus('Import failed. Check console for details.');
      setTimeout(() => setImportStatus(null), 5000);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSyncMetadata = async () => {
    setIsImporting(true);
    setImportStatus('Syncing file sizes from S3...');

    try {
      const response = await fetch('/api/admin/media/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Sync failed');

      const data = await response.json();
      setImportStatus(`Synced! ${data.results.updated} files updated`);

      // Refresh media list
      fetchMedia();

      setTimeout(() => setImportStatus(null), 5000);
    } catch (error) {
      console.error('Error syncing:', error);
      setImportStatus('Sync failed');
      setTimeout(() => setImportStatus(null), 3000);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (item: MediaItemData) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/media/${item.mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setItems((prev) => prev.filter((i) => i.mediaId !== item.mediaId));
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: Show toast notification
  };

  const handleSelect = (item: MediaItemData) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item.mediaId)) {
        next.delete(item.mediaId);
      } else {
        next.add(item.mediaId);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) return;

    setIsDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedItems).map((mediaId) =>
          fetch(`/api/admin/media/${mediaId}`, { method: 'DELETE' })
        )
      );

      setItems((prev) => prev.filter((i) => !selectedItems.has(i.mediaId)));
      setSelectedItems(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete some items');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/admin/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId: selectedFolderId === 'root' ? null : selectedFolderId }),
      });

      if (!response.ok) throw new Error('Failed to create folder');

      // Refresh folder tree (it will re-fetch internally)
      window.location.reload();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-jhr-black-lighter p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-jhr-white-dim uppercase tracking-wide mb-4">
          Folders
        </h3>
        <FolderTree
          selectedFolderId={selectedFolderId}
          onSelectFolder={(id) => {
            setSelectedFolderId(id);
            setSearchQuery('');
          }}
          onCreateFolder={() => setShowCreateFolder(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-jhr-black-lighter">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jhr-white-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-jhr-gold text-jhr-black'
                  : 'text-jhr-white-dim hover:bg-jhr-black-lighter'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === 'image'
                  ? 'bg-jhr-gold text-jhr-black'
                  : 'text-jhr-white-dim hover:bg-jhr-black-lighter'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Images
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === 'video'
                  ? 'bg-jhr-gold text-jhr-black'
                  : 'text-jhr-white-dim hover:bg-jhr-black-lighter'
              }`}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
          </div>

          <div className="w-px h-6 bg-jhr-black-lighter" />

          {/* View mode */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-jhr-black-lighter text-jhr-white' : 'text-jhr-white-dim hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-jhr-black-lighter text-jhr-white' : 'text-jhr-white-dim hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-jhr-black-lighter" />

          {/* Selection mode */}
          <button
            onClick={() => {
              setSelectionMode(!selectionMode);
              if (selectionMode) setSelectedItems(new Set());
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectionMode
                ? 'bg-jhr-gold text-jhr-black'
                : 'text-jhr-white-dim hover:bg-jhr-black-lighter'
            }`}
          >
            {selectionMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            Select
          </button>

          {/* Delete selected */}
          {selectionMode && selectedItems.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete ({selectedItems.size})
            </button>
          )}

          <div className="flex-1" />

          {/* Import status */}
          {importStatus && (
            <div className="text-sm text-jhr-gold bg-jhr-gold/10 px-3 py-1.5 rounded-lg">
              {importStatus}
            </div>
          )}

          {/* Sync Metadata button */}
          <button
            onClick={handleSyncMetadata}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 border border-jhr-white-dim/30 text-jhr-white-dim rounded-lg hover:bg-jhr-black-lighter hover:text-white transition-colors disabled:opacity-50"
            title="Sync file sizes and metadata from S3"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Sync
          </button>

          {/* Import All Images button */}
          <button
            onClick={handleImportAll}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 border border-jhr-gold/50 text-jhr-gold rounded-lg hover:bg-jhr-gold/10 transition-colors disabled:opacity-50"
            title="Import all website images and S3 files into the media library"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Import All Images
          </button>

          {/* Upload button */}
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black font-medium rounded-lg hover:bg-jhr-gold-light transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showUploader ? (
            <MediaUploader
              folderId={selectedFolderId}
              onUploadComplete={() => {
                fetchMedia();
              }}
              onClose={() => setShowUploader(false)}
            />
          ) : (
            <MediaGrid
              items={filteredItems}
              isLoading={isLoading}
              selectedItems={selectedItems}
              selectionMode={selectionMode}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopyUrl={handleCopyUrl}
              emptyMessage={
                searchQuery
                  ? 'No media found matching your search'
                  : filterType !== 'all'
                  ? `No ${filterType}s in this folder`
                  : 'No media in this folder. Upload some files to get started!'
              }
            />
          )}
        </div>
      </div>

      {/* Create folder modal */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
      />

      {/* Media detail modal */}
      <MediaDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateMedia}
        onDelete={(item) => {
          handleDelete(item);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
