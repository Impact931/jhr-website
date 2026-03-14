import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Assignment } from './assignments-types';

const region = process.env.AWS_REGION || process.env.CUSTOM_AWS_REGION || 'us-east-1';
const tableName = process.env.ASSIGNMENTS_TABLE_NAME || 'jhr-assignments';

const customCredentials =
  process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {};

const dynamoClient = new DynamoDBClient({ region, ...customCredentials });

const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
  unmarshallOptions: { wrapNumbers: false },
});

export async function getAssignment(id: string): Promise<Assignment | undefined> {
  const response = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: `ASSIGNMENT#${id}`, sk: 'meta' },
    })
  );
  return response.Item as Assignment | undefined;
}

export async function putAssignment(assignment: Assignment): Promise<Assignment> {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: assignment,
      ConditionExpression: 'attribute_not_exists(pk)',
    })
  );
  return assignment;
}

export async function updateAssignmentStatus(
  id: string,
  status: 'accepted' | 'declined',
  updates: { respondedAt: string; declineReason?: string }
): Promise<boolean> {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { pk: `ASSIGNMENT#${id}`, sk: 'meta' },
        UpdateExpression:
          'SET #status = :status, respondedAt = :respondedAt, responseAction = :action' +
          (updates.declineReason ? ', declineReason = :reason' : ''),
        ConditionExpression: '#status = :pending',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':status': status,
          ':pending': 'pending',
          ':respondedAt': updates.respondedAt,
          ':action': status === 'accepted' ? 'accept' : 'decline',
          ...(updates.declineReason ? { ':reason': updates.declineReason } : {}),
        },
      })
    );
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ConditionalCheckFailedException') {
      return false;
    }
    throw error;
  }
}

export async function getAssignmentByNotionPageId(
  notionPageId: string
): Promise<Assignment | undefined> {
  const response = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: 'notionPageId-index',
      KeyConditionExpression: 'notionPageId = :npid',
      ExpressionAttributeValues: { ':npid': notionPageId },
      Limit: 1,
    })
  );
  return response.Items?.[0] as Assignment | undefined;
}
