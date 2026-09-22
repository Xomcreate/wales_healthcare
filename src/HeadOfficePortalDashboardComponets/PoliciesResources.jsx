import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const CATEGORIES = [
  "Manuals",
  "Training Material",
  "Policies",
  "Forms",
  "Marketing Assets",
  "Legal/Compliance",
];

const AUDIENCES = [
  "All Franchises",
  "Franchise Owners Only",
  "Selected Franchises",
  "Head Office Staff",
];

const publishingSteps = [
  {
    step: 1,
    title: "Upload Resource",
    desc: "Content manager creates or uploads resource — file goes to Cloudinary.",
  },
  {
    step: 2,
    title: "Set Metadata",
    desc: "Define title, category, version, audience and publication date.",
  },
  {
    step: 3,
    title: "Optional Approval",
    desc: "Compliance or head office review step.",
  },
  {
    step: 4,
    title: "Network Publish",
    desc: "Publish to selected franchises or the entire network.",
  },
  {
    step: 5,
    title: "Notification",
    desc: "Franchises receive automated real-time alert.",
  },
  {
    step: 6,
    title: "Versioning",
    desc: "New version supersedes prior version while preserving history.",
  },
];

export default function PoliciesResources({ isHeadOffice = true }) {
  const [activeTab, setActiveTab] = useState("library");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newRes, setNewRes] = useState({
    title: "",
    category: "Manuals",
    version: "1.0",
    audience: "All Franchises",
  });

  const [file, setFile] = useState(null);

  // =========================================================
  // FETCH RESOURCES
  // =========================================================

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/resources/");
      const data = response.data;

      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setResources(results);
    } catch (err) {
      console.error("Failed to load resources:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load resources."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const resetForm = () => {
    setNewRes({
      title: "",
      category: "Manuals",
      version: "1.0",
      audience: "All Franchises",
    });
    setFile(null);
  };

  const closeUploadModal = () => {
    if (submitting) return;
    setIsUploadModalOpen(false);
    resetForm();
  };

  // =========================================================
  // UPLOAD RESOURCE
  // =========================================================

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = new FormData();

      Object.entries(newRes).forEach(([key, value]) => {
        body.append(key, value);
      });

      if (file) {
        body.append("file", file);
      }

      const response = await api.post("/admin/resources/", body);
      const created = response.data;

      setResources((prev) => [created, ...prev]);
      setIsUploadModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to upload resource:", err);
      const backendError = err?.response?.data;
      let message = "Failed to upload resource.";

      if (backendError) {
        if (backendError.detail) {
          message = backendError.detail;
        } else if (backendError.message) {
          message = backendError.message;
        } else if (typeof backendError === "object") {
          const firstError = Object.values(backendError)
            .flat()
            .filter(Boolean)[0];

          if (firstError) {
            message = firstError;
          }
        }
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // PUBLISH RESOURCE
  // =========================================================

  const handlePublish = async (resourceId) => {
    try {
      setError(null);
      const response = await api.patch(`/admin/resources/${resourceId}/`, {
        status: "Published",
      });

      const updated = response.data;
      setResources((prev) =>
        prev.map((resource) => (resource.id === resourceId ? updated : resource))
      );
    } catch (err) {
      console.error("Failed to publish resource:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to publish resource."
      );
    }
  };

  // =========================================================
  // DELETE RESOURCE
  // =========================================================

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Remove this resource?")) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/resources/${resourceId}/`);
      setResources((prev) => prev.filter((resource) => resource.id !== resourceId));
    } catch (err) {
      console.error("Failed to delete resource:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to delete resource."
      );
    }
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
            Distribute manuals, training material, policies and forms across the
            franchise network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "library"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resource Library
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "workflow"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Publishing Workflow
            </button>
          </div>

          {isHeadOffice && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsUploadModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
            >
              <FaUpload className="text-xs" />
              <span>Upload Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-4 text-rose-500 hover:text-rose-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* TAB 1: RESOURCE LIBRARY */}
      {activeTab === "library" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider">
                Network Resource Library
              </h3>
              <span className="text-xs text-teal-400 font-bold">
                {resources.length} Documents Active
              </span>
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
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        <FaSpinner className="animate-spin inline mr-2" />
                        Loading...
                      </td>
                    </tr>
                  ) : resources.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No resources uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    resources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="text-teal-600 text-xs" />
                            <span>{resource.title}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {resource.category}
                        </td>

                        <td className="py-4 px-6 font-mono text-slate-500">
                          {resource.version}
                        </td>

                        <td className="py-4 px-6 text-slate-600">
                          {resource.audience}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              resource.status === "Published"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                            }`}
                          >
                            {resource.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* FIXED: Added proper <a> tag wrapper */}
                            {resource.file_url && (
                              <a
                                href={resource.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
                              >
                                View
                              </a>
                            )}

                            {isHeadOffice && resource.status !== "Published" && (
                              <button
                                type="button"
                                onClick={() => handlePublish(resource.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100"
                              >
                                <FaCheck className="text-[10px]" />
                                Publish
                              </button>
                            )}

                            {isHeadOffice && (
                              <button
                                type="button"
                                onClick={() => handleDelete(resource.id)}
                                className="text-slate-400 hover:text-rose-600"
                                title="Delete resource"
                              >
                                <FaTrash className="text-[10px]" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISHING WORKFLOW */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Publishing Workflow Guide
            </h3>

            <p className="text-xs text-slate-500 mb-6">
              Follow these sequential stages when uploading and pushing documentation
              or templates across the franchise network.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishingSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 relative overflow-hidden"
                >
                  <span className="absolute right-4 top-4 text-3xl font-black text-slate-200">
                    0{step.step}
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
                    {step.step}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD RESOURCE MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsUploadModalOpen(false)}
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
                  <h3 className="text-lg font-black text-slate-900">
                    Upload New Resource
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={submitting}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
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
                    onChange={(e) =>
                      setNewRes({ ...newRes, title: e.target.value })
                    }
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
                      onChange={(e) =>
                        setNewRes({ ...newRes, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Version Tag
                    </label>
                    <input
                      type="text"
                      value={newRes.version}
                      onChange={(e) =>
                        setNewRes({ ...newRes, version: e.target.value })
                      }
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
                    onChange={(e) =>
                      setNewRes({ ...newRes, audience: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    {AUDIENCES.map((audience) => (
                      <option key={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  {file && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeUploadModal}
                    disabled={submitting}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500 disabled:opacity-60"
                  >
                    {submitting && <FaSpinner className="animate-spin" />}
                    {submitting ? "Uploading..." : "Upload & Submit for Approval"}
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