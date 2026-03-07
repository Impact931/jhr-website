import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { putItem, queryItems } from '@/lib/dynamodb';

interface PSISnapshot {
  pk: string;
  sk: string;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  lcp: number;
  fcp: number;
  tbt: number;
  cls: number;
  speedIndex: number;
  tti: number;
  url: string;
  createdAt: string;
}

/**
 * GET /api/admin/psi/history?strategy=desktop
 * Returns last 30 PSI snapshots for trend charts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const strategy = searchParams.get('strategy') || 'desktop';

    const pk = `PSI#${strategy}`;
    const items = await queryItems<PSISnapshot>(pk);

    // Sort by sk (date) descending, take last 30
    const sorted = items
      .sort((a, b) => b.sk.localeCompare(a.sk))
      .slice(0, 30)
      .reverse(); // Return chronological order for charts

    return NextResponse.json({ snapshots: sorted });
  } catch (error) {
    console.error('PSI history GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch PSI history' }, { status: 500 });
  }
}

/**
 * POST /api/admin/psi/history
 * Save a PSI snapshot to DynamoDB
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      strategy,
      performanceScore,
      accessibilityScore,
      seoScore,
      bestPracticesScore,
      lcp,
      fcp,
      tbt,
      cls,
      speedIndex,
      tti,
      url,
    } = body;

    if (!strategy || performanceScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const snapshot: PSISnapshot = {
      pk: `PSI#${strategy}`,
      sk: now,
      performanceScore,
      accessibilityScore,
      seoScore,
      bestPracticesScore,
      lcp: lcp?.value ?? lcp ?? 0,
      fcp: fcp?.value ?? fcp ?? 0,
      tbt: tbt?.value ?? tbt ?? 0,
      cls: cls?.value ?? cls ?? 0,
      speedIndex: speedIndex?.value ?? speedIndex ?? 0,
      tti: tti?.value ?? tti ?? 0,
      url: url || '',
      createdAt: now,
    };

    await putItem(snapshot);

    return NextResponse.json({ snapshot });
  } catch (error) {
    console.error('PSI history POST error:', error);
    return NextResponse.json({ error: 'Failed to save PSI snapshot' }, { status: 500 });
  }
}
