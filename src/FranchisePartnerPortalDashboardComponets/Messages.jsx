import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaComments,
  FaSearch,
  FaPaperPlane,
  FaBuilding,
  FaCheckDouble,
  FaCheckCircle,
  FaTimes,
  FaInbox,
  FaSpinner,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// Customer enquiries that Head Office assigned to THIS franchise.
// The backend only returns your own franchise's messages.
const MESSAGES_URL = "admin/contact-messages/";

const FILTERS = ["All", "Awaiting reply", "Replied", "Resolved"];

// =========================================================
// HELPERS
// =========================================================

// Backend status -> label shown to the franchise
const statusLabel = (status) => {
  switch (status) {
    case "Replied":
      return "Replied";
    case "Closed":
      return "Resolved";
    default:
      return "Awaiting reply";
  }
};

const badgeStyle = (label) => {
  switch (label) {
    case "Replied":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-teal-50 text-teal-700 border-teal-200";
  }
};

// DRF returns a plain array, or { results: [...] } when pagination is on.
const unwrapList = (data) =>
  Array.isArray(data) ? data : data?.results ?? [];

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

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initials = (name) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

// =========================================================
// PAGE
// =========================================================

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showMobileConversation, setShowMobileConversation] =
    useState(false);

  // =========================================================
  // FETCH ASSIGNED ENQUIRIES
  // =========================================================

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(MESSAGES_URL);
      const list = unwrapList(response.data);

      setMessages(list);

      // Keep the current selection if it still exists,
      // otherwise select the newest enquiry.
      setSelectedId((current) => {
        if (current && list.some((item) => item.id === current)) {
          return current;
        }

        return list.length > 0 ? list[0].id : null;
      });
    } catch (err) {
      console.error("Error fetching enquiries:", err);

      setError(
        getErrorMessage(err, "Unable to load customer enquiries.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const selectedMessage = useMemo(
    () => messages.find((item) => item.id === selectedId) || null,
    [messages, selectedId]
  );

  const replaceMessage = (updated) => {
    setMessages((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        activeFilter === "All" ||
        statusLabel(message.status) === activeFilter;

      const matchesSearch =
        !query ||
        String(message.name || "").toLowerCase().includes(query) ||
        String(message.email || "").toLowerCase().includes(query) ||
        String(message.service_display || "")
          .toLowerCase()
          .includes(query) ||
        String(message.message || "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [messages, search, activeFilter]);

  const awaitingCount = messages.filter(
    (message) => statusLabel(message.status) === "Awaiting reply"
  ).length;

  // =========================================================
  // SELECT MESSAGE
  // =========================================================

  const handleSelectMessage = (message) => {
    setSelectedId(message.id);
    setReplyInput("");
    setNotice("");
    setError("");
    setShowMobileConversation(true);
  };

  // =========================================================
  // SEND REPLY  (saved + emailed to the customer)
  // =========================================================

  const handleSendReply = async (e) => {
    e.preventDefault();

    const text = replyInput.trim();

    if (!text || !selectedMessage || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");
      setNotice("");

      const response = await api.post(
        `${MESSAGES_URL}${selectedMessage.id}/reply/`,
        { reply_message: text }
      );

      const { email_sent, ...updated } = response.data;

      replaceMessage(updated);
      setReplyInput("");

      setNotice(
        email_sent
          ? `Your reply was emailed to ${updated.email}.`
          : `Your reply was saved, but the email to ${updated.email} could not be delivered. Please contact them directly.`
      );
    } catch (err) {
      console.error("Error sending reply:", err);

      setError(getErrorMessage(err, "Unable to send your reply."));
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // MARK RESOLVED
  // =========================================================

  const handleResolve = async () => {
    if (!selectedMessage || resolving) return;

    try {
      setResolving(true);
      setError("");
      setNotice("");

      const response = await api.post(
        `${MESSAGES_URL}${selectedMessage.id}/resolve/`
      );

      replaceMessage(response.data);
    } catch (err) {
      console.error("Error resolving enquiry:", err);

      setError(
        getErrorMessage(err, "Unable to mark this enquiry resolved.")
      );
    } finally {
      setResolving(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  const selectedLabel = selectedMessage
    ? statusLabel(selectedMessage.status)
    : "";

  const canReply =
    selectedMessage &&
    !selectedMessage.reply_message &&
    selectedLabel !== "Resolved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FaComments
              style={{ color: BRAND_COLOR }}
              className="text-lg"
            />

            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
              Customer Enquiries
            </h3>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Enquiries Head Office has assigned to your franchise. Your
            reply is emailed straight to the customer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
            <FaBuilding className="inline mr-1" />
            Assigned by Head Office
          </span>

          {awaitingCount > 0 && (
            <span className="text-xs font-bold text-white bg-teal-600 px-3 py-1.5 rounded-xl">
              {awaitingCount} awaiting reply
            </span>
          )}

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-teal-700 hover:border-teal-200 transition disabled:opacity-50"
            title="Refresh enquiries"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR / NOTICE
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <FaExclamationCircle className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-semibold">Something went wrong</p>

            <p className="text-xs mt-0.5">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <FaCheckCircle className="mt-0.5 shrink-0" />

          <p className="flex-1 text-xs font-semibold">{notice}</p>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-teal-500 hover:text-teal-800"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm min-h-150">
        {/* ===================================================
            LEFT SIDE — INBOX
        ==================================================== */}

        <div
          className={`lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
            showMobileConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search */}

          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search enquiries..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:border-teal-600 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                    activeFilter === filter
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Inbox title */}

          <div className="px-4 py-3 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaInbox
                  style={{ color: BRAND_COLOR }}
                  className="text-sm"
                />

                <span className="text-xs font-black text-slate-800">
                  Franchise Inbox
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-400">
                {filteredMessages.length} enquiries
              </span>
            </div>
          </div>

          {/* Enquiry list */}

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FaSpinner className="animate-spin text-xl mb-3" />

                <p className="text-xs">Loading enquiries...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center px-6 py-16 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                  <FaInbox />
                </div>

                <p className="text-sm font-bold text-slate-700">
                  No enquiries found
                </p>

                <p className="text-xs mt-1">
                  Enquiries that Head Office assigns to your franchise
                  will appear here.
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const isSelected = selectedId === message.id;
                const label = statusLabel(message.status);
                const isAwaiting = label === "Awaiting reply";

                return (
                  <button
                    type="button"
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full text-left p-4 flex items-start gap-3 cursor-pointer transition border-l-4 ${
                      isSelected
                        ? "bg-teal-50/70 border-teal-600"
                        : "border-transparent hover:bg-slate-100/60"
                    }`}
                  >
                    {/* Avatar */}

                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center text-xs">
                        {initials(message.name)}
                      </div>

                      {isAwaiting && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-600 border-2 border-white" />
                      )}
                    </div>

                    {/* Preview */}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={`text-xs truncate ${
                            isAwaiting
                              ? "font-black text-slate-900"
                              : "font-bold text-slate-700"
                          }`}
                        >
                          {message.name}
                        </h5>

                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatDate(
                            message.assigned_at || message.created_at
                          )}
                        </span>
                      </div>

                      <p className="text-[10px] text-teal-700 font-semibold mt-0.5 truncate">
                        {message.service_display}
                      </p>

                      <p
                        className={`text-xs truncate mt-1 ${
                          isAwaiting
                            ? "text-slate-700 font-semibold"
                            : "text-slate-500"
                        }`}
                      >
                        {message.message}
                      </p>

                      <span
                        className={`inline-block mt-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${badgeStyle(
                          label
                        )}`}
                      >
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE — CONVERSATION
        ==================================================== */}

        <div
          className={`lg:col-span-8 flex flex-col bg-white ${
            !showMobileConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          {!selectedMessage ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <FaComments className="text-2xl" />
              </div>

              <h4 className="text-base font-black text-slate-800">
                Select an enquiry
              </h4>

              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Select an enquiry from the inbox to read it and reply to
                the customer.
              </p>
            </div>
          ) : (
            <>
              {/* ===========================================
                  CHAT HEADER
              ============================================ */}

              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile back */}

                  <button
                    type="button"
                    onClick={() => setShowMobileConversation(false)}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <FaTimes />
                  </button>

                  <div className="w-10 h-10 shrink-0 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center text-xs">
                    {initials(selectedMessage.name)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-sm truncate">
                      {selectedMessage.name}
                    </h4>

                    <span className="block text-[10px] text-teal-600 font-semibold truncate">
                      {selectedMessage.email}
                      {selectedMessage.phone
                        ? ` · ${selectedMessage.phone}`
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`hidden sm:inline-block rounded-full border px-2.5 py-1 text-[9px] font-bold ${badgeStyle(
                      selectedLabel
                    )}`}
                  >
                    {selectedLabel}
                  </span>

                  {selectedLabel !== "Resolved" && (
                    <button
                      type="button"
                      onClick={handleResolve}
                      disabled={resolving}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      title="Mark this enquiry as resolved"
                    >
                      <FaCheckCircle />

                      <span className="hidden sm:inline">
                        {resolving ? "Saving..." : "Mark resolved"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* ===========================================
                  SUBJECT
              ============================================ */}

              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Enquiry about
                </p>

                <h3 className="text-sm font-black text-slate-900 mt-1">
                  {selectedMessage.service_display}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-400">
                  <span>
                    Received {formatDate(selectedMessage.created_at)}
                  </span>

                  <span>•</span>

                  <span>{formatTime(selectedMessage.created_at)}</span>

                  {selectedMessage.assigned_at && (
                    <>
                      <span>•</span>

                      <span>
                        Assigned{" "}
                        {formatDate(selectedMessage.assigned_at)}
                        {selectedMessage.assigned_by_name
                          ? ` by ${selectedMessage.assigned_by_name}`
                          : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* ===========================================
                  MESSAGE STREAM
              ============================================ */}

              <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
                {/* Customer's message */}

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[9px] font-black">
                      {initials(selectedMessage.name)}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-700">
                        {selectedMessage.name}
                      </p>

                      <p className="text-[9px] text-slate-400">
                        {formatTime(selectedMessage.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 shadow-sm">
                    <p className="text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* The franchise's reply */}

                {selectedMessage.reply_message && (
                  <div className="mt-5 flex flex-col items-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-teal-600 text-white px-4 py-3 text-xs shadow-sm">
                      <p className="whitespace-pre-wrap leading-6">
                        {selectedMessage.reply_message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                      <span>
                        {selectedMessage.replied_by_name || "You"} ·{" "}
                        {formatDate(selectedMessage.replied_at)}{" "}
                        {formatTime(selectedMessage.replied_at)}
                      </span>

                      <FaCheckDouble style={{ color: BRAND_COLOR }} />
                    </div>
                  </div>
                )}
              </div>

              {/* ===========================================
                  REPLY INPUT
              ============================================ */}

              {canReply ? (
                <form
                  onSubmit={handleSendReply}
                  className="p-3 border-t border-slate-200 bg-white"
                >
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={3}
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Reply to ${selectedMessage.name}...`}
                      maxLength={5000}
                      disabled={sending}
                      className="flex-1 resize-y py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs leading-5 text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white transition disabled:opacity-60"
                    />

                    <button
                      type="submit"
                      disabled={sending || !replyInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <FaSpinner className="animate-spin text-[10px]" />
                      ) : (
                        <FaPaperPlane className="text-[10px]" />
                      )}

                      <span className="hidden sm:inline">
                        {sending ? "Sending..." : "Send reply"}
                      </span>
                    </button>
                  </div>

                  <p className="text-[9px] text-slate-400 mt-2 px-1">
                    Your reply is emailed to {selectedMessage.email}.
                  </p>
                </form>
              ) : (
                <div className="p-4 border-t border-slate-200 bg-white text-center text-[11px] text-slate-400">
                  {selectedMessage.reply_message
                    ? "You have replied to this enquiry."
                    : "This enquiry has been resolved."}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}