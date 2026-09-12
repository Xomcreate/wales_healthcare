import React, { useState } from "react";
import {
  FaChartBar,
  FaFileDownload,
  FaFilter,
  FaCalendarAlt,
  FaDollarSign,
  FaUsers,
  FaConciergeBell,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowUp,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("financial");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState("This Month");

  // Sample report datasets
  const financialReports = [
    { id: "REP-FIN-01", name: "Monthly Revenue & Franchise Fee Summary", generated: "Mar 12, 2026", format: "CSV / PDF", status: "Ready" },
    { id: "REP-FIN-02", name: "Outstanding Invoices & Aging Balance Ledger", generated: "Mar 10, 2026", format: "CSV", status: "Ready" },
    { id: "REP-FIN-03", name: "Payment Gateway Reconciliation Log", generated: "Mar 01, 2026", format: "PDF", status: "Archived" },
  ];

  const operationalReports = [
    { id: "REP-OPS-01", name: "Service Utilization & Popular Catalogue Items", generated: "Mar 11, 2026", format: "CSV / PDF", status: "Ready" },
    { id: "REP-OPS-02", name: "Staff Utilization & Shift Hours Report", generated: "Mar 09, 2026", format: "PDF", status: "Ready" },
    { id: "REP-OPS-03", name: "Appointment Completion & Cancellation Audit", generated: "Mar 05, 2026", format: "CSV", status: "Ready" },
  ];

  const complianceReports = [
    { id: "REP-CMP-01", name: "Franchise Licence & Insurance Expiry Log", generated: "Mar 01, 2026", format: "PDF", status: "Up to Date" },
    { id: "REP-CMP-02", name: "Central Policy Override & Exception Audit", generated: "Feb 28, 2026", format: "CSV", status: "Verified" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Reports & Analytics Hub
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate, filter, and export comprehensive financial, operational, and compliance reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaFileDownload className="text-[10px]" />
            <span>Export Custom Report</span>
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Net Revenue</p>
            <FaDollarSign className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">$84,250.00</h4>
          <p className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <FaArrowUp className="text-[9px]" /> +12.4% vs last month
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointments Fulfilled</p>
            <FaCalendarAlt className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">1,420</h4>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">98.2% completion rate</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Clients</p>
            <FaUsers className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">312</h4>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">High retention status</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Status</p>
            <FaShieldAlt className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">100%</h4>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">All audits cleared</p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "financial", label: "Financial Reports", icon: <FaDollarSign /> },
          { key: "operational", label: "Operational & Services", icon: <FaConciergeBell /> },
          { key: "compliance", label: "Compliance & Audit", icon: <FaShieldAlt /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
              activeTab === tab.key
                ? "border-teal-600 text-teal-700 bg-teal-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: FINANCIAL */}
      {activeTab === "financial" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Financial Performance & Revenue Logs</h4>
            <span className="text-xs text-slate-400">Filterable by service, customer, and date ranges</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Report ID & Title</th>
                    <th className="py-3.5 px-4">Generated Date</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {financialReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{rep.name}</span>
                        <span className="text-[10px] text-slate-400">{rep.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rep.generated}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{rep.format}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition">
                          <FaFileDownload className="text-[10px]" /> Download
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

      {/* TAB CONTENT: OPERATIONAL */}
      {activeTab === "operational" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Service Utilization & Appointment Logs</h4>
            <span className="text-xs text-slate-400">Track service metrics and staff capacity</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Report ID & Title</th>
                    <th className="py-3.5 px-4">Generated Date</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {operationalReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{rep.name}</span>
                        <span className="text-[10px] text-slate-400">{rep.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rep.generated}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{rep.format}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition">
                          <FaFileDownload className="text-[10px]" /> Download
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

      {/* TAB CONTENT: COMPLIANCE */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Compliance & Regulatory Audit Trails</h4>
            <span className="text-xs text-slate-400">Licences, insurance logs, and policy overrides</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Report ID & Title</th>
                    <th className="py-3.5 px-4">Generated Date</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {complianceReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{rep.name}</span>
                        <span className="text-[10px] text-slate-400">{rep.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rep.generated}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{rep.format}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition">
                          <FaFileDownload className="text-[10px]" /> Download
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

      {/* ================= EXPORT MODAL ================= */}
      <AnimatePresence>
        {showExportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Custom Report Export</h4>
                <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-500">Select parameters to export filtered data across services, customers, and financial records.</p>
                
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Date Range</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <option>This Month (March 2026)</option>
                    <option>Last 30 Days</option>
                    <option>Year-to-Date (2026)</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Export Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" defaultChecked /> CSV Spreadsheet
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" /> PDF Document
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  Generate & Download
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}