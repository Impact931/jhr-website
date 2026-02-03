import { NextRequest, NextResponse } from 'next/server';
import { listMedia } from '@/lib/media';
import type { MediaListParams, MediaType } from '@/types/media';

/**
 * GET /api/admin/media — List media items with pagination, search, and filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: MediaListParams = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : 24,
      mediaType: (searchParams.get('mediaType') as MediaType) || undefined,
      collectionId: searchParams.get('collectionId') || undefined,
      tag: searchParams.get('tag') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as MediaListParams['sortBy']) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await listMedia(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing media:', error);
    // Return empty list instead of 500 so the UI still renders
    return NextResponse.json({ items: [], total: 0 });
  }
}
