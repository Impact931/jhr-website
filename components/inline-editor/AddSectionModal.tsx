'use client';

import { useState, useCallback } from 'react';
import {
  X,
  Layout,
  Type,
  Grid3X3,
  Image as ImagesIcon,
  MousePointerClick,
  Quote,
  HelpCircle,
  Columns,
  BarChart,
  ChevronRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import type { InlineSectionType } from '@/types/inline-editor';
import { SECTION_TYPE_META, createDefaultSection } from '@/types/inline-editor';
import type { PageSectionContent } from '@/types/inline-editor';

// ============================================================================
// Icon map (same as SectionWrapper)
// ============================================================================

const SECTION_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Type,
  Grid3X3,
  Images: ImagesIcon,
  MousePointerClick,
  Quote,
  HelpCircle,
  Columns,
  BarChart,
};

function getSectionIcon(iconName: string): React.ComponentType<{ className?: string }> {
  return SECTION_ICON_MAP[iconName] || Layout;
}

// ============================================================================
// Layout Variant Definitions
// ============================================================================

export interface LayoutVariant {
  /** Unique variant key */
  id: string;
  /** Display name */
  label: string;
  /** Short description */
  description: string;
  /** Visual preview - array of block descriptors for the SVG preview */
  previewBlocks: PreviewBlock[];
}

interface PreviewBlock {
  /** Block type for visual rendering */
  type: 'heading' | 'text' | 'image' | 'button' | 'icon-card' | 'testimonial-card' | 'faq-item' | 'spacer';
  /** Width as fraction of container (0-1) */
  width: number;
  /** Height in preview units */
  height: number;
  /** X offset (0-1) */
  x?: number;
  /** Y offset in preview units */
  y?: number;
}

/**
 * Layout variants for each section type.
 * Each section type has 2-3 layout variants with visual previews.
 */
