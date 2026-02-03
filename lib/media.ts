/**
 * Media Library Service Layer
 * DynamoDB CRUD operations for the media management system
 */

import { randomUUID } from 'crypto';
import {
  getItem,
  putItem,
  queryItems,
  deleteItem,
  scanItemsByPkPrefix,
  docClient,
  tableName,
} from './dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import type {
  MediaItem,
  MediaCollection,
  MediaTagIndex,
  MediaUsage,
  MediaStats,
  MediaListParams,
  MediaListResponse,
  MediaUpdateRequest,
  MediaBulkAction,
  MediaBulkResponse,
  MediaType,
} from '@/types/media';

// ─── Media Item CRUD ─────────────────────────────────────────────────

export function generateMediaId(): string {
  return randomUUID();
}

export async function createMediaItem(item: Omit<MediaItem, 'pk' | 'sk'>): Promise<MediaItem> {
  const record: MediaItem = {
    ...item,
    pk: `MEDIA#${item.mediaId}`,
    sk: 'metadata',
  };
  await putItem(record);

  // Update stats
  await incrementMediaStats(item.mediaType, item.fileSize);

  // Index tags
  if (item.tags?.length) {
    await indexTags(item.mediaId, item.tags, item.mediaType, item.thumbnailUrl);
  }

  return record;
}

export async function getMediaItem(mediaId: string): Promise<MediaItem | undefined> {
  return getItem<MediaItem>(`MEDIA#${mediaId}`, 'metadata');
}

export async function updateMediaItem(
  mediaId: string,
  updates: MediaUpdateRequest & Partial<Pick<MediaItem, 'status' | 'variants' | 'dimensions' | 'exifData' | 'aiMetadata' | 'contentHash' | 'thumbnailUrl' | 'publicUrl' | 'fileSize'>>
): Promise<MediaItem | undefined> {
  const existing = await getMediaItem(mediaId);
  if (!existing) return undefined;

  // Handle tag changes
  const oldTags = existing.tags || [];
  const newTags = updates.tags ?? oldTags;
  if (updates.tags !== undefined) {
    // Remove old tag indexes
    await removeTagIndexes(mediaId, oldTags);
    // Add new tag indexes
    await indexTags(mediaId, newTags, existing.mediaType, existing.thumbnailUrl);
  }

  const updated: MediaItem = {
    ...existing,
    ...updates,
    tags: newTags,
    updatedAt: new Date().toISOString(),
  };

  await putItem(updated);
  return updated;
}

export async function deleteMediaItem(mediaId: string): Promise<boolean> {
  const existing = await getMediaItem(mediaId);
  if (!existing) return false;

  // Remove tag indexes
  if (existing.tags?.length) {
    await removeTagIndexes(mediaId, existing.tags);
  }

  // Remove usage records
  const usages = await getMediaUsage(mediaId);
  for (const usage of usages) {
    await deleteItem(usage.pk, usage.sk);
  }

  // Delete the media record
  await deleteItem(`MEDIA#${mediaId}`, 'metadata');

  // Update stats
  await decrementMediaStats(existing.mediaType, existing.fileSize);

  return true;
}

