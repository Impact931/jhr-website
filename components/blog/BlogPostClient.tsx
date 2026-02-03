'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { formatBlogDate } from '@/types/blog';

// ============================================================================
// Related Post Card
// ============================================================================

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg overflow-hidden hover:border-jhr-gold/30 transition-all duration-300">
        {post.featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.featuredImage}
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
          <span className="text-xs text-jhr-white-dim">{formatBlogDate(post.publishedAt)}</span>
        </div>
      </article>
    </Link>
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

  // Fetch related posts client-side (non-critical for SEO)
  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          const related = (data.posts || [])
            .filter((p: BlogPost) => p.slug !== post.slug && p.status === 'published')
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch {
        // Silently fail - related posts are not critical
      }
    }
    fetchRelatedPosts();
  }, [post.slug]);

  // Keep post state in sync if initialPost changes (e.g., after save)
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Featured Image Hero */}
      {post.featuredImage && (
        <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jhr-black via-jhr-black/50 to-transparent" />
        </section>
      )}

      {/* Post Header */}
      <section className={`${post.featuredImage ? '-mt-32 relative z-10' : 'pt-32'} pb-8`}>
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-jhr-gold hover:text-jhr-gold-light text-body-sm transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.categories[0] && (
              <span className="inline-block px-3 py-1 bg-jhr-gold/20 text-jhr-gold text-xs font-semibold rounded-full mb-4">
                {post.categories[0]}
              </span>
            )}

            {/* Title */}
            <h1 className="text-display-md font-display font-bold text-jhr-white mb-6">
              {post.title}
            </h1>

            {/* Meta */}
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

      {/* Post Body */}
      <section className="pb-16">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-gold max-w-none
              prose-headings:font-display prose-headings:text-jhr-white
              prose-h2:text-heading-md prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-heading-sm prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-jhr-white-dim prose-p:text-body prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-jhr-white-dim prose-li:text-body
              prose-strong:text-jhr-white
              prose-a:text-jhr-gold prose-a:no-underline hover:prose-a:text-jhr-gold-light
              prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

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
            Let&apos;s discuss how professional photography can transform your corporate events.
          </p>
          <Link href="/schedule" className="btn-primary inline-flex items-center gap-2">
            Schedule a Strategy Call
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* JSON-LD Structured Data - rendered on client as backup (also in page head) */}
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
    </main>
  );
}
