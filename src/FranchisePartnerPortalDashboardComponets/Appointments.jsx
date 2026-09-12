import React, { useState } from "react";
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
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Appointments() {
  const [activeView, setActiveView] = useState("calendar");
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  const [showSafeguardsModal, setShowSafeguardsModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  // Sample data and state handling for appointments list
  const [appointmentsList, setAppointmentsList] = useState([
    {
      id: "APT-501",
      customer: "Eleanor Vance",
      service: "Personal Care Support",
      date: "Mar 12, 2026",
      time: "09:00 AM - 11:00 AM",
      staff: "Nurse Sarah Jenkins",
      status: "Confirmed",
    },
    {
      id: "APT-502",
      customer: "Robert Fox",
      service: "Companionship & Living Assistance",
      date: "Mar 12, 2026",
      time: "01:00 PM - 03:00 PM",
      staff: "Unassigned",
      status: "Request Queue",
    },
  ]);

  // Form states for creating a new appointment
  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    service: "Personal Care Support",
    date: "",
    time: "",
    staff: "Unassigned",
  });

  const handleCreateAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!newAppointment.customer || !newAppointment.date || !newAppointment.time) return;

    const created = {
      id: `APT-50${appointmentsList.length + 1}`,
      customer: newAppointment.customer,
      service: newAppointment.service,
      date: newAppointment.date,
      time: newAppointment.time,
      staff: newAppointment.staff,
      status: newAppointment.staff === "Unassigned" ? "Request Queue" : "Confirmed",
    };

    setAppointmentsList([created, ...appointmentsList]);
    setNewAppointment({ customer: "", service: "Personal Care Support", date: "", time: "", staff: "Unassigned" });
    setShowNewAppointmentModal(false);
  };

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
            Appointments & Scheduling
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage calendars, unassigned request queues, staff availability, and customer histories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowLifecycleModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>Lifecycle Guide</span>
          </button>
          <button
            onClick={() => setShowSafeguardsModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaShieldAlt className="text-[11px] text-teal-600" />
            <span>Safeguards</span>
          </button>
          <button
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* PRIMARY VIEWS TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "calendar", label: "Calendar (Day/Wk/Mo)", icon: <FaCalendarAlt /> },
          { key: "agenda", label: "Agenda / List View", icon: <FaListUl /> },
          { key: "queue", label: "Unassigned Request Queue", icon: <FaUserClock /> },
          { key: "staff", label: "Staff Availability", icon: <FaUsers /> },
          { key: "history", label: "Customer History", icon: <FaHistory /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
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

      {/* VIEW CONTENT AREA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {activeView === "calendar" && "Interactive Calendar Matrix"}
            {activeView === "agenda" && "Agenda & List View"}
            {activeView === "queue" && "Unassigned Request Queue"}
            {activeView === "staff" && "Staff Availability View"}
            {activeView === "history" && "Customer Schedule History"}
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Franchise Local Portal Mode</span>
        </div>

        {/* Dynamic Display based on active view */}
        {activeView === "calendar" && (
          <div className="p-8 rounded-2xl border border-slate-200/80 bg-white text-center space-y-3 shadow-2xs">
            <FaCalendarAlt className="text-3xl text-teal-600 mx-auto" />
            <h5 className="text-sm font-bold text-slate-900">Calendar View (Day / Week / Month)</h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Visual grid displaying scheduled appointments with built-in conflict checks and drag-and-drop rescheduling limits.
            </p>
          </div>
        )}

        {(activeView === "agenda" || activeView === "queue" || activeView === "history") && (
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Assigned Staff</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {appointmentsList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{apt.id}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{apt.customer}</td>
                      <td className="py-3.5 px-4 text-slate-600">{apt.service}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{apt.date} ({apt.time})</td>
                      <td className="py-3.5 px-4 text-slate-600">{apt.staff}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          apt.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === "staff" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 text-sm">Nurse Sarah Jenkins</h5>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Available</span>
              </div>
              <p className="text-xs text-slate-500">Qualified: Personal Care, Nursing</p>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <FaClock /> Shift: 08:00 AM - 04:00 PM
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 text-sm">Mark Thompson</h5>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">Booked</span>
              </div>
              <p className="text-xs text-slate-500">Qualified: Companionship</p>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <FaClock /> Shift: 09:00 AM - 05:00 PM
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= NEW APPOINTMENT MODAL ================= */}
      <AnimatePresence>
        {showNewAppointmentModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewAppointmentModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Schedule New Appointment</h4>
                <button onClick={() => setShowNewAppointmentModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateAppointmentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={newAppointment.customer}
                    onChange={(e) => setNewAppointment({ ...newAppointment, customer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                  <select
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Personal Care Support">Personal Care Support</option>
                    <option value="Companionship & Living Assistance">Companionship & Living Assistance</option>
                    <option value="Skilled Nursing Care">Skilled Nursing Care</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Staff</label>
                  <select
                    value={newAppointment.staff}
                    onChange={(e) => setNewAppointment({ ...newAppointment, staff: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Unassigned">Unassigned (Send to Request Queue)</option>
                    <option value="Nurse Sarah Jenkins">Nurse Sarah Jenkins</option>
                    <option value="Mark Thompson">Mark Thompson</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAppointmentModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= APPOINTMENT LIFECYCLE MODAL ================= */}
      <AnimatePresence>
        {showLifecycleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLifecycleModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Appointment Lifecycle</h4>
                <button onClick={() => setShowLifecycleModal(false)} className="text-slate-400 hover:text-slate-600">
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
                  "System records completion and triggers the next billing step."
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">{idx + 1}</span>
                    <span className="font-semibold text-slate-800">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowLifecycleModal(false)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= SCHEDULING SAFEGUARDS MODAL ================= */}
      <AnimatePresence>
        {showSafeguardsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSafeguardsModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-16 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Scheduling Safeguards</h4>
                <button onClick={() => setShowSafeguardsModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Prevent double booking.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Warn about staff availability conflicts.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Respect franchise operating hours.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Respect service eligibility and staff qualifications.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Maintain an appointment history; do not silently overwrite important changes.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FaCheckCircle className="text-teal-600 shrink-0 mt-0.5" />
                  <p>Use confirmation dialogs for cancellation or destructive changes.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSafeguardsModal(false)}
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