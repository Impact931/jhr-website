'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Layout,
  Type,
  Grid3X3,
  Image as ImagesIcon,
  MousePointerClick,
  Quote,
  HelpCircle,
  Search,
  Hash,
  Tag,
  Sparkles,
  Columns,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import type { InlineSectionType, SectionSEOAttributes } from '@/types/inline-editor';
import { SECTION_TYPE_META } from '@/types/inline-editor';
import type { PageSectionContent } from '@/types/inline-editor';
import { AddSectionModal } from '@/components/inline-editor/AddSectionModal';

// ============================================================================
// Icon map for section types (matching SECTION_TYPE_META icon names)
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
};

function getSectionIcon(iconName: string): React.ComponentType<{ className?: string }> {
  return SECTION_ICON_MAP[iconName] || Layout;
}

// ============================================================================
// Types
// ============================================================================

interface SectionWrapperProps {
  /** The section type for label display. */
  sectionType: InlineSectionType;
  /** Unique section ID. */
  sectionId: string;
  /** Section index (0-based) for reordering. */
  index: number;
  /** Total number of sections on the page. */
  totalSections: number;
  /** Callback to move this section up (swap with previous). */
  onMoveUp?: (index: number) => void;
  /** Callback to move this section down (swap with next). */
  onMoveDown?: (index: number) => void;
  /** Callback to delete this section. */
  onDelete?: (sectionId: string) => void;
  /** Callback to add a new section. Receives the type and the index to insert AFTER. */
  onAddSection?: (type: InlineSectionType, afterIndex: number) => void;
  /** Callback to add a new section with full content (from AddSectionModal with variant). */
  onAddSectionWithContent?: (section: PageSectionContent, afterIndex: number) => void;
  /** Current SEO attributes for this section. */
  sectionSEO?: SectionSEOAttributes;
  /** Callback to update SEO attributes. */
  onUpdateSEO?: (sectionId: string, seo: SectionSEOAttributes) => void;
  /** The section content (editable component). */
  children: ReactNode;
}

// ============================================================================
// Delete Confirmation Modal
// ============================================================================

interface DeleteConfirmModalProps {
  sectionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ sectionLabel, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            Delete Section
          </h3>
        </div>

