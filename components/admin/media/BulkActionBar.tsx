'use client';

import { useState } from 'react';
import { Tag, FolderInput, Trash2, X, Loader2 } from 'lucide-react';

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