const SECTION_VARIANTS: Record<InlineSectionType, LayoutVariant[]> = {
  hero: [
    {
      id: 'hero-full',
      label: 'Full Height',
      description: 'Full-screen hero with centered content and overlay',
      previewBlocks: [
        { type: 'image', width: 1, height: 120 },
        { type: 'heading', width: 0.6, height: 14, x: 0.2, y: 30 },
        { type: 'text', width: 0.5, height: 8, x: 0.25, y: 50 },
        { type: 'button', width: 0.2, height: 10, x: 0.4, y: 70 },
      ],
    },
    {
      id: 'hero-half',
      label: 'Half Height',
      description: 'Compact hero with background image, 50vh',
      previewBlocks: [
        { type: 'image', width: 1, height: 70 },
        { type: 'heading', width: 0.6, height: 12, x: 0.2, y: 15 },
        { type: 'text', width: 0.5, height: 8, x: 0.25, y: 32 },
        { type: 'button', width: 0.2, height: 10, x: 0.4, y: 48 },
      ],
    },
    {
      id: 'hero-banner',
      label: 'Banner',
      description: 'Slim banner with title and CTA, compact layout',
      previewBlocks: [
        { type: 'image', width: 1, height: 50 },
        { type: 'heading', width: 0.5, height: 12, x: 0.05, y: 12 },
        { type: 'text', width: 0.4, height: 6, x: 0.05, y: 28 },
        { type: 'button', width: 0.15, height: 8, x: 0.05, y: 38 },
      ],
    },
  ],
  'text-block': [
    {
      id: 'text-left',
      label: 'Left Aligned',
      description: 'Standard left-aligned rich text content',
      previewBlocks: [
        { type: 'heading', width: 0.5, height: 12, x: 0.05, y: 10 },
        { type: 'text', width: 0.9, height: 6, x: 0.05, y: 28 },
        { type: 'text', width: 0.85, height: 6, x: 0.05, y: 38 },
        { type: 'text', width: 0.7, height: 6, x: 0.05, y: 48 },
        { type: 'text', width: 0.88, height: 6, x: 0.05, y: 58 },
      ],
    },
    {
      id: 'text-center',
      label: 'Center Aligned',
      description: 'Centered text, great for quotes and intros',
      previewBlocks: [
        { type: 'heading', width: 0.5, height: 12, x: 0.25, y: 10 },
        { type: 'text', width: 0.7, height: 6, x: 0.15, y: 28 },
        { type: 'text', width: 0.6, height: 6, x: 0.2, y: 38 },
        { type: 'text', width: 0.65, height: 6, x: 0.175, y: 48 },
      ],
    },
    {
      id: 'text-with-heading',
      label: 'With Section Heading',
      description: 'Rich text with prominent section heading',
      previewBlocks: [
        { type: 'heading', width: 0.7, height: 16, x: 0.15, y: 6 },
        { type: 'spacer', width: 0.1, height: 2, x: 0.45, y: 26 },
        { type: 'text', width: 0.8, height: 6, x: 0.1, y: 34 },
        { type: 'text', width: 0.75, height: 6, x: 0.1, y: 44 },
        { type: 'text', width: 0.82, height: 6, x: 0.1, y: 54 },
      ],
    },
  ],
  'feature-grid': [
    {
      id: 'grid-3col',
      label: '3 Columns',
      description: 'Three-column grid, ideal for 3-6 features',
      previewBlocks: [
        { type: 'icon-card', width: 0.28, height: 50, x: 0.04, y: 20 },
        { type: 'icon-card', width: 0.28, height: 50, x: 0.36, y: 20 },
        { type: 'icon-card', width: 0.28, height: 50, x: 0.68, y: 20 },
      ],
    },
    {
      id: 'grid-2col',
      label: '2 Columns',
      description: 'Two-column grid for detailed feature cards',
      previewBlocks: [
        { type: 'icon-card', width: 0.44, height: 45, x: 0.04, y: 22 },
        { type: 'icon-card', width: 0.44, height: 45, x: 0.52, y: 22 },
      ],
    },
    {
      id: 'grid-4col',
      label: '4 Columns',
      description: 'Four-column grid for compact feature lists',
      previewBlocks: [
        { type: 'icon-card', width: 0.2, height: 45, x: 0.04, y: 22 },
        { type: 'icon-card', width: 0.2, height: 45, x: 0.28, y: 22 },
        { type: 'icon-card', width: 0.2, height: 45, x: 0.52, y: 22 },
        { type: 'icon-card', width: 0.2, height: 45, x: 0.76, y: 22 },
      ],
    },
  ],
  'image-gallery': [
    {
      id: 'gallery-single',
      label: 'Single',
      description: 'One full-width image with 16:9 aspect ratio',
      previewBlocks: [
        { type: 'image', width: 0.9, height: 70, x: 0.05, y: 15 },
      ],
    },
    {
      id: 'gallery-grid',
      label: 'Grid',
      description: 'Responsive image grid with uniform sizing',
      previewBlocks: [
        { type: 'image', width: 0.3, height: 35, x: 0.025, y: 18 },
        { type: 'image', width: 0.3, height: 35, x: 0.35, y: 18 },
        { type: 'image', width: 0.3, height: 35, x: 0.675, y: 18 },
        { type: 'image', width: 0.3, height: 35, x: 0.025, y: 58 },
        { type: 'image', width: 0.3, height: 35, x: 0.35, y: 58 },
        { type: 'image', width: 0.3, height: 35, x: 0.675, y: 58 },
      ],
    },
    {
      id: 'gallery-slider',
      label: 'Slider',
      description: 'Horizontal carousel with navigation arrows',
      previewBlocks: [
        { type: 'image', width: 0.7, height: 65, x: 0.15, y: 15 },
        { type: 'button', width: 0.06, height: 12, x: 0.04, y: 40 },
        { type: 'button', width: 0.06, height: 12, x: 0.9, y: 40 },
      ],
    },
    {
      id: 'gallery-masonry',
      label: 'Masonry',
      description: 'Pinterest-style staggered image layout',
      previewBlocks: [
        { type: 'image', width: 0.3, height: 45, x: 0.025, y: 10 },
        { type: 'image', width: 0.3, height: 30, x: 0.35, y: 10 },
        { type: 'image', width: 0.3, height: 50, x: 0.675, y: 10 },
        { type: 'image', width: 0.3, height: 30, x: 0.025, y: 60 },
        { type: 'image', width: 0.3, height: 45, x: 0.35, y: 45 },
        { type: 'image', width: 0.3, height: 25, x: 0.675, y: 65 },
      ],
    },
  ],
  cta: [
    {
      id: 'cta-centered',
      label: 'Centered',
      description: 'Centered headline with buttons, solid or gradient background',
      previewBlocks: [
        { type: 'heading', width: 0.5, height: 14, x: 0.25, y: 25 },
        { type: 'text', width: 0.4, height: 8, x: 0.3, y: 45 },
        { type: 'button', width: 0.18, height: 10, x: 0.32, y: 62 },
        { type: 'button', width: 0.18, height: 10, x: 0.52, y: 62 },
      ],
    },
    {
      id: 'cta-left',
      label: 'Left Aligned',
      description: 'Left-aligned content with side-by-side buttons',
      previewBlocks: [
        { type: 'heading', width: 0.5, height: 14, x: 0.05, y: 25 },
        { type: 'text', width: 0.45, height: 8, x: 0.05, y: 45 },
        { type: 'button', width: 0.18, height: 10, x: 0.05, y: 62 },
        { type: 'button', width: 0.18, height: 10, x: 0.25, y: 62 },
      ],
    },
    {
      id: 'cta-with-image',
      label: 'With Background Image',
      description: 'Image background with overlay and centered CTA',
      previewBlocks: [
        { type: 'image', width: 1, height: 100 },
        { type: 'heading', width: 0.5, height: 14, x: 0.25, y: 25 },
        { type: 'text', width: 0.4, height: 8, x: 0.3, y: 45 },
        { type: 'button', width: 0.2, height: 10, x: 0.4, y: 62 },
      ],
    },
  ],
  testimonials: [
    {
      id: 'testimonials-carousel',
      label: 'Carousel',
      description: 'Horizontal scrolling testimonial carousel',
      previewBlocks: [
        { type: 'testimonial-card', width: 0.6, height: 55, x: 0.2, y: 20 },
        { type: 'button', width: 0.06, height: 12, x: 0.06, y: 40 },
        { type: 'button', width: 0.06, height: 12, x: 0.88, y: 40 },
      ],
    },
    {
      id: 'testimonials-grid',
      label: 'Grid',
      description: 'Multi-column testimonial grid layout',
      previewBlocks: [
        { type: 'testimonial-card', width: 0.28, height: 55, x: 0.04, y: 20 },
        { type: 'testimonial-card', width: 0.28, height: 55, x: 0.36, y: 20 },
        { type: 'testimonial-card', width: 0.28, height: 55, x: 0.68, y: 20 },
      ],
    },
    {
      id: 'testimonials-single',
      label: 'Single',
      description: 'Featured single testimonial, large centered',
      previewBlocks: [
        { type: 'testimonial-card', width: 0.5, height: 60, x: 0.25, y: 18 },
      ],
    },
  ],
  faq: [
    {
      id: 'faq-standard',
      label: 'Standard Accordion',
      description: 'Classic expandable FAQ with chevron toggles',
      previewBlocks: [
        { type: 'faq-item', width: 0.9, height: 14, x: 0.05, y: 14 },
        { type: 'faq-item', width: 0.9, height: 14, x: 0.05, y: 32 },
        { type: 'faq-item', width: 0.9, height: 14, x: 0.05, y: 50 },
        { type: 'faq-item', width: 0.9, height: 14, x: 0.05, y: 68 },
      ],
    },
    {
      id: 'faq-with-heading',
      label: 'With Section Heading',
      description: 'FAQ section with prominent heading above',
      previewBlocks: [
        { type: 'heading', width: 0.4, height: 12, x: 0.3, y: 6 },
        { type: 'faq-item', width: 0.8, height: 12, x: 0.1, y: 24 },
        { type: 'faq-item', width: 0.8, height: 12, x: 0.1, y: 40 },
        { type: 'faq-item', width: 0.8, height: 12, x: 0.1, y: 56 },
        { type: 'faq-item', width: 0.8, height: 12, x: 0.1, y: 72 },
      ],
    },
  ],
  stats: [
    {
      id: 'stats-row',
      label: 'Stats Row',
      description: 'Animated stat counters in a horizontal row',
      previewBlocks: [
        { type: 'heading', width: 0.15, height: 25, x: 0.05, y: 35 },
        { type: 'text', width: 0.12, height: 8, x: 0.065, y: 64 },
        { type: 'heading', width: 0.15, height: 25, x: 0.28, y: 35 },
        { type: 'text', width: 0.12, height: 8, x: 0.295, y: 64 },
        { type: 'heading', width: 0.15, height: 25, x: 0.51, y: 35 },
        { type: 'text', width: 0.12, height: 8, x: 0.525, y: 64 },
        { type: 'heading', width: 0.15, height: 25, x: 0.74, y: 35 },
        { type: 'text', width: 0.12, height: 8, x: 0.755, y: 64 },
      ],
    },
    {
      id: 'stats-with-heading',
      label: 'With Heading',
      description: 'Stats row with section heading and subheading above',
      previewBlocks: [
        { type: 'heading', width: 0.4, height: 12, x: 0.3, y: 8 },
        { type: 'text', width: 0.5, height: 6, x: 0.25, y: 24 },
        { type: 'heading', width: 0.15, height: 22, x: 0.05, y: 45 },
        { type: 'text', width: 0.12, height: 8, x: 0.065, y: 70 },
        { type: 'heading', width: 0.15, height: 22, x: 0.28, y: 45 },
        { type: 'text', width: 0.12, height: 8, x: 0.295, y: 70 },
        { type: 'heading', width: 0.15, height: 22, x: 0.51, y: 45 },
        { type: 'text', width: 0.12, height: 8, x: 0.525, y: 70 },
        { type: 'heading', width: 0.15, height: 22, x: 0.74, y: 45 },
        { type: 'text', width: 0.12, height: 8, x: 0.755, y: 70 },
      ],
    },
  ],
  columns: [
    {
      id: 'columns-equal-2',
      label: '2 Columns Equal',
      description: 'Two equal-width columns, 50/50 split',
      previewBlocks: [
        { type: 'icon-card', width: 0.44, height: 70, x: 0.04, y: 15 },
        { type: 'icon-card', width: 0.44, height: 70, x: 0.52, y: 15 },
      ],
    },
    {
      id: 'columns-asymmetric',
      label: '2 Columns Asymmetric',
      description: 'Two columns with 1/3 + 2/3 split',
      previewBlocks: [
        { type: 'icon-card', width: 0.28, height: 70, x: 0.04, y: 15 },
        { type: 'icon-card', width: 0.6, height: 70, x: 0.36, y: 15 },
      ],
    },
    {
      id: 'columns-equal-3',
      label: '3 Columns Equal',
      description: 'Three equal-width columns, 33/33/33 split',
      previewBlocks: [
        { type: 'icon-card', width: 0.28, height: 70, x: 0.04, y: 15 },
        { type: 'icon-card', width: 0.28, height: 70, x: 0.36, y: 15 },
        { type: 'icon-card', width: 0.28, height: 70, x: 0.68, y: 15 },
      ],
    },
  ],
};

