import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';
import { getNotionPage, updateNotionPage } from '@/lib/notion';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-jhr-secret');
  if (secret !== process.env.ASSIGNMENTS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Test 1: Check env vars
  results.envVars = {
    GOOGLE_SERVICE_ACCOUNT_KEY_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON ? `set (${process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON.length} chars)` : 'NOT SET',
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL || 'NOT SET',
    SLACK_OPS_WEBHOOK_URL: process.env.SLACK_OPS_WEBHOOK_URL ? 'set' : 'NOT SET',
    NOTION_API_KEY: process.env.NOTION_API_KEY ? 'set' : 'NOT SET',
    ASSIGNMENTS_TABLE_NAME: process.env.ASSIGNMENTS_TABLE_NAME || 'NOT SET',
  };

  // Test 2: Parse service account JSON
  try {
    const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || '';
    const sanitized = keyJson.replace(/\r?\n/g, '\\n');
    const parsed = JSON.parse(sanitized);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    results.serviceAccount = {
      parsed: true,
      client_email: parsed.client_email,
      private_key_start: parsed.private_key?.substring(0, 40),
      private_key_has_newlines: parsed.private_key?.includes('\n'),
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

  // Test 5: Notion API test (read a known page)
  try {
    const testPageId = '2e1c2a32df0d80eca2a4d09e343f94a6';
    const page = await getNotionPage(testPageId);
    results.notion = {
      connected: !!page,
      pageType: page ? 'database' : null,
    };
  } catch (err) {
    results.notion = { connected: false, error: String(err) };
  }

  return NextResponse.json(results, { status: 200 });
}
