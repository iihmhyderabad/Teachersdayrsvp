# DATA MODEL

## Source columns in `teachersdetail.pdf`
Timestamp | Email Address (submitter) | Full name of school/college | Address of school/college | Name of the incharge | Designation of the incharge | Mobile number of incharge | Email id of incharge | High resolution photo of incharge | Name of the principal | High resolution photo of principal | Mobile number of principal | Email id of principal

 Extract to CSV first (use `pdfplumber` or re-export the original Google Sheet/Form responses as CSV, which is much more reliable). Photo columns are links; **do not import photos in MVP**.

## Normalised CSV for import (`invitees.csv`)
One row per **person to invite** (an incharge and a principal from the same school become two rows):

`school_name, school_address, person_name, role, designation, mobile, email`

Rules:
- `role` in {`incharge`, `principal`}
- Mobile: strip spaces, +91, leading 0; must be 10 digits starting 6-9, else flag
- Email: lowercase and trim; flag invalid
- Dedupe by (mobile) then (email); if the same person appears twice, keep the latest timestamp
- If incharge and principal are the same person, one row
- Write skipped/flagged rows to `import-report.csv`

## Tables
```sql
create table invitees (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  school_name text not null,
  school_address text,
  person_name text not null,
  role text check (role in ('incharge','principal','other')) default 'other',
  designation text,
  mobile text,
  email text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','declined')),
  status_updated_at timestamptz,
  decline_reason text,
  first_opened_at timestamptz,
  created_at timestamptz default now()
);

create table events_log (
  id bigint generated always as identity primary key,
  invitee_id uuid references invitees(id) on delete cascade,
  type text not null check (type in (
    'sent_whatsapp','sent_sms','sent_email','sent_copy',
    'opened','confirmed','declined',
    'calendar_google','calendar_ics','directions','helpline')),
  created_at timestamptz default now(),
  meta jsonb
);

create index on events_log (invitee_id, type);
```

## Dashboard queries (derive from tables)
- Invited = count(invitees)
- Sent = invitees having any `sent_*` event
- Opened = count where `first_opened_at is not null`
- Confirmed / Declined / Pending = by `status`
- Calendar added = distinct invitees with `calendar_*`
- Directions = distinct invitees with `directions`

## Retention
After the event, run `scripts/purge-data.ts` to delete all invitee contact data (keep only aggregate counts).
