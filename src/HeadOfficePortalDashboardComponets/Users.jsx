import React, { useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaArrowRight,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialUsers = [
  {
    id: "USR-001",
    name: "Dr. Arthur Pendelton",
    email: "arthur.p@waleshealth.co.uk",
    role: "Franchise Owner",
    scope: "One Franchise (North London)",
    status: "Active",
    lastLogin: "2026-09-11 14:22",
  },
  {
    id: "USR-002",
    name: "Sarah Jenkins",
    email: "s.jenkins@waleshealth.co.uk",
    role: "Franchise Owner",
    scope: "One Franchise (Manchester Central)",
    status: "Active",
    lastLogin: "2026-09-12 09:15",
  },
  {
    id: "USR-003",
    name: "Eleanor Vance",
    email: "e.vance@waleshealth.co.uk",
    role: "Operations Manager",
    scope: "All Franchises",
    status: "Active",
    lastLogin: "2026-09-12 08:30",
  },
  {
    id: "USR-004",
    name: "Marcus Thorne",
    email: "m.thorne@waleshealth.co.uk",
    role: "Finance Manager",
    scope: "All Franchises",
    status: "Pending",
    lastLogin: "Never",
  },
  {
    id: "USR-005",
    name: "Hanna Abbott",
    email: "h.abbott@waleshealth.co.uk",
    role: "Compliance Manager",
    scope: "All Franchises",
    status: "Suspended",
    lastLogin: "2026-08-19 11:45",
  },
];

const rolesList = [
  { role: "Super Admin", permissions: "Full platform control, system configuration, roles, franchises and audit access." },
  { role: "Operations Manager", permissions: "Franchise operations, approvals, territories, operational reports." },
  { role: "Finance Manager", permissions: "Franchise fees, payments, financial reports and reconciliation." },
  { role: "Compliance Manager", permissions: "Documents, policies, expiry tracking, compliance review." },
  { role: "Content/Brand Manager", permissions: "Brand templates, approved content, manuals and resources." },
  { role: "Franchise Owner", permissions: "Full access to their own franchise only." },
  { role: "Franchise Manager", permissions: "Local operations, staff, customers and appointments." },
  { role: "Franchise Accountant", permissions: "Local invoices, payments and permitted financial reports." },
  { role: "Staff/Caregiver", permissions: "Own profile, schedule, assigned work and permitted customer information." },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("directory"); // 'directory' | 'matrix'

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Franchise Owner",
    scope: "One Franchise",
  });

  // Drawer Detail State
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `USR-00${users.length + 1}`,
      name: newUser.name || "New Staff Member",
      email: newUser.email || "user@waleshealth.co.uk",
      role: newUser.role,
      scope: newUser.scope,
      status: "Pending",
      lastLogin: "Never",
    };
    setUsers([created, ...users]);
    setIsCreateModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "Franchise Owner",
      scope: "One Franchise",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Access & Security Control
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Users, Roles & Permissions
          </h1>
          <p className="text-xs text-slate-500">
            Manage system operators, enforce role-based access control (RBAC), and configure tenant/location scopes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "directory" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              User Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "matrix" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              RBAC Matrix Guide
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* CONTROLS BAR: SEARCH & ROLE FILTER */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Franchise Owner", "Operations Manager", "Finance Manager", "Compliance Manager"].map((roleName) => (
                <button
                  key={roleName}
                  type="button"
                  onClick={() => setRoleFilter(roleName)}
                  className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                    roleFilter === roleName
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {roleName}
                </button>
              ))}
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">User Operator</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Data Scope</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="transition hover:bg-slate-50/80 group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
                              <FaUsers className="text-xs" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-[10px] font-medium text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                            <FaShieldAlt className="text-teal-600 text-[10px]" />
                            {user.role}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-600 text-[11px]">
                          {user.scope}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              user.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                                : user.status === "Pending"
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                                : "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === "Active"
                                  ? "bg-emerald-500"
                                  : user.status === "Pending"
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-500">
                          {user.lastLogin}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs transition hover:border-teal-500 hover:text-teal-600 active:scale-95"
                          >
                            <FaEye className="text-xs" />
                            <span>Configure</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No user operators matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* RBAC MATRIX VIEW GUIDE */
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Permission Design Requirements & Guidelines
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              System architecture strictly enforces authorization per the following operational constraints:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-medium">
              <li>Permissions should be action-based: <strong className="text-slate-900">view, create, edit, approve, suspend, export, delete/archive.</strong></li>
              <li>Scope should be data-based: <strong className="text-slate-900">all franchises, assigned franchises, one franchise, assigned customers or self.</strong></li>
              <li>Destructive actions require stronger permission and secondary admin confirmation.</li>
              <li>Security enforcement is handled at both the UI and backend level; backend verifies every token scope.</li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h3 className="text-sm font-black">Role & Typical Permissions Matrix</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6 w-1/3">Role</th>
                    <th className="py-3.5 px-6">Typical Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {rolesList.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <FaUserShield className="text-teal-600 text-xs" />
                        {r.role}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{r.permissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD USER MODAL ================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Access Control
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Provision New Operator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Amanda Vance"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address (Username)
                  </label>
                  <input
                    type="email"
                    placeholder="a.vance@waleshealth.co.uk"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Assign RBAC Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    {rolesList.map((r, i) => (
                      <option key={i} value={r.role}>{r.role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Data & Location Scope
                  </label>
                  <select
                    value={newUser.scope}
                    onChange={(e) => setNewUser({ ...newUser, scope: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option>All Franchises (Head Office)</option>
                    <option>Assigned Franchises Group</option>
                    <option>One Franchise Only</option>
                    <option>Self Profile Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500"
                  >
                    Create User & Send Invite
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CONFIGURE USER DRAWER ================= */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold">
                    <FaUserShield />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">{selectedUser.name}</h2>
                    <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest">
                      ID: {selectedUser.id} • {selectedUser.role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Details</p>
                  <p className="text-xs text-slate-700"><strong>Email:</strong> {selectedUser.email}</p>
                  <p className="text-xs text-slate-700"><strong>Data Scope:</strong> {selectedUser.scope}</p>
                  <p className="text-xs text-slate-700"><strong>Account Status:</strong> {selectedUser.status}</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Security Actions</h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => alert(`Password reset instructions sent to ${selectedUser.email}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      <FaKey className="text-teal-600" />
                      <span>Send Password Reset Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
                        setSelectedUser({ ...selectedUser, status: selectedUser.status === "Active" ? "Suspended" : "Active" });
                      }}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold text-white shadow-xs ${
                        selectedUser.status === "Active" ? "bg-rose-600 hover:bg-rose-500" : "bg-emerald-600 hover:bg-emerald-500"
                      }`}
                    >
                      {selectedUser.status === "Active" ? "Suspend Operator Access" : "Activate Operator Account"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}