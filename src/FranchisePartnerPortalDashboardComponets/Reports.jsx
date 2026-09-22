import React, { useEffect, useState } from "react";
import {
  FaFileDownload,
  FaCalendarAlt,
  FaPoundSign,
  FaUsers,
  FaConciergeBell,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// TODO: point this at the axios instance your other franchise pages use
// (the one that adds the JWT Authorization header and the API base URL).
import api from "../api/axios";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* The server scopes every report to the logged-in manager's           */
/* franchise, so no franchise id is sent from this page.               */
/* ------------------------------------------------------------------ */

const TABS = [
  {
    key: "financial",
    label: "Financial Reports",
    icon: FaPoundSign,
    heading: "Financial Performance & Revenue Logs",
    hint: "Invoices, payments received and outstanding balances",
    reports: ["financial"],
  },
  {
    key: "operational",
    label: "Operational & Services",
    icon: FaConciergeBell,
    heading: "Service Utilization & Appointment Logs",
    hint: "Service delivery, cancellations and staff workload",
    reports: ["operations", "staff"],
  },
  {
    key: "compliance",
    label: "Compliance & Audit",
    icon: FaShieldAlt,
    heading: "Compliance & Regulatory Audit Trails",
    hint: "Licences, insurance and document expiry status",
    reports: ["compliance"],
  },
];

const REPORT_META = {
  performance: { title: "Franchise Performance", usesDates: true },
  financial: { title: "Revenue, Payments & Outstanding Invoices", usesDates: true },
  operations: { title: "Service Delivery & Cancellations", usesDates: true },
  staff: { title: "Staff Workload & Headcount", usesDates: true },
  compliance: { title: "Compliance & Document Expiry", usesDates: false },
};

const EXPORT_FORMATS = [
  { key: "csv", label: "CSV" },
  { key: "xlsx", label: "Excel" },
  { key: "pdf", label: "PDF" },
];

const RANGES = [
  { key: "month", label: "This month" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "ytd", label: "Year to date" },
  { key: "custom", label: "Custom range" },
];

const PREVIEW_ROWS = 8;

/* ------------------------------------------------------------------ */
/* Date + formatting helpers (all local time, no UTC conversion)       */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (v) => {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

function resolveRange(key, custom) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (key) {
    case "30d":
      return { start: toISO(addDays(today, -29)), end: toISO(today) };
    case "90d":
      return { start: toISO(addDays(today, -89)), end: toISO(today) };
    case "ytd":
      return { start: toISO(new Date(today.getFullYear(), 0, 1)), end: toISO(today) };
    case "custom":
      return { start: custom.start, end: custom.end };
    default:
      return {
        start: toISO(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: toISO(new Date(today.getFullYear(), today.getMonth() + 1, 0)), // last day of the month
      };
  }
}

/* Future days can't have revenue yet, so trend comparisons only use elapsed days. */
function capToToday({ start, end }) {
  if (!start || !end) return { start, end };
  const todayISO = toISO(new Date());
  return { start, end: end > todayISO ? todayISO : end };
}

/* Same-length period immediately before `range`, used for the trend arrow. */
function previousRange({ start, end }) {
  if (!start || !end) return null;
  const s = parseISO(start);
  const e = parseISO(end);
  if (e < s) return null;
  const days = Math.round((e - s) / 86400000) + 1;
  const prevEnd = addDays(s, -1);
  const prevStart = addDays(prevEnd, -(days - 1));
  return { start: toISO(prevStart), end: toISO(prevEnd) };
}

const gbp = (n) =>
  "£" +
  Number(n || 0).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function fmtCell(col, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (col.type === "currency")
    return Number(value).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (col.type === "percent") return Number(value).toFixed(1);
  return String(value);
}

/* ------------------------------------------------------------------ */
/* API helpers                                                         */
/* ------------------------------------------------------------------ */

function rangeParams(slug, range) {
  const params = {};
  if (REPORT_META[slug]?.usesDates === false) return params;
  if (range.start) params.start_date = range.start;
  if (range.end) params.end_date = range.end;
  return params;
}

/* With responseType "blob", error bodies also arrive as a Blob. */
async function getErrorMessage(err) {
  const fallback = "Something went wrong. Please try again.";
  const data = err?.response?.data;

  try {
    if (data instanceof Blob) {
      const parsed = JSON.parse(await data.text());
      if (typeof parsed.detail === "string") return parsed.detail;
      return Object.values(parsed).flat().join(" ") || fallback;
    }
    if (typeof data?.detail === "string") return data.detail;
    if (data && typeof data === "object") {
      const joined = Object.values(data).flat().join(" ");
      if (joined) return joined;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function saveBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function downloadReport(slug, format, range) {
  const res = await api.get(`/admin/reports/${slug}/`, {
    params: { ...rangeParams(slug, range), export: format },
    responseType: "blob",
  });
  saveBlob(res.data, `${slug}-report-${toISO(new Date())}.${format}`);
}

/* ------------------------------------------------------------------ */
/* One live report: summary, preview table and download buttons        */
/* ------------------------------------------------------------------ */

function ReportPanel({ slug, range }) {
  const meta = REPORT_META[slug];
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [downloading, setDownloading] = useState("");
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));

    api
      .get(`/admin/reports/${slug}/`, { params: rangeParams(slug, range) })
      .then((res) => {
        if (!cancelled) setState({ loading: false, error: "", data: res.data });
      })
      .catch(async (err) => {
        const message = await getErrorMessage(err);
        if (!cancelled) setState({ loading: false, error: message, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, range.start, range.end]);

  const handleDownload = async (format) => {
    setDownloading(format);
    setDownloadError("");
    try {
      await downloadReport(slug, format, range);
    } catch (err) {
      setDownloadError(await getErrorMessage(err));
    } finally {
      setDownloading("");
    }
  };

  const { loading, error, data } = state;
  const rows = data?.rows || [];
  const columns = data?.columns || [];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-sm font-black text-slate-900">{meta.title}</h5>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {data
              ? meta.usesDates
                ? `Period: ${data.filters.period}`
                : "Point-in-time audit as of today"
              : "\u00A0"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt.key}
              type="button"
              onClick={() => handleDownload(fmt.key)}
              disabled={!!downloading || loading || !!error}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition disabled:opacity-50"
            >
              <FaFileDownload className="text-[10px]" />
              {downloading === fmt.key ? "Preparing…" : fmt.label}
            </button>
          ))}
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {downloadError}
        </p>
      )}

      {loading && <p className="p-6 text-xs text-slate-400">Loading report…</p>}

      {!loading && error && (
        <p role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && data && (
        <>
          {data.summary.length > 0 && (
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.summary.map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5 wrap-break-words">{String(item.value)}</p>
                </div>
              ))}
            </div>
          )}

          {rows.length === 0 ? (
            <p className="px-4 pb-6 text-xs text-slate-500">
              No records for this period. Try a wider date range.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {columns.map((c) => (
                        <th key={c.key} className="py-3 px-4 whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {rows.slice(0, PREVIEW_ROWS).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        {columns.map((c) => (
                          <td
                            key={c.key}
                            className={`py-3 px-4 whitespace-nowrap ${
                              c.type === "text" ? "text-slate-700" : "text-slate-900 font-medium tabular-nums"
                            }`}
                          >
                            {fmtCell(c, row[c.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rows.length > PREVIEW_ROWS && (
                <p className="px-4 py-3 text-[11px] text-slate-400 border-t border-slate-100">
                  Showing {PREVIEW_ROWS} of {rows.length} rows. Download the report for the full list.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Reports() {
  const [activeTab, setActiveTab] = useState("financial");
  const [rangeKey, setRangeKey] = useState("month");
  const [custom, setCustom] = useState({ start: "", end: "" });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({ slug: "financial", format: "csv" });
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const [cards, setCards] = useState({ loading: true, error: "", current: null, previous: null, overview: null });

  const range = resolveRange(rangeKey, custom);
  const currentTab = TABS.find((t) => t.key === activeTab);

  /* Top cards: performance totals for this period vs the previous one, plus compliance overview */
  useEffect(() => {
    let cancelled = false;
    const prev = previousRange(capToToday(range));

    setCards((c) => ({ ...c, loading: true, error: "" }));

    Promise.all([
      api.get("/admin/reports/performance/", { params: rangeParams("performance", range) }),
      prev
        ? api.get("/admin/reports/performance/", { params: rangeParams("performance", prev) })
        : Promise.resolve(null),
      api.get("/admin/reports/"),
    ])
      .then(([cur, pre, ov]) => {
        if (cancelled) return;
        setCards({
          loading: false,
          error: "",
          current: cur.data,
          previous: pre ? pre.data : null,
          overview: ov.data,
        });
      })
      .catch(async (err) => {
        const message = await getErrorMessage(err);
        if (!cancelled) setCards({ loading: false, error: message, current: null, previous: null, overview: null });
      });

    return () => {
      cancelled = true;
    };
  }, [range.start, range.end]);

  const totals = (report) =>
    (report?.rows || []).reduce(
      (acc, r) => ({
        revenue: acc.revenue + (r.revenue || 0),
        customers: acc.customers + (r.customers || 0),
        booked: acc.booked + (r.appointments_booked || 0),
        delivered: acc.delivered + (r.services_delivered || 0),
      }),
      { revenue: 0, customers: 0, booked: 0, delivered: 0 }
    );

  const cur = totals(cards.current);
  const prevTotals = totals(cards.previous);
  const revenueChange =
    cards.previous && prevTotals.revenue > 0
      ? ((cur.revenue - prevTotals.revenue) / prevTotals.revenue) * 100
      : null;
  const completionRate = cur.booked ? Math.round((cur.delivered / cur.booked) * 1000) / 10 : null;

  const complianceRate = cards.overview?.compliance_rate;
  const complianceColor =
    complianceRate == null
      ? "text-slate-400"
      : complianceRate >= 90
      ? "text-emerald-600"
      : complianceRate >= 70
      ? "text-amber-600"
      : "text-red-600";

  const dash = cards.loading ? "…" : "—";

  const openExportModal = () => {
    setExportError("");
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    if (exporting) return;
    setShowExportModal(false);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError("");
    try {
      await downloadReport(exportForm.slug, exportForm.format, range);
      setShowExportModal(false);
    } catch (err) {
      setExportError(await getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const inputClass =
    "w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none";

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
            Reports & Analytics Hub
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate, filter, and export financial, operational, and compliance reports for your franchise.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={openExportModal}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaFileDownload className="text-[10px]" />
            <span>Export Custom Report</span>
          </button>
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-end">
        <div className="sm:w-56">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Reporting period
          </label>
          <select value={rangeKey} onChange={(e) => setRangeKey(e.target.value)} className={inputClass}>
            {RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {rangeKey === "custom" && (
          <>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                From
              </label>
              <input
                type="date"
                value={custom.start}
                max={custom.end || undefined}
                onChange={(e) => setCustom({ ...custom, start: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                To
              </label>
              <input
                type="date"
                value={custom.end}
                min={custom.start || undefined}
                onChange={(e) => setCustom({ ...custom, end: e.target.value })}
                className={inputClass}
              />
            </div>
          </>
        )}

        <p className="text-[11px] text-slate-500 sm:ml-auto">
          {range.start || range.end
            ? `${range.start || "Beginning"} to ${range.end || "today"}`
            : "All time"}
        </p>
      </div>

      {cards.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          Could not load your figures: {cards.error}
        </p>
      )}

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue Received</p>
            <FaPoundSign className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">
            {cards.current ? gbp(cur.revenue) : dash}
          </h4>
          <p
            className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
              revenueChange == null ? "text-slate-500" : revenueChange >= 0 ? "text-teal-600" : "text-red-600"
            }`}
          >
            {revenueChange == null ? (
              "No earlier period to compare"
            ) : (
              <>
                {revenueChange >= 0 ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                {revenueChange >= 0 ? "+" : ""}
                {revenueChange.toFixed(1)}% vs previous period
              </>
            )}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointments Fulfilled</p>
            <FaCalendarAlt className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">
            {cards.current ? cur.delivered.toLocaleString("en-GB") : dash}
          </h4>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">
            {cards.current
              ? completionRate == null
                ? "No appointments in this period"
                : `${completionRate}% completion rate`
              : "\u00A0"}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Clients</p>
            <FaUsers className="text-teal-600 text-xs" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mt-2">
            {cards.current ? cur.customers.toLocaleString("en-GB") : dash}
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Customers on your franchise</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Status</p>
            <FaShieldAlt className="text-teal-600 text-xs" />
          </div>
          <h4 className={`text-2xl font-black mt-2 ${complianceColor}`}>
            {cards.overview ? (complianceRate == null ? "No data" : `${complianceRate}%`) : dash}
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {cards.overview
              ? `${cards.overview.expired_documents} expired · ${cards.overview.missing_documents} missing`
              : "\u00A0"}
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
                activeTab === tab.key
                  ? "border-teal-600 text-teal-700 bg-teal-50/40"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <TabIcon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">{currentTab.heading}</h4>
          <span className="text-xs text-slate-400">{currentTab.hint}</span>
        </div>

        {currentTab.reports.map((slug) => (
          <ReportPanel key={`${slug}-${range.start}-${range.end}`} slug={slug} range={range} />
        ))}
      </div>

      {/* ================= EXPORT MODAL ================= */}
      <AnimatePresence>
        {showExportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeExportModal}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Custom Report Export</h4>
                <button
                  type="button"
                  onClick={closeExportModal}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Report</label>
                  <select
                    value={exportForm.slug}
                    onChange={(e) => setExportForm({ ...exportForm, slug: e.target.value })}
                    className={inputClass}
                  >
                    {Object.entries(REPORT_META).map(([slug, meta]) => (
                      <option key={slug} value={slug}>
                        {meta.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Export Format</label>
                  <div className="flex gap-4 flex-wrap">
                    {EXPORT_FORMATS.map((fmt) => (
                      <label key={fmt.key} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="format"
                          checked={exportForm.format === fmt.key}
                          onChange={() => setExportForm({ ...exportForm, format: fmt.key })}
                        />
                        {fmt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <p className="rounded-xl bg-slate-50 p-3 text-slate-500">
                  {REPORT_META[exportForm.slug].usesDates
                    ? `Uses the reporting period selected on the page (${range.start || "beginning"} to ${range.end || "today"}).`
                    : "This report is a point-in-time audit, so it reflects document statuses as of today."}
                </p>

                {exportError && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 font-medium text-red-700">
                    {exportError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeExportModal}
                  disabled={exporting}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={exporting}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60"
                >
                  {exporting ? "Preparing…" : "Generate & Download"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}