import React, { useState } from "react";
import { FaClock, FaSave } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Availability() {
  const [availability, setAvailability] = useState({
    Monday: { available: true, from: "08:00", to: "16:00" },
    Tuesday: { available: true, from: "08:00", to: "16:00" },
    Wednesday: { available: false, from: "", to: "" },
    Thursday: { available: true, from: "10:00", to: "18:00" },
    Friday: { available: true, from: "08:00", to: "16:00" },
    Saturday: { available: false, from: "", to: "" },
    Sunday: { available: false, from: "", to: "" },
  });

  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Availability</h3>
          <p className="text-xs text-slate-500">
            This directly affects which shifts your franchise can assign to you.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: BRAND_COLOR }}
        >
          <FaSave /> Save Availability
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaClock style={{ color: BRAND_COLOR }} /> Weekly Availability
        </h4>

        <div className="space-y-3">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={availability[day].available}
                    onChange={() => toggleDay(day)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-teal-600 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:after:translate-x-4" />
                </label>
                <p className="w-24 text-xs font-bold text-slate-800">{day}</p>
              </div>

              {availability[day].available ? (
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="time"
                    defaultValue={availability[day].from}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    defaultValue={availability[day].to}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-[11px] font-semibold text-slate-400">Unavailable</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}