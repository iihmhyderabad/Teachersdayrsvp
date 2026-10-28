# ARCHITECTURE

## Recommended stack (fast to ship, free-tier friendly)
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database/Auth:** Supabase (Postgres + Row Level Security) *(alternative: Firebase)*
- **Hosting:** Vercel
- **ICS:** small in-house generator (no heavy deps)
- **CSV:** `papaparse`
- **Tests:** Vitest + Playwright (one mobile e2e)

## Routes
| Route | Access | Purpose |
|---|---|---|
| `/i/[token]` | token | Invitee page |
| `/i/[token]/calendar.ics` | token | ICS download |
| `/api/rsvp` (POST) | token | Confirm/decline |
| `/api/track` (POST) | token | Log open/click events |
| `/go/[token]/maps` | token | Logs click, 302 to Google Maps destination URL |
| `/go/[token]/gcal` | token | Logs click, 302 to Google Calendar template |
| `/admin` | auth | Dashboard |
| `/admin/import` | auth | CSV import |
| `/admin/invitees/[id]` | auth | Timeline, resend |
| `/api/admin/export` | auth | CSV export |

Using `/go/...` redirects lets us count calendar and directions clicks reliably.

## Folder layout
```
src/
  app/ (routes above)
  components/ (EventCard, RsvpButtons, CalendarButtons, StatCards, InviteeTable)
  config/event.ts
  i18n/en.ts
  lib/ (db.ts, token.ts, ics.ts, links.ts, csv.ts, auth.ts)
  tests/
scripts/ (import-csv.ts, purge-data.ts)
docs/ (these .md files)
```

## Link builders (`lib/links.ts`)
- Maps: `https://www.google.com/maps/dir/?api=1&destination=21.245957,81.655927`
- Google Calendar: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=20261030T092000Z/20261030T120000Z&details=...&location=...`
  (14:50 IST = 09:20 UTC; 17:30 IST = 12:00 UTC; update when end time confirmed)
- WhatsApp: `https://wa.me/91<10-digit>?text=<urlencoded message>`
- SMS: `sms:+91<10-digit>?body=<urlencoded>`

## Message template (invite/reminder)
```
Namaste {name} ji,
IIHM Hyderabad cordially invites you to the Teachers' Day Awards 2026.
Date: 30 Oct 2026 (Fri), 3:00 PM
Venue: Vimtara, Raipur
Kindly report by 2:50 PM.
Please confirm, add to calendar and get directions here:
{link}
Helpline: 07995581756
```

## Security
- Tokens: `crypto.randomBytes(12).toString('base64url')`
- Supabase RLS: invitee table not readable by anon; invitee routes use server-side service key only
- Rate-limit `/api/rsvp` and token lookups
- Admin: Supabase Auth email magic link restricted to an allow-list of organiser emails
- Security headers, no third-party trackers

## Performance
Server-render the invite page, minimal client JS, system fonts, no images except a small logo (SVG).
