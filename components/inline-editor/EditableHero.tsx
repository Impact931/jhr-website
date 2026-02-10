'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { ArrowRight, Pencil, X, Type, AlignLeft, ImageIcon, MousePointerClick, Move } from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import type { HeroVariant, CTAButton } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableHeroProps {
  /** Content key prefix for all hero fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Main headline text. */
  title: string;
  /** Supporting subtitle text. */
  subtitle?: string;
  /** Description paragraph text. */
  description?: string;
  /** Background image source URL. */
  image: string;
  /** Background image alt text. */
  imageAlt: string;
  /** Background image vertical position (0-100, 0=top, 50=center, 100=bottom). */
  imagePositionY?: number;
  /** Primary CTA button config. */
  primaryCta?: CTAButton | { text: string; href: string };
  /** Secondary CTA button config. */
  secondaryCta?: CTAButton | { text: string; href: string };
  /** Badge text above the headline. */
  badge?: string;
  /** Overlay style. */
  overlay?: 'dark' | 'darker' | 'gradient';
  /** Hero height variant. */
  variant?: HeroVariant;
  /** Height setting matching HeroBanner (mapped from variant). */
  height?: 'full' | 'large' | 'medium';
  /** Image position for split variant ('left' or 'right'). */
  imagePosition?: 'left' | 'right';
  /** Additional children rendered below CTAs. */
  children?: ReactNode;
}

// ============================================================================
// Helper: Map HeroVariant to height class
// ============================================================================

function getHeightClass(variant?: HeroVariant, height?: 'full' | 'large' | 'medium'): string {
  // If height is explicitly provided, use that
  if (height) {
    const heightClasses: Record<string, string> = {
      full: 'min-h-screen',
      large: 'min-h-[85vh]',
      medium: 'min-h-[60vh]',
    };
    return heightClasses[height] || 'min-h-[85vh]';
  }
  // Otherwise map from variant
  if (variant) {
    const variantClasses: Record<HeroVariant, string> = {
      'full-height': 'min-h-screen',
      'half-height': 'min-h-[50vh]',
      'banner': 'min-h-[40vh]',
      'split': 'min-h-[85vh]',
    };
    return variantClasses[variant];
  }
  return 'min-h-[85vh]';
}

/**
 * Render text that may contain inline HTML (color spans, bold, italic).
 * Returns dangerouslySetInnerHTML props if HTML is present, otherwise plain text.
 */
function renderInlineHtml(text: string): { dangerouslySetInnerHTML: { __html: string } } | { children: string } {
  if (text.includes('<')) {
    return { dangerouslySetInnerHTML: { __html: text } };
  }
  return { children: text };
}

function getOverlayClass(overlay: 'dark' | 'darker' | 'gradient'): string {
  const overlayClasses = {
    dark: 'bg-black/60',
    darker: 'bg-black/75',
    gradient: 'bg-gradient-to-r from-black/90 via-black/70 to-black/40',
  };
  return overlayClasses[overlay];
}

// ============================================================================
// CTA Editor Modal
// ============================================================================

interface CTAEditorProps {
  label: string;
  text: string;
  href: string;
  onSave: (text: string, href: string) => void;
  onClose: () => void;
}

