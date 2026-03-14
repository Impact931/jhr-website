import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-jhr-secret');
  if (secret !== process.env.ASSIGNMENTS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Test 1: Check env vars
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  results.envVars = {
    GOOGLE_SERVICE_ACCOUNT_KEY_B64: keyB64 ? `set (${keyB64.length} chars)` : 'NOT SET',
    GOOGLE_SERVICE_ACCOUNT_KEY_JSON: keyJson ? `set (${keyJson.length} chars)` : 'NOT SET',
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL || 'NOT SET',
    SLACK_OPS_WEBHOOK_URL: process.env.SLACK_OPS_WEBHOOK_URL ? 'set' : 'NOT SET',
    NOTION_TOKEN: process.env.NOTION_TOKEN ? 'set' : 'NOT SET',
    ASSIGNMENTS_TABLE_NAME: process.env.ASSIGNMENTS_TABLE_NAME || 'NOT SET',
  };

  // Test 2: Parse service account JSON (via base64 or raw)
  try {
    const raw = keyB64
      ? Buffer.from(keyB64, 'base64').toString('utf-8')
      : keyJson || '';
    const sanitized = raw.replace(/\r?\n/g, '\\n');
    const parsed = JSON.parse(sanitized);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    results.serviceAccount = {
      source: keyB64 ? 'base64' : 'raw_json',
      parsed: true,
      client_email: parsed.client_email,
      private_key_length: parsed.private_key?.length,
      private_key_starts_with_pem: parsed.private_key?.startsWith('-----BEGIN'),
    };
  } catch (err) {
    results.serviceAccount = { parsed: false, error: String(err) };
  }

  // Test 3: Send test email
  try {
    const emailResult = await sendEmail({
      to: 'jayson@jhr-photography.com',
      subject: 'JHR Assignment System - Test Email',
      htmlBody: '<h1>Test</h1><p>This is a test email from the assignment system.</p>',
      textBody: 'Test - This is a test email from the assignment system.',
    });
    results.email = { sent: emailResult };
  } catch (err) {
    results.email = { sent: false, error: String(err) };
  }

  // Test 4: Send test Slack
  try {
    const slackResult = await sendSlackNotification({
      text: ':test_tube: Assignment system test — Slack webhook is working!',
    });
    results.slack = { sent: slackResult };
  } catch (err) {
    results.slack = { sent: false, error: String(err) };
  }

  return NextResponse.json(results, { status: 200 });
}
