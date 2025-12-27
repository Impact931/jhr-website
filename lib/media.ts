import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jhr-website-images';
const BUCKET_REGION = process.env.S3_BUCKET_REGION || 'us-east-1';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

// Transform S3 URL to CloudFront URL
function toCloudFrontUrl(url: string): string {
  if (!CLOUDFRONT_DOMAIN || !url) return url;

  // Check if it's an S3 URL for our bucket
  const s3Pattern = new RegExp(
    `https://${BUCKET_NAME}\\.s3\\.${BUCKET_REGION}\\.amazonaws\\.com/(.+)`
  );
  const match = url.match(s3Pattern);

  if (match && match[1]) {
    return `https://${CLOUDFRONT_DOMAIN}/${match[1]}`;
  }

  return url;
}

// Transform media item URLs to CloudFront
function transformMediaUrls(item: MediaItem): MediaItem {
  return {
    ...item,
    url: toCloudFrontUrl(item.url),
    thumbnailUrl: item.thumbnailUrl ? toCloudFrontUrl(item.thumbnailUrl) : item.thumbnailUrl,
  };
}

// Media usage location
export interface MediaUsage {
  pageId: string;          // Page identifier (e.g., 'home', 'about')
  pageName: string;        // Human-readable page name
  sectionId: string;       // Section identifier
  sectionName: string;     // Human-readable section name
  url: string;             // URL to the page
}

// Media item interface
export interface MediaItem {
  pk: string;              // "MEDIA#{mediaId}"
  sk: string;              // "META"
  mediaId: string;         // UUID
  name: string;            // Original filename
  originalName?: string;   // Original filename before optimization
  type: 'image' | 'video';
  mimeType: string;        // 'image/jpeg', 'video/mp4', etc.
  s3Key: string | null;    // Path in S3 (null for external videos)
  url: string;             // Public URL or external URL
  thumbnailUrl?: string;   // Thumbnail URL
  size: number;            // File size in bytes (0 for external)
  originalSize?: number;   // Original file size before optimization
  width?: number;          // Image/video width
  height?: number;         // Image/video height
  folderId: string;        // Folder ID ('root' for root level)
  externalUrl?: string;    // YouTube/Vimeo URL
  version: number;         // Cache-busting version
  // SEO & Metadata
  alt?: string;            // Alt text for accessibility
  title?: string;          // Title attribute
  caption?: string;        // Image caption
  keywords?: string[];     // SEO keywords
  description?: string;    // Longer description for SEO
  tags?: string[];         // User-defined tags for organization
  // Usage tracking
  usedIn?: MediaUsage[];   // Where this image is used
  // Timestamps
  uploadedAt: string;      // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Media folder interface
export interface MediaFolder {
  pk: string;              // "FOLDER#{folderId}"
  sk: string;              // "META"
  folderId: string;        // UUID
  name: string;            // Folder name
  parentId: string | null; // Parent folder ID (null for root)
  itemCount: number;       // Number of items in folder
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Create input types (without pk/sk)
export type CreateMediaInput = Omit<MediaItem, 'pk' | 'sk' | 'mediaId' | 'version' | 'uploadedAt' | 'updatedAt'>;
export type CreateFolderInput = Omit<MediaFolder, 'pk' | 'sk' | 'folderId' | 'itemCount' | 'createdAt' | 'updatedAt'>;

// ==================== MEDIA OPERATIONS ====================

// Create a new media item
export async function createMedia(input: CreateMediaInput): Promise<MediaItem> {
  const mediaId = uuidv4();
  const now = new Date().toISOString();

  const item: MediaItem = {
    pk: `MEDIA#${mediaId}`,
    sk: 'META',
    mediaId,
    ...input,
    version: 1,
    uploadedAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  // Update folder item count
  if (input.folderId && input.folderId !== 'root') {
    await incrementFolderCount(input.folderId, 1);
  }

  return item;
}

// Get a media item by ID
export async function getMedia(mediaId: string): Promise<MediaItem | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `MEDIA#${mediaId}`,
      sk: 'META',
    },
  }));

  const item = result.Item as MediaItem | null;
  return item ? transformMediaUrls(item) : null;
}

// Update a media item
export async function updateMedia(
  mediaId: string,
  updates: Partial<Omit<MediaItem, 'pk' | 'sk' | 'mediaId' | 'uploadedAt'>>
): Promise<MediaItem | null> {
  const existing = await getMedia(mediaId);
  if (!existing) return null;

  // Build update expression
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  // Always update updatedAt
  updates.updatedAt = new Date().toISOString();

  // Increment version if URL changed
  if (updates.url && updates.url !== existing.url) {
    updates.version = (existing.version || 1) + 1;
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  if (updateExpressions.length === 0) return existing;

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `MEDIA#${mediaId}`,
      sk: 'META',
    },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  // Update folder counts if folder changed
  if (updates.folderId && updates.folderId !== existing.folderId) {
    if (existing.folderId && existing.folderId !== 'root') {
      await incrementFolderCount(existing.folderId, -1);
    }
    if (updates.folderId !== 'root') {
      await incrementFolderCount(updates.folderId, 1);
    }
  }

  const updatedItem = result.Attributes as MediaItem;
  return transformMediaUrls(updatedItem);
}

