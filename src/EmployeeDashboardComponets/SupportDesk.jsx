import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaHeadset,
  FaPhoneAlt,
  FaEnvelope,
  FaEye,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // adjust the path if this page lives elsewhere

const BRAND_COLOR = "#0d9488";

// These are still hard-coded for one office. To make them per-franchise,
// add phone/email fields to the Franchise model and read them from auth/me/.
const FRANCHISE_CONTACT = {
  phone: "(416) 555-0134",
  hours: "Mon–Fri, 8am–6pm",
  hrEmail: "hr.torontowest@waleshealthcare.com",
};

const CATEGORIES = [
  "Administrative",
  "Staff Management",
  "Care Coordination",
  "Technical",
  "Other",
];
const PRIORITIES = ["Low", "Medium", "High"];

const STATUS_BADGES = {
  Open: "bg-amber-50 text-amber-700",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Pending: "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

const EMPTY_FORM = {
  subject: "",
  category: "Administrative",
  priority: "Medium",
  description: "",
};

const toList = (data) => (Array.isArray(data) ? data : data?.results ?? []);

const errorMessage = (err, fallback) => {
  const data = err?.response?.data;
  if (!data || typeof data === "string") return fallback;
  if (data.detail) return data.detail;
  const first = Object.values(data)[0];
  return (Array.isArray(first) ? first[0] : first) || fallback;
};

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const fieldClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-medium focus:border-teal-500 focus:outline-none";

// -------------------------------------------------------
// EMPLOYEE SUPPORT DESK
//   Employee -> Franchise. POST /support/tickets/ with no
//   channel/franchise in the body — the backend infers
//   channel="employee" and the requester's own franchise
//   from the authenticated user's role/profile.
// -------------------------------------------------------
export default function EmployeeSupportDesk() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [sentReference, setSentReference] = useState("");

  const [activeTicket, setActiveTicket] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState("");

  const messagesEndRef = useRef(null);

  // -------------------------------------------------------
  // LOAD MY REQUESTS
  // -------------------------------------------------------
  const loadTickets = useCallback(async () => {
    try {
      const { data } = await api.get("support/tickets/", {
        params: { channel: "employee" },
      });
      setTickets(toList(data));
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Could not load your support requests."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.messages?.length]);

  // -------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormError("");
    setSentReference("");
    try {
      // Franchise is taken from the logged-in account on the server
      const { data } = await api.post("support/tickets/", form);
      setTickets((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setSentReference(data.reference);
    } catch (err) {
      setFormError(errorMessage(err, "Could not send your request. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const syncTicket = (updated) => {
    setActiveTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const openTicket = async (ticket) => {
    setActionError("");
    setActiveTicket({ ...ticket, messages: [] });
    setDrawerLoading(true);
    try {
      const { data } = await api.get(`support/tickets/${ticket.id}/`);
      setActiveTicket(data);
    } catch (err) {
      setActiveTicket(null);
      setLoadError(errorMessage(err, "Could not open this request."));
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket || sending) return;

    setSending(true);
    setActionError("");
    try {
      const { data } = await api.post(`support/tickets/${activeTicket.id}/reply/`, {
        message: replyMessage.trim(),
      });
      syncTicket(data);
      setReplyMessage("");
    } catch (err) {
      setActionError(errorMessage(err, "Could not send your reply."));
    } finally {
      setSending(false);
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-10 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-md"
          style={{ background: BRAND_COLOR }}
        >
          <FaHeadset />
        </div>
        <h3 className="text-lg font-black text-slate-900">Need something?</h3>
        <p className="max-w-md text-xs text-slate-500">
          Reach your franchise office for scheduling issues, HR questions, or anything else.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <FaPhoneAlt className="mb-2 text-base" style={{ color: BRAND_COLOR }} />
          <p className="text-sm font-bold text-slate-800">Call Your Franchise Office</p>
          <p className="text-xs text-slate-400">
            {FRANCHISE_CONTACT.phone} · {FRANCHISE_CONTACT.hours}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <FaEnvelope className="mb-2 text-base" style={{ color: BRAND_COLOR }} />
          <p className="text-sm font-bold text-slate-800">Email HR</p>
          <p className="text-xs text-slate-400">{FRANCHISE_CONTACT.hrEmail}</p>
        </div>
      </div>

      {/* SEND A REQUEST */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
      >
        <h4 className="mb-4 text-sm font-black text-slate-900">Send a Support Request</h4>

        {sentReference && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            Request sent to your franchise office. Your reference is {sentReference}.
          </div>
        )}
        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {formError}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            required
            maxLength={255}
            placeholder="Subject (e.g. Shift swap for Friday)"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={fieldClass}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={fieldClass}
              aria-label="Category"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className={fieldClass}
              aria-label="Priority"
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <textarea
            rows={4}
            required
            placeholder="Describe your issue..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          style={{ background: BRAND_COLOR }}
        >
          {submitting ? "Sending..." : "Submit Request"}
        </button>
      </form>

      {/* MY REQUESTS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 text-sm font-black text-slate-900">My Requests</h4>

        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {loadError}
          </div>
        )}

        {loading ? (
          <p className="py-6 text-center text-xs text-slate-400">Loading your requests...</p>
        ) : tickets.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            You haven't sent any requests yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">{ticket.subject}</p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    {ticket.reference} • {ticket.category} • {formatDateTime(ticket.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      STATUS_BADGES[ticket.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <button
                    onClick={() => openTicket(ticket)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <FaEye className="text-xs" /> View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= CONVERSATION DRAWER ================= */}
      <AnimatePresence>
        {activeTicket && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTicket(null)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          />
        )}
        {activeTicket && (
          <motion.div
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                  {activeTicket.reference} • {activeTicket.category}
                </p>
                <h4 className="truncate text-sm font-black sm:text-base">{activeTicket.subject}</h4>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs">
              <div className="min-w-0 truncate">
                <span className="text-[10px] font-bold uppercase text-slate-400">Handled by: </span>
                <span className="font-semibold text-slate-800">
                  {activeTicket.assigned_to_name || "Awaiting assignment"}
                </span>
              </div>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 font-bold ${
                  STATUS_BADGES[activeTicket.status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {activeTicket.status}
              </span>
            </div>

            {actionError && (
              <div className="border-b border-rose-200 bg-rose-50 px-5 py-2 text-xs font-semibold text-rose-700">
                {actionError}
              </div>
            )}

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-5">
              {drawerLoading && activeTicket.messages.length === 0 && (
                <p className="text-center text-xs text-slate-400">Loading conversation...</p>
              )}

              {activeTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1 ${msg.is_mine ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 px-1 text-[10px] font-bold text-slate-400">
                    <span>
                      {msg.sender_name} ({msg.sender_role_label})
                    </span>
                    <span>•</span>
                    <span>{formatDateTime(msg.created_at)}</span>
                  </div>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                      msg.is_mine
                        ? "rounded-tr-xs text-white"
                        : "rounded-tl-xs border border-slate-200 bg-white text-slate-800"
                    }`}
                    style={msg.is_mine ? { background: BRAND_COLOR } : undefined}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendReply}
              className="flex items-center gap-2 border-t border-slate-200 bg-white p-4"
            >
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-teal-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !replyMessage.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                style={{ background: BRAND_COLOR }}
                aria-label="Send reply"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}