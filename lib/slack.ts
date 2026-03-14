const webhookUrl = process.env.SLACK_OPS_WEBHOOK_URL;

export async function sendSlackNotification({
  text,
  blocks,
}: {
  text: string;
  blocks?: Array<Record<string, unknown>>;
}): Promise<boolean> {
  if (!webhookUrl) {
    console.warn('SLACK_OPS_WEBHOOK_URL not configured, skipping Slack notification');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
    });
    return response.ok;
  } catch (error) {
    console.error('Slack webhook failed:', error);
    return false;
  }
}
