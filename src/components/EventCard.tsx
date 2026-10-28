import React from "react";
import { EVENT } from "@/config/event";
import { i18n } from "@/i18n/en";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

interface EventCardProps {
  personName?: string;
  schoolName?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ personName, schoolName }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gold/30 overflow-hidden mb-6">
      {/* Decorative top ribbon */}
      <div className="h-2 bg-gradient-to-r from-maroon via-gold to-maroon" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Personal Greeting */}
        {personName && (
          <div className="border-b border-ivory-subtle pb-4">
            <p className="text-sm font-semibold tracking-wide text-gold-dark uppercase mb-1">
              Personal Invitation
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-maroon font-serif">
              {i18n.greeting(personName)}
            </h2>
            {schoolName && (
              <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5 leading-snug">
                {schoolName}
              </p>
            )}
          </div>
        )}

        {/* Date and Time Details */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider">Date</p>
              <p className="text-base font-semibold text-charcoal">{i18n.eventCard.date}</p>
            </div>
          </div>

          {/* Time & Report By Badge */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider">Event Time</p>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-base font-semibold text-charcoal">{i18n.eventCard.time}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  Report by 2:50 PM
                </span>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider">
                {i18n.eventCard.venueLabel}
              </p>
              <p className="text-base font-semibold text-charcoal">{EVENT.venueName}</p>
              <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
                {EVENT.venueAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
