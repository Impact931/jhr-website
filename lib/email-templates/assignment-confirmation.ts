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

export function assignmentConfirmationEmail(assignment: Assignment): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const subject = `Assignment Confirmed: ${assignment.dealName}`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:1px solid #333;">
  <div style="padding:24px;text-align:center;border-bottom:2px solid #c8a45e;">
    <h1 style="color:#c8a45e;margin:0;font-size:24px;">JHR Photography</h1>
    <p style="color:#4ade80;margin:4px 0 0;font-size:14px;">Assignment Confirmed</p>
  </div>
  <div style="padding:24px;">
    <p style="color:#e0e0e0;font-size:16px;">Hi ${assignment.operatorName},</p>
    <p style="color:#ccc;font-size:15px;">Thank you for accepting this assignment. Here are your confirmed details:</p>

    <div style="background:#222;border:1px solid #333;border-radius:8px;padding:20px;margin:20px 0;">
      <h2 style="color:#c8a45e;margin:0 0 12px;font-size:18px;">${assignment.dealName}</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Venue</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.venue}${assignment.venueAddress ? `<br><span style="color:#999;font-size:13px;">${assignment.venueAddress}</span>` : ''}</td></tr>
        ${assignment.googleMapsUrl ? `<tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Directions</td><td style="padding:6px 0;"><a href="${assignment.googleMapsUrl}" style="color:#c8a45e;font-size:14px;">Google Maps</a></td></tr>` : ''}
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Show Time</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.showTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Start</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.startTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">End</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${formatDateTime(assignment.endTime)}</td></tr>
        <tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Pay</td><td style="color:#4ade80;padding:6px 0;font-size:16px;font-weight:600;">${assignment.totalPay}</td></tr>
        ${assignment.attire ? `<tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Attire</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.attire}</td></tr>` : ''}
        ${assignment.gear ? `<tr><td style="color:#999;padding:6px 12px 6px 0;font-size:14px;">Gear</td><td style="color:#e0e0e0;padding:6px 0;font-size:14px;">${assignment.gear}</td></tr>` : ''}
      </table>
    </div>

    ${assignment.pocName ? `<div style="background:#222;border:1px solid #333;border-radius:8px;padding:16px;margin:16px 0;">
      <h3 style="color:#c8a45e;margin:0 0 8px;font-size:15px;">Point of Contact</h3>
      <p style="color:#e0e0e0;margin:0;font-size:14px;">${assignment.pocName}${assignment.pocPhone ? ` — ${assignment.pocPhone}` : ''}</p>
    </div>` : ''}

    <p style="color:#999;font-size:13px;margin-top:24px;">You can review the full assignment details at any time:</p>
    <p><a href="${assignment.assignmentUrl}" style="color:#c8a45e;font-size:14px;">${assignment.assignmentUrl}</a></p>
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid #333;">
    <p style="color:#666;font-size:12px;margin:0;">JHR Photography | Nashville, TN</p>
  </div>
</div>
</body>
</html>`;

  const textBody = `Assignment Confirmed: ${assignment.dealName}

Hi ${assignment.operatorName},

Thank you for accepting this assignment. Here are your confirmed details:

Event: ${assignment.dealName}
Venue: ${assignment.venue}${assignment.venueAddress ? ` (${assignment.venueAddress})` : ''}
${assignment.googleMapsUrl ? `Directions: ${assignment.googleMapsUrl}` : ''}
Show Time: ${formatDateTime(assignment.showTime)}
Start: ${formatDateTime(assignment.startTime)}
End: ${formatDateTime(assignment.endTime)}
Pay: ${assignment.totalPay}
${assignment.attire ? `Attire: ${assignment.attire}` : ''}
${assignment.gear ? `Gear: ${assignment.gear}` : ''}
${assignment.pocName ? `\nPoint of Contact: ${assignment.pocName}${assignment.pocPhone ? ` — ${assignment.pocPhone}` : ''}` : ''}

Full details: ${assignment.assignmentUrl}

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
