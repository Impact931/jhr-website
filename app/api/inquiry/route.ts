import { NextRequest, NextResponse } from "next/server";
import { putItem } from "@/lib/dynamodb";
import { syncLeadToNotion } from "@/lib/notion";

interface InquiryFormData {
  name: string;
  company: string;
  clientEventName: string;
  positionTitle?: string;
  email: string;
  phone: string;
  website: string;
  eventDescription: string;
  multiDay: boolean;
  eventDate: string;
  eventDateEnd?: string;
  locationVenue: string;
  services: string[];
  attendees: string;
  mediaUse?: string[];
  industry?: string;
  industryOther?: string;
  goals?: string;
  budget?: string[];
  videoServices?: string[];
  additionalInfo?: string;
  referral: string[];
}

// In-memory rate limit store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function sanitize(value: string): string {
  return value.trim().slice(0, 2000);
}

// Notion sync is now handled by syncLeadToNotion() in lib/notion.ts

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body: InquiryFormData = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.company ||
      !body.clientEventName ||
      !body.email ||
      !body.phone ||
      !body.website ||
      !body.eventDescription ||
      !body.eventDate ||
      !body.locationVenue ||
      !body.services?.length ||
      !body.attendees ||
      !body.referral?.length
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Sanitize text fields
    body.name = sanitize(body.name);
    body.company = sanitize(body.company);
    body.clientEventName = sanitize(body.clientEventName);
    body.email = sanitize(body.email);
    body.phone = sanitize(body.phone);
    body.locationVenue = sanitize(body.locationVenue);

    // Store in DynamoDB
    const timestamp = new Date().toISOString();
    const dynamoRecord = {
      pk: `LEAD#${timestamp}`,
      sk: "inquiry",
      ...body,
      status: "new",
      submittedAt: timestamp,
      source: "inquiry-form",
    };
    await putItem(dynamoRecord);

    // Sync to Notion (fire-and-forget)
    syncLeadToNotion({
      ...body,
      status: "new",
      submittedAt: timestamp,
      source: "inquiry-form",
    }).catch((err) => console.error("Notion sync failed:", err));

    console.log("Inquiry form submission stored:", {
      pk: dynamoRecord.pk,
      email: body.email,
      services: body.services,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Inquiry form error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
