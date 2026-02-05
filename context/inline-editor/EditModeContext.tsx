'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { EditModeContextValue, UserInfo } from '@/types/inline-editor';

const EditModeContext = createContext<EditModeContextValue | null>(null);

const STORAGE_KEY = 'jhr-edit-mode';

interface EditModeProviderProps {
  children: ReactNode;
  /** Force edit mode on regardless of session storage. Used for admin create/edit pages. */
  forceEditMode?: boolean;
}

export function EditModeProvider({ children, forceEditMode = false }: EditModeProviderProps) {
  const { data: session, status } = useSession();
  const [isEditMode, setIsEditModeState] = useState(forceEditMode);

  const isAuthenticated = status === 'authenticated';
  const user: UserInfo | null = session?.user
    ? {
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
      }
    : null;

  // Can only edit if authenticated AND edit mode is on
  // Or if forceEditMode is true (admin pages that don't require session check)
  const canEdit = (isAuthenticated && isEditMode) || forceEditMode;

  // Load edit mode from sessionStorage on mount, or from URL param
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If forceEditMode is true, always enable edit mode
    if (forceEditMode) {
      setIsEditModeState(true);
      return;
    }

    if (isAuthenticated) {
      // Check for ?editMode=true URL param
      const params = new URLSearchParams(window.location.search);
      if (params.get('editMode') === 'true') {
        setIsEditModeState(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
        // Strip the editMode param from the URL without reload
        params.delete('editMode');
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        return;
      }

      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setIsEditModeState(true);
      }
    }
  }, [isAuthenticated, forceEditMode]);

  // Persist edit mode to sessionStorage
  const setEditMode = useCallback((enabled: boolean) => {
    if (!isAuthenticated && enabled) {
      // Can't enable edit mode if not authenticated
      return;
    }
    setIsEditModeState(enabled);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    }
  }, [isAuthenticated]);

  // Clear edit mode on logout
  useEffect(() => {
    if (!isAuthenticated && isEditMode) {
      setIsEditModeState(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [isAuthenticated, isEditMode]);

  // Keyboard shortcut: Cmd/Ctrl + Shift + E to toggle edit mode
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
        e.preventDefault();
        setEditMode(!isEditMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, isEditMode, setEditMode]);

  const value: EditModeContextValue = {
    isEditMode,
    setEditMode,
    isAuthenticated,
    user,
    canEdit,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode(): EditModeContextValue {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}

export { EditModeContext };
