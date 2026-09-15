import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const customers = [
  {
    name: "Mary Johnson",
    service: "Personal Care",
    address: "24 Willow St, Toronto",
    phone: "(647) 555-0182",
    notes: "Prefers morning visits. Mobility assistance required.",
  },
  {
    name: "David Brown",
    service: "Companionship",
    address: "8 Pine Ave, Toronto",
    phone: "(647) 555-0144",
    notes: "Enjoys conversation and light walks.",
  },
  {
    name: "Sarah Lee Sr.",
    service: "Nursing Support",
    address: "12 Maple Cr, Toronto",
    phone: "(647) 555-0199",
    notes: "Diabetic — medication schedule attached in care plan.",
  },
];

export default function AssignedCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Assigned Customers</h3>
        <p className="text-xs text-slate-500">
          Customers currently assigned to you. You only see the details needed to provide care.
        </p>
      </div>

      <div className="space-y-3">
        {customers.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                  style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                >
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.name}</p>
                  <p className="text-[11px] font-semibold text-teal-600">{c.service}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <FaMapMarkerAlt className="text-[9px]" /> {c.address}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <FaPhoneAlt className="text-[9px]" /> {c.phone}
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-1.5 self-start rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">
                <FaCheckCircle className="text-[10px]" /> Mark Visit Complete
              </button>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500">
              {c.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}