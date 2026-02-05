#!/usr/bin/env npx ts-node
/**
 * Migration Script: Convert legacy blog posts to section-based format
 *
 * This script:
 * 1. Reads all BLOG#* records with sk='post' (legacy format)
 * 2. Converts each to the new section-based format
 * 3. Creates new records with sk='draft' or sk='published' based on status
 * 4. Preserves all metadata (author, tags, categories, etc.)
 * 5. Keeps old records for rollback (doesn't delete sk='post' records)
 *
 * Usage:
 *   npx ts-node scripts/migrate-blog-posts.ts [--dry-run]
 *
 * Options:
 *   --dry-run   Show what would be migrated without making changes
 */

import { config } from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import type { BlogPost, BlogPostSK } from '../types/blog';
import { migrateLegacyBlogPost, extractFeaturedImage, extractExcerpt } from '../types/blog';
import type { PageSectionContent, HeroSectionContent, TextBlockSectionContent } from '../types/inline-editor';

// Load environment variables
config({ path: '.env.local' });

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-photography-content';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Parse arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

interface LegacyBlogRecord extends BlogPost {
  pk: string;
  sk: string;
}

interface MigrationResult {
  slug: string;
  status: 'success' | 'skipped' | 'error';
  message: string;
}

/**
 * Convert HTML body to a text-block section
 */
function bodyToTextBlockSection(body: string): TextBlockSectionContent {
  return {
    id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'text-block',
    content: body,
    alignment: 'left',
    maxWidth: 'prose',
  };
}

/**
 * Create a hero section from featured image and title
 */
function createHeroSection(
  title: string,
  featuredImage?: string,
  excerpt?: string
): HeroSectionContent {
  return {
    id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'hero',
    variant: 'centered',
    title,
    subtitle: excerpt,
    backgroundImage: featuredImage,
    backgroundOverlay: 0.5,
    ctaButton: undefined,
    secondaryButton: undefined,
  };
}

/**
 * Convert a legacy blog post to section-based format
 */
function convertToSections(post: LegacyBlogRecord): PageSectionContent[] {
  const sections: PageSectionContent[] = [];

  // Create hero section with featured image
  const heroSection = createHeroSection(
    post.title,
    post.featuredImage,
    post.excerpt
  );
  sections.push(heroSection);

  // Create text-block section from body
  if (post.body && post.body.trim()) {
    const textSection = bodyToTextBlockSection(post.body);
    sections.push(textSection);
  }

  return sections;
}

/**
 * Fetch all legacy blog posts (sk='post')
 */
async function fetchLegacyPosts(): Promise<LegacyBlogRecord[]> {
  const posts: LegacyBlogRecord[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(pk, :pk) AND sk = :sk',
      ExpressionAttributeValues: {
        ':pk': 'BLOG#',
        ':sk': 'post',
      },
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);
    if (response.Items) {
      posts.push(...(response.Items as LegacyBlogRecord[]));
    }
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return posts;
}

/**
 * Check if a migrated version already exists
 */
async function checkExistingMigration(pk: string, sk: BlogPostSK): Promise<boolean> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { pk, sk },
  });

  const response = await docClient.send(command);
  return !!response.Item;
}

/**
 * Save migrated blog post
 */
async function saveMigratedPost(
  post: LegacyBlogRecord,
  sections: PageSectionContent[],
  sk: BlogPostSK
): Promise<void> {
  const now = new Date().toISOString();

  const migratedPost = {
    pk: post.pk,
    sk,
    slug: post.slug,
    title: post.title,
    sections,
    body: post.body, // Keep for backward compatibility
    featuredImage: post.featuredImage || extractFeaturedImage(sections),
    excerpt: post.excerpt || extractExcerpt(sections),
    author: post.author || 'Jayson Rivas',
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    tags: post.tags || [],
    categories: post.categories || [],
    status: post.status,
    seoMetadata: post.seoMetadata,
    structuredData: post.structuredData,
    geoMetadata: post.geoMetadata,
    seo: post.seo,
    version: 1,
    createdAt: post.createdAt || now,
    updatedAt: now,
    migratedAt: now,
    migratedFrom: 'post', // Track that this was migrated
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: migratedPost,
  });

  await docClient.send(command);
}

/**
 * Migrate a single blog post
 */
async function migratePost(post: LegacyBlogRecord): Promise<MigrationResult> {
  const slug = post.slug || post.pk.replace('BLOG#', '');

  try {
    // Determine target sk based on status
    const targetSk: BlogPostSK = post.status === 'published' ? 'published' : 'draft';

    // Check if already migrated
    const alreadyMigrated = await checkExistingMigration(post.pk, targetSk);
    if (alreadyMigrated) {
      return {
        slug,
        status: 'skipped',
        message: `Already migrated (${targetSk} exists)`,
      };
    }

    // Convert to sections
    const sections = convertToSections(post);

    if (isDryRun) {
      return {
        slug,
        status: 'success',
        message: `Would migrate to sk='${targetSk}' with ${sections.length} sections`,
      };
    }

    // Save migrated version
    await saveMigratedPost(post, sections, targetSk);

    // If published, also create a draft copy
    if (targetSk === 'published') {
      const draftExists = await checkExistingMigration(post.pk, 'draft');
      if (!draftExists) {
        await saveMigratedPost(post, sections, 'draft');
      }
    }

    return {
      slug,
      status: 'success',
      message: `Migrated to sk='${targetSk}' with ${sections.length} sections`,
    };
  } catch (error) {
    return {
      slug,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Blog Post Migration: Legacy to Section-Based Format');
  console.log('='.repeat(60));
  console.log(`Table: ${TABLE_NAME}`);
  console.log(`Region: ${AWS_REGION}`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log('='.repeat(60));
  console.log('');

  // Fetch legacy posts
  console.log('Fetching legacy blog posts (sk="post")...');
  const legacyPosts = await fetchLegacyPosts();
  console.log(`Found ${legacyPosts.length} legacy posts to migrate.`);
  console.log('');

  if (legacyPosts.length === 0) {
    console.log('No legacy posts found. Migration complete.');
    return;
  }

  // Migrate each post
  const results: MigrationResult[] = [];
  for (const post of legacyPosts) {
    const result = await migratePost(post);
    results.push(result);

    const icon = result.status === 'success' ? '✓' : result.status === 'skipped' ? '⊘' : '✗';
    console.log(`${icon} ${result.slug}: ${result.message}`);
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total posts processed: ${results.length}`);
  console.log(`  Successful: ${results.filter((r) => r.status === 'success').length}`);
  console.log(`  Skipped:    ${results.filter((r) => r.status === 'skipped').length}`);
  console.log(`  Errors:     ${results.filter((r) => r.status === 'error').length}`);

  if (isDryRun) {
    console.log('');
    console.log('This was a dry run. Run without --dry-run to apply changes.');
  }

  // Report errors
  const errors = results.filter((r) => r.status === 'error');
  if (errors.length > 0) {
    console.log('');
    console.log('Errors:');
    errors.forEach((e) => console.log(`  - ${e.slug}: ${e.message}`));
  }
}

// Run migration
main()
  .then(() => {
    console.log('');
    console.log('Migration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
