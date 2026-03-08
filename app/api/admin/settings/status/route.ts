import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItem } from '@/lib/dynamodb';

interface IntegrationStatus {
  name: string;
  key: string;
  connected: boolean;
  details?: string;
}

/**
 * GET /api/admin/settings/status
 * Returns connection status for all integrations by checking env vars + DynamoDB tokens.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check GSC OAuth token in DynamoDB
    let gscTokenExists = false;
    try {
      const token = await getItem<{ pk: string }>('GSC#oauth', 'token');
      gscTokenExists = !!token;
    } catch {
      // no token
    }

    const integrations: IntegrationStatus[] = [
      {
        name: 'PageSpeed Insights',
        key: 'psi',
        connected: !!process.env.GOOGLE_API_KEY,
        details: process.env.GOOGLE_API_KEY ? 'API key configured' : 'Missing GOOGLE_API_KEY',
      },
      {
        name: 'Google Search Console',
        key: 'gsc',
        connected: !!(process.env.GOOGLE_CLIENT_ID && gscTokenExists),
        details:
          !process.env.GOOGLE_CLIENT_ID
            ? 'Missing GOOGLE_CLIENT_ID'
            : !gscTokenExists
              ? 'OAuth token not connected'
              : 'Connected via OAuth',
      },
      {
        name: 'Google Analytics 4',
        key: 'ga4',
        connected: !!(
          process.env.GA4_PROPERTY_ID &&
          (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE)
        ),
        details:
          !process.env.GA4_PROPERTY_ID
            ? 'Missing GA4_PROPERTY_ID'
            : !(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE)
              ? 'Missing service account key'
              : 'Service account configured',
      },
      {
        name: 'Meta / Instagram',
        key: 'meta',
        connected: !!(process.env.META_PAGE_ACCESS_TOKEN && process.env.IG_BUSINESS_USER_ID),
        details:
          !process.env.META_PAGE_ACCESS_TOKEN
            ? 'Missing META_PAGE_ACCESS_TOKEN'
            : !process.env.IG_BUSINESS_USER_ID
              ? 'Missing IG_BUSINESS_USER_ID'
              : 'Access token configured',
      },
      {
        name: 'YouTube',
        key: 'youtube',
        connected: !!(process.env.YOUTUBE_CHANNEL_ID && process.env.YOUTUBE_API_KEY),
        details:
          !process.env.YOUTUBE_CHANNEL_ID
            ? 'Missing YOUTUBE_CHANNEL_ID'
            : !process.env.YOUTUBE_API_KEY
              ? 'Missing YOUTUBE_API_KEY'
              : 'API key configured',
      },
      {
        name: 'Notion',
        key: 'notion',
        connected: !!(process.env.NOTION_TOKEN && process.env.NOTION_LEADS_DB_ID),
        details:
          !process.env.NOTION_TOKEN
            ? 'Missing NOTION_TOKEN'
            : !process.env.NOTION_LEADS_DB_ID
              ? 'Missing NOTION_LEADS_DB_ID'
              : 'Token configured',
      },
    ];

    return NextResponse.json({ integrations });
  } catch (error) {
    console.error('Error checking integration status:', error);
    return NextResponse.json(
      { error: 'Failed to check integration status' },
      { status: 500 }
    );
  }
}
