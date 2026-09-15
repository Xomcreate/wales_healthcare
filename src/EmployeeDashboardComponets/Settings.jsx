import React from "react";
import { FaLock, FaBell } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

function Toggle({ defaultChecked = true }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-teal-600 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:after:translate-x-4" />
    </label>
  );
}

export default function Settings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black text-slate-900">Account Settings</h3>

      {/* SECURITY */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaLock style={{ color: BRAND_COLOR }} /> Security
        </h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Change Password
          </button>
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Enable Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaBell style={{ color: BRAND_COLOR }} /> Notification Preferences
        </h4>
        <div className="space-y-4">
          {[
            "Shift reminders",
            "Schedule change alerts",
            "Document expiry reminders",
            "Messages from my franchise",
          ].map((label, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">{label}</p>
              <Toggle defaultChecked={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}