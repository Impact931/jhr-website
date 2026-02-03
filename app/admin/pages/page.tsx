'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Search, Edit, ExternalLink, Loader2 } from 'lucide-react';
import type { PageWithStatus } from '@/app/api/admin/pages/route';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/pages');

        if (!response.ok) {
          throw new Error('Failed to fetch pages');
        }

        const data = await response.json();
        setPages(data.pages);
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  // Filter pages based on search query
  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count pages by status
  const publishedCount = pages.filter((p) => p.status === 'published').length;
  const draftCount = pages.filter((p) => p.status === 'draft').length;
  const noContentCount = pages.filter((p) => p.status === 'no-content').length;

  // Status badge component
  const StatusBadge = ({ status, hasDraft, hasPublished }: { status: string; hasDraft: boolean; hasPublished: boolean }) => {
    if (status === 'published') {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-body-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            Published
          </span>
          {hasDraft && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Draft
            </span>
          )}
        </div>
      );
    }

    if (status === 'draft') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-body-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Draft
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-body-sm font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
        No Content
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '—';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Pages
          </h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Manage your site pages. {pages.length} pages total.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jhr-white-dim" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold w-full sm:w-64"
          />
        </div>
      </div>

      {/* Status Summary */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-body-sm text-green-400">{publishedCount} Published</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-body-sm text-amber-400">{draftCount} Draft</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/20">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-body-sm text-gray-400">{noContentCount} No Content</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
          <span className="ml-3 text-jhr-white-dim">Loading pages...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-body-sm text-red-400 underline hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Pages Table */}
      {!loading && !error && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">
                    Page Name
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">
                    Last Modified
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-jhr-white-dim">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jhr-black-lighter">
                {filteredPages.map((page) => (
                  <tr
                    key={page.slug}
                    className="hover:bg-jhr-black-lighter/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-jhr-gold/10">
                          <FileText className="w-4 h-4 text-jhr-gold" />
                        </div>
                        <div>
                          <p className="text-body-md font-medium text-jhr-white">
                            {page.name}
                          </p>
                          <p className="text-body-sm text-jhr-white-dim">
                            {page.path}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm text-jhr-white-dim">
                        {page.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={page.status}
                        hasDraft={page.hasDraft}
                        hasPublished={page.hasPublished}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm text-jhr-white-dim">
                        {formatDate(page.lastModified)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={page.path}
                          target="_blank"
                          className="p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black transition-colors"
                          title="View page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`${page.path}?editMode=true`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-jhr-gold/10 text-jhr-gold hover:bg-jhr-gold/20 transition-colors text-body-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-body-sm text-jhr-white-dim">
          <p>
            Showing {filteredPages.length} of {pages.length} pages
            {searchQuery && ` (filtered by "${searchQuery}")`}
          </p>
          <p>
            {publishedCount} published, {draftCount} draft, {noContentCount} no content
          </p>
        </div>
      )}
    </div>
  );
}
