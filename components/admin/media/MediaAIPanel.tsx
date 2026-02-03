'use client';

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import type { MediaItem } from '@/types/media';

interface MediaAIPanelProps {
  item: MediaItem;
  onGenerate: () => Promise<void>;
}

export default function MediaAIPanel({ item, onGenerate }: MediaAIPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const ai = item.aiMetadata;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-jhr-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI Metadata
        </h4>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : ai ? (
            <RefreshCw className="w-3 h-3" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {ai ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {ai ? (
        <div className="space-y-3 text-sm">
          {ai.altText && (
            <div>
              <span className="text-jhr-white-dim text-xs">Alt Text</span>
              <p className="text-jhr-white">{ai.altText}</p>
            </div>
          )}
          {ai.description && (
            <div>
              <span className="text-jhr-white-dim text-xs">Description</span>
              <p className="text-jhr-white">{ai.description}</p>
            </div>
          )}
          {ai.tags && ai.tags.length > 0 && (
            <div>
              <span className="text-jhr-white-dim text-xs">Suggested Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {ai.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {ai.seoText && (
            <div>
              <span className="text-jhr-white-dim text-xs">SEO Text</span>
              <p className="text-jhr-white">{ai.seoText}</p>
            </div>
          )}
          {ai.generatedAt && (
            <p className="text-[10px] text-jhr-white-dim">
              Generated {new Date(ai.generatedAt).toLocaleDateString()} via {ai.model}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-jhr-white-dim">
          Generate AI-powered alt text, tags, and descriptions.
        </p>
      )}
    </div>
  );
}
