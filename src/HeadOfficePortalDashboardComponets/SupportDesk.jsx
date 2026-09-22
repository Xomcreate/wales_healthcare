import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaPlus, FaTimes, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // adjust the path if this page lives elsewhere

const CATEGORIES = [
  "Technical",
  "Compliance",
  "Financial",
  "Administrative",
  "Care Coordination",
  "Staff Management",
  "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const STATUSES = ["Open", "In Progress", "Pending", "Resolved"];

const PRIORITY_BADGES = {
  Urgent: "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20",
  High: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
  Medium: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20",
  Low: "bg-slate-100 text-slate-700",
};

const STATUS_BADGES = {
  Open: "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20",
  "In Progress": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
  Resolved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
};

const EMPTY_TICKET = {
  franchise: "",
  subject: "",
  category: "Technical",
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

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeTicket, setActiveTicket] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState(EMPTY_TICKET);

  const messagesEndRef = useRef(null);

  // -------------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------------
  const loadTickets = useCallback(async () => {
    try {
      const { data } = await api.get("support/tickets/", {
        params: { channel: "franchise" },
      });
      setTickets(toList(data));
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Could not load support tickets."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();

    api
      .get("admin/franchises/")
      .then(({ data }) =>
        setFranchises(toList(data).filter((f) => f.is_active !== false))
      )
      .catch(() => {});

    api
      .get("support/agents/")
      .then(({ data }) => setAgents(toList(data)))
      .catch(() => {});
  }, [loadTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.messages?.length]);

  // -------------------------------------------------------
  // DERIVED DATA
  // -------------------------------------------------------
  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tickets.filter((t) => {
      const matchesSearch =
        !q ||
        [t.reference, t.subject, t.franchise_name, t.requester_name].some((v) =>
          (v || "").toLowerCase().includes(q)
        );
      const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchQuery, selectedStatus, selectedCategory]);

  const stats = useMemo(
    () =>
      Object.fromEntries(
        STATUSES.map((s) => [s, tickets.filter((t) => t.status === s).length])
      ),
    [tickets]
  );

  // -------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------
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
      setActionError(errorMessage(err, "Could not open this ticket."));
    } finally {
      setDrawerLoading(false);
    }
  };

  const updateActiveTicket = async (payload) => {
    if (!activeTicket) return;
    setActionError("");
    try {
      const { data } = await api.patch(`support/tickets/${activeTicket.id}/`, payload);
      syncTicket(data);
    } catch (err) {
      setActionError(errorMessage(err, "Could not update this ticket."));
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

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);
    setActionError("");
    try {
      const { data } = await api.post("support/tickets/", {
        ...newTicket,
        franchise: Number(newTicket.franchise),
      });
      setTickets((prev) => [data, ...prev]);
      setIsNewTicketModalOpen(false);
      setNewTicket(EMPTY_TICKET);
    } catch (err) {
      setActionError(errorMessage(err, "Could not create the ticket."));
    } finally {
      setCreating(false);
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
            Head Office Assistance
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Support Desk & Franchise Assistance
          </h1>
          <p className="text-xs text-slate-500">
            Answer support requests sent by franchises, resolve compliance escalations, and
            keep every conversation in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActionError("");
            setIsNewTicketModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
        >
          <FaPlus className="text-xs" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {(loadError || (actionError && !activeTicket && !isNewTicketModalOpen)) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {loadError || actionError}
        </div>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open", value: stats.Open, tone: "text-teal-600", note: "Awaiting head office" },
          { label: "In Progress", value: stats["In Progress"], tone: "text-indigo-600", note: "Being resolved" },
          { label: "Pending", value: stats.Pending, tone: "text-amber-600", note: "Waiting on the franchise" },
          { label: "Resolved", value: stats.Resolved, tone: "text-emerald-600", note: "Closed tickets" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <h3 className={`mt-1 text-xl font-black ${card.tone}`}>{card.value}</h3>
            <p className="mt-1 text-[11px] text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, franchise, requester, or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 focus:border-teal-500 focus:outline-none"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {["All", ...STATUSES].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Ticket ID & Date</th>
                <th className="px-6 py-3.5">Franchise Branch</th>
                <th className="px-6 py-3.5">Subject & Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Assigned Agent</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading support tickets...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicket(ticket)}
                    className="cursor-pointer transition hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 font-mono">
                      <p className="font-bold text-slate-900">{ticket.reference}</p>
                      <p className="text-[10px] text-slate-400">{formatDateTime(ticket.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ticket.franchise_name}</p>
                      <p className="text-[10px] text-slate-400">Raised by {ticket.requester_name || "Unknown"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ticket.subject}</p>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-teal-600">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.Low
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {ticket.assigned_to_name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          STATUS_BADGES[ticket.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    {tickets.length === 0
                      ? "No franchise has sent a support request yet."
                      : "No support tickets match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RAISE NEW TICKET MODAL ================= */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewTicketModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg space-y-6 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Head Office Assistance Desk
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Raise Support Ticket</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              {actionError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold uppercase tracking-wider text-slate-700">
                    Franchise Branch
                  </label>
                  <select
                    required
                    value={newTicket.franchise}
                    onChange={(e) => setNewTicket({ ...newTicket, franchise: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select a franchise...</option>
                    {franchises.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-bold uppercase tracking-wider text-slate-700">
                    Subject / Issue Summary
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={255}
                    placeholder="e.g. Invoice discrepancy or compliance document query"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className={selectClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-bold uppercase tracking-wider text-slate-700">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className={selectClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-bold uppercase tracking-wider text-slate-700">
                      Priority Level
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className={selectClass}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-bold uppercase tracking-wider text-slate-700">
                    Detailed Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Provide full details regarding the assistance required..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className={selectClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-teal-500 active:scale-95 disabled:opacity-60"
                  >
                    <FaPaperPlane className="text-xs" />
                    <span>{creating ? "Submitting..." : "Submit Ticket"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= TICKET CONVERSATION DRAWER ================= */}
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
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                  {activeTicket.reference} • {activeTicket.category}
                </p>
                <h4 className="truncate text-sm font-black sm:text-base">{activeTicket.subject}</h4>
                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  {activeTicket.franchise_name} • raised by {activeTicket.requester_name || "Unknown"} •{" "}
                  {formatDateTime(activeTicket.created_at)}
                </p>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs sm:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
                <select
                  value={activeTicket.status}
                  onChange={(e) => updateActiveTicket({ status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-800 focus:border-teal-500 focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Priority</span>
                <select
                  value={activeTicket.priority}
                  onChange={(e) => updateActiveTicket({ priority: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-800 focus:border-teal-500 focus:outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Assigned to</span>
                <select
                  value={activeTicket.assigned_to ?? ""}
                  onChange={(e) =>
                    updateActiveTicket({
                      assigned_to: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-800 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {actionError && (
              <div className="border-b border-rose-200 bg-rose-50 px-5 py-2 text-xs font-semibold text-rose-700">
                {actionError}
              </div>
            )}

            {/* Messages */}
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
                        ? "rounded-tr-xs bg-teal-600 text-white"
                        : "rounded-tl-xs border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply */}
            <form
              onSubmit={handleSendReply}
              className="flex items-center gap-2 border-t border-slate-200 bg-white p-4"
            >
              <input
                type="text"
                placeholder="Type your response..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-teal-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !replyMessage.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
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