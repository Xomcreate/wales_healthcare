import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSave, FaCertificate } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const fields = [
  { label: "Full Name", value: "Sarah Lee", key: "name" },
  { label: "Employee ID", value: "EMP-0231", key: "id" },
  { label: "Phone", value: "(647) 555-0211", key: "phone" },
  { label: "Email", value: "sarah.lee@waleshealthcare.com", key: "email" },
  { label: "Role", value: "Personal Support Worker", key: "role" },
  { label: "Franchise", value: "Toronto West", key: "franchise" },
];

const qualifications = [
  { name: "PSW Certification", status: "Valid", expiry: "Jun 2027" },
  { name: "CPR Level C", status: "Expiring Soon", expiry: "Sep 27, 2026" },
  { name: "First Aid", status: "Valid", expiry: "Jan 2028" },
];

const statusStyle = {
  Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Profile() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md"
            style={{ background: BRAND_COLOR }}
          >
            SL
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Sarah Lee</h3>
            <p className="text-xs font-semibold text-slate-400">
              Personal Support Worker · Toronto West franchise
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100"
        >
          {editing ? <FaSave /> : <FaEdit />}
          {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaUserCircle style={{ color: BRAND_COLOR }} /> Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {f.label}
              </label>
              {editing && f.key !== "id" && f.key !== "role" && f.key !== "franchise" ? (
                <input
                  defaultValue={f.value}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800">{f.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaCertificate style={{ color: BRAND_COLOR }} /> Qualifications & Certifications
        </h4>

        <div className="space-y-3">
          {qualifications.map((q, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">{q.name}</p>
                <p className="text-[11px] text-slate-400">Expires {q.expiry}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle[q.status]}`}
              >
                {q.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-xs text-slate-500">
        Role, employee ID, and franchise assignment are managed by your franchise office and cannot be
        edited here.
      </div>
    </div>
  );
}