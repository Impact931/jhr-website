/**
 * Tiptap Editor Configuration
 *
 * Centralized configuration for Tiptap rich text editor instances
 * used throughout the inline CMS editor.
 *
 * Extensions included:
 * - StarterKit (heading, bold, italic, strike, code, lists, blockquote, etc.)
 * - Link (with auto-link detection)
 * - Image (for inline image embedding)
 * - Underline (text decoration)
 * - Placeholder (placeholder text for empty editors)
 *
 * Font configuration:
 * - Display font: Outfit (h1-h3, hero text)
 * - Body font: Inter (paragraphs, general content)
 *
 * Heading hierarchy for SEO:
 * - h1: Page title (one per page, used in Hero sections)
 * - h2: Section headings
 * - h3: Subsection headings
 * - h4: Card/feature titles
 * - h5-h6: Minor headings
 */

import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import type { Extensions } from '@tiptap/core';

/**
 * Custom FontSize extension — adds fontSize attribute to TextStyle mark.
 */
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

/**
 * Custom FontWeight extension — adds fontWeight attribute to TextStyle mark.
 */
const FontWeight = Extension.create({
  name: 'fontWeight',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight || null,
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) return {};
              return { style: `font-weight: ${attributes.fontWeight}` };
            },
          },
        },
      },
    ];
  },
});

// ============================================================================
// Font Configuration
// ============================================================================

/**
 * Font family definitions for the JHR brand.
 * Display font (Outfit) is used for headlines and hero text.
 * Body font (Inter) is used for paragraphs and general content.
 */
export const JHR_FONTS = {
  display: {
    name: 'Outfit',
    label: 'Outfit (Display)',
    value: 'Outfit, sans-serif',
    description: 'Used for headlines, hero text, and display elements',
  },
  body: {
    name: 'Inter',
    label: 'Inter (Body)',
    value: 'Inter, sans-serif',
    description: 'Used for paragraphs, body text, and general content',
  },
} as const;

/**
 * All available font families as an array for toolbar dropdowns.
 * Includes brand fonts, popular Google Fonts, and web-safe system fonts.
 */
export const FONT_FAMILIES = [
  JHR_FONTS.display,
  JHR_FONTS.body,
  { name: 'Roboto', label: 'Roboto', value: 'Roboto, sans-serif', description: 'Google — clean and modern' },
  { name: 'Open Sans', label: 'Open Sans', value: '"Open Sans", sans-serif', description: 'Google — friendly and readable' },
  { name: 'Lato', label: 'Lato', value: 'Lato, sans-serif', description: 'Google — warm and stable' },
  { name: 'Montserrat', label: 'Montserrat', value: 'Montserrat, sans-serif', description: 'Google — geometric display' },
  { name: 'Playfair Display', label: 'Playfair Display', value: '"Playfair Display", serif', description: 'Google — elegant serif' },
  { name: 'Merriweather', label: 'Merriweather', value: 'Merriweather, serif', description: 'Google — readable serif' },
  { name: 'Poppins', label: 'Poppins', value: 'Poppins, sans-serif', description: 'Google — geometric sans' },
  { name: 'Raleway', label: 'Raleway', value: 'Raleway, sans-serif', description: 'Google — elegant thin' },
  { name: 'Georgia', label: 'Georgia', value: 'Georgia, serif', description: 'System — classic serif' },
  { name: 'Arial', label: 'Arial', value: 'Arial, Helvetica, sans-serif', description: 'System — universal sans' },
  { name: 'Times New Roman', label: 'Times New Roman', value: '"Times New Roman", Times, serif', description: 'System — traditional serif' },
];

/**
 * Available font weights with labels for toolbar dropdowns.
 */
export const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
] as const;

/**
 * Available font sizes for the toolbar dropdown.
 */
export const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '42px', value: '42px' },
  { label: '48px', value: '48px' },
  { label: '56px', value: '56px' },
  { label: '64px', value: '64px' },
  { label: '72px', value: '72px' },
] as const;

// ============================================================================
// Heading Configuration
// ============================================================================

/**
 * Heading level configuration with proper semantic HTML output.
 * Maps to toolbar heading dropdown options.
 */
export const HEADING_LEVELS = [
  { level: 1 as const, label: 'Heading 1', tag: 'h1', fontFamily: JHR_FONTS.display.value, description: 'Page title (one per page)' },
  { level: 2 as const, label: 'Heading 2', tag: 'h2', fontFamily: JHR_FONTS.display.value, description: 'Section heading' },
  { level: 3 as const, label: 'Heading 3', tag: 'h3', fontFamily: JHR_FONTS.display.value, description: 'Subsection heading' },
  { level: 4 as const, label: 'Heading 4', tag: 'h4', fontFamily: JHR_FONTS.body.value, description: 'Card/feature title' },
  { level: 5 as const, label: 'Heading 5', tag: 'h5', fontFamily: JHR_FONTS.body.value, description: 'Minor heading' },
  { level: 6 as const, label: 'Heading 6', tag: 'h6', fontFamily: JHR_FONTS.body.value, description: 'Minor heading' },
] as const;

