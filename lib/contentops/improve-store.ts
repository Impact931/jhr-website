/**
 * ContentOps Improve Store
 *
 * Stores intermediate state between improvement phases in DynamoDB.
 * Each phase reads/writes to PK=IMPROVE#{slug}, SK=state.
 * TTL: 1 hour (improvement sessions are short-lived).
 */

import { putItem, getItem, deleteItem } from '@/lib/dynamodb';

export interface ImproveState {
  slug: string;
  phase: 'analyze' | 'rewrite' | 'polish' | 'done';
  /** Phase 1 output */
  outline?: {
    sections: Array<{ h2: string; goal: string; mustInclude?: string[] }>;
    quickAnswerGoal: string;
    metaGoals: { title: string; description: string };
    faqTopics: string[];
  };
  /** Phase 2 output */
  improvedBody?: string;
  /** Original article data needed across phases */
  articleData?: {
    title: string;
    primaryKeyword: string;
    body: string;
    wordCount: number;
  };
  createdAt: string;
  ttl: number;
}

interface ImproveStateRecord extends ImproveState {
  pk: string;
  sk: string;
}

export async function saveImproveState(state: ImproveState): Promise<void> {
  const record: ImproveStateRecord = {
    pk: `IMPROVE#${state.slug}`,
    sk: 'state',
    ...state,
  };
  await putItem(record);
}

export async function loadImproveState(slug: string): Promise<ImproveState | null> {
  const record = await getItem<ImproveStateRecord>(`IMPROVE#${slug}`, 'state');
  if (!record) return null;
  return record;
}

export async function deleteImproveState(slug: string): Promise<void> {
  await deleteItem(`IMPROVE#${slug}`, 'state');
}
