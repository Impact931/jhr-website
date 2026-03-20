'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Target,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'generate' | 'batch' | 'articles' | 'queue' | 'competitors';

interface QueueRecommendation {
  id: string;
  keyword: string;
  searchVolume: number;
  cpc: number | null;
  competition: number | null;
  trend: 'rising' | 'falling' | 'stable' | null;
  monthlyTrend: number[];
  currentPosition: number | null;
  currentUrl: string | null;
  recommendedAction: 'optimize' | 'create' | 'refresh';
  suggestedTopic: string;
  suggestedIcp: string;
  suggestedArticleType: string;
  priorityScore: number;
  dataJustification: string;
}

interface QueuePageScore {
  url: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  compositeScore: number;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
}

interface SerpPosition {
  keyword: string;
  position: number | null;
  url: string | null;
  searchVolume: number;
  cpc: number | null;
  competition: number | null;
  trend: 'rising' | 'falling' | 'stable' | null;
  monthlyTrend: number[];
}

interface CompetitorKeywordEntry {
  keyword: string;
  position: number;
  url: string;
  searchVolume: number;
  cpc: number | null;
  competition: number | null;
  ourPosition: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAction: 'create' | 'optimize' | 'overtake';
}

interface CompetitorDomain {
  domain: string;
  organicCount: number;
  avgPosition: number;
  estimatedTraffic: number;
  topKeywords: CompetitorKeywordEntry[];
}

interface CompetitorData {
  generatedAt: string;
  cachedUntil: string;
  gscConnected: boolean;
  dataforseoConnected: boolean;
  competitors: CompetitorDomain[];
  totalOpportunities: number;
  totalEasyWins: number;
  totalContentGaps: number;
}

interface QueueData {
  generatedAt: string;
  cachedUntil: string;
  gscConnected: boolean;
  dataforseoConnected: boolean;
  summary: {
    totalPages: number;
    totalOpportunities: number;
    strikeDistanceKeywords: number;
    contentGaps: number;
    tierDistribution: Record<string, number>;
  };
  pages: QueuePageScore[];
  recommendations: QueueRecommendation[];
  serpPositions: SerpPosition[];
}

interface Prefill {
  topic: string;
  keyword: string;
  icp: string;
  articleType: string;
}

interface ResearchResult {
  stats: Array<{ text: string; source: string; year: number }>;
  authorityLinks: Array<{ url: string; domainType: string }>;
  expertQuotes: Array<{ quote: string; author: string }>;
  relatedQuestions: string[];
  localInsights: Array<{ insight: string; source: string }>;
  contentGaps: string[];
  geoAnswerFragments: Array<{ question: string; answer: string }>;
  topicClusterKeywords: string[];
}

interface ValidationResult {
  passes: Array<{ label: string }>;
  fails: Array<{ label: string; detail?: string }>;
}

interface ProofingIssue {
  severity: 'critical' | 'warning' | 'suggestion';
  category: 'brand-voice' | 'ai-slop' | 'geo' | 'seo' | 'nashville' | 'structure';
  description: string;
  location?: string;
  fix?: string;
}

interface ProofingResult {
  passed: boolean;
  overallScore: number;
  brandVoiceScore: number;
  geoReadiness: number;
  seoScore: number;
  issues: ProofingIssue[];
}

