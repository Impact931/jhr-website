'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Users, Mail, Calendar, Phone, Building2, MapPin, FileText, Inbox, Loader2, AlertCircle, ChevronDown, ChevronUp, RefreshCw, CheckCircle } from 'lucide-react';

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
  venue?: string;
  eventDate?: string;
  message?: string;
  status?: string;
  submittedAt?: string;
  source?: string;
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-yellow-500/10 text-yellow-400',
  qualified: 'bg-green-500/10 text-green-400',
  closed: 'bg-jhr-white-dim/10 text-jhr-white-dim',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed: 'Closed',
};

type SourceTab = 'local' | 'notion';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceTab>('local');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const fetchLeads = useCallback(async (source: SourceTab) => {
    setLoading(true);
    setError(null);
    try {
      const url = source === 'notion' ? '/api/admin/leads?source=notion' : '/api/admin/leads';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(sourceTab);
  }, [sourceTab, fetchLeads]);

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
    } catch (err) {
      setSyncResult('Sync failed. Check Notion integration settings.');
      setTimeout(() => setSyncResult(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const getLeadKey = (lead: Lead) => lead.pk || lead.id || lead.email;
  const getLeadName = (lead: Lead) => {
    if (lead.name) return lead.name;
    if (lead.firstName || lead.lastName) return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    return lead.email;
  };

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter((lead) => {
      const name = getLeadName(lead).toLowerCase();
      return (
        name.includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q)) ||
        (lead.eventType && lead.eventType.toLowerCase().includes(q))
      );
    });
  }, [leads, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Leads
          </h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Contact form submissions from your website. {leads.length} submission{leads.length !== 1 ? 's' : ''} total.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync to Notion */}
          <button
            onClick={handleSyncToNotion}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync to Notion
          </button>

          {/* Search */}
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

      {/* Sync Result */}
      {syncResult && (
        <div className="bg-jhr-gold/10 border border-jhr-gold/20 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-jhr-gold flex-shrink-0" />
          <p className="text-body-sm text-jhr-gold">{syncResult}</p>
        </div>
      )}

      {/* Source Toggle */}
      <div className="flex items-center gap-2">
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
        <button
          onClick={() => setSourceTab('notion')}
          className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
            sourceTab === 'notion'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter hover:border-jhr-black-lighter'
          }`}
        >
          Notion
        </button>
        <span className={`ml-2 inline-flex items-center gap-1.5 text-body-sm ${sourceTab === 'notion' ? 'text-purple-400' : 'text-jhr-white-dim'}`}>
          <span className={`w-2 h-2 rounded-full ${sourceTab === 'notion' ? 'bg-purple-400' : 'bg-green-400'}`} />
          {sourceTab === 'notion' ? 'Notion Database' : 'DynamoDB'}
        </span>
      </div>

      {/* Info Banner */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-jhr-gold/10">
            <Users className="w-6 h-6 text-jhr-gold" />
          </div>
          <div>
            <p className="text-body-md font-medium text-jhr-white">Contact Form Submissions</p>
            <p className="text-body-sm text-jhr-white-dim">
              {sourceTab === 'notion'
                ? 'Leads synced to your Notion database. Configure integration in Settings.'
                : 'Leads from your website contact form. New submissions auto-sync to Notion if configured.'}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mb-4" />
            <p className="text-body-md text-jhr-white">Loading submissions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-body-md text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Leads Table */}
      {!loading && !error && filteredLeads.length > 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Date</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Name</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Email</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim hidden md:table-cell">Company</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim hidden lg:table-cell">Event Type</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim">Status</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-jhr-white-dim w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jhr-black-lighter">
                {filteredLeads.map((lead) => (
                  <LeadRow
                    key={getLeadKey(lead)}
                    lead={lead}
                    leadName={getLeadName(lead)}
                    expanded={expandedLead === getLeadKey(lead)}
                    onToggle={() => setExpandedLead(expandedLead === getLeadKey(lead) ? null : getLeadKey(lead))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredLeads.length === 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
              <Inbox className="w-8 h-8 text-jhr-white-dim" />
            </div>
            <p className="text-body-md text-jhr-white">
              {searchQuery ? 'No matching leads found' : sourceTab === 'notion' ? 'No leads in Notion' : 'No submissions yet'}
            </p>
            <p className="text-body-sm text-jhr-white-dim mt-1 max-w-md">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : sourceTab === 'notion'
                  ? 'Configure Notion integration in Settings, then use "Sync to Notion" to send existing leads.'
                  : 'When visitors fill out the contact form on your website, their submissions will appear here automatically.'}
            </p>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && (
        <div className="flex items-center justify-between text-body-sm text-jhr-white-dim">
          <p>Showing {filteredLeads.length} of {leads.length} submission{leads.length !== 1 ? 's' : ''}</p>
          <p>Source: {sourceTab === 'notion' ? 'Notion' : 'DynamoDB'}</p>
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, leadName, expanded, onToggle }: { lead: Lead; leadName: string; expanded: boolean; onToggle: () => void }) {
  const status = lead.status || 'new';

  return (
    <>
      <tr className="hover:bg-jhr-black-lighter/50 transition-colors cursor-pointer" onClick={onToggle}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-body-sm text-jhr-white">
              {lead.submittedAt
                ? new Date(lead.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-body-md font-medium text-jhr-white">{leadName}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-body-sm text-jhr-white">{lead.email}</span>
          </div>
        </td>
        <td className="px-6 py-4 hidden md:table-cell">
          <span className="text-body-sm text-jhr-white-dim">{lead.company || '—'}</span>
        </td>
        <td className="px-6 py-4 hidden lg:table-cell">
          <span className="text-body-sm text-jhr-white-dim">{lead.eventType || '—'}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-sm font-medium ${statusStyles[status] || statusStyles.new}`}>
            {statusLabels[status] || status}
          </span>
        </td>
        <td className="px-6 py-4">
          {expanded ? <ChevronUp className="w-4 h-4 text-jhr-white-dim" /> : <ChevronDown className="w-4 h-4 text-jhr-white-dim" />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-jhr-black/50">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Phone:</span>
                  <span className="text-body-sm text-jhr-white">{lead.phone}</span>
                </div>
              )}
              {lead.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Venue:</span>
                  <span className="text-body-sm text-jhr-white">{lead.venue}</span>
                </div>
              )}
              {lead.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Event Date:</span>
                  <span className="text-body-sm text-jhr-white">{lead.eventDate}</span>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 md:hidden">
                  <Building2 className="w-4 h-4 text-jhr-white-dim" />
                  <span className="text-body-sm text-jhr-white-dim">Company:</span>
                  <span className="text-body-sm text-jhr-white">{lead.company}</span>
                </div>
              )}
              {lead.message && (
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-jhr-white-dim mt-0.5" />
                    <div>
                      <span className="text-body-sm text-jhr-white-dim">Message:</span>
                      <p className="text-body-sm text-jhr-white mt-1">{lead.message}</p>
                    </div>
                  </div>
                </div>
              )}
              {lead.submittedAt && (
                <div className="md:col-span-2 text-body-sm text-jhr-white-dim">
                  Submitted: {new Date(lead.submittedAt).toLocaleString('en-US', {
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