// Delete a media item
export async function deleteMedia(mediaId: string): Promise<boolean> {
  const existing = await getMedia(mediaId);
  if (!existing) return false;

  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `MEDIA#${mediaId}`,
      sk: 'META',
    },
  }));

  // Update folder item count
  if (existing.folderId && existing.folderId !== 'root') {
    await incrementFolderCount(existing.folderId, -1);
  }

  return true;
}

// List all media items with optional filters
export async function listMedia(options?: {
  folderId?: string;
  type?: 'image' | 'video';
  limit?: number;
  lastKey?: Record<string, unknown>;
}): Promise<{ items: MediaItem[]; lastKey?: Record<string, unknown> }> {
  // Use scan since we don't have a GSI set up yet
  // In production, you'd want to add a GSI for folder queries
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(pk, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'MEDIA#',
    },
    Limit: options?.limit || 100,
    ExclusiveStartKey: options?.lastKey,
  }));

  let items = (result.Items || []) as MediaItem[];

  // Apply filters in memory (ideally use GSI in production)
  if (options?.folderId) {
    items = items.filter(item => item.folderId === options.folderId);
  }
  if (options?.type) {
    items = items.filter(item => item.type === options.type);
  }

  // Sort by uploadedAt descending (newest first)
  items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  // Transform URLs to CloudFront
  items = items.map(transformMediaUrls);

  return {
    items,
    lastKey: result.LastEvaluatedKey,
  };
}

// Search media by name or tags
export async function searchMedia(query: string): Promise<MediaItem[]> {
  const { items } = await listMedia({ limit: 500 });
  const lowerQuery = query.toLowerCase();

  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.alt?.toLowerCase().includes(lowerQuery) ||
    item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// ==================== FOLDER OPERATIONS ====================

// Create a new folder
export async function createFolder(input: CreateFolderInput): Promise<MediaFolder> {
  const folderId = uuidv4();
  const now = new Date().toISOString();

  const folder: MediaFolder = {
    pk: `FOLDER#${folderId}`,
    sk: 'META',
    folderId,
    name: input.name,
    parentId: input.parentId,
    itemCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: folder,
  }));

  return folder;
}

// Get a folder by ID
export async function getFolder(folderId: string): Promise<MediaFolder | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `FOLDER#${folderId}`,
      sk: 'META',
    },
  }));

  return result.Item as MediaFolder | null;
}

// Update a folder
export async function updateFolder(
  folderId: string,
  updates: Partial<Pick<MediaFolder, 'name' | 'parentId'>>
): Promise<MediaFolder | null> {
  const existing = await getFolder(folderId);
  if (!existing) return null;

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {
    ':updatedAt': new Date().toISOString(),
  };

  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';

  if (updates.name !== undefined) {
    updateExpressions.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = updates.name;
  }

  if (updates.parentId !== undefined) {
    updateExpressions.push('#parentId = :parentId');
    expressionAttributeNames['#parentId'] = 'parentId';
    expressionAttributeValues[':parentId'] = updates.parentId;
  }

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `FOLDER#${folderId}`,
      sk: 'META',
    },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes as MediaFolder;
}

// Delete a folder (must be empty)
export async function deleteFolder(folderId: string): Promise<boolean> {
  const folder = await getFolder(folderId);
  if (!folder) return false;

  // Check if folder has items
  const { items } = await listMedia({ folderId });
  if (items.length > 0) {
    throw new Error('Cannot delete folder with items');
  }

  // Check if folder has subfolders
  const subfolders = await listFolders(folderId);
  if (subfolders.length > 0) {
    throw new Error('Cannot delete folder with subfolders');
  }

  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `FOLDER#${folderId}`,
      sk: 'META',
    },
  }));

  return true;
}

// List folders by parent
export async function listFolders(parentId?: string | null): Promise<MediaFolder[]> {
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(pk, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'FOLDER#',
    },
  }));

  let folders = (result.Items || []) as MediaFolder[];

  // Filter by parentId
  if (parentId === undefined) {
    // List root folders (parentId is null)
    folders = folders.filter(f => f.parentId === null);
  } else if (parentId !== null) {
    folders = folders.filter(f => f.parentId === parentId);
  }

  // Sort by name
  folders.sort((a, b) => a.name.localeCompare(b.name));

  return folders;
}

// Helper: Increment folder item count
async function incrementFolderCount(folderId: string, delta: number): Promise<void> {
  try {
    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        pk: `FOLDER#${folderId}`,
        sk: 'META',
      },
      UpdateExpression: 'SET itemCount = if_not_exists(itemCount, :zero) + :delta, updatedAt = :now',
      ExpressionAttributeValues: {
        ':delta': delta,
        ':zero': 0,
        ':now': new Date().toISOString(),
      },
    }));
  } catch (error) {
    console.error('Failed to update folder count:', error);
  }
}

