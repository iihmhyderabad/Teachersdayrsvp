import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EVENT } from "@/config/event";

export const metadata: Metadata = {
  title: `${EVENT.title} | RSVP Invitation`,
  description: `Official invitation to the ${EVENT.title} organized by ${EVENT.organiser} at ${EVENT.venueName}.`,
  robots: "noindex, nofollow", // Privacy: do not index invitee pages
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7A1F2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory text-charcoal antialiased flex flex-col justify-between selection:bg-gold-light/30">
        {children}
      </body>
    </html>
  );
}
