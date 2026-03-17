import crypto from 'crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function getServiceAccountCredentials(): { client_email: string; private_key: string } | null {
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;
  const keyJson = keyB64
    ? Buffer.from(keyB64, 'base64').toString('utf-8')
    : process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;

  if (!keyJson) {
    console.error('Neither GOOGLE_SERVICE_ACCOUNT_KEY_B64 nor GOOGLE_SERVICE_ACCOUNT_KEY_JSON is set');
    return null;
  }
  try {
    const sanitized = keyJson.replace(/\r?\n/g, '\\n');
    const parsed = JSON.parse(sanitized);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse service account key JSON:', err);
    return null;
  }
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Get a Google access token via service account JWT with domain-wide delegation.
 * @param impersonateEmail - The email to impersonate (e.g. jayson@jhr-photography.com)
 * @param scopes - OAuth scopes to request
 */
export async function getGoogleAccessToken(
  impersonateEmail: string,
  scopes: string[]
): Promise<string | null> {
  const creds = getServiceAccountCredentials();
  if (!creds) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: creds.client_email,
    sub: impersonateEmail,
    scope: scopes.join(' '),
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

export { base64url };
