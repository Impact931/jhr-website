'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initOutboundLinkTracking, trackTimeOnPage } from '@/lib/gtag';

/**
 * Automatic GA4 event tracking for outbound links and time on page.
 * Mount once in the root layout.
 */
export function AutoTracking() {
  const pathname = usePathname();

  // Outbound link click tracking (runs once)
  useEffect(() => {
    initOutboundLinkTracking();
  }, []);

  // Time on page tracking (resets on route change)
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const seconds = Math.round((Date.now() - startTime) / 1000);
      if (seconds >= 5) {
        trackTimeOnPage({ page_path: pathname, time_seconds: seconds });
      }
    };
  }, [pathname]);

  return null;
}
