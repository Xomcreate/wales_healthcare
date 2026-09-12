import React, { useState } from "react";
import {
  FaCogs,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaBell,
  FaUsersCog,
  FaLock,
  FaSave,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    franchiseName: "Metro Care Franchise Branch #402",
    phone: "+1 (555) 382-9010",
    email: "branch402@metrocare.com",
    address: "742 Evergreen Terrace, Suite 100, Springfield",
    openingHours: "Mon - Fri: 08:00 AM - 06:00 PM",
    pricingCap: "Standard Hourly Rate Cap: $85.00/hr",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
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
            Franchise Local Settings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configure local contact information, operating hours, pricing bounds, notifications, and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaSave className="text-[10px]" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-bold"
          >
            <FaCheckCircle />
            <span>Settings saved successfully within policy bounds!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "general", label: "General & Location", icon: <FaMapMarkerAlt /> },
          { key: "operations", label: "Hours & Pricing", icon: <FaClock /> },
          { key: "notifications", label: "Notifications", icon: <FaBell /> },
          { key: "users", label: "Users & Roles", icon: <FaUsersCog /> },
          { key: "security", label: "Security & Profile", icon: <FaLock /> },
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

      {/* TAB 1: GENERAL & LOCATION */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Local Contact Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Franchise Branch Name</label>
                <input
                  type="text"
                  value={formData.franchiseName}
                  onChange={(e) => setFormData({ ...formData, franchiseName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Support Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Branch Support Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Physical Address & Location</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Branch Address</label>
                <textarea
                  rows="4"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
              <p className="text-[11px] text-slate-400">Address updates are cross-referenced with Central Registry compliance records.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOURS & PRICING */}
      {activeTab === "operations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Opening Hours & Availability</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Standard Operating Hours</label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
              <p className="text-[11px] text-slate-400">Used by the scheduling engine to prevent appointments outside operating times.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Allowed Pricing & Availability Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pricing Bounds Control</label>
                <input
                  type="text"
                  value={formData.pricingCap}
                  onChange={(e) => setFormData({ ...formData, pricingCap: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>
              <p className="text-[11px] text-teal-700 font-semibold bg-teal-50 p-2.5 rounded-lg border border-teal-100">
                ℹ️ Local pricing must remain within Head Office franchise agreement caps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs max-w-2xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Notification Preferences & Triggers</h4>
          <div className="space-y-3">
            {[
              { title: "Email alerts for new appointment requests", desc: "Receive instant email notification when a customer books a service." },
              { title: "SMS reminders for upcoming daily shifts", desc: "Send automated SMS notices to staff and local administrators." },
              { title: "Head Office announcement broadcasts", desc: "Immediate popups and dashboard notices for urgent policy updates." },
              { title: "Document expiry warning digests", desc: "Alert administrators 30 days prior to licence or insurance expiry." },
            ].map((pref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-900 text-xs">{pref.title}</h5>
                  <p className="text-[11px] text-slate-500">{pref.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-600 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Local Users & Role Assignments</h4>
            <button className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition">
              + Add Local User
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role Assignment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[
                  { name: "Marcus Vance", email: "marcus@metrocare.com", role: "Franchise Manager" },
                  { name: "Sarah Jenkins", email: "sarah.j@metrocare.com", role: "Senior Staff / Coordinator" },
                  { name: "David Miller", email: "david.m@metrocare.com", role: "Billing & Invoices Clerk" },
                ].map((user, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{user.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-bold text-teal-700 hover:underline">Edit Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY */}
      {activeTab === "security" && (
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-2xs max-w-2xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Profile & Security Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
              <input type="password" placeholder="••••••••••••" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <input type="password" placeholder="••••••••••••" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 pt-2">
              <div>
                <h5 className="font-bold text-slate-900 text-xs">Two-Factor Authentication (2FA)</h5>
                <p className="text-[11px] text-slate-500">Require OTP code verification during portal logins.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-600 cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}