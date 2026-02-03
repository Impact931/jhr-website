import { NextRequest, NextResponse } from 'next/server';
import { getPageSections } from '@/lib/content';
import { ContentStatus } from '@/types/content';
import {
  FIELD_CONSTRAINTS,
  SECTION_TYPE_META,
} from '@/types/inline-editor';
import type {
  PageSectionContent,
  PageSEOMetadata,
  InlineSectionType,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  ImageGallerySectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
  FAQSectionContent,
} from '@/types/inline-editor';

// ============================================================================
// AI-Friendly Content Export API
// ============================================================================

/**
 * Field constraint lookup for a section type and field name.
 * Returns the constraint object from FIELD_CONSTRAINTS, or undefined.
 */
function getConstraint(key: string) {
  return FIELD_CONSTRAINTS[key] || undefined;
}

/**
 * Format a single constraint as a concise inline annotation.
 */
function formatConstraint(key: string): Record<string, unknown> | undefined {
  const c = getConstraint(key);
  if (!c) return undefined;
  const result: Record<string, unknown> = {};
  if (c.maxLength) result.maxLength = c.maxLength;
  if (c.allowedTags) result.allowedTags = c.allowedTags;
  result._hint = c.description;
  return result;
}

// ============================================================================
// Section Exporters - produce concise, documented JSON per section type
// ============================================================================

function exportHero(section: HeroSectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META.hero.description,
    variant: section.variant,
    title: {
      value: section.title,
      ...formatConstraint('hero.title'),
    },
    subtitle: {
      value: section.subtitle,
      ...formatConstraint('hero.subtitle'),
    },
    description: section.description
      ? {
          value: section.description,
          ...formatConstraint('hero.description'),
        }
      : null,
    backgroundImage: section.backgroundImage
      ? {
          src: section.backgroundImage.src,
          alt: section.backgroundImage.alt,
          _altConstraint: formatConstraint('image.alt'),
        }
      : null,
    buttons: section.buttons.map((btn) => ({
      text: btn.text,
      href: btn.href,
      variant: btn.variant,
      _textConstraint: formatConstraint('cta-button.text'),
    })),
    seo: section.seo,
  };
}

function exportTextBlock(section: TextBlockSectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META['text-block'].description,
    heading: section.heading
      ? {
          value: section.heading,
          ...formatConstraint('text-block.heading'),
        }
      : null,
    content: {
      value: section.content,
      ...formatConstraint('text-block.content'),
    },
    alignment: section.alignment || 'left',
    seo: section.seo,
  };
}

function exportFeatureGrid(section: FeatureGridSectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META['feature-grid'].description,
    heading: section.heading
      ? {
          value: section.heading,
          ...formatConstraint('feature-grid.heading'),
        }
      : null,
    subheading: section.subheading
      ? {
          value: section.subheading,
          ...formatConstraint('feature-grid.subheading'),
        }
      : null,
    columns: section.columns,
    features: section.features.map((f) => ({
      id: f.id,
      icon: f.icon,
      title: {
        value: f.title,
        ...formatConstraint('feature-card.title'),
      },
      description: {
        value: f.description,
        ...formatConstraint('feature-card.description'),
      },
      link: f.link || null,
    })),
    seo: section.seo,
  };
}

function exportImageGallery(section: ImageGallerySectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META['image-gallery'].description,
    heading: section.heading
      ? {
          value: section.heading,
          ...formatConstraint('feature-grid.heading'),
        }
      : null,
    layout: section.layout,
    images: section.images.map((img) => ({
      src: img.src,
      alt: {
        value: img.alt,
        ...formatConstraint('image.alt'),
      },
      caption: img.caption
        ? {
            value: img.caption,
            ...formatConstraint('image.caption'),
          }
        : null,
    })),
    seo: section.seo,
  };
}

function exportCTA(section: CTASectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META.cta.description,
    headline: {
      value: section.headline,
      ...formatConstraint('cta.headline'),
    },
    subtext: {
      value: section.subtext,
      ...formatConstraint('cta.subtext'),
    },
    backgroundType: section.backgroundType,
    backgroundValue: section.backgroundValue,
    primaryButton: {
      text: section.primaryButton.text,
      href: section.primaryButton.href,
      variant: section.primaryButton.variant,
      _textConstraint: formatConstraint('cta-button.text'),
    },
    secondaryButton: section.secondaryButton
      ? {
          text: section.secondaryButton.text,
          href: section.secondaryButton.href,
          variant: section.secondaryButton.variant,
          _textConstraint: formatConstraint('cta-button.text'),
        }
      : null,
    seo: section.seo,
  };
}

function exportTestimonials(section: TestimonialsSectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META.testimonials.description,
    heading: section.heading
      ? {
          value: section.heading,
          ...formatConstraint('feature-grid.heading'),
        }
      : null,
    layout: section.layout,
    testimonials: section.testimonials.map((t) => ({
      id: t.id,
      quote: {
        value: t.quote,
        ...formatConstraint('testimonial.quote'),
      },
      authorName: {
        value: t.authorName,
        ...formatConstraint('testimonial.authorName'),
      },
      authorTitle: {
        value: t.authorTitle,
        ...formatConstraint('testimonial.authorTitle'),
      },
      authorImage: t.authorImage
        ? {
            src: t.authorImage.src,
            alt: t.authorImage.alt,
          }
        : null,
    })),
    seo: section.seo,
  };
}

