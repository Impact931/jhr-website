import crypto from 'crypto';
import { getGoogleAccessToken, base64url } from '@/lib/google-auth';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'assignments@jhr-photography.com';
const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

async function getAccessToken(): Promise<string | null> {
  return getGoogleAccessToken(FROM_EMAIL, ['https://www.googleapis.com/auth/gmail.send']);
}

function encodeSubject(subject: string): string {
  // RFC 2047: encode subject as UTF-8 base64 if it contains non-ASCII
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(subject)) {
    const encoded = Buffer.from(subject, 'utf-8').toString('base64');
    return `=?UTF-8?B?${encoded}?=`;
  }
  return subject;
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

  return [
    `From: JHR Photography <${FROM_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(textBody, 'utf-8').toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody, 'utf-8').toString('base64'),
    '',
    `--${boundary}--`,
  ].join('\r\n');
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
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return false;

    const rawMessage = buildMimeMessage({ to, subject, htmlBody, textBody });
    const encodedMessage = base64url(rawMessage);

    const res = await fetch(GMAIL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gmail API send failed:', res.status, err);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}
