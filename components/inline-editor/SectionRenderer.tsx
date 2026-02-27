'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Video, X, Youtube } from 'lucide-react';
import { EditableHero } from './EditableHero';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { FadeUp, FadeIn } from '@/components/ui/ScrollAnimation';

const MediaPicker = dynamic(() => import('@/components/admin/media/MediaPicker'));

// Lazy-load below-fold section components for faster initial page load
const EditableFeatureGrid = dynamic(() => import('./EditableFeatureGrid').then(m => ({ default: m.EditableFeatureGrid })));
const EditableImageGallery = dynamic(() => import('./EditableImageGallery').then(m => ({ default: m.EditableImageGallery })));
const EditableCTA = dynamic(() => import('./EditableCTA').then(m => ({ default: m.EditableCTA })));
const EditableFAQ = dynamic(() => import('./EditableFAQ').then(m => ({ default: m.EditableFAQ })));
const EditableTestimonials = dynamic(() => import('./EditableTestimonials').then(m => ({ default: m.EditableTestimonials })));
const EditableTextBlock = dynamic(() => import('./EditableTextBlock').then(m => ({ default: m.EditableTextBlock })));
const EditableColumns = dynamic(() => import('./EditableColumns').then(m => ({ default: m.EditableColumns })));
const EditableStats = dynamic(() => import('./EditableStats').then(m => ({ default: m.EditableStats })));
const EditableTabbedContent = dynamic(() => import('./EditableTabbedContent').then(m => ({ default: m.EditableTabbedContent })));
const EditableTeamGrid = dynamic(() => import('./EditableTeamGrid').then(m => ({ default: m.EditableTeamGrid })));
import type {
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  CTASectionContent,
  FAQSectionContent,
  TestimonialsSectionContent,
  ColumnsSectionContent,
  StatsSectionContent,
  TabbedContentSectionContent,
  TeamGridSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// YouTube URL Parser
// ============================================================================

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ============================================================================
// Types
// ============================================================================

interface SectionRendererProps {
  /** The section data to render. */
  section: PageSectionContent;
  /** Page slug used for content key prefix (e.g., "about", "home"). */
  pageSlug: string;
  /**
   * Optional override for the content key prefix base.
   * Defaults to `${pageSlug}:${section.id}`.
   * Venue detail pages use `venue-${slug}:${sectionId}`.
   */
  contentKeyPrefix?: string;
  /**
   * Optional map of sectionId → CSS class for the outer <section> wrapper.
   * Used to apply page-specific background classes per section.
   * Falls back to sensible defaults per section type.
   */
  sectionClassMap?: Record<string, string>;
  /**
   * Optional children to pass to EditableHero (e.g., trust badges).
   */
  heroChildren?: React.ReactNode;
  /**
   * If true, this section is rendered inside a columns container.
   * Prevents nesting columns-inside-columns and excludes hero sections.
   */
  isNested?: boolean;
}

// ============================================================================
// Default section wrapper classes per type
// ============================================================================

const DEFAULT_SECTION_CLASSES: Record<string, string> = {
  'feature-grid': 'section-padding bg-jhr-black',
  'image-gallery': 'section-padding bg-jhr-black-light',
  'faq': 'section-padding bg-jhr-black',
  'testimonials': 'section-padding section-light',
  'text-block': 'section-padding bg-jhr-black',
  'columns': 'section-padding bg-jhr-black',
  'stats': 'section-padding bg-jhr-black-light',
  'tabbed-content': 'section-padding bg-[#0B0C0F]',
  'team-grid': 'section-padding bg-jhr-black',
};

// ============================================================================
// Section wrapper for types that need <section><div className="section-container">
// ============================================================================

function SectionShell({
  className,
  children,
  videoSrc,
  sectionId,
}: {
  className: string;
  children: React.ReactNode;
  videoSrc?: string;
  sectionId?: string;
}) {
  const { isEditMode, canEdit } = useEditMode();
  const { updateSection } = useContent();
  const [showPicker, setShowPicker] = useState(false);
  const [showYouTubeInput, setShowYouTubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const showEditControls = canEdit && isEditMode && sectionId;

  // Detect YouTube video background
  const isYouTube = videoSrc?.startsWith('youtube:');
  const youtubeId = isYouTube ? videoSrc!.slice(8) : null;

  const handleYouTubeSubmit = () => {
    const id = parseYouTubeId(youtubeUrl.trim());
    if (id && sectionId) {
      updateSection(sectionId, { backgroundVideo: `youtube:${id}` });
      setYoutubeUrl('');
      setShowYouTubeInput(false);
    }
  };

  return (
    <section className={`${className}${videoSrc ? ' relative overflow-hidden' : ''} group/shell`}>
      {videoSrc && !isYouTube && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {isYouTube && youtubeId && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1`}
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-video"
              style={{ transform: 'translate(-50%, -50%) scale(1.2)' }}
              title="Background video"
              frameBorder="0"
            />
          </div>
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {/* Edit-mode video BG controls */}
      {showEditControls && (
        <div className={`absolute top-2 left-2 z-30 flex flex-col items-start gap-1 transition-opacity ${videoSrc ? 'opacity-100' : 'opacity-0 group-hover/shell:opacity-100'}`}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium hover:bg-black/90 backdrop-blur-sm"
            >
              <Video className="w-3 h-3" />
              {videoSrc ? 'Change' : 'Video BG'}
            </button>
            <button
              onClick={() => setShowYouTubeInput(!showYouTubeInput)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium hover:bg-black/90 backdrop-blur-sm"
            >
              <Youtube className="w-3 h-3" />
              YT
            </button>
            {videoSrc && (
              <button
                onClick={() => updateSection(sectionId, { backgroundVideo: undefined })}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-900/70 text-white text-xs font-medium hover:bg-red-900/90 backdrop-blur-sm"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {showYouTubeInput && (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSubmit()}
                placeholder="YouTube URL or ID..."
                className="px-2 py-1 rounded-md bg-black/80 border border-[#444] text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#C9A227] w-56 backdrop-blur-sm"
              />
              <button
                onClick={handleYouTubeSubmit}
                className="px-2 py-1 rounded-md bg-[#C9A227] text-black text-xs font-medium hover:bg-[#D4AF37]"
              >
                Set
              </button>
              <button
                onClick={() => { setShowYouTubeInput(false); setYoutubeUrl(''); }}
                className="px-1.5 py-1 rounded-md bg-black/70 text-gray-400 text-xs hover:text-white backdrop-blur-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {showPicker && (
        <MediaPicker
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={(results) => {
            if (results.length > 0 && sectionId) {
              updateSection(sectionId, { backgroundVideo: results[0].publicUrl });
            }
            setShowPicker(false);
          }}
          options={{ allowedTypes: ['video'] }}
        />
      )}

      <div className={`section-container${videoSrc ? ' relative z-10' : ''}`}>
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// Scroll Animation Wrapper (view mode only)
// ============================================================================

/**
 * Maps section type → scroll animation component.
 * In edit mode, renders children directly (no animation interference).
 */
function AnimatedSection({
  type,
  isEditMode,
  children,
}: {
  type: string;
  isEditMode: boolean;
  children: React.ReactNode;
}) {
  if (isEditMode) return <>{children}</>;

  switch (type) {
    case 'feature-grid':
      // All display modes (default, alternating, journey, horizontal, logo-scroll)
      // handle their own entrance animations — no parent FadeUp needed.
      return <>{children}</>;
    case 'cta':
      return <FadeUp once>{children}</FadeUp>;
    case 'faq':
      return <FadeUp once>{children}</FadeUp>;
    case 'testimonials':
      return <FadeUp once>{children}</FadeUp>;
    case 'text-block':
      return <FadeUp once>{children}</FadeUp>;
    case 'columns':
      return <FadeUp once>{children}</FadeUp>;
    case 'stats':
      return <FadeUp once>{children}</FadeUp>;
    case 'tabbed-content':
      return <FadeUp once>{children}</FadeUp>;
    case 'team-grid':
      // Team grid can be very tall on mobile (single column of many cards).
      // FadeUp's amount threshold would never trigger, hiding the section.
      return <>{children}</>;
    case 'image-gallery':
      return <FadeIn once>{children}</FadeIn>;
    default:
      return <>{children}</>;
  }
}

// ============================================================================
// SectionRenderer Component
// Universal mapper: section type → Editable* component.
// Works for BOTH view and edit mode (Editable* components branch internally).
// ============================================================================

export function SectionRenderer({
  section,
  pageSlug,
  contentKeyPrefix: prefixOverride,
  sectionClassMap,
  heroChildren,
  isNested,
}: SectionRendererProps) {
  const prefix = prefixOverride ?? `${pageSlug}:${section.id}`;
  const { isEditMode } = useEditMode();

  // Resolve the CSS class for the section wrapper
  const sectionClass =
    sectionClassMap?.[section.id] ??
    DEFAULT_SECTION_CLASSES[section.type] ??
    'section-padding bg-jhr-black';

  switch (section.type) {
    case 'hero': {
      const hero = section as HeroSectionContent;
      // Hero already has its own motion animations — no wrapper needed
      return (
        <EditableHero
          contentKeyPrefix={prefix}
          title={hero.title}
          subtitle={hero.subtitle}
          description={hero.description}
          image={hero.backgroundImage?.src || '/images/generated/hero-homepage.jpg'}
          imageAlt={hero.backgroundImage?.alt || 'Hero background'}
          imagePositionY={hero.backgroundImage?.positionY ?? 50}
          primaryCta={hero.buttons?.[0]}
          secondaryCta={hero.buttons?.[1]}
          variant={hero.variant}
          imagePosition={hero.imagePosition}
          backgroundVideo={hero.backgroundVideo}
          sectionId={hero.id}
        >
          {heroChildren}
        </EditableHero>
      );
    }

    case 'feature-grid': {
      const grid = section as FeatureGridSectionContent;
      return (
        <AnimatedSection type="feature-grid" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} videoSrc={section.backgroundVideo} sectionId={section.id}>
            <EditableFeatureGrid
              contentKeyPrefix={prefix}
              heading={grid.heading}
              subheading={grid.subheading}
              columns={grid.columns}
              features={grid.features}
              displayMode={grid.displayMode}
              showStepNumbers={grid.showStepNumbers}
              cardVariant={grid.cardVariant}
              scrollSpeed={grid.scrollSpeed}
              scrollDirection={grid.scrollDirection}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'image-gallery': {
      const gallery = section as ImageGallerySectionContent;
      const carouselProps = {
        carouselHeight: gallery.carouselHeight,
        carouselGap: gallery.carouselGap,
        carouselSpeed: gallery.carouselSpeed,
        carouselDirection: gallery.carouselDirection,
      };
      if (isNested) {
        return (
          <div className="h-full flex items-center">
            <div className="w-full">
              <EditableImageGallery
                contentKeyPrefix={prefix}
                heading={gallery.heading}
                layout={gallery.layout}
                images={gallery.images}
                singleImageFit={gallery.singleImageFit}
                {...carouselProps}
              />
            </div>
          </div>
        );
      }
      return (
        <AnimatedSection type="image-gallery" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableImageGallery
              contentKeyPrefix={prefix}
              heading={gallery.heading}
              layout={gallery.layout}
              images={gallery.images}
              singleImageFit={gallery.singleImageFit}
              {...carouselProps}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'cta': {
      const cta = section as CTASectionContent;
      return (
        <AnimatedSection type="cta" isEditMode={isEditMode}>
          <EditableCTA
            contentKeyPrefix={prefix}
            headline={cta.headline}
            subtext={cta.subtext}
            primaryButton={cta.primaryButton}
            secondaryButton={cta.secondaryButton}
            backgroundType={cta.backgroundType}
            backgroundValue={cta.backgroundValue}
            imagePositionY={cta.imagePositionY}
            alignment="center"
          />
        </AnimatedSection>
      );
    }

    case 'faq': {
      const faq = section as FAQSectionContent;
      return (
        <AnimatedSection type="faq" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableFAQ
              contentKeyPrefix={prefix}
              heading={faq.heading}
              items={faq.items}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'testimonials': {
      const testimonials = section as TestimonialsSectionContent;
      return (
        <AnimatedSection type="testimonials" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableTestimonials
              contentKeyPrefix={prefix}
              heading={testimonials.heading}
              layout={testimonials.layout}
              cardVariant={testimonials.cardVariant}
              testimonials={testimonials.testimonials}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'text-block': {
      const textBlock = section as TextBlockSectionContent;
      if (isNested) {
        return (
          <div className="h-full flex items-center">
            <div className="w-full">
              <EditableTextBlock
                contentKeyPrefix={prefix}
                heading={textBlock.heading}
                content={textBlock.content}
              />
            </div>
          </div>
        );
      }
      return (
        <AnimatedSection type="text-block" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} videoSrc={section.backgroundVideo} sectionId={section.id}>
            <EditableTextBlock
              contentKeyPrefix={prefix}
              heading={textBlock.heading}
              content={textBlock.content}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'columns': {
      // Prevent columns-inside-columns nesting
      if (isNested) return null;
      const columns = section as ColumnsSectionContent;
      return (
        <AnimatedSection type="columns" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableColumns
              section={columns}
              pageSlug={pageSlug}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'stats': {
      const statsSection = section as StatsSectionContent;
      return (
        <AnimatedSection type="stats" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableStats
              contentKeyPrefix={prefix}
              heading={statsSection.heading}
              subheading={statsSection.subheading}
              stats={statsSection.stats}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'tabbed-content': {
      const tabbed = section as TabbedContentSectionContent;
      return (
        <AnimatedSection type="tabbed-content" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} videoSrc={section.backgroundVideo} sectionId={section.id}>
            <EditableTabbedContent
              contentKeyPrefix={prefix}
              heading={tabbed.heading}
              sectionLabel={tabbed.sectionLabel}
              tabs={tabbed.tabs}
              variant={tabbed.variant}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'team-grid': {
      const team = section as TeamGridSectionContent;
      return (
        <AnimatedSection type="team-grid" isEditMode={isEditMode}>
          <SectionShell className={sectionClass} sectionId={section.id}>
            <EditableTeamGrid
              contentKeyPrefix={prefix}
              heading={team.heading}
              subheading={team.subheading}
              members={team.members}
              columns={team.columns}
              showRecruitmentCTA={team.showRecruitmentCTA}
              recruitmentHeading={team.recruitmentHeading}
              recruitmentDescription={team.recruitmentDescription}
              recruitmentButton={team.recruitmentButton}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    default:
      return null;
  }
}
