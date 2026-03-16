import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Batch processes multiple articles sequentially
export const maxDuration = 300;

interface BatchTopic {
  topic: string;
  primaryKeyword: string;
  icpTag: string;
  articleType: string;
  wordCountTarget?: number;
  ctaPath?: string;
}

interface BatchResult {
  topic: string;
  status: 'success' | 'error';
  slug?: string;
  error?: string;
}

/**
 * POST /api/admin/contentops/batch — Generate multiple articles sequentially
 *
 * Body: {
 *   topics: Array<{
 *     topic: string,
 *     primaryKeyword: string,
 *     icpTag: string,
 *     articleType: string,
 *     wordCountTarget?: number,
 *     ctaPath?: string
 *   }>
 * }
 * Response: { results: Array<{ topic: string, status: 'success'|'error', slug?: string, error?: string }> }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topics } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: topics (must be a non-empty array)' },
        { status: 400 }
      );
    }

    const results: BatchResult[] = [];

    // Process topics sequentially to respect API rate limits
    for (const topicConfig of topics as BatchTopic[]) {
      try {
        // Call the generate endpoint internally via fetch
        const generateUrl = new URL('/api/admin/contentops/generate', request.url);
        const response = await fetch(generateUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Forward cookies for auth
            cookie: request.headers.get('cookie') || '',
          },
          body: JSON.stringify(topicConfig),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          results.push({
            topic: topicConfig.topic,
            status: 'error',
            error: errorData.error || `HTTP ${response.status}`,
          });
        } else {
          const data = await response.json();
          results.push({
            topic: topicConfig.topic,
            status: 'success',
            slug: data.slug,
          });
        }
      } catch (error) {
        results.push({
          topic: topicConfig.topic,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('ContentOps batch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Batch generation failed' },
      { status: 500 }
    );
  }
}
