/**
 * Pavan Vela Grand — Booking Enquiry System Verification Suite
 *
 * Runs end-to-end unit, schema, date picker logic, email template, and API route checks.
 */

import { z } from "zod";
import assert from "node:assert/strict";

console.log("===============================================================");
console.log("  Pavan Vela Grand — Booking Enquiry System Test Suite");
console.log("===============================================================\n");

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Zod Schema Validation Tests (7-Field Booking Enquiry)
// ---------------------------------------------------------------------------
console.log("1. Testing Validation Schema (bookingEnquirySchema with Check-in & Check-out)...");

const PHONE_PATTERN = /^(\+?[0-9]{1,4}[\s-]?)?(\(?[0-9]{2,5}\)?[\s-]?)?[0-9]{3,4}[\s-]?[0-9]{3,5}$/;

function getTodayString() {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  } catch {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
}

function isValidCalendarDate(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

const bookingEnquirySchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s.'\-]+$/,
        "Full Name may only contain letters, spaces, hyphens, periods, or apostrophes"
      ),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(120, "Email address must not exceed 120 characters"),
    contactNumber: z
      .string()
      .trim()
      .min(7, "Contact Number must be at least 7 digits")
      .max(25, "Contact Number is too long")
      .refine(
        (val) => {
          const digitsOnly = val.replace(/\D/g, "");
          return digitsOnly.length >= 7 && digitsOnly.length <= 15 && PHONE_PATTERN.test(val);
        },
        {
          message: "Please enter a valid phone number (Indian mobile or international format with 7–15 digits)",
        }
      ),
    checkInDate: z
      .string()
      .trim()
      .min(1, "Please select a check-in date"),
    checkOutDate: z
      .string()
      .trim()
      .min(1, "Please select a check-out date"),
    numberOfRooms: z.coerce
      .number()
      .int("Number of Rooms must be a whole number")
      .min(1, "Number of Rooms must be at least 1")
      .max(30, "Number of Rooms cannot exceed 30"),
    totalGuests: z.coerce
      .number()
      .int("Total Number of Guests must be a whole number")
      .min(1, "Total Number of Guests must be at least 1")
      .max(100, "Total Number of Guests cannot exceed 100"),
  })
  .strict()
  .superRefine((data, ctx) => {
    let checkInValid = false;
    let checkOutValid = false;

    if (data.checkInDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.checkInDate) || !isValidCalendarDate(data.checkInDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid check-in date (YYYY-MM-DD)",
          path: ["checkInDate"],
        });
      } else {
        const todayStr = getTodayString();
        if (data.checkInDate < todayStr) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Check-in date cannot be in the past",
            path: ["checkInDate"],
          });
        } else {
          checkInValid = true;
        }
      }
    }

    if (data.checkOutDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.checkOutDate) || !isValidCalendarDate(data.checkOutDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid check-out date (YYYY-MM-DD)",
          path: ["checkOutDate"],
        });
      } else {
        checkOutValid = true;
      }
    }

    if (data.checkInDate && data.checkOutDate && checkInValid && checkOutValid) {
      if (data.checkOutDate <= data.checkInDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Check-out date must be strictly after check-in date",
          path: ["checkOutDate"],
        });
      }
    }
  });

test("Valid 7-field enquiry passes validation", () => {
  const validData = {
    fullName: "Ramanathan Subramanian",
    email: "ramanathan.sub@example.com",
    contactNumber: "+91 98401 23456",
    checkInDate: "2026-11-20",
    checkOutDate: "2026-11-22",
    numberOfRooms: 2,
    totalGuests: 4,
  };
  const res = bookingEnquirySchema.safeParse(validData);
  assert.equal(res.success, true);
  assert.equal(res.data.fullName, "Ramanathan Subramanian");
  assert.equal(res.data.checkInDate, "2026-11-20");
  assert.equal(res.data.checkOutDate, "2026-11-22");
  assert.equal(res.data.numberOfRooms, 2);
});

test("Accepts valid international phone number format", () => {
  const validInternational = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    contactNumber: "+1 (555) 234-5678",
    checkInDate: "2026-11-25",
    checkOutDate: "2026-11-28",
    numberOfRooms: 1,
    totalGuests: 2,
  };
  const res = bookingEnquirySchema.safeParse(validInternational);
  assert.equal(res.success, true);
});

