import React from "react";
import { FaHeadset, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

export default function SupportDesk() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-10 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-md"
          style={{ background: BRAND_COLOR }}
        >
          <FaHeadset />
        </div>
        <h3 className="text-lg font-black text-slate-900">Need something?</h3>
        <p className="max-w-md text-xs text-slate-500">
          Reach your franchise office for scheduling issues, HR questions, or anything else.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <FaPhoneAlt className="mb-2 text-base" style={{ color: BRAND_COLOR }} />
          <p className="text-sm font-bold text-slate-800">Call Your Franchise Office</p>
          <p className="text-xs text-slate-400">(416) 555-0134 · Mon–Fri, 8am–6pm</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <FaEnvelope className="mb-2 text-base" style={{ color: BRAND_COLOR }} />
          <p className="text-sm font-bold text-slate-800">Email HR</p>
          <p className="text-xs text-slate-400">hr.torontowest@waleshealthcare.com</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 text-sm font-black text-slate-900">Send a Support Request</h4>
        <textarea
          rows={4}
          placeholder="Describe your issue..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-medium focus:border-teal-500 focus:outline-none"
        />
        <button
          className="mt-3 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
          style={{ background: BRAND_COLOR }}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}