import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaHistory,
  FaFileUpload,
  FaBell,
  FaShieldAlt,
  FaTimes,
  FaInfoCircle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUserCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // adjust the path if this page lives at a different depth

const BRAND_COLOR = "#0d9488";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const STATUS_MAP = {
  paid: "Paid",
  overdue: "Overdue",
  due_soon: "Due Soon",
  "due soon": "Due Soon",
  upcoming: "Upcoming",
  pending: "Upcoming",
};

const normalizeStatus = (raw) =>
  STATUS_MAP[String(raw || "").toLowerCase().trim()] || "Upcoming";

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || []);

const formatGBP = (n) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const getApiError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const first = Object.entries(data)[0];
  if (first) {
    const [field, msg] = first;
    return `${field}: ${Array.isArray(msg) ? msg[0] : msg}`;
  }
  return fallback;
};

const getStatusBadge = (status) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700";
    case "Due Soon":
      return "bg-amber-50 text-amber-700";
    case "Overdue":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const inputCls =
  "w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600";

const emptyEvidenceForm = { feeId: "", note: "", file: null };

export default function InvoicesPayments() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [activeTab, setActiveTab] = useState("fees");
  const [showBillingFlowModal, setShowBillingFlowModal] = useState(false);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState(emptyEvidenceForm);
  const [submittingEvidence, setSubmittingEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");

  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

  // ---------------- customer payment confirmations (their invoices) ----------------
  const [customerEvidenceQueue, setCustomerEvidenceQueue] = useState([]);
  const [loadingCustomerEvidence, setLoadingCustomerEvidence] = useState(true);
  const [customerEvidenceError, setCustomerEvidenceError] = useState("");
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null); // which row's reject-note box is open
  const [rejectNote, setRejectNote] = useState("");

  // ---------------- data loading ----------------
  const loadFees = useCallback(async () => {
    setLoadError("");
    try {
      const { data } = await api.get("fees/mine/");
      setFees(unwrapList(data));
    } catch (err) {
      setLoadError(getApiError(err, "Could not load your fees. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCustomerEvidenceQueue = useCallback(async () => {
    setCustomerEvidenceError("");
    try {
      const { data } = await api.get("admin/invoices/evidence/");
      setCustomerEvidenceQueue(unwrapList(data));
    } catch (err) {
      setCustomerEvidenceError(
        getApiError(err, "Could not load pending customer payments. Please try again.")
      );
    } finally {
      setLoadingCustomerEvidence(false);
    }
  }, []);

  useEffect(() => {
    loadFees();
    loadCustomerEvidenceQueue();
  }, [loadFees, loadCustomerEvidenceQueue]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // ---------------- derived data (franchise's own fees) ----------------
  const normalizedFees = useMemo(
    () =>
      fees.map((f) => ({
        ...f,
        displayStatus: normalizeStatus(f.status),
      })),
    [fees]
  );

  const stats = useMemo(() => {
    const totalDue = normalizedFees.reduce((acc, f) => acc + Number(f.balance ?? 0), 0);
    const totalPaid = normalizedFees.reduce((acc, f) => acc + Number(f.amount_paid ?? 0), 0);
    const overdueTotal = normalizedFees
      .filter((f) => f.displayStatus === "Overdue")
      .reduce((acc, f) => acc + Number(f.balance ?? 0), 0);

    const withExpiry = normalizedFees.filter((f) => f.agreement_expiry);
    const soonest = withExpiry
      .map((f) => f.agreement_expiry)
      .sort()[0];

    return { totalDue, totalPaid, overdueTotal, soonestExpiry: soonest };
  }, [normalizedFees]);

  const paymentHistory = useMemo(
    () =>
      normalizedFees
        .flatMap((f) =>
          (f.payments || []).map((p) => ({
            ...p,
            feeReference: f.reference,
            feeType: f.fee_type,
          }))
        )
        .sort((a, b) => new Date(b.paid_on) - new Date(a.paid_on)),
    [normalizedFees]
  );

  const evidenceHistory = useMemo(
    () =>
      normalizedFees
        .flatMap((f) =>
          (f.evidence_submissions || []).map((s) => ({
            ...s,
            feeReference: f.reference,
            feeType: f.fee_type,
          }))
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [normalizedFees]
  );

  const unpaidFees = useMemo(
    () => normalizedFees.filter((f) => f.displayStatus !== "Paid"),
    [normalizedFees]
  );

  const submitButtonDisabledReason = loading
    ? "Loading your fees…"
    : unpaidFees.length === 0
    ? "No outstanding fees to submit evidence for"
    : "";

  // ---------------- actions: franchise's own fee evidence ----------------
  const openEvidenceModal = (feeId) => {
    setEvidenceForm({ ...emptyEvidenceForm, feeId: feeId ? String(feeId) : "" });
    setEvidenceError("");
    setShowEvidenceModal(true);
  };

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceForm.feeId) {
      setEvidenceError("Please select which fee this evidence is for.");
      return;
    }
    if (!evidenceForm.file) {
      setEvidenceError("Please attach a file.");
      return;
    }

    setSubmittingEvidence(true);
    setEvidenceError("");
    try {
      const formData = new FormData();
      formData.append("file", evidenceForm.file);
      formData.append("note", evidenceForm.note);

      const headers = { "Content-Type": "multipart/form-data" };
      delete headers["Content-Type"];

      await api.post(`fees/mine/${evidenceForm.feeId}/evidence/`, formData, {
        headers,
      });

      setShowEvidenceModal(false);
      setEvidenceForm(emptyEvidenceForm);
      setNotice({ type: "success", text: "Payment evidence submitted. Head Office will confirm the payment." });
      await loadFees();
    } catch (err) {
      setEvidenceError(getApiError(err, "Could not submit the evidence. Please try again."));
    } finally {
      setSubmittingEvidence(false);
    }
  };

  // ---------------- actions: confirming CUSTOMER invoice payments ----------------
  const handleApproveCustomerEvidence = async (submissionId) => {
    setReviewingId(submissionId);
    try {
      await api.post(`admin/invoices/evidence/${submissionId}/review/`, {
        action: "approve",
      });
      setNotice({ type: "success", text: "Payment confirmed. The invoice is now marked Paid." });
      setCustomerEvidenceQueue((q) => q.filter((s) => s.id !== submissionId));
    } catch (err) {
      setNotice({ type: "error", text: getApiError(err, "Could not confirm this payment. Please try again.") });
    } finally {
      setReviewingId(null);
    }
  };

  const openRejectBox = (submissionId) => {
    setRejectingId(submissionId);
    setRejectNote("");
  };

  const handleRejectCustomerEvidence = async (submissionId) => {
    setReviewingId(submissionId);
    try {
      await api.post(`admin/invoices/evidence/${submissionId}/review/`, {
        action: "reject",
        note: rejectNote,
      });
      setNotice({ type: "success", text: "Evidence rejected. The customer will see your note." });
      setCustomerEvidenceQueue((q) => q.filter((s) => s.id !== submissionId));
      setRejectingId(null);
      setRejectNote("");
    } catch (err) {
      setNotice({ type: "error", text: getApiError(err, "Could not reject this submission. Please try again.") });
    } finally {
      setReviewingId(null);
    }
  };

  // ---------------- render ----------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Fees, Renewals & Payments
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            View fees set by Head Office, track what's due or overdue, submit payment evidence, and confirm your customers' payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowBillingFlowModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>How Renewals Work</span>
          </button>
          <button
            onClick={() => openEvidenceModal("")}
            disabled={loading || unpaidFees.length === 0}
            title={submitButtonDisabledReason || undefined}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaFileUpload className="text-[10px]" />
            <span>Submit Payment Evidence</span>
          </button>
        </div>
      </div>

      {/* NOTICE BANNER */}
      {notice && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-xs font-semibold ${
            notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Small inline explainer so an all-paid state doesn't read as broken */}
      {!loading && !loadError && normalizedFees.length > 0 && unpaidFees.length === 0 && (
        <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-emerald-50 text-emerald-700 flex items-center gap-2">
          <FaCheckCircle className="text-[11px]" />
          All fees are marked paid — there's nothing outstanding to submit evidence for right now.
        </div>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Due</p>
          <h4 className="text-xl font-black text-slate-900 mt-2">{formatGBP(stats.totalDue)}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</p>
          <h4 className="text-xl font-black text-emerald-600 mt-2">{formatGBP(stats.totalPaid)}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue</p>
          <h4 className="text-xl font-black text-rose-600 mt-2">{formatGBP(stats.overdueTotal)}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next Renewal</p>
          <h4 className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1.5">
            <FaCalendarAlt className="text-teal-600 text-xs" />
            {stats.soonestExpiry ? formatDate(stats.soonestExpiry) : "None scheduled"}
          </h4>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "fees", label: "Fees & Invoices", icon: <FaFileInvoiceDollar /> },
          { key: "payments", label: "Payment History", icon: <FaHistory /> },
          { key: "evidence", label: "Evidence Submissions", icon: <FaFileUpload /> },
          { key: "renewals", label: "Agreement & Renewals", icon: <FaCalendarAlt /> },
          {
            key: "customer-confirmations",
            label: "Confirm Customer Payments",
            icon: <FaUserCheck />,
            badge: customerEvidenceQueue.length || null,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
              activeTab === tab.key
                ? "border-teal-600 text-teal-700 bg-teal-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge ? (
              <span className="ml-1 rounded-full bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 leading-none">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* LOADING / ERROR (shared across the franchise-fee tabs) */}
      {activeTab !== "customer-confirmations" && loading && (
        <div className="py-10 text-center text-slate-500 text-xs">
          <FaSpinner className="mx-auto mb-2 animate-spin" />
          Loading your fees…
        </div>
      )}

      {activeTab !== "customer-confirmations" && !loading && loadError && (
        <div className="py-10 text-center">
          <p className="text-rose-600 font-semibold text-xs">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadFees();
            }}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
          >
            Try again
          </button>
        </div>
      )}

      {/* TAB 1: FEES & INVOICES */}
      {!loading && !loadError && activeTab === "fees" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Reference & Fee Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Paid</th>
                    <th className="py-3.5 px-4">Balance</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {normalizedFees.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 px-4 text-center text-slate-500">
                        No fees have been issued yet.
                      </td>
                    </tr>
                  )}
                  {normalizedFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{fee.reference}</p>
                        <p className="text-[10px] text-slate-500">{fee.fee_type}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatGBP(fee.amount)}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600">{formatGBP(fee.amount_paid)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-900">{formatGBP(fee.balance)}</td>
                      <td className="py-3.5 px-4 text-slate-600">{formatDate(fee.due_date)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(fee.displayStatus)}`}>
                          {fee.displayStatus}
                        </span>
                        {fee.last_reminder_sent_at && (
                          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                            <FaBell className="text-[9px]" /> Reminder sent {formatDate(fee.last_reminder_sent_at)}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {fee.displayStatus !== "Paid" && (
                          <button
                            onClick={() => openEvidenceModal(fee.id)}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition"
                          >
                            Submit Evidence
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT HISTORY */}
      {!loading && !loadError && activeTab === "payments" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Fee Reference</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Reference</th>
                    <th className="py-3.5 px-4">Paid On</th>
                    <th className="py-3.5 px-4">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paymentHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 px-4 text-center text-slate-500">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                  {paymentHistory.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.feeReference}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{formatGBP(p.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-700">{p.method}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.reference || "—"}</td>
                      <td className="py-3.5 px-4 text-slate-600">{formatDate(p.paid_on)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.recorded_by_name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE SUBMISSIONS */}
      {!loading && !loadError && activeTab === "evidence" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Fee Reference</th>
                    <th className="py-3.5 px-4">File</th>
                    <th className="py-3.5 px-4">Note</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {evidenceHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 px-4 text-center text-slate-500">
                        No evidence submitted yet.
                      </td>
                    </tr>
                  )}
                  {evidenceHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{s.feeReference}</td>
                      <td className="py-3.5 px-4">
                        {s.file_url ? (
                          <a
                            href={s.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-700 font-semibold hover:underline"
                          >
                            {s.file_name || "View file"}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{s.note || "—"}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {s.status || "Submitted"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{formatDate(s.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AGREEMENT & RENEWALS */}
      {!loading && !loadError && activeTab === "renewals" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Fee Reference</th>
                    <th className="py-3.5 px-4">Agreement Expiry</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {normalizedFees.filter((f) => f.agreement_expiry).length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-10 px-4 text-center text-slate-500">
                        No agreement expiry dates on file.
                      </td>
                    </tr>
                  )}
                  {normalizedFees
                    .filter((f) => f.agreement_expiry)
                    .sort((a, b) => new Date(a.agreement_expiry) - new Date(b.agreement_expiry))
                    .map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{fee.reference}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-mono">{formatDate(fee.agreement_expiry)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(fee.displayStatus)}`}>
                            {fee.displayStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONFIRM CUSTOMER PAYMENTS (invoice evidence from YOUR customers) */}
      {activeTab === "customer-confirmations" && (
        <div className="space-y-4">
          <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-slate-50 text-slate-600 flex items-start gap-2">
            <FaShieldAlt className="text-teal-600 mt-0.5 shrink-0" />
            <p>
              These are payment-evidence files your customers uploaded against their own invoices.
              Approving marks the invoice <span className="font-bold">Paid</span>; rejecting leaves it
              outstanding and shows the customer your note.
            </p>
          </div>

          {loadingCustomerEvidence && (
            <div className="py-10 text-center text-slate-500 text-xs">
              <FaSpinner className="mx-auto mb-2 animate-spin" />
              Loading pending customer payments…
            </div>
          )}

          {!loadingCustomerEvidence && customerEvidenceError && (
            <div className="py-10 text-center">
              <p className="text-rose-600 font-semibold text-xs">{customerEvidenceError}</p>
              <button
                type="button"
                onClick={() => {
                  setLoadingCustomerEvidence(true);
                  loadCustomerEvidenceQueue();
                }}
                className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
              >
                Try again
              </button>
            </div>
          )}

          {!loadingCustomerEvidence && !customerEvidenceError && customerEvidenceQueue.length === 0 && (
            <div className="py-10 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <FaCheckCircle className="text-emerald-500 text-base" />
              Nothing waiting for review — all caught up.
            </div>
          )}

          {!loadingCustomerEvidence && !customerEvidenceError && customerEvidenceQueue.length > 0 && (
            <div className="space-y-3">
              {customerEvidenceQueue.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                        <FaFileInvoiceDollar className="text-teal-600 text-xs shrink-0" />
                        {s.invoice_number}
                        <span className="text-slate-400 font-normal text-xs">— {s.customer_name}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatGBP(s.invoice_amount)}
                        {s.invoice_description ? ` · ${s.invoice_description}` : ""} · submitted{" "}
                        {formatDate(s.created_at)}
                      </p>
                      {s.note && (
                        <p className="text-xs text-slate-600 mt-1 italic">"{s.note}"</p>
                      )}
                      {s.file_url && (
                        <a
                          href={s.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline mt-1"
                        >
                          <FaFileUpload className="text-[10px]" />
                          {s.file_name || "View evidence file"}
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => openRejectBox(s.id)}
                        disabled={reviewingId === s.id}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-60"
                      >
                        <FaTimesCircle className="text-[10px]" /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveCustomerEvidence(s.id)}
                        disabled={reviewingId === s.id}
                        className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {reviewingId === s.id ? (
                          <FaSpinner className="animate-spin text-[10px]" />
                        ) : (
                          <FaCheckCircle className="text-[10px]" />
                        )}
                        Confirm Paid
                      </button>
                    </div>
                  </div>

                  {/* Inline reject-reason box */}
                  {rejectingId === s.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Reason (shown to the customer)
                      </label>
                      <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Explain why the evidence was rejected (e.g., amount mismatch, blurry receipt)..."
                        className={inputCls}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectCustomerEvidence(s.id)}
                          disabled={reviewingId === s.id}
                          className="px-3 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-60"
                        >
                          {reviewingId === s.id ? "Rejecting..." : "Submit Rejection"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBMIT EVIDENCE MODAL */}
      <AnimatePresence>
        {showEvidenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">Submit Payment Evidence</h4>
                <button
                  onClick={() => setShowEvidenceModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <FaTimes />
                </button>
              </div>

              {evidenceError && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {evidenceError}
                </div>
              )}

              <form onSubmit={handleSubmitEvidence} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee</label>
                  <select
                    value={evidenceForm.feeId}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, feeId: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">-- Choose unpaid fee --</option>
                    {unpaidFees.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.reference} ({f.fee_type}) — Balance: {formatGBP(f.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Receipt / Proof</label>
                  <input
                    type="file"
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, file: e.target.files?.[0] || null })}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note (Optional)</label>
                  <textarea
                    value={evidenceForm.note}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, note: e.target.value })}
                    placeholder="Add details such as bank transfer reference number..."
                    className={inputCls}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEvidence}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
                  >
                    {submittingEvidence && <FaSpinner className="animate-spin text-[10px]" />}
                    Submit Evidence
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENEWALS INFO MODAL */}
      <AnimatePresence>
        {showBillingFlowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">How Renewals & Fees Work</h4>
                <button
                  onClick={() => setShowBillingFlowModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="text-xs text-slate-600 space-y-3">
                <p>
                  Head Office manages and issues franchise fees and agreement renewals. Each fee has a designated due date and reference code.
                </p>
                <p>
                  If you have made a payment outside the automated gateway, you can upload payment evidence (bank receipts/slips) directly against the specific fee. Head Office will review and reconcile your statement.
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowBillingFlowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}