import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
  FaBan,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const ROLE_LABELS = {
  customer: "Customer",
  employee: "Employee",
  franchise_manager: "Franchise Manager",
  head_office: "Head Office",
  super_admin: "Super Admin",
};

const ROLE_COLORS = {
  customer: "bg-teal-50 text-teal-700 border border-teal-200",
  employee: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  franchise_manager: "bg-amber-50 text-amber-700 border border-amber-200",
  head_office: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  super_admin: "bg-rose-50 text-rose-700 border border-rose-200",
};

const formatRole = (role) => {
  return ROLE_LABELS[role] || role || "Customer";
};

const formatDate = (date) => {
  if (!date) return "Never";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Never";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getFullName = (user) => {
  if (user.full_name) {
    return user.full_name;
  }

  if (user.first_name || user.last_name) {
    return `${user.first_name || ""} ${
      user.last_name || ""
    }`.trim();
  }

  return user.email || "Unnamed User";
};

const getInitials = (name) => {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${
    parts[parts.length - 1].charAt(0)
  }`.toUpperCase();
};

const getPhone = (user) => {
  return user.profile?.phone || user.phone || "Not provided";
};

const getFranchise = (user) => {
  if (user.franchise) {
    return user.franchise;
  }

  if (user.profile?.franchise) {
    return user.profile.franchise;
  }

  return null;
};

const getUserRole = (user) => {
  return user.role || user.profile?.role || "customer";
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [franchises, setFranchises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingFranchises, setLoadingFranchises] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [franchiseFilter, setFranchiseFilter] =
    useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // --------------------------------------------------
  // ADD USER MODAL
  // --------------------------------------------------

  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    franchise: "",
    is_active: true,
  });

  // --------------------------------------------------
  // PASSWORD VISIBILITY
  // --------------------------------------------------

  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // SAVING / DELETING
  // --------------------------------------------------

  const [saving, setSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] =
    useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  // --------------------------------------------------
  // EDIT USER
  // --------------------------------------------------

  const [editRole, setEditRole] = useState("");
  const [editFranchise, setEditFranchise] =
    useState("");
  const [editActive, setEditActive] = useState(true);

  // --------------------------------------------------
  // FETCH USERS
  // --------------------------------------------------

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users/");

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch users:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load users. Please check your permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH FRANCHISES
  // --------------------------------------------------

  const fetchFranchises = async () => {
    try {
      setLoadingFranchises(true);

      const response = await api.get(
        "/admin/franchises/"
      );

      setFranchises(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch franchises:",
        err
      );
    } finally {
      setLoadingFranchises(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFranchises();
  }, []);

  // --------------------------------------------------
  // FILTER USERS
  // --------------------------------------------------

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = getFullName(user);
      const email = user.email || "";
      const role = getUserRole(user);
      const franchise = getFranchise(user);

      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        String(user.id).includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          user.is_active) ||
        (statusFilter === "suspended" &&
          !user.is_active);

      const matchesFranchise =
        franchiseFilter === "all" ||
        String(franchise?.id) ===
          String(franchiseFilter);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesFranchise
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
    franchiseFilter,
  ]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active
  ).length;

  const suspendedUsers = users.filter(
    (user) => !user.is_active
  ).length;

  const franchiseManagers = users.filter(
    (user) =>
      getUserRole(user) === "franchise_manager"
  ).length;

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const openEdit = (user) => {
    setEditingUser(user);

    const role = getUserRole(user);
    const franchise = getFranchise(user);

    setEditRole(role);

    setEditFranchise(
      franchise?.id
        ? String(franchise.id)
        : ""
    );

    setEditActive(Boolean(user.is_active));
  };

  // --------------------------------------------------
  // OPEN ADD USER
  // --------------------------------------------------

  const openAddUser = () => {
    setError("");
    setSuccess("");

    setNewUser({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
      franchise: "",
      is_active: true,
    });

    setShowPassword(false);

    setShowAddModal(true);
  };

  // --------------------------------------------------
  // CREATE USER
  // --------------------------------------------------

  const createUser = async () => {
    if (!newUser.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!newUser.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!newUser.password) {
      setError("Password is required.");
      return;
    }

    if (
      newUser.role === "franchise_manager" &&
      !newUser.franchise
    ) {
      setError(
        "A Franchise Manager must be assigned to a franchise."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        full_name: newUser.full_name.trim(),
        email: newUser.email.trim(),
        phone: newUser.phone.trim(),
        password: newUser.password,
        role: newUser.role,
        franchise:
          newUser.role === "franchise_manager"
            ? Number(newUser.franchise)
            : null,
        is_active: newUser.is_active,
      };

      const response = await api.post(
        "/admin/users/",
        payload
      );

      const createdUser =
        response.data?.user;

      if (createdUser) {
        setUsers((currentUsers) => [
          createdUser,
          ...currentUsers,
        ]);
      } else {
        await fetchUsers();
      }

      setShowAddModal(false);

      setNewUser({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "customer",
        franchise: "",
        is_active: true,
      });

      setSuccess(
        response.data?.message ||
          "User created successfully."
      );
    } catch (err) {
      console.error(
        "Failed to create user:",
        err
      );

      const backendError =
        err.response?.data;

      setError(
        backendError?.detail ||
          backendError?.email?.[0] ||
          backendError?.password?.[0] ||
          backendError?.full_name?.[0] ||
          backendError?.franchise?.[0] ||
          backendError?.role?.[0] ||
          "Unable to create this user."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // UPDATE USER
  // --------------------------------------------------

  const updateUser = async () => {
    if (!editingUser) return;

    if (
      editRole === "franchise_manager" &&
      !editFranchise
    ) {
      setError(
        "A Franchise Manager must be assigned to a franchise."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        role: editRole,
        franchise:
          editRole === "franchise_manager"
            ? Number(editFranchise)
            : null,
        is_active: editActive,
      };

      const response = await api.patch(
        `/admin/users/${editingUser.id}/`,
        payload
      );

      // Backend returns:
      // {
      //   message: "...",
      //   user: {...}
      // }

      const updatedUser =
        response.data?.user;

      if (!updatedUser) {
        throw new Error(
          "Updated user was not returned by the server."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id
            ? updatedUser
            : user
        )
      );

      if (
        selectedUser?.id === editingUser.id
      ) {
        setSelectedUser(updatedUser);
      }

      setEditingUser(null);

      setSuccess(
        response.data?.message ||
          "User updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update user:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.franchise?.[0] ||
          err.response?.data?.role?.[0] ||
          "Unable to update this user."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // TOGGLE USER STATUS
  // --------------------------------------------------

  const toggleUserStatus = async (user) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const role = getUserRole(user);
      const franchise = getFranchise(user);

      const response = await api.patch(
        `/admin/users/${user.id}/`,
        {
          role,
          franchise:
            role === "franchise_manager"
              ? franchise?.id || null
              : null,
          is_active: !user.is_active,
        }
      );

      const updatedUser =
        response.data?.user;

      if (!updatedUser) {
        throw new Error(
          "Updated user was not returned by the server."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? updatedUser
            : item
        )
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser(updatedUser);
      }

      setSuccess(
        response.data?.message ||
          "User status updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to change user status:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to change this user's status."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE ONE USER
  // --------------------------------------------------

  const deleteUser = async (user) => {
    const name = getFullName(user);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingUserId(user.id);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/admin/users/${user.id}/`
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item.id !== user.id
        )
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }

      if (editingUser?.id === user.id) {
        setEditingUser(null);
      }

      setSuccess(
        response.data?.message ||
          "User deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to delete this user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  // --------------------------------------------------
  // DELETE ALL USERS
  // --------------------------------------------------

  const deleteAllUsers = async () => {
    if (users.length === 0) {
      setError("There are no users to delete.");
      return;
    }

    const confirmed = window.confirm(
      `WARNING\n\nYou are about to delete all users except the currently authenticated account.\n\nThis action cannot be undone.\n\nAre you sure you want to continue?`
    );

    if (!confirmed) return;

    const secondConfirmation =
      window.confirm(
        "Please confirm again: DELETE ALL USERS?"
      );

    if (!secondConfirmation) return;

    try {
      setDeletingAll(true);
      setError("");
      setSuccess("");

      const response = await api.delete(
        "/admin/users/"
      );

      /*
       * The backend should protect the currently
       * authenticated account from deletion.
       *
       * Refreshing the list is safer than trying
       * to guess which account remained.
       */
      await fetchUsers();

      setSelectedUser(null);
      setEditingUser(null);

      setSuccess(
        response.data?.message ||
          "Users deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete all users:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to delete all users."
      );
    } finally {
      setDeletingAll(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-500 text-sm">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "#ccfbf1",
              color: BRAND_COLOR,
            }}
          >
            <FaUsers />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              Users
            </h1>

            <p className="text-slate-400 text-xs font-medium mt-1">
              Manage users, roles, franchise assignments and account access.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          {/* DELETE ALL */}
          <button
            type="button"
            onClick={deleteAllUsers}
            disabled={
              deletingAll ||
              deletingUserId !== null ||
              users.length === 0
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTrash />

            {deletingAll
              ? "Deleting..."
              : "Delete All Users"}
          </button>

          {/* ADD USER */}
          <button
            type="button"
            onClick={openAddUser}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition font-medium"
          >
            <FaUserPlus />
            Add User
          </button>

        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

        {/* TOTAL */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Users
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {totalUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FaUsers />
            </div>

          </div>
        </div>

        {/* ACTIVE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {activeUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

          </div>
        </div>

        {/* SUSPENDED */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Suspended
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {suspendedUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FaBan />
            </div>

          </div>
        </div>

        {/* FRANCHISE MANAGERS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Franchise Managers
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {franchiseManagers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaBuilding />
            </div>

          </div>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

          {/* SEARCH */}
          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-sm bg-slate-50/70 focus:bg-white transition-all"
            />

          </div>

          {/* ROLE */}
          <div className="relative">

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-sm bg-white"
            >
              <option value="all">
                All Roles
              </option>

              <option value="customer">
                Customer
              </option>

              <option value="employee">
                Employee
              </option>

              <option value="franchise_manager">
                Franchise Manager
              </option>

              <option value="head_office">
                Head Office
              </option>

              <option value="super_admin">
                Super Admin
              </option>
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

          </div>

          {/* STATUS */}
          <div className="relative">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-sm bg-white"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="suspended">
                Suspended
              </option>
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

          </div>

          {/* FRANCHISE */}
          <div className="relative">

            <select
              value={franchiseFilter}
              onChange={(e) =>
                setFranchiseFilter(
                  e.target.value
                )
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 text-sm bg-white"
            >
              <option value="all">
                All Franchises
              </option>

              {franchises.map(
                (franchise) => (
                  <option
                    key={franchise.id}
                    value={franchise.id}
                  >
                    {franchise.name}
                  </option>
                )
              )}
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

          </div>

        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-slate-900">
              User Directory
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredUsers.length} user
              {filteredUsers.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <FaFilter className="text-slate-400" />

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">

                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  User
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Role
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Franchise
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Last Login
                </th>

                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.map((user) => {

                const name = getFullName(user);
                const role = getUserRole(user);
                const franchise =
                  getFranchise(user);

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/60 transition"
                  >

                    {/* USER */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
                          {getInitials(name)}
                        </div>

                        <div>

                          <p className="font-medium text-slate-900">
                            {name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: {user.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                          ROLE_COLORS[role] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatRole(role)}
                      </span>

                    </td>

                    {/* FRANCHISE */}
                    <td className="px-5 py-4">

                      {franchise ? (
                        <div>

                          <p className="text-sm font-medium text-slate-800">
                            {franchise.name}
                          </p>

                          {franchise.location && (
                            <p className="text-xs text-slate-500">
                              {franchise.location}
                            </p>
                          )}

                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Network-wide
                        </span>
                      )}

                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                          <FaCheckCircle className="text-[10px]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full">
                          <FaBan className="text-[10px]" />
                          Suspended
                        </span>
                      )}

                    </td>

                    {/* LAST LOGIN */}
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(
                        user.last_login
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        {/* VIEW */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-500 transition"
                          title="View user"
                        >
                          <FaEye />
                        </button>

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            openEdit(user)
                          }
                          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-500 transition"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          disabled={
                            deletingUserId ===
                            user.id
                          }
                          onClick={() =>
                            deleteUser(user)
                          }
                          className="w-9 h-9 rounded-lg border border-rose-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingUserId ===
                          user.id ? (
                            <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden divide-y divide-slate-100">

          {filteredUsers.map((user) => {

            const name = getFullName(user);
            const role = getUserRole(user);
            const franchise =
              getFranchise(user);

            return (
              <div
                key={user.id}
                className="p-5"
              >

                <div className="flex items-start gap-3">

                  <div className="w-11 h-11 shrink-0 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials(name)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {name}
                        </h3>

                        <p className="text-sm text-slate-500 break-all">
                          {user.email}
                        </p>

                      </div>

                      {user.is_active ? (
                        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2" />
                      ) : (
                        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-rose-500 mt-2" />
                      )}

                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          ROLE_COLORS[role] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatRole(role)}
                      </span>

                      {franchise && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                          <FaBuilding />
                          {franchise.name}
                        </span>
                      )}

                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">

                      {/* VIEW */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        className="py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700"
                      >
                        View
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          openEdit(user)
                        }
                        className="py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        disabled={
                          deletingUserId ===
                          user.id
                        }
                        onClick={() =>
                          deleteUser(user)
                        }
                        className="py-2.5 rounded-lg border border-rose-200 text-rose-600 text-sm font-medium disabled:opacity-50"
                      >
                        {deletingUserId ===
                        user.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1">
                            <FaTrash />
                            Delete
                          </span>
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* EMPTY */}
        {filteredUsers.length === 0 && (
          <div className="py-16 text-center">

            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-slate-400 text-xl" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No users found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

      {/* =================================================
          ADD USER MODAL
      ================================================= */}

      <AnimatePresence>

        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                !saving &&
                setShowAddModal(false)
              }
              className="fixed inset-0 bg-slate-900/40 z-50"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >

              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">

                {/* HEADER */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Add User
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Create a new platform user.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                  >
                    <FaTimes />
                  </button>

                </div>

                {/* FORM */}
                <div className="p-5 space-y-5">

                  {/* FULL NAME */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          full_name:
                            e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          email:
                            e.target.value,
                        })
                      }
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          phone:
                            e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            password:
                              e.target.value,
                          })
                        }
                        placeholder="Create a password"
                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition"
                        title={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Use a strong password for the new account.
                    </p>
                  </div>

                  {/* ROLE */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>

                    <div className="relative">

                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            role: e.target.value,
                            franchise:
                              e.target.value ===
                              "franchise_manager"
                                ? newUser.franchise
                                : "",
                          })
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-white"
                      >

                        <option value="customer">
                          Customer
                        </option>

                        <option value="employee">
                          Employee
                        </option>

                        <option value="franchise_manager">
                          Franchise Manager
                        </option>

                        <option value="head_office">
                          Head Office
                        </option>

                        <option value="super_admin">
                          Super Admin
                        </option>

                      </select>

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      The backend controls which privileged roles your account can create.
                    </p>
                  </div>

                  {/* FRANCHISE */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Franchise
                    </label>

                    <div className="relative">

                      <select
                        value={newUser.franchise}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            franchise:
                              e.target.value,
                          })
                        }
                        disabled={
                          newUser.role !==
                            "franchise_manager" ||
                          loadingFranchises
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      >

                        <option value="">
                          {loadingFranchises
                            ? "Loading franchises..."
                            : newUser.role ===
                              "franchise_manager"
                            ? "Select Franchise"
                            : "No Franchise / Network-wide"}
                        </option>

                        {franchises.map(
                          (franchise) => (
                            <option
                              key={
                                franchise.id
                              }
                              value={
                                franchise.id
                              }
                            >
                              {
                                franchise.name
                              }
                            </option>
                          )
                        )}

                      </select>

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

                    </div>

                    {newUser.role ===
                      "franchise_manager" && (
                      <p className="text-xs text-slate-500 mt-2">
                        A Franchise Manager must be assigned to a franchise.
                      </p>
                    )}
                  </div>

                  {/* STATUS */}
                  <div className="border border-slate-200 rounded-xl p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="font-medium text-slate-800">
                          Account Status
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {newUser.is_active
                            ? "This user can log in."
                            : "This user cannot log in."}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          setNewUser({
                            ...newUser,
                            is_active:
                              !newUser.is_active,
                          })
                        }
                        className={`relative w-12 h-6 rounded-full transition ${
                          newUser.is_active
                            ? "bg-teal-600"
                            : "bg-slate-300"
                        }`}
                      >

                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition ${
                            newUser.is_active
                              ? "left-7"
                              : "left-1"
                          }`}
                        />

                      </button>

                    </div>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="p-5 border-t border-slate-100 flex gap-3">

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      saving ||
                      !newUser.full_name.trim() ||
                      !newUser.email.trim() ||
                      !newUser.password ||
                      (newUser.role ===
                        "franchise_manager" &&
                        !newUser.franchise)
                    }
                    onClick={createUser}
                    className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Creating..."
                      : "Create User"}
                  </button>

                </div>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

      {/* =================================================
          VIEW USER DRAWER
      ================================================= */}

      <AnimatePresence>

        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setSelectedUser(null)
              }
              className="fixed inset-0 bg-slate-900/30 z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.25,
              }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >

              {/* HEADER */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                <h2 className="text-lg font-semibold text-slate-900">
                  User Details
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <FaTimes />
                </button>

              </div>

              {/* BODY */}
              <div className="p-6">

                <div className="text-center mb-7">

                  <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {getInitials(
                      getFullName(
                        selectedUser
                      )
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {getFullName(
                      selectedUser
                    )}
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {selectedUser.email}
                  </p>

                </div>

                <div className="space-y-4">

                  {/* ROLE */}
                  <div className="flex items-start gap-3">

                    <FaShieldAlt className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Role
                      </p>

                      <p className="text-sm text-slate-800 mt-1">
                        {formatRole(
                          getUserRole(
                            selectedUser
                          )
                        )}
                      </p>
                    </div>

                  </div>

                  {/* FRANCHISE */}
                  <div className="flex items-start gap-3">

                    <FaBuilding className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Franchise
                      </p>

                      <p className="text-sm text-slate-800 mt-1">
                        {getFranchise(
                          selectedUser
                        )?.name ||
                          "Network-wide"}
                      </p>
                    </div>

                  </div>

                  {/* PHONE */}
                  <div className="flex items-start gap-3">

                    <FaPhone className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Phone
                      </p>

                      <p className="text-sm text-slate-800 mt-1">
                        {getPhone(
                          selectedUser
                        )}
                      </p>
                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="flex items-start gap-3">

                    <FaEnvelope className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Email
                      </p>

                      <p className="text-sm text-slate-800 mt-1 break-all">
                        {selectedUser.email}
                      </p>
                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="flex items-start gap-3">

                    <FaUser className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Account Status
                      </p>

                      <p
                        className={`text-sm mt-1 font-medium ${
                          selectedUser.is_active
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {selectedUser.is_active
                          ? "Active"
                          : "Suspended"}
                      </p>
                    </div>

                  </div>

                  {/* LAST LOGIN */}
                  <div className="flex items-start gap-3">

                    <FaCheckCircle className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Last Login
                      </p>

                      <p className="text-sm text-slate-800 mt-1">
                        {formatDate(
                          selectedUser.last_login
                        )}
                      </p>
                    </div>

                  </div>

                  {/* DATE JOINED */}
                  <div className="flex items-start gap-3">

                    <FaUser className="text-slate-400 mt-1" />

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Date Joined
                      </p>

                      <p className="text-sm text-slate-800 mt-1">
                        {formatDate(
                          selectedUser.date_joined
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-8 pt-5 border-t border-slate-100 space-y-3">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      openEdit(
                        selectedUser
                      );
                    }}
                    className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
                  >
                    Edit User
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingUserId ===
                      selectedUser.id
                    }
                    onClick={() =>
                      deleteUser(
                        selectedUser
                      )
                    }
                    className="w-full py-3 rounded-xl border border-rose-200 text-rose-600 font-medium hover:bg-rose-50 transition disabled:opacity-50"
                  >
                    {deletingUserId ===
                    selectedUser.id
                      ? "Deleting..."
                      : "Delete User"}
                  </button>

                </div>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      <AnimatePresence>

        {editingUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                !saving &&
                setEditingUser(null)
              }
              className="fixed inset-0 bg-slate-900/40 z-50"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >

              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto">

                {/* HEADER */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Edit User
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {getFullName(
                        editingUser
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setEditingUser(null)
                    }
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"
                  >
                    <FaTimes />
                  </button>

                </div>

                <div className="p-5 space-y-5">

                  {/* ROLE */}
                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>

                    <div className="relative">

                      <select
                        value={editRole}
                        onChange={(e) =>
                          setEditRole(
                            e.target.value
                          )
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-white"
                      >

                        <option value="customer">
                          Customer
                        </option>

                        <option value="employee">
                          Employee
                        </option>

                        <option value="franchise_manager">
                          Franchise Manager
                        </option>

                        <option value="head_office">
                          Head Office
                        </option>

                        <option value="super_admin">
                          Super Admin
                        </option>

                      </select>

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

                    </div>

                  </div>

                  {/* FRANCHISE */}
                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Franchise
                    </label>

                    <div className="relative">

                      <select
                        value={
                          editFranchise
                        }
                        onChange={(e) =>
                          setEditFranchise(
                            e.target.value
                          )
                        }
                        disabled={
                          editRole !==
                            "franchise_manager" ||
                          loadingFranchises
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      >

                        <option value="">
                          {loadingFranchises
                            ? "Loading franchises..."
                            : editRole ===
                              "franchise_manager"
                            ? "Select Franchise"
                            : "No Franchise / Network-wide"}
                        </option>

                        {franchises.map(
                          (franchise) => (
                            <option
                              key={
                                franchise.id
                              }
                              value={
                                franchise.id
                              }
                            >
                              {
                                franchise.name
                              }
                            </option>
                          )
                        )}

                      </select>

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />

                    </div>

                    {editRole ===
                      "franchise_manager" && (
                      <p className="text-xs text-slate-500 mt-2">
                        A Franchise Manager must be assigned to a franchise.
                      </p>
                    )}

                  </div>

                  {/* STATUS */}
                  <div className="border border-slate-200 rounded-xl p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="font-medium text-slate-800">
                          Account Status
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {editActive
                            ? "This user can log in."
                            : "This user cannot log in."}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          setEditActive(
                            !editActive
                          )
                        }
                        className={`relative w-12 h-6 rounded-full transition ${
                          editActive
                            ? "bg-teal-600"
                            : "bg-slate-300"
                        }`}
                      >

                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition ${
                            editActive
                              ? "left-7"
                              : "left-1"
                          }`}
                        />

                      </button>

                    </div>

                  </div>

                </div>

                {/* MODAL ACTIONS */}
                <div className="p-5 border-t border-slate-100 flex gap-3">

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setEditingUser(null)
                    }
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      saving ||
                      (editRole ===
                        "franchise_manager" &&
                        !editFranchise)
                    }
                    onClick={updateUser}
                    className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Users;