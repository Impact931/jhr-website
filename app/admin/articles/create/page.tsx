'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { SectionRenderer } from '@/components/inline-editor/SectionRenderer';
import { SectionWrapper } from '@/components/inline-editor/SectionWrapper';
import { AddSectionModal } from '@/components/inline-editor/AddSectionModal';
import { EditModeProvider } from '@/context/inline-editor/EditModeContext';
import { ContentProvider, useContent } from '@/context/inline-editor/ContentContext';
import type { PageSectionContent, PageSEOMetadata } from '@/types/inline-editor';
import { generateSlug, createDefaultBlogSections } from '@/types/blog';

// ============================================================================
// Article Metadata Panel
// ============================================================================

interface ArticleMetadataPanelProps {
  title: string;
  excerpt: string;
  tags: string;
  categories: string;
  author: string;
  status: 'draft' | 'published';
  scheduledPublishAt: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onCategoriesChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onStatusChange: (value: 'draft' | 'published') => void;
  onScheduledPublishAtChange: (value: string) => void;
}

function ArticleMetadataPanel({
  title,
  excerpt,
  tags,
  categories,
  author,
  status,
  scheduledPublishAt,
  onTitleChange,
  onExcerptChange,
  onTagsChange,
  onCategoriesChange,
  onAuthorChange,
  onStatusChange,
  onScheduledPublishAtChange,
}: ArticleMetadataPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">
          Article Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter article title..."
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
        />
        {title && (
          <p className="mt-2 text-xs text-jhr-white-dim">
            Slug: <code className="text-jhr-gold">{generateSlug(title)}</code>
          </p>
        )}
      </div>

      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Short description for listing cards (auto-generated if empty)..."
          rows={3}
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm resize-none"
        />
      </div>

      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Author name..."
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
        />
      </div>

      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="photography, events, corporate..."
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
        />
      </div>

      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">Categories (comma separated)</label>
        <input
          type="text"
          value={categories}
          onChange={(e) => onCategoriesChange(e.target.value)}
          placeholder="Guides, Tips & Advice..."
          className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
        />
      </div>

      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <label className="block text-body-sm font-medium text-jhr-white mb-2">Status</label>
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange('draft')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              status === 'draft'
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'bg-jhr-black border border-jhr-black-lighter text-jhr-white-dim hover:border-jhr-gold/30'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            Draft
          </button>
          <button
            onClick={() => onStatusChange('published')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              status === 'published'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-jhr-black border border-jhr-black-lighter text-jhr-white-dim hover:border-jhr-gold/30'
            }`}
          >
            <Eye className="w-4 h-4" />
            Published
          </button>
        </div>
      </div>

      {status === 'draft' && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
          <label className="block text-body-sm font-medium text-jhr-white mb-2">
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Schedule Publication
          </label>
          <input
            type="datetime-local"
            value={scheduledPublishAt}
            onChange={(e) => onScheduledPublishAtChange(e.target.value)}
            className="w-full px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
          />
          {scheduledPublishAt && (
            <p className="mt-2 text-xs text-jhr-white-dim">
              Will be published automatically on {new Date(scheduledPublishAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section Editor
// ============================================================================

interface SectionEditorProps {
  sections: PageSectionContent[];
  pageSlug: string;
  onAddSection: (section: PageSectionContent, atIndex: number) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function SectionEditor({
  sections,
  pageSlug,
  onAddSection,
  onDeleteSection,
  onMoveUp,
  onMoveDown,
}: SectionEditorProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState(0);

  const handleOpenAddModal = useCallback((index: number) => {
    setInsertIndex(index);
    setAddModalOpen(true);
  }, []);

  const handleAddSection = useCallback(
    (section: PageSectionContent) => {
      onAddSection(section, insertIndex);
      setAddModalOpen(false);
    },
    [insertIndex, onAddSection]
  );

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleOpenAddModal(0)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="text-body-sm font-medium">Add Section at Top</span>
      </button>

      {sections.length === 0 ? (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
          <div className="p-4 rounded-full bg-jhr-black-lighter inline-block mb-4">
            <Plus className="w-8 h-8 text-jhr-white-dim" />
          </div>
          <p className="text-body-md text-jhr-white-dim">No sections yet</p>
          <p className="text-body-sm text-jhr-white-dim mt-1">
            Click &ldquo;Add Section&rdquo; to start building your article.
          </p>
        </div>
      ) : (
        sections.map((section, index) => (
          <div key={section.id} className="space-y-2">
            <SectionWrapper
              sectionType={section.type}
              sectionId={section.id}
              index={index}
              totalSections={sections.length}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
              onDelete={() => onDeleteSection(section.id)}
            >
              <SectionRenderer
                section={section}
                pageSlug={pageSlug}
                contentKeyPrefix={`${pageSlug}:${section.id}`}
              />
            </SectionWrapper>

            <button
              onClick={() => handleOpenAddModal(index + 1)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors opacity-50 hover:opacity-100"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Add Section</span>
            </button>
          </div>
        ))
      )}

      {addModalOpen && (
        <AddSectionModal
          onAdd={handleAddSection}
          onClose={() => setAddModalOpen(false)}
          insertOrder={insertIndex}
        />
      )}
    </div>
  );
}

// ============================================================================
// Create Article Page Content
// ============================================================================

function ArticleCreateContent() {
  const router = useRouter();
  const {
    sections,
    addSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    loadSections,
  } = useContent();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [author, setAuthor] = useState('JHR Photography');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      if (sections.length === 0 && newTitle.trim()) {
        const defaultSections = createDefaultBlogSections(newTitle);
        loadSections(defaultSections);
      }
    },
    [sections.length, loadSections]
  );

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (sections.length === 0) {
      setError('Please add at least one section to your article.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const slug = generateSlug(title);

      const seo: PageSEOMetadata = {
        pageTitle: title,
        metaDescription: excerpt || '',
        ogTitle: title,
        ogDescription: excerpt || '',
      };

      const body = {
        title: title.trim(),
        sections,
        seo,
        excerpt: excerpt || undefined,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        categories: categories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        author,
        status: scheduledPublishAt ? 'scheduled' : status,
        scheduledPublishAt: scheduledPublishAt
          ? new Date(scheduledPublishAt).toISOString()
          : undefined,
      };

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create article');
      }

      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  const slug = title ? generateSlug(title) : 'new-article';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/articles"
          className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Create Article
          </h1>
          <p className="mt-1 text-body-sm text-jhr-white-dim">
            Build your article using sections — same editor as pages.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionEditor
            sections={sections}
            pageSlug={slug}
            onAddSection={addSection}
            onDeleteSection={deleteSection}
            onMoveUp={moveSectionUp}
            onMoveDown={moveSectionDown}
          />
        </div>

        <div>
          <ArticleMetadataPanel
            title={title}
            excerpt={excerpt}
            tags={tags}
            categories={categories}
            author={author}
            status={status}
            scheduledPublishAt={scheduledPublishAt}
            onTitleChange={handleTitleChange}
            onExcerptChange={setExcerpt}
            onTagsChange={setTags}
            onCategoriesChange={setCategories}
            onAuthorChange={setAuthor}
            onStatusChange={setStatus}
            onScheduledPublishAtChange={setScheduledPublishAt}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Export with Providers
// ============================================================================

export default function ArticleCreatePage() {
  return (
    <EditModeProvider forceEditMode={true}>
      <ContentProvider>
        <ArticleCreateContent />
      </ContentProvider>
    </EditModeProvider>
  );
}
