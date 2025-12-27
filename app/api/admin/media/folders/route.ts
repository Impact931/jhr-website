import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { listFolders, createFolder, CreateFolderInput } from '@/lib/media';

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

// GET - List folders
export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    // List folders by parent (null for root level)
    const folders = await listFolders(parentId);

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Error listing folders:', error);
    return NextResponse.json({ error: 'Failed to list folders' }, { status: 500 });
  }
}

// POST - Create a new folder
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, parentId = null } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json({ error: 'Folder name cannot be empty' }, { status: 400 });
    }
    if (trimmedName.length > 100) {
      return NextResponse.json({ error: 'Folder name too long (max 100 characters)' }, { status: 400 });
    }

    const folderInput: CreateFolderInput = {
      name: trimmedName,
      parentId,
    };

    const folder = await createFolder(folderInput);

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
