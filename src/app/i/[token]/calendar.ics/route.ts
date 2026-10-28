import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";
import { generateIcsContent } from "@/lib/ics";
import { isValidTokenFormat } from "@/lib/token";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (isValidTokenFormat(token)) {
    try {
      const supabase = getServiceClient();
      const { data: invitee } = await supabase
        .from("invitees")
        .select("id")
        .eq("token", token)
        .single();

      if (invitee) {
        await supabase.from("events_log").insert({
          invitee_id: invitee.id,
          type: "calendar_ics",
        });
      }
    } catch {
      // Continue to send .ics file
    }
  }

  const icsBody = generateIcsContent();

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="teachers-day-awards-2026.ics"',
      "Cache-Control": "no-cache",
    },
  });
}
