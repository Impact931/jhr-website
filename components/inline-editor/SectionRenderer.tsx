'use client';

import dynamic from 'next/dynamic';
import { EditableHero } from './EditableHero';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { FadeUp, FadeIn } from '@/components/ui/ScrollAnimation';

// Lazy-load below-fold section components for faster initial page load
const EditableFeatureGrid = dynamic(() => import('./EditableFeatureGrid').then(m => ({ default: m.EditableFeatureGrid })));
const EditableImageGallery = dynamic(() => import('./EditableImageGallery').then(m => ({ default: m.EditableImageGallery })));
const EditableCTA = dynamic(() => import('./EditableCTA').then(m => ({ default: m.EditableCTA })));
const EditableFAQ = dynamic(() => import('./EditableFAQ').then(m => ({ default: m.EditableFAQ })));
const EditableTestimonials = dynamic(() => import('./EditableTestimonials').then(m => ({ default: m.EditableTestimonials })));
const EditableTextBlock = dynamic(() => import('./EditableTextBlock').then(m => ({ default: m.EditableTextBlock })));
const EditableColumns = dynamic(() => import('./EditableColumns').then(m => ({ default: m.EditableColumns })));
const EditableStats = dynamic(() => import('./EditableStats').then(m => ({ default: m.EditableStats })));
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
} from '@/types/inline-editor';

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
};

// ============================================================================
// Section wrapper for types that need <section><div className="section-container">
// ============================================================================

function SectionShell({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="section-container">
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
      return <FadeUp once>{children}</FadeUp>;
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
        >
          {heroChildren}
        </EditableHero>
      );
    }

    case 'feature-grid': {
      const grid = section as FeatureGridSectionContent;
      return (
        <AnimatedSection type="feature-grid" isEditMode={isEditMode}>
          <SectionShell className={sectionClass}>
            <EditableFeatureGrid
              contentKeyPrefix={prefix}
              heading={grid.heading}
              subheading={grid.subheading}
              columns={grid.columns}
              features={grid.features}
              displayMode={grid.displayMode}
            />
          </SectionShell>
        </AnimatedSection>
      );
    }

    case 'image-gallery': {
      const gallery = section as ImageGallerySectionContent;
      return (
        <AnimatedSection type="image-gallery" isEditMode={isEditMode}>
          <SectionShell className={sectionClass}>
            <EditableImageGallery
              contentKeyPrefix={prefix}
              heading={gallery.heading}
              layout={gallery.layout}
              images={gallery.images}
              singleImageFit={gallery.singleImageFit}
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
          <SectionShell className={sectionClass}>
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
          <SectionShell className={sectionClass}>
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
      return (
        <AnimatedSection type="text-block" isEditMode={isEditMode}>
          <SectionShell className={sectionClass}>
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
          <SectionShell className={sectionClass}>
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
          <SectionShell className={sectionClass}>
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

    default:
      return null;
  }
}
