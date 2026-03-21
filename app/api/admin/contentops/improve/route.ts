import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/contentops/improve
 *
 * Auth-gate only. Returns the Lambda Function URL + API key so the
 * browser can call the standalone Lambda directly (120s timeout).
 * We do NOT proxy the stream — Amplify hard-caps this route at 30s.
 *
 * Body: { slug: string }
 * Response: { lambdaUrl, apiKey, slug }
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

  return new Response(JSON.stringify({ lambdaUrl, apiKey, slug }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
