import type { SOWContractData } from '@/lib/sow/types';

export function sowDeliveryEmail(
  contract: SOWContractData,
  pdfDownloadUrl: string
): {
  subject: string;
  htmlBody: string;
  textBody: string;
} {
  const docLabel = contract.docType || 'Statement of Work';
  const subject = `${docLabel} - ${contract.dealName || contract.title} | JHR Photography`;
  const firstName = contract.contactName.split(' ')[0] || 'there';

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

    <!-- Gold accent bar -->
    <div style="height:4px;background:linear-gradient(90deg,#c8a45e,#dbb978);"></div>

    <!-- Greeting -->
    <div style="padding:32px 32px 0;">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#1a1a1a;">Hi ${firstName},</h1>
      <p style="margin:0 0 12px;font-size:16px;color:#27272a;line-height:1.6;">Thank you for choosing JHR Photography! We're excited to work with you${contract.eventType ? ` on your ${contract.eventType.toLowerCase()}` : ''}.</p>
      <p style="margin:0 0 12px;font-size:16px;color:#27272a;line-height:1.6;">Your ${docLabel.toLowerCase()} is ready for review. Please take a moment to look through the details and let us know if you have any questions.</p>
      <p style="margin:0;font-size:16px;color:#27272a;line-height:1.6;">A PDF copy is attached to this email, or you can download it using the button below.</p>
    </div>

    ${contract.dealAmount || contract.eventDate ? `
    <!-- Quick details -->
    <div style="margin:24px 32px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:16px 20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${contract.eventDate ? `<tr>
          <td style="padding:6px 0;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Event Date</span><br>
            <span style="font-size:15px;color:#27272a;font-weight:500;">${new Date(contract.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </td>
        </tr>` : ''}
        ${contract.dealAmount ? `<tr>
          <td style="padding:6px 0;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;font-weight:600;">Investment</span><br>
            <span style="font-size:18px;color:#16a34a;font-weight:700;">${contract.dealAmount}</span>
          </td>
        </tr>` : ''}
      </table>
    </div>` : ''}

    <!-- CTA -->
    <div style="padding:8px 32px 32px;text-align:center;">
      <a href="${pdfDownloadUrl}" style="display:inline-block;padding:14px 48px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;letter-spacing:0.3px;">Download PDF</a>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0 0;">
    <p style="margin:0 0 4px;font-size:13px;color:#71717a;">Questions? Reply to this email or call us at (615) 554-0583.</p>
    <p style="margin:0;font-size:12px;color:#a1a1aa;">JHR Photography &bull; Nashville, TN</p>
  </div>

</div>
</div>
</body>
</html>`;

  const textBody = `Hi ${firstName},

Thank you for choosing JHR Photography!${contract.eventType ? ` We're excited to work with you on your ${contract.eventType.toLowerCase()}.` : ''}

Your ${docLabel.toLowerCase()} is ready for review. Please take a moment to look through the details and let us know if you have any questions.
${contract.eventDate ? `\nEvent Date: ${new Date(contract.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}` : ''}${contract.dealAmount ? `\nInvestment: ${contract.dealAmount}` : ''}

Download your ${docLabel}: ${pdfDownloadUrl}

A PDF copy is also attached to this email.

Questions? Reply to this email or call us at (615) 554-0583.

JHR Photography | Nashville, TN`;

  return { subject, htmlBody, textBody };
}
