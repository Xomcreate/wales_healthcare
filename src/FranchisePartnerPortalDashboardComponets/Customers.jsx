import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaEye,
  FaEdit,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaFolderOpen,
  FaTimes,
  FaUserCheck,
  FaPhone,
  FaMapMarkerAlt,
  FaEllipsisV,
  FaUsers,
  FaUserSlash,
  FaPaperPlane,
  FaTrash,
  FaUpload,
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

/* =========================================================
   HELPERS
========================================================= */

function getListFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.employees)) return data.employees;
  if (Array.isArray(data?.customers)) return data.customers;
  if (Array.isArray(data?.assignments)) return data.assignments;
  if (Array.isArray(data?.appointments)) return data.appointments;
  return [];
}

function getEmployeeId(employee) {
  return (
    employee?.id ??
    employee?.employee_id ??
    employee?.user_id ??
    employee?.employee?.id ??
    null
  );
}

function getEmployeeName(employee) {
  return (
    employee?.full_name ||
    employee?.employee_name ||
    employee?.name ||
    employee?.user_name ||
    employee?.user?.full_name ||
    employee?.user?.name ||
    "Unnamed Staff"
  );
}

function getEmployeeFranchiseId(employee) {
  const franchise = employee?.franchise;

  if (franchise && typeof franchise === "object") {
    return franchise.id ?? franchise.pk ?? null;
  }

  return (
    franchise ??
    employee?.franchise_id ??
    employee?.franchiseId ??
    employee?.user?.profile?.franchise ??
    null
  );
}

function getEmployeeRole(employee) {
  return (
    employee?.job_role ||
    employee?.role_name ||
    employee?.role ||
    employee?.position ||
    employee?.user?.profile?.role ||
    "Care Staff"
  );
}

function normalizeEmployee(employee) {
  const id = getEmployeeId(employee);

  return {
    ...employee,
    id,
    employeeId: id,
    full_name: getEmployeeName(employee),
    job_role: getEmployeeRole(employee),
    franchiseId: getEmployeeFranchiseId(employee),
  };
}

function getAssignmentEmployeeId(assignment) {
  return (
    assignment?.employee ??
    assignment?.employee_id ??
    assignment?.employeeId ??
    assignment?.employee?.id ??
    assignment?.id ??
    null
  );
}

function getAssignmentName(assignment) {
  return (
    assignment?.employee_name ||
    assignment?.name ||
    assignment?.employee?.full_name ||
    assignment?.employee?.name ||
    assignment?.full_name ||
    "Unnamed Staff"
  );
}

function normalizeAssignment(assignment) {
  return {
    ...assignment,
    id:
      assignment?.id ??
      getAssignmentEmployeeId(assignment),
    employee:
      getAssignmentEmployeeId(assignment),
    employee_name: getAssignmentName(assignment),
    employee_role:
      assignment?.employee_role ||
      assignment?.job_role ||
      assignment?.employee?.job_role ||
      assignment?.role ||
      "Care Staff",
    is_primary: Boolean(
      assignment?.is_primary ??
      assignment?.isPrimary ??
      false
    ),
  };
}

function getAppointmentEmployeeId(appointment) {
  return (
    appointment?.employee ??
    appointment?.employee_id ??
    appointment?.employeeId ??
    appointment?.employee?.id ??
    null
  );
}

function getAppointmentEmployeeName(appointment, employees = []) {
  if (
    appointment?.employee_name &&
    appointment.employee_name !== "Unassigned"
  ) {
    return appointment.employee_name;
  }

  if (appointment?.employee?.full_name) {
    return appointment.employee.full_name;
  }

  const employeeId = getAppointmentEmployeeId(appointment);

  const found = employees.find(
    (employee) => String(getEmployeeId(employee)) === String(employeeId)
  );

  return found ? getEmployeeName(found) : "Unassigned";
}

function normalizeAppointment(appointment, employees = []) {
  return {
    ...appointment,
    employee_id: getAppointmentEmployeeId(appointment),
    employee_name: getAppointmentEmployeeName(appointment, employees),
  };
}

// Maps backend customer data into the row shape used by this screen.
function mapCustomer(user) {
  const rawAssignments = Array.isArray(user?.assigned_staff)
    ? user.assigned_staff
    : Array.isArray(user?.assignments)
    ? user.assignments
    : [];

  const assignedStaffList = rawAssignments.map(normalizeAssignment);

  const primary =
    assignedStaffList.find((staff) => staff.is_primary) ||
    assignedStaffList[0];

  const franchise =
    user?.franchise && typeof user.franchise === "object"
      ? user.franchise
      : null;

  const franchiseId =
    franchise?.id ??
    franchise?.pk ??
    user?.franchise_id ??
    user?.profile?.franchise ??
    null;

  const franchiseName =
    franchise?.name ||
    user?.franchise_name ||
    user?.profile?.franchise_name ||
    "—";

  return {
    id: `CUST-${user.id}`,
    rawId: user.id,
    name: user.full_name || user.name || "Unnamed Customer",
    email: user.email || "—",
    phone: user.profile?.phone || user.phone || "—",
    service:
      user.profile?.service_interest ||
      user.service_interest ||
      "—",
    status: user.is_active ? "Active" : "Inactive",
    assignedStaffList,
    assignedStaff:
      primary?.employee_name ||
      primary?.name ||
      "Unassigned",
    dateCreated: user.date_joined
      ? new Date(user.date_joined).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "—",
    address:
      user.profile?.address ||
      user.address ||
      "",
    franchiseName,
    franchiseId,
  };
}

