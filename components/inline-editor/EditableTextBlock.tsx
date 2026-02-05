'use client';

import { EditableText } from './EditableText';

// ============================================================================
// Types
// ============================================================================

interface EditableTextBlockProps {
  /** Content key prefix (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** The text-block section data. */
  heading?: string;
  /** Rich text HTML content. */
  content: string;
}

// ============================================================================
// Blog/Page Content Styles
// These classes ensure proper rendering of rich text in BOTH view and edit modes.
// Headings use the Outfit display font; body text uses Inter.
// ============================================================================

const BLOG_CONTENT_CLASSES = [
  'text-body-md',
  'text-jhr-white-dim',
  'space-y-4',
  // Paragraphs
  '[&>p]:mb-4',
  '[&>p]:leading-relaxed',
  // H2 - Section headings (critical for SEO)
  '[&>h2]:font-[Outfit,sans-serif]',
  '[&>h2]:text-3xl',
  '[&>h2]:font-semibold',
  '[&>h2]:text-white',
  '[&>h2]:mt-8',
  '[&>h2]:mb-4',
  // H3 - Subsection headings
  '[&>h3]:font-[Outfit,sans-serif]',
  '[&>h3]:text-2xl',
  '[&>h3]:font-semibold',
  '[&>h3]:text-white',
  '[&>h3]:mt-6',
  '[&>h3]:mb-3',
  // H4 - Minor headings
  '[&>h4]:font-[Inter,sans-serif]',
  '[&>h4]:text-xl',
  '[&>h4]:font-medium',
  '[&>h4]:text-white',
  '[&>h4]:mt-4',
  '[&>h4]:mb-2',
  // Lists
  '[&>ul]:list-disc',
  '[&>ul]:pl-6',
  '[&>ul]:mb-4',
  '[&>ol]:list-decimal',
  '[&>ol]:pl-6',
  '[&>ol]:mb-4',
  '[&_li]:mb-2',
  // Blockquotes
  '[&>blockquote]:border-l-4',
  '[&>blockquote]:border-jhr-gold',
  '[&>blockquote]:pl-4',
  '[&>blockquote]:italic',
  '[&>blockquote]:text-gray-400',
  // Links
  '[&_a]:text-jhr-gold',
  '[&_a]:hover:underline',
  // Bold text
  '[&_strong]:text-white',
  '[&_strong]:font-semibold',
  // Code
  '[&_code]:text-jhr-gold',
  '[&_code]:bg-white/5',
  '[&_code]:px-1',
  '[&_code]:rounded',
].join(' ');

// ============================================================================
// EditableTextBlock Component
// Renders a text-block section using EditableText for both view and edit mode.
// ============================================================================

export function EditableTextBlock({
  contentKeyPrefix,
  heading,
  content,
}: EditableTextBlockProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {heading !== undefined && (
        <EditableText
          contentKey={`${contentKeyPrefix}:heading`}
          as="h2"
          className="text-display-sm font-display font-bold text-jhr-white mb-6"
          placeholder="Enter heading..."
        >
          {heading}
        </EditableText>
      )}
      <EditableText
        contentKey={`${contentKeyPrefix}:content`}
        as="div"
        className={BLOG_CONTENT_CLASSES}
        variant="rich"
        placeholder="Enter content..."
      >
        {content}
      </EditableText>
    </div>
  );
}
