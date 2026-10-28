import React from "react";
import { getServiceClient, Invitee } from "@/lib/db";
import { EVENT } from "@/config/event";
import { i18n } from "@/i18n/en";
import { EventCard } from "@/components/EventCard";
import { RsvpButtons } from "@/components/RsvpButtons";
import { CalendarButtons } from "@/components/CalendarButtons";
import { HelplineFooter } from "@/components/HelplineFooter";
import { Award, ShieldAlert, Clock } from "lucide-react";
import { isValidTokenFormat } from "@/lib/token";

interface PageProps {
  params: {
    token: string;
  };
}

async function getInvitee(token: string): Promise<Invitee | null> {
  if (!isValidTokenFormat(token)) {
    return null;
  }

  // Demo token support for testing before database import
  if (token === "demo_teacher_2026") {
    return {
      id: "demo-id",
      token: "demo_teacher_2026",
      school_name: "Delhi Public School, Raipur",
      school_address: "Semariya, Baloda Bazar Road, Raipur, Chhattisgarh",
      person_name: "Dr. Pratibha Sharma",
      role: "principal",
      designation: "Principal",
      mobile: "9876543210",
      email: "pratibha@dpsraipur.edu.in",
      status: "pending",
      status_updated_at: null,
      decline_reason: null,
      first_opened_at: null,
      created_at: new Date().toISOString(),
    };
  }

  // Handle local CSV generated tokens if database table is not yet populated
  if (token.startsWith("inv_")) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const csvPath = path.join(process.cwd(), "invitees.csv");
      if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim().length > 0);
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split('","').map((p) => p.replace(/^"|"$/g, "").trim());
          if (parts.length >= 7) {
            const [school_name, school_address, person_name, role, designation, mobile, email] = parts;
            const itemToken = `inv_${i}_${mobile.slice(-4)}`;
            if (itemToken === token) {
              return {
                id: `csv-${i}`,
                token,
                school_name,
                school_address: school_address || "Raipur, Chhattisgarh",
                person_name,
                role: (role as "incharge" | "principal") || "incharge",
                designation: designation || "Educator",
                mobile,
                email,
                status: "pending",
                status_updated_at: null,
                decline_reason: null,
                first_opened_at: null,
                created_at: new Date().toISOString(),
              };
            }
          }
        }
      }
    } catch {
      // Continue to Supabase lookup
    }
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("invitees")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      return null;
    }

    // Record 'opened' event
    if (!data.first_opened_at) {
      const now = new Date().toISOString();
      await supabase
        .from("invitees")
        .update({ first_opened_at: now })
        .eq("id", data.id);
    }

    await supabase.from("events_log").insert({
      invitee_id: data.id,
      type: "opened",
    });

    return data as Invitee;
  } catch (err) {
    // If table doesn't exist yet, return null
    return null;
  }
}

export default async function InviteePage({ params }: PageProps) {
  const token = params.token;
  const invitee = await getInvitee(token);

  // Check if event has passed
  const eventEndTime = new Date(EVENT.endISO).getTime();
  const isEventPassed = Date.now() > eventEndTime;

  // Invalid Token State
  if (!invitee) {
    return (
      <main className="min-h-screen max-w-md mx-auto px-4 py-8 flex flex-col justify-between">
        <div className="w-full text-center space-y-6 pt-12">
          <div className="w-16 h-16 bg-maroon-50 text-maroon rounded-2xl flex items-center justify-center mx-auto border border-maroon/20">
            <ShieldAlert className="w-8 h-8 text-maroon" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-maroon font-serif">
              Invitation Not Found
            </h1>
            <p className="text-sm text-charcoal-muted max-w-xs mx-auto leading-relaxed">
              {i18n.alerts.invalidLink}
            </p>
          </div>
          <div className="pt-4">
            <a
              href={EVENT.helplineTel}
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-maroon text-white font-medium text-sm hover:bg-maroon-700 transition-colors"
            >
              Call Helpline ({EVENT.helplineDisplay})
            </a>
          </div>
        </div>
        <HelplineFooter />
      </main>
    );
  }

  // Event Passed State
  if (isEventPassed) {
    return (
      <main className="min-h-screen max-w-md mx-auto px-4 py-8 flex flex-col justify-between">
        <div className="w-full text-center space-y-6 pt-12">
          <div className="w-16 h-16 bg-gray-100 text-charcoal-light rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-charcoal-muted" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">
              {EVENT.title}
            </h1>
            <p className="text-sm text-charcoal-muted max-w-xs mx-auto">
              {i18n.alerts.eventPassed}
            </p>
          </div>
        </div>
        <HelplineFooter token={token} />
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <header className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-50 border border-maroon/15 text-maroon text-xs font-semibold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-gold-dark" />
            <span>{i18n.header.organiser}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-maroon tracking-tight font-serif pt-1">
            {EVENT.title}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-light font-medium">
            {i18n.header.subtitle}
          </p>
        </header>

        {/* Event Details Card */}
        <EventCard
          personName={invitee.person_name}
          schoolName={invitee.school_name}
        />

        {/* RSVP Action Area */}
        <div className="mb-4">
          <RsvpButtons
            token={token}
            initialStatus={invitee.status}
          />
        </div>

        {/* Directions & Calendar Actions */}
        <div className="border-t border-gold/20 pt-3">
          <CalendarButtons
            token={token}
            isConfirmed={invitee.status === "confirmed"}
          />
        </div>
      </div>

      {/* Helpline and Organizer Footer */}
      <HelplineFooter token={token} />
    </main>
  );
}