function CTAEditor({ label, text, href, onSave, onClose }: CTAEditorProps) {
  const [editText, setEditText] = useState(text);
  const [editHref, setEditHref] = useState(href);

  const handleSave = useCallback(() => {
    onSave(editText, editHref);
  }, [editText, editHref, onSave]);

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
// EditableHero Component
// ============================================================================

export function EditableHero({
  contentKeyPrefix,
  title,
  subtitle,
  description,
  image,
  imageAlt,
  imagePositionY = 50,
  primaryCta,
  secondaryCta,
  badge,
  overlay = 'gradient',
  variant,
  height,
  imagePosition = 'right',
  children,
}: EditableHeroProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // CTA editor state
  const [editingCta, setEditingCta] = useState<'primary' | 'secondary' | null>(null);
  // Background image picker state
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  // Image position state (for live preview during drag)
  const [localPositionY, setLocalPositionY] = useState(imagePositionY);

  // Sync local position state when prop changes (e.g., draft loaded)
  useEffect(() => {
    setLocalPositionY(imagePositionY);
  }, [imagePositionY]);

  // Resolve display values from pending changes
  const primaryTextKey = `${contentKeyPrefix}:primaryCta-text`;
  const primaryHrefKey = `${contentKeyPrefix}:primaryCta-href`;
  const secondaryTextKey = `${contentKeyPrefix}:secondaryCta-text`;
  const secondaryHrefKey = `${contentKeyPrefix}:secondaryCta-href`;

  const primaryCtaText = pendingChanges.get(primaryTextKey)?.newValue ?? primaryCta?.text ?? '';
  const primaryCtaHref = pendingChanges.get(primaryHrefKey)?.newValue ?? primaryCta?.href ?? '#';
  const secondaryCtaText = pendingChanges.get(secondaryTextKey)?.newValue ?? secondaryCta?.text ?? '';
  const secondaryCtaHref = pendingChanges.get(secondaryHrefKey)?.newValue ?? secondaryCta?.href ?? '#';

  const handleSavePrimaryCta = useCallback((text: string, href: string) => {
    updateContent(primaryTextKey, text, 'text');
    updateContent(primaryHrefKey, href, 'text');
    setEditingCta(null);
  }, [primaryTextKey, primaryHrefKey, updateContent]);

  const handleSaveSecondaryCta = useCallback((text: string, href: string) => {
    updateContent(secondaryTextKey, text, 'text');
    updateContent(secondaryHrefKey, href, 'text');
    setEditingCta(null);
  }, [secondaryTextKey, secondaryHrefKey, updateContent]);

  const handleBgImageSelect = useCallback((results: MediaPickerResult[]) => {
    if (results.length > 0) {
      updateContent(`${contentKeyPrefix}:backgroundImage`, results[0].publicUrl, 'image');
    }
    setIsBgPickerOpen(false);
  }, [contentKeyPrefix, updateContent]);

  // Image position handling
  const positionKey = `${contentKeyPrefix}:imagePositionY`;
  const pendingPosition = pendingChanges.get(positionKey)?.newValue;
  const displayPositionY = pendingPosition !== undefined ? Number(pendingPosition) : localPositionY;
  const objectPosition = `center ${displayPositionY}%`;

  const handlePositionChange = useCallback((value: number) => {
    setLocalPositionY(value);
    updateContent(positionKey, String(value), 'text');
  }, [positionKey, updateContent]);

  const heightClass = getHeightClass(variant, height);
  const overlayClass = getOverlayClass(overlay);
  const imageContentKey = `${contentKeyPrefix}:backgroundImage`;

  // ---- Split Variant (View Mode) ----
  if (!isEditMode && variant === 'split') {
    const isImageLeft = imagePosition === 'left';
    return (
      <section className="relative bg-[#0B0C0F] min-h-[85vh] flex items-center">
        <div className={`w-full flex flex-col ${isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          {/* Text side */}
          <div className="w-full md:w-[45%] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 md:py-20">
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-8 h-[2px] bg-jhr-gold" />
                <span className="text-jhr-gold font-medium text-body-sm uppercase tracking-widest"
                  {...renderInlineHtml(subtitle)}
                />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-display-sm sm:text-display-md lg:text-[3.25rem] lg:leading-[1.15] font-display font-bold text-jhr-white mb-6"
              {...renderInlineHtml(title)}
            />

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-body-lg text-jhr-white-muted mb-8 leading-relaxed"
                {...renderInlineHtml(description)}
              />
            )}

            {(primaryCta || secondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {primaryCta && (
                  <Link href={primaryCtaHref} className="btn-primary">
                    {primaryCtaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
                {secondaryCta && (
                  <Link href={secondaryCtaHref} className="btn-secondary">
                    {secondaryCtaText}
                  </Link>
                )}
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Image side */}
          <div className="w-full md:w-[55%] relative min-h-[300px] md:min-h-[85vh]">
            <SmartImage
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              objectPosition={objectPosition}
              priority
              quality={90}
            />
          </div>
        </div>
      </section>
    );
  }

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <section className={`relative ${heightClass} flex items-center`}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            objectPosition={objectPosition}
            priority
            quality={90}
          />
          <div className={`absolute inset-0 ${overlayClass}`} />
        </div>

        {/* Content */}
        <div className="relative z-10 section-container py-20 lg:py-32">
          <div className="max-w-3xl">
            {badge && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-jhr-gold font-medium text-body-lg mb-4"
              >
                {badge}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4"
              {...renderInlineHtml(title)}
            />

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-jhr-gold font-medium text-body-lg mb-6"
                {...renderInlineHtml(subtitle)}
              />
            )}

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-body-lg text-jhr-white-muted mb-8"
                {...renderInlineHtml(description)}
              />
            )}

            {(primaryCta || secondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {primaryCta && (
                  <Link href={primaryCtaHref} className="btn-primary">
                    {primaryCtaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
                {secondaryCta && (
                  <Link href={secondaryCtaHref} className="btn-secondary">
                    {secondaryCtaText}
                  </Link>
                )}
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-jhr-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-jhr-gold rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <section className={`relative ${heightClass} flex items-center group/hero`}>
        {/* Background Image - Editable */}
        <div className="absolute inset-0 z-0">
          <EditableImage
            contentKey={imageContentKey}
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            objectPosition={objectPosition}
            priority
          />
          <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />
        </div>

        {/* Edit Mode Section Label — offset below fixed header */}
        {canEdit && (
          <div className="absolute top-20 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Hero Section
            </span>
          </div>
        )}

        {/* Background Image Controls — right side */}
        {canEdit && (
          <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
            {/* Image picker button */}
            <button
              onClick={() => setIsBgPickerOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C9A227]/30 hover:bg-[#C9A227]/60 border border-[#C9A227]/60 hover:border-[#C9A227] rounded text-[11px] font-medium text-[#C9A227] uppercase tracking-wider cursor-pointer transition-colors"
            >
              <ImageIcon className="w-3 h-3" />
              Background Image
            </button>

            {/* Image position control */}
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
          </div>
        )}

        {/* Content — extra top padding in edit mode to clear fixed header */}
        <div className="relative z-10 section-container pt-28 pb-20 lg:pt-36 lg:pb-32">
          <div className="max-w-3xl">
            {/* Title - Editable */}
            <div className="mb-4 relative">
              {canEdit && (
                <div className="mb-1">
                  <FieldLabel
                    label="Title (H1)"
                    icon={<Type className="w-3 h-3" />}
                  />
                </div>
              )}
              <EditableText
                contentKey={`${contentKeyPrefix}:title`}
                as="h1"
                className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white"
                placeholder="Enter headline..."
              >
                {title}
              </EditableText>
            </div>

            {/* Subtitle - Editable (below title) */}
            {(subtitle || canEdit) && (
              <div className="mb-6 relative">
                {canEdit && (
                  <div className="mb-1">
                    <FieldLabel
                      label="Subtitle"
                      icon={<Type className="w-3 h-3" />}
                    />
                  </div>
                )}
                <EditableText
                  contentKey={`${contentKeyPrefix}:subtitle`}
                  as="p"
                  className="text-jhr-gold font-medium text-body-lg"
                  placeholder="Enter subtitle..."
                >
                  {subtitle || ''}
                </EditableText>
              </div>
            )}

            {/* Description - Editable */}
            {(description || canEdit) && (
              <div className="mb-8 relative">
                {canEdit && (
                  <div className="mb-1">
                    <FieldLabel
                      label="Description"
                      icon={<AlignLeft className="w-3 h-3" />}
                    />
                  </div>
                )}
                <EditableText
                  contentKey={`${contentKeyPrefix}:description`}
                  as="p"
                  className="text-body-lg text-jhr-white-muted"
                  multiline
                  placeholder="Enter description..."
                >
                  {description || ''}
                </EditableText>
              </div>
            )}

            {/* CTA Buttons - Editable */}
            {(primaryCta || secondaryCta || canEdit) && (
              <div className="flex flex-col sm:flex-row gap-4 relative">
                {canEdit && (
                  <div className="absolute -top-6 left-0">
                    <FieldLabel
                      label="CTA Buttons"
                      icon={<MousePointerClick className="w-3 h-3" />}
                    />
                  </div>
                )}

                {/* Primary CTA */}
                {(primaryCta || canEdit) && (
                  <div className="relative group/cta">
                    <Link
                      href={primaryCtaHref}
                      className="btn-primary"
                      onClick={(e) => {
                        if (canEdit) {
                          e.preventDefault();
                          setEditingCta('primary');
                        }
                      }}
                    >
                      {primaryCtaText || 'Primary CTA'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    {canEdit && (
                      <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/cta:border-[#C9A227]/60 rounded-lg pointer-events-none transition-colors" />
                    )}
                  </div>
                )}

                {/* Secondary CTA */}
                {(secondaryCta || canEdit) && (
                  <div className="relative group/cta">
                    <Link
                      href={secondaryCtaHref}
                      className="btn-secondary"
                      onClick={(e) => {
                        if (canEdit) {
                          e.preventDefault();
                          setEditingCta('secondary');
                        }
                      }}
                    >
                      {secondaryCtaText || 'Secondary CTA'}
                    </Link>
                    {canEdit && (
                      <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/cta:border-[#C9A227]/60 rounded-lg pointer-events-none transition-colors" />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Children (trust badges, etc.) */}
            {children && (
              <div className="mt-8">
                {children}
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-jhr-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-jhr-gold rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Edit mode border indicator */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/30 pointer-events-none z-20 group-hover/hero:border-[#C9A227]/60 transition-colors" />
        )}
      </section>

      {/* CTA Editor Modal */}
      {editingCta === 'primary' && primaryCta && (
        <CTAEditor
          label="Primary Button"
          text={primaryCtaText}
          href={primaryCtaHref}
          onSave={handleSavePrimaryCta}
          onClose={() => setEditingCta(null)}
        />
      )}
      {editingCta === 'secondary' && secondaryCta && (
        <CTAEditor
          label="Secondary Button"
          text={secondaryCtaText}
          href={secondaryCtaHref}
          onSave={handleSaveSecondaryCta}
          onClose={() => setEditingCta(null)}
        />
      )}

      {/* Background image picker */}
      <MediaPicker
        isOpen={isBgPickerOpen}
        onClose={() => setIsBgPickerOpen(false)}
        onSelect={handleBgImageSelect}
        options={{ allowedTypes: ['image'] }}
      />
    </>
  );
}
