import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listKnowledgeEntries, createKnowledgeEntry } from '@/lib/knowledge';
import type { KnowledgeCategory } from '@/lib/knowledge';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = request.nextUrl.searchParams.get('category') as KnowledgeCategory | null;
    const search = request.nextUrl.searchParams.get('search') || undefined;
    const tag = request.nextUrl.searchParams.get('tag') || undefined;

    const entries = await listKnowledgeEntries({ category: category || undefined, search, tag });
    return NextResponse.json({ entries, count: entries.length });
  } catch (error) {
    console.error('Error fetching knowledge entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    const entry = await createKnowledgeEntry({
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      fileUrl: body.fileUrl,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
