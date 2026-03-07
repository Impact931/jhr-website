import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE = process.env.DYNAMODB_TABLE_NAME || 'jhr-website-content';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if GSC refresh token is stored in DynamoDB
    const result = await ddb.send(
      new GetItemCommand({
        TableName: TABLE,
        Key: {
          pk: { S: 'SETTINGS#gsc' },
          sk: { S: 'oauth-token' },
        },
      })
    );

    const connected = !!result.Item?.refreshToken?.S;

    return NextResponse.json({ connected });
  } catch {
    // If DynamoDB lookup fails, just report not connected
    return NextResponse.json({ connected: false });
  }
}