interface PreFlightResult {
  passed: boolean;
  intent: {
    type: 'informational' | 'commercial' | 'transactional' | 'navigational';
    confidence: 'high' | 'medium' | 'low';
    recommendedPageType: string;
    reasoning: string;
  };
  cannibalization: {
    clear: boolean;
    overlaps: Array<{
      existingPage: string;
      matchType: string;
      recommendation: string;
    }>;
  };
  keywordCluster: {
    cluster: string | null;
    existingPages: string[];
    isNewCluster: boolean;
  };
  warnings: Array<{ code: string; message: string; detail?: string }>;
  blocks: Array<{ code: string; message: string; detail?: string }>;
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
  proofing?: ProofingResult;
  quickAnswer?: string;
  metaDescription?: string;
  preFlight?: PreFlightResult | null;
  lessonsLoaded?: number;
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
  { id: 'queue', label: 'Content Queue', icon: Target },
  { id: 'competitors', label: 'Competitors', icon: Shield },
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
  const [activeTab, setActiveTab] = useState<TabId>('queue');
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  const handleGenerateFromQueue = useCallback((rec: QueueRecommendation) => {
    setPrefill({
      topic: rec.suggestedTopic,
      keyword: rec.keyword,
      icp: rec.suggestedIcp,
      articleType: rec.suggestedArticleType,
    });
    setActiveTab('generate');
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-jhr-white">ContentOps</h1>
        <p className="text-jhr-white-dim mt-1">SEO-driven content generation and management</p>
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
      {activeTab === 'queue' && <ContentQueueTab onGenerateClick={handleGenerateFromQueue} />}
      {activeTab === 'competitors' && <CompetitorTab onGenerateClick={handleGenerateFromQueue} />}
      {activeTab === 'generate' && <GenerateTab prefill={prefill} onPrefillConsumed={() => setPrefill(null)} />}
      {activeTab === 'batch' && <BatchTab />}
      {activeTab === 'articles' && <ArticlesTab />}
    </div>
  );
}

// ─── Generate Tab ────────────────────────────────────────────────────────────

function GenerateTab({ prefill, onPrefillConsumed }: { prefill?: Prefill | null; onPrefillConsumed?: () => void }) {
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [icp, setIcp] = useState('ICP-1');
  const [articleType, setArticleType] = useState('standard');
  const [wordCount, setWordCount] = useState(1200);
  const [ctaPath, setCtaPath] = useState('/schedule');

  // Apply prefill values from Content Queue
  useEffect(() => {
    if (prefill) {
      setTopic(prefill.topic);
      setKeyword(prefill.keyword);
      setIcp(prefill.icp);
      setArticleType(prefill.articleType);
      onPrefillConsumed?.();
    }
  }, [prefill, onPrefillConsumed]);

  const [researchLoading, setResearchLoading] = useState(false);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchOpen, setResearchOpen] = useState(true);
  const [researchSavedId, setResearchSavedId] = useState<string | null>(null);
  const [researchProvider, setResearchProvider] = useState<string | null>(null);
  const [researchDbId, setResearchDbId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawResearch, setRawResearch] = useState<any>(null);

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
    setResearchSavedId(null);
    setResearchProvider(null);
    setResearchDbId(null);
    setRawResearch(null);
    try {
      const res = await fetch('/api/admin/contentops/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload()),
      });
      if (!res.ok) throw new Error(await res.text() || 'Research failed');
      const data = await res.json();
      const research = data.research || {};
      setRawResearch(research);
      setResearchResult({
        stats: (research.currentStats || []).map((s: { stat: string; source: string }) => ({
          text: s.stat,
          source: s.source,
          year: new Date().getFullYear(),
        })),
        authorityLinks: (research.authorityLinks || []).map((l: { url: string; domain: string }) => ({
          url: l.url,
          domainType: l.domain,
        })),
        expertQuotes: (research.expertQuotes || []).map((q: { quote: string; attribution: string }) => ({
          quote: q.quote,
          author: q.attribution,
        })),
        relatedQuestions: research.relatedQuestions || [],
        localInsights: (research.localInsights || []).map((l: { insight: string; source: string }) => ({
          insight: l.insight,
          source: l.source,
        })),
        contentGaps: research.contentGaps || [],
        geoAnswerFragments: (research.geoAnswerFragments || []).map((f: { question: string; answer: string }) => ({
          question: f.question,
          answer: f.answer,
        })),
        topicClusterKeywords: research.topicClusterKeywords || [],
      });
      setResearchOpen(true);
      if (data.researchId) {
        setResearchDbId(data.researchId);
      }
      if (data.knowledgeId) {
        setResearchSavedId(data.knowledgeId);
      }
      if (data.provider) {
        setResearchProvider(data.provider);
      }
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
        body: JSON.stringify({
          ...formPayload(),
          ...(researchDbId ? { researchId: researchDbId } : {}),
        }),
      });

      // Handle non-streaming error responses (auth, validation, 404)
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.error || 'Generation failed');
      }

      if (!res.body) throw new Error('No response body');

      // Read SSE stream from the generate endpoint
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEventType = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse complete SSE events from buffer (split on double newline = event boundary)
        while (buffer.includes('\n\n')) {
          const eventEnd = buffer.indexOf('\n\n');
          const eventBlock = buffer.slice(0, eventEnd);
          buffer = buffer.slice(eventEnd + 2);

          // Parse the event block
          for (const line of eventBlock.split('\n')) {
            if (line.startsWith('event: ')) {
              currentEventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              const payload = JSON.parse(line.slice(6));

              if (currentEventType === 'error') {
                throw new Error(payload.error || 'Generation failed');
              }

              if (currentEventType === 'done') {
                const article = payload.article || {};
                const validation = payload.validation || {};
                setGenerateResult({
                  title: article.title || topic,
                  slug: payload.slug || article.slug || '',
                  geoScore: article.geoScore ?? 0,
                  wordCount: article.wordCount || 0,
                  readingTime: article.readTime || article.readingTime || 0,
                  internalLinks: article.internalLinkCount || 0,
                  externalLinks: article.externalLinkCount || 0,
                  quickAnswer: article.quickAnswer || '',
                  metaDescription: article.metaDescription || '',
                  validation: {
                    passes: [
                      ...(validation.passed ? [{ label: 'All checks passed' }] : []),
                      ...((validation.geoScore?.totalScore ?? 0) >= 70 ? [{ label: `GEO score: ${validation.geoScore?.totalScore}/100` }] : []),
                    ],
                    fails: [
                      ...(validation.hardFails || []).map((f: string) => ({ label: f })),
                      ...(validation.softFails || []).map((f: string) => ({ label: f, detail: 'soft fail' })),
                    ],
                  },
                  proofing: undefined,
                  preFlight: null,
                  lessonsLoaded: 0,
                });
              }
            }
          }
        }
      }
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
              {researchProvider && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  via {researchProvider}
                </span>
              )}
              {researchSavedId && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Saved to Knowledge Base
                </span>
              )}
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

              {/* Nashville Local Insights */}
              {researchResult.localInsights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Nashville Insights ({researchResult.localInsights.length})
                  </h4>
                  <ul className="space-y-1.5">
                    {researchResult.localInsights.map((item, i) => (
                      <li key={i} className="text-sm text-jhr-white flex items-start gap-2">
                        <span className="text-jhr-gold mt-0.5">-</span>
                        <span>{item.insight}</span>
                        <span className="text-jhr-white-dim text-xs ml-auto flex-shrink-0">{item.source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Gaps */}
              {researchResult.contentGaps?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Content Gaps to Exploit ({researchResult.contentGaps.length})
                  </h4>
                  <ul className="space-y-1">
                    {researchResult.contentGaps.map((gap, i) => (
                      <li key={i} className="text-sm text-jhr-white flex items-start gap-2">
                        <span className="text-green-400 mt-0.5"><Zap className="w-3 h-3" /></span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* GEO Answer Fragments */}
              {researchResult.geoAnswerFragments?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    GEO Answer Fragments ({researchResult.geoAnswerFragments.length})
                  </h4>
                  <ul className="space-y-3">
                    {researchResult.geoAnswerFragments.map((frag, i) => (
                      <li key={i} className="bg-jhr-black rounded-lg p-3 border border-jhr-black-lighter">
                        <p className="text-xs text-jhr-gold font-medium mb-1">Q: {frag.question}</p>
                        <p className="text-sm text-jhr-white">{frag.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topic Cluster Keywords */}
              {researchResult.topicClusterKeywords?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-jhr-white-dim mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Topic Cluster Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {researchResult.topicClusterKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-jhr-gold/10 border border-jhr-gold/20 text-jhr-gold text-xs rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
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
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-8 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
          <div className="text-center">
            <p className="text-jhr-white font-medium">Generating article...</p>
            <p className="text-jhr-white-dim text-sm mt-1">Pre-Flight → Research → Write (with lessons) → Proof → Validate → Save Draft</p>
            <p className="text-jhr-white-dim text-xs mt-2">This takes 60-90 seconds</p>
          </div>
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

          {/* Pre-Flight Intelligence */}
          {generateResult.preFlight && (
            <div className="bg-jhr-black rounded-xl p-4 space-y-3 border border-jhr-black-lighter">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-jhr-white-dim flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Pre-Flight Intelligence
                </h4>
                {generateResult.lessonsLoaded ? (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {generateResult.lessonsLoaded} lessons loaded
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Intent Classification */}
                <div className="bg-jhr-black-light rounded-lg p-3">
                  <p className="text-xs text-jhr-white-dim mb-1">Search Intent</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    generateResult.preFlight.intent.type === 'transactional' ? 'bg-green-500/20 text-green-400' :
                    generateResult.preFlight.intent.type === 'commercial' ? 'bg-blue-500/20 text-blue-400' :
                    generateResult.preFlight.intent.type === 'informational' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {generateResult.preFlight.intent.type}
                  </span>
                  <p className="text-xs text-jhr-white-dim mt-1.5">{generateResult.preFlight.intent.recommendedPageType}</p>
                </div>

                {/* Cannibalization */}
                <div className="bg-jhr-black-light rounded-lg p-3">
                  <p className="text-xs text-jhr-white-dim mb-1">Cannibalization Check</p>
                  {generateResult.preFlight.cannibalization.clear ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" /> Clear
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                      <AlertCircle className="w-3 h-3" /> {generateResult.preFlight.cannibalization.overlaps.length} overlap(s)
                    </span>
                  )}
                </div>

                {/* Keyword Cluster */}
                <div className="bg-jhr-black-light rounded-lg p-3">
                  <p className="text-xs text-jhr-white-dim mb-1">Keyword Cluster</p>
                  {generateResult.preFlight.keywordCluster.cluster ? (
                    <span className="inline-block px-2 py-0.5 bg-jhr-gold/20 text-jhr-gold rounded text-xs">
                      {generateResult.preFlight.keywordCluster.cluster}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                      <AlertCircle className="w-3 h-3" /> New cluster
                    </span>
                  )}
                </div>
              </div>

              {/* Warnings */}
              {generateResult.preFlight.warnings.length > 0 && (
                <div className="space-y-1.5">
                  {generateResult.preFlight.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs bg-yellow-500/5 rounded-lg p-2 border border-yellow-500/20">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-300">{w.message}</p>
                        {w.detail && <p className="text-yellow-400/70 mt-0.5">{w.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {/* Proofing Results */}
          {generateResult.proofing && (
            <div className="border-t border-jhr-black-lighter pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-jhr-white-dim flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Brand Voice & GEO Proofing
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  generateResult.proofing.passed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {generateResult.proofing.passed ? 'PASSED' : 'NEEDS REVISION'}
                </span>
              </div>

              {/* Proofing Score Bars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Overall', score: generateResult.proofing.overallScore },
                  { label: 'Brand Voice', score: generateResult.proofing.brandVoiceScore },
                  { label: 'GEO Ready', score: generateResult.proofing.geoReadiness },
                  { label: 'SEO', score: generateResult.proofing.seoScore },
                ].map((item) => (
                  <div key={item.label} className="bg-jhr-black rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-jhr-white-dim">{item.label}</span>
                      <span className={`text-xs font-bold ${geoScoreTextColor(item.score)}`}>
                        {item.score}
                      </span>
                    </div>
                    <div className="w-full bg-jhr-black-lighter rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${geoScoreColor(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Proofing Issues */}
              {generateResult.proofing.issues.length > 0 && (
                <div className="space-y-2">
                  {generateResult.proofing.issues
                    .sort((a, b) => {
                      const order = { critical: 0, warning: 1, suggestion: 2 };
                      return order[a.severity] - order[b.severity];
                    })
                    .map((issue, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 border text-sm ${
                        issue.severity === 'critical'
                          ? 'bg-red-500/10 border-red-500/30'
                          : issue.severity === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {issue.severity === 'critical' ? (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : issue.severity === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              issue.category === 'brand-voice' ? 'bg-purple-500/20 text-purple-400' :
                              issue.category === 'ai-slop' ? 'bg-red-500/20 text-red-400' :
                              issue.category === 'geo' ? 'bg-blue-500/20 text-blue-400' :
                              issue.category === 'seo' ? 'bg-green-500/20 text-green-400' :
                              issue.category === 'nashville' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {issue.category}
                            </span>
                          </div>
                          <p className={`${
                            issue.severity === 'critical' ? 'text-red-300' :
                            issue.severity === 'warning' ? 'text-yellow-300' :
                            'text-blue-300'
                          }`}>
                            {issue.description}
                          </p>
                          {issue.location && (
                            <p className="text-xs text-jhr-white-dim mt-1 italic truncate">
                              &ldquo;{issue.location}&rdquo;
                            </p>
                          )}
                          {issue.fix && (
                            <p className="text-xs text-jhr-white-dim mt-1">
                              <span className="text-jhr-gold">Fix:</span> {issue.fix}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

interface ImproveLogEntry {
  time: string;
  type: 'progress' | 'result' | 'done' | 'error';
  message: string;
  slug?: string;
  beforeScore?: number;
  afterScore?: number;
}

function ArticlesTab() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [improveLog, setImproveLog] = useState<ImproveLogEntry[]>([]);
  const [improvePhase, setImprovePhase] = useState<string | null>(null);
  const [improveSummary, setImproveSummary] = useState<string | null>(null);
  const [improveProgress, setImproveProgress] = useState<{ current: number; total: number } | null>(null);

  const addLogEntry = useCallback((entry: ImproveLogEntry) => {
    setImproveLog((prev) => [...prev, entry]);
  }, []);

  const timestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  /** Improve a single article via SSE streaming (same pattern as generate). */
  const improveSingle = useCallback(async (slug: string): Promise<{ status: string; afterScore?: number; changes?: string[]; error?: string }> => {
    const res = await fetch('/api/admin/contentops/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => 'Unknown error');
      try { const j = JSON.parse(text); throw new Error(j.error || text); } catch (e) { if (e instanceof SyntaxError) throw new Error(text); throw e; }
    }

    // Read SSE stream
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result: { status: string; afterScore?: number; changes?: string[]; error?: string } = { status: 'failed' };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7);
        } else if (line.startsWith('data: ') && eventType) {
          try {
            const data = JSON.parse(line.slice(6));
            if (eventType === 'progress' && data.message) {
              addLogEntry({ time: timestamp(), type: 'progress', message: data.message, slug });
            } else if (eventType === 'done') {
              result = { status: data.status || 'improved', afterScore: data.afterScore, changes: data.changes };
            } else if (eventType === 'error') {
              throw new Error(data.error || 'Improvement failed');
            }
          } catch (e) { if (e instanceof SyntaxError) continue; throw e; }
          eventType = '';
        }
      }
    }
    return result;
  }, [addLogEntry]);

  /** Improve one or more articles with progress tracking. */
  const runImprove = useCallback(async (opts: { slug?: string; mode?: string }): Promise<void> => {
    setImproveLog([]);
    setImprovePhase('working');
    setImproveSummary(null);
    setImproveProgress(null);

    if (opts.slug) {
      // Single article
      addLogEntry({ time: timestamp(), type: 'progress', message: `Improving "${opts.slug}"...`, slug: opts.slug });
      const result = await improveSingle(opts.slug);
      if (result.status === 'improved') {
        addLogEntry({ time: timestamp(), type: 'result', message: `Improved! GEO score: ${result.afterScore ?? '—'}`, slug: opts.slug, afterScore: result.afterScore });
      } else {
        addLogEntry({ time: timestamp(), type: 'error', message: result.error || 'Failed', slug: opts.slug });
      }
      setImprovePhase('done');
      setImproveSummary(result.status === 'improved' ? 'Article improved' : `Failed: ${result.error}`);
    } else {
      // Batch: get articles that need work, then improve one-at-a-time
      addLogEntry({ time: timestamp(), type: 'progress', message: 'Loading articles that need improvement...' });
      const needsWork = articles.filter((a) => a.geoScore > 0 && a.geoScore < (opts.mode === 'all' ? 80 : 70));
      if (needsWork.length === 0) {
        setImprovePhase('done');
        setImproveSummary('No articles need improvement');
        addLogEntry({ time: timestamp(), type: 'done', message: 'No articles need improvement' });
        return;
      }

      let improved = 0;
      let failed = 0;
      setImproveProgress({ current: 0, total: needsWork.length });
      addLogEntry({ time: timestamp(), type: 'progress', message: `Found ${needsWork.length} articles to improve` });

      for (let i = 0; i < needsWork.length; i++) {
        const article = needsWork[i];
        setImproveProgress({ current: i + 1, total: needsWork.length });
        addLogEntry({ time: timestamp(), type: 'progress', message: `Improving "${article.slug}" (${i + 1}/${needsWork.length})...`, slug: article.slug });
        try {
          const result = await improveSingle(article.slug);
          if (result.status === 'improved') {
            improved++;
            addLogEntry({ time: timestamp(), type: 'result', message: `Improved! GEO: ${result.afterScore ?? '—'}`, slug: article.slug, afterScore: result.afterScore });
          } else {
            failed++;
            addLogEntry({ time: timestamp(), type: 'error', message: result.error || 'Failed', slug: article.slug });
          }
        } catch (err) {
          failed++;
          addLogEntry({ time: timestamp(), type: 'error', message: err instanceof Error ? err.message : 'Failed', slug: article.slug });
        }
      }

      setImprovePhase('done');
      setImproveSummary(`Completed: ${improved} improved, ${failed} failed (${needsWork.length} total)`);
      addLogEntry({ time: timestamp(), type: 'done', message: `Completed: ${improved} improved, ${failed} failed` });
    }
  }, [addLogEntry, articles, improveSingle]);

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

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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
          All Articles ({articles.length})
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/create"
            className="text-sm text-jhr-black bg-jhr-gold hover:bg-jhr-gold/90 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Article
          </Link>
          <button
            onClick={async () => {
              setActionLoading('improve-all');
              try {
                await runImprove({ mode: 'needs-work' });
                await fetchArticles();
              } catch (err) {
                setImprovePhase('error');
                addLogEntry({ time: timestamp(), type: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
              } finally {
                setActionLoading(null);
              }
            }}
            disabled={actionLoading === 'improve-all'}
            className="text-sm text-jhr-white-dim hover:text-jhr-gold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Auto-improve all articles that need work (GEO < 70)"
          >
            {actionLoading === 'improve-all' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            Improve All
          </button>
          <button
            onClick={async () => {
              setActionLoading('rescore');
              try {
                const res = await fetch('/api/admin/contentops/rescore', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({}),
                });
                if (res.ok) {
                  await fetchArticles();
                }
              } catch {
                // ignore
              } finally {
                setActionLoading(null);
              }
            }}
            disabled={actionLoading === 'rescore'}
            className="text-sm text-jhr-white-dim hover:text-jhr-gold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Re-score all articles for GEO"
          >
            {actionLoading === 'rescore' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            Rescore GEO
          </button>
          <button
            onClick={fetchArticles}
            className="text-sm text-jhr-white-dim hover:text-jhr-gold transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {(improveLog.length > 0 || improvePhase) && (
        <div className="border-b border-jhr-black-lighter bg-jhr-black/50">
          {/* Progress header */}
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {improvePhase && improvePhase !== 'done' && improvePhase !== 'error' && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-jhr-gold flex-shrink-0" />
              )}
              {improvePhase === 'done' && <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />}
              {improvePhase === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
              <span className="text-sm font-medium text-jhr-white">
                {improvePhase === 'done' ? 'Improvement Complete' : improvePhase === 'error' ? 'Improvement Failed' : 'Improving Articles...'}
              </span>
              {improveProgress && improvePhase !== 'done' && (
                <span className="text-xs text-jhr-white-dim">
                  ({improveProgress.current}/{improveProgress.total})
                </span>
              )}
            </div>
            {improveSummary && (
              <span className="text-xs text-jhr-white-dim">{improveSummary}</span>
            )}
            {improvePhase === 'done' && (
              <button
                onClick={() => { setImproveLog([]); setImprovePhase(null); setImproveSummary(null); setImproveProgress(null); }}
                className="text-xs text-jhr-white-dim hover:text-jhr-white transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
          {/* Progress bar */}
          {improveProgress && improvePhase !== 'done' && (
            <div className="px-4 pb-1">
              <div className="w-full bg-jhr-black rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-jhr-gold rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((improveProgress.current / improveProgress.total) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {/* Log entries */}
          <div className="px-4 pb-2 max-h-40 overflow-y-auto">
            {improveLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-2 py-0.5">
                <span className="text-[10px] text-jhr-white-dim/50 font-mono flex-shrink-0 mt-0.5">{entry.time}</span>
                {entry.type === 'result' && entry.slug && (
                  <span className="text-[10px] text-jhr-gold font-medium flex-shrink-0 mt-0.5">{entry.slug}</span>
                )}
                <span className={`text-xs ${
                  entry.type === 'done' ? 'text-green-400 font-medium' :
                  entry.type === 'error' ? 'text-red-400' :
                  entry.type === 'result' ? (
                    entry.message.startsWith('Improved') ? 'text-green-300' :
                    entry.message.startsWith('Already') ? 'text-jhr-white-dim' :
                    'text-red-300'
                  ) : 'text-jhr-white-dim'
                }`}>
                  {entry.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      {article.geoScore > 0 ? (
                        <>
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
                        </>
                      ) : (
                        <span className="text-xs text-jhr-white-dim/50 italic">Not scored</span>
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
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-jhr-white-dim hover:text-jhr-white transition-colors"
                        title="View live"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      {article.geoScore > 0 && article.geoScore < 70 && (
                        <button
                          onClick={async () => {
                            setActionLoading(`improve-${article.slug}`);
                            try {
                              await runImprove({ slug: article.slug });
                              await fetchArticles();
                            } catch (err) {
                              setImprovePhase('error');
                              addLogEntry({ time: timestamp(), type: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
                            } finally {
                              setActionLoading(null);
                            }
                          }}
                          disabled={actionLoading === `improve-${article.slug}`}
                          className="p-1.5 text-jhr-white-dim hover:text-jhr-gold disabled:opacity-30 transition-colors"
                          title="Auto-improve this article"
                        >
                          {actionLoading === `improve-${article.slug}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <Link
                        href={`/blog/${article.slug}?editMode=true`}
                        className="p-1.5 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                        title="Edit article & SEO"
                      >
                        <Pencil className="w-4 h-4" />
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

// ─── Content Queue Tab ──────────────────────────────────────────────────────

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  A: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  B: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  C: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  D: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

const ACTION_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  optimize: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Optimize' },
  create: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Create' },
  refresh: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Refresh' },
};

function ContentQueueTab({ onGenerateClick }: { onGenerateClick: (rec: QueueRecommendation) => void }) {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const url = refresh ? '/api/admin/contentops/queue?refresh=true' : '/api/admin/contentops/queue';
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text() || 'Failed to load content queue');
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load content queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <p className="text-jhr-white-dim">Analyzing content opportunities...</p>
        <p className="text-jhr-white-dim/60 text-sm">Pulling GSC + DataForSEO data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 font-medium mb-2">Failed to load content queue</p>
        <p className="text-red-400/60 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchQueue()}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const tierEntries = Object.entries(data.summary.tierDistribution)
    .filter(([, count]) => count > 0);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {(!data.gscConnected || !data.dataforseoConnected) && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div className="text-sm text-yellow-400">
            {!data.gscConnected && <span>GSC not connected — connect in SEO dashboard for full analysis. </span>}
            {!data.dataforseoConnected && <span>DataForSEO not configured — add DATAFORSEO_LOGIN to .env for SERP tracking.</span>}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5">
          <div className="flex items-center gap-2 text-jhr-white-dim text-sm mb-2">
            <Target className="w-4 h-4" />
            Opportunities
          </div>
          <p className="text-3xl font-bold text-jhr-white">{data.summary.totalOpportunities}</p>
        </div>
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5">
          <div className="flex items-center gap-2 text-jhr-white-dim text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            Strike Distance
          </div>
          <p className="text-3xl font-bold text-yellow-400">{data.summary.strikeDistanceKeywords}</p>
          <p className="text-xs text-jhr-white-dim mt-1">Position 8–30</p>
        </div>
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5">
          <div className="flex items-center gap-2 text-jhr-white-dim text-sm mb-2">
            <Zap className="w-4 h-4" />
            Content Gaps
          </div>
          <p className="text-3xl font-bold text-red-400">{data.summary.contentGaps}</p>
          <p className="text-xs text-jhr-white-dim mt-1">Not ranking</p>
        </div>
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5">
          <div className="flex items-center gap-2 text-jhr-white-dim text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            Pages Tracked
          </div>
          <p className="text-3xl font-bold text-jhr-white">{data.summary.totalPages}</p>
        </div>
      </div>

      {/* Tier Distribution */}
      {tierEntries.length > 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-5">
          <h3 className="text-sm font-medium text-jhr-white-dim mb-4">Page Tier Distribution</h3>
          <div className="flex gap-3">
            {['S', 'A', 'B', 'C', 'D'].map((tier) => {
              const count = data.summary.tierDistribution[tier] || 0;
              const colors = TIER_COLORS[tier];
              return (
                <div
                  key={tier}
                  className={`flex-1 rounded-lg border ${colors.border} ${colors.bg} p-3 text-center`}
                >
                  <p className={`text-lg font-bold ${colors.text}`}>{tier}</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
                  <p className="text-xs text-jhr-white-dim mt-0.5">
                    {count === 1 ? 'page' : 'pages'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SERP Positions */}
      {data.serpPositions.length > 0 && (
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
          <div className="px-5 py-4 border-b border-jhr-black-lighter">
            <h3 className="text-sm font-medium text-jhr-white">
              SERP Positions — Target Keywords
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-jhr-white-dim border-b border-jhr-black-lighter/50">
                  <th className="px-5 py-3 font-medium">Keyword</th>
                  <th className="px-5 py-3 font-medium text-right">Position</th>
                  <th className="px-5 py-3 font-medium text-right">Volume</th>
                  <th className="px-5 py-3 font-medium text-right">CPC</th>
                  <th className="px-5 py-3 font-medium text-right">Competition</th>
                  <th className="px-5 py-3 font-medium text-center">Trend</th>
                  <th className="px-5 py-3 font-medium">12-Month Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.serpPositions.map((sp) => {
                  const trend = sp.monthlyTrend || [];
                  const trendMax = trend.length > 0 ? Math.max(...trend, 1) : 1;
                  return (
                    <tr
                      key={sp.keyword}
                      className="border-b border-jhr-black-lighter/30 last:border-0 hover:bg-jhr-black-lighter/20"
                    >
                      <td className="px-5 py-3 text-jhr-white">{sp.keyword}</td>
                      <td className="px-5 py-3 text-right">
                        {sp.position ? (
                          <span
                            className={`font-mono font-bold ${
                              sp.position <= 3
                                ? 'text-green-400'
                                : sp.position <= 10
                                ? 'text-blue-400'
                                : sp.position <= 20
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            #{sp.position}
                          </span>
                        ) : (
                          <span className="text-red-400/60">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-jhr-white-dim font-mono">
                        {sp.searchVolume > 0 ? sp.searchVolume.toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {sp.cpc ? (
                          <span className={`font-mono ${sp.cpc >= 10 ? 'text-green-400' : sp.cpc >= 5 ? 'text-yellow-400' : 'text-jhr-white-dim'}`}>
                            ${sp.cpc.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-jhr-white-dim/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {sp.competition !== null ? (
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-12 h-1.5 bg-jhr-black-lighter rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  sp.competition >= 70 ? 'bg-red-400' : sp.competition >= 40 ? 'bg-yellow-400' : 'bg-green-400'
                                }`}
                                style={{ width: `${sp.competition}%` }}
                              />
                            </div>
                            <span className="text-jhr-white-dim font-mono text-xs w-6">{sp.competition}</span>
                          </div>
                        ) : (
                          <span className="text-jhr-white-dim/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {sp.trend === 'rising' && <span className="text-green-400 text-xs font-medium">Rising</span>}
                        {sp.trend === 'falling' && <span className="text-red-400 text-xs font-medium">Falling</span>}
                        {sp.trend === 'stable' && <span className="text-jhr-white-dim text-xs">Stable</span>}
                        {!sp.trend && <span className="text-jhr-white-dim/40">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        {trend.length > 0 ? (
                          <div className="flex items-end gap-px h-5 w-24">
                            {trend.map((vol, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-sm ${
                                  sp.trend === 'rising' ? 'bg-green-400/70' : sp.trend === 'falling' ? 'bg-red-400/70' : 'bg-jhr-white-dim/30'
                                }`}
                                style={{ height: `${Math.max(2, (vol / trendMax) * 20)}px` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-jhr-white-dim/40 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="px-5 py-4 border-b border-jhr-black-lighter flex items-center justify-between">
          <h3 className="text-sm font-medium text-jhr-white">
            Prioritized Recommendations ({data.recommendations.length})
          </h3>
          <button
            onClick={() => fetchQueue(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-jhr-black-lighter hover:bg-jhr-gold/20 text-jhr-white-dim hover:text-jhr-gold rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
          </button>
        </div>

        {data.recommendations.length === 0 ? (
          <div className="px-5 py-12 text-center text-jhr-white-dim">
            No recommendations available. Connect GSC and DataForSEO for content intelligence.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-jhr-white-dim border-b border-jhr-black-lighter/50">
                  <th className="px-5 py-3 font-medium w-16">Priority</th>
                  <th className="px-5 py-3 font-medium">Keyword</th>
                  <th className="px-5 py-3 font-medium text-right">Volume</th>
                  <th className="px-5 py-3 font-medium text-right">CPC</th>
                  <th className="px-5 py-3 font-medium text-right">Position</th>
                  <th className="px-5 py-3 font-medium text-center">Trend</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">ICP</th>
                  <th className="px-5 py-3 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody>
                {data.recommendations.map((rec) => {
                  const action = ACTION_COLORS[rec.recommendedAction] || ACTION_COLORS.create;
                  const icpLabel = ICP_OPTIONS.find((o) => o.value === rec.suggestedIcp)?.label || rec.suggestedIcp;

                  return (
                    <tr
                      key={rec.id}
                      className="border-b border-jhr-black-lighter/30 last:border-0 hover:bg-jhr-black-lighter/20 group"
                    >
                      <td className="px-5 py-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                            rec.priorityScore >= 70
                              ? 'bg-green-500/20 text-green-400'
                              : rec.priorityScore >= 40
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {rec.priorityScore}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-jhr-white font-medium">{rec.keyword}</p>
                        <p className="text-jhr-white-dim/60 text-xs mt-0.5 max-w-[300px] truncate">
                          {rec.dataJustification}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right text-jhr-white-dim font-mono">
                        {rec.searchVolume > 0 ? rec.searchVolume.toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {rec.cpc ? (
                          <span className={`font-mono ${rec.cpc >= 10 ? 'text-green-400' : rec.cpc >= 5 ? 'text-yellow-400' : 'text-jhr-white-dim'}`}>
                            ${rec.cpc.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-jhr-white-dim/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {rec.currentPosition ? (
                          <span className="text-yellow-400 font-mono">#{rec.currentPosition}</span>
                        ) : (
                          <span className="text-red-400/60">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {rec.trend === 'rising' && <span className="text-green-400 text-xs">Rising</span>}
                        {rec.trend === 'falling' && <span className="text-red-400 text-xs">Falling</span>}
                        {rec.trend === 'stable' && <span className="text-jhr-white-dim text-xs">Stable</span>}
                        {!rec.trend && <span className="text-jhr-white-dim/40">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${action.bg} ${action.text}`}>
                          {action.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-jhr-white-dim">{icpLabel.replace(/^ICP-\d /, '')}</span>
                      </td>
                      <td className="px-5 py-3">
                        {rec.recommendedAction === 'create' && (
                          <button
                            onClick={() => onGenerateClick(rec)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-jhr-gold/20 hover:bg-jhr-gold/30 text-jhr-gold rounded-lg text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cache Info */}
      <p className="text-xs text-jhr-white-dim/40 text-center">
        Generated {new Date(data.generatedAt).toLocaleString()} — cached until {new Date(data.cachedUntil).toLocaleString()}
      </p>
    </div>
  );
}

// ─── Competitor Intelligence Tab ──────────────────────────────────────────────

interface CompetitorLaunchState {
  keyword: string;
  status: 'idle' | 'running' | 'success' | 'error';
  step?: string;
  slug?: string;
  geoScore?: number;
  wordCount?: number;
  error?: string;
}

function CompetitorRow({ comp, onGenerateClick }: { comp: CompetitorDomain; onGenerateClick: (rec: QueueRecommendation) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [launches, setLaunches] = useState<Record<string, CompetitorLaunchState>>({});

  const handleLaunch = async (kw: CompetitorKeywordEntry, index: number) => {
    const key = `${kw.keyword}-${index}`;
    setLaunches(prev => ({
      ...prev,
      [key]: { keyword: kw.keyword, status: 'running', step: 'Scraping competitor page...' },
    }));

    try {
      // Update step indicators as time progresses
      const stepTimer1 = setTimeout(() => {
        setLaunches(prev => ({
          ...prev,
          [key]: { ...prev[key], step: 'Running targeted research...' },
        }));
      }, 8_000);

      const stepTimer2 = setTimeout(() => {
        setLaunches(prev => ({
          ...prev,
          [key]: { ...prev[key], step: 'Generating article to outrank...' },
        }));
      }, 25_000);

      const stepTimer3 = setTimeout(() => {
        setLaunches(prev => ({
          ...prev,
          [key]: { ...prev[key], step: 'Validating & scoring GEO...' },
        }));
      }, 60_000);

      const res = await fetch('/api/admin/contentops/competitor-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: kw.keyword,
          competitorUrl: kw.url,
          competitorDomain: comp.domain,
          competitorPosition: kw.position,
          ourPosition: kw.ourPosition,
          searchVolume: kw.searchVolume,
          icpTag: 'ICP-1',
          articleType: 'ultimate-guide',
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setLaunches(prev => ({
        ...prev,
        [key]: {
          keyword: kw.keyword,
          status: 'success',
          slug: data.slug,
          geoScore: data.article?.geoScore ?? data.geoScoring?.totalScore ?? 0,
          wordCount: data.article?.wordCount ?? 0,
        },
      }));
    } catch (err) {
      setLaunches(prev => ({
        ...prev,
        [key]: {
          keyword: kw.keyword,
          status: 'error',
          error: err instanceof Error ? err.message : 'Launch failed',
        },
      }));
    }
  };

  const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
    easy: { bg: 'bg-green-500/20', text: 'text-green-400' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    hard: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };

  const ACTION_MAP: Record<string, { bg: string; text: string; label: string }> = {
    create: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Create' },
    optimize: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Optimize' },
    overtake: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Overtake' },
  };

  const keywords = comp.topKeywords || [];
  const easyCount = keywords.filter(k => k.difficulty === 'easy').length;
  const gapCount = keywords.filter(k => k.ourPosition === null).length;

  return (
    <>
      {/* Competitor Header Row */}
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b border-jhr-black-lighter/30 hover:bg-jhr-black-lighter/20 cursor-pointer"
      >
        <td className="py-3 pr-4">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="w-4 h-4 text-jhr-gold" /> : <ChevronRight className="w-4 h-4 text-jhr-white-dim" />}
            <span className="text-jhr-white font-medium">{comp.domain}</span>
          </div>
        </td>
        <td className="text-right py-3 px-3 text-jhr-white-dim">{comp.organicCount.toLocaleString()}</td>
        <td className="text-right py-3 px-3 text-jhr-white-dim">{comp.avgPosition.toFixed(1)}</td>
        <td className="text-right py-3 px-3 text-jhr-white-dim">{comp.estimatedTraffic.toLocaleString()}</td>
        <td className="text-right py-3 px-3">
          <span className="text-jhr-white">{keywords.length}</span>
          <span className="text-jhr-white-dim/50 ml-1">kw</span>
        </td>
        <td className="text-right py-3 px-3">
          {easyCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              {easyCount} easy
            </span>
          )}
        </td>
        <td className="text-right py-3 px-3">
          {gapCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              {gapCount} gaps
            </span>
          )}
        </td>
      </tr>

      {/* Expanded Keyword Details */}
      {expanded && keywords.length > 0 && (
        <tr>
          <td colSpan={7} className="p-0">
            <div className="bg-jhr-black/50 border-y border-jhr-black-lighter/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-jhr-white-dim/60 text-xs uppercase tracking-wide">
                    <th className="text-left py-2 pl-10 pr-3">Keyword</th>
                    <th className="text-right py-2 px-3">Their Pos.</th>
                    <th className="text-right py-2 px-3">Our Pos.</th>
                    <th className="text-right py-2 px-3">Volume</th>
                    <th className="text-right py-2 px-3">CPC</th>
                    <th className="text-center py-2 px-3">Difficulty</th>
                    <th className="text-center py-2 px-3">Action</th>
                    <th className="text-left py-2 px-3 max-w-[200px]">Ranking URL</th>
                    <th className="text-right py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, ki) => {
                    const diffStyle = DIFFICULTY_COLORS[kw.difficulty] || DIFFICULTY_COLORS.medium;
                    const actionStyle = ACTION_MAP[kw.suggestedAction] || ACTION_MAP.create;
                    const launchKey = `${kw.keyword}-${ki}`;
                    const launch = launches[launchKey];
                    return (
                      <>
                        <tr key={`${kw.keyword}-${ki}`} className="border-t border-jhr-black-lighter/10 hover:bg-jhr-black-lighter/10 group">
                          <td className="py-2 pl-10 pr-3">
                            <span className="text-jhr-white text-xs">{kw.keyword}</span>
                          </td>
                          <td className="text-right py-2 px-3 text-red-400 font-mono text-xs">#{kw.position}</td>
                          <td className="text-right py-2 px-3 font-mono text-xs">
                            {kw.ourPosition ? (
                              <span className="text-yellow-400">#{kw.ourPosition}</span>
                            ) : (
                              <span className="text-jhr-white-dim/30">—</span>
                            )}
                          </td>
                          <td className="text-right py-2 px-3 text-jhr-white-dim text-xs">{kw.searchVolume.toLocaleString()}</td>
                          <td className="text-right py-2 px-3 text-jhr-white-dim text-xs">
                            {kw.cpc != null ? `$${kw.cpc.toFixed(2)}` : '—'}
                          </td>
                          <td className="text-center py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${diffStyle.bg} ${diffStyle.text}`}>
                              {kw.difficulty}
                            </span>
                          </td>
                          <td className="text-center py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${actionStyle.bg} ${actionStyle.text}`}>
                              {actionStyle.label}
                            </span>
                          </td>
                          <td className="py-2 px-3 max-w-[200px]">
                            {kw.url && (
                              <a
                                href={kw.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-jhr-white-dim/50 text-[10px] hover:text-jhr-gold truncate block"
                                title={kw.url}
                              >
                                {kw.url.replace(/^https?:\/\/[^/]+/, '')}
                              </a>
                            )}
                          </td>
                          <td className="text-right py-2 px-3">
                            {(!launch || launch.status === 'idle') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLaunch(kw, ki);
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-jhr-gold/20 hover:bg-jhr-gold/30 text-jhr-gold rounded text-[10px] font-medium transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap"
                              >
                                <Zap className="w-3 h-3" />
                                {kw.suggestedAction === 'create' ? 'Launch' : 'Outrank'}
                              </button>
                            )}
                            {launch?.status === 'running' && (
                              <span className="flex items-center gap-1 text-jhr-gold text-[10px]">
                                <Loader2 className="w-3 h-3 animate-spin" />
                              </span>
                            )}
                            {launch?.status === 'success' && (
                              <Link
                                href={`/blog/${launch.slug}?editMode=true`}
                                className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-medium whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <CheckCircle className="w-3 h-3" />
                                View
                              </Link>
                            )}
                            {launch?.status === 'error' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLaunch(kw, ki);
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-[10px] font-medium whitespace-nowrap"
                                title={launch.error}
                              >
                                <XCircle className="w-3 h-3" />
                                Retry
                              </button>
                            )}
                          </td>
                        </tr>
                        {/* Inline progress/result bar */}
                        {launch?.status === 'running' && (
                          <tr key={`${kw.keyword}-${ki}-progress`}>
                            <td colSpan={9} className="py-0 pl-10">
                              <div className="flex items-center gap-2 py-1.5 text-[10px]">
                                <Loader2 className="w-3 h-3 text-jhr-gold animate-spin flex-shrink-0" />
                                <span className="text-jhr-gold">{launch.step}</span>
                                <span className="text-jhr-white-dim/30">This takes 1-2 minutes</span>
                              </div>
                            </td>
                          </tr>
                        )}
                        {launch?.status === 'success' && (
                          <tr key={`${kw.keyword}-${ki}-result`}>
                            <td colSpan={9} className="py-0 pl-10">
                              <div className="flex items-center gap-4 py-1.5 text-[10px]">
                                <span className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="w-3 h-3" />
                                  Draft saved
                                </span>
                                {launch.wordCount ? (
                                  <span className="text-jhr-white-dim">{launch.wordCount.toLocaleString()} words</span>
                                ) : null}
                                {launch.geoScore ? (
                                  <span className={`px-1.5 py-0.5 rounded font-medium ${
                                    launch.geoScore >= 85 ? 'bg-green-500/20 text-green-400' :
                                    launch.geoScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    GEO {launch.geoScore}
                                  </span>
                                ) : null}
                                <Link
                                  href={`/blog/${launch.slug}?editMode=true`}
                                  className="text-jhr-gold hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open article
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )}
                        {launch?.status === 'error' && (
                          <tr key={`${kw.keyword}-${ki}-error`}>
                            <td colSpan={9} className="py-0 pl-10">
                              <div className="flex items-center gap-2 py-1.5 text-[10px] text-red-400">
                                <XCircle className="w-3 h-3 flex-shrink-0" />
                                {launch.error}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}

      {expanded && keywords.length === 0 && (
        <tr>
          <td colSpan={7} className="py-4 text-center text-jhr-white-dim/50 text-xs bg-jhr-black/50">
            No keyword data available for this competitor
          </td>
        </tr>
      )}
    </>
  );
}

function CompetitorTab({ onGenerateClick }: { onGenerateClick: (rec: QueueRecommendation) => void }) {
  const [data, setData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/admin/contentops/competitors${refresh ? '?refresh=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load competitor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-jhr-gold animate-spin mx-auto" />
          <p className="text-jhr-white-dim text-sm">Analyzing competitor landscape...</p>
          <p className="text-jhr-white-dim/50 text-xs">Fetching ranked keywords for each competitor (30-60s)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-400 font-medium">{error}</p>
        <button onClick={() => fetchData(true)} className="mt-3 px-4 py-2 bg-jhr-gold/20 text-jhr-gold rounded-lg text-sm hover:bg-jhr-gold/30 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-jhr-white">Competitor Intelligence</h2>
          <p className="text-sm text-jhr-white-dim">Click a competitor to see their top ranking keywords and pages</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          className="flex items-center gap-2 px-4 py-2 bg-jhr-black-lighter hover:bg-jhr-black-lighter/80 text-jhr-white-dim rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4">
          <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Competitors</p>
          <p className="text-2xl font-bold text-jhr-white mt-1">{data.competitors.length}</p>
        </div>
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4">
          <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Their Keywords</p>
          <p className="text-2xl font-bold text-jhr-gold mt-1">{data.totalOpportunities}</p>
        </div>
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4">
          <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Easy Wins</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{data.totalEasyWins}</p>
        </div>
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4">
          <p className="text-xs text-jhr-white-dim uppercase tracking-wide">Content Gaps</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{data.totalContentGaps}</p>
          <p className="text-[10px] text-jhr-white-dim/40 mt-0.5">Keywords they rank for, you don&apos;t</p>
        </div>
      </div>

      {/* Competitor List with Expandable Rows */}
      {data.competitors.length > 0 && (
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-5">
          <h3 className="text-sm font-semibold text-jhr-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-jhr-gold" />
            Competing Domains
            <span className="text-xs font-normal text-jhr-white-dim ml-auto">
              Click a row to expand keyword details
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-jhr-white-dim text-xs uppercase tracking-wide border-b border-jhr-black-lighter">
                  <th className="text-left py-2 pr-4">Domain</th>
                  <th className="text-right py-2 px-3">Organic KW</th>
                  <th className="text-right py-2 px-3">Avg Pos.</th>
                  <th className="text-right py-2 px-3">Est. Traffic</th>
                  <th className="text-right py-2 px-3">Tracked</th>
                  <th className="text-right py-2 px-3">Easy Wins</th>
                  <th className="text-right py-2 px-3">Gaps</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors.map((comp) => (
                  <CompetitorRow key={comp.domain} comp={comp} onGenerateClick={onGenerateClick} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cache Info */}
      {data.generatedAt && (
        <p className="text-xs text-jhr-white-dim/40 text-center">
          Generated {new Date(data.generatedAt).toLocaleString()} — cached until {new Date(data.cachedUntil).toLocaleString()}
        </p>
      )}
    </div>
  );
}
