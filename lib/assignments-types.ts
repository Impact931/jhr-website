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
