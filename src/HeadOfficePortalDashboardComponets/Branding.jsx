import React, { useEffect, useMemo, useState } from "react";
import {
  FaPalette,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
  FaImage,
  FaFileAlt,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaEye,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const initialForm = {
  title: "",
  category: "Brand Management",
  asset_type: "Logo & Graphics",
  control_state: "Head Office Controlled",
  description: "",
  file: null,
};

const ASSET_TYPES = [
  "Logo & Graphics",
  "Tokens",
  "Templates",
  "Communication",
  "Other",
];

const CONTROL_STATES = [
  "Head Office Controlled",
  "Franchise Editable",
  "Read Only",
];

export default function Branding() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [form, setForm] = useState(initialForm);

  // =========================================================
  // FETCH BRANDING
  // =========================================================

  const fetchBranding = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/branding/");

      const data = response.data;

      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setAssets(results);
    } catch (err) {
      console.error("Failed to fetch branding:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load branding assets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  // =========================================================
  // CLEAR MESSAGES
  // =========================================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [success]);

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const openCreateModal = () => {
    setEditingAsset(null);
    setForm(initialForm);
    setError("");
    setShowModal(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (asset) => {
    setEditingAsset(asset);

    setForm({
      title: asset.title || "",
      category: asset.category || "Brand Management",
      asset_type: asset.asset_type || "Logo & Graphics",
      control_state:
        asset.control_state || "Head Office Controlled",
      description: asset.description || "",
      file: null,
    });

    setError("");
    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingAsset(null);
    setForm(initialForm);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("asset_type", form.asset_type);
      formData.append("control_state", form.control_state);
      formData.append("description", form.description);

      if (form.file) {
        formData.append("file", form.file);
      }

      if (editingAsset) {
        await api.patch(
          `/admin/branding/${editingAsset.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSuccess("Branding asset updated successfully.");
      } else {
        if (!form.file) {
          setError("Please select a file.");
          setSaving(false);
          return;
        }

        await api.post("/admin/branding/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Branding asset uploaded successfully.");
      }

      closeModal();
      await fetchBranding();
    } catch (err) {
      console.error("Branding save error:", err);

      const backendError = err?.response?.data;

      if (backendError && typeof backendError === "object") {
        const firstError = Object.values(backendError)
          .flat()
          .filter(Boolean)[0];

        setError(
          firstError ||
            backendError.detail ||
            "Failed to save branding asset."
        );
      } else {
        setError("Failed to save branding asset.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (asset) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${asset.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/admin/branding/${asset.id}/`);

      setSuccess("Branding asset deleted successfully.");

      setAssets((prev) =>
        prev.filter((item) => item.id !== asset.id)
      );

      if (selectedAsset?.id === asset.id) {
        setSelectedAsset(null);
      }
    } catch (err) {
      console.error("Delete branding error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to delete branding asset."
      );
    }
  };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredAssets = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return assets.filter((asset) => {
      const matchesSearch =
        !searchValue ||
        asset.title?.toLowerCase().includes(searchValue) ||
        asset.description?.toLowerCase().includes(searchValue) ||
        asset.asset_type?.toLowerCase().includes(searchValue) ||
        asset.category?.toLowerCase().includes(searchValue);

      const matchesType =
        filterType === "All" ||
        asset.asset_type === filterType;

      return matchesSearch && matchesType;
    });
  }, [assets, search, filterType]);

  // =========================================================
  // HELPERS
  // =========================================================

  const getFileUrl = (asset) => {
    return asset?.file_url || "";
  };

  const isImage = (asset) => {
    const fileName = (
      asset?.file_name ||
      asset?.file_url ||
      ""
    ).toLowerCase();

    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
  };

  const getControlClass = (state) => {
    if (state === "Head Office Controlled") {
      return "controlled";
    }

    if (state === "Franchise Editable") {
      return "editable";
    }

    return "readonly";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="branding-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">
        <div>
          <div className="title-row">
            <div className="title-icon">
              <FaPalette />
            </div>

            <div>
              <h1>Branding</h1>
              <p>
                Manage the official Wales Healthcare brand assets
                and network-wide visual identity.
              </p>
            </div>
          </div>
        </div>

        <button
          className="add-button"
          onClick={openCreateModal}
        >
          <FaPlus />
          Add Branding Asset
        </button>
      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      <AnimatePresence>
        {success && (
          <motion.div
            className="alert success-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FaCheckCircle />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="alert error-alert">
          <FaExclamationCircle />
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="alert-close"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <FaPalette />
          </div>

          <div>
            <span>Total Assets</span>
            <strong>{assets.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaImage />
          </div>

          <div>
            <span>Graphics</span>
            <strong>
              {
                assets.filter(
                  (asset) =>
                    asset.asset_type === "Logo & Graphics"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>

          <div>
            <span>Templates</span>
            <strong>
              {
                assets.filter(
                  (asset) =>
                    asset.asset_type === "Templates"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>Controlled</span>
            <strong>
              {
                assets.filter(
                  (asset) =>
                    asset.control_state ===
                    "Head Office Controlled"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="filter-card">

        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search branding assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Asset Types</option>

          {ASSET_TYPES.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {loading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading branding assets...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaPalette />
          </div>

          <h3>No branding assets found</h3>

          <p>
            {search || filterType !== "All"
              ? "Try changing your search or filter."
              : "Add your first branding asset to get started."}
          </p>

          {!search && filterType === "All" && (
            <button
              className="add-button"
              onClick={openCreateModal}
            >
              <FaPlus />
              Add Branding Asset
            </button>
          )}
        </div>
      ) : (
        <div className="asset-grid">

          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              className="asset-card"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              {/* Preview */}

              <div className="asset-preview">

                {isImage(asset) && getFileUrl(asset) ? (
                  <img
                    src={getFileUrl(asset)}
                    alt={asset.title}
                  />
                ) : (
                  <div className="file-preview">
                    <FaFileAlt />
                  </div>
                )}

                <button
                  className="preview-button"
                  onClick={() =>
                    setSelectedAsset(asset)
                  }
                  title="View asset"
                >
                  <FaEye />
                </button>

              </div>

              {/* Body */}

              <div className="asset-body">

                <div className="asset-heading">

                  <div>
                    <h3>{asset.title}</h3>

                    <span className="asset-type">
                      {asset.asset_type ||
                        "Other"}
                    </span>
                  </div>

                </div>

                {asset.description && (
                  <p className="asset-description">
                    {asset.description}
                  </p>
                )}

                <div className="asset-meta">

                  <span
                    className={`control-badge ${getControlClass(
                      asset.control_state
                    )}`}
                  >
                    {asset.control_state ||
                      "Read Only"}
                  </span>

                </div>

                <div className="asset-footer">

                  <span className="file-name">
                    {asset.file_name ||
                      "Branding asset"}
                  </span>

                  <div className="action-buttons">

                    {getFileUrl(asset) && (
                      <a
                        href={getFileUrl(asset)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-button view"
                        title="Open asset"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}

                    <button
                      className="icon-button edit"
                      onClick={() =>
                        openEditModal(asset)
                      }
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-button delete"
                      onClick={() =>
                        handleDelete(asset)
                      }
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              </div>

            </motion.div>
          ))}

        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >

            <motion.div
              className="modal"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
            >

              <div className="modal-header">

                <div>
                  <h2>
                    {editingAsset
                      ? "Edit Branding Asset"
                      : "Add Branding Asset"}
                  </h2>

                  <p>
                    {editingAsset
                      ? "Update the branding asset details."
                      : "Upload an official Wales Healthcare brand asset."}
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  <FaTimes />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="branding-form"
              >

                {/* Title */}

                <div className="form-group">
                  <label>
                    Asset Title
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Wales Healthcare Main Logo"
                    required
                  />
                </div>

                {/* Category */}

                <div className="form-group">
                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Brand Management"
                  />
                </div>

                {/* Type */}

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      Asset Type
                    </label>

                    <select
                      name="asset_type"
                      value={form.asset_type}
                      onChange={handleChange}
                    >
                      {ASSET_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      Control State
                    </label>

                    <select
                      name="control_state"
                      value={form.control_state}
                      onChange={handleChange}
                    >
                      {CONTROL_STATES.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>

                {/* Description */}

                <div className="form-group">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this branding asset..."
                    rows="4"
                  />
                </div>

                {/* File */}

                <div className="form-group">
                  <label>
                    {editingAsset
                      ? "Replace File"
                      : "Upload File"}

                    {!editingAsset && (
                      <span>*</span>
                    )}
                  </label>

                  <label className="upload-box">

                    <input
                      type="file"
                      onChange={handleFileChange}
                    />

                    <FaUpload />

                    <strong>
                      {form.file
                        ? form.file.name
                        : "Choose a file"}
                    </strong>

                    <small>
                      Select the branding file to
                      upload
                    </small>

                  </label>

                  {editingAsset &&
                    editingAsset.file_name && (
                      <small className="current-file">
                        Current file:{" "}
                        {editingAsset.file_name}
                      </small>
                    )}

                </div>

                {/* Actions */}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={saving}
                  >

                    {saving ? (
                      <>
                        <FaSpinner className="spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        {editingAsset
                          ? "Update Asset"
                          : "Upload Asset"}
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
          VIEW ASSET MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedAsset(null);
              }
            }}
          >

            <motion.div
              className="preview-modal"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
            >

              <div className="modal-header">

                <div>
                  <h2>
                    {selectedAsset.title}
                  </h2>

                  <p>
                    {selectedAsset.asset_type}
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setSelectedAsset(null)
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <div className="large-preview">

                {isImage(selectedAsset) &&
                getFileUrl(selectedAsset) ? (
                  <img
                    src={getFileUrl(selectedAsset)}
                    alt={selectedAsset.title}
                  />
                ) : (
                  <div className="large-file-icon">
                    <FaFileAlt />
                    <p>
                      {selectedAsset.file_name ||
                        "File preview unavailable"}
                    </p>
                  </div>
                )}

              </div>

              {selectedAsset.description && (
                <p className="preview-description">
                  {selectedAsset.description}
                </p>
              )}

              {getFileUrl(selectedAsset) && (
                <a
                  href={getFileUrl(selectedAsset)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-file-button"
                >
                  <FaExternalLinkAlt />
                  Open File
                </a>
              )}

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

        .branding-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background: #f8fafc;
          color: #0f172a;
        }

        /* HEADER */

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: ${BRAND_COLOR}15;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .page-header h1 {
          margin: 0 0 5px;
          font-size: 27px;
          font-weight: 800;
          color: #0f172a;
        }

        .page-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .add-button {
          border: none;
          background: ${BRAND_COLOR};
          color: white;
          padding: 12px 18px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .add-button:hover {
          transform: translateY(-1px);
          filter: brightness(0.95);
        }

        /* ALERTS */

        .alert {
          padding: 13px 15px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .success-alert {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .error-alert {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .alert-close {
          margin-left: auto;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        /* STATS */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: ${BRAND_COLOR}12;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .stat-card strong {
          font-size: 22px;
          color: #0f172a;
        }

        /* FILTER */

        .filter-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-box {
          flex: 1;
          height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          background: transparent;
        }

        .filter-card select {
          min-width: 190px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          padding: 0 12px;
          outline: none;
          background: white;
          color: #334155;
        }

        /* GRID */

        .asset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .asset-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          overflow: hidden;
        }

        .asset-preview {
          height: 190px;
          background: #f1f5f9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .asset-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }

        .file-preview {
          width: 65px;
          height: 65px;
          border-radius: 15px;
          background: white;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.08);
        }

        .preview-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: none;
          background: rgba(255,255,255,0.95);
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .asset-body {
          padding: 17px;
        }

        .asset-heading {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .asset-heading h3 {
          margin: 0 0 5px;
          font-size: 16px;
          color: #0f172a;
        }

        .asset-type {
          color: #64748b;
          font-size: 12px;
        }

        .asset-description {
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
          margin: 12px 0;
        }

        .asset-meta {
          margin-top: 12px;
        }

        .control-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }

        .controlled {
          color: #047857;
          background: #ecfdf5;
        }

        .editable {
          color: #0369a1;
          background: #eff6ff;
        }

        .readonly {
          color: #475569;
          background: #f1f5f9;
        }

        .asset-footer {
          margin-top: 15px;
          padding-top: 13px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .file-name {
          color: #94a3b8;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 45%;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .icon-button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
        }

        .icon-button.view {
          background: #f1f5f9;
          color: #475569;
        }

        .icon-button.edit {
          background: #ecfeff;
          color: #0f766e;
        }

        .icon-button.delete {
          background: #fef2f2;
          color: #dc2626;
        }

        /* LOADING / EMPTY */

        .loading-state,
        .empty-state {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .loading-state p,
        .empty-state p {
          color: #64748b;
          font-size: 14px;
        }

        .spinner {
          animation: spin 0.9s linear infinite;
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: ${BRAND_COLOR}12;
          color: ${BRAND_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .modal,
        .preview-modal {
          width: 100%;
          max-width: 620px;
          background: white;
          border-radius: 17px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
          overflow: hidden;
        }

        .preview-modal {
          max-width: 800px;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .modal-header h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }

        .modal-header p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        .close-button {
          width: 35px;
          height: 35px;
          border: none;
          background: #f1f5f9;
          color: #475569;
          border-radius: 9px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .branding-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 17px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 7px;
        }

        .form-group label > span {
          color: #dc2626;
          margin-left: 3px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 11px 12px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: ${BRAND_COLOR};
          box-shadow: 0 0 0 3px ${BRAND_COLOR}12;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .upload-box {
          min-height: 125px;
          border: 2px dashed #cbd5e1;
          border-radius: 11px;
          display: flex !important;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 7px;
          color: ${BRAND_COLOR};
          cursor: pointer;
          padding: 18px;
        }

        .upload-box input {
          display: none;
        }

        .upload-box strong {
          color: #334155;
          font-size: 13px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .upload-box small {
          color: #94a3b8;
          font-size: 11px;
        }

        .current-file {
          display: block;
          color: #64748b;
          font-size: 11px;
          margin-top: 7px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
        }

        .cancel-button,
        .submit-button {
          border: none;
          border-radius: 9px;
          padding: 11px 17px;
          cursor: pointer;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cancel-button {
          background: #f1f5f9;
          color: #475569;
        }

        .submit-button {
          background: ${BRAND_COLOR};
          color: white;
        }

        .cancel-button:disabled,
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* PREVIEW */

        .large-preview {
          min-height: 350px;
          max-height: 550px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
        }

        .large-preview img {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
        }

        .large-file-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: ${BRAND_COLOR};
          font-size: 50px;
          text-align: center;
        }

        .large-file-icon p {
          font-size: 13px;
          color: #64748b;
        }

        .preview-description {
          padding: 0 20px;
          color: #64748b;
          line-height: 1.6;
          font-size: 14px;
        }

        .open-file-button {
          margin: 0 20px 20px;
          background: ${BRAND_COLOR};
          color: white;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .asset-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .branding-page {
            padding: 15px;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-button {
            width: 100%;
          }

          .filter-card {
            flex-direction: column;
          }

          .filter-card select {
            width: 100%;
            height: 44px;
          }

          .asset-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 450px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-header h1 {
            font-size: 22px;
          }

          .title-icon {
            width: 43px;
            height: 43px;
          }

          .modal-overlay {
            padding: 10px;
          }

          .modal-header,
          .branding-form {
            padding: 16px;
          }
        }

      `}</style>

    </div>
  );
}