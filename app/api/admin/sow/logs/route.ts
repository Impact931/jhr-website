import { NextRequest, NextResponse } from 'next/server';
import { getSOWLogs } from '@/lib/sow/log';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-jhr-secret') || request.nextUrl.searchParams.get('secret');
  const WEBHOOK_SECRET = process.env.ASSIGNMENTS_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);
  const logs = await getSOWLogs(limit);

  return NextResponse.json({ count: logs.length, logs });
}
