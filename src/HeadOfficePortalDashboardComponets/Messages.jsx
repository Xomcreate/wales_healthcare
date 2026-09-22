import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaEnvelopeOpenText,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBuilding,
  FaTimes,
  FaReply,
  FaUserTie,
  FaInbox,
  FaSyncAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const FILTERS = [
  "All",
  "Unassigned",
  "Assigned",
  "Replied",
  "Resolved",
];

// ============================================================
// API HELPERS
// ============================================================

/**
 * DRF can return either:
 *
 * [
 *   {...},
 *   {...}
 * ]
 *
 * or:
 *
 * {
 *   count: 10,
 *   results: [...]
 * }
 */
const unwrapList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.results ?? [];
};

// ------------------------------------------------------------
// Fetch contact messages
// ------------------------------------------------------------

const fetchContactMessages = async () => {
  const response = await api.get("/admin/contact-messages/");
  return unwrapList(response.data);
};

// ------------------------------------------------------------
// Fetch franchises
// ------------------------------------------------------------

const fetchFranchises = async () => {
  const response = await api.get("/admin/franchises/");
  return unwrapList(response.data);
};

// ------------------------------------------------------------
// Assign message to franchise
// ------------------------------------------------------------

const assignContactMessage = async (id, franchiseId) => {
  const response = await api.post(
    `/admin/contact-messages/${id}/assign/`,
    {
      franchise: franchiseId,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// Mark message as resolved
// ------------------------------------------------------------

const resolveContactMessage = async (id) => {
  const response = await api.post(
    `/admin/contact-messages/${id}/resolve/`
  );

  return response.data;
};

// ============================================================
// DISPLAY HELPERS
// ============================================================

const STATUS_LABEL = {
  New: "Unassigned",
  Assigned: "Assigned",
  "In Progress": "Assigned",
  Replied: "Replied",
  Closed: "Resolved",
};

const statusLabel = (status) => {
  return STATUS_LABEL[status] || status || "Unassigned";
};

const statusStyle = (label) => {
  switch (label) {
    case "Unassigned":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Assigned":
      return "bg-teal-50 text-teal-700 border-teal-200";

    case "Replied":
      return "bg-sky-50 text-sky-700 border-sky-200";

    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-GB", {
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

// ============================================================
// MAIN COMPONENT
// ============================================================

function Messages() {
  const [messages, setMessages] = useState([]);
  const [franchises, setFranchises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [messageList, franchiseList] =
        await Promise.all([
          fetchContactMessages(),
          fetchFranchises(),
        ]);

      setMessages(Array.isArray(messageList) ? messageList : []);

      setFranchises(
        Array.isArray(franchiseList)
          ? franchiseList.filter(
              (franchise) =>
                franchise?.is_active !== false
            )
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load contact messages:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not load contact messages.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==========================================================
  // UPDATE MESSAGE IN STATE
  // ==========================================================

  const replaceMessage = (updated) => {
    if (!updated?.id) return;

    setMessages((current) =>
      current.map((item) =>
        item.id === updated.id ? updated : item
      )
    );

    setSelectedMessage(updated);
  };

  // ==========================================================
  // OPEN MESSAGE
  // ==========================================================

  const openMessage = (message) => {
    setActionError("");
    setSelectedMessage(message);
  };

  // ==========================================================
  // CLOSE MESSAGE
  // ==========================================================

  const closeMessage = () => {
    setActionError("");
    setShowAssignModal(false);
    setSelectedMessage(null);
  };

  // ==========================================================
  // OPEN ASSIGN MODAL
  // ==========================================================

  const openAssignModal = () => {
    setActionError("");

    setSelectedFranchiseId(
      selectedMessage?.franchise
        ? String(selectedMessage.franchise)
        : ""
    );

    setShowAssignModal(true);
  };

  // ==========================================================
  // FILTER MESSAGES
  // ==========================================================

  const filteredMessages = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return messages.filter((message) => {
      const label = statusLabel(message.status);

      const matchesFilter =
        activeFilter === "All" ||
        label === activeFilter;

      const matchesSearch =
        !searchText ||
        String(message?.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(message?.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(message?.service_display || "")
          .toLowerCase()
          .includes(searchText) ||
        String(message?.subject || "")
          .toLowerCase()
          .includes(searchText) ||
        String(message?.message || "")
          .toLowerCase()
          .includes(searchText) ||
        String(message?.franchise_name || "")
          .toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [messages, activeFilter, search]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    const result = {
      Unassigned: 0,
      Assigned: 0,
      Replied: 0,
      Resolved: 0,
    };

    messages.forEach((message) => {
      const label = statusLabel(message.status);

      if (result[label] !== undefined) {
        result[label] += 1;
      }
    });

    return result;
  }, [messages]);

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  const stats = [
    {
      label: "All Messages",
      value: messages.length,
      icon: FaEnvelopeOpenText,
      border: "border-slate-200",
      iconBox: "bg-slate-100 text-slate-600",
    },
    {
      label: "Unassigned",
      value: counts.Unassigned,
      icon: FaClock,
      border: "border-amber-100",
      iconBox: "bg-amber-50 text-amber-600",
    },
    {
      label: "Assigned",
      value: counts.Assigned,
      icon: FaUserTie,
      border: "border-teal-100",
      iconBox: "bg-teal-50 text-teal-600",
    },
    {
      label: "Replied",
      value: counts.Replied,
      icon: FaReply,
      border: "border-sky-100",
      iconBox: "bg-sky-50 text-sky-600",
    },
    {
      label: "Resolved",
      value: counts.Resolved,
      icon: FaCheckCircle,
      border: "border-emerald-100",
      iconBox: "bg-emerald-50 text-emerald-600",
    },
  ];

  // ==========================================================
  // ASSIGN MESSAGE
  // ==========================================================

  const handleAssign = async () => {
    if (!selectedMessage || !selectedFranchiseId) {
      return;
    }

    setSaving(true);
    setActionError("");

    try {
      const updated = await assignContactMessage(
        selectedMessage.id,
        Number(selectedFranchiseId)
      );

      replaceMessage(updated);

      setSelectedFranchiseId("");
      setShowAssignModal(false);
    } catch (err) {
      console.error(
        "Failed to assign contact message:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not assign this message.";

      setActionError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // MARK RESOLVED
  // ==========================================================

  const handleMarkResolved = async (message) => {
    if (!message?.id) return;

    setSaving(true);
    setActionError("");

    try {
      const updated = await resolveContactMessage(
        message.id
      );

      replaceMessage(updated);
    } catch (err) {
      console.error(
        "Failed to resolve contact message:",
        err
      );

      const messageText =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not mark this message resolved.";

      setActionError(messageText);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // SELECTED MESSAGE STATUS
  // ==========================================================

  const selectedLabel = selectedMessage
    ? statusLabel(selectedMessage.status)
    : "";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "#ccfbf1",
                color: BRAND_COLOR,
              }}
            >
              <FaEnvelopeOpenText />
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">
              Communication
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Contact Messages
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Manage public enquiries and assign messages
            to the appropriate franchise. The franchise
            can then handle the customer enquiry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <FaSyncAlt
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaInbox style={{ color: BRAND_COLOR }} />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Total Messages
              </p>

              <p className="text-lg font-black text-slate-800">
                {messages.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadData}
            className="shrink-0 rounded-lg bg-red-100 px-3 py-1.5 text-[10px] font-bold hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* ======================================================
          STAT CARDS
      ====================================================== */}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className={`rounded-2xl border ${stat.border} bg-white p-5 shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBox}`}
                >
                  <Icon />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ======================================================
          FILTER + SEARCH
      ====================================================== */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-2 text-slate-400">
              <FaFilter className="text-xs" />

              <span className="text-[10px] font-bold uppercase tracking-wider">
                Filter
              </span>
            </div>

            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${
                  activeFilter === filter
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search messages..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          MESSAGE TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.5fr_1.5fr_2fr_1.2fr_1.2fr_100px] gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3 lg:grid">
          {[
            "Sender",
            "Subject",
            "Franchise",
            "Status",
            "Date",
            "Action",
          ].map((heading) => (
            <p
              key={heading}
              className="text-[9px] font-black uppercase tracking-widest text-slate-400"
            >
              {heading}
            </p>
          ))}
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">
            <FaSyncAlt className="mx-auto mb-3 animate-spin text-xl text-teal-600" />

            <p className="text-xs font-semibold text-slate-400">
              Loading messages...
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FaInbox className="text-xl" />
            </div>

            <h3 className="text-sm font-black text-slate-800">
              No messages found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-400">
              There are no contact messages matching
              your current search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((message) => {
              const label = statusLabel(
                message.status
              );

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-4 px-5 py-4 transition hover:bg-slate-50/70 lg:grid-cols-[1.5fr_1.5fr_2fr_1.2fr_1.2fr_100px] lg:items-center"
                >
                  {/* SENDER */}

                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                      style={{
                        background: "#ccfbf1",
                        color: BRAND_COLOR,
                      }}
                    >
                      {initials(message.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {message.name ||
                          "Unknown sender"}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {message.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* SUBJECT */}

                  <div>
                    <p className="truncate text-xs font-bold text-slate-700">
                      {message.service_display ||
                        message.subject ||
                        "Contact enquiry"}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {message.message ||
                        "No message content"}
                    </p>
                  </div>

                  {/* FRANCHISE */}

                  <div className="flex items-center gap-2">
                    <FaBuilding
                      className="shrink-0 text-xs"
                      style={{
                        color: BRAND_COLOR,
                      }}
                    />

                    <span className="text-xs font-semibold text-slate-600">
                      {message.franchise_name ||
                        "Head Office — Unassigned"}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div className="hidden lg:block">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusStyle(
                        label
                      )}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* DATE */}

                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-600">
                      {formatDate(
                        message.created_at
                      )}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {formatTime(
                        message.created_at
                      )}
                    </p>
                  </div>

                  {/* ACTION */}

                  <div className="hidden lg:block">
                    <button
                      type="button"
                      onClick={() =>
                        openMessage(message)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                      title="View message"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </div>

                  {/* MOBILE */}

                  <div className="flex flex-wrap items-center gap-2 lg:hidden">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusStyle(
                        label
                      )}`}
                    >
                      {label}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {formatDate(
                        message.created_at
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        openMessage(message)
                      }
                      className="ml-auto rounded-lg bg-teal-50 px-3 py-2 text-[10px] font-bold text-teal-700"
                    >
                      View Message
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================
          MESSAGE DETAILS MODAL
      ====================================================== */}

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={closeMessage}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "#ccfbf1",
                      color: BRAND_COLOR,
                    }}
                  >
                    <FaEnvelopeOpenText />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Message Details
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      Public Contact Us enquiry
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMessage}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                >
                  <FaTimes />
                </button>
              </div>

              {/* MODAL CONTENT */}

              <div className="space-y-6 p-6">
                {actionError &&
                  !showAssignModal && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                      {actionError}
                    </div>
                  )}

                {/* SENDER */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaUser
                      className="text-xs"
                      style={{
                        color: BRAND_COLOR,
                      }}
                    />

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Sender
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Name
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {selectedMessage.name ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-xs font-bold text-slate-800">
                        {selectedMessage.email ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {selectedMessage.phone ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Received
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {formatDate(
                          selectedMessage.created_at
                        )}{" "}
                        at{" "}
                        {formatTime(
                          selectedMessage.created_at
                        )}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Confirmation email to sender
                      </p>

                      <p
                        className={`mt-1 text-xs font-bold ${
                          selectedMessage.confirmation_email_sent
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {selectedMessage.confirmation_email_sent
                          ? "Sent"
                          : "Not sent"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUBJECT */}

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Subject
                  </p>

                  <h3 className="text-lg font-black text-slate-900">
                    {selectedMessage.service_display ||
                      selectedMessage.subject ||
                      "Contact Enquiry"}
                  </h3>
                </div>

                {/* MESSAGE */}

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Message
                  </p>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {selectedMessage.message ||
                        "No message content."}
                    </p>
                  </div>
                </div>

                {/* ASSIGNMENT */}

                <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaBuilding
                      className="text-xs"
                      style={{
                        color: BRAND_COLOR,
                      }}
                    />

                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
                      Franchise Assignment
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Current Destination
                      </p>

                      <p className="mt-1 text-xs font-black text-slate-800">
                        {selectedMessage.franchise_name ||
                          "Head Office — Unassigned"}
                      </p>

                      {selectedMessage.assigned_at && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Assigned{" "}
                          {formatDate(
                            selectedMessage.assigned_at
                          )}
                          {selectedMessage.assigned_by_name
                            ? ` by ${selectedMessage.assigned_by_name}`
                            : ""}
                        </p>
                      )}
                    </div>

                    {selectedLabel !==
                      "Resolved" && (
                      <button
                        type="button"
                        onClick={openAssignModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
                      >
                        <FaBuilding />

                        {selectedMessage.franchise
                          ? "Reassign"
                          : "Assign Franchise"}
                      </button>
                    )}
                  </div>
                </div>

                {/* FRANCHISE REPLY */}

                {selectedMessage.reply_message && (
                  <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FaReply className="text-xs text-sky-600" />

                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">
                        Reply sent to customer
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {selectedMessage.reply_message}
                    </p>

                    <p className="mt-3 text-[10px] text-slate-400">
                      {selectedMessage.replied_by_name ||
                        "Staff"}{" "}
                      ·{" "}
                      {formatDate(
                        selectedMessage.replied_at
                      )}{" "}
                      at{" "}
                      {formatTime(
                        selectedMessage.replied_at
                      )}
                    </p>
                  </div>
                )}

                {/* STATUS */}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status:
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusStyle(
                        selectedLabel
                      )}`}
                    >
                      {selectedLabel}
                    </span>
                  </div>

                  {selectedLabel !==
                    "Resolved" && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        handleMarkResolved(
                          selectedMessage
                        )
                      }
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      <FaCheckCircle />

                      {saving
                        ? "Saving..."
                        : "Mark Resolved"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          ASSIGN FRANCHISE MODAL
      ====================================================== */}

      <AnimatePresence>
        {showAssignModal &&
          selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
              onClick={() =>
                setShowAssignModal(false)
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Assign Franchise
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Choose the franchise that should
                      handle this enquiry.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAssignModal(false)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                  >
                    <FaTimes />
                  </button>
                </div>

                {actionError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                    {actionError}
                  </div>
                )}

                <div className="mb-5">
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Franchise
                  </label>

                  <select
                    value={selectedFranchiseId}
                    onChange={(e) =>
                      setSelectedFranchiseId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
                  >
                    <option value="">
                      Select a franchise
                    </option>

                    {franchises.map(
                      (franchise) => (
                        <option
                          key={franchise.id}
                          value={franchise.id}
                        >
                          {franchise.name}
                          {franchise.location
                            ? ` — ${franchise.location}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>

                  {franchises.length === 0 && (
                    <p className="mt-2 text-[10px] text-amber-600">
                      No active franchises found.
                      Add one under Franchises
                      first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAssignModal(false)
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      !selectedFranchiseId ||
                      saving
                    }
                    onClick={handleAssign}
                    className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving
                      ? "Assigning..."
                      : "Assign Message"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export default Messages;