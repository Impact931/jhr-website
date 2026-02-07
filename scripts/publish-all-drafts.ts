#!/usr/bin/env npx tsx
/**
 * One-time script: Publish all existing draft page content.
 *
 * Discovers PAGE# items from DynamoDB via scan, then calls publishPageSections()
 * for each unique slug that has a sections#draft record.
 *
 * Usage:
 *   npx tsx scripts/publish-all-drafts.ts [--dry-run]
 *
 * Options:
 *   --dry-run   Show what would be published without making changes
 */

import { config } from 'dotenv';
config(); // Load .env before any AWS SDK usage

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const dryRun = process.argv.includes('--dry-run');

// --- DynamoDB client setup (mirrors lib/dynamodb.ts but standalone) ---
const region = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';
const tableName = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region, ...customCredentials }),
  {
    marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
    unmarshallOptions: { wrapNumbers: false },
  }
);

interface SectionPageContent {
  pk: string;
  sk: string;
  slug: string;
  status: string;
  sections: unknown[];
  seo: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

async function main() {
  console.log(`\n📦 Publish All Drafts`);
  console.log(`   Table:  ${tableName}`);
  console.log(`   Region: ${region}`);
  console.log(`   Mode:   ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Step 1: Scan for all PAGE# items with sk starting with "sections#draft"
  const drafts: SectionPageContent[] = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const resp = await docClient.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: 'begins_with(pk, :prefix) AND sk = :sk',
        ExpressionAttributeValues: {
          ':prefix': 'PAGE#',
          ':sk': 'sections#draft',
        },
        ExclusiveStartKey: lastKey,
      })
    );

    if (resp.Items) {
      drafts.push(...(resp.Items as SectionPageContent[]));
    }
    lastKey = resp.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  if (drafts.length === 0) {
    console.log('No draft sections found. Nothing to publish.\n');
    return;
  }

  console.log(`Found ${drafts.length} page(s) with draft sections:\n`);

  let published = 0;
  let skipped = 0;

  for (const draft of drafts) {
    const slug = draft.slug || draft.pk.replace('PAGE#', '');
    const sectionCount = draft.sections?.length ?? 0;

    // Check if published version already exists and is up to date
    const existingPublished = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { pk: draft.pk, sk: 'sections#published' },
      })
    );

    const existingItem = existingPublished.Item as SectionPageContent | undefined;
    if (existingItem && existingItem.updatedAt >= draft.updatedAt) {
      console.log(`  ⏭  ${slug} — published version is already up to date (${sectionCount} sections)`);
      skipped++;
      continue;
    }

    console.log(`  📤 ${slug} — ${sectionCount} sections, version ${draft.version}`);

    if (!dryRun) {
      const now = new Date().toISOString();
      const publishedItem: SectionPageContent = {
        ...draft,
        sk: 'sections#published',
        status: 'published',
        version: (existingItem?.version ?? 0) + 1,
        createdAt: existingItem?.createdAt || now,
        updatedAt: now,
      };

      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: publishedItem,
        })
      );
    }

    published++;
  }

  console.log(`\n✅ Done! ${published} page(s) published, ${skipped} skipped.`);
  if (dryRun) {
    console.log('   (Dry run — no changes were made)\n');
  }
}

main().catch((err) => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
