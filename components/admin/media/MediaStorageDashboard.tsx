'use client';

import { useState, useEffect } from 'react';
import { HardDrive, Image as ImageIcon, Video, RefreshCw, Loader2 } from 'lucide-react';
import type { MediaStats } from '@/types/media';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface MediaStorageDashboardProps {
  refreshKey?: number;
}

export default function MediaStorageDashboard({ refreshKey = 0 }: MediaStorageDashboardProps) {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/media/stats');
      if (res.ok) setStats(await res.json());
    } catch {
      // Silently fail
    }
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const res = await fetch('/api/admin/media/stats', { method: 'POST' });
      if (res.ok) setStats(await res.json());
    } finally {
      setIsRecalculating(false);
    }
  };

  if (!stats) return null;

  const maxStorage = 5 * 1024 * 1024 * 1024; // 5 GB
  const usagePercent = Math.min((stats.totalSize / maxStorage) * 100, 100);

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jhr-gold/10">
            <HardDrive className="w-5 h-5 text-jhr-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-jhr-white">Storage</p>
            <p className="text-xs text-jhr-white-dim">
              {formatBytes(stats.totalSize)} of {formatBytes(maxStorage)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="p-1.5 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter disabled:opacity-50"
          title="Recalculate"
        >
          {isRecalculating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-jhr-black-lighter rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-jhr-gold rounded-full transition-all"
          style={{ width: `${Math.max(usagePercent, 0.5)}%` }}
        />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-lg bg-jhr-black">
          <p className="text-lg font-bold text-jhr-white">{stats.totalCount}</p>
          <p className="text-xs text-jhr-white-dim">Total Files</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-jhr-black">
          <div className="flex items-center justify-center gap-1 text-jhr-white">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-lg font-bold">{stats.imageCount}</span>
          </div>
          <p className="text-xs text-jhr-white-dim">{formatBytes(stats.imageSize)}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-jhr-black">
          <div className="flex items-center justify-center gap-1 text-jhr-white">
            <Video className="w-3.5 h-3.5" />
            <span className="text-lg font-bold">{stats.videoCount}</span>
          </div>
          <p className="text-xs text-jhr-white-dim">{formatBytes(stats.videoSize)}</p>
        </div>
      </div>
    </div>
  );
}
