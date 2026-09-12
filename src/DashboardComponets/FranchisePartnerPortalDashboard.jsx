import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaConciergeBell,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaChartBar,
  FaFolderOpen,
  FaEnvelope,
  FaCog,
  FaArrowLeft,
  FaBell,
  FaMapMarkerAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaHeadset,
} from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// DASHBOARD COMPONENTS
import DashboardOverview from "../FranchisePartnerPortalDashboardComponets/DashboardOverview";
import Customers from "../FranchisePartnerPortalDashboardComponets/Customers";
import Employees from "../FranchisePartnerPortalDashboardComponets/Employees";
import Services from "../FranchisePartnerPortalDashboardComponets/Services";
import Appointments from "../FranchisePartnerPortalDashboardComponets/Appointments";
import InvoicesPayments from "../FranchisePartnerPortalDashboardComponets/InvoicesPayments";
import Reports from "../FranchisePartnerPortalDashboardComponets/Reports";
import Documents from "../FranchisePartnerPortalDashboardComponets/Documents";
import Messages from "../FranchisePartnerPortalDashboardComponets/Messages";
import Settings from "../FranchisePartnerPortalDashboardComponets/Settings";
import SupportDesk from "../FranchisePartnerPortalDashboardComponets/SupportDesk";

const BRAND_COLOR = "#0d9488";
const BRAND_BG = "#f8fafc";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, key: "dashboard" },
  { name: "Customers", icon: <FaUsers />, key: "customers" },
  { name: "Employees", icon: <FaUserTie />, key: "employees" },
  { name: "Services", icon: <FaConciergeBell />, key: "services" },
  {
    name: "Appointments",
    icon: <FaCalendarAlt />,
    key: "appointments",
    badge: "4",
  },
  {
    name: "Invoices & Payments",
    icon: <FaFileInvoiceDollar />,
    key: "invoices",
  },
  { name: "Reports", icon: <FaChartBar />, key: "reports" },
  { name: "Documents", icon: <FaFolderOpen />, key: "documents" },
  {
    name: "Messages",
    icon: <FaEnvelope />,
    key: "messages",
    badge: "12",
  },
  { name: "Settings", icon: <FaCog />, key: "settings" },
];

