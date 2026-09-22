import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaKey,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// 👉 Adjust this import to wherever your shared axios instance lives
// (the one with VITE_API_URL + the JWT interceptors).
import api from "../api/axios";

/* =========================================================
   SMALL HELPERS
   ========================================================= */

const ROLE_LABELS = {
  customer: "Customer",
  employee: "Employee",
  franchise_manager: "Franchise Manager",
  head_office: "Head Office",
  super_admin: "Super Admin",
};

const EMPTY_ERRORS = { general: "", fields: {} };

const inputClasses = (hasError = false, readOnly = false) =>
  [
    "w-full p-2.5 rounded-xl border text-xs focus:outline-none",
    hasError
      ? "border-red-300 focus:border-red-500"
      : "border-slate-200 focus:border-teal-600",
    readOnly
      ? "bg-slate-100 text-slate-500 cursor-not-allowed"
      : "bg-slate-50 text-slate-800",
  ].join(" ");

const getInitials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Turns a DRF error response into { general, fields: { fieldName: "message" } }
function parseApiError(err, fallback) {
  const result = { general: "", fields: {} };
  const data = err?.response?.data;

  if (!data) {
    result.general = err?.request
      ? "Could not reach the server. Check your connection and try again."
      : fallback;
    return result;
  }

  if (typeof data === "string") {
    result.general = fallback;
    return result;
  }

  Object.entries(data).forEach(([key, value]) => {
    const text = Array.isArray(value)
      ? value.join(" ")
      : typeof value === "string"
      ? value
      : "";

    if (!text) return;

    if (["detail", "non_field_errors", "message"].includes(key)) {
      result.general = text;
    } else {
      result.fields[key] = text;
    }
  });

  if (!result.general && Object.keys(result.fields).length === 0) {
    result.general = fallback;
  }

  return result;
}

// Extract the editable fields from the /auth/me/ payload
const toForm = (user) => ({
  // UserSerializer falls back to the email when no name is set,
  // so don't show the email as if it were the person's name.
  full_name:
    user?.full_name && user.full_name !== user.email ? user.full_name : "",
  phone: user?.profile?.phone || "",
  address: user?.profile?.address || "",
});

