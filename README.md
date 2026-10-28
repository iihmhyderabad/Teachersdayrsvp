# Teachers' Day Awards 2026 – Invitation, Reminder & RSVP App

**Organiser:** Institute of Hotel Management (IIHM) Hyderabad
**Event:** Teachers' Day Awards
**Venue:** Vimtara, Raipur, Shanti Nagar, Indravati Colony, Raipur, Chhattisgarh 492001
**Date:** Friday, 30 October 2026
**Event start:** 3:00 PM IST  |  **Report by:** 2:50 PM IST (10 minutes prior)
**Helpline:** [07995581756](tel:07995581756)

## What this is
A mobile-first web app. Each invited teacher/principal receives a **personal link**. Opening it shows the event card, and lets them:

1. **Acknowledge / Confirm** attendance (one tap)
2. **Add to Calendar** (Google Calendar link + `.ics` for Apple/Outlook)
3. **Get Directions** (opens Google Maps navigation to Vimtara)
4. **Call the helpline**

Organisers get an **admin dashboard** showing who has been sent the invite, who opened it, who confirmed, who declined, and who is still pending, with one-tap reminder sending and CSV export.

## Why personal links
Tracking "how many acknowledged" needs each invitee to be identifiable. Every invitee gets a unique unguessable token: `https://<domain>/i/<token>`. No login or app install is needed for invitees.

## Key docs (read in this order)
| File | Purpose |
|---|---|
| `instruction.md` | Master instructions every build agent must follow |
| `PRD.md` | Product requirements and user flows |
| `ARCHITECTURE.md` | Stack, routes, folder layout |
| `DATA_MODEL.md` | Database schema, CSV import mapping |
| `DESIGN.md` | Mobile UI spec and copy |
| `AGENTS.md` | Agent roles, handoffs, task split |
| `TASKS.md` | Ordered task checklist with acceptance criteria |
| `progress.md` | Live status log, updated after every task |
| `DEPLOYMENT.md` | Deploy, env vars, go-live checklist |

## Timeline warning
Event is **30 Oct 2026**. Build an MVP first (invite page, confirm, calendar, directions, dashboard). Everything marked *Nice-to-have* waits until after the MVP ships.

## Source data
`teachersdetail.pdf` (school list: school name, address, incharge name/designation/mobile/email/photo, principal name/mobile/email/photo). Convert to CSV (see `DATA_MODEL.md`). **Never commit real contact data to git.**
