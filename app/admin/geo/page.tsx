'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  RefreshCw,
  Bot,
  FileCode,
  Quote,
  Plus,
  X,
  ExternalLink,
  Shield,
  Search,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

// --- Types ---

interface ScoreBreakdown {
  schema: { score: number; max: number; detail: string };
  faq: { score: number; max: number; detail: string };
  crawlers: { score: number; max: number; detail: string };
  sitemap: { score: number; max: number; detail: string };
  content: { score: number; max: number; detail: string };
  entity: { score: number; max: number; detail: string };
}

interface ScoreData {
  totalScore: number;
  breakdown: ScoreBreakdown;
  checkedAt: string;
}

interface CrawlerInfo {
  name: string;
  status: 'allowed' | 'blocked' | 'not-specified';
  fixLine?: string;
}

interface CrawlerData {
  crawlers: CrawlerInfo[];
  robotsTxtFound: boolean;
}

interface Citation {
  sk: string;
  date: string;
  aiEngine: string;
  query: string;
  citationType: string;
  responseUrl: string;
}

interface SchemaPageInfo {
  page: string;
  path: string;
  url?: string;
  schemaTypes: string[];
  status: 'complete' | 'partial' | 'missing';
}

// --- Constants ---

const SCHEMA_CHECK_PAGES = [
  { label: 'Homepage', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Corporate Event Coverage', path: '/services/corporate-event-coverage' },
  { label: 'Headshot Activation', path: '/services/headshot-activation' },
  { label: 'Executive Imaging', path: '/services/executive-imaging' },
  { label: 'Trade Show Media', path: '/services/trade-show-media' },
  { label: 'Music City Center', path: '/venues/music-city-center' },
  { label: 'Gaylord Opryland', path: '/venues/gaylord-opryland' },
];

const AI_ENGINES = ['ChatGPT', 'Perplexity', 'Google AI Overview', 'Bing Copilot'];
const CITATION_TYPES = ['mentioned', 'linked', 'quoted'];

const SITE_URL = 'https://jhr-photography.com';

// --- Helper Components ---

function ScoreGauge({ score, loading }: { score: number; loading: boolean }) {
  const color = score >= 75 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const bgColor = score >= 75 ? 'bg-green-400/10 border-green-400/30' : score >= 50 ? 'bg-amber-400/10 border-amber-400/30' : 'bg-red-400/10 border-red-400/30';

  if (loading) {
    return (
      <div className="w-40 h-40 rounded-full border-4 border-jhr-black-lighter bg-jhr-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-jhr-white-dim animate-spin" />
      </div>
    );
  }

  return (
    <div className={`w-40 h-40 rounded-full border-4 ${bgColor} flex flex-col items-center justify-center`}>
      <span className={`text-5xl font-bold font-display ${color}`}>{score}</span>
      <span className="text-xs text-jhr-white-dim mt-1">out of 100</span>
    </div>
  );
}

function StatusBadge({ status }: { status: 'allowed' | 'blocked' | 'not-specified' | 'complete' | 'partial' | 'missing' }) {
  const config = {
    allowed: 'bg-green-500/10 text-green-400 border-green-500/20',
    blocked: 'bg-red-500/10 text-red-400 border-red-500/20',
    'not-specified': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    complete: 'bg-green-500/10 text-green-400 border-green-500/20',
    partial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    missing: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config[status]}`}>
      {status.replace('-', ' ')}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-jhr-black-lighter transition-colors" title="Copy to clipboard">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-jhr-white-dim" />}
    </button>
  );
}

// --- Main Page ---

export default function GeoPage() {
  const { data: session } = useSession();

  // Score state
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  // Crawler state
  const [crawlerData, setCrawlerData] = useState<CrawlerData | null>(null);
  const [crawlerLoading, setCrawlerLoading] = useState(false);

  // Schema inventory state
  const [schemaPages, setSchemaPages] = useState<SchemaPageInfo[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Citation state
  const [citations, setCitations] = useState<Citation[]>([]);
  const [citationLoading, setCitationLoading] = useState(false);
  const [showCitationForm, setShowCitationForm] = useState(false);
  const [citationForm, setCitationForm] = useState({
    date: new Date().toISOString().split('T')[0],
    aiEngine: 'ChatGPT',
    query: '',
    citationType: 'mentioned',
    responseUrl: '',
  });
  const [citationSubmitting, setCitationSubmitting] = useState(false);

  // --- Fetch functions ---

  const fetchScore = useCallback(async () => {
    setScoreLoading(true);
    try {
      const res = await fetch('/api/admin/geo/score');
      if (res.ok) {
        const data = await res.json();
        setScoreData(data);
      }
    } catch {
      // silently fail
    } finally {
      setScoreLoading(false);
    }
  }, []);

  const fetchCrawlers = useCallback(async () => {
    setCrawlerLoading(true);
    try {
      const res = await fetch('/api/admin/geo/crawlers');
      if (res.ok) {
        const data = await res.json();
        setCrawlerData(data);
      }
    } catch {
      // silently fail
    } finally {
      setCrawlerLoading(false);
    }
  }, []);

  const fetchSchemaInventory = useCallback(async () => {
    setSchemaLoading(true);
    try {
      const res = await fetch('/api/admin/geo/schemas');
      if (res.ok) {
        const data = await res.json();
        const results: SchemaPageInfo[] = (data.pages || []).map(
          (p: { page: string; url: string; schemas: { type: string; valid: boolean }[] }) => {
            const schemaTypes = [...new Set(p.schemas.filter((s) => s.valid).map((s) => s.type))];
            const status = schemaTypes.length >= 2 ? 'complete' : schemaTypes.length === 1 ? 'partial' : 'missing';
            // Extract path from URL
            let path = '/';
            try {
              path = new URL(p.url).pathname;
            } catch {
              // keep default
            }
            return { page: p.page, path, url: p.url, schemaTypes, status };
          }
        );
        setSchemaPages(results);
      }
    } catch {
      // silently fail
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  const fetchCitations = useCallback(async () => {
    setCitationLoading(true);
    try {
      const res = await fetch('/api/admin/geo/citations');
      if (res.ok) {
        const data = await res.json();
        setCitations(data.citations || []);
      }
    } catch {
      // silently fail
    } finally {
      setCitationLoading(false);
    }
  }, []);

  const handleAddCitation = async () => {
    setCitationSubmitting(true);
    try {
      const res = await fetch('/api/admin/geo/citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citationForm),
      });
      if (res.ok) {
        setShowCitationForm(false);
        setCitationForm({
          date: new Date().toISOString().split('T')[0],
          aiEngine: 'ChatGPT',
          query: '',
          citationType: 'mentioned',
          responseUrl: '',
        });
        fetchCitations();
      }
    } catch {
      // silently fail
    } finally {
      setCitationSubmitting(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchScore();
      fetchCrawlers();
      fetchCitations();
      fetchSchemaInventory();
    }
  }, [session, fetchScore, fetchCrawlers, fetchCitations, fetchSchemaInventory]);

  const breakdownLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    schema: { label: 'Organization JSON-LD', icon: <FileCode className="w-4 h-4" /> },
    faq: { label: 'FAQPage Schema (3+ pages)', icon: <FileCode className="w-4 h-4" /> },
    crawlers: { label: 'AI Crawler Access', icon: <Bot className="w-4 h-4" /> },
    sitemap: { label: 'Sitemap Submitted', icon: <Search className="w-4 h-4" /> },
    content: { label: 'Citable Content', icon: <FileCode className="w-4 h-4" /> },
    entity: { label: 'Entity Definition (About)', icon: <Shield className="w-4 h-4" /> },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-display-sm font-display font-bold text-jhr-white">GEO Readiness Tracker</h1>
        <p className="mt-2 text-body-md text-jhr-white-dim">
          Monitor how well your site is optimized for AI-powered search engines and generative answers.
        </p>
      </div>

      {/* GEO Readiness Score */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-jhr-white">GEO Readiness Score</h2>
          <button
            onClick={fetchScore}
            disabled={scoreLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold/10 text-jhr-gold hover:bg-jhr-gold/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${scoreLoading ? 'animate-spin' : ''}`} />
            Recalculate
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Gauge */}
          <div className="flex-shrink-0">
            <ScoreGauge score={scoreData?.totalScore ?? 0} loading={scoreLoading} />
          </div>

          {/* Breakdown Table */}
          <div className="flex-1 w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pr-4">Category</th>
                  <th className="text-center text-xs font-medium text-jhr-white-dim py-2 px-4 w-24">Score</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pl-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {scoreData && Object.entries(scoreData.breakdown).map(([key, val]) => {
                  const meta = breakdownLabels[key];
                  const isPerfect = val.score === val.max;
                  return (
                    <tr key={key} className="border-b border-jhr-black-lighter/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-jhr-white-dim">{meta?.icon}</span>
                          <span className="text-sm text-jhr-white">{meta?.label || key}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-sm font-medium ${isPerfect ? 'text-green-400' : 'text-amber-400'}`}>
                          {val.score}/{val.max}
                        </span>
                      </td>
                      <td className="py-3 pl-4">
                        <span className="text-xs text-jhr-white-dim">{val.detail}</span>
                      </td>
                    </tr>
                  );
                })}
                {!scoreData && !scoreLoading && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-jhr-white-dim text-sm">
                      Click &quot;Recalculate&quot; to run the GEO readiness audit.
                    </td>
                  </tr>
                )}
                {scoreLoading && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-jhr-white-dim text-sm">
                      Analyzing site pages... this may take a moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {scoreData?.checkedAt && (
              <p className="mt-3 text-xs text-jhr-white-dim">
                Last checked: {new Date(scoreData.checkedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Crawler Access Panel */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-jhr-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-jhr-gold" />
            AI Crawler Access
          </h2>
          <button
            onClick={fetchCrawlers}
            disabled={crawlerLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${crawlerLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {crawlerLoading && (
          <p className="text-sm text-jhr-white-dim py-4">Checking robots.txt...</p>
        )}

        {crawlerData && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pr-4">Crawler</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4">Status</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pl-4">Fix</th>
                </tr>
              </thead>
              <tbody>
                {crawlerData.crawlers.map((crawler) => (
                  <tr key={crawler.name} className="border-b border-jhr-black-lighter/50">
                    <td className="py-3 pr-4">
                      <span className="text-sm font-medium text-jhr-white">{crawler.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={crawler.status} />
                    </td>
                    <td className="py-3 pl-4">
                      {crawler.fixLine ? (
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-jhr-black rounded px-2 py-1 text-jhr-white-dim font-mono whitespace-pre">
                            {crawler.fixLine}
                          </code>
                          <CopyButton text={crawler.fixLine} />
                        </div>
                      ) : (
                        <span className="text-xs text-green-400">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!crawlerData.robotsTxtFound && (
              <p className="mt-3 text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                No robots.txt found. All crawlers are allowed by default.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Schema Inventory */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-jhr-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-jhr-gold" />
            Schema Inventory
          </h2>
          <button
            onClick={fetchSchemaInventory}
            disabled={schemaLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${schemaLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {schemaLoading && (
          <p className="text-sm text-jhr-white-dim py-4">Scanning pages for structured data...</p>
        )}

        {schemaPages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pr-4">Page</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4">Schema Types Found</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pl-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {schemaPages.map((page) => (
                  <tr key={page.path} className="border-b border-jhr-black-lighter/50">
                    <td className="py-3 pr-4">
                      <div>
                        <span className="text-sm font-medium text-jhr-white">{page.page}</span>
                        <span className="block text-xs text-jhr-white-dim">{page.path}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {page.schemaTypes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {page.schemaTypes.map((type) => (
                            <span key={type} className="inline-flex px-2 py-0.5 rounded bg-jhr-gold/10 text-xs text-jhr-gold">
                              {type}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-jhr-white-dim">None</span>
                      )}
                    </td>
                    <td className="py-3 pl-4">
                      <StatusBadge status={page.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!schemaLoading && schemaPages.length === 0 && (
          <p className="text-sm text-jhr-white-dim py-4">Click &quot;Refresh&quot; to scan pages for structured data.</p>
        )}
      </div>

      {/* Citation Log */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-jhr-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-jhr-gold" />
            Citation Log
          </h2>
          <button
            onClick={() => setShowCitationForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold/10 text-jhr-gold hover:bg-jhr-gold/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Citation
          </button>
        </div>

        {/* Inline Add Citation Form */}
        {showCitationForm && (
          <div className="mb-6 p-4 rounded-lg border border-jhr-black-lighter bg-jhr-black">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-jhr-white">Log a New Citation</h3>
              <button onClick={() => setShowCitationForm(false)} className="text-jhr-white-dim hover:text-jhr-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-jhr-white-dim mb-1">Date</label>
                <input
                  type="date"
                  value={citationForm.date}
                  onChange={(e) => setCitationForm({ ...citationForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white text-sm focus:outline-none focus:border-jhr-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-jhr-white-dim mb-1">AI Engine</label>
                <select
                  value={citationForm.aiEngine}
                  onChange={(e) => setCitationForm({ ...citationForm, aiEngine: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white text-sm focus:outline-none focus:border-jhr-gold"
                >
                  {AI_ENGINES.map((engine) => (
                    <option key={engine} value={engine}>{engine}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-jhr-white-dim mb-1">Query Used</label>
                <input
                  type="text"
                  value={citationForm.query}
                  onChange={(e) => setCitationForm({ ...citationForm, query: e.target.value })}
                  placeholder="e.g., Nashville corporate event photographer"
                  className="w-full px-3 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white text-sm placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-jhr-white-dim mb-1">Citation Type</label>
                <select
                  value={citationForm.citationType}
                  onChange={(e) => setCitationForm({ ...citationForm, citationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white text-sm focus:outline-none focus:border-jhr-gold"
                >
                  {CITATION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-jhr-white-dim mb-1">Response URL (optional)</label>
                <input
                  type="url"
                  value={citationForm.responseUrl}
                  onChange={(e) => setCitationForm({ ...citationForm, responseUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white text-sm placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCitationForm(false)}
                className="px-4 py-2 rounded-lg text-sm text-jhr-white-dim hover:text-jhr-white border border-jhr-black-lighter hover:bg-jhr-black-lighter transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCitation}
                disabled={citationSubmitting || !citationForm.query}
                className="px-4 py-2 rounded-lg text-sm bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
              >
                {citationSubmitting ? 'Saving...' : 'Save Citation'}
              </button>
            </div>
          </div>
        )}

        {/* Citations Table */}
        {citationLoading && (
          <p className="text-sm text-jhr-white-dim py-4">Loading citations...</p>
        )}

        {!citationLoading && citations.length === 0 && (
          <div className="text-center py-12">
            <Quote className="w-10 h-10 text-jhr-white-dim/30 mx-auto mb-3" />
            <p className="text-sm text-jhr-white-dim">
              No citations logged yet. Track when JHR Photography appears in AI-powered answers.
            </p>
          </div>
        )}

        {citations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pr-4">Date</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4">AI Engine</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4">Query</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 px-4">Type</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim py-2 pl-4">URL</th>
                </tr>
              </thead>
              <tbody>
                {citations.map((citation) => (
                  <tr key={citation.sk} className="border-b border-jhr-black-lighter/50">
                    <td className="py-3 pr-4">
                      <span className="text-sm text-jhr-white">{citation.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-jhr-white">{citation.aiEngine}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-jhr-white-dim">{citation.query}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={citation.citationType === 'quoted' ? 'complete' : citation.citationType === 'linked' ? 'partial' : 'not-specified'}
                      />
                    </td>
                    <td className="py-3 pl-4">
                      {citation.responseUrl ? (
                        <a
                          href={citation.responseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-jhr-gold hover:text-jhr-gold/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-jhr-white-dim">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
