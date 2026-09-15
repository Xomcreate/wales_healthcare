import React from "react";
import {
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaConciergeBell,
  FaFolderOpen,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const stats = [
  { label: "Next Appointment", value: "Tomorrow, 10:00 AM", icon: <FaCalendarAlt />, key: "appointments" },
  { label: "Outstanding Balance", value: "$140.00", icon: <FaFileInvoiceDollar />, key: "invoices" },
  { label: "Active Service", value: "Personal Care", icon: <FaConciergeBell />, key: "services" },
  { label: "Documents on File", value: "3", icon: <FaFolderOpen />, key: "documents" },
];

const upcoming = [
  { time: "10:00 AM", date: "Tomorrow", service: "Personal Care", caregiver: "Sarah Lee" },
  { time: "2:00 PM", date: "Fri, Sep 18", service: "Companionship", caregiver: "David Brown" },
];

const activity = [
  { text: "Invoice #1042 was sent to you", time: "2h ago" },
  { text: "Appointment confirmed with Sarah Lee", time: "1d ago" },
  { text: "New message from your franchise office", time: "2d ago" },
];

export default function Overview({ setActiveTab }) {
  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div>
        <h3 className="text-lg font-black text-slate-900">Welcome back, Mary 👋</h3>
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
                    <p className="text-xs font-bold text-slate-800">{a.service}</p>
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