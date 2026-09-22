import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaFileInvoiceDollar, FaSpinner, FaTimes, FaFileUpload, FaCheckCircle,
} from "react-icons/fa";
import api from "../api/axios";

const statusStyle = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
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
const formatMoney = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
  const [notice, setNotice] = useState("");

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({ invoiceId: "", note: "", file: null });
  const [submitting, setSubmitting] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");

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
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const outstanding = useMemo(
    () => invoices.filter((i) => i.status === "Overdue" || i.status === "Pending"),
    [invoices]
  );
  const outstandingTotal = outstanding.reduce((sum, i) => sum + i.amount, 0);

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
      setNotice("Payment evidence submitted. Your franchise will confirm it.");
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
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition disabled:opacity-60"
        >
          <FaFileUpload className="text-[10px]" /> Submit Payment Evidence
        </button>
      </div>

      {notice && (
        <div role="status" className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700">
          {notice}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
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
                      <button
                        onClick={() => openEvidenceModal(inv.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition"
                      >
                        Submit Evidence
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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