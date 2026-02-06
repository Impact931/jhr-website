import { getItem, putItem } from '@/lib/dynamodb';

const SETTINGS_PK = 'SETTINGS#global';
const SETTINGS_SK = 'config';

// ============================================================================
// SEO/GEO Prompt Presets
// ============================================================================

export const DEFAULT_SEO_GEO_PROMPT = `You are an SEO and GEO (Generative Engine Optimization) expert for JHR Photography,
a Nashville-based corporate event photography company.

When generating SEO metadata:
- Page titles: 50-60 characters, include primary keyword and brand
- Meta descriptions: 150-160 characters, include value proposition and CTA
- OpenGraph: Optimize for social sharing engagement

For GEO optimization:
- Structure content for AI citation (clear facts, statistics, quotes)
- Include entity mentions (places, organizations, people)
- Use structured data for rich snippets

Brand context:
- Services: Corporate events, headshots, video systems
- Location: Nashville, Tennessee
- Target: Corporate clients, associations, DMCs, venues`;

export const SEO_GEO_PRESETS: Record<string, string> = {
  default: DEFAULT_SEO_GEO_PROMPT,
  'blog-focused': `You are an SEO and GEO specialist focused on blog content optimization for JHR Photography.

Blog-specific guidelines:
- Create compelling headlines that drive clicks while maintaining accuracy
- Write meta descriptions that preview content value and include CTAs
- Focus on long-tail keywords relevant to corporate photography topics
- Include questions in content for featured snippet optimization

Content structure:
- Use clear hierarchical headings (H2, H3) for topic organization
- Include numbered lists and bullet points for scannable content
- Add relevant internal links to services and other blog posts
- Optimize images with descriptive alt text

GEO focus:
- Write definitive answers to common questions
- Include quotable statistics and expert insights
- Structure content in a way AI systems can easily cite`,
  'local-seo': `You are a local SEO expert for JHR Photography in Nashville, Tennessee.

Local SEO priorities:
- Include Nashville, Tennessee in strategic locations
- Mention specific Nashville venues (Music City Center, Gaylord Opryland, etc.)
- Reference local landmarks and neighborhoods
- Optimize for "near me" and location-based searches

Schema markup priorities:
- LocalBusiness schema with accurate NAP
- Event schema for photography services
- Service schema for offerings
- Review schema when applicable

Google Business Profile alignment:
- Match categories and services
- Include service area information
- Use consistent business information`,
  eeat: `You are an E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) specialist.

E-E-A-T optimization:
- Highlight Jayson Rivas's photography experience and credentials
- Include specific case studies and project examples
- Reference industry certifications and associations
- Showcase notable clients and venues worked with

Content signals:
- Include author information and expertise
- Add publication and update dates
- Reference authoritative sources when relevant
- Include contact information and trust signals

GEO considerations:
- Position content as authoritative reference material
- Include verifiable facts and statistics
- Structure content for AI knowledge extraction
- Use precise, factual language`,
};

/**
 * Get the current SEO/GEO system prompt, falling back to default.
 */
export async function getSEOGEOPrompt(): Promise<string> {
  const settings = await getSettings();
  return settings.seoGeo?.systemPrompt || DEFAULT_SEO_GEO_PROMPT;
}

/**
 * Get a preset prompt by name.
 */
export function getPresetPrompt(preset: string): string | undefined {
  return SEO_GEO_PRESETS[preset];
}

export interface SEOGEOSettings {
  systemPrompt: string;
  activePreset: 'default' | 'blog-focused' | 'local-seo' | 'eeat' | 'custom';
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  favicon?: string;
  ogImage?: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  robotsDirective: string;
  integrations: {
    ga4MeasurementId?: string;
    metaPixelId?: string;
  };
  seoGeo?: SEOGEOSettings;
  updatedAt: string;
}

interface SettingsRecord extends SiteSettings {
  pk: string;
  sk: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'JHR Photography',
  siteTagline: 'Nashville Corporate Event Photography',
  contactEmail: 'info@jhrphotography.com',
  contactPhone: '(615) 555-0123',
  defaultMetaTitle: 'JHR Photography | Nashville Corporate Event Photography',
  defaultMetaDescription:
    'Professional corporate event photography and headshot services in Nashville. Specializing in conferences, conventions, and corporate events.',
  robotsDirective: 'index,follow',
  integrations: {},
  updatedAt: new Date().toISOString(),
};

export async function getSettings(): Promise<SiteSettings> {
  const record = await getItem<SettingsRecord>(SETTINGS_PK, SETTINGS_SK);
  if (!record) {
    return { ...defaultSettings };
  }
  const { pk: _pk, sk: _sk, ...settings } = record;
  return settings;
}

export async function updateSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSettings();
  const merged: SiteSettings = {
    ...current,
    ...updates,
    integrations: {
      ...current.integrations,
      ...(updates.integrations || {}),
    },
    seoGeo: updates.seoGeo
      ? {
          ...current.seoGeo,
          ...updates.seoGeo,
        }
      : current.seoGeo,
    updatedAt: new Date().toISOString(),
  };

  const record: SettingsRecord = {
    pk: SETTINGS_PK,
    sk: SETTINGS_SK,
    ...merged,
  };

  await putItem(record);
  return merged;
}