// CSV download helper
function downloadCsv(rows, filename) {
  const csvContent = rows
    .map((row) =>
      row
        .map((val) =>
          `"${String(val ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =========================================================
   MAIN CUSTOMERS COMPONENT
========================================================= */

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState("profile");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [assignModalCustomer, setAssignModalCustomer] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Personal Care",
    status: "Active",
    assignedStaff: "Unassigned",
    address: "",
  });

  const [customersList, setCustomersList] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [drawerData, setDrawerData] = useState({
    assignments: [],
    appointments: [],
    invoices: [],
    documents: [],
    messages: [],
  });

  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState("");

  /* =========================================================
     LOAD CUSTOMERS
  ========================================================= */

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    setLoadError("");

    try {
      const res = await api.get("admin/customers/");

      const list = getListFromResponse(res.data);

      setCustomersList(list.map(mapCustomer));
    } catch (err) {
      console.error("Customer loading error:", err);

      setLoadError(
        err?.response?.data?.detail ||
          "Unable to load customers. Please try again."
      );
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* =========================================================
     LOAD EMPLOYEES
  ========================================================= */

  const loadEmployees = async () => {
    setLoadingEmployees(true);

    try {
      const res = await api.get("admin/employees/");

      const list = getListFromResponse(res.data);

      const normalized = list
        .map(normalizeEmployee)
        .filter((employee) => employee.id);

      setEmployees(normalized);
    } catch (err) {
      console.error("Employee loading error:", err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* =========================================================
     LOAD DRAWER DATA
  ========================================================= */

  useEffect(() => {
    if (!activeCustomer) return;

    let isMounted = true;

    const load = async () => {
      setDrawerLoading(true);
      setDrawerError("");

      try {
        if (activeProfileTab === "staff") {
          const res = await api.get(
            `admin/customers/${activeCustomer.rawId}/assignments/`
          );

          const assignments = getListFromResponse(res.data).map(
            normalizeAssignment
          );

          if (isMounted) {
            setDrawerData((current) => ({
              ...current,
              assignments,
            }));
          }
        }

        if (activeProfileTab === "appointments") {
          const res = await api.get(
            `admin/customers/${activeCustomer.rawId}/appointments/`
          );

          const appointments = getListFromResponse(res.data)
            .map((appointment) =>
              normalizeAppointment(appointment, employees)
            )
            .sort((a, b) => {
              const dateA = `${a.scheduled_date || ""} ${
                a.scheduled_time || ""
              }`;

              const dateB = `${b.scheduled_date || ""} ${
                b.scheduled_time || ""
              }`;

              return dateB.localeCompare(dateA);
            });

          if (isMounted) {
            setDrawerData((current) => ({
              ...current,
              appointments,
            }));
          }
        }

        if (activeProfileTab === "billing") {
          const res = await api.get(
            `admin/customers/${activeCustomer.rawId}/invoices/`
          );

          if (isMounted) {
            setDrawerData((current) => ({
              ...current,
              invoices: getListFromResponse(res.data),
            }));
          }
        }

        if (activeProfileTab === "documents") {
          const res = await api.get(
            `admin/customers/${activeCustomer.rawId}/documents/`
          );

          if (isMounted) {
            setDrawerData((current) => ({
              ...current,
              documents: getListFromResponse(res.data),
            }));
          }
        }

        if (activeProfileTab === "communication") {
          const res = await api.get(
            `admin/customers/${activeCustomer.rawId}/messages/`
          );

          if (isMounted) {
            setDrawerData((current) => ({
              ...current,
              messages: getListFromResponse(res.data),
            }));
          }
        }
      } catch (err) {
        console.error("Drawer loading error:", err);

        if (isMounted) {
          setDrawerError(
            err?.response?.data?.detail ||
              "Unable to load this section. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setDrawerLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [activeCustomer, activeProfileTab, employees]);

  /* =========================================================
     ADD CUSTOMER
  ========================================================= */

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();

    if (!newCustomer.name || !newCustomer.email) return;

    const generatedId = `CUST-00${customersList.length + 1}`;

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const customerToAdd = {
      ...newCustomer,
      id: generatedId,
      dateCreated: currentDate,
    };

    setCustomersList((prev) => [
      customerToAdd,
      ...prev,
    ]);

    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      service: "Personal Care",
      status: "Active",
      assignedStaff: "Unassigned",
      address: "",
    });

    setShowAddModal(false);
  };

  /* =========================================================
     EDIT CUSTOMER
  ========================================================= */

  const handleEditSubmit = async (formData) => {
    const res = await api.patch(
      `admin/customers/${editingCustomer.rawId}/`,
      formData
    );

    const updatedRaw = res.data?.customer || res.data;

    const updated = mapCustomer(updatedRaw);

    setCustomersList((prev) =>
      prev.map((customer) =>
        customer.rawId === updated.rawId
          ? updated
          : customer
      )
    );

    if (
      activeCustomer &&
      activeCustomer.rawId === updated.rawId
    ) {
      setActiveCustomer(updated);
    }

    setEditingCustomer(null);
  };

  /* =========================================================
     DEACTIVATE
  ========================================================= */

  const handleDeactivate = async (customer) => {
    setOpenMenuId(null);

    if (
      !window.confirm(
        `Deactivate ${customer.name}'s account? This will not delete their record — it can be restored later if needed.`
      )
    ) {
      return;
    }

    try {
      await api.post(
        `admin/customers/${customer.rawId}/deactivate/`
      );

      setCustomersList((prev) =>
        prev.map((item) =>
          item.rawId === customer.rawId
            ? {
                ...item,
                status: "Inactive",
              }
            : item
        )
      );

      if (
        activeCustomer &&
        activeCustomer.rawId === customer.rawId
      ) {
        setActiveCustomer((prev) => ({
          ...prev,
          status: "Inactive",
        }));
      }
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Unable to deactivate this customer."
      );
    }
  };

  /* =========================================================
     OPEN DRAWER
  ========================================================= */

  const openDrawerTab = (customer, tab) => {
    setOpenMenuId(null);

    setActiveCustomer(customer);
    setActiveProfileTab(tab);

    setDrawerData({
      assignments: [],
      appointments: [],
      invoices: [],
      documents: [],
      messages: [],
    });
  };

  /* =========================================================
     STAFF ASSIGNMENTS SAVED
  ========================================================= */

  const handleAssignmentsSaved = async (
    assignments,
    customer
  ) => {
    const normalizedAssignments =
      assignments.map(normalizeAssignment);

    const mapped = normalizedAssignments.map((assignment) => ({
      id: assignment.employee,
      name: assignment.employee_name,
      is_primary: assignment.is_primary,
    }));

    const primary =
      mapped.find((staff) => staff.is_primary) ||
      mapped[0];

    setCustomersList((prev) =>
      prev.map((item) =>
        item.rawId === customer.rawId
          ? {
              ...item,
              assignedStaffList: normalizedAssignments,
              assignedStaff:
                primary?.name ||
                "Unassigned",
            }
          : item
      )
    );

    if (
      activeCustomer &&
      activeCustomer.rawId === customer.rawId
    ) {
      setActiveCustomer((prev) => ({
        ...prev,
        assignedStaffList: normalizedAssignments,
        assignedStaff:
          primary?.name ||
          "Unassigned",
      }));

      setDrawerData((prev) => ({
        ...prev,
        assignments: normalizedAssignments,
      }));
    }

    // Refresh customer list from backend so the displayed
    // assignment is definitely the saved assignment.
    await loadCustomers();
  };

  /* =========================================================
     CSV
  ========================================================= */

  const filteredCustomers = useMemo(() => {
    return customersList.filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        String(customer.name || "")
          .toLowerCase()
          .includes(search) ||
        String(customer.email || "")
          .toLowerCase()
          .includes(search) ||
        String(customer.id || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        selectedStatus === "All" ||
        customer.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [
    customersList,
    searchTerm,
    selectedStatus,
  ]);

  const exportCsv = () => {
    const rows = [
      [
        "Customer ID",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Status",
        "Assigned Staff",
        "Franchise",
        "Date Created",
      ],
      ...filteredCustomers.map((customer) => [
        customer.id,
        customer.name,
        customer.email,
        customer.phone,
        customer.service,
        customer.status,
        customer.assignedStaff,
        customer.franchiseName,
        customer.dateCreated,
      ]),
    ];

    downloadCsv(
      rows,
      `customers-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
  };

  /* =========================================================
     ROW MENU
  ========================================================= */

  const rowMenuItems = (customer) => [
    {
      key: "assign",
      label: "Assign Staff",
      icon: <FaUsers />,
      onClick: () => {
        setOpenMenuId(null);
        setAssignModalCustomer(customer);
      },
    },
    {
      key: "appointments",
      label: "Schedule Appointment",
      icon: <FaCalendarAlt />,
      onClick: () =>
        openDrawerTab(customer, "appointments"),
    },
    {
      key: "communication",
      label: "Message Customer",
      icon: <FaEnvelope />,
      onClick: () =>
        openDrawerTab(customer, "communication"),
    },
    {
      key: "documents",
      label: "Documents",
      icon: <FaFolderOpen />,
      onClick: () =>
        openDrawerTab(customer, "documents"),
    },
    {
      key: "billing",
      label: "Billing / Invoices",
      icon: <FaFileInvoiceDollar />,
      onClick: () =>
        openDrawerTab(customer, "billing"),
    },
    {
      key: "deactivate",
      label: "Deactivate Customer",
      icon: <FaUserSlash />,
      danger: true,
      disabled: customer.status === "Inactive",
      onClick: () =>
        handleDeactivate(customer),
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

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
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Customers & CRM Management
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Manage local branch clients, track care
            services, and review patient profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaDownload
              className="text-[11px]"
              style={{
                color: BRAND_COLOR,
              }}
            />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() =>
              setShowAddModal(true)
            }
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* SEARCH / FILTER */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />

          <input
            type="text"
            placeholder="Search name, phone, email, ID..."
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
            "Pending",
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

      {/* CUSTOMER TABLE */}

      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        {loadingCustomers && (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading customers…
          </div>
        )}

        {!loadingCustomers &&
          loadError && (
            <div className="py-8 text-center text-red-500 text-xs">
              {loadError}
            </div>
          )}

        {!loadingCustomers &&
          !loadError && (
            <>
              {/* DESKTOP */}

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">
                        Customer ID & Name
                      </th>

                      <th className="py-3.5 px-4">
                        Contact Info
                      </th>

                      <th className="py-3.5 px-4">
                        Service Plan
                      </th>

                      <th className="py-3.5 px-4">
                        Assigned Staff
                      </th>

                      <th className="py-3.5 px-4">
                        Status
                      </th>

                      <th className="py-3.5 px-4 text-right">
                        Quick Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCustomers.length >
                    0 ? (
                      filteredCustomers.map(
                        (customer) => (
                          <tr
                            key={customer.id}
                            className="hover:bg-slate-50/60 transition"
                          >
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">
                                {customer.name}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {customer.id}
                              </p>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="text-slate-700 font-medium">
                                {customer.phone}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {customer.email}
                              </p>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800">
                                {customer.service}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                                <FaUserCheck className="text-teal-600 text-[10px]" />

                                {customer.assignedStaff}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  customer.status ===
                                  "Active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : customer.status ===
                                      "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {customer.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 relative">
                                <button
                                  onClick={() => {
                                    setActiveCustomer(
                                      customer
                                    );
                                    setActiveProfileTab(
                                      "profile"
                                    );
                                  }}
                                  title="View Profile"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition"
                                >
                                  <FaEye className="text-xs" />
                                </button>

                                <button
                                  onClick={() =>
                                    setEditingCustomer(
                                      customer
                                    )
                                  }
                                  title="Edit Customer"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                >
                                  <FaEdit className="text-xs" />
                                </button>

                                <button
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId ===
                                        customer.id
                                        ? null
                                        : customer.id
                                    )
                                  }
                                  title="More actions"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                >
                                  <FaEllipsisV className="text-xs" />
                                </button>

                                {openMenuId ===
                                  customer.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-30"
                                      onClick={() =>
                                        setOpenMenuId(
                                          null
                                        )
                                      }
                                    />

                                    <div className="absolute right-0 top-9 z-40 w-52 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 text-left">
                                      {rowMenuItems(
                                        customer
                                      ).map(
                                        (item) => (
                                          <button
                                            key={
                                              item.key
                                            }
                                            disabled={
                                              item.disabled
                                            }
                                            onClick={
                                              item.onClick
                                            }
                                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition ${
                                              item.disabled
                                                ? "text-slate-300 cursor-not-allowed"
                                                : item.danger
                                                ? "text-red-600 hover:bg-red-50"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                          >
                                            <span className="text-[11px]">
                                              {
                                                item.icon
                                              }
                                            </span>

                                            {
                                              item.label
                                            }
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-8 text-center text-slate-400 text-xs"
                        >
                          No customers found
                          matching your search
                          criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="block md:hidden divide-y divide-slate-100">
                {filteredCustomers.length >
                0 ? (
                  filteredCustomers.map(
                    (customer) => (
                      <div
                        key={customer.id}
                        className="p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {customer.name}
                            </h4>

                            <p className="text-[10px] text-slate-400 font-semibold">
                              {customer.id}
                            </p>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              customer.status ===
                              "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : customer.status ===
                                  "Pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-slate-400">
                              Service Plan
                            </p>

                            <p className="font-semibold text-slate-800 mt-0.5">
                              {customer.service}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase text-slate-400">
                              Assigned Staff
                            </p>

                            <p className="font-semibold text-slate-800 mt-0.5">
                              {customer.assignedStaff}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {customer.phone}
                          </span>

                          <div className="flex items-center gap-2 relative">
                            <button
                              onClick={() => {
                                setActiveCustomer(
                                  customer
                                );
                                setActiveProfileTab(
                                  "profile"
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200"
                            >
                              <FaEye className="text-xs" />
                              Profile
                            </button>

                            <button
                              onClick={() =>
                                setEditingCustomer(
                                  customer
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
                            >
                              <FaEdit className="text-xs" />
                            </button>

                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId ===
                                    customer.id
                                    ? null
                                    : customer.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
                            >
                              <FaEllipsisV className="text-xs" />
                            </button>

                            {openMenuId ===
                              customer.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() =>
                                    setOpenMenuId(
                                      null
                                    )
                                  }
                                />

                                <div className="absolute right-0 top-9 z-40 w-52 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 text-left">
                                  {rowMenuItems(
                                    customer
                                  ).map(
                                    (item) => (
                                      <button
                                        key={
                                          item.key
                                        }
                                        disabled={
                                          item.disabled
                                        }
                                        onClick={
                                          item.onClick
                                        }
                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition ${
                                          item.disabled
                                            ? "text-slate-300 cursor-not-allowed"
                                            : item.danger
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                      >
                                        <span className="text-[11px]">
                                          {
                                            item.icon
                                          }
                                        </span>

                                        {
                                          item.label
                                        }
                                      </button>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No customers found.
                  </div>
                )}
              </div>
            </>
          )}
      </div>

      {/* =====================================================
          ADD CUSTOMER MODAL
      ===================================================== */}

      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setShowAddModal(false)
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
              className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                    Client Intake
                  </p>

                  <h4 className="text-base font-black text-slate-900">
                    Add New Customer
                  </h4>
                </div>

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={
                  handleAddCustomerSubmit
                }
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Customer Full Name *
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. Elizabeth Taylor"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="elizabeth@example.com"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      placeholder="+234 800 123 4567"
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Service Plan
                    </label>

                    <select
                      value={
                        newCustomer.service
                      }
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          service:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    >
                      <option value="Personal Care">
                        Personal Care
                      </option>

                      <option value="Companionship">
                        Companionship
                      </option>

                      <option value="Nursing Support">
                        Nursing Support
                      </option>

                      <option value="Rehabilitation Care">
                        Rehabilitation Care
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Account Status
                    </label>

                    <select
                      value={
                        newCustomer.status
                      }
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          status:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Pending">
                        Pending
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
                      Assigned Care Staff
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Dr. Adebayo"
                      value={
                        newCustomer.assignedStaff
                      }
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          assignedStaff:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Residential Address
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 10 Awolowo Road, Ikoyi"
                      value={
                        newCustomer.address
                      }
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition shadow-sm"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* EDIT */}

      <AnimatePresence>
        {editingCustomer && (
          <EditCustomerModal
            customer={editingCustomer}
            onClose={() =>
              setEditingCustomer(null)
            }
            onSubmit={handleEditSubmit}
          />
        )}
      </AnimatePresence>

      {/* ASSIGN STAFF */}

      <AnimatePresence>
        {assignModalCustomer && (
          <AssignStaffModal
            customer={assignModalCustomer}
            employees={employees}
            loadingEmployees={loadingEmployees}
            onClose={() =>
              setAssignModalCustomer(null)
            }
            onSaved={(assignments) =>
              handleAssignmentsSaved(
                assignments,
                assignModalCustomer
              )
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          CUSTOMER DRAWER
      ===================================================== */}

      <AnimatePresence>
        {activeCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setActiveCustomer(null)
              }
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-900 text-white">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                    Customer Profile View
                  </p>

                  <h4 className="text-base sm:text-lg font-black">
                    {activeCustomer.name}
                  </h4>
                </div>

                <button
                  onClick={() =>
                    setActiveCustomer(null)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
                {[
                  {
                    key: "profile",
                    label: "Profile",
                    icon: <FaUserCheck />,
                  },
                  {
                    key: "staff",
                    label: "Staff",
                    icon: <FaUsers />,
                  },
                  {
                    key: "services",
                    label: "Services",
                    icon: <FaFolderOpen />,
                  },
                  {
                    key: "appointments",
                    label: "Appointments",
                    icon: <FaCalendarAlt />,
                  },
                  {
                    key: "billing",
                    label: "Billing",
                    icon: <FaFileInvoiceDollar />,
                  },
                  {
                    key: "documents",
                    label: "Documents",
                    icon: <FaFolderOpen />,
                  },
                  {
                    key: "communication",
                    label: "Messages",
                    icon: <FaEnvelope />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() =>
                      setActiveProfileTab(
                        tab.key
                      )
                    }
                    className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
                      activeProfileTab ===
                      tab.key
                        ? "border-teal-600 text-teal-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {activeProfileTab ===
                  "profile" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-3">
                        Contact Details & Info
                      </h5>

                      <div className="space-y-2 text-xs">
                        <p className="flex items-center gap-2 text-slate-700 truncate">
                          <FaPhone className="text-teal-600 shrink-0" />
                          {activeCustomer.phone}
                        </p>

                        <p className="flex items-center gap-2 text-slate-700 truncate">
                          <FaEnvelope className="text-teal-600 shrink-0" />
                          {activeCustomer.email}
                        </p>

                        <p className="flex items-center gap-2 text-slate-700">
                          <FaMapMarkerAlt className="text-teal-600 shrink-0" />
                          {activeCustomer.address ||
                            activeCustomer.franchiseName}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-2">
                        Audit & Consent
                      </h5>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Consent status verified on{" "}
                        {activeCustomer.dateCreated}.
                        All data changes are logged
                        for franchise compliance and
                        auditing.
                      </p>
                    </div>
                  </div>
                )}

                {activeProfileTab ===
                  "staff" && (
                  <StaffTab
                    loading={drawerLoading}
                    error={drawerError}
                    assignments={
                      drawerData.assignments
                    }
                    onManage={() =>
                      setAssignModalCustomer(
                        activeCustomer
                      )
                    }
                  />
                )}

                {activeProfileTab ===
                  "services" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">
                      Current Plan
                    </h5>

                    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
                      <p className="text-sm font-bold text-teal-900">
                        {activeCustomer.service}
                      </p>

                      <p className="text-xs text-teal-700 mt-1">
                        Assigned Care Staff:{" "}
                        {activeCustomer.assignedStaff}
                      </p>
                    </div>
                  </div>
                )}

                {activeProfileTab ===
                  "appointments" && (
                  <AppointmentsTab
                    customer={activeCustomer}
                    employees={employees}
                    loading={drawerLoading}
                    error={drawerError}
                    appointments={
                      drawerData.appointments
                    }
                    onCreated={async () => {
                      try {
                        const res =
                          await api.get(
                            `admin/customers/${activeCustomer.rawId}/appointments/`
                          );

                        const freshAppointments =
                          getListFromResponse(
                            res.data
                          )
                            .map((appointment) =>
                              normalizeAppointment(
                                appointment,
                                employees
                              )
                            )
                            .sort((a, b) =>
                              `${b.scheduled_date || ""} ${b.scheduled_time || ""}`.localeCompare(
                                `${a.scheduled_date || ""} ${a.scheduled_time || ""}`
                              )
                            );

                        setDrawerData(
                          (current) => ({
                            ...current,
                            appointments:
                              freshAppointments,
                          })
                        );
                      } catch (err) {
                        console.error(
                          "Appointment refresh error:",
                          err
                        );
                      }
                    }}
                  />
                )}

                {activeProfileTab ===
                  "billing" && (
                  <BillingTab
                    loading={drawerLoading}
                    error={drawerError}
                    invoices={
                      drawerData.invoices
                    }
                  />
                )}

                {activeProfileTab ===
                  "documents" && (
                  <DocumentsTab
                    customer={activeCustomer}
                    loading={drawerLoading}
                    error={drawerError}
                    documents={
                      drawerData.documents
                    }
                    onUploaded={(doc) =>
                      setDrawerData(
                        (current) => ({
                          ...current,
                          documents: [
                            doc,
                            ...current.documents,
                          ],
                        })
                      )
                    }
                    onDeleted={(id) =>
                      setDrawerData(
                        (current) => ({
                          ...current,
                          documents:
                            current.documents.filter(
                              (doc) =>
                                doc.id !== id
                            ),
                        })
                      )
                    }
                  />
                )}

                {activeProfileTab ===
                  "communication" && (
                  <MessagesTab
                    customer={activeCustomer}
                    loading={drawerLoading}
                    error={drawerError}
                    messages={
                      drawerData.messages
                    }
                    onSent={(message) =>
                      setDrawerData(
                        (current) => ({
                          ...current,
                          messages: [
                            message,
                            ...current.messages,
                          ],
                        })
                      )
                    }
                  />
                )}
              </div>

              <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
                {activeCustomer.status !==
                  "Inactive" && (
                  <button
                    onClick={() =>
                      handleDeactivate(
                        activeCustomer
                      )
                    }
                    className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    Deactivate
                  </button>
                )}

                <button
                  onClick={() =>
                    setActiveCustomer(null)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    setEditingCustomer(
                      activeCustomer
                    )
                  }
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition"
                >
                  Edit Customer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =========================================================
   EDIT CUSTOMER MODAL
========================================================= */

function EditCustomerModal({
  customer,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    full_name: customer.name || "",
    phone:
      customer.phone === "—"
        ? ""
        : customer.phone,
    address: customer.address || "",
    service_interest:
      customer.service === "—"
        ? ""
        : customer.service,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to update this customer. Please check the fields and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
        className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
              Edit Record
            </p>

            <h4 className="text-base font-black text-slate-900">
              Edit Customer
            </h4>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Customer Full Name
            </label>

            <input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  full_name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phone Number
              </label>

              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Service Plan
              </label>

              <select
                value={form.service_interest}
                onChange={(e) =>
                  setForm({
                    ...form,
                    service_interest:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
              >
                <option value="">
                  Unchanged
                </option>

                <option value="Homecare Services">
                  Homecare Services
                </option>

                <option value="Nursing & Clinical Care">
                  Nursing & Clinical Care
                </option>

                <option value="Dementia & Special Care">
                  Dementia & Special Care
                </option>

                <option value="Facility Staffing Coverage">
                  Facility Staffing Coverage
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Residential Address
            </label>

            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition shadow-sm disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

/* =========================================================
   ASSIGN STAFF MODAL
========================================================= */

function AssignStaffModal({
  customer,
  employees,
  loadingEmployees,
  onClose,
  onSaved,
}) {
  const franchiseEmployees = employees.filter(
    (employee) => {
      if (!customer.franchiseId) {
        return true;
      }

      return (
        String(employee.franchiseId) ===
        String(customer.franchiseId)
      );
    }
  );

  const [selected, setSelected] =
    useState(() => {
      const map = {};

      (
        customer.assignedStaffList || []
      ).forEach((assignment) => {
        const employeeId =
          getAssignmentEmployeeId(
            assignment
          );

        if (employeeId) {
          map[String(employeeId)] = {
            isPrimary: Boolean(
              assignment.is_primary
            ),
          };
        }
      });

      return map;
    });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleEmployee = (id) => {
    const key = String(id);

    setSelected((prev) => {
      const next = { ...prev };

      if (next[key]) {
        delete next[key];
      } else {
        next[key] = {
          isPrimary:
            Object.keys(next).length === 0,
        };
      }

      return next;
    });
  };

  const setPrimary = (id) => {
    const key = String(id);

    setSelected((prev) => {
      const next = {};

      Object.keys(prev).forEach(
        (employeeId) => {
          next[employeeId] = {
            isPrimary:
              employeeId === key,
          };
        }
      );

      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const assignments =
        Object.entries(selected).map(
          ([employee_id, value]) => ({
            employee_id: Number(
              employee_id
            ),
            is_primary:
              Boolean(value.isPrimary),
          })
        );

      const res = await api.put(
        `admin/customers/${customer.rawId}/assignments/`,
        {
          assignments,
        }
      );

      const savedAssignments =
        getListFromResponse(res.data);

      onSaved(savedAssignments);
      onClose();
    } catch (err) {
      console.error(
        "Assign staff error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Unable to update staff assignments. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
        className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
              {customer.franchiseName}
            </p>

            <h4 className="text-base font-black text-slate-900">
              Assign Staff —{" "}
              {customer.name}
            </h4>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Select one or more staff members from{" "}
          {customer.franchiseName}. Mark one as
          the primary point of contact.
        </p>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3 py-2">
            {error}
          </div>
        )}

        {loadingEmployees ? (
          <div className="p-6 text-center text-xs text-slate-400">
            Loading staff...
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {franchiseEmployees.length ===
              0 && (
              <div className="p-5 text-center">
                <FaUsers className="mx-auto text-slate-300 mb-2" />

                <p className="text-xs font-bold text-slate-500">
                  No staff found
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  There are no available staff
                  members for this customer's
                  franchise.
                </p>
              </div>
            )}

            {franchiseEmployees.map(
              (employee) => {
                const employeeId =
                  getEmployeeId(employee);

                const isChecked =
                  !!selected[
                    String(employeeId)
                  ];

                const isPrimary =
                  selected[
                    String(employeeId)
                  ]?.isPrimary;

                return (
                  <div
                    key={employeeId}
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleEmployee(
                            employeeId
                          )
                        }
                        className="h-3.5 w-3.5 accent-teal-600"
                      />

                      <span>
                        <p className="font-bold text-slate-800">
                          {getEmployeeName(
                            employee
                          )}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {getEmployeeRole(
                            employee
                          )}
                        </p>
                      </span>
                    </label>

                    {isChecked && (
                      <button
                        type="button"
                        onClick={() =>
                          setPrimary(
                            employeeId
                          )
                        }
                        title={
                          isPrimary
                            ? "Primary staff"
                            : "Mark as primary"
                        }
                        className={
                          isPrimary
                            ? "text-amber-400"
                            : "text-slate-300 hover:text-amber-400"
                        }
                      >
                        {isPrimary ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              loadingEmployees
            }
            className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition shadow-sm text-xs disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Assignments"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* =========================================================
   STAFF TAB
========================================================= */

function StaffTab({
  loading,
  error,
  assignments,
  onManage,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-black uppercase text-slate-400">
          Assigned Staff
        </h5>

        <button
          onClick={onManage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200"
        >
          <FaUsers className="text-[10px]" />
          Manage
        </button>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">
          Loading…
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        assignments.length === 0 && (
          <p className="text-xs text-slate-400">
            No staff assigned yet.
          </p>
        )}

      <div className="space-y-2">
        {assignments.map((assignment) => (
          <div
            key={
              assignment.id ||
              assignment.employee
            }
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
          >
            <div>
              <p className="font-bold text-slate-800">
                {assignment.employee_name}
              </p>

              <p className="text-[10px] text-slate-400">
                {assignment.employee_role}
              </p>
            </div>

            {assignment.is_primary && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                <FaStar className="text-[10px]" />
                Primary
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   APPOINTMENTS TAB
========================================================= */

function AppointmentsTab({
  customer,
  employees,
  loading,
  error,
  appointments,
  onCreated,
}) {
  const franchiseEmployees =
    employees.filter((employee) => {
      if (!customer.franchiseId) {
        return true;
      }

      return (
        String(employee.franchiseId) ===
        String(customer.franchiseId)
      );
    });

  const primaryAssignedStaff =
    (customer.assignedStaffList || []).find(
      (assignment) =>
        assignment.is_primary
    ) ||
    (customer.assignedStaffList || [])[0];

  const defaultEmployeeId =
    primaryAssignedStaff
      ? getAssignmentEmployeeId(
          primaryAssignedStaff
        )
      : "";

  const [form, setForm] = useState({
    employee: defaultEmployeeId
      ? String(defaultEmployeeId)
      : "",
    scheduled_date: "",
    scheduled_time: "",
    notes: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const [formSuccess, setFormSuccess] =
    useState("");

  useEffect(() => {
    if (!form.employee && defaultEmployeeId) {
      setForm((current) => ({
        ...current,
        employee: String(
          defaultEmployeeId
        ),
      }));
    }
  }, [defaultEmployeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");

    if (!form.scheduled_date) {
      setFormError(
        "Please select an appointment date."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        scheduled_date:
          form.scheduled_date,

        scheduled_time:
          form.scheduled_time || null,

        notes:
          form.notes?.trim() || "",
      };

      if (form.employee) {
        payload.employee = Number(
          form.employee
        );
      }

      /*
       IMPORTANT:

       This request is made using the selected
       customer's ID:

       admin/customers/{CUSTOMER_ID}/appointments/

       Therefore the backend appointment view
       must create:

       Appointment(
          customer=customer,
          employee=employee,
          franchise=customer.franchise,
          ...
       )
      */

      const res = await api.post(
        `admin/customers/${customer.rawId}/appointments/`,
        payload
      );

      const createdAppointment =
        res.data?.appointment ||
        res.data;

      const normalized =
        normalizeAppointment(
          createdAppointment,
          employees
        );

      setFormSuccess(
        "Appointment scheduled successfully for this customer."
      );

      setForm({
        employee: "",
        scheduled_date: "",
        scheduled_time: "",
        notes: "",
      });

      /*
       Tell the parent to fetch the appointment
       again from the backend.
      */
      await onCreated(normalized);
    } catch (err) {
      console.error(
        "Schedule appointment error:",
        err
      );

      const backendError =
        err?.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError = Object.values(
          backendError
        )?.[0];

        if (Array.isArray(firstError)) {
          setFormError(
            firstError[0] ||
              "Unable to schedule this appointment."
          );
        } else if (
          typeof firstError === "string"
        ) {
          setFormError(firstError);
        } else {
          setFormError(
            backendError.detail ||
              backendError.error ||
              "Unable to schedule this appointment."
          );
        }
      } else {
        setFormError(
          "Unable to schedule this appointment. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatAppointmentDate = (
    date
  ) => {
    if (!date) return "No date";

    const parsed = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatAppointmentTime = (
    time
  ) => {
    if (!time) return "";

    const parts = String(time).split(":");

    if (parts.length < 2) {
      return time;
    }

    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    if (Number.isNaN(hour)) {
      return time;
    }

    const suffix =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${String(
      minute
    ).padStart(2, "0")} ${suffix}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xs font-black uppercase text-slate-400">
            Schedule Appointment
          </h5>

          <p className="text-[10px] text-slate-400 mt-1">
            Appointment for{" "}
            <span className="font-bold text-slate-600">
              {customer.name}
            </span>
          </p>
        </div>

        <FaCalendarAlt className="text-teal-600" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50"
      >
        {formError && (
          <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-[11px] font-medium px-3 py-2">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-medium px-3 py-2">
            <FaCheckCircle className="mt-0.5 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              Date *
            </label>

            <input
              type="date"
              required
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={
                form.scheduled_date
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  scheduled_date:
                    e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              Time
            </label>

            <input
              type="time"
              value={
                form.scheduled_time
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  scheduled_time:
                    e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            Assigned Staff
          </label>

          <select
            value={form.employee}
            onChange={(e) =>
              setForm({
                ...form,
                employee:
                  e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:border-teal-500 focus:outline-none"
          >
            <option value="">
              Unassigned staff
            </option>

            {franchiseEmployees.map(
              (employee) => {
                const employeeId =
                  getEmployeeId(
                    employee
                  );

                return (
                  <option
                    key={employeeId}
                    value={employeeId}
                  >
                    {getEmployeeName(
                      employee
                    )}{" "}
                    —{" "}
                    {getEmployeeRole(
                      employee
                    )}
                  </option>
                );
              }
            )}
          </select>

          {franchiseEmployees.length ===
            0 && (
            <p className="text-[10px] text-amber-600 mt-1">
              No staff from this customer's
              franchise are available.
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            Appointment Notes
          </label>

          <textarea
            placeholder="Add appointment notes..."
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:border-teal-500 focus:outline-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 font-bold text-white hover:bg-teal-700 transition disabled:opacity-60"
        >
          {submitting ? (
            <>
              <FaClock className="animate-pulse" />
              Scheduling...
            </>
          ) : (
            <>
              <FaCalendarAlt />
              Schedule Appointment
            </>
          )}
        </button>
      </form>

      {/* APPOINTMENTS */}

      <div className="flex items-center justify-between pt-2">
        <h5 className="text-xs font-black uppercase text-slate-400">
          Upcoming & Past
        </h5>

        <span className="text-[10px] text-slate-400">
          {appointments.length} appointment
          {appointments.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">
          Loading appointments…
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        appointments.length === 0 && (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200">
            <FaCalendarAlt className="mx-auto text-slate-300 text-lg mb-2" />

            <p className="text-xs font-bold text-slate-500">
              No appointments yet
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Schedule an appointment above
              for this customer.
            </p>
          </div>
        )}

      <div className="space-y-2">
        {appointments.map((appointment) => {
          const status =
            appointment.status ||
            "Scheduled";

          const employeeName =
            getAppointmentEmployeeName(
              appointment,
              employees
            );

          return (
            <div
              key={appointment.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">
                    {formatAppointmentDate(
                      appointment.scheduled_date
                    )}
                  </p>

                  {appointment.scheduled_time && (
                    <p className="text-[10px] text-teal-700 font-semibold mt-0.5">
                      {formatAppointmentTime(
                        appointment.scheduled_time
                      )}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    status === "Scheduled"
                      ? "bg-teal-50 text-teal-700"
                      : status === "Completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : status === "Cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-slate-500">
                <FaUserCheck className="text-teal-600 text-[10px]" />

                <span>
                  {employeeName ===
                  "Unassigned"
                    ? "No staff assigned"
                    : `with ${employeeName}`}
                </span>
              </div>

              {appointment.notes && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-[10px] text-slate-400 whitespace-pre-line">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   BILLING TAB
========================================================= */

function BillingTab({
  loading,
  error,
  invoices,
}) {
  return (
    <div className="space-y-3">
      <h5 className="text-xs font-black uppercase text-slate-400">
        Invoices & Receipts
      </h5>

      {loading && (
        <p className="text-xs text-slate-400">
          Loading…
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        invoices.length === 0 && (
          <p className="text-xs text-slate-400">
            No invoices on file.
          </p>
        )}

      <div className="space-y-2">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-bold text-slate-800">
                {invoice.invoice_number}
              </p>

              <p className="text-slate-500 text-[10px]">
                {invoice.description ||
                  "—"}{" "}
                · {invoice.issued_at}
              </p>

              <p
                className={`text-[10px] font-bold mt-0.5 ${
                  invoice.status ===
                  "Paid"
                    ? "text-emerald-600"
                    : invoice.status ===
                      "Overdue"
                    ? "text-red-600"
                    : "text-amber-600"
                }`}
              >
                {invoice.status}
              </p>
            </div>

            <span className="font-black text-teal-600">
              ${invoice.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENTS TAB
========================================================= */

function DocumentsTab({
  customer,
  loading,
  error,
  documents,
  onUploaded,
  onDeleted,
}) {
  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const handleFileChange = async (
    e
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post(
        `admin/customers/${customer.rawId}/documents/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      onUploaded(
        res.data?.document ||
          res.data
      );
    } catch (err) {
      setUploadError(
        err?.response?.data?.detail ||
          "Unable to upload this document."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (
    documentId
  ) => {
    if (
      !window.confirm(
        "Remove this document?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `admin/documents/${documentId}/`
      );

      onDeleted(documentId);
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Unable to delete this document."
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-black uppercase text-slate-400">
          Customer Documents
        </h5>

        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200 cursor-pointer">
          <FaUpload className="text-[10px]" />

          {uploading
            ? "Uploading..."
            : "Upload"}

          <input
            type="file"
            className="hidden"
            onChange={
              handleFileChange
            }
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <div className="rounded-lg bg-red-50 border border-red-100 text-red-600 text-[11px] font-medium px-3 py-2">
          {uploadError}
        </div>
      )}

      {loading && (
        <p className="text-xs text-slate-400">
          Loading…
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        documents.length === 0 && (
          <p className="text-xs text-slate-400">
            No documents uploaded yet.
          </p>
        )}

      <div className="space-y-2">
        {documents.map((document) => (
          <div
            key={document.id}
            className="p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between"
          >
            <a
              href={document.file_url}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:text-teal-600"
            >
              {document.file_name}
            </a>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[10px] font-bold uppercase ${
                  document.verified
                    ? "text-teal-600"
                    : "text-slate-400"
                }`}
              >
                {document.verified
                  ? "Verified"
                  : "Pending"}
              </span>

              <button
                onClick={() =>
                  handleDelete(
                    document.id
                  )
                }
                className="text-slate-400 hover:text-red-500"
              >
                <FaTrash className="text-[11px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MESSAGES TAB
========================================================= */

function MessagesTab({
  customer,
  loading,
  error,
  messages,
  onSent,
}) {
  const [text, setText] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [sendError, setSendError] =
    useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    setSending(true);
    setSendError("");

    try {
      const res = await api.post(
        `admin/customers/${customer.rawId}/messages/`,
        {
          message: text.trim(),
        }
      );

      onSent(
        res.data?.message ||
          res.data
      );

      setText("");
    } catch (err) {
      setSendError(
        err?.response?.data?.detail ||
          "Unable to send this message."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <h5 className="text-xs font-black uppercase text-slate-400">
        Message & Notification History
      </h5>

      <form
        onSubmit={handleSend}
        className="flex items-start gap-2"
      >
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Write a message to this customer..."
          rows={2}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={sending}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-60 shrink-0"
        >
          <FaPaperPlane className="text-xs" />
        </button>
      </form>

      {sendError && (
        <p className="text-[11px] text-red-500">
          {sendError}
        </p>
      )}

      {loading && (
        <p className="text-xs text-slate-400">
          Loading…
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        messages.length === 0 && (
          <p className="text-xs text-slate-400">
            No messages yet.
          </p>
        )}

      <div className="space-y-2.5">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
          >
            <p className="font-bold text-slate-800">
              {message.sender_name}
            </p>

            <p className="text-slate-600 mt-1 whitespace-pre-line">
              {message.message}
            </p>

            <p className="text-slate-400 text-[10px] mt-1">
              {message.created_at
                ? new Date(
                    message.created_at
                  ).toLocaleString()
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}