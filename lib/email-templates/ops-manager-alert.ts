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
  const statusLabel = isAccepted ? 'ACCEPTED' : 'DECLINED';
  const accentColor = isAccepted ? '#16a34a' : '#dc2626';
  const bgTint = isAccepted ? '#f0fdf4' : '#fef2f2';
  const borderTint = isAccepted ? '#bbf7d0' : '#fecaca';

  const subject = `[${statusLabel}] ${assignment.operatorName} - ${assignment.dealName}`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="width:100%;background-color:#f4f4f5;padding:32px 16px;">
<div style="max-width:560px;margin:0 auto;">

  <!-- Logo -->
  <div style="text-align:center;padding:0 0 24px;">
    <span style="font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:0.5px;">JHR Photography</span>
  </div>

  <!-- Main card -->
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <!-- Status accent -->
    <div style="height:4px;background:${accentColor};"></div>

    <!-- Status badge -->
    <div style="padding:24px 32px 0;text-align:center;">
      <div style="display:inline-block;background:${bgTint};border:1px solid ${borderTint};border-radius:24px;padding:6px 20px;">
        <span style="font-size:14px;font-weight:700;color:${accentColor};letter-spacing:0.5px;">${statusLabel}</span>
      </div>
    </div>

    <!-- Summary -->
    <div style="padding:20px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;width:100px;">Operator</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;font-weight:500;">${assignment.operatorName} <span style="color:#71717a;font-weight:400;">(${assignment.operatorEmail})</span></td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Deal</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;font-weight:500;">${assignment.dealName}</td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Client</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;">${assignment.clientName}</td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Venue</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;">${assignment.venue}</td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Date</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;">${formatDateTime(assignment.startTime)} - ${formatDateTime(assignment.endTime)}</td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Pay</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;font-weight:600;">${assignment.totalPay}</td>
        </tr>
        <tr><td colspan="2" style="border-bottom:1px solid #f0f0f0;"></td></tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Responded</td>
          <td style="padding:8px 0;font-size:15px;color:#27272a;">${assignment.respondedAt ? formatDateTime(assignment.respondedAt) : 'Just now'}</td>
        </tr>
      </table>
    </div>

    ${!isAccepted && assignment.declineReason ? `
    <!-- Decline reason -->
    <div style="margin:0 32px 20px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;">
      <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#dc2626;font-weight:600;">Decline Reason</span>
      <p style="margin:6px 0 0;font-size:15px;color:#450a0a;line-height:1.5;">${assignment.declineReason}</p>
    </div>` : ''}

    ${!isAccepted ? `
    <div style="padding:0 32px 24px;">
      <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;">
        <span style="font-size:14px;color:#92400e;font-weight:600;">Action needed: Reassign this gig to another operator.</span>
      </div>
    </div>` : ''}

    ${assignment.qualityWarnings && assignment.qualityWarnings.length > 0 ? `
    <div style="margin:0 32px 20px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;">
      <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#d97706;font-weight:600;">Quality Warnings</span>
      <ul style="margin:8px 0 0;padding:0 0 0 20px;font-size:13px;color:#78350f;line-height:1.6;">
        ${assignment.qualityWarnings.map((w) => `<li>${w}</li>`).join('')}
      </ul>
    </div>` : ''}

  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0 0;">
    <p style="margin:0;font-size:12px;color:#a1a1aa;">JHR Photography Assignment System</p>
  </div>

</div>
</div>
</body>
</html>`;

  const textBody = `[${statusLabel}] ${assignment.operatorName} - ${assignment.dealName}

Operator: ${assignment.operatorName} (${assignment.operatorEmail})
Deal: ${assignment.dealName}
Client: ${assignment.clientName}
Venue: ${assignment.venue}
Date: ${formatDateTime(assignment.startTime)} - ${formatDateTime(assignment.endTime)}
Pay: ${assignment.totalPay}
${!isAccepted && assignment.declineReason ? `\nDecline Reason: ${assignment.declineReason}` : ''}
${!isAccepted ? '\nAction needed: Reassign this gig to another operator.' : ''}

JHR Photography Assignment System`;

  return { subject, htmlBody, textBody };
}
