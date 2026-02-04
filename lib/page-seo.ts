/**
 * Page SEO Metadata Generation
 *
 * Uses OpenAI to generate SEO metadata for pages based on their section content.
 * Falls back to basic metadata extraction if OpenAI is unavailable.
 */

import OpenAI from 'openai';
import type {
  PageSectionContent,
  PageSEOMetadata,
  HeroSectionContent,
  TextBlockSectionContent,
  FeatureGridSectionContent,
  FAQSectionContent,
  CTASectionContent,
  TestimonialsSectionContent,
} from '@/types/inline-editor';

interface GeneratePageSEOResult {
  seo: PageSEOMetadata;
  warning?: string;
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extracts plain text content from page sections for SEO analysis.
 * Processes different section types to extract relevant text fields.
 */
export function extractContentFromSections(
  slug: string,
  sections: PageSectionContent[]
): string {
  const contentParts: string[] = [];

  for (const section of sections) {
    switch (section.type) {
      case 'hero': {
        const hero = section as HeroSectionContent;
        if (hero.title) contentParts.push(`Hero Title: ${hero.title}`);
        if (hero.subtitle) contentParts.push(`Hero Subtitle: ${hero.subtitle}`);
        if (hero.description) contentParts.push(`Hero Description: ${stripHtml(hero.description)}`);
        break;
      }
      case 'text-block': {
        const textBlock = section as TextBlockSectionContent;
        if (textBlock.heading) contentParts.push(`Section Heading: ${textBlock.heading}`);
        if (textBlock.content) contentParts.push(`Content: ${stripHtml(textBlock.content)}`);
        break;
      }
      case 'feature-grid': {
        const featureGrid = section as FeatureGridSectionContent;
        if (featureGrid.heading) contentParts.push(`Features Heading: ${featureGrid.heading}`);
        if (featureGrid.subheading) contentParts.push(`Features Subheading: ${featureGrid.subheading}`);
        for (const feature of featureGrid.features) {
          contentParts.push(`Feature: ${feature.title} - ${feature.description}`);
        }
        break;
      }
      case 'faq': {
        const faq = section as FAQSectionContent;
        if (faq.heading) contentParts.push(`FAQ Heading: ${faq.heading}`);
        for (const item of faq.items) {
          contentParts.push(`FAQ: ${item.question}`);
        }
        break;
      }
      case 'cta': {
        const cta = section as CTASectionContent;
        if (cta.headline) contentParts.push(`CTA Headline: ${cta.headline}`);
        if (cta.subtext) contentParts.push(`CTA Subtext: ${cta.subtext}`);
        break;
      }
      case 'testimonials': {
        const testimonials = section as TestimonialsSectionContent;
        if (testimonials.heading) contentParts.push(`Testimonials Heading: ${testimonials.heading}`);
        break;
      }
      // image-gallery: No text content to extract
    }
  }

  // Truncate combined text to 3000 chars for OpenAI token limits
  const combined = contentParts.join('\n');
  return combined.slice(0, 3000);
}

/**
 * Generates fallback SEO metadata when OpenAI is unavailable.
 * Uses basic text extraction from the page sections.
 */
export function generateFallbackPageSEO(
  slug: string,
  sections: PageSectionContent[]
): PageSEOMetadata {
  // Find hero section for primary content
  const heroSection = sections.find((s) => s.type === 'hero') as HeroSectionContent | undefined;

  // Format slug for display (capitalize, replace hyphens)
  const pageName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Build page title
  const heroTitle = heroSection?.title || pageName;
  const pageTitle = `${heroTitle} | JHR Photography`.slice(0, 60);

  // Build meta description from hero content or fallback
  let metaDescription = '';
  if (heroSection?.subtitle) {
    metaDescription = heroSection.subtitle;
  } else if (heroSection?.description) {
    metaDescription = stripHtml(heroSection.description);
  } else {
    metaDescription = `Professional ${pageName.toLowerCase()} services from JHR Photography in Nashville, TN.`;
  }
  metaDescription = metaDescription.slice(0, 160);

  return {
    pageTitle,
    metaDescription,
    ogTitle: pageTitle,
    ogDescription: metaDescription,
  };
}

/**
 * Generates AI-powered SEO metadata for a page.
 *
 * Calls OpenAI to analyze the page content and generate optimized metadata.
 * Falls back to basic extraction if OpenAI is unavailable or errors out.
 */
export async function generatePageSEO(
  slug: string,
  sections: PageSectionContent[]
): Promise<GeneratePageSEOResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set — using fallback page SEO generation');
    return {
      seo: generateFallbackPageSEO(slug, sections),
      warning: 'OpenAI API key not configured. Using fallback metadata.',
    };
  }

  const extractedContent = extractContentFromSections(slug, sections);

  if (!extractedContent.trim()) {
    return {
      seo: generateFallbackPageSEO(slug, sections),
      warning: 'No content found in sections. Using fallback metadata.',
    };
  }

  // Format slug for display
  const pageName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const prompt = `You are an SEO expert for a corporate photography company called "JHR Photography" based in Nashville, TN. Analyze this page content and generate optimized SEO metadata.

PAGE: ${pageName}
URL SLUG: ${slug}

PAGE CONTENT:
${extractedContent}

Generate the following JSON object with these exact fields:

{
  "pageTitle": "50-60 character page title that includes the primary keyword and brand name (JHR Photography)",
  "metaDescription": "150-160 character meta description with compelling value proposition and call-to-action",
  "ogTitle": "Social media optimized title (can be slightly different from pageTitle)",
  "ogDescription": "Social media optimized description that encourages engagement"
}

Guidelines:
- pageTitle: Include primary keyword early, end with "| JHR Photography" or similar brand suffix
- metaDescription: Include value prop, location (Nashville), and implicit CTA
- ogTitle: Can be more engaging/casual than pageTitle
- ogDescription: Focus on benefits, make it shareable

IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanation.`;

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn('OpenAI returned empty response — using fallback');
      return {
        seo: generateFallbackPageSEO(slug, sections),
        warning: 'OpenAI returned empty response. Using fallback metadata.',
      };
    }

    // Parse AI response, stripping any markdown code fences
    const cleaned = content.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();
    const aiResult = JSON.parse(cleaned) as {
      pageTitle: string;
      metaDescription: string;
      ogTitle: string;
      ogDescription: string;
    };

    // Build SEO metadata with fallbacks for any missing fields
    const fallback = generateFallbackPageSEO(slug, sections);
    const seo: PageSEOMetadata = {
      pageTitle: aiResult.pageTitle || fallback.pageTitle,
      metaDescription: aiResult.metaDescription || fallback.metaDescription,
      ogTitle: aiResult.ogTitle || aiResult.pageTitle || fallback.ogTitle,
      ogDescription: aiResult.ogDescription || aiResult.metaDescription || fallback.ogDescription,
    };

    console.log('AI page SEO metadata generated successfully for:', slug);
    return { seo };
  } catch (error) {
    console.error('OpenAI page SEO generation failed, using fallback:', error);
    return {
      seo: generateFallbackPageSEO(slug, sections),
      warning: 'AI generation failed. Using fallback metadata.',
    };
  }
}
