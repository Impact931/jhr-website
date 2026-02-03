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
        className="text-body-md text-jhr-white-dim space-y-4 [&>p]:mb-4"
        variant="rich"
        placeholder="Enter content..."
      >
        {content}
      </EditableText>
    </div>
  );
}
