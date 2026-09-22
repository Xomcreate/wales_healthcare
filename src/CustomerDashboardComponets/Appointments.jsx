import React, { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaUserNurse,
  FaSpinner,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

export default function Appointments() {
  const [tab, setTab] = useState("Upcoming");

  const [appointments, setAppointments] = useState({
    Upcoming: [],
    Past: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Per-appointment action state (cancel button spinner)
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");

  // Reschedule modal state
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);

  // =====================================================
  // HELPERS
  // =====================================================

  const getArray = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.results)) return data.results;

    if (Array.isArray(data?.appointments)) return data.appointments;

    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  const getAppointmentId = (appointment) => {
    return appointment?.id ?? appointment?.appointment_id ?? null;
  };

  const getAppointmentDate = (appointment) => {
    return (
      appointment?.date ||
      appointment?.appointment_date ||
      appointment?.scheduled_date ||
      appointment?.start_date ||
      appointment?.datetime ||
      appointment?.appointment_datetime ||
      appointment?.scheduled_datetime ||
      null
    );
  };

  const getAppointmentTime = (appointment) => {
    return (
      appointment?.time ||
      appointment?.appointment_time ||
      appointment?.scheduled_time ||
      appointment?.start_time ||
      null
    );
  };

  const getService = (appointment) => {
    return (
      appointment?.service ||
      appointment?.service_name ||
      appointment?.appointment_type ||
      appointment?.type ||
      appointment?.title ||
      "Appointment"
    );
  };

  const getCaregiver = (appointment) => {
    if (typeof appointment?.caregiver === "string") {
      return appointment.caregiver;
    }

    if (typeof appointment?.employee === "string") {
      return appointment.employee;
    }

    if (typeof appointment?.staff === "string") {
      return appointment.staff;
    }

    return (
      appointment?.caregiver?.name ||
      appointment?.caregiver?.full_name ||
      appointment?.caregiver_name ||
      appointment?.employee_name ||
      appointment?.staff_name ||
      appointment?.employee?.name ||
      appointment?.employee?.full_name ||
      appointment?.staff?.name ||
      appointment?.staff?.full_name ||
      "Not assigned"
    );
  };

  const getStatus = (appointment) => {
    return String(appointment?.status || "").toLowerCase();
  };

  // =====================================================
  // TIMEZONE-SAFE DATE PARSING
  // =====================================================
  // Django's DateField serializes as a plain "YYYY-MM-DD" string with
  // NO time or timezone attached - it just means "this calendar day",
  // full stop. Running that through `new Date("YYYY-MM-DD")` makes JS
  // parse it as UTC midnight; reading it back with getFullYear() /
  // getMonth() / getDate() then re-interprets it in the BROWSER'S
  // local timezone. For anyone behind UTC that silently rolls the
  // date back a day. So: pull the year/month/day out of the string
  // directly, and never let a Date object "reinterpret" a plain date.

  const parseDateParts = (raw) => {
    if (!raw) return null;

    const str = String(raw);

    const plainMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (plainMatch) {
      return {
        year: Number(plainMatch[1]),
        month: Number(plainMatch[2]),
        day: Number(plainMatch[3]),
      };
    }

    const date = new Date(str);

    if (Number.isNaN(date.getTime())) return null;

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  // A local-midnight Date built directly from the parsed parts -
  // safe to compare against "today" or format for display, since it
  // was never round-tripped through UTC.
  const getAppointmentLocalDate = (appointment) => {
    const parts = parseDateParts(getAppointmentDate(appointment));
    if (!parts) return null;

    return new Date(parts.year, parts.month - 1, parts.day);
  };

  // Turn whatever date value the API gave us into "YYYY-MM-DD"
  // for an <input type="date">. Built straight from the parsed
  // parts - no Date object involved, so nothing can shift it.
  const toInputDate = (appointment) => {
    const parts = parseDateParts(getAppointmentDate(appointment));
    if (!parts) return "";

    const mm = String(parts.month).padStart(2, "0");
    const dd = String(parts.day).padStart(2, "0");
    return `${parts.year}-${mm}-${dd}`;
  };

  // Turn whatever time value the API gave us into "HH:MM"
  // for an <input type="time">.
  const toInputTime = (appointment) => {
    const raw = getAppointmentTime(appointment);
    if (!raw) return "";

    const match = String(raw).match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, "0")}:${match[2]}`;
    }

    return "";
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (appointment) => {
    const appointmentStart = getAppointmentLocalDate(appointment);

    if (!appointmentStart) {
      return "Date not set";
    }

    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    if (appointmentStart.getTime() === todayStart.getTime()) {
      return "Today";
    }

    if (appointmentStart.getTime() === tomorrowStart.getTime()) {
      return "Tomorrow";
    }

    return appointmentStart.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year:
        appointmentStart.getFullYear() !== today.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (appointment) => {
    const timeValue = getAppointmentTime(appointment);

    if (!timeValue) {
      const dateValue = getAppointmentDate(appointment);

      if (!dateValue) {
        return "Time not set";
      }

      const date = new Date(dateValue);

      if (!Number.isNaN(date.getTime()) && dateValue.includes("T")) {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
      }

      return "Time not set";
    }

    // If Django returns "10:00:00"
    const timeString = String(timeValue);

    const match = timeString.match(/^(\d{1,2}):(\d{2})/);

    if (match) {
      const hours = Number(match[1]);
      const minutes = match[2];

      const date = new Date();

      date.setHours(hours, Number(minutes), 0, 0);

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    return timeString;
  };

  // =====================================================
  // GET SORTABLE DATE
  // =====================================================

  const getSortableDate = (appointment) => {
    const appointmentStart = getAppointmentLocalDate(appointment);

    return appointmentStart ? appointmentStart.getTime() : 0;
  };

  // =====================================================
  // SPLIT INTO UPCOMING / PAST AND STORE
  // =====================================================

  const applyAppointments = (allAppointments) => {
    // Compare against the START of today, not the exact current
    // moment. Appointments only carry a date (time is separate and
    // often not set), so "is this today or later" must be a
    // day-level comparison - otherwise an appointment scheduled for
    // later THIS AFTERNOON gets bucketed into Past the instant the
    // clock passes midnight.
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const upcoming = [];
    const past = [];

    allAppointments.forEach((appointment) => {
      const status = getStatus(appointment);

      // Do not show cancelled appointments in Upcoming.
      if (status === "cancelled" || status === "canceled") {
        return;
      }

      const appointmentDate = getAppointmentLocalDate(appointment);

      if (!appointmentDate) {
        upcoming.push(appointment);
        return;
      }

      if (appointmentDate >= todayStart) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    });

    // Upcoming: earliest first
    upcoming.sort((a, b) => getSortableDate(a) - getSortableDate(b));

    // Past: newest first
    past.sort((a, b) => getSortableDate(b) - getSortableDate(a));

    setAppointments({ Upcoming: upcoming, Past: past });
  };

  // =====================================================
  // FETCH THE LOGGED-IN CUSTOMER'S OWN APPOINTMENTS
  // =====================================================
  // Backed by GET /appointments/me/ - no customer ID lookup
  // needed, the backend resolves "me" from the auth token.

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/appointments/me/");

      applyAppointments(getArray(response.data));
    } catch (err) {
      console.error("Failed to fetch appointments:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  const handleCancel = async (appointment) => {
    const appointmentId = getAppointmentId(appointment);

    if (!appointmentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setActionError("");
    setActionLoadingId(appointmentId);

    try {
      await api.patch(`/admin/appointments/${appointmentId}/`, {
        status: "Cancelled",
      });

      // Refresh from the server so Upcoming/Past reflect the change.
      await loadAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);

      setActionError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to cancel this appointment."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // =====================================================
  // RESCHEDULE APPOINTMENT
  // =====================================================

  const openReschedule = async (appointment) => {
    const appointmentId = getAppointmentId(appointment);

    if (!appointmentId) return;

    setRescheduleError("");
    setRescheduleLoading(true);
    setRescheduleTarget(appointment);
    setRescheduleDate(toInputDate(appointment));
    setRescheduleTime(toInputTime(appointment));

    try {
      // Pull the freshest copy of this appointment before letting
      // them edit it. AppointmentDetailView scopes this to the
      // logged-in customer's own appointment automatically.
      const response = await api.get(
        `/admin/appointments/${appointmentId}/`
      );

      const fresh = response.data;

      setRescheduleTarget(fresh);
      setRescheduleDate(toInputDate(fresh));
      setRescheduleTime(toInputTime(fresh));
    } catch (err) {
      console.error("Failed to load appointment details:", err);

      setRescheduleError(
        err?.response?.data?.detail ||
          "Unable to load the latest appointment details."
      );
    } finally {
      setRescheduleLoading(false);
    }
  };

  const closeReschedule = () => {
    if (rescheduleSaving) return;

    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleError("");
  };

  const submitReschedule = async (event) => {
    event.preventDefault();

    const appointmentId = getAppointmentId(rescheduleTarget);

    if (!appointmentId) return;

    if (!rescheduleDate) {
      setRescheduleError("Please choose a date.");
      return;
    }

    setRescheduleSaving(true);
    setRescheduleError("");

    try {
      await api.patch(`/admin/appointments/${appointmentId}/`, {
        scheduled_date: rescheduleDate,
        scheduled_time: rescheduleTime || null,
      });

      closeReschedule();

      await loadAppointments();
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);

      setRescheduleError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to reschedule this appointment."
      );
    } finally {
      setRescheduleSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">
            Appointments
          </h3>
        </div>

        <div className="flex min-h-53 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <FaSpinner
              className="animate-spin"
              style={{ color: BRAND_COLOR }}
              size={22}
            />

            <p className="text-xs font-semibold text-slate-400">
              Loading your appointments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">
            Appointments
          </h3>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex items-start gap-3">
            <FaExclamationCircle className="mt-0.5 text-rose-500" />

            <div>
              <p className="text-sm font-bold text-rose-700">
                Unable to load appointments
              </p>

              <p className="mt-1 text-xs text-rose-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT APPOINTMENTS
  // =====================================================

  const currentAppointments = appointments[tab] || [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">
          Appointments
        </h3>

        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {["Upcoming", "Past"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                tab === t
                  ? "bg-white shadow-xs text-slate-900"
                  : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ACTION ERROR (cancel failures) */}
      {actionError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {actionError}
        </div>
      ) : null}

      {/* APPOINTMENTS */}
      <div className="space-y-3">
        {currentAppointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background: "#ccfbf1",
                color: BRAND_COLOR,
              }}
            >
              <FaCalendarAlt />
            </div>

            <p className="text-sm font-bold text-slate-700">
              No {tab.toLowerCase()} appointments
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {tab === "Upcoming"
                ? "You don't have any upcoming appointments."
                : "You don't have any past appointments yet."}
            </p>
          </div>
        ) : (
          currentAppointments.map((appointment, index) => {
            const appointmentId = getAppointmentId(appointment) ?? index;

            const status = getStatus(appointment);
            const isBusy = actionLoadingId === appointmentId;

            return (
              <div
                key={appointmentId}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 flex-col items-center justify-center rounded-xl text-[10px] font-black"
                    style={{
                      background: "#ccfbf1",
                      color: BRAND_COLOR,
                    }}
                  >
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {getService(appointment)}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {formatDate(appointment)} ·{" "}
                      {formatTime(appointment)}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <FaUserNurse className="text-slate-400" />

                    {getCaregiver(appointment)}
                  </div>

                  {tab === "Upcoming" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openReschedule(appointment)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Reschedule
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleCancel(appointment)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {isBusy ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
                        status === "cancelled" || status === "canceled"
                          ? "border-rose-200 bg-rose-50 text-rose-500"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {status === "cancelled" || status === "canceled"
                        ? "Cancelled"
                        : status || "Completed"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">
                Reschedule Appointment
              </h4>

              <button
                type="button"
                onClick={closeReschedule}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            {rescheduleLoading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner
                  className="animate-spin"
                  style={{ color: BRAND_COLOR }}
                  size={18}
                />
              </div>
            ) : (
              <form onSubmit={submitReschedule} className="space-y-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-500">
                    Date
                  </label>

                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-500">
                    Time
                  </label>

                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {rescheduleError ? (
                  <p className="text-xs font-semibold text-rose-600">
                    {rescheduleError}
                  </p>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeReschedule}
                    disabled={rescheduleSaving}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={rescheduleSaving}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                    style={{ background: BRAND_COLOR }}
                  >
                    {rescheduleSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}