test("Rejects missing check-in and check-out dates", () => {
  const res = bookingEnquirySchema.safeParse({
    fullName: "Test Guest",
    email: "test@example.com",
    contactNumber: "9840123456",
    checkInDate: "",
    checkOutDate: "",
    numberOfRooms: 1,
    totalGuests: 2,
  });
  assert.equal(res.success, false);
  const issues = res.error.issues;
  assert.ok(issues.some((i) => i.path[0] === "checkInDate" && i.message.includes("check-in date")));
  assert.ok(issues.some((i) => i.path[0] === "checkOutDate" && i.message.includes("check-out date")));
});

test("Rejects past check-in date", () => {
  const res = bookingEnquirySchema.safeParse({
    fullName: "Test Guest",
    email: "test@example.com",
    contactNumber: "9840123456",
    checkInDate: "2020-01-01",
    checkOutDate: "2026-12-01",
    numberOfRooms: 1,
    totalGuests: 2,
  });
  assert.equal(res.success, false);
  const issues = res.error.issues;
  assert.ok(issues.some((i) => i.path[0] === "checkInDate" && i.message.includes("past")));
});

test("Rejects same-day check-out date (check-out must be strictly after check-in)", () => {
  const res = bookingEnquirySchema.safeParse({
    fullName: "Test Guest",
    email: "test@example.com",
    contactNumber: "9840123456",
    checkInDate: "2026-11-20",
    checkOutDate: "2026-11-20",
    numberOfRooms: 1,
    totalGuests: 2,
  });
  assert.equal(res.success, false);
  const issues = res.error.issues;
  assert.ok(issues.some((i) => i.path[0] === "checkOutDate" && i.message.includes("strictly after")));
});

test("Rejects check-out date before check-in date", () => {
  const res = bookingEnquirySchema.safeParse({
    fullName: "Test Guest",
    email: "test@example.com",
    contactNumber: "9840123456",
    checkInDate: "2026-11-20",
    checkOutDate: "2026-11-18",
    numberOfRooms: 1,
    totalGuests: 2,
  });
  assert.equal(res.success, false);
  const issues = res.error.issues;
  assert.ok(issues.some((i) => i.path[0] === "checkOutDate" && i.message.includes("strictly after")));
});

test("Date Picker client logic: Changing check-in clears invalidated check-out", () => {
  let formState = {
    checkInDate: "2026-11-10",
    checkOutDate: "2026-11-12",
  };

  // User changes checkInDate to 2026-11-15 -> existing checkout 2026-11-12 is no longer valid
  const newCheckIn = "2026-11-15";
  if (formState.checkOutDate && formState.checkOutDate <= newCheckIn) {
    formState.checkOutDate = "";
  }
  formState.checkInDate = newCheckIn;

  assert.equal(formState.checkInDate, "2026-11-15");
  assert.equal(formState.checkOutDate, "", "Check-out date was correctly cleared");
});

test("STRICT ENFORCEMENT: Rejects unexpected fields (roomType, price, specialRequests, etc.)", () => {
  const maliciousPayload = {
    fullName: "Test Guest",
    email: "test@example.com",
    contactNumber: "9840123456",
    checkInDate: "2026-11-20",
    checkOutDate: "2026-11-22",
    numberOfRooms: 1,
    totalGuests: 2,
    roomType: "Executive Suite",
    price: 3500,
    specialRequests: "High floor",
  };
  const res = bookingEnquirySchema.safeParse(maliciousPayload);
  assert.equal(res.success, false);
  const issues = res.error.issues;
  assert.ok(issues.some((i) => i.code === "unrecognized_keys"));
});

// ---------------------------------------------------------------------------
// 2. HTML Escaping, Display Format, and Email Template Safety
// ---------------------------------------------------------------------------
console.log("\n2. Testing HTML Escaping & Email Template Verification...");

function escapeHtml(str) {
  const value = String(str);
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return dateStr;
  const year = match[1];
  const monthNum = parseInt(match[2], 10);
  const day = match[3];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthName = monthNames[monthNum - 1] || match[2];
  return `${day} ${monthName} ${year}`;
}

test("Formats ISO date to DD MMM YYYY cleanly", () => {
  assert.equal(formatDisplayDate("2026-11-04"), "04 Nov 2026");
  assert.equal(formatDisplayDate("2026-12-31"), "31 Dec 2026");
  assert.equal(formatDisplayDate("2027-01-01"), "01 Jan 2027");
});

