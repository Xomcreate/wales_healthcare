import React, { useState } from "react";
import {
  FaConciergeBell,
  FaDollarSign,
  FaClock,
  FaCalendarCheck,
  FaShieldAlt,
  FaInfoCircle,
  FaEdit,
  FaCheck,
  FaTimes,
  FaLock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Services() {
  const [activeTab, setActiveTab] = useState("catalogue");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Local state for services list to make edits dynamic
  const [servicesList, setServicesList] = useState([
    {
      id: "SRV-01",
      name: "Personal Care Support",
      headOfficeControl: "Approved & Active",
      priceRange: "$40 - $75 / hr",
      localPrice: "$60.00",
      hours: "08:00 AM - 06:00 PM",
      status: "Active",
      lockedContent: "Approved Description & Brand Copy",
    },
    {
      id: "SRV-02",
      name: "Companionship & Living Assistance",
      headOfficeControl: "Approved & Active",
      priceRange: "$30 - $50 / hr",
      localPrice: "$45.00",
      hours: "09:00 AM - 05:00 PM",
      status: "Active",
      lockedContent: "Approved Description & Brand Copy",
    },
    {
      id: "SRV-03",
      name: "Specialized Nursing Care",
      headOfficeControl: "Central Policy Limit Set",
      priceRange: "$80 - $150 / hr",
      localPrice: "$120.00",
      hours: "24/7 Availability",
      status: "Active",
      lockedContent: "Approved Description & Brand Copy",
    },
  ]);

  const handleSaveLocalService = (e) => {
    e.preventDefault();
    if (!editingService) return;

    setServicesList((prev) =>
      prev.map((srv) => (srv.id === editingService.id ? editingService : srv))
    );
    setEditingService(null);
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
            Services, Hours & Availability
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Head Office defines the approved service catalogue. Configure your local pricing limits, hours, and capacity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowValidationModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>Validation Rules</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "catalogue", label: "Local Service Catalogue", icon: <FaConciergeBell /> },
          { key: "matrix", label: "Policy Control Matrix", icon: <FaShieldAlt /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
              activeTab === tab.key
                ? "border-teal-600 text-teal-700 bg-teal-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: LOCAL SERVICE CATALOGUE & PRICING */}
      {activeTab === "catalogue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Services</p>
              <h4 className="text-2xl font-black text-slate-900 mt-2">3 Configured</h4>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Within Head Office bounds</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Local Pricing Policy</p>
              <h4 className="text-2xl font-black text-slate-900 mt-2">Validated</h4>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Set within allowed range</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Availability Engine</p>
              <h4 className="text-2xl font-black text-slate-900 mt-2">Live</h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Respecting real-time hours</p>
            </div>
          </div>

          {/* Service Cards / List */}
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Approved Catalogue & Local Limits</h4>
              <span className="text-[10px] text-slate-400 font-medium">Locked content managed centrally</span>
            </div>

            <div className="divide-y divide-slate-100">
              {servicesList.map((srv) => (
                <div key={srv.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">{srv.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <FaLock className="text-[10px] text-slate-400" /> {srv.lockedContent}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 md:bg-transparent md:border-0 md:p-0">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Allowed Range</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{srv.priceRange}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Local Price</p>
                      <p className="font-bold text-teal-700 mt-0.5">{srv.localPrice}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Local Hours</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{srv.hours}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingService({ ...srv })}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shrink-0"
                  >
                    <FaEdit className="text-xs" /> Edit Local
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POLICY CONTROL MATRIX TABLE */}
      {activeTab === "matrix" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Franchise vs Head Office Control Matrix</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Franchise users can configure only the fields that policy permits.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Control Area</th>
                  <th className="py-3.5 px-4">Head Office Spec</th>
                  <th className="py-3.5 px-4">Franchise Permission</th>
                  <th className="py-3.5 px-4">Allowed Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Service existence</td>
                  <td className="py-3.5 px-4 text-slate-600">Create/approve/retire</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-700">Use approved services</td>
                  <td className="py-3.5 px-4 text-slate-500">Select local services</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Price</td>
                  <td className="py-3.5 px-4 text-slate-600">Set min/max or fixed policy</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-700">Set local price within limits</td>
                  <td className="py-3.5 px-4 text-slate-500">Update local price</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Hours</td>
                  <td className="py-3.5 px-4 text-slate-600">Optional standard hours</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-700">Set local hours</td>
                  <td className="py-3.5 px-4 text-slate-500">Open/close availability</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Availability</td>
                  <td className="py-3.5 px-4 text-slate-600">Set policy limits</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-700">Configure local capacity</td>
                  <td className="py-3.5 px-4 text-slate-500">Enable/disable slots</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Content</td>
                  <td className="py-3.5 px-4 text-slate-600">Approve descriptions/brand copy</td>
                  <td className="py-3.5 px-4 font-semibold text-rose-700">Cannot change locked content</td>
                  <td className="py-3.5 px-4 text-slate-500">Use approved content</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= EDIT LOCAL SERVICE MODAL ================= */}
      <AnimatePresence>
        {editingService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingService(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Edit Local Service Settings</h4>
                  <p className="text-[11px] text-teal-700 font-medium">{editingService.name} ({editingService.id})</p>
                </div>
                <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSaveLocalService} className="space-y-4 text-xs">
                {/* Notice regarding locked central content */}
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-800 flex items-start gap-2">
                  <FaLock className="shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-[11px]">
                    Description and branding copy are centrally managed and locked. You can only adjust local pricing (within the allowed range) and hours.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Central Allowed Price Range</label>
                  <input
                    type="text"
                    disabled
                    value={editingService.priceRange}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Local Price</label>
                  <input
                    type="text"
                    required
                    value={editingService.localPrice}
                    onChange={(e) => setEditingService({ ...editingService, localPrice: e.target.value })}
                    placeholder="e.g. $60.00"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Must fall within Head Office limits.</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Local Operating Hours</label>
                  <input
                    type="text"
                    required
                    value={editingService.hours}
                    onChange={(e) => setEditingService({ ...editingService, hours: e.target.value })}
                    placeholder="e.g. 08:00 AM - 06:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                <h4 className="text-base font-black text-slate-900">Validation Examples & Rules</h4>
                <button onClick={() => setShowValidationModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />
                  <p>If Head Office sets a price range, the franchise UI should show the allowed range before save.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />
                  <p>If a service is retired centrally, it becomes unavailable for new bookings while historical records remain intact.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />
                  <p>If a franchise is suspended, new local service activity should be blocked according to the suspension policy.</p>
                </div>
                <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <FaCheck className="text-teal-600 shrink-0 mt-0.5" />
                  <p>If local hours change, the appointment engine must immediately respect the new availability.</p>
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