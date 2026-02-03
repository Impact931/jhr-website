'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ChevronDown,
  Check,
  X,
  Type,
} from 'lucide-react';
import {
  INLINE_FORMATS,
  BLOCK_FORMATS,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_SIZES,
  HEADING_LEVELS,
  PARAGRAPH_OPTION,
  TEXT_ALIGNMENTS,
} from '@/lib/tiptap-config';
import { getShortcutLabel } from './KeyboardShortcuts';

// ============================================================================
// Types
// ============================================================================

interface FloatingToolbarProps {
  /** The Tiptap editor instance. */
  editor: Editor | null;
  /** Whether the toolbar should be visible. */
  visible?: boolean;
}

type DropdownType = 'heading' | 'font' | 'weight' | 'size' | null;

// ============================================================================
// Icon Mapping
// ============================================================================

/** Maps Lucide icon names (from tiptap-config) to components. */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
};

// ============================================================================
// Sub-components
// ============================================================================

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-600 mx-1" />;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      title={title}
      className={`
        p-1.5 sm:p-1.5 rounded transition-colors min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center touch-manipulation
        ${active
          ? 'bg-jhr-gold/20 text-jhr-gold'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {children}
    </button>
  );
}

interface DropdownButtonProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  width?: string;
}

function DropdownButton({ label, isOpen, onClick, width = 'w-28' }: DropdownButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={`
        flex items-center gap-1 px-2 py-1.5 rounded text-sm transition-colors ${width} min-h-[44px] sm:min-h-[32px] touch-manipulation
        ${isOpen
          ? 'bg-jhr-gold/20 text-jhr-gold'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <span className="truncate flex-1 text-left">{label}</span>
      <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

// ============================================================================
// FloatingToolbar Component
// ============================================================================

export function FloatingToolbar({ editor, visible = true }: FloatingToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // --- Draggable position state ---
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setShowLinkInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial position when toolbar becomes visible
  useEffect(() => {
    if (!editor || !visible) return;
    // Only set initial position if user hasn't dragged yet
    if (dragPos) return;

    const setInitial = () => {
      const toolbarWidth = toolbarRef.current?.offsetWidth || 700;
      const x = Math.max(8, (window.innerWidth - toolbarWidth) / 2);
      // Place near top of viewport
      const y = 80;
      setDragPos({ x, y });
    };

    // Delay to let toolbar render and get its width
    const timer = setTimeout(setInitial, 50);
    return () => clearTimeout(timer);
  }, [editor, visible, dragPos]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Only allow dragging from the drag handle, not buttons
    if ((e.target as HTMLElement).closest('button, input, [data-no-drag]')) return;
    isDragging.current = true;
    const rect = toolbarRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const x = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - (toolbarRef.current?.offsetWidth || 0)));
      const y = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - (toolbarRef.current?.offsetHeight || 0)));
      setDragPos({ x, y });
    };
    const handleMouseUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Focus link input when opened
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
      // Pre-fill with existing link URL
      if (editor) {
        const existingHref = editor.getAttributes('link').href;
        if (existingHref) {
          setLinkUrl(existingHref);
        }
      }
    }
  }, [showLinkInput, editor]);

  // Toggle dropdown
  const toggleDropdown = useCallback((dropdown: DropdownType) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
    setShowLinkInput(false);
  }, []);

  // ---- Inline Formatting ----
  const handleInlineFormat = useCallback(
    (mark: string) => {
      if (!editor) return;
      switch (mark) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'strike':
          editor.chain().focus().toggleStrike().run();
          break;
        case 'code':
          editor.chain().focus().toggleCode().run();
          break;
      }
    },
    [editor]
  );

  // ---- Block Formatting ----
  const handleBlockFormat = useCallback(
    (node: string) => {
      if (!editor) return;
      switch (node) {
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'blockquote':
          editor.chain().focus().toggleBlockquote().run();
          break;
        case 'codeBlock':
          editor.chain().focus().toggleCodeBlock().run();
          break;
      }
    },
    [editor]
  );

  // ---- Heading / Paragraph ----
  const handleHeading = useCallback(
    (level: number) => {
      if (!editor) return;
      if (level === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
          .run();
      }
      setActiveDropdown(null);
    },
    [editor]
  );

  // ---- Font Family ----
  const handleFontFamily = useCallback(
    (fontValue: string) => {
      if (!editor) return;
      editor.chain().focus().setFontFamily(fontValue).run();
      setActiveDropdown(null);
    },
    [editor]
  );

  // ---- Font Weight ----
  const handleFontWeight = useCallback(
    (weight: string) => {
      if (!editor) return;
      // Apply font weight via inline style using TextStyle mark
      // Tiptap's TextStyle extension supports arbitrary style attributes
      editor.chain().focus().setMark('textStyle', { fontWeight: weight }).run();
      setActiveDropdown(null);
    },
    [editor]
  );

  // ---- Font Size ----
  const handleFontSize = useCallback(
    (size: string) => {
      if (!editor) return;
      editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
      setActiveDropdown(null);
    },
    [editor]
  );

  // ---- Text Alignment ----
  const handleAlignment = useCallback(
    (alignment: string) => {
      if (!editor) return;
      editor.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  // ---- Link ----
  const handleLinkToggle = useCallback(() => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
      setLinkUrl('');
      setActiveDropdown(null);
    }
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor || !linkUrl) return;
    const url = linkUrl.startsWith('http') || linkUrl.startsWith('/')
      ? linkUrl
      : `https://${linkUrl}`;
    editor.chain().focus().setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleLinkKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLinkSubmit();
      } else if (e.key === 'Escape') {
        setShowLinkInput(false);
        setLinkUrl('');
        editor?.chain().focus().run();
      }
    },
    [handleLinkSubmit, editor]
  );

  // ---- Helpers ----

  /** Get current heading level label. */
  const getHeadingLabel = (): string => {
    if (!editor) return PARAGRAPH_OPTION.label;
    for (const h of HEADING_LEVELS) {
      if (editor.isActive('heading', { level: h.level })) {
        return h.label;
      }
    }
    return PARAGRAPH_OPTION.label;
  };

  /** Get current font family label. */
  const getFontLabel = (): string => {
    if (!editor) return 'Font';
    const attrs = editor.getAttributes('textStyle');
    const currentFont = attrs?.fontFamily as string | undefined;
    if (currentFont) {
      const match = FONT_FAMILIES.find((f) => f.value === currentFont);
      if (match) return match.name;
    }
    return 'Font';
  };

  /** Get current font weight label. */
  const getWeightLabel = (): string => {
    if (!editor) return 'Weight';
    const attrs = editor.getAttributes('textStyle');
    const currentWeight = attrs?.fontWeight as string | undefined;
    if (currentWeight) {
      const match = FONT_WEIGHTS.find((w) => w.value === currentWeight);
      if (match) return match.label;
    }
    return 'Weight';
  };

  /** Get current font size label. */
  const getSizeLabel = (): string => {
    if (!editor) return 'Size';
    const attrs = editor.getAttributes('textStyle');
    const currentSize = attrs?.fontSize as string | undefined;
    if (currentSize) {
      const match = FONT_SIZES.find((s) => s.value === currentSize);
      if (match) return match.label;
      return currentSize;
    }
    return 'Size';
  };

  // Don't render if no editor or not visible
  if (!editor || !visible) return null;

  // Determine if dropdowns should open upward (toolbar is in lower half of viewport)
  const opensUp = dragPos ? dragPos.y > window.innerHeight / 2 : true;
  const dropdownPositionClass = opensUp
    ? 'bottom-full mb-1'
    : 'top-full mt-1';

  return (
    <div
      ref={toolbarRef}
      onMouseDown={(e) => {
        // Prevent editor blur for toolbar interactions
        const target = e.target as HTMLElement;
        if (!target.closest('input')) e.preventDefault();
        // Start drag
        handleDragStart(e);
      }}
      className="fixed z-[100]"
      style={
        dragPos
          ? { left: dragPos.x, top: dragPos.y, cursor: 'default' }
          : { left: 0, top: 80, visibility: 'hidden' as const }
      }
    >
      <div className="flex items-center gap-0.5 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-2xl shadow-black/50 px-1.5 py-1 sm:flex-wrap max-w-[calc(100vw-16px)]">
        {/* Drag handle */}
        <div
          className="flex items-center justify-center w-5 h-8 cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 flex-shrink-0 select-none"
          title="Drag to move toolbar"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
            <circle cx="2" cy="2" r="1.5" /><circle cx="8" cy="2" r="1.5" />
            <circle cx="2" cy="8" r="1.5" /><circle cx="8" cy="8" r="1.5" />
            <circle cx="2" cy="14" r="1.5" /><circle cx="8" cy="14" r="1.5" />
          </svg>
        </div>
        {/* ---- Heading Dropdown ---- */}
        <div className="relative">
          <DropdownButton
            label={getHeadingLabel()}
            isOpen={activeDropdown === 'heading'}
            onClick={() => toggleDropdown('heading')}
            width="w-32"
          />
          {activeDropdown === 'heading' && (
            <div className={`absolute ${dropdownPositionClass} left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[200px] z-10`}>
              {/* Paragraph option */}
              <button
                type="button"
                onClick={() => handleHeading(PARAGRAPH_OPTION.level)}
                className={`
                  w-full text-left px-3 py-3 sm:py-2 text-sm flex items-center justify-between transition-colors min-h-[44px] touch-manipulation
                  ${!editor.isActive('heading') ? 'text-jhr-gold bg-jhr-gold/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
                `}
              >
                <span>
                  <span className="font-medium">{PARAGRAPH_OPTION.label}</span>
                  <span className="text-gray-500 ml-2 text-xs">{PARAGRAPH_OPTION.description}</span>
                </span>
                {!editor.isActive('heading') && <Check className="w-4 h-4 text-jhr-gold" />}
              </button>
              {/* Heading options (H1-H4) */}
              {HEADING_LEVELS.slice(0, 4).map((h) => (
                <button
                  key={h.level}
                  type="button"
                  onClick={() => handleHeading(h.level)}
                  className={`
                    w-full text-left px-3 py-3 sm:py-2 text-sm flex items-center justify-between transition-colors min-h-[44px] touch-manipulation
                    ${editor.isActive('heading', { level: h.level })
                      ? 'text-jhr-gold bg-jhr-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>
                    <span className="font-medium" style={{ fontFamily: h.fontFamily }}>
                      {h.label}
                    </span>
                    <span className="text-gray-500 ml-2 text-xs">{h.description}</span>
                  </span>
                  {editor.isActive('heading', { level: h.level }) && (
                    <Check className="w-4 h-4 text-jhr-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* ---- Font Family Dropdown ---- */}
        <div className="relative">
          <DropdownButton
            label={getFontLabel()}
            isOpen={activeDropdown === 'font'}
            onClick={() => toggleDropdown('font')}
            width="w-24"
          />
          {activeDropdown === 'font' && (
            <div className={`absolute ${dropdownPositionClass} left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[220px] z-10 max-h-72 overflow-y-auto`}>
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => handleFontFamily(font.value)}
                  className={`
                    w-full text-left px-3 py-3 sm:py-2 text-sm flex items-center justify-between transition-colors min-h-[44px] touch-manipulation
                    ${editor.getAttributes('textStyle')?.fontFamily === font.value
                      ? 'text-jhr-gold bg-jhr-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                  {editor.getAttributes('textStyle')?.fontFamily === font.value && (
                    <Check className="w-4 h-4 text-jhr-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Font Weight Dropdown ---- */}
        <div className="relative">
          <DropdownButton
            label={getWeightLabel()}
            isOpen={activeDropdown === 'weight'}
            onClick={() => toggleDropdown('weight')}
            width="w-24"
          />
          {activeDropdown === 'weight' && (
            <div className={`absolute ${dropdownPositionClass} left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[160px] z-10`}>
              {FONT_WEIGHTS.map((w) => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => handleFontWeight(w.value)}
                  className={`
                    w-full text-left px-3 py-3 sm:py-2 text-sm flex items-center justify-between transition-colors min-h-[44px] touch-manipulation
                    ${editor.getAttributes('textStyle')?.fontWeight === w.value
                      ? 'text-jhr-gold bg-jhr-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span style={{ fontWeight: w.value }}>{w.label}</span>
                  {editor.getAttributes('textStyle')?.fontWeight === w.value && (
                    <Check className="w-4 h-4 text-jhr-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Font Size Dropdown ---- */}
        <div className="relative">
          <DropdownButton
            label={getSizeLabel()}
            isOpen={activeDropdown === 'size'}
            onClick={() => toggleDropdown('size')}
            width="w-20"
          />
          {activeDropdown === 'size' && (
            <div className={`absolute ${dropdownPositionClass} left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[120px] z-10 max-h-64 overflow-y-auto`}>
              {FONT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleFontSize(s.value)}
                  className={`
                    w-full text-left px-3 py-3 sm:py-2 text-sm flex items-center justify-between transition-colors min-h-[44px] touch-manipulation
                    ${editor.getAttributes('textStyle')?.fontSize === s.value
                      ? 'text-jhr-gold bg-jhr-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{s.label}</span>
                  {editor.getAttributes('textStyle')?.fontSize === s.value && (
                    <Check className="w-4 h-4 text-jhr-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* ---- Inline Formatting: Bold, Italic, Underline, Strikethrough ---- */}
        {INLINE_FORMATS.slice(0, 4).map((fmt) => {
          const IconComponent = ICON_MAP[fmt.icon];
          const shortcutLabel = getShortcutLabel(fmt.id) || fmt.shortcut;
          return (
            <ToolbarButton
              key={fmt.id}
              onClick={() => handleInlineFormat(fmt.mark)}
              active={editor.isActive(fmt.mark)}
              title={`${fmt.label} (${shortcutLabel})`}
            >
              {IconComponent ? <IconComponent className="w-4 h-4" /> : <span className="text-xs">{fmt.label}</span>}
            </ToolbarButton>
          );
        })}

        <ToolbarDivider />

        {/* ---- Text Alignment ---- */}
        {TEXT_ALIGNMENTS.map((align) => {
          const IconComponent = ICON_MAP[align.icon];
          return (
            <ToolbarButton
              key={align.value}
              onClick={() => handleAlignment(align.value)}
              active={editor.isActive({ textAlign: align.value })}
              title={align.label}
            >
              {IconComponent ? <IconComponent className="w-4 h-4" /> : <span className="text-xs">{align.value}</span>}
            </ToolbarButton>
          );
        })}

        <ToolbarDivider />

        {/* ---- Lists: Bullet, Numbered ---- */}
        {BLOCK_FORMATS.slice(0, 2).map((fmt) => {
          const IconComponent = ICON_MAP[fmt.icon];
          return (
            <ToolbarButton
              key={fmt.id}
              onClick={() => handleBlockFormat(fmt.node)}
              active={editor.isActive(fmt.node)}
              title={`${fmt.label} (${fmt.shortcut})`}
            >
              {IconComponent ? <IconComponent className="w-4 h-4" /> : <span className="text-xs">{fmt.label}</span>}
            </ToolbarButton>
          );
        })}

        <ToolbarDivider />

        {/* ---- Link Button ---- */}
        <ToolbarButton
          onClick={handleLinkToggle}
          active={editor.isActive('link')}
          title={`Insert Link (${getShortcutLabel('link')})`}
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* ---- Link URL Input ---- */}
        {showLinkInput && (
          <div className="flex items-center gap-1 ml-1 bg-[#0A0A0A] rounded px-2 py-1 border border-gray-600 shrink-0">
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleLinkKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Enter URL..."
              className="bg-transparent text-white text-sm w-36 sm:w-48 outline-none placeholder:text-gray-500"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <button
              type="button"
              onClick={handleLinkSubmit}
              disabled={!linkUrl}
              className="p-2 min-w-[44px] min-h-[44px] sm:p-1 sm:min-w-0 sm:min-h-0 text-jhr-gold hover:text-jhr-gold/80 disabled:text-gray-600 transition-colors flex items-center justify-center touch-manipulation"
              title="Apply link"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
                editor.chain().focus().run();
              }}
              className="p-2 min-w-[44px] min-h-[44px] sm:p-1 sm:min-w-0 sm:min-h-0 text-gray-400 hover:text-white transition-colors flex items-center justify-center touch-manipulation"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
