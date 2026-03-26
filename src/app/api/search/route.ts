import { NextRequest, NextResponse } from 'next/server';
import { searchTikTokVideos } from '@/lib/tiktok-api';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const keyword = request.nextUrl.searchParams.get('keyword');

  if (!keyword || keyword.trim().length === 0) {
    return NextResponse.json(
      { error: 'Keyword is required' },
      { status: 400 }
    );
  }

  if (keyword.length > 100) {
    return NextResponse.json(
      { error: 'Keyword too long (max 100 characters)' },
      { status: 400 }
    );
  }

  try {
    logger.info('Search request', { keyword });

    const videos = await searchTikTokVideos(keyword.trim());

    const duration = Date.now() - startTime;
    logger.api('GET', '/api/search', 200, duration);

    return NextResponse.json({
      videos,
      keyword: keyword.trim(),
      totalResults: videos.length,
      searchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : 'Internal server error';

    logger.error('Search failed', { keyword, error: message, duration });

    const status = message.includes('Rate limit') ? 429
      : message.includes('authentication') ? 401
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
