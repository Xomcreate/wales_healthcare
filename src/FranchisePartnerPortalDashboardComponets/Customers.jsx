import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaEye,
  FaEdit,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaFolderOpen,
  FaTimes,
  FaUserCheck,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState("profile");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding a new customer
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Personal Care",
    status: "Active",
    assignedStaff: "Unassigned",
    address: "",
  });

  // Sample customer records data state
  const [customersList, setCustomersList] = useState([
    {
      id: "CUST-001",
      name: "Mary Johnson",
      email: "mary.johnson@example.com",
      phone: "+234 802 345 6789",
      service: "Personal Care",
      status: "Active",
      assignedStaff: "Dr. Adebayo",
      dateCreated: "Jan 12, 2026",
      address: "14 Victoria Island Road, Lagos",
    },
    {
      id: "CUST-002",
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+234 803 987 6543",
      service: "Companionship",
      status: "Active",
      assignedStaff: "Nurse Sarah",
      dateCreated: "Feb 04, 2026",
      address: "22 Admiralty Way, Lekki Phase 1",
    },
    {
      id: "CUST-003",
      name: "Sarah Lee",
      email: "sarah.lee@example.com",
      phone: "+234 805 112 2334",
      service: "Nursing Support",
      status: "Pending",
      assignedStaff: "Unassigned",
      dateCreated: "Mar 01, 2026",
      address: "5 Bourdillon Rd, Ikoyi",
    },
    {
      id: "CUST-004",
      name: "Michael Okoro",
      email: "m.okoro@example.com",
      phone: "+234 808 445 5667",
      service: "Rehabilitation Care",
      status: "Inactive",
      assignedStaff: "Dr. Chioma",
      dateCreated: "Nov 15, 2025",
      address: "8 Awolowo Way, Ikeja",
    },
  ]);

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;

    const generatedId = `CUST-00${customersList.length + 1}`;
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const customerToAdd = {
      ...newCustomer,
      id: generatedId,
      dateCreated: currentDate,
    };

    setCustomersList([customerToAdd, ...customersList]);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      service: "Personal Care",
      status: "Active",
      assignedStaff: "Unassigned",
      address: "",
    });
    setShowAddModal(false);
  };

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || c.status === selectedStatus;
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
            Customers & CRM Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage local branch clients, track care services, and review patient profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95">
            <FaDownload className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* CONTROLS: SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mr-1 shrink-0">
            <FaFilter className="text-[9px]" /> Status:
          </span>
          {["All", "Active", "Pending", "Inactive"].map((status) => (
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

      {/* CUSTOMERS TABLE (Desktop view) & CARD LIST (Mobile view) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Customer ID & Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Service Plan</th>
                <th className="py-3.5 px-4">Assigned Staff</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{cust.name}</p>
                      <p className="text-[10px] text-slate-400">{cust.id}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 font-medium">{cust.phone}</p>
                      <p className="text-[10px] text-slate-400">{cust.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{cust.service}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                        <FaUserCheck className="text-teal-600 text-[10px]" /> {cust.assignedStaff}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cust.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : cust.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveCustomer(cust)}
                          title="View Profile"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition"
                        >
                          <FaEye className="text-xs" />
                        </button>
                        <button
                          title="Edit Customer"
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
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No customers found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (< md screens) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust) => (
              <div key={cust.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cust.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{cust.id}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cust.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : cust.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {cust.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">Service Plan</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{cust.service}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">Assigned Staff</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{cust.assignedStaff}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">{cust.phone}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCustomer(cust)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200"
                    >
                      <FaEye className="text-xs" /> Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No customers found.
            </div>
          )}
        </div>

      </div>

      {/* ================= ADD CUSTOMER MODAL ================= */}
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
              className="fixed inset-x-4 top-10 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">Client Intake</p>
                  <h4 className="text-base font-black text-slate-900">Add New Customer</h4>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddCustomerSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elizabeth Taylor"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="elizabeth@example.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+234 800 123 4567"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Service Plan</label>
                    <select
                      value={newCustomer.service}
                      onChange={(e) => setNewCustomer({ ...newCustomer, service: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    >
                      <option value="Personal Care">Personal Care</option>
                      <option value="Companionship">Companionship</option>
                      <option value="Nursing Support">Nursing Support</option>
                      <option value="Rehabilitation Care">Rehabilitation Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={newCustomer.status}
                      onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Care Staff</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Adebayo or Unassigned"
                      value={newCustomer.assignedStaff}
                      onChange={(e) => setNewCustomer({ ...newCustomer, assignedStaff: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Awolowo Road, Ikoyi"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition shadow-sm"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= CUSTOMER PROFILE FULL DRAWER ================= */}
      <AnimatePresence>
        {activeCustomer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCustomer(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Profile Drawer Card */}
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
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Customer Profile View</p>
                  <h4 className="text-base sm:text-lg font-black">{activeCustomer.name}</h4>
                </div>
                <button
                  onClick={() => setActiveCustomer(null)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Drawer Nav Tabs */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
                {[
                  { key: "profile", label: "Profile", icon: <FaUserCheck /> },
                  { key: "services", label: "Services", icon: <FaFolderOpen /> },
                  { key: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
                  { key: "billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
                  { key: "documents", label: "Documents", icon: <FaFolderOpen /> },
                  { key: "communication", label: "Messages", icon: <FaEnvelope /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveProfileTab(tab.key)}
                    className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
                      activeProfileTab === tab.key
                        ? "border-teal-600 text-teal-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {activeProfileTab === "profile" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-3">Contact Details & Info</h5>
                      <div className="space-y-2 text-xs">
                        <p className="flex items-center gap-2 text-slate-700 truncate"><FaPhone className="text-teal-600 shrink-0" /> {activeCustomer.phone}</p>
                        <p className="flex items-center gap-2 text-slate-700 truncate"><FaEnvelope className="text-teal-600 shrink-0" /> {activeCustomer.email}</p>
                        <p className="flex items-center gap-2 text-slate-700"><FaMapMarkerAlt className="text-teal-600 shrink-0" /> {activeCustomer.address}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-2">Audit & Consent</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Consent status verified on {activeCustomer.dateCreated}. All data changes are logged for franchise compliance and auditing.
                      </p>
                    </div>
                  </div>
                )}

                {activeProfileTab === "services" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Current Plan</h5>
                    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
                      <p className="text-sm font-bold text-teal-900">{activeCustomer.service}</p>
                      <p className="text-xs text-teal-700 mt-1">Assigned Care Staff: {activeCustomer.assignedStaff}</p>
                    </div>
                  </div>
                )}

                {activeProfileTab === "appointments" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Upcoming & Past Appointments</h5>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <p className="font-bold text-slate-800">Scheduled Check-in</p>
                      <p className="text-slate-500 mt-0.5">Tomorrow at 10:00 AM with {activeCustomer.assignedStaff}</p>
                    </div>
                  </div>
                )}

                {activeProfileTab === "billing" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Invoices & Receipts</h5>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">INV-2026-089</p>
                        <p className="text-slate-500 text-[10px]">Status: Paid via Online Gateway</p>
                      </div>
                      <span className="font-black text-teal-600">$450.00</span>
                    </div>
                  </div>
                )}

                {activeProfileTab === "documents" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Permitted Customer Documents</h5>
                    <div className="p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>Care-Agreement-Signed.pdf</span>
                      <span className="text-[10px] text-teal-600 font-bold uppercase">Verified</span>
                    </div>
                  </div>
                )}

                {activeProfileTab === "communication" && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-400">Message & Notification History</h5>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <p className="font-bold text-slate-800">Head Office Update Sent</p>
                      <p className="text-slate-500 text-[10px] mt-1">Appointment reminder sent via SMS successfully.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setActiveCustomer(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}