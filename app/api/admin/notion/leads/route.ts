import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NotionLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  source: string;
  status: string;
  estimatedValue: number;
  inquiryDate: string;
  eventDate: string;
  notionUrl: string;
}

interface LeadSummary {
  total: number;
  new7d: number;
  new30d: number;
  bySource: Record<string, number>;
  byService: Record<string, number>;
  byStatus: Record<string, number>;
  pipelineValue: number;
}

// ---------------------------------------------------------------------------
// Configurable property name mapping
// Adjust these if your Notion database uses different property names.
// ---------------------------------------------------------------------------

const PROP_MAP = {
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  service: 'Event Type',
  source: 'Source',
  status: 'Status',
  estimatedValue: 'Estimated Value',
  inquiryDate: 'Submitted At',
  eventDate: 'Event Date',
};

// ---------------------------------------------------------------------------
// In-memory cache (module-level, 15-min TTL)
// ---------------------------------------------------------------------------

let cachedResult: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// Notion property extraction helpers
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractTitle(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'title' || !p.title) return '';
  return p.title.map((t: any) => t.plain_text).join('');
}

function extractRichText(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'rich_text' || !p.rich_text) return '';
  return p.rich_text.map((t: any) => t.plain_text).join('');
}

function extractSelect(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'select' || !p.select) return '';
  return p.select.name;
}

function extractEmail(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'email') return '';
  return p.email || '';
}

function extractPhone(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'phone_number') return '';
  return p.phone_number || '';
}

function extractDate(props: any, key: string): string {
  const p = props[key];
  if (!p || p.type !== 'date' || !p.date) return '';
  return p.date.start || '';
}

function extractNumber(props: any, key: string): number {
  const p = props[key];
  if (!p || p.type !== 'number') return 0;
  return p.number ?? 0;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Core mapper: Notion page -> clean lead object
// ---------------------------------------------------------------------------

function mapPageToLead(page: any): NotionLead { // eslint-disable-line @typescript-eslint/no-explicit-any
  const props = page.properties;
  return {
    id: page.id,
    name: extractTitle(props, PROP_MAP.name) || extractRichText(props, PROP_MAP.name),
    company: extractRichText(props, PROP_MAP.company),
    email: extractEmail(props, PROP_MAP.email),
    phone: extractPhone(props, PROP_MAP.phone),
    service: extractSelect(props, PROP_MAP.service),
    source: extractSelect(props, PROP_MAP.source),
    status: extractSelect(props, PROP_MAP.status),
    estimatedValue: extractNumber(props, PROP_MAP.estimatedValue),
    inquiryDate: extractDate(props, PROP_MAP.inquiryDate),
    eventDate: extractDate(props, PROP_MAP.eventDate),
    notionUrl: page.url ?? '',
  };
}

// ---------------------------------------------------------------------------
// Build summary
// ---------------------------------------------------------------------------

function buildSummary(leads: NotionLead[]): LeadSummary {
  const now = Date.now();
  const d7 = 7 * 24 * 60 * 60 * 1000;
  const d30 = 30 * 24 * 60 * 60 * 1000;

  const bySource: Record<string, number> = {};
  const byService: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let pipelineValue = 0;
  let new7d = 0;
  let new30d = 0;

  const openStatuses = new Set(['new', 'contacted', 'proposal sent', 'proposal']);

  for (const lead of leads) {
    // Counts by time
    if (lead.inquiryDate) {
      const age = now - new Date(lead.inquiryDate).getTime();
      if (age <= d7) new7d++;
      if (age <= d30) new30d++;
    }

    // Aggregations
    const source = lead.source || 'Unknown';
    bySource[source] = (bySource[source] || 0) + 1;

    const service = lead.service || 'Other';
    byService[service] = (byService[service] || 0) + 1;

    const status = lead.status || 'New';
    byStatus[status] = (byStatus[status] || 0) + 1;

    // Pipeline value (open statuses only)
    if (openStatuses.has(status.toLowerCase())) {
      pipelineValue += lead.estimatedValue;
    }
  }

  return {
    total: leads.length,
    new7d,
    new30d,
    bySource,
    byService,
    byStatus,
    pipelineValue,
  };
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET() {
  // Support both env var names for compatibility
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_LEADS_DB_ID || process.env.NOTION_LEAD_DB_ID;

  if (!token || !dbId) {
    return NextResponse.json({ connected: false });
  }

  // Check cache
  if (cachedResult && Date.now() - cachedResult.ts < CACHE_TTL) {
    return NextResponse.json(cachedResult.data);
  }

  try {
    const notion = new Client({ auth: token });

    // Filter: last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    let allResults: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
    let hasMore = true;
    let nextCursor: string | undefined;

    while (hasMore) {
      const response: any = await notion.databases.query({ // eslint-disable-line @typescript-eslint/no-explicit-any
        database_id: dbId,
        filter: {
          property: PROP_MAP.inquiryDate,
          date: { on_or_after: thirtyDaysAgo },
        },
        sorts: [{ property: PROP_MAP.inquiryDate, direction: 'descending' }],
        start_cursor: nextCursor,
        page_size: 100,
      });

      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      nextCursor = response.next_cursor ?? undefined;
    }

    const leads = allResults.map(mapPageToLead);
    const summary = buildSummary(leads);

    const payload = { connected: true, leads, summary };

    // Store in cache
    cachedResult = { data: payload, ts: Date.now() };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error fetching Notion leads:', error);
    return NextResponse.json(
      { connected: true, error: 'Failed to query Notion database', leads: [], summary: null },
      { status: 500 }
    );
  }
}
