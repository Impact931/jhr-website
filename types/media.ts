/**
 * Media Library Type Definitions
 * Sprint 6: Full media management system for JHR Photography
 */

// ─── Enums & Constants ───────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'document';
export type MediaStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type MediaSource = 'upload' | 'embed';
export type VideoProvider = 'youtube' | 'vimeo' | 'self-hosted';
export type ImageVariant = 'original' | 'full' | 'medium' | 'thumbnail';

export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, suffix: 'thumbnail' },
  medium: { width: 800, suffix: 'medium' },
  full: { width: 0, suffix: 'full' }, // 0 = original width, convert to WebP
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
] as const;

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
] as const;

export const MAX_IMAGE_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_DOCUMENT_SIZE_MB = 100;

// ─── Core Media Item ─────────────────────────────────────────────────

export interface MediaVariants {
  original?: string;    // S3 key for original
  full?: string;        // S3 key for full-res WebP
  medium?: string;      // S3 key for 800px WebP
  thumbnail?: string;   // S3 key for 300px WebP
}

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface MediaExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  dateTaken?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface MediaAIMetadata {
  altText?: string;
  description?: string;
  tags?: string[];
  seoText?: string;
  generatedAt?: string;
  model?: string;
}

export interface VideoEmbed {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
  title?: string;
  duration?: number;
}

export interface MediaItem {
  // DynamoDB keys
  pk: string;           // MEDIA#{mediaId}
  sk: string;           // metadata

  // Identity
  mediaId: string;
  filename: string;
  mimeType: string;
  mediaType: MediaType;
  status: MediaStatus;
  source: MediaSource;

  // Storage
  s3Key: string;        // Primary S3 key (original for uploads)
  variants: MediaVariants;
  fileSize: number;     // bytes
  contentHash?: string; // SHA-256 for dedup

  // Visual
  dimensions?: MediaDimensions;
  dominantColor?: string;

  // Metadata
  title?: string;
  alt?: string;
  caption?: string;
  tags: string[];
  collectionId?: string;

  // AI
  aiMetadata?: MediaAIMetadata;

  // EXIF
  exifData?: MediaExifData;

  // Video
  videoEmbed?: VideoEmbed;

  // URLs (computed, may be CloudFront)
  publicUrl: string;
  thumbnailUrl?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// ─── Collections / Folders ───────────────────────────────────────────

export interface MediaCollection {
  pk: string;           // MEDIACOL#{id}
  sk: string;           // metadata

  collectionId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;    // For nested folders
  coverMediaId?: string;
  mediaCount: number;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// ─── Tag Index ───────────────────────────────────────────────────────

export interface MediaTagIndex {
  pk: string;           // MEDIATAG#{tag}
  sk: string;           // MEDIA#{mediaId}

  tag: string;
  mediaId: string;
  mediaType: MediaType;
  thumbnailUrl?: string;
  createdAt: string;
}

// ─── Usage Tracking ──────────────────────────────────────────────────

export interface MediaUsage {
  pk: string;           // MEDIA#{mediaId}
  sk: string;           // usage#{page}#{section}

  mediaId: string;
  page: string;
  section: string;
  contentKey?: string;
  lastScanned: string;
}

// ─── Stats ───────────────────────────────────────────────────────────

export interface MediaStats {
  pk: string;           // MEDIA_STATS
  sk: string;           // global

  totalCount: number;
  totalSize: number;    // bytes
  imageCount: number;
  videoCount: number;
  imageSize: number;
  videoSize: number;
  documentCount: number;
  documentSize: number;

  updatedAt: string;
}

// ─── API Request/Response Types ──────────────────────────────────────

export interface MediaUploadRequest {
  filename: string;
  contentType: string;
  fileSize: number;
  contentHash?: string; // Client-side SHA-256 for dedup
  collectionId?: string; // Upload directly into a folder
}

export interface MediaUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  s3Key: string;
  mediaId: string;
}

export interface MediaUploadCompleteRequest {
  mediaId: string;
  fileSize?: number;
}

export interface MediaListParams {
  cursor?: string;
  limit?: number;
  mediaType?: MediaType;
  collectionId?: string;
  tag?: string;
  search?: string;
  sortBy?: 'createdAt' | 'filename' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
}

export interface MediaListResponse {
  items: MediaItem[];
  cursor?: string;
  total?: number;
}

export interface MediaUpdateRequest {
  title?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  collectionId?: string;
}

export interface MediaBulkAction {
  action: 'tag' | 'move' | 'delete';
  mediaIds: string[];
  tags?: string[];       // For 'tag' action
  collectionId?: string; // For 'move' action
}

export interface MediaBulkResponse {
  success: number;
  failed: number;
  errors?: Array<{ mediaId: string; error: string }>;
}

export interface DuplicateCheckRequest {
  contentHash: string;
}

export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  existingMedia?: MediaItem;
}

export interface VideoEmbedRequest {
  url: string;
}

export interface VideoEmbedResponse {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
  title?: string;
}

export interface AIMetadataRequest {
  mediaId: string;
  imageUrl: string;
}

export interface AIMetadataResponse {
  altText: string;
  description: string;
  tags: string[];
  seoText: string;
}

// ─── UI State Types ──────────────────────────────────────────────────

export interface MediaSelectionState {
  selectedIds: Set<string>;
  lastSelectedId?: string;
}

export interface MediaFilterState {
  mediaType?: MediaType;
  collectionId?: string;
  tags: string[];
  search: string;
  sortBy: 'createdAt' | 'filename' | 'fileSize';
  sortOrder: 'asc' | 'desc';
}

export interface MediaPickerOptions {
  allowedTypes?: MediaType[];
  multiple?: boolean;
  maxSelections?: number;
}

export interface MediaPickerResult {
  mediaId: string;
  publicUrl: string;
  alt?: string;
  thumbnailUrl?: string;
  dimensions?: MediaDimensions;
  mediaType?: MediaType;
}
