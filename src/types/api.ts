export type Attendance = "attending" | "declined";
export interface RsvpData {
  attendance: Attendance;
  guestCount: number;
  message: string;
  updatedAt: string;
}
export interface InvitationData {
  name: string;
  maxGuests: number;
  rsvp: RsvpData | null;
}
export interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}
export interface WishesPage { items: Wish[]; nextCursor: string | null }
export interface ApiErrorBody { error: { code: string; message: string } }
export interface RsvpInput { attendance: Attendance; guestCount: number; message: string }
export interface WishInput { name: string; message: string; submissionId: string }
