export interface ScheduleEntry {
  assignment: string;      // e.g. "AIAC Day 2 (PM)"
  date: string;            // e.g. "April 14, 2026"
  showTime: string;        // e.g. "6:10 PM" — when operator must arrive (min 20 min before start)
  startTime: string;       // e.g. "6:30 PM"
  endTime: string;         // e.g. "9:30 PM"
  rate?: string;           // e.g. "Half-Day"
  attire?: string;         // e.g. "Business Casual"
  gear?: string;           // e.g. "Event Kit"
  location?: string;       // venue/location if different per day
}

export interface ShotListEntry {
  heading: string;         // e.g. "April 14, 2026 - Off-Site Reception @ Nashville Underground"
  details: string;         // e.g. "6:30 PM - 9:30 PM (Hannah Half Day)"
  items?: string[];        // specific shot items if listed
}

export interface Assignment {
  pk: string;              // ASSIGNMENT#{uuid}
  sk: string;              // "meta"
  id: string;              // UUID
  notionPageId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  dealName: string;
  operatorName: string;
  operatorEmail: string;
  clientName: string;
  pocName?: string;
  pocPhone?: string;
  pocEmail?: string;
  venue: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  showTime: string;        // ISO 8601
  startTime: string;
  endTime: string;
  totalPay: string;
  attire?: string;
  gear?: string;
  assignmentBriefing?: string;
  locationNotes?: string;
  // Structured page content
  schedule?: ScheduleEntry[];
  shotList?: ShotListEntry[];
  parkingInfo?: string;
  mapsAndReferences?: string;
  otherInfo?: string;
  pageContentRaw?: string; // full parsed page content for AI processing
  assignmentUrl: string;
  respondedAt?: string;
  responseAction?: 'accept' | 'decline';
  declineReason?: string;
  qualityWarnings?: string[];
  createdAt: string;
  ttl: number;             // Unix epoch for DynamoDB TTL
}

export interface AssignmentResponse {
  action: 'accept' | 'decline';
  declineReason?: string;
}

export interface QualityCheckResult {
  valid: boolean;
  warnings: string[];
  cleaned: Partial<Assignment>;
}
