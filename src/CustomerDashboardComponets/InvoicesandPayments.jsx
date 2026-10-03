import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaFileInvoiceDollar, FaSpinner, FaTimes, FaFileUpload, FaCheckCircle,
  FaTimesCircle, FaInfoCircle, FaCreditCard,
} from "react-icons/fa";
import api from "../api/axios";

const statusStyle = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const NOTICE_STYLES = {
  success: "bg-emerald-50 text-emerald-700",
  error: "bg-rose-50 text-rose-700",
  info: "bg-amber-50 text-amber-700",
};

const normalizeInvoice = (inv) => ({
  id: inv.id,
  number: inv.invoice_number,
  date: inv.issued_at,
  amount: Number(inv.amount ?? 0),
  status: inv.status,
  description: inv.description || "",
  evidenceSubmissions: inv.evidence_submissions || [],
});

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || []);
// Card payments are taken in GBP, so show GBP everywhere on this page.
const formatMoney = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n || 0);
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" });
};
const getApiError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data.detail || fallback;
};

export default function InvoicesandPayments() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // { type: 'success' | 'error' | 'info', text, duration? }
  const [notice, setNotice] = useState(null);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({ invoiceId: "", note: "", file: null });
  const [submitting, setSubmitting] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");

  // ---------------- Stripe card payment state ----------------
  const [payingInvoiceId, setPayingInvoiceId] = useState(null); // invoice being sent to Stripe
  const [verifyingPayment, setVerifyingPayment] = useState(false); // coming back from Stripe
  const verifiedRef = useRef(false); // stops React StrictMode double-verifying

  const loadInvoices = useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get("invoices/me/");
      setInvoices(unwrapList(data.results ?? data).map(normalizeInvoice));
    } catch (err) {
      setError(getApiError(err, "Could not load your invoices. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInvoices(); }, [loadInvoices]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), notice.duration || 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // ---------------- Stripe: handle the redirect back from Checkout ----------------
  //   ?payment=success&session_id=cs_...   (finished)
  //   ?payment=cancelled                   (customer pressed "back")
  useEffect(() => {
    if (verifiedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const result = params.get("payment");
    const sessionId = params.get("session_id");

    if (!result) return;
    verifiedRef.current = true;

    // Clean the URL straight away so a refresh doesn't re-run this.
    window.history.replaceState({}, "", window.location.pathname);

    if (result === "cancelled") {
      setNotice({
        type: "info",
        text: "Payment cancelled. No money was taken from your card.",
        duration: 8000,
      });
      return;
    }

    if (result === "success" && sessionId) {
      (async () => {
        setVerifyingPayment(true);
        try {
          const { data } = await api.post("invoices/me/verify-session/", {
            session_id: sessionId,
          });

          if (data.paid) {
            const num = data.invoice?.invoice_number;
            setNotice({
              type: "success",
              text: num
                ? `Payment successful! Your payment for ${num} has been confirmed. Thank you.`
                : "Payment successful! Your payment has been confirmed. Thank you.",
              duration: 8000,
            });
          } else {
            setNotice({
              type: "info",
              text:
                data.detail ||
                "We haven't received confirmation of this payment yet. If you were charged, it will appear here shortly.",
              duration: 8000,
            });
          }
        } catch (err) {
          setNotice({
            type: "error",
            text: getApiError(
              err,
              "We couldn't verify your payment right now. If you were charged, it will appear here shortly."
            ),
            duration: 8000,
          });
        } finally {
          setVerifyingPayment(false);
          await loadInvoices();
        }
      })();
    }
  }, [loadInvoices]);

  const outstanding = useMemo(
    () => invoices.filter((i) => i.status === "Overdue" || i.status === "Pending"),
    [invoices]
  );
  const outstandingTotal = outstanding.reduce((sum, i) => sum + i.amount, 0);

  // ---------------- pay an invoice by card (Stripe Checkout) ----------------
  const handlePayWithCard = async (invoice) => {
    setPayingInvoiceId(invoice.id);
    try {
      const { data } = await api.post(`invoices/me/${invoice.id}/checkout/`, {
        // Stripe sends the customer back to exactly this page.
        return_url: `${window.location.origin}${window.location.pathname}`,
      });

      if (!data.checkout_url) {
        throw new Error("No checkout URL returned");
      }

      // Hand over to Stripe's hosted payment page.
      window.location.href = data.checkout_url;
    } catch (err) {
      setNotice({
        type: "error",
        text: getApiError(err, "Could not start the card payment. Please try again."),
      });
      setPayingInvoiceId(null);
    }
  };

  // ---------------- evidence upload (bank transfer etc.) ----------------
  const openEvidenceModal = (invoiceId) => {
    setEvidenceForm({ invoiceId: invoiceId ? String(invoiceId) : "", note: "", file: null });
    setEvidenceError("");
    setShowEvidenceModal(true);
  };

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceForm.invoiceId) return setEvidenceError("Please select which invoice this is for.");
    if (!evidenceForm.file) return setEvidenceError("Please attach a file.");

    setSubmitting(true);
    setEvidenceError("");
    try {
      const formData = new FormData();
      formData.append("file", evidenceForm.file);
      formData.append("note", evidenceForm.note);

      const headers = { "Content-Type": "multipart/form-data" };
      delete headers["Content-Type"]; // let the browser set the multipart boundary

      await api.post(`invoices/me/${evidenceForm.invoiceId}/evidence/`, formData, { headers });

      setShowEvidenceModal(false);
      setNotice({ type: "success", text: "Payment evidence submitted. Your franchise will confirm it." });
      await loadInvoices();
    } catch (err) {
      setEvidenceError(getApiError(err, "Could not submit evidence. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Invoices & Payments</h3>
          <p className="text-xs text-slate-500">
            Outstanding balance:{" "}
            <span className={`font-bold ${outstandingTotal > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {formatMoney(outstandingTotal)}
            </span>
          </p>
        </div>
        <button
          onClick={() => openEvidenceModal("")}
          disabled={loading || outstanding.length === 0}
          className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-60"
        >
          <FaFileUpload className="text-[10px]" /> Paid another way? Submit Evidence
        </button>
      </div>

      {/* VERIFYING STRIPE PAYMENT BANNER */}
      {verifyingPayment && (
        <div
          role="status"
          className="rounded-xl px-4 py-3 text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-2"
        >
          <FaSpinner className="animate-spin text-[11px]" />
          Confirming your payment with Stripe… please don't close this page.
        </div>
      )}

      {/* NOTICE BANNER */}
      {notice && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-start justify-between gap-3 ${
            NOTICE_STYLES[notice.type] || NOTICE_STYLES.info
          }`}
        >
          <span className="flex items-start gap-2">
            {notice.type === "success" && <FaCheckCircle className="text-[12px] mt-0.5 shrink-0" />}
            {notice.type === "error" && <FaTimesCircle className="text-[12px] mt-0.5 shrink-0" />}
            {notice.type === "info" && <FaInfoCircle className="text-[12px] mt-0.5 shrink-0" />}
            <span>{notice.text}</span>
          </span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  <FaSpinner className="mx-auto mb-2 animate-spin" /> Loading invoices…
                </td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-rose-600 font-semibold">{error}</td></tr>
              )}
              {!loading && !error && invoices.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  You don't have any invoices yet.
                </td></tr>
              )}
              {!loading && !error && invoices.map((inv) => {
                const latest = inv.evidenceSubmissions[0];
                return (
                  <tr key={inv.id}>
                    <td className="flex items-center gap-2 px-5 py-3.5 font-bold text-slate-800">
                      <FaFileInvoiceDollar className="text-teal-600" /> {inv.number}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(inv.date)}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{formatMoney(inv.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[inv.status]}`}>
                        {inv.status}
                      </span>
                      {latest && inv.status !== "Paid" && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Evidence {latest.status.toLowerCase()} {formatDate(latest.created_at)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {inv.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <FaCheckCircle className="text-[10px]" /> Paid
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handlePayWithCard(inv)}
                            disabled={payingInvoiceId !== null || verifyingPayment}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {payingInvoiceId === inv.id ? (
                              <FaSpinner className="animate-spin text-[10px]" />
                            ) : (
                              <FaCreditCard className="text-[10px]" />
                            )}
                            {payingInvoiceId === inv.id ? "Redirecting…" : `Pay ${formatMoney(inv.amount)}`}
                          </button>
                          <button
                            onClick={() => openEvidenceModal(inv.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition"
                          >
                            Submit Evidence
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => !submitting && setShowEvidenceModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900">Submit Payment Evidence</h4>
              <button onClick={() => !submitting && setShowEvidenceModal(false)} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmitEvidence} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Which Invoice</label>
                <select
                  required
                  value={evidenceForm.invoiceId}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, invoiceId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="" disabled>{outstanding.length ? "Select an invoice" : "No outstanding invoices"}</option>
                  {outstanding.map((i) => (
                    <option key={i.id} value={i.id}>{i.number} — {formatMoney(i.amount)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">File</label>
                <input
                  type="file" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, file: e.target.files?.[0] || null })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Note (optional)</label>
                <textarea
                  rows="3"
                  value={evidenceForm.note}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              {evidenceError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{evidenceError}</p>}
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowEvidenceModal(false)} disabled={submitting} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Evidence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}