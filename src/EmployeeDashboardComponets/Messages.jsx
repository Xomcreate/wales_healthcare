import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaPlus,
  FaSpinner,
  FaExclamationCircle,
  FaTimes,
  FaInbox,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const TICKETS_URL = "support/tickets/";

// Swap these for your real backend choices if different.
const CATEGORY_OPTIONS = ["General", "Payroll", "Scheduling", "Certification", "Other"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

// =========================================================
// HELPERS
// =========================================================

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results ?? []);

const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data;

  if (data && typeof data === "object") {
    if (data.detail) return data.detail;

    const first = Object.values(data)[0];

    if (Array.isArray(first) && first[0]) return String(first[0]);
    if (typeof first === "string") return first;
  }

  return fallback;
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const isToday = date.toDateString() === new Date().toDateString();

  return isToday
    ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const statusBadge = (status) => {
  switch (status) {
    case "In Progress":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-teal-50 text-teal-700 border-teal-200"; // Open
  }
};

// The support side (franchise) sent this message, vs the employee.
const isFromMe = (message) => message.sender_role === "employee";

const senderLabel = (message) =>
  message.sender_name ||
  [message.sender?.first_name, message.sender?.last_name].filter(Boolean).join(" ") ||
  (isFromMe(message) ? "You" : "Franchise office");

// =========================================================
// PAGE
// =========================================================

