import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaTimes,
  FaHeadset,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
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

// customer = requests from your customers (you answer)
// employee  = requests from your staff (you answer)
// franchise = requests you sent to head office (they answer)
const TABS = [
  { key: "customer", label: "Customer Requests" },
  { key: "employee", label: "Staff Requests" },
  { key: "franchise", label: "Head Office Support" },
];

const PRIORITY_BADGES = {
  Urgent: "bg-rose-50 text-rose-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

const STATUS_BADGES = {
  Open: "bg-amber-50 text-amber-700",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Pending: "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

const EMPTY_TICKET = {
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

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition";

export default function SupportDesk() {
  const [tickets, setTickets] = useState([]); // both channels
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [activeTab, setActiveTab] = useState("customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [activeTicket, setActiveTicket] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState(EMPTY_TICKET);

  const messagesEndRef = useRef(null);

  // You answer customer and staff requests; head office answers yours.
  const canManage = activeTab !== "franchise";

  // -------------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------------
  const loadTickets = useCallback(async () => {
    try {
      const [customerRes, employeeRes, headOfficeRes] = await Promise.all([
        api.get("support/tickets/", { params: { channel: "customer" } }),
        api.get("support/tickets/", { params: { channel: "employee" } }),
        api.get("support/tickets/", { params: { channel: "franchise" } }),
      ]);
      setTickets([
        ...toList(customerRes.data),
        ...toList(employeeRes.data),
        ...toList(headOfficeRes.data),
      ]);
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Could not load support tickets."));
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
  // DERIVED DATA
  // -------------------------------------------------------
  const tabTickets = useMemo(
    () => tickets.filter((t) => t.channel === activeTab),
    [tickets, activeTab]
  );

  const openCounts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((tab) => [
          tab.key,
          tickets.filter((t) => t.channel === tab.key && t.status === "Open").length,
        ])
      ),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return tabTickets.filter((t) => {
      const matchesSearch =
        !q ||
        [t.reference, t.subject, t.requester_name, t.assigned_to_name].some((v) =>
          (v || "").toLowerCase().includes(q)
        );
      const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tabTickets, searchTerm, selectedStatus]);

  const count = (status) => tabTickets.filter((t) => t.status === status).length;

  const personLabel = canManage ? "Requester" : "Handled by";
  const personOf = (t) =>
    canManage
      ? t.requester_name || (t.channel === "employee" ? "Staff member" : "Customer")
      : t.assigned_to_name || "Awaiting assignment";

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

  const handleStatusChange = async (status) => {
    if (!activeTicket) return;
    setActionError("");
    try {
      const { data } = await api.patch(`support/tickets/${activeTicket.id}/`, { status });
      syncTicket(data);
    } catch (err) {
      setActionError(errorMessage(err, "Could not update the status."));
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

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);
    setActionError("");
    try {
      // Franchise is taken from the logged-in account on the server
      const { data } = await api.post("support/tickets/", newTicket);
      setTickets((prev) => [data, ...prev]);
      setNewTicket(EMPTY_TICKET);
      setShowNewTicketModal(false);
      setActiveTab("franchise"); // show the ticket that was just sent
      setSelectedStatus("All");
    } catch (err) {
      setActionError(errorMessage(err, "Could not send your request to head office."));
    } finally {
      setCreating(false);
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative space-y-6 pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
            Support Desk & Help Center
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Answer requests from your customers and staff, and ask head office for help when you need it.
          </p>
        </div>

        <button
          onClick={() => {
            setActionError("");
            setShowNewTicketModal(true);
          }}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
        >
          <FaPlus className="text-[10px]" />
          <span>Ask Head Office for Support</span>
        </button>
      </div>

      {(loadError || (actionError && !activeTicket && !showNewTicketModal)) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {loadError || actionError}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedStatus("All");
              setSearchTerm("");
            }}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
            {openCounts[tab.key] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  activeTab === tab.key ? "bg-teal-500 text-white" : "bg-amber-100 text-amber-700"
                }`}
              >
                {openCounts[tab.key]} open
              </span>
            )}
          </button>
        ))}
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open", value: count("Open"), icon: FaExclamationCircle, tone: "bg-amber-50 text-amber-600" },
          { label: "In Progress", value: count("In Progress"), icon: FaHeadset, tone: "bg-teal-50 text-teal-600" },
          { label: "Pending", value: count("Pending"), icon: FaClock, tone: "bg-blue-50 text-blue-600" },
          { label: "Resolved", value: count("Resolved"), icon: FaCheckCircle, tone: "bg-emerald-50 text-emerald-600" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <h4 className="mt-0.5 text-lg font-black text-slate-900">{value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS: SEARCH & STATUS TABS */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, subject, or person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-2xs transition focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <span className="mr-1 flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
            <FaFilter className="text-[9px]" /> Status:
          </span>
          {["All", ...STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                selectedStatus === status
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS TABLE / LIST CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3.5">Ticket ID & Subject</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">{personLabel}</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    Loading support tickets...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{ticket.subject}</p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        {ticket.reference} • {formatDate(ticket.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{ticket.category}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">{personOf(ticket)}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                          PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.Low
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          STATUS_BADGES[ticket.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => openTicket(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <FaEye className="text-xs" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    {tabTickets.length === 0
                      ? canManage
                        ? activeTab === "employee"
                          ? "No staff member has raised a support request yet."
                          : "No customer has raised a support request yet."
                        : "You haven't sent any request to head office yet."
                      : "No support tickets match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="block divide-y divide-slate-100 md:hidden">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading support tickets...</div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold leading-snug text-slate-900">{ticket.subject}</h4>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {ticket.reference} • {formatDate(ticket.created_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      STATUS_BADGES[ticket.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">Category</p>
                    <p className="mt-0.5 font-semibold text-slate-800">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">Priority</p>
                    <p className="mt-0.5 font-semibold text-slate-800">{ticket.priority}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-slate-500">
                    {personLabel}: {personOf(ticket)}
                  </span>
                  <button
                    onClick={() => openTicket(ticket)}
                    className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"
                  >
                    <FaEye className="text-xs" /> Open Ticket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No tickets available.</div>
          )}
        </div>
      </div>

      {/* ================= ASK HEAD OFFICE MODAL ================= */}
      <AnimatePresence>
        {showNewTicketModal && (
          <motion.div
            key="new-ticket-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewTicketModal(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          />
        )}
        {showNewTicketModal && (
          <motion.div
            key="new-ticket-panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-x-4 top-10 z-50 max-h-[90vh] w-auto space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Head Office</p>
                <h4 className="text-base font-black text-slate-900">Ask Head Office for Support</h4>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            {actionError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-slate-700">Ticket Subject *</label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  placeholder="Brief description of the issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold text-slate-700">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className={fieldClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-700">Priority Level</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className={fieldClass}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-slate-700">Detailed Description *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide all relevant details to help head office resolve this quickly..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
                >
                  {creating ? "Sending..." : "Send to Head Office"}
                </button>
              </div>
            </form>
          </motion.div>
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
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                  {activeTicket.reference} • {activeTicket.category}
                </p>
                <h4 className="max-w-sm truncate text-sm font-black sm:max-w-md sm:text-base">
                  {activeTicket.subject}
                </h4>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Ticket Meta Details Bar */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs">
              <div className="min-w-0 truncate">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {activeTicket.channel !== "franchise" ? "Requester" : "Handled by"}:{" "}
                </span>
                <span className="font-semibold text-slate-800">
                  {activeTicket.channel !== "franchise"
                    ? activeTicket.requester_name || "Requester"
                    : activeTicket.assigned_to_name || "Awaiting assignment"}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Status:</span>
                {activeTicket.channel !== "franchise" ? (
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-teal-700 focus:border-teal-500 focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`rounded-md px-2 py-0.5 font-bold ${
                      STATUS_BADGES[activeTicket.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeTicket.status}
                  </span>
                )}
              </div>
            </div>

            {actionError && (
              <div className="border-b border-rose-200 bg-rose-50 px-5 py-2 text-xs font-semibold text-rose-700">
                {actionError}
              </div>
            )}

            {/* Messages Timeline */}
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

            {/* Reply Input Form */}
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
    </motion.div>
  );
}