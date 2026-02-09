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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
// Logo Scroll View (displayMode === 'logo-scroll')
// ============================================================================

function LogoScrollView({
  heading,
  subheading,
  features,
}: {
  heading?: string;
  subheading?: string;
  features: FeatureCard[];
}) {
  // Duplicate array for seamless loop
  const doubled = [...features, ...features];

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
      <div className="relative overflow-hidden py-6">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-jhr-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-jhr-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: features.length * 4,
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
                <div className="relative w-28 h-16 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                  <SmartImage
                    src={feature.image.src}
                    alt={feature.image.alt || feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-16 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
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
          {/* Connecting line */}
          <motion.div
            className="absolute top-8 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-gradient-to-r from-jhr-gold/20 via-jhr-gold/60 to-jhr-gold/20"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          />

          <div className="grid grid-cols-3 gap-8">
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
      className={`card group h-full ${isCheckCircle ? 'hover:border-green-500/30' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: staggerDelay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image or Icon */}
      {feature.image?.src ? (
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-[#1A1A1A]">
          <SmartImage
            src={feature.image.src}
            alt={feature.image.alt || feature.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : isCheckCircle ? (
        <motion.div
          className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-all duration-300"
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
          <CheckCircle className="w-6 h-6 text-green-400" />
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
        <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
          {feature.link.text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
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
  onFeaturesChange,
  onColumnsChange,
  children,
}: EditableFeatureGridProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local feature state for add/remove/reorder
  const [features, setFeatures] = useState<FeatureCard[]>(initialFeatures);
  const [currentColumns, setCurrentColumns] = useState<FeatureGridColumns>(columns);

  // Modal states
  const [iconSelectorCardId, setIconSelectorCardId] = useState<string | null>(null);
  const [linkEditorCardId, setLinkEditorCardId] = useState<string | null>(null);
  const [imagePickerCardId, setImagePickerCardId] = useState<string | null>(null);

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

  // ---- View Mode ----
  if (!isEditMode) {
    // Route to special display modes
    if (displayMode === 'logo-scroll') {
      return (
        <div>
          <LogoScrollView
            heading={displayHeading}
            subheading={displaySubheading}
            features={features}
          />
          {children}
        </div>
      );
    }

    if (displayMode === 'journey') {
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

    // Default grid view
    return (
      <div>
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
      <div className="relative group/grid">
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Feature Grid
              {displayMode !== 'default' && (
                <span className="ml-1 text-[10px] opacity-70">({displayMode})</span>
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

        {/* Column selector */}
        {canEdit && (
          <div className="flex items-center justify-between mb-6">
            <ColumnSelector columns={currentColumns} onChange={handleColumnsChange} />
            <div className="flex items-center gap-2">
              <FieldLabel label="Feature Cards" icon={<Grid3X3 className="w-3 h-3" />} />
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

                {/* Image or Icon */}
                {feature.image?.src ? (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-[#1A1A1A] group/img">
                    <SmartImage
                      src={feature.image.src}
                      alt={feature.image.alt || feature.title}
                      fill
                      className="object-cover"
                    />
                    {canEdit && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                      <button
                        onClick={() => setImagePickerCardId(feature.id)}
                        className="px-2 py-1 text-[10px] text-gray-500 hover:text-[#C9A227] border border-[#333] hover:border-[#C9A227]/60 rounded transition-colors"
                      >
                        + Image
                      </button>
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
    </>
  );
}
