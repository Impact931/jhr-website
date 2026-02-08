import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
  BatchWriteCommand,
  GetCommandInput,
  PutCommandInput,
  QueryCommandInput,
  DeleteCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';

/**
 * DynamoDB configuration and helper functions for JHR Photography CMS
 * Uses AWS SDK v3 with Document Client for simplified operations
 */

// Environment configuration
const region = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';
const tableName = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

// Build explicit credentials if CUSTOM_AWS env vars are set (Amplify reserves AWS_ prefix)
const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

// Create base DynamoDB client
const dynamoClient = new DynamoDBClient({
  region,
  ...customCredentials,
});

// Create Document Client with marshalling options
export const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

/**
 * Get a single item from DynamoDB by primary key
 * @param pk - Partition key value
 * @param sk - Sort key value (optional)
 * @returns The item if found, undefined otherwise
 */
export async function getItem<T>(pk: string, sk?: string): Promise<T | undefined> {
  const key: Record<string, string> = { pk };
  if (sk) {
    key.sk = sk;
  }

  const params: GetCommandInput = {
    TableName: tableName,
    Key: key,
  };

  const response = await docClient.send(new GetCommand(params));
  return response.Item as T | undefined;
}

/**
 * Put an item into DynamoDB (create or update)
 * @param item - The item to store (must include pk and optionally sk)
 * @returns The stored item
 */
export async function putItem<T extends { pk: string; sk?: string }>(item: T): Promise<T> {
  const params: PutCommandInput = {
    TableName: tableName,
    Item: item,
  };

  await docClient.send(new PutCommand(params));
  return item;
}

/**
 * Query items by partition key with optional sort key condition
 * @param pk - Partition key value
 * @param skPrefix - Optional sort key prefix for begins_with condition
 * @returns Array of matching items
 */
export async function queryItems<T>(pk: string, skPrefix?: string): Promise<T[]> {
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: skPrefix
      ? 'pk = :pk AND begins_with(sk, :sk)'
      : 'pk = :pk',
    ExpressionAttributeValues: skPrefix
      ? { ':pk': pk, ':sk': skPrefix }
      : { ':pk': pk },
  };

  const response = await docClient.send(new QueryCommand(params));
  return (response.Items || []) as T[];
}

/**
 * Delete an item from DynamoDB by primary key
 * @param pk - Partition key value
 * @param sk - Sort key value (optional)
 * @returns true if delete was sent (does not confirm item existed)
 */
export async function deleteItem(pk: string, sk?: string): Promise<boolean> {
  const key: Record<string, string> = { pk };
  if (sk) {
    key.sk = sk;
  }

  const params: DeleteCommandInput = {
    TableName: tableName,
    Key: key,
  };

  await docClient.send(new DeleteCommand(params));
  return true;
}

/**
 * Scan items with a filter expression on the partition key prefix
 * Use sparingly — scans read the entire table. Suitable for small datasets like leads.
 * @param pkPrefix - Partition key prefix to filter by (e.g., 'LEAD#')
 * @returns Array of matching items
 */
export async function scanItemsByPkPrefix<T>(pkPrefix: string): Promise<T[]> {
  const items: T[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const params: ScanCommandInput = {
      TableName: tableName,
      FilterExpression: 'begins_with(pk, :prefix)',
      ExpressionAttributeValues: { ':prefix': pkPrefix },
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const response = await docClient.send(new ScanCommand(params));
    if (response.Items) {
      items.push(...(response.Items as T[]));
    }
    lastEvaluatedKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastEvaluatedKey);

  return items;
}

/**
 * Batch write items to DynamoDB (put or delete up to 25 items at a time)
 * Handles chunking internally for larger batches
 * @param items - Array of items to put
 * @returns Number of items written
 */
export async function batchWriteItems<T extends { pk: string; sk?: string }>(
  items: T[]
): Promise<number> {
  let written = 0;
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      })
    );
    written += batch.length;
  }
  return written;
}

/**
 * Batch delete items from DynamoDB
 * @param keys - Array of { pk, sk } key pairs to delete
 * @returns Number of items deleted
 */
export async function batchDeleteItems(
  keys: Array<{ pk: string; sk?: string }>
): Promise<number> {
  let deleted = 0;
  for (let i = 0; i < keys.length; i += 25) {
    const batch = keys.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((key) => ({
            DeleteRequest: {
              Key: key.sk ? { pk: key.pk, sk: key.sk } : { pk: key.pk },
            },
          })),
        },
      })
    );
    deleted += batch.length;
  }
  return deleted;
}

// Export table name for use in other modules
export { tableName, region };
