import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, status, reason } = body;

    if (!token || !isValidTokenFormat(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (status !== "confirmed" && status !== "declined") {
      return NextResponse.json(
        { error: "Status must be 'confirmed' or 'declined'" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // 1. Find invitee by token
    const { data: invitee, error: fetchError } = await supabase
      .from("invitees")
      .select("id, status")
      .eq("token", token)
      .single();

    if (fetchError || !invitee) {
      // In local dev without DB connection, allow mock response
      if (process.env.DRY_RUN === "true" && (!invitee || fetchError)) {
        return NextResponse.json({
          success: true,
          status,
          mock: true,
          message: "Saved in dry-run mode",
        });
      }
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // 2. Update status idempotently
    const { error: updateError } = await supabase
      .from("invitees")
      .update({
        status,
        status_updated_at: now,
        decline_reason: status === "declined" ? (reason || null) : null,
      })
      .eq("id", invitee.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 });
    }

    // 3. Log event
    await supabase.from("events_log").insert({
      invitee_id: invitee.id,
      type: status,
      meta: reason ? { reason } : undefined,
    });

    return NextResponse.json({
      success: true,
      status,
      updated_at: now,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
