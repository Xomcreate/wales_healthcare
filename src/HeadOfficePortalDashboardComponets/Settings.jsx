import React, { useEffect, useState } from "react";
import {
  FaUserShield,
  FaLock,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Assumes AdminSettings.jsx sits one folder level below src/, e.g.
// src/pages/AdminSettings.jsx or src/components/AdminSettings.jsx,
// with your axios instance at src/api/axios.js. If AdminSettings.jsx
// lives somewhere else, adjust the "../" accordingly.
import api from "../api/axios";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password'

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ---------------------------------------------------
  // Load the current user's own profile (GET auth/me/)
  // ---------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      setLoading(true);
      try {
        const { data } = await api.get("auth/me/");

        if (!cancelled) {
          setProfile({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.profile?.phone || "",
            address: data.profile?.address || "",
            role: data.role || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setToast({
            type: "error",
            message:
              err.response?.data?.detail || "Could not load your profile.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ---------------------------------------------------
  // Save profile (PATCH auth/me/)
  // ---------------------------------------------------
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});

    try {
      const { data } = await api.patch("auth/me/", {
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      });

      setProfile((prev) => ({
        ...prev,
        full_name: data.user?.full_name ?? prev.full_name,
        phone: data.user?.profile?.phone ?? prev.phone,
        address: data.user?.profile?.address ?? prev.address,
      }));

      setToast({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      const responseData = err.response?.data || {};
      setFieldErrors(responseData);
      setToast({
        type: "error",
        message: responseData.detail || "Could not update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // Change password (POST auth/change-password/)
  // ---------------------------------------------------
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});

    try {
      await api.post("auth/change-password/", passwordForm);

      setToast({ type: "success", message: "Password changed successfully." });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const responseData = err.response?.data || {};
      setFieldErrors(responseData);
      setToast({
        type: "error",
        message:
          responseData.current_password?.[0] ||
          responseData.new_password?.[0] ||
          responseData.confirm_password?.[0] ||
          responseData.detail ||
          "Could not change password.",
      });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel =
    {
      super_admin: "Super Admin",
      head_office: "Head Office",
      franchise_manager: "Franchise Manager",
      employee: "Employee",
      customer: "Customer",
    }[profile.role] || "Administrator";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              {roleLabel} Account
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Admin Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your own profile details and account password.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "profile"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FaUserShield className="text-[11px]" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "password"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FaLock className="text-[11px]" />
              Password
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-bold shadow-xs ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {toast.type === "success" ? (
              <FaCheckCircle className="text-sm text-emerald-600" />
            ) : (
              <FaExclamationCircle className="text-sm text-rose-600" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-12 text-xs font-bold text-slate-500">
          <FaSpinner className="animate-spin" />
          Loading your account...
        </div>
      ) : (
        <>
          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleProfileSave}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6"
            >
              <div>
                <h3 className="text-base font-black text-slate-900">Your Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  These details are visible to you only and can be updated at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  {fieldErrors.full_name && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {fieldErrors.full_name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-700 mb-1">
                    <FaEnvelope className="text-[10px]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    title="Email is your login identifier and can't be changed here."
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3 font-medium text-slate-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-700 mb-1">
                    <FaPhone className="text-[10px]" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-700 mb-1">
                    <FaMapMarkerAlt className="text-[10px]" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95 disabled:opacity-60"
                >
                  {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                  <span>{saving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= PASSWORD TAB ================= */}
          {activeTab === "password" && (
            <form
              onSubmit={handlePasswordSave}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6"
            >
              <div>
                <h3 className="text-base font-black text-slate-900">Change Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  You'll need your current password to set a new one.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs max-w-md">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current_password ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, current_password: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("current_password")}
                      aria-label={showPassword.current_password ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.current_password ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {fieldErrors.current_password && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {fieldErrors.current_password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new_password ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, new_password: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("new_password")}
                      aria-label={showPassword.new_password ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.new_password ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {fieldErrors.new_password && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {fieldErrors.new_password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm_password ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("confirm_password")}
                      aria-label={showPassword.confirm_password ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.confirm_password ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {fieldErrors.confirm_password && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {fieldErrors.confirm_password[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95 disabled:opacity-60"
                >
                  {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaLock className="text-xs" />}
                  <span>{saving ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}