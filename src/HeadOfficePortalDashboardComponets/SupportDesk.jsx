import React, { useState } from "react";
import {
  FaHeadset,
  FaSearch,
  FaFilter,
  FaPlus,
  FaTicketAlt,
  FaBuilding,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialTickets = [
  {
    id: "TICK-9012",
    franchise: "North London Healthcare",
    subject: "CQC Compliance Document Verification Delay",
    category: "Compliance",
    priority: "High",
    status: "Open",
    submittedDate: "2026-09-12 11:30",
    assignedTo: "Sarah Jenkins",
  },
  {
    id: "TICK-9011",
    franchise: "Manchester Central Care",
    subject: "Royalty Fee Invoice Reconciliation Query",
    category: "Financial",
    priority: "Medium",
    status: "In Progress",
    submittedDate: "2026-09-11 15:40",
    assignedTo: "Elena Rostova",
  },
  {
    id: "TICK-9010",
    franchise: "Birmingham West Support",
    subject: "New Staff Onboarding Portal Access Error",
    category: "Technical",
    priority: "Urgent",
    status: "Resolved",
    submittedDate: "2026-09-10 09:15",
    assignedTo: "Marcus Vance",
  },
  {
    id: "TICK-9009",
    franchise: "Edinburgh South Medical",
    subject: "Franchise Agreement Renewal Contract Terms",
    category: "Administrative",
    priority: "Low",
    status: "Open",
    submittedDate: "2026-09-09 14:20",
    assignedTo: "Unassigned",
  },
];

export default function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    franchise: "North London Healthcare",
    subject: "",
    category: "Technical",
    priority: "Medium",
    description: "",
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.franchise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const created = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      franchise: newTicket.franchise,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      submittedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
      assignedTo: "Head Office Support",
    };
    setTickets([created, ...tickets]);
    setIsNewTicketModalOpen(false);
    setNewTicket({
      franchise: "North London Healthcare",
      subject: "",
      category: "Technical",
      priority: "Medium",
      description: "",
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20";
      case "High":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20";
      case "Medium":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
              Head Office Assistance
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Support Desk & Franchise Assistance
          </h1>
          <p className="text-xs text-slate-500">
            Manage incoming franchise support inquiries, resolve compliance escalations, and track SLA response times 24/7.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-500 active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Raise Support Ticket</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Tickets</p>
          <h3 className="text-xl font-black text-teal-600 mt-1">
            {tickets.filter((t) => t.status === "Open").length} Requests
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting head office review</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">
            {tickets.filter((t) => t.status === "In Progress").length} Active
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Being actively resolved</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved Today</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">
            {tickets.filter((t) => t.status === "Resolved").length} Closed
          </h3>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">99.2% SLA compliance</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Support Availability</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">Online 24/7</h3>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Average response &lt; 15 mins</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, franchise, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Open", "In Progress", "Resolved"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                selectedStatus === st ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Ticket ID & Date</th>
                <th className="py-3.5 px-6">Franchise Branch</th>
                <th className="py-3.5 px-6">Subject & Category</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Assigned Agent</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-mono">
                      <p className="font-bold text-slate-900">{ticket.id}</p>
                      <p className="text-[10px] text-slate-400">{ticket.submittedDate}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{ticket.franchise}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{ticket.subject}</p>
                      <span className="text-[10px] text-teal-600 font-medium uppercase tracking-wider">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{ticket.assignedTo}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No support tickets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RAISE NEW TICKET MODAL ================= */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewTicketModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Head Office Assistance Desk
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Raise Support Ticket</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Franchise Branch
                  </label>
                  <select
                    value={newTicket.franchise}
                    onChange={(e) => setNewTicket({ ...newTicket, franchise: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option>North London Healthcare</option>
                    <option>Manchester Central Care</option>
                    <option>Birmingham West Support</option>
                    <option>Edinburgh South Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subject / Issue Summary
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Invoice discrepancy or compliance document query"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      <option>Technical</option>
                      <option>Compliance</option>
                      <option>Financial</option>
                      <option>Administrative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Provide full details regarding the assistance required..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-teal-500 transition active:scale-95"
                  >
                    <FaPaperPlane className="text-xs" />
                    <span>Submit Ticket</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}