import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaPlus,
  FaTimes,
  FaMoneyCheckAlt,
  FaSpinner,
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // adjust the path if this page lives at a different depth

// ------------------------------------------------------------------
// Static config
// ------------------------------------------------------------------
const FEE_TYPES = [
  "Annual Franchise Royalty & License",
  "Monthly Software & Platform Fee",
  "Quarterly Brand Marketing Contribution",
  "Compliance Audit Processing Fee",
];

const PAYMENT_METHODS = ["Bank Transfer", "Card", "Direct Debit", "Cheque", "Other"];

const renewalWorkflowSteps = [
  { step: 1, title: "Calculate Expiry", desc: "System calculates days until agreement expiry." },
  { step: 2, title: "Reminder Schedule", desc: "Notification is sent according to configured reminder schedule." },
  { step: 3, title: "Record Renewal", desc: "Renewal is recorded when completed." },
  { step: 4, title: "Suspension Trigger", desc: "If expiry passes without valid renewal, account moves to the defined restricted/suspended state." },
  { step: 5, title: "User Notification", desc: "Users are informed of the reason and required action." },
  { step: 6, title: "Retention Policy", desc: "Historical data remains retained according to the client's retention policy." },
];

const STATUS_FILTERS = ["All", "Upcoming", "Due Soon", "Overdue", "Paid"];

const EVIDENCE_STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

// ------------------------------------------------------------------
// Helpers: turn whatever the API returns into the shape the UI uses.
// If your serializer uses different field names, this is the ONLY
// place you need to change.
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

// Evidence submissions can come back under a few different field names
// depending on the serializer used by admin/fees/ — this covers the
// common ones. If yours differs, adjust here only.
const EVIDENCE_STATUS_MAP = {
  pending: "Pending",
  submitted: "Pending",
  approved: "Approved",
  confirmed: "Approved",
  accepted: "Approved",
  rejected: "Rejected",
  declined: "Rejected",
};

const normalizeEvidenceStatus = (raw) =>
  EVIDENCE_STATUS_MAP[String(raw || "").toLowerCase().trim()] || "Pending";

const normalizeEvidence = (s, fee) => ({
  id: s.id,
  feeId: fee.id,
  feeReference: fee.reference,
  franchise: fee.franchise,
  fileUrl: s.file_url || s.file || null,
  fileName: s.file_name || (s.file_url || s.file || "").split("/").pop() || "Evidence file",
  note: s.note || "",
  status: normalizeEvidenceStatus(s.status),
  submittedAt: s.created_at || s.submitted_at || "",
  reviewNote: s.review_note || s.reviewer_note || "",
});

const normalizeFee = (f) => ({
  id: f.id,
  reference: f.reference || f.invoice_number || `INV-${f.id}`,
  franchiseId: f.franchise?.id ?? f.franchise_id ?? f.franchise,
  franchise: f.franchise_name || f.franchise?.name || "Unknown franchise",
  feeType: f.fee_type_display || f.fee_type_label || f.fee_type || f.description || "Fee",
  amount: Number(f.amount ?? 0),
  amountPaid: Number(f.amount_paid ?? f.paid_amount ?? 0),
  dueDate: f.due_date || "",
  agreementExpiry: f.agreement_expiry || f.agreement_expiry_date || "",
  status: normalizeStatus(f.status),
  // raw evidence submissions get normalized once the fee shape exists,
  // see loadFees below (needs `fee.reference`/`fee.franchise` for display)
  rawEvidence: f.evidence_submissions || f.payment_evidence || [],
});

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || []);

const formatGBP = (n) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatMonthYear = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

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
    case "Approved":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20";
    case "Due Soon":
    case "Pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
    case "Overdue":
    case "Rejected":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none";

const emptyFeeForm = {
  franchise: "",
  feeType: FEE_TYPES[0],
  amount: "",
  dueDate: "",
  agreementExpiry: "",
};

