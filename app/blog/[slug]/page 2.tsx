import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getItem } from '@/lib/dynamodb';
import type { BlogPost } from '@/types/blog';
import BlogPostClient from '@/components/blog/BlogPostClient';

// ============================================================================
// Sample posts for fallback rendering when DB is unavailable
// ============================================================================

const SAMPLE_POSTS: Record<string, BlogPost> = {
  'corporate-event-photography-guide-nashville': {
    slug: 'corporate-event-photography-guide-nashville',
    title: 'The Complete Guide to Corporate Event Photography in Nashville',
    body: `
      <p>Nashville has become one of the top destinations for corporate events, conferences, and trade shows. With world-class venues like the Music City Center and Gaylord Opryland, the city attracts thousands of business events each year.</p>
      <h2>Why Professional Event Photography Matters</h2>
      <p>Corporate event photography isn't just about capturing moments — it's about creating assets that drive business value. Professional images are used for social media, marketing collateral, sponsor deliverables, and internal communications long after the event ends.</p>
      <h2>Planning Your Photography Coverage</h2>
      <p>The key to great event photography starts with planning. Here's what to consider:</p>
      <ul>
        <li><strong>Shot list:</strong> Work with your photographer to create a comprehensive list of must-have shots, including keynote speakers, sponsor signage, attendee networking, and venue establishing shots.</li>
        <li><strong>Timeline:</strong> Map out the event schedule and identify key photography moments — registration, opening remarks, breakout sessions, awards, and social events.</li>
        <li><strong>Lighting:</strong> Nashville venues vary widely in lighting conditions. Professional photographers know how to handle everything from the grand ballrooms at Gaylord Opryland to the intimate spaces at City Winery.</li>
        <li><strong>Deliverables:</strong> Define expectations upfront — how many edited photos, turnaround time, file formats, and usage rights.</li>
      </ul>
      <h2>Nashville Venue Considerations</h2>
      <p>Each Nashville venue presents unique photography opportunities and challenges. The Music City Center's floor-to-ceiling windows provide stunning natural light during daytime events, while the Gaylord Opryland's atrium spaces create dramatic backdrops for corporate portraits.</p>
      <h2>Making the Most of Your Investment</h2>
      <p>To maximize the ROI of your event photography, plan for multiple uses of each image. A great keynote photo can be used in the post-event report, social media recap, next year's marketing materials, and the speaker's promotional kit.</p>
    `,
    featuredImage: '/images/generated/event-coverage-hero.jpg',
    excerpt: 'Everything you need to know about planning professional photography coverage for your next corporate event in Nashville.',
    author: 'Jayson Rivas',
    publishedAt: '2026-01-15T10:00:00Z',
    readingTime: 8,
    tags: ['corporate events', 'nashville', 'photography tips'],
    categories: ['Event Photography'],
    status: 'published',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  'headshot-activation-trade-shows': {
    slug: 'headshot-activation-trade-shows',
    title: 'Why Headshot Activations Are the #1 Trade Show Engagement Tool',
    body: `
      <p>Trade show exhibitors are constantly looking for ways to stand out and drive meaningful booth traffic. While giveaways and flash demos have their place, one activation consistently outperforms them all: professional headshot stations.</p>
      <h2>The Power of Professional Headshots at Events</h2>
      <p>A headshot activation creates a unique value exchange — attendees receive a professional asset they actually need (an updated LinkedIn photo), and exhibitors get extended face time with qualified prospects. It's a win-win that drives real engagement.</p>
      <h2>By the Numbers</h2>
      <p>Our clients consistently report:</p>
      <ul>
        <li><strong>3x more booth traffic</strong> compared to standard trade show setups</li>
        <li><strong>5-7 minute average engagement time</strong> per attendee (vs. 30 seconds for traditional booths)</li>
        <li><strong>85%+ lead capture rate</strong> from headshot participants</li>
        <li><strong>40% higher post-show follow-up response rates</strong></li>
      </ul>
      <h2>How It Works</h2>
      <p>A headshot activation is turnkey. We bring the equipment, lighting, backdrop, and photography expertise. Attendees walk up, get a professional headshot taken in under 5 minutes, and receive their edited photo digitally — often before the event day ends.</p>
      <h2>Making It Your Own</h2>
      <p>The best headshot activations are branded to your company. Custom backdrops, branded delivery emails, and social sharing prompts turn every headshot into a marketing touchpoint. Your logo appears every time an attendee updates their LinkedIn profile.</p>
    `,
    featuredImage: '/images/generated/headshot-activation-hero.jpg',
    excerpt: 'Discover how on-site headshot activations drive 3x more booth traffic and create lasting attendee connections.',
    author: 'Jayson Rivas',
    publishedAt: '2026-01-10T10:00:00Z',
    readingTime: 6,
    tags: ['headshot activations', 'trade shows', 'engagement'],
    categories: ['Headshot Activations'],
    status: 'published',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  'music-city-center-photography-tips': {
    slug: 'music-city-center-photography-tips',
    title: "Photographer's Guide to Music City Center: Lighting, Angles & Best Spots",
    body: `
      <p>The Music City Center is Nashville's crown jewel for conventions and large-scale corporate events. As photographers who've shot hundreds of events here, we've developed deep expertise on making the most of this stunning venue.</p>
      <h2>Understanding the Light</h2>
      <p>The MCC's signature feature is its massive glass curtain wall on the east side. During morning events, this provides gorgeous natural light that's perfect for candid photography and group shots. By afternoon, the light shifts — knowing when and where the light falls is crucial for planning your shot locations.</p>
      <h2>Best Photo Spots</h2>
      <p>After years of shooting at MCC, here are our top recommended locations:</p>
      <ul>
        <li><strong>Grand Ballroom Pre-Function:</strong> The sweeping hallway with city views creates a dramatic backdrop for executive portraits and group photos.</li>
        <li><strong>Rooftop Terrace:</strong> Nashville's skyline creates an iconic backdrop, especially during golden hour receptions.</li>
        <li><strong>Davidson Ballroom Entry:</strong> The modern architectural lines create a clean, professional backdrop.</li>
        <li><strong>Exhibition Hall Bridges:</strong> The elevated walkways offer unique angles for capturing the scale of trade show floors.</li>
      </ul>
      <h2>Gear Recommendations</h2>
      <p>The MCC's large spaces demand versatile equipment. We recommend fast zoom lenses (24-70mm f/2.8 and 70-200mm f/2.8) for the exhibition halls, and a 35mm or 50mm prime for the more intimate meeting rooms.</p>
    `,
    featuredImage: '/images/generated/venue-music-city-center.jpg',
    excerpt: "An insider look at shooting events at Nashville's premier convention center.",
    author: 'Jayson Rivas',
    publishedAt: '2026-01-05T10:00:00Z',
    readingTime: 7,
    tags: ['venues', 'music city center', 'photography tips'],
    categories: ['Venue Guides'],
    status: 'published',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
};

// ============================================================================
// Type for DynamoDB record
// ============================================================================

interface BlogRecord extends BlogPost {
  pk: string;
  sk: string;
}

// ============================================================================
// Fetch blog post (server-side)
// ============================================================================

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const record = await getItem<BlogRecord>(`BLOG#${slug}`, 'post');
    if (record) {
      // Strip DynamoDB keys
      const { pk: _pk, sk: _sk, ...post } = record;
      return post;
    }
  } catch (error) {
    console.error('Error fetching blog post from DB:', error);
  }

  // Fall back to sample data
  return SAMPLE_POSTS[slug] || null;
}

// ============================================================================
// Generate Metadata for SEO (Server Component requirement)
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | JHR Photography Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  // Use AI-generated SEO metadata if available, otherwise fall back to basic fields
  const title = post.seoMetadata?.metaTitle || `${post.title} | JHR Photography Blog`;
  const description = post.seoMetadata?.metaDescription || post.excerpt || post.title;
  const keywords = post.seoMetadata?.keywords || post.tags;
  const ogTitle = post.seoMetadata?.ogTitle || post.title;
  const ogDescription = post.seoMetadata?.ogDescription || description;
  const ogImage = post.seoMetadata?.ogImage || post.featuredImage;

  const baseUrl = 'https://jhr-photography.com';
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'JHR Photography',
      images: ogImage
        ? [
            {
              url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage
        ? [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`]
        : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: post.status === 'published',
      follow: true,
    },
  };
}

// ============================================================================
// Generate JSON-LD Structured Data
// ============================================================================

function generateJsonLd(post: BlogPost, slug: string) {
  const baseUrl = 'https://jhr-photography.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.structuredData?.headline || post.title,
    datePublished: post.structuredData?.datePublished || post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.structuredData?.author || post.author,
    },
    image: post.structuredData?.image || post.featuredImage
      ? (post.featuredImage?.startsWith('http')
          ? post.featuredImage
          : `${baseUrl}${post.featuredImage}`)
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: post.structuredData?.publisher || 'JHR Photography',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/jhr-logo-white.png`,
      },
    },
    description: post.structuredData?.description || post.excerpt || post.title,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.categories[0] || 'Photography',
    wordCount: post.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
  };
}

// ============================================================================
// Blog Post Page (Server Component)
// ============================================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, slug);

  return (
    <>
      {/* JSON-LD Structured Data - rendered in head by Server Component */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Client component handles interactive elements */}
      <BlogPostClient initialPost={post} />
    </>
  );
}

// ============================================================================
// Not Found Component
// ============================================================================

export function NotFound() {
  return (
    <main className="min-h-screen bg-jhr-black">
      <section className="pt-32 pb-16">
        <div className="section-container text-center">
          <h1 className="text-display-md font-display font-bold text-jhr-white mb-4">
            Post Not Found
          </h1>
          <p className="text-body-lg text-jhr-white-dim mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
