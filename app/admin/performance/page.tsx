'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Gauge,
  RefreshCw,
  Monitor,
  Smartphone,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Globe,
  Loader2,
  Instagram,
  Youtube,
  Facebook,
  Eye,
  Users,
  Video,
  Lightbulb,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PSIMetric {
  value: number;
  displayValue: string;
}

interface PSIData {
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  lcp: PSIMetric;
  fcp: PSIMetric;
  tbt: PSIMetric;
  cls: PSIMetric;
  speedIndex: PSIMetric;
  tti: PSIMetric;
  cruxStatus: string;
  opportunities: Array<{ title: string; description: string; savings: string }>;
  strategy: string;
  url: string;
  fetchedAt: string;
}

interface PSISnapshot {
  sk: string;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  lcp: number;
  fcp: number;
  tbt: number;
  cls: number;
  speedIndex: number;
  tti: number;
}

interface MetaInsights {
  reach: number;
  impressions: number;
  profileViews: number;
  websiteClicks: number;
}

interface MetaData {
  connected: boolean;
  account?: {
    id: string;
    name: string;
    username?: string;
    followersCount: number;
    mediaCount: number;
    profilePictureUrl?: string;
  };
  insights?: MetaInsights;
}

interface FacebookDailyMetric {
  date: string;
  value: number;
}

interface FacebookData {
  connected: boolean;
  page?: {
    name: string;
    followersCount: number;
    fanCount: number;
  };
  metrics?: {
    pageViews: FacebookDailyMetric[];
    reactions: FacebookDailyMetric[];
  };
}

interface GA4DailyMetric {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface GA4TopPage {
  path: string;
  title: string;
  pageViews: number;
  users: number;
}

interface GA4TrafficSource {
  channel: string;
  sessions: number;
  users: number;
}

interface GA4FormVisit {
  path: string;
  referrer: string;
  pageViews: number;
}

interface GA4Data {
  connected: boolean;
  dateRange?: { startDate: string; endDate: string };
  overview?: {
    daily: GA4DailyMetric[];
    totals: { activeUsers: number; sessions: number; pageViews: number; bounceRate: number; avgSessionDuration: number };
  };
  topPages?: GA4TopPage[];
  trafficSources?: GA4TrafficSource[];
  formPageVisits?: GA4FormVisit[];
}

interface YouTubeData {
  connected: boolean;
  channel?: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    customUrl?: string;
  };
  statistics?: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBorderColor(score: number): string {
  if (score >= 90) return 'border-green-400';
  if (score >= 70) return 'border-amber-400';
  return 'border-red-400';
}

function scoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-400/10';
  if (score >= 70) return 'bg-amber-400/10';
  return 'bg-red-400/10';
}

function scoreRingStyle(score: number): React.CSSProperties {
  const pct = score / 100;
  let color: string;
  if (score >= 90) color = '#4ade80';
  else if (score >= 70) color = '#fbbf24';
  else color = '#f87171';

  return {
    background: `conic-gradient(${color} ${pct * 360}deg, rgba(255,255,255,0.05) ${pct * 360}deg)`,
  };
}

type VitalStatus = 'GOOD' | 'NEEDS IMPROVEMENT' | 'POOR';

interface VitalThresholds {
  good: number;
  poor: number;
  unit: string;
  target: string;
}

const VITAL_THRESHOLDS: Record<string, VitalThresholds> = {
  lcp: { good: 2500, poor: 4000, unit: 'ms', target: '< 2.5s' },
  fcp: { good: 1800, poor: 3000, unit: 'ms', target: '< 1.8s' },
  tbt: { good: 200, poor: 600, unit: 'ms', target: '< 200ms' },
  cls: { good: 0.1, poor: 0.25, unit: '', target: '< 0.10' },
  speedIndex: { good: 3400, poor: 5800, unit: 'ms', target: '< 3.4s' },
  tti: { good: 3800, poor: 7300, unit: 'ms', target: '< 3.8s' },
};

