import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const videoId = request.nextUrl.searchParams.get('id') || 'video';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL is from TikTok CDN
  const allowed = ['tiktok.com', 'tiktokcdn.com', 'tiktokcdn-eu.com', 'tiktokcdn-us.com'];
  let urlHost: string;
  try {
    urlHost = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!allowed.some(domain => urlHost.endsWith(domain))) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    logger.info('Download proxy', { videoId, urlHost });

    const response = await fetch(url, {
      headers: {
        'Referer': 'https://www.tiktok.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      logger.error('Download proxy failed', { status: response.status, videoId });
      return NextResponse.json({ error: 'Failed to fetch video' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="tiktok_${videoId}.mp4"`,
      'Cache-Control': 'no-cache',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    logger.info('Download proxy success', { videoId, contentLength });

    return new NextResponse(response.body, { status: 200, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Download failed';
    logger.error('Download proxy error', { videoId, error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
