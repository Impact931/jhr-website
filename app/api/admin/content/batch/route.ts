import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveContent } from '@/lib/dynamodb';

// Verify editor session
async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('editor_session');

  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, 'base64').toString();
    return decoded.startsWith('editor:');
  } catch {
    return false;
  }
}

interface ContentChange {
  pageId: string;
  sectionId: string;
  contentKey: string;
  value: string;
  contentType: 'text' | 'image' | 'html' | 'json';
}

// POST - Batch save multiple content items
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { changes } = await request.json() as { changes: ContentChange[] };

    if (!changes || !Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const results = await Promise.all(
      changes.map(async (change) => {
        try {
          await saveContent(
            change.pageId,
            change.sectionId,
            change.contentKey,
            change.value,
            change.contentType
          );
          return { success: true, key: `${change.pageId}:${change.sectionId}:${change.contentKey}` };
        } catch (error) {
          console.error('Error saving content item:', error);
          return { success: false, key: `${change.pageId}:${change.sectionId}:${change.contentKey}`, error: 'Save failed' };
        }
      })
    );

    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      return NextResponse.json({
        success: false,
        message: `${failures.length} of ${changes.length} items failed to save`,
        results,
      }, { status: 207 });
    }

    return NextResponse.json({ success: true, savedCount: changes.length });
  } catch (error) {
    console.error('Error in batch save:', error);
    return NextResponse.json({ error: 'Batch save failed' }, { status: 500 });
  }
}
