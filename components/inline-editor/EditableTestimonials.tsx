'use client';

import { useState, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import SmartImage from '@/components/ui/SmartImage';
import {
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Quote,
  Type,
  User,
  Camera,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import type { Testimonial, TestimonialLayout } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableTestimonialsProps {
  /** Content key prefix for all testimonial fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Section heading. */
  heading?: string;
  /** Display layout. */
  layout?: TestimonialLayout;
  /** Testimonial entries. */
  testimonials: Testimonial[];
  /** Callback when testimonials array changes. */
  onTestimonialsChange?: (testimonials: Testimonial[]) => void;
  /** Callback when layout changes. */
  onLayoutChange?: (layout: TestimonialLayout) => void;
  /** Additional children rendered below. */
  children?: ReactNode;
}

// ============================================================================
// Layout Selector
// ============================================================================

function LayoutSelector({
  layout,
  onChange,
}: {
  layout: TestimonialLayout;
  onChange: (l: TestimonialLayout) => void;
}) {
  const options: { value: TestimonialLayout; label: string }[] = [
    { value: 'single', label: 'Single' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'grid', label: 'Grid' },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Layout:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${layout === opt.value
              ? 'bg-[#C9A227] text-black'
              : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Testimonial Editor Modal
// ============================================================================

interface TestimonialEditorProps {
  testimonial: Testimonial;
  onSave: (updated: Testimonial) => void;
  onClose: () => void;
}

function TestimonialEditor({ testimonial, onSave, onClose }: TestimonialEditorProps) {
  const [quote, setQuote] = useState(testimonial.quote);
  const [authorName, setAuthorName] = useState(testimonial.authorName);
  const [authorTitle, setAuthorTitle] = useState(testimonial.authorTitle);
  const [authorImageSrc, setAuthorImageSrc] = useState(testimonial.authorImage?.src || '');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = useCallback(() => {
    const updated: Testimonial = {
      ...testimonial,
      quote,
      authorName,
      authorTitle,
      authorImage: authorImageSrc
        ? { src: authorImageSrc, alt: authorName }
        : undefined,
    };
    onSave(updated);
  }, [testimonial, quote, authorName, authorTitle, authorImageSrc, onSave]);

  const handleMediaSelect = useCallback((results: MediaPickerResult[]) => {
    if (results.length > 0) {
      setAuthorImageSrc(results[0].publicUrl);
    }
    setShowMediaPicker(false);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Edit Testimonial
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Quote */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Quote <span className="text-gray-600">({quote.length}/500)</span>
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value.slice(0, 500))}
              rows={4}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
              placeholder="Enter testimonial quote..."
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Author Name <span className="text-gray-600">({authorName.length}/60)</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value.slice(0, 60))}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Client name..."
            />
          </div>

          {/* Author Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Author Title / Role <span className="text-gray-600">({authorTitle.length}/80)</span>
            </label>
            <input
              type="text"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value.slice(0, 80))}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Position, Company..."
            />
          </div>

          {/* Author Image */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Author Photo</label>
            {authorImageSrc ? (
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#333]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={authorImageSrc}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMediaPicker(true)}
                    className="px-3 py-1.5 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => setAuthorImageSrc('')}
                    className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowMediaPicker(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors text-sm"
              >
                <Camera className="w-4 h-4" />
                Choose Photo
              </button>
            )}

            <MediaPicker
              isOpen={showMediaPicker}
              onClose={() => setShowMediaPicker(false)}
              onSelect={handleMediaSelect}
              options={{ allowedTypes: ['image'] }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-[#C9A227] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
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
// Testimonial Card (view mode rendering)
// ============================================================================

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card h-full flex flex-col">
      {/* Quote icon */}
      <div className="w-10 h-10 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4">
        <Quote className="w-5 h-5 text-jhr-gold" />
      </div>

      {/* Quote text */}
      <blockquote className="text-body-md text-jhr-white-dim italic flex-1 mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.authorImage?.src ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <SmartImage
              src={testimonial.authorImage.src}
              alt={testimonial.authorImage.alt || testimonial.authorName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-jhr-gold" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-jhr-white">
            {testimonial.authorName}
          </p>
          <p className="text-xs text-jhr-white-muted">
            {testimonial.authorTitle}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EditableTestimonials Component
// ============================================================================

export function EditableTestimonials({
  contentKeyPrefix,
  heading,
  layout = 'carousel',
  testimonials: initialTestimonials,
  onTestimonialsChange,
  onLayoutChange,
  children,
}: EditableTestimonialsProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [currentLayout, setCurrentLayout] = useState<TestimonialLayout>(layout);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Modal states
  const [editorTestimonialId, setEditorTestimonialId] = useState<string | null>(null);

  // Update testimonials helper
  const updateTestimonials = useCallback(
    (newTestimonials: Testimonial[]) => {
      setTestimonials(newTestimonials);
      onTestimonialsChange?.(newTestimonials);
      updateContent(
        `${contentKeyPrefix}:testimonials`,
        JSON.stringify(newTestimonials),
        'text'
      );
    },
    [contentKeyPrefix, onTestimonialsChange, updateContent]
  );

  // Handle layout change
  const handleLayoutChange = useCallback(
    (l: TestimonialLayout) => {
      setCurrentLayout(l);
      onLayoutChange?.(l);
      updateContent(
        `${contentKeyPrefix}:layout`,
        l,
        'text'
      );
    },
    [contentKeyPrefix, onLayoutChange, updateContent]
  );

  // Add a new testimonial
  const handleAddTestimonial = useCallback(() => {
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      quote: 'Add a testimonial quote here.',
      authorName: 'Client Name',
      authorTitle: 'Position, Company',
    };
    const updated = [...testimonials, newTestimonial];
    updateTestimonials(updated);
  }, [testimonials, updateTestimonials]);

  // Remove a testimonial
  const handleRemoveTestimonial = useCallback(
    (id: string) => {
      const updated = testimonials.filter((t) => t.id !== id);
      updateTestimonials(updated);
      // Adjust carousel index if needed
      if (carouselIndex >= updated.length && updated.length > 0) {
        setCarouselIndex(updated.length - 1);
      }
    },
    [testimonials, updateTestimonials, carouselIndex]
  );

  // Move a testimonial up/down
  const handleMoveTestimonial = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const index = testimonials.findIndex((t) => t.id === id);
      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === testimonials.length - 1) return;

      const newTestimonials = [...testimonials];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newTestimonials[index], newTestimonials[swapIndex]] = [newTestimonials[swapIndex], newTestimonials[index]];
      updateTestimonials(newTestimonials);
    },
    [testimonials, updateTestimonials]
  );

  // Save edited testimonial
  const handleSaveTestimonial = useCallback(
    (updated: Testimonial) => {
      const newTestimonials = testimonials.map((t) =>
        t.id === updated.id ? updated : t
      );
      updateTestimonials(newTestimonials);
      setEditorTestimonialId(null);
    },
    [testimonials, updateTestimonials]
  );

  // Carousel navigation
  const handleCarouselPrev = useCallback(() => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  }, [testimonials.length]);

  const handleCarouselNext = useCallback(() => {
    setCarouselIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  }, [testimonials.length]);

  // Resolve pending heading
  const headingKey = `${contentKeyPrefix}:heading`;
  const displayHeading = pendingChanges.get(headingKey)?.newValue ?? heading;

  // Get testimonial being edited
  const editingTestimonial = editorTestimonialId
    ? testimonials.find((t) => t.id === editorTestimonialId)
    : null;

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <div>
        {/* Heading */}
        {displayHeading && (
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-display font-bold text-jhr-white">
              {displayHeading}
            </h2>
          </div>
        )}

        {/* Single Layout */}
        {currentLayout === 'single' && testimonials.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <TestimonialCard testimonial={testimonials[0]} />
          </div>
        )}

        {/* Carousel Layout */}
        {currentLayout === 'carousel' && testimonials.length > 0 && (
          <div className="relative">
            <div className="max-w-2xl mx-auto">
              <TestimonialCard testimonial={testimonials[carouselIndex]} />
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={handleCarouselPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCarouselNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === carouselIndex
                        ? 'bg-[#C9A227]'
                        : 'bg-[#333] hover:bg-[#555]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid Layout */}
        {currentLayout === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Quote className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No testimonials yet.</p>
          </div>
        )}

        {children}
      </div>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <div className="relative group/testimonials">
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Testimonials
            </span>
          </div>
        )}

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
                placeholder="Enter section heading..."
              >
                {displayHeading || ''}
              </EditableText>
            </div>
          )}
        </div>

        {/* Layout selector */}
        {canEdit && (
          <div className="flex items-center justify-between mb-6">
            <LayoutSelector layout={currentLayout} onChange={handleLayoutChange} />
            <div className="flex items-center gap-2">
              <FieldLabel label="Testimonials" icon={<Quote className="w-3 h-3" />} />
            </div>
          </div>
        )}

        {/* Single Layout - Edit Mode */}
        {currentLayout === 'single' && testimonials.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <EditableTestimonialCard
              testimonial={testimonials[0]}
              index={0}
              total={testimonials.length}
              canEdit={canEdit}
              onEdit={() => setEditorTestimonialId(testimonials[0].id)}
              onRemove={() => handleRemoveTestimonial(testimonials[0].id)}
              onMoveUp={() => handleMoveTestimonial(testimonials[0].id, 'up')}
              onMoveDown={() => handleMoveTestimonial(testimonials[0].id, 'down')}
            />
          </div>
        )}

        {/* Carousel Layout - Edit Mode */}
        {currentLayout === 'carousel' && testimonials.length > 0 && (
          <div className="relative">
            <div className="max-w-2xl mx-auto">
              <EditableTestimonialCard
                testimonial={testimonials[carouselIndex]}
                index={carouselIndex}
                total={testimonials.length}
                canEdit={canEdit}
                onEdit={() => setEditorTestimonialId(testimonials[carouselIndex].id)}
                onRemove={() => handleRemoveTestimonial(testimonials[carouselIndex].id)}
                onMoveUp={() => handleMoveTestimonial(testimonials[carouselIndex].id, 'up')}
                onMoveDown={() => handleMoveTestimonial(testimonials[carouselIndex].id, 'down')}
              />
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={handleCarouselPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCarouselNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === carouselIndex
                        ? 'bg-[#C9A227]'
                        : 'bg-[#333] hover:bg-[#555]'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="text-center mt-4 text-xs text-gray-500">
              {carouselIndex + 1} / {testimonials.length}
            </div>
          </div>
        )}

        {/* Grid Layout - Edit Mode */}
        {currentLayout === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <EditableTestimonialCard
                key={t.id}
                testimonial={t}
                index={index}
                total={testimonials.length}
                canEdit={canEdit}
                onEdit={() => setEditorTestimonialId(t.id)}
                onRemove={() => handleRemoveTestimonial(t.id)}
                onMoveUp={() => handleMoveTestimonial(t.id, 'up')}
                onMoveDown={() => handleMoveTestimonial(t.id, 'down')}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Quote className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">No testimonials yet.</p>
            {canEdit && (
              <button
                onClick={handleAddTestimonial}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-black text-sm font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Testimonial
              </button>
            )}
          </div>
        )}

        {/* Add Testimonial Button */}
        {canEdit && testimonials.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 rounded-lg text-gray-500 hover:text-[#C9A227] transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
          </div>
        )}

        {/* Section border in edit mode */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 rounded-xl pointer-events-none group-hover/testimonials:border-[#C9A227]/40 transition-colors -m-4 p-4" />
        )}

        {children}
      </div>

      {/* Testimonial Editor Modal */}
      {editorTestimonialId && editingTestimonial && (
        <TestimonialEditor
          testimonial={editingTestimonial}
          onSave={handleSaveTestimonial}
          onClose={() => setEditorTestimonialId(null)}
        />
      )}
    </>
  );
}

