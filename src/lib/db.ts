import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://dracyfxzwxkolyalmkri.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Server-only Supabase client using the service role key.
 * Used for token verification, RSVP actions, and logging events.
 */
export function getServiceClient() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Public client for client-side queries (subject to RLS policies).
 */
export function getAnonClient() {
  if (!supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export type Invitee = {
  id: string;
  token: string;
  school_name: string;
  school_address: string | null;
  person_name: string;
  role: "incharge" | "principal" | "other";
  designation: string | null;
  mobile: string | null;
  email: string | null;
  status: "pending" | "confirmed" | "declined";
  status_updated_at: string | null;
  decline_reason: string | null;
  first_opened_at: string | null;
  created_at: string;
};

export type EventLogType =
  | "sent_whatsapp"
  | "sent_sms"
  | "sent_email"
  | "sent_copy"
  | "opened"
  | "confirmed"
  | "declined"
  | "calendar_google"
  | "calendar_ics"
  | "directions"
  | "helpline";
