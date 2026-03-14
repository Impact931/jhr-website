import { NextRequest, NextResponse } from 'next/server';
import { getAssignment, updateAssignmentStatus } from '@/lib/assignments-db';
import { updateNotionPage } from '@/lib/notion';
import { sendEmail } from '@/lib/ses';
import { sendSlackNotification } from '@/lib/slack';
import { assignmentConfirmationEmail } from '@/lib/email-templates/assignment-confirmation';
import { opsManagerAlertEmail } from '@/lib/email-templates/ops-manager-alert';

// Supports comma or semicolon separated list
const OPS_MANAGER_EMAILS = (process.env.OPS_MANAGER_EMAIL || '')
  .split(/[;,]/)
  .map((e) => e.trim())
  .filter(Boolean);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, declineReason } = body;

    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Fetch assignment
    const assignment = await getAssignment(id);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (assignment.status !== 'pending') {
      return NextResponse.json(
        { error: 'Assignment already responded to', status: assignment.status },
        { status: 409 }
      );
    }

    // Update DynamoDB (conditional on status = pending)
    const now = new Date().toISOString();
    const status = action === 'accept' ? 'accepted' as const : 'declined' as const;
    const updated = await updateAssignmentStatus(id, status, {
      respondedAt: now,
      declineReason: action === 'decline' ? declineReason : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Assignment already responded to (race condition)' },
        { status: 409 }
      );
    }

    // Update the assignment object for email templates
    assignment.status = status;
    assignment.respondedAt = now;
    if (declineReason) assignment.declineReason = declineReason;

    // Update Notion assignment record (non-blocking)
    try {
      const notionProps: Record<string, unknown> = {};
      if (action === 'accept') {
        notionProps['Accepted'] = { checkbox: true };
        notionProps['Status'] = { status: { name: 'Operator Confirmed' } };
      } else {
        notionProps['Declined'] = { checkbox: true };
        notionProps['Status'] = { status: { name: 'Operator Declined' } };
      }
      await updateNotionPage(assignment.notionPageId, notionProps);
    } catch (error) {
      console.error('Failed to update Notion on response:', error);
    }

    // Send emails and Slack notifications (non-blocking)
    const emailPromises: Promise<unknown>[] = [];

    if (action === 'accept') {
      // Confirmation email to operator
      const confirmEmail = assignmentConfirmationEmail(assignment);
      emailPromises.push(
        sendEmail({ to: assignment.operatorEmail, ...confirmEmail }).catch((e) =>
          console.error('Failed to send confirmation email:', e)
        )
      );
    }

    // Ops manager alert for both accept and decline
    for (const opsEmail of OPS_MANAGER_EMAILS) {
      const alertEmail = opsManagerAlertEmail(assignment, action);
      emailPromises.push(
        sendEmail({ to: opsEmail, ...alertEmail }).catch((e) =>
          console.error(`Failed to send ops manager alert to ${opsEmail}:`, e)
        )
      );
    }

    // Slack notification
    const slackEmoji = action === 'accept' ? ':white_check_mark:' : ':x:';
    const slackText = `${slackEmoji} *${assignment.operatorName}* ${action === 'accept' ? 'accepted' : 'declined'} assignment: *${assignment.dealName}* (${assignment.venue})${declineReason ? `\nReason: ${declineReason}` : ''}`;
    emailPromises.push(
      sendSlackNotification({ text: slackText }).catch((e) =>
        console.error('Failed to send Slack notification:', e)
      )
    );

    await Promise.allSettled(emailPromises);

    const redirect = action === 'accept' ? '/assignments/accepted' : '/assignments/declined';
    return NextResponse.json({ success: true, redirect });
  } catch (error) {
    console.error('Assignment response error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
