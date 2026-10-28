# DEPLOYMENT

## Environment variables (`.env.local`, never commit)
```
NEXT_PUBLIC_SITE_URL=https://<your-domain>
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   # server only
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAIL_ALLOWLIST=a@iihm.example,b@iihm.example
DRY_RUN=true                 # set false only in production
```

## Steps
1. Create Supabase project; run migration; enable RLS.
2. Push repo to GitHub (private); `.gitignore` must include `*.csv`, `.env*`, `teachersdetail.pdf`.
3. Import to Vercel; add env vars; deploy.
4. Set the production domain (short URL preferred: easier to share by SMS).
5. Run import in production; verify counts match `import-report.csv`.

## Go-live checklist
- [ ] Event constants verified (date 30 Oct 2026, 3:00 PM, report 2:50 PM, Vimtara, helpline 07995581756)
- [ ] Directions opens navigation to Vimtara, Raipur (tested on Android + iPhone)
- [ ] ICS imports correctly (start 14:50 IST, correct date)
- [ ] 3 test invites confirmed by organisers
- [ ] Admin login restricted to allow-list
- [ ] Backups/export taken
- [ ] Invites sent; first dashboard check at +2 hours

## Reminder schedule (manual in MVP, automated later)
- 28 Oct: invite to everyone
- 29 Oct morning: reminder to pending
- 30 Oct 11:00 AM: final reminder to confirmed + pending ("Report by 2:50 PM")

## After the event
Run `scripts/purge-data.ts`; keep only aggregate numbers.
