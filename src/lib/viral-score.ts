import type { TikTokVideo, ViralScoreResult } from '@/types';

export function calculateViralScore(video: TikTokVideo): ViralScoreResult {
  const { playCount, diggCount, commentCount, shareCount, collectCount } = video.stats;

  // Guard against zero views
  if (playCount === 0) {
    return { total: 0, engagementRate: 0, shareRatio: 0, saveRatio: 0, velocity: 0, reach: 0, label: 'Low', color: '#94a3b8' };
  }

  // 1. Engagement Rate (0-30 points)
  const totalEngagement = diggCount + commentCount + shareCount + collectCount;
  const engagementPct = (totalEngagement / playCount) * 100;
  const engagementScore = Math.min(30, engagementPct * 3);

  // 2. Share Ratio - strongest virality signal (0-25 points)
  const sharePct = (shareCount / playCount) * 100;
  const shareScore = Math.min(25, sharePct * 25);

  // 3. Save Ratio - high-value content signal (0-15 points)
  const savePct = (collectCount / playCount) * 100;
  const saveScore = Math.min(15, savePct * 15);

  // 4. Velocity - views per hour since posting (0-20 points)
  const hoursOld = Math.max(1, (Date.now() / 1000 - video.createTime) / 3600);
  const viewsPerHour = playCount / hoursOld;
  const velocityScore = Math.min(20, Math.log10(Math.max(1, viewsPerHour)) * 5);

  // 5. Raw Reach bonus (0-10 points)
  const reachScore = Math.min(10, Math.log10(Math.max(1, playCount)) * 1.5);

  const total = Math.round(
    engagementScore + shareScore + saveScore + velocityScore + reachScore
  );

  const clampedTotal = Math.min(100, Math.max(0, total));

  return {
    total: clampedTotal,
    engagementRate: Math.round(engagementPct * 100) / 100,
    shareRatio: Math.round(sharePct * 1000) / 1000,
    saveRatio: Math.round(savePct * 1000) / 1000,
    velocity: Math.round(viewsPerHour),
    reach: playCount,
    label: getLabel(clampedTotal),
    color: getColor(clampedTotal),
  };
}

function getLabel(score: number): ViralScoreResult['label'] {
  if (score >= 80) return 'Mega Viral';
  if (score >= 60) return 'Viral';
  if (score >= 40) return 'High';
  if (score >= 20) return 'Medium';
  return 'Low';
}

function getColor(score: number): string {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#22c55e';
  return '#94a3b8';
}
