'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageContent, TextSection } from '@/types/content';

type LoadingState = 'loading' | 'loaded' | 'error' | 'not-found';

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const token = searchParams.get('token');

  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [error, setError] = useState<string>('');

  // Format slug for display
  const pageName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Validate token (basic validation - checks if token decodes to slug:timestamp)
  const isValidToken = (tokenValue: string | null): boolean => {
    if (!tokenValue) return false;
    try {
      // Add padding back if needed
      const paddedToken = tokenValue + '=='.slice(0, (4 - tokenValue.length % 4) % 4);
      const decoded = atob(paddedToken);
      const [tokenSlug, timestamp] = decoded.split(':');

      // Token is valid if it matches the slug and was created within the last 24 hours
      const tokenTime = parseInt(timestamp, 10);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      return tokenSlug === slug && !isNaN(tokenTime) && (now - tokenTime) < maxAge;
    } catch {
      return false;
    }
  };

  // Fetch draft content on mount
  useEffect(() => {
    async function fetchContent() {
      // Validate token first
      if (!isValidToken(token)) {
        setError('Invalid or expired preview token');
        setLoadingState('error');
        return;
      }

      try {
        setLoadingState('loading');
        setError('');

        const response = await fetch(`/api/admin/content?slug=${encodeURIComponent(slug)}&status=draft`);

        if (response.status === 404) {
          setLoadingState('not-found');
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch content');
        }

        const content: PageContent = await response.json();
        setPageContent(content);
        setLoadingState('loaded');
      } catch (err) {
        console.error('Error fetching preview content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load preview');
        setLoadingState('error');
      }
    }

    fetchContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, token]);

  // Extract text content from sections
  const getTextContent = (): string => {
    if (!pageContent) return '';
    const textSection = pageContent.sections.find(
      (section): section is TextSection => section.type === 'text'
    );
    return textSection?.content || '';
  };

  return (
    <div className="min-h-screen bg-jhr-black">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-amber-600 text-black px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Preview Mode</span>
            <span className="text-amber-900">— This is a draft preview, not the live page</span>
          </div>
          <Link
            href={`/admin/pages/${slug}/edit`}
            className="px-3 py-1 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
          >
            Back to Editor
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mb-4" />
          <p className="text-jhr-white-dim">Loading preview...</p>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-2">
                  Preview Error
                </h2>
                <p className="text-jhr-white-dim mb-4">{error}</p>
                <Link
                  href={`/admin/pages/${slug}/edit`}
                  className="inline-block px-4 py-2 bg-jhr-black-lighter hover:bg-jhr-black-light text-jhr-white rounded-lg transition-colors"
                >
                  Back to Editor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found State */}
      {loadingState === 'not-found' && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-jhr-gold/10 border border-jhr-gold/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-jhr-gold/20">
                <AlertCircle className="w-6 h-6 text-jhr-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-jhr-gold mb-2">
                  No Draft Content
                </h2>
                <p className="text-jhr-white-dim mb-4">
                  No draft content exists for this page. Save a draft in the editor first.
                </p>
                <Link
                  href={`/admin/pages/${slug}/edit`}
                  className="inline-block px-4 py-2 bg-jhr-gold hover:bg-jhr-gold-dark text-jhr-black font-medium rounded-lg transition-colors"
                >
                  Go to Editor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Content */}
      {loadingState === 'loaded' && pageContent && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-display font-bold text-jhr-white mb-4">
              {pageContent.metadata.title || pageName}
            </h1>
            {pageContent.metadata.description && (
              <p className="text-xl text-jhr-white-dim">
                {pageContent.metadata.description}
              </p>
            )}
          </header>

          {/* Content Area */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: getTextContent() }}
              className="text-jhr-white [&_h1]:text-4xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:mb-6 [&_h2]:text-3xl [&_h2]:font-display [&_h2]:font-semibold [&_h2]:mb-4 [&_h3]:text-2xl [&_h3]:font-display [&_h3]:font-semibold [&_h3]:mb-3 [&_p]:mb-4 [&_p]:text-jhr-white-dim [&_a]:text-jhr-gold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_li]:text-jhr-white-dim [&_blockquote]:border-l-4 [&_blockquote]:border-jhr-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-jhr-white-dim [&_code]:bg-jhr-black-lighter [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_img]:rounded-lg [&_img]:my-6"
            />
          </article>

          {/* Metadata Debug (for preview) */}
          <div className="mt-12 pt-8 border-t border-jhr-black-lighter">
            <h3 className="text-sm font-medium text-jhr-white-dim mb-4">Preview Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-jhr-white-dim">Slug:</span>
                <span className="ml-2 text-jhr-white">{slug}</span>
              </div>
              <div>
                <span className="text-jhr-white-dim">Status:</span>
                <span className="ml-2 text-amber-400">Draft</span>
              </div>
              <div>
                <span className="text-jhr-white-dim">Last Updated:</span>
                <span className="ml-2 text-jhr-white">
                  {new Date(pageContent.updatedAt).toLocaleString()}
                </span>
              </div>
              {pageContent.metadata.ogImage && (
                <div className="col-span-2">
                  <span className="text-jhr-white-dim">OG Image:</span>
                  <img
                    src={pageContent.metadata.ogImage}
                    alt="OG Image"
                    className="mt-2 max-h-32 rounded border border-jhr-black-lighter"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
