import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// ---------------------------------------------------------------------------
// GET /api/admin/notion/discover
//
// Two modes:
//   1. No ?database_id — lists all databases the integration can access
//   2. With ?database_id=<id> — returns the property schema for that database
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const token = process.env.NOTION_TOKEN;

  if (!token) {
    return NextResponse.json({
      connected: false,
      message: 'NOTION_TOKEN env var is not set.',
    });
  }

  const notion = new Client({ auth: token });
  const databaseId = request.nextUrl.searchParams.get('database_id');

  // ---- Mode 2: Inspect a specific database ----
  if (databaseId) {
    try {
      const db = await notion.databases.retrieve({ database_id: databaseId }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      const properties: Record<string, { type: string; options?: string[] }> = {};

      for (const [name, prop] of Object.entries(db.properties as Record<string, any>)) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const entry: { type: string; options?: string[] } = { type: prop.type };

        // Include select/multi-select options for convenience
        if (prop.type === 'select' && prop.select?.options) {
          entry.options = prop.select.options.map((o: any) => o.name); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        if (prop.type === 'multi_select' && prop.multi_select?.options) {
          entry.options = prop.multi_select.options.map((o: any) => o.name); // eslint-disable-line @typescript-eslint/no-explicit-any
        }

        properties[name] = entry;
      }

      // Extract title from database
      const titleParts = (db.title as any[]) || []; // eslint-disable-line @typescript-eslint/no-explicit-any
      const title = titleParts.map((t: any) => t.plain_text).join(''); // eslint-disable-line @typescript-eslint/no-explicit-any

      return NextResponse.json({
        connected: true,
        database: {
          id: databaseId,
          title,
          properties,
        },
      });
    } catch (error) {
      console.error('Failed to retrieve Notion database:', error);
      return NextResponse.json(
        { connected: true, error: 'Failed to retrieve database. Check the ID and integration sharing.' },
        { status: 400 }
      );
    }
  }

  // ---- Mode 1: List all accessible databases ----
  try {
    const response = await notion.search({
      filter: { value: 'database', property: 'object' },
      page_size: 50,
    });

    const databases = response.results.map((db: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const titleParts = db.title || [];
      const title = titleParts.map((t: any) => t.plain_text).join(''); // eslint-disable-line @typescript-eslint/no-explicit-any
      return {
        id: db.id,
        title: title || '(Untitled)',
        url: db.url,
      };
    });

    const leadsDbId = process.env.NOTION_LEADS_DB_ID || process.env.NOTION_LEAD_DB_ID;

    return NextResponse.json({
      connected: true,
      leadsDbConfigured: !!leadsDbId,
      configuredDbId: leadsDbId || null,
      databases,
    });
  } catch (error) {
    console.error('Failed to search Notion databases:', error);
    return NextResponse.json(
      { connected: true, error: 'Failed to list databases. Check NOTION_TOKEN.' },
      { status: 500 }
    );
  }
}
