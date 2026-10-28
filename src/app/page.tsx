import Link from "next/link";
import { EVENT } from "@/config/event";
import { i18n } from "@/i18n/en";
import { Award, Lock, ExternalLink, Calendar, MapPin, Clock, ShieldCheck } from "lucide-react";
import { CandidateSearchPanel } from "@/components/CandidateSearchPanel";

export default function Home() {
  return (
    <main className="min-h-screen max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-maroon-50 text-maroon rounded-2xl flex items-center justify-center mx-auto border border-gold/30 shadow-2xs">
            <Award className="w-7 h-7 text-gold-dark" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-50 border border-maroon/15 text-maroon text-xs font-semibold tracking-wider uppercase">
              {EVENT.organiser}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-maroon font-serif tracking-tight pt-1">
              {EVENT.title}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
              Official Invitation, Attendance Acknowledgment & Attendance Desk
            </p>
          </div>

          {/* Quick Event Summary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-charcoal font-medium">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gold/30">
              <Calendar className="w-3.5 h-3.5 text-maroon" />
              Fri, 30 Oct 2026
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Report by 2:50 PM
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gold/30">
              <MapPin className="w-3.5 h-3.5 text-maroon" />
              Vimtara, Raipur
            </span>
          </div>
        </div>

        {/* PRIMARY SEARCH & ACKNOWLEDGE PANEL */}
        <CandidateSearchPanel />

        {/* Informational Cards & Admin Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Sample Card Preview */}
          <Link
            href="/i/demo_teacher_2026"
            className="p-3.5 rounded-2xl bg-white border border-gold/20 hover:border-gold shadow-2xs text-left transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-maroon group-hover:underline">
                Sample Invitation Card
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Preview the personalized card view
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gold-dark shrink-0" />
          </Link>

          {/* Organiser Desk Login */}
         
           
            <ShieldCheck className="w-4 h-4 text-maroon shrink-0" />
          </Link>
        </div>
      </div>

      {/* Footer with Helpline */}
      <footer className="text-center pt-8 pb-4 border-t border-gold/20 mt-8 space-y-1 text-xs text-charcoal-muted">
        <p>
          Need assistance? Call Helpline:{" "}
          <a
            href={EVENT.helplineTel}
            className="font-bold text-maroon underline hover:text-maroon-700"
          >
            {EVENT.helplineDisplay}
          </a>
        </p>
        <p className="text-[11px] text-charcoal-light">
          {EVENT.venueName} • {EVENT.organiser}
        </p>
      </footer>
    </main>
  );
}
