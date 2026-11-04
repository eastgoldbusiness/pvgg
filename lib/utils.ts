import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional CSS classes and resolves Tailwind CSS class conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number for standardized display.
 */
export function formatPhoneNumber(phone: string): string {
  return phone.trim();
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a clear "DD MMM YYYY" representation
 * (e.g. "04 Nov 2026").
 * Uses explicit integer parsing to eliminate any client/server timezone offset shifts.
 */
export function formatDisplayDate(dateStr: string): string {
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

/**
 * Returns today's date in YYYY-MM-DD string format in Indian Standard Time (Asia/Kolkata).
 * Falls back gracefully to local date if Intl timeZone is unavailable.
 */
export function getTodayString(): string {
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

/**
 * Returns the calendar day immediately following the given YYYY-MM-DD date string.
 */
export function getNextDayString(dateStr: string): string {
  if (!dateStr) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return "";
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const nextDate = new Date(year, month, day + 1);
  const y = nextDate.getFullYear();
  const m = String(nextDate.getMonth() + 1).padStart(2, "0");
  const d = String(nextDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
