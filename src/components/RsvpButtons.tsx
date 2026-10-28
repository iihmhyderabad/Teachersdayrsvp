"use client";

import React, { useState } from "react";
import { i18n } from "@/i18n/en";
import { CheckCircle2, XCircle, RotateCcw, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";

interface RsvpButtonsProps {
  token: string;
  initialStatus: "pending" | "confirmed" | "declined";
  onStatusChange?: (newStatus: "confirmed" | "declined") => void;
}

export const RsvpButtons: React.FC<RsvpButtonsProps> = ({
  token,
  initialStatus,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<"pending" | "confirmed" | "declined">(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const handleRsvp = async (newStatus: "confirmed" | "declined", reason?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          status: newStatus,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save your response. Please try again.");
      }

      setStatus(newStatus);
      setIsChanging(false);
      setShowDeclineForm(false);
      onStatusChange?.(newStatus);

      // Trigger celebratory confetti when confirmed
      if (newStatus === "confirmed") {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#7A1F2B", "#C9A24B", "#1E7B4A", "#E3C275"],
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : i18n.alerts.networkError;
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Confirmed State */}
      {status === "confirmed" && !isChanging && (
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-forest">
            <CheckCircle2 className="w-6 h-6 text-forest" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-forest-dark">
            {i18n.alerts.confirmSuccess}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            {i18n.status.confirmedBanner}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsChanging(true)}
              className="text-xs font-medium text-charcoal-light hover:text-maroon underline inline-flex items-center gap-1.5 py-1 px-2"
              id="btn-change-confirmed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{i18n.buttons.changeResponse}</span>
            </button>
          </div>
        </div>
      )}

      {/* Declined State */}
      {status === "declined" && !isChanging && (
        <div className="w-full bg-decline-50 border border-decline/20 rounded-2xl p-4 sm:p-5 text-center space-y-2">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-decline-dark">
            <XCircle className="w-6 h-6 text-decline-dark" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-charcoal">
            {i18n.alerts.declineSuccess}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            {i18n.status.declinedBanner}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsChanging(true)}
              className="text-xs font-semibold text-maroon hover:underline inline-flex items-center gap-1.5 py-1 px-2"
              id="btn-change-declined"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>I would like to attend instead</span>
            </button>
          </div>
        </div>
      )}

      {/* Pending State OR Changing State */}
      {(status === "pending" || isChanging) && (
        <div className="space-y-3">
          {/* Main Action: I will attend */}
          <button
            onClick={() => handleRsvp("confirmed")}
            disabled={isLoading}
            className="w-full h-14 min-h-[48px] rounded-2xl bg-maroon text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-maroon-700 active:scale-[0.99] shadow-md transition-all disabled:opacity-50"
            id="btn-rsvp-confirm"
          >
            <CheckCircle2 className="w-5 h-5 text-gold" />
            <span>{isLoading ? i18n.buttons.confirming : i18n.buttons.confirm}</span>
          </button>

          {/* Decline Option */}
          {!showDeclineForm ? (
            <button
              onClick={() => setShowDeclineForm(true)}
              disabled={isLoading}
              className="w-full h-12 min-h-[48px] rounded-2xl bg-white border border-charcoal-light/30 text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              id="btn-rsvp-decline-open"
            >
              <XCircle className="w-4 h-4 text-charcoal-light" />
              <span>{i18n.buttons.decline}</span>
            </button>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-ivory-subtle space-y-3">
              <label htmlFor="decline-reason" className="block text-xs font-medium text-charcoal-muted">
                Reason (optional):
              </label>
              <input
                id="decline-reason"
                type="text"
                placeholder="Prior commitment, out of station, etc."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gold/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon/20"
                maxLength={200}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRsvp("declined", declineReason)}
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] py-2.5 rounded-xl bg-decline text-white font-medium text-xs sm:text-sm hover:bg-decline-dark transition-colors disabled:opacity-50"
                  id="btn-rsvp-decline-submit"
                >
                  {isLoading ? i18n.buttons.declining : "Confirm Decline"}
                </button>
                <button
                  onClick={() => setShowDeclineForm(false)}
                  disabled={isLoading}
                  className="px-4 min-h-[48px] py-2.5 rounded-xl border border-gray-200 text-charcoal-muted text-xs sm:text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isChanging && (
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  setIsChanging(false);
                  setShowDeclineForm(false);
                }}
                className="text-xs text-charcoal-light underline"
              >
                Keep current response
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
