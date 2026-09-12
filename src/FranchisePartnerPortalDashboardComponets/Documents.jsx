import React, { useState } from "react";
import {
  FaFileAlt,
  FaComments,
  FaCogs,
  FaUpload,
  FaShieldAlt,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("documents");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sample documents data based on guide rules
  const documentsList = [
    { id: "DOC-01", name: "Commercial General Liability Insurance", type: "Insurance", expiry: "Oct 15, 2026", status: "Valid" },
    { id: "DOC-02", name: "State Franchise Operating Licence", type: "Licence", expiry: "Apr 01, 2026", status: "Expiring Soon" },
    { id: "DOC-03", name: "Staff Medical Certification V2", type: "Certification", expiry: "Jan 10, 2026", status: "Expired" },
    { id: "DOC-04", name: "Health & Safety Compliance Audit", type: "Permitted Document", expiry: "Nov 20, 2026", status: "Pending Review" },
  ];

  const communicationsList = [
    { id: "MSG-101", type: "Head Office Announcement", title: "Q2 Operational Policy Update", date: "Mar 11, 2026", status: "Unread" },
    { id: "MSG-102", type: "Customer Message", title: "Inquiry regarding Personal Care timings", date: "Mar 10, 2026", status: "Attached to Record" },
    { id: "MSG-103", type: "Payment Reminder", title: "Monthly platform franchise fee notice", date: "Mar 08, 2026", status: "Sent" },
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
            Documents, Compliance & Communication
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage compliance documents, review audit histories, track notifications, and configure local franchise settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === "documents" && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
            >
              <FaUpload className="text-[10px]" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "documents", label: "Documents & Compliance", icon: <FaFileAlt /> },
          { key: "communication", label: "Communication & Notices", icon: <FaComments /> },
          { key: "settings", label: "Franchise Settings", icon: <FaCogs /> },
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

      {/* TAB 1: DOCUMENTS & COMPLIANCE */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Licences, Insurance & Certifications</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Allows replacement/versioning without deleting historical audit evidence.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
              <FaBell className="text-[10px]" /> Automated Expiry Notifications Active
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Document ID & Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Issue / Expiry Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">{doc.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{doc.type}</td>
                      <td className="py-3.5 px-4 text-slate-600">Exp: {doc.expiry}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          doc.status === "Valid" ? "bg-emerald-50 text-emerald-700" :
                          doc.status === "Expiring Soon" ? "bg-amber-50 text-amber-700" :
                          doc.status === "Expired" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition">
                          Replace Version
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

      {/* TAB 2: COMMUNICATION & NOTIFICATIONS */}
      {activeTab === "communication" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Messages & Broadcast Announcements</h4>
            <span className="text-[11px] text-slate-400">Message history attached to relevant customer or operational records</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {communicationsList.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-teal-200 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{msg.type}</span>
                    <span className="text-[10px] text-slate-400">{msg.date}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{msg.title}</h5>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FRANCHISE SETTINGS */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Local Configuration Controls</h4>
            <span className="text-[11px] text-slate-400">Configure parameters within policy guidelines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Local Contact Information", desc: "Phone, support email, and emergency desks." },
              { title: "Address / Location", desc: "Physical franchise branch coordinates and office location." },
              { title: "Opening Hours", desc: "Standard operating hours and availability blocks." },
              { title: "Allowed Pricing / Availability", desc: "Local service caps set within Head Office bounds." },
              { title: "Notification Preferences", desc: "Alert thresholds, email digests, and SMS triggers." },
              { title: "Local Users & Role Assignments", desc: "Staff access levels, permissions, and roles." },
              { title: "Profile / Security Settings", desc: "Password resets, 2FA configuration, and audit logs." },
            ].map((setting, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2 shadow-2xs hover:bg-slate-50/50 transition">
                <h5 className="font-bold text-slate-900 text-sm">{setting.title}</h5>
                <p className="text-xs text-slate-500">{setting.desc}</p>
                <div className="pt-2">
                  <button className="text-xs font-bold text-teal-700 hover:text-teal-800 transition">
                    Configure $\rightarrow$
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= UPLOAD DOCUMENT MODAL ================= */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Upload Compliance Document</h4>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-500">Upload new licences, insurance policies, certifications, or permitted documents. Versioning will preserve past audit evidence.</p>
                
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50">
                  <FaUpload className="text-2xl text-teal-600 mx-auto" />
                  <p className="font-bold text-slate-700">Drag & drop files here, or browse</p>
                  <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG up to 25MB</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  Upload & Submit for Review
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}