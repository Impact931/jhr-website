import { NextRequest, NextResponse } from "next/server";
import { putItem } from "@/lib/dynamodb";
import { syncLeadToNotion } from "@/lib/notion";

interface ScheduleFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterest?: string;
  preferredDate?: string;
  preferredTime?: string;
  callType?: string;
  message?: string;
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

    const body: ScheduleFormData = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and phone are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const lead = {
      pk: `LEAD#${timestamp}`,
      sk: "schedule",
      name: sanitize(body.name),
      email: sanitize(body.email),
      phone: sanitize(body.phone),
      company: body.company ? sanitize(body.company) : undefined,
      eventType: body.serviceInterest ? sanitize(body.serviceInterest) : undefined,
      preferredDate: body.preferredDate || undefined,
      preferredTime: body.preferredTime || undefined,
      callType: body.callType || undefined,
      message: body.message ? sanitize(body.message) : undefined,
      status: "new",
      submittedAt: timestamp,
      source: "schedule-form",
    };

    await putItem(lead);

    syncLeadToNotion({ ...lead, formType: "Schedule" }).catch((err) =>
      console.error("Notion sync failed:", err)
    );

    console.log("Schedule form submission stored:", {
      pk: lead.pk,
      email: lead.email,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: "Strategy call request submitted successfully",
    });
  } catch (error) {
    console.error("Schedule form error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
