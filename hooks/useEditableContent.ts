'use client';

import { useState, useEffect } from 'react';

interface ContentData {
  value: string;
  contentType: string;
  updatedAt: string;
}

// Cache for fetched content to avoid repeated API calls
const contentCache = new Map<string, ContentData>();

export function useEditableContent(
  pageId: string,
  sectionId: string,
  contentKey: string,
  defaultValue: string
): {
  value: string;
  isLoading: boolean;
} {
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `${pageId}:${sectionId}:${contentKey}`;

    // Check cache first
    if (contentCache.has(cacheKey)) {
      const cached = contentCache.get(cacheKey)!;
      setValue(cached.value);
      setIsLoading(false);
      return;
    }

    // Fetch from API
    const fetchContent = async () => {
      try {
        const response = await fetch(
          `/api/admin/content?pageId=${pageId}&sectionId=${sectionId}&contentKey=${contentKey}`
        );

        if (response.ok) {
          const { content } = await response.json();
          if (content?.value) {
            setValue(content.value);
            contentCache.set(cacheKey, content);
          }
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pageId, sectionId, contentKey]);

  return { value, isLoading };
}

// Clear cache when content is saved (call this after successful save)
export function clearContentCache() {
  contentCache.clear();
}
