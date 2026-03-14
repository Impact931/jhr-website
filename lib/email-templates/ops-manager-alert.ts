import type { Assignment } from '../assignments-types';

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  } catch {
    return iso;
  }
}

export function opsManagerAlertEmail(
  assignment: Assignment,
  action: 'accept' | 'decline'
): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const isAccepted = action === 'accept';
  const statusColor = isAccepted ? '#4ade80' : '#f87171';
  const statusLabel = isAccepted ? 'ACCEPTED' : 'DECLINED';

  const subject = `[${statusLabel}] ${assignment.operatorName} — ${assignment.dealName}`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:1px solid #333;">
  <div style="padding:24px;text-align:center;border-bottom:2px solid ${statusColor};">
    <h1 style="color:#c8a45e;margin:0;font-size:24px;">JHR Photography</h1>
    <p style="color:${statusColor};margin:8px 0 0;font-size:18px;font-weight:600;">Operator ${statusLabel}</p>
  </div>
  <div style="padding:24px;">
    <div style="background:#222;border:1px solid #333;border-radius:8px;padding:20px;margin:0 0 20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Operator</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.operatorName} (${assignment.operatorEmail})</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Deal</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.dealName}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Client</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.clientName}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Venue</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.venue}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Date</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.startTime)} — ${formatDateTime(assignment.endTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Pay</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.totalPay}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Responded</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.respondedAt ? formatDateTime(assignment.respondedAt) : 'Just now'}</td></tr>
      </table>
    </div>

    ${!isAccepted && assignment.declineReason ? `<div style="background:#2a1a1a;border:1px solid #4a2020;border-radius:8px;padding:16px;margin:0 0 20px;">
      <h3 style="color:#f87171;margin:0 0 8px;font-size:14px;">Decline Reason</h3>
      <p style="color:#e0e0e0;margin:0;font-size:14px;">${assignment.declineReason}</p>
    </div>` : ''}

    ${!isAccepted ? `<p style="color:#f87171;font-size:14px;font-weight:600;">Action required: Reassign this gig to another operator.</p>` : ''}

    ${assignment.qualityWarnings && assignment.qualityWarnings.length > 0 ? `<div style="background:#2a2a1a;border:1px solid #4a4020;border-radius:8px;padding:16px;margin:0 0 20px;">
      <h3 style="color:#fbbf24;margin:0 0 8px;font-size:14px;">Quality Warnings</h3>
      <ul style="color:#e0e0e0;margin:0;padding:0 0 0 20px;font-size:13px;">
        ${assignment.qualityWarnings.map((w) => `<li>${w}</li>`).join('')}
      </ul>
    </div>` : ''}
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid #333;">
    <p style="color:#666;font-size:12px;margin:0;">JHR Photography Assignment System</p>
  </div>
</div>
</body>
</html>`;

  const textBody = `[${statusLabel}] ${assignment.operatorName} — ${assignment.dealName}

Operator: ${assignment.operatorName} (${assignment.operatorEmail})
Deal: ${assignment.dealName}
Client: ${assignment.clientName}
Venue: ${assignment.venue}
Date: ${formatDateTime(assignment.startTime)} — ${formatDateTime(assignment.endTime)}
Pay: ${assignment.totalPay}
${!isAccepted && assignment.declineReason ? `\nDecline Reason: ${assignment.declineReason}` : ''}
${!isAccepted ? '\nAction required: Reassign this gig to another operator.' : ''}

JHR Photography Assignment System`;

  return { subject, htmlBody, textBody };
}
