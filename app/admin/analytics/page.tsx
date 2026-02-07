'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart3, Save, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface AnalyticsConfig {
  ga4MeasurementId?: string;
  metaPixelId?: string;
}

export default function AdminAnalyticsPage() {
  const [config, setConfig] = useState<AnalyticsConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setConfig({
          ga4MeasurementId: data.settings.integrations?.ga4MeasurementId || '',
          metaPixelId: data.settings.integrations?.metaPixelId || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrations: {
            ga4MeasurementId: config.ga4MeasurementId ?? '',
            metaPixelId: config.metaPixelId ?? '',
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [config]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <span className="ml-3 text-body-md text-jhr-white-dim">Loading analytics config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-display font-bold text-jhr-white">Analytics</h1>
          <p className="mt-2 text-body-md text-jhr-white-dim">
            Configure tracking scripts and view analytics dashboards.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black font-medium hover:bg-jhr-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : success ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Google Analytics 4 */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-body-lg font-semibold text-jhr-white">Google Analytics 4</h2>
                <p className="text-body-sm text-jhr-white-dim">Track page views, events, and user behavior.</p>
              </div>
            </div>
            <StatusIndicator configured={!!config.ga4MeasurementId} />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="ga4Id" className="block text-body-sm font-medium text-jhr-white mb-2">
              Measurement ID
            </label>
            <input
              id="ga4Id"
              type="text"
              value={config.ga4MeasurementId || ''}
              onChange={(e) => setConfig({ ...config, ga4MeasurementId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Find this in your GA4 property settings under Data Streams.
            </p>
          </div>
          {config.ga4MeasurementId && (
            <a
              href={`https://analytics.google.com/analytics/web/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Google Analytics Dashboard
            </a>
          )}
        </div>
      </div>

      {/* Meta Pixel */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter overflow-hidden">
        <div className="p-6 border-b border-jhr-black-lighter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-500/10">
                <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.93 3.78-3.93 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </div>
              <div>
                <h2 className="text-body-lg font-semibold text-jhr-white">Meta Pixel</h2>
                <p className="text-body-sm text-jhr-white-dim">Track conversions and build audiences for Meta ads.</p>
              </div>
            </div>
            <StatusIndicator configured={!!config.metaPixelId} />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="metaPixelId" className="block text-body-sm font-medium text-jhr-white mb-2">
              Pixel ID
            </label>
            <input
              id="metaPixelId"
              type="text"
              value={config.metaPixelId || ''}
              onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
              placeholder="XXXXXXXXXXXXXX"
              className="w-full px-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder:text-jhr-white-dim focus:outline-none focus:ring-2 focus:ring-jhr-gold/50 focus:border-jhr-gold"
            />
            <p className="mt-1 text-body-sm text-jhr-white-dim">
              Find this in Meta Events Manager under your pixel settings.
            </p>
          </div>
          {config.metaPixelId && (
            <a
              href="https://business.facebook.com/events_manager2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Meta Events Manager
            </a>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4">
        <p className="text-body-sm text-jhr-white-dim">
          Tracking scripts are automatically injected into all public pages when configured.
          Changes take effect on the next page load after saving. Admin pages are not tracked.
        </p>
      </div>
    </div>
  );
}

function StatusIndicator({ configured }: { configured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        configured
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${configured ? 'bg-green-400' : 'bg-gray-400'}`} />
      {configured ? 'Configured' : 'Not Configured'}
    </span>
  );
}
