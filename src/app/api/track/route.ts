import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, EventLogType } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, type, meta } = body;

    if (!token || !isValidTokenFormat(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const validTypes: EventLogType[] = [
      "sent_whatsapp",
      "sent_sms",
      "sent_email",
      "sent_copy",
      "opened",
      "confirmed",
      "declined",
      "calendar_google",
      "calendar_ics",
      "directions",
      "helpline",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Find invitee
    const { data: invitee, error: fetchError } = await supabase
      .from("invitees")
      .select("id, first_opened_at")
      .eq("token", token)
      .single();

    if (fetchError || !invitee) {
      return NextResponse.json({ success: true, dry_run: true });
    }

    // If 'opened' and first_opened_at is null, update first_opened_at
    if (type === "opened" && !invitee.first_opened_at) {
      await supabase
        .from("invitees")
        .update({ first_opened_at: new Date().toISOString() })
        .eq("id", invitee.id);
    }

    // Insert log entry
    await supabase.from("events_log").insert({
      invitee_id: invitee.id,
      type,
      meta: meta || null,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
