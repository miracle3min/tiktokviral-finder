'use client';

import { useEffect, useRef, useCallback } from 'react';
import { X, Download, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import type { TikTokVideo } from '@/types';
import { useState } from 'react';

interface VideoPlayerProps {
  video: TikTokVideo;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const tiktokUrl = `https://www.tiktok.com/@${video.author.uniqueId}/video/${video.id}`;

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(video.video.downloadAddr || video.video.playAddr)}&id=${video.id}`);
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
      // Fallback: open in new tab
      window.open(video.video.downloadAddr || video.video.playAddr, '_blank');
    }
  }, [video]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-slideUp">
        {/* Video container */}
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md
                       flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70
                       transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Loading state */}
          {loading && !error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="dot-animation flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="aspect-[9/16] flex flex-col items-center justify-center bg-gray-900 text-white/70 gap-3 p-6">
              <p className="text-sm text-center">Video tidak bisa diputar langsung</p>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-button text-sm flex items-center gap-2 !bg-white/10 !text-white !border-white/20"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di TikTok
              </a>
            </div>
          )}

          {/* Video */}
          {!error && (
            <video
              ref={videoRef}
              src={video.video.playAddr}
              className="w-full aspect-[9/16] object-contain bg-black"
              autoPlay
              loop
              muted={muted}
              playsInline
              onLoadedData={() => setLoading(false)}
              onError={() => { setError(true); setLoading(false); }}
              poster={video.video.cover}
            />
          )}

          {/* Bottom controls */}
          {!error && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {/* Author info */}
              <div className="flex items-center gap-2 mb-3">
                {video.author.avatarThumb && (
                  <img
                    src={video.author.avatarThumb}
                    alt={video.author.nickname}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                )}
                <div>
                  <p className="text-white text-sm font-semibold">{video.author.nickname}</p>
                  <p className="text-white/60 text-xs">@{video.author.uniqueId}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-xs line-clamp-2 mb-3">{video.desc}</p>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md
                             text-white/90 text-xs font-medium hover:bg-white/25 transition-all"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md
                             text-white/90 text-xs font-medium hover:bg-white/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md
                             text-white/90 text-xs font-medium hover:bg-white/25 transition-all ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  TikTok
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
