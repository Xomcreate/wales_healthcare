import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaAward,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  
  // NEW: State for Add Employee Modal and form inputs
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "Senior Care Specialist",
    email: "",
    phone: "",
    status: "Active",
    qualifications: "",
    availability: "Mon-Fri: 8:00 AM - 4:00 PM",
    documentsStatus: "Pending Verification",
    notes: "Newly onboarded staff member.",
  });

  // Sample employee dataset based on the documentation specs
  const [employeesList, setEmployeesList] = useState([
    {
      id: "EMP-101",
      name: "Dr. Adebayo Ogunlesi",
      role: "Senior Care Specialist",
      email: "adebayo.o@franchise.com",
      phone: "+234 802 111 2233",
      status: "Active",
      qualifications: "MD, Certified Geriatric Care (Expires: Dec 2027)",
      availability: "Mon-Fri: 8:00 AM - 4:00 PM",
      assignedCustomers: 4,
      documentsStatus: "Verified & Compliant",
      notes: "Excellent feedback on recent patient handling.",
    },
    {
      id: "EMP-102",
      name: "Nurse Sarah Jenkins",
      email: "sarah.j@franchise.com",
      phone: "+234 803 444 5566",
      status: "Active",
      qualifications: "RN License #4421 (Expires: Aug 2026)",
      availability: "Shift: Night Rotation",
      assignedCustomers: 3,
      documentsStatus: "Pending Training Renewal",
      notes: "Requires BLS recertification next month.",
    },
    {
      id: "EMP-103",
      name: "Chinedu Okoro",
      email: "chinedu.o@franchise.com",
      phone: "+234 805 777 8899",
      status: "Pending Compliance",
      qualifications: "Physiotherapy Assistant",
      availability: "Part-time: Flexible",
      assignedCustomers: 0,
      documentsStatus: "Missing Background Check",
      notes: "Onboarding stage 3: Awaiting manager clearance.",
    },
  ]);

  // NEW: Handle form submission for adding a new employee
  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    const generatedId = `EMP-${100 + employeesList.length + 1}`;
    const employeeToAdd = {
      ...newEmployee,
      id: generatedId,
      assignedCustomers: 0,
    };

    setEmployeesList([employeeToAdd, ...employeesList]);
    setShowAddModal(false);
    // Reset form
    setNewEmployee({
      name: "",
      role: "Senior Care Specialist",
      email: "",
      phone: "",
      status: "Active",
      qualifications: "",
      availability: "Mon-Fri: 8:00 AM - 4:00 PM",
      documentsStatus: "Pending Verification",
      notes: "Newly onboarded staff member.",
    });
  };

  const filteredEmployees = employeesList.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || emp.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Employees & Staff Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage local branch staff profiles, compliance checks, qualifications, and scheduling availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowWorkflowModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaClipboardList className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>Onboarding Workflow</span>
          </button>
          {/* Linked Add Employee Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* CONTROLS: SEARCH & STATUS FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mr-1 shrink-0">
            <FaFilter className="text-[9px]" /> Status:
          </span>
          {["All", "Active", "Pending Compliance"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                selectedStatus === status
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* EMPLOYEES TABLE (Desktop) & CARDS (Mobile) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Staff ID & Name</th>
                <th className="py-3.5 px-4">Role & Qualifications</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Compliance & Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{emp.id}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{emp.role}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-xs">{emp.qualifications}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 font-medium">{emp.phone}</p>
                      <p className="text-[10px] text-slate-400">{emp.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveEmployee(emp)}
                          title="View Profile & Schedule"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition"
                        >
                          <FaEye className="text-xs" />
                        </button>
                        <button
                          title="Edit Profile"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                    No staff records found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <div key={emp.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{emp.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{emp.id} • {emp.role}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>

                <div className="text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-slate-700"><strong>Quals:</strong> {emp.qualifications}</p>
                  <p className="text-slate-500 text-[10px]"><strong>Availability:</strong> {emp.availability}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">{emp.phone}</span>
                  <button
                    onClick={() => setActiveEmployee(emp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200"
                  >
                    <FaEye className="text-xs" /> View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No staff records found.
            </div>
          )}
        </div>

      </div>

      {/* ================= ADD EMPLOYEE MODAL ================= */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">New Staff Registration</p>
                  <h4 className="text-base font-black text-slate-900">Add New Employee</h4>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Folashade Adebayo"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role / Position</label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="Senior Care Specialist">Senior Care Specialist</option>
                      <option value="Registered Nurse">Registered Nurse</option>
                      <option value="Physiotherapy Assistant">Physiotherapy Assistant</option>
                      <option value="General Support Aide">General Support Aide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Compliance Status</label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Compliance">Pending Compliance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="employee@franchise.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+234 800 000 0000"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualifications & Certifications</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., RN License #9982 (Expires: Nov 2028)"
                    value={newEmployee.qualifications}
                    onChange={(e) => setNewEmployee({ ...newEmployee, qualifications: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift / Availability Details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mon-Fri: 8:00 AM - 4:00 PM"
                    value={newEmployee.availability}
                    onChange={(e) => setNewEmployee({ ...newEmployee, availability: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manager Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Add brief background or onboarding comments..."
                    value={newEmployee.notes}
                    onChange={(e) => setNewEmployee({ ...newEmployee, notes: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 shrink-0 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition"
                  >
                    Save & Register Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= EMPLOYEE PROFILE SLIDE-OVER DRAWER ================= */}
      <AnimatePresence>
        {activeEmployee && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEmployee(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-900 text-white">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Staff Profile & Compliance</p>
                  <h4 className="text-base sm:text-lg font-black">{activeEmployee.name}</h4>
                </div>
                <button
                  onClick={() => setActiveEmployee(null)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
                {[
                  { key: "overview", label: "Overview", icon: <FaUserTie /> },
                  { key: "qualifications", label: "Qualifications", icon: <FaAward /> },
                  { key: "availability", label: "Availability", icon: <FaClock /> },
                  { key: "customers", label: "Customers", icon: <FaUsers /> },
                  { key: "documents", label: "Documents", icon: <FaFileAlt /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
                      activeTab === tab.key
                        ? "border-teal-600 text-teal-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2 text-xs">
                      <p className="font-bold text-slate-900 text-sm mb-1">Contact Details</p>
                      <p className="flex items-center gap-2 text-slate-700"><FaPhone className="text-teal-600" /> {activeEmployee.phone}</p>
                      <p className="flex items-center gap-2 text-slate-700"><FaEnvelope className="text-teal-600" /> {activeEmployee.email}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-bold text-slate-800 text-xs uppercase mb-2">Notes & Activity History</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{activeEmployee.notes}</p>
                    </div>
                  </div>
                )}

                {activeTab === "qualifications" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Certifications & Expiry Tracking</h5>
                    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 text-xs">
                      <p className="font-bold text-teal-900">{activeEmployee.qualifications}</p>
                      <p className="text-teal-700 mt-1">Status: Verified by Compliance System.</p>
                    </div>
                  </div>
                )}

                {activeTab === "availability" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Working Hours & Shifts</h5>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <p className="font-bold text-slate-800">{activeEmployee.availability}</p>
                      <p className="text-slate-500 mt-1">Configured by Branch Franchise Manager.</p>
                    </div>
                  </div>
                )}

                {activeTab === "customers" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Assigned Customers & Care Services</h5>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <p className="font-bold text-slate-800">Total Active Assignments: {activeEmployee.assignedCustomers}</p>
                      <p className="text-slate-500 mt-1">Staff is available for scheduling based on active location criteria.</p>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Required Documents & Training</h5>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                      <span>Compliance File Status</span>
                      <span className="font-bold text-teal-600">{activeEmployee.documentsStatus}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setActiveEmployee(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition">
                  Save Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= ONBOARDING WORKFLOW SPEC MODAL ================= */}
      <AnimatePresence>
        {showWorkflowModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkflowModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-base font-black text-slate-900">Employee Onboarding Workflow Guide</h4>
                <button onClick={() => setShowWorkflowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">1</span>
                  <p>Franchise manager creates employee profile.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">2</span>
                  <p>Required documents and qualifications are uploaded.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">3</span>
                  <p>System validates required fields and flags missing/expired documents.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">4</span>
                  <p>Manager sets role, availability and service eligibility.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">5</span>
                  <p>Employee account is invited/activated if staff login is enabled.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">6</span>
                  <p className="font-semibold text-teal-800">Employee becomes available for scheduling only when required approval/compliance rules are satisfied.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowWorkflowModal(false)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}