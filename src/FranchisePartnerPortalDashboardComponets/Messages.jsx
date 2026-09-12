import React, { useState } from "react";
import {
  FaComments,
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaUser,
  FaBuilding,
  FaCheckDouble,
  FaFilter,
  FaTimes,
  FaPhoneAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function Messages() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState("");

  // Sample chat conversations list
  const chatsList = [
    {
      id: 1,
      name: "Eleanor Vance",
      role: "Customer",
      category: "customers",
      lastMessage: "Can we reschedule tomorrow's personal care support?",
      time: "10:42 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Head Office Support",
      role: "Central Management",
      category: "headoffice",
      lastMessage: "Q2 operational compliance documents have been updated.",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Nurse Sarah Jenkins",
      role: "Staff / Operations",
      category: "staff",
      lastMessage: "Shift logs for the morning visit have been submitted.",
      time: "Mar 11",
      unread: 0,
      online: false,
    },
  ];

  // Sample messages for the active conversation
  const [messages, setMessages] = useState([
    { id: 1, sender: "Eleanor Vance", text: "Hello, good morning! I have a quick question regarding my scheduled appointment.", time: "10:38 AM", incoming: true },
    { id: 2, sender: "You", text: "Good morning Eleanor! How can I assist you today?", time: "10:40 AM", incoming: false },
    { id: 3, sender: "Eleanor Vance", text: "Can we reschedule tomorrow's personal care support to the afternoon instead?", time: "10:42 AM", incoming: true },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "You",
        text: messageInput,
        time: "Just now",
        incoming: false,
      },
    ]);
    setMessageInput("");
  };

  const filteredChats = chatsList.filter((chat) => {
    if (activeFilter === "all") return true;
    return chat.category === activeFilter;
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
            Messages & Communications Hub
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time messaging with customers, head office announcements, and internal staff coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
            🟢 Live Messaging Active
          </span>
        </div>
      </div>

      {/* CHAT INTERFACE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs min-h-150">
        
        {/* LEFT PANE: CONVERSATION LIST */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Search Bar */}
          <div className="p-3.5 border-b border-slate-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-teal-600 transition"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 bg-white overflow-x-auto scrollbar-none text-[11px] font-bold">
            {[
              { key: "all", label: "All" },
              { key: "customers", label: "Customers" },
              { key: "headoffice", label: "Head Office" },
              { key: "staff", label: "Staff" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  activeFilter === tab.key
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversations Stack */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                  selectedChat === chat.id ? "bg-teal-50/70 border-l-4 border-teal-600" : "hover:bg-slate-100/60"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs truncate">{chat.name}</h5>
                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                  </div>
                  <p className="text-[10px] text-teal-700 font-semibold">{chat.role}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
                </div>

                {chat.unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANE: ACTIVE CHAT WINDOW */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                EV
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Eleanor Vance</h4>
                <span className="text-[10px] text-emerald-600 font-medium">Online • Customer</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition"><FaPhoneAlt className="text-xs" /></button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition"><FaEllipsisV className="text-xs" /></button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.incoming ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs shadow-2xs ${
                    msg.incoming
                      ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                      : "bg-teal-600 text-white rounded-tr-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.time}</span>
                  {!msg.incoming && <FaCheckDouble className="text-teal-600 text-[9px]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              <FaPaperclip className="text-xs" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message to Eleanor..."
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-teal-600 transition"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 transition active:scale-95"
            >
              <FaPaperPlane className="text-[10px]" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>
    </motion.div>
  );
}