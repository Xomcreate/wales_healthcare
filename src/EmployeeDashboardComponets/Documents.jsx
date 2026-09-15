import React from "react";
import { FaFolderOpen, FaFilePdf, FaUpload, FaExclamationTriangle } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const documents = [
  { name: "PSW Certification", status: "Valid", expiry: "Jun 2027" },
  { name: "CPR Level C", status: "Expiring Soon", expiry: "Sep 27, 2026" },
  { name: "First Aid Certificate", status: "Valid", expiry: "Jan 2028" },
  { name: "Police Background Check", status: "Valid", expiry: "Mar 2027" },
];

const statusStyle = {
  Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Documents() {
  const expiringSoon = documents.filter((d) => d.status === "Expiring Soon");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">My Documents</h3>
        <p className="text-xs text-slate-500">
          Keep your certifications current to remain eligible for scheduling.
        </p>
      </div>

      {expiringSoon.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <FaExclamationTriangle className="mt-0.5 text-amber-500" />
          <p className="text-xs font-semibold text-amber-700">
            {expiringSoon.length} document{expiringSoon.length > 1 ? "s" : ""} expiring soon. Upload a
            renewed version to stay eligible for scheduling.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {documents.map((d, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-base"
                style={{ background: "#ccfbf1", color: BRAND_COLOR }}
              >
                <FaFilePdf />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{d.name}</p>
                <p className="text-[11px] text-slate-400">Expires {d.expiry}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle[d.status]}`}
              >
                {d.status}
              </span>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                <FaUpload className="text-[10px]" /> Replace
              </button>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <FaFolderOpen className="mb-3 text-2xl text-slate-300" />
          <p className="text-sm font-bold text-slate-500">No documents on file</p>
        </div>
      )}
    </div>
  );
}