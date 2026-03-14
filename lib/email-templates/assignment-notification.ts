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

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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

export function assignmentNotificationEmail(assignment: Assignment): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  // Use a clean ASCII subject line to avoid encoding issues
  const subject = `New Assignment Offer - ${assignment.dealName}`;

  const eventDate = formatDateShort(assignment.showTime);
  const showTimeStr = formatTimeOnly(assignment.showTime);
  const startStr = formatTimeOnly(assignment.startTime);
  const endStr = formatTimeOnly(assignment.endTime);

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Outer wrapper -->
<div style="width:100%;background-color:#f4f4f5;padding:32px 16px;">
<div style="max-width:560px;margin:0 auto;">

  <!-- Logo bar -->
  <div style="text-align:center;padding:0 0 24px;">
    <span style="font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:0.5px;">JHR Photography</span>
  </div>

  <!-- Main card -->
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <!-- Gold accent bar -->
    <div style="height:4px;background:linear-gradient(90deg,#c8a45e,#dbb978);"></div>

    <!-- Greeting -->
    <div style="padding:32px 32px 0;">
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a;">Hey ${assignment.operatorName.split(' ')[0]}!</h1>
      <p style="margin:0;font-size:16px;color:#52525b;line-height:1.5;">You have a new assignment offer waiting for you. Take a look at the details below.</p>
    </div>

    <!-- Assignment details card -->
    <div style="margin:24px 32px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">

      <!-- Event name header -->
      <div style="padding:16px 20px;background:#18181b;border-bottom:1px solid #e4e4e7;">
        <h2 style="margin:0;font-size:18px;font-weight:600;color:#c8a45e;">${assignment.dealName}</h2>
      </div>

      <!-- Details grid -->
      <div style="padding:16px 20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Date</span><br>
              <span style="font-size:15px;color:#27272a;font-weight:500;">${eventDate}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Show Time</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${showTimeStr}</span>
                  </td>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Start</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${startStr}</span>
                  </td>
                  <td style="width:33%;">
                    <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">End</span><br>
                    <span style="font-size:15px;color:#27272a;font-weight:500;">${endStr}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Venue</span><br>
              <span style="font-size:15px;color:#27272a;font-weight:500;">${assignment.venue}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Pay</span><br>
              <span style="font-size:22px;color:#16a34a;font-weight:700;">${assignment.totalPay}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- CTA button -->
    <div style="padding:8px 32px 32px;text-align:center;">
      <a href="${assignment.assignmentUrl}" style="display:inline-block;padding:14px 48px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;letter-spacing:0.3px;">View Full Assignment</a>
      <p style="margin:16px 0 0;font-size:13px;color:#a1a1aa;">Review all details, then accept or decline</p>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0 0;">
    <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">This assignment expires in 7 days. Please respond promptly.</p>
    <p style="margin:0;font-size:12px;color:#a1a1aa;">JHR Photography &bull; Nashville, TN</p>
  </div>

</div>
</div>
</body>
</html>`;

  const textBody = `New Assignment Offer - ${assignment.dealName}

Hey ${assignment.operatorName.split(' ')[0]}!

You have a new assignment offer. Here are the details:

Event: ${assignment.dealName}
Date: ${eventDate}
Show Time: ${showTimeStr} | Start: ${startStr} | End: ${endStr}
Venue: ${assignment.venue}
Pay: ${assignment.totalPay}

View full details and respond: ${assignment.assignmentUrl}

This assignment expires in 7 days. Please respond promptly.

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
