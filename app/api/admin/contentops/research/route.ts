import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';
import { scrapeCompetitors } from '@/lib/contentops/competitor-scrape';

// Allow up to 60s for Perplexity research
export const maxDuration = 60;

/**
 * POST /api/admin/contentops/research — Run Phase 1 research + optional competitor scraping
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

    // Attempt competitor scraping with a tight timeout — skip if it takes too long
    // This prevents the whole request from timing out on Amplify Lambda
    let competitorContext = null;
    if (result.data?.competitorUrls && result.data.competitorUrls.length > 0) {
      try {
        const scrapePromise = scrapeCompetitors(result.data.competitorUrls);
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 15_000)
        );
        competitorContext = await Promise.race([scrapePromise, timeoutPromise]);
      } catch {
        // Competitor scraping is optional — proceed without it
        console.warn('[ContentOps] Competitor scraping skipped (timeout or error)');
      }
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