// ============================================================================
// SVG Preview Renderer
// ============================================================================

function VariantPreview({ blocks, isSelected }: { blocks: PreviewBlock[]; isSelected: boolean }) {
  const width = 200;
  const height = 100;

  const getBlockColor = (type: PreviewBlock['type']): string => {
    switch (type) {
      case 'heading':
        return isSelected ? '#C9A227' : '#888';
      case 'text':
        return isSelected ? '#666' : '#444';
      case 'image':
        return isSelected ? '#C9A227/20' : '#2A2A2A';
      case 'button':
        return isSelected ? '#C9A227' : '#555';
      case 'icon-card':
        return isSelected ? '#C9A227/15' : '#222';
      case 'testimonial-card':
        return isSelected ? '#C9A227/15' : '#222';
      case 'faq-item':
        return isSelected ? '#C9A227/10' : '#1E1E1E';
      case 'spacer':
        return isSelected ? '#C9A227' : '#555';
      default:
        return '#333';
    }
  };

  const getRx = (type: PreviewBlock['type']): number => {
    switch (type) {
      case 'button':
        return 3;
      case 'icon-card':
      case 'testimonial-card':
        return 4;
      case 'faq-item':
        return 2;
      default:
        return 1;
    }
  };

  const getOpacity = (type: PreviewBlock['type']): number => {
    switch (type) {
      case 'image':
        return 0.4;
      case 'icon-card':
      case 'testimonial-card':
        return 0.6;
      case 'faq-item':
        return 0.5;
      default:
        return 1;
    }
  };

  const getStroke = (type: PreviewBlock['type']): string | undefined => {
    switch (type) {
      case 'icon-card':
      case 'testimonial-card':
        return isSelected ? '#C9A227' : '#333';
      case 'faq-item':
        return isSelected ? '#C9A227' : '#333';
      default:
        return undefined;
    }
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="4"
        fill={isSelected ? '#0F0F0F' : '#111'}
        stroke={isSelected ? '#C9A227' : '#222'}
        strokeWidth="1"
      />

      {/* Preview blocks */}
      {blocks.map((block, i) => {
        const bx = (block.x || 0) * width;
        const by = block.y || 0;
        const bw = block.width * width;
        const bh = block.height;

        return (
          <rect
            key={i}
            x={bx}
            y={by}
            width={bw}
            height={bh}
            rx={getRx(block.type)}
            fill={getBlockColor(block.type)}
            opacity={getOpacity(block.type)}
            stroke={getStroke(block.type)}
            strokeWidth={getStroke(block.type) ? 0.5 : 0}
          />
        );
      })}
    </svg>
  );
}

