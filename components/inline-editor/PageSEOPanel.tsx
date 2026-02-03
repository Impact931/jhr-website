'use client';

import { useState } from 'react';
import {
  Search,
  Globe,
  Image as ImageIcon,
  X,
  ExternalLink,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { useContent } from '@/context/inline-editor/ContentContext';
import ImageUploader from '@/components/admin/ImageUploader';
import type { PageSEOMetadata } from '@/types/inline-editor';

/**
 * Character count indicator component.
 * Shows current count, recommended range, and color coding:
 * - Green: within recommended range
 * - Amber: close to limits (within 10 chars of min or max)
 * - Red: outside recommended range
 */
function CharCount({
  value,
  min,
  max,
}: {
  value: string;
  min: number;
  max: number;
}) {
  const len = value.length;
  const isInRange = len >= min && len <= max;
  const isClose = (len >= min - 10 && len < min) || (len > max && len <= max + 10);
  const isEmpty = len === 0;

  let colorClass = 'text-red-400';
  let Icon = AlertTriangle;
  if (isEmpty) {
    colorClass = 'text-zinc-500';
    Icon = AlertTriangle;
  } else if (isInRange) {
    colorClass = 'text-green-400';
    Icon = Check;
  } else if (isClose) {
    colorClass = 'text-amber-400';
    Icon = AlertTriangle;
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs ${colorClass}`}>
      {!isEmpty && <Icon className="w-3 h-3" />}
      <span>{len} / {min}&ndash;{max} chars</span>
    </div>
  );
}

/**
 * Google Search preview card.
 * Simulates how the page appears in Google search results.
 */
function GooglePreview({ seo }: { seo: PageSEOMetadata }) {
  const title = seo.pageTitle || 'Page Title';
  const description = seo.metaDescription || 'Add a meta description to see how this page appears in search results.';
  const url = 'jhrphotography.com';

  return (
    <div className="rounded-lg border border-zinc-700/50 bg-white p-4">
      <div className="text-xs text-[#202124] mb-1 flex items-center gap-1">
        <Globe className="w-3 h-3 text-zinc-400" />
        <span className="text-sm text-[#4d5156]">{url}</span>
      </div>
      <div
        className="text-[#1a0dab] text-lg leading-snug mb-1 line-clamp-1 font-medium"
        style={{ fontFamily: 'arial, sans-serif' }}
      >
        {title}
      </div>
      <div
        className="text-[#4d5156] text-sm leading-relaxed line-clamp-2"
        style={{ fontFamily: 'arial, sans-serif' }}
      >
        {description}
      </div>
    </div>
  );
}

/**
 * Social (OG) share preview card.
 * Simulates how the page appears when shared on social media.
 */
function SocialPreview({ seo }: { seo: PageSEOMetadata }) {
  const title = seo.ogTitle || seo.pageTitle || 'Page Title';
  const description = seo.ogDescription || seo.metaDescription || 'Add a description to see how this page appears on social media.';
  const image = seo.ogImage;

  return (
    <div className="rounded-lg border border-zinc-700/50 overflow-hidden bg-[#18191A]">
      {/* Image preview area */}
      <div className="relative w-full aspect-[1.91/1] bg-zinc-800 flex items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="OG preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs">No OG image set</span>
          </div>
        )}
      </div>
      {/* Text area */}
      <div className="px-3 py-2.5">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">
          jhrphotography.com
        </div>
        <div className="text-sm font-semibold text-zinc-100 line-clamp-1">
          {title}
        </div>
        <div className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
          {description}
        </div>
      </div>
    </div>
  );
}

type SEOTab = 'fields' | 'preview';

/**
 * Page-level SEO editor panel.
 * Shown in the EditModeToggle expanded state.
 * Allows editing: Page Title, Meta Description, OG Image, OG Title, OG Description.
 */
export function PageSEOPanel({ onClose }: { onClose: () => void }) {
  const { pageSEO, updatePageSEO } = useContent();
  const [activeTab, setActiveTab] = useState<SEOTab>('fields');
  const [showImageUploader, setShowImageUploader] = useState(false);

  const handleChange = (field: keyof PageSEOMetadata, value: string) => {
    updatePageSEO({ [field]: value });
  };

  const handleImageUpload = (url: string) => {
    updatePageSEO({ ogImage: url });
    setShowImageUploader(false);
  };

  const handleRemoveImage = () => {
    updatePageSEO({ ogImage: '' });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0F0F0F] border border-zinc-700/50 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700/50">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-jhr-gold" />
            <h2 className="text-lg font-semibold text-jhr-white">Page SEO Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-jhr-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-700/50 px-5">
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'fields'
                ? 'border-jhr-gold text-jhr-gold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Edit Fields
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-jhr-gold text-jhr-gold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {activeTab === 'fields' && (
            <>
              {/* Page Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-300">Page Title</label>
                  <CharCount value={pageSEO.pageTitle || ''} min={50} max={60} />
                </div>
                <input
                  type="text"
                  value={pageSEO.pageTitle || ''}
                  onChange={(e) => handleChange('pageTitle', e.target.value)}
                  placeholder="Enter page title (appears in browser tab and search results)"
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-jhr-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold/50 transition-all"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Appears in the browser tab and as the main link in Google search results.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-300">Meta Description</label>
                  <CharCount value={pageSEO.metaDescription || ''} min={150} max={160} />
                </div>
                <textarea
                  value={pageSEO.metaDescription || ''}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Enter a compelling description (shown below the title in search results)"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-jhr-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold/50 transition-all resize-none"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Shown below the title in search results. Write a compelling summary to improve click-through rate.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-700/30 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <ExternalLink className="w-4 h-4 text-jhr-gold" />
                  <span className="text-sm font-medium text-zinc-300">Open Graph (Social Sharing)</span>
                </div>
              </div>

              {/* OG Image */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-300">OG Image</label>
                  {pageSEO.ogImage && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Image set
                    </span>
                  )}
                </div>
                {pageSEO.ogImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-700/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pageSEO.ogImage}
                      alt="OG preview"
                      className="w-full aspect-[1.91/1] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <button
                        onClick={() => setShowImageUploader(true)}
                        className="px-3 py-1.5 text-xs font-medium bg-zinc-800/90 text-zinc-200 rounded-md hover:bg-zinc-700 transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 text-xs font-medium bg-red-900/80 text-red-200 rounded-md hover:bg-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowImageUploader(true)}
                    className="w-full aspect-[1.91/1] max-h-48 bg-zinc-900 border-2 border-dashed border-zinc-700/50 rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-600 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">Click to upload OG image</span>
                    <span className="text-xs text-zinc-600">Recommended: 1200 x 630 pixels</span>
                  </button>
                )}
                <p className="mt-1 text-xs text-zinc-500">
                  Image displayed when the page is shared on social media. Recommended size: 1200 x 630px.
                </p>
              </div>

              {/* OG Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-300">OG Title</label>
                  <CharCount value={pageSEO.ogTitle || ''} min={50} max={60} />
                </div>
                <input
                  type="text"
                  value={pageSEO.ogTitle || ''}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  placeholder={pageSEO.pageTitle || 'Defaults to Page Title if empty'}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-jhr-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold/50 transition-all"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Title shown when shared on social media. Defaults to Page Title if empty.
                </p>
              </div>

              {/* OG Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-300">OG Description</label>
                  <CharCount value={pageSEO.ogDescription || ''} min={150} max={160} />
                </div>
                <textarea
                  value={pageSEO.ogDescription || ''}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  placeholder={pageSEO.metaDescription || 'Defaults to Meta Description if empty'}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-jhr-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold/50 transition-all resize-none"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Description shown when shared on social media. Defaults to Meta Description if empty.
                </p>
              </div>
            </>
          )}

          {activeTab === 'preview' && (
            <>
              {/* Google Preview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Google Search Preview</span>
                </div>
                <GooglePreview seo={pageSEO} />
              </div>

              {/* Social Preview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Social Share Preview</span>
                </div>
                <SocialPreview seo={pageSEO} />
              </div>

              {/* SEO Score Summary */}
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/50 p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">SEO Checklist</h3>
                <div className="space-y-2">
                  <SEOCheckItem
                    label="Page Title"
                    value={pageSEO.pageTitle || ''}
                    min={50}
                    max={60}
                  />
                  <SEOCheckItem
                    label="Meta Description"
                    value={pageSEO.metaDescription || ''}
                    min={150}
                    max={160}
                  />
                  <SEOCheckItem
                    label="OG Image"
                    value={pageSEO.ogImage || ''}
                    isImage
                  />
                  <SEOCheckItem
                    label="OG Title"
                    value={pageSEO.ogTitle || pageSEO.pageTitle || ''}
                    min={50}
                    max={60}
                    fallback={!pageSEO.ogTitle && !!pageSEO.pageTitle}
                  />
                  <SEOCheckItem
                    label="OG Description"
                    value={pageSEO.ogDescription || pageSEO.metaDescription || ''}
                    min={150}
                    max={160}
                    fallback={!pageSEO.ogDescription && !!pageSEO.metaDescription}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-700/50 bg-zinc-900/30">
          <p className="text-xs text-zinc-500">
            Changes auto-save with page content
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-jhr-gold text-jhr-black rounded-lg hover:bg-jhr-gold-light transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0F0F0F] border border-zinc-700/50 rounded-xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-jhr-white">Upload OG Image</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="p-1 rounded text-zinc-400 hover:text-jhr-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Recommended size: 1200 x 630 pixels (1.91:1 ratio)
            </p>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual SEO checklist item for the preview tab.
 */
function SEOCheckItem({
  label,
  value,
  min,
  max,
  isImage,
  fallback,
}: {
  label: string;
  value: string;
  min?: number;
  max?: number;
  isImage?: boolean;
  fallback?: boolean;
}) {
  let status: 'good' | 'warning' | 'missing' = 'missing';

  if (isImage) {
    status = value ? 'good' : 'missing';
  } else if (value && min !== undefined && max !== undefined) {
    const len = value.length;
    if (len >= min && len <= max) {
      status = 'good';
    } else if (len > 0) {
      status = 'warning';
    }
  }

  const statusConfig = {
    good: { icon: Check, color: 'text-green-400', bg: 'bg-green-400/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    missing: { icon: X, color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  const { icon: StatusIcon, color, bg } = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center`}>
        <StatusIcon className={`w-3 h-3 ${color}`} />
      </div>
      <span className="text-sm text-zinc-300 flex-1">{label}</span>
      {fallback && (
        <span className="text-xs text-zinc-500">(using fallback)</span>
      )}
      {!isImage && value && min !== undefined && max !== undefined && (
        <span className={`text-xs ${color}`}>
          {value.length} / {min}&ndash;{max}
        </span>
      )}
    </div>
  );
}
