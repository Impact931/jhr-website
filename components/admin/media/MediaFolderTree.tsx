'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Video,
  Layers,
  X,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { MediaCollection } from '@/types/media';

interface MediaFolderTreeProps {
  selectedCollectionId?: string;
  onSelectCollection: (collectionId: string | undefined) => void;
  onDropMedia?: (mediaIds: string[], collectionId: string | undefined) => void;
  collections: MediaCollection[];
  onCollectionsChange: () => void;
}

export default function MediaFolderTree({
  selectedCollectionId,
  onSelectCollection,
  onDropMedia,
  collections,
  onCollectionsChange,
}: MediaFolderTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null | 'root'>(null);
  const [contextMenu, setContextMenu] = useState<{ collectionId: string; x: number; y: number } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Click-away to dismiss context menu
  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenu]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await fetch('/api/admin/media/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          parentId: selectedCollectionId,
        }),
      });
      setNewName('');
      setIsCreating(false);
      onCollectionsChange();
    } catch {
      // Silently fail
    }
  };

  const handleRename = async (collectionId: string) => {
    if (!renameValue.trim()) return;
    try {
      await fetch(`/api/admin/media/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      setRenamingId(null);
      onCollectionsChange();
    } catch {
      // Silently fail
    }
  };

  const handleDeleteFolder = async (collectionId: string) => {
    try {
      await fetch(`/api/admin/media/collections/${collectionId}`, {
        method: 'DELETE',
      });
      setDeleteConfirmId(null);
      if (selectedCollectionId === collectionId) {
        onSelectCollection(undefined);
      }
      onCollectionsChange();
    } catch {
      // Silently fail
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent, id: string | 'root') => {
    if (e.dataTransfer.types.includes('application/x-media-ids')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, collectionId: string | undefined) => {
    e.preventDefault();
    setDragOverId(null);
    const data = e.dataTransfer.getData('application/x-media-ids');
    if (data && onDropMedia) {
      try {
        const mediaIds = JSON.parse(data) as string[];
        onDropMedia(mediaIds, collectionId);
      } catch {
        // Invalid data
      }
    }
  };

  // Build tree from flat list
  const rootCollections = collections.filter((c) => !c.parentId);
  const getChildren = (parentId: string) =>
    collections.filter((c) => c.parentId === parentId);

  const renderCollection = (collection: MediaCollection, depth = 0) => {
    const children = getChildren(collection.collectionId);
    const isExpanded = expandedIds.has(collection.collectionId);
    const isSelected = selectedCollectionId === collection.collectionId;
    const isDragOver = dragOverId === collection.collectionId;

    if (renamingId === collection.collectionId) {
      return (
        <div key={collection.collectionId} className="flex items-center gap-1 px-3 py-1" style={{ paddingLeft: `${12 + depth * 16}px` }}>
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename(collection.collectionId);
              if (e.key === 'Escape') setRenamingId(null);
            }}
            onBlur={() => handleRename(collection.collectionId)}
            className="flex-1 px-2 py-1 bg-jhr-black border border-jhr-gold/50 rounded text-xs text-jhr-white focus:outline-none focus:ring-1 focus:ring-jhr-gold/50"
          />
        </div>
      );
    }

    if (deleteConfirmId === collection.collectionId) {
      return (
        <div key={collection.collectionId} className="px-3 py-1.5 space-y-1" style={{ paddingLeft: `${12 + depth * 16}px` }}>
          <p className="text-xs text-red-400">Delete &ldquo;{collection.name}&rdquo;?</p>
          <div className="flex gap-1">
            <button
              onClick={() => handleDeleteFolder(collection.collectionId)}
              className="px-2 py-0.5 rounded text-xs bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-2 py-0.5 rounded text-xs border border-jhr-black-lighter text-jhr-white-dim hover:bg-jhr-black-lighter"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={collection.collectionId}>
        <button
          onClick={() => onSelectCollection(collection.collectionId)}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ collectionId: collection.collectionId, x: e.clientX, y: e.clientY });
          }}
          onDragOver={(e) => handleDragOver(e, collection.collectionId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, collection.collectionId)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            isDragOver
              ? 'ring-2 ring-jhr-gold bg-jhr-gold/10 text-jhr-gold'
              : isSelected
                ? 'bg-jhr-gold/20 text-jhr-gold'
                : 'text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {children.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(collection.collectionId);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </span>
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="truncate flex-1 text-left">{collection.name}</span>
          {collection.mediaCount > 0 && (
            <span className="text-xs text-jhr-white-dim">{collection.mediaCount}</span>
          )}
        </button>
        {isExpanded &&
          children.map((child) => renderCollection(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* All media */}
      <button
        onClick={() => onSelectCollection(undefined)}
        onDragOver={(e) => handleDragOver(e, 'root')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, undefined)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
          dragOverId === 'root'
            ? 'ring-2 ring-jhr-gold bg-jhr-gold/10 text-jhr-gold'
            : !selectedCollectionId
              ? 'bg-jhr-gold/20 text-jhr-gold'
              : 'text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter'
        }`}
      >
        <Layers className="w-4 h-4" />
        All Media
      </button>

      {/* Collections */}
      {rootCollections.map((c) => renderCollection(c))}

      {/* Create new */}
      {isCreating ? (
        <div className="flex items-center gap-1 px-3 py-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') setIsCreating(false);
            }}
            placeholder="Folder name..."
            className="flex-1 px-2 py-1 bg-jhr-black border border-jhr-black-lighter rounded text-xs text-jhr-white focus:outline-none focus:ring-1 focus:ring-jhr-gold/50"
          />
          <button
            onClick={() => setIsCreating(false)}
            className="p-1 text-jhr-white-dim hover:text-jhr-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          New Folder
        </button>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 w-36 bg-jhr-black-light border border-jhr-black-lighter rounded-lg shadow-xl py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              const col = collections.find((c) => c.collectionId === contextMenu.collectionId);
              setRenameValue(col?.name || '');
              setRenamingId(contextMenu.collectionId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Rename
          </button>
          <button
            onClick={() => {
              setDeleteConfirmId(contextMenu.collectionId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
