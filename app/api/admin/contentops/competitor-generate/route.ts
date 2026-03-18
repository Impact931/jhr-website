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

// Competitor pipeline: scrape + research + generate + validate
export const maxDuration = 180;

/**
 * POST /api/admin/contentops/competitor-generate
 *
 * Full competitor-outrank pipeline:
 *   1. Scrape the competitor's ranking page (structure, word count, headings)
 *   2. Run targeted research focused on beating that specific page
 *   3. Generate article with competitor context (beat their word count, cover their topics + gaps)
 *   4. Validate + GEO score
 *   5. Save as draft
 *
 * Body: {
 *   keyword: string,
 *   competitorUrl: string,
 *   competitorDomain: string,
 *   competitorPosition: number,
 *   ourPosition: number | null,
 *   searchVolume: number,
 *   icpTag: string,
 *   articleType?: string,
 *   wordCountTarget?: number,
 * }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      keyword,
      competitorUrl,
      competitorDomain,
      competitorPosition,
      ourPosition,
      searchVolume,
      icpTag = 'ICP-1',
      articleType = 'ultimate-guide',
      wordCountTarget,
    } = body;

    if (!keyword || !competitorUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: keyword, competitorUrl' },
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

    // ── Step 1: Scrape the competitor page ──────────────────────────────────
    // Run scrape and research in parallel to save time
    const [competitorContext, researchResult] = await Promise.all([
      scrapeCompetitors([competitorUrl]).catch((err) => {
        console.warn('[CompetitorGen] Scrape failed, continuing without:', err);
        return null;
      }),
      runResearch(
        buildCompetitorTopic(keyword, competitorDomain, competitorPosition, ourPosition),
        icpTag,
        keyword
      ),
    ]);

    if (researchResult.error || !researchResult.data) {
      return NextResponse.json(
        { error: researchResult.error || 'Research phase returned no data' },
        { status: 500 }
      );
    }

    // ── Step 2: Determine word count target ─────────────────────────────────
    // Beat the competitor: use their word count + 30% or user's target, whichever is higher
    const competitorWordCount = competitorContext?.avgWordCount || 0;
    const beatTarget = Math.ceil(competitorWordCount * 1.3);
    const finalWordCount = Math.max(
      wordCountTarget || 1500,
      beatTarget,
      1200 // minimum floor
    );

    // ── Step 3: Generate article with competitor context ────────────────────
    const config = {
      topic: `${keyword} — Comprehensive Guide`,
      primaryKeyword: keyword,
      icpTag: icpTag as 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4',
      articleType,
      wordCountTarget: finalWordCount,
      ctaPath: '/schedule',
    };

    const articleResult = await generateArticle(config, researchResult.data, competitorContext);
    if (articleResult.error || !articleResult.data) {
      return NextResponse.json(
        { error: articleResult.error || 'Article generation returned no data' },
        { status: 500 }
      );
    }

    const article = articleResult.data;

    // ── Step 4: Validate + GEO score ────────────────────────────────────────
    const [validation, geoResult] = await Promise.all([
      validateArticle(article),
      scoreArticleGEO(article),
    ]);

    if (geoResult) {
      article.geoScore = geoResult.totalScore;
      if (geoResult.totalScore < 70) {
        article.status = 'draft';
        article.geoScoreNotes = geoResult.notes;
      } else if (geoResult.totalScore >= 85) {
        article.highGeoPriority = true;
      }
    }

    // ── Step 5: Save as draft ───────────────────────────────────────────────
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

    const slug = generateSlug(article.title || keyword);

    await saveBlogPost(
      {
        slug,
        title: article.title || keyword,
        sections,
        excerpt: article.excerpt || article.metaDescription || '',
        tags: ['contentops-generated', 'competitor-outrank', competitorDomain, ...(article.secondaryKeywords || [])],
        categories: [],
        seo: {
          pageTitle: article.metaTitle || article.title || keyword,
          metaDescription: article.metaDescription || '',
          ogTitle: article.title || keyword,
          ogDescription: article.metaDescription || '',
        },
        geoMetadata: {
          topicClassification: [config.articleType, config.icpTag, 'competitor-outrank'],
          entities: { people: [], places: ['Nashville'], organizations: ['JHR Photography'] },
          contentSummary: article.quickAnswer || article.excerpt || '',
          geoScore: article.geoScore ?? geoResult?.totalScore ?? 0,
          geoScoreNotes: article.geoScoreNotes || geoResult?.notes || '',
        },
      },
      'draft',
      session.user?.email || undefined
    );

    return NextResponse.json({
      success: true,
      article,
      validation,
      slug,
      geoScoring: geoResult,
      proofing: null,
      competitorAnalysis: {
        url: competitorUrl,
        domain: competitorDomain,
        theirPosition: competitorPosition,
        ourPosition,
        theirWordCount: competitorWordCount,
        ourWordCount: article.wordCount,
        searchVolume,
      },
    });
  } catch (error) {
    console.error('Competitor generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Competitor article generation failed' },
      { status: 500 }
    );
  }
}

/**
 * Build a competitor-focused topic string for the research phase.
 * This tells Perplexity to focus on outranking a specific competitor.
 */
function buildCompetitorTopic(
  keyword: string,
  competitorDomain: string,
  competitorPosition: number,
  ourPosition: number | null
): string {
  const positionContext = ourPosition
    ? `We currently rank #${ourPosition}, they rank #${competitorPosition}.`
    : `They rank #${competitorPosition}, we don't rank yet.`;

  return `${keyword} — targeting Nashville TN market. ${positionContext} Competitor to outrank: ${competitorDomain}. Find specific data, statistics, local insights, and expert perspectives that ${competitorDomain} is NOT covering. Focus on content gaps and unique angles that would make our page the definitive resource for "${keyword}" in Nashville.`;
}
