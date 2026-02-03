'use client';

import { useMemo } from 'react';
import { FileText, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface BlogSEOMetricsProps {
  /** The HTML content from the editor */
  content: string;
  /** Target keyword for density calculation */
  targetKeyword: string;
  /** Callback when target keyword changes */
  onKeywordChange: (keyword: string) => void;
}

interface MetricStatus {
  status: 'good' | 'warning' | 'error';
  message: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Strip HTML tags and get plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Calculate keyword density percentage
 */
function calculateKeywordDensity(text: string, keyword: string): number {
  if (!text.trim() || !keyword.trim()) return 0;

  const words = text.toLowerCase().split(/\s+/).filter((word) => word.length > 0);
  const totalWords = words.length;
  if (totalWords === 0) return 0;

  // Count keyword occurrences (handle multi-word keywords)
  const keywordLower = keyword.toLowerCase().trim();
  const keywordWords = keywordLower.split(/\s+/);
  const textLower = text.toLowerCase();

  let count = 0;
  let searchStart = 0;

  while (true) {
    const index = textLower.indexOf(keywordLower, searchStart);
    if (index === -1) break;
    count++;
    searchStart = index + 1;
  }

  // Density = (keyword occurrences * words in keyword) / total words * 100
  const keywordWordCount = keywordWords.length;
  return (count * keywordWordCount / totalWords) * 100;
}

/**
 * Get word count status
 */
function getWordCountStatus(count: number): MetricStatus {
  if (count >= 800) {
    return { status: 'good', message: 'Great length for SEO' };
  }
  if (count >= 500) {
    return { status: 'warning', message: 'Consider adding more content' };
  }
  return { status: 'error', message: 'Too short for optimal SEO' };
}

/**
 * Get keyword density status
 */
function getKeywordDensityStatus(density: number, hasKeyword: boolean): MetricStatus {
  if (!hasKeyword) {
    return { status: 'warning', message: 'Enter a target keyword' };
  }
  if (density >= 1 && density <= 3) {
    return { status: 'good', message: 'Optimal keyword density' };
  }
  if (density > 0 && density < 1) {
    return { status: 'warning', message: 'Could use more keyword mentions' };
  }
  if (density > 3 && density <= 5) {
    return { status: 'warning', message: 'Slightly high - avoid keyword stuffing' };
  }
  if (density > 5) {
    return { status: 'error', message: 'Too high - reduce keyword usage' };
  }
  return { status: 'error', message: 'Keyword not found in content' };
}

// ============================================================================
// Status Icon Component
// ============================================================================

function StatusIcon({ status }: { status: MetricStatus['status'] }) {
  switch (status) {
    case 'good':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-400" />;
  }
}

function getStatusColor(status: MetricStatus['status']): string {
  switch (status) {
    case 'good':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
  }
}

function getStatusBorderColor(status: MetricStatus['status']): string {
  switch (status) {
    case 'good':
      return 'border-green-500/20';
    case 'warning':
      return 'border-yellow-500/20';
    case 'error':
      return 'border-red-500/20';
  }
}

function getStatusBgColor(status: MetricStatus['status']): string {
  switch (status) {
    case 'good':
      return 'bg-green-500/10';
    case 'warning':
      return 'bg-yellow-500/10';
    case 'error':
      return 'bg-red-500/10';
  }
}

// ============================================================================
// BlogSEOMetrics Component
// ============================================================================

export function BlogSEOMetrics({ content, targetKeyword, onKeywordChange }: BlogSEOMetricsProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const plainText = stripHtml(content);
    const wordCount = countWords(plainText);
    const keywordDensity = calculateKeywordDensity(plainText, targetKeyword);
    const wordCountStatus = getWordCountStatus(wordCount);
    const densityStatus = getKeywordDensityStatus(keywordDensity, !!targetKeyword.trim());

    // Count keyword occurrences
    const keywordCount = targetKeyword.trim()
      ? (plainText.toLowerCase().match(new RegExp(targetKeyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      : 0;

    return {
      wordCount,
      keywordDensity,
      keywordCount,
      wordCountStatus,
      densityStatus,
    };
  }, [content, targetKeyword]);

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-jhr-gold" />
        <h3 className="text-body-sm font-semibold text-jhr-white">SEO Metrics</h3>
      </div>

      {/* Target Keyword Input */}
      <div>
        <label className="block text-xs font-medium text-jhr-white-dim mb-1.5">
          Target Keyword
        </label>
        <input
          type="text"
          value={targetKeyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="e.g., Nashville Corporate Event Photographer"
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
        />
      </div>

      {/* Word Count */}
      <div className={`p-3 rounded-lg border ${getStatusBgColor(metrics.wordCountStatus.status)} ${getStatusBorderColor(metrics.wordCountStatus.status)}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-body-sm font-medium text-jhr-white">Word Count</span>
          </div>
          <StatusIcon status={metrics.wordCountStatus.status} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${getStatusColor(metrics.wordCountStatus.status)}`}>
            {metrics.wordCount.toLocaleString()}
          </span>
          <span className="text-xs text-jhr-white-dim">/ 800+ target</span>
        </div>
        <p className={`text-xs mt-1 ${getStatusColor(metrics.wordCountStatus.status)}`}>
          {metrics.wordCountStatus.message}
        </p>
      </div>

      {/* Keyword Density */}
      <div className={`p-3 rounded-lg border ${getStatusBgColor(metrics.densityStatus.status)} ${getStatusBorderColor(metrics.densityStatus.status)}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-body-sm font-medium text-jhr-white">Keyword Density</span>
          </div>
          <StatusIcon status={metrics.densityStatus.status} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${getStatusColor(metrics.densityStatus.status)}`}>
            {metrics.keywordDensity.toFixed(1)}%
          </span>
          <span className="text-xs text-jhr-white-dim">/ 1-3% target</span>
        </div>
        {targetKeyword.trim() && (
          <p className="text-xs text-jhr-white-dim mt-1">
            &quot;{targetKeyword}&quot; appears {metrics.keywordCount} time{metrics.keywordCount !== 1 ? 's' : ''}
          </p>
        )}
        <p className={`text-xs mt-1 ${getStatusColor(metrics.densityStatus.status)}`}>
          {metrics.densityStatus.message}
        </p>
      </div>

      {/* Quick Tips */}
      <div className="pt-2 border-t border-jhr-black-lighter">
        <p className="text-xs text-jhr-white-dim">
          <strong className="text-jhr-white">Tips:</strong> Aim for 800+ words with 1-3% keyword density. Include your keyword in the title, first paragraph, and at least one heading.
        </p>
      </div>
    </div>
  );
}
