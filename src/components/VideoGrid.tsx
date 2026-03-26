'use client';

import { ArrowUpDown } from 'lucide-react';
import type { TikTokVideo, ViralScoreResult, SortOption } from '@/types';
import VideoCard from './VideoCard';

interface VideoGridProps {
  videos: TikTokVideo[];
  scores: Map<string, ViralScoreResult>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  keyword: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'viral_score', label: '🔥 Viral Score' },
  { value: 'views', label: '👁️ Views' },
  { value: 'likes', label: '❤️ Likes' },
  { value: 'shares', label: '🔗 Shares' },
  { value: 'newest', label: '🕐 Newest' },
];

export default function VideoGrid({ videos, scores, sortBy, onSortChange, keyword }: VideoGridProps) {
  return (
    <div className="space-y-5">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-700">
          Found <span className="text-clay-500">{videos.length}</span> results for{' '}
          <span className="text-clay-500">&ldquo;{keyword}&rdquo;</span>
        </h2>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-1.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`clay-badge text-[11px] cursor-pointer transition-all duration-200
                  ${sortBy === opt.value
                    ? 'bg-clay-400/20 text-clay-600 shadow-clay-sm'
                    : 'text-gray-500 hover:text-clay-500 hover:bg-white/80'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            score={scores.get(video.id) || { total: 0, engagementRate: 0, shareRatio: 0, saveRatio: 0, velocity: 0, reach: 0, label: 'Low', color: '#94a3b8' }}
          />
        ))}
      </div>
    </div>
  );
}
