import { NextResponse } from "next/server";
import { bookingEnquirySchema } from "@/lib/validation/booking";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { sendBookingEnquiryEmail } from "@/lib/email/smtp";

export const dynamic = "force-dynamic";

/**
 * Resolves allowed CORS origin based on environment configuration.
 */
function getCorsHeaders(req: Request): Record<string, string> {
  const requestOrigin = req.headers.get("origin") || "";
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || "")
    .split(",")
    .map((o) => o.trim().toLowerCase())
    .filter(Boolean);

  let allowOrigin = "";
  if (requestOrigin && (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin.toLowerCase()))) {
    allowOrigin = requestOrigin;
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

/**
 * POST /api/booking-enquiries
 *
 * Receives and processes a room booking enquiry:
 * 1. Validates request body size.
 * 2. Applies client IP rate limiting.
 * 3. Enforces strict 7-field schema validation via Zod.
 * 4. Sends email to admin via SMTP.
 * 5. Returns consistent, sanitized JSON responses.
 */
export async function POST(req: Request) {
  const corsHeaders = getCorsHeaders(req);

  // 1. Guard against oversized payloads (limit: 16 KB)
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > 16 * 1024) {
    return NextResponse.json(
      { success: false, message: "Request payload too large." },
      { status: 413, headers: corsHeaders }
    );
  }

  // 2. Client IP rate limiting (max 5 submissions per 10 minutes)
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    console.warn(`[Rate Limit] Excessive booking enquiries from IP: ${clientIp}`);
    return NextResponse.json(
      {
        success: false,
        message: "Too many enquiries submitted. Please wait a few minutes before trying again.",
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(rateLimit.retryAfterSeconds || 60),
        },
      }
    );
  }

  // 3. Parse JSON safely
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON in request body." },
      { status: 400, headers: corsHeaders }
    );
  }

  // 4. Validate strictly against the 7-field schema
  const parseResult = bookingEnquirySchema.safeParse(rawBody);

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const fieldName = issue.path[0];
      if (typeof fieldName === "string" && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Please check the information entered in the form.",
        errors: fieldErrors,
      },
      { status: 400, headers: corsHeaders }
    );
  }

  const payload = parseResult.data;

  // 5. Send notification email to administrator via SMTP
  try {
    await sendBookingEnquiryEmail(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Booking enquiry submitted successfully.",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    // Log technical error securely without revealing SMTP credentials or secrets
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[API Error] Booking enquiry failed for ${payload.email}:`, errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: "We couldn't submit your enquiry right now. Please try again in a moment.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