// ============================================================================
// Apply variant settings to default section
// ============================================================================

function applyVariantToSection(
  section: PageSectionContent,
  variantId: string
): PageSectionContent {
  switch (section.type) {
    case 'hero': {
      if (variantId === 'hero-full') return { ...section, variant: 'full-height' };
      if (variantId === 'hero-half') return { ...section, variant: 'half-height' };
      if (variantId === 'hero-banner') return { ...section, variant: 'banner' };
      return section;
    }
    case 'text-block': {
      if (variantId === 'text-left') return { ...section, alignment: 'left' };
      if (variantId === 'text-center') return { ...section, alignment: 'center' };
      if (variantId === 'text-with-heading') return { ...section, heading: 'Section Heading', alignment: 'center' };
      return section;
    }
    case 'feature-grid': {
      if (variantId === 'grid-2col') return { ...section, columns: 2 };
      if (variantId === 'grid-3col') return { ...section, columns: 3 };
      if (variantId === 'grid-4col') return { ...section, columns: 4 };
      return section;
    }
    case 'image-gallery': {
      if (variantId === 'gallery-single') return { ...section, layout: 'single' };
      if (variantId === 'gallery-grid') return { ...section, layout: 'grid' };
      if (variantId === 'gallery-slider') return { ...section, layout: 'slider' };
      if (variantId === 'gallery-masonry') return { ...section, layout: 'masonry' };
      return section;
    }
    case 'cta': {
      if (variantId === 'cta-centered') return { ...section };
      if (variantId === 'cta-left') return { ...section };
      if (variantId === 'cta-with-image') return { ...section, backgroundType: 'image', backgroundValue: '' };
      return section;
    }
    case 'testimonials': {
      if (variantId === 'testimonials-carousel') return { ...section, layout: 'carousel' };
      if (variantId === 'testimonials-grid') return { ...section, layout: 'grid' };
      if (variantId === 'testimonials-single') return { ...section, layout: 'single' };
      return section;
    }
    case 'faq': {
      if (variantId === 'faq-with-heading') return { ...section, heading: 'Frequently Asked Questions' };
      return section;
    }
    case 'stats': {
      if (variantId === 'stats-with-heading') return { ...section, heading: 'Key Numbers', subheading: 'The stats that matter.' };
      return section;
    }
    case 'columns': {
      if (variantId === 'columns-equal-2') return { ...section, layout: 'equal-2', columns: [{ sections: [] }, { sections: [] }] };
      if (variantId === 'columns-asymmetric') return { ...section, layout: '1/3-2/3', columns: [{ sections: [] }, { sections: [] }] };
      if (variantId === 'columns-equal-3') return { ...section, layout: 'equal-3', columns: [{ sections: [] }, { sections: [] }, { sections: [] }] };
      return section;
    }
    default:
      return section;
  }
}

