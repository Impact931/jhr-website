import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runResearch } from '@/lib/contentops/research';
import { saveResearchData } from '@/lib/contentops/research-store';

export const maxDuration = 60;

/**
 * POST /api/admin/contentops/research — Run research + save to DynamoDB
 *
 * Uses SSE streaming to prevent Amplify gateway timeout.
 * Body: { topic, icpTag, primaryKeyword }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { topic, icpTag, primaryKeyword } = body;

  if (!topic || !icpTag || !primaryKeyword) {
    return new Response(JSON.stringify({ error: 'Missing required fields: topic, icpTag, primaryKeyword' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send('progress', { phase: 'researching', message: 'Running research...' });

        const result = await runResearch(topic, icpTag, primaryKeyword);

        if (result.error || !result.data) {
          send('error', { error: result.error || 'Research returned no data' });
          controller.close();
          return;
        }

        send('progress', { phase: 'saving', message: 'Saving research to database...' });

        // Save structured research to DynamoDB
        let researchId: string | null = null;
        try {
          researchId = await saveResearchData({
            topic,
            primaryKeyword,
            icpTag,
            provider: result.provider || 'unknown',
            data: result.data,
          });
          console.log(`[ContentOps] Research saved: ${researchId}`);
        } catch (saveErr) {
          console.error('[ContentOps] Failed to save research:', saveErr);
        }

        send('done', {
          research: result.data,
          researchId,
          provider: result.provider || 'unknown',
        });
        controller.close();
      } catch (error) {
        console.error('ContentOps research stream error:', error);
        send('error', { error: error instanceof Error ? error.message : 'Research failed' });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
