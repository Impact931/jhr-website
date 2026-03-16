import { getSettings } from '@/lib/settings';
import { TrackingScriptsClient } from './TrackingScriptsClient';

export default async function TrackingScripts() {
  let ga4Id: string | undefined;
  let metaPixelId: string | undefined;

  try {
    const settings = await getSettings();
    ga4Id = settings.integrations.ga4MeasurementId;
    metaPixelId = settings.integrations.metaPixelId;
  } catch {
    // Settings not available — fall through to env var fallback
  }

  // Env var fallback — ensures GA4 stays connected even if DynamoDB settings are reset
  if (!ga4Id) {
    ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID;
  }
  if (!metaPixelId) {
    metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  }

  if (!ga4Id && !metaPixelId) return null;

  return <TrackingScriptsClient ga4Id={ga4Id} metaPixelId={metaPixelId} />;
}
