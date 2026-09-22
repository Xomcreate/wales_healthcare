import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaArrowRight,
  FaShieldAlt,
  FaFileContract,
  FaChartLine,
  FaSyncAlt,
  FaUserPlus,
  FaMapMarkedAlt,
  FaExclamationTriangle,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

export default function DashboardOverview({ setActiveTab }) {
  const [franchises, setFranchises] = useState([]);
  const [users, setUsers] = useState([]);
  const [feesData, setFeesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH DASHBOARD DATA
  |--------------------------------------------------------------------------
  */

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Fetch franchises, users, and fees separately.
       *
       * This is intentional so a problem with one endpoint
       * does not prevent us from seeing the other data.
       */

      const franchiseResponse = await api.get("admin/franchises/");

      const franchiseData = Array.isArray(franchiseResponse.data)
        ? franchiseResponse.data
        : franchiseResponse.data?.results || [];

      setFranchises(franchiseData);

      /*
       * HEAD OFFICE USERS
       */

      try {
        const userResponse = await api.get("admin/users/");

        const userData = Array.isArray(userResponse.data)
          ? userResponse.data
          : userResponse.data?.results || [];

        setUsers(userData);
      } catch (userError) {
        console.error("Failed to load users:", userError);

        /*
         * Don't break the entire dashboard if users fail.
         */
        setUsers([]);
      }

      /*
       * REVENUE — derived from actual collected payments on
       * admin/fees/ (the same endpoint FeesRenewals.js uses),
       * not admin/reports/, which doesn't return real revenue
       * data yet. Kept in its own try/catch so a missing/changed
       * fees shape never breaks franchises/users from rendering.
       */

      try {
        const feesResponse = await api.get("admin/fees/");

        const feesList = Array.isArray(feesResponse.data)
          ? feesResponse.data
          : feesResponse.data?.results || [];

        setFeesData(feesList);
      } catch (feesError) {
        console.error("Failed to load fees/revenue data:", feesError);
        setFeesData([]);
      }
    } catch (err) {
      console.error(
        "Failed to load franchise dashboard data:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load franchise dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CALCULATE FRANCHISE STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalFranchises = franchises.length;

  const activeFranchises = franchises.filter(
    (franchise) => franchise.is_active === true
  ).length;

  const suspendedFranchises = franchises.filter(
    (franchise) => franchise.is_active === false
  ).length;

  /*
   * There is currently no pending approval field in the
   * Franchise model, so this is no longer displayed.
   */

  const totalUsers = users.length;

  const activePercentage =
    totalFranchises > 0
      ? ((activeFranchises / totalFranchises) * 100).toFixed(1)
      : "0.0";

  /*
  |--------------------------------------------------------------------------
  | REVENUE (derived from admin/fees/)
  |--------------------------------------------------------------------------
  |
  | Each fee record carries amount_paid / paid_amount — the same
  | fields FeesRenewals.js reads. We sum those for the headline
  | "Total Collected" figure and bucket them by month (using
  | due_date, falling back to updated_at/created_at) for the bar
  | chart. If admin/fees/ is paginated with a small page size,
  | this will only reflect the fetched page — see note below.
  |
  */

  const fallbackMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
  ];

  const totalCollected = feesData.reduce(
    (sum, f) => sum + Number(f.amount_paid ?? f.paid_amount ?? 0),
    0
  );

  const monthlyCollected = {};

  feesData.forEach((f) => {
    const paid = Number(f.amount_paid ?? f.paid_amount ?? 0);
    if (!paid) return;

    const dateStr = f.due_date || f.updated_at || f.created_at;
    const d = dateStr ? new Date(dateStr) : null;
    if (!d || Number.isNaN(d.getTime())) return;

    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    monthlyCollected[key] = (monthlyCollected[key] || 0) + paid;
  });

  const revenueLabels = Object.keys(monthlyCollected);
  const revenueValues = Object.values(monthlyCollected);

  const maxRevenue = revenueValues.length
    ? Math.max(1, ...revenueValues)
    : null;

  const revenueBars = revenueValues.length
    ? revenueLabels.map((month, i) => ({
        month,
        height: `${Math.max(4, (revenueValues[i] / maxRevenue) * 100)}%`,
        value: `₦${revenueValues[i].toLocaleString()}`,
      }))
    : fallbackMonths.map((month) => ({
        month,
        height: "20%",
        value: "—",
      }));

  const revenueConnected = revenueValues.length > 0;

  /*
  |--------------------------------------------------------------------------
  | KPI CARDS
  |--------------------------------------------------------------------------
  */

  const kpiCards = [
    {
      title: "Total Franchises",
      value: loading ? "—" : totalFranchises,
      change: loading
        ? "Loading..."
        : `${totalFranchises} registered`,
      icon: <FaBuilding />,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
      targetTab: "franchises",
    },

    {
      title: "Active Franchises",
      value: loading ? "—" : activeFranchises,
      change: loading
        ? "Loading..."
        : `${activePercentage}% operational`,
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      targetTab: "franchises",
    },

    {
      title: "Total Users",
      value: loading ? "—" : totalUsers,
      change: loading
        ? "Loading..."
        : `${totalUsers} registered`,
      icon: <FaUsers />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      targetTab: "users",
    },

    {
      title: "Total Collected",
      value: loading ? "—" : `₦${totalCollected.toLocaleString()}`,
      change: loading ? "Loading..." : "From recorded payments",
      icon: <FaMoneyBillWave />,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
      targetTab: "fees",
    },

    {
      title: "Suspended",
      value: loading ? "—" : suspendedFranchises,
      change: "Currently inactive",
      icon: <FaBan />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      targetTab: "franchises",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | STATUS PERCENTAGES
  |--------------------------------------------------------------------------
  */

  const activeStatusPercentage =
    totalFranchises > 0
      ? (activeFranchises / totalFranchises) * 100
      : 0;

  const suspendedStatusPercentage =
    totalFranchises > 0
      ? (suspendedFranchises / totalFranchises) * 100
      : 0;

  /*
  |--------------------------------------------------------------------------
  | KEY FEATURES
  |--------------------------------------------------------------------------
  */

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

      {/* ================================================================
          WELCOME BANNER
      ================================================================ */}

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
            Making network health visible without requiring administrators to
            open each franchise individually.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              setActiveTab && setActiveTab("franchises")
            }
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-teal-900/30 transition hover:bg-teal-500 active:scale-95"
          >
            <span>Manage Franchises</span>

            <FaArrowRight className="text-xs" />
          </button>

        </div>
      </div>


      {/* ================================================================
          ERROR MESSAGE
      ================================================================ */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">

          <FaExclamationTriangle />

          <div>
            <p className="font-bold">
              Unable to load dashboard data
            </p>

            <p className="text-xs">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="ml-auto rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
          >
            Retry
          </button>

        </div>
      )}


      {/* ================================================================
          KPI METRIC CARDS
      ================================================================ */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

        {kpiCards.map((kpi, idx) => (

          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onClick={() =>
              setActiveTab && setActiveTab(kpi.targetTab)
            }
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

            <div className="mt-4 flex items-baseline justify-between gap-2">

              <h3 className="text-3xl font-black tracking-tight text-slate-900">
                {kpi.value}
              </h3>

              <span
                className={`text-right text-[11px] font-bold ${kpi.color}`}
              >
                {kpi.change}
              </span>

            </div>

          </motion.div>

        ))}

      </div>


      {/* ================================================================
          CHARTS SECTION
      ================================================================ */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ============================================================
            REVENUE
        ============================================================ */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">

          <div className="flex items-center justify-between pb-6">

            <div>

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Revenue Collected by Month
              </h3>

              <p className="text-xs text-slate-400">
                {revenueConnected
                  ? "Live totals from recorded fee payments."
                  : "No recorded payments yet — bars will populate once fees are paid."}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setActiveTab && setActiveTab("fees")
              }
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              View Report →
            </button>

          </div>


          {/* BAR CHART */}

          <div className="flex h-56 items-end justify-between gap-3 border-b border-slate-100 pt-6 pb-2">

            {revenueBars.map((bar, i) => (

              <div
                key={i}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >

                <span className="absolute -top-7 rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                  {bar.value}
                </span>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: bar.height }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                  }}
                  className="w-full rounded-t-lg bg-slate-200 transition group-hover:bg-teal-300"
                />

                <span className="mt-2 text-[10px] font-bold text-slate-400">
                  {bar.month}
                </span>

              </div>

            ))}

          </div>


          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">

            <span className="font-medium">
              {revenueConnected
                ? "Fees API connected"
                : "No payments recorded yet"}
            </span>

            <span className="flex items-center gap-1.5 font-bold text-emerald-600">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              Franchise API Live

            </span>

          </div>

        </div>


        {/* ============================================================
            FRANCHISE STATUS
        ============================================================ */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">

          <div className="pb-4">

            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Franchise Status
            </h3>

            <p className="text-xs text-slate-400">
              Current operational spread
            </p>

          </div>


          {/* DONUT */}

          <div className="my-6 flex items-center justify-center">

            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full shadow-inner"
              style={{
                background: `conic-gradient(
                  #14b8a6 0% ${activeStatusPercentage}%,
                  #f43f5e ${activeStatusPercentage}% ${
                    activeStatusPercentage +
                    suspendedStatusPercentage
                  }%,
                  #e2e8f0 ${
                    activeStatusPercentage +
                    suspendedStatusPercentage
                  }% 100%
                )`,
              }}
            >

              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">

                <span className="text-2xl font-black text-slate-900">
                  {loading ? "—" : totalFranchises}
                </span>

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

              <span className="font-bold text-slate-900">
                {loading ? "—" : activeFranchises}
              </span>

            </div>


            <div className="flex items-center justify-between text-xs">

              <span className="flex items-center gap-2 font-medium text-slate-700">

                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                Total Users

              </span>

              <span className="font-bold text-slate-900">
                {loading ? "—" : totalUsers}
              </span>

            </div>


            <div className="flex items-center justify-between text-xs">

              <span className="flex items-center gap-2 font-medium text-slate-700">

                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />

                Suspended / Inactive

              </span>

              <span className="font-bold text-slate-900">
                {loading ? "—" : suspendedFranchises}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================================
          KEY FEATURES
      ================================================================ */}

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