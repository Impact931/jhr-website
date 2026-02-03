'use client';

import { useState } from 'react';
import { Video, Loader2, ExternalLink } from 'lucide-react';

interface VideoEmbedInputProps {
  onEmbed: (mediaId: string) => void;
}

export default function VideoEmbedInput({ onEmbed }: VideoEmbedInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{
    thumbnailUrl?: string;
    title?: string;
    provider: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const res = await fetch('/api/admin/media/video-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process video URL');
      }

      const data = await res.json();
      setPreview({
        thumbnailUrl: data.thumbnailUrl,
        title: data.title,
        provider: data.provider,
      });
      onEmbed(data.mediaId);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to embed video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jhr-white-dim" />
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Paste YouTube or Vimeo URL..."
            className="w-full pl-9 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none focus:ring-2 focus:ring-jhr-gold/50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim()}
          className="px-4 py-2 rounded-lg bg-jhr-gold text-jhr-black text-sm font-medium hover:bg-jhr-gold/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Embed'}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {preview && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-jhr-black-lighter">
          {preview.thumbnailUrl && (
            <img
              src={preview.thumbnailUrl}
              alt=""
              className="w-20 h-12 rounded object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-jhr-white truncate">
              {preview.title || 'Video embedded'}
            </p>
            <p className="text-xs text-jhr-white-dim capitalize">{preview.provider}</p>
          </div>
        </div>
      )}
    </div>
  );
}
