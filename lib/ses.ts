import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const region = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';

const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

const sesClient = new SESClient({ region, ...customCredentials });

const fromEmail = process.env.SES_FROM_EMAIL || 'jayson@impactstudio931.com';

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}): Promise<boolean> {
  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: htmlBody, Charset: 'UTF-8' },
            Text: { Data: textBody, Charset: 'UTF-8' },
          },
        },
      })
    );
    return true;
  } catch (error) {
    console.error('SES send failed:', error);
    return false;
  }
}
