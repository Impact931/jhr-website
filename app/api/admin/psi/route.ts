import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory cache: key = `${url}|${strategy}`, value = { data, timestamp }
const cache = new Map<string, { data: PSIResponse; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface PSIResponse {
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  lcp: { value: number; displayValue: string };
  fcp: { value: number; displayValue: string };
  tbt: { value: number; displayValue: string };
  cls: { value: number; displayValue: string };
  speedIndex: { value: number; displayValue: string };
  tti: { value: number; displayValue: string };
  cruxStatus: string;
  opportunities: Array<{ title: string; description: string; savings: string }>;
  strategy: string;
  url: string;
  fetchedAt: string;
}

function getCruxStatus(loadingExperience: Record<string, unknown> | undefined): string {
  if (!loadingExperience) return 'UNKNOWN';
  const overall = (loadingExperience as Record<string, unknown>).overall_category;
  if (overall === 'FAST') return 'FAST';
  if (overall === 'AVERAGE') return 'AVERAGE';
  if (overall === 'SLOW') return 'SLOW';
  return 'UNKNOWN';
}

function extractMetric(audits: Record<string, unknown>, key: string): { value: number; displayValue: string } {
  const audit = audits[key] as { numericValue?: number; displayValue?: string } | undefined;
  return {
    value: audit?.numericValue ?? 0,
    displayValue: audit?.displayValue ?? 'N/A',
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') || 'https://jhr-photography.com';
    const strategy = searchParams.get('strategy') || 'desktop';

    if (!['desktop', 'mobile'].includes(strategy)) {
      return NextResponse.json({ error: 'Invalid strategy. Use "desktop" or "mobile".' }, { status: 400 });
    }

    // Check cache
    const cacheKey = `${url}|${strategy}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY not configured' }, { status: 500 });
    }

    const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('key', apiKey);
    apiUrl.searchParams.set('strategy', strategy);
    apiUrl.searchParams.append('category', 'performance');
    apiUrl.searchParams.append('category', 'accessibility');
    apiUrl.searchParams.append('category', 'best-practices');
    apiUrl.searchParams.append('category', 'seo');

    const res = await fetch(apiUrl.toString(), {
      cache: 'no-store',
      signal: AbortSignal.timeout(55000), // 55s timeout for slow PSI API
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('PSI API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch PageSpeed data' }, { status: 502 });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const psiData: any = await res.json();
    const categories = psiData.lighthouseResult?.categories || {};
    const audits = psiData.lighthouseResult?.audits || {};

    // Extract opportunities sorted by savings
    const opportunityAudits = Object.values(audits) as any[];
    const opportunities = opportunityAudits
      .filter(
        (a: any) =>
          a.details?.type === 'opportunity' &&
          a.details?.overallSavingsMs > 0
      )
      .sort((a: any, b: any) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0))
      .map((a: any) => ({
        title: a.title || '',
        description: a.description || '',
        savings: a.details?.overallSavingsMs
          ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s`
          : 'N/A',
      }));
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const data: PSIResponse = {
      performanceScore: Math.round((categories.performance?.score ?? 0) * 100),
      accessibilityScore: Math.round((categories.accessibility?.score ?? 0) * 100),
      seoScore: Math.round((categories.seo?.score ?? 0) * 100),
      bestPracticesScore: Math.round((categories['best-practices']?.score ?? 0) * 100),
      lcp: extractMetric(audits, 'largest-contentful-paint'),
      fcp: extractMetric(audits, 'first-contentful-paint'),
      tbt: extractMetric(audits, 'total-blocking-time'),
      cls: extractMetric(audits, 'cumulative-layout-shift'),
      speedIndex: extractMetric(audits, 'speed-index'),
      tti: extractMetric(audits, 'interactive'),
      cruxStatus: getCruxStatus(psiData.loadingExperience),
      opportunities,
      strategy,
      url,
      fetchedAt: new Date().toISOString(),
    };

    // Update cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error) {
    console.error('PSI route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
