import { EVENT } from "@/config/event";

/**
 * Destination-only Google Maps link (Rule 5: NEVER include origin)
 */
export const MAPS_DESTINATION_URL = `https://www.google.com/maps/dir/?api=1&destination=${EVENT.lat},${EVENT.lng}`;
export const MAPS_FALLBACK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.venueName)}`;

/**
 * Google Calendar Web Template Link
 * Start: 2026-10-30 14:50 IST = 20261030T092000Z
 * End:   2026-10-30 17:30 IST = 20261030T120000Z
 */
export function buildGoogleCalendarUrl(): string {
  const title = encodeURIComponent(EVENT.title);
  const details = encodeURIComponent(
    `Event begins 3:00 PM. Please report by 2:50 PM.\n\nOrganiser: ${EVENT.organiser}\nHelpline: ${EVENT.helplineDisplay}`
  );
  const location = encodeURIComponent(`${EVENT.venueName}, ${EVENT.venueAddress}`);
  // UTC format: YYYYMMDDTHHmmssZ
  const dates = "20261030T092000Z/20261030T120000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Builds the invite/reminder message for WhatsApp / SMS
 */
export function buildInviteMessage(name: string, inviteUrl: string): string {
  return `Namaste ${name} ji,\nIIHM Hyderabad cordially invites you to the Teachers' Day Awards 2026.\nDate: 30 Oct 2026 (Fri), 3:00 PM\nVenue: Vimtara, Raipur\nKindly report by 2:50 PM.\nPlease confirm, add to calendar and get directions here:\n${inviteUrl}\nHelpline: ${EVENT.helplineDisplay}`;
}

/**
 * WhatsApp deep link
 */
export function buildWhatsAppLink(mobile10Digit: string, message: string): string {
  const cleanPhone = mobile10Digit.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * SMS link
 */
export function buildSmsLink(mobile10Digit: string, message: string): string {
  const cleanPhone = mobile10Digit.replace(/\D/g, "").slice(-10);
  return `sms:+91${cleanPhone}?body=${encodeURIComponent(message)}`;
}
