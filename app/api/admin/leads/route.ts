import { NextRequest, NextResponse } from 'next/server';
import { scanItemsByPkPrefix } from '@/lib/dynamodb';
import { fetchNotionLeads, bulkSyncLeadsToNotion } from '@/lib/notion';

interface LeadRecord {
  pk: string;
  sk: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  eventType?: string;
  venue?: string;
  eventDate?: string;
  message: string;
  status: string;
  submittedAt: string;
  source: string;
}

export async function GET(request: NextRequest) {
  try {
    const source = request.nextUrl.searchParams.get('source');

    if (source === 'notion') {
      const notionLeads = await fetchNotionLeads();
      return NextResponse.json({ leads: notionLeads, count: notionLeads.length, source: 'notion' });
    }

    // Default: DynamoDB
    const leads = await scanItemsByPkPrefix<LeadRecord>('LEAD#');
    leads.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ leads, count: leads.length, source: 'dynamodb' });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'sync-to-notion') {
      const leads = await scanItemsByPkPrefix<LeadRecord>('LEAD#');
      const result = await bulkSyncLeadsToNotion(leads);
      return NextResponse.json({
        success: true,
        synced: result.synced,
        failed: result.failed,
        total: leads.length,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing leads action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