// ==================== UTILITY FUNCTIONS ====================

// Get media URL with version for cache-busting
export function getVersionedUrl(media: MediaItem): string {
  if (!media.url) return '';
  const separator = media.url.includes('?') ? '&' : '?';
  return `${media.url}${separator}v=${media.version}`;
}

// Get media statistics
export async function getMediaStats(): Promise<{
  totalImages: number;
  totalVideos: number;
  totalSize: number;
  folderCount: number;
}> {
  const { items } = await listMedia({ limit: 1000 });
  const folders = await listFolders();

  const images = items.filter(i => i.type === 'image');
  const videos = items.filter(i => i.type === 'video');
  const totalSize = items.reduce((sum, i) => sum + (i.size || 0), 0);

  return {
    totalImages: images.length,
    totalVideos: videos.length,
    totalSize,
    folderCount: folders.length,
  };
}

// Find media by name (for duplicate detection)
export async function findMediaByName(name: string): Promise<MediaItem | null> {
  const { items } = await listMedia({ limit: 1000 });
  // Normalize name for comparison (ignore timestamp suffixes)
  const baseName = name.replace(/-\d{13}\.(jpg|jpeg|png|gif|webp|svg)$/i, '');

  return items.find(item => {
    const itemBaseName = item.name.replace(/-\d{13}\.(jpg|jpeg|png|gif|webp|svg)$/i, '');
    return itemBaseName.toLowerCase() === baseName.toLowerCase();
  }) || null;
}

// Find media by URL (for usage tracking)
export async function findMediaByUrl(url: string): Promise<MediaItem | null> {
  const { items } = await listMedia({ limit: 1000 });
  return items.find(item => item.url === url) || null;
}

// Update media usage locations
export async function updateMediaUsage(
  mediaId: string,
  usedIn: MediaUsage[]
): Promise<MediaItem | null> {
  return updateMedia(mediaId, { usedIn });
}

// Scan all content items and build usage map for media
export async function scanMediaUsage(): Promise<Map<string, MediaUsage[]>> {
  const usageMap = new Map<string, MediaUsage[]>();

  // Scan all content items
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(pk, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'PAGE#',
    },
  }));

  const contentItems = result.Items || [];

  for (const item of contentItems) {
    // Extract page info
    const pageId = (item.pk as string).replace('PAGE#', '').replace('#content', '');
    const pagePath = item.path as string || `/${pageId}`;
    const pageName = item.title as string || pageId;

    // Scan through content for image URLs
    const contentStr = JSON.stringify(item);
    const urlMatches = contentStr.match(/https:\/\/jhr-website-images\.s3[^"'\s]+/g) || [];

    for (const url of urlMatches) {
      // Find media item by URL
      const { items: mediaItems } = await listMedia({ limit: 1000 });
      const mediaItem = mediaItems.find(m => url.includes(m.s3Key || ''));

      if (mediaItem) {
        const usage: MediaUsage = {
          pageId,
          pageName,
          sectionId: 'content',
          sectionName: 'Page Content',
          url: pagePath,
        };

        const existing = usageMap.get(mediaItem.mediaId) || [];
        // Avoid duplicates
        if (!existing.some(u => u.pageId === pageId)) {
          existing.push(usage);
          usageMap.set(mediaItem.mediaId, existing);
        }
      }
    }
  }

  return usageMap;
}

// Get usage for a specific media item
export async function getMediaUsage(mediaId: string): Promise<MediaUsage[]> {
  const media = await getMedia(mediaId);
  if (!media) return [];

  // Check stored usage first
  if (media.usedIn && media.usedIn.length > 0) {
    return media.usedIn;
  }

  // Scan content for this media's URL
  const usedIn: MediaUsage[] = [];

  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(pk, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'PAGE#',
    },
  }));

  const contentItems = result.Items || [];

  for (const item of contentItems) {
    const contentStr = JSON.stringify(item);

    // Check if this content contains the media URL or S3 key
    if (media.url && contentStr.includes(media.url)) {
      const pageId = (item.pk as string).replace('PAGE#', '').replace('#content', '');
      usedIn.push({
        pageId,
        pageName: item.title as string || pageId,
        sectionId: 'content',
        sectionName: 'Page Content',
        url: item.path as string || `/${pageId}`,
      });
    } else if (media.s3Key && contentStr.includes(media.s3Key)) {
      const pageId = (item.pk as string).replace('PAGE#', '').replace('#content', '');
      usedIn.push({
        pageId,
        pageName: item.title as string || pageId,
        sectionId: 'content',
        sectionName: 'Page Content',
        url: item.path as string || `/${pageId}`,
      });
    }
  }

  return usedIn;
}
