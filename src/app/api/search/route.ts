import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";
import fs from "fs";
import path from "path";

interface CsvInvitee {
  token: string;
  school_name: string;
  person_name: string;
  role: string;
  designation: string;
  mobile: string;
  status: string;
}

// In-memory cache for CSV fallback
let cachedCsvInvitees: CsvInvitee[] | null = null;

function loadLocalInviteesFromCsv(): CsvInvitee[] {
  if (cachedCsvInvitees) return cachedCsvInvitees;

  const csvPath = path.join(process.cwd(), "invitees.csv");
  if (!fs.existsSync(csvPath)) return [];

  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const list: CsvInvitee[] = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser for quoted fields
    const parts = lines[i].split('","').map((p) => p.replace(/^"|"$/g, "").trim());
    if (parts.length >= 7) {
      const [school_name, , person_name, role, designation, mobile] = parts;
      // Deterministic demo token for each index if CSV
      const token = `inv_${i}_${mobile.slice(-4)}`;
      list.push({
        token,
        school_name,
        person_name,
        role: role || "other",
        designation: designation || "Educator",
        mobile: mobile || "",
        status: "pending",
      });
    }
  }

  cachedCsvInvitees = list;
  return cachedCsvInvitees;
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return "";
  const last4 = phone.slice(-4);
  return `******${last4}`;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = (url.searchParams.get("q") || "").trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({
        candidates: [],
        message: "Please enter at least 2 characters to search.",
      });
    }

    // Try Supabase first
    try {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("invitees")
        .select("id, token, person_name, school_name, designation, role, mobile, status")
        .or(`person_name.ilike.%${query}%,school_name.ilike.%${query}%,mobile.ilike.%${query}%`)
        .limit(20);

      if (!error && data && data.length > 0) {
        const masked = data.map((item) => ({
          id: item.id,
          token: item.token,
          person_name: item.person_name,
          school_name: item.school_name,
          designation: item.designation,
          role: item.role,
          masked_mobile: maskPhone(item.mobile || ""),
          status: item.status || "pending",
        }));
        return NextResponse.json({ candidates: masked, source: "database" });
      }
    } catch {
      // Supabase table not created yet or connection offline; proceed to CSV fallback
    }

    // Local CSV Fallback
    const localList = loadLocalInviteesFromCsv();
    const filtered = localList
      .filter((item) => {
        return (
          item.person_name.toLowerCase().includes(query) ||
          item.school_name.toLowerCase().includes(query) ||
          item.mobile.includes(query)
        );
      })
      .slice(0, 20)
      .map((item, idx) => ({
        id: `csv-${idx}`,
        token: item.token,
        person_name: item.person_name,
        school_name: item.school_name,
        designation: item.designation,
        role: item.role,
        masked_mobile: maskPhone(item.mobile),
        status: item.status,
      }));

    return NextResponse.json({ candidates: filtered, source: "csv_fallback" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Search error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
