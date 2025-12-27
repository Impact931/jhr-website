import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

// Content item structure
export interface ContentItem {
  pk: string;           // PAGE#<pageId>
  sk: string;           // CONTENT#<sectionId>#<contentKey>
  value: string;        // The actual content (text or JSON stringified)
  contentType: 'text' | 'html' | 'image' | 'json';
  updatedAt: string;
  updatedBy?: string;
}

// Get a single content item
export async function getContent(pageId: string, sectionId: string, contentKey: string): Promise<ContentItem | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `PAGE#${pageId}`,
      sk: `CONTENT#${sectionId}#${contentKey}`,
    },
  });

  const response = await docClient.send(command);
  return response.Item as ContentItem | null;
}

// Get all content for a page
export async function getPageContent(pageId: string): Promise<ContentItem[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': `PAGE#${pageId}`,
      ':skPrefix': 'CONTENT#',
    },
  });

  const response = await docClient.send(command);
  return (response.Items || []) as ContentItem[];
}

// Save content item
export async function saveContent(
  pageId: string,
  sectionId: string,
  contentKey: string,
  value: string,
  contentType: ContentItem['contentType'] = 'text'
): Promise<ContentItem> {
  const item: ContentItem = {
    pk: `PAGE#${pageId}`,
    sk: `CONTENT#${sectionId}#${contentKey}`,
    value,
    contentType,
    updatedAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await docClient.send(command);
  return item;
}

// Delete content item
export async function deleteContent(pageId: string, sectionId: string, contentKey: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: `PAGE#${pageId}`,
      sk: `CONTENT#${sectionId}#${contentKey}`,
    },
  });

  await docClient.send(command);
}

// Batch get content for multiple keys (useful for initial page load)
export async function getMultipleContent(
  items: Array<{ pageId: string; sectionId: string; contentKey: string }>
): Promise<Map<string, ContentItem>> {
  const results = new Map<string, ContentItem>();

  // DynamoDB BatchGetItem has a limit of 100 items, process in chunks
  for (const item of items) {
    const content = await getContent(item.pageId, item.sectionId, item.contentKey);
    if (content) {
      const key = `${item.pageId}:${item.sectionId}:${item.contentKey}`;
      results.set(key, content);
    }
  }

  return results;
}
