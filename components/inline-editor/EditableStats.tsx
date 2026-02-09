'use client';

import { useState, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Type,
  Hash,
  BarChart,
} from 'lucide-react';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import { Counter } from '@/components/ui/ScrollAnimation';
import type { StatItem } from '@/types/inline-editor';

// ============================================================================
// Types
// ============================================================================

interface EditableStatsProps {
  /** Content key prefix for all stats fields (format: pageSlug:sectionId). */
  contentKeyPrefix: string;
  /** Section heading. */
  heading?: string;
  /** Section subheading. */
  subheading?: string;
  /** Stat items. */
  stats: StatItem[];
  /** Callback when stats array changes. */
  onStatsChange?: (stats: StatItem[]) => void;
  /** Additional children rendered below. */
  children?: ReactNode;
}

// ============================================================================
// Stat Editor Modal
// ============================================================================

interface StatEditorProps {
  stat: StatItem;
  onSave: (updated: StatItem) => void;
  onClose: () => void;
}

function StatEditor({ stat, onSave, onClose }: StatEditorProps) {
  const [value, setValue] = useState(String(stat.value));
  const [suffix, setSuffix] = useState(stat.suffix || '');
  const [prefix, setPrefix] = useState(stat.prefix || '');
  const [label, setLabel] = useState(stat.label);

  const handleSave = useCallback(() => {
    onSave({
      ...stat,
      value: Number(value) || 0,
      suffix: suffix || undefined,
      prefix: prefix || undefined,
      label,
    });
  }, [stat, value, suffix, prefix, label, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Edit Stat
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.slice(0, 5))}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-center"
                placeholder="$"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-center"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Suffix</label>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value.slice(0, 5))}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-center"
                placeholder="+, %, hr"
                maxLength={5}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Preview</p>
            <p className="text-3xl font-display font-bold text-[#C9A227]">
              {prefix}{value}{suffix}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value.slice(0, 40))}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
              placeholder="Descriptive label..."
              maxLength={40}
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
// EditableStats Component
// ============================================================================

export function EditableStats({
  contentKeyPrefix,
  heading,
  subheading,
  stats: initialStats,
  onStatsChange,
  children,
}: EditableStatsProps) {
  const { canEdit, isEditMode } = useEditMode();
  const { updateContent, pendingChanges } = useContent();

  // Local state
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [editorStatId, setEditorStatId] = useState<string | null>(null);

  // Update stats helper
  const updateStats = useCallback(
    (newStats: StatItem[]) => {
      setStats(newStats);
      onStatsChange?.(newStats);
      updateContent(
        `${contentKeyPrefix}:stats`,
        JSON.stringify(newStats),
        'text'
      );
    },
    [contentKeyPrefix, onStatsChange, updateContent]
  );

  // Add stat
  const handleAddStat = useCallback(() => {
    const newStat: StatItem = {
      id: `stat-${Date.now()}`,
      value: 0,
      suffix: '+',
      label: 'New Stat',
    };
    updateStats([...stats, newStat]);
  }, [stats, updateStats]);

  // Remove stat
  const handleRemoveStat = useCallback(
    (id: string) => {
      updateStats(stats.filter((s) => s.id !== id));
    },
    [stats, updateStats]
  );

  // Move stat
  const handleMoveStat = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const index = stats.findIndex((s) => s.id === id);
      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === stats.length - 1) return;

      const newStats = [...stats];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newStats[index], newStats[swapIndex]] = [newStats[swapIndex], newStats[index]];
      updateStats(newStats);
    },
    [stats, updateStats]
  );

  // Save edited stat
  const handleSaveStat = useCallback(
    (updated: StatItem) => {
      const newStats = stats.map((s) =>
        s.id === updated.id ? updated : s
      );
      updateStats(newStats);
      setEditorStatId(null);
    },
    [stats, updateStats]
  );

  // Resolve pending heading/subheading
  const headingKey = `${contentKeyPrefix}:heading`;
  const subheadingKey = `${contentKeyPrefix}:subheading`;
  const displayHeading = pendingChanges.get(headingKey)?.newValue ?? heading;
  const displaySubheading = pendingChanges.get(subheadingKey)?.newValue ?? subheading;

  // Get editing stat
  const editingStat = editorStatId
    ? stats.find((s) => s.id === editorStatId)
    : null;

  // ---- View Mode ----
  if (!isEditMode) {
    return (
      <div>
        {/* Heading / Subheading */}
        {(displayHeading || displaySubheading) && (
          <div className="text-center mb-12">
            {displayHeading && (
              <h2 className="text-display-sm font-display font-bold text-jhr-white mb-4">
                {displayHeading}
              </h2>
            )}
            {displaySubheading && (
              <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto">
                {displaySubheading}
              </p>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className={`grid gap-8 ${
          stats.length <= 2 ? 'grid-cols-2' :
          stats.length === 3 ? 'grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <div className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-gold mb-2">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <p className="text-body-md text-jhr-white-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {children}
      </div>
    );
  }

  // ---- Edit Mode ----
  return (
    <>
      <div className="relative group/stats">
        {/* Section Label */}
        {canEdit && (
          <div className="absolute -top-3 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/90 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Pencil className="w-3 h-3" />
              Stats Counter
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

        {/* Stats controls */}
        {canEdit && (
          <div className="flex items-center justify-end mb-4">
            <FieldLabel label="Stats" icon={<BarChart className="w-3 h-3" />} />
          </div>
        )}

        {/* Stats Grid */}
        <div className={`grid gap-8 ${
          stats.length <= 2 ? 'grid-cols-2' :
          stats.length === 3 ? 'grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="text-center relative group/stat"
            >
              {/* Stat Controls */}
              {canEdit && (
                <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
                  <button
                    onClick={() => setEditorStatId(stat.id)}
                    className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center text-black hover:bg-[#D4AF37] transition-colors"
                    title="Edit stat"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveStat(stat.id, 'up')}
                    disabled={index === 0}
                    className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move left"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveStat(stat.id, 'down')}
                    disabled={index === stats.length - 1}
                    className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move right"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveStat(stat.id)}
                    className="w-6 h-6 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors"
                    title="Remove stat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="text-display-sm sm:text-display-md font-display font-bold text-jhr-gold mb-2">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <p className="text-body-md text-jhr-white-muted">
                {stat.label}
              </p>

              {/* Edit mode border */}
              {canEdit && (
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover/stat:border-[#C9A227]/40 rounded-xl pointer-events-none transition-colors -m-3 p-3" />
              )}
            </div>
          ))}

          {/* Add Stat Button */}
          {canEdit && (
            <button
              onClick={handleAddStat}
              className="min-h-[100px] rounded-xl border-2 border-dashed border-[#333] hover:border-[#C9A227]/60 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#C9A227] transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Add Stat</span>
            </button>
          )}
        </div>

        {/* Section border in edit mode */}
        {canEdit && (
          <div className="absolute inset-0 border-2 border-dashed border-[#C9A227]/20 rounded-xl pointer-events-none group-hover/stats:border-[#C9A227]/40 transition-colors -m-4 p-4" />
        )}

        {children}
      </div>

      {/* Stat Editor Modal */}
      {editorStatId && editingStat && (
        <StatEditor
          stat={editingStat}
          onSave={handleSaveStat}
          onClose={() => setEditorStatId(null)}
        />
      )}
    </>
  );
}
