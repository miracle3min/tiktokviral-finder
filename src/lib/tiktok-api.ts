import axios from 'axios';
import { logger } from './logger';
import type { TikTokVideo } from '@/types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'tiktok-scraper17.p.rapidapi.com';

interface RawApiVideo {
  post_id?: string;
  url?: string;
  description?: string;
  create_time?: string;
  digg_count?: number;
  share_count?: number | string;
  collect_count?: number;
  comment_count?: number;
  play_count?: number;
  video_duration?: number;
  hashtags?: string[];
  original_sound?: string;
  profile_id?: string;
  profile_username?: string;
  profile_url?: string;
  profile_avatar?: string;
  profile_biography?: string;
  preview_image?: string;
  post_type?: string;
  video_url?: string;
  cdn_url?: string;
  is_verified?: boolean;
  ratio?: string;
  music?: {
    title?: string;
    authorname?: string;
    id?: string;
  };
}

function normalizeVideo(raw: RawApiVideo): TikTokVideo {
  const shareCount = typeof raw.share_count === 'string'
    ? parseInt(raw.share_count, 10) || 0
    : raw.share_count ?? 0;

  return {
    id: raw.post_id || String(Date.now()),
    desc: raw.description || '',
    createTime: raw.create_time
      ? Math.floor(new Date(raw.create_time).getTime() / 1000)
      : Math.floor(Date.now() / 1000),
    author: {
      uniqueId: raw.profile_username || 'unknown',
      nickname: raw.profile_username || 'Unknown',
      avatarThumb: raw.profile_avatar || '',
      verified: raw.is_verified || false,
    },
    stats: {
      playCount: raw.play_count ?? 0,
      diggCount: raw.digg_count ?? 0,
      commentCount: raw.comment_count ?? 0,
      shareCount: shareCount,
      collectCount: raw.collect_count ?? 0,
    },
    video: {
      cover: raw.preview_image || '',
      dynamicCover: raw.preview_image || '',
      duration: raw.video_duration || 0,
      ratio: raw.ratio || '720p',
    },
    music: raw.music
      ? {
          title: raw.music.title || 'Unknown',
          authorName: raw.music.authorname || 'Unknown',
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

    const response = await axios.post(
      `https://${RAPIDAPI_HOST}/social-media/tiktok-scraper/posts-by-keyword`,
      {
        keyword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        timeout: 30000,
      }
    );

    const duration = Date.now() - startTime;
    logger.api('POST', '/social-media/tiktok-scraper/posts-by-keyword', response.status, duration);

    const data = response.data;

    // The API can return data directly as an array or nested
    let rawVideos: RawApiVideo[] = [];
    if (Array.isArray(data)) {
      rawVideos = data;
    } else if (data?.data && Array.isArray(data.data)) {
      rawVideos = data.data;
    } else if (data?.results && Array.isArray(data.results)) {
      rawVideos = data.results;
    }

    if (rawVideos.length === 0) {
      logger.warn('TikTok API: No videos found or unexpected response', {
        keys: Object.keys(data || {}),
        type: typeof data,
      });
      return [];
    }

    // Limit to requested count
    const limited = rawVideos.slice(0, count);
    const videos = limited.map(normalizeVideo);
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
        throw new Error(
          'Rate limit exceeded. Please wait a moment and try again.'
        );
      }

      if (status === 403 || status === 401) {
        throw new Error(
          'API authentication failed. Please check your API key.'
        );
      }

      throw new Error('Failed to fetch TikTok data. Please try again.');
    }

    logger.error('TikTok API: Unexpected error', { error, keyword });
    throw new Error('An unexpected error occurred. Please try again.');
  }
}
