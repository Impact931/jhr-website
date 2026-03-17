import type { SOWContractData } from '@/lib/sow/types';
import { blocksToHtml, blocksToPlainText } from '@/lib/sow/notion-blocks';

export function sowDeliveryEmail(
  contract: SOWContractData,
  driveUrl: string
): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const subject = `${contract.docType || 'Statement of Work'} - ${contract.title} | JHR Photography`;

  const bodyHtml = blocksToHtml(contract.blocks);
  const bodyText = blocksToPlainText(contract.blocks);

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="width:100%;background-color:#f4f4f5;padding:32px 16px;">
<div style="max-width:640px;margin:0 auto;">

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
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a;">${contract.docType || 'Statement of Work'}</h1>
      <p style="margin:0 0 4px;font-size:16px;color:#52525b;line-height:1.5;">${contract.title}</p>
      <p style="margin:0;font-size:14px;color:#a1a1aa;">Prepared for ${contract.contactName} — ${contract.accountName}</p>
    </div>

    <!-- Details card -->
    <div style="margin:24px 32px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
      <div style="padding:16px 20px;">
        <table style="width:100%;border-collapse:collapse;">
          ${contract.dealAmount ? `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Deal Amount</span><br>
              <span style="font-size:18px;color:#16a34a;font-weight:700;">${contract.dealAmount}</span>
            </td>
          </tr>` : ''}
          ${contract.eventDate ? `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Event Date</span><br>
              <span style="font-size:15px;color:#27272a;font-weight:500;">${contract.eventDate}</span>
            </td>
          </tr>` : ''}
          ${contract.eventType ? `<tr>
            <td style="padding:8px 0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Event Type</span><br>
              <span style="font-size:15px;color:#27272a;font-weight:500;">${contract.eventType}</span>
            </td>
          </tr>` : ''}
        </table>
      </div>
    </div>

    <!-- SOW Content -->
    <div style="padding:0 32px 24px;font-size:14px;line-height:1.6;color:#27272a;">
      ${bodyHtml}
    </div>

    <!-- CTA -->
    <div style="padding:8px 32px 32px;text-align:center;">
      <a href="${driveUrl}" style="display:inline-block;padding:14px 48px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;letter-spacing:0.3px;">View Document in Drive</a>
      <p style="margin:16px 0 0;font-size:13px;color:#a1a1aa;">PDF and Word copies are also attached to this email</p>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0 0;">
    <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">Please review and let us know if you have any questions.</p>
    <p style="margin:0;font-size:12px;color:#a1a1aa;">JHR Photography &bull; Nashville, TN</p>
  </div>

</div>
</div>
</body>
</html>`;

  const textBody = `${contract.docType || 'Statement of Work'} - ${contract.title}

Prepared for ${contract.contactName} — ${contract.accountName}
${contract.dealAmount ? `Deal Amount: ${contract.dealAmount}` : ''}
${contract.eventDate ? `Event Date: ${contract.eventDate}` : ''}
${contract.eventType ? `Event Type: ${contract.eventType}` : ''}

${bodyText}

View document: ${driveUrl}

PDF and Word copies are attached to this email.

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
