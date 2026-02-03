'use client';

import { useEffect } from 'react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';

/**
 * Platform-aware modifier key label.
 * Returns the command symbol on Mac, "Ctrl" on other platforms.
 */
function getModifierKey(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.platform?.toLowerCase().includes('mac') ? '\u2318' : 'Ctrl';
  }
  return '\u2318'; // default to Mac symbol for SSR
}

/**
 * Returns a human-readable shortcut string for a given action.
 * Used for tooltip display on toolbar buttons and elsewhere.
 */
export function getShortcutLabel(action: string): string {
  const mod = getModifierKey();
  switch (action) {
    case 'bold':
      return `${mod}+B`;
    case 'italic':
      return `${mod}+I`;
    case 'underline':
      return `${mod}+U`;
    case 'strike':
      return `${mod}+Shift+S`;
    case 'link':
      return `${mod}+K`;
    case 'save':
      return `${mod}+S`;
    case 'publish':
      return `${mod}+Shift+P`;
    case 'escape':
      return 'Esc';
    case 'editToggle':
      return `${mod}+Shift+E`;
    default:
      return '';
  }
}

/**
 * Global keyboard shortcuts for the inline editor.
 *
 * Handles:
 * - Cmd/Ctrl+S: Save draft (prevents browser save dialog)
 * - Cmd/Ctrl+Shift+P: Publish (prevents browser print dialog)
 * - Escape: Exit edit mode
 *
 * Note: Cmd+B (bold), Cmd+I (italic), and Cmd+K (link) are handled
 * natively by Tiptap when a text editor is focused.
 */
export function KeyboardShortcuts() {
  const { isEditMode, setEditMode, canEdit } = useEditMode();
  const { saveState, hasUnsavedChanges, publish } = useContent();

  useEffect(() => {
    if (!canEdit && !isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+S: Save draft
      if (isModifier && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        if (isEditMode && hasUnsavedChanges && saveState.status !== 'saving') {
          // Trigger save by importing saveChanges - but we use the exposed
          // save mechanism. The ContentContext auto-saves on change, but
          // Cmd+S should force an immediate save. We'll import saveChanges
          // directly from the context.
          // For now, the auto-save debounce handles this. We can dispatch a
          // custom event that ContentContext listens for.
          window.dispatchEvent(new CustomEvent('jhr-force-save'));
        }
        return;
      }

      // Cmd/Ctrl+Shift+P: Publish
      if (isModifier && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (isEditMode) {
          publish();
        }
        return;
      }

      // Escape: Exit edit mode (only when not in a modal or input)
      if (e.key === 'Escape' && isEditMode) {
        // Don't exit if user is in an input, textarea, or a modal
        const target = e.target as HTMLElement;
        const tagName = target?.tagName?.toLowerCase();
        const isInInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
        const isInModal = target?.closest('[role="dialog"]') || target?.closest('.fixed.inset-0');
        const isInTiptap = target?.closest('.tiptap') || target?.closest('.ProseMirror');

        if (!isInInput && !isInModal && !isInTiptap) {
          e.preventDefault();
          setEditMode(false);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canEdit, isEditMode, setEditMode, hasUnsavedChanges, saveState.status, publish]);

  return null; // This component renders nothing - it only adds event listeners
}
