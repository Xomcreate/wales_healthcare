import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const fields = [
  { label: "Full Name", value: "Mary Johnson", key: "name" },
  { label: "Phone", value: "(647) 555-0182", key: "phone" },
  { label: "Email", value: "mary.johnson@email.com", key: "email" },
  { label: "Address", value: "24 Willow St, Toronto, ON", key: "address" },
  { label: "Emergency Contact", value: "James Johnson — (647) 555-0199", key: "emergency" },
];

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
            MJ
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Mary Johnson</h3>
            <p className="text-xs font-semibold text-slate-400">
              Customer since Jan 2024 · Toronto West franchise
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
              {editing ? (
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

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-xs text-slate-500">
        Some fields may be restricted or require franchise confirmation before changes take effect,
        depending on your franchise's policy.
      </div>
    </div>
  );
}