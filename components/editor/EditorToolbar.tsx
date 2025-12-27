'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Pencil,
  Save,
  X,
  LogOut,
  EyeOff,
  Loader2,
  Check,
} from 'lucide-react';

export function EditorToolbar() {
  const {
    isEditorMode,
    isAuthenticated,
    hasUnsavedChanges,
    isSaving,
    pendingChanges,
    logout,
    toggleEditorMode,
    saveAllChanges,
    discardChanges,
  } = useEditor();

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    const success = await saveAllChanges();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Don't render anything if not authenticated
  // Users must log in through /admin - no public login button
  if (!isAuthenticated) {
    return null;
  }

  // Main toolbar when authenticated
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
      {/* Changes indicator */}
      {hasUnsavedChanges && (
        <div className="bg-orange-500/20 border border-orange-500/50 text-orange-400 px-3 py-2 rounded-lg text-sm">
          {pendingChanges.size} unsaved change{pendingChanges.size !== 1 ? 's' : ''}
        </div>
      )}

      {/* Save success indicator */}
      {saveSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          Saved!
        </div>
      )}

      {/* Main controls */}
      <div className="bg-jhr-black-light border border-jhr-gold/30 rounded-lg shadow-lg flex items-center">
        {/* Toggle edit mode */}
        <button
          onClick={toggleEditorMode}
          className={`px-4 py-2 flex items-center gap-2 font-semibold transition-colors ${
            isEditorMode
              ? 'bg-jhr-gold text-jhr-black'
              : 'text-jhr-gold hover:bg-jhr-gold/10'
          } rounded-l-lg`}
        >
          {isEditorMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              Exit Edit
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit Mode
            </>
          )}
        </button>

        {/* Save button - only show in edit mode */}
        {isEditorMode && (
          <>
            <div className="w-px h-8 bg-jhr-gold/30" />
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-4 py-2 flex items-center gap-2 text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>

            <div className="w-px h-8 bg-jhr-gold/30" />
            <button
              onClick={discardChanges}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2 flex items-center gap-2 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              Discard
            </button>
          </>
        )}

        {/* Logout */}
        <div className="w-px h-8 bg-jhr-gold/30" />
        <button
          onClick={logout}
          className="px-4 py-2 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-r-lg"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
