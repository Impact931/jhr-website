/**
 * AI Metadata Generation for Media Library
 * Uses OpenAI gpt-4o-mini vision to generate alt text, tags, descriptions, and SEO text
 */

import OpenAI from 'openai';
import type { AIMetadataResponse } from '@/types/media';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImageMetadata(imageUrl: string): Promise<AIMetadataResponse> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert photography metadata assistant for JHR Photography, a Nashville-based corporate event and headshot photography company. Generate metadata for the given image. Respond ONLY with valid JSON matching this format:
{
  "altText": "Descriptive alt text for accessibility (max 125 chars)",
  "description": "2-3 sentence description of the image content and context",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seoText": "SEO-optimized description mentioning JHR Photography Nashville where relevant (1-2 sentences)"
}

Guidelines:
- Alt text should be concise and descriptive, suitable for screen readers
- Tags should include relevant categories: event type, setting, people, mood, style
- SEO text should naturally incorporate keywords relevant to Nashville event photography
- Keep tags lowercase, 3-8 tags total`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'low' },
          },
          {
            type: 'text',
            text: 'Generate metadata for this image.',
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || '';

  try {
    // Extract JSON from the response (handle possible markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    const parsed = JSON.parse(jsonMatch[0]) as AIMetadataResponse;

    return {
      altText: parsed.altText || 'Image from JHR Photography',
      description: parsed.description || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => t.toLowerCase()) : [],
      seoText: parsed.seoText || '',
    };
  } catch {
    // Fallback if parsing fails
    return {
      altText: 'Image from JHR Photography',
      description: '',
      tags: [],
      seoText: '',
    };
  }
}
