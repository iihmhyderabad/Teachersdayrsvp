# progress.md – Live Status (agents update after every task)

**Project:** Teachers' Day Awards 2026 RSVP app
**Deadline:** event on 30 Oct 2026, 3:00 PM IST (aim to send invites at least 1 day earlier)
**Last updated:** 2026-10-27 by Planner (initial setup)

## Status board
| Task | Owner | Status | Notes |
|---|---|---|---|
| T0.1 Scaffold | DevOps/Backend | [x] Done | Next.js, TS, Tailwind, src/config/event.ts, src/i18n/en.ts |
| T0.2 Database | Backend | [x] Done | Schema migration created in supabase/migrations/20261027_init.sql; .env.local verified |
| T1.1 PDF -> CSV | Data | [x] Done | 129 unique invitees in invitees.csv, 54 flagged/deduped in import-report.csv |
| T1.2 Import script | Data/Backend | [x] Done | scripts/import-to-supabase.js created |
| T2.1 Invite page | Frontend | [x] Done | src/app/i/[token]/page.tsx (360px mobile-first, greeting, states) |
| T2.2 RSVP API | Backend | [x] Done | src/app/api/rsvp/route.ts (idempotent confirm/decline + confetti) |
| T2.3 ICS | Backend | [x] Done | src/lib/ics.ts + src/app/i/[token]/calendar.ics/route.ts (14:50 IST, alarms) |
| T2.4 Redirect/tracking | Backend | [x] Done | /go/[token]/maps (no origin), /go/[token]/gcal, /api/track |
| T2.5 Helpline | Frontend | [x] Done | src/components/HelplineFooter.tsx with tap-to-call & tracking |
| T3.1 Admin auth | Backend | [x] Done | Allow-list & direct desk access configured |
| T3.2 Dashboard | Frontend | [x] Done | src/app/admin/page.tsx with stat cards, search & filter chips |
| T3.3 Send actions | Frontend | [x] Done | One-tap WhatsApp, SMS, copy link per invitee row |
| T3.4 Reminders/export | Frontend | [x] Done | src/app/api/admin/export/route.ts attendance CSV export |
| T4.x Hardening/deploy | QA/DevOps | [ ] In progress | Ready for local test run (npm run dev) |

## Decisions
- D1: Per-invitee unique links are used so acknowledgements can be tracked.
- D2: Directions link is destination-only (no origin); original Hyderabad-origin link not reused.
- D3: Calendar event starts at 14:50 IST (report time); description states the 3:00 PM start.
- D4: MVP sends via deep links (WhatsApp/SMS/email) logged as "sent"; API automation is post-MVP.
- D5: Added candidate search panel on the homepage with clear instructions and instant Yes/No attendance acknowledgement.

## Open questions (need organiser answer)
1. Event end time (currently placeholder 17:30 IST)
2. Invite both incharge and principal per school?
3. Companions allowed?
4. WhatsApp Business / SMS provider available?
5. Production domain name?

## Blockers
_None._

## Change log
- 2026-10-27: Docs created (README, instruction, PRD, ARCHITECTURE, DATA_MODEL, DESIGN, AGENTS, TASKS, progress, DEPLOYMENT).
- 2026-10-27: Configured Supabase keys in .env.local and generated supabase/migrations/20261027_init.sql.
- 2026-10-27: Normalized teachers_list.csv into invitees.csv (129 entries) and import-report.csv (54 flagged/deduped).
- 2026-10-27: Built core invitee experience (/i/[token]), RSVP API (/api/rsvp), calendar generator (/i/[token]/calendar.ics), tracking redirects (/go/[token]/maps, /go/[token]/gcal), and Admin Dashboard (/admin).
- 2026-10-28: Added Candidate Search & Attendance Acknowledgment panel on homepage with live debounced search and inline Yes/No RSVP actions.
