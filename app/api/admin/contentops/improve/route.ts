import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { improveArticleStreaming, type ImproveResult } from '@/lib/contentops/improve';
import { validateArticle } from '@/lib/contentops/validate';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 300;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blogToArticlePayload(full: any): ArticlePayload {
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
 */
async function saveImprovedArticle(
  slug: string,
  improved: ArticlePayload,
  originalStatus: string,
  userEmail?: string,
): Promise<{ geoScore?: number }> {
  const current = await getBlogContent(slug, 'draft')
    || await getBlogContent(slug, 'published');

  if (!current) return {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = (current.sections || []) as any[];
  const updatedSections = sections.map((section) => {
    if (section.type === 'text-block' || section.type === 'rich-text') {
      return { ...section, content: improved.body };
    }
    return section;
  });

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

  // Update FAQ section
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

  // GEO re-score (non-blocking — we catch errors)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let geoMetadata: any = current.geoMetadata || {};
  let newGeoScore: number | undefined;
  try {
    const geoResult = await scoreArticleGEO(improved);
    if (geoResult) {
      geoMetadata = {
        ...geoMetadata,
        geoScore: geoResult.totalScore,
        geoScoreNotes: geoResult.notes,
      };
      newGeoScore = geoResult.totalScore;
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

  await saveBlogPost(savePayload, 'draft', userEmail);

  if (originalStatus === 'published') {
    const pub = await getBlogContent(slug, 'published');
    if (pub) {
      await saveBlogPost(savePayload, 'published', userEmail);
    }
  }

  return { geoScore: newGeoScore };
}

/**
 * POST /api/admin/contentops/improve — SSE streaming improvement pipeline.
 *
 * Body options:
 *   { slug: string }           — improve a single article
 *   { mode: "needs-work" }     — improve all articles with geoScore < 70
 *   { mode: "all" }            — improve all articles below 80
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => ({}));
  const targetSlug = body.slug as string | undefined;
  const mode = (body.mode as string) || 'needs-work';
  const userEmail = session.user?.email || undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ─── Determine which articles to improve ────────────────────
        send('progress', { phase: 'loading', message: 'Loading articles...' });

        const allPosts = await listBlogs();
        let toImprove: Array<{ slug: string; status: string }>;

        if (targetSlug) {
          toImprove = allPosts.filter((p) => p.slug === targetSlug);
        } else {
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
                };
              } catch {
                return { slug: post.slug, status: post.status || 'draft', geoScore: 0 };
              }
            })
          );
          const threshold = mode === 'all' ? 80 : 70;
          toImprove = withScores.filter((p) => p.geoScore < threshold);
        }

        if (toImprove.length === 0) {
          send('done', { improved: 0, total: 0, message: 'No articles need improvement', results: [] });
          controller.close();
          return;
        }

        send('progress', {
          phase: 'starting',
          message: `Improving ${toImprove.length} article${toImprove.length > 1 ? 's' : ''}...`,
          total: toImprove.length,
        });

        // ─── Process each article ───────────────────────────────────
        const results: Omit<ImproveResult, 'improvedData'>[] = [];

        for (let i = 0; i < toImprove.length; i++) {
          const post = toImprove[i];

          send('progress', {
            phase: 'improving',
            message: `Improving "${post.slug}" (${i + 1}/${toImprove.length})...`,
            current: i + 1,
            total: toImprove.length,
            slug: post.slug,
          });

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
              send('article-result', { slug: post.slug, status: 'skipped', error: 'No body content' });
              continue;
            }

            const articlePayload = blogToArticlePayload(full);
            const geoNotes = full.geoMetadata?.geoScoreNotes || '';

            // Score before
            const beforeValidation = await validateArticle(articlePayload);
            const beforeScore = beforeValidation.geoScore.totalScore;

            // Already passing?
            if (beforeValidation.passed && beforeScore >= 80 && !geoNotes) {
              results.push({
                slug: post.slug,
                status: 'already-passing',
                beforeScore,
                afterScore: beforeScore,
                beforeHardFails: beforeValidation.hardFails,
                afterHardFails: beforeValidation.hardFails,
                changes: [],
              });
              send('article-result', { slug: post.slug, status: 'already-passing', beforeScore });
              continue;
            }

            // ─── Streaming improvement (prevents gateway timeout) ────
            const improveResult = await improveArticleStreaming(
              articlePayload,
              geoNotes,
              (chunkCount) => {
                if (chunkCount % 10 === 0) {
                  send('progress', {
                    phase: 'improving',
                    slug: post.slug,
                    chunks: chunkCount,
                    current: i + 1,
                    total: toImprove.length,
                  });
                }
              },
            );

            if (improveResult.error || !improveResult.data) {
              results.push({
                slug: post.slug,
                status: 'failed',
                beforeScore,
                afterScore: null,
                beforeHardFails: beforeValidation.hardFails,
                afterHardFails: [],
                changes: [],
                error: improveResult.error,
              });
              send('article-result', { slug: post.slug, status: 'failed', error: improveResult.error });
              continue;
            }

            // Validate improved version
            const afterValidation = await validateArticle(improveResult.data);
            const afterScore = afterValidation.geoScore.totalScore;

            // Reject-if-worse guard
            if (afterScore < beforeScore && afterValidation.hardFails.length >= beforeValidation.hardFails.length) {
              results.push({
                slug: post.slug,
                status: 'failed',
                beforeScore,
                afterScore,
                beforeHardFails: beforeValidation.hardFails,
                afterHardFails: afterValidation.hardFails,
                changes: improveResult.changes,
                error: `Improved version scored lower (${afterScore} vs ${beforeScore}) — keeping original`,
              });
              send('article-result', { slug: post.slug, status: 'rejected', beforeScore, afterScore });
              continue;
            }

            // ─── Save + GEO rescore ──────────────────────────────────
            send('progress', {
              phase: 'saving',
              message: `Saving "${post.slug}" and re-scoring GEO...`,
              slug: post.slug,
              current: i + 1,
              total: toImprove.length,
            });

            const saveResult = await saveImprovedArticle(post.slug, improveResult.data, post.status, userEmail);

            results.push({
              slug: post.slug,
              status: 'improved',
              beforeScore,
              afterScore: saveResult.geoScore ?? afterScore,
              beforeHardFails: beforeValidation.hardFails,
              afterHardFails: afterValidation.hardFails,
              changes: improveResult.changes,
            });

            send('article-result', {
              slug: post.slug,
              status: 'improved',
              beforeScore,
              afterScore: saveResult.geoScore ?? afterScore,
              changes: improveResult.changes,
            });
          } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            results.push({
              slug: post.slug,
              status: 'failed',
              beforeScore: 0,
              afterScore: null,
              beforeHardFails: [],
              afterHardFails: [],
              changes: [],
              error,
            });
            send('article-result', { slug: post.slug, status: 'failed', error });
          }
        }

        // ─── Final summary ────────────────────────────────────────
        const improved = results.filter((r) => r.status === 'improved').length;
        const alreadyPassing = results.filter((r) => r.status === 'already-passing').length;
        const failed = results.filter((r) => r.status === 'failed').length;

        send('done', { improved, alreadyPassing, failed, total: results.length, results });
        controller.close();
      } catch (error) {
        console.error('ContentOps improve stream error:', error);
        send('error', { error: error instanceof Error ? error.message : 'Improvement failed' });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
