'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import {
  ArrowRight,
  Pencil,
  X,
  Type,
  AlignLeft,
  MousePointerClick,
  Palette,
  ImageIcon,
  Check,
  Move,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import type { CTAButton, CTABackground } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableCTAProps {
  /** Content key prefix for all CTA fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** CTA headline text. */
  headline: string;
  /** Supporting subtext. */
  subtext: string;
  /** Primary CTA button config. */
  primaryButton: CTAButton | { text: string; href: string };
  /** Optional secondary button config. */
  secondaryButton?: CTAButton | { text: string; href: string };
  /** Background type: solid, gradient, or image. */
  backgroundType?: CTABackground;
  /** Background value: hex color, CSS gradient string, or image URL. */
  backgroundValue?: string;
  /** Vertical position for background image (0-100, 0=top, 50=center, 100=bottom). */
  imagePositionY?: number;
  /** Text alignment. */
  alignment?: 'left' | 'center' | 'right';
  /** Additional children rendered after buttons. */
  children?: ReactNode;
}

// ============================================================================
// Preset gradients for the background picker
// ============================================================================

const GRADIENT_PRESETS = [
  { label: 'Gold Fade', value: 'linear-gradient(135deg, #C9A227 0%, #0A0A0A 100%)' },
  { label: 'Dark Gold', value: 'linear-gradient(135deg, #1A1A0A 0%, #C9A227 50%, #1A1A0A 100%)' },
  { label: 'Subtle Gold', value: 'linear-gradient(to right, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)' },
  { label: 'Dark Warm', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  { label: 'Charcoal', value: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' },
];

const SOLID_PRESETS = [
  { label: 'Black', value: '#0A0A0A' },
  { label: 'Dark', value: '#1A1A1A' },
  { label: 'Gold', value: '#C9A227' },
  { label: 'Dark Gold', value: '#8B7520' },
  { label: 'Charcoal', value: '#2A2A2A' },
  { label: 'Navy', value: '#0f3460' },
];

// ============================================================================
// CTA Button Editor Modal
// ============================================================================

interface CTAButtonEditorProps {
  label: string;
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
  onSave: (text: string, href: string, variant: 'primary' | 'secondary') => void;
  onClose: () => void;
}

function CTAButtonEditor({ label, text, href, variant, onSave, onClose }: CTAButtonEditorProps) {
  const [editText, setEditText] = useState(text);
  const [editHref, setEditHref] = useState(href);
  const [editVariant, setEditVariant] = useState(variant);

  const handleSave = useCallback(() => {
    onSave(editText, editHref, editVariant);
  }, [editText, editHref, editVariant, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Edit {label}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Button Text</label>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Button text..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Link URL</label>
            <input
              type="text"
              value={editHref}
              onChange={(e) => setEditHref(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="/page or https://..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Style</label>
            <div className="flex gap-2">
              <button
                onClick={() => setEditVariant('primary')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  editVariant === 'primary'
                    ? 'bg-[#C9A227] text-black'
                    : 'bg-[#0A0A0A] border border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setEditVariant('secondary')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  editVariant === 'secondary'
                    ? 'bg-[#C9A227] text-black'
                    : 'bg-[#0A0A0A] border border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
// Background Editor Modal
// ============================================================================

interface BackgroundEditorProps {
  backgroundType: CTABackground;
  backgroundValue: string;
  onSave: (type: CTABackground, value: string) => void;
  onClose: () => void;
}

function BackgroundEditor({ backgroundType, backgroundValue, onSave, onClose }: BackgroundEditorProps) {
  const [editType, setEditType] = useState<CTABackground>(backgroundType);
  const [editValue, setEditValue] = useState(backgroundValue);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = useCallback(() => {
    onSave(editType, editValue);
  }, [editType, editValue, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Edit Background
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Background Type Selector */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Background Type</label>
          <div className="flex gap-2">
            {(['solid', 'gradient', 'image'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setEditType(type);
                  // Set sensible defaults when switching
                  if (type === 'solid' && editType !== 'solid') setEditValue('#0A0A0A');
                  if (type === 'gradient' && editType !== 'gradient') setEditValue(GRADIENT_PRESETS[0].value);
                  if (type === 'image' && editType !== 'image') setEditValue('');
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  editType === type
                    ? 'bg-[#C9A227] text-black'
                    : 'bg-[#0A0A0A] border border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Solid Color Options */}
        {editType === 'solid' && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {SOLID_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setEditValue(preset.value)}
                  className={`relative aspect-square rounded-lg border-2 transition-colors ${
                    editValue === preset.value ? 'border-[#C9A227]' : 'border-[#333] hover:border-[#555]'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.label}
                >
                  {editValue === preset.value && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Custom hex color</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        )}

        {/* Gradient Options */}
        {editType === 'gradient' && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Gradient Presets</label>
            <div className="grid grid-cols-1 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setEditValue(preset.value)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-colors ${
                    editValue === preset.value ? 'border-[#C9A227]' : 'border-[#333] hover:border-[#555]'
                  }`}
                >
                  <div
                    className="w-16 h-8 rounded"
                    style={{ background: preset.value }}
                  />
                  <span className="text-sm text-gray-300">{preset.label}</span>
                  {editValue === preset.value && (
                    <Check className="w-4 h-4 text-[#C9A227] ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Custom CSS gradient</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
                placeholder="linear-gradient(135deg, #000 0%, #333 100%)"
              />
            </div>
          </div>
        )}

        {/* Image Options */}
        {editType === 'image' && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Background Image</label>
            <button
              onClick={() => setShowMediaPicker(true)}
              className="w-full px-3 py-2.5 bg-[#C9A227] text-black text-sm font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
            >
              Browse Media Library
            </button>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
              placeholder="/images/background.jpg or https://..."
            />
            <MediaPicker
              isOpen={showMediaPicker}
              onClose={() => setShowMediaPicker(false)}
              onSelect={(results: MediaPickerResult[]) => {
                if (results.length > 0) {
                  setEditValue(results[0].publicUrl);
                }
                setShowMediaPicker(false);
              }}
              options={{ allowedTypes: ['image'] }}
            />
            {editValue && (
              <div className="relative h-32 rounded-lg overflow-hidden bg-[#0A0A0A]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editValue}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <span className="absolute bottom-2 left-2 text-xs text-gray-300">Preview with overlay</span>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        <div className="mt-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Preview</label>
          <div
            className="relative h-20 rounded-lg overflow-hidden flex items-center justify-center"
            style={
              editType === 'solid'
                ? { backgroundColor: editValue }
                : editType === 'gradient'
                  ? { background: editValue }
                  : { backgroundColor: '#0A0A0A' }
            }
          >
            {editType === 'image' && editValue && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editValue}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
              </>
            )}
            <span className="relative z-10 text-white text-sm font-medium">Sample Text</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
// Helper: Get background styles
// ============================================================================

function getBackgroundStyle(type: CTABackground, value: string): React.CSSProperties {
  switch (type) {
    case 'solid':
      return { backgroundColor: value };
    case 'gradient':
      return { background: value };
    case 'image':
      return {};
  }
}

/**
 * Render text that may contain inline HTML (color spans, bold, italic).
 */
function renderInlineHtml(text: string): { dangerouslySetInnerHTML: { __html: string } } | { children: string } {
  if (text.includes('<')) {
    return { dangerouslySetInnerHTML: { __html: text } };
  }
  return { children: text };
}

function getButtonClasses(variant: 'primary' | 'secondary'): string {
  if (variant === 'primary') {
    return 'btn-primary';
  }
  return 'btn-secondary';
}

// ============================================================================
// EditableCTA Component
// ============================================================================

export function EditableCTA({
  contentKeyPrefix,
  headline,
  subtext,
  primaryButton,
  secondaryButton,
  backgroundType = 'solid',
  backgroundValue = '#0A0A0A',
  imagePositionY = 50,
  alignment = 'center',
  children,
}: EditableCTAProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Modal states
  const [editingButton, setEditingButton] = useState<'primary' | 'secondary' | null>(null);
  const [isBackgroundEditorOpen, setIsBackgroundEditorOpen] = useState(false);

  // Image position state (for live preview during drag)
  const [localPositionY, setLocalPositionY] = useState(imagePositionY);

  // Sync local position state when prop changes
  useEffect(() => {
    setLocalPositionY(imagePositionY);
  }, [imagePositionY]);

  // Content keys
  const primaryTextKey = `${contentKeyPrefix}:primaryButton-text`;
  const primaryHrefKey = `${contentKeyPrefix}:primaryButton-href`;
  const primaryVariantKey = `${contentKeyPrefix}:primaryButton-variant`;
  const secondaryTextKey = `${contentKeyPrefix}:secondaryButton-text`;
  const secondaryHrefKey = `${contentKeyPrefix}:secondaryButton-href`;
  const secondaryVariantKey = `${contentKeyPrefix}:secondaryButton-variant`;
  const bgTypeKey = `${contentKeyPrefix}:backgroundType`;
  const bgValueKey = `${contentKeyPrefix}:backgroundValue`;
  const bgImageKey = `${contentKeyPrefix}:backgroundImage`;

  // Resolve display values from pending changes
  const primaryBtnText = pendingChanges.get(primaryTextKey)?.newValue ?? primaryButton.text;
  const primaryBtnHref = pendingChanges.get(primaryHrefKey)?.newValue ?? primaryButton.href;
  const primaryBtnVariant = (pendingChanges.get(primaryVariantKey)?.newValue ?? ('variant' in primaryButton ? primaryButton.variant : 'primary')) as 'primary' | 'secondary';

  const secondaryBtnText = pendingChanges.get(secondaryTextKey)?.newValue ?? secondaryButton?.text ?? '';
  const secondaryBtnHref = pendingChanges.get(secondaryHrefKey)?.newValue ?? secondaryButton?.href ?? '#';
  const secondaryBtnVariant = (pendingChanges.get(secondaryVariantKey)?.newValue ?? (secondaryButton && 'variant' in secondaryButton ? secondaryButton.variant : 'secondary')) as 'primary' | 'secondary';

  const currentBgType = (pendingChanges.get(bgTypeKey)?.newValue ?? backgroundType) as CTABackground;
  const currentBgValue = pendingChanges.get(bgValueKey)?.newValue ?? backgroundValue;

  // Image position handling
  const positionKey = `${contentKeyPrefix}:imagePositionY`;
  const pendingPosition = pendingChanges.get(positionKey)?.newValue;
  const displayPositionY = pendingPosition !== undefined ? Number(pendingPosition) : localPositionY;
  const objectPosition = `center ${displayPositionY}%`;

  const handlePositionChange = useCallback((value: number) => {
    setLocalPositionY(value);
    updateContent(positionKey, String(value), 'text');
  }, [positionKey, updateContent]);

  // Alignment classes
  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const textAlignClass = alignmentClasses[alignment] || 'text-center';

  const handleSavePrimaryButton = useCallback((text: string, href: string, variant: 'primary' | 'secondary') => {
    updateContent(primaryTextKey, text, 'text');
    updateContent(primaryHrefKey, href, 'text');
    updateContent(primaryVariantKey, variant, 'text');
    setEditingButton(null);
  }, [primaryTextKey, primaryHrefKey, primaryVariantKey, updateContent]);

  const handleSaveSecondaryButton = useCallback((text: string, href: string, variant: 'primary' | 'secondary') => {
    updateContent(secondaryTextKey, text, 'text');
    updateContent(secondaryHrefKey, href, 'text');
    updateContent(secondaryVariantKey, variant, 'text');
    setEditingButton(null);
  }, [secondaryTextKey, secondaryHrefKey, secondaryVariantKey, updateContent]);

  const handleSaveBackground = useCallback((type: CTABackground, value: string) => {
    updateContent(bgTypeKey, type, 'text');
    updateContent(bgValueKey, value, 'text');
    if (type === 'image') {
      updateContent(bgImageKey, value, 'image');
    }
    setIsBackgroundEditorOpen(false);
  }, [bgTypeKey, bgValueKey, bgImageKey, updateContent]);

  const bgStyle = getBackgroundStyle(currentBgType, currentBgValue);

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <section
        className="relative section-padding overflow-hidden"
        style={bgStyle}
      >
        {/* Background image with overlay */}
        {currentBgType === 'image' && currentBgValue && (
          <div className="absolute inset-0 z-0">
            <SmartImage
              src={currentBgValue}
              alt="CTA background"
              fill
              className="object-cover"
              objectPosition={objectPosition}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}

        <div className={`section-container relative z-10 ${textAlignClass}`}>
          <h2 className="text-display-sm lg:text-display-md font-display font-bold text-jhr-white mb-6"
            {...renderInlineHtml(headline)}
          />
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
            {...renderInlineHtml(subtext)}
          />

          <div className={`flex flex-col sm:flex-row gap-4 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            <Link href={primaryBtnHref} className={getButtonClasses(primaryBtnVariant)}>
              {primaryBtnText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            {secondaryButton && (
              <Link href={secondaryBtnHref} className={getButtonClasses(secondaryBtnVariant)}>
                {secondaryBtnText}
              </Link>
            )}
          </div>

          {children}
        </div>
      </section>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <section
        className="relative section-padding overflow-hidden group/cta-section"
        style={bgStyle}
      >
        {/* Background image with overlay */}
        {currentBgType === 'image' && currentBgValue && (
          <div className="absolute inset-0 z-0">
            <EditableImage
              contentKey={bgImageKey}
              src={currentBgValue}
              alt="CTA background"
              fill
              className="object-cover"
              objectPosition={objectPosition}
            />
            <div className="absolute inset-0 bg-black/70 pointer-events-none" />
          </div>
        )}

        {/* Edit Mode Section Label */}
        {canEdit && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              CTA Section
            </span>
          </div>
        )}

        {/* Background Controls — right side */}
        {canEdit && (
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={() => setIsBackgroundEditorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full text-[10px] font-medium text-[#C9A227] uppercase tracking-wider hover:bg-[#C9A227]/30 transition-colors cursor-pointer"
            >
              <Palette className="w-3 h-3" />
              Edit Background
            </button>

            {/* Image position control — only show for image backgrounds */}
            {currentBgType === 'image' && currentBgValue && (
              <div className="bg-[#1A1A1A]/90 border border-[#C9A227]/40 rounded p-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Move className="w-3 h-3 text-[#C9A227]" />
                  <span className="text-[10px] font-medium text-[#C9A227] uppercase tracking-wider">
                    Vertical Position
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-400 w-6">Top</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={displayPositionY}
                    onChange={(e) => handlePositionChange(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#C9A227] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A227] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <span className="text-[9px] text-gray-400 w-8">Bottom</span>
                </div>
                <div className="text-center mt-1">
                  <span className="text-[9px] text-gray-500">{displayPositionY}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`section-container relative z-10 ${textAlignClass}`}>
          {/* Headline - Editable */}
          <div className="mb-6 relative">
            {canEdit && (
              <div className="mb-1">
                <FieldLabel
                  label="Headline (H2)"
                  icon={<Type className="w-3 h-3" />}
                />
              </div>
            )}
            <EditableText
              contentKey={`${contentKeyPrefix}:headline`}
              as="h2"
              className="text-display-sm lg:text-display-md font-display font-bold text-jhr-white"
              placeholder="Enter CTA headline..."
            >
              {headline}
            </EditableText>
          </div>

          {/* Subtext - Editable */}
          <div className="mb-8 relative max-w-2xl mx-auto">
            {canEdit && (
              <div className="mb-1">
                <FieldLabel
                  label="Subtext"
                  icon={<AlignLeft className="w-3 h-3" />}
                />
              </div>
            )}
            <EditableText
              contentKey={`${contentKeyPrefix}:subtext`}
              as="p"
              className="text-body-lg text-jhr-white-muted"
              multiline
              placeholder="Enter supporting text..."
            >
              {subtext}
            </EditableText>
          </div>

          {/* CTA Buttons - Editable */}
          <div className={`flex flex-col sm:flex-row gap-4 relative ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            {canEdit && (
              <div className="absolute -top-6 left-0">
                <FieldLabel
                  label="CTA Buttons"
                  icon={<MousePointerClick className="w-3 h-3" />}
                />
              </div>
            )}

            {/* Primary Button */}
            <div className="relative group/btn">
              <Link
                href={primaryBtnHref}
                className={getButtonClasses(primaryBtnVariant)}
                onClick={(e) => {
                  if (canEdit) {
                    e.preventDefault();
                    setEditingButton('primary');
                  }
                }}
              >
                {primaryBtnText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              {canEdit && (
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/btn:border-[#C9A227]/60 rounded-lg pointer-events-none transition-colors" />
              )}
            </div>

            {/* Secondary Button */}
            {(secondaryButton || canEdit) && (
              <div className="relative group/btn">
                <Link
                  href={secondaryBtnHref}
                  className={getButtonClasses(secondaryBtnVariant)}
                  onClick={(e) => {
                    if (canEdit) {
                      e.preventDefault();
                      setEditingButton('secondary');
                    }
                  }}
                >
                  {secondaryBtnText || 'Secondary CTA'}
                </Link>
                {canEdit && (
                  <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/btn:border-[#C9A227]/60 rounded-lg pointer-events-none transition-colors" />
                )}
              </div>
            )}
          </div>

          {children}
        </div>

        {/* Edit mode border indicator */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/30 pointer-events-none z-20 group-hover/cta-section:border-[#C9A227]/60 transition-colors" />
        )}
      </section>

      {/* Button Editor Modal */}
      {editingButton === 'primary' && (
        <CTAButtonEditor
          label="Primary Button"
          text={primaryBtnText}
          href={primaryBtnHref}
          variant={primaryBtnVariant}
          onSave={handleSavePrimaryButton}
          onClose={() => setEditingButton(null)}
        />
      )}
      {editingButton === 'secondary' && (
        <CTAButtonEditor
          label="Secondary Button"
          text={secondaryBtnText}
          href={secondaryBtnHref}
          variant={secondaryBtnVariant}
          onSave={handleSaveSecondaryButton}
          onClose={() => setEditingButton(null)}
        />
      )}

      {/* Background Editor Modal */}
      {isBackgroundEditorOpen && (
        <BackgroundEditor
          backgroundType={currentBgType}
          backgroundValue={currentBgValue}
          onSave={handleSaveBackground}
          onClose={() => setIsBackgroundEditorOpen(false)}
        />
      )}
    </>
  );
}
