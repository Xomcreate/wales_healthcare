import React, { useEffect, useState } from "react";
import { FaFolderOpen, FaFilePdf, FaFileImage, FaFileAlt, FaDownload, FaSyncAlt, FaExclamationTriangle } from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// =========================================================
// FILE ICON BY EXTENSION
//
// CustomerDocumentSerializer only returns file_name/file_url,
// no explicit "type" field, so the icon/type label is inferred
// from the file name's extension.
// =========================================================

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp"];

function getFileMeta(fileName) {
  const lower = (fileName || "").toLowerCase();
  const extension = lower.includes(".") ? lower.split(".").pop() : "";

  if (extension === "pdf") {
    return { icon: <FaFilePdf />, label: "PDF" };
  }

  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return { icon: <FaFileImage />, label: extension.toUpperCase() };
  }

  return { icon: <FaFileAlt />, label: extension ? extension.toUpperCase() : "File" };
}

function formatDate(value) {
  if (!value) return "—";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH "MY DOCUMENTS"
  //
  // For a customer, MyDocumentsView returns:
  //   { role: "customer", customer_documents: [...] }
  // =========================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await api.get("documents/me/");

      const data = response.data?.customer_documents;

      setDocuments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching documents:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your documents right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = (doc) => {
    if (!doc.file_url) return;
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">My Documents</h3>
          <p className="text-xs text-slate-500">
            Documents shared with you by your franchise. Read-only.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          title="Refresh"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-60"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-slate-400">
          <FaSyncAlt className="animate-spin" />
          <p className="text-xs">Loading your documents...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((d) => {
            const { icon, label } = getFileMeta(d.file_name);

            return (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
              >
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
                      Shared {formatDate(d.uploaded_at)} · {label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(d)}
                  disabled={!d.file_url}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload className="text-[10px]" /> Download
                </button>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <FaFolderOpen className="mb-3 text-2xl text-slate-300" />
              <p className="text-sm font-bold text-slate-500">No documents yet</p>
              <p className="text-xs text-slate-400">Your franchise will share documents here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}