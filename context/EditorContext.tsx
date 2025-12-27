'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface EditorState {
  isEditorMode: boolean;
  isAuthenticated: boolean;
  selectedElement: SelectedElement | null;
  pendingChanges: Map<string, PendingChange>;
  isSaving: boolean;
}

interface SelectedElement {
  id: string;
  pageId: string;
  sectionId: string;
  contentKey: string;
  type: 'text' | 'image' | 'html' | 'json';
  currentValue: string;
  element: HTMLElement | null;
}

interface PendingChange {
  pageId: string;
  sectionId: string;
  contentKey: string;
  value: string;
  contentType: 'text' | 'image' | 'html' | 'json';
}

interface EditorContextValue extends EditorState {
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  toggleEditorMode: () => void;
  selectElement: (element: SelectedElement) => void;
  clearSelection: () => void;
  updateContent: (pageId: string, sectionId: string, contentKey: string, value: string, contentType?: 'text' | 'image' | 'html' | 'json') => void;
  saveAllChanges: () => Promise<boolean>;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditorState>({
    isEditorMode: false,
    isAuthenticated: false,
    selectedElement: null,
    pendingChanges: new Map(),
    isSaving: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify');
        if (response.ok) {
          setState(prev => ({ ...prev, isAuthenticated: true }));
        }
      } catch {
        // Not authenticated
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setState(prev => ({ ...prev, isAuthenticated: true, isEditorMode: true }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    fetch('/api/admin/auth/logout', { method: 'POST' });
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      isEditorMode: false,
      selectedElement: null,
      pendingChanges: new Map(),
    }));
  }, []);

  const toggleEditorMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditorMode: prev.isAuthenticated ? !prev.isEditorMode : false,
      selectedElement: null,
    }));
  }, []);

  const selectElement = useCallback((element: SelectedElement) => {
    setState(prev => ({ ...prev, selectedElement: element }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedElement: null }));
  }, []);

  const updateContent = useCallback((
    pageId: string,
    sectionId: string,
    contentKey: string,
    value: string,
    contentType: 'text' | 'image' | 'html' | 'json' = 'text'
  ) => {
    setState(prev => {
      const newChanges = new Map(prev.pendingChanges);
      const key = `${pageId}:${sectionId}:${contentKey}`;
      newChanges.set(key, { pageId, sectionId, contentKey, value, contentType });
      return { ...prev, pendingChanges: newChanges };
    });
  }, []);

  const saveAllChanges = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isSaving: true }));

    try {
      const changes = Array.from(state.pendingChanges.values());

      const response = await fetch('/api/admin/content/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes }),
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          pendingChanges: new Map(),
          isSaving: false,
        }));
        return true;
      }

      setState(prev => ({ ...prev, isSaving: false }));
      return false;
    } catch {
      setState(prev => ({ ...prev, isSaving: false }));
      return false;
    }
  }, [state.pendingChanges]);

  const discardChanges = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingChanges: new Map(),
      selectedElement: null,
    }));
  }, []);

  const value: EditorContextValue = {
    ...state,
    login,
    logout,
    toggleEditorMode,
    selectElement,
    clearSelection,
    updateContent,
    saveAllChanges,
    discardChanges,
    hasUnsavedChanges: state.pendingChanges.size > 0,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
