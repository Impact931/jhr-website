'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Gauge,
  FileText,
  Users,
  Search,
  Globe,
  Share2,
  PenLine,
  Activity,
  Zap,
  Eye,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Clock,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  MousePointerClick,
  Instagram,
  Youtube,
  Bell,
  Sparkles,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PSIData {
  score: number;
  strategy: string;
}

interface BlogPost {
  title: string;
  slug: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface BlogData {
  posts: BlogPost[];
  count: number;
}

interface LeadRecord {
  firstName: string;
  lastName: string;
  email: string;
  submittedAt: string;
  eventType?: string;
}

interface LeadsData {
  leads: LeadRecord[];
  count: number;
}

interface SEOData {
  connected: boolean;
  clicks?: number;
  impressions?: number;
}

interface GEOData {
  score: number;
  lastChecked?: string;
}

interface SocialPlatform {
  name: string;
  connected: boolean;
}

interface AlertItem {
  id: string;
  severity: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface InsightData {
  recommendations?: string[];
  generatedAt?: string;
}

// ---------------------------------------------------------------------------
// KPI Card Component
// ---------------------------------------------------------------------------

function KPICard({
  title,
  value,
  subtitle,
  icon,
  status,
  href,
  loading,
  children,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  status?: 'good' | 'warning' | 'error' | 'neutral';
  href?: string;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  const statusColors: Record<string, string> = {
    good: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    neutral: 'text-jhr-white-dim',
  };

  const content = (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6 hover:border-jhr-gold/30 transition-colors h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-body-sm text-jhr-white-dim">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-20 animate-pulse bg-jhr-black-lighter rounded" />
          ) : (
            <p
              className={`mt-2 text-display-sm font-display font-bold ${
                status ? statusColors[status] : 'text-jhr-white'
              }`}
            >
              {value}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-jhr-gold/10 shrink-0">
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="mt-4 h-4 w-32 animate-pulse bg-jhr-black-lighter rounded" />
      ) : (
        <>
          {subtitle && (
            <p className="mt-4 text-body-sm text-jhr-white-dim">{subtitle}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// Status Badge Component
// ---------------------------------------------------------------------------

function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: 'good' | 'warning' | 'error' | 'neutral';
}) {
  const colors: Record<string, string> = {
    good: 'bg-green-400/10 text-green-400 border-green-400/20',
    warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    error: 'bg-red-400/10 text-red-400 border-red-400/20',
    neutral: 'bg-jhr-black-lighter text-jhr-white-dim border-jhr-black-lighter',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[status]}`}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Toast Notification
// ---------------------------------------------------------------------------

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-green-500/90'
      : type === 'error'
        ? 'bg-red-500/90'
        : 'bg-jhr-gold/90';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${bgColor} text-jhr-black px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : type === 'error' ? (
        <XCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        &times;
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export default function AdminDashboard() {
  const { data: session } = useSession();

  // Data states
  const [psiData, setPsiData] = useState<PSIData | null>(null);
  const [psiLoading, setPsiLoading] = useState(true);

  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [blogLoading, setBlogLoading] = useState(true);

  const [leadsData, setLeadsData] = useState<LeadsData | null>(null);
  const [leadsLoading, setLeadsLoading] = useState(true);

  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [seoLoading, setSeoLoading] = useState(true);

  const [geoData, setGeoData] = useState<GEOData | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);

  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
  const [socialLoading, setSocialLoading] = useState(true);

  // New KPI data
  const [organicClicks, setOrganicClicks] = useState<number | null>(null);
  const [organicClicksLoading, setOrganicClicksLoading] = useState(true);

  const [igReach, setIgReach] = useState<number | null>(null);
  const [igReachLoading, setIgReachLoading] = useState(true);

  const [ytViews, setYtViews] = useState<number | null>(null);
  const [ytViewsLoading, setYtViewsLoading] = useState(true);

  // Active alerts for banner
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [alertsLoading, setAlertsLoading] = useState(true);

  // AI Insights
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // PSI audit running state
  const [psiAuditing, setPsiAuditing] = useState(false);

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  useEffect(() => {
    // PSI Score
    fetch('/api/admin/psi?url=https://jhr-photography.com&strategy=desktop')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.performanceScore === 'number') {
          setPsiData({ score: data.performanceScore, strategy: data.strategy || 'desktop' });
        }
      })
      .catch(() => {})
      .finally(() => setPsiLoading(false));

    // Blog posts
    fetch('/api/admin/blog')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setBlogData(data);
      })
      .catch(() => {})
      .finally(() => setBlogLoading(false));

    // Leads
    fetch('/api/admin/leads')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setLeadsData(data);
      })
      .catch(() => {})
      .finally(() => setLeadsLoading(false));

    // SEO / GSC status
    fetch('/api/admin/seo/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSeoData(data);
      })
      .catch(() => {})
      .finally(() => setSeoLoading(false));

    // GEO score
    fetch('/api/admin/geo/score')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.totalScore === 'number') {
          setGeoData({ score: data.totalScore, lastChecked: data.checkedAt });
        }
      })
      .catch(() => {})
      .finally(() => setGeoLoading(false));

    // Social connections
    fetch('/api/admin/social/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.platforms) {
          setSocialPlatforms(data.platforms);
        }
      })
      .catch(() => {})
      .finally(() => setSocialLoading(false));

    // Active alerts count
    fetch('/api/admin/alerts')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.count) {
          setActiveAlertCount(data.count);
        }
      })
      .catch(() => {});
  }, []);

  // -------------------------------------------------------------------------
  // PSI Audit handler
  // -------------------------------------------------------------------------

  const runPsiAudit = useCallback(async () => {
    setPsiAuditing(true);
    try {
      const res = await fetch(
        '/api/admin/psi?url=https://jhr-photography.com&strategy=desktop'
      );
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.performanceScore === 'number') {
          setPsiData({ score: data.performanceScore, strategy: data.strategy || 'desktop' });
          setToast({
            message: `PSI Score: ${data.performanceScore}/100`,
            type: data.performanceScore >= 90 ? 'success' : data.performanceScore >= 70 ? 'info' : 'error',
          });
        } else {
          setToast({ message: 'PSI audit returned no score', type: 'error' });
        }
      } else {
        setToast({ message: 'PSI audit failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'PSI audit request failed', type: 'error' });
    } finally {
      setPsiAuditing(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  const userName = session?.user?.name || 'Admin';

  const psiStatus: 'good' | 'warning' | 'error' | 'neutral' = psiData
    ? psiData.score >= 90
      ? 'good'
      : psiData.score >= 70
        ? 'warning'
        : 'error'
    : 'neutral';

  const publishedCount = blogData
    ? blogData.posts.filter((p) => p.status === 'published').length
    : 0;
  const draftCount = blogData
    ? blogData.posts.filter((p) => p.status === 'draft').length
    : 0;

  const geoStatus: 'good' | 'warning' | 'error' | 'neutral' = geoData
    ? geoData.score >= 80
      ? 'good'
      : geoData.score >= 50
        ? 'warning'
        : 'error'
    : 'neutral';

  const recentPosts = blogData
    ? [...blogData.posts]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || '').getTime() -
            new Date(a.updatedAt || a.createdAt || '').getTime()
        )
        .slice(0, 5)
    : [];

  const recentLeads = leadsData ? leadsData.leads.slice(0, 3) : [];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Active Alerts Banner */}
      {activeAlertCount > 0 && (
        <div className="sticky top-0 z-30">
          <Link
            href="/admin/alerts"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/15 transition-colors"
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              {activeAlertCount} active alert{activeAlertCount !== 1 ? 's' : ''} require attention
            </span>
            <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
          </Link>
        </div>
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-display-sm font-display font-bold text-jhr-white">
          Command Center
        </h1>
        <p className="mt-2 text-body-md text-jhr-white-dim">
          Welcome back, {userName}. Here is your site at a glance.
        </p>
      </div>

      {/* Row 1: PSI, Blog Posts, Form Submissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PSI Score */}
        <KPICard
          title="PSI Score"
          value={psiData ? `${psiData.score}/100` : '--'}
          icon={<Gauge className="w-6 h-6 text-jhr-gold" />}
          status={psiStatus}
          loading={psiLoading}
        >
          <StatusBadge label="Desktop" status="neutral" />
        </KPICard>

        {/* Blog Posts */}
        <KPICard
          title="Blog Posts"
          value={blogData ? blogData.count : '--'}
          icon={<PenLine className="w-6 h-6 text-jhr-gold" />}
          status="neutral"
          loading={blogLoading}
          href="/admin/articles"
        >
          {blogData && (
            <div className="flex items-center gap-3 text-body-sm">
              <span className="text-green-400">{publishedCount} published</span>
              <span className="text-jhr-white-dim">{draftCount} drafts</span>
            </div>
          )}
        </KPICard>

        {/* Form Submissions */}
        <KPICard
          title="Form Submissions"
          value={leadsData ? leadsData.count : '--'}
          icon={<Users className="w-6 h-6 text-jhr-gold" />}
          status="neutral"
          loading={leadsLoading}
          href="/admin/leads"
        >
          {leadsData && leadsData.count > 0 && (
            <p className="text-body-sm text-jhr-white-dim">
              {leadsData.count} lead{leadsData.count !== 1 ? 's' : ''} total
            </p>
          )}
        </KPICard>
      </div>

      {/* Row 2: SEO, GEO, Social */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SEO / GSC Status */}
        <KPICard
          title="SEO Status"
          value={
            seoLoading
              ? '--'
              : seoData?.connected
                ? 'Connected'
                : 'Not Connected'
          }
          icon={<Search className="w-6 h-6 text-jhr-gold" />}
          status={
            seoData?.connected ? 'good' : seoData === null && !seoLoading ? 'neutral' : 'neutral'
          }
          loading={seoLoading}
          href="/admin/seo"
        >
          {!seoLoading && seoData?.connected && seoData.clicks !== undefined && (
            <p className="text-body-sm text-jhr-white-dim">
              {seoData.clicks.toLocaleString()} clicks (7d)
            </p>
          )}
          {!seoLoading && !seoData?.connected && (
            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-1 text-body-sm text-jhr-gold hover:underline"
            >
              Connect GSC <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </KPICard>

        {/* GEO Readiness */}
        <KPICard
          title="GEO Readiness"
          value={geoData ? `${geoData.score}/100` : '--'}
          icon={<Globe className="w-6 h-6 text-jhr-gold" />}
          status={geoStatus}
          loading={geoLoading}
          href="/admin/geo"
        >
          {!geoLoading && !geoData && (
            <Link
              href="/admin/geo"
              className="inline-flex items-center gap-1 text-body-sm text-jhr-gold hover:underline"
            >
              Calculate <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          {geoData?.lastChecked && (
            <p className="text-body-sm text-jhr-white-dim">
              Last checked:{' '}
              {new Date(geoData.lastChecked).toLocaleDateString()}
            </p>
          )}
        </KPICard>

        {/* Social */}
        <KPICard
          title="Social"
          value={
            socialLoading
              ? '--'
              : socialPlatforms.length > 0
                ? `${socialPlatforms.filter((p) => p.connected).length}/${socialPlatforms.length}`
                : 'N/A'
          }
          icon={<Share2 className="w-6 h-6 text-jhr-gold" />}
          status={
            socialLoading
              ? 'neutral'
              : socialPlatforms.length > 0 && socialPlatforms.every((p) => p.connected)
                ? 'good'
                : socialPlatforms.some((p) => p.connected)
                  ? 'warning'
                  : 'error'
          }
          loading={socialLoading}
          href="/admin/social"
        >
          {!socialLoading && socialPlatforms.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {socialPlatforms.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-body-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.connected ? 'bg-green-400' : 'bg-jhr-white-dim/30'
                    }`}
                  />
                  <span className="text-jhr-white-dim">{p.name}</span>
                </div>
              ))}
            </div>
          )}
          {!socialLoading && socialPlatforms.length === 0 && (
            <p className="text-body-sm text-jhr-white-dim">No platforms configured</p>
          )}
        </KPICard>
      </div>

      {/* Row 3: Quick Actions */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <h2 className="text-heading-md font-display font-semibold text-jhr-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/articles"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
          >
            <PenLine className="w-5 h-5 shrink-0" />
            <span className="text-sm">Generate Article</span>
          </Link>

          <button
            onClick={runPsiAudit}
            disabled={psiAuditing}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {psiAuditing ? (
              <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm">
              {psiAuditing ? 'Running...' : 'Run PSI Audit'}
            </span>
          </button>

          <Link
            href="/admin/seo"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="text-sm">View SEO Data</span>
          </Link>

          <Link
            href="/admin/geo"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
          >
            <Globe className="w-5 h-5 shrink-0" />
            <span className="text-sm">Check GEO Score</span>
          </Link>

          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors"
          >
            <Eye className="w-5 h-5 shrink-0" />
            <span className="text-sm">View Leads</span>
          </Link>
        </div>
      </div>

      {/* Row 4: Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-md font-display font-semibold text-jhr-white">
              Recent Posts
            </h2>
            <Link
              href="/admin/articles"
              className="text-body-sm text-jhr-gold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {blogLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 flex-1 animate-pulse bg-jhr-black-lighter rounded" />
                  <div className="h-4 w-16 animate-pulse bg-jhr-black-lighter rounded" />
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between gap-3 py-2 border-b border-jhr-black-lighter last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-jhr-white truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-jhr-white-dim mt-0.5">
                      {post.updatedAt || post.createdAt
                        ? new Date(
                            post.updatedAt || post.createdAt || ''
                          ).toLocaleDateString()
                        : ''}
                    </p>
                  </div>
                  <StatusBadge
                    label={post.status}
                    status={
                      post.status === 'published'
                        ? 'good'
                        : post.status === 'draft'
                          ? 'warning'
                          : 'neutral'
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
                <FileText className="w-8 h-8 text-jhr-white-dim" />
              </div>
              <p className="text-body-sm text-jhr-white-dim">No posts yet</p>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-md font-display font-semibold text-jhr-white">
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-body-sm text-jhr-gold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {leadsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 flex-1 animate-pulse bg-jhr-black-lighter rounded" />
                  <div className="h-4 w-20 animate-pulse bg-jhr-black-lighter rounded" />
                </div>
              ))}
            </div>
          ) : recentLeads.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <div
                  key={`${lead.email}-${i}`}
                  className="flex items-center justify-between gap-3 py-2 border-b border-jhr-black-lighter last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-jhr-white truncate">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-xs text-jhr-white-dim mt-0.5">
                      {lead.eventType || lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-jhr-white-dim shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
                <Activity className="w-8 h-8 text-jhr-white-dim" />
              </div>
              <p className="text-body-sm text-jhr-white-dim">No leads yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
