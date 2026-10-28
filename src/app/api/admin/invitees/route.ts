import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";
import fs from "fs";
import path from "path";

function loadInviteesFromCsv() {
  const csvPath = path.join(process.cwd(), "invitees.csv");
  if (!fs.existsSync(csvPath)) return [];

  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const list = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('","').map((p) => p.replace(/^"|"$/g, "").trim());
    if (parts.length >= 7) {
      const [school_name, school_address, person_name, role, designation, mobile, email] = parts;
      const token = `inv_${i}_${mobile.slice(-4)}`;
      list.push({
        id: `csv-${i}`,
        token,
        school_name,
        school_address,
        person_name,
        role: role || "other",
        designation: designation || "Educator",
        mobile: mobile || "",
        email: email || "",
        status: "pending",
        status_updated_at: null,
        decline_reason: null,
        first_opened_at: null,
        created_at: new Date().toISOString(),
      });
    }
  }
  return list;
}

export async function GET() {
  try {
    // Try Supabase first
    try {
      const supabase = getServiceClient();
      const { data: invitees, error } = await supabase
        .from("invitees")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && invitees && invitees.length > 0) {
        return NextResponse.json({ invitees, source: "database" });
      }
    } catch {
      // Continue to CSV fallback
    }

    // Fallback to local invitees.csv
    const fallbackList = loadInviteesFromCsv();
    return NextResponse.json({ invitees: fallbackList, source: "csv_fallback" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
