import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scanItemsByPkPrefix, deleteItem } from '@/lib/dynamodb';

interface BlogRecord {
  pk: string;
  sk: string;
  slug: string;
  title: string;
  status: string;
  [key: string]: unknown;
}

/**
 * POST /api/admin/contentops/cleanup-drafts
 * Deletes stale draft records for articles that are already published.
 * These drafts cause the editor to load old data instead of the current published version.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');

  // Group by slug
  const bySlug = new Map<string, BlogRecord[]>();
  for (const r of records) {
    const existing = bySlug.get(r.slug) || [];
    existing.push(r);
    bySlug.set(r.slug, existing);
  }

  const deleted: string[] = [];
  const skipped: string[] = [];

  for (const [slug, versions] of bySlug.entries()) {
    const hasPublished = versions.some(v => v.sk === 'published');
    const draft = versions.find(v => v.sk === 'draft');

    if (hasPublished && draft) {
      await deleteItem(draft.pk, 'draft');
      deleted.push(slug);
    } else {
      skipped.push(`${slug}: ${hasPublished ? 'no draft' : 'not published'}`);
    }
  }

  return NextResponse.json({ deleted, skipped, total: records.length });
}
