import { NextRequest, NextResponse } from 'next/server';
import { putAssignment, getAssignmentByNotionPageId } from '@/lib/assignments-db';
import {
  getNotionPage,
  updateNotionPage,
  extractRelation,
  extractTitle,
  extractPlainText,
  extractEmail,
  extractPhone,
  extractSelect,
  extractRollup,
  extractFormula,
} from '@/lib/notion';
import { validateAssignmentData } from '@/lib/assignments-quality';
import { sendEmail } from '@/lib/ses';
import { assignmentNotificationEmail } from '@/lib/email-templates/assignment-notification';
import type { Assignment } from '@/lib/assignments-types';

const WEBHOOK_SECRET = process.env.ASSIGNMENTS_WEBHOOK_SECRET;
const BASE_URL = process.env.ASSIGNMENTS_BASE_URL || 'https://main.danki5kmggsn7.amplifyapp.com/assignments';
const TTL_DAYS = 7;

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const secret = request.headers.get('x-jhr-secret');
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Notion webhook "Send webhook" action includes page data in body.data
    // Support both { notionPageId } (manual) and Notion webhook format
    const notionPageId = body.notionPageId || body.page_id || body.data?.id;

    if (!notionPageId) {
      return NextResponse.json({ error: 'Missing notionPageId' }, { status: 400 });
    }

    // Idempotency check
    const existing = await getAssignmentByNotionPageId(notionPageId);
    if (existing && (existing.status === 'pending' || existing.status === 'accepted')) {
      return NextResponse.json({
        assignmentId: existing.id,
        url: existing.assignmentUrl,
        message: 'Assignment already exists',
      });
    }

    // Fetch assignment page from Notion (JHR Assignments [DB])
    const assignmentPage = await getNotionPage(notionPageId);
    if (!assignmentPage) {
      return NextResponse.json({ error: 'Failed to fetch Notion assignment page' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: Record<string, any> = assignmentPage.properties || {};

    // --- Extract fields from JHR Assignments [DB] ---
    // Title field = "Assignment"
    const dealName = extractTitle(props['Assignment']) || 'Untitled Assignment';

    // Rollup fields (pulled from related Deal/Venue records)
    const showTime = extractRollup(props['Show Time']);
    const startTime = extractRollup(props['Start Time']);
    const endTime = extractRollup(props['End Time']);
    const venueAddress = extractRollup(props['Venue Address']);
    const venuePocPhone = extractRollup(props['Venue POC']);
    const eventDescription = extractRollup(props['Event Description']);
    const locationNotes = extractRollup(props['Location Notes']);
    const gearRollup = extractRollup(props['Gear']);

    // Formula field
    const totalPay = extractFormula(props['Total Pay']);

    // Select field
    const attire = extractSelect(props['Attire']);

    // --- Resolve relation fields ---
    let operatorName = '';
    let operatorEmail = '';
    let operatorPhone = '';
    let clientName = '';
    let pocName = '';
    let pocPhone = '';
    let pocEmail = '';
    let venue = '';

    // Operator relation → Team Member DB
    const operatorIds = extractRelation(props['Operator']);
    if (operatorIds.length > 0) {
      const operatorPage = await getNotionPage(operatorIds[0]);
      if (operatorPage) {
        const op = operatorPage.properties || {};
        operatorName = extractTitle(op['Team Member']);
        operatorEmail = extractEmail(op['Email']);
        operatorPhone = extractPhone(op['Phone']);
      }
    }

    // Account relation → Accounts DB (client)
    const accountIds = extractRelation(props['Account']);
    if (accountIds.length > 0) {
      const accountPage = await getNotionPage(accountIds[0]);
      if (accountPage) {
        const acc = accountPage.properties || {};
        clientName = extractTitle(acc['Name']) || extractTitle(acc['Account Name']) || extractPlainText(acc['Name']);
      }
    }

    // POC relation → Contacts DB
    const pocIds = extractRelation(props['POC']);
    if (pocIds.length > 0) {
      const pocPage = await getNotionPage(pocIds[0]);
      if (pocPage) {
        const pc = pocPage.properties || {};
        pocName = extractTitle(pc['Contact Name']);
        pocPhone = extractPhone(pc['Phone (Cell)']) || extractPhone(pc['Phone (Office)']);
        pocEmail = extractEmail(pc['Email']);
      }
    }

    // Venue relation → Venues DB
    const venueIds = extractRelation(props['Venue']);
    if (venueIds.length > 0) {
      const venuePage = await getNotionPage(venueIds[0]);
      if (venuePage) {
        const vn = venuePage.properties || {};
        venue = extractTitle(vn['Name']) || extractTitle(vn['Venue Name']);
      }
    }

    // Build briefing from event description if available
    const assignmentBriefing = eventDescription || '';

    // Quality check (AI validation + briefing generation)
    const qualityResult = await validateAssignmentData({
      dealName,
      operatorName,
      operatorEmail,
      clientName,
      pocName,
      pocPhone: pocPhone || venuePocPhone,
      venue,
      venueAddress,
      showTime,
      startTime,
      endTime,
      totalPay,
      attire,
      gear: gearRollup,
      assignmentBriefing,
      locationNotes,
    });

    // Build assignment record
    const id = crypto.randomUUID();
    const assignmentUrl = `${BASE_URL}/${id}`;
    const now = new Date();

    const assignment: Assignment = {
      pk: `ASSIGNMENT#${id}`,
      sk: 'meta',
      id,
      notionPageId,
      status: 'pending',
      dealName,
      operatorName,
      operatorEmail,
      clientName,
      pocName: pocName || undefined,
      pocPhone: pocPhone || venuePocPhone || undefined,
      venue,
      venueAddress: venueAddress || undefined,
      googleMapsUrl: venueAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`
        : undefined,
      showTime: showTime || now.toISOString(),
      startTime: startTime || now.toISOString(),
      endTime: endTime || now.toISOString(),
      totalPay,
      attire: attire || undefined,
      gear: gearRollup || undefined,
      assignmentBriefing: qualityResult.cleaned.assignmentBriefing || assignmentBriefing || undefined,
      locationNotes: locationNotes || undefined,
      assignmentUrl,
      qualityWarnings: qualityResult.warnings.length > 0 ? qualityResult.warnings : undefined,
      createdAt: now.toISOString(),
      ttl: Math.floor(now.getTime() / 1000) + TTL_DAYS * 24 * 60 * 60,
    };

    // Save to DynamoDB
    await putAssignment(assignment);

    // Write assignment URL back to Notion (non-blocking)
    try {
      await updateNotionPage(notionPageId, {
        'Gig Sheet Sent': { checkbox: true },
        'Assignment Sheet Link': { url: assignmentUrl },
      });
    } catch (error) {
      console.error('Failed to update Notion assignment with Gig Sheet Sent:', error);
    }

    // Send notification emails (operator + ops managers)
    const emailPromises: Promise<unknown>[] = [];
    const emailData = assignmentNotificationEmail(assignment);

    if (operatorEmail) {
      emailPromises.push(
        sendEmail({ to: operatorEmail, ...emailData }).catch((e) =>
          console.error('Failed to send operator notification email:', e)
        )
      );
    }

    // Also notify ops managers
    const opsEmails = (process.env.OPS_MANAGER_EMAIL || '')
      .split(/[;,]/)
      .map((e) => e.trim())
      .filter(Boolean);
    for (const opsEmail of opsEmails) {
      emailPromises.push(
        sendEmail({ to: opsEmail, ...emailData }).catch((e) =>
          console.error(`Failed to send ops manager notification to ${opsEmail}:`, e)
        )
      );
    }

    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      assignmentId: id,
      url: assignmentUrl,
      warnings: qualityResult.warnings,
    });
  } catch (error) {
    console.error('Assignment ingest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
