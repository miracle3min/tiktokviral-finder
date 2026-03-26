'use client';

import type { ViralScoreResult } from '@/types';

interface ViralScoreProps {
  score: ViralScoreResult;
  size?: 'sm' | 'md';
}

export default function ViralScore({ score, size = 'md' }: ViralScoreProps) {
  const dimensions = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const radius = size === 'sm' ? 16 : 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.total / 100) * circumference;
  const viewBox = size === 'sm' ? '0 0 40 40' : '0 0 52 52';
  const center = size === 'sm' ? 20 : 26;

  return (
    <div className="relative group">
      <div className={`${dimensions} relative`}>
        <svg viewBox={viewBox} className="w-full h-full -rotate-90">
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={size === 'sm' ? 3 : 4}
          />
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={score.color}
            strokeWidth={size === 'sm' ? 3 : 4}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="score-ring"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${textSize} font-bold`}
             style={{ color: score.color }}>
          {score.total}
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 pointer-events-none z-20">
        <div className="clay-card p-3 text-xs space-y-1 whitespace-nowrap">
          <div className="font-bold text-center" style={{ color: score.color }}>{score.label}</div>
          <div className="text-gray-500">Engagement: {score.engagementRate}%</div>
          <div className="text-gray-500">Share ratio: {score.shareRatio}%</div>
          <div className="text-gray-500">Velocity: {score.velocity.toLocaleString()} views/hr</div>
        </div>
      </div>
    </div>
  );
}
