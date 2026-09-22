import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaComments,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaReply,
  FaPaperPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCircle,
  FaClipboardList,
  FaSpinner,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// 👉 Shared axios instance. Adjust the "../" depth to match where this file lives.
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// ============================================================
// HELPERS
// ============================================================

const getInitials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const isToday = (date) => date.toDateString() === new Date().toDateString();

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const formatShortDate = (date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

// Time shown on the conversation list: time today, otherwise the date
const formatListTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return isToday(date) ? formatTime(iso) : formatShortDate(date);
};

// Time shown under a chat bubble
const formatMessageTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return isToday(date)
    ? formatTime(iso)
    : `${formatShortDate(date)}, ${formatTime(iso)}`;
};

const parseApiError = (err, fallback) => {
  const data = err?.response?.data;

  if (!data) {
    return err?.request
      ? "Could not reach the server. Check your connection and try again."
      : fallback;
  }

  if (typeof data === "string") return fallback;

  if (typeof data.detail === "string") return data.detail;

  const first = Object.values(data)[0];
  const text = Array.isArray(first) ? first[0] : first;

  return typeof text === "string" ? text : fallback;
};

// Backend statuses are "New" | "Replied" | "Resolved"
const normalizeSummary = (item) => ({
  ...item,
  status: (item.status || "").toLowerCase(),
  initials: getInitials(item.full_name),
});

