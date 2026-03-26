import axios from 'axios';
import { logger } from './logger';
import type { TikTokVideo } from '@/types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'tiktok-scraper17.p.rapidapi.com';

interface RawApiVideo {
  video_id?: string;
  aweme_id?: string;
  desc?: string;
  create_time?: number;
  author?: {
    unique_id?: string;
    uniqueId?: string;
    nickname?: string;
    avatar_thumb?: { url_list?: string[] };
    avatarThumb?: string;
    verified?: boolean;
  };
  statistics?: {
    play_count?: number;
    playCount?: number;
    digg_count?: number;
    diggCount?: number;
    comment_count?: number;
    commentCount?: number;
    share_count?: number;
    shareCount?: number;
    collect_count?: number;
    collectCount?: number;
  };
  video?: {
    cover?: { url_list?: string[] };
    dynamic_cover?: { url_list?: string[] };
    duration?: number;
    ratio?: string;
    originCover?: string;
    dynamicCover?: string;
  };
  music?: {
    title?: string;
    author?: string;
    authorName?: string;
  };
}

function normalizeVideo(raw: RawApiVideo): TikTokVideo {
  const stats = raw.statistics || {};
  const author = raw.author || {};
  const video = raw.video || {};

  return {
    id: raw.video_id || raw.aweme_id || String(Date.now()),
    desc: raw.desc || '',
    createTime: raw.create_time || Math.floor(Date.now() / 1000),
    author: {
      uniqueId: author.unique_id || author.uniqueId || 'unknown',
      nickname: author.nickname || 'Unknown',
      avatarThumb:
        author.avatar_thumb?.url_list?.[0] ||
        author.avatarThumb ||
        '',
      verified: author.verified || false,
    },
    stats: {
      playCount: stats.play_count ?? stats.playCount ?? 0,
      diggCount: stats.digg_count ?? stats.diggCount ?? 0,
      commentCount: stats.comment_count ?? stats.commentCount ?? 0,
      shareCount: stats.share_count ?? stats.shareCount ?? 0,
      collectCount: stats.collect_count ?? stats.collectCount ?? 0,
    },
    video: {
      cover:
        video.cover?.url_list?.[0] ||
        video.originCover ||
        '',
      dynamicCover:
        video.dynamic_cover?.url_list?.[0] ||
        video.dynamicCover ||
        '',
      duration: video.duration || 0,
      ratio: video.ratio || '720p',
    },
    music: raw.music
      ? {
          title: raw.music.title || 'Unknown',
          authorName: raw.music.author || raw.music.authorName || 'Unknown',
        }
      : undefined,
  };
}

export async function searchTikTokVideos(
  keyword: string,
  count: number = 20
): Promise<TikTokVideo[]> {
  const startTime = Date.now();

  try {
    logger.info('TikTok API: Searching', { keyword, count });

    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/api/search/general`,
      {
        params: {
          keyword,
          count: Math.min(count, 30),
        },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        timeout: 15000,
      }
    );

    const duration = Date.now() - startTime;
    logger.api('GET', '/api/search/general', response.status, duration);

    const data = response.data;
    const rawVideos: RawApiVideo[] = data?.data?.videos || data?.data || [];

    if (!Array.isArray(rawVideos)) {
      logger.warn('TikTok API: Unexpected response structure', {
        keys: Object.keys(data || {}),
      });
      return [];
    }

    const videos = rawVideos.map(normalizeVideo);
    logger.info(`TikTok API: Found ${videos.length} videos for "${keyword}"`);

    return videos;
  } catch (error) {
    const duration = Date.now() - startTime;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      logger.error(`TikTok API Error: ${status}`, {
        message: error.message,
        duration,
        keyword,
      });

      if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (status === 403 || status === 401) {
        throw new Error('API authentication failed. Please check your API key.');
      }
    }

    logger.error('TikTok API: Unexpected error', { error, keyword });
    throw new Error('Failed to fetch TikTok data. Please try again.');
  }
}
