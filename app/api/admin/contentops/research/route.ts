import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';
import { scrapeCompetitors } from '@/lib/contentops/competitor-scrape';

/**
 * POST /api/admin/contentops/research — Run Phase 1 research + competitor scraping
 *
 * Body: { topic: string, icpTag: string, primaryKeyword: string }
 * Response: { research: ResearchPayload, competitorContext?: CompetitorContext } or { error: string }
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

    // Scrape competitor URLs from research results (graceful fallback on failure)
    let competitorContext = null;
    if (result.data?.competitorUrls && result.data.competitorUrls.length > 0) {
      competitorContext = await scrapeCompetitors(result.data.competitorUrls);
    }

    return NextResponse.json({
      research: result.data,
      competitorContext,
    });
  } catch (error) {
    console.error('ContentOps research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research phase failed' },
      { status: 500 }
    );
  }
}
