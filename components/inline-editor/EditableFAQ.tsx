'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import {
  Pencil,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Type,
  MessageSquare,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import type { FAQItem } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableFAQProps {
  /** Content key prefix for all FAQ fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Section heading. */
  heading?: string;
  /** FAQ items. */
  items: FAQItem[];
  /** Callback when items array changes (for parent state management). */
  onItemsChange?: (items: FAQItem[]) => void;
  /** Additional children rendered below the FAQ. */
  children?: ReactNode;
}

// ============================================================================
// Field Label Badge (edit mode overlay)
// ============================================================================

function FieldLabel({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded text-[10px] font-medium text-[#C9A227] uppercase tracking-wider pointer-events-none">
      {icon}
      {label}
    </span>
  );
}

// ============================================================================
// FAQ Schema Markup (JSON-LD)
// ============================================================================

function FAQSchemaMarkup({ items }: { items: FAQItem[] }) {
  if (items.length === 0) return null;

  // Strip HTML tags from answer for structured data
  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(item.answer),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================================
// FAQ Accordion Item (View Mode)
// ============================================================================

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="faq-item border-b border-[#2A2A2A]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 py-6"
        aria-expanded={isOpen}
      >
        <h3 className="text-heading-md font-semibold text-jhr-white">
          {item.question}
        </h3>
        <span
          className={`faq-icon-btn flex-shrink-0 w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-jhr-gold transition-all duration-300 ${
            isOpen ? 'rotate-45 bg-jhr-gold/10 border-jhr-gold/40' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="text-body-md text-jhr-white-dim leading-relaxed prose prose-invert prose-sm max-w-none [&_a]:text-jhr-gold [&_a]:underline [&_strong]:text-jhr-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// EditableFAQ Component
// ============================================================================

export function EditableFAQ({
  contentKeyPrefix,
  heading,
  items: initialItems,
  onItemsChange,
  children,
}: EditableFAQProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local FAQ state for add/remove/reorder
  const [items, setItems] = useState<FAQItem[]>(initialItems);

  // Sync local state when initialItems prop changes (e.g., when draft is loaded)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Accordion open state (for view mode)
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // Update items helper
  const updateItems = useCallback(
    (newItems: FAQItem[]) => {
      setItems(newItems);
      onItemsChange?.(newItems);
      // Serialize the full items array as a pending change
      updateContent(
        `${contentKeyPrefix}:items`,
        JSON.stringify(newItems),
        'text'
      );
    },
    [contentKeyPrefix, onItemsChange, updateContent]
  );

  // Add a new FAQ item
  const handleAddItem = useCallback(() => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'New Question?',
      answer: '<p>Provide a helpful answer here.</p>',
    };
    updateItems([...items, newItem]);
  }, [items, updateItems]);

  // Remove a FAQ item
  const handleRemoveItem = useCallback(
    (itemId: string) => {
      updateItems(items.filter((item) => item.id !== itemId));
    },
    [items, updateItems]
  );

  // Move an item up/down
  const handleMoveItem = useCallback(
    (itemId: string, direction: 'up' | 'down') => {
      const index = items.findIndex((item) => item.id === itemId);
      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === items.length - 1) return;

      const newItems = [...items];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
      updateItems(newItems);
    },
    [items, updateItems]
  );

  // Update a FAQ item's question
  const handleQuestionChange = useCallback(
    (itemId: string, value: string) => {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, question: value } : item
      );
      updateItems(newItems);
    },
    [items, updateItems]
  );

  // Update a FAQ item's answer
  const handleAnswerChange = useCallback(
    (itemId: string, value: string) => {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, answer: value } : item
      );
      updateItems(newItems);
    },
    [items, updateItems]
  );

  // Toggle accordion item
  const toggleItem = useCallback((itemId: string) => {
    setOpenItemId((prev) => (prev === itemId ? null : itemId));
  }, []);

  // Resolve pending heading
  const headingKey = `${contentKeyPrefix}:heading`;
  const displayHeading = pendingChanges.get(headingKey)?.newValue ?? heading;

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <div>
        {/* FAQ Schema Markup (JSON-LD) */}
        <FAQSchemaMarkup items={items} />

        {/* Heading */}
        {displayHeading && (
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4">
              {displayHeading}
            </h2>
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          {items.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openItemId === item.id}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        {children}
      </div>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <div className="relative group/faq">
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              FAQ Section
            </span>
          </div>
        )}

        {/* FAQ Schema Markup (JSON-LD) - also output in edit mode */}
        <FAQSchemaMarkup items={items} />

        {/* Heading - Editable */}
        <div className="text-center mb-12">
          {(displayHeading !== undefined || canEdit) && (
            <div className="mb-4 relative">
              {canEdit && (
                <div className="mb-1 flex justify-center">
                  <FieldLabel label="Heading (H2)" icon={<Type className="w-3 h-3" />} />
                </div>
              )}
              <EditableText
                contentKey={headingKey}
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white"
                placeholder="Enter FAQ heading..."
              >
                {displayHeading || ''}
              </EditableText>
            </div>
          )}
        </div>

        {/* FAQ Items Label */}
        {canEdit && (
          <div className="flex items-center justify-between mb-6">
            <FieldLabel label="FAQ Items" icon={<HelpCircle className="w-3 h-3" />} />
            <span className="text-xs text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}

        {/* FAQ Items - Editable */}
        <div className="max-w-4xl mx-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="faq-item border-b border-[#2A2A2A] relative group/item py-5"
            >
              {/* Item Controls */}
              {canEdit && (
                <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveItem(item.id, 'up')}
                    disabled={index === 0}
                    className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                    className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                    title="Remove FAQ item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Question - Editable */}
              <div className="mb-3">
                {canEdit && (
                  <div className="mb-1">
                    <FieldLabel label="Question (H3)" icon={<HelpCircle className="w-3 h-3" />} />
                  </div>
                )}
                <EditableText
                  contentKey={`${contentKeyPrefix}:faq-${item.id}-question`}
                  as="h3"
                  className="text-heading-md font-semibold text-jhr-white"
                  placeholder="Enter question..."
                >
                  {item.question}
                </EditableText>
              </div>

              {/* Answer - Editable (Rich Text) */}
              <div>
                {canEdit && (
                  <div className="mb-1">
                    <FieldLabel label="Answer (Rich Text)" icon={<MessageSquare className="w-3 h-3" />} />
                  </div>
                )}
                <EditableText
                  contentKey={`${contentKeyPrefix}:faq-${item.id}-answer`}
                  as="div"
                  className="text-body-md text-jhr-white-dim leading-relaxed"
                  placeholder="Enter answer..."
                  multiline
                >
                  {item.answer}
                </EditableText>
              </div>

              {/* Edit mode border */}
              {canEdit && (
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/item:border-[#C9A227]/40 rounded-xl pointer-events-none transition-colors" />
              )}
            </div>
          ))}

          {/* Add FAQ Item Button */}
          {canEdit && (
            <button
              onClick={handleAddItem}
              className="w-full min-h-[100px] rounded-xl border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-[#C9A227] transition-colors group/add"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] group-hover/add:bg-[#C9A227]/10 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Add FAQ Item</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && !canEdit && (
          <div className="text-center py-12 text-gray-500">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-body-md">No FAQ items yet.</p>
          </div>
        )}

        {/* Section border in edit mode */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 rounded-xl pointer-events-none group-hover/faq:border-[#C9A227]/40 transition-colors -m-4 p-4" />
        )}

        {children}
      </div>
    </>
  );
}
