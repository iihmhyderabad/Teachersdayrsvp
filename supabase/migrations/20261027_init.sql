-- Supabase Schema for Teachers' Day Awards 2026 RSVP App
-- Generated per DATA_MODEL.md and ARCHITECTURE.md

-- 1. Invitees Table
create table if not exists invitees (
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

-- 2. Events Log Table
create table if not exists events_log (
  id bigint generated always as identity primary key,
  invitee_id uuid references invitees(id) on delete cascade,
  type text not null check (type in (
    'sent_whatsapp','sent_sms','sent_email','sent_copy',
    'opened','confirmed','declined',
    'calendar_google','calendar_ics','directions','helpline')),
  created_at timestamptz default now(),
  meta jsonb
);

-- 3. Indexes
create index if not exists idx_events_log_invitee_type on events_log (invitee_id, type);
create index if not exists idx_invitees_token on invitees (token);
create index if not exists idx_invitees_status on invitees (status);

-- 4. Enable Row Level Security (RLS)
-- Anon key has no direct access; all access is via service role on Next.js server endpoints or authenticated admin
alter table invitees enable row level security;
alter table events_log enable row level security;
