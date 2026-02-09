'use client';

import { useState, useCallback, useEffect, ReactNode, useRef } from 'react';
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
  Grid3X3,
  GalleryHorizontal,
  LayoutGrid,
  Type,
  ImageIcon,
  Maximize,
  Minimize,
  RectangleHorizontal,
  Film,
} from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import type { GalleryLayout, EditableImageField, SingleImageFit } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableImageGalleryProps {
  /** Content key prefix for all gallery fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Section heading. */
  heading?: string;
  /** Gallery layout. */
  layout?: GalleryLayout;
  /** Gallery images. */
  images: EditableImageField[];
  /** How the single-image layout fits its container. */
  singleImageFit?: SingleImageFit;
  /** Callback when images array changes (for parent state management). */
  onImagesChange?: (images: EditableImageField[]) => void;
  /** Callback when layout changes. */
  onLayoutChange?: (layout: GalleryLayout) => void;
  /** Callback when singleImageFit changes. */
  onSingleImageFitChange?: (fit: SingleImageFit) => void;
  /** Additional children rendered below the gallery. */
  children?: ReactNode;
}

// ============================================================================
// Layout Selector
// ============================================================================

function LayoutSelector({
  layout,
  onChange,
}: {
  layout: GalleryLayout;
  onChange: (layout: GalleryLayout) => void;
}) {
  const options: { value: GalleryLayout; label: string; icon: ReactNode }[] = [
    { value: 'single', label: 'Single', icon: <ImageIcon className="w-4 h-4" /> },
    { value: 'grid', label: 'Grid', icon: <Grid3X3 className="w-4 h-4" /> },
    { value: 'slider', label: 'Slider', icon: <GalleryHorizontal className="w-4 h-4" /> },
    { value: 'masonry', label: 'Masonry', icon: <LayoutGrid className="w-4 h-4" /> },
    { value: 'filmstrip', label: 'Filmstrip', icon: <Film className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Layout:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${layout === opt.value
              ? 'bg-[#C9A227] text-black'
              : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
            }
          `}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Single Image Fit Selector
// ============================================================================

function FitSelector({
  fit,
  onChange,
}: {
  fit: SingleImageFit;
  onChange: (fit: SingleImageFit) => void;
}) {
  const options: { value: SingleImageFit; label: string; icon: ReactNode }[] = [
    { value: 'cover', label: 'Fill', icon: <Maximize className="w-4 h-4" /> },
    { value: 'contain', label: 'Fit', icon: <Minimize className="w-4 h-4" /> },
    { value: 'full-height', label: 'Natural', icon: <RectangleHorizontal className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Size:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${fit === opt.value
              ? 'bg-[#C9A227] text-black'
              : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
            }
          `}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Alt Text Editor Modal
// ============================================================================

interface AltTextEditorProps {
  image: EditableImageField;
  onSave: (alt: string, caption: string) => void;
  onClose: () => void;
}

function AltTextEditor({ image, onSave, onClose }: AltTextEditorProps) {
  const [editAlt, setEditAlt] = useState(image.alt);
  const [editCaption, setEditCaption] = useState(image.caption || '');

  const handleSave = useCallback(() => {
    onSave(editAlt, editCaption);
  }, [editAlt, editCaption, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Edit Image Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image preview */}
        <div className="mb-4">
          <div className="relative h-40 rounded-lg overflow-hidden bg-[#0A0A0A]">
            {image.src ? (
              <SmartImage
                src={image.src}
                alt={image.alt || 'Image preview'}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-12 h-12 text-gray-600" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Alt Text <span className="text-[#C9A227]">(required for accessibility/SEO)</span>
            </label>
            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Describe the image..."
              maxLength={125}
            />
            <p className="text-xs text-gray-500 mt-1">{editAlt.length}/125 characters</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Caption (optional)</label>
            <input
              type="text"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Image caption..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{editCaption.length}/200 characters</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
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

// ImageReplaceModal removed — replaced by MediaPicker integration

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
// EditableImageGallery Component
// ============================================================================

export function EditableImageGallery({
  contentKeyPrefix,
  heading,
  layout = 'grid',
  images: initialImages,
  singleImageFit: initialFit = 'cover',
  onImagesChange,
  onLayoutChange,
  onSingleImageFitChange,
  children,
}: EditableImageGalleryProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local image state for add/remove/reorder
  const [images, setImages] = useState<EditableImageField[]>(initialImages);
  const [currentLayout, setCurrentLayout] = useState<GalleryLayout>(layout);
  const [currentFit, setCurrentFit] = useState<SingleImageFit>(initialFit);

  // Sync local state when initialImages prop changes (e.g., when draft is loaded)
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  // Modal states
  const [altTextEditorIndex, setAltTextEditorIndex] = useState<number | null>(null);
  const [replaceModalIndex, setReplaceModalIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Slider state
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filmstrip scroll ref
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Update images helper
  const updateImages = useCallback(
    (newImages: EditableImageField[]) => {
      setImages(newImages);
      onImagesChange?.(newImages);
      // Serialize the full images array as a pending change
      updateContent(
        `${contentKeyPrefix}:images`,
        JSON.stringify(newImages),
        'text'
      );
    },
    [contentKeyPrefix, onImagesChange, updateContent]
  );

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: GalleryLayout) => {
      setCurrentLayout(newLayout);
      onLayoutChange?.(newLayout);
      updateContent(
        `${contentKeyPrefix}:layout`,
        newLayout,
        'text'
      );
    },
    [contentKeyPrefix, onLayoutChange, updateContent]
  );

  // Handle single image fit change
  const handleFitChange = useCallback(
    (newFit: SingleImageFit) => {
      setCurrentFit(newFit);
      onSingleImageFitChange?.(newFit);
      updateContent(
        `${contentKeyPrefix}:singleImageFit`,
        newFit,
        'text'
      );
    },
    [contentKeyPrefix, onSingleImageFitChange, updateContent]
  );

  // Add a new image
  const handleAddImage = useCallback((url: string) => {
    const newImage: EditableImageField = {
      src: url,
      alt: '',
      caption: '',
    };
    updateImages([...images, newImage]);
    setIsAddModalOpen(false);
  }, [images, updateImages]);

  // Remove an image
  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      updateImages(newImages);
      // Adjust slider index if needed
      if (sliderIndex >= newImages.length && newImages.length > 0) {
        setSliderIndex(newImages.length - 1);
      }
    },
    [images, updateImages, sliderIndex]
  );

  // Move an image up/down (left/right)
  const handleMoveImage = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === images.length - 1) return;

      const newImages = [...images];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
      updateImages(newImages);
    },
    [images, updateImages]
  );

  // Replace an image
  const handleReplaceImage = useCallback(
    (index: number, url: string) => {
      const newImages = images.map((img, i) =>
        i === index ? { ...img, src: url } : img
      );
      updateImages(newImages);
      setReplaceModalIndex(null);
    },
    [images, updateImages]
  );

  // Update alt text and caption
  const handleSaveAltText = useCallback(
    (index: number, alt: string, caption: string) => {
      const newImages = images.map((img, i) =>
        i === index ? { ...img, alt, caption: caption || undefined } : img
      );
      updateImages(newImages);
      setAltTextEditorIndex(null);
    },
    [images, updateImages]
  );

  // Slider navigation
  const handleSliderPrev = useCallback(() => {
    setSliderIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSliderNext = useCallback(() => {
    setSliderIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  // Resolve pending heading
  const headingKey = `${contentKeyPrefix}:heading`;
  const displayHeading = pendingChanges.get(headingKey)?.newValue ?? heading;

  // ---- Grid Layout Renderer ----
  const renderGridLayout = (imageList: EditableImageField[], editable: boolean) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {imageList.map((image, index) => (
        <div key={`img-${index}`} className="relative group/image aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
          {image.src ? (
            <SmartImage
              src={image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover/image:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Caption overlay */}
          {image.caption && !editable && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-sm text-white">{image.caption}</p>
            </div>
          )}

          {/* Edit controls overlay */}
          {editable && canEdit && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setReplaceModalIndex(index)}
                className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => setAltTextEditorIndex(index)}
                className="px-3 py-1.5 bg-[#2A2A2A] text-white text-xs font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Alt Text / Caption
              </button>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => handleMoveImage(index, 'up')}
                  disabled={index === 0}
                  className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveImage(index, 'down')}
                  disabled={index === imageList.length - 1}
                  className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Dashed border in edit mode */}
          {editable && canEdit && (
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/image:border-[#C9A227]/40 pointer-events-none transition-colors" />
          )}

          {/* Missing alt text warning */}
          {editable && canEdit && !image.alt && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold rounded uppercase">
              No alt text
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ---- Slider Layout Renderer ----
  const renderSliderLayout = (imageList: EditableImageField[], editable: boolean) => {
    if (imageList.length === 0) return null;
    const currentImage = imageList[sliderIndex] || imageList[0];
    const currentIdx = Math.min(sliderIndex, imageList.length - 1);

    return (
      <div className="relative" ref={sliderRef}>
        {/* Main image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#1A1A1A] group/slider">
          {currentImage.src ? (
            <SmartImage
              src={currentImage.src}
              alt={currentImage.alt || `Gallery image ${currentIdx + 1}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-gray-600" />
            </div>
          )}

          {/* Caption overlay */}
          {currentImage.caption && !editable && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white">{currentImage.caption}</p>
            </div>
          )}

          {/* Edit overlay for current image */}
          {editable && canEdit && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/slider:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => setReplaceModalIndex(currentIdx)}
                className="px-4 py-2 bg-[#C9A227] text-black text-sm font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => setAltTextEditorIndex(currentIdx)}
                className="px-4 py-2 bg-[#2A2A2A] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Alt Text / Caption
              </button>
              <button
                onClick={() => handleRemoveImage(currentIdx)}
                className="px-4 py-2 bg-red-900/70 text-red-300 text-sm font-medium rounded-lg hover:bg-red-900 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {/* Missing alt text warning */}
          {editable && canEdit && !currentImage.alt && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold rounded uppercase">
              No alt text
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handleSliderPrev}
              disabled={currentIdx === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleSliderNext}
              disabled={currentIdx === imageList.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {imageList.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {imageList.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setSliderIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIdx
                    ? 'bg-[#C9A227]'
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm text-white font-medium">
          {currentIdx + 1} / {imageList.length}
        </div>
      </div>
    );
  };

  // ---- Masonry Layout Renderer ----
  const renderMasonryLayout = (imageList: EditableImageField[], editable: boolean) => (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {imageList.map((image, index) => (
        <div key={`masonry-${index}`} className="relative group/image break-inside-avoid rounded-lg overflow-hidden bg-[#1A1A1A]">
          {image.src ? (
            <img
              src={image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center aspect-square">
              <ImageIcon className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Caption overlay */}
          {image.caption && !editable && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-sm text-white">{image.caption}</p>
            </div>
          )}

          {/* Edit controls overlay */}
          {editable && canEdit && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setReplaceModalIndex(index)}
                className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => setAltTextEditorIndex(index)}
                className="px-3 py-1.5 bg-[#2A2A2A] text-white text-xs font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Alt Text / Caption
              </button>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => handleMoveImage(index, 'up')}
                  disabled={index === 0}
                  className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move earlier"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveImage(index, 'down')}
                  disabled={index === imageList.length - 1}
                  className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move later"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Dashed border in edit mode */}
          {editable && canEdit && (
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/image:border-[#C9A227]/40 pointer-events-none transition-colors" />
          )}

          {/* Missing alt text warning */}
          {editable && canEdit && !image.alt && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold rounded uppercase">
              No alt text
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ---- Single Layout Renderer ----
  const renderSingleLayout = (imageList: EditableImageField[], editable: boolean) => {
    const image = imageList[0];
    if (!image) return null;

    // 'cover' = fixed 16:9 with object-cover (fills, crops)
    // 'contain' = fixed 16:9 with object-contain (fits, letterboxed)
    // 'full-height' = natural aspect ratio, full width (no crop)
    const isNatural = currentFit === 'full-height';
    const objectClass = currentFit === 'contain' ? 'object-contain' : 'object-cover';

    return (
      <div
        className={`relative group/image rounded-lg overflow-hidden bg-[#1A1A1A] w-full ${isNatural ? '' : 'aspect-[16/9]'}`}
      >
        {image.src ? (
          isNatural ? (
            // Natural: full-width image at its own aspect ratio
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt || 'Gallery image'}
              className="w-full h-auto block"
              loading="lazy"
            />
          ) : (
            // Cover / Contain: fill the 16:9 container
            <SmartImage
              src={image.src}
              alt={image.alt || 'Gallery image'}
              fill
              className={objectClass}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <ImageIcon className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {/* Caption overlay */}
        {image.caption && !editable && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white">{image.caption}</p>
          </div>
        )}

        {/* Edit controls overlay */}
        {editable && canEdit && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => setReplaceModalIndex(0)}
              className="px-4 py-2 bg-[#C9A227] text-black text-sm font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
            >
              Replace
            </button>
            <button
              onClick={() => setAltTextEditorIndex(0)}
              className="px-4 py-2 bg-[#2A2A2A] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors"
            >
              Alt Text / Caption
            </button>
            <button
              onClick={() => handleRemoveImage(0)}
              className="px-4 py-2 bg-red-900/70 text-red-300 text-sm font-medium rounded-lg hover:bg-red-900 transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {/* Missing alt text warning */}
        {editable && canEdit && !image.alt && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold rounded uppercase">
            No alt text
          </div>
        )}
      </div>
    );
  };

  // ---- Filmstrip Layout Renderer ----
  // View mode: full-bleed, fixed height, auto-width cards (landscape-friendly)
  // Edit mode: fixed-dimension cards for clean editing
  const renderFilmstripLayout = (imageList: EditableImageField[], editable: boolean) => {
    const scrollBy = (direction: 'left' | 'right') => {
      if (!filmstripRef.current) return;
      const amount = direction === 'left' ? -400 : 400;
      filmstripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    return (
      <div className={`relative group/filmstrip ${!editable ? 'filmstrip-full-bleed' : ''}`}>
        {/* Scroll container */}
        <div
          ref={filmstripRef}
          className={`flex gap-4 overflow-x-auto scroll-smooth pb-2 ${!editable ? 'px-4 sm:px-6 lg:px-8' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

          {imageList.map((image, index) => (
            <div
              key={`filmstrip-${index}`}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden bg-[#1A1A1A] group/card ${
                editable
                  ? 'w-[220px] h-[280px] md:w-[260px] md:h-[340px]'
                  : 'h-[220px] md:h-[280px]'
              }`}
            >
              {image.src ? (
                editable ? (
                  <SmartImage
                    src={image.src}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover brightness-90 transition-all duration-500 group-hover/card:scale-[1.04] group-hover/card:brightness-100"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.src}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="h-full w-auto block brightness-90 transition-all duration-500 group-hover/card:scale-[1.04] group-hover/card:brightness-100"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full min-w-[200px]">
                  <ImageIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Caption overlay (view mode — only when caption is set) */}
              {!editable && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-10">
                  <p className="text-white font-display font-semibold text-sm leading-tight">
                    {image.caption}
                  </p>
                </div>
              )}

              {/* Edit controls overlay */}
              {editable && canEdit && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => setReplaceModalIndex(index)}
                    className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => setAltTextEditorIndex(index)}
                    className="px-3 py-1.5 bg-[#2A2A2A] text-white text-xs font-medium rounded-lg hover:bg-[#333] transition-colors"
                  >
                    Alt Text / Caption
                  </button>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => handleMoveImage(index, 'up')}
                      disabled={index === 0}
                      className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveImage(index, 'down')}
                      disabled={index === imageList.length - 1}
                      className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dashed border in edit mode */}
              {editable && canEdit && (
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/card:border-[#C9A227]/40 pointer-events-none transition-colors" />
              )}

              {/* Missing alt text warning */}
              {editable && canEdit && !image.alt && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold rounded uppercase">
                  No alt text
                </div>
              )}
            </div>
          ))}

          {/* Add Image card (edit mode) */}
          {editable && canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-shrink-0 w-[220px] h-[280px] md:w-[260px] md:h-[340px] rounded-xl border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-[#C9A227] transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Image</span>
            </button>
          )}
        </div>

        {/* Fade edges (view mode only — adapted to light sections via CSS) */}
        {!editable && imageList.length > 2 && (
          <>
            <div className="filmstrip-fade-left absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-10" />
            <div className="filmstrip-fade-right absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-10" />
          </>
        )}

        {/* Scroll buttons */}
        {imageList.length > 2 && (
          <>
            <button
              onClick={() => scrollBy('left')}
              className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all z-20 ${
                !editable ? 'left-6' : 'left-2'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy('right')}
              className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all z-20 ${
                !editable ? 'right-6' : 'right-2'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    );
  };

  // ---- Render the appropriate layout ----
  const renderLayout = (imageList: EditableImageField[], editable: boolean) => {
    switch (currentLayout) {
      case 'single':
        return renderSingleLayout(imageList, editable);
      case 'slider':
        return renderSliderLayout(imageList, editable);
      case 'masonry':
        return renderMasonryLayout(imageList, editable);
      case 'filmstrip':
        return renderFilmstripLayout(imageList, editable);
      case 'grid':
      default:
        return renderGridLayout(imageList, editable);
    }
  };

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <div>
        {/* Heading */}
        {displayHeading && (
          <div className="text-center mb-8">
            <h2 className="text-display-sm font-display font-bold text-jhr-white">
              {displayHeading}
            </h2>
          </div>
        )}

        {/* Gallery */}
        {images.length > 0 ? (
          renderLayout(images, false)
        ) : (
          <div className="py-16 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3" />
            <p>No images in this gallery</p>
          </div>
        )}

        {children}
      </div>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <div className="relative group/gallery">
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Image Gallery
            </span>
          </div>
        )}

        {/* Heading - Editable */}
        <div className="text-center mb-8">
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
                placeholder="Enter gallery heading..."
              >
                {displayHeading || ''}
              </EditableText>
            </div>
          )}
        </div>

        {/* Layout selector */}
        {canEdit && (
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between">
              <LayoutSelector layout={currentLayout} onChange={handleLayoutChange} />
              <div className="flex items-center gap-2">
                <FieldLabel label={`${images.length} Images`} icon={<ImageIcon className="w-3 h-3" />} />
              </div>
            </div>
            {currentLayout === 'single' && (
              <FitSelector fit={currentFit} onChange={handleFitChange} />
            )}
          </div>
        )}

        {/* Gallery - Editable */}
        {images.length > 0 ? (
          renderLayout(images, true)
        ) : (
          <div className="py-16 text-center text-gray-500 border-2 border-dashed border-[#333] rounded-xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-3" />
            <p className="mb-4">No images in this gallery</p>
            {canEdit && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#C9A227] text-black text-sm font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                Add First Image
              </button>
            )}
          </div>
        )}

        {/* Add Image Button */}
        {canEdit && images.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 text-gray-500 hover:text-[#C9A227] transition-colors group/add"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] group-hover/add:bg-[#C9A227]/10 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Add Image</span>
            </button>
          </div>
        )}

        {/* Section border in edit mode */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 rounded-xl pointer-events-none group-hover/gallery:border-[#C9A227]/40 transition-colors -m-4 p-4" />
        )}

        {children}
      </div>

      {/* Alt Text Editor Modal */}
      {altTextEditorIndex !== null && images[altTextEditorIndex] && (
        <ModalPortal>
          <AltTextEditor
            image={images[altTextEditorIndex]}
            onSave={(alt, caption) => handleSaveAltText(altTextEditorIndex, alt, caption)}
            onClose={() => setAltTextEditorIndex(null)}
          />
        </ModalPortal>
      )}

      {/* Image Replace — MediaPicker */}
      <MediaPicker
        isOpen={replaceModalIndex !== null}
        onClose={() => setReplaceModalIndex(null)}
        onSelect={(results: MediaPickerResult[]) => {
          if (results.length > 0 && replaceModalIndex !== null) {
            handleReplaceImage(replaceModalIndex, results[0].publicUrl);
          }
        }}
        options={{ allowedTypes: ['image'] }}
      />

      {/* Add Image — MediaPicker */}
      <MediaPicker
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelect={(results: MediaPickerResult[]) => {
          if (results.length > 0) {
            handleAddImage(results[0].publicUrl);
          }
        }}
        options={{ allowedTypes: ['image'] }}
      />
    </>
  );
}
