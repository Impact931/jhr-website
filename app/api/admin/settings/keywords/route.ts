import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItem, putItem } from '@/lib/dynamodb';

const PK = 'SETTINGS#config';
const SK = 'keywords';

interface KeywordsRecord {
  pk: string;
  sk: string;
  keywords: string[];
  updatedAt: string;
}

const DEFAULT_KEYWORDS = [
  'Nashville corporate event photographer',
  'Nashville conference photographer',
  'Gaylord Opryland event photographer',
  'Music City Center photographer',
  'Nashville headshot activation',
  'Conference headshot lounge Nashville',
  'Nashville trade show photographer',
  'Executive headshots Nashville',
  'Nashville convention photographer',
  'corporate event photography Nashville',
];

/**
 * GET /api/admin/settings/keywords
 * Returns the list of tracked keywords.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const record = await getItem<KeywordsRecord>(PK, SK);
    return NextResponse.json({
      keywords: record?.keywords ?? DEFAULT_KEYWORDS,
      updatedAt: record?.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings/keywords
 * Replace the tracked keywords list.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { keywords } = body;

    if (!Array.isArray(keywords)) {
      return NextResponse.json({ error: 'keywords must be an array' }, { status: 400 });
    }

    const record: KeywordsRecord = {
      pk: PK,
      sk: SK,
      keywords: keywords.filter((k: string) => typeof k === 'string' && k.trim()),
      updatedAt: new Date().toISOString(),
    };

    await putItem(record);
    return NextResponse.json({ keywords: record.keywords, updatedAt: record.updatedAt });
  } catch (error) {
    console.error('Error saving keywords:', error);
    return NextResponse.json(
      { error: 'Failed to save keywords' },
      { status: 500 }
    );
  }
}
