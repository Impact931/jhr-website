import { NextRequest, NextResponse } from "next/server";
import { putItem } from "@/lib/dynamodb";
import { syncLeadToNotion } from "@/lib/notion";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  eventType?: string;
  venue?: string;
  eventDate?: string;
  message: string;
}

interface LeadRecord {
  pk: string;
  sk: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  eventType?: string;
  venue?: string;
  eventDate?: string;
  message: string;
  status: string;
  submittedAt: string;
  source: string;
}

// In-memory rate limit store (resets on server restart — sufficient for basic spam prevention)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 submissions per minute per IP

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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
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

    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Store in DynamoDB
    const timestamp = new Date().toISOString();
    const lead: LeadRecord = {
      pk: `LEAD#${timestamp}`,
      sk: "contact",
      firstName: sanitize(body.firstName),
      lastName: sanitize(body.lastName),
      email: sanitize(body.email),
      phone: body.phone ? sanitize(body.phone) : undefined,
      company: body.company ? sanitize(body.company) : undefined,
      eventType: body.eventType ? sanitize(body.eventType) : undefined,
      venue: body.venue ? sanitize(body.venue) : undefined,
      eventDate: body.eventDate ? sanitize(body.eventDate) : undefined,
      message: sanitize(body.message),
      status: "new",
      submittedAt: timestamp,
      source: "contact-form",
    };

    await putItem(lead);

    // Fire-and-forget sync to Notion (does not block response)
    syncLeadToNotion(lead).catch((err) =>
      console.error("Notion sync failed:", err)
    );

    console.log("Contact form submission stored:", {
      pk: lead.pk,
      email: lead.email,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
