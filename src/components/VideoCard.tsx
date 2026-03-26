'use client';

import { Play, Heart, MessageCircle, Share2, Bookmark, Music2, BadgeCheck } from 'lucide-react';
import type { TikTokVideo, ViralScoreResult } from '@/types';
import { formatNumber, formatDuration, timeAgo } from '@/lib/utils';
import ViralScore from './ViralScore';

interface VideoCardProps {
  video: TikTokVideo;
  score: ViralScoreResult;
}

export default function VideoCard({ video, score }: VideoCardProps) {
  const tiktokUrl = `https://www.tiktok.com/@${video.author.uniqueId}/video/${video.id}`;

  return (
    <a
      href={tiktokUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="clay-card p-4 space-y-3 group cursor-pointer block"
    >
      {/* Thumbnail */}
      <div className="relative rounded-2xl overflow-hidden bg-clay-100/50 aspect-[9/12]">
        {video.video.cover ? (
          <img
            src={video.video.cover}
            alt={video.desc || 'TikTok video'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-clay-100 to-clay-200">
            <Play className="w-12 h-12 text-clay-400" />
          </div>
        )}

        {/* Duration badge */}
        {video.video.duration > 0 && (
          <div className="absolute bottom-2 right-2 clay-badge text-[10px] bg-black/50 text-white border-none backdrop-blur-sm">
            {formatDuration(video.video.duration)}
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300
                        flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-white/80 shadow-clay-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-clay-500 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2.5">
        {video.author.avatarThumb ? (
          <img
            src={video.author.avatarThumb}
            alt={video.author.nickname}
            className="w-8 h-8 rounded-full object-cover shadow-clay-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-clay-300 to-pink-300 shadow-clay-sm" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-700 truncate">
              {video.author.nickname}
            </span>
            {video.author.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <span className="text-xs text-gray-400">@{video.author.uniqueId} · {timeAgo(video.createTime)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[2rem]">
        {video.desc || 'No description'}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap gap-1.5">
        <span className="clay-badge text-[10px]">
          <Play className="w-3 h-3" /> {formatNumber(video.stats.playCount)}
        </span>
        <span className="clay-badge text-[10px]">
          <Heart className="w-3 h-3 text-red-400" /> {formatNumber(video.stats.diggCount)}
        </span>
        <span className="clay-badge text-[10px]">
          <MessageCircle className="w-3 h-3 text-blue-400" /> {formatNumber(video.stats.commentCount)}
        </span>
        <span className="clay-badge text-[10px]">
          <Share2 className="w-3 h-3 text-green-400" /> {formatNumber(video.stats.shareCount)}
        </span>
        {video.stats.collectCount > 0 && (
          <span className="clay-badge text-[10px]">
            <Bookmark className="w-3 h-3 text-yellow-400" /> {formatNumber(video.stats.collectCount)}
          </span>
        )}
      </div>

      {/* Music + Score */}
      <div className="flex items-center justify-between pt-1">
        {video.music ? (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 truncate max-w-[60%]">
            <Music2 className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{video.music.title}</span>
          </div>
        ) : (
          <div />
        )}
        <ViralScore score={score} size="sm" />
      </div>
    </a>
  );
}
