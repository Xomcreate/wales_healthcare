import React from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaArrowRight,
  FaShieldAlt,
  FaFileContract,
  FaChartLine,
  FaSyncAlt,
  FaUserPlus,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function DashboardOverview({ setActiveTab }) {
  // KPI Metric Cards Data corresponding to your reference table
  const kpiCards = [
    {
      title: "Total Franchises",
      value: "42",
      change: "+4 this month",
      icon: <FaBuilding />,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
      targetTab: "franchises",
    },
    {
      title: "Active Franchises",
      value: "38",
      change: "90.4% operational",
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      targetTab: "franchises",
    },
    {
      title: "Pending Approval",
      value: "2",
      change: "Requires review",
      icon: <FaClock />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      targetTab: "franchises",
    },
    {
      title: "Suspended",
      value: "2",
      change: "Agreement expired",
      icon: <FaBan />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      targetTab: "compliance",
    },
  ];

  // Revenue by Location mock monthly bar distribution data
  const revenueBars = [
    { month: "Jan", height: "45%", value: "$32k" },
    { month: "Feb", height: "55%", value: "$41k" },
    { month: "Mar", height: "50%", value: "$38k" },
    { month: "Apr", height: "70%", value: "$54k" },
    { month: "May", height: "65%", value: "$49k" },
    { month: "Jun", height: "85%", value: "$68k" },
    { month: "Jul", height: "80%", value: "$62k" },
    { month: "Aug", height: "95%", value: "$76k" },
    { month: "Sep", height: "90%", value: "$71k" },
  ];

  const keyFeatures = [
    {
      title: "Create & manage franchise locations",
      desc: "Onboard new branches and assign territories.",
      icon: <FaMapMarkedAlt className="text-teal-600" />,
    },
    {
      title: "Approve partners & assign territories",
      desc: "Manage partner applications and regional jurisdictions.",
      icon: <FaUserPlus className="text-teal-600" />,
    },
    {
      title: "Set user permissions",
      desc: "Control access hierarchies across the network.",
      icon: <FaShieldAlt className="text-teal-600" />,
    },
    {
      title: "Maintain brand templates",
      desc: "Publish brand assets, guidelines, and collateral.",
      icon: <FaFileContract className="text-teal-600" />,
    },
    {
      title: "Upload manuals, training & policies",
      desc: "Distribute standard operating procedures network-wide.",
      icon: <FaChartLine className="text-teal-600" />,
    },
    {
      title: "Monitor fees, renewals & compliance",
      desc: "Track financial health, license expirations, and audits.",
      icon: <FaSyncAlt className="text-teal-600" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER / OVERVIEW HEADER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white shadow-lg md:flex-row md:items-center md:p-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-teal-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-300 ring-1 ring-teal-500/30">
              Network Control Plane
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            Head Office Dashboard Overview
          </h1>
          <p className="mt-1 text-xs text-slate-300 md:text-sm">
            Making network health visible without requiring administrators to open
            each franchise individually.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab && setActiveTab("franchises")}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/30 transition hover:bg-teal-500 active:scale-95"
          >
            <span>Manage Franchises</span>
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setActiveTab && setActiveTab(kpi.targetTab)}
            className={`cursor-pointer rounded-2xl border ${kpi.borderColor} bg-white p-5 shadow-xs transition hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {kpi.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bgColor} ${kpi.color} text-base`}
              >
                {kpi.icon}
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">
                {kpi.value}
              </h3>
              <span className={`text-[11px] font-bold ${kpi.color}`}>
                {kpi.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS SECTION: REVENUE BY LOCATION & FRANCHISE STATUS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* REVENUE BY LOCATION (2 Columns) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Revenue by Location
              </h3>
              <p className="text-xs text-slate-400">
                Permitted financial aggregation across network branches
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("reports")}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              View Report →
            </button>
          </div>

          {/* BAR CHART VISUALIZATION */}
          <div className="flex h-56 items-end justify-between gap-3 border-b border-slate-100 pt-6 pb-2">
            {revenueBars.map((bar, i) => (
              <div
                key={i}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >
                {/* TOOLTIP VALUE */}
                <span className="absolute -top-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                  {bar.value}
                </span>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: bar.height }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-t-lg bg-teal-500 transition group-hover:bg-teal-600"
                />
                <span className="mt-2 text-[10px] font-bold text-slate-400">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Aggregated: $511,000 YTD</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>

        {/* FRANCHISE STATUS DONUT BREAKDOWN (1 Column) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Franchise Status
            </h3>
            <p className="text-xs text-slate-400">Current operational spread</p>
          </div>

          {/* DONUT REPRESENTATION */}
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-teal-500 bg-teal-50 shadow-inner">
              <div className="absolute inset-2 rounded-full border-8 border-amber-400 border-t-transparent" />
              <div className="absolute inset-4 rounded-full border-8 border-rose-500 border-t-transparent border-r-transparent" />
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900">42</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Total
                </p>
              </div>
            </div>
          </div>

          {/* STATUS LEGEND */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                Active
              </span>
              <span className="font-bold text-slate-900">38</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Pending
              </span>
              <span className="font-bold text-slate-900">2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Suspended
              </span>
              <span className="font-bold text-slate-900">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* KEY FEATURES / REFERENCE GUIDE SECTION */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
        <div className="mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Portal Capabilities & Key Features
          </h3>
          <p className="text-xs text-slate-400">
            Quick reference guide for network control plane administration
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((feat, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-teal-200 hover:bg-teal-50/20"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {feat.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}