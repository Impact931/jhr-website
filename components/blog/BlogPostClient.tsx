'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Tag,
  ChevronRight,
  Loader2,
  Check,
  Plus,
  Edit3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { formatBlogDate, migrateLegacyBlogPost, extractFeaturedImage, sectionsToBody } from '@/types/blog';
import type { PageSectionContent, FAQSectionContent } from '@/types/inline-editor';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { BlogContentProvider, useBlogContent } from '@/context/blog/BlogContentContext';
import { SectionRenderer } from '@/components/inline-editor/SectionRenderer';
import { SectionWrapper } from '@/components/inline-editor/SectionWrapper';
import { AddSectionModal } from '@/components/inline-editor/AddSectionModal';
import { PageSEOPanel } from '@/components/inline-editor/PageSEOPanel';

// ============================================================================
// Related Post Card
// ============================================================================

function RelatedPostCard({ post }: { post: BlogPost }) {
  const featuredImage = post.featuredImage || extractFeaturedImage(post.sections);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg overflow-hidden hover:border-jhr-gold/30 transition-all duration-300">
        {featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-display font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors text-body-sm line-clamp-2 mb-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-jhr-white-dim text-xs line-clamp-2 mb-2">
              {post.excerpt}
            </p>
          )}
          <span className="text-xs text-jhr-white-dim">
            {formatBlogDate(post.publishedAt)}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// Article View — simple, direct HTML render for public visitors
// Layout: Featured Image → Title + Meta → Body → FAQ → CTA
// ============================================================================

function isRealImage(src: string | undefined | null): src is string {
  if (!src) return false;
  if (src === '/images/blog-default-hero.jpg') return false;
  if (src.startsWith('/images/blog-default-')) return false;
  if (src.includes('placehold.co/')) return false;
  return true;
}