        <p className="text-gray-300 mb-2">
          Are you sure you want to delete this <strong className="text-white">{sectionLabel}</strong> section?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This action cannot be undone. All content in this section will be lost.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 sm:py-2 text-sm text-gray-400 hover:text-white transition-colors touch-manipulation min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 sm:py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors touch-manipulation min-h-[44px]"
          >
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SEO Defaults Generator
// ============================================================================

/**
 * Auto-generates sensible SEO defaults based on section type and ID.
 * Produces: aria-label, sectionId (for anchor links), dataSectionName.
 */
function generateSEODefaults(
  sectionType: InlineSectionType,
  sectionId: string,
): SectionSEOAttributes {
  const meta = SECTION_TYPE_META[sectionType];
  // Convert sectionId to a clean kebab-case anchor ID
  const anchorId = sectionId
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return {
    ariaLabel: `${meta.label} section`,
    sectionId: anchorId,
    dataSectionName: sectionType,
  };
}

// ============================================================================
// SEO Panel Modal
// ============================================================================

interface SEOPanelProps {
  sectionType: InlineSectionType;
  sectionId: string;
  currentSEO: SectionSEOAttributes;
  onSave: (seo: SectionSEOAttributes) => void;
  onClose: () => void;
}

function SEOPanel({ sectionType, sectionId, currentSEO, onSave, onClose }: SEOPanelProps) {
  const defaults = generateSEODefaults(sectionType, sectionId);

  const [ariaLabel, setAriaLabel] = useState(currentSEO.ariaLabel || '');
  const [anchorId, setAnchorId] = useState(currentSEO.sectionId || '');
  const [dataSectionName, setDataSectionName] = useState(currentSEO.dataSectionName || '');

  const handleAutoGenerate = useCallback(() => {
    setAriaLabel(defaults.ariaLabel || '');
    setAnchorId(defaults.sectionId || '');
    setDataSectionName(defaults.dataSectionName || '');
  }, [defaults]);

  const handleSave = useCallback(() => {
    onSave({
      ariaLabel: ariaLabel.trim() || undefined,
      sectionId: anchorId.trim() || undefined,
      dataSectionName: dataSectionName.trim() || undefined,
    });
  }, [ariaLabel, anchorId, dataSectionName, onSave]);

  // Sanitize anchor ID input to kebab-case
  const handleAnchorIdChange = useCallback((value: string) => {
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    setAnchorId(sanitized);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg">
              <Search className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                Section SEO
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Accessibility &amp; anchor link attributes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-generate button */}
        <button
          onClick={handleAutoGenerate}
          className="flex items-center gap-2 w-full px-4 py-3 sm:py-2.5 mb-5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg text-sm text-[#C9A227] hover:bg-[#C9A227]/20 transition-colors touch-manipulation min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          Auto-generate defaults
        </button>

        {/* Fields */}
        <div className="space-y-4">
          {/* Aria Label */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              aria-label
            </label>
            <input
              type="text"
              value={ariaLabel}
              onChange={(e) => setAriaLabel(e.target.value)}
              placeholder="e.g., Photography services hero banner"
              maxLength={120}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/30 transition-colors"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-gray-600">
                Describes section purpose for screen readers
              </p>
              <span className={`text-[11px] ${ariaLabel.length > 100 ? 'text-amber-400' : 'text-gray-600'}`}>
                {ariaLabel.length}/120
              </span>
            </div>
          </div>

          {/* Section ID (for anchor links) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
              <Hash className="w-3.5 h-3.5 text-gray-500" />
              id (anchor link)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">#</span>
              <input
                type="text"
                value={anchorId}
                onChange={(e) => handleAnchorIdChange(e.target.value)}
                placeholder="e.g., services-hero"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/30 transition-colors font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Kebab-case ID for anchor links (e.g., yourpage.com#{anchorId || 'section-id'})
            </p>
          </div>

          {/* Data Section Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
              <Type className="w-3.5 h-3.5 text-gray-500" />
              data-section-name
            </label>
            <input
              type="text"
              value={dataSectionName}
              onChange={(e) => setDataSectionName(e.target.value)}
              placeholder="e.g., hero, features, testimonials"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/30 transition-colors"
            />
            <p className="text-[11px] text-gray-600 mt-1">
              Machine-readable name for analytics and styling hooks
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-5 p-3 bg-[#0A0A0A] border border-[#333] rounded-lg">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-medium">
            HTML Output Preview
          </p>
          <code className="text-xs text-gray-400 font-mono leading-relaxed block break-all">
            &lt;section
            {anchorId.trim() && <span className="text-[#C9A227]"> id=&quot;{anchorId.trim()}&quot;</span>}
            {ariaLabel.trim() && <span className="text-[#C9A227]"> aria-label=&quot;{ariaLabel.trim()}&quot;</span>}
            {dataSectionName.trim() && <span className="text-[#C9A227]"> data-section-name=&quot;{dataSectionName.trim()}&quot;</span>}
            &gt;
          </code>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 sm:py-2 text-sm text-gray-400 hover:text-white transition-colors touch-manipulation min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 sm:py-2 text-sm bg-[#C9A227] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors touch-manipulation min-h-[44px]"
          >
            Save SEO Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Section Type Picker (inline between sections)
// ============================================================================

interface SectionTypePickerProps {
  onSelect: (type: InlineSectionType) => void;
  onClose: () => void;
}

function SectionTypePicker({ onSelect, onClose }: SectionTypePickerProps) {
  const sectionTypes = Object.entries(SECTION_TYPE_META) as [InlineSectionType, { label: string; description: string; icon: string }][];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-bold text-white">
            Add New Section
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sectionTypes.map(([type, meta]) => {
            const IconComponent = getSectionIcon(meta.icon);
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className="flex items-start gap-3 p-4 bg-[#0A0A0A] border border-[#333] rounded-lg hover:border-[#C9A227]/60 hover:bg-[#C9A227]/5 transition-all text-left group touch-manipulation min-h-[44px]"
              >
                <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg group-hover:bg-[#C9A227]/20 transition-colors shrink-0">
                  <IconComponent className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#C9A227] transition-colors">
                    {meta.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Add Section Divider (appears between sections)
// ============================================================================

interface AddSectionDividerProps {
  onAdd: () => void;
}

function AddSectionDivider({ onAdd }: AddSectionDividerProps) {
  return (
    <div className="relative group/add-divider py-3 sm:py-2">
      {/* Horizontal line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#C9A227]/10 sm:bg-transparent group-hover/add-divider:bg-[#C9A227]/30 transition-colors" />
      {/* Add button - always visible on touch, hover-reveal on desktop */}
      <div className="flex justify-center">
        <button
          onClick={onAdd}
          className="relative z-10 flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 bg-[#1A1A1A] border border-[#333] rounded-full text-xs text-gray-500 opacity-70 sm:opacity-0 group-hover/add-divider:opacity-100 hover:border-[#C9A227]/60 hover:text-[#C9A227] transition-all touch-manipulation min-h-[44px] sm:min-h-0"
          title="Add section"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          Add Section
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SectionWrapper Component
// ============================================================================

export function SectionWrapper({
  sectionType,
  sectionId,
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAddSection,
  onAddSectionWithContent,
  sectionSEO,
  onUpdateSEO,
  children,
}: SectionWrapperProps) {
  const { canEdit, isEditMode } = useEditMode();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showSEOPanel, setShowSEOPanel] = useState(false);

  const meta = SECTION_TYPE_META[sectionType];
  const IconComponent = getSectionIcon(meta.icon);

  const isFirst = index === 0;
  const isLast = index === totalSections - 1;

  // Compute effective SEO attributes (current values or auto-generated defaults)
  const effectiveSEO: SectionSEOAttributes = useMemo(() => {
    const defaults = generateSEODefaults(sectionType, sectionId);
    return {
      ariaLabel: sectionSEO?.ariaLabel || defaults.ariaLabel,
      sectionId: sectionSEO?.sectionId || defaults.sectionId,
      dataSectionName: sectionSEO?.dataSectionName || defaults.dataSectionName,
    };
  }, [sectionType, sectionId, sectionSEO]);

  // Whether SEO has been explicitly customized (not just defaults)
  const hasSEOCustomization = !!(
    sectionSEO?.ariaLabel ||
    sectionSEO?.sectionId ||
    sectionSEO?.dataSectionName
  );

  const handleMoveUp = useCallback(() => {
    if (onMoveUp && !isFirst) {
      onMoveUp(index);
    }
  }, [onMoveUp, index, isFirst]);

  const handleMoveDown = useCallback(() => {
    if (onMoveDown && !isLast) {
      onMoveDown(index);
    }
  }, [onMoveDown, index, isLast]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (onDelete) {
      onDelete(sectionId);
    }
    setShowDeleteConfirm(false);
  }, [onDelete, sectionId]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleAddSectionClick = useCallback(() => {
    if (onAddSectionWithContent) {
      setShowAddSectionModal(true);
    } else {
      setShowTypePicker(true);
    }
  }, [onAddSectionWithContent]);

  const handleSelectSectionType = useCallback((type: InlineSectionType) => {
    if (onAddSection) {
      onAddSection(type, index);
    }
    setShowTypePicker(false);
  }, [onAddSection, index]);

  const handleCloseTypePicker = useCallback(() => {
    setShowTypePicker(false);
  }, []);

  const handleAddSectionWithContent = useCallback((section: PageSectionContent) => {
    if (onAddSectionWithContent) {
      onAddSectionWithContent(section, index);
    }
    setShowAddSectionModal(false);
  }, [onAddSectionWithContent, index]);

  const handleCloseAddSectionModal = useCallback(() => {
    setShowAddSectionModal(false);
  }, []);

  const handleOpenSEOPanel = useCallback(() => {
    setShowSEOPanel(true);
  }, []);

  const handleCloseSEOPanel = useCallback(() => {
    setShowSEOPanel(false);
  }, []);

  const handleSaveSEO = useCallback((seo: SectionSEOAttributes) => {
    if (onUpdateSEO) {
      onUpdateSEO(sectionId, seo);
    }
    setShowSEOPanel(false);
  }, [onUpdateSEO, sectionId]);

  // ---- View Mode: render with SEO HTML attributes ----
  if (!isEditMode) {
    return (
      <section
        id={effectiveSEO.sectionId || undefined}
        aria-label={effectiveSEO.ariaLabel || undefined}
        data-section-name={effectiveSEO.dataSectionName || undefined}
      >
        {children}
      </section>
    );
  }

  // ---- Edit Mode: wrap with controls and SEO HTML attributes ----
  return (
    <>
      <section
        className="relative group/section-wrapper"
        data-section-id={sectionId}
        id={effectiveSEO.sectionId || undefined}
        aria-label={effectiveSEO.ariaLabel || undefined}
        data-section-name={effectiveSEO.dataSectionName || undefined}
      >
        {/* Section Controls - Bottom Bar (pinned to bottom-left to avoid overlapping content) */}
        {canEdit && (
          <div className="sticky bottom-0 left-0 z-30 flex items-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3">
            {/* Section Type Label */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg min-h-[44px] sm:min-h-0">
              <IconComponent className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              {meta.label}
            </span>

            {/* Reorder Controls */}
            <div className="flex items-center gap-0.5 bg-[#1A1A1A]/90 border border-[#333] rounded-full shadow-lg">
              <button
                onClick={handleMoveUp}
                disabled={isFirst}
                className="p-2.5 sm:p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors rounded-l-full hover:bg-[#2A2A2A] touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                title="Move section up"
              >
                <ChevronUp className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
              <div className="w-px h-5 sm:h-4 bg-[#333]" />
              <button
                onClick={handleMoveDown}
                disabled={isLast}
                className="p-2.5 sm:p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors rounded-r-full hover:bg-[#2A2A2A] touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                title="Move section down"
              >
                <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* SEO Button */}
            <button
              onClick={handleOpenSEOPanel}
              className={`p-2.5 sm:p-1.5 bg-[#1A1A1A]/90 border rounded-full transition-colors shadow-lg touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                hasSEOCustomization
                  ? 'border-[#C9A227]/40 text-[#C9A227] hover:border-[#C9A227]/60'
                  : 'border-[#333] text-gray-400 hover:text-[#C9A227] hover:border-[#C9A227]/40'
              }`}
              title="Section SEO settings"
            >
              <Search className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="p-2.5 sm:p-1.5 bg-[#1A1A1A]/90 border border-[#333] rounded-full text-gray-400 hover:text-red-400 hover:border-red-400/40 transition-colors shadow-lg touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title="Delete section"
            >
              <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* Section order indicator */}
        {canEdit && (
          <div className="absolute top-3 right-3 z-30">
            <span className="inline-flex items-center px-2 py-1 bg-[#1A1A1A]/90 border border-[#333] rounded-full text-[10px] text-gray-500 font-medium shadow-lg">
              {index + 1} / {totalSections}
            </span>
          </div>
        )}

        {/* Section Content */}
        {children}

        {/* Edit mode border indicator */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 pointer-events-none z-20 group-hover/section-wrapper:border-[#C9A227]/50 transition-colors rounded-sm" />
        )}
      </section>

      {/* Add Section Divider (after this section) */}
      {canEdit && onAddSection && (
        <AddSectionDivider onAdd={handleAddSectionClick} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          sectionLabel={meta.label}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* SEO Panel Modal */}
      {showSEOPanel && (
        <SEOPanel
          sectionType={sectionType}
          sectionId={sectionId}
          currentSEO={sectionSEO || {}}
          onSave={handleSaveSEO}
          onClose={handleCloseSEOPanel}
        />
      )}

      {/* Section Type Picker Modal (legacy, used when onAddSectionWithContent is not provided) */}
      {showTypePicker && (
        <SectionTypePicker
          onSelect={handleSelectSectionType}
          onClose={handleCloseTypePicker}
        />
      )}

      {/* Add Section Modal with visual previews and variant selection */}
      {showAddSectionModal && (
        <AddSectionModal
          onAdd={handleAddSectionWithContent}
          onClose={handleCloseAddSectionModal}
          insertOrder={index + 1}
        />
      )}
    </>
  );
}

// ============================================================================
// AddSectionButton - Standalone button for adding the first section or
// adding before the first section on the page
// ============================================================================

interface AddSectionButtonProps {
  /** Callback when a section type is selected. Receives the type. */
  onAddSection: (type: InlineSectionType) => void;
  /** Callback to add a section with full content (from AddSectionModal with variant). */
  onAddSectionWithContent?: (section: PageSectionContent) => void;
  /** Label variant for the button. */
  variant?: 'first' | 'before-first';
  /** Order index for new section (used by AddSectionModal). */
  insertOrder?: number;
}

export function AddSectionButton({ onAddSection, onAddSectionWithContent, variant = 'first', insertOrder = 0 }: AddSectionButtonProps) {
  const { canEdit, isEditMode } = useEditMode();
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  const handleSelectSectionType = useCallback((type: InlineSectionType) => {
    onAddSection(type);
    setShowTypePicker(false);
  }, [onAddSection]);

  const handleAddWithContent = useCallback((section: PageSectionContent) => {
    if (onAddSectionWithContent) {
      onAddSectionWithContent(section);
    }
    setShowAddSectionModal(false);
  }, [onAddSectionWithContent]);

  const handleClick = useCallback(() => {
    if (onAddSectionWithContent) {
      setShowAddSectionModal(true);
    } else {
      setShowTypePicker(true);
    }
  }, [onAddSectionWithContent]);

  if (!isEditMode || !canEdit) {
    return null;
  }

  const label = variant === 'first'
    ? 'Add Your First Section'
    : 'Add Section Here';

  return (
    <>
      <div className="flex justify-center py-8">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border-2 border-dashed border-[#C9A227]/40 rounded-xl text-[#C9A227] hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all touch-manipulation min-h-[44px]"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      </div>

      {showTypePicker && (
        <SectionTypePicker
          onSelect={handleSelectSectionType}
          onClose={() => setShowTypePicker(false)}
        />
      )}

      {showAddSectionModal && (
        <AddSectionModal
          onAdd={handleAddWithContent}
          onClose={() => setShowAddSectionModal(false)}
          insertOrder={insertOrder}
        />
      )}
    </>
  );
}
