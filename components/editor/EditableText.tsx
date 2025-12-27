'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useEditableContent } from '@/hooks/useEditableContent';
import { Pencil, Sparkles, Check, X } from 'lucide-react';

interface EditableTextProps {
  pageId?: string;
  sectionId: string;
  contentKey: string;
  defaultValue?: string;
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  contentType?: 'heading' | 'paragraph' | 'tagline' | 'cta' | 'feature' | 'testimonial';
  multiline?: boolean;
}

export function EditableText({
  pageId = 'default',
  sectionId,
  contentKey,
  defaultValue,
  children,
  as: Component = 'p',
  className = '',
  contentType = 'paragraph',
  multiline = false,
}: EditableTextProps) {
  // Support both defaultValue prop and children - children takes precedence if both provided
  const resolvedDefaultValue = defaultValue ?? (typeof children === 'string' ? children : String(children ?? ''));
  const { isEditorMode, selectElement, updateContent, pendingChanges } = useEditor();
  const { value: savedValue, isLoading } = useEditableContent(pageId, sectionId, contentKey, resolvedDefaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(resolvedDefaultValue);
  const [isAILoading, setIsAILoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const elementRef = useRef<HTMLElement>(null);

  // Check for pending changes
  const changeKey = `${pageId}:${sectionId}:${contentKey}`;
  const pendingValue = pendingChanges.get(changeKey)?.value;
  const displayValue = pendingValue ?? localValue;

  // Update local value when saved content loads
  useEffect(() => {
    if (!isLoading && savedValue !== resolvedDefaultValue) {
      setLocalValue(savedValue);
    }
  }, [savedValue, isLoading, resolvedDefaultValue]);

  // Update local value when pending changes update
  useEffect(() => {
    if (pendingValue) {
      setLocalValue(pendingValue);
    }
  }, [pendingValue]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditorMode) return;

    selectElement({
      id: changeKey,
      pageId,
      sectionId,
      contentKey,
      type: 'text',
      currentValue: displayValue,
      element: elementRef.current,
    });

    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateContent(pageId, sectionId, contentKey, localValue, 'text');
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalValue(pendingValue ?? resolvedDefaultValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleAIAssist = async (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAILoading(true);
    try {
      const response = await fetch('/api/admin/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: localValue,
          quickAction: action,
          contentType,
        }),
      });

      if (response.ok) {
        const { newContent } = await response.json();
        setLocalValue(newContent);
      }
    } catch (error) {
      console.error('AI assist failed:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  if (!isEditorMode) {
    return <Component className={className}>{displayValue}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={`${className} w-full bg-transparent border-2 border-jhr-gold rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-jhr-gold resize-y min-h-[100px]`}
            style={{ color: 'inherit', font: 'inherit' }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={`${className} w-full bg-transparent border-2 border-jhr-gold rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-jhr-gold`}
            style={{ color: 'inherit', font: 'inherit' }}
          />
        )}

        {/* Edit controls - stop propagation on container to prevent link navigation */}
        <div
          className="absolute -bottom-12 left-0 flex items-center gap-2 bg-jhr-black-light border border-jhr-gold/30 rounded-lg p-2 shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleSave}
            className="p-1.5 bg-green-600 hover:bg-green-500 rounded text-white"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 bg-red-600 hover:bg-red-500 rounded text-white"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-jhr-gold/30" />
          <button
            onClick={(e) => handleAIAssist(e, 'moreCompelling')}
            disabled={isAILoading}
            className="p-1.5 bg-jhr-gold/20 hover:bg-jhr-gold/40 rounded text-jhr-gold flex items-center gap-1 text-xs"
            title="Make more compelling"
          >
            <Sparkles className="w-4 h-4" />
            {isAILoading ? '...' : 'Improve'}
          </button>
          <button
            onClick={(e) => handleAIAssist(e, 'makeShorter')}
            disabled={isAILoading}
            className="p-1.5 bg-jhr-gold/20 hover:bg-jhr-gold/40 rounded text-jhr-gold text-xs"
            title="Make shorter"
          >
            Shorter
          </button>
          <button
            onClick={(e) => handleAIAssist(e, 'makeLonger')}
            disabled={isAILoading}
            className="p-1.5 bg-jhr-gold/20 hover:bg-jhr-gold/40 rounded text-jhr-gold text-xs"
            title="Make longer"
          >
            Longer
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      ref={elementRef as React.RefObject<HTMLParagraphElement>}
      className={`${className} relative cursor-pointer group`}
      onClick={handleClick}
    >
      {displayValue}
      {/* Edit indicator */}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-jhr-gold text-jhr-black p-1 rounded-full">
        <Pencil className="w-3 h-3" />
      </span>
      {/* Highlight border on hover */}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-jhr-gold/50 rounded pointer-events-none transition-colors" />
    </Component>
  );
}
