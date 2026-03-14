import { Client } from '@notionhq/client';

interface LeadData {
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

function getNotionClient(): Client | null {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
}

function getLeadDbId(): string | null {
  return process.env.NOTION_LEAD_DB_ID || null;
}

export async function syncLeadToNotion(lead: LeadData): Promise<boolean> {
  const notion = getNotionClient();
  const dbId = getLeadDbId();
  if (!notion || !dbId) return false;

  try {
    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: {
          title: [{ text: { content: `${lead.firstName} ${lead.lastName}` } }],
        },
        Email: { email: lead.email },
        ...(lead.phone ? { Phone: { phone_number: lead.phone } } : {}),
        ...(lead.company
          ? { Company: { rich_text: [{ text: { content: lead.company } }] } }
          : {}),
        ...(lead.eventType
          ? { 'Event Type': { select: { name: lead.eventType } } }
          : {}),
        ...(lead.venue
          ? { Venue: { rich_text: [{ text: { content: lead.venue } }] } }
          : {}),
        ...(lead.eventDate
          ? { 'Event Date': { date: { start: lead.eventDate } } }
          : {}),
        Message: {
          rich_text: [{ text: { content: lead.message.slice(0, 2000) } }],
        },
        Status: { select: { name: lead.status === 'new' ? 'New' : lead.status } },
        Source: { select: { name: lead.source || 'contact-form' } },
        'Submitted At': { date: { start: lead.submittedAt } },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to sync lead to Notion:', error);
    return false;
  }
}

export interface NotionLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  eventType?: string;
  venue?: string;
  eventDate?: string;
  message?: string;
  status?: string;
  source?: string;
  submittedAt?: string;
}

export function extractPlainText(
  prop: { type: string; rich_text?: Array<{ plain_text: string }> } | undefined
): string {
  if (!prop || prop.type !== 'rich_text' || !prop.rich_text) return '';
  return prop.rich_text.map((t) => t.plain_text).join('');
}

export function extractTitle(
  prop: { type: string; title?: Array<{ plain_text: string }> } | undefined
): string {
  if (!prop || prop.type !== 'title' || !prop.title) return '';
  return prop.title.map((t) => t.plain_text).join('');
}

export function extractSelect(
  prop: { type: string; select?: { name: string } | null } | undefined
): string {
  if (!prop || prop.type !== 'select' || !prop.select) return '';
  return prop.select.name;
}

export function extractEmail(
  prop: { type: string; email?: string | null } | undefined
): string {
  if (!prop || prop.type !== 'email') return '';
  return prop.email || '';
}

export function extractPhone(
  prop: { type: string; phone_number?: string | null } | undefined
): string {
  if (!prop || prop.type !== 'phone_number') return '';
  return prop.phone_number || '';
}

export function extractDate(
  prop: { type: string; date?: { start?: string } | null } | undefined
): string {
  if (!prop || prop.type !== 'date' || !prop.date) return '';
  return prop.date.start || '';
}

export async function fetchNotionLeads(): Promise<NotionLead[]> {
  const notion = getNotionClient();
  const dbId = getLeadDbId();
  if (!notion || !dbId) return [];

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: 'Submitted At', direction: 'descending' }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: extractTitle(props.Name),
        email: extractEmail(props.Email),
        phone: extractPhone(props.Phone) || undefined,
        company: extractPlainText(props.Company) || undefined,
        eventType: extractSelect(props['Event Type']) || undefined,
        venue: extractPlainText(props.Venue) || undefined,
        eventDate: extractDate(props['Event Date']) || undefined,
        message: extractPlainText(props.Message) || undefined,
        status: extractSelect(props.Status)?.toLowerCase() || undefined,
        source: extractSelect(props.Source) || undefined,
        submittedAt: extractDate(props['Submitted At']) || undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Notion leads:', error);
    return [];
  }
}

export async function bulkSyncLeadsToNotion(
  leads: LeadData[]
): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  for (const lead of leads) {
    const success = await syncLeadToNotion(lead);
    if (success) synced++;
    else failed++;
  }

  return { synced, failed };
}

// --- Assignment-related Notion helpers ---

/**
 * Extract related page IDs from a Notion relation property.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractRelation(prop: any): string[] {
  if (!prop || prop.type !== 'relation' || !Array.isArray(prop.relation)) return [];
  return prop.relation.map((r: { id: string }) => r.id);
}

/**
 * Retrieve a Notion page by ID.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getNotionPage(pageId: string): Promise<any | null> {
  const notion = getNotionClient();
  if (!notion) return null;
  try {
    return await notion.pages.retrieve({ page_id: pageId });
  } catch (error) {
    console.error(`Failed to retrieve Notion page ${pageId}:`, error);
    return null;
  }
}

/**
 * Update properties on a Notion page.
 */
export async function updateNotionPage(
  pageId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>
): Promise<boolean> {
  const notion = getNotionClient();
  if (!notion) return false;
  try {
    await notion.pages.update({ page_id: pageId, properties });
    return true;
  } catch (error) {
    console.error(`Failed to update Notion page ${pageId}:`, error);
    return false;
  }
}

/**
 * Extract a URL property from a Notion page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractUrl(prop: any): string {
  if (!prop || prop.type !== 'url') return '';
  return prop.url || '';
}

/**
 * Extract a number property from a Notion page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractNumber(prop: any): number | null {
  if (!prop || prop.type !== 'number') return null;
  return prop.number;
}

/**
 * Extract a checkbox property from a Notion page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractCheckbox(prop: any): boolean {
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox || false;
}

/**
 * Extract a status property from a Notion page (different from select).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractStatus(prop: any): string {
  if (!prop || prop.type !== 'status' || !prop.status) return '';
  return prop.status.name || '';
}

/**
 * Extract a formula property (string result) from a Notion page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractFormula(prop: any): string {
  if (!prop || prop.type !== 'formula') return '';
  const f = prop.formula;
  if (f.type === 'string') return f.string || '';
  if (f.type === 'number') return f.number != null ? String(f.number) : '';
  if (f.type === 'boolean') return String(f.boolean);
  if (f.type === 'date') return f.date?.start || '';
  return '';
}

/**
 * Extract the first value from a rollup property.
 * Rollups return an array; this unwraps the first element using the inner type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractRollup(prop: any): string {
  if (!prop || prop.type !== 'rollup' || !prop.rollup) return '';
  const arr = prop.rollup.array;
  if (!Array.isArray(arr) || arr.length === 0) return '';

  const first = arr[0];
  if (!first) return '';

  switch (first.type) {
    case 'title':
      return first.title?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
    case 'rich_text':
      return first.rich_text?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
    case 'number':
      return first.number != null ? String(first.number) : '';
    case 'email':
      return first.email || '';
    case 'phone_number':
      return (first.phone_number || '').trim();
    case 'url':
      return first.url || '';
    case 'date':
      return first.date?.start || '';
    case 'select':
      return first.select?.name || '';
    case 'multi_select':
      return first.multi_select?.map((s: { name: string }) => s.name).join(', ') || '';
    case 'formula':
      if (first.formula?.type === 'string') return first.formula.string || '';
      if (first.formula?.type === 'number') return first.formula.number != null ? String(first.formula.number) : '';
      return first.formula?.date?.start || '';
    case 'checkbox':
      return String(first.checkbox);
    default:
      return '';
  }
}
