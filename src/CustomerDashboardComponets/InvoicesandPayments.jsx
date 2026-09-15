import React from "react";
import { FaFileInvoiceDollar, FaDownload, FaCreditCard } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const invoices = [
  { id: "INV-1042", date: "Sep 10, 2026", amount: "$140.00", status: "Overdue" },
  { id: "INV-1031", date: "Sep 3, 2026", amount: "$210.00", status: "Paid" },
  { id: "INV-1022", date: "Aug 27, 2026", amount: "$210.00", status: "Paid" },
];

const statusStyle = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
  Draft: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function InvoicesandPayments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Invoices & Payments</h3>
          <p className="text-xs text-slate-500">Outstanding balance: <span className="font-bold text-rose-600">$140.00</span></p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: BRAND_COLOR }}
        >
          <FaCreditCard /> Pay Outstanding Balance
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="flex items-center gap-2 px-5 py-3.5 font-bold text-slate-800">
                  <FaFileInvoiceDollar style={{ color: BRAND_COLOR }} /> {inv.id}
                </td>
                <td className="px-5 py-3.5 text-slate-500">{inv.date}</td>
                <td className="px-5 py-3.5 font-bold text-slate-800">{inv.amount}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    <FaDownload className="text-[10px]" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}