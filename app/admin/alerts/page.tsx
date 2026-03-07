'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';

interface Alert {
  id: string;
  severity: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  link: string;
  linkLabel: string;
}

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

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      // PSI endpoint unavailable - skip
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
            link: '/admin/blog',
            linkLabel: 'View Blog',
          });
        } else {
          newAlerts.push({
            id: 'blog-ok',
            severity: 'success',
            title: 'Blog Up to Date',
            message: 'No draft posts pending review.',
            timestamp: timeAgo(now),
            link: '/admin/blog',
            linkLabel: 'View Blog',
          });
        }
      }
    } catch {
      // Blog endpoint unavailable - skip
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
      // GEO endpoint unavailable - skip
    }

    setAlerts(newAlerts);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-jhr-white">Alerts</h1>
          <p className="text-body-sm text-jhr-white-dim mt-1">
            System health checks and notifications
          </p>
        </div>
        <button
          onClick={() => fetchAlerts(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Alerts List */}
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
  );
}
