/**
 * Batch Article Generator — Runs ContentOps pipeline for 10 articles
 *
 * Usage: npx tsx scripts/generate-articles.ts
 *
 * Uses .env credentials to call Perplexity (research) and Anthropic (generation),
 * then saves drafts to DynamoDB and publishes them.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { runResearch } from '../lib/contentops/research';
import { generateArticle } from '../lib/contentops/generate';
import { validateArticle } from '../lib/contentops/validate';
import { scrapeCompetitors } from '../lib/contentops/competitor-scrape';
import { saveBlogPost, publishBlog } from '../lib/blog-content';
import type { PageSectionContent } from '../types/inline-editor';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ArticleConfig {
  topic: string;
  primaryKeyword: string;
  icpTag: 'ICP-1' | 'ICP-2' | 'ICP-3' | 'ICP-4';
  articleType: string;
  wordCountTarget: number;
  ctaPath: string;
}

const ARTICLES: ArticleConfig[] = [
  {
    topic: 'Why Every Nashville Conference Needs a Dedicated Event Photographer',
    primaryKeyword: 'nashville conference photographer',
    icpTag: 'ICP-1',
    articleType: 'standard',
    wordCountTarget: 1300,
    ctaPath: '/services/corporate-event-coverage',
  },
  {
    topic: 'What to Expect from a Corporate Headshot Activation at Your Next Event',
    primaryKeyword: 'corporate headshot activation',
    icpTag: 'ICP-2',
    articleType: 'standard',
    wordCountTarget: 1200,
    ctaPath: '/services/headshot-activation',
  },
  {
    topic: 'How Nashville Trade Show Exhibitors Use Professional Photography to Prove ROI',
    primaryKeyword: 'nashville trade show photographer',
    icpTag: 'ICP-3',
    articleType: 'standard',
    wordCountTarget: 1400,
    ctaPath: '/services/trade-show-media',
  },
  {
    topic: 'Planning a Gala in Nashville? Here\'s How to Get Photography Right',
    primaryKeyword: 'nashville gala photographer',
    icpTag: 'ICP-1',
    articleType: 'standard',
    wordCountTarget: 1300,
    ctaPath: '/services/corporate-event-coverage',
  },
  {
    topic: 'The Event Planner\'s Guide to Music City Center Photography',
    primaryKeyword: 'music city center photographer',
    icpTag: 'ICP-4',
    articleType: 'standard',
    wordCountTarget: 1200,
    ctaPath: '/venues/music-city-center',
  },
  {
    topic: 'Executive Headshots in Nashville: What Corporate Leaders Should Know Before Booking',
    primaryKeyword: 'executive headshot photographer nashville',
    icpTag: 'ICP-2',
    articleType: 'standard',
    wordCountTarget: 1300,
    ctaPath: '/services/executive-imaging',
  },
  {
    topic: 'How Gaylord Opryland Events Get the Best Photography Coverage',
    primaryKeyword: 'gaylord opryland event photographer',
    icpTag: 'ICP-4',
    articleType: 'standard',
    wordCountTarget: 1200,
    ctaPath: '/venues/gaylord-opryland',
  },
  {
    topic: 'Event Video Production in Nashville: What Planners Need to Know',
    primaryKeyword: 'event video production nashville',
    icpTag: 'ICP-1',
    articleType: 'standard',
    wordCountTarget: 1400,
    ctaPath: '/schedule',
  },
  {
    topic: 'Nashville Convention Photographer: How to Document a Multi-Day Event',
    primaryKeyword: 'nashville convention photographer',
    icpTag: 'ICP-1',
    articleType: 'standard',
    wordCountTarget: 1400,
    ctaPath: '/services/convention-media',
  },
  {
    topic: 'Professional Headshots in Nashville: What to Expect and How to Prepare',
    primaryKeyword: 'professional headshots nashville',
    icpTag: 'ICP-2',
    articleType: 'standard',
    wordCountTarget: 1200,
    ctaPath: '/services/headshot-activation',
  },
];

async function generateSingleArticle(config: ArticleConfig, index: number): Promise<{ slug: string; success: boolean; error?: string; geoScore?: number }> {
  const label = `[${index + 1}/10] "${config.topic}"`;

  try {
    console.log(`${label} — Starting research...`);

    // Phase 1: Research
    const researchResult = await runResearch(config.topic, config.icpTag, config.primaryKeyword);
    if (researchResult.error || !researchResult.data) {
      throw new Error(`Research failed: ${researchResult.error || 'No data'}`);
    }
    console.log(`${label} — Research complete (${researchResult.data.currentStats.length} stats, ${researchResult.data.authorityLinks.length} links)`);

    // Phase 1.5: Competitor scraping (graceful)
    let competitorContext = null;
    if (researchResult.data.competitorUrls?.length > 0) {
      try {
        competitorContext = await scrapeCompetitors(researchResult.data.competitorUrls);
        if (competitorContext) {
          console.log(`${label} — Scraped ${competitorContext.pages.length} competitor pages`);
        }
      } catch {
        console.log(`${label} — Competitor scraping skipped`);
      }
    }

    // Phase 2: Generate article
    console.log(`${label} — Generating article...`);
    const articleResult = await generateArticle(config, researchResult.data, competitorContext);
    if (articleResult.error || !articleResult.data) {
      throw new Error(`Generation failed: ${articleResult.error || 'No data'}`);
    }
    const article = articleResult.data;
    console.log(`${label} — Generated (${article.wordCount} words, ${article.externalLinkCount} ext links, ${article.internalLinkCount} int links)`);

    // Phase 3: Validate
    const validation = await validateArticle(article);
    if (validation.hardFails.length > 0) {
      console.warn(`${label} — Hard fails: ${validation.hardFails.join('; ')}`);
    }
    if (validation.softFails.length > 0) {
      console.warn(`${label} — Soft fails: ${validation.softFails.join('; ')}`);
    }
    console.log(`${label} — GEO Score: ${validation.geoScore.totalScore}/100 (${validation.passed ? 'PASS' : 'FAIL'})`);

    // Build sections
    const sections: PageSectionContent[] = [];
    sections.push({
      id: `text-block-${Date.now()}-${index}`,
      type: 'text-block',
      order: 0,
      seo: { ariaLabel: 'Article content', sectionId: 'article-body', dataSectionName: 'text-block' },
      content: article.body || '',
      alignment: 'left',
    });

    if (article.faqBlock?.length > 0) {
      sections.push({
        id: `faq-${Date.now()}-${index}`,
        type: 'faq',
        order: 1,
        seo: { ariaLabel: 'Frequently asked questions', sectionId: 'article-faq', dataSectionName: 'faq' },
        heading: 'Frequently Asked Questions',
        items: article.faqBlock.map((item, i) => ({
          id: `faq-item-${i}`,
          question: item.question,
          answer: item.answer,
        })),
      });
    }

    const slug = generateSlug(article.title || config.topic);

    // Save as draft
    console.log(`${label} — Saving draft (slug: ${slug})...`);
    await saveBlogPost(
      {
        slug,
        title: article.title || config.topic,
        sections,
        excerpt: article.excerpt || article.metaDescription || '',
        tags: ['contentops-generated', ...(article.secondaryKeywords || [])],
        categories: [],
        seo: {
          pageTitle: article.metaTitle || article.title || config.topic,
          metaDescription: article.metaDescription || '',
          ogTitle: article.title || config.topic,
          ogDescription: article.metaDescription || '',
        },
        seoMetadata: {
          metaTitle: article.metaTitle || article.title || config.topic,
          metaDescription: article.metaDescription || '',
          keywords: article.secondaryKeywords || [],
          ogTitle: article.openGraph?.title || article.title || config.topic,
          ogDescription: article.openGraph?.description || article.metaDescription || '',
        },
        structuredData: {
          headline: article.title || config.topic,
          datePublished: new Date().toISOString(),
          author: 'Jayson Rivas',
          publisher: 'JHR Photography',
          description: article.metaDescription || article.excerpt || '',
        },
      },
      'draft',
      'admin@jhr-photography.com'
    );

    // Publish immediately
    console.log(`${label} — Publishing...`);
    await publishBlog(slug);

    console.log(`${label} — PUBLISHED ✓ (GEO: ${validation.geoScore.totalScore})`);
    return { slug, success: true, geoScore: validation.geoScore.totalScore };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`${label} — FAILED: ${msg}`);
    return { slug: '', success: false, error: msg };
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('JHR Photography — Batch Article Generator');
  console.log(`Generating ${ARTICLES.length} articles...`);
  console.log('='.repeat(80));

  // Verify env vars
  const required = ['PERPLEXITY_API_KEY', 'ANTHROPIC_API_KEY'];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`ERROR: Missing ${key} in .env`);
      process.exit(1);
    }
  }
  // AWS credentials: either CUSTOM_AWS_* (Amplify) or AWS_* (local)
  if (!process.env.CUSTOM_AWS_ACCESS_KEY_ID && !process.env.AWS_ACCESS_KEY_ID) {
    console.error('ERROR: Missing AWS credentials in .env');
    process.exit(1);
  }
  console.log('Environment OK\n');

  // Process sequentially (respect API rate limits)
  const results: Array<{ index: number; topic: string; slug: string; success: boolean; error?: string; geoScore?: number }> = [];

  for (let i = 0; i < ARTICLES.length; i++) {
    const config = ARTICLES[i];
    console.log(`\n${'─'.repeat(80)}`);
    const result = await generateSingleArticle(config, i);
    results.push({ index: i + 1, topic: config.topic, ...result });

    // Brief pause between articles to avoid rate limiting
    if (i < ARTICLES.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('GENERATION COMPLETE — SUMMARY');
  console.log('='.repeat(80));

  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);

  console.log(`\nSuccessful: ${successes.length}/${results.length}`);
  for (const r of successes) {
    console.log(`  ✓ #${r.index} "${r.topic}" → /blog/${r.slug} (GEO: ${r.geoScore})`);
  }

  if (failures.length > 0) {
    console.log(`\nFailed: ${failures.length}/${results.length}`);
    for (const r of failures) {
      console.log(`  ✗ #${r.index} "${r.topic}" — ${r.error}`);
    }
  }

  console.log('\n' + '='.repeat(80));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
