import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { putItem, queryItems } from '@/lib/dynamodb';

interface Citation {
  pk: string;
  sk: string;
  date: string;
  aiEngine: string;
  query: string;
  citationType: string;
  responseUrl: string;
  createdAt: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const citations = await queryItems<Citation>('GEO#citations');
    // Sort by date descending
    citations.sort((a, b) => (b.sk > a.sk ? 1 : -1));
    return NextResponse.json({ citations });
  } catch (error) {
    console.error('Error fetching citations:', error);
    return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, aiEngine, query, citationType, responseUrl } = body;

    if (!date || !aiEngine || !query || !citationType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const citation: Citation = {
      pk: 'GEO#citations',
      sk: timestamp,
      date,
      aiEngine,
      query,
      citationType,
      responseUrl: responseUrl || '',
      createdAt: timestamp,
    };

    await putItem(citation);
    return NextResponse.json({ citation }, { status: 201 });
  } catch (error) {
    console.error('Error creating citation:', error);
    return NextResponse.json({ error: 'Failed to create citation' }, { status: 500 });
  }
}
