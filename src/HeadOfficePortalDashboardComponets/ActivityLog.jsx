import React, { useState } from "react";
import {
  FaHistory,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaDownload,
  FaUser,
  FaBuilding,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const initialNetworkReports = [
  {
    report: "Franchise Performance",
    typicalMetrics: "Revenue, customers, appointments, service volume",
    filters: "Franchise, territory, date range",
  },
  {
    report: "Financial",
    typicalMetrics: "Revenue, payments, outstanding, fees, renewals",
    filters: "Location, date, status",
  },
  {
    report: "Operations",
    typicalMetrics: "Requests, completed services, cancellations, utilization",
    filters: "Service, location, date",
  },
  {
    report: "Compliance",
    typicalMetrics: "Valid / expired / missing documents",
    filters: "Franchise, document type, status",
  },
  {
    report: "Staff",
    typicalMetrics: "Staff count, active / inactive, workload",
    filters: "Franchise, role, date",
  },
];

const initialActivityLogs = [
  {
    id: "LOG-5001",
    timestamp: "2026-09-12 14:22:10",
    actor: "Sarah Jenkins",
    role: "Head Office Admin",
    franchiseScope: "North London Healthcare",
    action: "Franchise Approved",
    entity: "Franchise Unit #402",
    outcome: "Success",
  },
  {
    id: "LOG-5002",
    timestamp: "2026-09-12 12:05:40",
    actor: "Marcus Vance",
    role: "System Auditor",
    franchiseScope: "Birmingham West Support",
    action: "Document Uploaded",
    entity: "CQC Renewal Certificate",
    outcome: "Success",
  },
  {
    id: "LOG-5003",
    timestamp: "2026-09-11 16:45:00",
    actor: "Elena Rostova",
    role: "Finance Manager",
    franchiseScope: "Manchester Central Care",
    action: "Invoice Voided",
    entity: "INV-903 (£14,000)",
    outcome: "Approved",
  },
  {
    id: "LOG-5004",
    timestamp: "2026-09-11 09:15:30",
    actor: "System Automation",
    role: "Platform Cron",
    franchiseScope: "Birmingham West Support",
    action: "Franchise Suspended",
    entity: "Account Status: Restricted",
    outcome: "Triggered",
  },
  {
    id: "LOG-5005",
    timestamp: "2026-09-10 11:30:22",
    actor: "David Miller",
    role: "Compliance Officer",
    franchiseScope: "Edinburgh South Medical",
    action: "Price Changed",
    entity: "Standard Consultation Tier",
    outcome: "Success",
  },
];

export default function ActivityLog() {
  const [logs, setLogs] = useState(initialActivityLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("All");
  const [activeTab, setActiveTab] = useState("activity"); // 'activity' | 'reports'

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.franchiseScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === "All" || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case "Success":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20";
      case "Approved":
        return "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20";
      case "Triggered":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
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
              Audit & Governance
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Head Office — Reporting & Activity Log
          </h1>
          <p className="text-xs text-slate-500">
            Monitor network-wide analytical reports and immutable append-only system activity audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "activity" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Activity Log Audit Trail
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "reports" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Network Reports Overview
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: ACTIVITY LOG AUDIT TRAIL ================= */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          {/* NOTICE BANNER FOR APPEND-ONLY */}
          <div className="flex items-center justify-between rounded-2xl border border-teal-200/80 bg-teal-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <FaShieldAlt className="text-sm" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Append-Only Secure Ledger
                </h4>
                <p className="text-[11px] text-slate-600">
                  Audit records are strictly append-only for standard application users to ensure complete accountability.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("Exporting secure activity log CSV...")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white border border-teal-200 px-3.5 py-2 text-xs font-bold text-teal-700 shadow-xs hover:bg-teal-50"
            >
              <FaDownload className="text-xs" /> Export Logs
            </button>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Search by actor, franchise scope, or entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Franchise Approved", "Document Uploaded", "Invoice Voided", "Franchise Suspended", "Price Changed"].map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setSelectedAction(act)}
                  className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                    selectedAction === act ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVITY TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Timestamp & ID</th>
                    <th className="py-3.5 px-6">Actor & Role</th>
                    <th className="py-3.5 px-6">Franchise Scope</th>
                    <th className="py-3.5 px-6">Action Performed</th>
                    <th className="py-3.5 px-6">Object / Entity</th>
                    <th className="py-3.5 px-6 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-mono">
                          <p className="font-bold text-slate-900">{log.timestamp}</p>
                          <p className="text-[10px] text-slate-400">{log.id}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{log.actor}</p>
                          <p className="text-[10px] font-medium text-teal-600">{log.role}</p>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">{log.franchiseScope}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-600">{log.entity}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getOutcomeBadge(log.outcome)}`}>
                            {log.outcome}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No activity records found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: NETWORK REPORTS OVERVIEW ================= */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Network Report Configurations</h3>
            <p className="text-xs text-slate-500 mb-6">
              Standard report categories, typical metrics tracked, and available filter parameters across the platform.
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Report Category</th>
                    <th className="py-3.5 px-6">Typical Metrics</th>
                    <th className="py-3.5 px-6">Available Filters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {initialNetworkReports.map((nr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{nr.report}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{nr.typicalMetrics}</td>
                      <td className="py-4 px-6 font-mono text-teal-700">{nr.filters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}