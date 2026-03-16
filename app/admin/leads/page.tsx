'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search, Users, Mail, Calendar, Phone, Building2, MapPin, FileText, Globe,
  Inbox, Loader2, AlertCircle, ChevronDown, ChevronUp, RefreshCw,
  CheckCircle, DollarSign, TrendingUp, Clock, ExternalLink,
  Zap, Database, Link2, ArrowRight, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Lead {
  pk?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  eventType?: string;
  service?: string;
  services?: string[];
  venue?: string;
  locationVenue?: string;
  eventDate?: string;
  eventDateEnd?: string;
  message?: string;
  eventDescription?: string;
  clientEventName?: string;
  positionTitle?: string;
  website?: string;
  attendees?: string;
  multiDay?: boolean;
  mediaUse?: string[];
  industry?: string;
  goals?: string;
  budget?: string[];
  videoServices?: string[];
  additionalInfo?: string;
  referral?: string[];
  status?: string;
  submittedAt?: string;
  inquiryDate?: string;
  source?: string;
  estimatedValue?: number;
  notionUrl?: string;
}

interface NotionSummary {
  total: number;
  new7d: number;
  new30d: number;
  bySource: Record<string, number>;
  byService: Record<string, number>;
  byStatus: Record<string, number>;
  pipelineValue: number;
}

interface NotionResponse {
  connected: boolean;
  leads?: Lead[];
  summary?: NotionSummary;
  error?: string;
}

interface DiscoverResponse {
  connected: boolean;
  leadsDbConfigured?: boolean;
  configuredDbId?: string | null;
  databases?: { id: string; title: string; url: string }[];
  error?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-yellow-500/10 text-yellow-400',
  'proposal sent': 'bg-purple-500/10 text-purple-400',
  proposal: 'bg-purple-500/10 text-purple-400',
  booked: 'bg-green-500/10 text-green-400',
  qualified: 'bg-green-500/10 text-green-400',
  'closed-lost': 'bg-red-500/10 text-red-400',
  closed: 'bg-jhr-white-dim/10 text-jhr-white-dim',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  'proposal sent': 'Proposal Sent',
  proposal: 'Proposal',
  booked: 'Booked',
  qualified: 'Qualified',
  'closed-lost': 'Closed-Lost',
  closed: 'Closed',
};

const PIPELINE_STAGES = ['New', 'Contacted', 'Proposal Sent', 'Booked', 'Closed-Lost'];
const BRAND_GOLD = '#C5A572';
const CHART_COLORS = ['#C5A572', '#9B8A63', '#7A6E50', '#5C5540', '#A0926D', '#D4BC8E'];