export default function FranchisePartnerPortalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            setActiveTab={setActiveTab}
          />
        );

      case "customers":
        return <Customers />;

      case "employees":
        return <Employees />;

      case "services":
        return <Services />;

      case "appointments":
        return <Appointments />;

      case "invoices":
        return <InvoicesPayments />;

      case "reports":
        return <Reports />;

      case "documents":
        return <Documents />;

      case "messages":
        return <Messages />;

      case "settings":
        return <Settings />;

      // SUPPORT DESK
      case "support":
        return <SupportDesk />;

      default:
        return (
          <DashboardOverview
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const activePage =
    activeTab === "support"
      ? "Support Desk"
      : menuItems.find((item) => item.key === activeTab)?.name ||
        "Dashboard";

  // Sidebar core content JSX
  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* LOGO AREA */}
      <div className="mb-6 flex items-center justify-between px-5">
        <div className="flex items-center">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black shadow-lg shadow-teal-900/30"
            style={{ background: BRAND_COLOR }}
          >
            WH
          </div>

          {(!isSidebarCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-3.5 overflow-hidden"
            >
              <h1 className="truncate text-sm font-black tracking-wide text-white">
                Wales Healthcare
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">
                Partner Portal
              </p>
            </motion.div>
          )}
        </div>

        {/* MOBILE CLOSE */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <FaTimes className="text-lg" />
          </button>
        )}
      </div>

      {/* NAVIGATION LINKS */}
      <LayoutGroup>
        <div className="flex-1 space-y-1.5 overflow-y-auto px-3 scrollbar-none">
          {menuItems.map((item) => {
            const active = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);

                  if (isMobile) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`relative flex w-full items-center rounded-xl px-3.5 py-3 transition-all duration-200 group ${
                  active
                    ? "bg-linear-to-r from-white to-slate-100 text-slate-950 shadow-xl font-bold"
                    : "text-slate-400 hover:bg-white/0.08 hover:text-white"
                }`}
              >
                {/* ACTIVE INDICATOR */}
                {active && (
                  <motion.div
                    layoutId={
                      isMobile
                        ? "mobileActiveTab"
                        : "franchiseActiveTab"
                    }
                    className="absolute left-0 h-6 w-1 rounded-r-full shadow-sm"
                    style={{ background: BRAND_COLOR }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                {/* ICON */}
                <span
                  className={`flex w-6 shrink-0 justify-center text-base transition-transform duration-200 ${
                    active
                      ? "scale-110 text-teal-700"
                      : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>

                {/* TEXT & BADGES */}
                {(!isSidebarCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3.5 flex flex-1 items-center justify-between overflow-hidden"
                  >
                    <span className="truncate text-left text-[11px] font-bold uppercase tracking-wider">
                      {item.name}
                    </span>

                    {item.badge && (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-black ${
                          active
                            ? "bg-teal-600 text-white"
                            : "bg-slate-800 text-teal-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* SIDEBAR FOOTER ACTIONS */}
      <div className="mt-auto border-t border-slate-900/80 px-3 pt-4">
        {(!isSidebarCollapsed || isMobile) && (
          <div className="mb-3 rounded-xl border border-white/10 bg-linear-to-b from-white/0.06 to-white/0.02 p-3.5">
            <div className="mb-1 flex items-center gap-2 text-teal-400">
              <FaHeadset className="text-xs" />

              <p className="text-xs font-bold text-slate-200">
                Need support?
              </p>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-400">
              Head Office assistance is online 24/7.
            </p>

            {/* SUPPORT DESK BUTTON */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("support");

                if (isMobile) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="mt-2.5 w-full rounded-lg border border-teal-500/30 bg-teal-600/20 py-2 text-[10px] font-bold uppercase tracking-wider text-teal-300 shadow-sm transition hover:bg-teal-600 hover:text-white active:scale-95"
            >
              Support Desk
            </button>
          </div>
        )}

        {/* BACK TO WEBSITE */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="group flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:justify-start"
        >
          <FaArrowLeft className="shrink-0 text-sm transition-transform group-hover:-translate-x-1" />

          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3.5 text-[11px] font-bold uppercase tracking-wider">
              Back to Website
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div
      className="flex min-h-screen w-full antialiased text-slate-900 selection:bg-teal-500 selection:text-white"
      style={{ background: BRAND_BG }}
    >
      <div className="relative flex h-screen w-full overflow-hidden">

        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside
          className={`relative z-30 hidden shrink-0 flex-col border-r border-slate-900 bg-slate-950 py-6 text-white shadow-2xl transition-all duration-300 md:flex ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* COLLAPSE TOGGLE */}
          <button
            type="button"
            onClick={() =>
              setIsSidebarCollapsed(!isSidebarCollapsed)
            }
            className="absolute -right-3.5 top-8 z-40 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md transition hover:bg-teal-600 hover:text-white"
            title={
              isSidebarCollapsed
                ? "Expand Sidebar"
                : "Collapse Sidebar"
            }
          >
            <FaChevronLeft
              className={`text-xs transition-transform duration-300 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          <SidebarContent />
        </aside>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
              />

              {/* DRAWER */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 py-6 text-white shadow-2xl md:hidden"
              >
                <SidebarContent isMobile={true} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ================= MAIN CONTAINER ================= */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* ================= TOP HEADER ================= */}
          <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 shadow-xs backdrop-blur-xl md:px-8">

            <div className="flex items-center gap-4">

              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() =>
                  setIsMobileMenuOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition active:scale-95 md:hidden"
              >
                <FaBars />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Franchise Partner Portal
                  </p>
                </div>

                <h2 className="flex items-center gap-1 text-xl font-black tracking-tight text-slate-900 md:text-2xl">
                  {activePage}

                  <span style={{ color: BRAND_COLOR }}>
                    .
                  </span>
                </h2>
              </div>
            </div>

            {/* GLOBAL SEARCH */}
            <div className="relative hidden w-72 items-center lg:flex">
              <FaSearch className="absolute left-3.5 text-xs text-slate-400" />

              <input
                type="text"
                placeholder="Search records, patients..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none shadow-2xs"
              />

              <span className="absolute right-3 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-400 shadow-2xs">
                ⌘K
              </span>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-3">

              {/* BRANCH SELECTOR */}
              <button
                type="button"
                className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 sm:flex"
              >
                <FaMapMarkerAlt
                  style={{ color: BRAND_COLOR }}
                />

                <span>Lagos Branch</span>

                <span className="text-[9px] text-slate-400">
                  ▼
                </span>
              </button>

              {/* NOTIFICATIONS */}
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-600 shadow-2xs transition hover:bg-slate-100 hover:text-teal-600"
              >
                <FaBell className="text-sm" />

                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 animate-bounce rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {/* USER PROFILE */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-1.5 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black shadow-sm"
                  style={{
                    background: "#ccfbf1",
                    color: BRAND_COLOR,
                  }}
                >
                  FP
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-xs font-bold leading-tight text-slate-800">
                    Franchise Partner
                  </p>

                  <p className="text-[10px] font-medium text-slate-400">
                    Administrator
                  </p>
                </div>

                <span className="hidden text-[9px] text-slate-400 md:block">
                  ▼
                </span>
              </button>
            </div>
          </header>

          {/* ================= DYNAMIC CONTENT ================= */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

              <div className="min-h-[75vh] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <footer className="mt-8 flex flex-col items-center justify-between border-t border-slate-200/80 pt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:flex-row">
              <span>
                © 2026 Wales Healthcare. All rights reserved.
              </span>

              <span
                className="mt-2 flex items-center gap-1.5 sm:mt-0"
                style={{ color: BRAND_COLOR }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />

                Secure Partner Portal Ecosystem v3.4
              </span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}