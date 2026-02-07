'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
  Plus,
  Columns,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { SectionRenderer } from './SectionRenderer';
import { AddSectionModal } from './AddSectionModal';
import type {
  ColumnsLayout,
  ColumnsSectionContent,
  PageSectionContent,
  InlineSectionType,
} from '@/types/inline-editor';

// ============================================================================
// Layout Definitions
// ============================================================================

interface LayoutOption {
  value: ColumnsLayout;
  label: string;
  /** Tailwind grid-cols class */
  gridClass: string;
  colCount: number;
  /** Visual preview widths as fractions for buttons */
  preview: number[];
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  { value: 'equal-2', label: '50 / 50', gridClass: 'grid-cols-1 md:grid-cols-2', colCount: 2, preview: [1, 1] },
  { value: '1/3-2/3', label: '33 / 67', gridClass: 'grid-cols-1 md:grid-cols-[1fr_2fr]', colCount: 2, preview: [1, 2] },
  { value: '2/3-1/3', label: '67 / 33', gridClass: 'grid-cols-1 md:grid-cols-[2fr_1fr]', colCount: 2, preview: [2, 1] },
  { value: '1/4-3/4', label: '25 / 75', gridClass: 'grid-cols-1 md:grid-cols-[1fr_3fr]', colCount: 2, preview: [1, 3] },
  { value: '3/4-1/4', label: '75 / 25', gridClass: 'grid-cols-1 md:grid-cols-[3fr_1fr]', colCount: 2, preview: [3, 1] },
  { value: 'equal-3', label: '33 / 33 / 33', gridClass: 'grid-cols-1 md:grid-cols-3', colCount: 3, preview: [1, 1, 1] },
];

function getLayoutOption(layout: ColumnsLayout): LayoutOption {
  return LAYOUT_OPTIONS.find((o) => o.value === layout) || LAYOUT_OPTIONS[0];
}

/** Section types excluded from column children */
const EXCLUDED_CHILD_TYPES: InlineSectionType[] = ['hero', 'columns'];

// ============================================================================
// Drag-and-Drop Data
// ============================================================================

interface DragData {
  parentId: string;
  sourceColIndex: number;
  sectionId: string;
}

// ============================================================================
// Layout Selector
// ============================================================================

