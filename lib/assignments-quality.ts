import Anthropic from '@anthropic-ai/sdk';
import type { QualityCheckResult } from './assignments-types';

const anthropic = new Anthropic();

export async function validateAssignmentData(rawData: {
  dealName?: string;
  operatorName?: string;
  operatorEmail?: string;
  clientName?: string;
  pocName?: string;
  pocPhone?: string;
  venue?: string;
  venueAddress?: string;
  showTime?: string;
  startTime?: string;
  endTime?: string;
  totalPay?: string;
  attire?: string;
  gear?: string;
  assignmentBriefing?: string;
  locationNotes?: string;
}): Promise<QualityCheckResult> {
  const warnings: string[] = [];

  // Check critical fields
  if (!rawData.operatorEmail) warnings.push('Missing operator email');
  if (!rawData.venue) warnings.push('Missing venue');
  if (!rawData.startTime) warnings.push('Missing start time');
  if (!rawData.endTime) warnings.push('Missing end time');
  if (!rawData.totalPay) warnings.push('Missing pay amount');
  if (!rawData.operatorName) warnings.push('Missing operator name');

  // Validate date logic
  if (rawData.startTime && rawData.endTime) {
    const start = new Date(rawData.startTime);
    const end = new Date(rawData.endTime);
    if (end <= start) warnings.push('End time is not after start time');
    if (start < new Date()) warnings.push('Start time is in the past');
  }
  if (rawData.showTime && rawData.startTime) {
    const show = new Date(rawData.showTime);
    const start = new Date(rawData.startTime);
    if (show > start) warnings.push('Show time is after start time');
  }

  // Use Claude to generate briefing if missing and clean up data
  let generatedBriefing = rawData.assignmentBriefing;
  try {
    if (!rawData.assignmentBriefing && rawData.dealName) {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Write a concise 2-3 sentence assignment briefing for a photography operator. Event: "${rawData.dealName}" at ${rawData.venue || 'TBD venue'}. Client: ${rawData.clientName || 'TBD'}. Times: ${rawData.startTime || 'TBD'} to ${rawData.endTime || 'TBD'}. Just the briefing text, no preamble.`,
          },
        ],
      });
      const textBlock = response.content.find((b) => b.type === 'text');
      if (textBlock && textBlock.type === 'text') {
        generatedBriefing = textBlock.text;
      }
    }
  } catch (error) {
    console.error('Claude quality check failed, continuing without AI briefing:', error);
  }

  return {
    valid: warnings.length === 0,
    warnings,
    cleaned: {
      ...(generatedBriefing ? { assignmentBriefing: generatedBriefing } : {}),
    },
  };
}
