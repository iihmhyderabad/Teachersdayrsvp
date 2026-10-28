"use client";

import React from "react";
import { i18n } from "@/i18n/en";
import { Navigation, CalendarPlus, Download } from "lucide-react";

interface CalendarButtonsProps {
  token: string;
  isConfirmed?: boolean;
}

export const CalendarButtons: React.FC<CalendarButtonsProps> = ({ token, isConfirmed = false }) => {
  return (
    <div className="w-full space-y-3 pt-2">
      {/* Get Directions Button - Most critical for attendees */}
      <a
        href={`/go/${token}/maps`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-14 min-h-[48px] px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base text-white bg-maroon hover:bg-maroon-700 active:scale-[0.99] shadow-sm transition-all"
        id="btn-directions"
      >
        <Navigation className="w-5 h-5 text-gold" />
        <span>{i18n.buttons.getDirections}</span>
      </a>

      {/* Calendar Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google Calendar Link */}
        <a
          href={`/go/${token}/gcal`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[48px] py-3 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-xs sm:text-sm text-charcoal bg-white hover:bg-ivory-subtle border border-gold/40 shadow-xs transition-colors"
          id="btn-gcal"
        >
          <CalendarPlus className="w-4 h-4 text-maroon" />
          <span>{i18n.buttons.googleCalendar}</span>
        </a>

        {/* Download ICS */}
        <a
          href={`/i/${token}/calendar.ics`}
          download="teachers-day-awards-2026.ics"
          className="w-full min-h-[48px] py-3 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-xs sm:text-sm text-charcoal bg-white hover:bg-ivory-subtle border border-gold/40 shadow-xs transition-colors"
          id="btn-ics"
        >
          <Download className="w-4 h-4 text-maroon" />
          <span>{i18n.buttons.downloadIcs}</span>
        </a>
      </div>
    </div>
  );
};
