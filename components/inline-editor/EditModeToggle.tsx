'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Pencil, Eye, Send, Check, Loader2, X, Search, Save, Download, Upload, LayoutDashboard, Image as ImageIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { exportAllContent, importAllContent } from '@/lib/local-content-store';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { PageSEOPanel } from './PageSEOPanel';
import { getShortcutLabel } from './KeyboardShortcuts';

export function EditModeToggle() {
  const { isEditMode, setEditMode, isAuthenticated } = useEditMode();
  const { pendingCount, saveState, publishState, publish, save, hasUnsavedChanges } = useContent();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSEOPanel, setShowSEOPanel] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close expanded menu when tapping outside (touch support)
  useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('touchstart', handleTouchOutside);
    return () => document.removeEventListener('touchstart', handleTouchOutside);
  }, []);

  const handleExport = useCallback(() => {
    const data = exportAllContent();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jhr-content-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const { imported, failed } = importAllContent(data);
        setImportStatus(`Imported ${imported.length} page(s)${failed.length ? `, ${failed.length} failed` : ''}`);
        setTimeout(() => setImportStatus(null), 4000);
      } catch {
        setImportStatus('Invalid JSON file');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported
    e.target.value = '';
  }, []);

  // Only show if authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = () => {
    setEditMode(!isEditMode);
  };

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const handlePublish = async () => {
    await publish();
  };

  return (
    <>
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 z-50 flex flex-col-reverse items-end gap-2 sm:gap-3"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Main toggle button (rendered first in DOM, appears at bottom due to flex-col-reverse) */}
        <button
          onClick={handleToggle}
          onTouchStart={handleToggleExpanded}
          className={`
            relative w-14 h-14 rounded-full shadow-lg transition-all duration-300
            flex items-center justify-center touch-manipulation
            ${isEditMode
              ? 'bg-jhr-gold border-2 border-jhr-gold hover:bg-jhr-gold-light'
              : 'bg-jhr-black-light border-2 border-jhr-gold/30 hover:border-jhr-gold/60'
            }
          `}
          title={isEditMode ? `Exit Edit Mode (${getShortcutLabel('editToggle')}) or Esc` : `Enter Edit Mode (${getShortcutLabel('editToggle')})`}
        >
          {isEditMode ? (
            <Pencil className="w-6 h-6 text-jhr-black" />
          ) : (
            <Eye className="w-6 h-6 text-jhr-gold" />
          )}

          {/* Pending changes badge */}
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-jhr-black text-xs font-bold rounded-full flex items-center justify-center">
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}

          {/* Pulse animation when edit mode is active */}
          {isEditMode && (
            <span className="absolute inset-0 rounded-full bg-jhr-gold/30 animate-ping" />
          )}
        </button>

        {/* Save indicator (appears above the toggle button) */}
        {saveState.status === 'saving' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-sm text-jhr-white-dim">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}

        {saveState.status === 'saved' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-sm text-green-400">
            <Check className="w-4 h-4" />
            Saved
          </div>
        )}

        {saveState.status === 'error' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-sm text-red-400">
            <X className="w-4 h-4" />
            {saveState.error || 'Save failed'}
          </div>
        )}

        {/* Save button - always visible in edit mode */}
        {isEditMode && (
          <button
            onClick={() => save()}
            disabled={saveState.status === 'saving'}
            title={`Save (${getShortcutLabel('save')})`}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 font-semibold rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px] bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
          >
            {saveState.status === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        )}

        {/* SEO button */}
        {isExpanded && isEditMode && (
          <button
            onClick={() => setShowSEOPanel(true)}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-black-light border border-zinc-700/50 hover:border-jhr-gold/50 text-zinc-300 hover:text-jhr-gold font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            Page SEO
          </button>
        )}

        {/* Media Library link */}
        {isExpanded && isEditMode && (
          <Link
            href="/admin/media"
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-black-light border border-zinc-700/50 hover:border-jhr-gold/50 text-zinc-300 hover:text-jhr-gold font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <ImageIcon className="w-4 h-4" />
            Media Library
          </Link>
        )}

        {/* Admin Panel link */}
        {isExpanded && isEditMode && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-black-light border border-zinc-700/50 hover:border-jhr-gold/50 text-zinc-300 hover:text-jhr-gold font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin Panel
          </Link>
        )}

        {/* Export button */}
        {isExpanded && isEditMode && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-black-light border border-zinc-700/50 hover:border-jhr-gold/50 text-zinc-300 hover:text-jhr-gold font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}

        {/* Import button */}
        {isExpanded && isEditMode && (
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-black-light border border-zinc-700/50 hover:border-jhr-gold/50 text-zinc-300 hover:text-jhr-gold font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        )}

        {/* Import status notification */}
        {importStatus && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm text-blue-400">
            <Check className="w-4 h-4" />
            {importStatus}
          </div>
        )}

        {/* Logout button — at the top of the stack */}
        {isExpanded && isEditMode && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
                setEditMode(false);
                setIsExpanded(false);
                signOut({ callbackUrl: '/' });
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white font-medium rounded-lg shadow-lg transition-all touch-manipulation min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}

        {/* Publish button */}
        {isExpanded && isEditMode && hasUnsavedChanges && (
          <button
            onClick={handlePublish}
            disabled={publishState.status === 'publishing'}
            title={`Publish (${getShortcutLabel('publish')})`}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-jhr-gold hover:bg-jhr-gold-light text-jhr-black font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 touch-manipulation min-h-[44px]"
          >
            {publishState.status === 'publishing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish
              </>
            )}
          </button>
        )}
      </div>

      {/* SEO Panel Modal */}
      {showSEOPanel && (
        <PageSEOPanel onClose={() => setShowSEOPanel(false)} />
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />
    </>
  );
}
