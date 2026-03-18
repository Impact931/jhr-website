import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { loadResearchData } from '@/lib/contentops/research-store';
import { generateArticleStreaming } from '@/lib/contentops/generate';
import { validateArticle } from '@/lib/contentops/validate';
import { saveBlogPost } from '@/lib/blog-content';
import { generateSlug } from '@/types/blog';
import type { PageSectionContent } from '@/types/inline-editor';

export const maxDuration = 120;

/**
 * POST /api/admin/contentops/generate
 *
 * Streaming pipeline: load research → stream article generation → validate → save
 * Uses SSE to keep the connection alive past Amplify's gateway timeout.
 *
 * Required: { topic, primaryKeyword, icpTag, articleType, researchId }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { topic, primaryKeyword, icpTag, articleType, wordCountTarget, ctaPath, researchId } = body;

  if (!topic || !primaryKeyword || !icpTag || !articleType) {
    return new Response(JSON.stringify({ error: 'Missing required fields: topic, primaryKeyword, icpTag, articleType' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!researchId) {
    return new Response(JSON.stringify({ error: 'Missing researchId — run research first.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Load research before starting the stream
  const stored = await loadResearchData(researchId);
  if (!stored) {
    return new Response(JSON.stringify({ error: `Research ID "${researchId}" not found. Run research again.` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const config = {
    topic,
    primaryKeyword,
    icpTag: icpTag as 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4',
    articleType,
    wordCountTarget: wordCountTarget || 1200,
    ctaPath: ctaPath || '/schedule',
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ─── Generate article (streaming keeps connection alive) ──────
        send('progress', { phase: 'generating', message: 'Writing article with Claude...' });

        const articleResult = await generateArticleStreaming(config, stored.data, (chunkCount) => {
          // Send keepalive every 10 chunks (~every 2-3 seconds)
          if (chunkCount % 10 === 0) {
            send('progress', { phase: 'generating', chunks: chunkCount });
          }
        });

        if (articleResult.error || !articleResult.data) {
          send('error', { error: articleResult.error || 'Generation failed' });
          controller.close();
          return;
        }

        const article = articleResult.data;

        // ─── Validate ────────────────────────────────────────────────
        send('progress', { phase: 'validating', message: 'Validating article...' });
        const validation = await validateArticle(article);

        // ─── Save as draft ───────────────────────────────────────────
        send('progress', { phase: 'saving', message: 'Saving draft...' });
        const now = Date.now();
        const sections: PageSectionContent[] = [];

        sections.push({
          id: `hero-${now}`,
          type: 'hero',
          order: 0,
          seo: { ariaLabel: article.title || topic, sectionId: 'article-hero', dataSectionName: 'hero' },
          variant: 'full-height',
          title: article.title || topic,
          subtitle: article.excerpt || article.metaDescription || '',
          backgroundImage: { src: '/images/blog-default-hero.jpg', alt: article.title || topic },
          buttons: [],
        } as PageSectionContent);

        sections.push({
          id: `text-block-${now}`,
          type: 'text-block',
          order: 1,
          seo: { ariaLabel: 'Article content', sectionId: 'article-body', dataSectionName: 'text-block' },
          content: article.body || '',
          alignment: 'left',
        });

        if (article.faqBlock && article.faqBlock.length > 0) {
          sections.push({
            id: `faq-${now}`,
            type: 'faq',
            order: 2,
            seo: { ariaLabel: 'Frequently asked questions', sectionId: 'article-faq', dataSectionName: 'faq' },
            heading: 'Frequently Asked Questions',
            items: article.faqBlock.map((item, i) => ({
              id: `faq-item-${i}`,
              question: item.question,
              answer: item.answer,
            })),
          });
        }

        const slug = generateSlug(article.title || topic);

        await saveBlogPost({
          slug,
          title: article.title || topic,
          sections,
          excerpt: article.excerpt || article.metaDescription || '',
          tags: ['contentops-generated', ...(article.secondaryKeywords || [])],
          categories: [],
          seo: {
            pageTitle: article.metaTitle || article.title || topic,
            metaDescription: article.metaDescription || '',
            ogTitle: article.title || topic,
            ogDescription: article.metaDescription || '',
          },
          geoMetadata: {
            topicClassification: [config.articleType, config.icpTag],
            entities: { people: [], places: ['Nashville'], organizations: ['JHR Photography'] },
            contentSummary: article.quickAnswer || article.excerpt || '',
            geoScore: 0,
            geoScoreNotes: 'Pending — use GEO rescore to calculate',
          },
        }, 'draft', session.user?.email || undefined);

        // ─── Done — send the final result ────────────────────────────
        send('done', { article, validation, slug });
        controller.close();
      } catch (error) {
        console.error('ContentOps generate stream error:', error);
        send('error', { error: error instanceof Error ? error.message : 'Article generation failed' });
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
