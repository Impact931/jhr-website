import { NextRequest, NextResponse } from 'next/server';
import { bulkOperation } from '@/lib/media';
import type { MediaBulkAction } from '@/types/media';

/**
 * POST /api/admin/media/bulk — Perform bulk operations on media items
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MediaBulkAction;

    if (!body.action || !body.mediaIds?.length) {
      return NextResponse.json(
        { error: 'action and mediaIds are required' },
        { status: 400 }
      );
    }

    if (!['tag', 'move', 'delete'].includes(body.action)) {
      return NextResponse.json(
        { error: 'action must be tag, move, or delete' },
        { status: 400 }
      );
    }

    if (body.mediaIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 items per bulk operation' },
        { status: 400 }
      );
    }

    const result = await bulkOperation(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
