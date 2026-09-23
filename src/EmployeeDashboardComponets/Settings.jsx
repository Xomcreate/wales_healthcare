import React, { useState } from "react";
import {
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const INITIAL_FORM = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

export default function Settings() {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (!data) return fallback;

    if (typeof data.detail === "string") return data.detail;

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];

      if (firstKey) {
        const value = data[firstKey];

        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "string") return value;
      }
    }

    return fallback;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (form.new_password === form.current_password) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/auth/change-password/", {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });

      setForm({ ...INITIAL_FORM });
      setSuccessMessage("Password changed successfully.");

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Change password error:", err);
      setError(getErrorMessage(err, "Unable to change password."));
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "current_password", label: "Current Password" },
    { key: "new_password", label: "New Password" },
    { key: "confirm_password", label: "Confirm New Password" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black text-slate-900">Account Settings</h3>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaLock style={{ color: BRAND_COLOR }} /> Change Password
        </h4>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
            <FaCheckCircle />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-w-md">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block font-bold text-slate-700 mb-1">
                {label}
              </label>

              <div className="relative">
                <input
                  type={showPassword[key] ? "text" : "password"}
                  required
                  value={form[key]}
                  onChange={handleChange(key)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => toggleShowPassword(key)}
                  disabled={saving}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition disabled:opacity-60"
                >
                  {showPassword[key] ? (
                    <FaEyeSlash className="text-xs" />
                  ) : (
                    <FaEye className="text-xs" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition disabled:opacity-60"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
              {saving ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}