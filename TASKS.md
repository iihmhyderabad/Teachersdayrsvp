# TASKS (ordered). Mark with [x] in `progress.md`, not here.

## Milestone 0 – Setup (Day 1)
- **T0.1** Scaffold Next.js + TS + Tailwind; add `src/config/event.ts` exactly as in `instruction.md`.
  *AC:* `npm run dev` works; lint/typecheck pass.
- **T0.2** Create Supabase project, run schema from `DATA_MODEL.md`, enable RLS.
  *AC:* anon key cannot read `invitees`.

## Milestone 1 – Data (Day 1)
- **T1.1** Extract PDF to normalised `invitees.csv` + `import-report.csv`.
  *AC:* every school row accounted for; flagged rows listed; no real data committed (add to `.gitignore`).
- **T1.2** `scripts/import-csv.ts` + `/admin/import` upload with preview.
  *AC:* idempotent re-import; tokens generated; duplicates skipped.

## Milestone 2 – Invitee experience (Day 1-2) **MVP core**
- **T2.1** `/i/[token]` page per `DESIGN.md`; logs `opened`, sets `first_opened_at`.
- **T2.2** RSVP API + buttons (confirm/decline/change). Idempotent.
- **T2.3** `lib/ics.ts` + `/i/[token]/calendar.ics` (start 14:50 IST, alarms). Unit tests.
- **T2.4** `/go/[token]/gcal` and `/go/[token]/maps` redirects with click logging.
- **T2.5** Helpline tap-to-call with `helpline` log.
  *AC (all):* works at 360px; confirm in <= 2 taps; ICS opens in iOS Calendar and Google Calendar; Maps opens navigation to Vimtara with no origin.

## Milestone 3 – Organiser (Day 2)
- **T3.1** Admin auth (magic link, allow-list).
- **T3.2** Dashboard stat cards, filters, search, table.
- **T3.3** Per-row send actions: copy, WhatsApp, SMS, email deep links with template; logs `sent_*`.
- **T3.4** "Not yet confirmed" reminder view; CSV export of confirmed list.
  *AC:* dashboard numbers equal DB counts; export opens in Excel.

## Milestone 4 – Hardening & launch (Day 2-3)
- **T4.1** Rate limiting, security headers, error pages, event-passed state.
- **T4.2** Playwright mobile e2e: open -> confirm -> calendar -> directions.
- **T4.3** Privacy review: no PII in logs, no cross-invitee leakage.
- **T4.4** Deploy (see `DEPLOYMENT.md`); smoke test on a real Android and iPhone.
- **T4.5** Send test invites to 3 organisers before real send.

## Milestone 5 – Nice-to-have (only after launch)
Automated reminders (T-2d, T-1d, T-3h), QR check-in, Hindi toggle, companion count, `purge-data.ts` run after the event.
