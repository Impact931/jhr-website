'use client';

import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
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

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminPerformancePage() {
  const [strategy, setStrategy] = useState<'desktop' | 'mobile'>('desktop');
  const [data, setData] = useState<PSIData | null>(null);
  const [history, setHistory] = useState<PSISnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (strat: string) => {
    try {
      const res = await fetch(`/api/admin/psi/history?strategy=${strat}`);
      if (res.ok) {
        const json = await res.json();
        setHistory(json.snapshots || []);
      }
    } catch {
      // Non-critical — history might be empty
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Performance
          </h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            PageSpeed Insights audit and Core Web Vitals monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

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
        <>
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
        </>
      )}
    </div>
  );
}
