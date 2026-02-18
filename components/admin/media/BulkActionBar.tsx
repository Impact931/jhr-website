'use client';

import { useState, useEffect, useRef } from 'react';
import { Tag, FolderInput, Trash2, X, Loader2 } from 'lucide-react';
import type { MediaCollection } from '@/types/media';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkTag: (tags: string[]) => Promise<void>;
  onBulkMove: (collectionId: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onBulkTag,
  onBulkMove,
  onBulkDelete,
  onClearSelection,
}: BulkActionBarProps) {
  const [action, setAction] = useState<'tag' | 'move' | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const moveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (action === 'move' && collections.length === 0) {
      fetch('/api/admin/media/collections')
        .then((r) => r.json())
        .then((data) => setCollections(data))
        .catch(() => {});
    }
  }, [action, collections.length]);

  // Click-away to dismiss move picker
  useEffect(() => {
    if (action !== 'move') return;
    const handler = (e: MouseEvent) => {
      if (moveRef.current && !moveRef.current.contains(e.target as Node)) {
        setAction(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [action]);

  if (selectedCount === 0) return null;

  const handleTag = async () => {
    if (!tagInput.trim()) return;
    setIsProcessing(true);
    try {
      const tags = tagInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await onBulkTag(tags);
      setTagInput('');
      setAction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMove = async (collectionId: string) => {
    setIsProcessing(true);
    try {
      await onBulkMove(collectionId);
      setAction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onBulkDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-3 rounded-xl bg-jhr-black-light border border-jhr-black-lighter shadow-2xl">
      <span className="text-sm text-jhr-white font-medium">
        {selectedCount} selected
      </span>

      <div className="w-px h-6 bg-jhr-black-lighter" />

      {action === 'tag' ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTag()}
            placeholder="tag1, tag2..."
            className="px-3 py-1 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white focus:outline-none focus:ring-1 focus:ring-jhr-gold/50 w-40"
          />
          <button
            onClick={handleTag}
            disabled={isProcessing}
            className="px-3 py-1 rounded-lg bg-jhr-gold text-jhr-black text-sm font-medium hover:bg-jhr-gold/90 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
          </button>
          <button
            onClick={() => setAction(null)}
            className="p-1 text-jhr-white-dim hover:text-jhr-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : action === 'move' ? (
        <div ref={moveRef} className="relative flex items-center gap-2">
          <div className="absolute bottom-full mb-2 left-0 w-56 max-h-60 overflow-y-auto bg-jhr-black border border-jhr-black-lighter rounded-lg shadow-xl py-1">
            <button
              onClick={() => handleMove('')}
              disabled={isProcessing}
              className="w-full text-left px-3 py-1.5 text-sm text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
            >
              No folder (root)
            </button>
            {collections.map((col) => (
              <button
                key={col.collectionId}
                onClick={() => handleMove(col.collectionId)}
                disabled={isProcessing}
                className="w-full text-left px-3 py-1.5 text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors truncate"
              >
                {col.name}
              </button>
            ))}
          </div>
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-jhr-white" />}
          <span className="text-sm text-jhr-white-dim">Pick a folder</span>
          <button
            onClick={() => setAction(null)}
            className="p-1 text-jhr-white-dim hover:text-jhr-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showDeleteConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-400">Delete {selectedCount} items?</span>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-3 py-1 rounded-lg border border-jhr-black-lighter text-sm text-jhr-white-dim hover:bg-jhr-black-lighter"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setAction('tag')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
          >
            <Tag className="w-4 h-4" />
            Tag
          </button>
          <button
            onClick={() => setAction('move')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
          >
            <FolderInput className="w-4 h-4" />
            Move
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </>
      )}

      <div className="w-px h-6 bg-jhr-black-lighter" />

      <button
        onClick={onClearSelection}
        className="p-1.5 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