/**
 * Paragraph option for the heading dropdown.
 */
export const PARAGRAPH_OPTION = {
  level: 0 as const,
  label: 'Paragraph',
  tag: 'p',
  fontFamily: JHR_FONTS.body.value,
  description: 'Normal body text',
};

// ============================================================================
// Text Alignment Options
// ============================================================================

/**
 * Text alignment options for the toolbar.
 */
export const TEXT_ALIGNMENTS = [
  { value: 'left' as const, label: 'Align Left', icon: 'AlignLeft' },
  { value: 'center' as const, label: 'Align Center', icon: 'AlignCenter' },
  { value: 'right' as const, label: 'Align Right', icon: 'AlignRight' },
] as const;

// ============================================================================
// Extension Builders
// ============================================================================

/**
 * Configuration options for creating a Tiptap editor instance.
 */
export interface TiptapEditorConfig {
  /** Placeholder text shown when editor is empty. */
  placeholder?: string;
  /** Whether to allow heading level 1 (typically only in hero sections). */
  allowH1?: boolean;
  /** Whether to include image support. */
  enableImages?: boolean;
  /** Whether to include link support. */
  enableLinks?: boolean;
  /** Initial HTML content. */
  content?: string;
}

/**
 * Creates the default set of Tiptap extensions for the inline editor.
 * Configures heading levels h1-h6 with proper HTML output.
 *
 * @param config - Editor configuration options
 * @returns Array of configured Tiptap extensions
 */
export function createEditorExtensions(config: TiptapEditorConfig = {}): Extensions {
  const {
    placeholder = 'Start typing...',
    allowH1 = false,
    enableImages = true,
    enableLinks = true,
  } = config;

  // Determine allowed heading levels
  const headingLevels: (1 | 2 | 3 | 4 | 5 | 6)[] = allowH1
    ? [1, 2, 3, 4, 5, 6]
    : [2, 3, 4, 5, 6];

  const extensions: Extensions = [
    // StarterKit includes: Document, Paragraph, Text, Bold, Italic, Strike,
    // Code, CodeBlock, Heading, BulletList, OrderedList, ListItem,
    // Blockquote, HardBreak, HorizontalRule, History (undo/redo), Dropcursor, Gapcursor
    StarterKit.configure({
      heading: {
        levels: headingLevels,
        HTMLAttributes: {
          class: 'tiptap-heading',
        },
      },
      paragraph: {
        HTMLAttributes: {
          class: 'tiptap-paragraph',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: 'tiptap-blockquote',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'tiptap-code-block',
        },
      },
    }),

    // Underline text decoration
    Underline,

    // TextStyle mark (required for font-family and font-weight)
    TextStyle,

    // Font family support
    FontFamily,

    // Font size support
    FontSize,

    // Font weight support
    FontWeight,

    // Text alignment (left, center, right)
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),

    // Placeholder text
    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),
  ];

  // Link extension (optional)
  if (enableLinks) {
    extensions.push(
      Link.configure({
        openOnClick: false, // Don't open links while editing
        HTMLAttributes: {
          class: 'tiptap-link',
          rel: 'noopener noreferrer',
        },
      })
    );
  }

  // Image extension (optional)
  if (enableImages) {
    extensions.push(
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      })
    );
  }

  return extensions;
}

/**
 * Creates extensions configured for hero section editing.
 * Allows h1 and includes all formatting options.
 */
export function createHeroEditorExtensions(placeholder?: string): Extensions {
  return createEditorExtensions({
    placeholder: placeholder || 'Enter headline...',
    allowH1: true,
    enableImages: false,
    enableLinks: true,
  });
}

/**
 * Creates extensions configured for rich text content blocks.
 * Standard configuration with h2-h6, images, and links.
 */
export function createContentEditorExtensions(placeholder?: string): Extensions {
  return createEditorExtensions({
    placeholder: placeholder || 'Start typing...',
    allowH1: false,
    enableImages: true,
    enableLinks: true,
  });
}

/**
 * Creates extensions for simple text editing (no images, no headings).
 * Used for descriptions, captions, and short text fields.
 */
export function createSimpleEditorExtensions(placeholder?: string): Extensions {
  return createEditorExtensions({
    placeholder: placeholder || 'Enter text...',
    allowH1: false,
    enableImages: false,
    enableLinks: true,
  });
}

// ============================================================================
// Editor CSS Classes (for Tailwind styling)
// ============================================================================

/**
 * CSS class names for Tiptap editor styling.
 * Apply these to the editor container for consistent styling.
 */
