'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  ArrowLeft, FileText, Save, Loader2, AlertCircle, Eye, EyeOff,
  Image as ImageIcon, X, CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import MediaPicker from '@/components/admin/media/MediaPicker';
import { FloatingToolbar } from '@/components/inline-editor/FloatingToolbar';
import { createContentEditorExtensions, EDITOR_CLASSES } from '@/lib/tiptap-config';
import { blogTemplates, applyTemplate } from '@/lib/blog-templates';
import type { MediaPickerResult } from '@/types/media';

// Helper to replace template variables
function replaceVars(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`);
  }
  return result;
}

// Convert markdown-style headers to HTML
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive list items in ul
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraphs (lines that aren't already HTML)
    .split('\n\n')
    .map((block) => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<')) return block;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

export default function BlogCreatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);

  // Initialize Tiptap editor with content editor extensions
  const editor = useEditor({
    extensions: createContentEditorExtensions('Write your post content...'),
    content: '',
    editable: true,
    immediatelyRender: false,
    onFocus: () => setEditorFocused(true),
    onBlur: () => setEditorFocused(false),
  });

  const template = useMemo(
    () => blogTemplates.find((t) => t.id === selectedTemplate),
    [selectedTemplate]
  );

  const handleSelectTemplate = useCallback((id: string) => {
    const tpl = blogTemplates.find((t) => t.id === id);
    if (!tpl || !editor) return;
    setSelectedTemplate(id);
    setTemplateVars({});
    // Convert markdown template to HTML and set in editor
    const htmlContent = markdownToHtml(tpl.body);
    editor.commands.setContent(htmlContent);
    setTags(tpl.defaultTags.join(', '));
    setCategories(tpl.defaultCategories.join(', '));
  }, [editor]);

  const handleClearTemplate = useCallback(() => {
    setSelectedTemplate(null);
    editor?.commands.setContent('');
    setTags('');
    setCategories('');
  }, [editor]);

  const handleApplyVars = useCallback(() => {
    if (!template || !editor) return;
    const { body, tags: appliedTags, seoTitle, seoDescription } = applyTemplate(template, templateVars);
    const htmlContent = markdownToHtml(body);
    editor.commands.setContent(htmlContent);
    if (!title) {
      setTitle(seoTitle.replace(' | JHR Photography', ''));
    }
    if (!excerpt) {
      setExcerpt(seoDescription);
    }
    setTags(appliedTags.join(', '));
  }, [template, templateVars, editor, title, excerpt]);

  const handleSave = async () => {
    const bodyHtml = editor?.getHTML() || '';
    if (!title.trim() || !bodyHtml.trim() || bodyHtml === '<p></p>') {
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
          body: bodyHtml,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {blogTemplates.map((tpl) => (
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
            onClick={handleClearTemplate}
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
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Body</label>
            <div className="relative">
              {/* Floating Toolbar */}
              <FloatingToolbar editor={editor} visible={editorFocused} />

              {/* Editor Container */}
              <div
                className={`
                  min-h-[500px] bg-jhr-black-light border rounded-lg transition-colors
                  ${editorFocused ? 'border-jhr-gold/50' : 'border-jhr-black-lighter'}
                `}
              >
                <EditorContent
                  editor={editor}
                  className={`
                    ${EDITOR_CLASSES.prose}
                    p-4 min-h-[500px]
                    prose prose-invert prose-gold max-w-none
                    prose-headings:font-display prose-headings:text-jhr-white
                    prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4
                    prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                    prose-p:text-jhr-white-dim prose-p:mb-3
                    prose-li:text-jhr-white-dim
                    prose-strong:text-jhr-white
                    prose-a:text-jhr-gold
                    prose-ul:my-3 prose-ol:my-3
                  `}
                />
              </div>
            </div>
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
