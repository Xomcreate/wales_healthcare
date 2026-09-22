import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

export default function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [originalProfile, setOriginalProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET VALUE SAFELY
  // =====================================================

  const getFullName = (data) => {
    // Already combined name
    if (data?.name) return data.name;
    if (data?.full_name) return data.full_name;

    // First + last name
    const firstName =
      data?.first_name ||
      data?.firstName ||
      "";

    const lastName =
      data?.last_name ||
      data?.lastName ||
      "";

    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) return fullName;

    // Sometimes user information is nested
    if (data?.user) {
      return getFullName(data.user);
    }

    if (data?.profile) {
      return getFullName(data.profile);
    }

    return "";
  };

  const getPhone = (data) => {
    return (
      data?.phone ||
      data?.phone_number ||
      data?.mobile ||
      data?.mobile_number ||
      data?.user?.phone ||
      data?.user?.phone_number ||
      data?.profile?.phone ||
      ""
    );
  };

  const getEmail = (data) => {
    return (
      data?.email ||
      data?.user?.email ||
      ""
    );
  };

  const getAddress = (data) => {
    return (
      data?.address ||
      data?.home_address ||
      data?.street_address ||
      data?.user?.address ||
      data?.profile?.address ||
      ""
    );
  };

  const buildProfileFromResponse = (data) => ({
    name: getFullName(data),
    phone: getPhone(data),
    email: getEmail(data),
    address: getAddress(data),
  });

  // =====================================================
  // FETCH LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("auth/me/");

        if (!isMounted) return;

        const data = response.data || {};

        console.log("Logged-in user profile:", data);

        const loadedProfile = buildProfileFromResponse(data);

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (err) {
        console.error("Unable to fetch profile:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.detail ||
              err?.response?.data?.message ||
              "Unable to load your profile."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        full_name: profile.name,
        phone: profile.phone,
        address: profile.address,
      };

      const response = await api.patch("auth/me/", payload);

      const updatedProfile = buildProfileFromResponse(
        response.data?.user || {}
      );

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      console.error("Unable to save profile:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setError("");
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = () => {
    if (!profile.name) return "U";

    const names = profile.name.trim().split(/\s+/);

    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  // =====================================================
  // FIELDS
  // =====================================================

  const fields = [
    {
      label: "Full Name",
      key: "name",
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Address",
      key: "address",
    },
  ];

  // Email is managed via account settings, not this form -
  // it's also the Django username, so it stays read-only here
  // even in edit mode.
  const readOnlyFieldKeys = ["email"];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner
            className="animate-spin text-2xl"
            style={{ color: BRAND_COLOR }}
          />

          <p className="text-xs font-semibold text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <FaExclamationCircle className="mt-0.5 shrink-0" />

          <p className="text-xs font-semibold">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* INITIALS */}

          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-md"
            style={{ background: BRAND_COLOR }}
          >
            {getInitials()}
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              {profile.name || "User"}
            </h3>

            <p className="text-xs font-semibold text-slate-400">
              {profile.email || "Logged-in account"}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100"
          >
            <FaEdit />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* CANCEL */}

            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSave />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          PERSONAL INFORMATION
      ================================================= */}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h4 className="mb-5 flex items-center gap-2 text-sm font-black text-slate-900">
          <FaUserCircle style={{ color: BRAND_COLOR }} />

          Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map((field) => {
            const isFieldEditable =
              editing && !readOnlyFieldKeys.includes(field.key);

            return (
              <div key={field.key}>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {field.label}
                </label>

                {isFieldEditable ? (
                  <input
                    type="text"
                    value={profile[field.key]}
                    onChange={(e) =>
                      handleChange(field.key, e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                ) : (
                  <p className="min-h-5 text-sm font-semibold text-slate-800">
                    {profile[field.key] || (
                      <span className="font-normal text-slate-400">
                        Not provided
                      </span>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          NOTICE
      ================================================= */}

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-xs leading-relaxed text-slate-500">
        Some fields may be restricted or require franchise
        confirmation before changes take effect, depending on your
        franchise's policy.
      </div>
    </div>
  );
}