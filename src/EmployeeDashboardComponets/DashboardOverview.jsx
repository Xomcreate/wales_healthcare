import React, { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaFolderOpen,
  FaArrowRight,
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// Statuses the backend computes on each document (see Documents.jsx).
const EXPIRING_STATUSES = ["Expiring in 30 Days", "Expiring in 90 Days"];

function getLocalDateString(date = new Date()) {
  const pad = (v) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTime(hms) {
  if (!hms) return "";
  const [h, m] = hms.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Notes are stored as "Service: <name>" elsewhere in the app — pull the
// readable service name back out the same way.
function getServiceName(shift) {
  if (shift.service_name) return shift.service_name;
  if (!shift.notes) return "Service not specified";
  const match = shift.notes.match(/^Service:\s*(.+)$/i);
  return match ? match[1] : shift.notes;
}

function timeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export default function DashboardOverview({ setActiveTab }) {
  const [profile, setProfile] = useState(null);
  const [todayShifts, setTodayShifts] = useState([]);
  const [weekHours, setWeekHours] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     ESTIMATE HOURS WORKED THIS WEEK FROM SCHEDULED SHIFTS
     (falls back to a flat estimate per shift if no duration
     field is provided by the backend)
     ========================================================= */
  const computeWeekHours = useCallback((shifts) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const inThisWeek = shifts.filter((s) => {
      if (!s.scheduled_date) return false;
      const d = new Date(`${s.scheduled_date}T00:00:00`);
      return d >= startOfWeek && d < endOfWeek;
    });

    const totalHours = inThisWeek.reduce(
      (sum, s) => sum + (Number(s.duration_hours) || 2),
      0
    );

    return totalHours;
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [profileRes, upcomingRes, pastRes, customersRes, documentsRes] =
        await Promise.allSettled([
          api.get("/employees/me/"),
          api.get("/employees/me/schedule/", { params: { period: "upcoming" } }),
          api.get("/employees/me/schedule/", { params: { period: "past" } }),
          api.get("/employees/me/customers/"),
          api.get("/documents/me/"),
        ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data);
      }

      const upcoming =
        upcomingRes.status === "fulfilled"
          ? Array.isArray(upcomingRes.value.data)
            ? upcomingRes.value.data
            : upcomingRes.value.data?.results || []
          : [];

      const past =
        pastRes.status === "fulfilled"
          ? Array.isArray(pastRes.value.data)
            ? pastRes.value.data
            : pastRes.value.data?.results || []
          : [];

      const today = getLocalDateString();

      setTodayShifts(
        upcoming
          .filter((s) => s.scheduled_date === today)
          .sort((a, b) =>
            String(a.scheduled_time || "").localeCompare(String(b.scheduled_time || ""))
          )
      );

      setWeekHours(computeWeekHours([...upcoming, ...past]));

      if (customersRes.status === "fulfilled") {
        const customerData = Array.isArray(customersRes.value.data)
          ? customersRes.value.data
          : customersRes.value.data?.results || [];

        setCustomerCount(customerData.length);
      }

      let docsData = [];

      if (documentsRes.status === "fulfilled") {
        // The endpoint returns { employee_documents: [...] }, not a bare
        // array or a paginated { results: [...] } shape.
        docsData = Array.isArray(documentsRes.value.data?.employee_documents)
          ? documentsRes.value.data.employee_documents
          : [];

        setDocuments(docsData);
      }

      // Build a small activity feed from whatever real data we have —
      // expiring/expired documents and the most recently confirmed shifts.
      const feed = [];

      docsData
        .filter((doc) => EXPIRING_STATUSES.includes(doc.status) || doc.status === "Expired")
        .forEach((doc) => {
          const name = doc.document_name || "Certification";

          let text = `Your document '${name}' ${doc.status.toLowerCase()}`;

          if (doc.expiry_date && doc.status !== "Expired") {
            const daysLeft = Math.ceil(
              (new Date(doc.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            if (Number.isFinite(daysLeft)) {
              text = `Your document '${name}' expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
            }
          } else if (doc.status === "Expired") {
            text = `Your document '${name}' has expired`;
          }

          feed.push({
            text,
            time: "Today",
            sortDate: new Date(),
          });
        });

      past
        .filter((s) => s.status === "Completed" || s.status === "Confirmed")
        .slice(0, 3)
        .forEach((s) => {
          feed.push({
            text: `Shift with ${s.customer_name || "a customer"} ${
              s.status === "Completed" ? "completed" : "confirmed"
            }`,
            time: timeAgo(s.scheduled_date),
            sortDate: new Date(s.scheduled_date || 0),
          });
        });

      feed.sort((a, b) => b.sortDate - a.sortDate);

      setActivity(feed.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(
        err.response?.data?.detail || "Unable to load your dashboard right now."
      );
    } finally {
      setLoading(false);
    }
  }, [computeWeekHours]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const expiringDocsCount = documents.filter((doc) =>
    EXPIRING_STATUSES.includes(doc.status)
  ).length;

  const firstName =
    profile?.first_name ||
    profile?.full_name?.split(" ")[0] ||
    profile?.user?.first_name ||
    "there";

  const stats = [
    {
      label: "Today's Shifts",
      value: `${todayShifts.length} visit${todayShifts.length === 1 ? "" : "s"}`,
      icon: <FaCalendarAlt />,
      key: "schedule",
    },
    {
      label: "Hours This Week",
      value: `${weekHours} hrs`,
      icon: <FaClock />,
      key: "availability",
    },
    {
      label: "Assigned Customers",
      value: String(customerCount),
      icon: <FaUsers />,
      key: "customers",
    },
    {
      label: "Documents",
      value:
        expiringDocsCount > 0
          ? `${expiringDocsCount} expiring soon`
          : `${documents.length} on file`,
      icon: <FaFolderOpen />,
      key: "documents",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-2xl" style={{ color: BRAND_COLOR }} />
        <p className="text-xs font-semibold text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <FaExclamationTriangle className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* WELCOME */}
      <div>
        <h3 className="text-lg font-black text-slate-900">
          Welcome back, {firstName} 👋
        </h3>
        <p className="text-sm text-slate-500">Here's your work for today.</p>
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
        {/* TODAY'S SCHEDULE */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Today's Schedule</h4>
            <button
              onClick={() => setActiveTab("schedule")}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-600 hover:text-teal-700"
            >
              View Full Schedule <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {todayShifts.length === 0 ? (
            <p className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-6 text-center text-xs text-slate-400">
              No shifts scheduled for today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayShifts.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs"
                      style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                    >
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {v.customer_name || "Customer"}
                      </p>
                      {v.customer_address && (
                        <p className="flex items-center gap-1 text-[11px] text-slate-400">
                          <FaMapMarkerAlt className="text-[9px]" /> {v.customer_address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">
                      {formatTime(v.scheduled_time)}
                    </p>
                    <p className="text-[11px] text-slate-400">{getServiceName(v)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h4 className="mb-4 text-sm font-black text-slate-900">Recent Activity</h4>

          {activity.length === 0 ? (
            <p className="text-xs text-slate-400">No recent activity to show.</p>
          ) : (
            <div className="space-y-4">
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
          )}
        </div>
      </div>
    </div>
  );
}