import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";
import { MAPS_DESTINATION_URL } from "@/lib/links";
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
          type: "directions",
        });
      }
    } catch {
      // Ignore logging failures to ensure user is always redirected
    }
  }

  return NextResponse.redirect(MAPS_DESTINATION_URL, 302);
}
