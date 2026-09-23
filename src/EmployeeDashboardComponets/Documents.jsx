import React, { useEffect, useRef, useState } from "react";
import {
  FaFolderOpen,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaUpload,
  FaExclamationTriangle,
  FaTimes,
  FaSyncAlt,
  FaDownload,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const CATEGORY_CHOICES = [
  "Certification",
  "License",
  "Training Record",
  "ID Document",
  "Other",
];

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp"];

const STATUS_STYLE = {
  Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring in 30 Days": "bg-amber-50 text-amber-700 border-amber-200",
  "Expiring in 90 Days": "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-rose-50 text-rose-700 border-rose-200",
  "Missing Required": "bg-slate-100 text-slate-600 border-slate-200",
  "Awaiting Review": "bg-blue-50 text-blue-700 border-blue-200",
};

function getFileMeta(fileName) {
  const lower = (fileName || "").toLowerCase();
  const extension = lower.includes(".") ? lower.split(".").pop() : "";

  if (extension === "pdf") return { icon: <FaFilePdf /> };
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext)))
    return { icon: <FaFileImage /> };
  return { icon: <FaFileAlt /> };
}

function formatExpiry(value) {
  if (!value) return "No expiry";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractErrorMessage(err, fallback) {
  const data = err.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstError = Object.values(data)[0];
  if (Array.isArray(firstError)) return firstError[0];
  return String(firstError) || fallback;
}

const INITIAL_UPLOAD_FORM = {
  document_name: "",
  category: "Certification",
  expiry_date: "",
  file: null,
};

export default function Documents() {
  const [documentsList, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState(INITIAL_UPLOAD_FORM);
  const [uploading, setUploading] = useState(false);

  const [replacingId, setReplacingId] = useState(null);
  const replaceInputRef = useRef(null);
  const replaceTargetId = useRef(null);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("documents/me/");
      const data = response.data?.employee_documents;

      setDocumentsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching employee documents:", err);
      setError(extractErrorMessage(err, "Unable to load your documents."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =========================================================
  // UPLOAD NEW DOCUMENT
  // =========================================================

  const openUploadModal = () => {
    setError("");
    setUploadForm(INITIAL_UPLOAD_FORM);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    if (uploading) return;
    setShowUploadModal(false);
    setUploadForm(INITIAL_UPLOAD_FORM);
  };

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

    if (!uploadForm.file) {
      setError("Please choose a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = new FormData();
      data.append("document_name", uploadForm.document_name.trim());
      data.append("category", uploadForm.category);
      if (uploadForm.expiry_date) data.append("expiry_date", uploadForm.expiry_date);
      data.append("file", uploadForm.file);

      // Employee role: backend auto-attaches this to your own
      // Employee record and forces status to "Awaiting Review".
      await api.post("admin/employee-documents/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchDocuments();
      setShowUploadModal(false);
      setUploadForm(INITIAL_UPLOAD_FORM);
      showSuccess("Document submitted for review.");
    } catch (err) {
      console.error("Upload employee document error:", err);
      setError(extractErrorMessage(err, "Unable to upload document."));
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // REPLACE EXISTING DOCUMENT (new version -> back to review)
  // =========================================================

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

      await fetchDocuments();
      showSuccess("Document replaced and resubmitted for review.");
    } catch (err) {
      console.error("Replace employee document error:", err);
      setError(extractErrorMessage(err, "Unable to replace this document."));
    } finally {
      setReplacingId(null);
    }
  };

  const handleDownload = (doc) => {
    if (!doc.file_url) return;
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
  };

  const expiringSoon = documentsList.filter((d) =>
    ["Expiring in 30 Days", "Expiring in 90 Days"].includes(d.status)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-400">
        <FaSyncAlt className="animate-spin text-xl" style={{ color: BRAND_COLOR }} />
        <p className="text-xs font-semibold">Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-100 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-700 shadow-xl">
          <FaCheckCircle />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">My Documents</h3>
          <p className="text-xs text-slate-500">
            Keep your certifications current to remain eligible for scheduling.
          </p>
        </div>

        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 shrink-0"
        >
          <FaPlus className="text-[10px]" />
          <span>Upload Document</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <FaExclamationTriangle className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
      )}

      {expiringSoon.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <FaExclamationTriangle className="mt-0.5 text-amber-500" />
          <p className="text-xs font-semibold text-amber-700">
            {expiringSoon.length} document{expiringSoon.length > 1 ? "s" : ""} expiring soon.
            Upload a renewed version to stay eligible for scheduling.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {documentsList.map((d) => {
          const { icon } = getFileMeta(d.file_name);

          return (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-base shrink-0"
                  style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{d.document_name}</p>
                  <p className="text-[11px] text-slate-400">
                    {d.category} · Expires {formatExpiry(d.expiry_date)}
                    {d.verified && (
                      <span className="ml-1.5 text-emerald-600 font-semibold">· Verified</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    STATUS_STYLE[d.status] || "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {d.status}
                </span>

                {d.file_url && (
                  <button
                    onClick={() => handleDownload(d)}
                    title="Download"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50 transition"
                  >
                    <FaDownload className="text-[11px]" />
                  </button>
                )}

                <button
                  onClick={() => handleReplaceClick(d.id)}
                  disabled={replacingId === d.id}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
                >
                  {replacingId === d.id ? (
                    <FaSyncAlt className="animate-spin text-[10px]" />
                  ) : (
                    <FaUpload className="text-[10px]" />
                  )}
                  {replacingId === d.id ? "Uploading..." : "Replace"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {documentsList.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <FaFolderOpen className="mb-3 text-2xl text-slate-300" />
          <p className="text-sm font-bold text-slate-500">No documents on file</p>
          <p className="text-xs text-slate-400 mt-1">
            Upload your certifications to get started.
          </p>
        </div>
      )}

      {/* Hidden input used for "Replace" on an existing document */}
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
        onChange={handleReplaceFileSelected}
      />

      {/* UPLOAD NEW DOCUMENT MODAL */}
      {showUploadModal && (
        <>
          <div
            onClick={closeUploadModal}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900">Upload Document</h4>
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className="text-slate-400 hover:text-slate-600"
              >
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
                    {CATEGORY_CHOICES.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
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
                    <p className="font-bold text-slate-700">Drag & drop, or browse</p>
                    <p className="text-[10px] text-slate-400">
                      Supports PDF, PNG, JPG, DOC, DOCX up to 25MB
                    </p>
                  </>
                )}
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={closeUploadModal}
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
                  {uploading ? "Uploading..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}