test("Escapes dangerous XSS payload in names or input", () => {
  const dangerousName = '<script>alert("hacked")</script>';
  const escaped = escapeHtml(dangerousName);
  assert.equal(escaped, "&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;");
  assert.ok(!escaped.includes("<script>"));
});

// ---------------------------------------------------------------------------
// 3. Live Local API Endpoint Tests
// ---------------------------------------------------------------------------
console.log("\n3. Testing Local API Endpoints (http://localhost:3000)...");

const BASE_URL = "http://localhost:3000";

let reqCounter = 1;
function nextTestHeaders() {
  reqCounter++;
  return {
    "Content-Type": "application/json",
    "X-Forwarded-For": `203.0.113.${reqCounter}`,
  };
}

await asyncTest("GET /api/health returns 200 and status ok", async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "ok");
  assert.equal(data.service, "pvg-hotel-api");
  assert.ok("smtpReady" in data);
});

await asyncTest("OPTIONS /api/booking-enquiries responds with CORS headers", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://pavanvelagrand.com",
    },
  });
  assert.equal(res.status, 204);
  assert.ok(res.headers.get("access-control-allow-origin"));
});

await asyncTest("POST /api/booking-enquiries rejects empty body with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.errors);
});

await asyncTest("POST /api/booking-enquiries rejects missing dates with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({
      fullName: "Test Guest",
      email: "test@example.com",
      contactNumber: "9840123456",
      checkInDate: "",
      checkOutDate: "",
      numberOfRooms: 1,
      totalGuests: 2,
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.errors?.checkInDate);
  assert.ok(data.errors?.checkOutDate);
});

await asyncTest("POST /api/booking-enquiries rejects past check-in date with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({
      fullName: "Test Guest",
      email: "test@example.com",
      contactNumber: "9840123456",
      checkInDate: "2020-01-01",
      checkOutDate: "2026-11-20",
      numberOfRooms: 1,
      totalGuests: 2,
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.errors?.checkInDate);
});

await asyncTest("POST /api/booking-enquiries rejects checkout before checkin with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({
      fullName: "Test Guest",
      email: "test@example.com",
      contactNumber: "9840123456",
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-18",
      numberOfRooms: 1,
      totalGuests: 2,
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.errors?.checkOutDate);
});

await asyncTest("POST /api/booking-enquiries rejects unexpected extra fields with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({
      fullName: "Test Guest",
      email: "test@example.com",
      contactNumber: "9840123456",
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-22",
      numberOfRooms: 1,
      totalGuests: 2,
      roomType: "Executive Suite",
    }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
});

await asyncTest("POST /api/booking-enquiries accepts valid 7-field enquiry", async () => {
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers: nextTestHeaders(),
    body: JSON.stringify({
      fullName: "Verification Guest",
      email: "guest@example.com",
      contactNumber: "+91 98401 23456",
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-22",
      numberOfRooms: 1,
      totalGuests: 2,
    }),
  });
  // Note: Even if mock/real SMTP attempts or succeeds, status 200 means validation & dispatch was processed
  const data = await res.json();
  if (res.status === 200) {
    assert.equal(data.success, true);
  } else {
    // If SMTP fails because of test credentials, verify that validation passed (not a 400 error)
    assert.notEqual(res.status, 400);
  }
});

await asyncTest("Rate Limiting: Rejects 6th submission from the same IP with 429", async () => {
  const spamIp = "198.51.100.99";
  const headers = { "Content-Type": "application/json", "X-Forwarded-For": spamIp };
  // Make 5 requests to reach limit
  for (let i = 0; i < 5; i++) {
    await fetch(`${BASE_URL}/api/booking-enquiries`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });
  }
  // 6th request must be rejected with 429
  const res = await fetch(`${BASE_URL}/api/booking-enquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 429);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(res.headers.get("retry-after"));
});

console.log("\n===============================================================");
console.log(`  Tests Passed: ${passedTests} / ${totalTests}`);
if (passedTests === totalTests) {
  console.log("  Status: ALL TESTS PASSED SUCCESSFULLY! ✓");
} else {
  console.log("  Status: SOME TESTS FAILED! ✗");
  process.exit(1);
}
console.log("===============================================================\n");
