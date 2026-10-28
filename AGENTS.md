# AGENTS – Roles and Handoffs

Agents work from `TASKS.md`, always follow `instruction.md`, and log to `progress.md`.

| Agent | Responsibility | Inputs | Outputs |
|---|---|---|---|
| **Planner/Lead** | Owns scope, resolves open questions, reviews PRs, keeps `progress.md` honest | All docs | Decisions, task order |
| **Data Agent** | Convert `teachersdetail.pdf` to clean `invitees.csv`, write import script + report | PDF/CSV | `invitees.csv`, `import-report.csv`, `scripts/import-csv.ts` |
| **Backend Agent** | Schema, token generation, RSVP/track APIs, redirects, ICS, auth | `DATA_MODEL.md`, `ARCHITECTURE.md` | API routes, migrations, tests |
| **Frontend Agent** | Invite page and admin UI, mobile-first | `DESIGN.md` | Components, pages |
| **QA Agent** | Mobile viewport checks, e2e test, accessibility, privacy review | All | Test reports, bug list |
| **DevOps Agent** | Deploy, env vars, domain, backups, purge script | `DEPLOYMENT.md` | Live URL |

## Handoff protocol
1. Agent finishes a task, runs checks, updates `progress.md` (status, files touched, how to verify).
2. Next agent reads `progress.md` first.
3. Conflicts: Lead decides; record in `progress.md` > Decisions.

## Parallelisation
- Data Agent and Backend Agent can start together.
- Frontend can start with mock data once the API contract in `ARCHITECTURE.md` is fixed.
- QA runs after each milestone, not only at the end.
