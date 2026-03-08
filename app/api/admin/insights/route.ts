import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { putItem, queryItems } from '@/lib/dynamodb';
import Anthropic from '@anthropic-ai/sdk';

/**
 * GET /api/admin/insights
 *
 * AI-powered weekly recommendations engine.
 * - Gathers current data: PSI score, GEO score, social stats, keyword positions, lead count
 * - Calls Claude API with data bundle + system prompt
 * - Stores result in DynamoDB: pk=INSIGHTS#weekly, sk={YYYY-MM-DD}
 * - Returns latest recommendation
 *
 * Query params:
 *  ?refresh=true  - Force regenerate recommendations
 */

const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface InsightRecord {
  pk: string;
  sk: string;
  recommendations: string;
  dataSnapshot: Record<string, unknown>;
  generatedAt: string;
  model: string;
}

async function gatherPerformanceData(cookieHeader: string): Promise<Record<string, unknown>> {
  const data: Record<string, unknown> = {};

  // PSI Score
  try {
    const psiRes = await fetch(
      `${SITE_URL}/api/admin/psi?url=https://jhr-photography.com&strategy=desktop`,
      { headers: { cookie: cookieHeader }, signal: AbortSignal.timeout(60000) }
    );
    if (psiRes.ok) {
      const psi = await psiRes.json();
      data.psiDesktop = psi.performanceScore;
    }
  } catch {
    // PSI unavailable
  }

  // PSI Mobile
  try {
    const psiRes = await fetch(
      `${SITE_URL}/api/admin/psi?url=https://jhr-photography.com&strategy=mobile`,
      { headers: { cookie: cookieHeader }, signal: AbortSignal.timeout(60000) }
    );
    if (psiRes.ok) {
      const psi = await psiRes.json();
      data.psiMobile = psi.performanceScore;
    }
  } catch {
    // PSI mobile unavailable
  }

  // GEO Score
  try {
    const geoRes = await fetch(`${SITE_URL}/api/admin/geo/score`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(30000),
    });
    if (geoRes.ok) {
      const geo = await geoRes.json();
      data.geoScore = geo.totalScore;
      data.geoBreakdown = geo.breakdown;
    }
  } catch {
    // GEO unavailable
  }

  // Social Stats
  try {
    const metaRes = await fetch(`${SITE_URL}/api/admin/social/meta`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(15000),
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      if (meta.connected) {
        data.igFollowers = meta.account?.followersCount;
        data.igReach = meta.insights?.reach;
        data.igImpressions = meta.insights?.impressions;
      }
    }
  } catch {
    // Meta unavailable
  }

  try {
    const ytRes = await fetch(`${SITE_URL}/api/admin/social/youtube`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(15000),
    });
    if (ytRes.ok) {
      const yt = await ytRes.json();
      if (yt.connected) {
        data.ytSubscribers = yt.statistics?.subscriberCount;
        data.ytViews = yt.statistics?.viewCount;
      }
    }
  } catch {
    // YT unavailable
  }

  // GSC Keywords
  try {
    const gscRes = await fetch(`${SITE_URL}/api/admin/gsc?type=keywords`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(15000),
    });
    if (gscRes.ok) {
      const gsc = await gscRes.json();
      if (gsc.connected) {
        data.keywords = gsc.keywords;
      }
    }
  } catch {
    // GSC unavailable
  }

  // GSC Search Analytics totals
  try {
    const gscRes = await fetch(`${SITE_URL}/api/admin/gsc?type=searchAnalytics`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(15000),
    });
    if (gscRes.ok) {
      const gsc = await gscRes.json();
      if (gsc.connected) {
        data.gscClicks = gsc.totals?.clicks;
        data.gscImpressions = gsc.totals?.impressions;
        data.gscAvgPosition = gsc.totals?.avgPosition;
      }
    }
  } catch {
    // GSC unavailable
  }

  // Lead count
  try {
    const leadsRes = await fetch(`${SITE_URL}/api/admin/leads`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(10000),
    });
    if (leadsRes.ok) {
      const leads = await leadsRes.json();
      data.leadCount = leads.count;
      // Get most recent lead date
      if (leads.leads?.length > 0) {
        data.lastLeadDate = leads.leads[0].submittedAt;
      }
    }
  } catch {
    // Leads unavailable
  }

  return data;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get('refresh') === 'true';

  const todayStr = new Date().toISOString().split('T')[0];

  // Check for existing recent insight (unless refresh requested)
  if (!refresh) {
    const existing = await queryItems<InsightRecord>('INSIGHTS#weekly');
    if (existing.length > 0) {
      // Sort by sk (date) descending
      existing.sort((a, b) => b.sk.localeCompare(a.sk));
      const latest = existing[0];

      // If generated today or within the last 7 days, return it
      const generatedDate = new Date(latest.generatedAt);
      const daysSince = Math.floor(
        (Date.now() - generatedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince < 7) {
        return NextResponse.json({
          recommendations: latest.recommendations,
          dataSnapshot: latest.dataSnapshot,
          generatedAt: latest.generatedAt,
          cached: true,
        });
      }
    }
  }

  // Gather fresh data
  const cookieHeader = request.headers.get('cookie') || '';
  const performanceData = await gatherPerformanceData(cookieHeader);

  // Call Claude API
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const systemPrompt = `You are the SEO and marketing performance analyst for JHR Photography, a premium Nashville B2B corporate event photography company. Review the week's performance data and deliver 3-5 specific, prioritized actions the owner should take this week. Be direct, specific, and tactical. Reference actual numbers.`;

  const userPrompt = `Here is the current performance data for JHR Photography:

${JSON.stringify(performanceData, null, 2)}

Based on this data, provide 3-5 specific, prioritized recommendations for this week. Format each as a numbered item with a clear action title and 1-2 sentences of detail.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const recommendations =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Store in DynamoDB
    const insightRecord: InsightRecord = {
      pk: 'INSIGHTS#weekly',
      sk: todayStr,
      recommendations,
      dataSnapshot: performanceData,
      generatedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-6',
    };

    await putItem(insightRecord);

    return NextResponse.json({
      recommendations,
      dataSnapshot: performanceData,
      generatedAt: insightRecord.generatedAt,
      cached: false,
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
