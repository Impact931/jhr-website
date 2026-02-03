'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  Tag,
  Clock,
  Plus,
  Code,
  X,
} from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  body: string;
  featuredImage?: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  readingTime?: number;
  tags: string[];
  categories: string[];
  status: 'draft' | 'published';
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
  };
  structuredData?: Record<string, unknown>;
  geoMetadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

type SEOQuality = 'good' | 'partial' | 'missing';

function getSEOQuality(post: BlogPost): SEOQuality {
  const seo = post.seoMetadata;
  if (!seo) return 'missing';

  const fields = [
    seo.metaTitle,
    seo.metaDescription,
    seo.keywords?.length,
    seo.ogTitle,
    seo.ogDescription,
  ];
  const filled = fields.filter(Boolean).length;

  if (filled >= 4) return 'good';
  if (filled >= 2) return 'partial';
  return 'missing';
}

const seoQualityConfig: Record<SEOQuality, { icon: typeof CheckCircle; color: string; label: string }> = {
  good: { icon: CheckCircle, color: 'text-green-400', label: 'Good' },
  partial: { icon: AlertTriangle, color: 'text-yellow-400', label: 'Partial' },
  missing: { icon: XCircle, color: 'text-red-400', label: 'Missing' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showApiDocs, setShowApiDocs] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(slug: string, currentStatus: string) {
    setActionLoading(slug);
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update post status');
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, ...data.post } : p))
      );
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setActionLoading(null);
    }
  }

  async function deletePost(slug: string) {
    setActionLoading(slug);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setActionLoading(null);
    }
  }

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <span className="ml-3 text-body-md text-jhr-white-dim">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-body-md text-red-400 font-medium">Error loading blog posts</p>
          <p className="text-body-sm text-red-400/70 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Blog Posts
          </h1>
          <p className="mt-1 text-body-md text-jhr-white-dim">
            {posts.length} post{posts.length !== 1 ? 's' : ''} &middot;{' '}
            {publishedCount} published &middot; {draftCount} draft{draftCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiDocs(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors"
          >
            <Code className="w-4 h-4" />
            API Docs
          </button>
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jhr-white-dim" />
        <input
          type="text"
          placeholder="Search posts by title, slug, author, tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:border-jhr-gold/50 transition-colors"
        />
      </div>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
          <div className="p-4 rounded-full bg-jhr-black-lighter inline-block mb-4">
            <FileText className="w-8 h-8 text-jhr-white-dim" />
          </div>
          <p className="text-body-md text-jhr-white-dim">
            {searchQuery ? 'No posts match your search.' : 'No blog posts yet.'}
          </p>
          <p className="text-body-sm text-jhr-white-dim mt-1">
            {searchQuery
              ? 'Try a different search term.'
              : 'Posts uploaded via the blog API will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left px-4 py-3 text-body-sm font-medium text-jhr-white-dim">Title</th>
                  <th className="text-left px-4 py-3 text-body-sm font-medium text-jhr-white-dim hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-body-sm font-medium text-jhr-white-dim hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-body-sm font-medium text-jhr-white-dim hidden lg:table-cell">SEO</th>
                  <th className="text-right px-4 py-3 text-body-sm font-medium text-jhr-white-dim">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jhr-black-lighter">
                {filteredPosts.map((post) => {
                  const isExpanded = expandedPost === post.slug;
                  const seoQuality = getSEOQuality(post);
                  const SEOIcon = seoQualityConfig[seoQuality].icon;

                  return (
                    <PostRow
                      key={post.slug}
                      post={post}
                      isExpanded={isExpanded}
                      seoQuality={seoQuality}
                      SEOIcon={SEOIcon}
                      actionLoading={actionLoading}
                      deleteConfirm={deleteConfirm}
                      onToggleExpand={() => setExpandedPost(isExpanded ? null : post.slug)}
                      onToggleStatus={() => toggleStatus(post.slug, post.status)}
                      onDeleteConfirm={() => setDeleteConfirm(post.slug)}
                      onDeleteCancel={() => setDeleteConfirm(null)}
                      onDelete={() => deletePost(post.slug)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Docs Modal */}
      {showApiDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowApiDocs(false)} />
          <div className="relative bg-jhr-black-light rounded-xl border border-jhr-black-lighter w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-jhr-black-lighter">
              <h2 className="text-body-lg font-semibold text-jhr-white">Blog API Documentation</h2>
              <button onClick={() => setShowApiDocs(false)} className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-body-md font-medium text-jhr-white mb-2">Create a Blog Post</h3>
                <p className="text-body-sm text-jhr-white-dim mb-3">POST to <code className="px-1.5 py-0.5 bg-jhr-black rounded text-jhr-gold text-xs">/api/blog/upload</code> with an API key.</p>
                <pre className="bg-jhr-black rounded-lg p-4 text-xs text-jhr-white-dim overflow-x-auto">{`curl -X POST /api/blog/upload \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "title": "My Blog Post",
    "body": "<h1>Hello</h1><p>Content here</p>",
    "tags": ["photography", "events"],
    "categories": ["Guides"],
    "status": "draft"
  }'`}</pre>
              </div>
              <div>
                <h3 className="text-body-md font-medium text-jhr-white mb-2">Create with Template</h3>
                <p className="text-body-sm text-jhr-white-dim mb-3">Use a template ID and variables to auto-generate content.</p>
                <pre className="bg-jhr-black rounded-lg p-4 text-xs text-jhr-white-dim overflow-x-auto">{`curl -X POST /api/blog/upload \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "title": "Event Photography in Nashville",
    "body": "",
    "template": "location-seo",
    "templateVariables": {
      "service": "Event Photography",
      "city": "Nashville",
      "venue": "Music City Center"
    },
    "status": "draft"
  }'`}</pre>
              </div>
              <div>
                <h3 className="text-body-md font-medium text-jhr-white mb-2">Available Templates</h3>
                <ul className="space-y-1 text-body-sm text-jhr-white-dim">
                  <li><code className="text-jhr-gold">how-to-guide</code> — Step-by-step instructions (vars: topic, audience)</li>
                  <li><code className="text-jhr-gold">listicle</code> — Numbered list (vars: count, topic)</li>
                  <li><code className="text-jhr-gold">location-seo</code> — Local SEO page (vars: service, city, venue)</li>
                  <li><code className="text-jhr-gold">case-study</code> — Case study format (vars: client, event, venue)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-body-md font-medium text-jhr-white mb-2">n8n Integration</h3>
                <p className="text-body-sm text-jhr-white-dim">
                  Use the HTTP Request node in n8n with method POST, URL <code className="px-1 py-0.5 bg-jhr-black rounded text-jhr-gold text-xs">https://your-domain.com/api/blog/upload</code>,
                  and add the <code className="text-jhr-gold">x-api-key</code> header. Set the body to the JSON payload above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PostRowProps {
  post: BlogPost;
  isExpanded: boolean;
  seoQuality: SEOQuality;
  SEOIcon: typeof CheckCircle;
  actionLoading: string | null;
  deleteConfirm: string | null;
  onToggleExpand: () => void;
  onToggleStatus: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onDelete: () => void;
}

function PostRow({
  post,
  isExpanded,
  seoQuality,
  SEOIcon,
  actionLoading,
  deleteConfirm,
  onToggleExpand,
  onToggleStatus,
  onDeleteConfirm,
  onDeleteCancel,
  onDelete,
}: PostRowProps) {
  const isLoading = actionLoading === post.slug;
  const isDeleting = deleteConfirm === post.slug;

  return (
    <>
      <tr
        className="hover:bg-jhr-black-lighter/50 cursor-pointer transition-colors"
        onClick={onToggleExpand}
      >
        {/* Title + Image */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt=""
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-jhr-black-lighter flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-jhr-white-dim" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-body-sm font-medium text-jhr-white truncate max-w-xs">
                {post.title}
              </p>
              <p className="text-xs text-jhr-white-dim truncate max-w-xs">
                /{post.slug}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-jhr-white-dim flex-shrink-0 ml-auto md:hidden" />
            ) : (
              <ChevronDown className="w-4 h-4 text-jhr-white-dim flex-shrink-0 ml-auto md:hidden" />
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3 hidden md:table-cell">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              post.status === 'published'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}
          >
            {post.status === 'published' ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            {post.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </td>

        {/* Date */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-body-sm text-jhr-white-dim">
            {formatDate(post.publishedAt)}
          </span>
        </td>

        {/* SEO Quality */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-1.5">
            <SEOIcon className={`w-4 h-4 ${seoQualityConfig[seoQuality].color}`} />
            <span className={`text-xs ${seoQualityConfig[seoQuality].color}`}>
              {seoQualityConfig[seoQuality].label}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onToggleStatus}
              disabled={isLoading}
              className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
              title={post.status === 'published' ? 'Unpublish' : 'Publish'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : post.status === 'published' ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
              title="View post"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {isDeleting ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onDelete}
                  disabled={isLoading}
                  className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={onDeleteCancel}
                  className="px-2 py-1 rounded text-xs font-medium bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={onDeleteConfirm}
                className="p-2 rounded-lg text-jhr-white-dim hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Detail Row */}
      {isExpanded && (
        <tr className="bg-jhr-black/50">
          <td colSpan={5} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Post Details */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-medium text-jhr-white">Post Details</h4>
                <div className="space-y-2 text-body-sm">
                  <div className="flex items-center gap-2 text-jhr-white-dim">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-jhr-white-dim">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Published: {formatDate(post.publishedAt)}</span>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-2 text-jhr-white-dim">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex items-start gap-2 text-jhr-white-dim">
                      <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-jhr-black-lighter text-xs text-jhr-white-dim"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {post.excerpt && (
                  <p className="text-body-sm text-jhr-white-dim italic">
                    &ldquo;{post.excerpt}&rdquo;
                  </p>
                )}
              </div>

              {/* SEO Details */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-medium text-jhr-white">SEO Metadata</h4>
                {post.seoMetadata ? (
                  <div className="space-y-2 text-body-sm">
                    {post.seoMetadata.metaTitle && (
                      <div>
                        <span className="text-jhr-white-dim">Title: </span>
                        <span className="text-jhr-white">{post.seoMetadata.metaTitle}</span>
                      </div>
                    )}
                    {post.seoMetadata.metaDescription && (
                      <div>
                        <span className="text-jhr-white-dim">Description: </span>
                        <span className="text-jhr-white">{post.seoMetadata.metaDescription}</span>
                      </div>
                    )}
                    {post.seoMetadata.keywords && post.seoMetadata.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.seoMetadata.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded bg-jhr-gold/10 text-xs text-jhr-gold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-body-sm text-red-400/70">
                    No SEO metadata generated. Upload post via API to trigger AI generation.
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
