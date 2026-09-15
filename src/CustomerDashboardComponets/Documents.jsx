import React from "react";
import { FaFolderOpen, FaFilePdf, FaDownload } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const documents = [
  { name: "Care Plan Agreement", date: "Jan 12, 2024", type: "PDF" },
  { name: "Service Consent Form", date: "Jan 12, 2024", type: "PDF" },
  { name: "Assessment Summary", date: "Mar 4, 2024", type: "PDF" },
];

export default function Documents() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">My Documents</h3>
        <p className="text-xs text-slate-500">
          Documents shared with you by your franchise. Read-only unless noted otherwise.
        </p>
      </div>

      <div className="space-y-3">
        {documents.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
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
                <p className="text-[11px] text-slate-400">Shared {d.date} · {d.type}</p>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
              <FaDownload className="text-[10px]" /> Download
            </button>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <FaFolderOpen className="mb-3 text-2xl text-slate-300" />
          <p className="text-sm font-bold text-slate-500">No documents yet</p>
          <p className="text-xs text-slate-400">Your franchise will share documents here.</p>
        </div>
      )}
    </div>
  );
}