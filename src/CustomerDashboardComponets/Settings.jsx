import React, { useState } from "react";
import { FaLock, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const extractErrorMessage = (err, fallback) => {
    const backendError = err.response?.data;

    if (typeof backendError === "string") return backendError;
    if (backendError?.detail) return backendError.detail;

    if (backendError) {
      const firstError = Object.values(backendError)[0];
      if (Array.isArray(firstError)) return firstError[0];
      return String(firstError);
    }

    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("auth/change-password/", {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });

      setSuccess(response.data?.message || "Password changed successfully.");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      setShowPassword({ current_password: false, new_password: false, confirm_password: false });
    } catch (err) {
      console.error("Change password error:", err);
      setError(extractErrorMessage(err, "Unable to change password."));
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "current_password", label: "Current Password" },
    { name: "new_password", label: "New Password" },
    { name: "confirm_password", label: "Confirm New Password" },
  ];

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Change Password</h3>
        <p className="text-xs text-slate-500 mt-1">
          Update the password you use to sign in.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
          <FaCheckCircle className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block font-bold text-slate-700 mb-1">{field.label}</label>
            <div className="relative">
              <input
                type={showPassword[field.name] ? "text" : "password"}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword(field.name)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword[field.name] ? (
                  <FaEyeSlash className="text-[13px]" />
                ) : (
                  <FaEye className="text-[13px]" />
                )}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60"
        >
          {saving && <FaSyncAlt className="animate-spin text-[10px]" />}
          <FaLock className="text-[10px]" />
          {saving ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}