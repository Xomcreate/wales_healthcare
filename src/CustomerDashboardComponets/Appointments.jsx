import React, { useState } from "react";
import { FaCalendarAlt, FaUserNurse } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const appointments = {
  Upcoming: [
    { date: "Tomorrow", time: "10:00 AM", service: "Personal Care", caregiver: "Sarah Lee" },
    { date: "Fri, Sep 18", time: "2:00 PM", service: "Companionship", caregiver: "David Brown" },
  ],
  Past: [
    { date: "Sep 8, 2026", time: "10:00 AM", service: "Personal Care", caregiver: "Sarah Lee" },
    { date: "Sep 1, 2026", time: "10:00 AM", service: "Personal Care", caregiver: "Sarah Lee" },
  ],
};

export default function Appointments() {
  const [tab, setTab] = useState("Upcoming");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">Appointments</h3>
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
        {appointments[tab].map((a, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-11 w-11 flex-col items-center justify-center rounded-xl text-[10px] font-black"
                style={{ background: "#ccfbf1", color: BRAND_COLOR }}
              >
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{a.service}</p>
                <p className="text-[11px] text-slate-400">
                  {a.date} · {a.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <FaUserNurse className="text-slate-400" /> {a.caregiver}
              </div>

              {tab === "Upcoming" ? (
                <div className="flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                    Reschedule
                  </button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50">
                    Cancel
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