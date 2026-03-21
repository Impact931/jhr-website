import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scanItemsByPkPrefix, putItem } from '@/lib/dynamodb';

interface BlogRecord {
  pk: string;
  sk: string;
  slug: string;
  title: string;
  featuredImage?: string;
  seo?: { ogImage?: string };
  [key: string]: unknown;
}

const DEFAULT_PLACEHOLDERS = [
  '/images/blog-default-hero.jpg',
];

/**
 * POST /api/admin/contentops/fix-featured-images
 * One-time fix: updates featuredImage from seo.ogImage for all articles
 * where featuredImage is missing or a default placeholder.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const records = await scanItemsByPkPrefix<BlogRecord>('BLOG#');
  const fixed: string[] = [];
  const skipped: string[] = [];

  for (const record of records) {
    const ogImage = record.seo?.ogImage;
    if (!ogImage) {
      skipped.push(`${record.slug}(${record.sk}): no ogImage`);
      continue;
    }

    const current = record.featuredImage;
    const isPlaceholder = !current || DEFAULT_PLACEHOLDERS.includes(current);

    if (isPlaceholder || current !== ogImage) {
      record.featuredImage = ogImage;
      await putItem(record);
      fixed.push(`${record.slug}(${record.sk}): ${current || 'none'} → ${ogImage}`);
    } else {
      skipped.push(`${record.slug}(${record.sk}): already correct`);
    }
  }

  return NextResponse.json({ fixed, skipped, total: records.length });
}