function ArticleView({ post }: { post: BlogPost }) {
  // OG image (explicit user choice) takes priority over section-extracted images
  const rawFeaturedImage = post.seo?.ogImage || post.featuredImage || extractFeaturedImage(post.sections);
  const featuredImage = isRealImage(rawFeaturedImage) ? rawFeaturedImage : null;

  // Extract FAQ items from sections
  const faqSection = (post.sections || []).find((s) => s.type === 'faq') as FAQSectionContent | undefined;

  // Get body HTML — prefer post.body, fall back to computing from sections
  let bodyHtml = post.body || (post.sections ? sectionsToBody(post.sections) : '');

  // Strip inline FAQ content from body when a separate FAQ section exists,
  // to avoid rendering FAQs twice (once in body, once as accordion module)
  if (faqSection && faqSection.items && faqSection.items.length > 0 && bodyHtml) {
    for (const item of faqSection.items) {
      const escapedQ = item.question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      bodyHtml = bodyHtml.replace(
        new RegExp(`<h[23][^>]*>\\s*${escapedQ}\\s*</h[23]>\\s*(<p[^>]*>.*?</p>)?`, 'is'),
        ''
      );
    }
  }

  return (
    <main className="min-h-screen bg-jhr-black">
      <article className="pt-28 pb-12">
        <div className="section-container max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-jhr-gold hover:text-jhr-gold-light text-body-sm transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Featured Image */}
          {featuredImage && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <Image
                src={featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.categories[0] && (
              <span className="inline-block px-3 py-1 bg-jhr-gold/20 text-jhr-gold text-xs font-semibold rounded-full mb-4">
                {post.categories[0]}
              </span>
            )}

            <h1 className="text-display-md font-display font-bold text-jhr-white mb-4">
              {post.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 text-jhr-white-dim text-body-sm pb-6 mb-8 border-b border-jhr-black-lighter">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author || 'JHR Photography'}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.publishedAt)}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </motion.div>

          {/* Article Body — direct HTML render */}
          {bodyHtml && (
            <div
              className="blog-content text-body-md"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          )}

          {/* FAQ Section */}
          {faqSection && faqSection.items && faqSection.items.length > 0 && (
            <section className="mt-12 pt-8 border-t border-jhr-black-lighter">
              <h2 className="text-heading-lg font-display font-bold text-jhr-white mb-6">
                {faqSection.heading || 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {faqSection.items.map((item, i) => (
                  <details
                    key={item.id || i}
                    className="group bg-jhr-black-light border border-jhr-black-lighter rounded-lg"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-body-md font-medium text-jhr-white hover:text-jhr-gold transition-colors list-none">
                      {item.question}
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                    </summary>
                    <div className="px-5 pb-4 text-body-md text-jhr-white-dim leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-jhr-black-lighter">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-jhr-white-dim" />
                {post.tags
                  .filter((t) => t !== 'contentops-generated')
                  .map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-jhr-black-light border border-jhr-black-lighter text-jhr-white-dim text-xs rounded-full hover:text-jhr-gold hover:border-jhr-gold/30 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-jhr-black-light border-t border-jhr-black-lighter">
        <div className="section-container text-center">
          <h2 className="text-heading-lg font-display font-bold text-jhr-white mb-4">
            Ready to Make Your Next Event Stand Out?
          </h2>
          <p className="text-body-lg text-jhr-white-dim max-w-xl mx-auto mb-8">
            Let&apos;s discuss how professional photography can elevate your corporate events, conferences, and trade shows.
          </p>
          <Link
            href="/schedule"
            className="btn-primary inline-flex items-center gap-2"
          >
            Schedule a Strategy Call
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Section-Based Edit Mode — full editor with section management
// ============================================================================

function SectionEditMode({ post }: { post: BlogPost }) {
  const {
    sections,
    addSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    loadBlogPost,
    saveState,
  } = useBlogContent();
  const { showSEOPanel, setShowSEOPanel } = useEditMode();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState(0);
  const loadedPostRef = useRef<BlogPost | null>(null);

  // Load blog post data into context — only when we get a genuinely new post object
  // (initial load + draft fetch), NOT when React re-renders with the same data
  useEffect(() => {
    if (loadedPostRef.current === post) return;
    const postToLoad = post.sections && post.sections.length > 0
      ? post
      : { ...post, sections: migrateLegacyBlogPost(post).sections || [] };
    loadBlogPost(postToLoad);
    loadedPostRef.current = post;
  }, [post, loadBlogPost]);

  const handleOpenAddModal = useCallback((index: number) => {
    setInsertIndex(index);
    setAddModalOpen(true);
  }, []);

  const handleAddSection = useCallback(
    (section: PageSectionContent) => {
      addSection(section, insertIndex);
      setAddModalOpen(false);
    },
    [insertIndex, addSection]
  );

  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Edit Mode Status Bar */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-jhr-black-light border border-jhr-black-lighter rounded-lg shadow-xl px-4 py-2 flex items-center gap-3">
        <span className="text-body-sm text-jhr-white-dim">
          <Edit3 className="w-4 h-4 inline mr-1.5" />
          Editing: {post.title.slice(0, 30)}
          {post.title.length > 30 ? '...' : ''}
        </span>
        {saveState.status === 'saving' && (
          <span className="inline-flex items-center gap-1.5 text-body-sm text-jhr-white-dim">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </span>
        )}
        {saveState.status === 'saved' && (
          <span className="inline-flex items-center gap-1.5 text-body-sm text-green-400">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        )}
        {saveState.error && (
          <span className="text-body-sm text-red-400">{saveState.error}</span>
        )}
      </div>

      {/* SEO Panel — rendered inside BlogContentProvider so it gets the blog's ContentContext */}
      {showSEOPanel && (
        <PageSEOPanel onClose={() => setShowSEOPanel(false)} />
      )}

      {/* Render all sections with edit wrappers */}
      <section className="pt-28 pb-8">
        <div className="section-container max-w-3xl mx-auto">
          <button
            onClick={() => handleOpenAddModal(0)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-6 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-body-sm font-medium">Add Section</span>
          </button>

          {sections.map((section, index) => (
            <div key={section.id} className="mb-6">
              <SectionWrapper
                sectionType={section.type}
                sectionId={section.id}
                index={index}
                totalSections={sections.length}
                onMoveUp={() => moveSectionUp(index)}
                onMoveDown={() => moveSectionDown(index)}
                onDelete={() => deleteSection(section.id)}
              >
                <SectionRenderer
                  section={section}
                  pageSlug={post.slug}
                  contentKeyPrefix={`${post.slug}:${section.id}`}
                />
              </SectionWrapper>

              <button
                onClick={() => handleOpenAddModal(index + 1)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-4 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors opacity-50 hover:opacity-100"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Add Section</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {addModalOpen && (
        <AddSectionModal
          onAdd={handleAddSection}
          onClose={() => setAddModalOpen(false)}
          insertOrder={insertIndex}
        />
      )}
    </main>
  );
}

// ============================================================================
// BlogPostClient — switches between view and edit mode
// ============================================================================

interface BlogPostClientProps {
  initialPost: BlogPost;
}

export default function BlogPostClient({ initialPost }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [hasFetchedDraft, setHasFetchedDraft] = useState(false);

  const { canEdit, isEditMode } = useEditMode();
  const isEditing = canEdit && isEditMode;

  // Track the original published status
  const isPublished = initialPost.status === 'published';

  // Fetch latest version when entering edit mode
  // Published articles: fetch published version (not stale drafts)
  // Draft articles: fetch draft version
  useEffect(() => {
    if (!isEditing || hasFetchedDraft) return;

    async function fetchLatest() {
      try {
        const fetchStatus = isPublished ? 'published' : 'draft';
        const res = await fetch(`/api/admin/blog/${post.slug}?status=${fetchStatus}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) {
            if (isPublished) {
              data.post.status = 'published';
            }
            setPost(data.post);
            setHasFetchedDraft(true);
          }
        }
      } catch {
        // If fetch fails, continue with SSR version
      }
    }
    fetchLatest();
  }, [isEditing, hasFetchedDraft, post.slug, isPublished]);

  // Fetch related posts
  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          const related = (data.posts || [])
            .filter(
              (p: BlogPost) =>
                p.slug !== post.slug && p.status === 'published'
            )
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch {
        // Silently fail
      }
    }
    fetchRelatedPosts();
  }, [post.slug]);

  // Sync with initialPost when not editing
  useEffect(() => {
    if (!isEditing) {
      setPost(initialPost);
      setHasFetchedDraft(false);
    }
  }, [initialPost, isEditing]);

  return (
    <>
      {isEditing ? (
        <BlogContentProvider initialSlug={post.slug} initialPost={post}>
          <SectionEditMode post={post} />
        </BlogContentProvider>
      ) : (
        <>
          <ArticleView post={post} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-jhr-black-light border-t border-jhr-black-lighter">
              <div className="section-container">
                <h2 className="text-heading-lg font-display font-bold text-jhr-white mb-8">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp) => (
                    <RelatedPostCard key={rp.slug} post={rp} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* JSON-LD */}
      {post.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.structuredData.headline || post.title,
              datePublished: post.structuredData.datePublished || post.publishedAt,
              author: {
                '@type': 'Person',
                name: post.structuredData.author || post.author,
              },
              image: post.structuredData.image || post.featuredImage,
              publisher: {
                '@type': 'Organization',
                name: post.structuredData.publisher || 'JHR Photography',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://jhr-photography.com/images/jhr-logo-white.png',
                },
              },
              description: post.structuredData.description || post.excerpt,
            }),
          }}
        />
      )}
    </>
  );
}
