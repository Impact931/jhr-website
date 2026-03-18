import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { loadResearchData } from '@/lib/contentops/research-store';
import { generateArticle } from '@/lib/contentops/generate';
import { validateArticle } from '@/lib/contentops/validate';
import { saveBlogPost } from '@/lib/blog-content';
import { generateSlug } from '@/types/blog';
import type { PageSectionContent } from '@/types/inline-editor';

export const maxDuration = 120;

/**
 * POST /api/admin/contentops/generate
 *
 * Simple pipeline: load research from DB → generate article → validate → save draft
 *
 * Required body: { topic, primaryKeyword, icpTag, articleType, researchId }
 * Optional body: { wordCountTarget, ctaPath }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, primaryKeyword, icpTag, articleType, wordCountTarget, ctaPath, researchId } = body;

    if (!topic || !primaryKeyword || !icpTag || !articleType) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, primaryKeyword, icpTag, articleType' },
        { status: 400 }
      );
    }

    if (!researchId) {
      return NextResponse.json(
        { error: 'Missing researchId — run research first, then generate.' },
        { status: 400 }
      );
    }

    // ─── Load research from DynamoDB ─────────────────────────────────────
    const stored = await loadResearchData(researchId);
    if (!stored) {
      return NextResponse.json(
        { error: `Research ID "${researchId}" not found. Research may have expired (7-day TTL). Run research again.` },
        { status: 404 }
      );
    }
    console.log(`[ContentOps] Loaded research ${researchId} (${stored.provider})`);

    // ─── Generate article ────────────────────────────────────────────────
    const config = {
      topic,
      primaryKeyword,
      icpTag: icpTag as 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4',
      articleType,
      wordCountTarget: wordCountTarget || 1200,
      ctaPath: ctaPath || '/schedule',
    };

    const articleResult = await generateArticle(config, stored.data);
    if (articleResult.error || !articleResult.data) {
      return NextResponse.json(
        { error: articleResult.error || 'Article generation returned no data' },
        { status: 500 }
      );
    }

    const article = articleResult.data;

    // ─── Validate ────────────────────────────────────────────────────────
    const validation = await validateArticle(article);

    // ─── Save as draft ───────────────────────────────────────────────────
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

    return NextResponse.json({ article, validation, slug });
  } catch (error) {
    console.error('ContentOps generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Article generation failed' },
      { status: 500 }
    );
  }
}
