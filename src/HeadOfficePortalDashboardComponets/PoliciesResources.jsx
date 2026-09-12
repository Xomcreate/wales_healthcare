import React, { useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const resourceLibrary = [
  {
    id: "RES-101",
    title: "Operations Manual v4.2",
    category: "Manuals",
    version: "4.2",
    audience: "All Franchises",
    status: "Published",
  },
  {
    id: "RES-102",
    title: "Franchise Staff Onboarding & Training Guide",
    category: "Training Material",
    version: "2.0",
    audience: "Franchise Managers",
    status: "Published",
  },
  {
    id: "RES-103",
    title: "Health, Safety & Compliance Policy 2026",
    category: "Policies",
    version: "1.5",
    audience: "All Franchises",
    status: "Published",
  },
  {
    id: "RES-104",
    title: "Local Marketing Asset Package (Q4)",
    category: "Marketing Assets",
    version: "3.1",
    audience: "Selected Franchises",
    status: "Pending Approval",
  },
];

const publishingSteps = [
  { step: 1, title: "Upload Resource", desc: "Content manager creates or uploads resource." },
  { step: 2, title: "Set Metadata", desc: "Define title, category, version, audience and publication date." },
  { step: 3, title: "Optional Approval", desc: "Compliance or head office review step." },
  { step: 4, title: "Network Publish", desc: "Publish to selected franchises or the entire network." },
  { step: 5, title: "Notification", desc: "Franchises receive automated real-time alert." },
  { step: 6, title: "Versioning", desc: "New version supersedes prior version while preserving history." },
];

export default function PoliciesResources() {
  const [activeTab, setActiveTab] = useState("library"); // 'library' | 'workflow'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resources, setResources] = useState(resourceLibrary);

  // New Resource Form
  const [newRes, setNewRes] = useState({
    title: "",
    category: "Manuals",
    version: "1.0",
    audience: "All Franchises",
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `RES-10${resources.length + 1}`,
      title: newRes.title || "Untitled Document",
      category: newRes.category,
      version: newRes.version,
      audience: newRes.audience,
      status: "Pending Approval",
    };
    setResources([created, ...resources]);
    setIsUploadModalOpen(false);
    setNewRes({ title: "", category: "Manuals", version: "1.0", audience: "All Franchises" });
  };

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
            Policies & Resources
          </h1>
          <p className="text-xs text-slate-500">
            Distribute manuals, training material, policies and forms across the franchise network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "library" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resource Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "workflow" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Publishing Workflow
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaUpload className="text-xs" />
            <span>Upload Resource</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: RESOURCE LIBRARY ================= */}
      {activeTab === "library" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider">Network Resource Library</h3>
              <span className="text-xs text-teal-400 font-bold">{resources.length} Documents Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Resource Title</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Version</th>
                    <th className="py-3.5 px-6">Audience Scope</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {resources.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <FaFileAlt className="text-teal-600 text-xs" />
                        {res.title}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{res.category}</td>
                      <td className="py-4 px-6 font-mono text-slate-500">{res.version}</td>
                      <td className="py-4 px-6 text-slate-600">{res.audience}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          res.status === "Published" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20" : "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600">
                          View
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

      {/* ================= TAB 2: PUBLISHING WORKFLOW ================= */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Publishing Workflow Guide</h3>
            <p className="text-xs text-slate-500 mb-6">
              Follow these sequential stages when uploading and pushing documentation or templates across the franchise network.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishingSteps.map((s) => (
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

      {/* ================= UPLOAD RESOURCE MODAL ================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
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
                    Publishing Workflow
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Upload New Resource</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Q4 Marketing Guidelines & Assets"
                    value={newRes.title}
                    onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newRes.category}
                      onChange={(e) => setNewRes({ ...newRes, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      <option>Manuals</option>
                      <option>Training Material</option>
                      <option>Policies</option>
                      <option>Forms</option>
                      <option>Marketing Assets</option>
                      <option>Legal/Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Version Tag
                    </label>
                    <input
                      type="text"
                      value={newRes.version}
                      onChange={(e) => setNewRes({ ...newRes, version: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Audience & Network Scope
                  </label>
                  <select
                    value={newRes.audience}
                    onChange={(e) => setNewRes({ ...newRes, audience: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option>All Franchises (Entire Network)</option>
                    <option>Franchise Owners Only</option>
                    <option>Selected Franchises</option>
                    <option>Head Office Staff</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500"
                  >
                    Upload & Submit for Approval
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