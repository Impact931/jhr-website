import { google } from 'googleapis';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'assignments@jhr-photography.com';

function getServiceAccountCredentials() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (!keyJson) return null;
  try {
    return JSON.parse(keyJson);
  } catch {
    return null;
  }
}

function getGmailClient() {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    console.error('GOOGLE_SERVICE_ACCOUNT_KEY_JSON not configured');
    return null;
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    subject: FROM_EMAIL, // Impersonate the sender via domain-wide delegation
  });

  return google.gmail({ version: 'v1', auth });
}

function buildMimeMessage({
  to,
  subject,
  htmlBody,
  textBody,
}: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}): string {
  const boundary = `boundary_${crypto.randomUUID().replace(/-/g, '')}`;

  const mime = [
    `From: JHR Photography <${FROM_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    textBody,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  return mime;
}

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
  const gmail = getGmailClient();
  if (!gmail) {
    console.error('Gmail client not available, email not sent');
    return false;
  }

  try {
    const rawMessage = buildMimeMessage({ to, subject, htmlBody, textBody });
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return true;
  } catch (error) {
    console.error('Gmail send failed:', error);
    return false;
  }
}
