import { NextRequest, NextResponse } from 'next/server';
import { findByContentHash } from '@/lib/media';
import type { DuplicateCheckRequest, DuplicateCheckResponse } from '@/types/media';

/**
 * POST /api/admin/media/check-duplicate — Check if a file already exists by content hash
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DuplicateCheckRequest;

    if (!body.contentHash) {
      return NextResponse.json(
        { error: 'contentHash is required' },
        { status: 400 }
      );
    }

    const existing = await findByContentHash(body.contentHash);

    const response: DuplicateCheckResponse = {
      isDuplicate: !!existing,
      existingMedia: existing || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking duplicate:', error);
    // If DynamoDB is unavailable, assume not a duplicate so upload can proceed
    return NextResponse.json({ isDuplicate: false });
  }
}
