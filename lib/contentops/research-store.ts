/**
 * ContentOps Research Store
 *
 * Persists structured research data in DynamoDB so the generate endpoint
 * can load it by ID without depending on frontend state or re-running research.
 *
 * Storage key: PK=RESEARCH#{id}, SK=data
 * TTL: 7 days (research becomes stale)
 */

import { putItem, getItem } from '@/lib/dynamodb';
import type { ResearchPayload } from './types';

export interface StoredResearch {
  id: string;
  topic: string;
  primaryKeyword: string;
  icpTag: string;
  provider: string;
  data: ResearchPayload;
  createdAt: string;
  ttl: number;
}

interface StoredResearchRecord extends StoredResearch {
  pk: string;
  sk: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Save structured research data to DynamoDB.
 * Returns the researchId for later retrieval.
 */
export async function saveResearchData(input: {
  topic: string;
  primaryKeyword: string;
  icpTag: string;
  provider: string;
  data: ResearchPayload;
}): Promise<string> {
  const id = generateId();
  const now = new Date();
  const ttl = Math.floor(now.getTime() / 1000) + 7 * 24 * 60 * 60; // 7 days

  const record: StoredResearchRecord = {
    pk: `RESEARCH#${id}`,
    sk: 'data',
    id,
    topic: input.topic,
    primaryKeyword: input.primaryKeyword,
    icpTag: input.icpTag,
    provider: input.provider,
    data: input.data,
    createdAt: now.toISOString(),
    ttl,
  };

  await putItem(record);
  return id;
}

/**
 * Load research data by ID.
 * Returns null if not found or expired.
 */
export async function loadResearchData(id: string): Promise<StoredResearch | null> {
  const record = await getItem<StoredResearchRecord>(`RESEARCH#${id}`, 'data');
  if (!record) return null;
  return {
    id: record.id,
    topic: record.topic,
    primaryKeyword: record.primaryKeyword,
    icpTag: record.icpTag,
    provider: record.provider,
    data: record.data,
    createdAt: record.createdAt,
    ttl: record.ttl,
  };
}
