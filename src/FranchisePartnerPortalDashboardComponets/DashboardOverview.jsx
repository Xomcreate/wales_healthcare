import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaExclamationTriangle,
  FaBell,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

export default function DashboardOverview({ setActiveTab }) {
  // =====================================================
  // STATE
  // =====================================================

  const [customersCount, setCustomersCount] = useState(null);
  const [staffCount, setStaffCount] = useState(null);
  const [pendingComplianceCount, setPendingComplianceCount] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(null);

  const [revenueMTD, setRevenueMTD] = useState(null);

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  const [metricsError, setMetricsError] = useState("");
  const [appointmentsError, setAppointmentsError] = useState("");
  const [revenueError, setRevenueError] = useState("");

  // =====================================================
  // HELPERS
  // =====================================================

  const getTodayString = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getAppointmentDate = (appointment) => {
    return (
      appointment?.date ||
      appointment?.appointment_date ||
      appointment?.scheduled_date ||
      appointment?.start_date ||
      appointment?.start ||
      appointment?.datetime ||
      appointment?.appointment_datetime ||
      ""
    );
  };

  const getAppointmentTime = (appointment) => {
    return (
      appointment?.time ||
      appointment?.appointment_time ||
      appointment?.scheduled_time ||
      appointment?.start_time ||
      ""
    );
  };

  const getCustomerName = (appointment) => {
    if (appointment?.customer_name) {
      return appointment.customer_name;
    }

    if (appointment?.customer?.name) {
      return appointment.customer.name;
    }

    if (appointment?.customer?.full_name) {
      return appointment.customer.full_name;
    }

    if (appointment?.customer?.first_name || appointment?.customer?.last_name) {
      return `${appointment.customer.first_name || ""} ${
        appointment.customer.last_name || ""
      }`.trim();
    }

    if (appointment?.client_name) {
      return appointment.client_name;
    }

    if (appointment?.client?.name) {
      return appointment.client.name;
    }

    return "Customer";
  };

  const getAppointmentTitle = (appointment) => {
    return (
      appointment?.title ||
      appointment?.subject ||
      appointment?.service ||
      appointment?.appointment_type ||
      appointment?.type ||
      "Appointment"
    );
  };

  const getAppointmentStatus = (appointment) => {
    return (
      appointment?.status ||
      appointment?.appointment_status ||
      "Scheduled"
    );
  };

  const getAppointmentTimestamp = (appointment) => {
    const date = getAppointmentDate(appointment);
    const time = getAppointmentTime(appointment);

    if (!date) return 0;

    let dateString = date;

    // If date is already a full datetime
    if (typeof date === "string" && date.includes("T")) {
      return new Date(date).getTime();
    }

    if (typeof date === "string" && date.includes(" ")) {
      return new Date(date).getTime();
    }

    if (time) {
      dateString = `${date}T${time}`;
    }

    const timestamp = new Date(dateString).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const formatAppointmentTime = (appointment) => {
    const date = getAppointmentDate(appointment);
    const time = getAppointmentTime(appointment);

    if (time) {
      const parsedTime = new Date(`1970-01-01T${time}`);

      if (!Number.isNaN(parsedTime.getTime())) {
        return parsedTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      }

      return time;
    }

    if (date) {
      const parsedDate = new Date(date);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      }
    }

    return "Time not set";
  };

  const isToday = (appointment) => {
    const today = getTodayString();

    const date = getAppointmentDate(appointment);

    if (!date) return false;

    // Extract YYYY-MM-DD directly if possible.
    if (typeof date === "string") {
      const match = date.match(/^(\d{4}-\d{2}-\d{2})/);

      if (match) {
        return match[1] === today;
      }
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}` === today;
  };

  const isUpcoming = (appointment) => {
    const timestamp = getAppointmentTimestamp(appointment);

    if (!timestamp) {
      return true;
    }

    return timestamp >= Date.now();
  };

  // ---------------- revenue / invoice helpers ----------------

  const getInvoicePaidAmount = (invoice) => {
    const value =
      invoice?.amount_paid ??
      invoice?.paid_amount ??
      invoice?.total_paid ??
      invoice?.amount ??
      0;

    const parsed = Number(value);

    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const getInvoicePaidDate = (invoice) => {
    // Prefer a specific "paid on" date if present; fall back to
    // whatever creation/issue date the invoice carries.
    return (
      invoice?.paid_on ||
      invoice?.paid_at ||
      invoice?.payment_date ||
      invoice?.updated_at ||
      invoice?.created_at ||
      invoice?.issued_at ||
      invoice?.date ||
      ""
    );
  };

  const isInvoicePaid = (invoice) => {
    const status = String(
      invoice?.status || invoice?.payment_status || ""
    ).toLowerCase();

    if (status) {
      return status === "paid";
    }

    // No status field on the invoice — fall back to balance/amount comparison.
    const balance = Number(invoice?.balance ?? NaN);

    if (!Number.isNaN(balance)) {
      return balance <= 0;
    }

    return getInvoicePaidAmount(invoice) > 0;
  };

  const isThisMonth = (dateValue) => {
    if (!dateValue) return false;

    const parsed = new Date(dateValue);

    if (Number.isNaN(parsed.getTime())) return false;

    const now = new Date();

    return (
      parsed.getFullYear() === now.getFullYear() &&
      parsed.getMonth() === now.getMonth()
    );
  };

  // =====================================================
  // LOAD CUSTOMERS + STAFF
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      setLoadingMetrics(true);
      setMetricsError("");

      try {
        const [customersRes, employeesRes] = await Promise.all([
          api.get("admin/customers/"),
          api.get("admin/employees/"),
        ]);

        if (!isMounted) return;

        const customersData = Array.isArray(customersRes.data)
          ? customersRes.data
          : customersRes.data?.results || [];

        const employeesData = Array.isArray(employeesRes.data)
          ? employeesRes.data
          : employeesRes.data?.results || [];

        setCustomersCount(customersData.length);
        setStaffCount(employeesData.length);

        setPendingComplianceCount(
          employeesData.filter(
            (emp) => emp.status === "Pending Compliance"
          ).length
        );
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);

        if (isMounted) {
          setMetricsError("Unable to load live metrics.");
        }
      } finally {
        if (isMounted) {
          setLoadingMetrics(false);
        }
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      setLoadingAppointments(true);
      setAppointmentsError("");

      try {
        // -------------------------------------------------
        // STEP 1: Get all customers
        // -------------------------------------------------

        const customersRes = await api.get("admin/customers/");

        const customersData = Array.isArray(customersRes.data)
          ? customersRes.data
          : customersRes.data?.results || [];

        // -------------------------------------------------
        // STEP 2: Get appointments for each customer
        // -------------------------------------------------

        if (customersData.length === 0) {
          if (isMounted) {
            setAppointments([]);
            setAppointmentsCount(0);
          }

          return;
        }

        const appointmentRequests = customersData.map(async (customer) => {
          try {
            const customerId =
              customer.id ||
              customer.customer_id ||
              customer.pk;

            if (!customerId) {
              return [];
            }

            const response = await api.get(
              `admin/customers/${customerId}/appointments/`
            );

            const data = Array.isArray(response.data)
              ? response.data
              : response.data?.results || [];

            // Attach customer information if backend does not already return it.
            return data.map((appointment) => ({
              ...appointment,

              customer_name:
                appointment.customer_name ||
                customer.full_name ||
                customer.name ||
                `${customer.first_name || ""} ${
                  customer.last_name || ""
                }`.trim() ||
                "Customer",

              customer_id: customerId,
            }));
          } catch (error) {
            // One customer's appointment request failing should not
            // prevent the dashboard from loading appointments for others.
            console.error(
              `Unable to load appointments for customer ${
                customer.id || "unknown"
              }:`,
              error
            );

            return [];
          }
        });

        const appointmentResults = await Promise.all(appointmentRequests);

        if (!isMounted) return;

        // Flatten all customer appointment arrays
        const allAppointments = appointmentResults.flat();

        // -------------------------------------------------
        // STEP 3: Today's appointments
        // -------------------------------------------------

        const todaysAppointments = allAppointments
          .filter((appointment) => isToday(appointment))
          .filter((appointment) => {
            const status = getAppointmentStatus(appointment).toLowerCase();

            // Don't show cancelled appointments
            return !["cancelled", "canceled"].includes(status);
          })
          .sort((a, b) => {
            return (
              getAppointmentTimestamp(a) -
              getAppointmentTimestamp(b)
            );
          });

        // -------------------------------------------------
        // STEP 4: Upcoming appointments
        // -------------------------------------------------

        const upcomingAppointments = todaysAppointments.filter(
          (appointment) => {
            const timestamp = getAppointmentTimestamp(appointment);

            // If no usable time exists, still show it.
            if (!timestamp) return true;

            return timestamp >= Date.now();
          }
        );

        setAppointments(upcomingAppointments);
        setAppointmentsCount(todaysAppointments.length);
      } catch (err) {
        console.error("Error loading appointments:", err);

        if (isMounted) {
          setAppointmentsError(
            "Unable to load today's appointments."
          );
          setAppointments([]);
          setAppointmentsCount(null);
        }
      } finally {
        if (isMounted) {
          setLoadingAppointments(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOAD REVENUE (money already collected from customers)
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadRevenue = async () => {
      setLoadingRevenue(true);
      setRevenueError("");

      try {
        // -------------------------------------------------
        // STEP 1: Get all customers
        // -------------------------------------------------

        const customersRes = await api.get("admin/customers/");

        const customersData = Array.isArray(customersRes.data)
          ? customersRes.data
          : customersRes.data?.results || [];

        if (customersData.length === 0) {
          if (isMounted) {
            setRevenueMTD(0);
          }

          return;
        }

        // -------------------------------------------------
        // STEP 2: Get invoices for each customer
        // -------------------------------------------------

        const invoiceRequests = customersData.map(async (customer) => {
          try {
            const customerId =
              customer.id ||
              customer.customer_id ||
              customer.pk;

            if (!customerId) {
              return [];
            }

            const response = await api.get(
              `admin/customers/${customerId}/invoices/`
            );

            return Array.isArray(response.data)
              ? response.data
              : response.data?.results || [];
          } catch (error) {
            // One customer's invoice request failing should not
            // prevent the dashboard from totalling revenue for others.
            console.error(
              `Unable to load invoices for customer ${
                customer.id || "unknown"
              }:`,
              error
            );

            return [];
          }
        });

        const invoiceResults = await Promise.all(invoiceRequests);

        if (!isMounted) return;

        // Flatten all customer invoice arrays
        const allInvoices = invoiceResults.flat();

        // -------------------------------------------------
        // STEP 3: Sum what's been paid this calendar month
        // -------------------------------------------------

        const totalPaidThisMonth = allInvoices
          .filter((invoice) => isInvoicePaid(invoice))
          .filter((invoice) => isThisMonth(getInvoicePaidDate(invoice)))
          .reduce((sum, invoice) => sum + getInvoicePaidAmount(invoice), 0);

        setRevenueMTD(totalPaidThisMonth);
      } catch (err) {
        console.error("Error loading revenue:", err);

        if (isMounted) {
          setRevenueError("Unable to load revenue.");
        }
      } finally {
        if (isMounted) {
          setLoadingRevenue(false);
        }
      }
    };

    loadRevenue();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // METRICS
  // =====================================================

  const metrics = [
    {
      title: "Customers",
      value: loadingMetrics
        ? "…"
        : metricsError
        ? "—"
        : String(customersCount ?? 0),

      change: metricsError
        ? metricsError
        : "Registered client accounts",

      icon: <FaUsers />,
      color: "text-teal-600",
      bg: "bg-teal-50",
      live: true,
    },

    {
      title: "Staff",
      value: loadingMetrics
        ? "…"
        : metricsError
        ? "—"
        : String(staffCount ?? 0),

      change: metricsError
        ? metricsError
        : `${pendingComplianceCount ?? 0} pending compliance`,

      icon: <FaUserTie />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      live: true,
    },

    {
      title: "Appointments",
      value: loadingAppointments
        ? "…"
        : appointmentsError
        ? "—"
        : String(appointmentsCount ?? 0),

      change: appointmentsError
        ? appointmentsError
        : "Today's scheduled appointments",

      icon: <FaCalendarAlt />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      live: true,
    },

    {
      title: "Revenue (MTD)",
      value: loadingRevenue
        ? "…"
        : revenueError
        ? "—"
        : new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
          }).format(revenueMTD ?? 0),

      change: revenueError
        ? revenueError
        : "Collected from customers this month",

      icon: <FaFileInvoiceDollar />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      live: true,
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* =================================================
          PAGE WELCOME & QUICK SHORTCUTS
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Operational Overview
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Here is your branch's real-time picture at a glance for today.
          </p>
        </div>

        {/* QUICK ACTIONS */}

        <div className="flex flex-wrap items-center gap-2.5">
          {/* NEW CUSTOMER */}

          <button
            onClick={() => setActiveTab("customers")}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>New Customer</span>
          </button>

          {/* SCHEDULE APPOINTMENT */}

          <button
            onClick={() => setActiveTab("appointments")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaCalendarAlt style={{ color: BRAND_COLOR }} />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* =================================================
          METRICS GRID
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md ${
              !item.live ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {item.title}
              </p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} text-sm font-bold shadow-2xs`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-2">
              <h4 className="text-2xl font-black text-slate-900">
                {item.value}
              </h4>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  item.live
                    ? "text-teal-600 bg-teal-50"
                    : "text-slate-500 bg-slate-100"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================
          GRID SECTION
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =================================================
            UPCOMING APPOINTMENTS
        ================================================= */}

        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FaCalendarAlt style={{ color: BRAND_COLOR }} />

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                Today's Upcoming Appointments
              </h4>
            </div>

            <button
              onClick={() => setActiveTab("appointments")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {/* LOADING */}

          {loadingAppointments && (
            <div className="flex flex-col items-center justify-center text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <FaCalendarAlt className="text-slate-300 text-xl mb-2 animate-pulse" />

              <p className="text-xs font-bold text-slate-500">
                Loading today's appointments...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loadingAppointments && appointmentsError && (
            <div className="flex flex-col items-center justify-center text-center py-10 rounded-xl border border-dashed border-red-200 bg-red-50/50">
              <FaExclamationTriangle className="text-red-300 text-xl mb-2" />

              <p className="text-xs font-bold text-red-600">
                {appointmentsError}
              </p>

              <p className="text-[11px] text-red-400 mt-1">
                Please try refreshing the dashboard.
              </p>
            </div>
          )}

          {/* NO APPOINTMENTS */}

          {!loadingAppointments &&
            !appointmentsError &&
            appointments.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <FaCalendarAlt className="text-slate-300 text-xl mb-2" />

                <p className="text-xs font-bold text-slate-500">
                  No upcoming appointments today
                </p>

                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  There are no remaining appointments scheduled for today.
                </p>
              </div>
            )}

          {/* APPOINTMENT LIST */}

          {!loadingAppointments &&
            !appointmentsError &&
            appointments.length > 0 && (
              <div className="space-y-3">
                {appointments.slice(0, 6).map((appointment, index) => {
                  const customerName = getCustomerName(appointment);
                  const title = getAppointmentTitle(appointment);
                  const time = formatAppointmentTime(appointment);
                  const status = getAppointmentStatus(appointment);

                  return (
                    <div
                      key={
                        appointment.id ||
                        appointment.appointment_id ||
                        `${appointment.customer_id}-${index}`
                      }
                      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-teal-100 hover:bg-teal-50/30"
                    >
                      {/* LEFT */}

                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                          <FaCalendarAlt className="text-sm" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">
                            {customerName}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {title}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
                          <FaClock className="text-[10px]" />

                          <span className="text-[10px] font-bold">
                            {time}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-2 py-1 rounded-md ${
                            status.toLowerCase() === "confirmed"
                              ? "bg-emerald-50 text-emerald-600"
                              : status.toLowerCase() === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* SHOW MORE */}

                {appointments.length > 6 && (
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="w-full pt-2 text-[11px] font-bold text-teal-600 hover:text-teal-700"
                  >
                    + {appointments.length - 6} more appointment
                    {appointments.length - 6 === 1 ? "" : "s"}
                  </button>
                )}
              </div>
            )}
        </div>

        {/* =================================================
            URGENT ACTIONS & COMPLIANCE
        ================================================= */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <FaExclamationTriangle className="text-amber-500" />

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                Action Required
              </h4>
            </div>

            <div className="space-y-3">
              {/* COMPLIANCE ALERT */}

              {!loadingMetrics &&
                !metricsError &&
                pendingComplianceCount > 0 && (
                  <div className="p-3.5 rounded-xl border bg-amber-50 text-amber-700 border-amber-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        Compliance
                      </span>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/60">
                        Review Staff
                      </span>
                    </div>

                    <p className="text-xs font-semibold leading-relaxed">
                      {pendingComplianceCount} staff member
                      {pendingComplianceCount === 1 ? "" : "s"} pending
                      compliance approval
                    </p>
                  </div>
                )}

              {/* NO COMPLIANCE ISSUES */}

              {!loadingMetrics &&
                !metricsError &&
                pendingComplianceCount === 0 && (
                  <div className="p-3.5 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <FaCheckCircle className="text-[10px]" />

                      <span className="text-xs font-semibold">
                        No staff pending compliance
                      </span>
                    </div>
                  </div>
                )}

              {/* SERVICE REQUEST NOTICE */}

              <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-slate-400">
                <p className="text-[11px] leading-relaxed">
                  Service-request and document-expiry alerts aren't
                  connected yet.
                </p>
              </div>
            </div>
          </div>

          {/* HEAD OFFICE NOTICE */}

          <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 mb-1 text-teal-400">
              <FaBell className="text-xs" />

              <p className="text-xs font-bold uppercase tracking-wider">
                Head Office Notice
              </p>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Updated compliance policy guidelines for independent business
              operations are now available in documents.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}