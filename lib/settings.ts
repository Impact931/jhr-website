import { getItem, putItem } from '@/lib/dynamodb';

const SETTINGS_PK = 'SETTINGS#global';
const SETTINGS_SK = 'config';

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
    notionToken?: string;
    notionLeadDbId?: string;
    ga4MeasurementId?: string;
    metaPixelId?: string;
  };
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
