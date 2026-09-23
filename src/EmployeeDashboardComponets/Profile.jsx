import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEdit, FaSave, FaCertificate } from "react-icons/fa";
import api from "../api/axios"; // ⚠️ adjust this path to match where your api.js lives

const BRAND_COLOR = "#0d9488";

// Only "editable" fields are sent to PATCH /employees/me/ (see MyEmployeeUpdateSerializer)
const FIELD_CONFIG = [
  { label: "Full Name", key: "full_name", editable: true },
  { label: "Employee ID", key: "employee_id", editable: false },
  { label: "Phone", key: "phone", editable: true },
  { label: "Email", key: "email", editable: false },
  { label: "Role", key: "job_role", editable: false },
  { label: "Franchise", key: "franchise_name", editable: false },
];

const statusStyle = {
  Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring in 30 Days": "bg-amber-50 text-amber-700 border-amber-200",
  "Expiring in 90 Days": "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-rose-50 text-rose-700 border-rose-200",
  "Missing Required": "bg-rose-50 text-rose-700 border-rose-200",
  "Awaiting Review": "bg-slate-100 text-slate-600 border-slate-200",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [profileRes, docsRes] = await Promise.all([
          api.get("employees/me/"),
          // documents/me/ powers the qualifications list; if it 404s for any
          // reason we degrade gracefully to an empty list instead of failing
          // the whole page.
          api.get("documents/me/").catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        setProfile(profileRes.data);
        setFormValues({
          full_name: profileRes.data.full_name || "",
          phone: profileRes.data.phone || "",
        });

        const docs = Array.isArray(docsRes.data)
          ? docsRes.data
          : docsRes.data?.results || [];

        setQualifications(docs);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "We couldn't load your profile. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleEdit = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await api.patch("employees/me/", {
        full_name: formValues.full_name,
        phone: formValues.phone,
      });

      setProfile(res.data.employee);
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.full_name?.[0] ||
          err.response?.data?.phone?.[0] ||
          err.response?.data?.detail ||
          "We couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-sm font-semibold text-slate-400">
        Loading your profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        {error || "No employee profile found for this account."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md"
            style={{ background: BRAND_COLOR }}
          >
            {getInitials(profile.full_name)}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{profile.full_name}</h3>
            <p className="text-xs font-semibold text-slate-400">
              {profile.job_role} · {profile.franchise_name || "Unassigned"} franchise
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleEdit}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100 disabled:opacity-60"
        >
          {editing ? <FaSave /> : <FaEdit />}
          {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaUserCircle style={{ color: BRAND_COLOR }} /> Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FIELD_CONFIG.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {f.label}
              </label>
              {editing && f.editable ? (
                <input
                  value={formValues[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800">
                  {profile[f.key] || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaCertificate style={{ color: BRAND_COLOR }} /> Qualifications & Certifications
        </h4>

        {qualifications.length === 0 ? (
          <p className="text-xs font-semibold text-slate-400">
            No certifications on file yet.
          </p>
        ) : (
          <div className="space-y-3">
            {qualifications.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{q.document_name}</p>
                  <p className="text-[11px] text-slate-400">
                    {q.expiry_date ? `Expires ${q.expiry_date}` : "No expiry set"}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    statusStyle[q.status] || statusStyle["Missing Required"]
                  }`}
                >
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-xs text-slate-500">
        Employee ID, role, franchise, and certifications are managed by your franchise
        office and cannot be edited here.
      </div>
    </div>
  );
}