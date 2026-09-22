import React, { useEffect, useMemo, useState } from "react";
import {
  FaConciergeBell,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaSitemap,
  FaHourglassHalf,
  FaBan,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Adjust this path if this file lives somewhere other than
// two folders below your api/axios.js.
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// =========================================================
// API CALLS
//
// All requests go through the shared `api` axios instance,
// so the access-token header and the 401 refresh-and-retry
// flow are already handled for us.
// =========================================================

function getErrorMessage(err) {
  const data = err?.response?.data;

  if (!data) return err.message || "Something went wrong.";

  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.error) return data.error;

  // DRF validation errors come back as { field: ["msg"] }
  const firstKey = Object.keys(data)[0];
  if (firstKey && Array.isArray(data[firstKey])) {
    return `${firstKey}: ${data[firstKey][0]}`;
  }

  return "Something went wrong.";
}

const fetchServices = () => api.get("/admin/services/").then((res) => res.data);
const fetchFranchises = () => api.get("/admin/franchises/").then((res) => res.data);

const createService = (payload) =>
  api.post("/admin/services/", payload).then((res) => res.data);

const updateService = (id, payload) =>
  api.patch(`/admin/services/${id}/`, payload).then((res) => res.data);

const deleteServiceRequest = (id) => api.delete(`/admin/services/${id}/`);

const assignServiceRequest = (id, franchiseId) =>
  api
    .post(`/admin/services/${id}/assign/`, { franchise: franchiseId })
    .then((res) => res.data);

