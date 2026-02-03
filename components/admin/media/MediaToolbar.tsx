'use client';

import { Search, SlidersHorizontal, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import type { MediaFilterState, MediaType } from '@/types/media';

interface MediaToolbarProps {
  filters: MediaFilterState;
  onFilterChange: (filters: Partial<MediaFilterState>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCount?: number;
}

export default function MediaToolbar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: MediaToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jhr-white-dim" />
        <input
          type="text"
          placeholder="Search media..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
        />
      </div>

      {/* Type filter */}
      <select
        value={filters.mediaType || ''}
        onChange={(e) =>
          onFilterChange({
            mediaType: (e.target.value as MediaType) || undefined,
          })
        }
        className="px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50"
      >
        <option value="">All Types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-') as [
            MediaFilterState['sortBy'],
            'asc' | 'desc',
          ];
          onFilterChange({ sortBy, sortOrder });
        }}
        className="px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50"
      >
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="filename-asc">Name A-Z</option>
        <option value="filename-desc">Name Z-A</option>
        <option value="fileSize-desc">Largest First</option>
        <option value="fileSize-asc">Smallest First</option>
      </select>

      {/* View toggle */}
      <div className="flex items-center gap-1 p-1 bg-jhr-black rounded-lg border border-jhr-black-lighter">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-1.5 rounded ${
            viewMode === 'grid'
              ? 'bg-jhr-gold/20 text-jhr-gold'
              : 'text-jhr-white-dim hover:text-jhr-white'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-1.5 rounded ${
            viewMode === 'list'
              ? 'bg-jhr-gold/20 text-jhr-gold'
              : 'text-jhr-white-dim hover:text-jhr-white'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Count */}
      {totalCount !== undefined && (
        <span className="text-sm text-jhr-white-dim">{totalCount} items</span>
      )}
    </div>
  );
}
