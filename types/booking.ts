/**
 * Future Booking Architecture - Types & Integration Boundaries
 *
 * Provides architectural contracts for future table and room reservation actions
 * without coupling to any specific engine, database, or payment service.
 */

export type BookingActionType = "BOOK_TABLE" | "BOOK_ROOM";

export type BookingTargetType =
  | "phone"
  | "whatsapp"
  | "modal"
  | "custom_flow"
  | "external";

export interface BookingTarget {
  readonly type: BookingTargetType;
  readonly destination?: string;
}

export interface BookingActionConfig {
  readonly id: BookingActionType;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly target: BookingTarget;
}

/**
 * Modular data contracts for future reservation workflows.
 */
export interface TableReservationRequest {
  readonly guestName: string;
  readonly guestPhone: string;
  readonly date: string;
  readonly timeSlot: string;
  readonly partySize: number;
  readonly specialRequests?: string;
}

export interface RoomReservationRequest {
  readonly guestName: string;
  readonly guestPhone: string;
  readonly checkInDate: string;
  readonly checkOutDate: string;
  readonly adultsCount: number;
  readonly childrenCount?: number;
  readonly roomType?: string;
  readonly specialRequests?: string;
}

/**
 * Pavan Vela Grand — Functional Book a Room Enquiry Payload
 * Strictly 7 fields: Full Name, Email, Contact Number, Check-in Date, Check-out Date, Number of Rooms, Total Guests.
 */
export interface BookingEnquiryPayload {
  readonly fullName: string;
  readonly email: string;
  readonly contactNumber: string;
  readonly checkInDate: string;
  readonly checkOutDate: string;
  readonly numberOfRooms: number;
  readonly totalGuests: number;
}

export interface BookingEnquiryResponse {
  readonly success: boolean;
  readonly message: string;
  readonly errors?: Partial<Record<keyof BookingEnquiryPayload, string>>;
}

export interface SmtpConfig {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly user: string;
  readonly pass: string;
  readonly adminEmail: string;
  readonly mailFrom: string;
}
