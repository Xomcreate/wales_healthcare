import React, { useEffect, useMemo, useState } from "react";
import {
  FaConciergeBell,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaLock,
  FaSpinner,
  FaExclamationTriangle,
  FaBuilding,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// =========================================================
// API CALLS
// =========================================================

function getErrorMessage(err) {
  const data = err?.response?.data;

  if (!data) return err.message || "Something went wrong.";

  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.error) return data.error;

  return "Something went wrong.";
}

const fetchMyServices = () =>
  api.get("/admin/services/").then((res) => res.data);

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function Services() {
  const [showValidationModal, setShowValidationModal] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadServices() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMyServices();
      setServices(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const franchiseName = useMemo(() => {
    const withFranchise = services.find((s) => s.franchise_name);
    return withFranchise ? withFranchise.franchise_name : null;
  }, [services]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Services, Hours & Availability
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Head Office defines and approves the services assigned to your
            franchise
            {franchiseName ? ` (${franchiseName})` : ""}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowValidationModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle
              className="text-[11px]"
              style={{ color: BRAND_COLOR }}
            />

            <span>Validation Rules</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ASSIGNED SERVICE CATALOGUE */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Services
            </p>

            <h4 className="text-2xl font-black text-slate-900 mt-2">
              {loading ? "-" : services.length}
            </h4>

            <p className="text-[11px] text-teal-600 font-semibold mt-1">
              Approved by Head Office
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Catalogue Source
            </p>

            <h4 className="text-2xl font-black text-slate-900 mt-2">
              Centralized
            </h4>

            <p className="text-[11px] text-teal-600 font-semibold mt-1">
              Managed by Head Office
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sync Status
            </p>

            <h4 className="text-2xl font-black text-slate-900 mt-2">
              Live
            </h4>

            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Reflects latest approvals
            </p>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <FaExclamationTriangle className="shrink-0" />

            {error}
          </div>
        )}

        {/* SERVICE CARDS / LIST */}
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Approved Catalogue
            </h4>

            <span className="text-[10px] text-slate-400 font-medium">
              Managed centrally by Head Office
            </span>
          </div>

          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
              <FaSpinner className="animate-spin text-lg" />

              <p className="text-xs font-semibold">
                Loading your services...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
              <FaConciergeBell className="text-2xl" />

              <p className="text-xs font-semibold">
                No services have been approved for your franchise yet.
              </p>

              <p className="text-[11px] text-slate-400">
                Head Office needs to create, assign, and approve a service
                before it shows up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                        #{srv.id}
                      </span>

                      <h4 className="font-bold text-slate-900 text-sm">
                        {srv.name}
                      </h4>
                    </div>

                    {srv.description && (
                      <p className="text-xs text-slate-500 max-w-md">
                        {srv.description}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <FaLock className="text-[10px] text-slate-400" />

                      Approved & Locked Content
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 md:bg-transparent md:border-0 md:p-0">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Franchise
                      </p>

                      <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                        <FaBuilding className="text-[10px] text-slate-400" />

                        {srv.franchise_name || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Approved On
                      </p>

                      <p className="font-bold text-teal-700 mt-0.5">
                        {formatDate(srv.approved_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= VALIDATION EXAMPLES MODAL ================= */}
      <AnimatePresence>
        {showValidationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowValidationModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">
                  Validation Examples & Rules
                </h4>

                <button
                  onClick={() => setShowValidationModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />

                  <p>
                    A service only appears here once Head Office has both
                    assigned it to your franchise and approved it.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />

                  <p>
                    If Head Office rejects a service or reassigns it elsewhere,
                    it will drop off this list automatically.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />

                  <p>
                    Names and descriptions are locked and managed centrally —
                    reach out to Head Office to request a change.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowValidationModal(false)}
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