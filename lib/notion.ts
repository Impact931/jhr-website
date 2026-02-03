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

function extractPlainText(
  prop: { type: string; rich_text?: Array<{ plain_text: string }> } | undefined
): string {
  if (!prop || prop.type !== 'rich_text' || !prop.rich_text) return '';
  return prop.rich_text.map((t) => t.plain_text).join('');
}

function extractTitle(
  prop: { type: string; title?: Array<{ plain_text: string }> } | undefined
): string {
  if (!prop || prop.type !== 'title' || !prop.title) return '';
  return prop.title.map((t) => t.plain_text).join('');
}

function extractSelect(
  prop: { type: string; select?: { name: string } | null } | undefined
): string {
  if (!prop || prop.type !== 'select' || !prop.select) return '';
  return prop.select.name;
}

function extractEmail(
  prop: { type: string; email?: string | null } | undefined
): string {
  if (!prop || prop.type !== 'email') return '';
  return prop.email || '';
}

function extractPhone(
  prop: { type: string; phone_number?: string | null } | undefined
): string {
  if (!prop || prop.type !== 'phone_number') return '';
  return prop.phone_number || '';
}

function extractDate(
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