// ============================================================================
// Editable Testimonial Card (edit mode card with controls)
// ============================================================================

function EditableTestimonialCard({
  testimonial,
  index,
  total,
  canEdit,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  testimonial: Testimonial;
  index: number;
  total: number;
  canEdit: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="card h-full flex flex-col relative group/card">
      {/* Card Controls */}
      {canEdit && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
          {/* Edit */}
          <button
            onClick={onEdit}
            className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center text-black hover:bg-[#D4AF37] transition-colors"
            title="Edit testimonial"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Move Up */}
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down */}
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
            title="Remove testimonial"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quote icon */}
      <div className="w-10 h-10 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4">
        <Quote className="w-5 h-5 text-jhr-gold" />
      </div>

      {/* Quote text */}
      <blockquote className="text-body-md text-jhr-white-dim italic flex-1 mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.authorImage?.src ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <SmartImage
              src={testimonial.authorImage.src}
              alt={testimonial.authorImage.alt || testimonial.authorName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-jhr-gold" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-jhr-white">
            {testimonial.authorName}
          </p>
          <p className="text-xs text-jhr-white-muted">
            {testimonial.authorTitle}
          </p>
        </div>
      </div>

      {/* Edit mode click overlay */}
      {canEdit && (
        <div
          onClick={onEdit}
          className="absolute inset-0 cursor-pointer rounded-xl"
          title="Click to edit testimonial"
        />
      )}

      {/* Edit mode border */}
      {canEdit && (
        <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/card:border-[#C9A227]/40 rounded-xl pointer-events-none transition-colors" />
      )}
    </div>
  );
}
