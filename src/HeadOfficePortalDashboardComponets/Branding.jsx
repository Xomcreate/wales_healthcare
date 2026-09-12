import React from "react";
import { FaDownload } from "react-icons/fa";

const brandAssets = [
  {
    id: "AST-01",
    title: "Official Brand Logos & Vector Variants",
    category: "Brand Management",
    type: "Logo & Graphics",
    controlState: "Head Office Controlled",
    description: "Primary and secondary logo marks, light/dark variants, and brand iconography.",
    updated: "2026-09-01",
  },
  {
    id: "AST-02",
    title: "Brand Colors & Typography Tokens",
    category: "Brand Management",
    type: "Tokens",
    controlState: "Head Office Controlled",
    description: "Tailwind and CSS variables for platform-wide color palette and font hierarchies.",
    updated: "2026-08-15",
  },
  {
    id: "AST-03",
    title: "Approved Invoice & Receipt Templates",
    category: "Brand Management",
    type: "Templates",
    controlState: "Read Only",
    description: "Standardized PDF billing templates with automated franchise header injection.",
    updated: "2026-09-10",
  },
  {
    id: "AST-04",
    title: "Standard Email & SMS Notification Templates",
    category: "Brand Management",
    type: "Communication",
    controlState: "Franchise Editable",
    description: "Pre-approved customer touchpoint scripts with localized signature placeholders.",
    updated: "2026-09-05",
  },
];

const getControlBadgeStyle = (state) => {
  switch (state) {
    case "Head Office Controlled":
      return "bg-purple-50 text-purple-700 ring-1 ring-purple-500/20";
    case "Franchise Editable":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
    case "Read Only":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-300";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function Branding() {
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Governance
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Branding
          </h1>
          <p className="text-xs text-slate-500">
            Maintain brand consistency across logos, tokens, templates and communication assets network-wide.
          </p>
        </div>
      </div>

      {/* ================= BRAND MANAGEMENT ================= */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-base font-black text-slate-900 mb-1">Brand Assets & Design Tokens</h3>
        <p className="text-xs text-slate-500 mb-4">
          All assets below clearly state whether fields/resources are{" "}
          <span className="font-bold text-slate-900">Head Office Controlled</span>,{" "}
          <span className="font-bold text-slate-900">Franchise Editable</span>, or{" "}
          <span className="font-bold text-slate-900">Read Only</span> to remove ambiguity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between hover:border-teal-500/50 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-600">
                    {asset.type}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getControlBadgeStyle(
                      asset.controlState
                    )}`}
                  >
                    {asset.controlState}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{asset.title}</h4>
                <p className="text-xs text-slate-600">{asset.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated: {asset.updated}</span>
                <button
                  type="button"
                  className="font-bold text-teal-600 hover:text-teal-500 flex items-center gap-1"
                >
                  <FaDownload className="text-[10px]" /> Download Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}