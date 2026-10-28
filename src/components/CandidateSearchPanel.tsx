"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CheckCircle2, XCircle, ArrowRight, School, UserCheck, Sparkles, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface Candidate {
  id: string;
  token: string;
  person_name: string;
  school_name: string;
  designation?: string;
  role: string;
  masked_mobile?: string;
  status: "pending" | "confirmed" | "declined";
}

export const CandidateSearchPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [acknowledgedMap, setAcknowledgedMap] = useState<Record<string, "pending" | "confirmed" | "declined">>({});
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.candidates || []);
        }
      } catch {
        // Fallback or error handled gracefully
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAcknowledge = async (candidate: Candidate, newStatus: "confirmed" | "declined") => {
    setActionLoading(`${candidate.token}_${newStatus}`);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: candidate.token,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setAcknowledgedMap((prev) => ({ ...prev, [candidate.token]: newStatus }));

        if (newStatus === "confirmed") {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#7A1F2B", "#C9A24B", "#1E7B4A"],
          });
        }
      }
    } catch {
      // Handled
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gold/30 shadow-sm overflow-hidden p-5 sm:p-6 space-y-5 text-left">
      {/* Instructions Header */}
      <div className="space-y-1.5 border-b border-ivory-subtle pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Quick Candidate Attendance Search</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-maroon font-serif pt-1">
          Find Your Invitation & Acknowledge
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Please enter your name, school, or mobile number to locate your invitation. You can immediately acknowledge your attendance as <strong>Yes</strong> or <strong>No</strong> below.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-gold-dark absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type your name, school, or phone number..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/25 transition-all shadow-2xs"
          autoFocus
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-maroon animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {/* Search Results List */}
      <div className="space-y-3">
        {searchTerm.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="p-6 text-center rounded-2xl bg-ivory border border-gold/20 text-xs sm:text-sm text-charcoal-muted space-y-1">
            <p className="font-semibold text-charcoal">No candidate found matching &ldquo;{searchTerm}&rdquo;</p>
            <p className="text-xs text-charcoal-light">Please check the spelling or try searching by your school name or last 4 digits of your mobile number.</p>
          </div>
        )}

        {results.map((candidate) => {
          const currentStatus = acknowledgedMap[candidate.token] || candidate.status;
          const isPending = currentStatus === "pending";
          const isConfirmed = currentStatus === "confirmed";
          const isDeclined = currentStatus === "declined";

          return (
            <div
              key={candidate.id || candidate.token}
              className="p-4 sm:p-5 rounded-2xl border border-gold/25 bg-ivory-card hover:border-gold transition-all space-y-3 shadow-2xs"
            >
              {/* Candidate Information Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-maroon">
                      {candidate.person_name}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-charcoal-muted">
                      {candidate.role}
                    </span>
                    {candidate.designation && (
                      <span className="text-xs text-charcoal-light">
                        • {candidate.designation}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-muted flex items-center gap-1.5 leading-snug">
                    <School className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                    <span>{candidate.school_name}</span>
                  </p>
                  {candidate.masked_mobile && (
                    <p className="text-[11px] text-charcoal-light">
                      Phone: {candidate.masked_mobile}
                    </p>
                  )}
                </div>

                {/* Status Pill */}
                <div className="shrink-0">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                      isConfirmed
                        ? "bg-emerald-100 text-emerald-800"
                        : isDeclined
                        ? "bg-gray-200 text-gray-700"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                    {isPending && <UserCheck className="w-3.5 h-3.5" />}
                    <span>{currentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Attendance Acknowledgment Buttons (Yes / No) */}
              <div className="pt-2 border-t border-ivory-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-1">
                  {/* YES button */}
                  <button
                    onClick={() => handleAcknowledge(candidate, "confirmed")}
                    disabled={actionLoading !== null}
                    className={`flex-1 min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                      isConfirmed
                        ? "bg-emerald-600 text-white"
                        : "bg-forest hover:bg-forest-dark text-white active:scale-98"
                    } disabled:opacity-50`}
                    title="Acknowledge: Yes, I will attend"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>
                      {actionLoading === `${candidate.token}_confirmed`
                        ? "Saving..."
                        : isConfirmed
                        ? "Attending (Yes)"
                        : "Yes, I will attend"}
                    </span>
                  </button>

                  {/* NO button */}
                  <button
                    onClick={() => handleAcknowledge(candidate, "declined")}
                    disabled={actionLoading !== null}
                    className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      isDeclined
                        ? "bg-gray-200 text-gray-800 border-gray-300 font-semibold"
                        : "border-gray-300 text-charcoal-muted hover:text-charcoal hover:bg-gray-50 active:scale-98"
                    } disabled:opacity-50`}
                    title="Acknowledge: Cannot attend"
                  >
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span>
                      {actionLoading === `${candidate.token}_declined`
                        ? "Saving..."
                        : isDeclined
                        ? "Declined (No)"
                        : "No, Cannot attend"}
                    </span>
                  </button>
                </div>

                {/* View Full Card Link */}
                <Link
                  href={`/i/${candidate.token}`}
                  className="px-3 py-2 text-xs font-semibold text-maroon hover:underline inline-flex items-center justify-center gap-1 shrink-0"
                >
                  <span>Full Card & Directions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Initial Empty State Prompt */}
      {!hasSearched && (
        <div className="p-4 rounded-2xl bg-ivory-subtle/50 border border-gold/15 text-xs text-charcoal-muted text-center space-y-1">
          <p className="font-medium text-charcoal">Over 100+ Teachers & Principals Nominated</p>
          <p className="text-[11px] text-charcoal-light">Type in the box above to immediately find your name or school.</p>
        </div>
      )}
    </div>
  );
};
