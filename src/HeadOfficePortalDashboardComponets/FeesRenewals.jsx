import React, { useState } from "react";
import {
  FaFileInvoiceDollar,
  FaBell,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialFeesAndRenewals = [
  {
    id: "INV-901",
    franchise: "North London Healthcare",
    feeType: "Annual Franchise Royalty & License",
    amount: "£12,500",
    dueDate: "2026-09-30",
    agreementExpiry: "2026-10-15",
    status: "Due Soon",
  },
  {
    id: "INV-902",
    franchise: "Manchester Central Care",
    feeType: "Monthly Software & Platform Fee",
    amount: "£1,200",
    dueDate: "2026-09-15",
    agreementExpiry: "2027-01-10",
    status: "Upcoming",
  },
  {
    id: "INV-903",
    franchise: "Birmingham West Support",
    feeType: "Annual Franchise Royalty & License",
    amount: "£14,000",
    dueDate: "2026-08-28",
    agreementExpiry: "2026-09-01",
    status: "Overdue",
  },
  {
    id: "INV-904",
    franchise: "Edinburgh South Medical",
    feeType: "Quarterly Brand Marketing Contribution",
    amount: "£3,500",
    dueDate: "2026-09-01",
    agreementExpiry: "2027-03-20",
    status: "Paid",
  },
];

const renewalWorkflowSteps = [
  { step: 1, title: "Calculate Expiry", desc: "System calculates days until agreement expiry." },
  { step: 2, title: "Reminder Schedule", desc: "Notification is sent according to configured reminder schedule." },
  { step: 3, title: "Record Renewal", desc: "Renewal is recorded when completed." },
  { step: 4, title: "Suspension Trigger", desc: "If expiry passes without valid renewal, account moves to the defined restricted/suspended state." },
  { step: 5, title: "User Notification", desc: "Users are informed of the reason and required action." },
  { step: 6, title: "Retention Policy", desc: "Historical data remains retained according to the client's retention policy." },
];

export default function FeesRenewals() {
  const [fees, setFees] = useState(initialFeesAndRenewals);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tracker"); // 'tracker' | 'workflow'

  const [newFee, setNewFee] = useState({
    franchise: "",
    feeType: "Annual Franchise Royalty & License",
    amount: "",
    dueDate: "",
    agreementExpiry: "",
  });

  const filteredFees = fees.filter(
    (f) => filterStatus === "All" || f.status === filterStatus
  );

  const handleAddFee = (e) => {
    e.preventDefault();
    const created = {
      id: `INV-90${fees.length + 1}`,
      franchise: newFee.franchise || "New Franchise Unit",
      feeType: newFee.feeType,
      amount: `£${newFee.amount}`,
      dueDate: newFee.dueDate,
      agreementExpiry: newFee.agreementExpiry,
      status: "Upcoming",
    };
    setFees([created, ...fees]);
    setIsModalOpen(false);
    setNewFee({ franchise: "", feeType: "Annual Franchise Royalty & License", amount: "", dueDate: "", agreementExpiry: "" });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20";
      case "Due Soon":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
      case "Overdue":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Financial Governance
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Fees & Renewals
          </h1>
          <p className="text-xs text-slate-500">
            Configure franchise fee types, track invoice/payment statuses, and manage agreement renewals and automated suspension rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "tracker" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fee Tracker & Renewals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "workflow" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Renewal Workflow Rules
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Configure New Fee</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: FEES & RENEWALS TRACKER ================= */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Expected Fees</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">£112,400</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">94% Collection Rate</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming / Due Soon</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">£13,700</h3>
              <p className="text-[11px] text-slate-500 mt-1">Reminders scheduled</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue Invoices</p>
              <h3 className="text-xl font-black text-rose-600 mt-1">£14,000</h3>
              <p className="text-[11px] text-rose-500 font-semibold mt-1">Suspension rules active</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreement Renewals Due</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">1 Franchise</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Expires Oct 2026</p>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Invoice & Payment Status
            </h3>
            <div className="flex items-center gap-2">
              {["All", "Upcoming", "Due Soon", "Overdue", "Paid"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    filterStatus === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Franchise & Fee Type</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Due Date</th>
                    <th className="py-3.5 px-6">Agreement Expiry</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{fee.franchise}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{fee.feeType}</p>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{fee.amount}</td>
                      <td className="py-4 px-6 text-slate-600">{fee.dueDate}</td>
                      <td className="py-4 px-6 text-slate-600 font-mono">{fee.agreementExpiry}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(fee.status)}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Reminder generated and sent to ${fee.franchise}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
                        >
                          <FaBell className="text-[10px]" /> Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RENEWAL WORKFLOW RULES ================= */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Automated Renewal & Suspension Activity</h3>
            <p className="text-xs text-slate-500 mb-6">
              Platform rule sequence triggered when franchise agreements approach expiry or pass due dates without renewal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renewalWorkflowSteps.map((s) => (
                <div key={s.step} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 relative overflow-hidden">
                  <span className="absolute right-4 top-4 text-3xl font-black text-slate-200">
                    0{s.step}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
                    {s.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIGURE FEE MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Fee Configuration
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Configure Franchise Fee & Schedule</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddFee} className="py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Franchise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cambridge Health Care"
                    value={newFee.franchise}
                    onChange={(e) => setNewFee({ ...newFee, franchise: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee Type & Description
                  </label>
                  <select
                    value={newFee.feeType}
                    onChange={(e) => setNewFee({ ...newFee, feeType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option>Annual Franchise Royalty & License</option>
                    <option>Monthly Software & Platform Fee</option>
                    <option>Quarterly Brand Marketing Contribution</option>
                    <option>Compliance Audit Processing Fee</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Amount (£)
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Agreement Expiry
                    </label>
                    <input
                      type="date"
                      value={newFee.agreementExpiry}
                      onChange={(e) => setNewFee({ ...newFee, agreementExpiry: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500"
                  >
                    Save & Initialize Fee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}