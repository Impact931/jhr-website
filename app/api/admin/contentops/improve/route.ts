import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { improveArticleStreaming } from '@/lib/contentops/improve';
import { validateArticle } from '@/lib/contentops/validate';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 120;

/**
 * POST /api/admin/contentops/improve — SSE streaming, same pattern as /generate.
 * Body: { slug: string }
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
  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ─── Load article ──────────────────────────────────────────
        send('progress', { phase: 'loading', message: `Loading "${slug}"...` });

        const full = await getBlogContent(slug, 'draft')
          || await getBlogContent(slug, 'published');

        if (!full || !full.body) {
          send('error', { error: 'Article not found or has no body' });
          controller.close();
          return;
        }

        // Build article payload
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
          externalLinkCount: (bodyText.match(/href="https?:\/\/(?!jhr)/g) || []).length,
          internalLinkCount: (bodyText.match(/href="\/|href="https?:\/\/jhr/g) || []).length,
          schemaMarkup: { '@context': 'https://schema.org', '@type': 'Article' },
          openGraph: { title: (full.title as string) || '', description: (full.excerpt as string) || '', type: 'article' },
          status: 'draft',
        };

        const geoNotes = (full.geoMetadata?.geoScoreNotes as string) || '';

        // ─── Stream improvement (keeps connection alive) ───────────
        send('progress', { phase: 'improving', message: 'Rewriting article with Claude...' });

        const result = await improveArticleStreaming(article, geoNotes, (chunkCount) => {
          if (chunkCount % 10 === 0) {
            send('progress', { phase: 'improving', chunks: chunkCount });
          }
        });

        if (result.error || !result.data) {
          send('error', { error: result.error || 'Improvement failed' });
          controller.close();
          return;
        }

        // ─── Save ──────────────────────────────────────────────────
        send('progress', { phase: 'saving', message: 'Saving improved article...' });

        const improved = result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingSections = (full.sections || []) as any[];
        const updatedSections = existingSections.map((s) =>
          (s.type === 'text-block' || s.type === 'rich-text') ? { ...s, content: improved.body } : s
        );
        if (!updatedSections.some((s) => s.type === 'text-block' || s.type === 'rich-text')) {
          updatedSections.push({ id: `text-${Date.now()}`, type: 'text-block', content: improved.body });
        }
        // Update FAQ
        const faqIdx = updatedSections.findIndex((s) => s.type === 'faq');
        if (faqIdx >= 0 && improved.faqBlock?.length > 0) {
          updatedSections[faqIdx] = { ...updatedSections[faqIdx], items: improved.faqBlock };
        } else if (faqIdx < 0 && improved.faqBlock?.length > 0) {
          updatedSections.push({ id: `faq-${Date.now()}`, type: 'faq', title: 'Frequently Asked Questions', items: improved.faqBlock });
        }

        // Local GEO score
        const afterValidation = await validateArticle(improved);
        const newGeoScore = afterValidation.geoScore.totalScore;

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

        // ─── Done ──────────────────────────────────────────────────
        send('done', {
          slug,
          status: 'improved',
          afterScore: newGeoScore,
          changes: result.changes,
        });
        controller.close();
      } catch (error) {
        console.error('ContentOps improve error:', error);
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
