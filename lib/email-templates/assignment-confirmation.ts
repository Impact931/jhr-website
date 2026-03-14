import type { Assignment } from '../assignments-types';

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  } catch {
    return iso;
  }
}

function formatTimeOnly(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
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
  const subject = `Confirmed - ${assignment.dealName}`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="width:100%;background-color:#f4f4f5;padding:32px 16px;">
<div style="max-width:560px;margin:0 auto;">

  <!-- Logo bar -->
  <div style="text-align:center;padding:0 0 24px;">
    <span style="font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:0.5px;">JHR Photography</span>
  </div>

  <!-- Main card -->
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <!-- Green accent bar -->
    <div style="height:4px;background:#16a34a;"></div>

    <!-- Success badge + greeting -->
    <div style="padding:32px 32px 0;text-align:center;">
      <div style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:24px;padding:6px 20px;margin:0 0 16px;">
        <span style="font-size:14px;font-weight:600;color:#16a34a;">Assignment Confirmed</span>
      </div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a;">You're all set, ${assignment.operatorName.split(' ')[0]}!</h1>
      <p style="margin:0;font-size:16px;color:#52525b;line-height:1.5;">Here's everything you need for the gig.</p>
    </div>

    <!-- Assignment details -->
    <div style="margin:24px 32px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">

      <div style="padding:16px 20px;background:#18181b;">
        <h2 style="margin:0;font-size:18px;font-weight:600;color:#c8a45e;">${assignment.dealName}</h2>
      </div>

      <div style="padding:16px 20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Venue</span><br>
              <span style="font-size:15px;color:#27272a;font-weight:500;">${assignment.venue}</span>
              ${assignment.venueAddress ? `<br><span style="font-size:13px;color:#71717a;">${assignment.venueAddress}</span>` : ''}
            </td>
          </tr>
          ${assignment.googleMapsUrl ? `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <a href="${assignment.googleMapsUrl}" style="font-size:14px;color:#2563eb;text-decoration:none;font-weight:500;">Open in Google Maps &rarr;</a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Show Time</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${formatTimeOnly(assignment.showTime)}</span>
                  </td>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Start</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${formatTimeOnly(assignment.startTime)}</span>
                  </td>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">End</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${formatTimeOnly(assignment.endTime)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Pay</span><br>
              <span style="font-size:20px;color:#16a34a;font-weight:700;">${assignment.totalPay}</span>
            </td>
          </tr>
          ${assignment.attire ? `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Attire</span><br>
              <span style="font-size:15px;color:#27272a;">${assignment.attire}</span>
            </td>
          </tr>` : ''}
          ${assignment.gear ? `<tr>
            <td style="padding:8px 0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Gear</span><br>
              <span style="font-size:15px;color:#27272a;">${assignment.gear}</span>
            </td>
          </tr>` : ''}
        </table>
      </div>
    </div>

    ${assignment.pocName ? `
    <!-- Point of Contact -->
    <div style="margin:0 32px 24px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;">
      <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#3b82f6;font-weight:600;">Point of Contact</span><br>
      <span style="font-size:15px;color:#1e3a5f;font-weight:500;">${assignment.pocName}</span>
      ${assignment.pocPhone ? `<br><a href="tel:${assignment.pocPhone}" style="font-size:14px;color:#2563eb;text-decoration:none;">${assignment.pocPhone}</a>` : ''}
    </div>` : ''}

    <!-- Full details link -->
    <div style="padding:0 32px 32px;text-align:center;">
      <a href="${assignment.assignmentUrl}" style="display:inline-block;padding:12px 36px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">View Full Assignment</a>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0 0;">
    <p style="margin:0;font-size:12px;color:#a1a1aa;">JHR Photography &bull; Nashville, TN</p>
  </div>

</div>
</div>
</body>
</html>`;

  const textBody = `Assignment Confirmed - ${assignment.dealName}

You're all set, ${assignment.operatorName.split(' ')[0]}!

Event: ${assignment.dealName}
Venue: ${assignment.venue}${assignment.venueAddress ? ` (${assignment.venueAddress})` : ''}
${assignment.googleMapsUrl ? `Directions: ${assignment.googleMapsUrl}` : ''}
Show Time: ${formatDateTime(assignment.showTime)}
Start: ${formatDateTime(assignment.startTime)}
End: ${formatDateTime(assignment.endTime)}
Pay: ${assignment.totalPay}
${assignment.attire ? `Attire: ${assignment.attire}` : ''}
${assignment.gear ? `Gear: ${assignment.gear}` : ''}
${assignment.pocName ? `\nPoint of Contact: ${assignment.pocName}${assignment.pocPhone ? ` - ${assignment.pocPhone}` : ''}` : ''}

Full details: ${assignment.assignmentUrl}

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
