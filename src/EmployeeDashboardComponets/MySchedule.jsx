import React, { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaExclamationCircle } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const shifts = {
  Upcoming: [
    { date: "Today", time: "10:00 AM", customer: "Mary Johnson", service: "Personal Care", address: "24 Willow St" },
    { date: "Today", time: "2:00 PM", customer: "David Brown", service: "Companionship", address: "8 Pine Ave" },
    { date: "Tomorrow", time: "9:00 AM", customer: "Sarah Lee Sr.", service: "Nursing Support", address: "12 Maple Cr" },
  ],
  Past: [
    { date: "Sep 12, 2026", time: "10:00 AM", customer: "Mary Johnson", service: "Personal Care", address: "24 Willow St" },
    { date: "Sep 10, 2026", time: "2:00 PM", customer: "David Brown", service: "Companionship", address: "8 Pine Ave" },
  ],
};

export default function Schedule() {
  const [tab, setTab] = useState("Upcoming");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">My Schedule</h3>
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {["Upcoming", "Past"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                tab === t ? "bg-white shadow-xs text-slate-900" : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {shifts[tab].map((v, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-sm"
                style={{ background: "#ccfbf1", color: BRAND_COLOR }}
              >
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{v.customer}</p>
                <p className="text-[11px] text-slate-400">{v.service}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                  <FaMapMarkerAlt className="text-[9px]" /> {v.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{v.time}</p>
                <p className="text-[11px] text-slate-400">{v.date}</p>
              </div>

              {tab === "Upcoming" ? (
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 hover:bg-amber-100">
                    <FaExclamationCircle className="text-[10px]" /> Flag Conflict
                  </button>
                </div>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase text-slate-500">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}