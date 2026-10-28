# DESIGN – Mobile UI Spec

## Principles
Single column, large type, one primary action per screen, works one-handed.

## Palette
Deep maroon `#7A1F2B` (primary), gold `#C9A24B` (accent), ivory `#FBF7EF` (background), charcoal `#222` (text). Success green `#1E7B4A`, decline grey `#6B6B6B`. Check contrast.

## Typography
System font stack. Body 16px min, headings 22-28px.

## Invite page layout (top to bottom)
1. Header: "IIHM Hyderabad" small + title **Teachers' Day Awards 2026**
2. Greeting: "Namaste, {name} ji" + school name
3. Event card:
   - Fri, 30 October 2026
   - 3:00 PM IST
   - Please report by **2:50 PM**
   - Vimtara, Raipur
4. Status banner (once responded): "You have confirmed. See you there!"
5. Primary buttons (full width, 56px tall):
   - **I will attend** (maroon)
   - **Cannot attend** (outlined)
6. After confirm, show:
   - **Add to Google Calendar**
   - **Download for iPhone/Outlook (.ics)**
   - **Get Directions** (opens Maps app)
7. Footer: "Need help? Call 07995581756" (tap-to-call)

## States
Loading skeleton, already confirmed, declined (with "Change my response"), invalid link, event passed ("This event has ended. Thank you."), offline error with retry.

## Admin dashboard
- Top: stat cards (Invited, Opened, Confirmed, Declined, Pending) in a 2-column grid on mobile
- Filter chips: All, Not opened, Opened not confirmed, Confirmed, Declined
- Search by name/school/phone
- Row: name, school, status pill, last activity; actions: Copy link, WhatsApp, SMS, Email
- Sticky "Export CSV" button

## Copy (English, `src/i18n/en.ts`)
- Confirm success: "Thank you! Your attendance is confirmed."
- Decline success: "Thank you for letting us know. You can change this anytime."
- Invalid link: "This link is not valid. Please call 07995581756 for help."
