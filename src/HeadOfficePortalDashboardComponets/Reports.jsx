import React, { useEffect, useState } from "react";
import {
  FaFileDownload,
  FaBuilding,
  FaPoundSign,
  FaCogs,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

// TODO: point this at the axios instance your other head office pages use
// (the one that adds the JWT Authorization header and the API base URL).
import api from "../api/axios";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* Every report is fetched live from /admin/reports/<slug>/.           */
/* ------------------------------------------------------------------ */

const REPORTS = [
  {
    slug: "performance",
    tab: "Performance",
    title: "Franchise Performance",
    description: "Revenue, customers, appointments booked and completed, per franchise.",
    icon: FaBuilding,
    usesDates: true,
  },
  {
    slug: "financial",
    tab: "Finance",
    title: "Financial Governance",
    description: "Invoiced amounts, payments received, outstanding and overdue balances, per franchise.",
    icon: FaPoundSign,
    usesDates: true,
  },
  {
    slug: "operations",
    tab: "Operations",
    title: "Operations & Service Delivery",
    description: "Service requests, completions, cancellations and staff capacity utilisation, per franchise.",
    icon: FaCogs,
    usesDates: true,
  },
  {
    slug: "compliance",
    tab: "Governance",
    title: "Compliance & Safety Audit",
    description: "Valid, expiring, expired and missing regulatory documents, per franchise.",
    icon: FaShieldAlt,
    usesDates: false,
  },
  {
    slug: "staff",
    tab: "Human Resources",
    title: "Staff Workload & Headcount",
    description: "Every employee with status, role, assigned customers and appointments handled.",
    icon: FaUsers,
    usesDates: true,
  },
];

/* Report-specific filters. `key` is the query param the backend reads. */
const EXTRA_FILTERS = {
  performance: [
    { key: "tier", label: "Performance tier", options: ["High", "Medium", "Low", "No Activity"] },
  ],
  financial: [
    { key: "status", label: "Invoice status", options: ["Paid", "Pending", "Overdue"] },
  ],
  operations: [],
  compliance: [
    {
      key: "document_type",
      label: "Document type",
      options: ["Regulatory", "Insurance", "Safety", "HR Compliance", "Legal"],
    },
    {
      key: "compliance_state",
      label: "Compliance state",
      options: [
        "Valid",
        "Expiring in 30 Days",
        "Expiring in 90 Days",
        "Expired",
        "Missing Required",
        "Awaiting Review",
      ],
    },
  ],
  staff: [
    {
      key: "status",
      label: "Employment status",
      options: ["Active", "On Leave", "Inactive", "Pending Compliance"],
    },
    { key: "staff_role", label: "Staff role", type: "text", placeholder: "e.g. Carer" },
  ],
};

const EXPORT_FORMATS = [
  { key: "pdf", label: "PDF" },
  { key: "xlsx", label: "Excel" },
  { key: "csv", label: "CSV" },
];

const RANGES = [
  { key: "month", label: "This month" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "ytd", label: "Year to date" },
  { key: "custom", label: "Custom range" },
];

const PREVIEW_ROWS = 10;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-none";

/* ------------------------------------------------------------------ */
/* Helpers (local dates only, so nothing is a day off outside UTC)     */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

const asList = (data) => (Array.isArray(data) ? data : data?.results ?? []);

function fmtCell(col, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (col.type === "currency")
    return Number(value).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (col.type === "percent") return Number(value).toFixed(1);
  return String(value);
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

function buildParams(report, franchise, range, filters) {
  const params = { franchise };

  if (report.usesDates) {
    if (range.start) params.start_date = range.start;
    if (range.end) params.end_date = range.end;
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  return params;
}

/* ------------------------------------------------------------------ */
/* One live report: filters, summary, preview table, downloads         */
/* ------------------------------------------------------------------ */

function ReportPanel({ report, franchise, range }) {
  const { slug } = report;
  const extraFilters = EXTRA_FILTERS[slug] || [];

  const [filters, setFilters] = useState({});
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [downloading, setDownloading] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const params = buildParams(report, franchise, range, filters);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));

    api
      .get(`/admin/reports/${slug}/`, { params })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, paramsKey]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleDownload = async (format) => {
    setDownloading(format);
    setDownloadError("");
    try {
      const res = await api.get(`/admin/reports/${slug}/`, {
        params: { ...params, export: format },
        responseType: "blob",
      });
      saveBlob(res.data, `${slug}-report-${toISO(new Date())}.${format}`);
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
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      {/* Title + downloads */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">{report.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{report.description}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {data
              ? `${data.filters.scope} · ${report.usesDates ? data.filters.period : "Point-in-time audit as of today"}`
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
            >
              <FaFileDownload className="text-[10px]" />
              {downloading === fmt.key ? "Preparing…" : fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report-specific filters */}
      {extraFilters.length > 0 && (
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {extraFilters.map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {f.label}
              </label>
              {f.type === "text" ? (
                <input
                  type="text"
                  defaultValue={filters[f.key] || ""}
                  placeholder={f.placeholder}
                  onBlur={(e) => setFilter(f.key, e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  className={inputClass}
                />
              ) : (
                <select
                  value={filters[f.key] || ""}
                  onChange={(e) => setFilter(f.key, e.target.value)}
                  className={inputClass}
                >
                  <option value="">All</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {downloadError && (
        <p role="alert" className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {downloadError}
        </p>
      )}

      {loading && <p className="p-6 text-xs text-slate-400">Loading report…</p>}

      {!loading && error && (
        <p role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && data && (
        <>
          {data.summary.length > 0 && (
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.summary.map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5  wrap-break-words">{String(item.value)}</p>
                </div>
              ))}
            </div>
          )}

          {rows.length === 0 ? (
            <p className="px-5 pb-6 text-xs text-slate-500">
              No records match these filters. Try a wider date range or clear a filter.
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
                <p className="px-5 py-3 text-[11px] text-slate-400 border-t border-slate-100">
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
  const [activeSlug, setActiveSlug] = useState(REPORTS[0].slug);
  const [franchise, setFranchise] = useState("all");
  const [franchises, setFranchises] = useState([]);
  const [rangeKey, setRangeKey] = useState("month");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [overview, setOverview] = useState({ loading: true, error: "", data: null });

  const range = resolveRange(rangeKey, custom);
  const activeReport = REPORTS.find((r) => r.slug === activeSlug);

  /* Franchise options for the scope dropdown */
  useEffect(() => {
    api
      .get("/admin/franchises/")
      .then((res) => setFranchises(asList(res.data)))
      .catch(() => setFranchises([]));
  }, []);

  /* Stat cards follow the selected franchise */
  useEffect(() => {
    let cancelled = false;
    setOverview((o) => ({ ...o, loading: true, error: "" }));

    api
      .get("/admin/reports/", { params: { franchise } })
      .then((res) => {
        if (!cancelled) setOverview({ loading: false, error: "", data: res.data });
      })
      .catch(async (err) => {
        const message = await getErrorMessage(err);
        if (!cancelled) setOverview({ loading: false, error: message, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [franchise]);

  const ov = overview.data;
  const dash = overview.loading ? "…" : "—";
  const complianceRate = ov?.compliance_rate;
  const complianceColor =
    complianceRate == null
      ? "text-slate-400"
      : complianceRate >= 90
      ? "text-emerald-600"
      : complianceRate >= 70
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600 ring-1 ring-teal-500/20">
            Head Office Intelligence
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
          Network Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Live network-wide performance, financial, operational, compliance, and staff reports. Preview them here or export as PDF, Excel or CSV.
        </p>
      </div>

      {overview.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          Could not load the overview figures: {overview.error}
        </p>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Branches Tracked</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {ov ? `${ov.active_franchises} ${ov.active_franchises === 1 ? "Franchise" : "Franchises"}` : dash}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">{ov ? "In the selected scope" : "\u00A0"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Customers</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {ov ? ov.total_customers.toLocaleString("en-GB") : dash}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">{ov ? "Across the selected scope" : "\u00A0"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointments This Month</p>
          <h3 className="text-xl font-black text-teal-600 mt-1">
            {ov ? ov.appointments_this_month.toLocaleString("en-GB") : dash}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">{ov ? "Whole month, including upcoming" : "\u00A0"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Audit Score</p>
          <h3 className={`text-xl font-black mt-1 ${complianceColor}`}>
            {ov ? (complianceRate == null ? "No data" : `${complianceRate}%`) : dash}
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {ov ? `${ov.expired_documents} expired · ${ov.missing_documents} missing` : "\u00A0"}
          </p>
        </div>
      </div>

      {/* SCOPE + PERIOD */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs md:flex-row md:items-end">
        <div className="md:w-72">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Franchise / territory
          </label>
          <select value={franchise} onChange={(e) => setFranchise(e.target.value)} className={inputClass}>
            <option value="all">All network franchises</option>
            {franchises.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
                {f.location ? ` — ${f.location}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="md:w-48">
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</label>
              <input
                type="date"
                value={custom.start}
                max={custom.end || undefined}
                onChange={(e) => setCustom({ ...custom, start: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To</label>
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

        <p className="text-[11px] text-slate-500 md:ml-auto">
          {activeReport.usesDates
            ? range.start || range.end
              ? `${range.start || "Beginning"} to ${range.end || "today"}`
              : "All time"
            : "This report is a point-in-time audit, so the period is not used."}
        </p>
      </div>

      {/* REPORT TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {REPORTS.map((r) => {
          const TabIcon = r.icon;
          return (
            <button
              key={r.slug}
              type="button"
              onClick={() => setActiveSlug(r.slug)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                activeSlug === r.slug
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <TabIcon className="text-xs" />
              {r.tab}
            </button>
          );
        })}
      </div>

      {/* ACTIVE REPORT (live) */}
      <ReportPanel key={activeSlug} report={activeReport} franchise={franchise} range={range} />
    </div>
  );
}