const emptyPaymentForm = {
  amount: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  method: PAYMENT_METHODS[0],
  reference: "",
  evidence: null,
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function FeesRenewals() {
  const [fees, setFees] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("tracker"); // 'tracker' | 'evidence' | 'workflow'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFee, setNewFee] = useState(emptyFeeForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [payFee, setPayFee] = useState(null); // the fee being paid, or null
  const [payForm, setPayForm] = useState(emptyPaymentForm);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const [remindingId, setRemindingId] = useState(null);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

  // ---------------- evidence review state ----------------
  const [evidenceFilter, setEvidenceFilter] = useState("Pending");
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectingSubmission, setRejectingSubmission] = useState(null); // submission being rejected (needs a note)
  const [rejectNote, setRejectNote] = useState("");
  const [rejectError, setRejectError] = useState("");

  // ---------------- data loading ----------------
  const loadFees = useCallback(async () => {
    setLoadError("");
    try {
      const { data } = await api.get("admin/fees/");
      setFees(unwrapList(data).map(normalizeFee));
    } catch (err) {
      setLoadError(getApiError(err, "Could not load fees. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFranchises = useCallback(async () => {
    try {
      const { data } = await api.get("admin/franchises/");
      setFranchises(
        unwrapList(data).map((f) => ({
          id: f.id,
          name: f.name || f.franchise_name || f.title || `Franchise #${f.id}`,
        }))
      );
    } catch {
      // The dropdown just stays empty; the load error banner covers fees only.
      setFranchises([]);
    }
  }, []);

  useEffect(() => {
    loadFees();
    loadFranchises();
  }, [loadFees, loadFranchises]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // ---------------- derived data ----------------
  const filteredFees = useMemo(
    () => fees.filter((f) => filterStatus === "All" || f.status === filterStatus),
    [fees, filterStatus]
  );

  const stats = useMemo(() => {
    const sum = (list) => list.reduce((acc, f) => acc + f.amount, 0);
    const total = sum(fees);
    const paid = sum(fees.filter((f) => f.status === "Paid"));
    const upcoming = fees.filter((f) => f.status === "Upcoming" || f.status === "Due Soon");
    const overdue = fees.filter((f) => f.status === "Overdue");

    const now = new Date();
    const in90 = new Date();
    in90.setDate(now.getDate() + 90);
    const renewalsDue = fees
      .filter((f) => f.agreementExpiry)
      .filter((f) => {
        const d = new Date(f.agreementExpiry);
        return d <= in90;
      });
    const uniqueFranchises = new Set(renewalsDue.map((f) => f.franchiseId));
    const soonest = renewalsDue
      .map((f) => f.agreementExpiry)
      .sort()[0];

    return {
      total,
      collectionRate: total ? Math.round((paid / total) * 100) : 0,
      upcomingTotal: sum(upcoming),
      overdueTotal: sum(overdue),
      overdueCount: overdue.length,
      renewalCount: uniqueFranchises.size,
      soonest,
    };
  }, [fees]);

  // Flatten every fee's evidence submissions into one reviewable list.
  const allEvidence = useMemo(
    () =>
      fees
        .flatMap((f) => (f.rawEvidence || []).map((s) => normalizeEvidence(s, f)))
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [fees]
  );

  const filteredEvidence = useMemo(
    () =>
      allEvidence.filter((s) => evidenceFilter === "All" || s.status === evidenceFilter),
    [allEvidence, evidenceFilter]
  );

  const pendingEvidenceCount = useMemo(
    () => allEvidence.filter((s) => s.status === "Pending").length,
    [allEvidence]
  );

  // ---------------- actions ----------------
  const handleAddFee = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await api.post("admin/fees/", {
        franchise: Number(newFee.franchise),
        fee_type: newFee.feeType,
        amount: newFee.amount,
        due_date: newFee.dueDate,
        agreement_expiry: newFee.agreementExpiry,
      });
      setIsModalOpen(false);
      setNewFee(emptyFeeForm);
      setNotice({ type: "success", text: "Fee configured successfully." });
      await loadFees();
    } catch (err) {
      setFormError(getApiError(err, "Could not save the fee. Please check the details."));
    } finally {
      setSaving(false);
    }
  };

  const openPayment = (fee) => {
    const outstanding = Math.max(fee.amount - fee.amountPaid, 0);
    setPayFee(fee);
    setPayForm({ ...emptyPaymentForm, amount: outstanding ? String(outstanding) : "" });
    setPayError("");
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payFee) return;
    setPaying(true);
    setPayError("");
    try {
      const formData = new FormData();
      formData.append("amount", payForm.amount);
      formData.append("paid_on", payForm.paymentDate);
      formData.append("method", payForm.method);
      formData.append("reference", payForm.reference);
      if (payForm.evidence) {
        formData.append("evidence", payForm.evidence);
      }

      await api.post(`admin/fees/${payFee.id}/payments/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPayFee(null);
      setNotice({ type: "success", text: `Payment recorded for ${payFee.franchise}.` });
      await loadFees();
    } catch (err) {
      setPayError(getApiError(err, "Could not record the payment."));
    } finally {
      setPaying(false);
    }
  };

  const handleSendReminder = async (fee) => {
    setRemindingId(fee.id);
    try {
      await api.post(`admin/fees/${fee.id}/remind/`);
      setNotice({ type: "success", text: `Reminder sent to ${fee.franchise}.` });
    } catch (err) {
      setNotice({ type: "error", text: getApiError(err, "Could not send the reminder.") });
    } finally {
      setRemindingId(null);
    }
  };

  // Approve is a single click. Reject opens a tiny modal so Head Office
  // can leave a note explaining why, which is passed back to the
  // franchise. Adjust the payload keys (`action` / `review_note`) to
  // match whatever PaymentEvidenceReviewView actually expects.
  const handleApproveEvidence = async (submission) => {
    setReviewingId(submission.id);
    try {
      await api.post(`admin/fees/evidence/${submission.id}/review/`, {
        action: "approve",
      });
      setNotice({ type: "success", text: `Evidence approved for ${submission.feeReference}.` });
      await loadFees();
    } catch (err) {
      setNotice({ type: "error", text: getApiError(err, "Could not approve the evidence.") });
    } finally {
      setReviewingId(null);
    }
  };

  const openReject = (submission) => {
    setRejectingSubmission(submission);
    setRejectNote("");
    setRejectError("");
  };

  const handleRejectEvidence = async (e) => {
    e.preventDefault();
    if (!rejectingSubmission) return;
    setReviewingId(rejectingSubmission.id);
    setRejectError("");
    try {
      await api.post(`admin/fees/evidence/${rejectingSubmission.id}/review/`, {
        action: "reject",
        review_note: rejectNote,
      });
      setNotice({
        type: "success",
        text: `Evidence rejected for ${rejectingSubmission.feeReference}.`,
      });
      setRejectingSubmission(null);
      await loadFees();
    } catch (err) {
      setRejectError(getApiError(err, "Could not reject the evidence."));
    } finally {
      setReviewingId(null);
    }
  };

  // ---------------- render ----------------
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Financial Governance
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Fees & Renewals
          </h1>
          <p className="text-xs text-slate-500">
            Configure franchise fee types, track invoice/payment statuses, review submitted
            payment evidence, and manage agreement renewals and automated suspension rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "tracker" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fee Tracker & Renewals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("evidence")}
              className={`relative rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "evidence" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Evidence Review
              {pendingEvidenceCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white">
                  {pendingEvidenceCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "workflow" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Renewal Workflow Rules
            </button>
          </div>

          {activeTab === "tracker" && (
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
            >
              <FaPlus className="text-xs" />
              <span>Configure New Fee</span>
            </button>
          )}
        </div>
      </div>

      {/* NOTICE BANNER */}
      {notice && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-xs font-semibold ring-1 ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20"
              : "bg-rose-50 text-rose-700 ring-rose-500/20"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* ================= TAB 1: FEES & RENEWALS TRACKER ================= */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Expected Fees</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{formatGBP(stats.total)}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">{stats.collectionRate}% Collection Rate</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming / Due Soon</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">{formatGBP(stats.upcomingTotal)}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Reminders scheduled</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue Invoices</p>
              <h3 className="text-xl font-black text-rose-600 mt-1">{formatGBP(stats.overdueTotal)}</h3>
              <p className="text-[11px] text-rose-500 font-semibold mt-1">
                {stats.overdueCount
                  ? `${stats.overdueCount} invoice${stats.overdueCount > 1 ? "s" : ""} • suspension rules active`
                  : "Nothing overdue"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreement Renewals Due</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {stats.renewalCount} {stats.renewalCount === 1 ? "Franchise" : "Franchises"}
              </h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                {stats.soonest ? `Next expiry ${formatMonthYear(stats.soonest)}` : "None in the next 90 days"}
              </p>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Invoice & Payment Status
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    filterStatus === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Franchise & Fee Type</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Due Date</th>
                    <th className="py-3.5 px-6">Agreement Expiry</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                        <FaSpinner className="mx-auto mb-2 animate-spin" />
                        Loading fees…
                      </td>
                    </tr>
                  )}

                  {!loading && loadError && (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 text-center">
                        <p className="text-rose-600 font-semibold">{loadError}</p>
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
                      </td>
                    </tr>
                  )}

                  {!loading && !loadError && filteredFees.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                        {fees.length === 0
                          ? "No fees configured yet. Use “Configure New Fee” to add the first one."
                          : `No ${filterStatus.toLowerCase()} fees.`}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !loadError &&
                    filteredFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{fee.franchise}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {fee.feeType} <span className="text-slate-400">• {fee.reference}</span>
                          </p>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">{formatGBP(fee.amount)}</td>
                        <td className="py-4 px-6 text-slate-600">{fee.dueDate || "—"}</td>
                        <td className="py-4 px-6 text-slate-600 font-mono">{fee.agreementExpiry || "—"}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(fee.status)}`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            {fee.status !== "Paid" && (
                              <button
                                type="button"
                                onClick={() => openPayment(fee)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                              >
                                <FaMoneyCheckAlt className="text-[10px]" /> Record Payment
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={remindingId === fee.id}
                              onClick={() => handleSendReminder(fee)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {remindingId === fee.id ? (
                                <FaSpinner className="animate-spin text-[10px]" />
                              ) : (
                                <FaBell className="text-[10px]" />
                              )}
                              {remindingId === fee.id ? "Sending…" : "Send Reminder"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: EVIDENCE REVIEW ================= */}
      {activeTab === "evidence" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Payment Evidence Submitted by Franchises
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {EVIDENCE_STATUS_FILTERS.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setEvidenceFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    evidenceFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Franchise & Fee</th>
                    <th className="py-3.5 px-6">File</th>
                    <th className="py-3.5 px-6">Note</th>
                    <th className="py-3.5 px-6">Submitted</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                        <FaSpinner className="mx-auto mb-2 animate-spin" />
                        Loading evidence…
                      </td>
                    </tr>
                  )}

                  {!loading && !loadError && filteredEvidence.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                        <FaFileUpload className="mx-auto mb-2 text-slate-300" />
                        {evidenceFilter === "All"
                          ? "No payment evidence has been submitted yet."
                          : `No ${evidenceFilter.toLowerCase()} evidence.`}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredEvidence.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{s.franchise}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{s.feeReference}</p>
                        </td>
                        <td className="py-4 px-6">
                          {s.fileUrl ? (
                            <a
                              href={s.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-teal-700 font-semibold hover:underline"
                            >
                              {s.fileName} <FaExternalLinkAlt className="text-[9px]" />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-600 max-w-55 truncate" title={s.note}>
                          {s.note || "—"}
                        </td>
                        <td className="py-4 px-6 text-slate-600">{formatDate(s.submittedAt)}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(s.status)}`}
                          >
                            {s.status}
                          </span>
                          {s.status === "Rejected" && s.reviewNote && (
                            <p className="mt-1 text-[10px] text-rose-500 max-w-45" title={s.reviewNote}>
                              {s.reviewNote}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {s.status === "Pending" ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                disabled={reviewingId === s.id}
                                onClick={() => handleApproveEvidence(s)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {reviewingId === s.id ? (
                                  <FaSpinner className="animate-spin text-[10px]" />
                                ) : (
                                  <FaCheckCircle className="text-[10px]" />
                                )}
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={reviewingId === s.id}
                                onClick={() => openReject(s)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaTimesCircle className="text-[10px]" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Reviewed</span>
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

      {/* ================= TAB 3: RENEWAL WORKFLOW RULES ================= */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Automated Renewal & Suspension Activity</h3>
            <p className="text-xs text-slate-500 mb-6">
              Platform rule sequence triggered when franchise agreements approach expiry or pass due dates without renewal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renewalWorkflowSteps.map((s) => (
                <div key={s.step} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 relative overflow-hidden">
                  <span className="absolute right-4 top-4 text-3xl font-black text-slate-200">
                    0{s.step}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
                    {s.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIGURE FEE MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Fee Configuration
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Configure Franchise Fee & Schedule</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddFee} className="py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Franchise
                  </label>
                  <select
                    value={newFee.franchise}
                    onChange={(e) => setNewFee({ ...newFee, franchise: e.target.value })}
                    required
                    className={inputCls}
                  >
                    <option value="" disabled>
                      {franchises.length ? "Select a franchise" : "No franchises available"}
                    </option>
                    {franchises.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee Type & Description
                  </label>
                  <select
                    value={newFee.feeType}
                    onChange={(e) => setNewFee({ ...newFee, feeType: e.target.value })}
                    className={inputCls}
                  >
                    {FEE_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Amount (£)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="5000"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Agreement Expiry
                    </label>
                    <input
                      type="date"
                      value={newFee.agreementExpiry}
                      onChange={(e) => setNewFee({ ...newFee, agreementExpiry: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {formError && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{formError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save & Initialize Fee"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= RECORD PAYMENT MODAL ================= */}
      <AnimatePresence>
        {payFee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !paying && setPayFee(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    {payFee.reference}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Record Payment</h3>
                  <p className="text-xs text-slate-500">
                    {payFee.franchise} • {formatGBP(payFee.amount)} due
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPayFee(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Amount (£)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={payForm.amount}
                      onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={payForm.paymentDate}
                      onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Method
                  </label>
                  <select
                    value={payForm.method}
                    onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                    className={inputCls}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Reference (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Bank reference or transaction ID"
                    value={payForm.reference}
                    onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Evidence (optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setPayForm({ ...payForm, evidence: e.target.files?.[0] || null })
                    }
                    className={inputCls}
                  />
                  {payForm.evidence && (
                    <p className="mt-1 text-[11px] text-slate-500">{payForm.evidence.name}</p>
                  )}
                </div>

                {payError && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{payError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPayFee(null)}
                    disabled={paying}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paying}
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {paying ? "Saving…" : "Record Payment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= REJECT EVIDENCE MODAL ================= */}
      <AnimatePresence>
        {rejectingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => reviewingId !== rejectingSubmission.id && setRejectingSubmission(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                    {rejectingSubmission.feeReference}
                  </span>
                  <h3 className="text-base font-black text-slate-900">Reject Payment Evidence</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectingSubmission(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleRejectEvidence} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Reason (sent back to {rejectingSubmission.franchise})
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="e.g. Amount on the receipt doesn't match the fee balance."
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    className={inputCls}
                  />
                </div>

                {rejectError && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700">{rejectError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingSubmission(null)}
                    disabled={reviewingId === rejectingSubmission.id}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewingId === rejectingSubmission.id}
                    className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewingId === rejectingSubmission.id ? "Rejecting…" : "Reject Evidence"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}