'use client';

import { useState, useCallback, useMemo } from 'react';
import type { TikTokVideo, ViralScoreResult, SortOption } from '@/types';
import { calculateViralScore } from '@/lib/viral-score';

interface UseSearchReturn {
  videos: TikTokVideo[];
  scores: Map<string, ViralScoreResult>;
  sortedVideos: TikTokVideo[];
  keyword: string;
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  search: (keyword: string) => Promise<void>;
  retry: () => void;
}

export function useSearch(): UseSearchReturn {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('viral_score');

  // Calculate scores
  const scores = useMemo(() => {
    const map = new Map<string, ViralScoreResult>();
    videos.forEach((v) => map.set(v.id, calculateViralScore(v)));
    return map;
  }, [videos]);

  // Sorted videos
  const sortedVideos = useMemo(() => {
    const sorted = [...videos];
    switch (sortBy) {
      case 'viral_score':
        sorted.sort((a, b) => (scores.get(b.id)?.total || 0) - (scores.get(a.id)?.total || 0));
        break;
      case 'views':
        sorted.sort((a, b) => b.stats.playCount - a.stats.playCount);
        break;
      case 'likes':
        sorted.sort((a, b) => b.stats.diggCount - a.stats.diggCount);
        break;
      case 'shares':
        sorted.sort((a, b) => b.stats.shareCount - a.stats.shareCount);
        break;
      case 'newest':
        sorted.sort((a, b) => b.createTime - a.createTime);
        break;
    }
    return sorted;
  }, [videos, sortBy, scores]);

  const search = useCallback(async (kw: string) => {
    setKeyword(kw);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?keyword=${encodeURIComponent(kw)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setVideos(data.videos || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (keyword) search(keyword);
  }, [keyword, search]);

  return {
    videos,
    scores,
    sortedVideos,
    keyword,
    isLoading,
    error,
    sortBy,
    setSortBy,
    search,
    retry,
  };
}
