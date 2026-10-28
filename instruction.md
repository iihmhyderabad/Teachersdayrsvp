# instruction.md – Master Instructions for Build Agents

You are building the **Teachers' Day Awards 2026 RSVP app** for IIHM Hyderabad. Read `README.md`, `PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `DESIGN.md`, `TASKS.md` before writing code. Update `progress.md` after every task.

## Fixed event constants (single source of truth: `src/config/event.ts`)
```ts
export const EVENT = {
  title: "Teachers' Day Awards 2026",
  organiser: "Institute of Hotel Management (IIHM) Hyderabad",
  venueName: "Vimtara, Raipur",
  venueAddress: "Vimtara, Shanti Nagar, Indravati Colony, Raipur, Chhattisgarh 492001",
  lat: 21.245957, lng: 81.655927,
  timezone: "Asia/Kolkata",            // IST, UTC+05:30
  startISO: "2026-10-30T15:00:00+05:30",
  reportByISO: "2026-10-30T14:50:00+05:30",
  endISO: "2026-10-30T17:30:00+05:30", // TODO(organiser): confirm real end time
  helplineDisplay: "07995581756",
  helplineTel: "tel:+917995581756",
};
```
Never hardcode these anywhere else.

## Hard rules
1. **Mobile-first.** Design at 360px width first. Touch targets >= 48px. No horizontal scroll. Must work on low-end Android over slow 4G (target < 150 KB JS on the invite page).
2. **No login for invitees.** Access is by unguessable token (>= 16 chars, crypto-random, URL-safe).
3. **Admin is protected** (password or email magic link). Never expose admin routes or the invitee list publicly.
4. **Privacy.** Data includes phone numbers and emails (India DPDP Act applies). Collect only what is needed, never log full phone/email in app logs, never commit real data, never show one invitee's data to another, store the minimum, provide a delete-all script after the event.
5. **Directions link must be destination-only**, never include an origin (the organiser's original link contained a Hyderabad origin; do not reuse it):
   `https://www.google.com/maps/dir/?api=1&destination=21.245957,81.655927&destination_place_id=<optional>`
   Fallback text link: `https://www.google.com/maps/search/?api=1&query=Vimtara+Raipur`
6. **Calendar:** provide (a) Google Calendar template URL and (b) downloadable `.ics` (RFC 5545, with `VTIMEZONE` or UTC times, an alarm 1 day before and 2 hours before). Calendar event start should be **14:50 IST** with the description "Event begins 3:00 PM. Please report by 2:50 PM."
7. **Track events, not guesses.** Record: `sent`, `opened`, `confirmed`, `declined`, `calendar_clicked`, `directions_clicked`, `helpline_clicked`, each with timestamp.
8. **Idempotent actions.** Pressing Confirm twice must not duplicate data; changing Confirm -> Decline must be allowed until the event.
9. **No new dependencies without a note** in `progress.md` explaining why.
10. **Accessibility:** semantic HTML, labels, contrast >= 4.5:1, works with system font scaling.
11. **Copy tone:** respectful, short, bilingual-ready (English now; keep strings in `src/i18n/` so Hindi can be added).
12. **Tests:** every API route and the ICS generator needs tests. Run lint, typecheck, tests before marking a task done.

## Definition of done (per task)
- Acceptance criteria in `TASKS.md` all met
- Lint, typecheck and tests pass
- Checked at 360x640 and 414x896 viewports
- `progress.md` updated (what changed, how to verify, known issues)

## Do not
- Do not send real messages (SMS/WhatsApp/email) in dev. Use the `DRY_RUN=true` flag.
- Do not scrape or alter the PDF data silently; log every row skipped or merged during import.
- Do not delete files you did not create.

## When blocked
Write the blocker in `progress.md` under **Blockers**, pick the next unblocked task, continue.
