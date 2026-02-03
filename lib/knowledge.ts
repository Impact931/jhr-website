import { getItem, putItem, deleteItem, scanItemsByPkPrefix } from '@/lib/dynamodb';

export type KnowledgeCategory = 'FAQ' | 'Script' | 'Template' | 'Document';

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeRecord extends KnowledgeEntry {
  pk: string;
  sk: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function createKnowledgeEntry(
  input: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<KnowledgeEntry> {
  const id = generateId();
  const now = new Date().toISOString();
  const record: KnowledgeRecord = {
    pk: `KNOWLEDGE#${id}`,
    sk: 'entry',
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await putItem(record);
  const { pk: _pk, sk: _sk, ...entry } = record;
  return entry;
}

export async function getKnowledgeEntry(id: string): Promise<KnowledgeEntry | null> {
  const record = await getItem<KnowledgeRecord>(`KNOWLEDGE#${id}`, 'entry');
  if (!record) return null;
  const { pk: _pk, sk: _sk, ...entry } = record;
  return entry;
}

export async function updateKnowledgeEntry(
  id: string,
  updates: Partial<Omit<KnowledgeEntry, 'id' | 'createdAt'>>
): Promise<KnowledgeEntry | null> {
  const existing = await getItem<KnowledgeRecord>(`KNOWLEDGE#${id}`, 'entry');
  if (!existing) return null;

  const record: KnowledgeRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await putItem(record);
  const { pk: _pk, sk: _sk, ...entry } = record;
  return entry;
}

export async function deleteKnowledgeEntry(id: string): Promise<boolean> {
  return deleteItem(`KNOWLEDGE#${id}`, 'entry');
}

export async function listKnowledgeEntries(options?: {
  category?: KnowledgeCategory;
  search?: string;
  tag?: string;
}): Promise<KnowledgeEntry[]> {
  const records = await scanItemsByPkPrefix<KnowledgeRecord>('KNOWLEDGE#');

  let entries = records.map(({ pk: _pk, sk: _sk, ...entry }) => entry);

  if (options?.category) {
    entries = entries.filter((e) => e.category === options.category);
  }

  if (options?.tag) {
    const tag = options.tag.toLowerCase();
    entries = entries.filter((e) => e.tags.some((t) => t.toLowerCase() === tag));
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  entries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return entries;
}

export async function exportAllKnowledge(): Promise<KnowledgeEntry[]> {
  return listKnowledgeEntries();
}