function exportFAQ(section: FAQSectionContent) {
  return {
    id: section.id,
    type: section.type,
    order: section.order,
    _doc: SECTION_TYPE_META.faq.description,
    heading: section.heading
      ? {
          value: section.heading,
          ...formatConstraint('feature-grid.heading'),
        }
      : null,
    items: section.items.map((item) => ({
      id: item.id,
      question: {
        value: item.question,
        ...formatConstraint('faq.question'),
      },
      answer: {
        value: item.answer,
        ...formatConstraint('faq.answer'),
      },
    })),
    seo: section.seo,
  };
}

/**
 * Export a section as documented JSON based on its type.
 */
function exportSection(section: PageSectionContent) {
  switch (section.type) {
    case 'hero':
      return exportHero(section);
    case 'text-block':
      return exportTextBlock(section);
    case 'feature-grid':
      return exportFeatureGrid(section);
    case 'image-gallery':
      return exportImageGallery(section);
    case 'cta':
      return exportCTA(section);
    case 'testimonials':
      return exportTestimonials(section);
    case 'faq':
      return exportFAQ(section);
  }
}

/**
 * Build the section type reference documentation.
 * Concise overview of all section types and their fields for LLM context.
 */
function buildSectionTypeReference() {
  const types: Record<string, unknown> = {};
  const allTypes: InlineSectionType[] = [
    'hero',
    'text-block',
    'feature-grid',
    'image-gallery',
    'cta',
    'testimonials',
    'faq',
  ];

  for (const t of allTypes) {
    const meta = SECTION_TYPE_META[t];
    types[t] = {
      label: meta.label,
      description: meta.description,
      icon: meta.icon,
    };
  }

  return types;
}

/**
 * Build the field constraints reference.
 * Grouped by category for quick lookup.
 */
function buildConstraintsReference() {
  const grouped: Record<string, Record<string, unknown>> = {};

  for (const [key, constraint] of Object.entries(FIELD_CONSTRAINTS)) {
    const [category] = key.split('.');
    if (!grouped[category]) {
      grouped[category] = {};
    }
    const entry: Record<string, unknown> = {
      description: constraint.description,
    };
    if (constraint.maxLength) entry.maxLength = constraint.maxLength;
    if (constraint.allowedTags) entry.allowedTags = constraint.allowedTags;
    grouped[category][key] = entry;
  }

  return grouped;
}

/**
 * Export page SEO metadata with inline constraint hints.
 */
function exportSEO(seo: PageSEOMetadata) {
  return {
    pageTitle: {
      value: seo.pageTitle,
      ...formatConstraint('seo.pageTitle'),
    },
    metaDescription: {
      value: seo.metaDescription,
      ...formatConstraint('seo.metaDescription'),
    },
    ogImage: seo.ogImage || null,
    ogTitle: seo.ogTitle || null,
    ogDescription: seo.ogDescription || null,
    canonicalUrl: seo.canonicalUrl || null,
  };
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/admin/content/export
 *
 * Export page content as AI-friendly JSON with inline documentation,
 * field constraints, and section type reference.
 *
 * Optimized for LLM context windows: concise but complete.
 *
 * Query parameters:
 * - slug: Page slug (required)
 * - status: 'draft' or 'published' (optional, defaults to 'draft')
 * - includeReference: 'true' to include section type and constraint docs (default: true)
 *
 * Response shape:
 * {
 *   _format: "jhr-cms-export-v1",
 *   _instructions: "...",
 *   page: { slug, seo, sections, version, updatedAt },
 *   reference?: { sectionTypes, fieldConstraints }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const statusParam = searchParams.get('status');
    const includeReference = searchParams.get('includeReference') !== 'false';

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required parameter: slug' },
        { status: 400 }
      );
    }

    // Parse status
    let status: ContentStatus = ContentStatus.DRAFT;
    if (statusParam) {
      if (statusParam === 'draft') {
        status = ContentStatus.DRAFT;
      } else if (statusParam === 'published') {
        status = ContentStatus.PUBLISHED;
      } else {
        return NextResponse.json(
          { error: 'Invalid status parameter. Must be "draft" or "published"' },
          { status: 400 }
        );
      }
    }

    const content = await getPageSections(slug, status);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Build the export payload
    const exportPayload: Record<string, unknown> = {
      _format: 'jhr-cms-export-v1',
      _instructions: [
        'This is a structured export of a JHR Photography website page.',
        'Each section has a "type" field and type-specific content.',
        'Fields with "_hint" describe the purpose and constraints.',
        'Fields with "maxLength" must not exceed that character count.',
        'Fields with "allowedTags" list valid HTML tags for rich text.',
        'To update content, modify "value" fields and PUT to /api/admin/content/sections.',
        'Section order is determined by the "order" field (0-based).',
        'Section IDs must be preserved when updating existing sections.',
      ].join(' '),
      page: {
        slug: content.slug,
        status: statusParam || 'draft',
        version: content.version,
        updatedAt: content.updatedAt,
        updatedBy: content.updatedBy || null,
        seo: exportSEO(content.seo),
        sections: content.sections
          .sort((a, b) => a.order - b.order)
          .map(exportSection),
      },
    };

    // Optionally include the reference documentation
    if (includeReference) {
      exportPayload.reference = {
        _doc: 'Section type definitions and field constraints for content generation.',
        sectionTypes: buildSectionTypeReference(),
        fieldConstraints: buildConstraintsReference(),
      };
    }

    return NextResponse.json(exportPayload);
  } catch (error) {
    console.error('Error exporting content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
