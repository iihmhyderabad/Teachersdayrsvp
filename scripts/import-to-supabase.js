const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

// Read .env.local
const envPath = path.join(__dirname, "..", ".env.local");
let supabaseUrl = "https://dracyfxzwxkolyalmkri.supabase.co";
let supabaseServiceKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (key === "SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseServiceKey = val;
    }
  }
}

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// CSV line parser
function parseCsv(content) {
  const lines = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(cell.trim());
      if (row.some(c => c.length > 0)) {
        lines.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (row.length > 0) {
    row.push(cell.trim());
    lines.push(row);
  }
  return lines;
}

async function run() {
  const inviteesFile = path.join(__dirname, "..", "invitees.csv");
  if (!fs.existsSync(inviteesFile)) {
    console.error("invitees.csv not found. Run parse-teachers-csv.js first.");
    return;
  }

  const content = fs.readFileSync(inviteesFile, "utf-8");
  const rows = parseCsv(content);
  const dataRows = rows.slice(1);

  console.log(`Starting import of ${dataRows.length} invitees into Supabase...`);

  // Check existing invitees to ensure idempotency
  const { data: existing, error: fetchErr } = await supabase
    .from("invitees")
    .select("mobile, email");

  if (fetchErr) {
    console.error("Failed to query invitees table. Did you run the SQL migration in Supabase?", fetchErr.message);
    return;
  }

  const existingMobiles = new Set((existing || []).map(e => e.mobile).filter(Boolean));
  const existingEmails = new Set((existing || []).map(e => e.email).filter(Boolean));

  let inserted = 0;
  let skipped = 0;

  for (const r of dataRows) {
    const [school_name, school_address, person_name, role, designation, mobile, email] = r;

    if (mobile && existingMobiles.has(mobile)) {
      skipped++;
      continue;
    }
    if (email && existingEmails.has(email)) {
      skipped++;
      continue;
    }

    const token = crypto.randomBytes(12).toString("base64url");

    const { error: insertErr } = await supabase.from("invitees").insert({
      token,
      school_name,
      school_address: school_address || null,
      person_name,
      role: role || "other",
      designation: designation || null,
      mobile: mobile || null,
      email: email || null,
      status: "pending",
    });

    if (insertErr) {
      console.error(`Error inserting ${person_name}:`, insertErr.message);
    } else {
      inserted++;
      if (mobile) existingMobiles.add(mobile);
      if (email) existingEmails.add(email);
    }
  }

  console.log(`Import finished! Inserted: ${inserted}, Skipped existing: ${skipped}`);
}

run();
