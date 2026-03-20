import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listBlogs, getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { improveArticleStreaming } from '@/lib/contentops/improve';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 300;

/**
 * GET /api/admin/contentops/improve — SSE health check.
 */
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`event: progress\ndata: ${JSON.stringify({ phase: 'health-check', message: 'SSE streaming OK' })}\n\n`));
      controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ status: 'healthy', hasApiKey: !!process.env.ANTHROPIC_API_KEY })}\n\n`));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  });
}

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
    quickAnswer: (full.quickAnswer as string) || (full.geoMetadata?.contentSummary as string) || '',
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
 * GEO re-score is skipped here to stay within 30s Lambda budget — use /rescore separately.
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

  // Quick local GEO score (no Claude call — just the formula)
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
    // Non-blocking
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
 * POST /api/admin/contentops/improve
 *
 * Improves ONE article per invocation to fit within Amplify's 30s Lambda timeout.
 * Returns JSON (not SSE) for simplicity and reliability.
 *
 * Body: { slug: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json().catch(() => ({}));
    const slug = body.slug as string | undefined;
    const userEmail = session.user?.email || undefined;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── Load article ────────────────────────────────────────────
    const full = await getBlogContent(slug, 'draft')
      || await getBlogContent(slug, 'published');

    if (!full || !full.body) {
      return new Response(JSON.stringify({ error: 'Article not found or has no body', slug }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articlePayload = blogToArticlePayload(full);
    const geoNotes = (full.geoMetadata?.geoScoreNotes as string) || '';

    // ─── Call Claude (Haiku — fast enough for 30s budget) ────────
    const improveResult = await improveArticleStreaming(articlePayload, geoNotes);

    if (improveResult.error || !improveResult.data) {
      return new Response(JSON.stringify({
        slug,
        status: 'failed',
        error: improveResult.error,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── Save ────────────────────────────────────────────────────
    const saveResult = await saveImprovedArticle(
      slug,
      improveResult.data,
      full.status || 'draft',
      userEmail,
    );

    return new Response(JSON.stringify({
      slug,
      status: 'improved',
      afterScore: saveResult.geoScore ?? null,
      changes: improveResult.changes,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ContentOps improve error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Improvement failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
