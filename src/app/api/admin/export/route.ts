import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceClient();
    const url = new URL(req.url);
    const filter = url.searchParams.get("status");

    let query = supabase.from("invitees").select("*").order("school_name", { ascending: true });

    if (filter) {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const headers = "id,token,school_name,school_address,person_name,role,designation,mobile,email,status,status_updated_at,first_opened_at\n";
    const rows = (data || []).map((row) =>
      `"${row.id}","${row.token}","${(row.school_name || "").replace(/"/g, '""')}","${(row.school_address || "").replace(/"/g, '""')}","${(row.person_name || "").replace(/"/g, '""')}","${row.role}","${(row.designation || "").replace(/"/g, '""')}","${row.mobile || ""}","${row.email || ""}","${row.status}","${row.status_updated_at || ""}","${row.first_opened_at || ""}"`
    ).join("\n");

    const csvContent = headers + rows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="invitees-export-${filter || 'all'}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
