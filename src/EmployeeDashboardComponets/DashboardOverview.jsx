import React from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaFolderOpen,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const stats = [
  { label: "Today's Shifts", value: "2 visits", icon: <FaCalendarAlt />, key: "schedule" },
  { label: "Hours This Week", value: "18.5 hrs", icon: <FaClock />, key: "availability" },
  { label: "Assigned Customers", value: "6", icon: <FaUsers />, key: "customers" },
  { label: "Documents", value: "1 expiring soon", icon: <FaFolderOpen />, key: "documents" },
];

const today = [
  { time: "10:00 AM", customer: "Mary Johnson", service: "Personal Care", address: "24 Willow St" },
  { time: "2:00 PM", customer: "David Brown", service: "Companionship", address: "8 Pine Ave" },
];

const activity = [
  { text: "Your certification 'CPR Level C' expires in 12 days", time: "Today" },
  { text: "New message from Toronto West office", time: "Yesterday" },
  { text: "Shift with Mary Johnson confirmed", time: "2d ago" },
];

export default function DashboardOverview({ setActiveTab }) {
  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div>
        <h3 className="text-lg font-black text-slate-900">Welcome back, Sarah 👋</h3>
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

          <div className="space-y-3">
            {today.map((v, i) => (
              <div
                key={i}
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
                    <p className="text-xs font-bold text-slate-800">{v.customer}</p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400">
                      <FaMapMarkerAlt className="text-[9px]" /> {v.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{v.time}</p>
                  <p className="text-[11px] text-slate-400">{v.service}</p>
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