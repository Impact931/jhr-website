import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { putItem } from '@/lib/dynamodb';

/**
 * GET /api/admin/gsc/callback
 * Handles OAuth callback from Google, exchanges code for tokens,
 * and stores the refresh token in DynamoDB.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    const redirectUrl = new URL('/admin/seo', request.url);
    redirectUrl.searchParams.set('error', error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    const redirectUrl = new URL('/admin/seo', request.url);
    redirectUrl.searchParams.set('error', 'no_code');
    return NextResponse.redirect(redirectUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = `${nextAuthUrl}/api/admin/gsc/callback`;

  if (!clientId || !clientSecret) {
    const redirectUrl = new URL('/admin/seo', request.url);
    redirectUrl.searchParams.set('error', 'missing_credentials');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      console.error('Token exchange failed:', errData);
      const redirectUrl = new URL('/admin/seo', request.url);
      redirectUrl.searchParams.set('error', 'token_exchange_failed');
      return NextResponse.redirect(redirectUrl);
    }

    const tokens = await tokenResponse.json();

    // Store refresh token in DynamoDB
    // In production, this should be encrypted at rest
    await putItem({
      pk: 'SETTINGS#gsc',
      sk: 'oauth-token',
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
      connectedAt: new Date().toISOString(),
      connectedBy: session.user?.email || 'unknown',
    });

    return NextResponse.redirect(new URL('/admin/seo?connected=true', request.url));
  } catch (err) {
    console.error('GSC OAuth callback error:', err);
    const redirectUrl = new URL('/admin/seo', request.url);
    redirectUrl.searchParams.set('error', 'callback_failed');
    return NextResponse.redirect(redirectUrl);
  }
}
