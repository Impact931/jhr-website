'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { FloatingToolbar } from './FloatingToolbar';
import {
  createContentEditorExtensions,
  createSimpleEditorExtensions,
  EDITOR_CLASSES,
} from '@/lib/tiptap-config';

// ============================================================================
// Types
// ============================================================================

type EditableElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

type EditorVariant = 'rich' | 'simple';

interface EditableTextProps {
  /** Content key for tracking changes (format: pageSlug:sectionId:elementId). */
  contentKey: string;
  /** The initial HTML content to display. Falls back to rendering children. */
  children: React.ReactNode;
  /** The HTML element to wrap the content in view mode. Defaults to 'span'. */
  as?: EditableElement;
  /** Additional CSS classes for the wrapper element. */
  className?: string;
  /** Whether the editor supports multiline/rich content. Defaults to false. */
  multiline?: boolean;
  /** Editor variant: 'rich' includes images/headings, 'simple' is text-only. Defaults based on multiline. */
  variant?: EditorVariant;
  /** Placeholder text shown in the editor when empty. */
  placeholder?: string;
  /** Optional callback when content changes (receives HTML string). */
  onChange?: (html: string) => void;
}

// ============================================================================
// EditableText Component
// ============================================================================

export function EditableText({
  contentKey,
  children,
  as: Component = 'span',
  className = '',
  multiline = false,
  variant,
  placeholder,
  onChange,
}: EditableTextProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Determine the editor variant based on props
  const editorVariant: EditorVariant = variant ?? (multiline ? 'rich' : 'simple');

  // Rich variant always supports multiline
  const isMultiline = multiline || editorVariant === 'rich';

  // Resolve the initial HTML content from children or pending changes
  const pendingChange = pendingChanges.get(contentKey);
  const childContent = typeof children === 'string' ? children : '';
  const initialContent = pendingChange?.newValue ?? childContent;

  // Create extensions based on variant
  const extensions = editorVariant === 'rich'
    ? createContentEditorExtensions(placeholder)
    : createSimpleEditorExtensions(placeholder);

  // Initialize Tiptap editor
  const editor = useEditor(
    {
      extensions,
      content: initialContent,
      editable: canEdit,
      immediatelyRender: false,
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        updateContent(contentKey, html, 'text');
        // Call optional onChange callback for external state management
        onChange?.(html);
      },
      onFocus: () => {
        setIsFocused(true);
      },
      onBlur: () => {
        setIsFocused(false);
      },
      // Handle Enter key for single-line mode
      editorProps: {
        handleKeyDown: (_view, event) => {
          if (!isMultiline && event.key === 'Enter') {
            // Prevent newline in single-line mode; blur instead
            event.preventDefault();
            editor?.commands.blur();
            return true;
          }
          return false;
        },
      },
    },
    [canEdit] // Re-create editor when editability changes
  );

  // Sync content when external changes arrive (e.g. pending change cleared after save)
  const lastContentRef = useRef(initialContent);
  useEffect(() => {
    if (!editor) return;
    if (initialContent !== lastContentRef.current) {
      // Only update if the editor is not focused (avoid overwriting user edits)
      if (!editor.isFocused) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
      }
      lastContentRef.current = initialContent;
    }
  }, [editor, initialContent]);

  // Update editable state when canEdit changes
  useEffect(() => {
    if (editor && editor.isEditable !== canEdit) {
      editor.setEditable(canEdit);
    }
  }, [editor, canEdit]);

  // Handle click on the wrapper to focus the editor
  const handleWrapperClick = useCallback(() => {
    if (canEdit && editor && !editor.isFocused) {
      editor.commands.focus();
    }
  }, [canEdit, editor]);

  // ---- View Mode (no edit mode active) ----
  if (!isEditMode) {
    // Render the raw HTML content from children
    if (typeof children === 'string' && children.includes('<')) {
      // HTML content - render with dangerouslySetInnerHTML
      return (
        <Component
          className={className}
          dangerouslySetInnerHTML={{ __html: pendingChange?.newValue ?? children }}
        />
      );
    }
    // Plain text or React nodes
    return (
      <Component className={className}>
        {pendingChange?.newValue ?? children}
      </Component>
    );
  }

  // ---- Edit Mode ----
  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      onClick={handleWrapperClick}
    >
      {/* Floating toolbar - shows when editor is focused */}
      <FloatingToolbar editor={editor} visible={isFocused} />

      {/* Editor container with outline styling */}
      <div
        className={`
          ${EDITOR_CLASSES.prose}
          ${canEdit ? 'cursor-text' : ''}
          ${canEdit && !isFocused
            ? EDITOR_CLASSES.editable
            : ''
          }
          ${isFocused ? EDITOR_CLASSES.editing : ''}
          rounded transition-all
        `}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
