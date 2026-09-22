import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const CATEGORIES = [
  "Regulatory",
  "Insurance",
  "Safety",
  "HR Compliance",
  "Legal",
];

// FIX: DRF can return either a plain array or a paginated
// { count, results: [...] } object — same helper Messages.jsx uses.
const unwrapList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.results ?? [];
};

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

    case "Valid":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function Compliance({
  isHeadOffice = true,
  // FIX: no longer required as a prop — kept for backwards
  // compatibility in case a parent still passes one in, but the
  // component now always fetches its own copy below and uses
  // that instead.
  franchises: franchisesProp = [],
}) {
  const [documents, setDocuments] = useState([]);

  // FIX: franchises is now local state, fetched by this
  // component itself — exactly like Messages.jsx does — instead
  // of depending entirely on a parent passing it down.
  const [franchises, setFranchises] = useState(franchisesProp);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("documents");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    franchise: "",
    document_name: "",
    category: "Regulatory",
    expiry_date: "",
  });

  const [file, setFile] = useState(null);

  // ---------------------------------------------------------
  // FETCH COMPLIANCE DOCUMENTS + FRANCHISES
  // ---------------------------------------------------------
  const fetchDocuments = async () => {
    const response = await api.get("/admin/compliance/");
    return unwrapList(response.data);
  };

  const fetchFranchises = async () => {
    const response = await api.get("/admin/franchises/");
    return unwrapList(response.data);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [documentList, franchiseList] = await Promise.all([
        fetchDocuments(),
        fetchFranchises(),
      ]);

      setDocuments(Array.isArray(documentList) ? documentList : []);

      setFranchises(
        Array.isArray(franchiseList)
          ? franchiseList.filter(
              (franchise) => franchise?.is_active !== false
            )
          : []
      );
    } catch (err) {
      console.error("Compliance fetch error:", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to load compliance documents.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------
  // SEARCH + FILTER
  // ---------------------------------------------------------
  const filteredDocuments = documents.filter((doc) => {
    const franchiseName = (doc.franchise_name || "").toLowerCase();
    const documentName = (doc.document_name || "").toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      franchiseName.includes(search) ||
      documentName.includes(search);

    const matchesFilter =
      filterStatus === "All" || doc.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // ---------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------
  const metrics = useMemo(() => {
    const counts = {
      expired: 0,
      expiringSoon: 0,
      missing: 0,
      awaiting: 0,
    };

    documents.forEach((document) => {
      if (document.status === "Expired") {
        counts.expired += 1;
      } else if (
        document.status === "Expiring in 30 Days" ||
        document.status === "Expiring in 90 Days"
      ) {
        counts.expiringSoon += 1;
      } else if (document.status === "Missing Required") {
        counts.missing += 1;
      } else if (document.status === "Awaiting Review") {
        counts.awaiting += 1;
      }
    });

    return counts;
  }, [documents]);

  // ---------------------------------------------------------
  // FRANCHISE SCORECARD
  // ---------------------------------------------------------
  const franchiseScores = useMemo(() => {
    const byFranchise = {};

    documents.forEach((document) => {
      const franchise = document.franchise_name || "Unknown";

      if (!byFranchise[franchise]) {
        byFranchise[franchise] = {
          total: 0,
          ok: 0,
        };
      }

      byFranchise[franchise].total += 1;

      if (document.status === "Valid") {
        byFranchise[franchise].ok += 1;
      }
    });

    return Object.entries(byFranchise).map(
      ([franchise, { total, ok }]) => {
        const score = total
          ? Math.round((ok / total) * 100)
          : 0;

        let status = "Fully Compliant";

        if (score < 60) {
          status = "Critical Expiries";
        } else if (score < 80) {
          status = "Missing Documents";
        } else if (score < 100) {
          status = "Action Required";
        }

        return {
          franchise,
          score: `${score}%`,
          status,
        };
      }
    );
  }, [documents]);

  // ---------------------------------------------------------
  // RESET FORM
  // ---------------------------------------------------------
  const resetForm = () => {
    setForm({
      franchise: "",
      document_name: "",
      category: "Regulatory",
      expiry_date: "",
    });

    setFile(null);
  };

  // ---------------------------------------------------------
  // UPLOAD DOCUMENT
  // ---------------------------------------------------------
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const body = new FormData();

      if (isHeadOffice) {
        body.append("franchise", form.franchise);
      }

      body.append("document_name", form.document_name);
      body.append("category", form.category);

      if (form.expiry_date) {
        body.append("expiry_date", form.expiry_date);
      }

      if (file) {
        body.append("file", file);
      }

      const response = await api.post(
        "/admin/compliance/",
        body
      );

      const created = response.data;

      setDocuments((previous) => [
        created,
        ...previous,
      ]);

      setIsUploadModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Compliance upload error:", err);

      const data = err.response?.data;

      let message =
        data?.detail ||
        data?.message ||
        "Failed to upload document.";

      if (typeof data === "object" && !data?.detail && !data?.message) {
        const firstField = Object.keys(data)[0];

        if (firstField && Array.isArray(data[firstField])) {
          message = data[firstField][0];
        }
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // DELETE DOCUMENT
  // ---------------------------------------------------------
  const handleDelete = async (docId) => {
    if (!window.confirm("Remove this compliance document?")) {
      return;
    }

    setError(null);

    try {
      await api.delete(
        `/admin/compliance/${docId}/`
      );

      setDocuments((previous) =>
        previous.filter(
          (document) => document.id !== docId
        )
      );
    } catch (err) {
      console.error("Compliance delete error:", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete document.";

      setError(message);
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
            Monitor regulatory document expiries, missing submissions,
            and franchise audit scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "documents"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Document Expiries
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("franchises")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "franchises"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Compliance by Franchise
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaUpload className="text-xs" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* ================= TAB 1: DOCUMENT EXPIRIES ================= */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* QUICK METRICS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Expired Documents
              </p>

              <h3 className="mt-1 text-xl font-black text-rose-600">
                {metrics.expired} Files
              </h3>

              <p className="mt-1 text-[11px] font-semibold text-rose-500">
                Requires immediate notice
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Expiring Soon
              </p>

              <h3 className="mt-1 text-xl font-black text-amber-600">
                {metrics.expiringSoon} Files
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Within 30–90 days
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Missing Required
              </p>

              <h3 className="mt-1 text-xl font-black text-red-600">
                {metrics.missing} Files
              </h3>

              <p className="mt-1 text-[11px] font-semibold text-red-500">
                Action pending from owners
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Awaiting Review
              </p>

              <h3 className="mt-1 text-xl font-black text-teal-600">
                {metrics.awaiting} Files
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Ready for head office check
              </p>
            </div>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />

              <input
                type="text"
                placeholder="Search by franchise or document title..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                "All",
                "Expired",
                "Missing Required",
                "Expiring in 30 Days",
                "Awaiting Review",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                    filterStatus === status
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3.5">
                      Franchise & Document
                    </th>

                    <th className="px-6 py-3.5">
                      Category
                    </th>

                    <th className="px-6 py-3.5">
                      Expiry Date
                    </th>

                    <th className="px-6 py-3.5">
                      Compliance State
                    </th>

                    <th className="px-6 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-slate-400"
                      >
                        <FaSpinner className="mr-2 inline animate-spin" />
                        Loading...
                      </td>
                    </tr>
                  ) : filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="transition hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">
                            {doc.document_name}
                          </p>

                          <p className="text-[10px] font-medium text-slate-400">
                            {doc.franchise_name || "No franchise"}
                          </p>
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-600">
                          {doc.category}
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-700">
                          {doc.expiry_date || "Missing"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {doc.file_url && (
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600"
                              >
                                <FaEye className="text-[10px]" />
                                Review File
                              </a>
                            )}

                            {isHeadOffice && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(doc.id)
                                }
                                className="text-slate-400 hover:text-rose-600"
                                title="Delete document"
                              >
                                <FaTrash className="text-[10px]" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-slate-400"
                      >
                        No compliance documents matching your
                        filter criteria.
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
            <h3 className="mb-1 text-base font-black text-slate-900">
              Franchise Compliance Scorecard
            </h3>

            <p className="mb-6 text-xs text-slate-500">
              Aggregated audit scores across the active franchise
              network, computed live from uploaded documents.
            </p>

            {franchiseScores.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No compliance data yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {franchiseScores.map((fs, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-600">
                        {fs.status}
                      </span>

                      <h4 className="text-sm font-bold text-slate-900">
                        {fs.franchise}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">
                        {fs.score}
                      </span>

                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Compliance Rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= UPLOAD DOCUMENT MODAL ================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                !submitting &&
                setIsUploadModalOpen(false)
              }
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 10,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 10,
              }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Compliance
                  </span>

                  <h3 className="text-lg font-black text-slate-900">
                    Upload Compliance Document
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsUploadModalOpen(false)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleUploadSubmit}
                className="space-y-4 py-6"
              >
                {/* FRANCHISE */}
                {isHeadOffice && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Franchise
                    </label>

                    <select
                      value={form.franchise}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          franchise: e.target.value,
                        })
                      }
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    >
                      <option value="">
                        Select a franchise...
                      </option>

                      {franchises.map((franchise) => (
                        <option
                          key={franchise.id}
                          value={franchise.id}
                        >
                          {franchise.name}
                          {franchise.location
                            ? ` — ${franchise.location}`
                            : ""}
                        </option>
                      ))}
                    </select>

                    {franchises.length === 0 && (
                      <p className="mt-2 text-[10px] text-amber-600">
                        No active franchises found.
                        Add one under Franchises first.
                      </p>
                    )}
                  </div>
                )}

                {/* DOCUMENT NAME */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Document Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g., Public Liability Insurance Certificate"
                    value={form.document_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        document_name: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* CATEGORY + EXPIRY */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category
                    </label>

                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    >
                      {CATEGORIES.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Expiry Date
                    </label>

                    <input
                      type="date"
                      value={form.expiry_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expiry_date: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* FILE */}
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    File (PDF, DOC...)
                  </label>

                  <input
                    type="file"
                    onChange={(e) =>
                      setFile(
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setIsUploadModalOpen(false)
                    }
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
                    {submitting && (
                      <FaSpinner className="animate-spin" />
                    )}

                    {submitting
                      ? "Uploading..."
                      : "Upload Document"}
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