export default function Messages() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [replyInput, setReplyInput] = useState("");

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [showMobileConversation, setShowMobileConversation] = useState(false);

  // New ticket form
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORY_OPTIONS[0]);
  const [newPriority, setNewPriority] = useState(PRIORITY_OPTIONS[0]);
  const [newDescription, setNewDescription] = useState("");

  const bottomRef = useRef(null);

  // =========================================================
  // FETCH TICKET LIST
  // =========================================================

  const fetchTickets = useCallback(async () => {
    try {
      setLoadingList(true);
      setError("");

      const response = await api.get(TICKETS_URL, {
        params: { channel: "employee" },
      });

      const list = unwrapList(response.data);

      setTickets(list);

      setSelectedId((current) => {
        if (current && list.some((item) => item.id === current)) return current;
        return list.length > 0 ? list[0].id : null;
      });
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(getErrorMessage(err, "Unable to load your messages."));
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // =========================================================
  // FETCH SELECTED TICKET DETAIL (with message thread)
  // =========================================================

  const fetchTicketDetail = useCallback(async (id) => {
    if (!id) {
      setSelectedTicket(null);
      return;
    }

    try {
      setLoadingDetail(true);
      setError("");

      const response = await api.get(`${TICKETS_URL}${id}/`);

      setSelectedTicket(response.data);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError(getErrorMessage(err, "Unable to load this conversation."));
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    fetchTicketDetail(selectedId);
  }, [selectedId, fetchTicketDetail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  const messages = useMemo(
    () => selectedTicket?.messages ?? [],
    [selectedTicket]
  );

  // =========================================================
  // SELECT TICKET
  // =========================================================

  const handleSelectTicket = (ticket) => {
    setSelectedId(ticket.id);
    setReplyInput("");
    setError("");
    setShowMobileConversation(true);
  };

  // =========================================================
  // SEND REPLY
  // =========================================================

  const handleSendReply = async (e) => {
    e.preventDefault();

    const text = replyInput.trim();

    if (!text || !selectedId || sending) return;

    try {
      setSending(true);
      setError("");

      const response = await api.post(`${TICKETS_URL}${selectedId}/reply/`, {
        message: text,
      });

      setSelectedTicket(response.data);
      setReplyInput("");

      // Keep the list (status/updated_at) in sync without a full refetch
      setTickets((current) =>
        current.map((item) => (item.id === response.data.id ? response.data : item))
      );
    } catch (err) {
      console.error("Error sending reply:", err);
      setError(getErrorMessage(err, "Unable to send your message."));
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // CREATE NEW TICKET
  // =========================================================

  const resetNewTicketForm = () => {
    setNewSubject("");
    setNewCategory(CATEGORY_OPTIONS[0]);
    setNewPriority(PRIORITY_OPTIONS[0]);
    setNewDescription("");
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!newSubject.trim() || !newDescription.trim() || creating) return;

    try {
      setCreating(true);
      setError("");

      const response = await api.post(TICKETS_URL, {
        subject: newSubject.trim(),
        category: newCategory,
        priority: newPriority,
        description: newDescription.trim(),
      });

      setTickets((current) => [response.data, ...current]);
      setSelectedId(response.data.id);
      setSelectedTicket(response.data);

      setShowNewTicket(false);
      resetNewTicketForm();
      setShowMobileConversation(true);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(getErrorMessage(err, "Unable to send your request."));
    } finally {
      setCreating(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 relative pb-10">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2">
          <FaComments style={{ color: BRAND_COLOR }} className="text-lg" />

          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
              Messages
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Send a request to your franchise office and track replies here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
            style={{ background: BRAND_COLOR }}
          >
            <FaPlus className="text-[10px]" />
            New message
          </button>

          <button
            type="button"
            onClick={fetchTickets}
            disabled={loadingList}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-teal-700 hover:border-teal-200 transition disabled:opacity-50"
            title="Refresh"
          >
            <FaSyncAlt className={loadingList ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <FaExclamationCircle className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-semibold">Something went wrong</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>

          <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
      )}

      {/* NEW TICKET FORM */}

      {showNewTicket && (
        <form
          onSubmit={handleCreateTicket}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">New message to your franchise</h4>

            <button
              type="button"
              onClick={() => {
                setShowNewTicket(false);
                resetNewTicketForm();
              }}
              className="text-slate-400 hover:text-slate-700"
            >
              <FaTimes />
            </button>
          </div>

          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject"
            maxLength={200}
            disabled={creating}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium focus:border-teal-500 focus:outline-none disabled:opacity-60"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={creating}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium focus:border-teal-500 focus:outline-none disabled:opacity-60"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              disabled={creating}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium focus:border-teal-500 focus:outline-none disabled:opacity-60"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Describe what you need..."
            maxLength={5000}
            disabled={creating}
            className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-5 font-medium focus:border-teal-500 focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={creating || !newSubject.trim() || !newDescription.trim()}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
            style={{ background: BRAND_COLOR }}
          >
            {creating ? <FaSpinner className="animate-spin text-[10px]" /> : <FaPaperPlane className="text-[10px]" />}
            {creating ? "Sending..." : "Send"}
          </button>
        </form>
      )}

      {/* MAIN AREA */}

      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm min-h-150">
        {/* LEFT — TICKET LIST */}

        <div
          className={`lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
            showMobileConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaInbox style={{ color: BRAND_COLOR }} className="text-sm" />
              <span className="text-xs font-black text-slate-800">Your Messages</span>
            </div>

            <span className="text-[10px] font-bold text-slate-400">{tickets.length}</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {loadingList ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FaSpinner className="animate-spin text-xl mb-3" />
                <p className="text-xs">Loading...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center px-6 py-16 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                  <FaInbox />
                </div>

                <p className="text-sm font-bold text-slate-700">No messages yet</p>
                <p className="text-xs mt-1">Start a new message to reach your franchise office.</p>
              </div>
            ) : (
              tickets.map((ticket) => {
                const isSelected = selectedId === ticket.id;

                return (
                  <button
                    type="button"
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full text-left p-4 flex flex-col gap-1 cursor-pointer transition border-l-4 ${
                      isSelected
                        ? "bg-teal-50/70 border-teal-600"
                        : "border-transparent hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-black text-slate-900 truncate">{ticket.subject}</h5>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTime(ticket.updated_at || ticket.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>

                      {ticket.category && (
                        <span className="text-[9px] text-slate-400">{ticket.category}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT — CONVERSATION */}

        <div
          className={`lg:col-span-8 flex flex-col bg-white ${
            !showMobileConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <FaComments className="text-2xl" />
              </div>

              <h4 className="text-base font-black text-slate-800">Select a message</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Choose a conversation from the list, or start a new one.
              </p>
            </div>
          ) : loadingDetail && !selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <FaSpinner className="animate-spin text-xl mb-3" />
              <p className="text-xs">Loading conversation...</p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}

              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowMobileConversation(false)}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <FaTimes />
                  </button>

                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-sm truncate">
                      {selectedTicket?.subject}
                    </h4>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {selectedTicket?.reference ? `${selectedTicket.reference} · ` : ""}
                      {selectedTicket?.category}
                    </span>
                  </div>
                </div>

                {selectedTicket?.status && (
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusBadge(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>
                )}
              </div>

              {/* MESSAGE STREAM */}

              <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No messages yet.</p>
                ) : (
                  messages.map((message) => {
                    const mine = isFromMe(message);

                    return (
                      <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col ${mine ? "items-end" : "items-start"} max-w-[80%]`}>
                          <span className="text-[9px] text-slate-400 mb-1 px-1">
                            {senderLabel(message)} · {formatTime(message.created_at)}
                          </span>

                          <div
                            className={`rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm ${
                              mine
                                ? "rounded-br-sm text-white"
                                : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
                            }`}
                            style={mine ? { background: BRAND_COLOR } : {}}
                          >
                            <p className="whitespace-pre-wrap leading-6">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* REPLY INPUT */}

              <form onSubmit={handleSendReply} className="flex items-end gap-2 border-t border-slate-100 px-5 py-4">
                <textarea
                  rows={2}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={5000}
                  disabled={sending}
                  className="flex-1 resize-y rounded-xl border border-slate-200 px-4 py-2.5 text-xs leading-5 font-medium focus:border-teal-500 focus:outline-none disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={sending || !replyInput.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition active:scale-95 disabled:opacity-50"
                  style={{ background: BRAND_COLOR }}
                >
                  {sending ? <FaSpinner className="animate-spin text-xs" /> : <FaPaperPlane className="text-xs" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}