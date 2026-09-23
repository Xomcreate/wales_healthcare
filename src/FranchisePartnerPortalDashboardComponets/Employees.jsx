import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaAward,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrash,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const INITIAL_FORM = {
  full_name: "",
  job_role: "Senior Care Specialist",
  email: "",
  phone: "",
  status: "Active",
  qualifications: "",
  availability: "Full-Time",
  notes: "",
  franchise: "",
  onboarding_complete: false,
  compliance_approved: false,
  service_eligible: false,
  start_date: "",
};

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [employeesList, setEmployeesList] = useState([]);
  const [franchises, setFranchises] = useState([]);

  const [newEmployee, setNewEmployee] = useState({
    ...INITIAL_FORM,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [editingEmployee, setEditingEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  // =========================================================
  // ASSIGNED CUSTOMERS (sourced from appointments)
  // =========================================================

  const [customers, setCustomers] = useState([]);
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [loadingAssignedCustomers, setLoadingAssignedCustomers] =
    useState(false);
  const [assignedCustomersError, setAssignedCustomersError] = useState("");
  const [assignedCustomersLoadedFor, setAssignedCustomersLoadedFor] =
    useState(null);

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me/");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Unable to fetch current user:", error);
    }
  };

  // =========================================================
  // GET EMPLOYEES
  // =========================================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/employees/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setEmployeesList(data);
    } catch (error) {
      console.error("Unable to load employees:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load employee records."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET FRANCHISES
  // =========================================================

  const fetchFranchises = async () => {
    try {
      const response = await api.get("/admin/franchises/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setFranchises(data);
    } catch (error) {
      console.error("Unable to load franchises:", error);
    }
  };

  // =========================================================
  // GET CUSTOMERS (used to derive assigned customers per employee)
  // =========================================================

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/admin/customers/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setCustomers(data);

      return data;
    } catch (error) {
      console.error("Unable to load customers:", error);
      return [];
    }
  };

  // =========================================================
  // GET CUSTOMERS ASSIGNED TO AN EMPLOYEE
  // (derived from each customer's appointments, filtered by employee)
  // =========================================================

  const fetchAssignedCustomers = async (employee) => {
    if (!employee) return;

    const employeeId = employee.id;

    try {
      setLoadingAssignedCustomers(true);
      setAssignedCustomersError("");

      let customerList = customers;

      if (!customerList || customerList.length === 0) {
        customerList = await fetchCustomers();
      }

      const results = await Promise.all(
        customerList.map(async (customer) => {
          try {
            const response = await api.get(
              `/admin/customers/${customer.id}/appointments/`
            );

            const data = Array.isArray(response.data)
              ? response.data
              : response.data?.results || [];

            const employeeAppointments = data.filter(
              (appointment) =>
                Number(appointment.employee) === Number(employeeId)
            );

            if (employeeAppointments.length === 0) {
              return null;
            }

            employeeAppointments.sort((a, b) =>
              `${b.scheduled_date || ""} ${b.scheduled_time || ""}`.localeCompare(
                `${a.scheduled_date || ""} ${a.scheduled_time || ""}`
              )
            );

            return {
              customer,
              appointments: employeeAppointments,
            };
          } catch (err) {
            console.error(
              `Unable to load appointments for customer ${customer.id}:`,
              err
            );

            return null;
          }
        })
      );

      setAssignedCustomers(results.filter(Boolean));
      setAssignedCustomersLoadedFor(employeeId);
    } catch (error) {
      console.error(
        "Unable to load assigned customers:",
        error
      );

      setAssignedCustomersError(
        "Unable to load customers assigned to this employee."
      );
    } finally {
      setLoadingAssignedCustomers(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCurrentUser();
    fetchEmployees();
    fetchFranchises();
  }, []);

  // =========================================================
  // LOAD ASSIGNED CUSTOMERS WHEN THE CUSTOMERS TAB IS OPENED
  // =========================================================

  useEffect(() => {
    if (
      activeEmployee &&
      activeTab === "customers" &&
      assignedCustomersLoadedFor !== activeEmployee.id
    ) {
      fetchAssignedCustomers(activeEmployee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmployee, activeTab]);

  // =========================================================
  // SUCCESS MESSAGE
  // =========================================================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;

    if (!data) {
      return fallback;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];

      if (firstKey) {
        const value = data[firstKey];

        if (Array.isArray(value)) {
          return value.join(", ");
        }

        if (typeof value === "string") {
          return value;
        }
      }
    }

    return fallback;
  };

  // =========================================================
  // RESET ADD FORM
  // =========================================================

  const resetAddForm = () => {
    setNewEmployee({
      ...INITIAL_FORM,
    });
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddModal = () => {
    setError("");
    resetAddForm();
    setShowAddModal(true);
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================

  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);
    resetAddForm();
  };

  // =========================================================
  // HANDLE ADD EMPLOYEE
  // =========================================================

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        full_name: newEmployee.full_name,
        job_role: newEmployee.job_role,
        email: newEmployee.email,
        phone: newEmployee.phone,
        status: newEmployee.status,
        availability: newEmployee.availability,
        qualifications: newEmployee.qualifications,
        notes: newEmployee.notes,
        onboarding_complete:
          newEmployee.onboarding_complete,
        compliance_approved:
          newEmployee.compliance_approved,
        service_eligible:
          newEmployee.service_eligible,
      };

      if (newEmployee.start_date) {
        payload.start_date = newEmployee.start_date;
      }

      if (newEmployee.franchise) {
        payload.franchise = Number(
          newEmployee.franchise
        );
      }

      const response = await api.post(
        "/admin/employees/",
        payload
      );

      const createdEmployee =
        response.data?.employee;

      if (createdEmployee) {
        setEmployeesList((previous) => [
          createdEmployee,
          ...previous,
        ]);
      } else {
        await fetchEmployees();
      }

      setShowAddModal(false);
      resetAddForm();

      showSuccess(
        "Employee created successfully."
      );
    } catch (error) {
      console.error(
        "Unable to create employee:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to create employee."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // OPEN EMPLOYEE PROFILE
  // =========================================================

  const openEmployee = (employee) => {
    setActiveEmployee(employee);
    setActiveTab("overview");
    setEditingEmployee(false);
    setEditEmployee(null);
    setError("");

    // Reset the assigned-customers cache so switching between
    // employee profiles doesn't show a stale/previous employee's data.
    setAssignedCustomers([]);
    setAssignedCustomersLoadedFor(null);
    setAssignedCustomersError("");
  };

  // =========================================================
  // CLOSE EMPLOYEE PROFILE
  // =========================================================

  const closeEmployee = () => {
    if (saving || deleting) return;

    setActiveEmployee(null);
    setEditingEmployee(false);
    setEditEmployee(null);
  };

  // =========================================================
  // START EDIT
  // =========================================================

  const startEditEmployee = (employee) => {
    setEditEmployee({
      ...employee,
      franchise:
        employee.franchise?.id ||
        employee.franchise ||
        "",
      start_date:
        employee.start_date || "",
    });

    setEditingEmployee(true);
    setError("");
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const cancelEditEmployee = () => {
    if (saving) return;

    setEditingEmployee(false);
    setEditEmployee(null);
  };

  // =========================================================
  // UPDATE EMPLOYEE
  // =========================================================

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!editEmployee) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        full_name: editEmployee.full_name,
        job_role: editEmployee.job_role,
        email: editEmployee.email,
        phone: editEmployee.phone,
        status: editEmployee.status,
        availability: editEmployee.availability,
        qualifications:
          editEmployee.qualifications || "",
        notes: editEmployee.notes || "",
        onboarding_complete:
          Boolean(editEmployee.onboarding_complete),
        compliance_approved:
          Boolean(editEmployee.compliance_approved),
        service_eligible:
          Boolean(editEmployee.service_eligible),
      };

      if (editEmployee.start_date) {
        payload.start_date =
          editEmployee.start_date;
      } else {
        payload.start_date = null;
      }

      if (editEmployee.franchise) {
        payload.franchise = Number(
          editEmployee.franchise
        );
      }

      const response = await api.patch(
        `/admin/employees/${editEmployee.id}/`,
        payload
      );

      const updatedEmployee =
        response.data?.employee;

      if (updatedEmployee) {
        setEmployeesList((previous) =>
          previous.map((employee) =>
            employee.id === updatedEmployee.id
              ? updatedEmployee
              : employee
          )
        );

        setActiveEmployee(updatedEmployee);
      } else {
        await fetchEmployees();

        const refreshed =
          employeesList.find(
            (employee) =>
              employee.id === editEmployee.id
          );

        if (refreshed) {
          setActiveEmployee(refreshed);
        }
      }

      setEditingEmployee(false);
      setEditEmployee(null);

      showSuccess(
        "Employee updated successfully."
      );
    } catch (error) {
      console.error(
        "Unable to update employee:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to update employee."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE EMPLOYEE
  // =========================================================

  const handleDeleteEmployee = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.full_name}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(
        `/admin/employees/${employee.id}/`
      );

      setEmployeesList((previous) =>
        previous.filter(
          (item) => item.id !== employee.id
        )
      );

      setActiveEmployee(null);

      showSuccess(
        "Employee deleted successfully."
      );
    } catch (error) {
      console.error(
        "Unable to delete employee:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to delete employee."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // FILTER EMPLOYEES
  // =========================================================

  const filteredEmployees = employeesList.filter(
    (emp) => {
      const name =
        emp.full_name ||
        emp.name ||
        "";

      const role =
        emp.job_role ||
        emp.role ||
        "";

      const id =
        emp.employee_id ||
        emp.id ||
        "";

      const email =
        emp.email ||
        "";

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        role.toLowerCase().includes(search) ||
        id.toString().toLowerCase().includes(search) ||
        email.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === "All" ||
        emp.status === selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =========================================================
  // EMPLOYEE DISPLAY HELPERS
  // =========================================================

  const getEmployeeName = (employee) =>
    employee.full_name ||
    employee.name ||
    "Unnamed Employee";

  const getEmployeeRole = (employee) =>
    employee.job_role ||
    employee.role ||
    "Staff";

  const getEmployeeId = (employee) =>
    employee.employee_id ||
    employee.id ||
    "N/A";

  const getEmployeeFranchise = (employee) => {
    if (!employee.franchise) {
      return "Not assigned";
    }

    if (
      typeof employee.franchise === "object"
    ) {
      return (
        employee.franchise.name ||
        "Assigned"
      );
    }

    const franchise = franchises.find(
      (item) =>
        item.id === employee.franchise
    );

    return franchise?.name || "Assigned";
  };

  const getCustomerName = (customer) => {
    if (!customer) return "Unknown Customer";

    return (
      customer.full_name ||
      customer.name ||
      `${customer.first_name || ""} ${
        customer.last_name || ""
      }`.trim() ||
      customer.email ||
      `Customer #${customer.id}`
    );
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-100 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <FaSpinner
            className="animate-spin text-2xl"
            style={{
              color: BRAND_COLOR,
            }}
          />

          <p className="text-xs font-semibold text-slate-500">
            Loading employee records...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="space-y-6 relative pb-10"
    >
      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="fixed top-5 right-5 z-100 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-700 shadow-xl"
          >
            <FaCheckCircle />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <FaExclamationTriangle className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-bold">
              Something went wrong
            </p>

            <p className="mt-0.5">
              {error}
            </p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Employees & Staff Management
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Manage local branch staff profiles,
            compliance checks, qualifications,
            and scheduling availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() =>
              setShowWorkflowModal(true)
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaClipboardList
              className="text-[11px]"
              style={{
                color: BRAND_COLOR,
              }}
            />

            <span>
              Onboarding Workflow
            </span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />

            <span>
              Add Employee
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          CONTROLS
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />

          <input
            type="text"
            placeholder="Search by ID, name, role, email..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mr-1 shrink-0">
            <FaFilter className="text-[9px]" />

            Status:
          </span>

          {[
            "All",
            "Active",
            "Pending Compliance",
            "On Leave",
            "Inactive",
          ].map((status) => (
            <button
              key={status}
              onClick={() =>
                setSelectedStatus(status)
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                selectedStatus === status
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          EMPLOYEE TABLE / MOBILE CARDS
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">
                  Staff ID & Name
                </th>

                <th className="py-3.5 px-4">
                  Role & Qualifications
                </th>

                <th className="py-3.5 px-4">
                  Contact Info
                </th>

                <th className="py-3.5 px-4">
                  Compliance & Status
                </th>

                <th className="py-3.5 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(
                  (emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {getEmployeeName(
                            emp
                          )}
                        </p>

                        <p className="text-[10px] text-slate-400 font-semibold">
                          {getEmployeeId(
                            emp
                          )}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">
                          {getEmployeeRole(
                            emp
                          )}
                        </p>

                        <p className="text-[10px] text-slate-500 truncate max-w-xs">
                          {emp.qualifications ||
                            "No qualifications recorded"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 font-medium">
                          {emp.phone ||
                            "No phone"}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {emp.email ||
                            "No email"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            emp.status ===
                            "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : emp.status ===
                                "Inactive"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              openEmployee(
                                emp
                              )
                            }
                            title="View Profile"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition"
                          >
                            <FaEye className="text-xs" />
                          </button>

                          <button
                            onClick={() =>
                              startEditEmployee(
                                emp
                              )
                            }
                            title="Edit Profile"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                          >
                            <FaEdit className="text-xs" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteEmployee(
                                emp
                              )
                            }
                            title="Delete Employee"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50 transition"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaUsers className="text-2xl text-slate-300" />

                      <p className="text-xs font-semibold text-slate-400">
                        No staff records found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(
              (emp) => (
                <div
                  key={emp.id}
                  className="p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {getEmployeeName(
                          emp
                        )}
                      </h4>

                      <p className="text-[10px] text-slate-400 font-semibold">
                        {getEmployeeId(
                          emp
                        )}{" "}
                        •{" "}
                        {getEmployeeRole(
                          emp
                        )}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status ===
                        "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : emp.status ===
                            "Inactive"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-slate-700">
                      <strong>
                        Quals:
                      </strong>{" "}
                      {emp.qualifications ||
                        "Not recorded"}
                    </p>

                    <p className="text-slate-500 text-[10px]">
                      <strong>
                        Availability:
                      </strong>{" "}
                      {emp.availability ||
                        "Not configured"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {emp.phone ||
                        emp.email ||
                        "No contact"}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          openEmployee(
                            emp
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200"
                      >
                        <FaEye className="text-xs" />

                        View
                      </button>

                      <button
                        onClick={() =>
                          startEditEmployee(
                            emp
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
                      >
                        <FaEdit className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="py-10 text-center text-slate-400 text-xs">
              No staff records found.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          ADD EMPLOYEE MODAL
      ====================================================== */}

      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeAddModal}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                    New Staff Registration
                  </p>

                  <h4 className="text-base font-black text-slate-900">
                    Add New Employee
                  </h4>
                </div>

                <button
                  onClick={closeAddModal}
                  disabled={saving}
                  className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={
                  handleAddEmployeeSubmit
                }
                className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs"
              >
                {/* NAME */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Folashade Adebayo"
                    value={
                      newEmployee.full_name
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        full_name:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                {/* ROLE + STATUS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Role / Position
                    </label>

                    <select
                      value={
                        newEmployee.job_role
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          job_role:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="Senior Care Specialist">
                        Senior Care Specialist
                      </option>

                      <option value="Registered Nurse">
                        Registered Nurse
                      </option>

                      <option value="Physiotherapy Assistant">
                        Physiotherapy Assistant
                      </option>

                      <option value="General Support Aide">
                        General Support Aide
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Status
                    </label>

                    <select
                      value={
                        newEmployee.status
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          status:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Pending Compliance">
                        Pending Compliance
                      </option>

                      <option value="On Leave">
                        On Leave
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="employee@franchise.com"
                      value={
                        newEmployee.email
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="+234 800 000 0000"
                      value={
                        newEmployee.phone
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          phone:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* FRANCHISE */}
                {(currentUser?.role ===
                  "head_office" ||
                  currentUser?.role ===
                    "super_admin") && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Franchise
                    </label>

                    <select
                      required
                      value={
                        newEmployee.franchise
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          franchise:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="">
                        Select franchise
                      </option>

                      {franchises.map(
                        (franchise) => (
                          <option
                            key={
                              franchise.id
                            }
                            value={
                              franchise.id
                            }
                          >
                            {franchise.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                {/* QUALIFICATIONS */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Qualifications &
                    Certifications
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g., RN License #9982"
                    value={
                      newEmployee.qualifications
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        qualifications:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                {/* AVAILABILITY */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Availability
                  </label>

                  <select
                    value={
                      newEmployee.availability
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        availability:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  >
                    <option value="Full-Time">
                      Full-Time
                    </option>

                    <option value="Part-Time">
                      Part-Time
                    </option>

                    <option value="Flexible / Shifts">
                      Flexible / Shifts
                    </option>

                    <option value="On-Call">
                      On-Call
                    </option>
                  </select>
                </div>

                {/* START DATE */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={
                      newEmployee.start_date
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        start_date:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                {/* NOTES */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Manager Notes
                  </label>

                  <textarea
                    rows="3"
                    placeholder="Add brief background or onboarding comments..."
                    value={
                      newEmployee.notes
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        notes:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition resize-none"
                  />
                </div>

                {/* COMPLIANCE */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Initial Workflow
                  </p>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        newEmployee.compliance_approved
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          compliance_approved:
                            e.target.checked,
                        })
                      }
                      className="accent-teal-600"
                    />

                    <span className="text-xs font-medium text-slate-700">
                      Compliance approved
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        newEmployee.service_eligible
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          service_eligible:
                            e.target.checked,
                        })
                      }
                      className="accent-teal-600"
                    />

                    <span className="text-xs font-medium text-slate-700">
                      Eligible for service scheduling
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        newEmployee.onboarding_complete
                      }
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          onboarding_complete:
                            e.target.checked,
                        })
                      }
                      className="accent-teal-600"
                    />

                    <span className="text-xs font-medium text-slate-700">
                      Onboarding completed
                    </span>
                  </label>
                </div>

                {/* ACTIONS */}
                <div className="pt-3 flex items-center justify-end gap-2 shrink-0 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition disabled:opacity-60"
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheckCircle />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save & Register Employee"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          EMPLOYEE PROFILE DRAWER
      ====================================================== */}

      <AnimatePresence>
        {activeEmployee && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeEmployee}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-900 text-white">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                    Staff Profile & Compliance
                  </p>

                  <h4 className="text-base sm:text-lg font-black">
                    {getEmployeeName(
                      activeEmployee
                    )}
                  </h4>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {getEmployeeId(
                      activeEmployee
                    )}
                  </p>
                </div>

                <button
                  onClick={closeEmployee}
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* TABS */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
                {[
                  {
                    key: "overview",
                    label: "Overview",
                    icon: <FaUserTie />,
                  },
                  {
                    key: "qualifications",
                    label: "Qualifications",
                    icon: <FaAward />,
                  },
                  {
                    key: "availability",
                    label: "Availability",
                    icon: <FaClock />,
                  },
                  {
                    key: "customers",
                    label: "Customers",
                    icon: <FaUsers />,
                  },
                  {
                    key: "documents",
                    label: "Documents",
                    icon: <FaFileAlt />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() =>
                      setActiveTab(
                        tab.key
                      )
                    }
                    className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
                      activeTab === tab.key
                        ? "border-teal-600 text-teal-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}

                    <span>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* DRAWER CONTENT */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* OVERVIEW */}
                {activeTab ===
                  "overview" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2 text-xs">
                      <p className="font-bold text-slate-900 text-sm mb-2">
                        Employee Details
                      </p>

                      <p className="text-slate-700">
                        <strong>
                          Role:
                        </strong>{" "}
                        {getEmployeeRole(
                          activeEmployee
                        )}
                      </p>

                      <p className="text-slate-700">
                        <strong>
                          Employee ID:
                        </strong>{" "}
                        {getEmployeeId(
                          activeEmployee
                        )}
                      </p>

                      <p className="text-slate-700">
                        <strong>
                          Franchise:
                        </strong>{" "}
                        {getEmployeeFranchise(
                          activeEmployee
                        )}
                      </p>

                      <p className="text-slate-700">
                        <strong>
                          Status:
                        </strong>{" "}
                        {activeEmployee.status}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2 text-xs">
                      <p className="font-bold text-slate-900 text-sm mb-2">
                        Contact Details
                      </p>

                      <p className="flex items-center gap-2 text-slate-700">
                        <FaPhone className="text-teal-600" />

                        {activeEmployee.phone ||
                          "No phone number"}
                      </p>

                      <p className="flex items-center gap-2 text-slate-700 break-all">
                        <FaEnvelope className="text-teal-600 shrink-0" />

                        {activeEmployee.email ||
                          "No email address"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-bold text-slate-800 text-xs uppercase mb-2">
                        Manager Notes
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeEmployee.notes ||
                          "No notes have been added."}
                      </p>
                    </div>
                  </div>
                )}

                {/* QUALIFICATIONS */}
                {activeTab ===
                  "qualifications" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">
                      Certifications &
                      Qualifications
                    </h5>

                    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 text-xs">
                      <p className="font-bold text-teal-900">
                        {activeEmployee.qualifications ||
                          "No qualifications recorded."}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        {activeEmployee.compliance_approved ? (
                          <>
                            <FaCheckCircle className="text-emerald-600" />

                            <span className="text-emerald-700 font-semibold">
                              Compliance approved
                            </span>
                          </>
                        ) : (
                          <>
                            <FaExclamationTriangle className="text-amber-600" />

                            <span className="text-amber-700 font-semibold">
                              Compliance pending
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AVAILABILITY */}
                {activeTab ===
                  "availability" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">
                      Working Hours &
                      Availability
                    </h5>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <p className="font-bold text-slate-800">
                        {activeEmployee.availability ||
                          "Not configured"}
                      </p>

                      <p className="text-slate-500 mt-2">
                        Employee scheduling
                        eligibility:{" "}
                        <strong>
                          {activeEmployee.service_eligible
                            ? "Eligible"
                            : "Not yet eligible"}
                        </strong>
                      </p>
                    </div>

                    {activeEmployee.start_date && (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs">
                        <p className="text-slate-500">
                          Start Date
                        </p>

                        <p className="font-bold text-slate-800 mt-1">
                          {
                            activeEmployee.start_date
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* CUSTOMERS (derived from appointments) */}
                {activeTab === "customers" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase text-slate-400">
                        Assigned Customers & Care Services
                      </h5>

                      {!loadingAssignedCustomers &&
                        assignedCustomers.length > 0 && (
                          <span className="text-[10px] font-bold text-teal-700">
                            {assignedCustomers.length} customer
                            {assignedCustomers.length === 1
                              ? ""
                              : "s"}
                          </span>
                        )}
                    </div>

                    {loadingAssignedCustomers ? (
                      <div className="p-8 text-center rounded-xl border border-slate-200 bg-slate-50">
                        <FaSpinner className="animate-spin text-lg text-teal-600 mx-auto mb-2" />

                        <p className="text-xs font-semibold text-slate-500">
                          Loading assigned customers...
                        </p>
                      </div>
                    ) : assignedCustomersError ? (
                      <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 font-semibold">
                        {assignedCustomersError}
                      </div>
                    ) : assignedCustomers.length === 0 ? (
                      <div className="p-8 text-center rounded-xl border border-slate-200 bg-slate-50">
                        <FaUsers className="text-2xl text-slate-300 mx-auto mb-2" />

                        <p className="text-xs font-semibold text-slate-500">
                          This employee has no customers
                          assigned via appointments yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignedCustomers.map(
                          ({ customer, appointments }) => {
                            const nextAppointment =
                              appointments[0];

                            return (
                              <div
                                key={customer.id}
                                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-bold text-slate-900 text-sm">
                                    {getCustomerName(customer)}
                                  </p>

                                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 shrink-0">
                                    {appointments.length}{" "}
                                    appointment
                                    {appointments.length === 1
                                      ? ""
                                      : "s"}
                                  </span>
                                </div>

                                {customer.email && (
                                  <p className="text-slate-500 break-all">
                                    {customer.email}
                                  </p>
                                )}

                                {nextAppointment && (
                                  <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                                      Most recent:
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                      {nextAppointment.scheduled_date ||
                                        "No date"}{" "}
                                      {nextAppointment.scheduled_time
                                        ? `at ${nextAppointment.scheduled_time}`
                                        : ""}
                                    </span>

                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        nextAppointment.status ===
                                        "Completed"
                                          ? "bg-blue-50 text-blue-700 border-blue-100"
                                          : nextAppointment.status ===
                                            "Cancelled"
                                          ? "bg-red-50 text-red-700 border-red-100"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      }`}
                                    >
                                      {nextAppointment.status ||
                                        "Scheduled"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* DOCUMENTS */}
                {activeTab ===
                  "documents" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">
                      Required Documents &
                      Training
                    </h5>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">
                          Compliance
                        </span>

                        {activeEmployee.compliance_approved ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <FaCheckCircle />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <FaExclamationTriangle />
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className="text-slate-600">
                          Onboarding
                        </span>

                        {activeEmployee.onboarding_complete ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <FaCheckCircle />
                            Complete
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold">
                            In Progress
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className="text-slate-600">
                          Service Eligibility
                        </span>

                        {activeEmployee.service_eligible ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <FaCheckCircle />
                            Eligible
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold">
                            Not Eligible
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
                      <FaFileAlt className="mx-auto text-xl text-slate-300 mb-2" />

                      <p className="text-xs font-bold text-slate-600">
                        Document uploads
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Document management will
                        be connected to the
                        compliance module.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* DRAWER FOOTER */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-2 flex-wrap">
                <button
                  onClick={() =>
                    handleDeleteEmployee(
                      activeEmployee
                    )
                  }
                  disabled={deleting || saving}
                  className="mr-auto flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  {deleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}

                  Delete
                </button>

                <button
                  onClick={closeEmployee}
                  disabled={saving || deleting}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    startEditEmployee(
                      activeEmployee
                    )
                  }
                  disabled={saving || deleting}
                  className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition disabled:opacity-50"
                >
                  <FaEdit />

                  Edit Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          EDIT EMPLOYEE MODAL
      ====================================================== */}

      <AnimatePresence>
        {editingEmployee &&
          editEmployee && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{
                  scale: 0.95,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.95,
                  opacity: 0,
                }}
                className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-70 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 shrink-0">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                      Staff Management
                    </p>

                    <h4 className="text-base font-black text-slate-900">
                      Edit Employee
                    </h4>
                  </div>

                  <button
                    onClick={
                      cancelEditEmployee
                    }
                    disabled={saving}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form
                  onSubmit={
                    handleUpdateEmployee
                  }
                  className="space-y-4 overflow-y-auto pr-1 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={
                        editEmployee.full_name ||
                        ""
                      }
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          full_name:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Role
                      </label>

                      <select
                        value={
                          editEmployee.job_role ||
                          ""
                        }
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            job_role:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                      >
                        <option value="Senior Care Specialist">
                          Senior Care Specialist
                        </option>

                        <option value="Registered Nurse">
                          Registered Nurse
                        </option>

                        <option value="Physiotherapy Assistant">
                          Physiotherapy Assistant
                        </option>

                        <option value="General Support Aide">
                          General Support Aide
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Status
                      </label>

                      <select
                        value={
                          editEmployee.status ||
                          "Active"
                        }
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            status:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Pending Compliance">
                          Pending Compliance
                        </option>

                        <option value="On Leave">
                          On Leave
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Email
                      </label>

                      <input
                        type="email"
                        required
                        value={
                          editEmployee.email ||
                          ""
                        }
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            email:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Phone
                      </label>

                      <input
                        type="text"
                        value={
                          editEmployee.phone ||
                          ""
                        }
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            phone:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {(currentUser?.role ===
                    "head_office" ||
                    currentUser?.role ===
                      "super_admin") && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Franchise
                      </label>

                      <select
                        value={
                          editEmployee.franchise ||
                          ""
                        }
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            franchise:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                      >
                        <option value="">
                          Select franchise
                        </option>

                        {franchises.map(
                          (franchise) => (
                            <option
                              key={
                                franchise.id
                              }
                              value={
                                franchise.id
                              }
                            >
                              {
                                franchise.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Qualifications
                    </label>

                    <textarea
                      rows="2"
                      value={
                        editEmployee.qualifications ||
                        ""
                      }
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          qualifications:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Availability
                    </label>

                    <select
                      value={
                        editEmployee.availability ||
                        "Full-Time"
                      }
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          availability:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Full-Time">
                        Full-Time
                      </option>

                      <option value="Part-Time">
                        Part-Time
                      </option>

                      <option value="Flexible / Shifts">
                        Flexible / Shifts
                      </option>

                      <option value="On-Call">
                        On-Call
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={
                        editEmployee.start_date ||
                        ""
                      }
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          start_date:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Manager Notes
                    </label>

                    <textarea
                      rows="3"
                      value={
                        editEmployee.notes ||
                        ""
                      }
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          notes:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Employee Workflow
                    </p>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          editEmployee.compliance_approved
                        )}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            compliance_approved:
                              e.target.checked,
                          })
                        }
                        className="accent-teal-600"
                      />

                      <span className="font-medium text-slate-700">
                        Compliance approved
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          editEmployee.service_eligible
                        )}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            service_eligible:
                              e.target.checked,
                          })
                        }
                        className="accent-teal-600"
                      />

                      <span className="font-medium text-slate-700">
                        Service eligible
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          editEmployee.onboarding_complete
                        )}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            onboarding_complete:
                              e.target.checked,
                          })
                        }
                        className="accent-teal-600"
                      />

                      <span className="font-medium text-slate-700">
                        Onboarding complete
                      </span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={
                        cancelEditEmployee
                      }
                      disabled={saving}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-50"
                    >
                      {saving ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaSave />
                      )}

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
      </AnimatePresence>

      {/* =====================================================
          ONBOARDING WORKFLOW MODAL
      ====================================================== */}

      <AnimatePresence>
        {showWorkflowModal && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setShowWorkflowModal(
                  false
                )
              }
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                    Staff Operations
                  </p>

                  <h4 className="text-base font-black text-slate-900">
                    Employee Onboarding
                    Workflow Guide
                  </h4>
                </div>

                <button
                  onClick={() =>
                    setShowWorkflowModal(
                      false
                    )
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                {[
                  "Franchise manager creates employee profile.",
                  "Required documents and qualifications are uploaded.",
                  "System validates required fields and flags missing or expired documents.",
                  "Manager sets role, availability and service eligibility.",
                  "Employee account is invited or activated if staff login is enabled.",
                  "Employee becomes available for scheduling only when required approval and compliance rules are satisfied.",
                ].map(
                  (step, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">
                        {index + 1}
                      </span>

                      <p
                        className={
                          index === 5
                            ? "font-semibold text-teal-800"
                            : ""
                        }
                      >
                        {step}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() =>
                    setShowWorkflowModal(
                      false
                    )
                  }
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}