/**
 * Blog SEO/GEO Metadata Generation
 *
 * Uses OpenAI to generate SEO metadata, structured data, and GEO metadata
 * for blog posts. Falls back to basic metadata extraction if OpenAI is unavailable.
 */

import OpenAI from 'openai';
import type {
  BlogPostSEOMetadata,
  BlogPostStructuredData,
  BlogPostGEOMetadata,
} from '@/types/blog';

interface GenerateBlogSEOInput {
  title: string;
  body: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  tags: string[];
  categories: string[];
}

interface GenerateBlogSEOResult {
  seoMetadata: BlogPostSEOMetadata;
  structuredData: BlogPostStructuredData;
  geoMetadata: BlogPostGEOMetadata;
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generates fallback SEO metadata when OpenAI is unavailable.
 * Uses basic text extraction from the post content.
 */
function generateFallbackMetadata(input: GenerateBlogSEOInput): GenerateBlogSEOResult {
  const plainText = stripHtml(input.body);
  const metaTitle = input.title.slice(0, 60);
  const metaDescription = (input.excerpt || plainText).slice(0, 160);

  const seoMetadata: BlogPostSEOMetadata = {
    metaTitle,
    metaDescription,
    keywords: [...input.tags, ...input.categories].slice(0, 10),
    ogTitle: input.title.slice(0, 70),
    ogDescription: metaDescription,
    ogImage: input.featuredImage,
  };

  const structuredData: BlogPostStructuredData = {
    headline: input.title,
    datePublished: input.publishedAt,
    author: input.author,
    image: input.featuredImage,
    publisher: 'JHR Photography',
    description: metaDescription,
    articleBodySummary: plainText.slice(0, 500),
  };

  const geoMetadata: BlogPostGEOMetadata = {
    topicClassification: input.categories.length > 0
      ? input.categories
      : ['Photography'],
    entities: {
      people: input.author ? [input.author] : [],
      places: [],
      organizations: ['JHR Photography'],
    },
    contentSummary: metaDescription,
  };

  return { seoMetadata, structuredData, geoMetadata };
}

/**
 * Generates AI-powered SEO, structured data, and GEO metadata for a blog post.
 *
 * Calls OpenAI to analyze the article content and generate optimized metadata.
 * Falls back to basic extraction if OpenAI is unavailable or errors out.
 */
export async function generateBlogSEO(
  input: GenerateBlogSEOInput
): Promise<GenerateBlogSEOResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set — using fallback metadata generation');
    return generateFallbackMetadata(input);
  }

  const plainText = stripHtml(input.body);
  // Limit text sent to AI to avoid token limits
  const truncatedText = plainText.slice(0, 4000);

  const prompt = `You are an SEO and content optimization expert for a corporate photography company called "JHR Photography" based in Nashville, TN. Analyze this blog post and generate optimized metadata.

BLOG POST:
Title: ${input.title}
Author: ${input.author}
Tags: ${input.tags.join(', ') || 'none'}
Categories: ${input.categories.join(', ') || 'none'}
Content: ${truncatedText}

Generate the following JSON object with these exact fields:

{
  "seoMetadata": {
    "metaTitle": "50-60 character SEO title",
    "metaDescription": "150-160 character meta description",
    "keywords": ["5-10 relevant keywords"],
    "ogTitle": "OpenGraph title for social sharing",
    "ogDescription": "OpenGraph description for social sharing"
  },
  "structuredData": {
    "headline": "BlogPosting headline",
    "description": "Brief description for structured data",
    "articleBodySummary": "2-3 sentence summary of the article"
  },
  "geoMetadata": {
    "topicClassification": ["2-4 topic categories"],
    "entities": {
      "people": ["extracted person names"],
      "places": ["extracted place names"],
      "organizations": ["extracted organization names"]
    },
    "contentSummary": "A 2-3 sentence summary optimized for AI crawlers and discovery engines"
  }
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanation.`;

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn('OpenAI returned empty response — using fallback');
      return generateFallbackMetadata(input);
    }

    // Parse AI response, stripping any markdown code fences
    const cleaned = content.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();
    const aiResult = JSON.parse(cleaned) as {
      seoMetadata: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        ogTitle: string;
        ogDescription: string;
      };
      structuredData: {
        headline: string;
        description: string;
        articleBodySummary: string;
      };
      geoMetadata: {
        topicClassification: string[];
        entities: {
          people: string[];
          places: string[];
          organizations: string[];
        };
        contentSummary: string;
      };
    };

    // Merge AI output with known fields
    const seoMetadata: BlogPostSEOMetadata = {
      metaTitle: aiResult.seoMetadata.metaTitle || input.title.slice(0, 60),
      metaDescription: aiResult.seoMetadata.metaDescription || plainText.slice(0, 160),
      keywords: aiResult.seoMetadata.keywords || input.tags.slice(0, 10),
      ogTitle: aiResult.seoMetadata.ogTitle || input.title,
      ogDescription: aiResult.seoMetadata.ogDescription || plainText.slice(0, 160),
      ogImage: input.featuredImage,
    };

    const structuredData: BlogPostStructuredData = {
      headline: aiResult.structuredData.headline || input.title,
      datePublished: input.publishedAt,
      author: input.author,
      image: input.featuredImage,
      publisher: 'JHR Photography',
      description: aiResult.structuredData.description || seoMetadata.metaDescription,
      articleBodySummary: aiResult.structuredData.articleBodySummary || plainText.slice(0, 500),
    };

    const geoMetadata: BlogPostGEOMetadata = {
      topicClassification: aiResult.geoMetadata.topicClassification || input.categories,
      entities: {
        people: aiResult.geoMetadata.entities?.people || [],
        places: aiResult.geoMetadata.entities?.places || [],
        organizations: aiResult.geoMetadata.entities?.organizations || ['JHR Photography'],
      },
      contentSummary: aiResult.geoMetadata.contentSummary || seoMetadata.metaDescription,
    };

    console.log('AI SEO metadata generated successfully for:', input.title);
    return { seoMetadata, structuredData, geoMetadata };
  } catch (error) {
    console.error('OpenAI SEO generation failed, using fallback:', error);
    return generateFallbackMetadata(input);
  }
}