export default function ConsultationMessages() {
  const [conversations, setConversations] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  // Full conversation of the selected request
  const [thread, setThread] = useState({ id: null, messages: [] });
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const messagesRef = useRef(null);

  const showToast = (type, text) => {
    clearTimeout(toastTimer.current);
    setToast({ type, text });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ============================================================
  // LOAD CONVERSATIONS
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    setListLoading(true);
    setListError("");

    api
      .get("/admin/consultations/")
      .then((res) => {
        if (cancelled) return;

        const items = (Array.isArray(res.data) ? res.data : []).map(
          normalizeSummary
        );

        setConversations(items);

        // Keep the current selection if it still exists, else pick the first
        setSelectedConversationId((previous) =>
          items.some((item) => item.id === previous)
            ? previous
            : (items[0]?.id ?? null)
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setListError(
            parseApiError(err, "Could not load consultation messages.")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // ============================================================
  // LOAD THE SELECTED CONVERSATION
  // ============================================================

  useEffect(() => {
    if (!selectedConversationId) {
      setThread({ id: null, messages: [] });
      return undefined;
    }

    let cancelled = false;

    setThreadLoading(true);
    setThreadError("");

    api
      .get(`/admin/consultations/${selectedConversationId}/`)
      .then((res) => {
        if (!cancelled) {
          setThread({
            id: selectedConversationId,
            messages: res.data.messages || [],
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setThreadError(
            parseApiError(err, "Could not load this conversation.")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedConversationId, refreshKey]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const messages =
    thread.id === selectedConversationId ? thread.messages : [];

  // Keep the newest message in view
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length, threadLoading]);

  // ============================================================
  // FILTER CONVERSATIONS
  // ============================================================

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        conversation.full_name
          .toLowerCase()
          .includes(searchValue) ||
        conversation.service_name
          .toLowerCase()
          .includes(searchValue) ||
        (conversation.reference || "")
          .toLowerCase()
          .includes(searchValue) ||
        (conversation.last_message || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesFilter =
        filter === "all" ||
        conversation.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  // ============================================================
  // COUNTS
  // ============================================================

  const newCount = conversations.filter(
    (item) => item.status === "new"
  ).length;

  const repliedCount = conversations.filter(
    (item) => item.status === "replied"
  ).length;

  const resolvedCount = conversations.filter(
    (item) => item.status === "resolved"
  ).length;

  // ============================================================
  // APPLY AN UPDATED CONSULTATION FROM THE API
  // ============================================================

  const applyConsultation = (detail) => {
    const { messages: detailMessages, ...summary } = detail;

    setThread({ id: detail.id, messages: detailMessages || [] });

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === detail.id
          ? normalizeSummary(summary)
          : conversation
      )
    );
  };

  // If another franchise took the request (or it vanished), reload
  const handleActionError = (err, fallback) => {
    showToast("error", parseApiError(err, fallback));

    const code = err?.response?.status;

    if (code === 404 || code === 409) {
      setRefreshKey((key) => key + 1);
    }
  };

  // ============================================================
  // SEND MESSAGE  (emails the customer)
  // ============================================================

  const handleSendMessage = async () => {
    const text = message.trim();

    if (!text || !selectedConversation || sending) {
      return;
    }

    setSending(true);

    try {
      const res = await api.post(
        `/admin/consultations/${selectedConversation.id}/reply/`,
        { message: text }
      );

      applyConsultation(res.data.consultation);
      setMessage("");

      if (res.data.email_sent) {
        showToast("success", "Reply sent to the customer.");
      } else {
        showToast(
          "warning",
          "Reply saved, but the email could not be sent. Please contact the customer directly."
        );
      }
    } catch (err) {
      handleActionError(
        err,
        "Could not send your reply. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // MARK AS RESOLVED
  // ============================================================

  const handleResolve = async () => {
    if (!selectedConversation || resolving) {
      return;
    }

    setResolving(true);

    try {
      const res = await api.post(
        `/admin/consultations/${selectedConversation.id}/resolve/`
      );

      applyConsultation(res.data.consultation);
      showToast("success", "Consultation marked as resolved.");
    } catch (err) {
      handleActionError(
        err,
        "Could not resolve this consultation. Please try again."
      );
    } finally {
      setResolving(false);
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatus = (status) => {
    switch (status) {
      case "new":
        return {
          label: "New",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "replied":
        return {
          label: "Replied",
          className:
            "bg-teal-50 text-teal-700 border-teal-200",
        };

      case "resolved":
        return {
          label: "Resolved",
          className:
            "bg-slate-100 text-slate-600 border-slate-200",
        };

      default:
        return {
          label: "Unknown",
          className:
            "bg-slate-100 text-slate-500 border-slate-200",
        };
    }
  };

  const toastStyles = {
    success: "bg-emerald-600",
    warning: "bg-amber-600",
    error: "bg-red-600",
  };

  return (
    <div className="w-full">

      {/* ========================================================
          TOAST
      ======================================================== */}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.text}
            role="status"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed right-5 top-5 z-50 flex max-w-sm items-start gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${
              toastStyles[toast.type] || toastStyles.success
            }`}
          >
            {toast.type === "success" ? (
              <FaCheckCircle className="mt-0.5 shrink-0" />
            ) : (
              <FaExclamationCircle className="mt-0.5 shrink-0" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "#ccfbf1",
                color: BRAND_COLOR,
              }}
            >
              <FaComments className="text-sm" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Customer Communication
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Consultation Messages
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Manage customer questions and communication
            related to consultations at your franchise.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
          <FaCircle
            className="text-[8px] animate-pulse"
            style={{
              color: BRAND_COLOR,
            }}
          />

          <span className="text-xs font-bold text-teal-700">
            Consultation Desk Active
          </span>
        </div>
      </div>

      {/* ========================================================
          STAT CARDS
      ======================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* NEW */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                New Messages
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {newCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Awaiting response
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FaEnvelope />
            </div>
          </div>
        </div>

        {/* REPLIED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Active Conversations
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {repliedCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Currently in progress
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <FaComments />
            </div>
          </div>
        </div>

        {/* RESOLVED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Resolved
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {resolvedCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Completed conversations
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MESSAGE WORKSPACE
      ======================================================== */}

      <div className="grid min-h-162.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_minmax(0,1fr)]">

        {/* ======================================================
            CONVERSATION LIST
        ====================================================== */}

        <div className="flex flex-col border-b border-slate-200 lg:border-b-0 lg:border-r">

          {/* LIST HEADER */}

          <div className="border-b border-slate-100 p-4">

            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Conversations
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Customer consultation requests
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  disabled={listLoading}
                  title="Refresh"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  <FaSyncAlt
                    className={`text-[10px] ${
                      listLoading ? "animate-spin" : ""
                    }`}
                  />
                </button>

                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                  {filteredConversations.length}
                </span>
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* FILTER */}

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

              {[
                {
                  key: "all",
                  label: "All",
                },
                {
                  key: "new",
                  label: "New",
                },
                {
                  key: "replied",
                  label: "Replied",
                },
                {
                  key: "resolved",
                  label: "Resolved",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setFilter(item.key)
                  }
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-bold transition ${
                    filter === item.key
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONVERSATIONS */}

          <div className="flex-1 overflow-y-auto">

            {listLoading && conversations.length === 0 ? (
              <div className="flex h-full min-h-62.5 items-center justify-center gap-2 px-6 text-xs font-semibold text-slate-500">
                <FaSpinner className="animate-spin" />
                <span>Loading conversations…</span>
              </div>
            ) : listError ? (
              <div className="flex h-full min-h-62.5 flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <FaExclamationCircle />
                </div>

                <p className="text-sm font-bold text-slate-700">
                  Couldn't load conversations
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {listError}
                </p>

                <button
                  type="button"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  className="mt-4 rounded-lg bg-teal-600 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-teal-700"
                >
                  Try again
                </button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex h-full min-h-62.5 flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FaComments />
                </div>

                <p className="text-sm font-bold text-slate-700">
                  {conversations.length === 0
                    ? "No consultation requests yet"
                    : "No conversations found"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {conversations.length === 0
                    ? "Requests for the services your franchise offers will appear here."
                    : "Try another search or filter."}
                </p>
              </div>
            ) : (
              filteredConversations.map(
                (conversation) => {
                  const status =
                    getStatus(
                      conversation.status
                    );

                  const active =
                    selectedConversationId ===
                    conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() =>
                        setSelectedConversationId(
                          conversation.id
                        )
                      }
                      className={`relative flex w-full gap-3 border-b border-slate-100 p-4 text-left transition ${
                        active
                          ? "bg-teal-50/70"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {active && (
                        <span
                          className="absolute bottom-0 left-0 top-0 w-1"
                          style={{
                            background:
                              BRAND_COLOR,
                          }}
                        />
                      )}

                      {/* AVATAR */}

                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                        style={{
                          background:
                            active
                              ? "#ccfbf1"
                              : "#f1f5f9",
                          color: active
                            ? BRAND_COLOR
                            : "#64748b",
                        }}
                      >
                        {conversation.initials}
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-black text-slate-800">
                            {conversation.full_name}
                          </p>

                          <span className="shrink-0 text-[9px] font-medium text-slate-400">
                            {formatListTime(
                              conversation.updated_at
                            )}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[10px] font-bold text-teal-700">
                          {conversation.service_name}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-400">
                          {conversation.last_message ||
                            "No message included with this request."}
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-md border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* ======================================================
            CHAT PANEL
        ====================================================== */}

        <div className="flex min-h-162.5 flex-col">

          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-600">
                <FaComments />
              </div>

              <h3 className="text-lg font-black text-slate-800">
                Select a conversation
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Select a customer consultation message
                from the list to view the conversation.
              </p>
            </div>
          ) : (
            <>
              {/* ==================================================
                  CHAT HEADER
              ================================================== */}

              <div className="border-b border-slate-200 bg-white p-4 md:p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                      style={{
                        background: "#ccfbf1",
                        color: BRAND_COLOR,
                      }}
                    >
                      {selectedConversation.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-sm font-black text-slate-900">
                          {selectedConversation.full_name}
                        </h2>

                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            getStatus(
                              selectedConversation.status
                            ).className
                          }`}
                        >
                          {
                            getStatus(
                              selectedConversation.status
                            ).label
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] font-semibold text-slate-400">
                        {selectedConversation.service_name}
                        {selectedConversation.reference &&
                          ` • ${selectedConversation.reference}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    <a
                      href={`tel:${selectedConversation.phone}`}
                      title="Call customer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                    >
                      <FaPhoneAlt className="text-xs" />
                    </a>

                    <a
                      href={`mailto:${selectedConversation.email}`}
                      title="Email customer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                    >
                      <FaEnvelope className="text-xs" />
                    </a>

                    {selectedConversation.status !==
                      "resolved" && (
                      <button
                        type="button"
                        onClick={handleResolve}
                        disabled={resolving}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {resolving ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        Resolve
                      </button>
                    )}
                  </div>
                </div>

                {/* CONSULTATION DETAILS */}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <FaCalendarAlt className="text-xs text-teal-600" />

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Requested On
                      </p>

                      <p className="text-[10px] font-bold text-slate-700">
                        {formatDate(selectedConversation.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <FaClock className="text-xs text-teal-600" />

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Time
                      </p>

                      <p className="text-[10px] font-bold text-slate-700">
                        {formatTime(selectedConversation.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <FaMapMarkerAlt className="text-xs text-teal-600" />

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Branch
                      </p>

                      <p className="text-[10px] font-bold text-slate-700">
                        {selectedConversation.franchise_name ||
                          "Not taken yet"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* ==================================================
                  CHAT MESSAGES
              ================================================== */}

              <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-6"
              >

                <div className="mx-auto max-w-3xl">

                  {/* DAY DIVIDER */}

                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Consultation Conversation
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  {threadLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-slate-500">
                      <FaSpinner className="animate-spin" />
                      <span>Loading conversation…</span>
                    </div>
                  ) : threadError ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                      <p className="text-xs font-semibold text-red-600">
                        {threadError}
                      </p>

                      <button
                        type="button"
                        onClick={() => setRefreshKey((key) => key + 1)}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-teal-700"
                      >
                        Try again
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="py-10 text-center text-xs text-slate-400">
                      The customer didn't include a message with this
                      request. Reply below to get the conversation started.
                    </p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map(
                        (item) => {
                          const isFranchise =
                            item.sender_type ===
                            "franchise";

                          return (
                            <motion.div
                              key={item.id}
                              initial={{
                                opacity: 0,
                                y: 8,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className={`mb-5 flex ${
                                isFranchise
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex max-w-[85%] gap-2.5 ${
                                  isFranchise
                                    ? "flex-row-reverse"
                                    : ""
                                }`}
                              >

                                {/* AVATAR */}

                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${
                                    isFranchise
                                      ? "bg-teal-100 text-teal-700"
                                      : "bg-white text-slate-500 shadow-sm"
                                  }`}
                                >
                                  {isFranchise
                                    ? "FR"
                                    : selectedConversation.initials}
                                </div>

                                {/* BUBBLE */}

                                <div>
                                  <div
                                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                                      isFranchise
                                        ? "rounded-tr-sm bg-teal-600 text-white"
                                        : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap wrap-break-words text-xs leading-relaxed">
                                      {item.message}
                                    </p>
                                  </div>

                                  <p
                                    className={`mt-1.5 text-[8px] font-medium text-slate-400 ${
                                      isFranchise
                                        ? "text-right"
                                        : "text-left"
                                    }`}
                                  >
                                    {isFranchise
                                      ? "Franchise • "
                                      : "Customer • "}
                                    {formatMessageTime(item.created_at)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        }
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* ==================================================
                  MESSAGE COMPOSER
              ================================================== */}

              <div className="border-t border-slate-200 bg-white p-4 md:p-5">

                {selectedConversation.status ===
                "resolved" ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <FaCheckCircle className="text-sm text-emerald-500" />

                    <p className="text-xs font-semibold text-slate-500">
                      This consultation conversation has
                      been resolved.
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl">

                    <div className="flex items-end gap-2">

                      <textarea
                        value={message}
                        onChange={(event) =>
                          setMessage(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.shiftKey
                          ) {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        maxLength={5000}
                        disabled={sending}
                        placeholder="Write a response to the customer..."
                        className="min-h-18 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sending}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          background:
                            BRAND_COLOR,
                        }}
                        title="Send message"
                      >
                        {sending ? (
                          <FaSpinner className="animate-spin text-xs" />
                        ) : (
                          <FaPaperPlane className="text-xs" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[9px] text-slate-400">
                        Press Enter to send • Shift + Enter
                        for a new line • Your reply is emailed to the customer
                      </p>

                      <div className="flex items-center gap-1 text-[9px] font-semibold text-teal-600">
                        <FaReply />
                        Franchise response
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================
          CUSTOMER INFORMATION
      ======================================================== */}

      {selectedConversation && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FaUser className="text-xs" />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-800">
                Customer Information
              </h3>

              <p className="text-[10px] text-slate-400">
                Contact details for this consultation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <FaUser className="text-xs text-teal-600" />

              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Customer
                </p>

                <p className="text-xs font-bold text-slate-700">
                  {selectedConversation.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <FaPhoneAlt className="text-xs text-teal-600" />

              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="text-xs font-bold text-slate-700">
                  {selectedConversation.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <FaEnvelope className="text-xs text-teal-600" />

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="truncate text-xs font-bold text-slate-700">
                  {selectedConversation.email}
                </p>
              </div>
            </div>

          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 p-3">
            <FaClipboardList className="text-xs text-teal-600" />

            <p className="text-[10px] leading-relaxed text-teal-800">
              This conversation is associated with the{" "}
              <strong>
                {selectedConversation.service_name}
              </strong>{" "}
              consultation requested on{" "}
              <strong>
                {formatDate(selectedConversation.created_at)}
              </strong>{" "}
              at{" "}
              <strong>
                {formatTime(selectedConversation.created_at)}
              </strong>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}