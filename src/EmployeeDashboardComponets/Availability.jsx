import React, { useState, useEffect, useCallback } from "react";
import { FaClock, FaSave, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_FROM = "08:00";
const DEFAULT_TO = "16:00";

/* =========================================================
   BUILD DEFAULT STATE
   ========================================================= */

const buildEmptyAvailability = () =>
  DAYS.reduce((acc, day) => {
    acc[day] = { available: false, from: "", to: "" };
    return acc;
  }, {});

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Availability() {
  const [availability, setAvailability] = useState(
    buildEmptyAvailability()
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================================
     LOAD AVAILABILITY
     ========================================================= */

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/employees/me/availability/"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const next = buildEmptyAvailability();

      data.forEach((slot) => {
        if (!next[slot.day]) return;

        next[slot.day] = {
          available: Boolean(slot.is_available),
          from: slot.is_available
            ? slot.start_time?.slice(0, 5) || DEFAULT_FROM
            : "",
          to: slot.is_available
            ? slot.end_time?.slice(0, 5) || DEFAULT_TO
            : "",
        };
      });

      setAvailability(next);
    } catch (err) {
      console.error("Load availability error:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load your availability."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  /* =========================================================
     LOCAL EDITS
     ========================================================= */

  const toggleDay = (day) => {
    setAvailability((prev) => {
      const wasAvailable = prev[day].available;

      return {
        ...prev,
        [day]: wasAvailable
          ? { available: false, from: "", to: "" }
          : {
              available: true,
              from: prev[day].from || DEFAULT_FROM,
              to: prev[day].to || DEFAULT_TO,
            },
      };
    });
  };

  const updateTime = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  /* =========================================================
     SAVE
     ========================================================= */

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    for (const day of DAYS) {
      const slot = availability[day];

      if (slot.available && (!slot.from || !slot.to)) {
        setError(
          `Please set both a start and end time for ${day}, or mark it unavailable.`
        );
        return;
      }

      if (slot.available && slot.from >= slot.to) {
        setError(
          `${day}: start time must be before end time.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      const payload = DAYS.map((day) => ({
        day,
        is_available: availability[day].available,
        start_time: availability[day].available
          ? availability[day].from
          : null,
        end_time: availability[day].available
          ? availability[day].to
          : null,
      }));

      await api.put("/employees/me/availability/", payload);

      setSuccessMessage(
        "Availability saved. Your franchise will see this when scheduling or assigning appointments."
      );

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Save availability error:", err);

      const backendError = err?.response?.data;

      let message = "Unable to save availability.";

      if (backendError?.detail) {
        message = backendError.detail;
      } else if (Array.isArray(backendError) && backendError.length) {
        const firstIssue = backendError.find(
          (entry) => entry && Object.keys(entry).length
        );

        if (firstIssue) {
          const firstValue = Object.values(firstIssue)[0];

          message = Array.isArray(firstValue)
            ? firstValue[0]
            : String(firstValue);
        }
      }

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Availability
          </h3>
          <p className="text-xs text-slate-500">
            This directly affects which shifts your franchise can
            assign to you.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: BRAND_COLOR }}
        >
          {saving ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSave />
          )}
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>

      {/* SUCCESS */}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700"
          >
            <FaCheckCircle />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
          >
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaClock style={{ color: BRAND_COLOR }} /> Weekly
          Availability
        </h4>

        {loading ? (
          <div className="py-12 text-center">
            <FaSpinner className="animate-spin text-2xl text-teal-600 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">
              Loading your availability...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={availability[day].available}
                      onChange={() => toggleDay(day)}
                      disabled={saving}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-teal-600 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:after:translate-x-4" />
                  </label>
                  <p className="w-24 text-xs font-bold text-slate-800">
                    {day}
                  </p>
                </div>

                {availability[day].available ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={availability[day].from}
                      onChange={(e) =>
                        updateTime(day, "from", e.target.value)
                      }
                      disabled={saving}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 font-medium text-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={availability[day].to}
                      onChange={(e) =>
                        updateTime(day, "to", e.target.value)
                      }
                      disabled={saving}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 font-medium text-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] font-semibold text-slate-400">
                    Unavailable
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}