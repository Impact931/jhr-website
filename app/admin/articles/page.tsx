'use client';

import { useState, useCallback } from 'react';
import {
  Wand2,
  Search,
  Layers,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  Link as LinkIcon,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'generate' | 'batch' | 'articles';

interface ResearchResult {
  stats: Array<{ text: string; source: string; year: number }>;
  authorityLinks: Array<{ url: string; domainType: string }>;
  expertQuotes: Array<{ quote: string; author: string }>;
  relatedQuestions: string[];
}

interface ValidationResult {
  passes: Array<{ label: string }>;
  fails: Array<{ label: string; detail?: string }>;
}

interface GenerationResult {
  title: string;
  slug: string;
  geoScore: number;
  validation: ValidationResult;
  wordCount: number;
  readingTime: number;
  internalLinks: number;
  externalLinks: number;
}

interface BatchRow {
  id: string;
  topic: string;
  keyword: string;
  icp: string;
  articleType: string;
  status: 'pending' | 'generating' | 'complete' | 'failed';
  result?: GenerationResult;
  error?: string;
}

interface ArticleRecord {
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'failed';
  geoScore: number;
  geoScoreNotes?: string;
  highGeoPriority?: boolean;
  createdAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ICP_OPTIONS = [
  { value: 'ICP-1', label: 'ICP-1 Convention Planners' },
  { value: 'ICP-2', label: 'ICP-2 Enterprise Marketing' },
  { value: 'ICP-3', label: 'ICP-3 Trade Show Exhibitors' },
  { value: 'ICP-4', label: 'ICP-4 Venue Partners' },
];

const ARTICLE_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Statistics Hub', value: 'statistics-hub' },
  { label: 'Ultimate Guide', value: 'ultimate-guide' },
  { label: 'Pricing Data', value: 'pricing-data' },
  { label: 'Named Framework', value: 'framework' },
  { label: 'Expert Roundup', value: 'roundup' },
];

const CTA_PATH_OPTIONS = [
  '/schedule',
  '/services/corporate-event-coverage',
  '/services/headshot-activation',
  '/services/executive-imaging',
  '/services/trade-show-media',
];

const SERVICES = [
  'Corporate Event Coverage',
  'Headshot Activation',
  'Executive Imaging',
  'Trade Show Media',
  'Convention Media',
  'Social Networking Media',
];

const LOCATIONS = [
  'Nashville',
  'Music City Center',
  'Gaylord Opryland',
  'Convention Center',
];

const TABS: { id: TabId; label: string; icon: typeof Wand2 }[] = [
  { id: 'generate', label: 'Generate Article', icon: Wand2 },
  { id: 'batch', label: 'Batch Generator', icon: Layers },
  { id: 'articles', label: 'Generated Articles', icon: FileText },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function geoScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function geoScoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function statusBadge(status: string) {
  const config: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    published: { bg: 'bg-green-500/20', text: 'text-green-400' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400' },
    pending: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    generating: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    complete: { bg: 'bg-green-500/20', text: 'text-green-400' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function domainTypeBadge(domainType: string) {
  const colors: Record<string, string> = {
    government: 'bg-blue-500/20 text-blue-400',
    academic: 'bg-purple-500/20 text-purple-400',
    industry: 'bg-green-500/20 text-green-400',
    news: 'bg-yellow-500/20 text-yellow-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[domainType] || 'bg-gray-500/20 text-gray-400'}`}>
      {domainType}
    </span>
  );
}

let rowIdCounter = 0;
function nextRowId() {
  return `row-${++rowIdCounter}-${Date.now()}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ArticlesDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('generate');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-jhr-white">ContentOps</h1>
        <p className="text-jhr-white-dim mt-1">AI-powered article generation and management</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-jhr-black-light rounded-lg p-1 border border-jhr-black-lighter">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-jhr-gold text-jhr-black'
                  : 'text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'generate' && <GenerateTab />}
      {activeTab === 'batch' && <BatchTab />}
      {activeTab === 'articles' && <ArticlesTab />}
    </div>
  );
}

// ─── Generate Tab ────────────────────────────────────────────────────────────

function GenerateTab() {
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [icp, setIcp] = useState('ICP-1');
  const [articleType, setArticleType] = useState('standard');
  const [wordCount, setWordCount] = useState(1200);
  const [ctaPath, setCtaPath] = useState('/schedule');

  const [researchLoading, setResearchLoading] = useState(false);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchOpen, setResearchOpen] = useState(true);

  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState<GenerationResult | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [publishLoading, setPublishLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const formPayload = useCallback(() => ({
    topic,
    primaryKeyword: keyword,
    icpTag: icp,
    articleType,
    wordCountTarget: wordCount,
    ctaPath,
  }), [topic, keyword, icp, articleType, wordCount, ctaPath]);

  const handleResearch = async () => {
    if (!topic || !keyword) return;
    setResearchLoading(true);
    setResearchError(null);
    setResearchResult(null);
    try {
      const res = await fetch('/api/admin/contentops/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload()),
      });
      if (!res.ok) throw new Error(await res.text() || 'Research failed');
      const data = await res.json();
      setResearchResult(data);
      setResearchOpen(true);
    } catch (err: unknown) {
      setResearchError(err instanceof Error ? err.message : 'Research failed');
    } finally {
      setResearchLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic || !keyword) return;
    setGenerateLoading(true);
    setGenerateError(null);
    setGenerateResult(null);
    setPublishSuccess(false);
    try {
      const res = await fetch('/api/admin/contentops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload()),
      });
      if (!res.ok) throw new Error(await res.text() || 'Generation failed');
      const data = await res.json();
      setGenerateResult(data);
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generateResult) return;
    setPublishLoading(true);
    try {
      const res = await fetch('/api/admin/contentops/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: generateResult.slug }),
      });
      if (!res.ok) throw new Error(await res.text() || 'Publish failed');
      setPublishSuccess(true);
    } catch {
      // silently fail for now, user can retry
    } finally {
      setPublishLoading(false);
    }
  };

  const isFormValid = topic.trim() && keyword.trim();

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <h2 className="text-lg font-semibold text-jhr-white mb-4">Article Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Topic */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Corporate Event Photography at Gaylord Opryland"
              className="w-full bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold transition-colors"
            />
          </div>

          {/* Primary Keyword */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">Primary Keyword *</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. corporate event photographer nashville"
              className="w-full bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold transition-colors"
            />
          </div>

          {/* ICP Target */}
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">ICP Target</label>
            <select
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              className="w-full bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white focus:outline-none focus:border-jhr-gold transition-colors"
            >
              {ICP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Article Type */}
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">Article Type</label>
            <select
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              className="w-full bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white focus:outline-none focus:border-jhr-gold transition-colors"
            >
              {ARTICLE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Word Count */}
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">
              Word Count Target: {wordCount}
            </label>
            <input
              type="range"
              min={1000}
              max={1800}
              step={100}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-jhr-gold"
            />
            <div className="flex justify-between text-xs text-jhr-white-dim mt-1">
              <span>1000</span>
              <span>1800</span>
            </div>
          </div>

          {/* CTA Path */}
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">CTA Path</label>
            <select
              value={ctaPath}
              onChange={(e) => setCtaPath(e.target.value)}
              className="w-full bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white focus:outline-none focus:border-jhr-gold transition-colors"
            >
              {CTA_PATH_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleResearch}
            disabled={!isFormValid || researchLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white hover:border-jhr-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {researchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Research First
          </button>
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || generateLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-jhr-gold text-jhr-black rounded-lg font-medium hover:bg-jhr-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generateLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            Generate Article
          </button>
        </div>
      </div>

      {/* Research Error */}
      {researchError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Research Failed</p>
            <p className="text-red-400/80 text-sm mt-1">{researchError}</p>
          </div>
        </div>
      )}

      {/* Research Result */}
      {researchResult && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter">
          <button
            onClick={() => setResearchOpen(!researchOpen)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-jhr-gold" />
              <h3 className="text-lg font-semibold text-jhr-white">Research Preview</h3>
            </div>
            {researchOpen ? (
              <ChevronDown className="w-5 h-5 text-jhr-white-dim" />
            ) : (
              <ChevronRight className="w-5 h-5 text-jhr-white-dim" />
            )}
          </button>
          {researchOpen && (
            <div className="px-4 pb-4 space-y-4 border-t border-jhr-black-lighter pt-4">
              {/* Stats Found */}
              {researchResult.stats.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Stats Found ({researchResult.stats.length})
                  </h4>
                  <ul className="space-y-1.5">
                    {researchResult.stats.map((stat, i) => (
                      <li key={i} className="text-sm text-jhr-white flex items-start gap-2">
                        <span className="text-jhr-gold mt-0.5">-</span>
                        <span>{stat.text}</span>
                        <span className="text-jhr-white-dim text-xs ml-auto flex-shrink-0">
                          {stat.source} ({stat.year})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Authority Links */}
              {researchResult.authorityLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Authority Links ({researchResult.authorityLinks.length})
                  </h4>
                  <ul className="space-y-1.5">
                    {researchResult.authorityLinks.map((link, i) => (
                      <li key={i} className="text-sm text-jhr-white flex items-center gap-2">
                        {domainTypeBadge(link.domainType)}
                        <span className="truncate">{link.url}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Expert Quotes */}
              {researchResult.expertQuotes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Expert Quotes ({researchResult.expertQuotes.length})
                  </h4>
                  <ul className="space-y-2">
                    {researchResult.expertQuotes.map((q, i) => (
                      <li key={i} className="text-sm">
                        <p className="text-jhr-white italic">&ldquo;{q.quote}&rdquo;</p>
                        <p className="text-jhr-white-dim text-xs mt-0.5">&mdash; {q.author}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Questions */}
              {researchResult.relatedQuestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2">Related Questions</h4>
                  <ul className="space-y-1">
                    {researchResult.relatedQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-jhr-white flex items-center gap-2">
                        <span className="text-jhr-gold">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generate Error */}
      {generateError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Generation Failed</p>
            <p className="text-red-400/80 text-sm mt-1">{generateError}</p>
          </div>
        </div>
      )}

      {/* Generate Loading */}
      {generateLoading && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
          <p className="text-jhr-white-dim">Generating article...</p>
        </div>
      )}

      {/* Generate Result */}
      {generateResult && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-jhr-white">{generateResult.title}</h3>
              <p className="text-sm text-jhr-white-dim mt-1">/blog/{generateResult.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/blog/${generateResult.slug}?editMode=true`}
                className="flex items-center gap-2 px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white hover:border-jhr-gold text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Draft
              </Link>
              <button
                onClick={handlePublish}
                disabled={publishLoading || publishSuccess}
                className="flex items-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black rounded-lg font-medium text-sm hover:bg-jhr-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {publishLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : publishSuccess ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {publishSuccess ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>

          {/* GEO Score */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-jhr-white-dim">GEO Score</span>
              <span className={`text-sm font-bold ${geoScoreTextColor(generateResult.geoScore)}`}>
                {generateResult.geoScore}/100
              </span>
            </div>
            <div className="w-full bg-jhr-black rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${geoScoreColor(generateResult.geoScore)}`}
                style={{ width: `${generateResult.geoScore}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-jhr-black rounded-lg p-3 text-center">
              <p className="text-xs text-jhr-white-dim mb-1">Words</p>
              <p className="text-lg font-semibold text-jhr-white">{generateResult.wordCount.toLocaleString()}</p>
            </div>
            <div className="bg-jhr-black rounded-lg p-3 text-center">
              <p className="text-xs text-jhr-white-dim mb-1">Reading Time</p>
              <p className="text-lg font-semibold text-jhr-white flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-jhr-white-dim" />
                {generateResult.readingTime}m
              </p>
            </div>
            <div className="bg-jhr-black rounded-lg p-3 text-center">
              <p className="text-xs text-jhr-white-dim mb-1">Internal Links</p>
              <p className="text-lg font-semibold text-jhr-white">{generateResult.internalLinks}</p>
            </div>
            <div className="bg-jhr-black rounded-lg p-3 text-center">
              <p className="text-xs text-jhr-white-dim mb-1">External Links</p>
              <p className="text-lg font-semibold text-jhr-white">{generateResult.externalLinks}</p>
            </div>
          </div>

          {/* Validation */}
          <div>
            <h4 className="text-sm font-medium text-jhr-white-dim mb-2">Validation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {generateResult.validation.passes.map((p, i) => (
                <div key={`pass-${i}`} className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {p.label}
                </div>
              ))}
              {generateResult.validation.fails.map((f, i) => (
                <div key={`fail-${i}`} className="flex items-start gap-2 text-sm text-red-400">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    {f.label}
                    {f.detail && <p className="text-xs text-red-400/70 mt-0.5">{f.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Batch Tab ───────────────────────────────────────────────────────────────

function BatchTab() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [matrixService, setMatrixService] = useState(SERVICES[0]);
  const [matrixLocation, setMatrixLocation] = useState(LOCATIONS[0]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const [batchError, setBatchError] = useState<string | null>(null);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: nextRowId(),
        topic: '',
        keyword: '',
        icp: 'ICP-1',
        articleType: 'standard',
        status: 'pending',
      },
    ]);
  };

  const addCombo = () => {
    const topic = `${matrixService} at ${matrixLocation}`;
    const keyword = `${matrixService.toLowerCase()} ${matrixLocation.toLowerCase()} photographer`;
    setRows((prev) => [
      ...prev,
      {
        id: nextRowId(),
        topic,
        keyword,
        icp: 'ICP-1',
        articleType: 'standard',
        status: 'pending',
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: keyof BatchRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleBatchGenerate = async () => {
    if (rows.length === 0) return;
    setBatchRunning(true);
    setBatchError(null);
    setBatchProgress({ done: 0, total: rows.length });

    // Mark all rows as pending
    setRows((prev) => prev.map((r) => ({ ...r, status: 'pending' as const, result: undefined, error: undefined })));

    try {
      const res = await fetch('/api/admin/contentops/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: rows.map((r) => ({
            topic: r.topic,
            primaryKeyword: r.keyword,
            icpTag: r.icp,
            articleType: r.articleType,
          })),
        }),
      });

      if (!res.ok) throw new Error(await res.text() || 'Batch generation failed');

      const data = await res.json();

      // Update rows with results
      if (data.results && Array.isArray(data.results)) {
        setRows((prev) =>
          prev.map((r, i) => {
            const result = data.results[i];
            if (!result) return r;
            return {
              ...r,
              status: result.error ? 'failed' : 'complete',
              result: result.error ? undefined : result,
              error: result.error,
            };
          })
        );
        setBatchProgress({ done: data.results.length, total: rows.length });
      }
    } catch (err: unknown) {
      setBatchError(err instanceof Error ? err.message : 'Batch generation failed');
    } finally {
      setBatchRunning(false);
    }
  };

  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Matrix Helper */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
        <h2 className="text-lg font-semibold text-jhr-white mb-4">Service x Location Matrix</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">Service</label>
            <select
              value={matrixService}
              onChange={(e) => setMatrixService(e.target.value)}
              className="bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white focus:outline-none focus:border-jhr-gold transition-colors"
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-jhr-white-dim mb-1">Location</label>
            <select
              value={matrixLocation}
              onChange={(e) => setMatrixLocation(e.target.value)}
              className="bg-jhr-black border border-jhr-black-lighter rounded-lg px-4 py-2.5 text-jhr-white focus:outline-none focus:border-jhr-gold transition-colors"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <button
            onClick={addCombo}
            className="flex items-center gap-2 px-4 py-2.5 bg-jhr-gold text-jhr-black rounded-lg font-medium hover:bg-jhr-gold/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Combo
          </button>
        </div>
      </div>

      {/* Batch Table */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter">
        <div className="flex items-center justify-between p-4 border-b border-jhr-black-lighter">
          <h2 className="text-lg font-semibold text-jhr-white">
            Batch Queue ({rows.length} article{rows.length !== 1 ? 's' : ''})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-3 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white text-sm hover:border-jhr-gold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
            <button
              onClick={handleBatchGenerate}
              disabled={rows.length === 0 || batchRunning || pendingCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-jhr-gold text-jhr-black rounded-lg font-medium text-sm hover:bg-jhr-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {batchRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Generate All
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {batchRunning && (
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between text-sm text-jhr-white-dim mb-1">
              <span>Progress</span>
              <span>{batchProgress.done} of {batchProgress.total} complete</span>
            </div>
            <div className="w-full bg-jhr-black rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-jhr-gold rounded-full transition-all"
                style={{ width: `${batchProgress.total ? (batchProgress.done / batchProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Batch Error */}
        {batchError && (
          <div className="mx-4 mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{batchError}</p>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <Layers className="w-10 h-10 text-jhr-white-dim/30 mx-auto mb-3" />
            <p className="text-jhr-white-dim">No articles in queue. Add rows manually or use the matrix helper above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jhr-black-lighter">
                  <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Topic</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Keyword</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim p-3">ICP</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Type</th>
                  <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Status</th>
                  <th className="text-right text-xs font-medium text-jhr-white-dim p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-jhr-black-lighter/50 last:border-0">
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.topic}
                        onChange={(e) => updateRow(row.id, 'topic', e.target.value)}
                        disabled={row.status !== 'pending'}
                        placeholder="Topic"
                        className="w-full bg-jhr-black border border-jhr-black-lighter rounded px-2 py-1.5 text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold disabled:opacity-50 transition-colors"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.keyword}
                        onChange={(e) => updateRow(row.id, 'keyword', e.target.value)}
                        disabled={row.status !== 'pending'}
                        placeholder="Keyword"
                        className="w-full bg-jhr-black border border-jhr-black-lighter rounded px-2 py-1.5 text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:border-jhr-gold disabled:opacity-50 transition-colors"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={row.icp}
                        onChange={(e) => updateRow(row.id, 'icp', e.target.value)}
                        disabled={row.status !== 'pending'}
                        className="bg-jhr-black border border-jhr-black-lighter rounded px-2 py-1.5 text-sm text-jhr-white focus:outline-none focus:border-jhr-gold disabled:opacity-50 transition-colors"
                      >
                        {ICP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.value}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={row.articleType}
                        onChange={(e) => updateRow(row.id, 'articleType', e.target.value)}
                        disabled={row.status !== 'pending'}
                        className="bg-jhr-black border border-jhr-black-lighter rounded px-2 py-1.5 text-sm text-jhr-white focus:outline-none focus:border-jhr-gold disabled:opacity-50 transition-colors"
                      >
                        {ARTICLE_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {row.status === 'generating' && (
                          <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                        )}
                        {statusBadge(row.status)}
                      </div>
                      {row.result && (
                        <span className={`text-xs ${geoScoreTextColor(row.result.geoScore)} mt-1 block`}>
                          GEO: {row.result.geoScore}
                        </span>
                      )}
                      {row.error && (
                        <span className="text-xs text-red-400 mt-1 block truncate max-w-[150px]" title={row.error}>
                          {row.error}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.result && (
                          <Link
                            href={`/blog/${row.result.slug}?editMode=true`}
                            className="p-1.5 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                            title="View Draft"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={row.status === 'generating'}
                          className="p-1.5 text-jhr-white-dim hover:text-red-400 disabled:opacity-30 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

// ─── Articles Tab ────────────────────────────────────────────────────────────

function ArticlesTab() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/contentops/status');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => {
    fetchArticles();
  });

  const handlePublish = async (slug: string) => {
    setActionLoading(slug);
    try {
      const res = await fetch('/api/admin/contentops/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error('Publish failed');
      setArticles((prev) =>
        prev.map((a) => (a.slug === slug ? { ...a, status: 'published' as const } : a))
      );
    } catch {
      // Ignore for now
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete article "${slug}"?`)) return;
    setActionLoading(slug);
    try {
      const res = await fetch(`/api/admin/contentops/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error('Delete failed');
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    } catch {
      // Ignore for now
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <p className="text-jhr-white-dim">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-red-400 font-medium">Failed to load articles</p>
          <p className="text-red-400/80 text-sm mt-1">{error}</p>
          <button
            onClick={fetchArticles}
            className="mt-2 text-sm text-jhr-gold hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter">
      <div className="flex items-center justify-between p-4 border-b border-jhr-black-lighter">
        <h2 className="text-lg font-semibold text-jhr-white">
          Generated Articles ({articles.length})
        </h2>
        <button
          onClick={fetchArticles}
          className="text-sm text-jhr-white-dim hover:text-jhr-gold transition-colors"
        >
          Refresh
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center">
          <FileText className="w-10 h-10 text-jhr-white-dim/30 mx-auto mb-3" />
          <p className="text-jhr-white-dim">No articles generated yet. Use the Generate tab to create your first article.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-jhr-black-lighter">
                <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Title</th>
                <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Status</th>
                <th className="text-left text-xs font-medium text-jhr-white-dim p-3">GEO Score</th>
                <th className="text-left text-xs font-medium text-jhr-white-dim p-3">Date</th>
                <th className="text-right text-xs font-medium text-jhr-white-dim p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.slug} className="border-b border-jhr-black-lighter/50 last:border-0 hover:bg-jhr-black-lighter/20">
                  <td className="p-3">
                    <p className="text-sm text-jhr-white font-medium">{article.title}</p>
                    <p className="text-xs text-jhr-white-dim mt-0.5">/blog/{article.slug}</p>
                  </td>
                  <td className="p-3">{statusBadge(article.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-jhr-black rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${geoScoreColor(article.geoScore)}`}
                          style={{ width: `${article.geoScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${geoScoreTextColor(article.geoScore)}`}>
                        {article.geoScore}
                      </span>
                      {article.highGeoPriority && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 uppercase tracking-wide" title="High GEO Priority">
                          HI-GEO
                        </span>
                      )}
                      {article.geoScore < 70 && article.geoScoreNotes && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wide" title={article.geoScoreNotes}>
                          NEEDS WORK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-jhr-white-dim">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${article.slug}?editMode=true`}
                        className="p-1.5 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {article.status === 'draft' && (
                        <button
                          onClick={() => handlePublish(article.slug)}
                          disabled={actionLoading === article.slug}
                          className="p-1.5 text-jhr-white-dim hover:text-green-400 disabled:opacity-30 transition-colors"
                          title="Publish"
                        >
                          {actionLoading === article.slug ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(article.slug)}
                        disabled={actionLoading === article.slug}
                        className="p-1.5 text-jhr-white-dim hover:text-red-400 disabled:opacity-30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
