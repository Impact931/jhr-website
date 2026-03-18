import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { improveAndValidate, type ImproveResult } from '@/lib/contentops/improve';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 300; // 5 minutes — improvements take longer than scoring

/**
 * Convert a blog DB record into an ArticlePayload for the improve pipeline.
 * Same pattern as rescore/route.ts.
 */
function blogToArticlePayload(full: Record<string, unknown>): ArticlePayload {
  const body = (full.body as string) || '';
  const seo = (full.seo as Record<string, string>) || {};
  const tags = (full.tags as string[]) || [];
  const sections = (full.sections as Array<Record<string, unknown>>) || [];

  return {
    title: (full.title as string) || '',
    slug: (full.slug as string) || '',
    metaTitle: seo.pageTitle || (full.title as string) || '',
    metaDescription: seo.metaDescription || (full.excerpt as string) || '',
    excerpt: (full.excerpt as string) || '',
    quickAnswer: (full.quickAnswer as string) || '',
    body,
    wordCount: body.split(/\s+/).length,
    readTime: Math.ceil(body.split(/\s+/).length / 250),
    icpTag: (full.icpTag as ArticlePayload['icpTag']) || 'ICP-1',
    primaryKeyword: tags[1] || (full.title as string || '').split(' ').slice(0, 4).join(' '),
    secondaryKeywords: tags,
    faqBlock: sections
      .filter((s) => s.type === 'faq')
      .flatMap((s) =>
        ((s.items as Array<{ question: string; answer: string }>) || []).map((item) => ({
          question: item.question,
          answer: item.answer,
        }))
      ),
    linkAudit: [],
    linkAuditStatus: 'pending',
    externalLinkCount: (body.match(/href="https?:\/\/(?!jhr)/g) || []).length,
    internalLinkCount: (body.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
    schemaMarkup: { '@context': 'https://schema.org', '@type': 'Article' },
    openGraph: {
      title: (full.title as string) || '',
      description: (full.excerpt as string) || '',
      type: 'article',
    },
    status: 'draft',
  };
}

/**
 * Save improved article back to DynamoDB.
 * Updates draft and published versions.
 */
async function saveImprovedArticle(
  slug: string,
  improved: ArticlePayload,
  originalStatus: string,
  userEmail?: string,
): Promise<void> {
  // Get the current draft to preserve non-article fields
  const current = await getBlogContent(slug, 'draft')
    || await getBlogContent(slug, 'published');

  if (!current) return;

  // Build updated sections — use `any` for flexibility with section union types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = (current.sections || []) as any[];
  const updatedSections = sections.map((section) => {
    if (section.type === 'text-block' || section.type === 'rich-text') {
      return { ...section, content: improved.body };
    }
    return section;
  });

  // If no text-block section exists, create one
  const hasTextBlock = updatedSections.some(
    (s) => s.type === 'text-block' || s.type === 'rich-text'
  );
  if (!hasTextBlock) {
    updatedSections.push({
      id: `text-${Date.now()}`,
      type: 'text-block',
      content: improved.body,
    });
  }

  // Update FAQ section if it exists
  const faqSectionIdx = updatedSections.findIndex((s) => s.type === 'faq');
  if (faqSectionIdx >= 0 && improved.faqBlock?.length > 0) {
    updatedSections[faqSectionIdx] = {
      ...updatedSections[faqSectionIdx],
      items: improved.faqBlock,
    };
  } else if (faqSectionIdx < 0 && improved.faqBlock?.length > 0) {
    updatedSections.push({
      id: `faq-${Date.now()}`,
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: improved.faqBlock,
    });
  }

  // Run Claude API GEO scoring on the improved version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let geoMetadata: any = current.geoMetadata || {};
  try {
    const geoResult = await scoreArticleGEO(improved);
    if (geoResult) {
      geoMetadata = {
        ...geoMetadata,
        geoScore: geoResult.totalScore,
        geoScoreNotes: geoResult.notes,
      };
    }
  } catch {
    // Scoring failure is non-blocking
  }

  const savePayload = {
    slug,
    title: improved.title,
    sections: updatedSections,
    seo: {
      ...(current.seo || {}),
      pageTitle: improved.metaTitle,
      metaDescription: improved.metaDescription,
    },
    excerpt: improved.excerpt,
    tags: current.tags,
    categories: current.categories,
    body: improved.body,
    quickAnswer: improved.quickAnswer,
    geoMetadata,
  };

  // Save draft
  await saveBlogPost(savePayload, 'draft', userEmail);

  // Also update published version if it exists
  if (originalStatus === 'published') {
    const pub = await getBlogContent(slug, 'published');
    if (pub) {
      await saveBlogPost(savePayload, 'published', userEmail);
    }
  }
}

/**
 * POST /api/admin/contentops/improve — Improve articles based on GEO deficiencies
 *
 * Body options:
 *   { slug: string }           — improve a single article
 *   { mode: "needs-work" }     — improve all articles with geoScore < 70
 *   { mode: "all" }            — improve all articles below 80
 *   {}                         — defaults to "needs-work"
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetSlug = body.slug as string | undefined;
    const mode = (body.mode as string) || 'needs-work';
    const userEmail = session.user?.email || undefined;

    const allPosts = await listBlogs();

    // Determine which articles to improve
    let toImprove: Array<{ slug: string; status: string }>;

    if (targetSlug) {
      toImprove = allPosts.filter((p) => p.slug === targetSlug);
    } else {
      // Fetch full records to check GEO scores
      const withScores = await Promise.all(
        allPosts.map(async (post) => {
          try {
            const full = await getBlogContent(
              post.slug,
              post.status === 'published' ? 'published' : 'draft'
            );
            return {
              slug: post.slug,
              status: post.status || 'draft',
              geoScore: full?.geoMetadata?.geoScore ?? 0,
              geoScoreNotes: full?.geoMetadata?.geoScoreNotes || '',
            };
          } catch {
            return { slug: post.slug, status: post.status || 'draft', geoScore: 0, geoScoreNotes: '' };
          }
        })
      );

      const threshold = mode === 'all' ? 80 : 70;
      toImprove = withScores.filter((p) => p.geoScore < threshold);
    }

    if (toImprove.length === 0) {
      return NextResponse.json({
        improved: 0,
        total: 0,
        message: 'No articles need improvement',
        results: [],
      });
    }

    // Process sequentially to stay within API limits
    const results: ImproveResult[] = [];

    for (const post of toImprove) {
      try {
        const full = await getBlogContent(post.slug, 'draft')
          || await getBlogContent(post.slug, 'published');

        if (!full || !full.body) {
          results.push({
            slug: post.slug,
            status: 'skipped',
            beforeScore: 0,
            afterScore: null,
            beforeHardFails: [],
            afterHardFails: [],
            changes: [],
            error: 'No body content found',
          });
          continue;
        }

        const articlePayload = blogToArticlePayload(full);
        const geoNotes = full.geoMetadata?.geoScoreNotes || '';

        const result = await improveAndValidate(articlePayload, geoNotes);

        // If improved, save back to DynamoDB
        if (result.status === 'improved' && result.improvedData) {
          await saveImprovedArticle(post.slug, result.improvedData, post.status, userEmail);
        }

        results.push(result);
      } catch (err) {
        results.push({
          slug: post.slug,
          status: 'failed',
          beforeScore: 0,
          afterScore: null,
          beforeHardFails: [],
          afterHardFails: [],
          changes: [],
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const improved = results.filter((r) => r.status === 'improved').length;
    const alreadyPassing = results.filter((r) => r.status === 'already-passing').length;
    const failed = results.filter((r) => r.status === 'failed').length;

    // Strip improvedData from response (large, not needed by client)
    const clientResults = results.map(({ improvedData, ...rest }) => rest);

    return NextResponse.json({
      improved,
      alreadyPassing,
      failed,
      total: results.length,
      results: clientResults,
    });
  } catch (error) {
    console.error('ContentOps improve error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Improvement failed' },
      { status: 500 }
    );
  }
}
