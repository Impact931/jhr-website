import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getLessons,
  addLesson,
  seedInitialLessons,
  type SEOLesson,
} from '@/lib/contentops/lessons-store';

/**
 * GET /api/admin/seo-engine/lessons — List all lessons
 * Query params:
 *   ?phase=GENERATE — filter by phase
 *   ?seed=true — seed initial lessons if none exist
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const phase = searchParams.get('phase') as SEOLesson['appliesTo'] | null;
  const shouldSeed = searchParams.get('seed') === 'true';

  // Seed initial lessons if requested and none exist
  if (shouldSeed) {
    const seeded = await seedInitialLessons();
    if (seeded > 0) {
      console.log(`[SEO Engine] Seeded ${seeded} initial lessons`);
    }
  }

  const lessons = await getLessons();

  const filtered = phase
    ? lessons.filter((l) => l.appliesTo === phase || l.appliesTo === 'ALL')
    : lessons;

  return NextResponse.json({
    lessons: filtered,
    total: filtered.length,
    allTotal: lessons.length,
  });
}

/**
 * POST /api/admin/seo-engine/lessons — Add a new lesson
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, trigger, rule, severity, appliesTo, source } = body;

    if (!title || !trigger || !rule || !severity || !appliesTo) {
      return NextResponse.json(
        { error: 'Missing required fields: title, trigger, rule, severity, appliesTo' },
        { status: 400 }
      );
    }

    const validSeverities = ['CRITICAL', 'IMPORTANT', 'MINOR'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      );
    }

    const validPhases = ['OBSERVE', 'SEGMENT', 'DECIDE', 'ACT', 'VERIFY', 'LEARN', 'GENERATE', 'ALL'];
    if (!validPhases.includes(appliesTo)) {
      return NextResponse.json(
        { error: `Invalid appliesTo. Must be one of: ${validPhases.join(', ')}` },
        { status: 400 }
      );
    }

    const lesson = await addLesson({
      date: new Date().toISOString().split('T')[0],
      title,
      trigger,
      rule,
      severity,
      appliesTo,
      source: source || 'admin',
    });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('[SEO Engine] Failed to add lesson:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add lesson' },
      { status: 500 }
    );
  }
}
