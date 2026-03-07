'use client';

import { useEffect, useState, useCallback } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Minus,
  MousePointerClick,
  Eye,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  RefreshCw,
  CheckCircle,
  Globe,
  Unplug,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface KeywordData {
  keyword: string;
  position: number | null;
  change: number | null;
  clicks: number;
  impressions: number;
  ctr: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Totals {
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
}

interface DateRange {
  start: string;
  end: string;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function AdminSEOPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-jhr-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminSEOPageContent />
    </Suspense>
  );
}

function AdminSEOPageContent() {
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Check for OAuth callback messages
  useEffect(() => {
    const oauthError = searchParams.get('error');
    const isConnected = searchParams.get('connected');
    if (oauthError) {
      setError(`OAuth error: ${oauthError}`);
    }
    if (isConnected === 'true') {
      // Will trigger data fetch
    }
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // First check connection status
      const statusRes = await fetch('/api/admin/gsc?type=status');
      const statusData = await statusRes.json();

      if (!statusData.connected) {
        setConnected(false);
        setLoading(false);
        return;
      }

      setConnected(true);

      // Fetch search analytics and keywords in parallel
      const [analyticsRes, keywordsRes] = await Promise.all([
        fetch('/api/admin/gsc?type=searchAnalytics'),
        fetch('/api/admin/gsc?type=keywords'),
      ]);

      const analyticsData = await analyticsRes.json();
      const keywordsData = await keywordsRes.json();

      if (analyticsData.error) {
        setError(analyticsData.error);
      } else {
        setTotals(analyticsData.totals);
        setPages(analyticsData.pages || []);
        setDateRange(analyticsData.dateRange);
      }

      if (keywordsData.error) {
        setError(keywordsData.error);
      } else {
        setKeywords(keywordsData.keywords || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SEO data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <span className="ml-3 text-body-md text-jhr-white-dim">Loading SEO data...</span>
      </div>
    );
  }

  // ── Not Connected State ────────────────────────────────────────────────

  if (connected === false) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">SEO Intelligence</h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Monitor search performance, track keyword rankings, and discover optimization opportunities.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-body-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
            <Unplug className="w-10 h-10 text-jhr-gold" />
          </div>
          <h2 className="text-display-xs font-display font-bold text-jhr-white mb-3">
            Connect Google Search Console
          </h2>
          <p className="text-body-md text-jhr-white-dim mb-8 max-w-lg mx-auto">
            Link your Google Search Console account to track keyword rankings, monitor search
            impressions, and discover SEO optimization opportunities for your site.
          </p>

          <a
            href="/api/admin/gsc/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-jhr-gold text-jhr-black font-semibold hover:bg-jhr-gold/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            Connect Google Search Console
          </a>

          <div className="mt-10 text-left bg-jhr-black rounded-lg border border-jhr-black-lighter p-6">
            <h3 className="text-body-md font-semibold text-jhr-white mb-4">Setup Requirements</h3>
            <ul className="space-y-3 text-body-sm text-jhr-white-dim">
              <li className="flex items-start gap-2">
                <span className="text-jhr-gold mt-0.5">1.</span>
                <span>
                  Your site must be verified in{' '}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-jhr-gold hover:underline"
                  >
                    Google Search Console
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jhr-gold mt-0.5">2.</span>
                <span>
                  OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) must be configured in
                  your environment variables
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jhr-gold mt-0.5">3.</span>
                <span>
                  The Google Cloud project must have the Search Console API enabled
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jhr-gold mt-0.5">4.</span>
                <span>
                  The authorized redirect URI must include:{' '}
                  <code className="text-xs bg-jhr-black-lighter px-1.5 py-0.5 rounded font-mono">
                    {'{your-domain}'}/api/admin/gsc/callback
                  </code>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Connected State ────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">SEO Intelligence</h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            {dateRange
              ? `Search performance for ${dateRange.start} to ${dateRange.end}`
              : 'Monitor search performance and keyword rankings.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Connected
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      {totals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Total Clicks (7d)"
            value={totals.clicks.toLocaleString()}
            icon={<MousePointerClick className="w-5 h-5" />}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <KPICard
            label="Total Impressions (7d)"
            value={totals.impressions.toLocaleString()}
            icon={<Eye className="w-5 h-5" />}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
          />
          <KPICard
            label="Avg Position"
            value={totals.avgPosition.toFixed(1)}
            icon={<Target className="w-5 h-5" />}
            color="text-jhr-gold"
            bgColor="bg-jhr-gold/10"
          />
          <KPICard
            label="Avg CTR"
            value={`${totals.avgCtr.toFixed(1)}%`}
            icon={<BarChart3 className="w-5 h-5" />}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
        </div>
      )}

      {/* Panel 1: Keyword Rank Tracker */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-jhr-gold/10">
              <Search className="w-5 h-5 text-jhr-gold" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">Keyword Rank Tracker</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Tracking {keywords.length} target keywords
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-jhr-black-lighter">
                <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Keyword
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Position
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  7d Change
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Impressions
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  CTR
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jhr-black-lighter">
              {[...keywords]
                .sort((a, b) => {
                  if (a.position === null && b.position === null) return 0;
                  if (a.position === null) return 1;
                  if (b.position === null) return -1;
                  return a.position - b.position;
                })
                .map((kw) => (
                  <tr key={kw.keyword} className="hover:bg-jhr-black-lighter/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-body-sm text-jhr-white">{kw.keyword}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <PositionBadge position={kw.position} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ChangeBadge change={kw.change} />
                    </td>
                    <td className="px-4 py-4 text-right text-body-sm text-jhr-white-dim">
                      {kw.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-body-sm text-jhr-white-dim">
                      {kw.ctr.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-body-sm text-jhr-white font-medium">
                      {kw.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 2: Top Pages by Performance */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Link2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">Top Pages by Performance</h2>
              <p className="text-body-sm text-jhr-white-dim">
                {pages.length} pages with search visibility
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-jhr-black-lighter">
                <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Page URL
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Impressions
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Clicks
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  CTR
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Avg Position
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                  Insights
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jhr-black-lighter">
              {pages
                .sort((a, b) => b.impressions - a.impressions)
                .map((page) => {
                  const pageUrl = page.page.replace(/^https?:\/\/[^/]+/, '') || '/';
                  const hasTitleOpportunity = page.ctr < 2 && page.impressions > 100;
                  const isNearPage1 =
                    page.position >= 11 && page.position <= 20 && page.impressions > 50;

                  return (
                    <tr
                      key={page.page}
                      className="hover:bg-jhr-black-lighter/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm text-jhr-white truncate max-w-[300px]">
                            {pageUrl}
                          </span>
                          <a
                            href={page.page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-jhr-white-dim hover:text-jhr-white flex-shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-body-sm text-jhr-white-dim">
                        {page.impressions.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-body-sm text-jhr-white font-medium">
                        {page.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-body-sm text-jhr-white-dim">
                        {page.ctr.toFixed(1)}%
                      </td>
                      <td className="px-4 py-4 text-right text-body-sm text-jhr-white-dim">
                        {page.position.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {hasTitleOpportunity && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Title Optimization Opportunity
                            </span>
                          )}
                          {isNearPage1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Near Page 1
                            </span>
                          )}
                          {!hasTitleOpportunity && !isNearPage1 && (
                            <span className="text-xs text-jhr-white-dim">--</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 3: Index Coverage Summary */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-body-lg font-semibold text-jhr-white">Index Coverage</h2>
            <p className="text-body-sm text-jhr-white-dim">
              Overview of pages indexed by Google
            </p>
          </div>
        </div>

        <div className="bg-jhr-black rounded-lg border border-jhr-black-lighter p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm text-jhr-white-dim mb-1">Pages with Search Visibility</p>
              <p className="text-display-xs font-display font-bold text-jhr-white">
                {pages.length} pages
              </p>
              <p className="text-body-sm text-jhr-white-dim mt-1">
                Based on pages appearing in search results during the last 7 days.
                For full index coverage data, visit Google Search Console directly.
              </p>
            </div>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Search Console
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-body-sm text-jhr-white-dim">{label}</span>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
      <p className="text-display-xs font-display font-bold text-jhr-white">{value}</p>
    </div>
  );
}

function PositionBadge({ position }: { position: number | null }) {
  if (position === null) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
        Not ranking
      </span>
    );
  }

  let colorClasses: string;
  if (position <= 3) {
    colorClasses = 'bg-jhr-gold/10 text-jhr-gold border-jhr-gold/20';
  } else if (position <= 10) {
    colorClasses = 'bg-green-500/10 text-green-400 border-green-500/20';
  } else if (position <= 20) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else {
    colorClasses = 'bg-red-500/10 text-red-400 border-red-500/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${colorClasses}`}
    >
      #{position.toFixed(1)}
    </span>
  );
}

function ChangeBadge({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-xs text-gray-500">--</span>;
  }

  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
        <Minus className="w-3 h-3" />
        0
      </span>
    );
  }

  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-green-400">
        <ArrowUpRight className="w-3.5 h-3.5" />
        +{change.toFixed(1)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-red-400">
      <ArrowDownRight className="w-3.5 h-3.5" />
      {change.toFixed(1)}
    </span>
  );
}
