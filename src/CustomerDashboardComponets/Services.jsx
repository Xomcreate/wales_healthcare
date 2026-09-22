import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaConciergeBell,
  FaPlusCircle,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import api from "../api/axios"; // adjust the path if this page lives at a different depth

const BRAND_COLOR = "#0d9488";

const bookingStatusStyle = {
  Scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  Completed: "bg-slate-100 text-slate-500 border-slate-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || []);

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getApiError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data.detail || fallback;
};

const todayISO = () => new Date().toISOString().split("T")[0];

export default function Services() {
  const [availableServices, setAvailableServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null); // { type: "success" | "info", text }

  const [showModal, setShowModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [servicesRes, appointmentsRes] = await Promise.all([
        api.get("services/available/"),
        api.get("appointments/me/"),
      ]);

      setAvailableServices(unwrapList(servicesRes.data));

      const appointments = unwrapList(appointmentsRes.data);
      setMyBookings(appointments.filter((a) => a.service));
    } catch (err) {
      setError(getApiError(err, "Could not load your services. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const selectedService = useMemo(
    () => availableServices.find((s) => String(s.id) === String(selectedServiceId)) || null,
    [availableServices, selectedServiceId]
  );

  const openModal = () => {
    setSelectedServiceId(availableServices[0]?.id || "");
    setForm({ date: todayISO(), time: "", notes: "" });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedServiceId) {
      setFormError("Please choose a service.");
      return;
    }
    if (!form.date) {
      setFormError("Please choose a date.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("services/book/", {
        service: selectedServiceId,
        scheduled_date: form.date,
        scheduled_time: form.time || undefined,
        notes: form.notes,
      });

      setMyBookings((prev) => [data.appointment, ...prev]);
      setShowModal(false);

      setNotice({
        type: "success",
        text: data.invoice
          ? `${selectedService?.name || "Service"} booked — an invoice for ${formatMoney(
              data.invoice.amount,
              data.invoice.currency || "USD"
            )} has been added to Invoices & Payments.`
          : `${selectedService?.name || "Service"} booked successfully.`,
      });
    } catch (err) {
      setFormError(getApiError(err, "Could not book this service. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">My Services</h3>
          <p className="text-xs text-slate-500">Services offered by your franchise, and what you've booked.</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          disabled={loading || availableServices.length === 0}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: BRAND_COLOR }}
        >
          <FaPlusCircle /> Book a Service
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {notice.type === "success" && <FaCheckCircle className="mt-0.5 shrink-0" />}
          <span>{notice.text}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-10 text-xs font-semibold text-slate-500 shadow-xs">
          <FaSpinner className="animate-spin" /> Loading your services…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-10 text-center shadow-xs">
          <p className="text-xs font-semibold text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {myBookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-xs text-slate-500">
              You haven't booked any services yet.
            </div>
          )}

          {myBookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-base"
                  style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                >
                  <FaConciergeBell />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{b.service_name || "Service"}</p>
                  <p className="text-[11px] text-slate-400">
                    {formatDate(b.scheduled_date)}
                    {b.scheduled_time ? ` · ${b.scheduled_time}` : ""} ·{" "}
                    {b.employee_name || "Awaiting staff assignment"}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  bookingStatusStyle[b.status] || bookingStatusStyle.Scheduled
                }`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Book a Service modal                                  */}
      {/* ---------------------------------------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900">Book a Service</h4>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleBook}>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                >
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.price != null ? ` — ${formatMoney(s.price)}` : ""}
                    </option>
                  ))}
                </select>
                {selectedService?.description && (
                  <p className="mt-1 text-[11px] text-slate-400">{selectedService.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </label>
                  <input
                    type="date"
                    min={todayISO()}
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Anything the care team should know before this visit"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {selectedService?.price != null && (
                <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[11px] font-semibold text-teal-700">
                  <FaFileInvoiceDollar />
                  Booking this will create a {formatMoney(selectedService.price)} invoice under Invoices &
                  Payments.
                </div>
              )}

              {formError && <p className="text-[11px] font-semibold text-rose-600">{formError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: BRAND_COLOR }}
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}