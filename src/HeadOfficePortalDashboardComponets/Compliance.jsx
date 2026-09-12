import React, { useState } from "react";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaBuilding,
  FaChartLine,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialComplianceDocs = [
  {
    id: "DOC-801",
    franchise: "North London Healthcare",
    documentName: "Care Quality Commission (CQC) Registration Renewal",
    category: "Regulatory",
    expiryDate: "2026-10-12",
    daysLeft: 30,
    status: "Expiring in 30 Days",
  },
  {
    id: "DOC-802",
    franchise: "Birmingham West Support",
    documentName: "Public Liability Insurance Certificate",
    category: "Insurance",
    expiryDate: "2026-09-08",
    daysLeft: -4,
    status: "Expired",
  },
  {
    id: "DOC-803",
    franchise: "Manchester Central Care",
    documentName: "Annual Fire Safety Audit Report",
    category: "Safety",
    expiryDate: "Missing",
    daysLeft: null,
    status: "Missing Required",
  },
  {
    id: "DOC-804",
    franchise: "Edinburgh South Medical",
    documentName: "Staff DBS Background Check Certificates (Batch #4)",
    category: "HR Compliance",
    expiryDate: "Pending Review",
    daysLeft: null,
    status: "Awaiting Review",
  },
  {
    id: "DOC-805",
    franchise: "Bristol Health Services",
    documentName: "Data Protection & GDPR Compliance Audit",
    category: "Legal",
    expiryDate: "2026-11-20",
    daysLeft: 69,
    status: "Expiring in 90 Days",
  },
];

const franchiseScores = [
  { franchise: "Edinburgh South Medical", score: "98%", status: "Fully Compliant" },
  { franchise: "North London Healthcare", score: "88%", status: "Action Required" },
  { franchise: "Manchester Central Care", score: "74%", status: "Missing Documents" },
  { franchise: "Birmingham West Support", score: "60%", status: "Critical Expiries" },
];

export default function Compliance() {
  const [documents, setDocuments] = useState(initialComplianceDocs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("documents"); // 'documents' | 'franchises' | 'trends'

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.franchise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Expired":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20";
      case "Missing Required":
        return "bg-red-50 text-red-800 ring-1 ring-red-500/20";
      case "Expiring in 30 Days":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
      case "Expiring in 90 Days":
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-500/20";
      case "Awaiting Review":
        return "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20";
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
              Governance & Risk Management
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Monitor regulatory document expiries (7/30/60/90 days), missing submissions, and franchise audit scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "documents" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Document Expiries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("franchises")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "franchises" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Compliance by Franchise
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trends")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "trends" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Trends & Analytics
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: DOCUMENT EXPIRIES & AUDIT ================= */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* QUICK METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expired Documents</p>
              <h3 className="text-xl font-black text-rose-600 mt-1">3 Files</h3>
              <p className="text-[11px] text-rose-500 font-semibold mt-1">Requires immediate notice</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiring (7/30 Days)</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">8 Files</h3>
              <p className="text-[11px] text-slate-500 mt-1">Automated warnings active</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Required</p>
              <h3 className="text-xl font-black text-red-600 mt-1">2 Files</h3>
              <p className="text-[11px] text-red-500 font-semibold mt-1">Action pending from owners</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awaiting Review</p>
              <h3 className="text-xl font-black text-teal-600 mt-1">5 Files</h3>
              <p className="text-[11px] text-slate-500 mt-1">Ready for head office check</p>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Search by franchise or document title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Expired", "Missing Required", "Expiring in 30 Days", "Awaiting Review"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                    filterStatus === st ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    <th className="py-3.5 px-6">Franchise & Document</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Expiry / Status Date</th>
                    <th className="py-3.5 px-6">Compliance State</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{doc.documentName}</p>
                          <p className="text-[10px] font-medium text-slate-400">{doc.franchise}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{doc.category}</td>
                        <td className="py-4 px-6 font-mono text-slate-700">{doc.expiryDate}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Reviewing document for ${doc.franchise}`)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
                          >
                            <FaEye className="text-[10px]" /> Review File
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        No compliance documents matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COMPLIANCE BY FRANCHISE ================= */}
      {activeTab === "franchises" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Franchise Compliance Scorecard</h3>
            <p className="text-xs text-slate-500 mb-6">
              Aggregated audit scores and safety ratings across the active franchise network.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {franchiseScores.map((fs, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-600">
                      {fs.status}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{fs.franchise}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{fs.score}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Compliance Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: COMPLIANCE TREND OVER TIME ================= */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Compliance Trend Analysis (2026)</h3>
            <p className="text-xs text-slate-500 mb-6">
              Historical compliance adherence tracking across the network over the past 4 quarters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Q1 2026</p>
                <h4 className="text-lg font-black text-slate-900 mt-1">84.2%</h4>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Q2 2026</p>
                <h4 className="text-lg font-black text-slate-900 mt-1">89.5%</h4>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Q3 2026 (Current)</p>
                <h4 className="text-lg font-black text-teal-600 mt-1">92.8%</h4>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Q4 2026 (Target)</p>
                <h4 className="text-lg font-black text-slate-900 mt-1">95.0%</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}