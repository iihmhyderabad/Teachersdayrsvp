"use client";

import React from "react";
import { EVENT } from "@/config/event";
import { i18n } from "@/i18n/en";
import { PhoneCall } from "lucide-react";

interface HelplineFooterProps {
  token?: string;
}

export const HelplineFooter: React.FC<HelplineFooterProps> = ({ token }) => {
  const handleCallClick = () => {
    if (token) {
      // Fire-and-forget helpline tracking
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, type: "helpline" }),
      }).catch(() => {});
    }
  };

  return (
    <footer className="w-full text-center pt-8 pb-6 border-t border-gold/20 mt-8 space-y-2">
      <p className="text-xs text-charcoal-light font-medium">
        {i18n.footer.needHelp}
      </p>
      <div>
        <a
          href={EVENT.helplineTel}
          onClick={handleCallClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-ivory-subtle border border-gold/40 text-maroon font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          id="helpline-call-btn"
        >
          <PhoneCall className="w-4 h-4 text-gold-dark" />
          <span>Call Helpline: {EVENT.helplineDisplay}</span>
        </a>
      </div>
      <p className="text-[11px] text-charcoal-muted pt-2">
        {EVENT.organiser}
      </p>
    </footer>
  );
};
