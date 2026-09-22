import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileAlt,
  FaUpload,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaBuilding,
  FaShieldAlt,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCloudUploadAlt,
  FaChevronDown,
  FaPlus,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("resources");

  const [resources, setResources] = useState([]);
  const [complianceDocuments, setComplianceDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingCompliance, setLoadingCompliance] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    documentName: "",
    category: "Policies",
    audience: "All Franchises",
    description: "",
    file: null,
  });

  // =========================================================
  // NORMALIZE API RESPONSE
  // =========================================================

  const getResults = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.documents)) {
      return data.documents;
    }

    if (Array.isArray(data?.resources)) {
      return data.resources;
    }

    return [];
  };

  // =========================================================
  // FETCH NETWORK RESOURCES
  // =========================================================

  const fetchResources = async () => {
    try {
      setLoadingResources(true);

      const response = await api.get("admin/resources/");

      const data = getResults(response.data);

      setResources(data);
      setError("");
    } catch (err) {
      console.error("Error fetching resources:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load network resources."
      );
    } finally {
      setLoadingResources(false);
    }
  };

  // =========================================================
  // FETCH FRANCHISE COMPLIANCE
  // =========================================================

  const fetchCompliance = async () => {
    try {
      setLoadingCompliance(true);

      const response = await api.get("admin/compliance/");

      const data = getResults(response.data);

      setComplianceDocuments(data);
    } catch (err) {
      console.error("Error fetching compliance:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load franchise compliance documents."
      );
    } finally {
      setLoadingCompliance(false);
    }
  };

  // =========================================================
  // FETCH AUDIT LOG
  // =========================================================

  const fetchAuditLogs = async () => {
    try {
      setLoadingAudit(true);

      const response = await api.get("admin/document-audit-log/");

      const data = getResults(response.data);

      setAuditLogs(data);
    } catch (err) {
      console.error("Error fetching document audit logs:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchResources();
    fetchCompliance();
  }, []);

  // =========================================================
  // LOAD AUDIT LOG WHEN NEEDED
  // =========================================================

  useEffect(() => {
    if (activeTab === "activity" && auditLogs.length === 0) {
      fetchAuditLogs();
    }
  }, [activeTab]);

  // =========================================================
  // INPUT HANDLER
  // =========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // FILE HANDLER
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 25 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must not exceed 25MB.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
    }));

    setError("");
  };

  // =========================================================
  // UPLOAD NETWORK RESOURCE
  //
  // FIX: the backend's ResourceSerializer requires a "title"
  // field (it is not in read_only_fields), but this form was
  // previously sending "name" and "document_name" instead —
  // neither of which the serializer recognizes. That mismatch
  // is exactly why the API always came back with:
  //   {"title": ["This field is required."]}
  //
  // The Resource model also has no "description" field, so a
  // "description" value has nowhere to be stored on the
  // backend right now; it is left out of the FormData below
  // rather than silently sent and ignored. See the note at the
  // bottom of this component if you want description support
  // added (requires a model + serializer change).
  // =========================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.documentName.trim()) {
      setError("Please enter a document name.");
      return;
    }

    if (!formData.file) {
      setError("Please select a document file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = new FormData();

      // Matches ResourceSerializer's "title" field exactly.
      data.append("title", formData.documentName.trim());
      data.append("category", formData.category);
      data.append("audience", formData.audience);
      data.append("file", formData.file);

      const response = await api.post(
        "admin/resources/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resource uploaded:", response.data);

      await fetchResources();

      setShowUploadModal(false);

      setFormData({
        documentName: "",
        category: "Policies",
        audience: "All Franchises",
        description: "",
        file: null,
      });
    } catch (err) {
      console.error("Upload resource error:", err);

      const backendError = err.response?.data;

      if (typeof backendError === "string") {
        setError(backendError);
      } else if (backendError?.detail) {
        setError(backendError.detail);
      } else if (backendError) {
        const firstError = Object.values(backendError)[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else {
          setError(String(firstError));
        }
      } else {
        setError("Unable to upload document.");
      }
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // DELETE RESOURCE
  // =========================================================

  const handleDeleteResource = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`admin/resources/${id}/`);

      setResources((prev) =>
        prev.filter((item) => String(item.id) !== String(id))
      );
    } catch (err) {
      console.error("Delete resource error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete this document."
      );
    }
  };

  // =========================================================
  // VIEW DOCUMENT
  // =========================================================

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  // =========================================================
  // DOWNLOAD DOCUMENT
  // =========================================================

  const handleDownload = (document) => {
    const url =
      document?.file_url ||
      document?.file ||
      document?.url;

    if (!url) {
      setError("No downloadable file is available for this document.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =========================================================
  // EDIT RESOURCE
  // =========================================================

  const handleEditResource = (document) => {
    setError(
      "Document editing can be connected to the existing resource PATCH endpoint next."
    );

    console.log("Edit resource:", document);
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const normalized = String(status || "")
      .toLowerCase()
      .replace(/_/g, " ");

    if (
      normalized === "published" ||
      normalized === "valid" ||
      normalized === "approved"
    ) {
      return {
        background: "#ecfdf5",
        color: "#047857",
        icon: <FaCheckCircle />,
      };
    }

    if (
      normalized.includes("pending") ||
      normalized.includes("awaiting") ||
      normalized.includes("review")
    ) {
      return {
        background: "#fffbeb",
        color: "#b45309",
        icon: <FaClock />,
      };
    }

    if (
      normalized.includes("expiring")
    ) {
      return {
        background: "#fff7ed",
        color: "#c2410c",
        icon: <FaExclamationTriangle />,
      };
    }

    if (
      normalized.includes("expired") ||
      normalized.includes("rejected")
    ) {
      return {
        background: "#fef2f2",
        color: "#dc2626",
        icon: <FaTimesCircle />,
      };
    }

    if (normalized.includes("archived")) {
      return {
        background: "#f1f5f9",
        color: "#475569",
        icon: <FaClock />,
      };
    }

    return {
      background: "#f1f5f9",
      color: "#475569",
      icon: <FaClock />,
    };
  };

  // =========================================================
  // FORMAT STATUS
  // =========================================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // =========================================================
  // RESOURCE FILTER
  // =========================================================

  const filteredResources = useMemo(() => {
    return resources.filter((doc) => {
      const name =
        doc.name ||
        doc.document_name ||
        doc.title ||
        "";

      const category =
        doc.category ||
        "";

      const audience =
        doc.audience ||
        "";

      const status =
        formatStatus(doc.status || "");

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search) ||
        audience.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [resources, searchTerm, statusFilter]);

  // =========================================================
  // COMPLIANCE FILTER
  // =========================================================

  const filteredCompliance = useMemo(() => {
    return complianceDocuments.filter((doc) => {
      const franchise =
        typeof doc.franchise === "object"
          ? doc.franchise?.name ||
            doc.franchise?.franchise_name ||
            ""
          : doc.franchise || "";

      const documentName =
        doc.document_name ||
        doc.name ||
        doc.title ||
        "";

      const category =
        doc.category ||
        "";

      const status =
        formatStatus(doc.status || "");

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        String(franchise).toLowerCase().includes(search) ||
        String(documentName).toLowerCase().includes(search) ||
        String(category).toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    complianceDocuments,
    searchTerm,
    statusFilter,
  ]);

  // =========================================================
  // COUNTS
  // =========================================================

  const totalDocuments =
    resources.length + complianceDocuments.length;

  const pendingCount =
    resources.filter((doc) => {
      const status = String(doc.status || "").toLowerCase();

      return (
        status.includes("pending") ||
        status.includes("review") ||
        status.includes("awaiting")
      );
    }).length +
    complianceDocuments.filter((doc) => {
      const status = String(doc.status || "").toLowerCase();

      return (
        status.includes("pending") ||
        status.includes("review") ||
        status.includes("awaiting")
      );
    }).length;

  const expiringCount =
    complianceDocuments.filter((doc) =>
      String(doc.status || "")
        .toLowerCase()
        .includes("expiring")
    ).length;

  const franchiseDocumentCount =
    complianceDocuments.length;

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const refreshCurrentData = async () => {
    setError("");

    if (activeTab === "resources") {
      await fetchResources();
    }

    if (activeTab === "compliance") {
      await fetchCompliance();
    }

    if (activeTab === "activity") {
      await fetchAuditLogs();
    }
  };

  return (
    <div className="documents-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="documents-header">

        <div>
          <div className="page-breadcrumb">
            <span>Super Admin</span>
            <span>/</span>
            <strong>Documents</strong>
          </div>

          <h1>Documents & Compliance</h1>

          <p>
            Manage network resources, franchise compliance
            documents and official healthcare records.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="refresh-btn"
            onClick={refreshCurrentData}
            title="Refresh"
          >
            <FaSyncAlt />
          </button>

          <button
            className="upload-main-btn"
            onClick={() => {
              setError("");
              setShowUploadModal(true);
            }}
          >
            <FaUpload />
            Upload Document
          </button>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <motion.div
          className="error-banner"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle />

          <span>{error}</span>

          <button onClick={() => setError("")}>
            <FaTimes />
          </button>
        </motion.div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="summary-grid">

        <motion.div
          className="summary-card"
          whileHover={{ y: -3 }}
        >
          <div className="summary-icon teal">
            <FaFileAlt />
          </div>

          <div>
            <span>Total Documents</span>

            <h3>
              {totalDocuments}
            </h3>

            <small>
              Across the network
            </small>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          whileHover={{ y: -3 }}
        >
          <div className="summary-icon blue">
            <FaBuilding />
          </div>

          <div>
            <span>Franchise Documents</span>

            <h3>
              {franchiseDocumentCount}
            </h3>

            <small>
              Compliance records
            </small>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          whileHover={{ y: -3 }}
        >
          <div className="summary-icon orange">
            <FaClock />
          </div>

          <div>
            <span>Pending Review</span>

            <h3>
              {pendingCount}
            </h3>

            <small>
              Require attention
            </small>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          whileHover={{ y: -3 }}
        >
          <div className="summary-icon red">
            <FaExclamationTriangle />
          </div>

          <div>
            <span>Expiring Soon</span>

            <h3>
              {expiringCount}
            </h3>

            <small>
              Compliance documents
            </small>
          </div>
        </motion.div>

      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="document-tabs">

        <button
          className={
            activeTab === "resources"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("resources");
            setStatusFilter("All");
            setSearchTerm("");
          }}
        >
          <FaFileAlt />
          Network Resources
        </button>

        <button
          className={
            activeTab === "compliance"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("compliance");
            setStatusFilter("All");
            setSearchTerm("");
          }}
        >
          <FaShieldAlt />
          Franchise Compliance
        </button>

        <button
          className={
            activeTab === "activity"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("activity");
            setStatusFilter("All");
            setSearchTerm("");
          }}
        >
          <FaClock />
          Document Activity
        </button>

      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="documents-card">

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        {activeTab !== "activity" && (
          <div className="documents-toolbar">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder={
                  activeTab === "resources"
                    ? "Search documents..."
                    : "Search franchise or document..."
                }
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <div className="toolbar-actions">

              <div className="filter-box">

                <FaFilter />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="All">
                    All Status
                  </option>

                  {activeTab === "resources" ? (
                    <>
                      <option value="Published">
                        Published
                      </option>

                      <option value="Pending Review">
                        Pending Review
                      </option>

                      <option value="Archived">
                        Archived
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Valid">
                        Valid
                      </option>

                      <option value="Expiring In 30 Days">
                        Expiring In 30 Days
                      </option>

                      <option value="Expiring In 90 Days">
                        Expiring In 90 Days
                      </option>

                      <option value="Expired">
                        Expired
                      </option>

                      <option value="Missing Required">
                        Missing Required
                      </option>

                      <option value="Awaiting Review">
                        Awaiting Review
                      </option>
                    </>
                  )}

                </select>

              </div>

              {(searchTerm ||
                statusFilter !== "All") && (
                <button
                  className="clear-filter"
                  onClick={resetFilters}
                >
                  Clear
                </button>
              )}

            </div>

          </div>
        )}

        {/* ===================================================
            NETWORK RESOURCES
        =================================================== */}

        {activeTab === "resources" && (
          <div className="table-wrapper">

            {loadingResources ? (
              <div className="loading-state">

                <FaSyncAlt className="spin" />

                <p>
                  Loading network resources...
                </p>

              </div>
            ) : (
              <table>

                <thead>

                  <tr>
                    <th>Document</th>
                    <th>Category</th>
                    <th>Audience</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredResources.length > 0 ? (
                    filteredResources.map((doc) => {

                      const status = getStatusStyle(
                        doc.status
                      );

                      const name =
                        doc.name ||
                        doc.document_name ||
                        doc.title ||
                        "Untitled Document";

                      const category =
                        doc.category ||
                        "—";

                      const audience =
                        doc.audience ||
                        "—";

                      const date =
                        doc.created_at ||
                        doc.uploaded_at ||
                        doc.date;

                      return (
                        <tr key={doc.id}>

                          <td>

                            <div className="document-name">

                              <div className="file-icon">
                                <FaFileAlt />
                              </div>

                              <div>

                                <strong>
                                  {name}
                                </strong>

                                <span>
                                  {doc.id
                                    ? `DOC-${doc.id}`
                                    : "Network Resource"}
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>

                            <span className="category-badge">
                              {formatStatus(category)}
                            </span>

                          </td>

                          <td>

                            <div className="audience">

                              <FaUsers />

                              <span>
                                {formatStatus(audience)}
                              </span>

                            </div>

                          </td>

                          <td>
                            {formatDate(date)}
                          </td>

                          <td>

                            <span
                              className="status-badge"
                              style={{
                                background:
                                  status.background,
                                color:
                                  status.color,
                              }}
                            >
                              {status.icon}

                              {formatStatus(
                                doc.status
                              )}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                title="View"
                                onClick={() =>
                                  handleViewDocument(
                                    doc
                                  )
                                }
                              >
                                <FaEye />
                              </button>

                              <button
                                title="Download"
                                onClick={() =>
                                  handleDownload(
                                    doc
                                  )
                                }
                              >
                                <FaDownload />
                              </button>

                              <button
                                title="Edit"
                                onClick={() =>
                                  handleEditResource(
                                    doc
                                  )
                                }
                              >
                                <FaEdit />
                              </button>

                              <button
                                title="Delete"
                                className="delete-btn"
                                onClick={() =>
                                  handleDeleteResource(
                                    doc.id
                                  )
                                }
                              >
                                <FaTrash />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>

                      <td colSpan="6">

                        <div className="empty-state">

                          <FaFileAlt />

                          <h3>
                            No documents found
                          </h3>

                          <p>
                            There are no network resources
                            matching your search.
                          </p>

                          <button
                            onClick={() =>
                              setShowUploadModal(true)
                            }
                          >
                            <FaPlus />
                            Upload Document
                          </button>

                        </div>

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

        {/* ===================================================
            FRANCHISE COMPLIANCE
        =================================================== */}

        {activeTab === "compliance" && (
          <div className="table-wrapper">

            {loadingCompliance ? (
              <div className="loading-state">

                <FaSyncAlt className="spin" />

                <p>
                  Loading franchise compliance...
                </p>

              </div>
            ) : (
              <table>

                <thead>

                  <tr>
                    <th>Franchise</th>
                    <th>Document</th>
                    <th>Category</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredCompliance.length > 0 ? (
                    filteredCompliance.map((doc) => {

                      const status =
                        getStatusStyle(
                          doc.status
                        );

                      const franchise =
                        typeof doc.franchise ===
                        "object"
                          ? doc.franchise?.name ||
                            doc.franchise
                              ?.franchise_name ||
                            `Franchise #${doc.franchise?.id || ""}`
                          : doc.franchise ||
                            "—";

                      const documentName =
                        doc.document_name ||
                        doc.name ||
                        doc.title ||
                        "Untitled Document";

                      const category =
                        doc.category ||
                        "—";

                      const expiry =
                        doc.expiry_date ||
                        doc.expiry ||
                        doc.expires_at;

                      return (
                        <tr key={doc.id}>

                          <td>

                            <div className="franchise-name">

                              <div className="franchise-icon">
                                <FaBuilding />
                              </div>

                              <strong>
                                {franchise}
                              </strong>

                            </div>

                          </td>

                          <td>

                            <div className="compliance-document">

                              <FaFileAlt />

                              <div>

                                <strong>
                                  {documentName}
                                </strong>

                                <span>
                                  {doc.id
                                    ? `COMP-${doc.id}`
                                    : "Compliance Record"}
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>

                            <span className="category-badge">
                              {formatStatus(category)}
                            </span>

                          </td>

                          <td>
                            {formatDate(expiry)}
                          </td>

                          <td>

                            <span
                              className="status-badge"
                              style={{
                                background:
                                  status.background,
                                color:
                                  status.color,
                              }}
                            >
                              {status.icon}

                              {formatStatus(
                                doc.status
                              )}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                title="View"
                                onClick={() =>
                                  handleViewDocument(
                                    doc
                                  )
                                }
                              >
                                <FaEye />
                              </button>

                              <button
                                title="Download"
                                onClick={() =>
                                  handleDownload(
                                    doc
                                  )
                                }
                              >
                                <FaDownload />
                              </button>

                              <button
                                title="Review"
                                onClick={() =>
                                  handleViewDocument(
                                    doc
                                  )
                                }
                              >
                                <FaCheckCircle />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>

                      <td colSpan="6">

                        <div className="empty-state">

                          <FaShieldAlt />

                          <h3>
                            No compliance documents found
                          </h3>

                          <p>
                            Franchise compliance records
                            will appear here.
                          </p>

                        </div>

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

        {/* ===================================================
            DOCUMENT ACTIVITY
        =================================================== */}

        {activeTab === "activity" && (
          <div className="activity-container">

            <div className="activity-header">

              <div>
                <h3>
                  Document Activity
                </h3>

                <p>
                  Track document uploads, updates and
                  other document actions.
                </p>
              </div>

              <button
                className="refresh-small"
                onClick={fetchAuditLogs}
              >
                <FaSyncAlt
                  className={
                    loadingAudit ? "spin" : ""
                  }
                />
                Refresh
              </button>

            </div>

            {loadingAudit ? (
              <div className="loading-state">

                <FaSyncAlt className="spin" />

                <p>
                  Loading activity...
                </p>

              </div>
            ) : auditLogs.length > 0 ? (
              <div className="activity-list">

                {auditLogs.map((log, index) => {

                  const action =
                    log.action ||
                    log.activity ||
                    log.event ||
                    "Document activity";

                  const documentName =
                    log.document_name ||
                    log.document?.name ||
                    log.resource_name ||
                    log.document?.document_name ||
                    "Document";

                  const user =
                    log.user_name ||
                    log.user?.name ||
                    log.user?.email ||
                    log.performed_by ||
                    "System";

                  const date =
                    log.created_at ||
                    log.timestamp ||
                    log.date;

                  return (
                    <div
                      className="activity-item"
                      key={log.id || index}
                    >

                      <div className="activity-icon">
                        <FaFileAlt />
                      </div>

                      <div className="activity-content">

                        <strong>
                          {formatStatus(action)}
                        </strong>

                        <p>
                          {documentName}
                        </p>

                        <span>
                          By {user}
                          {date
                            ? ` • ${formatDate(date)}`
                            : ""}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="empty-state activity-empty">

                <FaClock />

                <h3>
                  No document activity yet
                </h3>

                <p>
                  Document actions will appear here
                  when they occur.
                </p>

              </div>
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      <AnimatePresence>

        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              !uploading &&
              setShowUploadModal(false)
            }
          >

            <motion.div
              className="upload-modal"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>

                  <h2>
                    Upload Document
                  </h2>

                  <p>
                    Add an official document to
                    the Wales Healthcare network.
                  </p>

                </div>

                <button
                  className="close-modal"
                  disabled={uploading}
                  onClick={() =>
                    setShowUploadModal(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form onSubmit={handleUpload}>

                {/* DOCUMENT NAME */}

                <div className="form-group">

                  <label>
                    Document Name
                  </label>

                  <input
                    type="text"
                    name="documentName"
                    placeholder="e.g. Health & Safety Policy"
                    value={formData.documentName}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                {/* CATEGORY + AUDIENCE */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Category
                    </label>

                    <div className="select-wrapper">

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >

                        <option value="Policies">
                          Policies
                        </option>

                        <option value="Manuals">
                          Manuals
                        </option>

                        <option value="Training Material">
                          Training Material
                        </option>

                        <option value="Forms">
                          Forms
                        </option>

                        <option value="Marketing Assets">
                          Marketing Assets
                        </option>

                        <option value="Legal/Compliance">
                          Legal/Compliance
                        </option>

                      </select>

                      <FaChevronDown />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Audience
                    </label>

                    <div className="select-wrapper">

                      <select
                        name="audience"
                        value={formData.audience}
                        onChange={handleInputChange}
                      >

                        <option value="All Franchises">
                          All Franchises
                        </option>

                        <option value="Franchise Owners Only">
                          Franchise Owners Only
                        </option>

                        <option value="Selected Franchises">
                          Selected Franchises
                        </option>

                        <option value="Head Office Staff">
                          Head Office Staff
                        </option>

                      </select>

                      <FaChevronDown />

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Description
                    <span className="optional">
                      Optional — not yet saved by the backend
                    </span>
                  </label>

                  <textarea
                    name="description"
                    placeholder="Briefly describe this document..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />

                </div>

                {/* FILE */}

                <div className="form-group">

                  <label>
                    Document File
                  </label>

                  <label className="upload-area">

                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileChange}
                    />

                    <FaCloudUploadAlt />

                    {formData.file ? (
                      <>
                        <strong>
                          {formData.file.name}
                        </strong>

                        <span>
                          Click to replace file
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          Click to upload a file
                        </strong>

                        <span>
                          PDF, PNG, JPG, DOC or DOCX
                          up to 25MB
                        </span>
                      </>
                    )}

                  </label>

                </div>

                {/* FOOTER */}

                <div className="modal-footer">

                  <button
                    type="button"
                    className="cancel-btn"
                    disabled={uploading}
                    onClick={() =>
                      setShowUploadModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={uploading}
                  >

                    {uploading ? (
                      <>
                        <FaSyncAlt className="spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload & Publish
                      </>
                    )}

                  </button>

                </div>

              </form>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      <AnimatePresence>

        {showViewModal &&
          selectedDocument && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setShowViewModal(false)
              }
            >

              <motion.div
                className="view-modal"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="modal-header">

                  <div>

                    <h2>
                      {selectedDocument.name ||
                        selectedDocument.document_name ||
                        selectedDocument.title ||
                        "Document Details"}
                    </h2>

                    <p>
                      Document information
                    </p>

                  </div>

                  <button
                    className="close-modal"
                    onClick={() =>
                      setShowViewModal(false)
                    }
                  >
                    <FaTimes />
                  </button>

                </div>

                <div className="view-content">

                  <div className="detail-row">

                    <span>
                      Document ID
                    </span>

                    <strong>
                      {selectedDocument.id || "—"}
                    </strong>

                  </div>

                  <div className="detail-row">

                    <span>
                      Category
                    </span>

                    <strong>
                      {formatStatus(
                        selectedDocument.category
                      )}
                    </strong>

                  </div>

                  <div className="detail-row">

                    <span>
                      Status
                    </span>

                    <strong>
                      {formatStatus(
                        selectedDocument.status
                      )}
                    </strong>

                  </div>

                  {selectedDocument.audience && (
                    <div className="detail-row">

                      <span>
                        Audience
                      </span>

                      <strong>
                        {formatStatus(
                          selectedDocument.audience
                        )}
                      </strong>

                    </div>
                  )}

                  {selectedDocument.description && (
                    <div className="description-box">

                      <span>
                        Description
                      </span>

                      <p>
                        {selectedDocument.description}
                      </p>

                    </div>
                  )}

                  <div className="view-actions">

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        setShowViewModal(false)
                      }
                    >
                      Close
                    </button>

                    <button
                      className="submit-btn"
                      onClick={() =>
                        handleDownload(
                          selectedDocument
                        )
                      }
                    >
                      <FaDownload />
                      Download
                    </button>

                  </div>

                </div>

              </motion.div>

            </motion.div>
          )}

      </AnimatePresence>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .documents-page {
          width: 100%;
          min-height: 100%;
          padding: 28px;
          background: #f8fafc;
          color: #0f172a;
        }

        /* HEADER */

        .documents-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .page-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .page-breadcrumb strong {
          color: #475569;
        }

        .documents-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .documents-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-btn {
          width: 42px;
          height: 42px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .refresh-btn:hover {
          color: ${BRAND_COLOR};
          border-color: #99f6e4;
          background: #f0fdfa;
        }

        .upload-main-btn {
          border: none;
          background: ${BRAND_COLOR};
          color: white;
          padding: 12px 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s ease;
          box-shadow: 0 5px 14px rgba(13, 148, 136, 0.18);
        }

        .upload-main-btn:hover {
          transform: translateY(-1px);
          background: #0f766e;
        }

        /* ERROR */

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 9px;
          padding: 11px 13px;
          margin-bottom: 18px;
          font-size: 13px;
        }

        .error-banner svg:first-child {
          flex-shrink: 0;
        }

        .error-banner span {
          flex: 1;
        }

        .error-banner button {
          border: none;
          background: transparent;
          color: #b91c1c;
          cursor: pointer;
        }

        /* SUMMARY */

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: 0.2s ease;
        }

        .summary-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .summary-icon.teal {
          background: #ccfbf1;
          color: #0f766e;
        }

        .summary-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .summary-icon.orange {
          background: #ffedd5;
          color: #ea580c;
        }

        .summary-icon.red {
          background: #fee2e2;
          color: #dc2626;
        }

        .summary-card span {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 3px;
        }

        .summary-card h3 {
          margin: 0;
          font-size: 22px;
        }

        .summary-card small {
          display: block;
          color: #94a3b8;
          margin-top: 3px;
          font-size: 11px;
        }

        /* TABS */

        .document-tabs {
          background: white;
          border: 1px solid #e2e8f0;
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          display: flex;
          gap: 4px;
          padding: 8px 12px 0;
          overflow-x: auto;
        }

        .document-tabs button {
          border: none;
          background: transparent;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .document-tabs button.active {
          color: ${BRAND_COLOR};
          border-bottom-color: ${BRAND_COLOR};
        }

        /* MAIN CARD */

        .documents-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        /* TOOLBAR */

        .documents-toolbar {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .search-box {
          width: 340px;
          position: relative;
        }

        .search-box svg {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          height: 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0 14px 0 38px;
          outline: none;
          font-size: 13px;
          color: #0f172a;
        }

        .search-box input:focus {
          border-color: ${BRAND_COLOR};
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.08);
        }

        .toolbar-actions {
          display: flex;
          gap: 10px;
        }

        .filter-box {
          height: 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          gap: 7px;
          color: #64748b;
        }

        .filter-box select {
          border: none;
          outline: none;
          background: transparent;
          color: #475569;
          font-size: 13px;
          cursor: pointer;
        }

        .clear-filter {
          border: none;
          background: #f1f5f9;
          color: #475569;
          padding: 0 13px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        /* TABLE */

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        th {
          background: #f8fafc;
          color: #64748b;
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          font-weight: 700;
          padding: 13px 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        td {
          padding: 15px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          color: #475569;
          vertical-align: middle;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        .document-name {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .file-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #f0fdfa;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .document-name strong,
        .compliance-document strong {
          display: block;
          color: #1e293b;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .document-name span,
        .compliance-document span {
          color: #94a3b8;
          font-size: 10px;
        }

        .category-badge {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .audience {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 12px;
        }

        .audience svg {
          color: #94a3b8;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 650;
          white-space: nowrap;
        }

        .status-badge svg {
          font-size: 10px;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .action-buttons button {
          width: 31px;
          height: 31px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 7px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .action-buttons button:hover {
          border-color: ${BRAND_COLOR};
          color: ${BRAND_COLOR};
          background: #f0fdfa;
        }

        .action-buttons .delete-btn:hover {
          border-color: #fecaca;
          color: #dc2626;
          background: #fef2f2;
        }

        .franchise-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .franchise-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .franchise-name strong {
          color: #1e293b;
          font-size: 13px;
        }

        .compliance-document {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .compliance-document > svg {
          color: ${BRAND_COLOR};
          font-size: 17px;
        }

        /* LOADING */

        .loading-state {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          gap: 10px;
        }

        .loading-state p {
          margin: 0;
          font-size: 13px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* EMPTY */

        .empty-state {
          padding: 55px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .empty-state > svg {
          font-size: 30px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          color: #475569;
          margin: 0 0 5px;
          font-size: 15px;
        }

        .empty-state p {
          margin: 0 0 15px;
          font-size: 12px;
        }

        .empty-state button {
          border: none;
          background: ${BRAND_COLOR};
          color: white;
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
        }

        /* ACTIVITY */

        .activity-container {
          padding: 20px;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .activity-header h3 {
          margin: 0;
          font-size: 16px;
          color: #1e293b;
        }

        .activity-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .refresh-small {
          height: 36px;
          padding: 0 12px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 7px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .activity-list {
          padding-top: 8px;
        }

        .activity-item {
          display: flex;
          gap: 13px;
          padding: 15px 5px;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f0fdfa;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content strong {
          color: #334155;
          font-size: 13px;
          display: block;
        }

        .activity-content p {
          margin: 3px 0;
          color: #475569;
          font-size: 12px;
        }

        .activity-content span {
          color: #94a3b8;
          font-size: 11px;
        }

        .activity-empty {
          padding-top: 70px;
        }

        /* MODALS */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
        }

        .upload-modal,
        .view-modal {
          width: 100%;
          max-width: 590px;
          max-height: 92vh;
          overflow-y: auto;
          background: white;
          border-radius: 14px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
        }

        .view-modal {
          max-width: 520px;
        }

        .modal-header {
          padding: 21px 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 19px;
          color: #0f172a;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .close-modal {
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          border-radius: 7px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-modal:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .upload-modal form {
          padding: 22px;
        }

        .form-group {
          margin-bottom: 17px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          color: #334155;
          font-weight: 650;
          margin-bottom: 7px;
        }

        .optional {
          color: #94a3b8;
          font-weight: 400;
          margin-left: 5px;
        }

        .form-group input[type="text"],
        .form-group textarea,
        .select-wrapper select {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          padding: 11px 12px;
          font-size: 13px;
          color: #0f172a;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 85px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .select-wrapper select:focus {
          border-color: ${BRAND_COLOR};
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.08);
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          appearance: none;
          padding-right: 35px;
          cursor: pointer;
        }

        .select-wrapper svg {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 10px;
          color: #64748b;
        }

        .upload-area {
          min-height: 125px;
          border: 1.5px dashed #99f6e4;
          background: #f0fdfa;
          border-radius: 10px;
          display: flex !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          cursor: pointer;
          padding: 20px;
          transition: 0.2s ease;
        }

        .upload-area:hover {
          background: #ccfbf1;
          border-color: ${BRAND_COLOR};
        }

        .upload-area input {
          display: none;
        }

        .upload-area > svg {
          font-size: 27px;
          color: ${BRAND_COLOR};
          margin-bottom: 9px;
        }

        .upload-area strong {
          font-size: 13px;
          color: #334155;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .upload-area span {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 11px;
        }

        .modal-footer,
        .view-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          padding-top: 4px;
        }

        .cancel-btn,
        .submit-btn {
          height: 40px;
          padding: 0 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 650;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cancel-btn {
          background: #f1f5f9;
          color: #475569;
        }

        .submit-btn {
          background: ${BRAND_COLOR};
          color: white;
        }

        .submit-btn:hover {
          background: #0f766e;
        }

        .submit-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* VIEW */

        .view-content {
          padding: 22px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 13px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-row span {
          color: #64748b;
          font-size: 12px;
        }

        .detail-row strong {
          color: #1e293b;
          font-size: 13px;
          text-align: right;
        }

        .description-box {
          margin-top: 17px;
          padding: 13px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .description-box span {
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .description-box p {
          margin: 7px 0 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }

        .view-actions {
          margin-top: 22px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 760px) {

          .documents-page {
            padding: 18px 14px;
          }

          .documents-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .documents-header h1 {
            font-size: 23px;
          }

          .header-actions {
            width: 100%;
          }

          .refresh-btn {
            width: 42px;
          }

          .upload-main-btn {
            flex: 1;
            justify-content: center;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .document-tabs {
            overflow-x: auto;
          }

          .document-tabs button {
            white-space: nowrap;
          }

          .documents-toolbar {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .toolbar-actions {
            width: 100%;
          }

          .filter-box {
            flex: 1;
          }

          .filter-box select {
            width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .upload-modal,
          .view-modal {
            max-height: 95vh;
          }

          .activity-header {
            align-items: flex-start;
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}