function LayoutSelector({
  current,
  onChange,
}: {
  current: ColumnsLayout;
  onChange: (layout: ColumnsLayout) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mr-1">
        Layout
      </span>
      {LAYOUT_OPTIONS.map((opt) => {
        const isActive = current === opt.value;
        const total = opt.preview.reduce((a, b) => a + b, 0);
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-0.5 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-all ${
              isActive
                ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]'
                : 'border-[#333] bg-[#0A0A0A] text-gray-500 hover:border-[#555] hover:text-gray-300'
            }`}
            title={opt.label}
          >
            {/* Mini visual preview */}
            <div className="flex gap-px h-3 w-8">
              {opt.preview.map((w, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${isActive ? 'bg-[#C9A227]' : 'bg-gray-600'}`}
                  style={{ flex: w / total }}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Child Section Controls (lightweight: move up/down, delete, drag handle)
// ============================================================================

function ChildSectionControls({
  sectionId,
  index,
  total,
  parentId,
  colIndex,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  sectionId: string;
  index: number;
  total: number;
  parentId: string;
  colIndex: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="absolute top-1 right-1 z-30 flex items-center gap-0.5 bg-[#1A1A1A]/95 border border-[#333] rounded-lg shadow-lg opacity-0 group-hover/child:opacity-100 transition-opacity">
      {/* Drag handle */}
      <div
        className="p-1.5 cursor-grab active:cursor-grabbing text-gray-500 hover:text-[#C9A227] transition-colors"
        title="Drag to reorder"
        draggable
        onDragStart={(e) => {
          const data: DragData = { parentId, sourceColIndex: colIndex, sectionId };
          e.dataTransfer.setData('application/json', JSON.stringify(data));
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>
      <div className="w-px h-4 bg-[#333]" />
      <button
        onClick={onMoveUp}
        disabled={isFirst}
        className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
        title="Move up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={isLast}
        className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
        title="Move down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-[#333]" />
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
        title="Remove from column"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ============================================================================
// Column Drop Zone
// ============================================================================

function ColumnDropZone({
  parentId,
  colIndex,
  colLabel,
  childSections,
  pageSlug,
  onAddClick,
}: {
  parentId: string;
  colIndex: number;
  colLabel: string;
  childSections: PageSectionContent[];
  pageSlug: string;
  onAddClick: () => void;
}) {
  const { canEdit, isEditMode } = useEditMode();
  const { removeSectionFromColumn, moveSectionBetweenColumns } = useContent();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOver(false);

    try {
      const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.parentId !== parentId) return; // Only allow moves within the same columns section

      // Calculate target index based on drop position
      const dropTarget = e.currentTarget as HTMLElement;
      const rect = dropTarget.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const relativeY = mouseY / rect.height;

      // Default: append to end
      let targetIndex = childSections.length;

      // If dropping within existing items, calculate position
      if (childSections.length > 0) {
        targetIndex = Math.round(relativeY * childSections.length);
        targetIndex = Math.min(Math.max(0, targetIndex), childSections.length);
      }

      moveSectionBetweenColumns(parentId, data.sourceColIndex, colIndex, data.sectionId, targetIndex);
    } catch {
      // Invalid drag data
    }
  }, [parentId, colIndex, childSections.length, moveSectionBetweenColumns]);

  const handleMoveUp = useCallback((sectionId: string, idx: number) => {
    if (idx <= 0) return;
    moveSectionBetweenColumns(parentId, colIndex, colIndex, sectionId, idx - 1);
  }, [parentId, colIndex, moveSectionBetweenColumns]);

  const handleMoveDown = useCallback((sectionId: string, idx: number) => {
    if (idx >= childSections.length - 1) return;
    moveSectionBetweenColumns(parentId, colIndex, colIndex, sectionId, idx + 2);
  }, [parentId, colIndex, childSections.length, moveSectionBetweenColumns]);

  const handleDelete = useCallback((sectionId: string) => {
    removeSectionFromColumn(parentId, colIndex, sectionId);
  }, [parentId, colIndex, removeSectionFromColumn]);

  return (
    <div
      className={`relative min-h-[80px] rounded-lg transition-colors ${
        isEditMode && canEdit
          ? isDragOver
            ? 'bg-[#C9A227]/10 border-2 border-dashed border-[#C9A227]/60'
            : 'bg-[#111]/50 border border-dashed border-[#333] hover:border-[#555]'
          : ''
      }`}
      onDragEnter={isEditMode && canEdit ? handleDragEnter : undefined}
      onDragLeave={isEditMode && canEdit ? handleDragLeave : undefined}
      onDragOver={isEditMode && canEdit ? handleDragOver : undefined}
      onDrop={isEditMode && canEdit ? handleDrop : undefined}
    >
      {/* Column label (edit mode only) */}
      {isEditMode && canEdit && (
        <div className="px-2 py-1">
          <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">
            {colLabel}
          </span>
        </div>
      )}

      {/* Child sections */}
      {childSections.map((child, idx) => (
        <div key={child.id} className="relative group/child">
          {isEditMode && canEdit && (
            <ChildSectionControls
              sectionId={child.id}
              index={idx}
              total={childSections.length}
              parentId={parentId}
              colIndex={colIndex}
              onMoveUp={() => handleMoveUp(child.id, idx)}
              onMoveDown={() => handleMoveDown(child.id, idx)}
              onDelete={() => handleDelete(child.id)}
            />
          )}
          <SectionRenderer
            section={child}
            pageSlug={pageSlug}
            isNested
          />
        </div>
      ))}

      {/* Empty state / Add button (edit mode only) */}
      {isEditMode && canEdit && (
        <div className="flex justify-center py-3">
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1A1A1A] border border-dashed border-[#333] rounded-lg text-xs text-gray-500 hover:border-[#C9A227]/60 hover:text-[#C9A227] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {childSections.length === 0 ? 'Add content' : 'Add'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EditableColumns Component
// ============================================================================

interface EditableColumnsProps {
  /** The columns section data. */
  section: ColumnsSectionContent;
  /** Page slug for content key routing. */
  pageSlug: string;
}

export function EditableColumns({ section, pageSlug }: EditableColumnsProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateSection, addSectionToColumn } = useContent();
  const [addModalCol, setAddModalCol] = useState<number | null>(null);

  const layoutOption = getLayoutOption(section.layout);

  /** Handle layout change — adjusts column count if needed. */
  const handleLayoutChange = useCallback((newLayout: ColumnsLayout) => {
    const newOption = getLayoutOption(newLayout);
    const currentCols = section.columns;
    let newColumns = [...currentCols];

    if (newOption.colCount > currentCols.length) {
      // Add empty columns
      while (newColumns.length < newOption.colCount) {
        newColumns.push({ sections: [] });
      }
    } else if (newOption.colCount < currentCols.length) {
      // Merge extra columns into the last remaining column
      const lastIdx = newOption.colCount - 1;
      const mergedSections = newColumns
        .slice(lastIdx)
        .flatMap((c) => c.sections);
      newColumns = newColumns.slice(0, newOption.colCount);
      newColumns[lastIdx] = { sections: mergedSections };
    }

    updateSection(section.id, { layout: newLayout, columns: newColumns } as Partial<PageSectionContent>);
  }, [section.id, section.columns, updateSection]);

  /** Handle adding a child section from the modal. */
  const handleAddChild = useCallback((childSection: PageSectionContent) => {
    if (addModalCol === null) return;
    addSectionToColumn(section.id, addModalCol, childSection);
    setAddModalCol(null);
  }, [section.id, addModalCol, addSectionToColumn]);

  return (
    <div>
      {/* Layout selector toolbar (edit mode only) */}
      {isEditMode && canEdit && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 mb-2 bg-[#0A0A0A] border border-[#333] rounded-lg">
          <div className="flex items-center gap-2">
            <Columns className="w-4 h-4 text-[#C9A227]" />
            <span className="text-xs text-gray-400 font-medium">Columns</span>
          </div>
          <LayoutSelector current={section.layout} onChange={handleLayoutChange} />
        </div>
      )}

      {/* Column grid */}
      <div className={`grid gap-4 ${layoutOption.gridClass}`}>
        {section.columns.map((col, colIdx) => (
          <ColumnDropZone
            key={colIdx}
            parentId={section.id}
            colIndex={colIdx}
            colLabel={`Column ${colIdx + 1}`}
            childSections={col.sections}
            pageSlug={pageSlug}
            onAddClick={() => setAddModalCol(colIdx)}
          />
        ))}
      </div>

      {/* Add Section Modal for column children */}
      {addModalCol !== null && (
        <AddSectionModal
          onAdd={handleAddChild}
          onClose={() => setAddModalCol(null)}
          insertOrder={0}
          excludeTypes={EXCLUDED_CHILD_TYPES}
        />
      )}
    </div>
  );
}
