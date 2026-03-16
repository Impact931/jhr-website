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

/**
 * Track outbound (external) link click.
 */
export function trackOutboundLink(url: string, anchorText?: string) {
  trackEvent('outbound_link_click', {
    link_url: url,
    link_text: anchorText || '',
    link_domain: (() => { try { return new URL(url).hostname; } catch { return url; } })(),
  });
}

/**
 * Track CTA button click (any call-to-action, not just schedule).
 */
export function trackCTAClick(params: {
  cta_text: string;
  cta_url: string;
  cta_location: string;
}) {
  trackEvent('cta_click', params);
}

/**
 * Track time on page. Call on beforeunload or route change.
 */
export function trackTimeOnPage(params: {
  page_path: string;
  time_seconds: number;
}) {
  trackEvent('time_on_page', {
    page_path: params.page_path,
    engagement_time_sec: params.time_seconds,
  });
}

/**
 * Auto-track outbound link clicks on the page.
 * Call once from a useEffect in the root layout client component.
 */
export function initOutboundLinkTracking() {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement).closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('http')) return;

    try {
      const linkHost = new URL(href).hostname;
      if (linkHost === window.location.hostname) return;
      trackOutboundLink(href, anchor.textContent?.trim());
    } catch {
      // invalid URL, skip
    }
  });
}

/**
 * Auto-track time on page. Returns a cleanup function.
 * Call from useEffect in root layout.
 */
export function initTimeOnPageTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const startTime = Date.now();
  const pagePath = window.location.pathname;

  const handleUnload = () => {
    const seconds = Math.round((Date.now() - startTime) / 1000);
    if (seconds >= 5) {
      trackTimeOnPage({ page_path: pagePath, time_seconds: seconds });
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  return () => window.removeEventListener('beforeunload', handleUnload);
}
