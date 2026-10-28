"use client";

import React, { useState, useEffect, useMemo } from "react";
import { EVENT } from "@/config/event";
import { Invitee } from "@/lib/db";
import { buildInviteMessage, buildWhatsAppLink, buildSmsLink } from "@/lib/links";
import {
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Copy,
  MessageSquare,
  Mail,
  Download,
  Share2,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  Award,
} from "lucide-react";

export default function AdminDashboard() {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
    fetchInvitees();
  }, []);

  const fetchInvitees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitees");
      if (res.ok) {
        const data = await res.json();
        setInvitees(data.invitees || []);
      } else {
        // Fallback for local testing if API not yet populated
        setInvitees([
          {
            id: "1",
            token: "demo_teacher_2026",
            school_name: "Delhi Public School, Raipur",
            school_address: "Semariya, Baloda Bazar Road, Raipur",
            person_name: "Dr. Pratibha Sharma",
            role: "principal",
            designation: "Principal",
            mobile: "7987104984",
            email: "psherwani25@gmail.com",
            status: "confirmed",
            status_updated_at: new Date().toISOString(),
            decline_reason: null,
            first_opened_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            token: "demo_teacher_2",
            school_name: "GREEN FIELD ENGLISH MEDIUM HIGH SCHOOL",
            school_address: "Gate no 1 basant vihar gondwara",
            person_name: "Tilottma Patel",
            role: "incharge",
            designation: "Science teacher",
            mobile: "6263476705",
            email: "tilottmapatel1988@gmail.com",
            status: "pending",
            status_updated_at: null,
            decline_reason: null,
            first_opened_at: null,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = invitees.length;
    const opened = invitees.filter((i) => i.first_opened_at !== null).length;
    const confirmed = invitees.filter((i) => i.status === "confirmed").length;
    const declined = invitees.filter((i) => i.status === "declined").length;
    const pending = invitees.filter((i) => i.status === "pending").length;
    const rate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

    return { total, opened, confirmed, declined, pending, rate };
  }, [invitees]);

  // Filtering
  const filteredInvitees = useMemo(() => {
    return invitees.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.person_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mobile && item.mobile.includes(searchQuery));

      if (!matchesSearch) return false;

      if (statusFilter === "confirmed") return item.status === "confirmed";
      if (statusFilter === "declined") return item.status === "declined";
      if (statusFilter === "pending") return item.status === "pending";
      if (statusFilter === "not_opened") return item.first_opened_at === null;
      if (statusFilter === "opened_not_confirmed")
        return item.first_opened_at !== null && item.status !== "confirmed";

      return true;
    });
  }, [invitees, searchQuery, statusFilter]);

  const handleCopyLink = async (inv: Invitee) => {
    const link = `${siteUrl}/i/${inv.token}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);

    // Track copy
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inv.token, type: "sent_copy" }),
    }).catch(() => {});
  };

  const handleTrackSend = (token: string, type: "sent_whatsapp" | "sent_sms" | "sent_email") => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, type }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gold/20 sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-maroon-50 text-maroon flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-gold-dark" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-maroon font-serif leading-none">
                {EVENT.title}
              </h1>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Organiser Attendance Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/admin/export"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gold/40 text-xs font-semibold text-charcoal hover:bg-ivory-subtle shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-maroon" />
              <span className="hidden sm:inline">Export Attendance CSV</span>
              <span className="sm:hidden">Export</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Invited */}
          <div className="bg-white p-3.5 rounded-2xl border border-gold/20 shadow-2xs">
            <div className="flex items-center justify-between text-charcoal-light">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Invited</span>
              <Users className="w-4 h-4 text-maroon" />
            </div>
            <p className="text-2xl font-bold text-charcoal mt-1">{metrics.total}</p>
          </div>

          {/* Confirmed */}
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-forest" />
            </div>
            <p className="text-2xl font-bold text-forest-dark mt-1">{metrics.confirmed}</p>
          </div>

          {/* Pending */}
          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-1">{metrics.pending}</p>
          </div>

          {/* Declined */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-charcoal-light">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Declined</span>
              <XCircle className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-charcoal mt-1">{metrics.declined}</p>
          </div>

          {/* Opened */}
          <div className="bg-white p-3.5 rounded-2xl border border-gold/20 shadow-2xs">
            <div className="flex items-center justify-between text-charcoal-light">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Opened</span>
              <Eye className="w-4 h-4 text-gold-dark" />
            </div>
            <p className="text-2xl font-bold text-charcoal mt-1">{metrics.opened}</p>
          </div>

          {/* Rate */}
          <div className="bg-maroon-50/60 p-3.5 rounded-2xl border border-maroon/20 shadow-2xs">
            <div className="flex items-center justify-between text-maroon">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Rate</span>
              <ArrowUpDown className="w-4 h-4 text-maroon" />
            </div>
            <p className="text-2xl font-bold text-maroon mt-1">{metrics.rate}%</p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 rounded-2xl border border-gold/20 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teacher, school name, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gold/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon/20"
              />
            </div>

            {/* Quick Action Refresh */}
            <button
              onClick={fetchInvitees}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs text-charcoal-muted hover:bg-gray-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: `All (${invitees.length})` },
              { id: "pending", label: `Pending (${metrics.pending})` },
              { id: "confirmed", label: `Confirmed (${metrics.confirmed})` },
              { id: "declined", label: `Declined (${metrics.declined})` },
              { id: "not_opened", label: "Not Yet Opened" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === chip.id
                    ? "bg-maroon text-white shadow-2xs"
                    : "bg-ivory text-charcoal-muted hover:bg-ivory-subtle"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Invitee List / Table */}
        <div className="bg-white rounded-2xl border border-gold/20 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gold/15 flex items-center justify-between">
            <h2 className="text-sm font-bold text-maroon uppercase tracking-wider">
              Invitees List ({filteredInvitees.length})
            </h2>
            <span className="text-xs text-charcoal-muted">
              Tap actions to send via WhatsApp, SMS, or copy link
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredInvitees.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No invitees match your current search or filter.
              </div>
            ) : (
              filteredInvitees.map((inv) => {
                const inviteUrl = `${siteUrl}/i/${inv.token}`;
                const msg = buildInviteMessage(inv.person_name, inviteUrl);
                const waUrl = inv.mobile ? buildWhatsAppLink(inv.mobile, msg) : "";
                const smsUrl = inv.mobile ? buildSmsLink(inv.mobile, msg) : "";

                return (
                  <div
                    key={inv.id}
                    className="p-4 hover:bg-ivory-subtle/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    {/* Person & School Details */}
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-charcoal">
                          {inv.person_name}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-charcoal-muted">
                          {inv.role}
                        </span>
                        {/* Status Pill */}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            inv.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.status === "declined"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted leading-snug">
                        {inv.school_name}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-charcoal-light">
                        {inv.mobile && <span>📱 {inv.mobile}</span>}
                        {inv.email && <span>✉️ {inv.email}</span>}
                        {inv.first_opened_at ? (
                          <span className="text-emerald-700">✓ Opened</span>
                        ) : (
                          <span className="text-gray-400">Unopened</span>
                        )}
                      </div>
                    </div>

                    {/* Quick One-Tap Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                      {/* Copy Link */}
                      <button
                        onClick={() => handleCopyLink(inv)}
                        className="p-2 rounded-xl border border-gray-200 text-charcoal-muted hover:text-maroon hover:bg-white text-xs inline-flex items-center gap-1 transition-colors"
                        title="Copy personal invite link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">
                          {copiedId === inv.id ? "Copied!" : "Copy Link"}
                        </span>
                      </button>

                      {/* WhatsApp Deep Link */}
                      {inv.mobile && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleTrackSend(inv.token, "sent_whatsapp")}
                          className="p-2 px-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs inline-flex items-center gap-1 transition-colors"
                          title="Send via WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </a>
                      )}

                      {/* SMS Deep Link */}
                      {inv.mobile && (
                        <a
                          href={smsUrl}
                          onClick={() => handleTrackSend(inv.token, "sent_sms")}
                          className="p-2 px-2.5 rounded-xl bg-maroon text-white hover:bg-maroon-700 text-xs inline-flex items-center gap-1 transition-colors"
                          title="Send via SMS"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">SMS</span>
                        </a>
                      )}

                      {/* View Invitation Page */}
                      <a
                        href={`/i/${inv.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-gray-200 text-charcoal-light hover:text-charcoal hover:bg-white"
                        title="Open invitee view"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
