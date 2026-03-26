import axios from 'axios';
import { logger } from './logger';

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
    diggCount: number;
    shareCount: number;
    commentCount: number;
    playCount: number;
    collectCount: number;
  };
  video: {
    cover: string;
    duration: number;
    ratio: string;
  };
  music?: {
    title: string;
    authorName: string;
  };
  hashtags: string[];
}

interface RawVideo {
  id?: string;
  video_id?: string;
  desc?: string;
  title?: string;
  createTime?: number;
  create_time?: number;
  author?: {
    uniqueId?: string;
    unique_id?: string;
    nickname?: string;
    avatarThumb?: string;
    avatar_thumb?: string;
    verified?: boolean;
  };
  stats?: {
    diggCount?: number;
    shareCount?: number;
    commentCount?: number;
    playCount?: number;
    collectCount?: number;
  };
  diggCount?: number;
  digg_count?: number;
  shareCount?: number;
  share_count?: number;
  commentCount?: number;
  comment_count?: number;
  playCount?: number;
  play_count?: number;
  collectCount?: number;
  collect_count?: number;
  video?: {
    cover?: string;
    duration?: number;
    ratio?: string;
    originCover?: string;
  };
  cover?: string;
  duration?: number;
  music?: {
    title?: string;
    authorName?: string;
    author?: string;
  };
  challenges?: Array<{ title?: string }>;
  textExtra?: Array<{ hashtagName?: string }>;
  hashtags?: string[];
  [key: string]: unknown;
}

function parseNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,\s]/g, '');
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function normalizeVideo(raw: RawVideo): TikTokVideo {
  const stats = raw.stats || {};
  
  const hashtags: string[] = 
    raw.hashtags && Array.isArray(raw.hashtags)
      ? raw.hashtags.map((h: string | { title?: string }) => typeof h === 'string' ? h : h?.title || '').filter(Boolean)
      : raw.challenges
        ? raw.challenges.map((c) => c.title || '').filter(Boolean)
        : raw.textExtra
          ? raw.textExtra.map((t) => t.hashtagName || '').filter(Boolean)
          : [];

  return {
    id: raw.id || raw.video_id || '',
    desc: raw.desc || raw.title || '',
    createTime: raw.createTime || raw.create_time || 0,
    author: {
      uniqueId: raw.author?.uniqueId || raw.author?.unique_id || '',
      nickname: raw.author?.nickname || '',
      avatarThumb: raw.author?.avatarThumb || raw.author?.avatar_thumb || '',
      verified: raw.author?.verified || false,
    },
    stats: {
      diggCount: parseNumber(stats.diggCount ?? raw.diggCount ?? raw.digg_count ?? 0),
      shareCount: parseNumber(stats.shareCount ?? raw.shareCount ?? raw.share_count ?? 0),
      commentCount: parseNumber(stats.commentCount ?? raw.commentCount ?? raw.comment_count ?? 0),
      playCount: parseNumber(stats.playCount ?? raw.playCount ?? raw.play_count ?? 0),
      collectCount: parseNumber(stats.collectCount ?? raw.collectCount ?? raw.collect_count ?? 0),
    },
    video: {
      cover: raw.video?.cover || raw.video?.originCover || raw.cover || '',
      duration: raw.video?.duration || raw.duration || 0,
      ratio: raw.video?.ratio || '',
    },
    music: raw.music ? {
      title: raw.music.title || '',
      authorName: raw.music.authorName || raw.music.author || '',
    } : undefined,
    hashtags,
  };
}

export async function searchTikTok(keyword: string, count: number = 20): Promise<TikTokVideo[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey) {
    logger.error('RAPIDAPI_KEY not configured');
    throw new Error('API key not configured. Please set RAPIDAPI_KEY environment variable.');
  }

  logger.info('TikTok API: Searching', { keyword, count });

  try {
    const response = await axios.get('https://tiktok-api23.p.rapidapi.com/api/search/general', {
      params: {
        keyword,
        count: Math.min(count, 30),
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
      },
      timeout: 30000,
    });

    logger.info('TikTok API: Raw response status', { status: response.status });

    const data = response.data;
    
    // Handle various response formats
    let videos: RawVideo[] = [];
    
    if (Array.isArray(data)) {
      videos = data;
    } else if (data?.data && Array.isArray(data.data)) {
      videos = data.data;
    } else if (data?.item_list && Array.isArray(data.item_list)) {
      videos = data.item_list;
    } else if (data?.items && Array.isArray(data.items)) {
      videos = data.items;
    } else if (data?.result && Array.isArray(data.result)) {
      videos = data.result;
    } else if (data?.data?.videos && Array.isArray(data.data.videos)) {
      videos = data.data.videos;
    } else {
      logger.warn('TikTok API: Unexpected response structure', { 
        keys: data ? Object.keys(data) : 'null',
        type: typeof data 
      });
      // Try to find any array in the response
      if (data && typeof data === 'object') {
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            videos = data[key];
            logger.info('TikTok API: Found videos in key', { key, count: videos.length });
            break;
          }
        }
      }
    }

    logger.info('TikTok API: Found videos', { count: videos.length });

    const normalized = videos
      .map(normalizeVideo)
      .filter(v => v.id && v.stats.playCount > 0);

    logger.info('TikTok API: Normalized videos', { count: normalized.length });

    return normalized;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      logger.error('TikTok API Error', { 
        status,
        message,
        keyword,
      });

      if (status === 403) {
        throw new Error('API not subscribed. Please subscribe to TikTok API23 on RapidAPI (free tier available).');
      }
      if (status === 429) {
        throw new Error('API rate limit reached. Please try again later.');
      }
      if (status === 401) {
        throw new Error('Invalid API key. Please check your RAPIDAPI_KEY.');
      }
      
      throw new Error(`TikTok API error (${status}): ${message}`);
    }
    
    logger.error('TikTok API: Unexpected error', { error, keyword });
    throw new Error('Failed to fetch TikTok data. Please try again.');
  }
}
