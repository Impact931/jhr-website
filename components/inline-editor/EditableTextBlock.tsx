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

// Blog content class uses the global CSS .blog-content styles defined in globals.css
// This ensures consistent styling in both edit mode (via Tiptap) and view mode (via dangerouslySetInnerHTML)
const BLOG_CONTENT_CLASSES = 'blog-content text-body-md';

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
