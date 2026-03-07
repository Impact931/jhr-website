import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';

/**
 * POST /api/admin/contentops/research — Run Phase 1 research only
 *
 * Body: { topic: string, icpTag: string, primaryKeyword: string }
 * Response: { research: ResearchPayload } or { error: string }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, icpTag, primaryKeyword } = body;

    if (!topic || !icpTag || !primaryKeyword) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, icpTag, primaryKeyword' },
        { status: 400 }
      );
    }

    const result = await runResearch(topic, icpTag, primaryKeyword);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ research: result.data });
  } catch (error) {
    console.error('ContentOps research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research phase failed' },
      { status: 500 }
    );
  }
}