function getVitalStatus(metric: string, value: number): VitalStatus {
  const t = VITAL_THRESHOLDS[metric];
  if (!t) return 'GOOD';
  if (value <= t.good) return 'GOOD';
  if (value <= t.poor) return 'NEEDS IMPROVEMENT';
  return 'POOR';
}

function statusBadgeClasses(status: VitalStatus): string {
  switch (status) {
    case 'GOOD':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'NEEDS IMPROVEMENT':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'POOR':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
  }
}

function StatusIcon({ status }: { status: VitalStatus }) {
  switch (status) {
    case 'GOOD':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'NEEDS IMPROVEMENT':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'POOR':
      return <XCircle className="w-4 h-4 text-red-400" />;
  }
}

function sparklineColor(status: VitalStatus): string {
  switch (status) {
    case 'GOOD':
      return '#4ade80';
    case 'NEEDS IMPROVEMENT':
      return '#fbbf24';
    case 'POOR':
      return '#f87171';
  }
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ─── Components ─────────────────────────────────────────────────────────────────

function ScoreGauge({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6 flex flex-col items-center gap-3">
      <div className="text-jhr-white-dim">{icon}</div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={scoreRingStyle(score)}
      >
        <div className="w-20 h-20 rounded-full bg-jhr-black-light flex items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-jhr-white-dim">{label}</span>
    </div>
  );
}

function SparklineChart({
  data,
  dataKey,
  color,
}: {
  data: Array<Record<string, number | string>>;
  dataKey: string;
  color: string;
}) {
  if (data.length < 2) {
    return <span className="text-xs text-jhr-white-dim">--</span>;
  }
  return (
    <div className="w-[100px] h-[32px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 6,
              fontSize: 11,
              color: '#fff',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  subtext,
  accentColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  accentColor?: string;
}) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-sm text-jhr-white-dim">{label}</p>
          <p className={`text-heading-md font-display font-bold mt-1 ${accentColor || 'text-jhr-white'}`}>
            {value}
          </p>
          {subtext && (
            <p className="text-body-sm text-jhr-white-dim mt-1">{subtext}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-jhr-gold/10 text-jhr-gold">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TrendChart({
  title,
  data,
  dataKey,
  color,
  yLabel,
  icon,
  emptyMessage,
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color: string;
  yLabel?: string;
  icon: React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-jhr-white-dim">{icon}</div>
        <h3 className="text-body-md font-semibold text-jhr-white">{title}</h3>
      </div>
      {data.length < 2 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-body-sm text-jhr-white-dim">{emptyMessage || 'Not enough data to display a chart.'}</p>
        </div>
      ) : (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#999', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#999', fontSize: 11 } : undefined}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminPerformancePage() {
  // PSI state
  const [strategy, setStrategy] = useState<'desktop' | 'mobile'>('desktop');
  const [data, setData] = useState<PSIData | null>(null);
  const [history, setHistory] = useState<PSISnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Social state
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [fbData, setFbData] = useState<FacebookData | null>(null);
  const [ytData, setYtData] = useState<YouTubeData | null>(null);
  const [socialLoading, setSocialLoading] = useState(true);

  // GA4 state
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [ga4Loading, setGa4Loading] = useState(true);

  // Time range for Facebook
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  // ─── PSI Functions ──────────────────────────────────────────────────────────

  const fetchHistory = useCallback(async (strat: string) => {
    try {
      const res = await fetch(`/api/admin/psi/history?strategy=${strat}`);
      if (res.ok) {
        const json = await res.json();
        setHistory(json.snapshots || []);
      }
    } catch {
      // Non-critical -- history might be empty
    }
  }, []);

  const runAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/psi?url=https://jhr-photography.com&strategy=${strategy}`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to run audit');
      }
      const psiData: PSIData = await res.json();
      setData(psiData);

      // Save snapshot to history
      await fetch('/api/admin/psi/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy,
          performanceScore: psiData.performanceScore,
          accessibilityScore: psiData.accessibilityScore,
          seoScore: psiData.seoScore,
          bestPracticesScore: psiData.bestPracticesScore,
          lcp: psiData.lcp,
          fcp: psiData.fcp,
          tbt: psiData.tbt,
          cls: psiData.cls,
          speedIndex: psiData.speedIndex,
          tti: psiData.tti,
          url: psiData.url,
        }),
      });

      // Refresh history
      await fetchHistory(strategy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setLoading(false);
    }
  }, [strategy, fetchHistory]);

  const switchStrategy = useCallback(
    (strat: 'desktop' | 'mobile') => {
      setStrategy(strat);
      setData(null);
      setHistory([]);
      fetchHistory(strat);
    },
    [fetchHistory]
  );

  // ─── Social Data Fetching ──────────────────────────────────────────────────

  const fetchSocialData = useCallback(async (days: number) => {
    setSocialLoading(true);
    try {
      const [metaRes, fbRes, ytRes] = await Promise.all([
        fetch('/api/admin/social/meta').catch(() => null),
        fetch(`/api/admin/social/facebook?days=${days}`).catch(() => null),
        fetch('/api/admin/social/youtube').catch(() => null),
      ]);

      if (metaRes && metaRes.ok) {
        const d = await metaRes.json();
        setMetaData(d);
      } else {
        setMetaData({ connected: false });
      }

      if (fbRes && fbRes.ok) {
        const d = await fbRes.json();
        setFbData(d);
      } else {
        setFbData({ connected: false });
      }

      if (ytRes && ytRes.ok) {
        const d = await ytRes.json();
        setYtData(d);
      } else {
        setYtData({ connected: false });
      }
    } catch {
      setMetaData({ connected: false });
      setFbData({ connected: false });
      setYtData({ connected: false });
    } finally {
      setSocialLoading(false);
    }
  }, []);

  const fetchGA4Data = useCallback(async (days: number) => {
    setGa4Loading(true);
    try {
      const res = await fetch(`/api/admin/ga4?days=${days}`);
      if (res.ok) {
        setGa4Data(await res.json());
      } else {
        setGa4Data({ connected: false });
      }
    } catch {
      setGa4Data({ connected: false });
    } finally {
      setGa4Loading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocialData(timeRange);
    fetchGA4Data(timeRange);
  }, [timeRange, fetchSocialData, fetchGA4Data]);

  useEffect(() => {
    fetchHistory(strategy);
  }, [strategy, fetchHistory]);

  // ─── Derived Data ─────────────────────────────────────────────────────────

  const vitals = data
    ? [
        { key: 'lcp', label: 'LCP', metric: data.lcp },
        { key: 'fcp', label: 'FCP', metric: data.fcp },
        { key: 'tbt', label: 'TBT', metric: data.tbt },
        { key: 'cls', label: 'CLS', metric: data.cls },
        { key: 'speedIndex', label: 'Speed Index', metric: data.speedIndex },
        { key: 'tti', label: 'TTI', metric: data.tti },
      ]
    : [];

  // PSI history chart data
  const psiHistoryChartData = history.map((s) => ({
    date: s.sk ? formatDateLabel(s.sk) : '',
    score: s.performanceScore,
  }));

  // Facebook page views chart data
  const fbChartData = (fbData?.metrics?.pageViews || []).map((d) => ({
    date: formatDateLabel(d.date),
    views: d.value,
  }));

  // Total FB page views
  const totalFbPageViews = (fbData?.metrics?.pageViews || []).reduce(
    (sum, d) => sum + d.value,
    0
  );

  // IG followers
  const igFollowers = metaData?.connected && metaData.account
    ? metaData.account.followersCount
    : 0;

  // IG reach
  const igReach = metaData?.connected && metaData.insights
    ? metaData.insights.reach
    : 0;

  // YT subscribers & stats
  const ytSubscribers = ytData?.connected && ytData.statistics
    ? ytData.statistics.subscriberCount
    : 0;
  const ytTotalViews = ytData?.connected && ytData.statistics
    ? ytData.statistics.viewCount
    : 0;
  const ytVideoCount = ytData?.connected && ytData.statistics
    ? ytData.statistics.videoCount
    : 0;

  // Last PSI score
  const lastPsiScore = data ? data.performanceScore : (history.length > 0 ? history[history.length - 1].performanceScore : null);

  // ─── Recommendations ──────────────────────────────────────────────────────

  const recommendations: Array<{ text: string; priority: 'high' | 'medium' | 'low' }> = [];

  if (lastPsiScore !== null && lastPsiScore < 70) {
    recommendations.push({
      text: 'Improve page load speed -- check Lighthouse opportunities tab above for specific fixes.',
      priority: 'high',
    });
  }

  if (metaData?.connected && igReach === 0) {
    recommendations.push({
      text: 'Post consistently to increase Instagram reach. Your 7-day reach is currently zero.',
      priority: 'high',
    });
  }

  if (fbData?.connected && totalFbPageViews < 50) {
    recommendations.push({
      text: 'Share blog posts to Facebook to drive page views. Current period views are low.',
      priority: 'medium',
    });
  }

  if (ytData?.connected && ytVideoCount < 10) {
    recommendations.push({
      text: 'Upload more video content to grow YouTube presence. You currently have fewer than 10 videos.',
      priority: 'medium',
    });
  }

  if (ga4Data?.connected && ga4Data.overview) {
    const br = ga4Data.overview.totals.bounceRate;
    if (br > 0.6) {
      recommendations.push({
        text: `Bounce rate is ${(br * 100).toFixed(0)}% — improve page content and load speed to keep visitors engaged.`,
        priority: 'high',
      });
    }
    const avgDur = ga4Data.overview.totals.avgSessionDuration;
    if (avgDur < 30) {
      recommendations.push({
        text: `Average session duration is ${Math.round(avgDur)}s — add more engaging content (videos, galleries, case studies) to increase time on site.`,
        priority: 'medium',
      });
    }
    if (ga4Data.formPageVisits && ga4Data.formPageVisits.length === 0) {
      recommendations.push({
        text: 'No form page visits detected — ensure contact/booking pages are easy to find with clear CTAs on service pages.',
        priority: 'medium',
      });
    }
  }

  // Always-on recommendations
  recommendations.push({
    text: 'Cross-promote blog posts across all social channels for maximum reach.',
    priority: 'low',
  });
  recommendations.push({
    text: 'Use ContentOps to generate SEO-optimized articles that drive organic traffic.',
    priority: 'low',
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Performance &amp; Trends
          </h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Site performance, Core Web Vitals, and social media analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-jhr-black rounded-lg border border-jhr-black-lighter p-1">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setTimeRange(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === d
                    ? 'bg-jhr-black-lighter text-jhr-white'
                    : 'text-jhr-white-dim hover:text-jhr-white'
                }`}
              >
                {d === 7 && <Calendar className="w-3.5 h-3.5" />}
                {d}d
              </button>
            ))}
          </div>

          {/* Strategy Toggle */}
          <div className="flex bg-jhr-black rounded-lg border border-jhr-black-lighter p-1">
            <button
              onClick={() => switchStrategy('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                strategy === 'desktop'
                  ? 'bg-jhr-black-lighter text-jhr-white'
                  : 'text-jhr-white-dim hover:text-jhr-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
            <button
              onClick={() => switchStrategy('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                strategy === 'mobile'
                  ? 'bg-jhr-black-lighter text-jhr-white'
                  : 'text-jhr-white-dim hover:text-jhr-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          {/* Run Audit */}
          <button
            onClick={runAudit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            {loading ? 'Running...' : 'Run Audit'}
          </button>
        </div>
      </div>

      {/* ─── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="PSI Score"
          value={lastPsiScore !== null ? lastPsiScore : '--'}
          icon={<Gauge className="w-6 h-6" />}
          subtext={lastPsiScore !== null ? (lastPsiScore >= 90 ? 'Good' : lastPsiScore >= 70 ? 'Needs work' : 'Poor') : 'Run an audit'}
          accentColor={lastPsiScore !== null ? scoreColor(lastPsiScore) : 'text-jhr-white-dim'}
        />
        <SummaryCard
          label="IG Followers"
          value={socialLoading ? '...' : (metaData?.connected ? formatNumber(igFollowers) : '--')}
          icon={<Instagram className="w-6 h-6" />}
          subtext={metaData?.connected && metaData.insights ? `${formatNumber(igReach)} reach (7d)` : (socialLoading ? 'Loading...' : 'Not connected')}
        />
        <SummaryCard
          label="FB Page Views"
          value={socialLoading ? '...' : (fbData?.connected ? formatNumber(totalFbPageViews) : '--')}
          icon={<Facebook className="w-6 h-6" />}
          subtext={fbData?.connected ? `Last ${timeRange} days` : (socialLoading ? 'Loading...' : 'Not connected')}
        />
        <SummaryCard
          label="YT Subscribers"
          value={socialLoading ? '...' : (ytData?.connected ? formatNumber(ytSubscribers) : '--')}
          icon={<Youtube className="w-6 h-6" />}
          subtext={ytData?.connected && ytData.statistics ? `${formatNumber(ytTotalViews)} total views` : (socialLoading ? 'Loading...' : 'Not connected')}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ─── PSI Section ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-jhr-gold" />
          <h2 className="text-heading-md font-display font-bold text-jhr-white">Site Performance (PSI)</h2>
        </div>

        {/* Empty state */}
        {!data && !loading && !error && (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
            <Gauge className="w-12 h-12 text-jhr-white-dim mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-jhr-white mb-2">No Audit Data</h2>
            <p className="text-jhr-white-dim mb-6">
              Click &quot;Run Audit&quot; to analyze your site with Google PageSpeed Insights.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
            <Loader2 className="w-12 h-12 text-jhr-gold animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-jhr-white mb-2">Running Audit...</h2>
            <p className="text-jhr-white-dim">
              This typically takes 15-30 seconds. Analyzing {strategy} performance.
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Score Gauges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreGauge
                label="Performance"
                score={data.performanceScore}
                icon={<Gauge className="w-5 h-5" />}
              />
              <ScoreGauge
                label="Accessibility"
                score={data.accessibilityScore}
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <ScoreGauge
                label="SEO"
                score={data.seoScore}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <ScoreGauge
                label="Best Practices"
                score={data.bestPracticesScore}
                icon={<Globe className="w-5 h-5" />}
              />
            </div>

            {/* Last fetched */}
            <div className="flex items-center gap-2 text-xs text-jhr-white-dim">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Last fetched: {new Date(data.fetchedAt).toLocaleString()} | Strategy:{' '}
                {data.strategy} | URL: {data.url}
              </span>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
              <div className="p-6 border-b border-jhr-black-lighter">
                <h2 className="text-body-lg font-semibold text-jhr-white">Core Web Vitals</h2>
                <p className="text-body-sm text-jhr-white-dim mt-1">
                  Key metrics that impact user experience and search ranking.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-jhr-black-lighter">
                      <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                        Current
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                        Target
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-jhr-black-lighter">
                    {vitals.map(({ key, label, metric }) => {
                      const status = getVitalStatus(key, metric.value);
                      const threshold = VITAL_THRESHOLDS[key];
                      const sparkData = history.map((s) => ({
                        date: s.sk,
                        value: (s as unknown as Record<string, number>)[key] ?? 0,
                      }));

                      return (
                        <tr key={key} className="hover:bg-jhr-black/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon status={status} />
                              <span className="text-sm font-medium text-jhr-white">{label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-mono ${scoreColor(status === 'GOOD' ? 90 : status === 'NEEDS IMPROVEMENT' ? 75 : 40)}`}>
                              {metric.displayValue}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-jhr-white-dim font-mono">
                              {threshold?.target || '--'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadgeClasses(status)}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <SparklineChart
                              data={sparkData}
                              dataKey="value"
                              color={sparklineColor(status)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CrUX Status */}
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    data.cruxStatus === 'FAST'
                      ? 'bg-green-500/10'
                      : data.cruxStatus === 'AVERAGE'
                        ? 'bg-amber-500/10'
                        : data.cruxStatus === 'SLOW'
                          ? 'bg-red-500/10'
                          : 'bg-gray-500/10'
                  }`}
                >
                  <Globe
                    className={`w-6 h-6 ${
                      data.cruxStatus === 'FAST'
                        ? 'text-green-400'
                        : data.cruxStatus === 'AVERAGE'
                          ? 'text-amber-400'
                          : data.cruxStatus === 'SLOW'
                            ? 'text-red-400'
                            : 'text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-body-lg font-semibold text-jhr-white">
                    Chrome UX Report (CrUX)
                  </h3>
                  {data.cruxStatus === 'UNKNOWN' ? (
                    <p className="text-body-sm text-jhr-white-dim">
                      No CrUX Data -- site needs approximately 500 monthly users for field data
                      collection.
                    </p>
                  ) : (
                    <p className="text-body-sm text-jhr-white-dim">
                      Field data status:{' '}
                      <span
                        className={`font-semibold ${
                          data.cruxStatus === 'FAST'
                            ? 'text-green-400'
                            : data.cruxStatus === 'AVERAGE'
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {data.cruxStatus}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Opportunities */}
            {data.opportunities.length > 0 && (
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
                <div className="p-6 border-b border-jhr-black-lighter">
                  <h2 className="text-body-lg font-semibold text-jhr-white">Opportunities</h2>
                  <p className="text-body-sm text-jhr-white-dim mt-1">
                    Lighthouse suggestions to improve performance, sorted by estimated savings.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-jhr-black-lighter">
                        <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                          Issue
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider hidden sm:table-cell">
                          Description
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                          Est. Savings
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-jhr-black-lighter">
                      {data.opportunities.map((opp, idx) => (
                        <tr key={idx} className="hover:bg-jhr-black/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-jhr-white">
                              {opp.title}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="text-sm text-jhr-white-dim line-clamp-2">
                              {opp.description}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${scoreBgColor(40)} ${scoreBorderColor(40)} text-amber-400`}
                            >
                              {opp.savings}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PSI History Chart */}
        {psiHistoryChartData.length > 0 && (
          <div className="mt-6">
            <TrendChart
              title="Performance Score History"
              data={psiHistoryChartData}
              dataKey="score"
              color="#fbbf24"
              yLabel="Score"
              icon={<TrendingUp className="w-5 h-5 text-jhr-gold" />}
              emptyMessage="Run at least two audits to see performance trends."
            />
          </div>
        )}
      </div>

      {/* ─── Social Media Trends ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-jhr-gold" />
          <h2 className="text-heading-md font-display font-bold text-jhr-white">Social Media Trends</h2>
        </div>

        {socialLoading ? (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
            <Loader2 className="w-10 h-10 text-jhr-gold animate-spin mx-auto mb-4" />
            <p className="text-body-md text-jhr-white-dim">Loading social media data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instagram Insights */}
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
              <div className="flex items-center gap-2 mb-4">
                <Instagram className="w-5 h-5 text-pink-400" />
                <h3 className="text-body-md font-semibold text-jhr-white">Instagram</h3>
                {metaData?.connected && metaData.account?.username && (
                  <span className="text-body-sm text-jhr-white-dim">@{metaData.account.username}</span>
                )}
              </div>
              {metaData?.connected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Followers</p>
                      <p className="text-heading-md font-bold text-jhr-white">{formatNumber(igFollowers)}</p>
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Reach (7d)</p>
                      <p className="text-heading-md font-bold text-jhr-white">{formatNumber(igReach)}</p>
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Profile Views</p>
                      <p className="text-heading-md font-bold text-jhr-white">
                        {formatNumber(metaData.insights?.profileViews || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Website Clicks</p>
                      <p className="text-heading-md font-bold text-jhr-white">
                        {formatNumber(metaData.insights?.websiteClicks || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[120px]">
                  <p className="text-body-sm text-jhr-white-dim">Instagram not connected. Set META_PAGE_ACCESS_TOKEN and IG_BUSINESS_USER_ID.</p>
                </div>
              )}
            </div>

            {/* Facebook Page Views Chart */}
            <TrendChart
              title={`Facebook Page Views (${timeRange}d)`}
              data={fbChartData}
              dataKey="views"
              color="#1877F2"
              yLabel="Views"
              icon={<Facebook className="w-5 h-5 text-blue-400" />}
              emptyMessage={fbData?.connected ? 'No page view data available for this period.' : 'Facebook not connected. Set META_PAGE_ACCESS_TOKEN.'}
            />

            {/* YouTube Stats */}
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-body-md font-semibold text-jhr-white">YouTube</h3>
                {ytData?.connected && ytData.channel?.title && (
                  <span className="text-body-sm text-jhr-white-dim">{ytData.channel.title}</span>
                )}
              </div>
              {ytData?.connected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Subscribers</p>
                      <p className="text-heading-md font-bold text-jhr-white">{formatNumber(ytSubscribers)}</p>
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Total Views</p>
                      <p className="text-heading-md font-bold text-jhr-white">{formatNumber(ytTotalViews)}</p>
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Videos</p>
                      <p className="text-heading-md font-bold text-jhr-white">{ytVideoCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm text-jhr-white-dim pt-2 border-t border-jhr-black-lighter">
                    <Video className="w-4 h-4" />
                    <span>YouTube API does not provide daily breakdown -- showing lifetime totals.</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[120px]">
                  <p className="text-body-sm text-jhr-white-dim">YouTube not connected. Set YOUTUBE_CHANNEL_ID and YOUTUBE_API_KEY.</p>
                </div>
              )}
            </div>

            {/* Facebook Reactions Chart */}
            {fbData?.connected && (fbData.metrics?.reactions || []).length > 0 && (
              <TrendChart
                title={`Facebook Reactions (${timeRange}d)`}
                data={(fbData.metrics?.reactions || []).map((d) => ({
                  date: formatDateLabel(d.date),
                  reactions: d.value,
                }))}
                dataKey="reactions"
                color="#E1306C"
                yLabel="Reactions"
                icon={<Eye className="w-5 h-5 text-pink-400" />}
                emptyMessage="No reaction data available."
              />
            )}
          </div>
        )}
      </div>

      {/* ─── Website Traffic (GA4) ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-heading-md font-display font-bold text-jhr-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-jhr-gold" />
          Website Traffic
        </h2>

        {ga4Loading ? (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 text-center">
            <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mx-auto mb-3" />
            <p className="text-body-sm text-jhr-white-dim">Loading analytics data...</p>
          </div>
        ) : ga4Data?.connected && ga4Data.overview ? (
          <>
            {/* GA4 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
                <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Users</p>
                <p className="text-2xl font-bold text-jhr-white mt-1">{ga4Data.overview.totals.activeUsers.toLocaleString()}</p>
              </div>
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
                <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Sessions</p>
                <p className="text-2xl font-bold text-jhr-white mt-1">{ga4Data.overview.totals.sessions.toLocaleString()}</p>
              </div>
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
                <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Page Views</p>
                <p className="text-2xl font-bold text-jhr-white mt-1">{ga4Data.overview.totals.pageViews.toLocaleString()}</p>
              </div>
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
                <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Bounce Rate</p>
                <p className="text-2xl font-bold text-jhr-white mt-1">{(ga4Data.overview.totals.bounceRate * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
                <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Avg Duration</p>
                <p className="text-2xl font-bold text-jhr-white mt-1">{Math.round(ga4Data.overview.totals.avgSessionDuration)}s</p>
              </div>
            </div>

            {/* GA4 Daily Traffic Chart */}
            <TrendChart
              title={`Daily Users (${timeRange}d)`}
              data={ga4Data.overview.daily.map((d) => ({
                date: formatDateLabel(d.date),
                users: d.activeUsers,
              }))}
              dataKey="users"
              color="#4ade80"
              icon={<Users className="w-5 h-5 text-green-400" />}
            />

            {/* GA4 Page Views Chart */}
            <TrendChart
              title={`Daily Page Views (${timeRange}d)`}
              data={ga4Data.overview.daily.map((d) => ({
                date: formatDateLabel(d.date),
                views: d.pageViews,
              }))}
              dataKey="views"
              color="#60a5fa"
              icon={<Eye className="w-5 h-5 text-blue-400" />}
            />

            {/* Top Pages + Traffic Sources side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top Pages */}
              {ga4Data.topPages && ga4Data.topPages.length > 0 && (
                <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
                  <h3 className="text-body-md font-semibold text-jhr-white mb-4">Top Pages</h3>
                  <div className="space-y-2">
                    {ga4Data.topPages.map((page, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-jhr-black-lighter last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-body-sm text-jhr-white truncate">{page.title || page.path}</p>
                          <p className="text-xs text-jhr-white-dim truncate">{page.path}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 ml-4">
                          <span className="text-body-sm text-jhr-white font-medium">{page.pageViews.toLocaleString()} <span className="text-jhr-white-dim text-xs">views</span></span>
                          <span className="text-body-sm text-jhr-white-dim">{page.users.toLocaleString()} <span className="text-xs">users</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Traffic Sources */}
              {ga4Data.trafficSources && ga4Data.trafficSources.length > 0 && (
                <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
                  <h3 className="text-body-md font-semibold text-jhr-white mb-4">Traffic Sources</h3>
                  <div className="space-y-2">
                    {ga4Data.trafficSources.map((source, i) => {
                      const maxSessions = ga4Data.trafficSources![0].sessions;
                      const pct = maxSessions > 0 ? (source.sessions / maxSessions) * 100 : 0;
                      return (
                        <div key={i} className="py-2 border-b border-jhr-black-lighter last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-body-sm text-jhr-white">{source.channel}</span>
                            <span className="text-body-sm text-jhr-white font-medium">{source.sessions.toLocaleString()} <span className="text-jhr-white-dim text-xs">sessions</span></span>
                          </div>
                          <div className="w-full h-1.5 bg-jhr-black-lighter rounded-full">
                            <div className="h-full bg-jhr-gold rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Form Page Visits (Lead Attribution) */}
            {ga4Data.formPageVisits && ga4Data.formPageVisits.length > 0 && (
              <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
                <h3 className="text-body-md font-semibold text-jhr-white mb-2">Lead Form Page Visits</h3>
                <p className="text-body-sm text-jhr-white-dim mb-4">Pages containing &quot;contact&quot; or &quot;book&quot; — shows where visitors came from before reaching these pages.</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-jhr-black-lighter">
                        <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pr-4 uppercase tracking-wider">Form Page</th>
                        <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4 uppercase tracking-wider">Referring Page</th>
                        <th className="text-right text-xs font-medium text-jhr-white-dim py-2 pl-4 uppercase tracking-wider">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ga4Data.formPageVisits.map((visit, i) => (
                        <tr key={i} className="border-b border-jhr-black-lighter/50">
                          <td className="py-3 pr-4 text-body-sm text-jhr-white">{visit.path}</td>
                          <td className="py-3 px-4 text-body-sm text-jhr-white-dim">{visit.referrer || '(direct)'}</td>
                          <td className="py-3 pl-4 text-right text-body-sm text-jhr-white font-medium">{visit.pageViews}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-8 text-center">
            <BarChart3 className="w-10 h-10 text-jhr-white-dim mx-auto mb-3" />
            <h3 className="text-body-md font-semibold text-jhr-white mb-2">GA4 Not Connected</h3>
            <p className="text-body-sm text-jhr-white-dim">
              Set GA4_PROPERTY_ID in your environment and ensure the service account has Viewer access.
            </p>
          </div>
        )}
      </div>

      {/* ─── Recommendations ───────────────────────────────────────────────── */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-jhr-gold" />
          <h2 className="text-heading-md font-display font-bold text-jhr-white">Recommendations</h2>
        </div>
        <p className="text-body-sm text-jhr-white-dim mb-4">
          Actionable suggestions based on your current performance and social metrics.
        </p>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                rec.priority === 'high'
                  ? 'bg-red-500/5 border-red-500/20'
                  : rec.priority === 'medium'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-jhr-gold/5 border-jhr-gold/20'
              }`}
            >
              <div className="mt-0.5">
                {rec.priority === 'high' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : rec.priority === 'medium' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-jhr-gold" />
                )}
              </div>
              <p className="text-body-sm text-jhr-white">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
