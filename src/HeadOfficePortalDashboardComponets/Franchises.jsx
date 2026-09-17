import React, { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaArrowLeft,
  FaSpinner,
  FaBan,
  FaEdit,
  FaTrash,
  FaTrashAlt,
  FaSave,
  FaChevronDown,
} from "react-icons/fa";

import api from "../api/axios";

const emptyForm = {
  name: "",
  location: "",
  description: "",
  is_active: true,
};

const Franchises = () => {
  const [franchises, setFranchises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [selectedFranchise, setSelectedFranchise] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [editForm, setEditForm] =
    useState(emptyForm);

  // --------------------------------------------------
  // CURRENT USER
  // --------------------------------------------------

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const isSuperAdmin =
    storedUser?.role === "super_admin" ||
    storedUser?.is_superuser === true;

  // --------------------------------------------------
  // FETCH FRANCHISES
  // --------------------------------------------------

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/franchises/"
      );

      setFranchises(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching franchises:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to load franchises."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  // --------------------------------------------------
  // CLEAR MESSAGES
  // --------------------------------------------------

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // --------------------------------------------------
  // CREATE FORM
  // --------------------------------------------------

  const handleFormChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // EDIT FORM
  // --------------------------------------------------

  const handleEditFormChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // CREATE FRANCHISE
  // --------------------------------------------------

  const handleCreateFranchise = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/admin/franchises/",
        form
      );

      const createdFranchise =
        response.data?.franchise ||
        response.data;

      setFranchises((prev) => [
        createdFranchise,
        ...prev,
      ]);

      setSuccess(
        response.data?.message ||
          "Franchise created successfully."
      );

      setForm(emptyForm);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(
        "Error creating franchise:",
        err
      );

      const backendError =
        err?.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError =
          Object.values(
            backendError
          )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError ||
                "Failed to create franchise."
        );
      } else {
        setError(
          "Failed to create franchise."
        );
      }
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // OPEN EDIT MODAL
  // --------------------------------------------------

  const handleOpenEdit = (franchise) => {
    setSelectedFranchise(franchise);

    setEditForm({
      name: franchise.name || "",
      location:
        franchise.location || "",
      description:
        franchise.description || "",
      is_active:
        franchise.is_active !== false,
    });

    setIsEditModalOpen(true);

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // EDIT FRANCHISE
  // --------------------------------------------------

  const handleEditFranchise = async (e) => {
    e.preventDefault();

    if (!selectedFranchise?.id) {
      setError("No franchise selected.");
      return;
    }

    try {
      setSavingEdit(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/franchises/${selectedFranchise.id}/`,
        editForm
      );

      const updatedFranchise =
        response.data?.franchise ||
        response.data;

      setFranchises((prev) =>
        prev.map((franchise) =>
          franchise.id ===
          updatedFranchise.id
            ? updatedFranchise
            : franchise
        )
      );

      setSelectedFranchise(
        updatedFranchise
      );

      setIsEditModalOpen(false);

      setSuccess(
        response.data?.message ||
          "Franchise updated successfully."
      );
    } catch (err) {
      console.error(
        "Error updating franchise:",
        err
      );

      const backendError =
        err?.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError =
          Object.values(
            backendError
          )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError ||
                "Failed to update franchise."
        );
      } else {
        setError(
          "Failed to update franchise."
        );
      }
    } finally {
      setSavingEdit(false);
    }
  };

  // --------------------------------------------------
  // DELETE ONE FRANCHISE
  // --------------------------------------------------

  const handleDeleteFranchise = async (
    franchise
  ) => {
    if (!franchise?.id) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${franchise.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeletingId(franchise.id);
      setError("");
      setSuccess("");

      const response =
        await api.delete(
          `/admin/franchises/${franchise.id}/`
        );

      setFranchises((prev) =>
        prev.filter(
          (item) =>
            item.id !== franchise.id
        )
      );

      if (
        selectedFranchise?.id ===
        franchise.id
      ) {
        setSelectedFranchise(null);
      }

      setSuccess(
        response.data?.message ||
          "Franchise deleted successfully."
      );
    } catch (err) {
      console.error(
        "Error deleting franchise:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to delete franchise."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // DELETE ALL FRANCHISES
  // --------------------------------------------------

  const handleDeleteAll = async () => {
    if (franchises.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        `You are about to permanently delete ALL ${franchises.length} franchise(s).\n\nThis action cannot be undone.\n\nAre you sure you want to continue?`
      );

    if (!confirmed) return;

    try {
      setDeletingAll(true);
      setError("");
      setSuccess("");

      const response =
        await api.delete(
          "/admin/franchises/"
        );

      setFranchises([]);
      setSelectedFranchise(null);

      setSuccess(
        response.data?.message ||
          "All franchises deleted successfully."
      );
    } catch (err) {
      console.error(
        "Error deleting all franchises:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to delete all franchises."
      );
    } finally {
      setDeletingAll(false);
    }
  };

  // --------------------------------------------------
  // FILTER FRANCHISES
  // --------------------------------------------------

  const filteredFranchises = useMemo(() => {
    return franchises.filter(
      (franchise) => {
        const query =
          searchQuery
            .trim()
            .toLowerCase();

        const matchesSearch =
          !query ||
          franchise.name
            ?.toLowerCase()
            .includes(query) ||
          franchise.location
            ?.toLowerCase()
            .includes(query) ||
          franchise.description
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" &&
            franchise.is_active) ||
          (statusFilter === "inactive" &&
            !franchise.is_active);

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    franchises,
    searchQuery,
    statusFilter,
  ]);

  // --------------------------------------------------
  // VIEW FRANCHISE
  // --------------------------------------------------

  const handleViewFranchise = (
    franchise
  ) => {
    setSelectedFranchise(franchise);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-125 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />

          <p className="text-gray-600 text-sm">
            Loading franchises...
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ==========================================
          HEADER
      =========================================== */}

      <div className="mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <FaBuilding />
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Franchises
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage all franchise locations
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            {/* DELETE ALL */}

            {isSuperAdmin && (
              <button
                type="button"
                onClick={
                  handleDeleteAll
                }
                disabled={
                  deletingAll ||
                  franchises.length === 0
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed text-red-600 font-medium transition"
              >

                {deletingAll ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrashAlt />
                    Delete All
                  </>
                )}

              </button>
            )}

            {/* ADD */}

            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setIsCreateModalOpen(
                  true
                );
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition"
            >
              <FaPlus />
              Add Franchise
            </button>

          </div>

        </div>

      </div>

      {/* ==========================================
          SUCCESS
      =========================================== */}

      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <FaCheckCircle className="mt-0.5 shrink-0" />

          <p className="font-medium">
            {success}
          </p>

        </div>
      )}

      {/* ==========================================
          ERROR
      =========================================== */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <FaExclamationTriangle className="mt-0.5 shrink-0" />

          <p className="font-medium">
            {error}
          </p>

        </div>
      )}

      {/* ==========================================
          STATISTICS
      =========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Franchises
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {franchises.length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FaBuilding />
            </div>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {
                  franchises.filter(
                    (franchise) =>
                      franchise.is_active
                  ).length
                }
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

          </div>

        </div>

        {/* INACTIVE */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inactive
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {
                  franchises.filter(
                    (franchise) =>
                      !franchise.is_active
                  ).length
                }
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FaBan />
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          FILTERS
      =========================================== */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* SEARCH */}

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search franchises..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm"
            />

          </div>

          {/* STATUS */}

          <div className="relative">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm bg-white"
            >

              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

          </div>

        </div>

      </div>

      {/* ==========================================
          TABLE
      =========================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {filteredFranchises.length ===
        0 ? (
          <div className="py-16 px-6 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl mb-4">
              <FaBuilding />
            </div>

            <h3 className="font-semibold text-gray-900">
              No franchises found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ||
              statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Create your first franchise to get started."}
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-225">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Franchise
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Location
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredFranchises.map(
                  (franchise) => (
                    <tr
                      key={
                        franchise.id
                      }
                      className="hover:bg-gray-50 transition"
                    >

                      {/* FRANCHISE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <FaBuilding />
                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {
                                franchise.name
                              }
                            </p>

                            {franchise.description && (
                              <p className="text-xs text-gray-500 mt-1 max-w-75 truncate">
                                {
                                  franchise.description
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* LOCATION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <FaMapMarkerAlt className="text-gray-400" />

                          <span>
                            {franchise.location ||
                              "No location"}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {franchise.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">

                            <FaCheckCircle className="text-[10px]" />

                            Active

                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">

                            <FaBan className="text-[10px]" />

                            Inactive

                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end items-center gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewFranchise(
                                franchise
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                            title="View franchise"
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(
                                franchise
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                            title="Edit franchise"
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteFranchise(
                                franchise
                              )
                            }
                            disabled={
                              deletingId ===
                              franchise.id
                            }
                            className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                            title="Delete franchise"
                          >

                            {deletingId ===
                            franchise.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}

                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ==========================================
          CREATE MODAL
      =========================================== */}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Add Franchise
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new franchise location
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCreateModalOpen(
                    false
                  )
                }
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreateFranchise
              }
              className="p-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchise Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={
                    handleFormChange
                  }
                  required
                  placeholder="Enter franchise name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400"
                />

              </div>

              {/* LOCATION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    form.location
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleFormChange
                  }
                  rows="4"
                  placeholder="Enter franchise description"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 resize-none"
                />

              </div>

              {/* ACTIVE */}

              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-medium text-gray-800">
                      Active franchise
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {form.is_active
                        ? "This franchise can be used."
                        : "This franchise cannot be used."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition ${
                      form.is_active
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition ${
                        form.is_active
                          ? "left-7"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsCreateModalOpen(
                      false
                    )
                  }
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
                >

                  {creating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Franchise
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==========================================
          EDIT MODAL
      =========================================== */}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Franchise
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update franchise information
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditModalOpen(
                    false
                  )
                }
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleEditFranchise
              }
              className="p-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchise Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    editForm.name
                  }
                  onChange={
                    handleEditFormChange
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400"
                />

              </div>

              {/* LOCATION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    editForm.location
                  }
                  onChange={
                    handleEditFormChange
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    editForm.description
                  }
                  onChange={
                    handleEditFormChange
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 resize-none"
                />

              </div>

              {/* ACTIVE */}

              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-medium text-gray-800">
                      Active franchise
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {editForm.is_active
                        ? "This franchise can be used."
                        : "This franchise cannot be used."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition ${
                      editForm.is_active
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition ${
                        editForm.is_active
                          ? "left-7"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsEditModalOpen(
                      false
                    )
                  }
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
                >

                  {savingEdit ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==========================================
          VIEW DETAILS DRAWER
      =========================================== */}

      {selectedFranchise &&
        !isEditModalOpen && (
          <div className="fixed inset-0 z-40">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/30"
              onClick={() =>
                setSelectedFranchise(
                  null
                )
              }
            />

            {/* DRAWER */}

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">

              {/* HEADER */}

              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFranchise(
                        null
                      )
                    }
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                  >
                    <FaArrowLeft />
                  </button>

                  <div>

                    <h2 className="font-semibold text-gray-900">
                      Franchise Details
                    </h2>

                    <p className="text-xs text-gray-500">
                      ID:{" "}
                      {
                        selectedFranchise.id
                      }
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFranchise(
                      null
                    )
                  }
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <FaTimes />
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl mb-5">
                  <FaBuilding />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {
                    selectedFranchise.name
                  }
                </h3>

                <div className="mt-3">

                  {selectedFranchise.is_active ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">

                      <FaCheckCircle className="text-[10px]" />

                      Active

                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">

                      <FaBan className="text-[10px]" />

                      Inactive

                    </span>
                  )}

                </div>

                {/* LOCATION */}

                <div className="mt-8">

                  <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                    Location
                  </p>

                  <div className="flex items-start gap-3 text-gray-700">

                    <FaMapMarkerAlt className="mt-1 text-gray-400" />

                    <p className="text-sm">
                      {
                        selectedFranchise.location ||
                        "No location provided"
                      }
                    </p>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                    Description
                  </p>

                  <p className="text-sm text-gray-600 leading-6">
                    {
                      selectedFranchise.description ||
                      "No description provided."
                    }
                  </p>

                </div>

                {/* CREATED */}

                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                    Created
                  </p>

                  <p className="text-sm text-gray-600">
                    {
                      selectedFranchise.created_at
                        ? new Date(
                            selectedFranchise.created_at
                          ).toLocaleString()
                        : "N/A"
                    }
                  </p>

                </div>

                {/* UPDATED */}

                <div className="mt-7">

                  <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                    Last Updated
                  </p>

                  <p className="text-sm text-gray-600">
                    {
                      selectedFranchise.updated_at
                        ? new Date(
                            selectedFranchise.updated_at
                          ).toLocaleString()
                        : "N/A"
                    }
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="mt-8 pt-5 border-t border-gray-100 space-y-3">

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEdit(
                        selectedFranchise
                      )
                    }
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Edit Franchise
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteFranchise(
                        selectedFranchise
                      )
                    }
                    disabled={
                      deletingId ===
                      selectedFranchise.id
                    }
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 font-medium transition"
                  >

                    {deletingId ===
                    selectedFranchise.id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Delete Franchise
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Franchises;