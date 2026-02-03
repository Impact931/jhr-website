import { NextRequest, NextResponse } from 'next/server';
import { getMediaStats, recalculateStats } from '@/lib/media';

/**
 * GET /api/admin/media/stats — Get media storage statistics
 * POST /api/admin/media/stats — Recalculate stats from scratch
 */
export async function GET() {
  try {
    const stats = await getMediaStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting media stats:', error);
    // Return defaults so the UI still renders
    return NextResponse.json({
      totalCount: 0,
      totalSize: 0,
      imageCount: 0,
      videoCount: 0,
      imageSize: 0,
      videoSize: 0,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function POST() {
  try {
    const stats = await recalculateStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error recalculating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
