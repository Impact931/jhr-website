'use client';

import { useState, useCallback, ReactNode, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Link as LinkIconLucide,
  Type,
  Grid3X3,
  // Popular Lucide icons for the icon selector
  Camera,
  Star,
  Shield,
  Zap,
  Heart,
  Award,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Mail,
  Map,
  Phone,
  Settings,
  Target,
  Users,
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Headphones,
  Image as ImageIcon,
  Layers,
  Monitor,
  Palette,
  Rocket,
  Search,
  Send,
  Sparkles,
  ThumbsUp,
  Truck,
  Wifi,
  ArrowRight,
  BarChart,
  BookOpen,
  Cloud,
  Code,
  Cpu,
  Database,
  Download,
  Edit,
  Film,
  Gift,
  Home,
  Key,
  Lightbulb,
  MessageCircle,
  Mic,
  Music,
  Package,
  PenTool,
  Printer,
  Radio,
  RefreshCw,
  Repeat,
  Share2,
  ShoppingCart,
  Smile,
  Sun,
  Tag,
  Terminal,
  TrendingUp,
  Umbrella,
  Upload,
  Video,
  Volume2,
  Wrench,
  Building2,
  UserCircle,
  Presentation,
  ClipboardList,
  Maximize,
  Minimize,
  RectangleHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ModalPortal } from '@/components/ui/ModalPortal';
import SmartImage from '@/components/ui/SmartImage';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import type { FeatureGridColumns, FeatureCard, FeatureGridDisplayMode } from '@/types/inline-editor';

// ============================================================================
// Icon Map: string name -> Lucide component
// ============================================================================

const ICON_MAP: Record<string, LucideIcon> = {
  Camera,
  Star,
  Shield,
  Zap,
  Heart,
  Award,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Mail,
  Map,
  Phone,
  Settings,
  Target,
  Users,
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Headphones,
  Image: ImageIcon,
  Layers,
  Monitor,
  Palette,
  Rocket,
  Search,
  Send,
  Sparkles,
  ThumbsUp,
  Truck,
  Wifi,
  ArrowRight,
  BarChart,
  BookOpen,
  Cloud,
  Code,
  Cpu,
  Database,
  Download,
  Edit,
  Film,
  Gift,
  Home,
  Key,
  Lightbulb,
  MessageCircle,
  Mic,
  Music,
  Package,
  PenTool,
  Printer,
  Radio,
  RefreshCw,
  Repeat,
  Share2,
  ShoppingCart,
  Smile,
  Sun,
  Tag,
  Terminal,
  TrendingUp,
  Umbrella,
  Upload,
  Video,
  Volume2,
  Wrench,
  Building2,
  UserCircle,
  Presentation,
  ClipboardList,
};

const ICON_NAMES = Object.keys(ICON_MAP);

/**
 * Render text that may contain inline HTML (color spans, bold, italic).
 */
function renderInlineHtml(text: string): { dangerouslySetInnerHTML: { __html: string } } | { children: string } {
  if (text.includes('<')) {
    return { dangerouslySetInnerHTML: { __html: text } };
  }
  return { children: text };
}

function getIconComponent(name: string): LucideIcon {
  return ICON_MAP[name] || Star;
}

/** Convert YouTube URL (watch, short, or embed) → embeddable URL */
function getYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // Already an embed URL
    if (u.pathname.startsWith('/embed/')) return url;
    // youtu.be short links
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed${u.pathname}`;
    // Standard watch URL
    const v = u.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch { /* fall through */ }
  return url;
}

// ============================================================================
// Types
// ============================================================================

interface EditableFeatureGridProps {
  /** Content key prefix for all grid fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Section heading. */
  heading?: string;
  /** Section subheading. */
  subheading?: string;
  /** Number of columns on desktop. */
  columns?: FeatureGridColumns;
  /** Feature cards. */
  features: FeatureCard[];
  /** Display mode variant. */
  displayMode?: FeatureGridDisplayMode;
  /** Show numbered step indicators in alternating mode. */
  showStepNumbers?: boolean;
  /** Card variant: 'default' = solid bg, 'glass' = frosted glass effect. */
  cardVariant?: 'default' | 'glass';
  /** Scroll speed multiplier for logo-scroll mode. */
  scrollSpeed?: number;
  /** Scroll direction for logo-scroll mode. */
  scrollDirection?: 'left' | 'right';
  /** Callback when features array changes (for parent state management). */
  onFeaturesChange?: (features: FeatureCard[]) => void;
  /** Callback when columns change. */
  onColumnsChange?: (columns: FeatureGridColumns) => void;
  /** Additional children rendered below the grid. */
  children?: ReactNode;
}

// ============================================================================
// Icon Selector Modal
// ============================================================================

interface IconSelectorProps {
  currentIcon: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

function IconSelector({ currentIcon, onSelect, onClose }: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return ICON_NAMES;
    const q = searchQuery.toLowerCase();
    return ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Select Icon
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 mb-4 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
          placeholder="Search icons..."
          autoFocus
        />

        {/* Icon Grid */}
        <div className="overflow-y-auto flex-1 -mx-1">
          <div className="grid grid-cols-8 gap-1 p-1">
            {filteredIcons.map((name) => {
              const IconComp = ICON_MAP[name];
              const isSelected = name === currentIcon;
              return (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className={`
                    p-2.5 rounded-lg flex items-center justify-center transition-colors
                    ${isSelected
                      ? 'bg-[#C9A227]/20 border border-[#C9A227] text-[#C9A227]'
                      : 'hover:bg-[#2A2A2A] text-gray-400 hover:text-white border border-transparent'
                    }
                  `}
                  title={name}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">
              No icons match &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Current selection */}
        <div className="mt-4 pt-4 border-t border-[#333] flex items-center gap-2 text-sm text-gray-400">
          <span>Selected:</span>
          {(() => {
            const SelectedIcon = getIconComponent(currentIcon);
            return <SelectedIcon className="w-4 h-4 text-[#C9A227]" />;
          })()}
          <span className="text-white font-medium">{currentIcon}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Link Editor Modal
// ============================================================================

interface LinkEditorProps {
  text: string;
  href: string;
  onSave: (text: string, href: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

function LinkEditor({ text, href, onSave, onRemove, onClose }: LinkEditorProps) {
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
            Edit Card Link
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
            <label className="block text-sm text-gray-400 mb-1">Link Text</label>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Learn more..."
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

        <div className="flex justify-between mt-6">
          <button
            onClick={onRemove}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Remove Link
          </button>
          <div className="flex gap-3">
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
// Column Selector
// ============================================================================

function ColumnSelector({
  columns,
  onChange,
}: {
  columns: FeatureGridColumns;
  onChange: (cols: FeatureGridColumns) => void;
}) {
  const options: FeatureGridColumns[] = [2, 3, 4];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Columns:</span>
      {options.map((col) => (
        <button
          key={col}
          onClick={() => onChange(col)}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
            ${columns === col
              ? 'bg-[#C9A227] text-black'
              : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
            }
          `}
        >
          {col}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Display Mode Selector
