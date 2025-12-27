'use client';

import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, ChevronRight, Plus, Loader2 } from 'lucide-react';

interface FolderData {
  folderId: string;
  name: string;
  parentId: string | null;
  itemCount: number;
}

interface FolderTreeProps {
  selectedFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder?: () => void;
}

export function FolderTree({
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderTreeProps) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/admin/media/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const getChildFolders = (parentId: string | null): FolderData[] => {
    return folders.filter((f) => f.parentId === parentId);
  };

  const renderFolder = (folder: FolderData, level: number = 0) => {
    const isSelected = selectedFolderId === folder.folderId;
    const isExpanded = expandedFolders.has(folder.folderId);
    const children = getChildFolders(folder.folderId);
    const hasChildren = children.length > 0;

    return (
      <div key={folder.folderId}>
        <button
          onClick={() => onSelectFolder(folder.folderId)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
            ${isSelected
              ? 'bg-jhr-gold/20 text-jhr-gold'
              : 'text-jhr-white-dim hover:bg-jhr-black-lighter hover:text-jhr-white'
            }
          `}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(folder.folderId, e)}
              className="p-0.5 hover:bg-jhr-black-lighter rounded"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <span className="w-5" />
          )}

          {isSelected || isExpanded ? (
            <FolderOpen className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 flex-shrink-0" />
          )}

          <span className="flex-1 truncate text-sm">{folder.name}</span>

          {folder.itemCount > 0 && (
            <span className="text-xs text-jhr-white-dim">{folder.itemCount}</span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 text-jhr-gold animate-spin" />
      </div>
    );
  }

  const rootFolders = getChildFolders(null);

  return (
    <div className="space-y-1">
      {/* All Media (root) */}
      <button
        onClick={() => onSelectFolder('root')}
        className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
          ${selectedFolderId === 'root'
            ? 'bg-jhr-gold/20 text-jhr-gold'
            : 'text-jhr-white-dim hover:bg-jhr-black-lighter hover:text-jhr-white'
          }
        `}
      >
        <span className="w-5" />
        <Folder className="w-4 h-4" />
        <span className="flex-1 text-sm font-medium">All Media</span>
      </button>

      {/* Folders */}
      {rootFolders.map((folder) => renderFolder(folder))}

      {/* Create folder button */}
      {onCreateFolder && (
        <button
          onClick={onCreateFolder}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-jhr-white-dim hover:bg-jhr-black-lighter hover:text-jhr-white transition-colors mt-2"
        >
          <span className="w-5" />
          <Plus className="w-4 h-4" />
          <span className="text-sm">New Folder</span>
        </button>
      )}
    </div>
  );
}
