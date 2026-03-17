import Anthropic from '@anthropic-ai/sdk';
import type { QualityCheckResult, ScheduleEntry, ShotListEntry } from './assignments-types';

const anthropic = new Anthropic();

interface AssignmentRawData {
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
  pageContent?: string;
}

interface AIBriefingResult {
  assignmentBriefing: string;
  schedule: ScheduleEntry[];
  shotList: ShotListEntry[];
  parkingInfo: string;
  mapsAndReferences: string;
  otherInfo: string;
}

export async function validateAssignmentData(rawData: AssignmentRawData): Promise<QualityCheckResult> {
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

  // Use Claude as dispatcher/PM to process page content into structured assignment
  let aiResult: AIBriefingResult | null = null;
  try {
    if (rawData.pageContent) {
      aiResult = await generateDispatcherBriefing(rawData);
    } else if (!rawData.assignmentBriefing && rawData.dealName) {
      // Fallback: generate basic briefing from properties only
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
        aiResult = {
          assignmentBriefing: textBlock.text,
          schedule: [],
          shotList: [],
          parkingInfo: '',
          mapsAndReferences: '',
          otherInfo: '',
        };
      }
    }
  } catch (error) {
    console.error('Claude quality check failed, continuing without AI briefing:', error);
  }

  return {
    valid: warnings.length === 0,
    warnings,
    cleaned: {
      ...(aiResult?.assignmentBriefing ? { assignmentBriefing: aiResult.assignmentBriefing } : {}),
      ...(aiResult?.schedule?.length ? { schedule: aiResult.schedule } : {}),
      ...(aiResult?.shotList?.length ? { shotList: aiResult.shotList } : {}),
      ...(aiResult?.parkingInfo ? { parkingInfo: aiResult.parkingInfo } : {}),
      ...(aiResult?.mapsAndReferences ? { mapsAndReferences: aiResult.mapsAndReferences } : {}),
      ...(aiResult?.otherInfo ? { otherInfo: aiResult.otherInfo } : {}),
    },
  };
}

/**
 * Process the full assignment page content like a Dispatcher / Project Manager.
 * Extracts structured schedule, shot list, parking, and produces a clear briefing.
 */
async function generateDispatcherBriefing(rawData: AssignmentRawData): Promise<AIBriefingResult> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are the JHR Photography Dispatcher — a project manager who prepares clear, complete assignment briefs for field operators (photographers/videographers).

You have the following data from a Notion Assignment page. Your job is to extract and organize ALL operator-relevant details into a structured format that is easy for the operator to follow and for management to track.

--- ASSIGNMENT PROPERTIES ---
Event: ${rawData.dealName || 'Unknown'}
Client: ${rawData.clientName || 'Unknown'}
Operator: ${rawData.operatorName || 'Unknown'}
Venue: ${rawData.venue || 'TBD'}
Address: ${rawData.venueAddress || 'TBD'}
Attire: ${rawData.attire || 'TBD'}
Gear: ${rawData.gear || 'TBD'}
POC: ${rawData.pocName || 'TBD'} ${rawData.pocPhone ? '| ' + rawData.pocPhone : ''}

--- ASSIGNMENT PAGE CONTENT ---
${rawData.pageContent}

--- INSTRUCTIONS ---

Return a JSON object with these exact fields:

{
  "assignmentBriefing": "A 2-4 sentence overview written to the operator in second person. What is this event, what are they doing, what does success look like. Be direct and professional. Do NOT include pay, rates, or pricing.",

  "schedule": [
    {
      "assignment": "Name of the specific assignment/shift",
      "date": "Full date as written (e.g. April 14, 2026)",
      "showTime": "Show time / arrival time (e.g. 6:10 PM). This is when the operator must physically arrive — minimum 20 minutes before start time. If not explicitly listed, calculate it as 20 minutes before startTime.",
      "startTime": "Start time of the event/activity (e.g. 6:30 PM)",
      "endTime": "End time (e.g. 9:30 PM)",
      "rate": "Rate type if listed (e.g. Half-Day, Full-Day) — omit dollar amounts",
      "attire": "Attire for this specific day if listed",
      "gear": "Gear for this specific day if listed",
      "location": "Location/venue if different from main venue"
    }
  ],

  "shotList": [
    {
      "heading": "Section heading as written (e.g. April 14, 2026 - Off-Site Reception @ Nashville Underground)",
      "details": "Time range and operator info (e.g. 6:30 PM - 9:30 PM (Hannah Half Day))",
      "items": ["Specific shot items if any are listed under this heading"]
    }
  ],

  "parkingInfo": "Exact parking instructions as written on the page. If none, empty string.",

  "mapsAndReferences": "Any Google Maps links, reference URLs, or location links. Preserve URLs exactly. If none, empty string.",

  "otherInfo": "Any additional instructions, notes, or callouts not covered above. If none, empty string."
}

CRITICAL RULES:
- Extract EVERY schedule row from the Multi-Day Schedule table. Do not skip empty rows.
- Preserve exact dates, times, and locations — never paraphrase or approximate.
- If a field is empty or not present in the content, use empty string or empty array.
- Do NOT include dollar amounts or pricing in any field.
- Return ONLY valid JSON, no markdown wrapping.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    return { assignmentBriefing: '', schedule: [], shotList: [], parkingInfo: '', mapsAndReferences: '', otherInfo: '' };
  }

  try {
    // Strip markdown code fences if present
    const cleaned = textBlock.text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      assignmentBriefing: parsed.assignmentBriefing || '',
      schedule: Array.isArray(parsed.schedule) ? parsed.schedule : [],
      shotList: Array.isArray(parsed.shotList) ? parsed.shotList : [],
      parkingInfo: parsed.parkingInfo || '',
      mapsAndReferences: parsed.mapsAndReferences || '',
      otherInfo: parsed.otherInfo || '',
    };
  } catch (error) {
    console.error('Failed to parse AI briefing JSON:', error);
    return { assignmentBriefing: textBlock.text, schedule: [], shotList: [], parkingInfo: '', mapsAndReferences: '', otherInfo: '' };
  }
}
