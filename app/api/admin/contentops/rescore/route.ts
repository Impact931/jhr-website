import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 120;

// Score a single article and save the result
async function rescoreSingle(
  slug: string,
  postStatus: string,
  userEmail?: string
): Promise<{ slug: string; geoScore: number; status: string }> {
  const full = await getBlogContent(slug, 'draft')
    || await getBlogContent(slug, 'published');

  if (!full || !full.body) {
    return { slug, geoScore: 0, status: 'skipped-no-body' };
  }

  const articleForScoring: ArticlePayload = {
    title: full.title,
    slug: full.slug,
    metaTitle: full.seo?.pageTitle || full.title,
    metaDescription: full.seo?.metaDescription || full.excerpt || '',
    excerpt: full.excerpt || '',
    quickAnswer: '',
    body: full.body,
    wordCount: full.body.split(/\s+/).length,
    readTime: full.readingTime || Math.ceil(full.body.split(/\s+/).length / 250),
    icpTag: 'ICP-1',
    primaryKeyword: full.tags?.[1] || full.title.split(' ').slice(0, 4).join(' '),
    secondaryKeywords: full.tags || [],
    faqBlock: (full.sections || [])
      .filter((s) => s.type === 'faq')
      .flatMap((s) => s.type === 'faq' ? (s.items || []).map((item: { question: string; answer: string }) => ({
        question: item.question,
        answer: item.answer,
      })) : []),
    linkAudit: [],
    linkAuditStatus: 'pending',
    externalLinkCount: (full.body.match(/href="https?:\/\/(?!jhr)/g) || []).length,
    internalLinkCount: (full.body.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
    schemaMarkup: { '@context': 'https://schema.org', '@type': 'Article' },
    openGraph: { title: full.title, description: full.excerpt || '', type: 'article' },
    status: 'draft',
  };

  const geoResult = await scoreArticleGEO(articleForScoring);

  if (!geoResult) {
    return { slug, geoScore: 0, status: 'scoring-failed' };
  }

  const geoMetadata = {
    topicClassification: full.geoMetadata?.topicClassification || [],
    entities: full.geoMetadata?.entities || { people: [], places: ['Nashville'], organizations: ['JHR Photography'] },
    contentSummary: full.geoMetadata?.contentSummary || full.excerpt || '',
    geoScore: geoResult.totalScore,
    geoScoreNotes: geoResult.notes,
  };

  // Save to draft/current version
  await saveBlogPost(
    {
      slug: full.slug,
      title: full.title,
      sections: full.sections,
      seo: full.seo,
      excerpt: full.excerpt,
      tags: full.tags,
      categories: full.categories,
      geoMetadata,
    },
    full.status || 'draft',
    userEmail
  );

  // Also update published version if it exists
  if (postStatus === 'published') {
    const pub = await getBlogContent(slug, 'published');
    if (pub) {
      await saveBlogPost(
        {
          slug: pub.slug,
          title: pub.title,
          sections: pub.sections,
          seo: pub.seo,
          excerpt: pub.excerpt,
          tags: pub.tags,
          categories: pub.categories,
          geoMetadata,
        },
        'published',
        userEmail
      );
    }
  }

  console.log(`[ContentOps] Rescored ${slug}: GEO ${geoResult.totalScore}/100`);
  return { slug, geoScore: geoResult.totalScore, status: 'rescored' };
}

/**
 * POST /api/admin/contentops/rescore — Re-score articles for GEO
 *
 * Accepts optional { slug: string } to rescore a single article.
 * For bulk rescore, processes 3 articles in parallel to stay within timeout.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetSlug = body.slug as string | undefined;
    const userEmail = session.user?.email || undefined;

    const allPosts = await listBlogs();
    const toRescore = targetSlug
      ? allPosts.filter((p) => p.slug === targetSlug)
      : allPosts;

    // Process in parallel batches of 3 to stay within Amplify timeout
    const BATCH_SIZE = 3;
    const results: Array<{ slug: string; geoScore: number; status: string }> = [];

    for (let i = 0; i < toRescore.length; i += BATCH_SIZE) {
      const batch = toRescore.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((post) =>
          rescoreSingle(post.slug, post.status || 'draft', userEmail)
            .catch((err) => ({
              slug: post.slug,
              geoScore: 0,
              status: `error: ${err instanceof Error ? err.message : String(err)}`,
            }))
        )
      );
      results.push(...batchResults);
    }

    return NextResponse.json({
      rescored: results.filter((r) => r.status === 'rescored').length,
      total: results.length,
      results,
    });
  } catch (error) {
    console.error('ContentOps rescore error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Rescore failed' },
      { status: 500 }
    );
  }
}
