import React, { useState } from "react";
import {
  FaCog,
  FaLock,
  FaBell,
  FaCreditCard,
  FaShieldAlt,
  FaSave,
  FaCheckCircle,
  FaGlobe,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'security' | 'notifications' | 'billing'
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Administration
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Platform Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage global network configurations, security rules, automated notifications, and enterprise billing preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "general" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "security" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Security
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "notifications" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Notifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("billing")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "billing" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Billing
            </button>
          </div>
        </div>
      </div>

      {/* SAVED NOTIFICATION TOAST */}
      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-xs"
        >
          <FaCheckCircle className="text-sm text-emerald-600" />
          <span>Settings updated successfully across the network portal.</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= GENERAL SETTINGS ================= */}
        {activeTab === "general" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">General Platform Configuration</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configure network branding, regional defaults, and operational modes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Network Organization Name
                </label>
                <input
                  type="text"
                  defaultValue="Wales Healthcare Group"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Support Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="support@waleshealthcare.co.uk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Default Timezone
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none">
                  <option>(GMT+00:00) London, Edinburgh, Dublin</option>
                  <option>(GMT+01:00) Central European Time</option>
                  <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Platform Currency
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none">
                  <option>GBP (£) - British Pound Sterling</option>
                  <option>USD ($) - US Dollar</option>
                  <option>EUR (€) - Euro</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Network Maintenance Mode</h4>
                <p className="text-[11px] text-slate-500">Temporarily restrict franchise portal logins during scheduled upgrades.</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
            </div>
          </div>
        )}

        {/* ================= SECURITY SETTINGS ================= */}
        {activeTab === "security" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Security & Access Governance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enforce mandatory two-factor authentication and session policies.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900">Enforce Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Require all head office administrators and franchise owners to use TOTP apps.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900">Strict Password Expiry Policy</h4>
                  <p className="text-[11px] text-slate-500">Force users to rotate administrative passwords every 90 days.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Idle Session Timeout
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none">
                  <option>30 Minutes of Inactivity</option>
                  <option>60 Minutes of Inactivity</option>
                  <option>4 Hours of Inactivity</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= NOTIFICATIONS SETTINGS ================= */}
        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Automated Notification Rules</h3>
              <p className="text-xs text-slate-500 mt-0.5">Control system alerts for invoice dues, renewals, and compliance expirations.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900">Fee & Invoice Due Reminders</h4>
                  <p className="text-[11px] text-slate-500">Automatically email franchises 7 days and 1 day before invoice due dates.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900">Compliance Expiry Warnings</h4>
                  <p className="text-[11px] text-slate-500">Dispatch alerts at 30, 15, and 7 days prior to regulatory document expiries.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900">Weekly Executive Digest</h4>
                  <p className="text-[11px] text-slate-500">Send an aggregated performance summary report every Monday morning.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>
            </div>
          </div>
        )}

        {/* ================= BILLING SETTINGS ================= */}
        {activeTab === "billing" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Enterprise License & Billing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your head office SaaS subscription tier and payment method.</p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5 flex items-center justify-between text-xs">
              <div>
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Active Tier
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">Enterprise Network Plan (Unlimited Branches)</h4>
                <p className="text-slate-600 mt-0.5">Renews automatically on November 1st, 2026</p>
              </div>
              <span className="text-lg font-black text-teal-700">£1,499 / mo</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Contact Name
                </label>
                <input
                  type="text"
                  defaultValue="Sarah Jenkins (Head of Finance)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Payment Method on File
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800">
                  <span className="font-mono">•••• •••• •••• 4289 (Expires 08/28)</span>
                  <span className="text-teal-600 font-bold uppercase text-[10px]">Verified Visa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaSave className="text-xs" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}