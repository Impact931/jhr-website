'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import type { MediaCollection } from '@/types/media';

interface MediaFolderTreeProps {
  selectedCollectionId?: string;
  onSelectCollection: (collectionId: string | undefined) => void;
}

export default function MediaFolderTree({
  selectedCollectionId,
  onSelectCollection,
}: MediaFolderTreeProps) {
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/media/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch {
      // Silently fail
    }
  };

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
      fetchCollections();
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

  // Build tree from flat list
  const rootCollections = collections.filter((c) => !c.parentId);
  const getChildren = (parentId: string) =>
    collections.filter((c) => c.parentId === parentId);

  const renderCollection = (collection: MediaCollection, depth = 0) => {
    const children = getChildren(collection.collectionId);
    const isExpanded = expandedIds.has(collection.collectionId);
    const isSelected = selectedCollectionId === collection.collectionId;

    return (
      <div key={collection.collectionId}>
        <button
          onClick={() => onSelectCollection(collection.collectionId)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isSelected
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
        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          !selectedCollectionId
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
    </div>
  );
}
