import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

const client = new DynamoDBClient({
  region: process.env.CUSTOM_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  ...(process.env.CUSTOM_AWS_ACCESS_KEY_ID
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY || '',
        },
      }
    : {}),
});
const docClient = DynamoDBDocumentClient.from(client);

export interface SOWLogStep {
  name: string;
  detail?: string;
  error?: boolean;
  stack?: string;
  at: string;
}

export interface SOWLogEntry {
  timestamp: string;
  notionPageId?: string;
  title?: string;
  driveUrl?: string;
  success: boolean;
  steps: SOWLogStep[];
}

/**
 * Save a SOW pipeline log entry to DynamoDB.
 */
export async function saveSOWLog(log: SOWLogEntry): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: 'SOW#logs',
          sk: log.timestamp,
          ...log,
          // TTL: 30 days
          ttl: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        },
      })
    );
  } catch (err) {
    console.error('Failed to save SOW log:', err);
  }
}

/**
 * Retrieve recent SOW pipeline logs.
 */
export async function getSOWLogs(limit = 20): Promise<SOWLogEntry[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': 'SOW#logs' },
        ScanIndexForward: false, // newest first
        Limit: limit,
      })
    );
    return (result.Items || []) as SOWLogEntry[];
  } catch (err) {
    console.error('Failed to fetch SOW logs:', err);
    return [];
  }
}
