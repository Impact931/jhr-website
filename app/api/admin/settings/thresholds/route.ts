import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItem, putItem } from '@/lib/dynamodb';

const PK = 'SETTINGS#config';
const SK = 'thresholds';

export interface AlertThresholds {
  psiDesktopMin: number;
  psiMobileMin: number;
  keywordDropPositions: number;
  noLeadsDays: number;
  igReachDropPercent: number;
  geoScoreDropPoints: number;
}

interface ThresholdsRecord extends AlertThresholds {
  pk: string;
  sk: string;
  updatedAt: string;
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  psiDesktopMin: 85,
  psiMobileMin: 70,
  keywordDropPositions: 5,
  noLeadsDays: 5,
  igReachDropPercent: 30,
  geoScoreDropPoints: 10,
};

/**
 * GET /api/admin/settings/thresholds
 * Returns alert threshold configuration.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const record = await getItem<ThresholdsRecord>(PK, SK);
    if (!record) {
      return NextResponse.json({ thresholds: DEFAULT_THRESHOLDS });
    }

    const { pk: _pk, sk: _sk, updatedAt, ...thresholds } = record;
    return NextResponse.json({ thresholds, updatedAt });
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thresholds' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings/thresholds
 * Update alert threshold configuration.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { thresholds } = body;

    if (!thresholds || typeof thresholds !== 'object') {
      return NextResponse.json({ error: 'thresholds object is required' }, { status: 400 });
    }

    const merged: AlertThresholds = {
      ...DEFAULT_THRESHOLDS,
      ...thresholds,
    };

    const record: ThresholdsRecord = {
      pk: PK,
      sk: SK,
      ...merged,
      updatedAt: new Date().toISOString(),
    };

    await putItem(record);
    return NextResponse.json({ thresholds: merged, updatedAt: record.updatedAt });
  } catch (error) {
    console.error('Error saving thresholds:', error);
    return NextResponse.json(
      { error: 'Failed to save thresholds' },
      { status: 500 }
    );
  }
}
