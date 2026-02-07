'use client';

import { EditableHero } from './EditableHero';
import { EditableFeatureGrid } from './EditableFeatureGrid';
import { EditableImageGallery } from './EditableImageGallery';
import { EditableCTA } from './EditableCTA';
import { EditableFAQ } from './EditableFAQ';
import { EditableTestimonials } from './EditableTestimonials';
import { EditableTextBlock } from './EditableTextBlock';
import type {
  PageSectionContent,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  CTASectionContent,
  FAQSectionContent,
  TestimonialsSectionContent,
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
}: SectionRendererProps) {
  const prefix = prefixOverride ?? `${pageSlug}:${section.id}`;

  // Resolve the CSS class for the section wrapper
  const sectionClass =
    sectionClassMap?.[section.id] ??
    DEFAULT_SECTION_CLASSES[section.type] ??
    'section-padding bg-jhr-black';

  switch (section.type) {
    case 'hero': {
      const hero = section as HeroSectionContent;
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
        <SectionShell className={sectionClass}>
          <EditableFeatureGrid
            contentKeyPrefix={prefix}
            heading={grid.heading}
            subheading={grid.subheading}
            columns={grid.columns}
            features={grid.features}
          />
        </SectionShell>
      );
    }

    case 'image-gallery': {
      const gallery = section as ImageGallerySectionContent;
      return (
        <SectionShell className={sectionClass}>
          <EditableImageGallery
            contentKeyPrefix={prefix}
            heading={gallery.heading}
            layout={gallery.layout}
            images={gallery.images}
          />
        </SectionShell>
      );
    }

    case 'cta': {
      const cta = section as CTASectionContent;
      return (
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
      );
    }

    case 'faq': {
      const faq = section as FAQSectionContent;
      return (
        <SectionShell className={sectionClass}>
          <EditableFAQ
            contentKeyPrefix={prefix}
            heading={faq.heading}
            items={faq.items}
          />
        </SectionShell>
      );
    }

    case 'testimonials': {
      const testimonials = section as TestimonialsSectionContent;
      return (
        <SectionShell className={sectionClass}>
          <EditableTestimonials
            contentKeyPrefix={prefix}
            heading={testimonials.heading}
            layout={testimonials.layout}
            cardVariant={testimonials.cardVariant}
            testimonials={testimonials.testimonials}
          />
        </SectionShell>
      );
    }

    case 'text-block': {
      const textBlock = section as TextBlockSectionContent;
      return (
        <SectionShell className={sectionClass}>
          <EditableTextBlock
            contentKeyPrefix={prefix}
            heading={textBlock.heading}
            content={textBlock.content}
          />
        </SectionShell>
      );
    }

    default:
      return null;
  }
}
