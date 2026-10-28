const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "teachers_list.csv");
const outputPath = path.join(__dirname, "..", "invitees.csv");
const reportPath = path.join(__dirname, "..", "import-report.csv");

// Helper: clean mobile numbers (strip spaces, +91, leading 0)
function cleanPhone(raw) {
  if (!raw) return { phone: "", valid: false, reason: "Missing phone" };
  // remove non-digits
  const digits = raw.replace(/\D/g, "");
  // handle multiple numbers (e.g. "7587135551 , 6260336770")
  const first10 = digits.slice(-10);
  if (first10.length === 10 && /^[6-9]/.test(first10)) {
    return { phone: first10, valid: true };
  }
  return { phone: digits, valid: false, reason: `Invalid phone format (${raw})` };
}

// Helper: clean and validate email
function cleanEmail(raw) {
  if (!raw) return { email: "", valid: false, reason: "Missing email" };
  let email = raw.trim().toLowerCase();
  // fix common typos
  email = email.replace(/gmai\.com$/, "gmail.com")
               .replace(/gmail\.cim$/, "gmail.com")
               .replace(/gmail\.comob$/, "gmail.com")
               .replace(/\s+/g, "");

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return { email, valid, reason: valid ? "" : `Invalid email syntax (${raw})` };
}

// Parse CSV lines handling quotes
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
        i++; // skip next quote
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

function process() {
  if (!fs.existsSync(inputPath)) {
    console.error("Input file not found:", inputPath);
    return;
  }

  const rawContent = fs.readFileSync(inputPath, "utf-8");
  const rows = parseCsv(rawContent);
  if (rows.length < 2) {
    console.error("Empty CSV or missing header");
    return;
  }

  const header = rows[0];
  // Column indices from header:
  // 0: Timestamp, 1: Email Address, 2: School Name, 3: School Address
  // 4: Nominee Name, 5: Nominee Desig, 6: Nominee Mobile, 7: Nominee Email, 8: Nominee Photo
  // 9: Principal Name, 10: Principal Photo, 11: Principal Mobile, 12: Principal Email

  const report = [];
  const invitees = [];
  const seenMobile = new Set();
  const seenEmail = new Set();

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const timestamp = r[0] || "";
    const schoolName = r[2] || "";
    const schoolAddress = r[3] || "";

    const nomineeName = (r[4] || "").trim();
    const nomineeDesig = (r[5] || "Teacher").trim();
    const nomineeRawPhone = r[6] || "";
    const nomineeRawEmail = r[7] || "";

    const principalName = (r[9] || "").trim();
    const principalRawPhone = r[11] || "";
    const principalRawEmail = r[12] || "";

    // Candidate 1: Nominee (incharge)
    if (nomineeName) {
      const phoneRes = cleanPhone(nomineeRawPhone);
      const emailRes = cleanEmail(nomineeRawEmail);

      const person = {
        school_name: schoolName,
        school_address: schoolAddress,
        person_name: nomineeName,
        role: "incharge",
        designation: nomineeDesig,
        mobile: phoneRes.phone,
        email: emailRes.email,
        timestamp,
        rowNumber: i + 1,
      };

      if (!phoneRes.valid) {
        report.push({ row: i + 1, person: nomineeName, role: "incharge", status: "FLAGGED", issue: phoneRes.reason });
      }
      if (!emailRes.valid) {
        report.push({ row: i + 1, person: nomineeName, role: "incharge", status: "FLAGGED", issue: emailRes.reason });
      }

      invitees.push(person);
    }

    // Candidate 2: Principal (only if different person)
    const isSamePerson = nomineeName && principalName &&
      (nomineeName.toLowerCase() === principalName.toLowerCase() ||
       nomineeRawPhone.replace(/\D/g, "").slice(-10) === principalRawPhone.replace(/\D/g, "").slice(-10));

    if (principalName && !isSamePerson) {
      const phoneRes = cleanPhone(principalRawPhone);
      const emailRes = cleanEmail(principalRawEmail);

      const person = {
        school_name: schoolName,
        school_address: schoolAddress,
        person_name: principalName,
        role: "principal",
        designation: "Principal",
        mobile: phoneRes.phone,
        email: emailRes.email,
        timestamp,
        rowNumber: i + 1,
      };

      if (!phoneRes.valid) {
        report.push({ row: i + 1, person: principalName, role: "principal", status: "FLAGGED", issue: phoneRes.reason });
      }
      if (!emailRes.valid) {
        report.push({ row: i + 1, person: principalName, role: "principal", status: "FLAGGED", issue: emailRes.reason });
      }

      invitees.push(person);
    }
  }

  // Deduplication per DATA_MODEL.md:
  // "Dedupe by (mobile) then (email); if the same person appears twice, keep the latest timestamp"
  // We sort in reverse chronological order so first seen is latest
  invitees.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const uniqueInvitees = [];
  for (const inv of invitees) {
    const mobKey = inv.mobile.length === 10 ? inv.mobile : null;
    const emailKey = inv.email.includes("@") ? inv.email : null;

    let duplicate = false;
    if (mobKey && seenMobile.has(mobKey)) {
      duplicate = true;
      report.push({ row: inv.rowNumber, person: inv.person_name, role: inv.role, status: "SKIPPED_DUPLICATE", issue: `Duplicate mobile: ${mobKey}` });
    } else if (emailKey && seenEmail.has(emailKey)) {
      duplicate = true;
      report.push({ row: inv.rowNumber, person: inv.person_name, role: inv.role, status: "SKIPPED_DUPLICATE", issue: `Duplicate email: ${emailKey}` });
    }

    if (!duplicate) {
      if (mobKey) seenMobile.add(mobKey);
      if (emailKey) seenEmail.add(emailKey);
      uniqueInvitees.push(inv);
    }
  }

  // Write normalised invitees.csv
  const csvHeaders = "school_name,school_address,person_name,role,designation,mobile,email\n";
  const csvRows = uniqueInvitees.map(inv =>
    `"${inv.school_name.replace(/"/g, '""')}","${inv.school_address.replace(/"/g, '""')}","${inv.person_name.replace(/"/g, '""')}","${inv.role}","${inv.designation.replace(/"/g, '""')}","${inv.mobile}","${inv.email}"`
  ).join("\n");

  fs.writeFileSync(outputPath, csvHeaders + csvRows, "utf-8");

  // Write import-report.csv
  const reportHeaders = "row,person,role,status,issue\n";
  const reportRows = report.map(r =>
    `"${r.row}","${r.person.replace(/"/g, '""')}","${r.role}","${r.status}","${r.issue.replace(/"/g, '""')}"`
  ).join("\n");

  fs.writeFileSync(reportPath, reportHeaders + reportRows, "utf-8");

  console.log(`Processing complete!`);
  console.log(`Total normalized unique invitees: ${uniqueInvitees.length}`);
  console.log(`Report entries (flagged / duplicates skipped): ${report.length}`);
  console.log(`Saved to: ${outputPath} and ${reportPath}`);
}

process();
