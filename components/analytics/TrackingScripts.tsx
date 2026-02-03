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
    // Settings not available — skip tracking scripts
    return null;
  }

  if (!ga4Id && !metaPixelId) return null;

  return <TrackingScriptsClient ga4Id={ga4Id} metaPixelId={metaPixelId} />;
}