// ============================================================================

const DISPLAY_MODE_OPTIONS: { value: FeatureGridDisplayMode; label: string }[] = [
  { value: 'default', label: 'Grid' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'alternating', label: 'Alternating' },
  { value: 'journey', label: 'Journey' },
  { value: 'logo-scroll', label: 'Logo Scroll' },
];

function DisplayModeSelector({
  mode,
  onChange,
}: {
  mode: FeatureGridDisplayMode;
  onChange: (mode: FeatureGridDisplayMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Mode:</span>
      {DISPLAY_MODE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${mode === opt.value
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
// Logo Scroll View (displayMode === 'logo-scroll')
// ============================================================================

function LogoScrollView({
  heading,
  subheading,
  features,
  scrollSpeed = 1,
  scrollDirection = 'left',
}: {
  heading?: string;
  subheading?: string;
  features: FeatureCard[];
  scrollSpeed?: number;
  scrollDirection?: 'left' | 'right';
}) {
  // Duplicate array for seamless loop
  const doubled = [...features, ...features];

  const duration = (features.length * 4) / (scrollSpeed || 1);
  const animateX: [string, string] = scrollDirection === 'right' ? ['-50%', '0%'] : ['0%', '-50%'];

  return (
    <div>
      {/* Heading */}
      {(heading || subheading) && (
        <div className="text-center mb-8">
          {heading && (
            <p className="text-body-sm text-jhr-white-muted uppercase tracking-widest font-medium mb-2"
              {...renderInlineHtml(heading)}
            />
          )}
          {subheading && (
            <p className="text-body-md text-jhr-white-dim max-w-2xl mx-auto"
              {...renderInlineHtml(subheading)}
            />
          )}
        </div>
      )}

      {/* Scrolling marquee */}
      <div className="relative overflow-hidden py-2">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-jhr-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-jhr-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-12"
          animate={{ x: animateX }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration,
              ease: 'linear',
            },
          }}
        >
          {doubled.map((feature, index) => (
            <div
              key={`logo-${index}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              {feature.image?.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={feature.image.src}
                  alt={feature.image.alt || feature.title}
                  className="h-20 w-auto object-contain opacity-90 transition-all duration-500"
                />
              ) : (
                <div className="h-20 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  {(() => {
                    const IconComp = getIconComponent(feature.icon);
                    return <IconComp className="w-10 h-10 text-jhr-white-dim group-hover:text-jhr-gold transition-colors duration-500" />;
                  })()}
                </div>
              )}
              <span className="text-xs text-jhr-white-dim opacity-60 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-500">
                {feature.title}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Journey View (displayMode === 'journey')
// ============================================================================

function JourneyView({
  heading,
  subheading,
  features,
}: {
  heading?: string;
  subheading?: string;
  features: FeatureCard[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <div ref={containerRef}>
      {/* Heading / Subheading */}
      {(heading || subheading) && (
        <div className="text-center mb-16">
          {heading && (
            <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4"
              {...renderInlineHtml(heading)}
            />
          )}
          {subheading && (
            <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              {...renderInlineHtml(subheading)}
            />
          )}
        </div>
      )}

      {/* Desktop: Horizontal journey with connecting line */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting line — spans between first and last step centers */}
          <motion.div
            className="absolute top-8 h-0.5 bg-gradient-to-r from-jhr-gold/20 via-jhr-gold/60 to-jhr-gold/20"
            style={{
              left: `calc(${50 / features.length}%)`,
              right: `calc(${50 / features.length}%)`,
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          />

          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${features.length}, minmax(0, 1fr))` }}
          >
            {features.map((feature, index) => {
              const IconComp = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={feature.id}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.3, ease: 'easeOut' }}
                >
                  {/* Number badge */}
                  <motion.div
                    className="relative z-10 w-16 h-16 rounded-full bg-jhr-black border-2 border-jhr-gold flex items-center justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0.3 + index * 0.3,
                    }}
                  >
                    <span className="text-xl font-display font-bold text-jhr-gold">
                      {index + 1}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6 text-jhr-gold" />
                  </div>

                  {/* Title */}
                  <h3 className="text-heading-lg font-semibold text-jhr-white mb-2"
                    {...renderInlineHtml(feature.title)}
                  />

                  {/* Description */}
                  <p className="text-body-md text-jhr-white-dim max-w-xs"
                    {...renderInlineHtml(feature.description)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical journey with left-side numbers */}
      <div className="md:hidden">
        <div className="relative pl-12">
          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-jhr-gold/60 via-jhr-gold/40 to-jhr-gold/20"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-12">
            {features.map((feature, index) => {
              const IconComp = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={feature.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.3, ease: 'easeOut' }}
                >
                  {/* Number badge (positioned on the line) */}
                  <motion.div
                    className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-jhr-black border-2 border-jhr-gold flex items-center justify-center z-10"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0.3 + index * 0.3,
                    }}
                  >
                    <span className="text-sm font-display font-bold text-jhr-gold">
                      {index + 1}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5 text-jhr-gold" />
                    </div>
                    <div>
                      <h3 className="text-heading-lg font-semibold text-jhr-white mb-1"
                        {...renderInlineHtml(feature.title)}
                      />
                      <p className="text-body-md text-jhr-white-dim"
                        {...renderInlineHtml(feature.description)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Alternating View (displayMode === 'alternating')
// Renders cards as full-width rows with image (1/3) + text (2/3), alternating sides
// ============================================================================

function AlternatingView({
  heading,
  subheading,
  features,
  showStepNumbers = false,
}: {
  heading?: string;
  subheading?: string;
  features: FeatureCard[];
  showStepNumbers?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <div ref={containerRef}>
      {/* Heading / Subheading */}
      {(heading || subheading) && (
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4"
              {...renderInlineHtml(heading)}
            />
          )}
          {subheading && (
            <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              {...renderInlineHtml(subheading)}
            />
          )}
        </div>
      )}

      {/* Alternating rows */}
      <div className="space-y-8">
        {features.map((feature, index) => {
          const isReversed = index % 2 !== 0;
          const IconComp = getIconComponent(feature.icon);
          const stepNumber = String(index + 1).padStart(2, '0');
          return (
            <motion.div
              key={feature.id}
              className={`flex flex-col md:flex-row gap-6 md:gap-8 items-stretch rounded-xl overflow-hidden ${
                isReversed ? 'md:flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
            >
              {/* Image/Video side */}
              <div className="w-full md:w-1/2 min-h-[200px] md:min-h-[340px] relative rounded-xl overflow-hidden bg-[#1A1A1A]">
                {feature.videoUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(feature.videoUrl)}
                    title={feature.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : feature.image?.src ? (
                  <SmartImage
                    src={feature.image.src}
                    alt={feature.image.alt || feature.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComp className="w-16 h-16 text-jhr-gold/20" />
                  </div>
                )}
              </div>

              {/* Text side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8">
                {/* Ghost step number (optional) */}
                {showStepNumbers && (
                  <span className="text-[4rem] md:text-[5rem] font-display font-bold leading-none text-jhr-white-dim/20 select-none mb-2">
                    {stepNumber}
                  </span>
                )}
                <h3 className="text-heading-lg font-semibold text-jhr-white mb-3"
                  {...renderInlineHtml(feature.title)}
                />
                <p className="text-body-md text-jhr-white-dim leading-relaxed"
                  {...renderInlineHtml(feature.description)}
                />
                {feature.link && (
                  <Link href={feature.link.href} className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium mt-4 group">
                    {feature.link.text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Horizontal Card View (displayMode === 'horizontal')
// Cards in a 2-column grid, each card is a horizontal flex: image/icon + text
// ============================================================================

function HorizontalCardView({
  heading,
  subheading,
  features,
}: {
  heading?: string;
  subheading?: string;
  features: FeatureCard[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <div ref={containerRef}>
      {/* Heading / Subheading */}
      {(heading || subheading) && (
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4"
              {...renderInlineHtml(heading)}
            />
          )}
          {subheading && (
            <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              {...renderInlineHtml(subheading)}
            />
          )}
        </div>
      )}

      {/* Horizontal card grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const IconComp = getIconComponent(feature.icon);
          return (
            <motion.div
              key={feature.id}
              className="card flex flex-row gap-4 items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              {/* Video, Image, or Icon — left side */}
              <div className={feature.videoUrl ? 'w-2/5 flex-shrink-0' : 'w-1/4 flex-shrink-0'}>
                {feature.videoUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1A1A1A]">
                    <iframe
                      src={getYouTubeEmbedUrl(feature.videoUrl)}
                      title={feature.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : feature.image?.src ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
                    <SmartImage
                      src={feature.image.src}
                      alt={feature.image.alt || feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-jhr-gold/10 flex items-center justify-center">
                    <IconComp className="w-8 h-8 text-jhr-gold" />
                  </div>
                )}
              </div>

              {/* Text — right side */}
              <div className="flex-1 min-w-0">
                <h3 className="text-heading-lg font-semibold text-jhr-white mb-2"
                  {...renderInlineHtml(feature.title)}
                />
                <p className="text-body-md text-jhr-white-dim"
                  {...renderInlineHtml(feature.description)}
                />
                {feature.link && (
                  <Link href={feature.link.href} className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium mt-3 group">
                    {feature.link.text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Default Grid Card (view mode) — Phases 3 + 7
// ============================================================================

function DefaultCardView({
  feature,
  index,
  columnsCount,
}: {
  feature: FeatureCard;
  index: number;
  columnsCount: FeatureGridColumns;
}) {
  const IconComp = getIconComponent(feature.icon);
  const isCheckCircle = feature.icon === 'CheckCircle';
  const staggerDelay = columnsCount === 4 && isCheckCircle ? index * 0.2 : index * 0.1;

  return (
    <motion.div
      key={feature.id}
      className={`group h-full ${
        isCheckCircle
          ? 'bg-transparent border border-[#1A1A1A] rounded-lg p-4 hover:border-green-500/20 transition-colors duration-300'
          : 'card'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: staggerDelay, ease: 'easeOut' }}
      whileHover={{ y: isCheckCircle ? -2 : -4, transition: { duration: 0.2 } }}
    >
      {/* Video, Image, or Icon */}
      {feature.videoUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-[#1A1A1A]">
          <iframe
            src={getYouTubeEmbedUrl(feature.videoUrl)}
            title={feature.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : feature.image?.src ? (
        <div className={`relative w-full rounded-lg overflow-hidden mb-4 bg-[#1A1A1A] ${(feature.image.fit ?? 'cover') === 'natural' ? '' : 'aspect-[4/3]'}`}>
          {(feature.image.fit ?? 'cover') === 'natural' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={feature.image.src}
              alt={feature.image.alt || feature.title}
              className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <SmartImage
              src={feature.image.src}
              alt={feature.image.alt || feature.title}
              fill
              className={`${(feature.image.fit ?? 'cover') === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
              objectPosition={(feature.image.fit ?? 'cover') === 'cover' ? `center ${feature.image.positionY ?? 50}%` : undefined}
            />
          )}
        </div>
      ) : isCheckCircle ? (
        <motion.div
          className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-all duration-300"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 12,
            delay: staggerDelay + 0.15,
          }}
        >
          <CheckCircle className="w-4 h-4 text-jhr-gold" />
        </motion.div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4 group-hover:bg-jhr-gold/20 group-hover:scale-110 transition-all duration-300">
          <IconComp className="w-6 h-6 text-jhr-gold" />
        </div>
      )}
      <h3 className="text-heading-lg font-semibold text-jhr-white mb-2"
        {...renderInlineHtml(feature.title)}
      />
      <p className="text-body-md text-jhr-white-dim mb-4"
        {...renderInlineHtml(feature.description)}
      />
      {feature.link && (
        <Link href={feature.link.href} className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
          {feature.link.text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

// ============================================================================
// EditableFeatureGrid Component
// ============================================================================

export function EditableFeatureGrid({
  contentKeyPrefix,
  heading,
  subheading,
  columns = 3,
  features: initialFeatures,
  displayMode = 'default',
  showStepNumbers,
  cardVariant: initialCardVariant = 'default',
  scrollSpeed: initialScrollSpeed = 1,
  scrollDirection: initialScrollDirection = 'left',
  onFeaturesChange,
  onColumnsChange,
  children,
}: EditableFeatureGridProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local feature state for add/remove/reorder
  const [features, setFeatures] = useState<FeatureCard[]>(initialFeatures);
  const [currentColumns, setCurrentColumns] = useState<FeatureGridColumns>(columns);
  const [currentDisplayMode, setCurrentDisplayMode] = useState<FeatureGridDisplayMode>(displayMode);
  const [currentCardVariant, setCurrentCardVariant] = useState<'default' | 'glass'>(initialCardVariant);
  const [currentScrollSpeed, setCurrentScrollSpeed] = useState(initialScrollSpeed);
  const [currentScrollDirection, setCurrentScrollDirection] = useState<'left' | 'right'>(initialScrollDirection);
  const [currentShowStepNumbers, setCurrentShowStepNumbers] = useState(showStepNumbers ?? false);

  // Sync local state with parent props after autosave merges edits back into sections.
  // Without this, local state stays stale after pendingChanges are cleared, causing
  // EditableText children to revert to old prop values.
  const featuresKey = useMemo(() => JSON.stringify(initialFeatures), [initialFeatures]);
  useEffect(() => { setFeatures(initialFeatures); }, [featuresKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setCurrentColumns(columns); }, [columns]);
  useEffect(() => { setCurrentDisplayMode(displayMode); }, [displayMode]);
  useEffect(() => { setCurrentCardVariant(initialCardVariant); }, [initialCardVariant]);
  useEffect(() => { setCurrentScrollSpeed(initialScrollSpeed); }, [initialScrollSpeed]);
  useEffect(() => { setCurrentScrollDirection(initialScrollDirection); }, [initialScrollDirection]);
  useEffect(() => { setCurrentShowStepNumbers(showStepNumbers ?? false); }, [showStepNumbers]);

  // Modal states
  const [iconSelectorCardId, setIconSelectorCardId] = useState<string | null>(null);
  const [linkEditorCardId, setLinkEditorCardId] = useState<string | null>(null);
  const [imagePickerCardId, setImagePickerCardId] = useState<string | null>(null);
  const [videoUrlCardId, setVideoUrlCardId] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Get column grid class
  const getGridClass = (cols: FeatureGridColumns): string => {
    const gridClasses: Record<FeatureGridColumns, string> = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    };
    return gridClasses[cols];
  };

  // Update features helper
  const updateFeatures = useCallback(
    (newFeatures: FeatureCard[]) => {
      setFeatures(newFeatures);
      onFeaturesChange?.(newFeatures);
      // Serialize the full features array as a pending change
      updateContent(
        `${contentKeyPrefix}:features`,
        JSON.stringify(newFeatures),
        'text'
      );
    },
    [contentKeyPrefix, onFeaturesChange, updateContent]
  );

  // Handle columns change
  const handleColumnsChange = useCallback(
    (cols: FeatureGridColumns) => {
      setCurrentColumns(cols);
      onColumnsChange?.(cols);
      updateContent(
        `${contentKeyPrefix}:columns`,
        String(cols),
        'text'
      );
    },
    [contentKeyPrefix, onColumnsChange, updateContent]
  );

  // Handle display mode change
  const handleDisplayModeChange = useCallback(
    (mode: FeatureGridDisplayMode) => {
      setCurrentDisplayMode(mode);
      updateContent(
        `${contentKeyPrefix}:displayMode`,
        mode,
        'text'
      );
    },
    [contentKeyPrefix, updateContent]
  );

  // Handle card variant change
  const handleCardVariantChange = useCallback(
    (variant: 'default' | 'glass') => {
      setCurrentCardVariant(variant);
      updateContent(
        `${contentKeyPrefix}:cardVariant`,
        variant,
        'text'
      );
    },
    [contentKeyPrefix, updateContent]
  );

  // Handle scroll speed change
  const handleScrollSpeedChange = useCallback(
    (speed: number) => {
      setCurrentScrollSpeed(speed);
      updateContent(`${contentKeyPrefix}:scrollSpeed`, String(speed), 'text');
    },
    [contentKeyPrefix, updateContent]
  );

  // Handle scroll direction change
  const handleScrollDirectionChange = useCallback(
    (dir: 'left' | 'right') => {
      setCurrentScrollDirection(dir);
      updateContent(`${contentKeyPrefix}:scrollDirection`, dir, 'text');
    },
    [contentKeyPrefix, updateContent]
  );

  // Handle step numbers toggle
  const handleShowStepNumbersChange = useCallback(
    (show: boolean) => {
      setCurrentShowStepNumbers(show);
      updateContent(`${contentKeyPrefix}:showStepNumbers`, String(show), 'text');
    },
    [contentKeyPrefix, updateContent]
  );

  // Add a new feature card
  const handleAddCard = useCallback(() => {
    const newCard: FeatureCard = {
      id: `card-${Date.now()}`,
      icon: 'Star',
      title: 'New Feature',
      description: 'Describe this feature.',
    };
    updateFeatures([...features, newCard]);
  }, [features, updateFeatures]);

  // Remove a feature card
  const handleRemoveCard = useCallback(
    (cardId: string) => {
      updateFeatures(features.filter((f) => f.id !== cardId));
    },
    [features, updateFeatures]
  );

  // Move a card up/down
  const handleMoveCard = useCallback(
    (cardId: string, direction: 'up' | 'down') => {
      const index = features.findIndex((f) => f.id === cardId);
      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === features.length - 1) return;

      const newFeatures = [...features];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newFeatures[index], newFeatures[swapIndex]] = [newFeatures[swapIndex], newFeatures[index]];
      updateFeatures(newFeatures);
    },
    [features, updateFeatures]
  );

  // Update a feature card's icon
  const handleIconSelect = useCallback(
    (cardId: string, iconName: string) => {
      const newFeatures = features.map((f) =>
        f.id === cardId ? { ...f, icon: iconName } : f
      );
      updateFeatures(newFeatures);
      setIconSelectorCardId(null);
    },
    [features, updateFeatures]
  );

  // Update a card's link
  const handleSaveLink = useCallback(
    (cardId: string, text: string, href: string) => {
      const newFeatures = features.map((f) =>
        f.id === cardId ? { ...f, link: { text, href } } : f
      );
      updateFeatures(newFeatures);
      setLinkEditorCardId(null);
    },
    [features, updateFeatures]
  );

  // Remove a card's link
  const handleRemoveLink = useCallback(
    (cardId: string) => {
      const newFeatures = features.map((f) => {
        if (f.id === cardId) {
          const { link: _link, ...rest } = f;
          return rest as FeatureCard;
        }
        return f;
      });
      updateFeatures(newFeatures);
      setLinkEditorCardId(null);
    },
    [features, updateFeatures]
  );

  // Handle image selection for a card
  const handleImageSelect = useCallback(
    (cardId: string, results: MediaPickerResult[]) => {
      if (results.length === 0) return;
      const newFeatures = features.map((f) =>
        f.id === cardId ? { ...f, image: { src: results[0].publicUrl, alt: results[0].alt || f.title } } : f
      );
      updateFeatures(newFeatures);
      setImagePickerCardId(null);
    },
    [features, updateFeatures]
  );

  // Remove a card's image
  const handleRemoveImage = useCallback(
    (cardId: string) => {
      const newFeatures = features.map((f) => {
        if (f.id === cardId) {
          const { image: _img, ...rest } = f;
          return rest as FeatureCard;
        }
        return f;
      });
      updateFeatures(newFeatures);
    },
    [features, updateFeatures]
  );

  // Save video URL for a card
  const handleSaveVideoUrl = useCallback(
    (cardId: string, url: string) => {
      const trimmed = url.trim();
      const newFeatures = features.map((f) =>
        f.id === cardId ? { ...f, videoUrl: trimmed || undefined } : f
      );
      updateFeatures(newFeatures);
      setVideoUrlCardId(null);
      setVideoUrlInput('');
    },
    [features, updateFeatures]
  );

  // Remove video URL from a card
  const handleRemoveVideoUrl = useCallback(
    (cardId: string) => {
      const newFeatures = features.map((f) => {
        if (f.id === cardId) {
          const { videoUrl: _v, ...rest } = f;
          return rest as FeatureCard;
        }
        return f;
      });
      updateFeatures(newFeatures);
    },
    [features, updateFeatures]
  );

  // Get the card being edited for link
  const linkEditingCard = linkEditorCardId
    ? features.find((f) => f.id === linkEditorCardId)
    : null;

  // Get the card being edited for icon
  const iconEditingCard = iconSelectorCardId
    ? features.find((f) => f.id === iconSelectorCardId)
    : null;

  // Resolve pending heading/subheading
  const headingKey = `${contentKeyPrefix}:heading`;
  const subheadingKey = `${contentKeyPrefix}:subheading`;
  const displayHeading = pendingChanges.get(headingKey)?.newValue ?? heading;
  const displaySubheading = pendingChanges.get(subheadingKey)?.newValue ?? subheading;

  // Glass class wrapper
  const glassClass = currentCardVariant === 'glass' ? 'glass-cards' : '';

  // ---- View Mode ----
  if (!isEditMode) {
    // Route to special display modes
    if (currentDisplayMode === 'logo-scroll') {
      return (
        <div>
          <LogoScrollView
            heading={displayHeading}
            subheading={displaySubheading}
            features={features}
            scrollSpeed={currentScrollSpeed}
            scrollDirection={currentScrollDirection}
          />
          {children}
        </div>
      );
    }

    if (currentDisplayMode === 'journey') {
      return (
        <div>
          <JourneyView
            heading={displayHeading}
            subheading={displaySubheading}
            features={features}
          />
          {children}
        </div>
      );
    }

    if (currentDisplayMode === 'alternating') {
      return (
        <div className={glassClass}>
          <AlternatingView
            heading={displayHeading}
            subheading={displaySubheading}
            features={features}
            showStepNumbers={currentShowStepNumbers}
          />
          {children}
        </div>
      );
    }

    if (currentDisplayMode === 'horizontal') {
      return (
        <div className={glassClass}>
          <HorizontalCardView
            heading={displayHeading}
            subheading={displaySubheading}
            features={features}
          />
          {children}
        </div>
      );
    }

    // Default grid view
    return (
      <div className={glassClass}>
        {/* Heading / Subheading */}
        {(displayHeading || displaySubheading) && (
          <div className="text-center mb-12">
            {displayHeading && (
              <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4"
                {...renderInlineHtml(displayHeading)}
              />
            )}
            {displaySubheading && (
              <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                {...renderInlineHtml(displaySubheading)}
              />
            )}
          </div>
        )}

        {/* Feature Grid */}
        <div className={`grid ${getGridClass(currentColumns)} gap-6`}>
          {features.map((feature, index) => (
            <DefaultCardView
              key={feature.id}
              feature={feature}
              index={index}
              columnsCount={currentColumns}
            />
          ))}
        </div>

        {children}
      </div>
    );
  }

  // ---- Edit Mode ----
  // Edit mode always shows the standard grid editor regardless of displayMode
  return (
    <>
      <div className={`relative group/grid ${glassClass}`}>
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Feature Grid
              {currentDisplayMode !== 'default' && (
                <span className="ml-1 text-[10px] opacity-70">({currentDisplayMode})</span>
              )}
            </span>
          </div>
        )}

        {/* Heading / Subheading - Editable */}
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

          {(displaySubheading !== undefined || canEdit) && (
            <div className="relative">
              {canEdit && (
                <div className="mb-1 flex justify-center">
                  <FieldLabel label="Subheading" icon={<Type className="w-3 h-3" />} />
                </div>
              )}
              <EditableText
                contentKey={subheadingKey}
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                placeholder="Enter subheading..."
              >
                {displaySubheading || ''}
              </EditableText>
            </div>
          )}
        </div>

        {/* Display mode, column selector, and card variant */}
        {canEdit && (
          <div className="flex flex-col gap-3 mb-6">
            <DisplayModeSelector mode={currentDisplayMode} onChange={handleDisplayModeChange} />
            {currentDisplayMode === 'alternating' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Step Numbers:</span>
                <button
                  onClick={() => handleShowStepNumbersChange(!currentShowStepNumbers)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentShowStepNumbers
                      ? 'bg-[#C9A227] text-black'
                      : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
                  }`}
                >
                  {currentShowStepNumbers ? 'On' : 'Off'}
                </button>
              </div>
            )}
            {currentDisplayMode === 'logo-scroll' && (
              <div className="flex items-center gap-6">
                {/* Speed slider */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Speed:</span>
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.25"
                    value={currentScrollSpeed}
                    onChange={(e) => handleScrollSpeedChange(parseFloat(e.target.value))}
                    className="w-24 accent-[#C9A227]"
                  />
                  <span className="text-xs text-white font-medium w-8">{currentScrollSpeed}x</span>
                </div>
                {/* Direction toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Direction:</span>
                  {(['left', 'right'] as const).map((dir) => (
                    <button
                      key={dir}
                      onClick={() => handleScrollDirectionChange(dir)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                        currentScrollDirection === dir
                          ? 'bg-[#C9A227] text-black'
                          : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ColumnSelector columns={currentColumns} onChange={handleColumnsChange} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Style:</span>
                  <button
                    onClick={() => handleCardVariantChange(currentCardVariant === 'glass' ? 'default' : 'glass')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentCardVariant === 'glass'
                        ? 'bg-[#C9A227] text-black'
                        : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
                    }`}
                  >
                    Glass
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FieldLabel label="Feature Cards" icon={<Grid3X3 className="w-3 h-3" />} />
              </div>
            </div>
          </div>
        )}

        {/* Feature Grid - Editable */}
        <div className={`grid ${getGridClass(currentColumns)} gap-6`}>
          {features.map((feature, index) => {
            const IconComp = getIconComponent(feature.icon);
            return (
              <div
                key={feature.id}
                className="card group/card h-full relative"
              >
                {/* Card Controls */}
                {canEdit && (
                  <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveCard(feature.id, 'up')}
                      disabled={index === 0}
                      className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveCard(feature.id, 'down')}
                      disabled={index === features.length - 1}
                      className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveCard(feature.id)}
                      className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                      title="Remove card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Video, Image, or Icon */}
                {feature.videoUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-[#1A1A1A] group/vid">
                    <iframe
                      src={getYouTubeEmbedUrl(feature.videoUrl)}
                      title={feature.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                    {canEdit && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setVideoUrlInput(feature.videoUrl || '');
                            setVideoUrlCardId(feature.id);
                          }}
                          className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
                        >
                          Change URL
                        </button>
                        <button
                          onClick={() => handleRemoveVideoUrl(feature.id)}
                          className="px-3 py-1.5 bg-red-900/70 text-red-300 text-xs font-medium rounded-lg hover:bg-red-900 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : feature.image?.src ? (
                  <div className={`relative w-full rounded-lg overflow-hidden mb-4 bg-[#1A1A1A] group/img ${(feature.image.fit ?? 'cover') === 'natural' ? '' : 'aspect-[4/3]'}`}>
                    {(feature.image.fit ?? 'cover') === 'natural' ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={feature.image.src}
                        alt={feature.image.alt || feature.title}
                        className="w-full h-auto block"
                        loading="lazy"
                      />
                    ) : (
                      <SmartImage
                        src={feature.image.src}
                        alt={feature.image.alt || feature.title}
                        fill
                        className={(feature.image.fit ?? 'cover') === 'contain' ? 'object-contain' : 'object-cover'}
                        objectPosition={(feature.image.fit ?? 'cover') === 'cover' ? `center ${feature.image.positionY ?? 50}%` : undefined}
                      />
                    )}
                    {canEdit && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setImagePickerCardId(feature.id)}
                            className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => handleRemoveImage(feature.id)}
                            className="px-3 py-1.5 bg-red-900/70 text-red-300 text-xs font-medium rounded-lg hover:bg-red-900 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        {/* Per-card image fit selector */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {([
                            { value: 'cover' as const, label: 'Fill', icon: <Maximize className="w-3 h-3" /> },
                            { value: 'contain' as const, label: 'Fit', icon: <Minimize className="w-3 h-3" /> },
                            { value: 'natural' as const, label: 'Original', icon: <RectangleHorizontal className="w-3 h-3" /> },
                          ]).map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                const newFeatures = features.map((f) =>
                                  f.id === feature.id && f.image
                                    ? { ...f, image: { ...f.image, fit: opt.value } }
                                    : f
                                );
                                updateFeatures(newFeatures);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                (feature.image?.fit ?? 'cover') === opt.value
                                  ? 'bg-[#C9A227] text-black'
                                  : 'bg-[#2A2A2A] text-gray-300 hover:text-white hover:bg-[#444]'
                              }`}
                            >
                              {opt.icon}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        {/* Vertical position slider — only relevant for cover mode */}
                        {(feature.image.fit ?? 'cover') === 'cover' && (
                          <label className="flex items-center gap-2 px-3 py-1.5 bg-[#2A2A2A] rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider whitespace-nowrap">Position</span>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={feature.image.positionY ?? 50}
                              onChange={(e) => {
                                const pos = Number(e.target.value);
                                const newFeatures = features.map((f) =>
                                  f.id === feature.id && f.image
                                    ? { ...f, image: { ...f.image, positionY: pos } }
                                    : f
                                );
                                updateFeatures(newFeatures);
                              }}
                              className="w-20 accent-[#C9A227]"
                            />
                            <span className="text-[10px] text-white font-mono w-7 text-right">{feature.image.positionY ?? 50}%</span>
                          </label>
                        )}
                        <button
                          onClick={() => {
                            handleRemoveImage(feature.id);
                            setVideoUrlInput('');
                            setVideoUrlCardId(feature.id);
                          }}
                          className="px-3 py-1.5 bg-[#2A2A2A] text-white text-xs font-medium rounded-lg hover:bg-[#333] transition-colors flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          Switch to Video
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center transition-colors ${
                        canEdit ? 'cursor-pointer hover:bg-jhr-gold/30 border-2 border-dashed border-transparent hover:border-[#C9A227]/60' : 'group-hover/card:bg-jhr-gold/20'
                      }`}
                      onClick={() => canEdit && setIconSelectorCardId(feature.id)}
                      title={canEdit ? 'Click to change icon' : undefined}
                    >
                      <IconComp className="w-6 h-6 text-jhr-gold" />
                    </div>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => setImagePickerCardId(feature.id)}
                          className="px-2 py-1 text-[10px] text-gray-500 hover:text-[#C9A227] border border-[#333] hover:border-[#C9A227]/60 rounded transition-colors"
                        >
                          + Image
                        </button>
                        <button
                          onClick={() => {
                            setVideoUrlInput('');
                            setVideoUrlCardId(feature.id);
                          }}
                          className="px-2 py-1 text-[10px] text-gray-500 hover:text-[#C9A227] border border-[#333] hover:border-[#C9A227]/60 rounded transition-colors"
                        >
                          + Video
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Title - Editable */}
                <div className="mb-2">
                  <EditableText
                    contentKey={`${contentKeyPrefix}:card-${feature.id}-title`}
                    as="h3"
                    className="text-heading-lg font-semibold text-jhr-white"
                    placeholder="Feature title..."
                  >
                    {feature.title}
                  </EditableText>
                </div>

                {/* Description - Editable */}
                <div className="mb-4">
                  <EditableText
                    contentKey={`${contentKeyPrefix}:card-${feature.id}-description`}
                    as="p"
                    className="text-body-md text-jhr-white-dim"
                    placeholder="Feature description..."
                  >
                    {feature.description}
                  </EditableText>
                </div>

                {/* Link - Editable */}
                {feature.link ? (
                  <button
                    onClick={() => canEdit && setLinkEditorCardId(feature.id)}
                    className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium hover:gap-3 transition-all"
                  >
                    {feature.link.text} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : canEdit ? (
                  <button
                    onClick={() => setLinkEditorCardId(feature.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C9A227] transition-colors"
                  >
                    <LinkIconLucide className="w-3 h-3" />
                    Add link
                  </button>
                ) : null}

                {/* Category selector */}
                {canEdit && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <select
                      value={feature.category || ''}
                      onChange={(e) => {
                        const val = e.target.value || undefined;
                        const newFeatures = features.map((f) =>
                          f.id === feature.id ? { ...f, category: val } : f
                        );
                        updateFeatures(newFeatures);
                      }}
                      className="bg-[#1A1A1A] text-xs text-gray-400 border border-[#333] rounded px-2 py-1 hover:border-[#C9A227]/60 focus:border-[#C9A227] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="">No category</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Convention Center">Convention Center</option>
                      <option value="Event Center">Event Center</option>
                      <option value="Honky Tonk">Honky Tonk</option>
                      <option value="Park">Park</option>
                    </select>
                  </div>
                )}

                {/* Edit mode border */}
                {canEdit && (
                  <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/card:border-[#C9A227]/40 rounded-xl pointer-events-none transition-colors" />
                )}
              </div>
            );
          })}

          {/* Add Card Button */}
          {canEdit && (
            <button
              onClick={handleAddCard}
              className="min-h-[200px] rounded-xl border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-[#C9A227] transition-colors group/add"
            >
              <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] group-hover/add:bg-[#C9A227]/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Add Feature Card</span>
            </button>
          )}
        </div>

        {/* Section border in edit mode */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 rounded-xl pointer-events-none group-hover/grid:border-[#C9A227]/40 transition-colors -m-4 p-4" />
        )}

        {children}
      </div>

      {/* Icon Selector Modal */}
      {iconSelectorCardId && iconEditingCard && (
        <ModalPortal>
          <IconSelector
            currentIcon={iconEditingCard.icon}
            onSelect={(iconName) => handleIconSelect(iconSelectorCardId, iconName)}
            onClose={() => setIconSelectorCardId(null)}
          />
        </ModalPortal>
      )}

      {/* Link Editor Modal */}
      {linkEditorCardId && linkEditingCard && (
        <ModalPortal>
          <LinkEditor
            text={linkEditingCard.link?.text ?? ''}
            href={linkEditingCard.link?.href ?? ''}
            onSave={(text, href) => handleSaveLink(linkEditorCardId, text, href)}
            onRemove={() => handleRemoveLink(linkEditorCardId)}
            onClose={() => setLinkEditorCardId(null)}
          />
        </ModalPortal>
      )}

      {/* Image Picker Modal */}
      <MediaPicker
        isOpen={imagePickerCardId !== null}
        onClose={() => setImagePickerCardId(null)}
        onSelect={(results) => {
          if (imagePickerCardId) handleImageSelect(imagePickerCardId, results);
        }}
        options={{ allowedTypes: ['image'] }}
      />

      {/* Video URL Editor Modal */}
      {videoUrlCardId && (
        <ModalPortal>
          <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-jhr-gold" />
                  Video Embed URL
                </h3>
                <button
                  onClick={() => { setVideoUrlCardId(null); setVideoUrlInput(''); }}
                  className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Paste a YouTube URL (watch, short, or embed format).
              </p>
              <input
                type="url"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && videoUrlInput.trim()) {
                    handleSaveVideoUrl(videoUrlCardId, videoUrlInput);
                  }
                }}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                placeholder="https://www.youtube.com/watch?v=..."
                autoFocus
              />
              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => { setVideoUrlCardId(null); setVideoUrlInput(''); }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveVideoUrl(videoUrlCardId, videoUrlInput)}
                  disabled={!videoUrlInput.trim()}
                  className="px-4 py-2 text-sm bg-[#C9A227] text-black font-medium rounded-lg hover:bg-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
