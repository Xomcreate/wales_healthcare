import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaEye,
  FaEdit,
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

const ROLE_LABELS = {
  customer: "Customer",
  employee: "Employee",
  franchise_manager: "Franchise Manager",
  head_office: "Head Office",
  super_admin: "Super Admin",
};

const ROLE_COLORS = {
  customer: "bg-blue-50 text-blue-700",
  employee: "bg-purple-50 text-purple-700",
  franchise_manager: "bg-orange-50 text-orange-700",
  head_office: "bg-green-50 text-green-700",
  super_admin: "bg-red-50 text-red-700",
};

const formatRole = (role) => ROLE_LABELS[role] || role || "Customer";

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
  if (user.full_name) return user.full_name;

  if (user.first_name || user.last_name) {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  }

  return user.email || "Unnamed User";
};

const getInitials = (name) => {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
    0
  )}`.toUpperCase();
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
  const [loadingFranchises, setLoadingFranchises] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [franchiseFilter, setFranchiseFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [editRole, setEditRole] = useState("");
  const [editFranchise, setEditFranchise] = useState("");
  const [editActive, setEditActive] = useState(true);

  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // FETCH USERS
  // --------------------------------------------------

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users/");

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);

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

      const response = await api.get("/admin/franchises/");

      setFranchises(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch franchises:", err);
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
        roleFilter === "all" || role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "suspended" && !user.is_active);

      const matchesFranchise =
        franchiseFilter === "all" ||
        String(franchise?.id) === String(franchiseFilter);

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
    (user) => getUserRole(user) === "franchise_manager"
  ).length;

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const openEdit = (user) => {
    setEditingUser(user);

    const role = getUserRole(user);
    const franchise = getFranchise(user);

    setEditRole(role);
    setEditFranchise(franchise?.id ? String(franchise.id) : "");
    setEditActive(Boolean(user.is_active));
  };

  // --------------------------------------------------
  // UPDATE USER
  // --------------------------------------------------

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);
      setError("");

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

      const updatedUser = response.data;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id
            ? updatedUser
            : user
        )
      );

      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);

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

      const response = await api.patch(
        `/admin/users/${user.id}/`,
        {
          role: getUserRole(user),
          franchise:
            getUserRole(user) === "franchise_manager"
              ? getFranchise(user)?.id || null
              : null,
          is_active: !user.is_active,
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id ? response.data : item
        )
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser(response.data);
      }
    } catch (err) {
      console.error("Failed to change user status:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to change this user's status."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 text-sm">
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage users, roles, franchise assignments and account access.
          </p>
        </div>

        {/* Backend currently has no POST /admin/users/ endpoint */}
        <button
          type="button"
          disabled
          title="User creation endpoint has not been added to the backend yet."
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed font-medium"
        >
          <FaUserPlus />
          Add User
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {totalUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {activeUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Suspended
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {suspendedUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FaBan />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Franchise Managers
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {franchiseManagers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FaBuilding />
            </div>
          </div>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

          {/* SEARCH */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm"
            />
          </div>

          {/* ROLE */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm bg-white"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
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

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>

          {/* STATUS */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>

          {/* FRANCHISE */}
          <div className="relative">
            <select
              value={franchiseFilter}
              onChange={(e) =>
                setFranchiseFilter(e.target.value)
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm bg-white"
            >
              <option value="all">
                All Franchises
              </option>

              {franchises.map((franchise) => (
                <option
                  key={franchise.id}
                  value={franchise.id}
                >
                  {franchise.name}
                </option>
              ))}
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>

        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              User Directory
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <FaFilter className="text-gray-400" />
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Role
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Franchise
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Last Login
                </th>

                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredUsers.map((user) => {
                const name = getFullName(user);
                const role = getUserRole(user);
                const franchise = getFranchise(user);

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* USER */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                          {getInitials(name)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
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
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatRole(role)}
                      </span>

                    </td>

                    {/* FRANCHISE */}
                    <td className="px-5 py-4">

                      {franchise ? (
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {franchise.name}
                          </p>

                          {franchise.location && (
                            <p className="text-xs text-gray-500">
                              {franchise.location}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Network-wide
                        </span>
                      )}

                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                          <FaCheckCircle className="text-[10px]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                          <FaBan className="text-[10px]" />
                          Suspended
                        </span>
                      )}

                    </td>

                    {/* LAST LOGIN */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(user.last_login)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="View user"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Edit user"
                        >
                          <FaEdit />
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
        <div className="lg:hidden divide-y divide-gray-100">

          {filteredUsers.map((user) => {
            const name = getFullName(user);
            const role = getUserRole(user);
            const franchise = getFranchise(user);

            return (
              <div
                key={user.id}
                className="p-5"
              >

                <div className="flex items-start gap-3">

                  <div className="w-11 h-11 shrink-0 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials(name)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {name}
                        </h3>

                        <p className="text-sm text-gray-500 break-all">
                          {user.email}
                        </p>
                      </div>

                      {user.is_active ? (
                        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-green-500 mt-2" />
                      ) : (
                        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-red-500 mt-2" />
                      )}

                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          ROLE_COLORS[role] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatRole(role)}
                      </span>

                      {franchise && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                          <FaBuilding />
                          {franchise.name}
                        </span>
                      )}

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium"
                      >
                        Edit
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

            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-xl" />
            </div>

            <h3 className="font-semibold text-gray-900">
              No users found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

      {/* VIEW USER DRAWER */}
      <AnimatePresence>

        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >

              <div className="p-5 border-b border-gray-100 flex items-center justify-between">

                <h2 className="text-lg font-semibold text-gray-900">
                  User Details
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="p-6">

                <div className="text-center mb-7">

                  <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {getInitials(
                      getFullName(selectedUser)
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {getFullName(selectedUser)}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {selectedUser.email}
                  </p>

                </div>

                <div className="space-y-4">

                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Role
                      </p>

                      <p className="text-sm text-gray-800 mt-1">
                        {formatRole(
                          getUserRole(selectedUser)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaBuilding className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Franchise
                      </p>

                      <p className="text-sm text-gray-800 mt-1">
                        {getFranchise(selectedUser)
                          ?.name || "Network-wide"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Phone
                      </p>

                      <p className="text-sm text-gray-800 mt-1">
                        {getPhone(selectedUser)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Email
                      </p>

                      <p className="text-sm text-gray-800 mt-1 break-all">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaUser className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Account Status
                      </p>

                      <p
                        className={`text-sm mt-1 font-medium ${
                          selectedUser.is_active
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedUser.is_active
                          ? "Active"
                          : "Suspended"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Last Login
                      </p>

                      <p className="text-sm text-gray-800 mt-1">
                        {formatDate(
                          selectedUser.last_login
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaUser className="text-gray-400 mt-1" />

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Date Joined
                      </p>

                      <p className="text-sm text-gray-800 mt-1">
                        {formatDate(
                          selectedUser.date_joined
                        )}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 pt-5 border-t border-gray-100">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      openEdit(selectedUser);
                    }}
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Edit User
                  </button>

                </div>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>

        {editingUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setEditingUser(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >

              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto">

                <div className="p-5 border-b border-gray-100 flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit User
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {getFullName(editingUser)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setEditingUser(null)
                    }
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"
                  >
                    <FaTimes />
                  </button>

                </div>

                <div className="p-5 space-y-5">

                  {/* ROLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>

                    <div className="relative">

                      <select
                        value={editRole}
                        onChange={(e) =>
                          setEditRole(e.target.value)
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white"
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

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

                    </div>
                  </div>

                  {/* FRANCHISE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Franchise
                    </label>

                    <div className="relative">

                      <select
                        value={editFranchise}
                        onChange={(e) =>
                          setEditFranchise(e.target.value)
                        }
                        disabled={
                          editRole !==
                            "franchise_manager" ||
                          loadingFranchises
                        }
                        className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">
                          {editRole ===
                          "franchise_manager"
                            ? "Select Franchise"
                            : "No Franchise / Network-wide"}
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

                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

                    </div>

                    {editRole ===
                      "franchise_manager" && (
                      <p className="text-xs text-gray-500 mt-2">
                        A Franchise Manager must be assigned
                        to a franchise.
                      </p>
                    )}
                  </div>

                  {/* STATUS */}
                  <div className="border border-gray-200 rounded-xl p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="font-medium text-gray-800">
                          Account Status
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
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
                            ? "bg-green-500"
                            : "bg-gray-300"
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
                <div className="p-5 border-t border-gray-100 flex gap-3">

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setEditingUser(null)
                    }
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
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
                    className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
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