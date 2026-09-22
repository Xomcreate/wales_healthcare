import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaConciergeBell,
  FaFolderOpen,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import api from "../api/axios"; // adjust path to wherever your axios instance lives

const BRAND_COLOR = "#0d9488";

function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `$${value.toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, tomorrow)) return "Tomorrow";

  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  // scheduled_time typically comes back as "HH:MM:SS"
  const [h, m] = timeStr.split(":");
  if (h === undefined) return timeStr;
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// =========================================================
// UNWRAP LIST HELPER
//
// invoices/me/ returns { results: [...], outstanding_balance }
// rather than a bare array, unlike appointments/me/ and
// documents/me/ (customer_documents). This normalizes either
// shape so callers don't need to know which endpoint does what.
// =========================================================

function unwrapList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function Overview({ setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [me, setMe] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [meRes, appointmentsRes, invoicesRes, documentsRes] = await Promise.all([
          api.get("auth/me/"),
          api.get("appointments/me/"),
          api.get("invoices/me/"),
          api.get("documents/me/"),
        ]);

        if (cancelled) return;

        setMe(meRes.data);
        setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
        setInvoices(unwrapList(invoicesRes.data));
        setDocuments(Array.isArray(documentsRes.data) ? documentsRes.data : []);
      } catch (err) {
        if (!cancelled) {
          setError("We couldn't load your dashboard right now. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  // -----------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((a) => {
      if (!a.scheduled_date) return false;
      const apptDate = new Date(`${a.scheduled_date}T${a.scheduled_time || "00:00:00"}`);
      return apptDate >= now && a.status !== "Cancelled";
    })
    .sort(
      (a, b) =>
        new Date(`${a.scheduled_date}T${a.scheduled_time || "00:00:00"}`) -
        new Date(`${b.scheduled_date}T${b.scheduled_time || "00:00:00"}`)
    );

  const nextAppointment = upcomingAppointments[0];

  const outstandingBalance = invoices
    .filter((inv) => inv.status && inv.status.toLowerCase() !== "paid")
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const activeService = me?.profile?.service_interest || "Not set";

  const stats = [
    {
      label: "Next Appointment",
      value: nextAppointment
        ? `${formatDate(nextAppointment.scheduled_date)}, ${formatTime(nextAppointment.scheduled_time)}`
        : "No upcoming appointments",
      icon: <FaCalendarAlt />,
      key: "appointments",
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(outstandingBalance),
      icon: <FaFileInvoiceDollar />,
      key: "invoices",
    },
    {
      label: "Active Service",
      value: activeService,
      icon: <FaConciergeBell />,
      key: "services",
    },
    {
      label: "Documents on File",
      value: String(documents.length),
      icon: <FaFolderOpen />,
      key: "documents",
    },
  ];

  const upcoming = upcomingAppointments.slice(0, 2).map((a) => ({
    time: formatTime(a.scheduled_time),
    date: formatDate(a.scheduled_date),
    caregiver: a.employee_name || "Unassigned",
    status: a.status,
  }));

  // Recent activity, stitched together from what we already fetched
  // (there's no dedicated activity-feed endpoint yet).
  const activity = [
    ...invoices.map((inv) => ({
      text: `Invoice ${inv.invoice_number} — ${inv.status}`,
      time: inv.created_at,
    })),
    ...appointments.map((a) => ({
      text: `Appointment ${a.status.toLowerCase()} with ${a.employee_name || "your caregiver"}`,
      time: a.updated_at || a.created_at,
    })),
    ...documents.map((d) => ({
      text: `Document uploaded: ${d.file_name}`,
      time: d.uploaded_at,
    })),
  ]
    .filter((item) => item.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4)
    .map((item) => ({ text: item.text, time: timeAgo(item.time) }));

  const firstName = (me?.full_name || "").split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div>
        <h3 className="text-lg font-black text-slate-900">Welcome back, {firstName} 👋</h3>
        <p className="text-sm text-slate-500">Here's what's happening with your care plan.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveTab(s.key)}
            className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-base shadow-sm"
              style={{ background: "#ccfbf1", color: BRAND_COLOR }}
            >
              {s.icon}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">{s.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* UPCOMING APPOINTMENTS */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Upcoming Appointments</h4>
            <button
              onClick={() => setActiveTab("appointments")}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-600 hover:text-teal-700"
            >
              View All <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          <div className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-xs text-slate-400">No upcoming appointments.</p>
            )}
            {upcoming.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs"
                    style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                  >
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{a.status}</p>
                    <p className="text-[11px] text-slate-400">with {a.caregiver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{a.time}</p>
                  <p className="text-[11px] text-slate-400">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h4 className="mb-4 text-sm font-black text-slate-900">Recent Activity</h4>
          <div className="space-y-4">
            {activity.length === 0 && (
              <p className="text-xs text-slate-400">No recent activity.</p>
            )}
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: BRAND_COLOR }}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{a.text}</p>
                  <p className="text-[10px] text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}