import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import type { BookingEnquiryPayload, SmtpConfig } from "@/types/booking";
import { formatDisplayDate } from "@/lib/utils";

/**
 * Escapes HTML characters to prevent HTML/XSS injection in rendered emails.
 */
export function escapeHtml(str: string | number): string {
  const value = String(str);
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Reads and validates server-side SMTP configuration from process.env.
 */
export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailFrom = process.env.MAIL_FROM;

  if (!host || !user || !pass || !adminEmail || !mailFrom) {
    return null;
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    adminEmail,
    mailFrom,
  };
}

let cachedTransporter: Transporter | null = null;

/**
 * Creates or retrieves a cached Nodemailer SMTP transporter.
 */
export function getEmailTransporter(config: SmtpConfig): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Keep connection alive for multiple requests, with timeout protections
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return cachedTransporter;
}

/**
 * Formats enquiry timestamp in human-readable Indian Standard Time and UTC.
 */
function formatTimestamp(date: Date = new Date()): { ist: string; utc: string } {
  const istFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  return {
    ist: istFormatter.format(date) + " IST",
    utc: date.toISOString(),
  };
}

/**
 * Generates the clean, professional HTML email template for booking enquiries.
 */
export function generateBookingEmailHtml(data: BookingEnquiryPayload, timestamp: { ist: string; utc: string }): string {
  const safeName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.contactNumber);
  const safeCheckIn = escapeHtml(formatDisplayDate(data.checkInDate));
  const safeCheckOut = escapeHtml(formatDisplayDate(data.checkOutDate));
  const safeRooms = escapeHtml(data.numberOfRooms);
  const safeGuests = escapeHtml(data.totalGuests);
  const safeIstTime = escapeHtml(timestamp.ist);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Room Booking Enquiry — Pavan Vela Grand</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F9FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #182230;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F7F9FC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 16px rgba(16, 38, 61, 0.08); border: 1px solid #E2E8F0;">
          
          <!-- Header with Brand Royal Navy & Gold Accent -->
          <tr>
            <td style="background-color: #10263D; padding: 28px 32px; border-bottom: 3px solid #C5A572;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: #FFFFFF; letter-spacing: 0.04em;">
                      Pavan Vela Grand
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: #C5A572; font-weight: 600;">
                      Palani Road Bypass &bull; Dindigul
                    </p>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(197, 165, 114, 0.18); border: 1px solid #C5A572; color: #C5A572; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; padding: 5px 10px; border-radius: 3px;">
                      Website Enquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Banner -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 18px 32px; border-bottom: 1px solid #E2E8F0;">
              <h2 style="margin: 0; font-size: 17px; font-weight: 600; color: #173B63;">
                New Room Booking Enquiry
              </h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">
                Received: ${safeIstTime}
              </p>
            </td>
          </tr>

          <!-- Enquiry Details Content -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                
                <!-- Guest Name -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; width: 40%; font-weight: 500;">
                    Guest Name
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #10263D; font-weight: 600;">
                    ${safeName}
                  </td>
                </tr>

                <!-- Guest Email -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Guest Email
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #173B63; font-weight: 600;">
                    <a href="mailto:${safeEmail}" style="color: #173B63; text-decoration: underline;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>

                <!-- Contact Number -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Contact Number
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #10263D; font-weight: 600;">
                    <a href="tel:${safePhone}" style="color: #10263D; text-decoration: none;">
                      ${safePhone}
                    </a>
                  </td>
                </tr>

                <!-- Check-in Date -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Check-in Date
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #10263D; font-weight: 600;">
                    ${safeCheckIn}
                  </td>
                </tr>

                <!-- Check-out Date -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Check-out Date
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #10263D; font-weight: 600;">
                    ${safeCheckOut}
                  </td>
                </tr>

                <!-- Number of Rooms -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Number of Rooms
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 15px; color: #173B63; font-weight: 700;">
                    ${safeRooms} room${data.numberOfRooms > 1 ? "s" : ""}
                  </td>
                </tr>

                <!-- Total Number of Guests -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B; font-weight: 500;">
                    Total Number of Guests
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; font-size: 15px; color: #173B63; font-weight: 700;">
                    ${safeGuests} guest${data.totalGuests > 1 ? "s" : ""}
                  </td>
                </tr>

              </table>

              <!-- Clear Reservation Disclaimer -->
              <div style="margin-top: 28px; padding: 14px 18px; background-color: #F8FAFC; border-left: 3px solid #C5A572; border-radius: 2px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #475569;">
                  <strong style="color: #173B63;">Important Note:</strong> This is a room booking enquiry received through the website. It is <em>not</em> a confirmed reservation. Please contact the guest directly via telephone or reply to this email to discuss room options, dates, and confirm their booking.
                </p>
              </div>

              <!-- Quick Reply Action -->
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${safeEmail}?subject=Re:%20Room%20Booking%20Enquiry%20%E2%80%94%20Pavan%20Vela%20Grand" style="display: inline-block; background-color: #C5A572; color: #10263D; text-decoration: none; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; padding: 12px 28px; border-radius: 3px;">
                  Reply to Guest
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 18px 32px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0;">
                Hotel Pavan Vela Grand &bull; Palani Road Bypass, Dindigul, Tamil Nadu
              </p>
              <p style="margin: 4px 0 0 0;">
                Automated enquiry notification generated by hotel website server.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates the clean plain-text alternative of the booking enquiry email.
 */
