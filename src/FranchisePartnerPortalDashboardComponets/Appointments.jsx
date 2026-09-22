import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaCalendarAlt,
  FaListUl,
  FaUserClock,
  FaUsers,
  FaHistory,
  FaShieldAlt,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

/* =========================================================
   DATE HELPERS
   ========================================================= */

const pad = (value) => String(value).padStart(2, "0");

const getLocalDateString = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const parseDateOnly = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = String(dateString)
    .split("-")
    .map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return getLocalDateString(date);
};

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const startOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);

  return result;
};

const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getMonthCalendarDays = (date) => {
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);

  const firstCalendarDay = new Date(firstDay);
  firstCalendarDay.setDate(
    firstDay.getDate() - firstDay.getDay()
  );

  const lastCalendarDay = new Date(lastDay);
  lastCalendarDay.setDate(
    lastDay.getDate() + (6 - lastDay.getDay())
  );

  const days = [];

  const cursor = new Date(firstCalendarDay);

  while (cursor <= lastCalendarDay) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Appointments() {
  const [activeView, setActiveView] = useState("calendar");

  const [calendarMode, setCalendarMode] = useState("month");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [showLifecycleModal, setShowLifecycleModal] =
    useState(false);

  const [showSafeguardsModal, setShowSafeguardsModal] =
    useState(false);

  const [showNewAppointmentModal, setShowNewAppointmentModal] =
    useState(false);

  const [showAppointmentDetails, setShowAppointmentDetails] =
    useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  // ---- staff assignment (from appointment details modal) ----
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  // ---- invoice generation (from appointment details modal) ----
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    amount: "",
    description: "",
  });
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");

  const [appointmentsList, setAppointmentsList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    service: "Personal Care Support",
    date: "",
    time: "",
    staff: "",
  });

  /* =========================================================
     CUSTOMER NAME
     ========================================================= */

  const getCustomerName = useCallback((customer) => {
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
  }, []);

  /* =========================================================
     EMPLOYEE NAME
     ========================================================= */

  const getEmployeeName = useCallback((employee) => {
    if (!employee) return "Unassigned";

    return (
      employee.full_name ||
      employee.name ||
      `${employee.first_name || ""} ${
        employee.last_name || ""
      }`.trim() ||
      employee.email ||
      `Employee #${employee.id}`
    );
  }, []);

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "—";

    const date = parseDateOnly(dateString);

    if (!date) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  /* =========================================================
     FORMAT TIME
     ========================================================= */

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "Time not set";

    const parts = String(timeString).split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours)) {
      return timeString;
    }

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes} ${suffix}`;
  }, []);

  /* =========================================================
     LOAD CUSTOMERS
     ========================================================= */

  const fetchCustomers = useCallback(async () => {
    const response = await api.get("/admin/customers/");

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.results || [];

    setCustomers(data);

    return data;
  }, []);

  /* =========================================================
     LOAD EMPLOYEES
     ========================================================= */

  const fetchEmployees = useCallback(async () => {
    const response = await api.get("/admin/employees/");

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.results || [];

    const activeEmployees = data.filter(
      (employee) =>
        !employee.status ||
        employee.status === "Active"
    );

    setEmployees(activeEmployees);

    return activeEmployees;
  }, []);

  /* =========================================================
     LOAD APPOINTMENTS
     ========================================================= */

  const fetchAppointments = useCallback(
    async (customerList) => {
      if (!customerList || customerList.length === 0) {
        setAppointmentsList([]);
        return [];
      }

      const appointmentRequests = customerList.map(
        async (customer) => {
          try {
            const response = await api.get(
              `/admin/customers/${customer.id}/appointments/`
            );

            const data = Array.isArray(response.data)
              ? response.data
              : response.data?.results || [];

            return data.map((appointment) => ({
              ...appointment,
              customer_id: customer.id,
              customer_name: getCustomerName(customer),
            }));
          } catch (err) {
            console.error(
              `Failed to load appointments for customer ${customer.id}`,
              err
            );

            return [];
          }
        }
      );

      const results = await Promise.all(
        appointmentRequests
      );

      const flattened = results.flat();

      flattened.sort((a, b) => {
        const dateA = `${a.scheduled_date || ""} ${
          a.scheduled_time || ""
        }`;

        const dateB = `${b.scheduled_date || ""} ${
          b.scheduled_time || ""
        }`;

        return dateA.localeCompare(dateB);
      });

      setAppointmentsList(flattened);

      return flattened;
    },
    [getCustomerName]
  );

  /* =========================================================
     LOAD EVERYTHING
     ========================================================= */

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const customerList = await fetchCustomers();

      await Promise.all([
        fetchEmployees(),
        fetchAppointments(customerList),
      ]);
    } catch (err) {
      console.error(
        "Appointments loading error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load appointment data."
      );
    } finally {
      setLoading(false);
    }
  }, [
    fetchCustomers,
    fetchEmployees,
    fetchAppointments,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =========================================================
     OPEN NEW APPOINTMENT
     ========================================================= */

  const openNewAppointmentModal = async () => {
    setError("");
    setSuccessMessage("");

    setNewAppointment({
      customer: "",
      service: "Personal Care Support",
      date: getLocalDateString(),
      time: "",
      staff: "",
    });

    setShowNewAppointmentModal(true);
    setLoadingFormData(true);

    try {
      await Promise.all([
        fetchCustomers(),
        fetchEmployees(),
      ]);
    } catch (err) {
      console.error(
        "Failed to refresh appointment form data:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load customers or employees."
      );
    } finally {
      setLoadingFormData(false);
    }
  };

  /* =========================================================
     CREATE APPOINTMENT
     ========================================================= */

  const handleCreateAppointmentSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!newAppointment.customer) {
      setError("Please select a customer.");
      return;
    }

    if (!newAppointment.date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!newAppointment.time) {
      setError("Please select an appointment time.");
      return;
    }

    setSaving(true);

    try {
      const notes = `Service: ${newAppointment.service}`;

      const payload = {
        scheduled_date: newAppointment.date,
        scheduled_time: newAppointment.time,
        notes,
        status: "Scheduled",
      };

      if (newAppointment.staff) {
        payload.employee = Number(
          newAppointment.staff
        );
      }

      const response = await api.post(
        `/admin/customers/${newAppointment.customer}/appointments/`,
        payload
      );

      const selectedCustomer = customers.find(
        (customer) =>
          Number(customer.id) ===
          Number(newAppointment.customer)
      );

      const createdAppointment = {
        ...response.data,
        customer_id: Number(
          newAppointment.customer
        ),
        customer_name:
          getCustomerName(selectedCustomer),
      };

      setAppointmentsList((previous) => [
        ...previous,
        createdAppointment,
      ]);

      setNewAppointment({
        customer: "",
        service: "Personal Care Support",
        date: "",
        time: "",
        staff: "",
      });

      setShowNewAppointmentModal(false);

      setSuccessMessage(
        "Appointment created successfully."
      );

      await loadData();

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      console.error(
        "Create appointment error:",
        err
      );

      const backendError =
        err?.response?.data;

      let message =
        "Unable to create appointment.";

      if (backendError?.detail) {
        message = backendError.detail;
      } else if (backendError?.message) {
        message = backendError.message;
      } else if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError =
          Object.values(backendError)[0];

        if (Array.isArray(firstError)) {
          message = firstError[0];
        } else if (
          typeof firstError === "string"
        ) {
          message = firstError;
        }
      }

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     APPOINTMENT HELPERS
     ========================================================= */

  const getAppointmentService = useCallback(
    (appointment) => {
      if (!appointment?.notes) {
        return "Service not specified";
      }

      const match =
        appointment.notes.match(
          /^Service:\s*(.+)$/i
        );

      if (match) {
        return match[1];
      }

      return appointment.notes;
    },
    []
  );

  const getAppointmentStaff = useCallback(
    (appointment) => {
      if (!appointment?.employee) {
        return "Unassigned";
      }

      return (
        appointment.employee_name ||
        `Employee #${appointment.employee}`
      );
    },
    []
  );

  const getAppointmentStatus = useCallback(
    (appointment) => {
      if (appointment.status === "Completed") {
        return "Completed";
      }

      if (appointment.status === "Cancelled") {
        return "Cancelled";
      }

      if (!appointment.employee) {
        return "Request Queue";
      }

      return "Confirmed";
    },
    []
  );

  /* =========================================================
     STATUS STYLE
     ========================================================= */

  const getStatusClasses = (status) => {
    if (status === "Completed") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (status === "Request Queue") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  /* =========================================================
     APPOINTMENTS FOR DATE
     ========================================================= */

  const getAppointmentsForDate = useCallback(
    (date) => {
      const key = formatDateKey(date);

      return appointmentsList
        .filter(
          (appointment) =>
            appointment.scheduled_date === key
        )
        .sort((a, b) =>
          String(
            a.scheduled_time || ""
          ).localeCompare(
            String(b.scheduled_time || "")
          )
        );
    },
    [appointmentsList]
  );

  /* =========================================================
     CALENDAR TITLE
     ========================================================= */

  const calendarTitle = useMemo(() => {
    if (calendarMode === "day") {
      return calendarDate.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );
    }

    if (calendarMode === "week") {
      const start = startOfWeek(calendarDate);
      const end = addDays(start, 6);

      const startText =
        start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

      const endText =
        end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

      return `${startText} – ${endText}`;
    }

    return calendarDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [calendarDate, calendarMode]);

  /* =========================================================
     CALENDAR NAVIGATION
     ========================================================= */

  const moveCalendar = (direction) => {
    const next = new Date(calendarDate);

    if (calendarMode === "day") {
      next.setDate(
        next.getDate() + direction
      );
    } else if (calendarMode === "week") {
      next.setDate(
        next.getDate() + direction * 7
      );
    } else {
      next.setMonth(
        next.getMonth() + direction
      );
    }

    setCalendarDate(next);
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  /* =========================================================
     OPEN APPOINTMENT DETAILS
     ========================================================= */

  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedStaffId(
      appointment.employee ? String(appointment.employee) : ""
    );
    setAssignError("");
    setInvoiceError("");
    setShowAppointmentDetails(true);
  };

  /* =========================================================
     ASSIGN / REASSIGN STAFF (from details modal)
     ========================================================= */

  const handleAssignStaff = async () => {
    if (!selectedAppointment) return;

    if (!selectedStaffId) {
      setAssignError("Please choose a staff member.");
      return;
    }

    setAssignSaving(true);
    setAssignError("");

    try {
      const response = await api.patch(
        `/admin/appointments/${selectedAppointment.id}/`,
        { employee: Number(selectedStaffId) }
      );

      const updated = {
        ...response.data.appointment,
        customer_id: selectedAppointment.customer_id,
        customer_name: selectedAppointment.customer_name,
      };

      setAppointmentsList((previous) =>
        previous.map((appointment) =>
          appointment.id === updated.id
            ? { ...appointment, ...updated }
            : appointment
        )
      );

      setSelectedAppointment(updated);

      // Assigning staff never auto-creates an invoice — billing is a
      // separate, deliberate step below ("Generate Invoice") so the
      // franchise can enter the actual price first.
      setSuccessMessage(
        "Staff assigned successfully. You can now generate an invoice "
          + "for this appointment if it needs billing."
      );

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Assign staff error:", err);
      setAssignError(
        err?.response?.data?.detail ||
          err?.response?.data?.employee?.[0] ||
          "Unable to assign staff member."
      );
    } finally {
      setAssignSaving(false);
    }
  };

  /* =========================================================
     GENERATE INVOICE (from details modal)
     ========================================================= */

  const openInvoiceModal = () => {
    if (!selectedAppointment) return;

    setInvoiceForm({
      amount: "",
      description: `${getAppointmentService(
        selectedAppointment
      )} - ${selectedAppointment.scheduled_date || ""}`,
    });

    setInvoiceError("");
    setShowInvoiceModal(true);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) return;

    if (!invoiceForm.amount || Number(invoiceForm.amount) <= 0) {
      setInvoiceError("Please enter a valid amount.");
      return;
    }

    setInvoiceSaving(true);
    setInvoiceError("");

    try {
      const response = await api.post(
        `/admin/customers/${selectedAppointment.customer_id}/invoices/`,
        {
          amount: invoiceForm.amount,
          description: invoiceForm.description,
          appointment: selectedAppointment.id,
          status: "Pending",
        }
      );

      const invoice = response.data.invoice;

      const updatedAppointment = {
        ...selectedAppointment,
        invoice_id: invoice?.id,
        invoice_status: invoice?.status,
      };

      setSelectedAppointment(updatedAppointment);

      setAppointmentsList((previous) =>
        previous.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? { ...appointment, ...updatedAppointment }
            : appointment
        )
      );

      setShowInvoiceModal(false);

      setSuccessMessage(
        `Invoice created — the customer will see a ${formatMoney(
          invoiceForm.amount
        )} invoice for this appointment and can pay it under Invoices & Payments.`
      );

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Create invoice error:", err);
      setInvoiceError(
        err?.response?.data?.detail ||
          err?.response?.data?.amount?.[0] ||
          "Unable to create invoice."
      );
    } finally {
      setInvoiceSaving(false);
    }
  };

  /* =========================================================
     DAY VIEW
     ========================================================= */

  const renderDayCalendar = () => {
    const appointments =
      getAppointmentsForDate(calendarDate);

    const hours = Array.from(
      { length: 24 },
      (_, index) => index
    );

    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Day Schedule
              </p>

              <h5 className="text-sm font-black text-slate-900">
                {calendarDate.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </h5>
            </div>

            <span className="text-[11px] font-bold text-teal-700">
              {appointments.length} appointment
              {appointments.length === 1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        <div className="max-h-155 overflow-y-auto">
          {hours.map((hour) => {
            const hourAppointments =
              appointments.filter((appointment) => {
                if (
                  !appointment.scheduled_time
                ) {
                  return false;
                }

                const appointmentHour =
                  Number(
                    String(
                      appointment.scheduled_time
                    ).split(":")[0]
                  );

                return appointmentHour === hour;
              });

            const hourLabel = new Date(
              2026,
              0,
              1,
              hour,
              0
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <div
                key={hour}
                className="grid grid-cols-[80px_1fr] min-h-18.5 border-b border-slate-100"
              >
                <div className="border-r border-slate-100 bg-slate-50/50 px-3 py-3 text-right">
                  <span className="text-[10px] font-bold text-slate-400">
                    {hourLabel}
                  </span>
                </div>

                <div className="p-2 space-y-2">
                  {hourAppointments.map(
                    (appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() =>
                          openAppointmentDetails(
                            appointment
                          )
                        }
                        className="w-full text-left rounded-xl border border-teal-100 bg-teal-50/70 p-3 hover:bg-teal-50 hover:border-teal-200 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {getCustomerName({
                                full_name:
                                  appointment.customer_name,
                                id: appointment.customer_id,
                              })}
                            </p>

                            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                              {getAppointmentService(
                                appointment
                              )}
                            </p>
                          </div>

                          <span className="text-[10px] font-bold text-slate-500">
                            {formatTime(
                              appointment.scheduled_time
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] bg-white border border-slate-200 rounded-full px-2 py-1 text-slate-600">
                            {getAppointmentStaff(
                              appointment
                            )}
                          </span>

                          <span
                            className={`text-[10px] rounded-full border px-2 py-1 font-bold ${getStatusClasses(
                              getAppointmentStatus(
                                appointment
                              )
                            )}`}
                          >
                            {getAppointmentStatus(
                              appointment
                            )}
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =========================================================
     WEEK VIEW
     ========================================================= */

  const renderWeekCalendar = () => {
    const weekStart =
      startOfWeek(calendarDate);

    const weekDays = Array.from(
      { length: 7 },
      (_, index) =>
        addDays(weekStart, index)
    );

    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <div className="min-w-225">
            <div className="grid grid-cols-7 border-b border-slate-200">
              {weekDays.map((day) => {
                const dateKey =
                  formatDateKey(day);

                const isToday =
                  dateKey ===
                  getLocalDateString();

                const dayAppointments =
                  getAppointmentsForDate(day);

                return (
                  <div
                    key={dateKey}
                    className={`min-h-27.5 border-r border-slate-100 last:border-r-0 p-3 ${
                      isToday
                        ? "bg-teal-50/40"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {day.toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                            }
                          )}
                        </p>

                        <p
                          className={`text-lg font-black ${
                            isToday
                              ? "text-teal-700"
                              : "text-slate-900"
                          }`}
                        >
                          {day.getDate()}
                        </p>
                      </div>

                      {isToday && (
                        <span className="text-[9px] font-black bg-teal-600 text-white px-1.5 py-0.5 rounded-full">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      {dayAppointments.length ===
                      0 ? (
                        <p className="text-[10px] text-slate-300">
                          No appointments
                        </p>
                      ) : (
                        dayAppointments.map(
                          (appointment) => (
                            <button
                              key={
                                appointment.id
                              }
                              onClick={() =>
                                openAppointmentDetails(
                                  appointment
                                )
                              }
                              className="w-full text-left rounded-lg border border-teal-100 bg-teal-50 p-2 hover:bg-teal-100 transition"
                            >
                              <p className="text-[10px] font-black text-teal-800 truncate">
                                {formatTime(
                                  appointment.scheduled_time
                                )}
                              </p>

                              <p className="text-[10px] font-bold text-slate-800 truncate mt-0.5">
                                {
                                  appointment.customer_name
                                }
                              </p>

                              <p className="text-[9px] text-slate-500 truncate">
                                {getAppointmentService(
                                  appointment
                                )}
                              </p>
                            </button>
                          )
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 font-semibold">
                Click an appointment to view its
                details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     MONTH VIEW
     ========================================================= */

  const renderMonthCalendar = () => {
    const days =
      getMonthCalendarDays(calendarDate);

    const weekLabels = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {weekLabels.map((label) => (
            <div
              key={label}
              className="py-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 border-r border-slate-100 last:border-r-0"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dateKey =
              formatDateKey(day);

            const isCurrentMonth =
              day.getMonth() ===
              calendarDate.getMonth();

            const isToday =
              dateKey ===
              getLocalDateString();

            const dayAppointments =
              getAppointmentsForDate(day);

            return (
              <div
                key={dateKey}
                className={`min-h-32.5 border-r border-b border-slate-100 p-2 ${
                  !isCurrentMonth
                    ? "bg-slate-50/60"
                    : "bg-white"
                } ${
                  isToday
                    ? "ring-2 ring-inset ring-teal-100"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black ${
                      isToday
                        ? "bg-teal-600 text-white"
                        : isCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-300"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {dayAppointments.length >
                    0 && (
                    <span className="text-[9px] font-bold text-teal-600">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                <div className="mt-2 space-y-1.5">
                  {dayAppointments
                    .slice(0, 4)
                    .map((appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() =>
                          openAppointmentDetails(
                            appointment
                          )
                        }
                        className="w-full text-left rounded-lg border border-teal-100 bg-teal-50 px-2 py-1.5 hover:bg-teal-100 transition"
                      >
                        <p className="text-[9px] font-black text-teal-800 truncate">
                          {formatTime(
                            appointment.scheduled_time
                          )}
                        </p>

                        <p className="text-[9px] font-bold text-slate-700 truncate">
                          {
                            appointment.customer_name
                          }
                        </p>
                      </button>
                    ))}

                  {dayAppointments.length >
                    4 && (
                    <p className="text-[9px] text-slate-400 font-semibold px-1">
                      +
                      {dayAppointments.length -
                        4}{" "}
                      more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =========================================================
     CALENDAR VIEW
     ========================================================= */

  const renderCalendar = () => {
    return (
      <div className="space-y-4">
        {/* CALENDAR CONTROLS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  moveCalendar(-1)
                }
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
                title="Previous"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <button
                onClick={goToToday}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Today
              </button>

              <button
                onClick={() =>
                  moveCalendar(1)
                }
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
                title="Next"
              >
                <FaChevronRight className="text-xs" />
              </button>

              <div className="ml-1 sm:ml-3">
                <h5 className="text-sm sm:text-base font-black text-slate-900">
                  {calendarTitle}
                </h5>

                <p className="text-[10px] text-slate-400">
                  {appointmentsList.length} total
                  appointment
                  {appointmentsList.length ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>
            </div>

            {/* DAY / WEEK / MONTH */}

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 self-start lg:self-auto">
              {[
                {
                  key: "day",
                  label: "Day",
                },
                {
                  key: "week",
                  label: "Week",
                },
                {
                  key: "month",
                  label: "Month",
                },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() =>
                    setCalendarMode(
                      mode.key
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition ${
                    calendarMode ===
                    mode.key
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CALENDAR */}

        {calendarMode === "day" &&
          renderDayCalendar()}

        {calendarMode === "week" &&
          renderWeekCalendar()}

        {calendarMode === "month" &&
          renderMonthCalendar()}

        {/* LEGEND */}

        <div className="flex flex-wrap items-center gap-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500 font-semibold">
              Confirmed
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] text-slate-500 font-semibold">
              Request Queue
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] text-slate-500 font-semibold">
              Completed
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] text-slate-500 font-semibold">
              Cancelled
            </span>
          </div>
        </div>
      </div>
    );
  };

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
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Appointments & Scheduling
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Manage calendars, unassigned request
            queues, staff availability, and
            customer histories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() =>
              setShowLifecycleModal(true)
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle
              className="text-[11px]"
              style={{
                color: BRAND_COLOR,
              }}
            />

            <span>Lifecycle Guide</span>
          </button>

          <button
            onClick={() =>
              setShowSafeguardsModal(true)
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaShieldAlt className="text-[11px] text-teal-600" />

            <span>Safeguards</span>
          </button>

          <button
            onClick={openNewAppointmentModal}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />

            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          SUCCESS
          ===================================================== */}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700"
          >
            <FaCheckCircle />

            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ERROR
          ===================================================== */}

      <AnimatePresence>
        {error &&
          !showNewAppointmentModal && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
            >
              <FaExclamationTriangle className="mt-0.5 shrink-0" />

              <span>{error}</span>

              <button
                onClick={() =>
                  setError("")
                }
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
      </AnimatePresence>

      {/* =====================================================
          PRIMARY TABS
          ===================================================== */}

      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          {
            key: "calendar",
            label: "Calendar",
            icon: <FaCalendarAlt />,
          },
          {
            key: "agenda",
            label: "Agenda / List View",
            icon: <FaListUl />,
          },
          {
            key: "queue",
            label: "Unassigned Request Queue",
            icon: <FaUserClock />,
          },
          {
            key: "staff",
            label: "Staff Availability",
            icon: <FaUsers />,
          },
          {
            key: "history",
            label: "Customer History",
            icon: <FaHistory />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveView(tab.key)
            }
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
              activeView === tab.key
                ? "border-teal-600 text-teal-700 bg-teal-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon}

            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =====================================================
          VIEW TITLE
          ===================================================== */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {activeView === "calendar" &&
              "Interactive Calendar"}

            {activeView === "agenda" &&
              "Agenda & List View"}

            {activeView === "queue" &&
              "Unassigned Request Queue"}

            {activeView === "staff" &&
              "Staff Availability View"}

            {activeView === "history" &&
              "Customer Schedule History"}
          </h4>

          <span className="text-[11px] text-slate-400 font-medium">
            Franchise Local Portal Mode
          </span>
        </div>

        {/* ===================================================
            LOADING
            =================================================== */}

        {loading ? (
          <div className="p-12 rounded-2xl border border-slate-200/80 bg-white text-center shadow-2xs">
            <FaSpinner className="animate-spin text-2xl text-teal-600 mx-auto mb-3" />

            <p className="text-xs font-semibold text-slate-500">
              Loading appointments...
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                CALENDAR
                ================================================= */}

            {activeView === "calendar" &&
              renderCalendar()}

            {/* =================================================
                AGENDA / QUEUE / HISTORY
                ================================================= */}

            {(activeView === "agenda" ||
              activeView === "queue" ||
              activeView === "history") && (
              <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">
                          ID
                        </th>

                        <th className="py-3.5 px-4">
                          Customer
                        </th>

                        <th className="py-3.5 px-4">
                          Service
                        </th>

                        <th className="py-3.5 px-4">
                          Date & Time
                        </th>

                        <th className="py-3.5 px-4">
                          Assigned Staff
                        </th>

                        <th className="py-3.5 px-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs">
                      {appointmentsList
                        .filter(
                          (appointment) => {
                            if (
                              activeView ===
                              "queue"
                            ) {
                              return !appointment.employee;
                            }

                            return true;
                          }
                        )
                        .map((apt) => {
                          const status =
                            getAppointmentStatus(
                              apt
                            );

                          return (
                            <tr
                              key={apt.id}
                              onClick={() =>
                                openAppointmentDetails(
                                  apt
                                )
                              }
                              className="hover:bg-slate-50/60 transition cursor-pointer"
                            >
                              <td className="py-3.5 px-4 font-bold text-slate-900">
                                APT-
                                {String(
                                  apt.id
                                ).padStart(
                                  3,
                                  "0"
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-slate-700 font-medium">
                                {apt.customer_name ||
                                  "Unknown Customer"}
                              </td>

                              <td className="py-3.5 px-4 text-slate-600">
                                {getAppointmentService(
                                  apt
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-slate-700 font-medium">
                                {formatDate(
                                  apt.scheduled_date
                                )}

                                {" ("}

                                {formatTime(
                                  apt.scheduled_time
                                )}

                                {")"}
                              </td>

                              <td className="py-3.5 px-4 text-slate-600">
                                {getAppointmentStaff(
                                  apt
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusClasses(
                                    status
                                  )}`}
                                >
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {appointmentsList.filter(
                    (appointment) =>
                      activeView === "queue"
                        ? !appointment.employee
                        : true
                  ).length === 0 && (
                    <div className="py-12 text-center">
                      <FaCalendarAlt className="text-2xl text-slate-300 mx-auto mb-3" />

                      <p className="text-xs font-semibold text-slate-500">
                        No appointments found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                STAFF
                ================================================= */}

            {activeView === "staff" && (
              <>
                {employees.length ===
                0 ? (
                  <div className="p-10 rounded-2xl border border-slate-200/80 bg-white text-center shadow-2xs">
                    <FaUsers className="text-3xl text-slate-300 mx-auto mb-3" />

                    <p className="text-xs font-semibold text-slate-500">
                      No active employees found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map(
                      (employee) => {
                        const assignedCount =
                          appointmentsList.filter(
                            (appointment) =>
                              Number(
                                appointment.employee
                              ) ===
                              Number(
                                employee.id
                              )
                          ).length;

                        return (
                          <div
                            key={
                              employee.id
                            }
                            className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h5 className="font-bold text-slate-900 text-sm">
                                {getEmployeeName(
                                  employee
                                )}
                              </h5>

                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                {employee.status ||
                                  "Active"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500">
                              {employee.job_role ||
                                employee.role ||
                                "Staff Member"}
                            </p>

                            <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                              <FaClock />

                              {
                                assignedCount
                              }{" "}
                              appointment
                              {assignedCount ===
                              1
                                ? ""
                                : "s"}{" "}
                              assigned
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* =====================================================
          APPOINTMENT DETAILS MODAL
          ===================================================== */}

      <AnimatePresence>
        {showAppointmentDetails &&
          selectedAppointment && (
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
                  setShowAppointmentDetails(
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
                className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-black text-teal-600">
                      Appointment
                    </p>

                    <h4 className="text-base font-black text-slate-900">
                      APT-
                      {String(
                        selectedAppointment.id
                      ).padStart(3, "0")}
                    </h4>
                  </div>

                  <button
                    onClick={() =>
                      setShowAppointmentDetails(
                        false
                      )
                    }
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                        <FaUser />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Customer
                        </p>

                        <p className="text-sm font-black text-slate-900">
                          {selectedAppointment.customer_name ||
                            "Unknown Customer"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Service
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {getAppointmentService(
                          selectedAppointment
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Status
                      </p>

                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusClasses(
                          getAppointmentStatus(
                            selectedAppointment
                          )
                        )}`}
                      >
                        {getAppointmentStatus(
                          selectedAppointment
                        )}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Date
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {formatDate(
                          selectedAppointment.scheduled_date
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Time
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {formatTime(
                          selectedAppointment.scheduled_time
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <FaBriefcase />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Assigned Staff
                        </p>

                        <p className="text-xs font-bold text-slate-800">
                          {getAppointmentStaff(
                            selectedAppointment
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ---- ASSIGN / REASSIGN STAFF ---- */}
                  {selectedAppointment.status !== "Cancelled" && (
                    <div className="rounded-xl border border-slate-100 p-4 space-y-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {selectedAppointment.employee
                          ? "Reassign Staff"
                          : "Assign Staff"}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={selectedStaffId}
                          onChange={(e) =>
                            setSelectedStaffId(e.target.value)
                          }
                          disabled={assignSaving}
                          className="flex-1 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                        >
                          <option value="">
                            Select staff member
                          </option>
                          {employees.map((employee) => (
                            <option
                              key={employee.id}
                              value={employee.id}
                            >
                              {getEmployeeName(employee)}
                              {employee.job_role
                                ? ` — ${employee.job_role}`
                                : ""}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={handleAssignStaff}
                          disabled={assignSaving}
                          className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60"
                        >
                          {assignSaving && (
                            <FaSpinner className="animate-spin" />
                          )}
                          {selectedAppointment.employee
                            ? "Reassign"
                            : "Assign"}
                        </button>
                      </div>

                      {assignError && (
                        <p className="text-[10px] font-semibold text-rose-600">
                          {assignError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ---- BILLING / GENERATE INVOICE ---- */}
                  {selectedAppointment.status !== "Cancelled" &&
                    selectedAppointment.employee && (
                      <div className="rounded-xl border border-slate-100 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Billing
                          </p>

                          {selectedAppointment.invoice_status && (
                            <span className="text-[10px] font-bold text-teal-700 flex items-center gap-1">
                              <FaFileInvoiceDollar />
                              {selectedAppointment.invoice_status}
                            </span>
                          )}
                        </div>

                        {selectedAppointment.invoice_id ? (
                          <p className="text-xs text-slate-600">
                            An invoice has already been generated for this
                            appointment. Once the customer pays it, they'll
                            get a receipt automatically.
                          </p>
                        ) : (
                          <>
                            <p className="text-xs text-slate-600">
                              No invoice yet. Enter a price to bill the
                              customer for this appointment — it will
                              appear under their "Invoices & Payments" and
                              they'll receive a receipt once they pay.
                            </p>

                            <button
                              type="button"
                              onClick={openInvoiceModal}
                              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                            >
                              <FaFileInvoiceDollar className="text-[11px]" />
                              Generate Invoice
                            </button>
                          </>
                        )}
                      </div>
                    )}

                  {selectedAppointment.notes && (
                    <div className="rounded-xl border border-slate-100 p-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Notes
                      </p>

                      <p className="text-xs text-slate-600 leading-5">
                        {
                          selectedAppointment.notes
                        }
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setShowAppointmentDetails(
                        false
                      )
                    }
                    className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>

      {/* =====================================================
          GENERATE INVOICE MODAL
          ===================================================== */}

      <AnimatePresence>
        {showInvoiceModal && selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                !invoiceSaving && setShowInvoiceModal(false)
              }
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-black text-teal-600">
                    APT-
                    {String(selectedAppointment.id).padStart(3, "0")}
                  </p>
                  <h4 className="text-base font-black text-slate-900">
                    Generate Invoice
                  </h4>
                </div>

                <button
                  onClick={() =>
                    !invoiceSaving && setShowInvoiceModal(false)
                  }
                  disabled={invoiceSaving}
                  className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>

              {invoiceError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                  <FaExclamationTriangle className="mt-0.5 shrink-0" />
                  <span>{invoiceError}</span>
                </div>
              )}

              <form
                onSubmit={handleCreateInvoice}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        amount: e.target.value,
                      })
                    }
                    disabled={invoiceSaving}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={invoiceForm.description}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        description: e.target.value,
                      })
                    }
                    disabled={invoiceSaving}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    placeholder="What this invoice is for"
                  />
                </div>

                <p className="text-[10px] text-slate-400">
                  The invoice is created as Pending. The customer sees it
                  under "Invoices & Payments" and gets a receipt
                  automatically once they pay it.
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    disabled={invoiceSaving}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={invoiceSaving || !invoiceForm.amount}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {invoiceSaving && (
                      <FaSpinner className="animate-spin" />
                    )}
                    {invoiceSaving ? "Creating..." : "Create Invoice"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          NEW APPOINTMENT MODAL
          ===================================================== */}

      <AnimatePresence>
        {showNewAppointmentModal && (
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
                !saving &&
                setShowNewAppointmentModal(
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
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Schedule New Appointment
                </h4>

                <button
                  onClick={() =>
                    !saving &&
                    setShowNewAppointmentModal(
                      false
                    )
                  }
                  disabled={saving}
                  className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                  <FaExclamationTriangle className="mt-0.5 shrink-0" />

                  <span>{error}</span>
                </div>
              )}

              {loadingFormData ? (
                <div className="py-10 text-center">
                  <FaSpinner className="animate-spin text-xl text-teal-600 mx-auto mb-3" />

                  <p className="text-xs font-semibold text-slate-500">
                    Loading customers and
                    staff...
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={
                    handleCreateAppointmentSubmit
                  }
                  className="space-y-4 text-xs"
                >
                  {/* CUSTOMER */}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Customer
                    </label>

                    <select
                      required
                      value={
                        newAppointment.customer
                      }
                      onChange={(e) =>
                        setNewAppointment(
                          {
                            ...newAppointment,
                            customer:
                              e.target
                                .value,
                          }
                        )
                      }
                      disabled={saving}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    >
                      <option value="">
                        Select customer
                      </option>

                      {customers.map(
                        (customer) => (
                          <option
                            key={
                              customer.id
                            }
                            value={
                              customer.id
                            }
                          >
                            {getCustomerName(
                              customer
                            )}

                            {customer.email
                              ? ` — ${customer.email}`
                              : ""}
                          </option>
                        )
                      )}
                    </select>

                    {customers.length ===
                      0 && (
                      <p className="text-[10px] text-amber-600 mt-1">
                        No customers are
                        available in your
                        franchise.
                      </p>
                    )}
                  </div>

                  {/* SERVICE */}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Service Type
                    </label>

                    <select
                      value={
                        newAppointment.service
                      }
                      onChange={(e) =>
                        setNewAppointment(
                          {
                            ...newAppointment,
                            service:
                              e.target
                                .value,
                          }
                        )
                      }
                      disabled={saving}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    >
                      <option value="Personal Care Support">
                        Personal Care
                        Support
                      </option>

                      <option value="Companionship & Living Assistance">
                        Companionship &
                        Living
                        Assistance
                      </option>

                      <option value="Skilled Nursing Care">
                        Skilled Nursing
                        Care
                      </option>
                    </select>
                  </div>

                  {/* DATE */}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Date
                    </label>

                    <input
                      type="date"
                      required
                      value={
                        newAppointment.date
                      }
                      onChange={(e) =>
                        setNewAppointment(
                          {
                            ...newAppointment,
                            date: e.target
                              .value,
                          }
                        )
                      }
                      disabled={saving}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    />
                  </div>

                  {/* TIME */}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Appointment Time
                    </label>

                    <input
                      type="time"
                      required
                      value={
                        newAppointment.time
                      }
                      onChange={(e) =>
                        setNewAppointment(
                          {
                            ...newAppointment,
                            time: e.target
                              .value,
                          }
                        )
                      }
                      disabled={saving}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    />

                    <p className="text-[10px] text-slate-400 mt-1">
                      Select the appointment
                      start time.
                    </p>
                  </div>

                  {/* STAFF */}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Assign Staff
                    </label>

                    <select
                      value={
                        newAppointment.staff
                      }
                      onChange={(e) =>
                        setNewAppointment(
                          {
                            ...newAppointment,
                            staff: e.target
                              .value,
                          }
                        )
                      }
                      disabled={saving}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 disabled:opacity-60"
                    >
                      <option value="">
                        Unassigned — Send
                        to Request Queue
                      </option>

                      {employees.map(
                        (employee) => (
                          <option
                            key={
                              employee.id
                            }
                            value={
                              employee.id
                            }
                          >
                            {getEmployeeName(
                              employee
                            )}

                            {employee.job_role
                              ? ` — ${employee.job_role}`
                              : ""}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* BUTTONS */}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowNewAppointmentModal(
                          false
                        )
                      }
                      disabled={saving}
                      className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        !newAppointment.customer ||
                        !newAppointment.date ||
                        !newAppointment.time
                      }
                      className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving && (
                        <FaSpinner className="animate-spin" />
                      )}

                      {saving
                        ? "Saving..."
                        : "Save Appointment"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          LIFECYCLE MODAL
          ===================================================== */}

      <AnimatePresence>
        {showLifecycleModal && (
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
                setShowLifecycleModal(
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
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Appointment Lifecycle
                </h4>

                <button
                  onClick={() =>
                    setShowLifecycleModal(
                      false
                    )
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                {[
                  "New request received.",
                  "Request reviewed and service/location confirmed.",
                  "Eligible staff and availability checked.",
                  "Appointment created.",
                  "Customer/staff notified.",
                  "Appointment can be rescheduled/cancelled according to rules.",
                  "Staff marks service started/completed where applicable.",
                  "System records completion and triggers the next billing step.",
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">
                      {idx + 1}
                    </span>

                    <span className="font-semibold text-slate-800">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() =>
                    setShowLifecycleModal(
                      false
                    )
                  }
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          SAFEGUARDS MODAL
          ===================================================== */}

      <AnimatePresence>
        {showSafeguardsModal && (
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
                setShowSafeguardsModal(
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
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Scheduling Safeguards
                </h4>

                <button
                  onClick={() =>
                    setShowSafeguardsModal(
                      false
                    )
                  }
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                {[
                  "Prevent double booking.",
                  "Warn about staff availability conflicts.",
                  "Respect franchise operating hours.",
                  "Respect service eligibility and staff qualifications.",
                  "Maintain an appointment history; do not silently overwrite important changes.",
                  "Use confirmation dialogs for cancellation or destructive changes.",
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />

                    <p>{text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() =>
                    setShowSafeguardsModal(
                      false
                    )
                  }
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}