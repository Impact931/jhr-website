import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { putItem } from "@/lib/dynamodb";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildNotionProperties(data: InquiryFormData): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: Record<string, any> = {
    // Title field — "Lead Name"
    "Lead Name": {
      title: [{ text: { content: data.name } }],
    },
    // Rich text fields
    Account: {
      rich_text: [{ text: { content: data.company } }],
    },
    "Client/Event Name": {
      rich_text: [{ text: { content: data.clientEventName } }],
    },
    "Event Description": {
      rich_text: [{ text: { content: data.eventDescription.slice(0, 2000) } }],
    },
    "Location/Venue": {
      rich_text: [{ text: { content: data.locationVenue } }],
    },
    // Email & phone
    Email: { email: data.email },
    "Phone (Cell)": { phone_number: data.phone },
    // URL
    Website: { url: data.website },
    // Checkbox
    "Multi-Day Event": { checkbox: data.multiDay },
    // Date — supports range for multi-day
    "Event Dates": {
      date: {
        start: data.eventDate,
        ...(data.multiDay && data.eventDateEnd
          ? { end: data.eventDateEnd }
          : {}),
      },
    },
    // Number
    "Number of Attendees": { number: parseInt(data.attendees, 10) || 0 },
    // Multi-select fields
    "Services Requsted": {
      multi_select: data.services.map((s) => ({ name: s })),
    },
    Referral: {
      multi_select: data.referral.map((r) => ({ name: r })),
    },
  };

  // Optional fields
  if (data.positionTitle) {
    props["Position/Title"] = {
      rich_text: [{ text: { content: data.positionTitle } }],
    };
  }
  if (data.mediaUse && data.mediaUse.length > 0) {
    props["Media Use"] = {
      multi_select: data.mediaUse.map((m) => ({ name: m })),
    };
  }
  if (data.industry) {
    props["Industry"] = { select: { name: data.industry } };
  }
  if (data.industryOther) {
    props["If other - What industry?"] = {
      rich_text: [{ text: { content: data.industryOther } }],
    };
  }
  if (data.goals) {
    props["Goals"] = {
      rich_text: [{ text: { content: data.goals.slice(0, 2000) } }],
    };
  }
  if (data.budget && data.budget.length > 0) {
    props["Budget"] = {
      multi_select: data.budget.map((b) => ({ name: b })),
    };
  }
  if (data.videoServices && data.videoServices.length > 0) {
    props["Video Services"] = {
      multi_select: data.videoServices.map((v) => ({ name: v })),
    };
  }
  if (data.additionalInfo) {
    props["Is there any additional information..."] = {
      rich_text: [
        { text: { content: data.additionalInfo.slice(0, 2000) } },
      ],
    };
  }

  return props;
}

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
    const notionToken = process.env.NOTION_TOKEN;
    const notionDbId = process.env.NOTION_LEADS_DB_ID || process.env.NOTION_LEAD_DB_ID;

    if (notionToken && notionDbId) {
      const notion = new Client({ auth: notionToken });
      notion.pages
        .create({
          parent: { database_id: notionDbId },
          properties: buildNotionProperties(body),
        })
        .catch((err) => console.error("Notion sync failed:", err));
    }

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
