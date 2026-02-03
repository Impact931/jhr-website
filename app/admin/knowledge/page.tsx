'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  BookOpen, Search, Plus, Edit, Trash2, X, Save, Loader2, AlertCircle,
  FileText, Download, Tag, Filter,
} from 'lucide-react';

type KnowledgeCategory = 'FAQ' | 'Script' | 'Template' | 'Document';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES: KnowledgeCategory[] = ['FAQ', 'Script', 'Template', 'Document'];

const categoryStyles: Record<KnowledgeCategory, string> = {
  FAQ: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Script: 'bg-green-500/10 text-green-400 border-green-500/20',
  Template: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Document: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function AdminKnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<KnowledgeCategory | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filterCategory) params.set('category', filterCategory);
      const res = await fetch(`/api/admin/knowledge?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/knowledge/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openCreate = () => {
    setEditingEntry(null);
    setModalOpen(true);
  };

  const openEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => { counts[e.category] = (counts[e.category] || 0) + 1; });
    return counts;
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">Knowledge Base</h1>
          <p className="mt-1 text-body-md text-jhr-white-dim">
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jhr-white-dim" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:border-jhr-gold/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-jhr-white-dim" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as KnowledgeCategory | '')}
            className="px-3 py-2.5 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:border-jhr-gold/50 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat} ({categoryCounts[cat] || 0})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
          <span className="ml-3 text-jhr-white-dim">Loading entries...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Entries Grid */}
      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5 hover:border-jhr-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${categoryStyles[entry.category]}`}>
                  {entry.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {deleteConfirm === entry.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={actionLoading}
                        className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 rounded text-xs bg-jhr-black-lighter text-jhr-white-dim"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(entry.id)}
                      className="p-1.5 rounded text-jhr-white-dim hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-body-md font-medium text-jhr-white mb-2 line-clamp-2">
                {entry.title}
              </h3>
              <p className="text-body-sm text-jhr-white-dim line-clamp-3 mb-3">
                {entry.content.replace(/[#*`]/g, '').slice(0, 200)}
              </p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {entry.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-jhr-black-lighter text-xs text-jhr-white-dim">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {entry.tags.length > 4 && (
                    <span className="text-xs text-jhr-white-dim">+{entry.tags.length - 4}</span>
                  )}
                </div>
              )}

              <p className="text-xs text-jhr-white-dim">
                Updated {new Date(entry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && entries.length === 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
          <div className="p-4 rounded-full bg-jhr-black-lighter inline-block mb-4">
            <BookOpen className="w-8 h-8 text-jhr-white-dim" />
          </div>
          <p className="text-body-md text-jhr-white">
            {searchQuery || filterCategory ? 'No entries match your filters.' : 'No knowledge entries yet.'}
          </p>
          <p className="text-body-sm text-jhr-white-dim mt-1">
            {searchQuery || filterCategory ? 'Try adjusting your search or filter.' : 'Create your first entry to build your knowledge library.'}
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <KnowledgeModal
          entry={editingEntry}
          onClose={() => { setModalOpen(false); setEditingEntry(null); }}
          onSaved={() => { setModalOpen(false); setEditingEntry(null); fetchEntries(); }}
        />
      )}
    </div>
  );
}

function KnowledgeModal({
  entry,
  onClose,
  onSaved,
}: {
  entry: KnowledgeEntry | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!entry;
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [category, setCategory] = useState<KnowledgeCategory>(entry?.category || 'FAQ');
  const [tagsInput, setTagsInput] = useState(entry?.tags.join(', ') || '');
  const [fileUrl, setFileUrl] = useState(entry?.fileUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError(null);

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const body = { title, content, category, tags, fileUrl: fileUrl || undefined };

    try {
      const url = isEdit ? `/api/admin/knowledge/${entry.id}` : '/api/admin/knowledge';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-jhr-black-light rounded-xl border border-jhr-black-lighter w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-jhr-black-lighter">
          <h2 className="text-body-lg font-semibold text-jhr-white">
            {isEdit ? 'Edit Entry' : 'New Knowledge Entry'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-body-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Content (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content in Markdown..."
              rows={12}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold font-mono text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="pricing, faq, corporate..."
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-2">File URL (optional)</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-jhr-black-lighter">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
