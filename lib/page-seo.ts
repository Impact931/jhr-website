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
 * Detects page type from slug for SEO prompt adaptation.
 */
function detectPageType(slug: string): string {
  const s = slug.toLowerCase();
  if (s === 'about' || s.startsWith('about-')) return 'About';
  if (s.includes('venue') || s.includes('location')) return 'Location';
  if (s === 'blog' || s.split('-').length > 5) return 'Blog';
  if (s === 'contact') return 'Contact';
  return 'Service';
}

/**
 * Generates AI-powered SEO metadata for a page.
 *
 * Uses the comprehensive JHR SEO + AI GEO metadata prompt that optimizes
 * for both traditional search engines and AI answer engines (Google, ChatGPT,
 * Perplexity, Gemini).
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

  const isBlogPost = slug.split('-').length > 5;
  const pageType = detectPageType(slug);

  // Adaptation rules based on page type
  let adaptationRules = '';
  switch (pageType) {
    case 'About':
      adaptationRules = `This is an ABOUT PAGE:
- Emphasize founder role, experience, leadership, and systems
- Optimize for authority + trust, not a single service
- Reinforce JHR's role as a guide and partner`;
      break;
    case 'Location':
      adaptationRules = `This is a LOCATION PAGE:
- Emphasize local knowledge, venues, and operational familiarity
- Sound like a local partner, not a tourism site`;
      break;
    case 'Blog':
      adaptationRules = `This is a BLOG POST:
- Focus on the article topic, use article-style title conventions
- Include relevant long-tail keywords naturally
- Make the description read like a compelling article summary`;
      break;
    case 'Contact':
      adaptationRules = `This is a CONTACT PAGE:
- Emphasize ease of reaching out and responsiveness
- Reinforce that JHR is approachable and ready to help`;
      break;
    default:
      adaptationRules = `This is a SERVICE/LANDING PAGE:
- Optimize for the specific service
- Align language to the ICP most likely to buy it
- Include Nashville / regional relevance naturally`;
      break;
  }

  const prompt = `SYSTEM / ROLE

You are an AI SEO and Generative Engine Optimization (GEO) specialist writing metadata for JHR Photography, a relationship-based, Nashville-based event media company.

You understand:
- B2B decision-makers under pressure
- Relationship-led brand positioning
- Local + topical authority for AI search engines (Google, ChatGPT, Perplexity, Gemini)
- Calm, familiar, "one of the team" brand voice

You do not use marketing fluff, hype, or generic SEO language.

CONTEXT: BRAND & VOICE (NON-NEGOTIABLE)

JHR is:
- Approachable, friendly, and familiar
- Calm, capable, and operational
- Relationship-based, not transactional
- A trusted extension of the client's team
- Value-first, emotionally intelligent, and socially aware

The tone should feel like:
"Highly capable people I actually enjoy working with."

Avoid:
- Corporate jargon
- Thought leadership cliches
- Overly clever language
- Keyword stuffing
- Generic marketing phrases

INPUT

Page type: ${pageType}
Page name: ${pageName}
URL slug: ${slug}
URL: https://jhrphotography.com/${isBlogPost ? 'blog/' : ''}${slug}

PAGE CONTENT:
${extractedContent}

YOUR TASK

Generate SEO + AI GEO-optimized page metadata that aligns with JHR's brand voice and strategic goals.

This metadata should help:
- Humans immediately understand who this is for
- AI engines understand what JHR is known for
- Search engines confidently rank and cite the page

ADAPTATION RULES:
${adaptationRules}

REQUIRED OUTPUT

Return a JSON object with these exact fields:

{
  "pageTitle": "SEO Page Title (50-60 characters). Clear, calm, and human. Includes primary service or role, target audience or location when applicable. Sounds like something a planner would trust, not an ad.",
  "metaDescription": "Meta Description (140-160 characters). Warm, helpful, and reassuring. Explains what JHR does on this page and why it reduces stress or uncertainty. Written for humans, not bots.",
  "ogTitle": "Social media optimized title — engaging and shareable, feels like a recommendation from a colleague.",
  "ogDescription": "Social media description — focuses on benefits and value, encourages clicks and shares.",
  "primarySEOFocus": "1 core keyword phrase (natural, not stuffed)",
  "secondarySEOSignals": ["3-6 supporting keyword phrases", "Include services or systems", "Target audience", "Location when relevant"],
  "geoEntitySignals": ["Entity 1", "Entity 2", "..."],
  "trustAuthoritySignal": "A short, plain-language statement (1-2 sentences) that reinforces experience, calm authority, and 'been there before' credibility. This should feel repeatable in AI answers."
}

For geoEntitySignals, list the entities and concepts AI engines should associate with this page:
- Services or systems
- Event types
- Audiences
- Locations
- Professional roles or experience

FINAL QUALITY CHECK (do this silently before responding):
- It sounds like someone you'd want on your team
- It reduces uncertainty
- It feels generous, calm, and professional
- It would be safe for a planner to forward internally
- It would read well if quoted by an AI assistant

IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanation.`;

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI SEO and GEO specialist. Return only valid JSON, no markdown.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
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
      primarySEOFocus?: string;
      secondarySEOSignals?: string[];
      geoEntitySignals?: string[];
      trustAuthoritySignal?: string;
    };

    // Build SEO metadata with fallbacks for any missing fields
    const fallback = generateFallbackPageSEO(slug, sections);
    const seo: PageSEOMetadata = {
      pageTitle: aiResult.pageTitle || fallback.pageTitle,
      metaDescription: aiResult.metaDescription || fallback.metaDescription,
      ogTitle: aiResult.ogTitle || aiResult.pageTitle || fallback.ogTitle,
      ogDescription: aiResult.ogDescription || aiResult.metaDescription || fallback.ogDescription,
      primarySEOFocus: aiResult.primarySEOFocus,
      secondarySEOSignals: aiResult.secondarySEOSignals,
      geoEntitySignals: aiResult.geoEntitySignals,
      trustAuthoritySignal: aiResult.trustAuthoritySignal,
    };

    console.log('AI page SEO + GEO metadata generated successfully for:', slug);
    return { seo };
  } catch (error) {
    console.error('OpenAI page SEO generation failed, using fallback:', error);
    return {
      seo: generateFallbackPageSEO(slug, sections),
      warning: 'AI generation failed. Using fallback metadata.',
    };
  }
}
