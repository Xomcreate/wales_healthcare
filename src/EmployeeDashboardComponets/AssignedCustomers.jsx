import React, { useEffect, useState, useCallback } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AssignedCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // customer_id -> the soonest Scheduled appointment for that customer
  const [appointmentByCustomer, setAppointmentByCustomer] = useState({});

  // customer_id -> "saving" | "done" | error string
  const [visitState, setVisitState] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [customersRes, scheduleRes] = await Promise.all([
        api.get("employees/me/customers/"),
        api.get("employees/me/schedule/", { params: { period: "upcoming" } }),
      ]);

      setCustomers(customersRes.data);

      const nextByCustomer = {};

      // schedule is already ordered soonest-first, so the first
      // Scheduled appointment we see per customer is the one to offer.
      for (const appointment of scheduleRes.data) {
        if (appointment.status !== "Scheduled") continue;
        if (nextByCustomer[appointment.customer_id]) continue;

        nextByCustomer[appointment.customer_id] = appointment;
      }

      setAppointmentByCustomer(nextByCustomer);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't load your assigned customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkComplete = async (customerId) => {
    const appointment = appointmentByCustomer[customerId];

    if (!appointment) return;

    setVisitState((prev) => ({ ...prev, [customerId]: "saving" }));

    try {
      await api.post(`employees/me/appointments/${appointment.id}/complete/`);

      setVisitState((prev) => ({ ...prev, [customerId]: "done" }));

      // that appointment is used up - clear it so the button doesn't
      // try to complete it again
      setAppointmentByCustomer((prev) => {
        const next = { ...prev };
        delete next[customerId];
        return next;
      });
    } catch (err) {
      setVisitState((prev) => ({
        ...prev,
        [customerId]: err.response?.data?.detail || "Couldn't mark this visit complete.",
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Assigned Customers</h3>
        <p className="text-xs text-slate-500">
          Customers currently assigned to you. You only see the details needed to provide care.
        </p>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">Loading your assigned customers…</p>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {!loading && !error && customers.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
          No customers are assigned to you yet.
        </p>
      )}

      <div className="space-y-3">
        {customers.map((c) => {
          const appointment = appointmentByCustomer[c.customer_id];
          const state = visitState[c.customer_id];
          const isSaving = state === "saving";
          const isDone = state === "done";
          const isError = state && state !== "saving" && state !== "done";

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                    style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                  >
                    {initials(c.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                    {c.service_interest && (
                      <p className="text-[11px] font-semibold text-teal-600">{c.service_interest}</p>
                    )}
                    {c.address && (
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <FaMapMarkerAlt className="text-[9px]" /> {c.address}
                      </p>
                    )}
                    {c.phone && (
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <FaPhoneAlt className="text-[9px]" /> {c.phone}
                      </p>
                    )}
                    {appointment && (
                      <p className="mt-1 text-[10px] font-semibold text-slate-400">
                        Next visit: {appointment.scheduled_date}
                        {appointment.scheduled_time ? ` · ${appointment.scheduled_time}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => handleMarkComplete(c.customer_id)}
                    disabled={!appointment || isSaving || isDone}
                    title={
                      !appointment
                        ? "No scheduled visit to mark complete"
                        : undefined
                    }
                    className={`flex items-center gap-1.5 self-start rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                      isDone
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSaving ? (
                      <FaSpinner className="animate-spin text-[10px]" />
                    ) : (
                      <FaCheckCircle className="text-[10px]" />
                    )}
                    {isDone ? "Visit Completed" : "Mark Visit Complete"}
                  </button>

                  {isError && (
                    <p className="max-w-48 text-right text-[10px] font-semibold text-rose-600">
                      {state}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}