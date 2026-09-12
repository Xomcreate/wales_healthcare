import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaExclamationTriangle,
  FaBell,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function DashboardOverview({ setActiveTab }) {
  // Metric cards matching your documentation reference
  const metrics = [
    {
      title: "Customers",
      value: "182",
      change: "+12% this month",
      icon: <FaUsers />,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Staff",
      value: "47",
      change: "4 unassigned",
      icon: <FaUserTie />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Appointments",
      value: "24",
      change: "Scheduled today",
      icon: <FaCalendarAlt />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Revenue (MTD)",
      value: "$78,420",
      change: "+8.4% vs last MTD",
      icon: <FaFileInvoiceDollar />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  // Upcoming appointments data feed
  const upcomingAppointments = [
    {
      time: "10:00 AM",
      client: "Mary Johnson",
      service: "Personal Care",
      status: "Confirmed",
    },
    {
      time: "11:30 AM",
      client: "David Brown",
      service: "Companionship",
      status: "In Progress",
    },
    {
      time: "2:00 PM",
      client: "Sarah Lee",
      service: "Nursing Support",
      status: "Pending",
    },
  ];

  // Urgent actions / compliance alerts
  const urgentActions = [
    {
      type: "Pending Request",
      label: "3 new service requests unassigned",
      badge: "Action Required",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      type: "Compliance",
      label: "Local branch insurance expires in 14 days",
      badge: "Review Docs",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* PAGE WELCOME & QUICK SHORTCUTS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Operational Overview
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Here is your branch's real-time picture at a glance for today.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* NEW CUSTOMER */}
          <button
            onClick={() => setActiveTab("customers")}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>New Customer</span>
          </button>

          {/* SCHEDULE APPOINTMENT */}
          <button
            onClick={() => setActiveTab("appointments")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaCalendarAlt style={{ color: BRAND_COLOR }} />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {item.title}
              </p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} text-sm font-bold shadow-2xs`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <h4 className="text-2xl font-black text-slate-900">
                {item.value}
              </h4>

              <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* GRID SECTION: URGENT ACTIONS & UPCOMING APPOINTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* UPCOMING APPOINTMENTS (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FaCalendarAlt style={{ color: BRAND_COLOR }} />

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                Today's Upcoming Appointments
              </h4>
            </div>

            <button
              onClick={() => setActiveTab("appointments")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((apt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                    <FaClock className="text-teal-600 text-xs" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {apt.client}
                    </p>

                    <p className="text-[10px] font-medium text-slate-400">
                      {apt.service} • {apt.time}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    apt.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : apt.status === "In Progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* URGENT ACTIONS & COMPLIANCE (Span 1) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <FaExclamationTriangle className="text-amber-500" />

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                Action Required
              </h4>
            </div>

            <div className="space-y-3">
              {urgentActions.map((action, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${action.color} shadow-2xs`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {action.type}
                    </span>

                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/60">
                      {action.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed">
                    {action.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HEAD OFFICE NOTICE BANNER */}
          <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 mb-1 text-teal-400">
              <FaBell className="text-xs" />

              <p className="text-xs font-bold uppercase tracking-wider">
                Head Office Notice
              </p>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Updated compliance policy guidelines for independent business
              operations are now available in documents.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}