export function generateBookingEmailText(data: BookingEnquiryPayload, timestamp: { ist: string; utc: string }): string {
  return `PAVAN VELA GRAND — NEW ROOM BOOKING ENQUIRY
===============================================
Location: Palani Road Bypass, Dindigul, Tamil Nadu
Enquiry Received: ${timestamp.ist}

GUEST INFORMATION
-----------------
Guest Name:              ${data.fullName}
Guest Email:             ${data.email}
Contact Number:          ${data.contactNumber}

STAY DETAILS
------------
Check-in Date:           ${formatDisplayDate(data.checkInDate)}
Check-out Date:          ${formatDisplayDate(data.checkOutDate)}
Number of Rooms:         ${data.numberOfRooms}
Total Number of Guests:  ${data.totalGuests}

IMPORTANT NOTE
--------------
This message is an enquiry received through the hotel website and is NOT a confirmed reservation.
Please contact the guest at ${data.contactNumber} or reply directly to this email (${data.email}) to confirm their stay details.

--
Pavan Vela Grand Automated Enquiry System
`;
}

/**
 * Dispatches the booking enquiry email to the administrator using SMTP.
 */
export async function sendBookingEnquiryEmail(data: BookingEnquiryPayload): Promise<{ messageId?: string }> {
  const config = getSmtpConfig();

  if (!config) {
    const errorMsg =
      "SMTP configuration is incomplete. Required environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, MAIL_FROM";
    console.error("[Email Error] Cannot send enquiry:", errorMsg);
    throw new Error(errorMsg);
  }

  const transporter = getEmailTransporter(config);
  const timestamp = formatTimestamp();

  const mailOptions: SendMailOptions = {
    to: config.adminEmail,
    from: config.mailFrom,
    replyTo: data.email,
    subject: "New Room Booking Enquiry — Pavan Vela Grand",
    text: generateBookingEmailText(data, timestamp),
    html: generateBookingEmailHtml(data, timestamp),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Success] Booking enquiry sent for ${data.fullName} (ID: ${info.messageId})`);
    return { messageId: info.messageId };
  } catch (err: unknown) {
    // Log technical error securely without revealing passwords or credentials
    const errorDetails = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[Email Error] Failed to dispatch SMTP message to admin:", errorDetails);
    throw new Error(`SMTP sending failed: ${errorDetails}`);
  }
}
