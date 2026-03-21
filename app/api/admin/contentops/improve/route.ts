import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/contentops/improve
 *
 * Thin proxy to standalone Lambda Function URL.
 * Auth check happens here (NextAuth session), then proxies to Lambda
 * which handles the full 3-phase improvement pipeline with 120s timeout.
 *
 * Body: { slug: string }
 * Response: Proxied SSE stream from Lambda
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const lambdaUrl = process.env.IMPROVE_LAMBDA_URL;
  const apiKey = process.env.IMPROVE_API_KEY;

  if (!lambdaUrl || !apiKey) {
    return new Response(JSON.stringify({ error: 'IMPROVE_LAMBDA_URL or IMPROVE_API_KEY not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => ({}));
  const slug = body.slug as string | undefined;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Proxy to Lambda Function URL
  const lambdaRes = await fetch(lambdaUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, apiKey }),
  });

  if (!lambdaRes.ok || !lambdaRes.body) {
    const text = await lambdaRes.text().catch(() => 'Lambda call failed');
    return new Response(JSON.stringify({ error: text }), {
      status: lambdaRes.status || 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream the Lambda response directly to the client
  return new Response(lambdaRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
