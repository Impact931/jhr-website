/**
 * Google Analytics 4 event tracking helpers.
 *
 * The gtag function is injected by TrackingScriptsClient when a GA4 measurement ID
 * is configured. These helpers safely call gtag only when it's available.
 */

// Extend Window to include gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a GA4 custom event. No-op when gtag is not loaded.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track contact form submission.
 */
export function trackContactFormSubmit(params: {
  form_page: string;
  service_interest?: string;
}) {
  trackEvent('contact_form_submit', params);
}

/**
 * Track Schedule CTA button click.
 */
export function trackScheduleCallClick(source?: string) {
  trackEvent('schedule_call_click', { source: source || 'unknown' });
}

/**
 * Track phone number link click.
 */
export function trackPhoneClick(source?: string) {
  trackEvent('phone_click', { source: source || 'unknown' });
}
