import { NextRequest, NextResponse } from 'next/server';
import {
  createCollection,
  listCollections,
  updateCollection,
  deleteCollection,
} from '@/lib/media';

/**
 * GET /api/admin/media/collections — List all collections
 */
export async function GET() {
  try {
    const collections = await listCollections();
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error listing collections:', error);
    // Return empty list so the UI still renders
    return NextResponse.json([]);
  }
}

/**
 * POST /api/admin/media/collections — Create a new collection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const collection = await createCollection({
      name: body.name,
      slug,
      description: body.description,
      parentId: body.parentId,
      coverMediaId: body.coverMediaId,
      sortOrder: body.sortOrder ?? 0,
      createdBy: body.createdBy,
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/media/collections — Update a collection
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.collectionId) {
      return NextResponse.json({ error: 'collectionId is required' }, { status: 400 });
    }

    const updated = await updateCollection(body.collectionId, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      parentId: body.parentId,
      coverMediaId: body.coverMediaId,
      sortOrder: body.sortOrder,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/media/collections — Delete a collection
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');

    if (!collectionId) {
      return NextResponse.json({ error: 'collectionId is required' }, { status: 400 });
    }

    await deleteCollection(collectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
