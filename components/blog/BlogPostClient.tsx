'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { formatBlogDate, migrateLegacyBlogPost, extractFeaturedImage } from '@/types/blog';
import type { PageSectionContent } from '@/types/inline-editor';
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
          <span className="text-xs text-jhr-white-dim">
            {formatBlogDate(post.publishedAt)}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// Section-Based Blog Content Component
// ============================================================================

interface SectionBasedContentProps {
  post: BlogPost;
  isEditing: boolean;
}

function SectionBasedContent({
  post,
  isEditing,
}: SectionBasedContentProps) {
  const {
    sections,
    addSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    loadBlogPost,
    saveState,
  } = useBlogContent();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState(0);
  const [showSEOPanel, setShowSEOPanel] = useState(false);

  // Load blog post into context when component mounts or post changes
  useEffect(() => {
    // Migrate legacy posts to sections format if needed
    const postToLoad = post.sections && post.sections.length > 0
      ? post
      : { ...post, sections: migrateLegacyBlogPost(post).sections || [] };
    loadBlogPost(postToLoad);
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

  // Find the hero section for featured image and title display
  const heroSection = sections.find((s) => s.type === 'hero');
  const featuredImage =
    heroSection?.type === 'hero'
      ? heroSection.backgroundImage?.src
      : post.featuredImage;

  // Get non-hero sections for body content
  const contentSections = sections.filter((s) => s.type !== 'hero');

  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Edit Mode Status Bar */}
      {isEditing && (
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
          <button
            onClick={() => setShowSEOPanel(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-medium bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors border border-transparent"
          >
            <Search className="w-3.5 h-3.5" />
            SEO
          </button>
        </div>
      )}

      {/* Blog SEO Panel (rendered inside BlogContentProvider for bridge access) */}
      {showSEOPanel && (
        <PageSEOPanel onClose={() => setShowSEOPanel(false)} />
      )}

      {/* Featured Image Hero - only render hero section if it exists */}
      {heroSection ? (
        <div className="relative">
          {isEditing ? (
            <SectionWrapper
              sectionType={heroSection.type}
              sectionId={heroSection.id}
              index={0}
              totalSections={sections.length}
              onMoveUp={() => {}}
              onMoveDown={() => moveSectionDown(0)}
              onDelete={() => deleteSection(heroSection.id)}
            >
              <SectionRenderer
                section={heroSection}
                pageSlug={post.slug}
                contentKeyPrefix={`${post.slug}:${heroSection.id}`}
              />
            </SectionWrapper>
          ) : (
            <SectionRenderer
              section={heroSection}
              pageSlug={post.slug}
              contentKeyPrefix={`${post.slug}:${heroSection.id}`}
            />
          )}
        </div>
      ) : featuredImage ? (
        // Fallback for legacy posts without hero section
        <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
          <Image
            src={featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jhr-black via-jhr-black/50 to-transparent" />
        </section>
      ) : null}

      {/* Post Header - only shown for legacy posts or when hero doesn't have title */}
      {!heroSection && (
        <section
          className={`${
            featuredImage ? '-mt-32 relative z-10' : 'pt-32'
          } pb-8`}
        >
          <div className="section-container max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-jhr-gold hover:text-jhr-gold-light text-body-sm transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {post.categories[0] && (
                <span className="inline-block px-3 py-1 bg-jhr-gold/20 text-jhr-gold text-xs font-semibold rounded-full mb-4">
                  {post.categories[0]}
                </span>
              )}

              <h1 className="text-display-md font-display font-bold text-jhr-white mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-jhr-white-dim text-body-sm pb-6 border-b border-jhr-black-lighter">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.publishedAt)}
                </span>
                {post.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Meta bar for section-based posts (under hero) */}
      {heroSection && (
        <section className="py-4 border-b border-jhr-black-lighter">
          <div className="section-container max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-jhr-gold hover:text-jhr-gold-light text-body-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-jhr-white-dim text-body-sm">
                {post.categories[0] && (
                  <span className="px-3 py-1 bg-jhr-gold/20 text-jhr-gold text-xs font-semibold rounded-full">
                    {post.categories[0]}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.publishedAt)}
                </span>
                {post.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <section className="py-8">
        <div className="section-container max-w-3xl mx-auto">
          {/* Add section button at top (edit mode only) */}
          {isEditing && (
            <button
              onClick={() => handleOpenAddModal(heroSection ? 1 : 0)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-6 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-body-sm font-medium">Add Section</span>
            </button>
          )}

          {/* Render content sections */}
          {contentSections.map((section, index) => {
            const actualIndex = heroSection ? index + 1 : index;

            return (
              <div key={section.id} className="mb-6">
                {isEditing ? (
                  <SectionWrapper
                    sectionType={section.type}
                    sectionId={section.id}
                    index={actualIndex}
                    totalSections={sections.length}
                    onMoveUp={() => moveSectionUp(actualIndex)}
                    onMoveDown={() => moveSectionDown(actualIndex)}
                    onDelete={() => deleteSection(section.id)}
                  >
                    <SectionRenderer
                      section={section}
                      pageSlug={post.slug}
                      contentKeyPrefix={`${post.slug}:${section.id}`}
                    />
                  </SectionWrapper>
                ) : (
                  <SectionRenderer
                    section={section}
                    pageSlug={post.slug}
                    contentKeyPrefix={`${post.slug}:${section.id}`}
                  />
                )}

                {/* Add section button between sections (edit mode only) */}
                {isEditing && (
                  <button
                    onClick={() => handleOpenAddModal(actualIndex + 1)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-4 border-2 border-dashed border-jhr-black-lighter rounded-lg text-jhr-white-dim hover:text-jhr-gold hover:border-jhr-gold/50 transition-colors opacity-50 hover:opacity-100"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-medium">Add Section</span>
                  </button>
                )}
              </div>
            );
          })}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-jhr-black-lighter">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-jhr-white-dim" />
                {post.tags.map((tag) => (
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
      </section>

      {/* Add Section Modal */}
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
// BlogPostClient Props
// ============================================================================

interface BlogPostClientProps {
  initialPost: BlogPost;
}

// ============================================================================
// BlogPostClient Component
// ============================================================================

export default function BlogPostClient({ initialPost }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [hasFetchedDraft, setHasFetchedDraft] = useState(false);

  const { canEdit, isEditMode } = useEditMode();
  const isEditing = canEdit && isEditMode;

  // Fetch draft version when entering edit mode (edits are saved to draft)
  useEffect(() => {
    if (!isEditing || hasFetchedDraft) return;

    async function fetchDraft() {
      try {
        const res = await fetch(`/api/admin/blog/${post.slug}?status=draft`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) {
            setPost(data.post);
            setHasFetchedDraft(true);
          }
        }
      } catch {
        // If draft fetch fails, continue with published version
      }
    }
    fetchDraft();
  }, [isEditing, hasFetchedDraft, post.slug]);

  // Fetch related posts client-side (non-critical for SEO)
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
        // Silently fail - related posts are not critical
      }
    }
    fetchRelatedPosts();
  }, [post.slug]);

  // Keep post state in sync if initialPost changes (only when not editing)
  useEffect(() => {
    if (!isEditing) {
      setPost(initialPost);
      setHasFetchedDraft(false);
    }
  }, [initialPost, isEditing]);

  return (
    <BlogContentProvider>
      <SectionBasedContent
        post={post}
        isEditing={isEditing}
      />

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

      {/* CTA */}
      <section className="py-16 border-t border-jhr-black-lighter">
        <div className="section-container text-center">
          <h2 className="text-heading-lg font-display font-bold text-jhr-white mb-4">
            Ready to Elevate Your Next Event?
          </h2>
          <p className="text-body-lg text-jhr-white-dim max-w-xl mx-auto mb-8">
            Let&apos;s discuss how professional photography can transform your
            corporate events.
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

      {/* JSON-LD Structured Data */}
      {post.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.structuredData.headline || post.title,
              datePublished:
                post.structuredData.datePublished || post.publishedAt,
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
    </BlogContentProvider>
  );
}