type SourceTab = 'local' | 'notion';

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function AdminLeadsPage() {
  // -- Local leads (DynamoDB) state --
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceTab>('notion');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // -- Notion CRM state --
  const [notionData, setNotionData] = useState<NotionResponse | null>(null);
  const [notionLoading, setNotionLoading] = useState(true);
  const [discoverData, setDiscoverData] = useState<DiscoverResponse | null>(null);
  const [discovering, setDiscovering] = useState(false);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchLocalLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotionLeads = useCallback(async () => {
    setNotionLoading(true);
    try {
      const res = await fetch('/api/admin/notion/leads');
      const data: NotionResponse = await res.json();
      setNotionData(data);
    } catch {
      setNotionData({ connected: false });
    } finally {
      setNotionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalLeads();
    fetchNotionLeads();
  }, [fetchLocalLeads, fetchNotionLeads]);

  // When switching tabs, re-fetch if needed
  useEffect(() => {
    if (sourceTab === 'local' && leads.length === 0 && !loading) fetchLocalLeads();
  }, [sourceTab, leads.length, loading, fetchLocalLeads]);

  const handleTestConnection = async () => {
    setDiscovering(true);
    try {
      const res = await fetch('/api/admin/notion/discover');
      const data: DiscoverResponse = await res.json();
      setDiscoverData(data);
    } catch {
      setDiscoverData({ connected: false, error: 'Failed to reach discover endpoint' });
    } finally {
      setDiscovering(false);
    }
  };

  const handleSyncToNotion = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-to-notion' }),
      });
      if (!res.ok) throw new Error('Sync failed');
      const data = await res.json();
      setSyncResult(`Synced ${data.synced} of ${data.total} leads to Notion${data.failed > 0 ? ` (${data.failed} failed)` : ''}`);
      setTimeout(() => setSyncResult(null), 5000);
    } catch {
      setSyncResult('Sync failed. Check Notion integration settings.');
      setTimeout(() => setSyncResult(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const getLeadKey = (lead: Lead) => lead.pk || lead.id || lead.email;
  const getLeadName = (lead: Lead) => {
    if (lead.name) return lead.name;
    if (lead.firstName || lead.lastName) return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    return lead.email;
  };

  const filteredLeads = useMemo(() => {
    const source = sourceTab === 'notion' ? (notionData?.leads || []) : leads;
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter((lead) => {
      const name = getLeadName(lead).toLowerCase();
      return (
        name.includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q)) ||
        ((lead.eventType || lead.service || '').toLowerCase().includes(q))
      );
    });
  }, [leads, notionData, sourceTab, searchQuery]);

  // High-value alert: leads > $2000 in "New" status for > 24h
  const highValueAlerts = useMemo(() => {
    if (!notionData?.leads) return [];
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return notionData.leads.filter((l) => {
      if ((l.estimatedValue || 0) <= 2000) return false;
      if ((l.status || '').toLowerCase() !== 'new') return false;
      const inquiryTime = l.inquiryDate ? new Date(l.inquiryDate).getTime() : 0;
      return inquiryTime > 0 && inquiryTime < oneDayAgo;
    });
  }, [notionData]);

  const isNotionConnected = notionData?.connected === true;

  // ---------------------------------------------------------------------------
  // Render: Notion Not Connected
  // ---------------------------------------------------------------------------

  if (sourceTab === 'notion' && !notionLoading && !isNotionConnected) {
    return (
      <div className="space-y-8">
        <PageHeader
          leads={leads}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sourceTab={sourceTab}
          setSourceTab={setSourceTab}
          syncing={syncing}
          handleSyncToNotion={handleSyncToNotion}
          syncResult={syncResult}
        />

        {/* Setup Card */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-jhr-white">Connect Notion CRM</h2>
              <p className="text-body-sm text-jhr-white-dim">Set up your Notion integration to enable the lead intelligence dashboard.</p>
            </div>
          </div>

          <ol className="space-y-4 text-body-sm">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-jhr-gold/20 text-jhr-gold flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-jhr-white font-medium">Create a Notion integration</p>
                <p className="text-jhr-white-dim mt-0.5">
                  Go to{' '}
                  <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-jhr-gold underline hover:text-jhr-gold/80">
                    notion.so/my-integrations
                  </a>{' '}
                  and create a new internal integration.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-jhr-gold/20 text-jhr-gold flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-jhr-white font-medium">Share your Leads database</p>
                <p className="text-jhr-white-dim mt-0.5">
                  Open your Leads database in Notion, click the three-dot menu, then &ldquo;Add connections&rdquo; and select your integration.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-jhr-gold/20 text-jhr-gold flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-jhr-white font-medium">Set environment variables</p>
                <p className="text-jhr-white-dim mt-0.5">
                  Add <code className="px-1.5 py-0.5 rounded bg-jhr-black text-jhr-gold text-xs">NOTION_TOKEN</code> and{' '}
                  <code className="px-1.5 py-0.5 rounded bg-jhr-black text-jhr-gold text-xs">NOTION_LEADS_DB_ID</code> to your environment.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t border-jhr-black-lighter">
            <button
              onClick={handleTestConnection}
              disabled={discovering}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
            >
              {discovering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              Test Connection
            </button>
          </div>

          {/* Discover Results */}
          {discoverData && (
            <div className="mt-4 p-4 rounded-lg bg-jhr-black border border-jhr-black-lighter">
              {discoverData.error ? (
                <div className="flex items-center gap-2 text-red-400 text-body-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{discoverData.error}</span>
                </div>
              ) : discoverData.connected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400 text-body-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Notion token is valid{discoverData.leadsDbConfigured ? ' and leads database is configured' : ' but NOTION_LEADS_DB_ID is not set'}.</span>
                  </div>
                  {discoverData.databases && discoverData.databases.length > 0 && (
                    <div>
                      <p className="text-body-sm text-jhr-white-dim mb-2">Accessible databases:</p>
                      <ul className="space-y-1">
                        {discoverData.databases.map((db) => (
                          <li key={db.id} className="flex items-center gap-2 text-body-sm">
                            <Database className="w-3 h-3 text-jhr-white-dim" />
                            <span className="text-jhr-white">{db.title}</span>
                            <code className="text-xs text-jhr-white-dim">{db.id}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 text-body-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{discoverData.message || 'Not connected'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Main Dashboard
  // ---------------------------------------------------------------------------

  const summary = notionData?.summary;
  const notionLeads = notionData?.leads || [];

  return (
    <div className="space-y-8">
      <PageHeader
        leads={sourceTab === 'notion' ? notionLeads : leads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sourceTab={sourceTab}
        setSourceTab={setSourceTab}
        syncing={syncing}
        handleSyncToNotion={handleSyncToNotion}
        syncResult={syncResult}
      />

      {/* High-Value Alert */}
      {highValueAlerts.length > 0 && sourceTab === 'notion' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-md font-semibold text-red-400">High-Value Leads Need Attention</p>
            <p className="text-body-sm text-red-300/80 mt-1">
              {highValueAlerts.length} lead{highValueAlerts.length > 1 ? 's' : ''} with estimated value over $2,000{' '}
              {highValueAlerts.length > 1 ? 'have' : 'has'} been in &ldquo;New&rdquo; status for more than 24 hours:{' '}
              {highValueAlerts.map((l) => getLeadName(l)).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Notion Dashboard */}
      {sourceTab === 'notion' && isNotionConnected && (
        <>
          {notionLoading ? (
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mb-4" />
              <p className="text-body-md text-jhr-white">Loading Notion data...</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              {summary && <KPICards summary={summary} />}

              {/* Charts Row */}
              {summary && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SourceBreakdownChart data={summary.bySource} />
                  <ServiceBreakdownChart data={summary.byService} />
                </div>
              )}

              {/* Pipeline Funnel */}
              {summary && <PipelineFunnel byStatus={summary.byStatus} />}
            </>
          )}
        </>
      )}

      {/* Local DynamoDB view */}
      {sourceTab === 'local' && (
        <>
          {/* Info Banner */}
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-jhr-gold/10">
                <Users className="w-6 h-6 text-jhr-gold" />
              </div>
              <div>
                <p className="text-body-md font-medium text-jhr-white">Contact Form Submissions</p>
                <p className="text-body-sm text-jhr-white-dim">
                  Leads from your website contact form. New submissions auto-sync to Notion if configured.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading State (local) */}
      {sourceTab === 'local' && loading && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mb-4" />
            <p className="text-body-md text-jhr-white">Loading submissions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && sourceTab === 'local' && (
        <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-body-md text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Recent Leads Table */}
      {(sourceTab === 'local' ? !loading && !error : !notionLoading) && filteredLeads.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-jhr-white mb-4">
            {sourceTab === 'notion' ? 'Recent Leads' : 'All Leads'}
          </h2>
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-jhr-black-lighter">
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Date</th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Name / Company</th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim hidden md:table-cell">Service</th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim hidden lg:table-cell">Source</th>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Status</th>
                    {sourceTab === 'notion' && (
                      <th className="px-6 py-4 text-right text-body-sm font-semibold text-jhr-white-dim hidden md:table-cell">Est. Value</th>
                    )}
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jhr-black-lighter">
                  {filteredLeads.slice(0, sourceTab === 'notion' ? 20 : undefined).map((lead) => (
                    <LeadRow
                      key={getLeadKey(lead)}
                      lead={lead}
                      leadName={getLeadName(lead)}
                      expanded={expandedLead === getLeadKey(lead)}
                      onToggle={() => setExpandedLead(expandedLead === getLeadKey(lead) ? null : getLeadKey(lead))}
                      showValue={sourceTab === 'notion'}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(sourceTab === 'local' ? !loading && !error && filteredLeads.length === 0 : !notionLoading && isNotionConnected && filteredLeads.length === 0) && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
              <Inbox className="w-8 h-8 text-jhr-white-dim" />
            </div>
            <p className="text-body-md text-jhr-white">
              {searchQuery ? 'No matching leads found' : sourceTab === 'notion' ? 'No leads in the last 30 days' : 'No submissions yet'}
            </p>
            <p className="text-body-sm text-jhr-white-dim mt-1 max-w-md">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : sourceTab === 'notion'
                  ? 'New leads from your contact form will appear here once synced.'
                  : 'When visitors fill out the contact form on your website, their submissions will appear here automatically.'}
            </p>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && (
        <div className="flex items-center justify-between text-body-sm text-jhr-white-dim">
          <p>
            Showing {filteredLeads.length > (sourceTab === 'notion' ? 20 : Infinity) ? (sourceTab === 'notion' ? 20 : filteredLeads.length) : filteredLeads.length}{' '}
            {sourceTab === 'notion' ? `of ${notionData?.summary?.total || 0}` : `of ${leads.length}`} lead{filteredLeads.length !== 1 ? 's' : ''}
          </p>
          <p>Source: {sourceTab === 'notion' ? 'Notion CRM' : 'DynamoDB'}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Header (shared between connected and not-connected states)
// ---------------------------------------------------------------------------

function PageHeader({
  leads,
  searchQuery,
  setSearchQuery,
  sourceTab,
  setSourceTab,
  syncing,
  handleSyncToNotion,
  syncResult,
}: {
  leads: Lead[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sourceTab: SourceTab;
  setSourceTab: (t: SourceTab) => void;
  syncing: boolean;
  handleSyncToNotion: () => void;
  syncResult: string | null;
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">Lead Intelligence</h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            {sourceTab === 'notion'
              ? 'CRM pipeline and analytics from Notion.'
              : `Contact form submissions. ${leads.length} total.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncToNotion}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync to Notion
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jhr-white-dim" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {syncResult && (
        <div className="bg-jhr-gold/10 border border-jhr-gold/20 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-jhr-gold flex-shrink-0" />
          <p className="text-body-sm text-jhr-gold">{syncResult}</p>
        </div>
      )}

      {/* Source Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSourceTab('notion')}
          className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
            sourceTab === 'notion'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter hover:border-jhr-black-lighter'
          }`}
        >
          Notion CRM
        </button>
        <button
          onClick={() => setSourceTab('local')}
          className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
            sourceTab === 'local'
              ? 'bg-jhr-gold/10 text-jhr-gold border border-jhr-gold/30'
              : 'text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter hover:border-jhr-black-lighter'
          }`}
        >
          Local (DynamoDB)
        </button>
        <span className={`ml-2 inline-flex items-center gap-1.5 text-body-sm ${sourceTab === 'notion' ? 'text-purple-400' : 'text-jhr-white-dim'}`}>
          <span className={`w-2 h-2 rounded-full ${sourceTab === 'notion' ? 'bg-purple-400' : 'bg-green-400'}`} />
          {sourceTab === 'notion' ? 'Notion CRM' : 'DynamoDB'}
        </span>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// KPI Cards
// ---------------------------------------------------------------------------

function KPICards({ summary }: { summary: NotionSummary }) {
  const cards = [
    {
      label: 'New Leads (7d)',
      value: summary.new7d,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'New Leads (30d)',
      value: summary.new30d,
      icon: Users,
      color: 'text-jhr-gold',
      bgColor: 'bg-jhr-gold/10',
    },
    {
      label: 'Pipeline Value',
      value: `$${summary.pipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Leads',
      value: summary.total,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-body-sm text-jhr-white-dim">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-jhr-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Source Breakdown Chart
// ---------------------------------------------------------------------------

function SourceBreakdownChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-jhr-gold" />
        <h3 className="text-body-md font-semibold text-jhr-white">Lead Source Breakdown</h3>
      </div>
      <ResponsiveContainer width="100%" height={chartData.length * 40 + 20}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#D1D5DB', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
            cursor={{ fill: 'rgba(197, 165, 114, 0.05)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service Breakdown Chart
// ---------------------------------------------------------------------------

function ServiceBreakdownChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-jhr-gold" />
        <h3 className="text-body-md font-semibold text-jhr-white">Service Interest</h3>
      </div>
      <ResponsiveContainer width="100%" height={chartData.length * 40 + 20}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#D1D5DB', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
            cursor={{ fill: 'rgba(197, 165, 114, 0.05)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Funnel
// ---------------------------------------------------------------------------

function PipelineFunnel({ byStatus }: { byStatus: Record<string, number> }) {
  // Normalize status keys to match PIPELINE_STAGES
  const statusMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(byStatus)) {
    statusMap[key] = val;
  }

  const stages = PIPELINE_STAGES.map((stage) => {
    const count = statusMap[stage] || statusMap[stage.toLowerCase()] || 0;
    return { name: stage, count };
  });

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-jhr-gold" />
        <h3 className="text-body-md font-semibold text-jhr-white">Pipeline Funnel</h3>
      </div>
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const widthPct = Math.max((stage.count / maxCount) * 100, 4);
          const conversionRate =
            idx > 0 && stages[idx - 1].count > 0
              ? Math.round((stage.count / stages[idx - 1].count) * 100)
              : null;

          return (
            <div key={stage.name} className="flex items-center gap-4">
              <div className="w-28 text-body-sm text-jhr-white-dim text-right flex-shrink-0">
                {stage.name}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-8 bg-jhr-black rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                    }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-body-sm font-medium text-jhr-white">
                    {stage.count}
                  </span>
                </div>
                <div className="w-16 text-right flex-shrink-0">
                  {conversionRate !== null ? (
                    <span className="text-body-sm text-jhr-white-dim flex items-center justify-end gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {conversionRate}%
                    </span>
                  ) : (
                    <span className="text-body-sm text-jhr-white-dim">&mdash;</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lead Table Row
// ---------------------------------------------------------------------------

function LeadRow({
  lead,
  leadName,
  expanded,
  onToggle,
  showValue,
}: {
  lead: Lead;
  leadName: string;
  expanded: boolean;
  onToggle: () => void;
  showValue: boolean;
}) {
  const status = (lead.status || 'new').toLowerCase();
  const dateStr = lead.inquiryDate || lead.submittedAt;
  const service = lead.service || (Array.isArray(lead.services) ? lead.services.join(', ') : '') || lead.eventType || '';

  return (
    <>
      <tr className="hover:bg-jhr-black-lighter/50 transition-colors cursor-pointer" onClick={onToggle}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-body-sm text-jhr-white">
              {dateStr
                ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '\u2014'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div>
            <span className="text-body-md font-medium text-jhr-white">{leadName}</span>
            {lead.company && (
              <span className="block text-body-sm text-jhr-white-dim">{lead.company}</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 hidden md:table-cell">
          <span className="text-body-sm text-jhr-white-dim">{service || '\u2014'}</span>
        </td>
        <td className="px-6 py-4 hidden lg:table-cell">
          <span className="text-body-sm text-jhr-white-dim">{lead.source || '\u2014'}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-sm font-medium ${statusStyles[status] || statusStyles.new}`}>
            {statusLabels[status] || lead.status || 'New'}
          </span>
        </td>
        {showValue && (
          <td className="px-6 py-4 text-right hidden md:table-cell">
            <span className="text-body-sm text-jhr-white">
              {lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : '\u2014'}
            </span>
          </td>
        )}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1">
            {lead.notionUrl && (
              <a
                href={lead.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-jhr-black-lighter transition-colors"
                title="Open in Notion"
              >
                <ExternalLink className="w-4 h-4 text-jhr-white-dim hover:text-jhr-gold" />
              </a>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-jhr-white-dim" /> : <ChevronDown className="w-4 h-4 text-jhr-white-dim" />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-jhr-black/50">
          <td colSpan={showValue ? 7 : 6} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Email:</span>
                  <a href={`mailto:${lead.email}`} className="text-body-sm text-jhr-gold hover:underline">{lead.email}</a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Phone:</span>
                  <span className="text-body-sm text-jhr-white">{lead.phone}</span>
                </div>
              )}
              {(lead.venue || lead.locationVenue) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Venue:</span>
                  <span className="text-body-sm text-jhr-white">{lead.venue || lead.locationVenue}</span>
                </div>
              )}
              {lead.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Event Date:</span>
                  <span className="text-body-sm text-jhr-white">
                    {lead.eventDate}{lead.eventDateEnd ? ` — ${lead.eventDateEnd}` : ''}
                  </span>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 md:hidden">
                  <Building2 className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Company:</span>
                  <span className="text-body-sm text-jhr-white">{lead.company}</span>
                </div>
              )}
              {lead.clientEventName && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Event:</span>
                  <span className="text-body-sm text-jhr-white">{lead.clientEventName}</span>
                </div>
              )}
              {lead.attendees && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Attendees:</span>
                  <span className="text-body-sm text-jhr-white">{lead.attendees}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Website:</span>
                  <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-body-sm text-jhr-gold hover:underline">{lead.website}</a>
                </div>
              )}
              {service && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Service:</span>
                  <span className="text-body-sm text-jhr-white">{service}</span>
                </div>
              )}
              {Array.isArray(lead.referral) && lead.referral.length > 0 && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Referral:</span>
                  <span className="text-body-sm text-jhr-white">{lead.referral.join(', ')}</span>
                </div>
              )}
              {(lead.message || lead.eventDescription) && (
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-jhr-white-dim mt-0.5" />
                    <div>
                      <span className="text-body-sm text-jhr-white-dim">{lead.eventDescription ? 'Event Description:' : 'Message:'}</span>
                      <p className="text-body-sm text-jhr-white mt-1">{lead.message || lead.eventDescription}</p>
                    </div>
                  </div>
                </div>
              )}
              {lead.goals && (
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-jhr-white-dim mt-0.5" />
                    <div>
                      <span className="text-body-sm text-jhr-white-dim">Goals:</span>
                      <p className="text-body-sm text-jhr-white mt-1">{lead.goals}</p>
                    </div>
                  </div>
                </div>
              )}
              {lead.additionalInfo && (
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-jhr-white-dim mt-0.5" />
                    <div>
                      <span className="text-body-sm text-jhr-white-dim">Additional Info:</span>
                      <p className="text-body-sm text-jhr-white mt-1">{lead.additionalInfo}</p>
                    </div>
                  </div>
                </div>
              )}
              {dateStr && (
                <div className="md:col-span-2 text-body-sm text-jhr-white-dim">
                  Submitted: {new Date(dateStr).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true,
                  })}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
