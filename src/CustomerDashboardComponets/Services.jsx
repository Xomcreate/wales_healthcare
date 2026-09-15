import React from "react";
import { FaConciergeBell, FaPlusCircle } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const services = [
  { name: "Personal Care", status: "Active", since: "Jan 2024", frequency: "3x / week" },
  { name: "Companionship", status: "Active", since: "Mar 2024", frequency: "1x / week" },
  { name: "Nursing Support", status: "Completed", since: "Oct 2023 – Dec 2023", frequency: "Weekly" },
];

const statusStyle = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-100 text-slate-500 border-slate-200",
  Paused: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Services() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">My Services</h3>
          <p className="text-xs text-slate-500">Services approved and provided by your franchise.</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: BRAND_COLOR }}
        >
          <FaPlusCircle /> Request New Service
        </button>
      </div>

      <div className="space-y-3">
        {services.map((s, i) => (
          <div
            key={i}
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
                <p className="text-sm font-bold text-slate-800">{s.name}</p>
                <p className="text-[11px] text-slate-400">
                  {s.frequency} · Since {s.since}
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle[s.status]}`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}