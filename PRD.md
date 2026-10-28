# PRD – Teachers' Day Awards RSVP App

## Goal
Make sure every invited teacher and principal knows the event details, attends on time, and that organisers can see exactly who has acknowledged.

## Users
- **Invitee** (teacher/school incharge/principal, Raipur schools): non-technical, uses a phone, may have a slow connection, opens a link from WhatsApp/SMS/email.
- **Organiser** (IIHM Hyderabad staff): imports the list, sends invites/reminders, watches the dashboard.

## Invitee flow (MVP)
1. Opens `/i/<token>`.
2. Sees: greeting with their name and school, event title, date, time, "Please report by 2:50 PM", venue, helpline.
3. Taps **I will attend** (confirm) or **Cannot attend** (decline, optional reason).
4. After confirming: buttons **Add to Calendar** and **Get Directions** are prominent. Calendar and directions are also available before confirming.
5. Can return to the same link later to change the response.

Invalid or expired token -> friendly page with helpline number, no data leaked.

## Organiser flow (MVP)
1. Log in at `/admin`.
2. Import CSV of invitees (preview, dedupe, errors).
3. See each invitee's unique link; **copy**, or **send via WhatsApp** (`wa.me` deep link with prefilled text), **SMS** (`sms:` link), **email** (`mailto:` link) in one tap each, which records `sent`.
4. Dashboard: totals (Invited, Opened, Confirmed, Declined, Pending), filters, search, per-row timeline.
5. **Reminder list:** "Not yet confirmed" with one-tap resend.
6. Export CSV (attendance list for the event desk).

## Metrics shown
Invited, Sent, Opened, Confirmed, Declined, No response, Calendar added (clicked), Directions opened. Confirmation rate = Confirmed / Invited.

## Nice-to-have (after MVP)
- Automated WhatsApp/SMS/email via provider API with scheduled reminders (T-2 days, T-1 day, T-3 hours)
- Check-in QR on the day (organiser scans invitee's QR)
- Hindi language toggle
- Companion count / dietary needs
- Award category and certificate name per invitee

## Out of scope
Payments, travel booking, public registration of non-invited people.

## Success criteria
- Invitee can confirm in <= 2 taps from opening the link
- Page loads < 3 s on 4G
- Dashboard numbers match database exactly
- Zero data of one invitee visible to another

## Open questions for organiser
1. Event end time?
2. Who is invited: both incharge and principal of each school, or one per school?
3. Is a companion allowed?
4. Which channel will invites go out on (WhatsApp, SMS, email)? Is there a WhatsApp Business / SMS provider account?
5. Any dress code or items to carry (ID, invitation)?
6. Should declined invitees be asked for a reason?