export const EDITOR_CLASSES = {
  /** Base editor container class */
  container: 'tiptap-editor',
  /** Prose styling for the editor content area */
  prose: [
    'prose',
    'prose-invert',
    'max-w-none',
    // Headings
    'prose-headings:text-white',
    'prose-headings:font-semibold',
    'prose-h1:font-[Outfit] prose-h1:text-4xl prose-h1:font-bold',
    'prose-h2:font-[Outfit] prose-h2:text-3xl prose-h2:font-semibold',
    'prose-h3:font-[Outfit] prose-h3:text-2xl prose-h3:font-semibold',
    'prose-h4:text-xl prose-h4:font-medium',
    'prose-h5:text-lg prose-h5:font-medium',
    'prose-h6:text-base prose-h6:font-medium',
    // Body text
    'prose-p:text-gray-300 prose-p:font-[Inter]',
    // Links
    'prose-a:text-jhr-gold prose-a:no-underline hover:prose-a:underline',
    // Lists
    'prose-ul:text-gray-300',
    'prose-ol:text-gray-300',
    'prose-li:text-gray-300',
    // Blockquote
    'prose-blockquote:border-jhr-gold prose-blockquote:text-gray-400',
    // Code
    'prose-code:text-jhr-gold prose-code:bg-white/5 prose-code:px-1 prose-code:rounded',
    // Images
    'prose-img:rounded-lg prose-img:max-w-full',
    // Horizontal rule
    'prose-hr:border-gray-700',
  ].join(' '),
  /** Focused editor state */
  focused: 'ring-2 ring-jhr-gold/50 ring-offset-2 ring-offset-[#0A0A0A]',
  /** Editing state border */
  editing: 'outline-2 outline-solid outline-jhr-gold outline-offset-4',
  /** Hover state border (in edit mode) */
  editable: 'outline-2 outline-dashed outline-transparent hover:outline-jhr-gold/40 outline-offset-4 transition-all cursor-text',
} as const;

/**
 * Global CSS for Tiptap editor elements.
 * Include this in a style tag or CSS file for proper editor rendering.
 */
export const EDITOR_GLOBAL_STYLES = `
  /* Tiptap editor placeholder */
  .tiptap .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #6b7280;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }

  /* Tiptap heading font families and sizes */
  .tiptap h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 2.25rem;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 0.5em;
  }
  .tiptap h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.875rem;
    line-height: 1.25;
    font-weight: 600;
    margin-bottom: 0.5em;
  }
  .tiptap h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 600;
    margin-bottom: 0.5em;
  }
  .tiptap h4 {
    font-family: 'Inter', sans-serif;
    font-size: 1.25rem;
    line-height: 1.4;
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  .tiptap h5 {
    font-family: 'Inter', sans-serif;
    font-size: 1.125rem;
    line-height: 1.4;
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  .tiptap h6 {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  .tiptap p {
    font-family: 'Inter', sans-serif;
  }

  /* Tiptap link styling */
  .tiptap-link {
    color: #C9A227;
    text-decoration: none;
    cursor: pointer;
  }
  .tiptap-link:hover {
    text-decoration: underline;
  }

  /* Tiptap image styling */
  .tiptap-image {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  /* Tiptap blockquote */
  .tiptap-blockquote {
    border-left: 3px solid #C9A227;
    padding-left: 1rem;
    color: #9ca3af;
    font-style: italic;
  }

  /* Tiptap code block */
  .tiptap-code-block {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    font-family: monospace;
    font-size: 0.875rem;
  }

  /* Tiptap list styling */
  .tiptap-bullet-list {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  .tiptap-ordered-list {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }

  /* Focus styles for editable content */
  .tiptap:focus {
    outline: none;
  }

  /* Text alignment classes */
  .tiptap [style*="text-align: center"] { text-align: center; }
  .tiptap [style*="text-align: right"] { text-align: right; }
  .tiptap [style*="text-align: left"] { text-align: left; }
`;

// ============================================================================
// Formatting Actions (for toolbar buttons)
// ============================================================================

/**
 * Available inline formatting actions.
 * Used by FloatingToolbar to render formatting buttons.
 */
export const INLINE_FORMATS = [
  { id: 'bold', label: 'Bold', icon: 'Bold', shortcut: 'Cmd+B', mark: 'bold' },
  { id: 'italic', label: 'Italic', icon: 'Italic', shortcut: 'Cmd+I', mark: 'italic' },
  { id: 'underline', label: 'Underline', icon: 'Underline', shortcut: 'Cmd+U', mark: 'underline' },
  { id: 'strike', label: 'Strikethrough', icon: 'Strikethrough', shortcut: 'Cmd+Shift+S', mark: 'strike' },
  { id: 'code', label: 'Inline Code', icon: 'Code', shortcut: 'Cmd+E', mark: 'code' },
] as const;

/**
 * Available block formatting actions.
 * Used by FloatingToolbar for block-level formatting.
 */
export const BLOCK_FORMATS = [
  { id: 'bulletList', label: 'Bullet List', icon: 'List', shortcut: 'Cmd+Shift+8', node: 'bulletList' },
  { id: 'orderedList', label: 'Numbered List', icon: 'ListOrdered', shortcut: 'Cmd+Shift+7', node: 'orderedList' },
  { id: 'blockquote', label: 'Blockquote', icon: 'Quote', shortcut: 'Cmd+Shift+B', node: 'blockquote' },
  { id: 'codeBlock', label: 'Code Block', icon: 'FileCode', shortcut: 'Cmd+Alt+C', node: 'codeBlock' },
] as const;
