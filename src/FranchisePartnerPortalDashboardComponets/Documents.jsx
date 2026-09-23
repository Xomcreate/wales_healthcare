import React, { useEffect, useRef, useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaBell,
  FaTimes,
  FaDownload,
  FaSyncAlt,
  FaExclamationTriangle,
  FaFolderOpen,
  FaTrash,
  FaFilePdf,
  FaFileImage,
  FaUsers,
  FaShieldAlt,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const CATEGORY_CHOICES = [
  "Regulatory",
  "Insurance",
  "Safety",
  "HR Compliance",
  "Legal",
];

const EMPLOYEE_DOCUMENT_CATEGORY_CHOICES = [
  "Certification",
  "License",
  "Training Record",
  "ID Document",
  "Other",
];

const BRAND_COLOR = "#0d9488";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp"];

function getFileMeta(fileName) {
  const lower = (fileName || "").toLowerCase();
  const extension = lower.includes(".") ? lower.split(".").pop() : "";

  if (extension === "pdf") return { icon: <FaFilePdf />, label: "PDF" };
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext)))
    return { icon: <FaFileImage />, label: extension.toUpperCase() };
  return { icon: <FaFileAlt />, label: extension ? extension.toUpperCase() : "File" };
}

function formatDate(value, opts = { month: "short", day: "2-digit", year: "numeric" }) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", opts);
}

function extractErrorMessage(err, fallback) {
  const backendError = err.response?.data;

  if (typeof backendError === "string") return backendError;
  if (backendError?.detail) return backendError.detail;

  if (backendError) {
    const firstError = Object.values(backendError)[0];
    if (Array.isArray(firstError)) return firstError[0];
    return String(firstError);
  }

  return fallback;
}

function statusBadgeClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "valid") return "bg-emerald-50 text-emerald-700";
  if (normalized.includes("expiring")) return "bg-amber-50 text-amber-700";
  if (normalized === "expired") return "bg-rose-50 text-rose-700";
  if (normalized === "awaiting review") return "bg-blue-50 text-blue-700";
  if (normalized.includes("missing")) return "bg-slate-100 text-slate-600";
  return "bg-slate-100 text-slate-600";
}

// =========================================================
// TAB 1: COMPLIANCE DOCUMENTS  (franchise's own regulatory docs)
// =========================================================