function passwordStrength(password) {
  if (!password) return { level: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const level = Math.min(4, Math.max(1, Math.ceil((score * 4) / 5)));
  const label = ["", "Weak", "Fair", "Good", "Strong"][level];

  return { level, label };
}

const STRENGTH_COLORS = [
  "bg-slate-200",
  "bg-red-400",
  "bg-amber-400",
  "bg-teal-400",
  "bg-emerald-500",
];

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p className="mt-1 flex items-start gap-1.5 text-[11px] font-semibold text-red-600">
      <FaExclamationCircle className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function FormBanner({ children }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-700"
    >
      <FaExclamationCircle className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-slate-700 block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`${inputClasses(Boolean(error))} pr-10`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-700 transition"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

/* =========================================================
   TAB: MY PROFILE  (GET / PATCH  auth/me/)
   ========================================================= */

function ProfileTab({ showToast }) {
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [reloadKey, setReloadKey] = useState(0);

  const applyAccount = useCallback((user) => {
    setAccount(user);
    setForm(toForm(user));
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setLoadError("");

    api
      .get("/auth/me/")
      .then((res) => {
        if (!cancelled) applyAccount(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            parseApiError(err, "Could not load your profile.").general ||
              "Could not load your profile."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, applyAccount]);

  const saved = account ? toForm(account) : null;
  const isDirty = saved
    ? Object.keys(form).some((key) => form[key].trim() !== saved[key])
    : false;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors.fields[field]) {
      setErrors((prev) => ({
        ...prev,
        fields: { ...prev.fields, [field]: "" },
      }));
    }
  };

  const handleReset = () => {
    if (account) setForm(toForm(account));
    setErrors(EMPTY_ERRORS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saved || saving) return;

    // Only send what actually changed
    const payload = {};
    Object.keys(form).forEach((key) => {
      const value = form[key].trim();
      if (value !== saved[key]) payload[key] = value;
    });

    if (Object.keys(payload).length === 0) return;

    if ("full_name" in payload && !payload.full_name) {
      setErrors({
        general: "",
        fields: { full_name: "Full name can't be empty." },
      });
      return;
    }

    setSaving(true);
    setErrors(EMPTY_ERRORS);

    try {
      const res = await api.patch("/auth/me/", payload);
      applyAccount(res.data.user);
      showToast("Profile updated successfully.");
    } catch (err) {
      setErrors(
        parseApiError(err, "Could not save your profile. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-xs font-semibold text-slate-500">
        <FaSpinner className="animate-spin" />
        <span>Loading your profile…</span>
      </div>
    );
  }

  if (loadError || !account) {
    return (
      <div className="max-w-xl space-y-3 rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="text-xs font-semibold text-red-700">
          {loadError || "Could not load your profile."}
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  const displayName = form.full_name.trim() || account.email;
  const roleLabel = ROLE_LABELS[account.role] || account.role;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* IDENTITY CARD */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-5 h-fit">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white">
            {getInitials(form.full_name.trim() || account.email)}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-black text-slate-900">
              {displayName}
            </h4>
            <p className="truncate text-[11px] text-slate-500">{account.email}</p>
          </div>
        </div>

        <dl className="space-y-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Role</dt>
            <dd>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                {roleLabel}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Franchise</dt>
            <dd className="font-bold text-slate-800 text-right">
              {account.franchise?.name || "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-bold text-slate-800">
              {formatDate(account.date_joined)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Last login</dt>
            <dd className="font-bold text-slate-800 text-right">
              {formatDateTime(account.last_login)}
            </dd>
          </div>
        </dl>
      </div>

      {/* EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4"
      >
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Personal Details
          </h4>
          <p className="mt-1 text-[11px] text-slate-400">
            This is the contact information linked to your login.
          </p>
        </div>

        <FormBanner>{errors.general}</FormBanner>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="profile-full-name" className="text-xs font-bold text-slate-700 block mb-1">
              Full Name
            </label>
            <input
              id="profile-full-name"
              type="text"
              maxLength={150}
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange("full_name")}
              placeholder="Your first and last name"
              className={inputClasses(Boolean(errors.fields.full_name))}
            />
            <FieldError>{errors.fields.full_name}</FieldError>
          </div>

          <div>
            <label htmlFor="profile-email" className="text-xs font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={account.email}
              readOnly
              className={inputClasses(false, true)}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Your email is your login and can only be changed by Head Office.
            </p>
          </div>

          <div>
            <label htmlFor="profile-phone" className="text-xs font-bold text-slate-700 block mb-1">
              Phone Number
            </label>
            <input
              id="profile-phone"
              type="tel"
              maxLength={30}
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+1 (555) 000-0000"
              className={inputClasses(Boolean(errors.fields.phone))}
            />
            <FieldError>{errors.fields.phone}</FieldError>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-address" className="text-xs font-bold text-slate-700 block mb-1">
              Address
            </label>
            <textarea
              id="profile-address"
              rows={3}
              maxLength={255}
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange("address")}
              placeholder="Street, city, postcode"
              className={inputClasses(Boolean(errors.fields.address))}
            />
            <FieldError>{errors.fields.address}</FieldError>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Discard changes
          </button>
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {saving ? (
              <FaSpinner className="animate-spin text-[10px]" />
            ) : (
              <FaSave className="text-[10px]" />
            )}
            <span>{saving ? "Saving…" : "Save profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   TAB: PASSWORD  (POST  auth/change-password/)
   ========================================================= */

const EMPTY_PASSWORDS = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

function PasswordTab({ showToast }) {
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [visible, setVisible] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const strength = passwordStrength(form.new_password);
  const mismatch =
    form.confirm_password.length > 0 &&
    form.new_password !== form.confirm_password;

  const canSubmit =
    form.current_password &&
    form.new_password &&
    form.confirm_password &&
    !saving;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors.fields[field] || errors.general) {
      setErrors((prev) => ({
        general: "",
        fields: { ...prev.fields, [field]: "" },
      }));
    }
  };

  const toggleVisible = (field) => () =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Quick client-side checks (the server re-validates everything)
    const fields = {};

    if (form.new_password !== form.confirm_password) {
      fields.confirm_password = "Passwords do not match.";
    }

    if (form.new_password === form.current_password) {
      fields.new_password =
        "New password must be different from the current password.";
    }

    if (Object.keys(fields).length > 0) {
      setErrors({ general: "", fields });
      return;
    }

    setSaving(true);
    setErrors(EMPTY_ERRORS);

    try {
      await api.post("/auth/change-password/", form);

      setForm(EMPTY_PASSWORDS);
      setVisible({
        current_password: false,
        new_password: false,
        confirm_password: false,
      });
      showToast("Password changed successfully.");
    } catch (err) {
      setErrors(
        parseApiError(err, "Could not change your password. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4 max-w-2xl"
    >
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
          Change Password
        </h4>
        <p className="mt-1 text-[11px] text-slate-400">
          Enter your current password, then choose a new one you don't use anywhere else.
        </p>
      </div>

      <FormBanner>{errors.general}</FormBanner>

      <div className="space-y-4">
        <PasswordField
          id="current-password"
          label="Current Password"
          value={form.current_password}
          onChange={handleChange("current_password")}
          error={errors.fields.current_password}
          autoComplete="current-password"
          visible={visible.current_password}
          onToggle={toggleVisible("current_password")}
        />

        <div>
          <PasswordField
            id="new-password"
            label="New Password"
            value={form.new_password}
            onChange={handleChange("new_password")}
            error={errors.fields.new_password}
            autoComplete="new-password"
            visible={visible.new_password}
            onToggle={toggleVisible("new_password")}
          />

          {form.new_password && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      strength.level >= segment
                        ? STRENGTH_COLORS[strength.level]
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Strength: <span className="font-bold text-slate-700">{strength.label}</span>
                . Longer passwords with a mix of letters, numbers and symbols are stronger.
              </p>
            </div>
          )}
        </div>

        <div>
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={form.confirm_password}
            onChange={handleChange("confirm_password")}
            error={errors.fields.confirm_password || (mismatch ? "Passwords do not match." : "")}
            autoComplete="new-password"
            visible={visible.confirm_password}
            onToggle={toggleVisible("confirm_password")}
          />
          {form.confirm_password && !mismatch && form.new_password && (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <FaCheckCircle />
              <span>Passwords match.</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {saving ? (
            <FaSpinner className="animate-spin text-[10px]" />
          ) : (
            <FaKey className="text-[10px]" />
          )}
          <span>{saving ? "Changing…" : "Change password"}</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

const TABS = [
  { key: "profile", label: "My Profile", icon: <FaUser /> },
  { key: "password", label: "Password", icon: <FaKey /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
          Account Settings
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Manage your own profile details and password.
        </p>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            role="status"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-bold ${
              toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
            }`}
          >
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
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

      {/* TAB: MY PROFILE */}
      {activeTab === "profile" && <ProfileTab showToast={showToast} />}

      {/* TAB: PASSWORD */}
      {activeTab === "password" && <PasswordTab showToast={showToast} />}
    </motion.div>
  );
}