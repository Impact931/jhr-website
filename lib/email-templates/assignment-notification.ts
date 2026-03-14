import type { Assignment } from '../assignments-types';

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  } catch {
    return iso;
  }
}

export function assignmentNotificationEmail(assignment: Assignment): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const subject = `New Assignment: ${assignment.dealName} — ${assignment.venue}`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:1px solid #333;">
  <div style="padding:24px;text-align:center;border-bottom:2px solid #c8a45e;">
    <h1 style="color:#c8a45e;margin:0;font-size:24px;">JHR Photography</h1>
    <p style="color:#999;margin:4px 0 0;font-size:14px;">Assignment Notification</p>
  </div>
  <div style="padding:24px;">
    <p style="color:#e0e0e0;font-size:16px;">Hi ${assignment.operatorName},</p>
    <p style="color:#ccc;font-size:15px;">You have a new assignment offer. Please review the details below and respond.</p>

    <div style="background:#222;border:1px solid #333;border-radius:8px;padding:20px;margin:20px 0;">
      <h2 style="color:#c8a45e;margin:0 0 12px;font-size:18px;">${assignment.dealName}</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Venue</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.venue}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Show Time</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.showTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Start</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.startTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">End</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.endTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Pay</td><td style="color:#4ade80;padding:6px 0;font-size:16px;font-weight:600;">${assignment.totalPay}</td></tr>
      </table>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <a href="${assignment.assignmentUrl}" style="display:inline-block;padding:14px 40px;background:#c8a45e;color:#111;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">View Full Assignment</a>
    </div>

    <p style="color:#999;font-size:13px;text-align:center;">This assignment expires in 7 days. Please respond promptly.</p>
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid #333;">
    <p style="color:#666;font-size:12px;margin:0;">JHR Photography | Nashville, TN</p>
  </div>
</div>
</body>
</html>`;

  const textBody = `New Assignment: ${assignment.dealName}

Hi ${assignment.operatorName},

You have a new assignment offer:

Event: ${assignment.dealName}
Venue: ${assignment.venue}
Show Time: ${formatDateTime(assignment.showTime)}
Start: ${formatDateTime(assignment.startTime)}
End: ${formatDateTime(assignment.endTime)}
Pay: ${assignment.totalPay}

View and respond: ${assignment.assignmentUrl}

This assignment expires in 7 days. Please respond promptly.

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
