'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Sparkles,
  X,
  ShieldAlert,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Alert {
  id: string;
  severity: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  link: string;
  linkLabel: string;
}

interface ActiveAlert {
  pk: string;
  sk: string;
  alert_type: string;
  metric_name: string;
  threshold_value: number;
  actual_value: number;
  triggered_at: string;
  severity: 'critical' | 'warning';
  message: string;
}

interface InsightData {
  recommendations: string;
  generatedAt: string;
  cached: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function SeverityIcon({ severity }: { severity: Alert['severity'] }) {
  switch (severity) {
    case 'error':
      return (
        <div className="p-2 rounded-lg bg-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
      );
    case 'warning':
      return (
        <div className="p-2 rounded-lg bg-amber-500/10">
          <AlertCircle className="w-5 h-5 text-amber-400" />
        </div>
      );
    case 'success':
      return (
        <div className="p-2 rounded-lg bg-green-500/10">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
      );
  }
}

function SeverityBadge({ severity }: { severity: 'critical' | 'warning' }) {
  const colors =
    severity === 'critical'
      ? 'bg-red-400/10 text-red-400 border-red-400/20'
      : 'bg-amber-400/10 text-amber-400 border-amber-400/20';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
    >
      {severity}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // AI Recommendations
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsRefreshing, setInsightsRefreshing] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch active alerts from /api/admin/alerts
  // -------------------------------------------------------------------------

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/alerts');
      if (res.ok) {
        const data = await res.json();
        setActiveAlerts(data.alerts || []);
      }
    } catch {
      // Alert endpoint unavailable
    }
  }, []);

  // -------------------------------------------------------------------------
  // Fetch AI Recommendations
  // -------------------------------------------------------------------------

  const fetchInsights = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setInsightsRefreshing(true);
    else setInsightsLoading(true);

    try {
      const url = forceRefresh
        ? '/api/admin/insights?refresh=true'
        : '/api/admin/insights';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch {
      // Insights unavailable
    } finally {
      setInsightsLoading(false);
      setInsightsRefreshing(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Dismiss an active alert
  // -------------------------------------------------------------------------

  const dismissAlert = useCallback(async (alertPk: string) => {
    // Extract the ID portion after "ALERT#"
    const alertId = alertPk.replace('ALERT#', '');
    try {
      const res = await fetch(`/api/admin/alerts?id=${encodeURIComponent(alertId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActiveAlerts((prev) => prev.filter((a) => a.pk !== alertPk));
      }
    } catch {
      // Failed to dismiss
    }
  }, []);

  // -------------------------------------------------------------------------
  // Fetch health check alerts (existing pattern)
  // -------------------------------------------------------------------------

  const fetchAlerts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const newAlerts: Alert[] = [];
    const now = new Date();

    // Check PSI performance
    try {
      const psiRes = await fetch('/api/admin/psi');
      if (psiRes.ok) {
        const psiData = await psiRes.json();
        const desktopScore = psiData?.desktop?.score ?? psiData?.score ?? null;
        const mobileScore = psiData?.mobile?.score ?? null;

        if (desktopScore !== null && desktopScore < 85) {
          newAlerts.push({
            id: 'psi-desktop',
            severity: desktopScore < 50 ? 'error' : 'warning',
            title: 'PSI Performance Below 85',
            message: `Desktop score is ${desktopScore}/100. Run an audit to check for opportunities.`,
            timestamp: timeAgo(now),
            link: '/admin/performance',
            linkLabel: 'View Performance',
          });
        }

        if (mobileScore !== null && mobileScore < 85) {
          newAlerts.push({
            id: 'psi-mobile',
            severity: mobileScore < 50 ? 'error' : 'warning',
            title: 'Mobile PSI Below 85',
            message: `Mobile score is ${mobileScore}/100. Consider optimizing for mobile performance.`,
            timestamp: timeAgo(now),
            link: '/admin/performance',
            linkLabel: 'View Performance',
          });
        }

        if (
          (desktopScore === null || desktopScore >= 85) &&
          (mobileScore === null || mobileScore >= 85)
        ) {
          newAlerts.push({
            id: 'psi-ok',
            severity: 'success',
            title: 'PSI Performance Healthy',
            message: 'All PageSpeed scores are at or above 85. No action needed.',
            timestamp: timeAgo(now),
            link: '/admin/performance',
            linkLabel: 'View Performance',
          });
        }
      }
    } catch {
      // PSI endpoint unavailable
    }

    // Check blog drafts
    try {
      const blogRes = await fetch('/api/admin/blog');
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        const posts = Array.isArray(blogData) ? blogData : blogData?.posts ?? [];
        const drafts = posts.filter(
          (p: { status?: string }) => p.status === 'draft'
        );

        if (drafts.length > 0) {
          newAlerts.push({
            id: 'blog-drafts',
            severity: 'warning',
            title: `${drafts.length} Draft Post${drafts.length !== 1 ? 's' : ''} Pending Review`,
            message: `You have ${drafts.length} unpublished blog post${drafts.length !== 1 ? 's' : ''} that may need attention.`,
            timestamp: timeAgo(now),
            link: '/admin/articles',
            linkLabel: 'View Articles',
          });
        } else {
          newAlerts.push({
            id: 'blog-ok',
            severity: 'success',
            title: 'Blog Up to Date',
            message: 'No draft posts pending review.',
            timestamp: timeAgo(now),
            link: '/admin/articles',
            linkLabel: 'View Articles',
          });
        }
      }
    } catch {
      // Blog endpoint unavailable
    }

    // Check GEO score
    try {
      const geoRes = await fetch('/api/admin/geo/score');
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const geoScore = geoData?.score ?? null;

        if (geoScore !== null && geoScore < 70) {
          newAlerts.push({
            id: 'geo-score',
            severity: geoScore < 40 ? 'error' : 'warning',
            title: 'GEO Score Below 70',
            message: `Current GEO optimization score is ${geoScore}/100. Review your local SEO and citations.`,
            timestamp: timeAgo(now),
            link: '/admin/geo',
            linkLabel: 'View GEO',
          });
        } else if (geoScore !== null) {
          newAlerts.push({
            id: 'geo-ok',
            severity: 'success',
            title: 'GEO Score Healthy',
            message: `GEO optimization score is ${geoScore}/100. Looking good.`,
            timestamp: timeAgo(now),
            link: '/admin/geo',
            linkLabel: 'View GEO',
          });
        }
      }
    } catch {
      // GEO endpoint unavailable
    }

    setAlerts(newAlerts);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchActiveAlerts();
    fetchInsights();
  }, [fetchAlerts, fetchActiveAlerts, fetchInsights]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-jhr-white">Alerts</h1>
          <p className="text-body-sm text-jhr-white-dim mt-1">
            System health checks, threshold alerts, and AI recommendations
          </p>
        </div>
        <button
          onClick={() => {
            fetchAlerts(true);
            fetchActiveAlerts();
          }}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Active Threshold Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-heading-md font-display font-semibold text-jhr-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Active Threshold Alerts
          </h2>
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Threshold
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Actual
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Triggered
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-jhr-white-dim uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeAlerts.map((alert) => (
                  <tr
                    key={alert.pk}
                    className="border-b border-jhr-black-lighter last:border-0 hover:bg-jhr-black-lighter/50"
                  >
                    <td className="px-4 py-3">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-4 py-3 text-body-sm text-jhr-white">
                      {alert.metric_name}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-jhr-white-dim">
                      {alert.threshold_value}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-jhr-white font-medium">
                      {alert.actual_value}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-jhr-white-dim">
                      {timeAgo(new Date(alert.triggered_at))}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => dismissAlert(alert.pk)}
                        className="p-1 rounded hover:bg-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
                        title="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-md font-display font-semibold text-jhr-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-jhr-gold" />
            AI Weekly Recommendations
          </h2>
          <button
            onClick={() => fetchInsights(true)}
            disabled={insightsRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-jhr-gold/10 border border-jhr-gold/20 text-jhr-gold hover:bg-jhr-gold/20 transition-colors disabled:opacity-50 text-sm"
          >
            {insightsRefreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{insightsRefreshing ? 'Generating...' : 'Regenerate'}</span>
          </button>
        </div>

        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          {insightsLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-jhr-white-dim">
              <Loader2 className="w-6 h-6 animate-spin mb-3" />
              <p className="text-body-sm">Loading AI recommendations...</p>
            </div>
          ) : insights?.recommendations ? (
            <div>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-body-sm text-jhr-white leading-relaxed">
                  {insights.recommendations}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-jhr-black-lighter flex items-center gap-2 text-xs text-jhr-white-dim">
                <Sparkles className="w-3 h-3 text-jhr-gold" />
                <span>
                  Generated {insights.generatedAt
                    ? timeAgo(new Date(insights.generatedAt))
                    : 'recently'}
                  {insights.cached ? ' (cached)' : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-jhr-white-dim">
              <Sparkles className="w-8 h-8 text-jhr-gold/30 mb-3" />
              <p className="text-body-sm">No recommendations available yet.</p>
              <button
                onClick={() => fetchInsights(true)}
                className="mt-3 text-jhr-gold hover:underline text-sm"
              >
                Generate now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Health Check Alerts */}
      <div className="space-y-3">
        <h2 className="text-heading-md font-display font-semibold text-jhr-white">
          System Health Checks
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-jhr-white-dim">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-body-sm">Checking system health...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-jhr-white-dim">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-body-sm font-medium text-jhr-white">No active alerts</p>
            <p className="text-body-sm text-jhr-white-dim mt-1">
              All systems are performing within thresholds.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 bg-jhr-black-light rounded-xl border border-jhr-black-lighter"
              >
                <SeverityIcon severity={alert.severity} />
                <div className="flex-1">
                  <p className="text-body-sm font-medium text-jhr-white">
                    {alert.title}
                  </p>
                  <p className="text-body-sm text-jhr-white-dim mt-1">
                    {alert.message}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-jhr-white-dim">
                    <span>{alert.timestamp}</span>
                    <a
                      href={alert.link}
                      className="text-jhr-gold hover:text-jhr-gold/80"
                    >
                      {alert.linkLabel} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
