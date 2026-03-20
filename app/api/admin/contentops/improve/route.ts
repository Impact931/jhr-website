import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogContent, saveBlogPost } from '@/lib/blog-content';
import {
  phaseAnalyze, phaseRewrite, phasePolish,
  mergeImprovedArticle, extractH2s,
} from '@/lib/contentops/improve';
import type { AnalysisResult, PolishResult } from '@/lib/contentops/improve';
import { validateArticle } from '@/lib/contentops/validate';
import { saveImproveState, loadImproveState, deleteImproveState } from '@/lib/contentops/improve-store';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 30;

/**
 * POST /api/admin/contentops/improve
 *
 * 3-phase improvement — each phase is a SEPARATE Lambda invocation.
 * Client calls this 3 times with { slug, phase: 'analyze'|'rewrite'|'polish' }.
 * Intermediate state stored in DynamoDB between phases.
 *
 * Phase 1 (analyze):  Load article → analyze → store outline → return outline
 * Phase 2 (rewrite):  Load outline → stream body rewrite → store body → return
 * Phase 3 (polish):   Load body → generate metadata → save article → return result
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => ({}));
  const slug = body.slug as string | undefined;
  const phase = (body.phase as string) || 'analyze';

  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // ─── Phase 1: ANALYZE ──────────────────────────────────────────
    if (phase === 'analyze') {
      const full = await getBlogContent(slug, 'draft') || await getBlogContent(slug, 'published');
      if (!full || !full.body) {
        return jsonResponse({ error: 'Article not found or has no body' }, 404);
      }

      const bodyText = (full.body as string) || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const seo = (full.seo as any) || {};
      const tags = (full.tags as string[]) || [];
      const geoNotes = (full.geoMetadata?.geoScoreNotes as string) || '';
      const title = (full.title as string) || '';
      const primaryKeyword = tags[1] || title.split(' ').slice(0, 4).join(' ');

      const currentH2s = extractH2s(bodyText);
      const outline = await phaseAnalyze(
        currentH2s, geoNotes, primaryKeyword, title,
        bodyText.split(/\s+/).length,
      );

      // Store state for next phases
      await saveImproveState({
        slug,
        phase: 'analyze',
        outline,
        articleData: { title, primaryKeyword, body: bodyText, wordCount: bodyText.split(/\s+/).length },
        createdAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + 3600,
      });

      return jsonResponse({
        phase: 'analyze',
        status: 'complete',
        outline,
        message: `Outline ready: ${outline.sections.length} sections planned`,
      });
    }

    // ─── Phase 2: REWRITE (SSE streaming) ──────────────────────────
    if (phase === 'rewrite') {
      const state = await loadImproveState(slug);
      if (!state?.outline || !state?.articleData) {
        return jsonResponse({ error: 'No analysis found — run analyze phase first' }, 400);
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const send = (event: string, data: Record<string, unknown>) => {
            controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
          };

          try {
            send('progress', { phase: 'rewrite', message: 'Rewriting article body...' });

            const improvedBody = await phaseRewrite(
              state.articleData!.body,
              state.outline!.sections,
              state.articleData!.primaryKeyword,
              state.articleData!.title,
              (chunkCount) => {
                if (chunkCount % 15 === 0) {
                  send('progress', { phase: 'rewrite', chunks: chunkCount });
                }
              },
            );

            if (!improvedBody || improvedBody.length < 500) {
              send('error', { error: 'Body rewrite produced insufficient content' });
              controller.close();
              return;
            }

            // Store improved body for Phase 3
            await saveImproveState({
              ...state,
              phase: 'rewrite',
              improvedBody,
            });

            send('done', {
              phase: 'rewrite',
              status: 'complete',
              wordCount: improvedBody.split(/\s+/).filter(Boolean).length,
              message: `Body complete: ~${improvedBody.split(/\s+/).filter(Boolean).length} words`,
            });
            controller.close();
          } catch (error) {
            console.error('Phase 2 rewrite error:', error);
            send('error', { error: error instanceof Error ? error.message : 'Rewrite failed' });
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

    // ─── Phase 3: POLISH + SAVE ────────────────────────────────────
    if (phase === 'polish') {
      const state = await loadImproveState(slug);
      if (!state?.improvedBody || !state?.outline || !state?.articleData) {
        return jsonResponse({ error: 'No rewrite found — run rewrite phase first' }, 400);
      }

      // Generate metadata + FAQ
      const polished = await phasePolish(
        state.improvedBody,
        state.outline.quickAnswerGoal,
        state.outline.metaGoals,
        state.outline.faqTopics,
        state.articleData.primaryKeyword,
        state.articleData.title,
      );

      // Load full article for merge + save
      const full = await getBlogContent(slug, 'draft') || await getBlogContent(slug, 'published');
      if (!full) {
        return jsonResponse({ error: 'Article not found for save' }, 404);
      }

      // Build ArticlePayload for merge
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const seo = (full.seo as any) || {};
      const tags = (full.tags as string[]) || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sections = (full.sections as any[]) || [];
      const bodyText = (full.body as string) || '';

      const article: ArticlePayload = {
        title: (full.title as string) || '',
        slug,
        metaTitle: seo.pageTitle || (full.title as string) || '',
        metaDescription: seo.metaDescription || (full.excerpt as string) || '',
        excerpt: (full.excerpt as string) || '',
        quickAnswer: (full.quickAnswer as string) || '',
        body: bodyText,
        wordCount: bodyText.split(/\s+/).length,
        readTime: Math.ceil(bodyText.split(/\s+/).length / 250),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icpTag: ((full as any).icpTag as ArticlePayload['icpTag']) || 'ICP-1',
        primaryKeyword: state.articleData.primaryKeyword,
        secondaryKeywords: tags,
        faqBlock: sections.filter((s) => s.type === 'faq').flatMap((s) =>
          ((s.items as Array<{ question: string; answer: string }>) || []).map((item) => ({
            question: item.question, answer: item.answer,
          }))
        ),
        linkAudit: [],
        linkAuditStatus: 'pending',
        externalLinkCount: (bodyText.match(/href="https?:\/\/(?!jhr)/g) || []).length,
        internalLinkCount: (bodyText.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
        schemaMarkup: { '@context': 'https://schema.org', '@type': 'Article' },
        openGraph: { title: (full.title as string) || '', description: (full.excerpt as string) || '', type: 'article' },
        status: 'draft',
      };

      // Merge improved body + polished metadata
      const { data: improved, changes } = mergeImprovedArticle(article, state.improvedBody, polished);

      // Update sections
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingSections = (full.sections || []) as any[];
      const updatedSections = existingSections.map((s) =>
        (s.type === 'text-block' || s.type === 'rich-text') ? { ...s, content: improved.body } : s
      );
      if (!updatedSections.some((s) => s.type === 'text-block' || s.type === 'rich-text')) {
        updatedSections.push({ id: `text-${Date.now()}`, type: 'text-block', content: improved.body });
      }
      const faqIdx = updatedSections.findIndex((s) => s.type === 'faq');
      if (faqIdx >= 0 && improved.faqBlock?.length > 0) {
        updatedSections[faqIdx] = { ...updatedSections[faqIdx], items: improved.faqBlock };
      } else if (faqIdx < 0 && improved.faqBlock?.length > 0) {
        updatedSections.push({ id: `faq-${Date.now()}`, type: 'faq', title: 'Frequently Asked Questions', items: improved.faqBlock });
      }

      // Validate + score
      const afterValidation = await validateArticle(improved);
      const newGeoScore = afterValidation.geoScore.totalScore;

      // Save
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await saveBlogPost({
        slug,
        title: improved.title,
        sections: updatedSections,
        seo: { ...(full.seo || {}), pageTitle: improved.metaTitle, metaDescription: improved.metaDescription },
        excerpt: improved.excerpt,
        tags: full.tags,
        categories: full.categories,
        body: improved.body,
        quickAnswer: improved.quickAnswer,
        geoMetadata: {
          ...(full.geoMetadata || {}),
          geoScore: newGeoScore,
          geoScoreNotes: afterValidation.hardFails.length > 0
            ? afterValidation.hardFails.join('; ')
            : 'Passing',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any, 'draft', session.user?.email || undefined);

      // Clean up intermediate state
      await deleteImproveState(slug);

      return jsonResponse({
        phase: 'polish',
        status: 'improved',
        slug,
        afterScore: newGeoScore,
        changes,
        hardFails: afterValidation.hardFails,
      });
    }

    return jsonResponse({ error: `Unknown phase: ${phase}` }, 400);
  } catch (error) {
    console.error('ContentOps improve error:', error);
    return jsonResponse({
      error: error instanceof Error ? error.message : 'Improvement failed',
    }, 500);
  }
}

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
