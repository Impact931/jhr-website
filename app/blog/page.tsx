'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import { formatBlogDate } from '@/types/blog';

// ============================================================================
// Sample blog posts for static rendering (replaced by API data when available)
// ============================================================================

const SAMPLE_POSTS: BlogPost[] = [
  {
    slug: 'corporate-event-photography-guide-nashville',
    title: 'The Complete Guide to Corporate Event Photography in Nashville',
    body: '',
    featuredImage: '/images/generated/event-coverage-hero.jpg',
    excerpt:
      'Everything you need to know about planning professional photography coverage for your next corporate event in Nashville, from venue considerations to shot lists.',
    author: 'Jayson Rivas',
    publishedAt: '2026-01-15T10:00:00Z',
    readingTime: 8,
    tags: ['corporate events', 'nashville', 'photography tips'],
    categories: ['Event Photography'],
    status: 'published',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    slug: 'headshot-activation-trade-shows',
    title: 'Why Headshot Activations Are the #1 Trade Show Engagement Tool',
    body: '',
    featuredImage: '/images/generated/headshot-activation-hero.jpg',
    excerpt:
      'Discover how on-site headshot activations drive 3x more booth traffic and create lasting attendee connections at trade shows and conferences.',
    author: 'Jayson Rivas',
    publishedAt: '2026-01-10T10:00:00Z',
    readingTime: 6,
    tags: ['headshot activations', 'trade shows', 'engagement'],
    categories: ['Headshot Activations'],
    status: 'published',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    slug: 'music-city-center-photography-tips',
    title: 'Photographer\'s Guide to Music City Center: Lighting, Angles & Best Spots',
    body: '',
    featuredImage: '/images/generated/venue-music-city-center.jpg',
    excerpt:
      'An insider look at shooting events at Nashville\'s premier convention center — the best lighting conditions, ideal angles, and hidden photo spots.',
    author: 'Jayson Rivas',
    publishedAt: '2026-01-05T10:00:00Z',
    readingTime: 7,
    tags: ['venues', 'music city center', 'photography tips'],
    categories: ['Venue Guides'],
    status: 'published',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    slug: 'corporate-headshot-program-roi',
    title: 'The ROI of a Corporate Headshot Program: By the Numbers',
    body: '',
    featuredImage: '/images/generated/headshot-program-hero.jpg',
    excerpt:
      'How professional corporate headshots improve employee branding, LinkedIn engagement, and company image — backed by real data from our clients.',
    author: 'Jayson Rivas',
    publishedAt: '2025-12-28T10:00:00Z',
    readingTime: 5,
    tags: ['corporate headshots', 'ROI', 'employer branding'],
    categories: ['Corporate Photography'],
    status: 'published',
    createdAt: '2025-12-28T10:00:00Z',
    updatedAt: '2025-12-28T10:00:00Z',
  },
  {
    slug: 'event-video-recap-best-practices',
    title: 'Creating Event Video Recaps That Actually Get Watched',
    body: '',
    featuredImage: '/images/generated/event-video-hero.jpg',
    excerpt:
      'Best practices for event recap videos that capture attention, tell your event\'s story, and drive registrations for future events.',
    author: 'Jayson Rivas',
    publishedAt: '2025-12-20T10:00:00Z',
    readingTime: 6,
    tags: ['video', 'event recaps', 'content strategy'],
    categories: ['Event Video'],
    status: 'published',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    slug: 'association-conference-photography-checklist',
    title: 'Association Conference Photography: The Complete Planning Checklist',
    body: '',
    featuredImage: '/images/generated/corporate-event-1.jpg',
    excerpt:
      'A step-by-step checklist for association meeting planners to ensure comprehensive photography coverage at their next conference.',
    author: 'Jayson Rivas',
    publishedAt: '2025-12-15T10:00:00Z',
    readingTime: 9,
    tags: ['associations', 'conferences', 'planning'],
    categories: ['Event Photography'],
    status: 'published',
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
  },
];

// ============================================================================
// Helper: Extract unique categories from posts
// ============================================================================

function getCategories(posts: BlogPost[]): string[] {
  const cats = new Set<string>();
  posts.forEach((p) => p.categories.forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}

// ============================================================================
// Post Card Component
// ============================================================================

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  // Support both old format (direct fields) and new format (sections)
  const featuredImage = post.featuredImage;
  const excerpt = post.excerpt;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`bg-jhr-black-light border border-jhr-black-lighter rounded-xl overflow-hidden hover:border-jhr-gold/30 transition-all duration-300 ${
          featured ? 'md:grid md:grid-cols-2' : ''
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[360px]' : 'aspect-[4/3] sm:aspect-[16/9]'}`}>
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            />
          ) : (
            <div className="w-full h-full bg-jhr-black-lighter flex items-center justify-center">
              <span className="text-jhr-white-dim text-body-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:p-8 md:flex md:flex-col md:justify-center' : ''}`}>
          <h2
            className={`font-display font-bold text-jhr-white group-hover:text-jhr-gold transition-colors duration-200 mb-3 ${
              featured ? 'text-heading-lg' : 'text-heading-md'
            }`}
          >
            {post.title}
          </h2>
          {excerpt && (
            <p className={`text-jhr-white-dim mb-4 line-clamp-3 ${featured ? 'text-body-lg' : 'text-body-sm'}`}>
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-jhr-white-dim text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatBlogDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            )}
          </div>
          {/* Tags */}
          {featured && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-jhr-black-lighter text-jhr-white-dim text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}

// ============================================================================
// Blog Listing Page
// ============================================================================

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from API (falls back to sample data if unavailable)
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog?status=published');
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch {
        // Use sample posts on error
      }
    }
    fetchPosts();
  }, []);

  const categories = useMemo(() => getCategories(posts), [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedCategory) {
      result = result.filter((p) => p.categories.includes(selectedCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-dark">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-jhr-gold font-medium text-body-sm uppercase tracking-widest mb-4">
              Insights & Resources
            </p>
            <h1 className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
              The JHR Blog
            </h1>
            <p className="text-body-lg text-jhr-white-dim max-w-2xl mx-auto">
              Expert insights on corporate event photography, headshot activations, and making the
              most of Nashville&apos;s premier venues.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-jhr-black-lighter">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jhr-white-dim" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-jhr-black-light border border-jhr-black-lighter rounded-lg text-body-sm text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:border-jhr-gold/50 transition-colors"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-jhr-gold text-jhr-black'
                    : 'bg-jhr-black-light text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-jhr-gold text-jhr-black'
                      : 'bg-jhr-black-light text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="section-container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-jhr-white-dim text-body-lg">No articles found.</p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="mt-4 text-jhr-gold hover:text-jhr-gold-light text-body-sm transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featuredPost && (
                <div className="mb-12">
                  <PostCard post={featuredPost} featured />
                </div>
              )}

              {/* Post grid */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-jhr-black-light border-t border-jhr-black-lighter">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-heading-lg font-display font-bold text-jhr-white mb-4">
              Ready to Elevate Your Next Event?
            </h2>
            <p className="text-body-lg text-jhr-white-dim max-w-xl mx-auto mb-8">
              Let&apos;s discuss how professional photography and media coverage can transform your
              corporate events.
            </p>
            <Link href="/schedule" className="btn-primary inline-flex items-center gap-2">
              Schedule a Strategy Call
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
