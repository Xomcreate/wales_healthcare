import React, { useState } from "react";
import {
  FaChartBar,
  FaFileDownload,
  FaFilter,
  FaSearch,
  FaBuilding,
  FaPoundSign,
  FaCogs,
  FaShieldAlt,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const reportCategories = [
  {
    id: "rep-1",
    title: "Franchise Performance",
    category: "Performance",
    description: "Evaluates overall franchise output, revenue generation, customer volume, and appointment counts.",
    metrics: ["Revenue (£)", "Total Customers", "Appointments Booked", "Service Volume"],
    filters: ["Franchise Territory", "Date Range", "Performance Tier"],
    icon: FaBuilding,
    color: "text-teal-600 bg-teal-50 ring-teal-500/20",
  },
  {
    id: "rep-2",
    title: "Financial Governance",
    category: "Finance",
    description: "Tracks incoming franchise royalties, platform fees, outstanding invoices, and agreement renewals.",
    metrics: ["Total Revenue", "Payments Received", "Outstanding Balances", "Royalty Fees & Renewals"],
    filters: ["Branch Location", "Invoice Status", "Payment Date Range"],
    icon: FaPoundSign,
    color: "text-emerald-600 bg-emerald-50 ring-emerald-500/20",
  },
  {
    id: "rep-3",
    title: "Operations & Service Delivery",
    category: "Operations",
    description: "Monitors daily appointment requests, completed services, cancellations, and staff capacity utilization.",
    metrics: ["Service Requests", "Completed Services", "Cancellation Rate", "Capacity Utilization"],
    filters: ["Service Type", "Branch Location", "Specific Date"],
    icon: FaCogs,
    color: "text-blue-600 bg-blue-50 ring-blue-500/20",
  },
  {
    id: "rep-4",
    title: "Compliance & Safety Audit",
    category: "Governance",
    description: "Audits regulatory document statuses across all branches (valid, expired, or missing files).",
    metrics: ["Valid Certifications", "Expired Documents", "Missing Required Files", "Audit Scores (%)"],
    filters: ["Franchise Unit", "Document Type", "Compliance State"],
    icon: FaShieldAlt,
    color: "text-amber-600 bg-amber-50 ring-amber-500/20",
  },
  {
    id: "rep-5",
    title: "Staff Workload & Headcount",
    category: "Human Resources",
    description: "Analyzes active vs. inactive staff counts, role distribution, and individual workload metrics.",
    metrics: ["Total Headcount", "Active / Inactive Status", "Assigned Workload", "Shift Utilization"],
    filters: ["Franchise Branch", "Staff Role", "Employment Date"],
    icon: FaUsers,
    color: "text-indigo-600 bg-indigo-50 ring-indigo-500/20",
  },
];

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReportModal, setActiveReportModal] = useState(null);

  const filteredReports = reportCategories.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedCategory === "All" || rep.category === selectedCategory;
    return matchesSearch && matchesTab;
  });

  const handleGenerateReport = (repTitle) => {
    alert(`Generating certified CSV/PDF report for: ${repTitle}`);
    setActiveReportModal(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Network Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Generate and export comprehensive network-wide performance, financial, operational, compliance, and staff reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert("Preparing custom multi-report export package...")}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaFileDownload className="text-xs" />
            <span>Export All Reports</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Report Types</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">5 Core Modules</h3>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Fully automated data feeds</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Branches Tracked</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">14 Franchises</h3>
          <p className="text-[11px] text-slate-500 mt-1">Real-time telemetry sync</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Reports</p>
          <h3 className="text-xl font-black text-teal-600 mt-1">3 Active Schedules</h3>
          <p className="text-[11px] text-slate-500 mt-1">Weekly executive dispatch</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Status</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">Compliant</h3>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">All logs secured</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search report titles or metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Performance", "Finance", "Operations", "Governance", "Human Resources"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                selectedCategory === cat ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((rep) => {
          const IconComponent = rep.icon;
          return (
            <div
              key={rep.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-slate-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${rep.color}`}>
                    <IconComponent className="text-base" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {rep.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{rep.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Typical Metrics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rep.metrics.map((m, idx) => (
                      <span key={idx} className="rounded-md bg-slate-50 border border-slate-200/70 px-2 py-1 text-[10px] font-medium text-slate-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Configured Filters</p>
                  <p className="text-xs font-mono text-teal-700">{rep.filters.join(" • ")}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Ready to compile</span>
                <button
                  type="button"
                  onClick={() => setActiveReportModal(rep)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
                >
                  <FaFileDownload className="text-xs" /> Generate Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= GENERATE REPORT CONFIG MODAL ================= */}
      <AnimatePresence>
        {activeReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReportModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Report Parameters Setup
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{activeReportModal.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReportModal(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Select Franchise / Territory Scope
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none">
                    <option>All Network Franchises (Global View)</option>
                    <option>North London Healthcare</option>
                    <option>Manchester Central Care</option>
                    <option>Birmingham West Support</option>
                    <option>Edinburgh South Medical</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-07-01"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-09-12"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" className="rounded-xl border border-teal-500 bg-teal-50/50 p-2.5 font-bold text-teal-700 text-center">
                      PDF Document
                    </button>
                    <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-700 text-center">
                      Excel (XLSX)
                    </button>
                    <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-700 text-center">
                      CSV Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveReportModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateReport(activeReportModal.title)}
                  className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500 transition active:scale-95"
                >
                  Compile & Download Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}