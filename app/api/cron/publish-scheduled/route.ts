import { NextRequest, NextResponse } from 'next/server';
import { getScheduledPostsDue, publishBlog } from '@/lib/blog-content';

/**
 * POST /api/cron/publish-scheduled
 *
 * Cron endpoint that checks for scheduled blog posts due for publication
 * and publishes them automatically.
 *
 * Security: Protected by CRON_SECRET environment variable.
 * Should be called by Vercel Cron or external scheduler every 5 minutes.
 *
 * Vercel Cron config in vercel.json:
 * ```json
 * {
 *   "crons": [{
 *     "path": "/api/cron/publish-scheduled",
 *     "schedule": "0/5 * * * *"
 *   }]
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow if no secret configured (development) or if secret matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all posts that are due for publication
    const duePosts = await getScheduledPostsDue();

    if (duePosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No scheduled posts due for publication',
        publishedCount: 0,
      });
    }

    // Publish each due post
    const results: Array<{ slug: string; success: boolean; error?: string }> = [];

    for (const post of duePosts) {
      try {
        await publishBlog(post.slug);
        results.push({ slug: post.slug, success: true });
      } catch (error) {
        results.push({
          slug: post.slug,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: errorCount === 0,
      message: `Published ${successCount} posts${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      publishedCount: successCount,
      results,
    });
  } catch (error) {
    console.error('Error in publish-scheduled cron:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET for easier manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
