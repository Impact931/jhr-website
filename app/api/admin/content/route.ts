import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getContent, saveContent, getPageContent } from '@/lib/dynamodb';

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

// GET - Retrieve content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId');
  const sectionId = searchParams.get('sectionId');
  const contentKey = searchParams.get('contentKey');

  if (!pageId) {
    return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
  }

  try {
    if (sectionId && contentKey) {
      // Get specific content item
      const content = await getContent(pageId, sectionId, contentKey);
      return NextResponse.json({ content });
    } else {
      // Get all content for a page
      const content = await getPageContent(pageId);
      return NextResponse.json({ content });
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { pageId, sectionId, contentKey, value, contentType } = await request.json();

    if (!pageId || !sectionId || !contentKey || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const content = await saveContent(pageId, sectionId, contentKey, value, contentType || 'text');
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
