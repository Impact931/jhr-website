import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 120;

/**
 * POST /api/admin/contentops/rescore — Re-score all articles for GEO
 *
 * Backfills geoMetadata on articles that were generated before GEO scoring was added.
 * Optionally accepts { slug: string } to rescore a single article.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetSlug = body.slug as string | undefined;

    const allPosts = await listBlogs();
    const toRescore = targetSlug
      ? allPosts.filter((p) => p.slug === targetSlug)
      : allPosts;

    const results: Array<{ slug: string; geoScore: number; status: string }> = [];

    for (const post of toRescore) {
      try {
        // Get the draft (preferred) or published version
        const full = await getBlogContent(post.slug, 'draft')
          || await getBlogContent(post.slug, 'published');

        if (!full || !full.body) {
          results.push({ slug: post.slug, geoScore: 0, status: 'skipped-no-body' });
          continue;
        }

        // Build a minimal ArticlePayload for scoring
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
          results.push({ slug: post.slug, geoScore: 0, status: 'scoring-failed' });
          continue;
        }

        // Save geoMetadata back to the draft
        await saveBlogPost(
          {
            slug: full.slug,
            title: full.title,
            sections: full.sections,
            seo: full.seo,
            excerpt: full.excerpt,
            tags: full.tags,
            categories: full.categories,
            geoMetadata: {
              topicClassification: full.geoMetadata?.topicClassification || [],
              entities: full.geoMetadata?.entities || { people: [], places: ['Nashville'], organizations: ['JHR Photography'] },
              contentSummary: full.geoMetadata?.contentSummary || full.excerpt || '',
              geoScore: geoResult.totalScore,
              geoScoreNotes: geoResult.notes,
            },
          },
          full.status || 'draft',
          session.user?.email || undefined
        );

        // Also update published version if it exists
        if (post.status === 'published') {
          const pub = await getBlogContent(post.slug, 'published');
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
                geoMetadata: {
                  topicClassification: pub.geoMetadata?.topicClassification || [],
                  entities: pub.geoMetadata?.entities || { people: [], places: ['Nashville'], organizations: ['JHR Photography'] },
                  contentSummary: pub.geoMetadata?.contentSummary || pub.excerpt || '',
                  geoScore: geoResult.totalScore,
                  geoScoreNotes: geoResult.notes,
                },
              },
              'published',
              session.user?.email || undefined
            );
          }
        }

        results.push({ slug: post.slug, geoScore: geoResult.totalScore, status: 'rescored' });
        console.log(`[ContentOps] Rescored ${post.slug}: GEO ${geoResult.totalScore}/100`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ slug: post.slug, geoScore: 0, status: `error: ${msg}` });
      }
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
