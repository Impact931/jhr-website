import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';
import { generateArticle } from '@/lib/contentops/generate';
import { validateArticle } from '@/lib/contentops/validate';
import { scrapeCompetitors } from '@/lib/contentops/competitor-scrape';
import { scoreArticleGEO } from '@/lib/contentops/geo-score';
import { saveBlogPost } from '@/lib/blog-content';
import { generateSlug } from '@/types/blog';
import type { PageSectionContent } from '@/types/inline-editor';

/**
 * POST /api/admin/contentops/generate — Full pipeline: research -> generate -> validate -> save draft
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, primaryKeyword, icpTag, articleType, wordCountTarget, ctaPath } = body;

    if (!topic || !primaryKeyword || !icpTag || !articleType) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, primaryKeyword, icpTag, articleType' },
        { status: 400 }
      );
    }

    const validIcpTags = ['ICP-1', 'ICP-2', 'ICP-3', 'ICP-4'];
    if (!validIcpTags.includes(icpTag)) {
      return NextResponse.json(
        { error: `Invalid icpTag. Must be one of: ${validIcpTags.join(', ')}` },
        { status: 400 }
      );
    }

    const validArticleTypes = ['statistics-hub', 'ultimate-guide', 'pricing-data', 'framework', 'roundup', 'standard'];
    if (!validArticleTypes.includes(articleType)) {
      return NextResponse.json(
        { error: `Invalid articleType. Must be one of: ${validArticleTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Phase 1: Research
    const researchResult = await runResearch(topic, icpTag, primaryKeyword);
    if (researchResult.error || !researchResult.data) {
      return NextResponse.json(
        { error: researchResult.error || 'Research phase returned no data' },
        { status: 500 }
      );
    }

    // Phase 1.5: Competitor scraping (graceful fallback)
    let competitorContext = null;
    if (researchResult.data.competitorUrls && researchResult.data.competitorUrls.length > 0) {
      competitorContext = await scrapeCompetitors(researchResult.data.competitorUrls);
    }

    // Phase 2: Generate article (with competitor context)
    const config = {
      topic,
      primaryKeyword,
      icpTag: icpTag as 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4',
      articleType,
      wordCountTarget: wordCountTarget || 1200,
      ctaPath: ctaPath || '/schedule',
    };

    const articleResult = await generateArticle(config, researchResult.data, competitorContext);
    if (articleResult.error || !articleResult.data) {
      return NextResponse.json(
        { error: articleResult.error || 'Article generation returned no data' },
        { status: 500 }
      );
    }

    const article = articleResult.data;

    // Phase 3: Validate
    const validation = await validateArticle(article);

    // Phase 4: GEO scoring via Claude API
    const geoResult = await scoreArticleGEO(article);
    if (geoResult) {
      article.geoScore = geoResult.totalScore;

      if (geoResult.totalScore < 70) {
        article.status = 'draft';
        article.geoScoreNotes = geoResult.notes;
      } else if (geoResult.totalScore >= 85) {
        article.highGeoPriority = true;
      }
    }

    // Build sections from the article body and FAQ
    const sections: PageSectionContent[] = [];

    sections.push({
      id: `text-block-${Date.now()}`,
      type: 'text-block',
      order: 0,
      seo: {
        ariaLabel: 'Article content',
        sectionId: 'article-body',
        dataSectionName: 'text-block',
      },
      content: article.body || '',
      alignment: 'left',
    });

    if (article.faqBlock && article.faqBlock.length > 0) {
      sections.push({
        id: `faq-${Date.now()}`,
        type: 'faq',
        order: 1,
        seo: {
          ariaLabel: 'Frequently asked questions',
          sectionId: 'article-faq',
          dataSectionName: 'faq',
        },
        heading: 'Frequently Asked Questions',
        items: article.faqBlock.map((item, i) => ({
          id: `faq-item-${i}`,
          question: item.question,
          answer: item.answer,
        })),
      });
    }

    // Generate slug from the article title
    const slug = generateSlug(article.title || topic);

    // Save to DynamoDB as a blog post draft
    await saveBlogPost(
      {
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
      },
      'draft',
      session.user?.email || undefined
    );

    return NextResponse.json({
      article,
      validation,
      slug,
      competitorContext,
      geoScoring: geoResult,
    });
  } catch (error) {
    console.error('ContentOps generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Article generation failed' },
      { status: 500 }
    );
  }
}
