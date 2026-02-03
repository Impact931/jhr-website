'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface MediaTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function MediaTagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
}: MediaTagInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (prefix.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/media?search=${encodeURIComponent(prefix)}&limit=1`
      );
      // For now, just clear suggestions — proper tag search endpoint would be better
      // This is a placeholder that works with the existing search
      setSuggestions([]);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (input.length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(input), 300);
    } else {
      setSuggestions([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, fetchSuggestions]);

  const addTag = (tag: string) => {
    const cleaned = tag.toLowerCase().trim();
    if (cleaned && !tags.includes(cleaned)) {
      onChange([...tags, cleaned]);
    }
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 bg-jhr-black border border-jhr-black-lighter rounded-lg min-h-[42px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-jhr-gold/20 text-jhr-gold text-xs"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-jhr-white placeholder:text-jhr-white-dim/50 focus:outline-none"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-jhr-black-light border border-jhr-black-lighter rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onMouseDown={() => addTag(s)}
              className="w-full px-3 py-2 text-left text-sm text-jhr-white hover:bg-jhr-black-lighter transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
