import React, { useState } from "react";
import {
  FaBuilding,
  FaPlus,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaFileContract,
  FaMoneyBillWave,
  FaShieldAlt,
  FaChartBar,
  FaHistory,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaBan,
  FaEye,
  FaEdit,
  FaArrowRight,
  FaArrowLeft,
  FaUpload,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

const initialFranchises = [
  {
    id: "FR-001",
    name: "Wales Healthcare - North London",
    owner: "Dr. Arthur Pendelton",
    email: "arthur.p@waleshealth.co.uk",
    territory: "North London (Zone 1-3)",
    status: "Active",
    revenue: "$142,000",
    agreementDate: "2024-05-12",
    expiryDate: "2027-05-12",
    feesStatus: "Paid",
    compliance: "Verified",
  },
  {
    id: "FR-002",
    name: "Wales Healthcare - Manchester Central",
    owner: "Sarah Jenkins",
    email: "s.jenkins@waleshealth.co.uk",
    territory: "Greater Manchester",
    status: "Active",
    revenue: "$98,500",
    agreementDate: "2024-08-01",
    expiryDate: "2027-08-01",
    feesStatus: "Pending",
    compliance: "Verified",
  },
  {
    id: "FR-003",
    name: "Wales Healthcare - Birmingham West",
    owner: "Marcus Vance",
    email: "m.vance@waleshealth.co.uk",
    territory: "West Midlands",
    status: "Pending Approval",
    revenue: "$0",
    agreementDate: "2026-09-01",
    expiryDate: "2029-09-01",
    feesStatus: "Unpaid",
    compliance: "Pending Review",
  },
  {
    id: "FR-004",
    name: "Wales Healthcare - Cardiff Bay",
    owner: "Elinor Hughes",
    email: "e.hughes@waleshealth.co.uk",
    territory: "South Wales Coast",
    status: "Suspended",
    revenue: "$45,200",
    agreementDate: "2022-03-15",
    expiryDate: "2026-03-15",
    feesStatus: "Overdue",
    compliance: "Expired Agreement",
  },
];

export default function Franchises() {
  const [franchises, setFranchises] = useState(initialFranchises);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newFranchiseData, setNewFranchiseData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    territory: "",
    feeTerms: "Annual Standard ($12,000)",
  });

  // Detail Drawer state
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");

  // Filter logic
  const filteredFranchises = franchises.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.territory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `FR-00${franchises.length + 1}`,
      name: newFranchiseData.name || "Wales Healthcare - New Branch",
      owner: newFranchiseData.owner || "New Partner",
      email: newFranchiseData.email || "partner@waleshealth.co.uk",
      territory: newFranchiseData.territory || "Unassigned Territory",
      status: "Pending Approval",
      revenue: "$0",
      agreementDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 31536000000 * 3)
        .toISOString()
        .split("T")[0],
      feesStatus: "Pending",
      compliance: "Pending Review",
    };
    setFranchises([created, ...franchises]);
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewFranchiseData({
      name: "",
      owner: "",
      email: "",
      phone: "",
      territory: "",
      feeTerms: "Annual Standard ($12,000)",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Franchise Management
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Network Franchises
          </h1>
          <p className="text-xs text-slate-500">
            Create, monitor territories, review compliance, and manage franchise lifecycle.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
        >
          <FaPlus className="text-xs" />
          <span>Create Franchise</span>
        </button>
      </div>

      {/* CONTROLS BAR: SEARCH & STATUS FILTER */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search by franchise name, partner, or territory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Active", "Pending Approval", "Suspended"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* FRANCHISES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Franchise & Location</th>
                <th className="py-3.5 px-4">Partner / Owner</th>
                <th className="py-3.5 px-4">Territory</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">YTD Revenue</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFranchises.length > 0 ? (
                filteredFranchises.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/80 group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
                          <FaBuilding className="text-xs" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] font-medium text-slate-400">
                            ID: {item.id} • Expires: {item.expiryDate}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{item.owner}</p>
                      <p className="text-[10px] text-slate-400">{item.email}</p>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[10px]">
                        <FaMapMarkerAlt className="text-teal-600 text-[10px]" />
                        {item.territory}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                            : item.status === "Pending Approval"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "Active"
                              ? "bg-emerald-500"
                              : item.status === "Pending Approval"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-black text-slate-900">
                      {item.revenue}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedFranchise(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs transition hover:border-teal-500 hover:text-teal-600 active:scale-95"
                      >
                        <FaEye className="text-xs" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No franchise records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE FRANCHISE WORKFLOW MODAL ================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Workflow Step {createStep} of 5
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {createStep === 1 && "1. Legal & Business Information"}
                    {createStep === 2 && "2. Territory Assignment"}
                    {createStep === 3 && "3. Initial Permissions & Admin"}
                    {createStep === 4 && "4. Fees & Renewal Terms"}
                    {createStep === 5 && "5. Agreement & Document Upload"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* STEP CONTENT */}
              <form onSubmit={handleCreateSubmit} className="py-6 space-y-4">
                {createStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Franchise Branch Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wales Healthcare - Leeds Central"
                        value={newFranchiseData.name}
                        onChange={(e) =>
                          setNewFranchiseData({
                            ...newFranchiseData,
                            name: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Partner / Owner Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Dr. Samantha Reed"
                          value={newFranchiseData.owner}
                          onChange={(e) =>
                            setNewFranchiseData({
                              ...newFranchiseData,
                              owner: e.target.value,
                            })
                          }
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Partner Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="s.reed@waleshealth.co.uk"
                          value={newFranchiseData.email}
                          onChange={(e) =>
                            setNewFranchiseData({
                              ...newFranchiseData,
                              email: e.target.value,
                            })
                          }
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {createStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Territory Search & Coverage Assignment
                      </label>
                      <input
                        type="text"
                        placeholder="Search territory zone (e.g., West Yorkshire / Leeds North)"
                        value={newFranchiseData.territory}
                        onChange={(e) =>
                          setNewFranchiseData({
                            ...newFranchiseData,
                            territory: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-800 flex items-start gap-3">
                      <FaExclamationTriangle className="text-amber-600 mt-0.5 shrink-0" />
                      <p>
                        Territory mapper will automatically scan for overlap conflicts with existing Yorkshire regional branches upon submission.
                      </p>
                    </div>
                  </div>
                )}

                {createStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Assign initial administrative permissions and default role credentials for the franchise primary user.
                    </p>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Franchise Administrator Role</span>
                        <span className="text-teal-600">Standard Access</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Grants permission to manage local staff, local branding templates, patient records, and submit compliance paperwork.
                      </p>
                    </div>
                  </div>
                )}

                {createStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Applicable Fee & Renewal Structure
                      </label>
                      <select
                        value={newFranchiseData.feeTerms}
                        onChange={(e) =>
                          setNewFranchiseData({
                            ...newFranchiseData,
                            feeTerms: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                      >
                        <option>Annual Standard ($12,000 / yr)</option>
                        <option>Quarterly Tier A ($3,500 / qtr)</option>
                        <option>Enterprise Premium ($20,000 / yr)</option>
                      </select>
                    </div>
                  </div>
                )}

                {createStep === 5 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
                      <FaUpload className="mx-auto text-2xl text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700">
                        Upload Franchise Agreement & Signed Documentation
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        PDF, DOCX up to 25MB
                      </p>
                      <button
                        type="button"
                        className="mt-4 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL FOOTER BUTTONS */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                  {createStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCreateStep(createStep - 1)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <FaArrowLeft className="text-xs" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {createStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setCreateStep(createStep + 1)}
                      className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500"
                    >
                      <span>Continue</span>
                      <FaArrowRight className="text-xs" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-500"
                    >
                      <FaCheckCircle className="text-xs" />
                      <span>Submit for Approval</span>
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FRANCHISE DETAIL PAGE DRAWER ================= */}
      <AnimatePresence>
        {selectedFranchise && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFranchise(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* DRAWER PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full z-10"
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold">
                    <FaBuilding />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">
                      {selectedFranchise.name}
                    </h2>
                    <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest">
                      ID: {selectedFranchise.id} • Status: {selectedFranchise.status}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFranchise(null)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* DETAIL NAVIGATION TABS */}
              <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-6 py-2 scrollbar-none">
                {[
                  { key: "overview", label: "Overview & Status", icon: <FaBuilding /> },
                  { key: "owner", label: "Owner & Users", icon: <FaUser /> },
                  { key: "territory", label: "Territory", icon: <FaMapMarkerAlt /> },
                  { key: "agreement", label: "Agreement & Dates", icon: <FaFileContract /> },
                  { key: "fees", label: "Fees & Payments", icon: <FaMoneyBillWave /> },
                  { key: "compliance", label: "Compliance", icon: <FaShieldAlt /> },
                  { key: "reports", label: "Performance", icon: <FaChartBar /> },
                  { key: "activity", label: "Audit History", icon: <FaHistory /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveDetailTab(tab.key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                      activeDetailTab === tab.key
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* DRAWER TAB BODY */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeDetailTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Current Status
                        </p>
                        <p className="text-base font-black text-slate-900 mt-1">
                          {selectedFranchise.status}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          YTD Revenue Aggregation
                        </p>
                        <p className="text-base font-black text-teal-600 mt-1">
                          {selectedFranchise.revenue}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Quick Administrative Controls
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFranchises(
                              franchises.map((f) =>
                                f.id === selectedFranchise.id
                                  ? { ...f, status: "Active" }
                                  : f
                              )
                            );
                            setSelectedFranchise({
                              ...selectedFranchise,
                              status: "Active",
                            });
                          }}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500"
                        >
                          Set Active
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFranchises(
                              franchises.map((f) =>
                                f.id === selectedFranchise.id
                                  ? { ...f, status: "Suspended" }
                                  : f
                              )
                            );
                            setSelectedFranchise({
                              ...selectedFranchise,
                              status: "Suspended",
                            });
                          }}
                          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-500"
                        >
                          Suspend Access
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === "owner" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Franchise Partner Profile
                      </p>
                      <h3 className="text-lg font-black text-slate-900">
                        {selectedFranchise.owner}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Email: {selectedFranchise.email}
                      </p>
                      <p className="text-xs text-slate-600">
                        Assigned Primary Administrator with full local permission control.
                      </p>
                    </div>
                  </div>
                )}

                {activeDetailTab === "territory" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Registered Jurisdiction Territory
                      </p>
                      <h3 className="text-base font-black text-slate-900">
                        {selectedFranchise.territory}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Territory changes require Head Office authorization and overlap scan clearance. Historical assignments are logged for auditing.
                      </p>
                    </div>
                  </div>
                )}

                {activeDetailTab === "agreement" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Agreement Validity Dates
                      </p>
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Effective Date: {selectedFranchise.agreementDate}</span>
                        <span>Expiration: {selectedFranchise.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === "fees" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Fee Status & Payment Ledger
                      </p>
                      <p className="text-base font-black text-slate-900">
                        Status: <span className="text-teal-600">{selectedFranchise.feesStatus}</span>
                      </p>
                    </div>
                  </div>
                )}

                {activeDetailTab === "compliance" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Regulatory Compliance Documents
                      </p>
                      <p className="text-base font-black text-slate-900">
                        Audit Status: <span className="text-emerald-600">{selectedFranchise.compliance}</span>
                      </p>
                    </div>
                  </div>
                )}

                {activeDetailTab === "reports" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Location Performance Summary
                      </p>
                      <p className="text-base font-black text-slate-900">
                        YTD Revenue: {selectedFranchise.revenue}
                      </p>
                    </div>
                  </div>
                )}

                {activeDetailTab === "activity" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Audit Trail & Event Log
                      </p>
                      <p className="text-xs text-slate-500">
                        Franchise created on {selectedFranchise.agreementDate} by Head Office Admin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}