function ComplianceTab({ error, setError }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    document_name: "",
    category: "Regulatory",
    expiry_date: "",
    file: null,
  });

  const [replacingId, setReplacingId] = useState(null);
  const replaceInputRef = useRef(null);
  const replaceTargetId = useRef(null);

  const getResults = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.compliance_documents)) return data.compliance_documents;
    return [];
  };

  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await api.get("admin/compliance/");
      setDocumentsList(getResults(response.data));
      setError("");
    } catch (err) {
      console.error("Error fetching compliance documents:", err);
      setError(err.response?.data?.detail || "Unable to load compliance documents.");
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      e.target.value = "";
      return;
    }

    setUploadForm((prev) => ({ ...prev, file }));
    setError("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadForm.document_name.trim()) {
      setError("Please enter a document name.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = new FormData();
      data.append("document_name", uploadForm.document_name.trim());
      data.append("category", uploadForm.category);
      if (uploadForm.expiry_date) data.append("expiry_date", uploadForm.expiry_date);
      if (uploadForm.file) data.append("file", uploadForm.file);

      await api.post("admin/compliance/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments();
      setShowUploadModal(false);
      setUploadForm({ document_name: "", category: "Regulatory", expiry_date: "", file: null });
    } catch (err) {
      console.error("Upload compliance document error:", err);
      setError(extractErrorMessage(err, "Unable to upload document."));
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceClick = (documentId) => {
    replaceTargetId.current = documentId;
    replaceInputRef.current?.click();
  };

  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    const documentId = replaceTargetId.current;
    e.target.value = "";

    if (!file || !documentId) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      return;
    }

    try {
      setReplacingId(documentId);
      setError("");

      const data = new FormData();
      data.append("file", file);

      await api.patch(`admin/compliance/${documentId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments();
    } catch (err) {
      console.error("Replace document version error:", err);
      setError(extractErrorMessage(err, "Unable to replace this document."));
    } finally {
      setReplacingId(null);
    }
  };

  const handleDownload = (doc) => {
    if (!doc.file_url) {
      setError("No file has been uploaded for this document yet.");
      return;
    }
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Licences, Insurance & Certifications
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Allows replacement/versioning without deleting historical audit evidence.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
            <FaBell className="text-[10px]" /> Automated Expiry Notifications Active
          </div>
          <button
            onClick={() => {
              setError("");
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaUpload className="text-[10px]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          {loadingDocuments ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <FaSyncAlt className="animate-spin" />
              <p className="text-xs">Loading compliance documents...</p>
            </div>
          ) : (
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
                {documentsList.length > 0 ? (
                  documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{doc.document_name}</span>
                        <span className="text-[10px] text-slate-400">COMP-{doc.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{doc.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {doc.expiry_date ? `Exp: ${formatDate(doc.expiry_date)}` : "No expiry"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadgeClass(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {doc.file_url && (
                            <button
                              onClick={() => handleDownload(doc)}
                              title="Download"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50 transition"
                            >
                              <FaDownload className="text-[11px]" />
                            </button>
                          )}
                          <button
                            onClick={() => handleReplaceClick(doc.id)}
                            disabled={replacingId === doc.id}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition disabled:opacity-60"
                          >
                            {replacingId === doc.id ? "Uploading..." : "Replace Version"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-14 text-center text-slate-400 text-xs">
                      No compliance documents found for your franchise yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
        onChange={handleReplaceFileSelected}
      />

      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowUploadModal(false)}
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
                <button onClick={() => !uploading && setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-500">
                  Upload new licences, insurance policies, certifications, or permitted documents. Versioning will preserve past audit evidence.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    name="document_name"
                    value={uploadForm.document_name}
                    onChange={handleUploadInputChange}
                    placeholder="e.g. Commercial General Liability Insurance"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={uploadForm.category}
                      onChange={handleUploadInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      {CATEGORY_CHOICES.map((choice) => (
                        <option key={choice} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Expiry Date <span className="font-normal text-slate-400">Optional</span>
                    </label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={uploadForm.expiry_date}
                      onChange={handleUploadInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50 block cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleUploadFileChange}
                    className="hidden"
                  />
                  <FaUpload className="text-2xl text-teal-600 mx-auto" />
                  {uploadForm.file ? (
                    <>
                      <p className="font-bold text-slate-700 truncate">{uploadForm.file.name}</p>
                      <p className="text-[10px] text-slate-400">Click to replace file</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-700">Drag & drop files here, or browse</p>
                      <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG, DOC, DOCX up to 25MB</p>
                    </>
                  )}
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {uploading && <FaSyncAlt className="animate-spin" />}
                    {uploading ? "Uploading..." : "Upload & Submit for Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// TAB 2: CUSTOMER DOCUMENTS  (franchise -> a specific customer)
// =========================================================

function CustomerDocumentsTab({ error, setError }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [documents, setDocuments] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await api.get("admin/customers/");
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setCustomers(list);

      if (list.length > 0) {
        setSelectedCustomerId((prev) => prev || String(list[0].id));
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.response?.data?.detail || "Unable to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchDocuments = async (customerId) => {
    if (!customerId) return;

    try {
      setLoadingDocuments(true);
      const response = await api.get(`admin/customers/${customerId}/documents/`);
      setDocuments(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching customer documents:", err);
      setError(err.response?.data?.detail || "Unable to load documents for this customer.");
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (selectedCustomerId) fetchDocuments(selectedCustomerId);
  }, [selectedCustomerId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      e.target.value = "";
      return;
    }

    setUploadFile(file);
    setError("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadFile) {
      setError("Please choose a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = new FormData();
      data.append("file", uploadFile);

      await api.post(`admin/customers/${selectedCustomerId}/documents/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments(selectedCustomerId);
      setShowUploadModal(false);
      setUploadFile(null);
    } catch (err) {
      console.error("Upload customer document error:", err);
      setError(extractErrorMessage(err, "Unable to upload document."));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      setDeletingId(documentId);
      await api.delete(`admin/documents/${documentId}/`);
      await fetchDocuments(selectedCustomerId);
    } catch (err) {
      console.error("Delete customer document error:", err);
      setError(extractErrorMessage(err, "Unable to delete this document."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (doc) => {
    if (!doc.file_url) return;
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
  };

  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Share Documents With a Customer
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pick a customer, then upload a document for them to view under "My Documents".
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            disabled={loadingCustomers || customers.length === 0}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
          >
            {customers.length === 0 && <option value="">No customers found</option>}
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || c.email}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setError("");
              setShowUploadModal(true);
            }}
            disabled={!selectedCustomerId}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:opacity-60"
          >
            <FaUpload className="text-[10px]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        {loadingDocuments ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
            <FaSyncAlt className="animate-spin" />
            <p className="text-xs">Loading documents...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {documents.map((d) => {
              const { icon, label } = getFileMeta(d.file_name);
              return (
                <div key={d.id} className="flex items-center justify-between p-5 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-base"
                      style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{d.file_name || "Untitled document"}</p>
                      <p className="text-[11px] text-slate-400">
                        Uploaded {formatDate(d.uploaded_at, { month: "short", day: "numeric", year: "numeric" })} · {label}
                        {d.verified && <span className="ml-1.5 text-emerald-600 font-semibold">· Verified</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(d)}
                      disabled={!d.file_url}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50 transition disabled:opacity-50"
                    >
                      <FaDownload className="text-[11px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={deletingId === d.id}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 transition disabled:opacity-60"
                    >
                      {deletingId === d.id ? <FaSyncAlt className="animate-spin text-[11px]" /> : <FaTrash className="text-[11px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaFolderOpen className="mb-3 text-2xl text-slate-300" />
            <p className="text-sm font-bold text-slate-500">No documents yet</p>
            <p className="text-xs text-slate-400">
              {selectedCustomer
                ? `Nothing shared with ${selectedCustomer.full_name || "this customer"} yet.`
                : "Select a customer above."}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowUploadModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Upload Document {selectedCustomer && `for ${selectedCustomer.full_name || selectedCustomer.email}`}
                </h4>
                <button onClick={() => !uploading && setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs text-slate-700">
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50 block cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FaUpload className="text-2xl text-teal-600 mx-auto" />
                  {uploadFile ? (
                    <>
                      <p className="font-bold text-slate-700 truncate">{uploadFile.name}</p>
                      <p className="text-[10px] text-slate-400">Click to replace file</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-700">Drag & drop a file here, or browse</p>
                      <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG, DOC, DOCX up to 25MB</p>
                    </>
                  )}
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {uploading && <FaSyncAlt className="animate-spin" />}
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// TAB 3: EMPLOYEE DOCUMENTS  (franchise reviews + verifies
//   documents its own employees uploaded — plus can upload
//   a document on an employee's behalf, e.g. for onboarding)
// =========================================================

function EmployeeDocumentsTab({ error, setError }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    document_name: "",
    category: "Certification",
    expiry_date: "",
    file: null,
  });

  const [verifyingId, setVerifyingId] = useState(null);
  const [replacingId, setReplacingId] = useState(null);
  const replaceInputRef = useRef(null);
  const replaceTargetId = useRef(null);

  // ---------------------------------------------------------
  // LOAD EMPLOYEES (franchise-scoped by the backend already)
  // ---------------------------------------------------------

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get("admin/employees/");
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setEmployees(list);

      if (list.length > 0) {
        setSelectedEmployeeId((prev) => prev || String(list[0].id));
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.response?.data?.detail || "Unable to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ---------------------------------------------------------
  // LOAD DOCUMENTS FOR SELECTED EMPLOYEE
  // ---------------------------------------------------------

  const fetchDocuments = async (employeeId) => {
    if (!employeeId) return;

    try {
      setLoadingDocuments(true);
      const response = await api.get(`admin/employee-documents/?employee=${employeeId}`);
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setDocuments(list);
      setError("");
    } catch (err) {
      console.error("Error fetching employee documents:", err);
      setError(err.response?.data?.detail || "Unable to load documents for this employee.");
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (selectedEmployeeId) fetchDocuments(selectedEmployeeId);
  }, [selectedEmployeeId]);

  // ---------------------------------------------------------
  // UPLOAD (on behalf of the selected employee)
  // ---------------------------------------------------------

  const handleUploadInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      e.target.value = "";
      return;
    }

    setUploadForm((prev) => ({ ...prev, file }));
    setError("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadForm.document_name.trim()) {
      setError("Please enter a document name.");
      return;
    }

    if (!selectedEmployeeId) {
      setError("Please select an employee first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = new FormData();
      data.append("employee", selectedEmployeeId);
      data.append("document_name", uploadForm.document_name.trim());
      data.append("category", uploadForm.category);
      if (uploadForm.expiry_date) data.append("expiry_date", uploadForm.expiry_date);
      if (uploadForm.file) data.append("file", uploadForm.file);

      await api.post("admin/employee-documents/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments(selectedEmployeeId);
      setShowUploadModal(false);
      setUploadForm({ document_name: "", category: "Certification", expiry_date: "", file: null });
    } catch (err) {
      console.error("Upload employee document error:", err);
      setError(extractErrorMessage(err, "Unable to upload document."));
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------
  // REPLACE FILE (franchise-initiated version replace)
  // ---------------------------------------------------------

  const handleReplaceClick = (documentId) => {
    replaceTargetId.current = documentId;
    replaceInputRef.current?.click();
  };

  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    const documentId = replaceTargetId.current;
    e.target.value = "";

    if (!file || !documentId) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      return;
    }

    try {
      setReplacingId(documentId);
      setError("");

      const data = new FormData();
      data.append("file", file);

      await api.patch(`admin/employee-documents/${documentId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments(selectedEmployeeId);
    } catch (err) {
      console.error("Replace employee document error:", err);
      setError(extractErrorMessage(err, "Unable to replace this document."));
    } finally {
      setReplacingId(null);
    }
  };

  // ---------------------------------------------------------
  // VERIFY / APPROVE  (toggles `verified`; backend recomputes
  // status off "Awaiting Review" once verified)
  // ---------------------------------------------------------

  const handleVerify = async (documentId, verified) => {
    try {
      setVerifyingId(documentId);
      setError("");

      const response = await api.patch(`admin/employee-documents/${documentId}/`, {
        verified,
      });

      const updated = response.data;

      setDocuments((previous) =>
        previous.map((doc) => (doc.id === documentId ? updated : doc))
      );
    } catch (err) {
      console.error("Verify employee document error:", err);
      setError(extractErrorMessage(err, "Unable to update this document."));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDownload = (doc) => {
    if (!doc.file_url) {
      setError("No file has been uploaded for this document yet.");
      return;
    }
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
  };

  const selectedEmployee = employees.find((emp) => String(emp.id) === String(selectedEmployeeId));

  const awaitingReviewCount = documents.filter((d) => d.status === "Awaiting Review").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Employee Certifications & Compliance
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Review documents your employees uploaded and approve them, or upload one on their behalf.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            disabled={loadingEmployees || employees.length === 0}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
          >
            {employees.length === 0 && <option value="">No employees found</option>}
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} · {emp.employee_id}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setError("");
              setShowUploadModal(true);
            }}
            disabled={!selectedEmployeeId}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:opacity-60"
          >
            <FaUpload className="text-[10px]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {selectedEmployee && awaitingReviewCount > 0 && (
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700">
          <FaExclamationTriangle className="shrink-0" />
          <span>
            {awaitingReviewCount} document{awaitingReviewCount === 1 ? "" : "s"} from{" "}
            {selectedEmployee.full_name} awaiting review.
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          {loadingDocuments ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <FaSyncAlt className="animate-spin" />
              <p className="text-xs">Loading documents...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Document Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{doc.document_name}</span>
                        {doc.verified && (
                          <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{doc.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {doc.expiry_date ? `Exp: ${formatDate(doc.expiry_date)}` : "No expiry"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadgeClass(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {doc.file_url && (
                            <button
                              onClick={() => handleDownload(doc)}
                              title="Download"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50 transition"
                            >
                              <FaDownload className="text-[11px]" />
                            </button>
                          )}

                          <button
                            onClick={() => handleReplaceClick(doc.id)}
                            disabled={replacingId === doc.id}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                            title="Replace file"
                          >
                            {replacingId === doc.id ? (
                              <FaSyncAlt className="animate-spin text-[11px]" />
                            ) : (
                              <FaUpload className="text-[11px]" />
                            )}
                          </button>

                          {doc.verified ? (
                            <button
                              onClick={() => handleVerify(doc.id, false)}
                              disabled={verifyingId === doc.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 hover:bg-slate-200 transition disabled:opacity-60"
                            >
                              {verifyingId === doc.id ? (
                                <FaSyncAlt className="animate-spin text-[10px]" />
                              ) : (
                                <FaCheckCircle className="text-emerald-600 text-[10px]" />
                              )}
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerify(doc.id, true)}
                              disabled={verifyingId === doc.id || !doc.file_url}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition disabled:opacity-60"
                            >
                              {verifyingId === doc.id ? (
                                <FaSyncAlt className="animate-spin text-[10px]" />
                              ) : (
                                <FaCheckCircle className="text-[10px]" />
                              )}
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-14 text-center text-slate-400 text-xs">
                      {selectedEmployee
                        ? `${selectedEmployee.full_name} hasn't uploaded any documents yet.`
                        : "Select an employee above."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
        onChange={handleReplaceFileSelected}
      />

      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowUploadModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Upload Document {selectedEmployee && `for ${selectedEmployee.full_name}`}
                </h4>
                <button onClick={() => !uploading && setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs text-slate-700">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    name="document_name"
                    value={uploadForm.document_name}
                    onChange={handleUploadInputChange}
                    placeholder="e.g. PSW Certification"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={uploadForm.category}
                      onChange={handleUploadInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      {EMPLOYEE_DOCUMENT_CATEGORY_CHOICES.map((choice) => (
                        <option key={choice} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Expiry Date <span className="font-normal text-slate-400">Optional</span>
                    </label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={uploadForm.expiry_date}
                      onChange={handleUploadInputChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50 block cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleUploadFileChange}
                    className="hidden"
                  />
                  <FaUpload className="text-2xl text-teal-600 mx-auto" />
                  {uploadForm.file ? (
                    <>
                      <p className="font-bold text-slate-700 truncate">{uploadForm.file.name}</p>
                      <p className="text-[10px] text-slate-400">Click to replace file</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-700">Drag & drop files here, or browse</p>
                      <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG, DOC, DOCX up to 25MB</p>
                    </>
                  )}
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {uploading && <FaSyncAlt className="animate-spin" />}
                    {uploading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// MAIN — Documents & Compliance page (franchise-side)
//   Tab 1: Compliance   — franchise's own regulatory docs
//   Tab 2: Employees     — review/approve employee-uploaded docs
//   Tab 3: Customers     — franchise uploads docs to a customer
// =========================================================

export default function Documents() {
  const [activeTab, setActiveTab] = useState("compliance");
  const [error, setError] = useState("");

  const TABS = [
    { key: "compliance", label: "Compliance Documents", icon: <FaShieldAlt className="text-[10px]" /> },
    { key: "employees", label: "Employee Documents", icon: <FaUserTie className="text-[10px]" /> },
    { key: "customers", label: "Customer Documents", icon: <FaUsers className="text-[10px]" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
          Documents & Compliance
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Manage your franchise's compliance documents, review employee certifications, and share files with customers.
        </p>

        {/* TABS */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setError("");
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR BANNER (shared across tabs) */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700"
        >
          <FaExclamationTriangle className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError("")} className="text-rose-500 hover:text-rose-700">
            <FaTimes />
          </button>
        </motion.div>
      )}

      {activeTab === "compliance" ? (
        <ComplianceTab error={error} setError={setError} />
      ) : activeTab === "employees" ? (
        <EmployeeDocumentsTab error={error} setError={setError} />
      ) : (
        <CustomerDocumentsTab error={error} setError={setError} />
      )}
    </motion.div>
  );
}