export async function listMedia(params: MediaListParams = {}): Promise<MediaListResponse> {
  const {
    limit = 24,
    mediaType,
    collectionId,
    tag,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  let items: MediaItem[];

  if (tag) {
    // Use tag index for tag-based search
    const tagRecords = await queryItems<MediaTagIndex>(`MEDIATAG#${tag}`);
    const mediaIds = tagRecords.map((r) => r.mediaId);
    items = [];
    for (const id of mediaIds) {
      const item = await getMediaItem(id);
      if (item) items.push(item);
    }
  } else {
    // Scan all media items
    items = await scanItemsByPkPrefix<MediaItem>('MEDIA#');
    // Filter to only metadata records (exclude usage records)
    items = items.filter((item) => item.sk === 'metadata');
  }

  // Apply filters
  if (mediaType) {
    items = items.filter((item) => item.mediaType === mediaType);
  }
  if (collectionId) {
    items = items.filter((item) => item.collectionId === collectionId);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.filename?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.alt?.toLowerCase().includes(searchLower) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  items.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'filename') {
      comparison = (a.filename || '').localeCompare(b.filename || '');
    } else if (sortBy === 'fileSize') {
      comparison = (a.fileSize || 0) - (b.fileSize || 0);
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination via cursor (offset-based for scan)
  const startIndex = params.cursor ? parseInt(params.cursor, 10) : 0;
  const paged = items.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex + limit < items.length ? String(startIndex + limit) : undefined;

  return {
    items: paged,
    cursor: nextCursor,
    total: items.length,
  };
}

// ─── Collection CRUD ─────────────────────────────────────────────────

export async function createCollection(
  data: Omit<MediaCollection, 'pk' | 'sk' | 'collectionId' | 'mediaCount' | 'createdAt' | 'updatedAt'>
): Promise<MediaCollection> {
  const collectionId = randomUUID();
  const now = new Date().toISOString();
  const record: MediaCollection = {
    pk: `MEDIACOL#${collectionId}`,
    sk: 'metadata',
    collectionId,
    mediaCount: 0,
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  await putItem(record);
  return record;
}

export async function getCollection(collectionId: string): Promise<MediaCollection | undefined> {
  return getItem<MediaCollection>(`MEDIACOL#${collectionId}`, 'metadata');
}

export async function listCollections(): Promise<MediaCollection[]> {
  const items = await scanItemsByPkPrefix<MediaCollection>('MEDIACOL#');
  return items
    .filter((item) => item.sk === 'metadata')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function updateCollection(
  collectionId: string,
  updates: Partial<Pick<MediaCollection, 'name' | 'slug' | 'description' | 'parentId' | 'coverMediaId' | 'sortOrder'>>
): Promise<MediaCollection | undefined> {
  const existing = await getCollection(collectionId);
  if (!existing) return undefined;

  const updated: MediaCollection = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await putItem(updated);
  return updated;
}

export async function deleteCollection(collectionId: string): Promise<boolean> {
  await deleteItem(`MEDIACOL#${collectionId}`, 'metadata');
  return true;
}

// ─── Tag Index ───────────────────────────────────────────────────────

async function indexTags(
  mediaId: string,
  tags: string[],
  mediaType: MediaType,
  thumbnailUrl?: string
): Promise<void> {
  const now = new Date().toISOString();
  const records: MediaTagIndex[] = tags.map((tag) => ({
    pk: `MEDIATAG#${tag.toLowerCase()}`,
    sk: `MEDIA#${mediaId}`,
    tag: tag.toLowerCase(),
    mediaId,
    mediaType,
    thumbnailUrl,
    createdAt: now,
  }));

  // Batch write in groups of 25
  for (let i = 0; i < records.length; i += 25) {
    const batch = records.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      })
    );
  }
}

async function removeTagIndexes(mediaId: string, tags: string[]): Promise<void> {
  for (let i = 0; i < tags.length; i += 25) {
    const batch = tags.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((tag) => ({
            DeleteRequest: {
              Key: {
                pk: `MEDIATAG#${tag.toLowerCase()}`,
                sk: `MEDIA#${mediaId}`,
              },
            },
          })),
        },
      })
    );
  }
}

export async function listTagsForMedia(mediaId: string): Promise<string[]> {
  // We store tags on the media item itself, so just fetch it
  const item = await getMediaItem(mediaId);
  return item?.tags || [];
}

export async function searchTags(prefix: string): Promise<string[]> {
  // Scan tag index entries for autocomplete
  const items = await scanItemsByPkPrefix<MediaTagIndex>('MEDIATAG#');
  const tagSet = new Set<string>();
  const prefixLower = prefix.toLowerCase();
  for (const item of items) {
    if (item.tag?.startsWith(prefixLower)) {
      tagSet.add(item.tag);
    }
  }
  return Array.from(tagSet).sort();
}

// ─── Usage Tracking ──────────────────────────────────────────────────

export async function addMediaUsage(
  mediaId: string,
  page: string,
  section: string,
  contentKey?: string
): Promise<MediaUsage> {
  const record: MediaUsage = {
    pk: `MEDIA#${mediaId}`,
    sk: `usage#${page}#${section}`,
    mediaId,
    page,
    section,
    contentKey,
    lastScanned: new Date().toISOString(),
  };
  await putItem(record);
  return record;
}

export async function getMediaUsage(mediaId: string): Promise<MediaUsage[]> {
  return queryItems<MediaUsage>(`MEDIA#${mediaId}`, 'usage#');
}

