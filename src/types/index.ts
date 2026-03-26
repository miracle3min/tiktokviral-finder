export interface TikTokVideo {
  id: string;
  desc: string;
  createTime: number;
  author: {
    uniqueId: string;
    nickname: string;
    avatarThumb: string;
    verified: boolean;
  };
  stats: {
    playCount: number;
    diggCount: number;
    commentCount: number;
    shareCount: number;
    collectCount: number;
  };
  video: {
    cover: string;
    dynamicCover: string;
    duration: number;
    ratio: string;
  };
  music?: {
    title: string;
    authorName: string;
  };
}

export interface ViralScoreResult {
  total: number;
  engagementRate: number;
  shareRatio: number;
  saveRatio: number;
  velocity: number;
  reach: number;
  label: 'Low' | 'Medium' | 'High' | 'Viral' | 'Mega Viral';
  color: string;
}

export interface SearchResult {
  videos: TikTokVideo[];
  keyword: string;
  totalResults: number;
  searchedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  resultCount: number;
  searchedAt: Date;
}

export type SortOption = 'viral_score' | 'views' | 'likes' | 'shares' | 'newest';
