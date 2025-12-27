import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFolder, updateFolder, deleteFolder } from '@/lib/media';

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

// GET - Get a single folder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { folderId } = await params;
    const folder = await getFolder(folderId);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Error getting folder:', error);
    return NextResponse.json({ error: 'Failed to get folder' }, { status: 500 });
  }
}

// PUT - Update a folder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { folderId } = await params;
    const body = await request.json();

    // Only allow updating name and parentId
    const updates: { name?: string; parentId?: string | null } = {};

    if (body.name !== undefined) {
      const trimmedName = String(body.name).trim();
      if (trimmedName.length === 0) {
        return NextResponse.json({ error: 'Folder name cannot be empty' }, { status: 400 });
      }
      if (trimmedName.length > 100) {
        return NextResponse.json({ error: 'Folder name too long (max 100 characters)' }, { status: 400 });
      }
      updates.name = trimmedName;
    }

    if (body.parentId !== undefined) {
      // Prevent folder from being its own parent
      if (body.parentId === folderId) {
        return NextResponse.json({ error: 'Folder cannot be its own parent' }, { status: 400 });
      }
      updates.parentId = body.parentId;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const folder = await updateFolder(folderId, updates);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

// DELETE - Delete a folder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { folderId } = await params;

    const deleted = await deleteFolder(folderId);

    if (!deleted) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Check for specific errors
    if (error instanceof Error) {
      if (error.message.includes('Cannot delete folder with items')) {
        return NextResponse.json(
          { error: 'Cannot delete folder that contains media items' },
          { status: 400 }
        );
      }
      if (error.message.includes('Cannot delete folder with subfolders')) {
        return NextResponse.json(
          { error: 'Cannot delete folder that contains subfolders' },
          { status: 400 }
        );
      }
    }

    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
