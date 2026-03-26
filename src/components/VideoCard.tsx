'use client';

import { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, Bookmark, Music2, BadgeCheck, Download } from 'lucide-react';
import type { TikTokVideo, ViralScoreResult } from '@/types';
import { formatNumber, formatDuration, timeAgo } from '@/lib/utils';
import ViralScore from './ViralScore';
import VideoPlayer from './VideoPlayer';

interface VideoCardProps {
  video: TikTokVideo;
  score: ViralScoreResult;
}

export default function VideoCard({ video, score }: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const downloadUrl = video.video.downloadAddr || video.video.playAddr;
      if (!downloadUrl) return;
      const res = await fetch(`/api/download?url=${encodeURIComponent(downloadUrl)}&id=${video.id}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tiktok_${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const fallback = video.video.downloadAddr || video.video.playAddr;
      if (fallback) window.open(fallback, '_blank');
    }
  };

  return (
    <>
      <div
        className="clay-card p-4 space-y-3 group cursor-pointer block"
        onClick={() => setShowPlayer(true)}
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300
                          flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-14 h-14 rounded-full bg-white/90 shadow-clay-sm flex items-center justify-center
                            transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-clay-500 ml-0.5" fill="currentColor" />
            </div>
          </div>

          {/* Download button overlay */}
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm
                       flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60
                       opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            title="Download video"
          >
            <Download className="w-4 h-4" />
          </button>
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
      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer video={video} onClose={() => setShowPlayer(false)} />
      )}
    </>
  );
}
