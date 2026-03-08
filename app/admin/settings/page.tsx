'use client';

import { useEffect, useState, useCallback } from 'react';
import { Settings, Globe, Link2, Search, Save, Loader2, CheckCircle, AlertCircle, Image as ImageIcon, X, Sparkles, RotateCcw, Wifi, WifiOff, Tag, Plus, Trash2, ShieldAlert } from 'lucide-react';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';

type SEOGEOPreset = 'default' | 'blog-focused' | 'local-seo' | 'eeat' | 'custom';

const PRESET_LABELS: Record<SEOGEOPreset, { label: string; description: string }> = {
  default: { label: 'Default', description: 'Balanced SEO and GEO optimization for all content' },
  'blog-focused': { label: 'Blog-Focused', description: 'Optimized for blog content and featured snippets' },
  'local-seo': { label: 'Local SEO', description: 'Nashville-focused local search optimization' },
  eeat: { label: 'E-E-A-T Focus', description: 'Experience, Expertise, Authoritativeness, Trustworthiness' },
  custom: { label: 'Custom', description: 'Your custom prompt configuration' },
};

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  favicon?: string;
  ogImage?: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  robotsDirective: string;
  integrations: {
    ga4MeasurementId?: string;
    metaPixelId?: string;
  };
  seoGeo?: {
    systemPrompt: string;
    activePreset: SEOGEOPreset;
  };
  updatedAt: string;
}

type MediaField = 'logo' | 'favicon' | 'ogImage';

interface IntegrationStatus {
  name: string;
  key: string;
  connected: boolean;
  details?: string;
}

interface AlertThresholds {
  psiDesktopMin: number;
  psiMobileMin: number;
  keywordDropPositions: number;
  noLeadsDays: number;
  igReachDropPercent: number;
  geoScoreDropPoints: number;
}

