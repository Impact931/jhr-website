'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, FileText, Save, Loader2, AlertCircle, Eye, EyeOff,
  Image as ImageIcon, X, CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';

interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  variables: { key: string; label: string; placeholder: string; required: boolean }[];
  body: string;
  defaultTags: string[];
  defaultCategories: string[];
  seoTitleTemplate: string;
  seoDescriptionTemplate: string;
}

// Templates defined inline to avoid importing server-side code in client component
const templates: BlogTemplate[] = [
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructions for a specific topic.',
    variables: [
      { key: 'topic', label: 'Topic', placeholder: 'e.g., Plan a Corporate Headshot Day', required: true },
      { key: 'audience', label: 'Target Audience', placeholder: 'e.g., Event planners', required: false },
    ],
    body: '# How to {{topic}}\n\n{{audience}} — here\'s everything you need to know about {{topic}}.\n\n## What You\'ll Need\n\n- Item 1\n- Item 2\n\n## Step 1: Getting Started\n\nDescribe the first step.\n\n## Step 2: Implementation\n\nDescribe the second step.\n\n## Conclusion\n\nSummarize key takeaways.',
    defaultTags: ['how-to', 'guide'],
    defaultCategories: ['Guides'],
    seoTitleTemplate: 'How to {{topic}} | JHR Photography',
    seoDescriptionTemplate: 'Learn how to {{topic}} with this step-by-step guide from JHR Photography.',
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Numbered list format for tips, ideas, or recommendations.',
    variables: [
      { key: 'count', label: 'Number of Items', placeholder: 'e.g., 10', required: true },
      { key: 'topic', label: 'Topic', placeholder: 'e.g., Corporate Event Photography Tips', required: true },
    ],
    body: '# {{count}} {{topic}}\n\nIntroduction about {{topic}}.\n\n## 1. First Item\n\nDescription.\n\n## 2. Second Item\n\nDescription.\n\n## 3. Third Item\n\nDescription.\n\n## Final Thoughts\n\nWrap up with a summary.',
    defaultTags: ['tips', 'list'],
    defaultCategories: ['Tips & Advice'],
    seoTitleTemplate: '{{count}} {{topic}} | JHR Photography',
    seoDescriptionTemplate: 'Discover {{count}} {{topic}} from JHR Photography.',
  },
  {
    id: 'location-seo',
    name: 'Location-Based SEO',
    description: 'Service + city pattern for local search optimization.',
    variables: [
      { key: 'service', label: 'Service', placeholder: 'e.g., Corporate Event Photography', required: true },
      { key: 'city', label: 'City', placeholder: 'e.g., Nashville', required: true },
      { key: 'venue', label: 'Featured Venue', placeholder: 'e.g., Music City Center', required: false },
    ],
    body: '# {{service}} in {{city}}\n\nLooking for professional {{service}} in {{city}}? JHR Photography delivers agency-grade results.\n\n## Why Choose JHR in {{city}}\n\n- Local expertise\n- Professional equipment\n- Same-day delivery\n\n## Our Services\n\nEvent coverage, headshot activations, and video services.\n\n## Book Your {{city}} Photographer\n\n[Contact us](/contact) for a free consultation.',
    defaultTags: ['local-seo'],
    defaultCategories: ['Local SEO'],
    seoTitleTemplate: '{{service}} in {{city}} | JHR Photography',
    seoDescriptionTemplate: 'Professional {{service}} in {{city}}. JHR Photography provides agency-grade event photography.',
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Challenge / Solution / Results format for showcasing work.',
    variables: [
      { key: 'client', label: 'Client Name', placeholder: 'e.g., ACME Corporation', required: true },
      { key: 'event', label: 'Event Name', placeholder: 'e.g., Annual Leadership Summit', required: true },
      { key: 'venue', label: 'Venue', placeholder: 'e.g., Gaylord Opryland', required: false },
    ],
    body: '# Case Study: {{client}} — {{event}}\n\n## Overview\n\nJHR Photography provided event photography for {{client}} at {{event}}.\n\n## The Challenge\n\n- Challenge 1\n- Challenge 2\n\n## Our Solution\n\nDescribe the approach.\n\n## Results\n\n- **Photos Delivered**: X\n- **Turnaround**: X hours\n\n> "Great experience." — Client',
    defaultTags: ['case-study', 'portfolio'],
    defaultCategories: ['Case Studies'],
    seoTitleTemplate: '{{client}} {{event}} Photography | JHR Photography',
    seoDescriptionTemplate: 'See how JHR Photography delivered professional photography for {{client}} at {{event}}.',
  },
];

