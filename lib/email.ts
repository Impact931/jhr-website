import crypto from 'crypto';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'assignments@jhr-photography.com';
const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function getServiceAccountCredentials(): { client_email: string; private_key: string } | null {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (!keyJson) {
    console.error('GOOGLE_SERVICE_ACCOUNT_KEY_JSON env var is not set');
    return null;
  }
  try {
    // Env vars may contain literal \n sequences that break JSON.parse.
    // Replace actual newlines/carriage-returns inside the string with \\n
    // so JSON.parse can succeed, then fix up private_key afterward.
    const sanitized = keyJson.replace(/\r?\n/g, '\\n');
    const parsed = JSON.parse(sanitized);
    // After parsing, the private_key may contain literal two-char "\\n"
    // sequences instead of real newlines. PEM keys require real newlines.
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY_JSON:', err);
    return null;
  }
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(): Promise<string | null> {
  const creds = getServiceAccountCredentials();
  if (!creds) {
    console.error('GOOGLE_SERVICE_ACCOUNT_KEY_JSON not configured');
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: creds.client_email,
    sub: FROM_EMAIL,
    scope: 'https://www.googleapis.com/auth/gmail.send',
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(creds.private_key);
  const signatureB64 = base64url(signature);

  const jwt = `${signingInput}.${signatureB64}`;

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error('Failed to get Google access token:', err);
    return null;
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
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
