import { EVENT } from "@/config/event";

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string.
 * Event start: 14:50 IST (09:20 UTC)
 * Event end:   17:30 IST (12:00 UTC)
 * Alarms: -1 day (-P1D) and -2 hours (-PT2H)
 */
export function generateIcsContent(): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dtStart = "20261030T092000Z";
  const dtEnd = "20261030T120000Z";
  const uid = `teachers-day-awards-2026-${EVENT.lat}-${EVENT.lng}@iihm.ac.in`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IIHM Hyderabad//Teachers Day Awards 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:Event begins 3:00 PM. Please report by 2:50 PM.\\nOrganiser: ${EVENT.organiser}\\nHelpline: ${EVENT.helplineDisplay}`,
    `LOCATION:${EVENT.venueName}\\, ${EVENT.venueAddress}`,
    `ORGANIZER;CN=${EVENT.organiser}:mailto:awards@iihm.ac.in`,
    "STATUS:CONFIRMED",
    // Alarm 1: 1 day before
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: Tomorrow is the ${EVENT.title} at ${EVENT.venueName}. Please report by 2:50 PM.`,
    "END:VALARM",
    // Alarm 2: 2 hours before
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${EVENT.title} begins soon. Please report at ${EVENT.venueName} by 2:50 PM.`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return icsLines.join("\r\n");
}