function replaceVars(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`);
  }
  return result;
}

export default function BlogCreatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const template = useMemo(
    () => templates.find((t) => t.id === selectedTemplate),
    [selectedTemplate]
  );

  const handleSelectTemplate = (id: string) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setSelectedTemplate(id);
    setTemplateVars({});
    setBody(tpl.body);
    setTags(tpl.defaultTags.join(', '));
    setCategories(tpl.defaultCategories.join(', '));
  };

  const handleApplyVars = () => {
    if (!template) return;
    const applied = replaceVars(template.body, templateVars);
    setBody(applied);
    if (!title) {
      setTitle(replaceVars(template.seoTitleTemplate, templateVars).replace(' | JHR Photography', ''));
    }
    if (!excerpt) {
      setExcerpt(replaceVars(template.seoDescriptionTemplate, templateVars));
    }
    setTags(template.defaultTags.map((t) => replaceVars(t, templateVars)).join(', '));
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          excerpt: excerpt || undefined,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          categories: categories.split(',').map((c) => c.trim()).filter(Boolean),
          featuredImage: featuredImage || undefined,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }
      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (results: MediaPickerResult[]) => {
    if (results.length > 0) {
      setFeaturedImage(results[0].publicUrl);
    }
    setMediaPickerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-display-sm font-display font-bold text-jhr-white">Create Blog Post</h1>
          <p className="mt-1 text-body-sm text-jhr-white-dim">Choose a template or start from scratch.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatus(status === 'draft' ? 'published' : 'draft')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              status === 'published'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}
          >
            {status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Template Selector */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <h2 className="text-body-md font-semibold text-jhr-white mb-4">Choose a Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`text-left p-4 rounded-lg border transition-colors ${
                selectedTemplate === tpl.id
                  ? 'border-jhr-gold bg-jhr-gold/5'
                  : 'border-jhr-black-lighter hover:border-jhr-gold/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className={`w-4 h-4 ${selectedTemplate === tpl.id ? 'text-jhr-gold' : 'text-jhr-white-dim'}`} />
                <span className={`text-body-sm font-medium ${selectedTemplate === tpl.id ? 'text-jhr-gold' : 'text-jhr-white'}`}>
                  {tpl.name}
                </span>
              </div>
              <p className="text-xs text-jhr-white-dim">{tpl.description}</p>
            </button>
          ))}
          <button
            onClick={() => { setSelectedTemplate(null); setBody(''); setTags(''); setCategories(''); }}
            className={`text-left p-4 rounded-lg border transition-colors ${
              selectedTemplate === null
                ? 'border-jhr-gold bg-jhr-gold/5'
                : 'border-jhr-black-lighter hover:border-jhr-gold/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className={`w-4 h-4 ${selectedTemplate === null ? 'text-jhr-gold' : 'text-jhr-white-dim'}`} />
              <span className={`text-body-sm font-medium ${selectedTemplate === null ? 'text-jhr-gold' : 'text-jhr-white'}`}>
                Blank
              </span>
            </div>
            <p className="text-xs text-jhr-white-dim">Start from scratch.</p>
          </button>
        </div>
      </div>

      {/* Template Variables */}
      {template && template.variables.length > 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <h2 className="text-body-md font-semibold text-jhr-white mb-4">Template Variables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {template.variables.map((v) => (
              <div key={v.key}>
                <label className="block text-body-sm font-medium text-jhr-white mb-1">
                  {v.label} {v.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={templateVars[v.key] || ''}
                  onChange={(e) => setTemplateVars({ ...templateVars, [v.key]: e.target.value })}
                  placeholder={v.placeholder}
                  className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleApplyVars}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-jhr-gold/10 text-jhr-gold text-body-sm font-medium hover:bg-jhr-gold/20 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Variables
          </button>
        </div>
      )}

      {/* Post Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full px-4 py-3 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-jhr-white text-lg placeholder:text-jhr-white-dim focus:outline-none focus:border-jhr-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Body (Markdown/HTML)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post content..."
              rows={20}
              className="w-full px-4 py-3 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:border-jhr-gold/50 transition-colors font-mono text-sm resize-y"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Featured Image */}
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
            <label className="block text-body-sm font-medium text-jhr-white mb-3">Featured Image</label>
            {featuredImage ? (
              <div className="relative mb-3">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-40 rounded-lg object-cover"
                />
                <button
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setMediaPickerOpen(true)}
                className="w-full h-32 rounded-lg border-2 border-dashed border-jhr-black-lighter flex flex-col items-center justify-center cursor-pointer hover:border-jhr-gold/30 transition-colors mb-3"
              >
                <ImageIcon className="w-8 h-8 text-jhr-white-dim mb-2" />
                <span className="text-body-sm text-jhr-white-dim">Click to select</span>
              </div>
            )}
            <button
              onClick={() => setMediaPickerOpen(true)}
              className="w-full px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors"
            >
              {featuredImage ? 'Change Image' : 'Select from Media Library'}
            </button>
          </div>

          {/* Excerpt */}
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for listing cards..."
              rows={3}
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm resize-none"
            />
          </div>

          {/* Tags */}
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="photography, events, corporate..."
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
            />
          </div>

          {/* Categories */}
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Categories (comma separated)</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Guides, Tips & Advice..."
              className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
            />
          </div>
        </div>
      </div>

      {/* MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        options={{ allowedTypes: ['image'], multiple: false }}
      />
    </div>
  );
}