// ============================================================================
// AddSectionModal Component
// ============================================================================

interface AddSectionModalProps {
  /** Callback when a section is added. Receives the fully configured section content. */
  onAdd: (section: PageSectionContent) => void;
  /** Callback to close the modal. */
  onClose: () => void;
  /** The order index for the new section. */
  insertOrder: number;
  /** Section types to exclude from the picker (e.g., ['hero', 'columns'] inside column children). */
  excludeTypes?: InlineSectionType[];
}

export function AddSectionModal({ onAdd, onClose, insertOrder, excludeTypes }: AddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<InlineSectionType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const sectionTypes = (Object.entries(SECTION_TYPE_META) as [
    InlineSectionType,
    { label: string; description: string; icon: string }
  ][]).filter(([type]) => !excludeTypes?.includes(type));

  const handleSelectType = useCallback((type: InlineSectionType) => {
    setSelectedType(type);
    // Auto-select first variant
    const variants = SECTION_VARIANTS[type];
    if (variants && variants.length > 0) {
      setSelectedVariant(variants[0].id);
    }
  }, []);

  const handleBack = useCallback(() => {
    setSelectedType(null);
    setSelectedVariant(null);
  }, []);

  const handleAdd = useCallback(() => {
    if (!selectedType) return;

    const section = createDefaultSection(selectedType, insertOrder);
    const finalSection = selectedVariant
      ? applyVariantToSection(section, selectedVariant)
      : section;

    onAdd(finalSection);
    onClose();
  }, [selectedType, selectedVariant, insertOrder, onAdd, onClose]);

  // ---- Step 2: Variant selection ----
  if (selectedType) {
    const meta = SECTION_TYPE_META[selectedType];
    const IconComponent = getSectionIcon(meta.icon);
    const variants = SECTION_VARIANTS[selectedType];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                title="Back to section types"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg">
                  <IconComponent className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {meta.label}
                  </h3>
                  <p className="text-xs text-gray-500">Choose a layout variant</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Variant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {variants.map((variant) => {
              const isActive = selectedVariant === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`relative flex flex-col rounded-xl border-2 transition-all text-left overflow-hidden ${
                    isActive
                      ? 'border-[#C9A227] bg-[#C9A227]/5 shadow-lg shadow-[#C9A227]/10'
                      : 'border-[#333] bg-[#0A0A0A] hover:border-[#555] hover:bg-[#111]'
                  }`}
                >
                  {/* Selected indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2 z-10 p-0.5 bg-[#C9A227] rounded-full">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}

                  {/* SVG Preview */}
                  <div className="aspect-[2/1] p-2">
                    <VariantPreview blocks={variant.previewBlocks} isSelected={isActive} />
                  </div>

                  {/* Label and description */}
                  <div className="px-3 pb-3 pt-1">
                    <p className={`text-sm font-medium ${isActive ? 'text-[#C9A227]' : 'text-white'}`}>
                      {variant.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {variant.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add button */}
          <div className="flex justify-end gap-3 border-t border-[#333] pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedVariant}
              className="px-5 py-2 text-sm bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Section
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Step 1: Section type selection ----
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              Add New Section
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Choose a section type to add to your page</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sectionTypes.map(([type, meta]) => {
            const IconComponent = getSectionIcon(meta.icon);
            const variantCount = SECTION_VARIANTS[type]?.length || 0;
            return (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className="flex items-center gap-3 p-4 bg-[#0A0A0A] border border-[#333] rounded-lg hover:border-[#C9A227]/60 hover:bg-[#C9A227]/5 transition-all text-left group"
              >
                <div className="p-2.5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg group-hover:bg-[#C9A227]/20 transition-colors shrink-0">
                  <IconComponent className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-[#C9A227] transition-colors">
                    {meta.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {meta.description}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {variantCount} layout {variantCount === 1 ? 'variant' : 'variants'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#C9A227] transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