export async function removeMediaUsage(
  mediaId: string,
  page: string,
  section: string
): Promise<boolean> {
  await deleteItem(`MEDIA#${mediaId}`, `usage#${page}#${section}`);
  return true;
}

// ─── Stats ───────────────────────────────────────────────────────────

export async function getMediaStats(): Promise<MediaStats> {
  const stats = await getItem<MediaStats>('MEDIA_STATS', 'global');
  if (stats) return stats;

  // Return defaults if no stats record exists
  return {
    pk: 'MEDIA_STATS',
    sk: 'global',
    totalCount: 0,
    totalSize: 0,
    imageCount: 0,
    videoCount: 0,
    imageSize: 0,
    videoSize: 0,
    updatedAt: new Date().toISOString(),
  };
}

async function incrementMediaStats(
  mediaType: MediaType,
  fileSize: number
): Promise<void> {
  const stats = await getMediaStats();
  stats.totalCount += 1;
  stats.totalSize += fileSize;
  if (mediaType === 'image') {
    stats.imageCount += 1;
    stats.imageSize += fileSize;
  } else {
    stats.videoCount += 1;
    stats.videoSize += fileSize;
  }
  stats.updatedAt = new Date().toISOString();
  await putItem(stats);
}

async function decrementMediaStats(
  mediaType: MediaType,
  fileSize: number
): Promise<void> {
  const stats = await getMediaStats();
  stats.totalCount = Math.max(0, stats.totalCount - 1);
  stats.totalSize = Math.max(0, stats.totalSize - fileSize);
  if (mediaType === 'image') {
    stats.imageCount = Math.max(0, stats.imageCount - 1);
    stats.imageSize = Math.max(0, stats.imageSize - fileSize);
  } else {
    stats.videoCount = Math.max(0, stats.videoCount - 1);
    stats.videoSize = Math.max(0, stats.videoSize - fileSize);
  }
  stats.updatedAt = new Date().toISOString();
  await putItem(stats);
}

export async function recalculateStats(): Promise<MediaStats> {
  const items = await scanItemsByPkPrefix<MediaItem>('MEDIA#');
  const mediaItems = items.filter((i) => i.sk === 'metadata' && i.status === 'ready');

  const stats: MediaStats = {
    pk: 'MEDIA_STATS',
    sk: 'global',
    totalCount: mediaItems.length,
    totalSize: mediaItems.reduce((sum, i) => sum + (i.fileSize || 0), 0),
    imageCount: mediaItems.filter((i) => i.mediaType === 'image').length,
    videoCount: mediaItems.filter((i) => i.mediaType === 'video').length,
    imageSize: mediaItems
      .filter((i) => i.mediaType === 'image')
      .reduce((sum, i) => sum + (i.fileSize || 0), 0),
    videoSize: mediaItems
      .filter((i) => i.mediaType === 'video')
      .reduce((sum, i) => sum + (i.fileSize || 0), 0),
    updatedAt: new Date().toISOString(),
  };

  await putItem(stats);
  return stats;
}

// ─── Bulk Operations ─────────────────────────────────────────────────

export async function bulkOperation(action: MediaBulkAction): Promise<MediaBulkResponse> {
  const results: MediaBulkResponse = { success: 0, failed: 0, errors: [] };

  for (const mediaId of action.mediaIds) {
    try {
      switch (action.action) {
        case 'delete':
          await deleteMediaItem(mediaId);
          break;

        case 'tag': {
          const existing = await getMediaItem(mediaId);
          if (!existing) throw new Error('Not found');
          const merged = Array.from(new Set([...existing.tags, ...(action.tags || [])]));
          await updateMediaItem(mediaId, { tags: merged });
          break;
        }

        case 'move':
          await updateMediaItem(mediaId, {
            collectionId: action.collectionId || undefined,
          });
          break;
      }
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors?.push({
        mediaId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return results;
}

// ─── Duplicate Detection ─────────────────────────────────────────────

export async function findByContentHash(contentHash: string): Promise<MediaItem | undefined> {
  const items = await scanItemsByPkPrefix<MediaItem>('MEDIA#');
  return items.find(
    (item) => item.sk === 'metadata' && item.contentHash === contentHash
  );
}
