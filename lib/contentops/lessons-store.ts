/**
 * SEO/GEO Lessons Store — DynamoDB-backed persistent learning
 *
 * Stores lessons learned from SEO/GEO optimization cycles.
 * Both the CLI skill (/seo-geo) and admin dashboard read from and write to this store.
 * Lessons are injected into content generation prompts so the pipeline learns from mistakes.
 */

import { putItem, queryItems } from '@/lib/dynamodb';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SEOLesson {
  id: string;
  date: string;
  title: string;
  trigger: string;
  rule: string;
  severity: 'CRITICAL' | 'IMPORTANT' | 'MINOR';
  appliesTo: 'OBSERVE' | 'SEGMENT' | 'DECIDE' | 'ACT' | 'VERIFY' | 'LEARN' | 'GENERATE' | 'ALL';
  createdAt: string;
  source: 'cli' | 'admin' | 'auto';
}

interface LessonRecord {
  pk: string;
  sk: string;
  id: string;
  date: string;
  title: string;
  trigger: string;
  rule: string;
  severity: string;
  appliesTo: string;
  createdAt: string;
  source: string;
  entityType: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PK = 'SEO#lessons';

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Get all lessons, sorted by date descending (newest first)
 */
export async function getLessons(): Promise<SEOLesson[]> {
  try {
    const items = await queryItems<LessonRecord>(PK);

    return (items || []).map(recordToLesson);
  } catch (error) {
    console.error('[LessonsStore] Failed to fetch lessons:', error);
    return [];
  }
}

/**
 * Get lessons filtered by phase (e.g., only 'GENERATE' lessons for injection into prompts)
 */
export async function getLessonsByPhase(phase: SEOLesson['appliesTo']): Promise<SEOLesson[]> {
  const all = await getLessons();
  return all.filter((l) => l.appliesTo === phase || l.appliesTo === 'ALL');
}

/**
 * Get only CRITICAL lessons (always loaded regardless of phase)
 */
export async function getCriticalLessons(): Promise<SEOLesson[]> {
  const all = await getLessons();
  return all.filter((l) => l.severity === 'CRITICAL');
}

/**
 * Get lessons relevant to content generation (GENERATE + ACT + ALL + CRITICAL)
 */
export async function getGenerationLessons(): Promise<SEOLesson[]> {
  const all = await getLessons();
  return all.filter(
    (l) =>
      l.appliesTo === 'GENERATE' ||
      l.appliesTo === 'ACT' ||
      l.appliesTo === 'ALL' ||
      l.severity === 'CRITICAL'
  );
}

/**
 * Add a new lesson
 */
export async function addLesson(lesson: Omit<SEOLesson, 'id' | 'createdAt'>): Promise<SEOLesson> {
  const id = `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const sk = `${lesson.date}#${id}`;

  const record: LessonRecord = {
    pk: PK,
    sk,
    id,
    date: lesson.date,
    title: lesson.title,
    trigger: lesson.trigger,
    rule: lesson.rule,
    severity: lesson.severity,
    appliesTo: lesson.appliesTo,
    createdAt,
    source: lesson.source,
    entityType: 'SEOLesson',
  };

  await putItem(record);

  return { ...lesson, id, createdAt };
}

/**
 * Format lessons as a prompt injection string for content generation
 */
export function formatLessonsForPrompt(lessons: SEOLesson[]): string {
  if (lessons.length === 0) return '';

  const formatted = lessons
    .map((l) => {
      const badge = l.severity === 'CRITICAL' ? '[CRITICAL]' : l.severity === 'IMPORTANT' ? '[IMPORTANT]' : '[MINOR]';
      return `${badge} ${l.title}: ${l.rule}`;
    })
    .join('\n');

  return `## Content Generation Lessons (from previous cycles — MUST follow these rules)

${formatted}

Apply ALL rules above. CRITICAL rules are non-negotiable. Violating a lesson that was previously corrected is a hard failure.`;
}

// ─── Seed Lessons ────────────────────────────────────────────────────────────

/**
 * Seed initial lessons from project history (idempotent — checks for existing lessons first)
 */
export async function seedInitialLessons(): Promise<number> {
  const existing = await getLessons();
  if (existing.length > 0) return 0; // Already seeded

  const seeds: Omit<SEOLesson, 'id' | 'createdAt'>[] = [
    {
      date: '2026-03-17',
      title: 'Never force-seed DynamoDB',
      trigger: 'Force-seed wipes user-uploaded images with no undo',
      rule: 'NEVER use "force": true on seed API. Use targeted field updates or merge seed only.',
      severity: 'CRITICAL',
      appliesTo: 'ACT',
      source: 'admin',
    },
    {
      date: '2026-03-17',
      title: 'Targeted updates over broad operations',
      trigger: 'Changing a URL in buttons should be a targeted DynamoDB update, not a full re-seed',
      rule: 'For field-level changes, use /api/admin/content/find-replace or /api/admin/content/sections. Never re-seed when a targeted fix works.',
      severity: 'CRITICAL',
      appliesTo: 'ACT',
      source: 'admin',
    },
    {
      date: '2026-03-17',
      title: 'No AI slop in content',
      trigger: 'Generated content contained flagged AI-sounding terms',
      rule: 'Never use: crucial, delve, comprehensive, leverage, elevate, streamline, robust, cutting-edge, game-changer, unlock, empower, seamless, innovative, furthermore, moreover, utilize, paradigm, synergy.',
      severity: 'CRITICAL',
      appliesTo: 'GENERATE',
      source: 'admin',
    },
    {
      date: '2026-03-17',
      title: 'Nashville specificity required',
      trigger: 'Generic content that just appends "Nashville" without real local knowledge',
      rule: 'Nashville-focused articles must reference specific venues, neighborhoods, or landmarks. Generic + "Nashville" is not good enough.',
      severity: 'IMPORTANT',
      appliesTo: 'GENERATE',
      source: 'admin',
    },
    {
      date: '2026-03-17',
      title: 'Preferred partners in Nashville content',
      trigger: 'Nashville articles missing links to SEO partnership domains',
      rule: 'Nashville-focused content must include at least 1 link to: nashvilleadventures.com, visitmusiccity.com, or nashvillechamber.com.',
      severity: 'IMPORTANT',
      appliesTo: 'GENERATE',
      source: 'admin',
    },
  ];

  let count = 0;
  for (const seed of seeds) {
    await addLesson(seed);
    count++;
  }

  return count;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function recordToLesson(record: LessonRecord): SEOLesson {
  return {
    id: record.id,
    date: record.date,
    title: record.title,
    trigger: record.trigger,
    rule: record.rule,
    severity: record.severity as SEOLesson['severity'],
    appliesTo: record.appliesTo as SEOLesson['appliesTo'],
    createdAt: record.createdAt,
    source: record.source as SEOLesson['source'],
  };
}
