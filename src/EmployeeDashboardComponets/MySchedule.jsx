import React, { useEffect, useState, useCallback } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaExclamationCircle } from "react-icons/fa";

import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(hms) {
  if (!hms) return "";
  const [h, m] = hms.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function getCustomerName(customer) {
  if (!customer) return "Unknown Customer";
  return (
    customer.full_name ||
    customer.name ||
    `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
    customer.email ||
    `Customer #${customer.id}`
  );
}

// Notes are stored as "Service: <name>" (see Appointments.jsx) — pull the
// readable service name back out the same way the admin appointments view does.
function getServiceName(appointment) {
  if (!appointment?.notes) return "Service not specified";
  const match = appointment.notes.match(/^Service:\s*(.+)$/i);
  return match ? match[1] : appointment.notes;
}

function getLocalDateString(date = new Date()) {
  const pad = (v) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Pass `employeeId` to view a specific employee's schedule (admin/franchise view).
// Omit it to fall back to the logged-in employee's own schedule ("me").
export default function Schedule({ employeeId = null }) {
  const [tab, setTab] = useState("Upcoming");
  const [allAppointments, setAllAppointments] = useState(null); // null = not loaded yet (admin path)
  const [shifts, setShifts] = useState({ Upcoming: [], Past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================================================
     ADMIN PATH: no dedicated employee-schedule endpoint exists.
     Derive it the same way Employees.jsx / Appointments.jsx do —
     load every customer's appointments and filter by employee id.
     ========================================================= */
  const loadForEmployee = useCallback(async (empId) => {
    setLoading(true);
    setError(null);

    try {
      const customersRes = await api.get("/admin/customers/");
      const customerList = Array.isArray(customersRes.data)
        ? customersRes.data
        : customersRes.data?.results || [];

      const results = await Promise.all(
        customerList.map(async (customer) => {
          try {
            const res = await api.get(`/admin/customers/${customer.id}/appointments/`);
            const data = Array.isArray(res.data) ? res.data : res.data?.results || [];

            return data
              .filter((appt) => Number(appt.employee) === Number(empId))
              .map((appt) => ({
                id: appt.id,
                customer_name: getCustomerName(customer),
                customer_address: customer.address || "",
                service_name: getServiceName(appt),
                scheduled_date: appt.scheduled_date,
                scheduled_time: appt.scheduled_time,
                status: appt.status,
              }));
          } catch (err) {
            console.error(`Unable to load appointments for customer ${customer.id}`, err);
            return [];
          }
        })
      );

      setAllAppointments(results.flat());
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't load the schedule.");
      setAllAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     SELF-SERVICE PATH: keep using the existing "me" endpoint.
     ========================================================= */
  const loadForSelf = useCallback(async (currentTab) => {
    setLoading(true);
    setError(null);

    try {
      const period = currentTab === "Upcoming" ? "upcoming" : "past";
      const { data } = await api.get("employees/me/schedule/", { params: { period } });
      setShifts((prev) => ({ ...prev, [currentTab]: data }));
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't load your schedule.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset when switching which employee we're looking at.
  useEffect(() => {
    setAllAppointments(null);
    setShifts({ Upcoming: [], Past: [] });
  }, [employeeId]);

  useEffect(() => {
    let cancelled = false;

    if (employeeId) {
      if (allAppointments === null && !cancelled) {
        loadForEmployee(employeeId);
      }
    } else {
      loadForSelf(tab);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, employeeId, allAppointments]);

  // Once all-appointments are loaded for the admin path, split them into
  // Upcoming / Past locally instead of re-fetching per tab.
  useEffect(() => {
    if (!employeeId || allAppointments === null) return;

    const today = getLocalDateString();

    const upcoming = allAppointments
      .filter((a) => a.scheduled_date >= today && a.status !== "Cancelled")
      .sort((a, b) =>
        `${a.scheduled_date} ${a.scheduled_time || ""}`.localeCompare(
          `${b.scheduled_date} ${b.scheduled_time || ""}`
        )
      );

    const past = allAppointments
      .filter((a) => a.scheduled_date < today || a.status === "Completed" || a.status === "Cancelled")
      .sort((a, b) =>
        `${b.scheduled_date} ${b.scheduled_time || ""}`.localeCompare(
          `${a.scheduled_date} ${a.scheduled_time || ""}`
        )
      );

    setShifts({ Upcoming: upcoming, Past: past });
  }, [allAppointments, employeeId]);

  const items = shifts[tab] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">
          {employeeId ? "Schedule" : "My Schedule"}
        </h3>
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {["Upcoming", "Past"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                tab === t ? "bg-white shadow-xs text-slate-900" : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading schedule…</p>}

      {!loading && error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
          No {tab.toLowerCase()} shifts.
        </p>
      )}

      <div className="space-y-3">
        {items.map((v) => (
          <div
            key={v.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-sm"
                style={{ background: "#ccfbf1", color: BRAND_COLOR }}
              >
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{v.customer_name}</p>
                <p className="text-[11px] text-slate-400">{v.service_name}</p>
                {v.customer_address && (
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                    <FaMapMarkerAlt className="text-[9px]" /> {v.customer_address}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{formatTime(v.scheduled_time)}</p>
                <p className="text-[11px] text-slate-400">{formatDate(v.scheduled_date)}</p>
              </div>

              {tab === "Upcoming" ? (
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 hover:bg-amber-100">
                    <FaExclamationCircle className="text-[10px]" /> Flag Conflict
                  </button>
                </div>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase text-slate-500">
                  {v.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}