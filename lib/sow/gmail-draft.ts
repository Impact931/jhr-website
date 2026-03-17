import crypto from 'crypto';
import { getGoogleAccessToken, base64url } from '@/lib/google-auth';

const GMAIL_DRAFTS_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts';
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
const FROM_EMAIL = 'assignments@jhr-photography.com';

interface Attachment {
  filename: string;
  mimeType: string;
  content: Buffer;
}

/**
 * Create a Gmail draft with attachments, impersonating the given email.
 * Returns the draft ID or null on failure.
 */
export async function createGmailDraft(
  impersonateEmail: string,
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  attachments: Attachment[]
): Promise<string | null> {
  const accessToken = await getGoogleAccessToken(impersonateEmail, SCOPES);
  if (!accessToken) {
    console.error(`Failed to get Gmail access token for ${impersonateEmail}`);
    return null;
  }

  const rawMessage = buildMimeWithAttachments({
    from: `JHR Photography <${FROM_EMAIL}>`,
    to,
    subject,
    htmlBody,
    textBody,
    attachments,
  });

  const encodedMessage = base64url(rawMessage);

  const res = await fetch(GMAIL_DRAFTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: { raw: encodedMessage },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Gmail draft creation failed for ${impersonateEmail}:`, res.status, err);
    return null;
  }

  const data = await res.json();
  return data.id;
}

function encodeSubject(subject: string): string {
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(subject)) {
    const encoded = Buffer.from(subject, 'utf-8').toString('base64');
    return `=?UTF-8?B?${encoded}?=`;
  }
  return subject;
}

function buildMimeWithAttachments({
  from,
  to,
  subject,
  htmlBody,
  textBody,
  attachments,
}: {
  from: string;
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  attachments: Attachment[];
}): string {
  const mixedBoundary = `mixed_${crypto.randomUUID().replace(/-/g, '')}`;
  const altBoundary = `alt_${crypto.randomUUID().replace(/-/g, '')}`;

  const parts: string[] = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
    '',
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
    // Plain text part
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(textBody, 'utf-8').toString('base64'),
    '',
    // HTML part
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody, 'utf-8').toString('base64'),
    '',
    `--${altBoundary}--`,
  ];

  // Attachments
  for (const att of attachments) {
    parts.push(
      `--${mixedBoundary}`,
      `Content-Type: ${att.mimeType}; name="${att.filename}"`,
      `Content-Disposition: attachment; filename="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      att.content.toString('base64'),
      ''
    );
  }

  parts.push(`--${mixedBoundary}--`);

  return parts.join('\r\n');
}
