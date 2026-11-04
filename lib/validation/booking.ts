import { z } from "zod";
import { getTodayString } from "@/lib/utils";

/**
 * Validates international and Indian phone numbers:
 * Must have between 7 and 15 digits after stripping formatting characters.
 */
const PHONE_PATTERN = /^(\+?[0-9]{1,4}[\s-]?)?(\(?[0-9]{2,5}\)?[\s-]?)?[0-9]{3,4}[\s-]?[0-9]{3,5}$/;

/**
 * Verifies that a YYYY-MM-DD string forms a real calendar date (e.g. rejects Feb 30).
 */
function isValidCalendarDate(dateStr: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/**
 * Strict schema for Pavan Vela Grand room booking enquiry.
 * Strictly limited to the 7 required fields:
 * 1. Full Name
 * 2. Email Address
 * 3. Contact Number
 * 4. Check-in Date
 * 5. Check-out Date
 * 6. Number of Rooms
 * 7. Total Guests
 *
 * Any unexpected field is strictly rejected.
 */
export const bookingEnquirySchema = z
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

    // Validate Check-in Date
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

    // Validate Check-out Date
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

    // Cross-field Validation: Check-out must be strictly after Check-in
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

export type BookingEnquirySchemaType = z.infer<typeof bookingEnquirySchema>;
