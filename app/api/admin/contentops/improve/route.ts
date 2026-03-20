import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogContent, saveBlogPost } from '@/lib/blog-content';
import { improveArticleFast } from '@/lib/contentops/improve';
import { validateArticle } from '@/lib/contentops/validate';
import type { ArticlePayload } from '@/lib/contentops/types';

export const maxDuration = 300;

/**
 * GET /api/admin/contentops/improve — health check
 */
export async function GET() {
  return new Response(JSON.stringify({
    status: 'healthy',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
  }), { headers: { 'Content-Type': 'application/json' } });
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
 * POST /api/admin/contentops/improve
 *
 * Two-phase approach to fit within Amplify's 30s Lambda timeout:
 *   Phase 1: { slug, phase: "prepare" } — loads article, validates, returns deficiencies (~3s)
 *   Phase 2: { slug, phase: "execute", hardFails, softFails, geoNotes, article } — calls Claude + saves (~28s)
 *
 * Legacy: { slug } with no phase — tries both in one call (may timeout)
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
    const phase = (body.phase as string) || 'all';
    const userEmail = session.user?.email || undefined;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── Phase 1: PREPARE ──────────────────────────────────────
    if (phase === 'prepare') {
      const full = await getBlogContent(slug, 'draft')
        || await getBlogContent(slug, 'published');

      if (!full || !full.body) {
        return Response.json({ error: 'Article not found or has no body', slug }, { status: 404 });
      }

      const articlePayload = blogToArticlePayload(full);
      const geoNotes = (full.geoMetadata?.geoScoreNotes as string) || '';
      const validation = await validateArticle(articlePayload);

      return Response.json({
        phase: 'prepared',
        slug,
        article: articlePayload,
        hardFails: validation.hardFails,
        softFails: validation.softFails,
        geoNotes,
        geoScore: validation.geoScore.totalScore,
        originalStatus: full.status || 'draft',
      });
    }

    // ─── Phase 2: EXECUTE ──────────────────────────────────────
    if (phase === 'execute') {
      const article = body.article as ArticlePayload;
      const hardFails = (body.hardFails as string[]) || [];
      const softFails = (body.softFails as string[]) || [];
      const geoNotes = (body.geoNotes as string) || '';
      const originalStatus = (body.originalStatus as string) || 'draft';

      if (!article?.body) {
        return Response.json({ error: 'article payload is required' }, { status: 400 });
      }

      // Call Claude
      const improveResult = await improveArticleFast(article, hardFails, softFails, geoNotes);

      if (improveResult.error || !improveResult.data) {
        return Response.json({ slug, status: 'failed', error: improveResult.error }, { status: 500 });
      }

      // Save to DynamoDB
      const improved = improveResult.data;
      const current = await getBlogContent(slug, 'draft')
        || await getBlogContent(slug, 'published');

      if (current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sections = (current.sections || []) as any[];
        const updatedSections = sections.map((section) => {
          if (section.type === 'text-block' || section.type === 'rich-text') {
            return { ...section, content: improved.body };
          }
          return section;
        });
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

        // Local GEO re-score
        const afterValidation = await validateArticle(improved);
        const newGeoScore = afterValidation.geoScore.totalScore;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingGeo = (current.geoMetadata || {}) as Record<string, any>;
        const savePayload = {
          slug,
          title: improved.title,
          sections: updatedSections,
          seo: { ...(current.seo || {}), pageTitle: improved.metaTitle, metaDescription: improved.metaDescription },
          excerpt: improved.excerpt,
          tags: current.tags,
          categories: current.categories,
          body: improved.body,
          quickAnswer: improved.quickAnswer,
          geoMetadata: {
            ...existingGeo,
            geoScore: newGeoScore,
            geoScoreNotes: afterValidation.hardFails.length > 0
              ? afterValidation.hardFails.join('; ')
              : afterValidation.softFails.join('; ') || 'Passing',
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await saveBlogPost(savePayload as any, 'draft', userEmail);
        if (originalStatus === 'published') {
          const pub = await getBlogContent(slug, 'published');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (pub) await saveBlogPost(savePayload as any, 'published', userEmail);
        }

        return Response.json({
          slug,
          status: 'improved',
          afterScore: newGeoScore,
          changes: improveResult.changes,
        });
      }

      return Response.json({ slug, status: 'improved', changes: improveResult.changes });
    }

    // ─── Legacy: both phases in one call (may timeout on Amplify) ──
    return Response.json({ error: 'Use phase="prepare" then phase="execute" for Amplify compatibility' }, { status: 400 });
  } catch (err) {
    console.error('ContentOps improve error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Improvement failed' },
      { status: 500 },
    );
  }
}