const DEFAULT_THRESHOLDS: AlertThresholds = {
  psiDesktopMin: 85,
  psiMobileMin: 70,
  keywordDropPositions: 5,
  noLeadsDays: 5,
  igReachDropPercent: 30,
  geoScoreDropPoints: 10,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<MediaField | null>(null);
  const [loadingPreset, setLoadingPreset] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState<string>('');

  // API Connection Status
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  // Tracked Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(true);
  const [keywordsSaving, setKeywordsSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  // Alert Thresholds
  const [thresholds, setThresholds] = useState<AlertThresholds>(DEFAULT_THRESHOLDS);
  const [thresholdsLoading, setThresholdsLoading] = useState(true);
  const [thresholdsSaving, setThresholdsSaving] = useState(false);
  const [thresholdsSaved, setThresholdsSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setSettings(data.settings);
        if (data.defaultPrompt) {
          setDefaultPrompt(data.defaultPrompt);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    async function fetchIntegrations() {
      try {
        const res = await fetch('/api/admin/settings/status');
        if (res.ok) {
          const data = await res.json();
          setIntegrations(data.integrations || []);
        }
      } catch {
        // silently fail
      } finally {
        setIntegrationsLoading(false);
      }
    }

    async function fetchKeywords() {
      try {
        const res = await fetch('/api/admin/settings/keywords');
        if (res.ok) {
          const data = await res.json();
          setKeywords(data.keywords || []);
        }
      } catch {
        // silently fail
      } finally {
        setKeywordsLoading(false);
      }
    }

    async function fetchThresholds() {
      try {
        const res = await fetch('/api/admin/settings/thresholds');
        if (res.ok) {
          const data = await res.json();
          setThresholds(data.thresholds || DEFAULT_THRESHOLDS);
        }
      } catch {
        // silently fail
      } finally {
        setThresholdsLoading(false);
      }
    }

    fetchSettings();
    fetchIntegrations();
    fetchKeywords();
    fetchThresholds();
  }, []);

  const handleSave = useCallback(async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const updateField = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateIntegration = (field: keyof SiteSettings['integrations'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      integrations: { ...settings.integrations, [field]: value || undefined },
    });
  };

  const openMediaPicker = (field: MediaField) => {
    setActiveMediaField(field);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (results: MediaPickerResult[]) => {
    if (results.length > 0 && activeMediaField && settings) {
      setSettings({ ...settings, [activeMediaField]: results[0].publicUrl });
    }
    setMediaPickerOpen(false);
    setActiveMediaField(null);
  };

  const clearMediaField = (field: MediaField) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: undefined });
  };

  const updateSEOGEOPrompt = (prompt: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      seoGeo: {
        ...settings.seoGeo,
        systemPrompt: prompt,
        activePreset: 'custom',
      },
    });
  };

  const loadPreset = async (preset: SEOGEOPreset) => {
    if (!settings) return;
    setLoadingPreset(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset }),
      });
      if (!res.ok) throw new Error('Failed to load preset');
      const data = await res.json();
      setSettings({
        ...settings,
        seoGeo: {
          systemPrompt: data.prompt,
          activePreset: preset,
        },
      });
    } catch (err) {
      console.error('Error loading preset:', err);
    } finally {
      setLoadingPreset(false);
    }
  };

  const resetToDefault = () => {
    if (!settings || !defaultPrompt) return;
    setSettings({
      ...settings,
      seoGeo: {
        systemPrompt: defaultPrompt,
        activePreset: 'default',
      },
    });
  };

  const addKeyword = useCallback(async () => {
    const trimmed = newKeyword.trim();
    if (!trimmed || keywords.includes(trimmed)) return;
    const updated = [...keywords, trimmed];
    setNewKeyword('');
    setKeywords(updated);
    setKeywordsSaving(true);
    try {
      await fetch('/api/admin/settings/keywords', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: updated }),
      });
    } catch {
      // revert
      setKeywords(keywords);
    } finally {
      setKeywordsSaving(false);
    }
  }, [newKeyword, keywords]);

  const removeKeyword = useCallback(async (keyword: string) => {
    const updated = keywords.filter((k) => k !== keyword);
    setKeywords(updated);
    setKeywordsSaving(true);
    try {
      await fetch('/api/admin/settings/keywords', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: updated }),
      });
    } catch {
      // revert
      setKeywords(keywords);
    } finally {
      setKeywordsSaving(false);
    }
  }, [keywords]);

  const saveThresholds = useCallback(async () => {
    setThresholdsSaving(true);
    try {
      const res = await fetch('/api/admin/settings/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thresholds }),
      });
      if (res.ok) {
        setThresholdsSaved(true);
        setTimeout(() => setThresholdsSaved(false), 3000);
      }
    } catch {
      // silently fail
    } finally {
      setThresholdsSaving(false);
    }
  }, [thresholds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <span className="ml-3 text-body-md text-jhr-white-dim">Loading settings...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <p className="text-red-400">{error || 'Failed to load settings'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">
            Settings
          </h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Configure your site settings and integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : success ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* API Connection Status Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Wifi className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">API Connection Status</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Real-time connection status for all integrations.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {integrationsLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-jhr-black-lighter rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-jhr-black-lighter"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        integration.connected ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <span className="text-body-sm font-medium text-jhr-white">
                      {integration.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        integration.connected
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-red-400/10 text-red-400 border border-red-400/20'
                      }`}
                    >
                      {integration.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    {integration.details && (
                      <span className="text-xs text-jhr-white-dim hidden sm:inline">
                        {integration.details}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tracked Keywords Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Tag className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">Tracked Keywords</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Keywords monitored for search position changes.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {keywordsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse bg-jhr-black-lighter rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="Add a keyword..."
                  className="flex-1 px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold text-sm"
                />
                <button
                  onClick={addKeyword}
                  disabled={keywordsSaving || !newKeyword.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium text-sm hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jhr-black border border-jhr-black-lighter text-sm text-jhr-white"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="text-jhr-white-dim hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {keywords.length === 0 && (
                <p className="text-body-sm text-jhr-white-dim text-center py-4">
                  No keywords tracked yet. Add keywords above to monitor search positions.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Alert Thresholds Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-body-lg font-semibold text-jhr-white">Alert Thresholds</h2>
                <p className="text-body-sm text-jhr-white-dim">
                  Configure when alerts are triggered for each metric.
                </p>
              </div>
            </div>
            <button
              onClick={saveThresholds}
              disabled={thresholdsSaving || thresholdsLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium text-sm hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
            >
              {thresholdsSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : thresholdsSaved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {thresholdsSaving ? 'Saving...' : thresholdsSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        <div className="p-6">
          {thresholdsLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-jhr-black-lighter rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  PSI Desktop Minimum
                </label>
                <input
                  type="number"
                  value={thresholds.psiDesktopMin}
                  onChange={(e) => setThresholds({ ...thresholds, psiDesktopMin: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when PSI desktop drops below this.</p>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  PSI Mobile Minimum
                </label>
                <input
                  type="number"
                  value={thresholds.psiMobileMin}
                  onChange={(e) => setThresholds({ ...thresholds, psiMobileMin: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when PSI mobile drops below this.</p>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  Keyword Drop (positions)
                </label>
                <input
                  type="number"
                  value={thresholds.keywordDropPositions}
                  onChange={(e) => setThresholds({ ...thresholds, keywordDropPositions: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when a keyword drops this many positions.</p>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  No Leads (days)
                </label>
                <input
                  type="number"
                  value={thresholds.noLeadsDays}
                  onChange={(e) => setThresholds({ ...thresholds, noLeadsDays: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when no leads come in for this many days.</p>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  IG Reach Drop (%)
                </label>
                <input
                  type="number"
                  value={thresholds.igReachDropPercent}
                  onChange={(e) => setThresholds({ ...thresholds, igReachDropPercent: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when IG reach drops by this percentage.</p>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  GEO Score Drop (points)
                </label>
                <input
                  type="number"
                  value={thresholds.geoScoreDropPoints}
                  onChange={(e) => setThresholds({ ...thresholds, geoScoreDropPoints: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
                />
                <p className="mt-1 text-xs text-jhr-white-dim">Alert when GEO score drops by this many points.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* General Settings Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-jhr-gold/10">
              <Settings className="w-6 h-6 text-jhr-gold" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">General</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Basic site configuration and branding options.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="siteName" className="block text-body-sm font-medium text-jhr-white mb-2">
              Site Name
            </label>
            <input
              id="siteName"
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField('siteName', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              The name displayed in the browser tab and site header.
            </p>
          </div>

          <div>
            <label htmlFor="tagline" className="block text-body-sm font-medium text-jhr-white mb-2">
              Tagline
            </label>
            <input
              id="tagline"
              type="text"
              value={settings.siteTagline}
              onChange={(e) => updateField('siteTagline', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              A short description of your business.
            </p>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-body-sm font-medium text-jhr-white mb-2">
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Primary email address for contact form submissions.
            </p>
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-body-sm font-medium text-jhr-white mb-2">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Phone number displayed on the website.
            </p>
          </div>

          {/* Media Fields */}
          {(['logo', 'favicon', 'ogImage'] as MediaField[]).map((field) => {
            const labels: Record<MediaField, { label: string; desc: string }> = {
              logo: { label: 'Site Logo', desc: 'Logo displayed in the header and admin sidebar.' },
              favicon: { label: 'Favicon', desc: 'Small icon shown in browser tabs.' },
              ogImage: { label: 'Default Social Share Image', desc: 'Image shown when pages are shared on social media (1200x630 recommended).' },
            };
            const value = settings[field];
            return (
              <div key={field}>
                <label className="block text-body-sm font-medium text-jhr-white mb-2">
                  {labels[field].label}
                </label>
                <div className="flex items-center gap-3">
                  {value ? (
                    <div className="relative">
                      <img
                        src={value}
                        alt={labels[field].label}
                        className="w-16 h-16 rounded-lg object-cover border border-jhr-black-lighter"
                      />
                      <button
                        onClick={() => clearMediaField(field)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg border border-dashed border-jhr-black-lighter flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-jhr-white-dim" />
                    </div>
                  )}
                  <button
                    onClick={() => openMediaPicker(field)}
                    className="px-3 py-2 rounded-lg border border-jhr-black-lighter text-body-sm text-jhr-white-dim hover:text-jhr-white hover:border-jhr-gold/50 transition-colors"
                  >
                    {value ? 'Change' : 'Select'} Image
                  </button>
                </div>
                <p className="mt-1 text-body-sm text-jhr-white-dim">
                  {labels[field].desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Link2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">Integrations</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Connect external services and APIs.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="ga4MeasurementId" className="block text-body-sm font-medium text-jhr-white mb-2">
              Google Analytics 4 Measurement ID
            </label>
            <input
              id="ga4MeasurementId"
              type="text"
              value={settings.integrations.ga4MeasurementId || ''}
              onChange={(e) => updateIntegration('ga4MeasurementId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Your GA4 measurement ID for tracking.
            </p>
          </div>

          <div>
            <label htmlFor="metaPixelId" className="block text-body-sm font-medium text-jhr-white mb-2">
              Meta Pixel ID
            </label>
            <input
              id="metaPixelId"
              type="text"
              value={settings.integrations.metaPixelId || ''}
              onChange={(e) => updateIntegration('metaPixelId', e.target.value)}
              placeholder="XXXXXXXXXXXXXX"
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Facebook/Meta Pixel ID for conversion tracking.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">SEO</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Search engine optimization settings.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="metaTitle" className="block text-body-sm font-medium text-jhr-white mb-2">
              Default Meta Title
            </label>
            <input
              id="metaTitle"
              type="text"
              value={settings.defaultMetaTitle}
              onChange={(e) => updateField('defaultMetaTitle', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Default title tag for pages without custom titles (max 60 characters).
            </p>
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-body-sm font-medium text-jhr-white mb-2">
              Default Meta Description
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              value={settings.defaultMetaDescription}
              onChange={(e) => updateField('defaultMetaDescription', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold resize-none"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Default description for search results (max 160 characters).
            </p>
          </div>

          <div>
            <label htmlFor="robotsDirective" className="block text-body-sm font-medium text-jhr-white mb-2">
              Robots Directive
            </label>
            <select
              id="robotsDirective"
              value={settings.robotsDirective}
              onChange={(e) => updateField('robotsDirective', e.target.value)}
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            >
              <option value="index,follow">Index, Follow (Recommended)</option>
              <option value="index,nofollow">Index, No Follow</option>
              <option value="noindex,follow">No Index, Follow</option>
              <option value="noindex,nofollow">No Index, No Follow</option>
            </select>
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Default search engine crawling behavior for your site.
            </p>
          </div>
        </div>
      </div>

      {/* SEO/GEO AI Assistant Section */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-jhr-white">SEO/GEO AI Assistant</h2>
              <p className="text-body-sm text-jhr-white-dim">
                Configure the AI system prompt for generating SEO and GEO-optimized content.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Preset Selector */}
          <div>
            <label className="block text-body-sm font-medium text-jhr-white mb-3">
              Optimization Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(PRESET_LABELS) as SEOGEOPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => preset !== 'custom' && loadPreset(preset)}
                  disabled={loadingPreset || preset === 'custom'}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    settings.seoGeo?.activePreset === preset
                      ? 'border-jhr-gold bg-jhr-gold/10'
                      : 'border-jhr-black-lighter hover:border-jhr-gold/50'
                  } ${preset === 'custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body-sm font-medium text-jhr-white">
                      {PRESET_LABELS[preset].label}
                    </span>
                    {settings.seoGeo?.activePreset === preset && (
                      <span className="w-2 h-2 rounded-full bg-jhr-gold" />
                    )}
                  </div>
                  <p className="text-xs text-jhr-white-dim">
                    {PRESET_LABELS[preset].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="seoGeoPrompt" className="block text-body-sm font-medium text-jhr-white">
                System Prompt
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-jhr-white-dim">
                  {(settings.seoGeo?.systemPrompt || defaultPrompt || '').length} characters
                </span>
                <button
                  onClick={resetToDefault}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
            <textarea
              id="seoGeoPrompt"
              rows={12}
              value={settings.seoGeo?.systemPrompt || defaultPrompt || ''}
              onChange={(e) => updateSEOGEOPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold resize-none font-mono text-xs leading-relaxed"
            />
            <p className="mt-2 text-body-sm text-jhr-white-dim">
              This prompt guides the AI when generating SEO titles, descriptions, and GEO-optimized content
              for pages and blog posts. Changes are applied site-wide when you click &quot;Generate with AI&quot;
              in any SEO panel.
            </p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="flex items-center gap-2 text-body-sm text-jhr-white-dim">
        <Search className="w-4 h-4" />
        <p>
          Settings are stored securely and changes take effect immediately after saving.
          {settings.updatedAt && (
            <span className="ml-2">
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
            </span>
          )}
        </p>
      </div>

      {/* MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setActiveMediaField(null);
        }}
        onSelect={handleMediaSelect}
        options={{ allowedTypes: ['image'], multiple: false }}
      />
    </div>
  );
}
