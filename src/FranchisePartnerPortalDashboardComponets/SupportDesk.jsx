import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaTimes,
  FaHeadset,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaPaperPlane,
  FaUserShield,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488"; // Teal theme matching your dashboard

export default function SupportDesk() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeTicket, setActiveTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Technical Issue",
    priority: "Medium",
    description: "",
  });

  // Ticket records list state
  const [ticketsList, setTicketsList] = useState([
    {
      id: "TICK-101",
      subject: "Staff portal login error on mobile",
      category: "Technical Issue",
      priority: "High",
      status: "Open",
      requester: "Nurse Sarah",
      date: "Sep 11, 2026",
      messages: [
        {
          sender: "Nurse Sarah",
          role: "Staff",
          time: "Yesterday, 04:15 PM",
          text: "I am unable to sign into the mobile scheduling app using my credentials. It keeps throwing an authentication timeout error.",
        },
        {
          sender: "IT Support Desk",
          role: "Admin",
          time: "Yesterday, 05:00 PM",
          text: "Hello Sarah, we are checking the gateway logs right now. Could you confirm if your app is updated to the latest version?",
        },
      ],
    },
    {
      id: "TICK-102",
      subject: "Client care plan update authorization request",
      category: "Care Coordination",
      priority: "Medium",
      status: "Pending",
      requester: "Dr. Adebayo",
      date: "Sep 10, 2026",
      messages: [
        {
          sender: "Dr. Adebayo",
          role: "Medical Lead",
          time: "Sep 10, 11:30 AM",
          text: "Need approval to shift Mary Johnson's personal care schedule from morning to evening slots permanently.",
        },
      ],
    },
    {
      id: "TICK-103",
      subject: "Monthly billing reconciliation discrepancy",
      category: "Billing & Finance",
      priority: "Low",
      status: "Resolved",
      requester: "Branch Manager",
      date: "Sep 08, 2026",
      messages: [
        {
          sender: "Branch Manager",
          role: "Manager",
          time: "Sep 08, 09:00 AM",
          text: "Invoice #INV-2026-089 has been successfully reconciled with the corporate account.",
        },
      ],
    },
  ]);

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) return;

    const ticketToAdd = {
      id: `TICK-10${ticketsList.length + 1}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      requester: "Current User",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      messages: [
        {
          sender: "Current User",
          role: "Staff",
          time: "Just now",
          text: newTicket.description,
        },
      ],
    };

    setTicketsList([ticketToAdd, ...ticketsList]);
    setNewTicket({ subject: "", category: "Technical Issue", priority: "Medium", description: "" });
    setShowNewTicketModal(false);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    const updatedMessages = [
      ...activeTicket.messages,
      {
        sender: "Support Agent",
        role: "Admin",
        time: "Just now",
        text: replyMessage,
      },
    ];

    const updatedTickets = ticketsList.map((t) =>
      t.id === activeTicket.id ? { ...t, messages: updatedMessages, status: "Open" } : t
    );

    setTicketsList(updatedTickets);
    setActiveTicket({ ...activeTicket, messages: updatedMessages });
    setReplyMessage("");
  };

  const filteredTickets = ticketsList.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
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
              Support Desk & Help Center
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Track branch inquiries, resolve operational support tickets, and manage assistance requests.
            </p>
          </div>

          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 shrink-0"
          >
            <FaPlus className="text-[10px]" />
            <span>New Support Ticket</span>
          </button>
        </div>

        {/* METRICS STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <FaHeadset className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tickets</p>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">{ticketsList.length}</h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FaExclamationCircle className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Requests</p>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {ticketsList.filter((t) => t.status === "Open").length}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaClock className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {ticketsList.filter((t) => t.status === "Pending").length}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FaCheckCircle className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {ticketsList.filter((t) => t.status === "Resolved").length}
              </h4>
            </div>
          </div>
        </div>

        {/* CONTROLS: SEARCH & STATUS TABS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <FaSearch className="absolute left-3.5 top-3.5 text-xs text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject, or requester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mr-1 shrink-0">
              <FaFilter className="text-[9px]" /> Status:
            </span>
            {["All", "Open", "Pending", "Resolved"].map((status) => (
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

        {/* TICKETS TABLE / LIST CONTAINER */}
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Ticket ID & Subject</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Requester</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{ticket.subject}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{ticket.id} • {ticket.date}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">{ticket.category}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-600">{ticket.requester}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            ticket.priority === "High"
                              ? "bg-rose-50 text-rose-700"
                              : ticket.priority === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ticket.status === "Open"
                              ? "bg-amber-50 text-amber-700"
                              : ticket.status === "Pending"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveTicket(ticket)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 font-bold transition"
                        >
                          <FaEye className="text-xs" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No support tickets found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{ticket.subject}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{ticket.id} • {ticket.date}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        ticket.status === "Open"
                          ? "bg-amber-50 text-amber-700"
                          : ticket.status === "Pending"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Category</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{ticket.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Priority</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{ticket.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Req: {ticket.requester}</span>
                    <button
                      onClick={() => setActiveTicket(ticket)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200"
                    >
                      <FaEye className="text-xs" /> Open Ticket
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No tickets available.
              </div>
            )}
          </div>
        </div>

        {/* ================= CREATE TICKET MODAL ================= */}
        <AnimatePresence>
          {showNewTicketModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewTicketModal(false)}
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
                    <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">Helpdesk Support</p>
                    <h4 className="text-base font-black text-slate-900">Submit New Support Ticket</h4>
                  </div>
                  <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-600">
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ticket Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief description of the issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                      >
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Care Coordination">Care Coordination</option>
                        <option value="Billing & Finance">Billing & Finance</option>
                        <option value="Staff Management">Staff Management</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Provide all relevant details to help our support desk resolve this quickly..."
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition shadow-sm"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ================= TICKET CONVERSATION DRAWER ================= */}
        <AnimatePresence>
          {activeTicket && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveTicket(null)}
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
              />

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
                    <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">{activeTicket.id} • {activeTicket.category}</p>
                    <h4 className="text-sm sm:text-base font-black truncate max-w-sm sm:max-w-md">{activeTicket.subject}</h4>
                  </div>
                  <button
                    onClick={() => setActiveTicket(null)}
                    className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                {/* Ticket Meta Details Bar */}
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Requester: </span>
                    <span className="font-semibold text-slate-800">{activeTicket.requester}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Status: </span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{activeTicket.status}</span>
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
                  {activeTicket.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col space-y-1 ${msg.role === "Admin" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 px-1">
                        <span>{msg.sender} ({msg.role})</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed shadow-2xs ${
                          msg.role === "Admin"
                            ? "bg-teal-600 text-white rounded-tr-xs"
                            : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="border-t border-slate-200 p-4 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}