const approveServiceRequest = (id, statusValue) =>
  api
    .post(`/admin/services/${id}/approve/`, { status: statusValue })
    .then((res) => res.data);

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-teal-50 text-teal-700 border-teal-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const icons = {
    Pending: <FaHourglassHalf className="text-[10px]" />,
    Approved: <FaCheck className="text-[10px]" />,
    Rejected: <FaBan className="text-[10px]" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {icons[status]} {status}
    </span>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingService, setEditingService] = useState(null); // null = creating new
  const [formData, setFormData] = useState({ name: "", description: "", franchise: "" });
  const [formError, setFormError] = useState(null);
  const [formSaving, setFormSaving] = useState(false);

  const [assigningService, setAssigningService] = useState(null);
  const [assignFranchiseId, setAssignFranchiseId] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const [rowActionId, setRowActionId] = useState(null);

  // -----------------------------------------------------
  // LOAD DATA
  // -----------------------------------------------------

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [servicesData, franchisesData] = await Promise.all([
        fetchServices(),
        fetchFranchises(),
      ]);

      setServices(servicesData || []);
      setFranchises(franchisesData || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------
  // DERIVED DATA
  // -----------------------------------------------------

  const stats = useMemo(() => {
    const total = services.length;
    const pending = services.filter((s) => s.status === "Pending").length;
    const approved = services.filter((s) => s.status === "Approved").length;
    const assignedFranchiseIds = new Set(
      services.filter((s) => s.franchise).map((s) => s.franchise)
    );

    return { total, pending, approved, franchiseCoverage: assignedFranchiseIds.size };
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesStatus = statusFilter === "All" || srv.status === statusFilter;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        srv.name?.toLowerCase().includes(term) ||
        srv.description?.toLowerCase().includes(term) ||
        srv.franchise_name?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [services, statusFilter, searchTerm]);

  // -----------------------------------------------------
  // CREATE / EDIT MODAL
  // -----------------------------------------------------

  function openCreateModal() {
    setEditingService(null);
    setFormData({ name: "", description: "", franchise: "" });
    setFormError(null);
    setShowFormModal(true);
  }

  function openEditModal(service) {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      franchise: service.franchise || "",
    });
    setFormError(null);
    setShowFormModal(true);
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Service name is required.");
      return;
    }

    setFormSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (formData.franchise) {
        payload.franchise = formData.franchise;
      }

      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }

      setShowFormModal(false);
      await loadAll();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormSaving(false);
    }
  }

  // -----------------------------------------------------
  // ASSIGN MODAL
  // -----------------------------------------------------

  function openAssignModal(service) {
    setAssigningService(service);
    setAssignFranchiseId(service.franchise || "");
    setAssignError(null);
  }

  async function handleAssignSubmit(e) {
    e.preventDefault();
    setAssignError(null);
    setAssignSaving(true);

    try {
      await assignServiceRequest(
        assigningService.id,
        assignFranchiseId || null
      );

      setAssigningService(null);
      await loadAll();
    } catch (err) {
      setAssignError(getErrorMessage(err));
    } finally {
      setAssignSaving(false);
    }
  }

  // -----------------------------------------------------
  // APPROVE / REJECT / DELETE
  // -----------------------------------------------------

  async function handleApprove(service, statusValue) {
    setRowActionId(service.id);

    try {
      await approveServiceRequest(service.id, statusValue);
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRowActionId(null);
    }
  }

  async function handleDelete(service) {
    const confirmed = window.confirm(
      `Delete "${service.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setRowActionId(service.id);

    try {
      await deleteServiceRequest(service.id);
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRowActionId(null);
    }
  }

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Service Catalogue Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Create services, assign them to a franchise, and approve or reject them
            before they go live.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition active:scale-95"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          <FaPlus className="text-[11px]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Services</p>
          <h4 className="text-2xl font-black text-slate-900 mt-2">{stats.total}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approval</p>
          <h4 className="text-2xl font-black text-amber-600 mt-2">{stats.pending}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved</p>
          <h4 className="text-2xl font-black text-teal-700 mt-2">{stats.approved}</h4>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Franchises Covered</p>
          <h4 className="text-2xl font-black text-slate-900 mt-2">{stats.franchiseCoverage}</h4>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or franchise..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((option) => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition ${
                statusFilter === option
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="shrink-0" /> {error}
        </div>
      )}

      {/* LIST */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaConciergeBell style={{ color: BRAND_COLOR }} /> Services
          </h4>
          <span className="text-[10px] text-slate-400 font-medium">
            {filteredServices.length} of {services.length} shown
          </span>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <FaSpinner className="animate-spin text-lg" />
            <p className="text-xs font-semibold">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <FaConciergeBell className="text-2xl" />
            <p className="text-xs font-semibold">No services match this view.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="space-y-1.5 md:max-w-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      #{srv.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                    <StatusBadge status={srv.status} />
                  </div>

                  {srv.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  )}

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <FaBuilding className="text-[10px] text-slate-400" />
                    {srv.franchise_name ? srv.franchise_name : "Unassigned"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {srv.status === "Pending" && (
                    <>
                      <button
                        disabled={rowActionId === srv.id}
                        onClick={() => handleApprove(srv, "Approved")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 text-white text-[11px] font-bold hover:bg-teal-700 transition disabled:opacity-50"
                      >
                        <FaCheck className="text-[10px]" /> Approve
                      </button>
                      <button
                        disabled={rowActionId === srv.id}
                        onClick={() => handleApprove(srv, "Rejected")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 transition disabled:opacity-50"
                      >
                        <FaTimes className="text-[10px]" /> Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => openAssignModal(srv)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50 transition"
                  >
                    <FaSitemap className="text-[10px]" /> Assign
                  </button>

                  <button
                    onClick={() => openEditModal(srv)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition"
                  >
                    <FaEdit className="text-[10px]" /> Edit
                  </button>

                  <button
                    disabled={rowActionId === srv.id}
                    onClick={() => handleDelete(srv)}
                    className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition disabled:opacity-50"
                    title="Delete service"
                  >
                    <FaTrash className="text-[11px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CREATE / EDIT SERVICE MODAL ================= */}
      <AnimatePresence>
        {showFormModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !formSaving && setShowFormModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h4>
                <button
                  onClick={() => !formSaving && setShowFormModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Personal Care Support"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assign to Franchise (optional)
                  </label>
                  <select
                    value={formData.franchise}
                    onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 font-semibold"
                  >
                    <option value="">Unassigned</option>
                    {franchises.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    A service still needs to be approved before a franchise can see it.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={formSaving}
                    onClick={() => setShowFormModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSaving}
                    className="rounded-xl px-4 py-2 font-bold text-white transition disabled:opacity-50 flex items-center gap-2"
                    style={{ backgroundColor: BRAND_COLOR }}
                  >
                    {formSaving && <FaSpinner className="animate-spin text-[11px]" />}
                    {editingService ? "Save Changes" : "Create Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= ASSIGN TO FRANCHISE MODAL ================= */}
      <AnimatePresence>
        {assigningService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !assignSaving && setAssigningService(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Assign Service</h4>
                  <p className="text-[11px] text-teal-700 font-medium">{assigningService.name}</p>
                </div>
                <button
                  onClick={() => !assignSaving && setAssigningService(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
                {assignError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-semibold">
                    {assignError}
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Franchise</label>
                  <select
                    value={assignFranchiseId}
                    onChange={(e) => setAssignFranchiseId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 font-semibold"
                  >
                    <option value="">Unassign (Head Office level)</option>
                    {franchises.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={assignSaving}
                    onClick={() => setAssigningService(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assignSaving}
                    className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {assignSaving && <FaSpinner className="animate-spin text-[11px]" />}
                    Save Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}