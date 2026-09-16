import React, { useState, useMemo } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

const MOCK_APPLICANTS = [
  {
    id: "APP-1042",
    name: "Grace Adeyemi",
    role: "Caregiver",
    email: "grace.adeyemi@example.com",
    phone: "+234 803 555 1122",
    appliedDate: "2026-09-10",
    status: "New",
    resumeUrl: "#",
    experience: "3 years home care experience",
  },
  {
    id: "APP-1041",
    name: "Michael Obi",
    role: "Nursing Support",
    email: "m.obi@example.com",
    phone: "+234 802 444 9981",
    appliedDate: "2026-09-08",
    status: "Reviewed",
    resumeUrl: "#",
    experience: "RN, 5 years hospital experience",
  },
  {
    id: "APP-1039",
    name: "Blessing Eze",
    role: "Companionship",
    email: "blessing.eze@example.com",
    phone: "+234 810 222 3344",
    appliedDate: "2026-09-05",
    status: "Interviewing",
    resumeUrl: "#",
    experience: "2 years elderly companionship",
  },
  {
    id: "APP-1035",
    name: "Tunde Bakare",
    role: "Facility Staffing",
    email: "tunde.b@example.com",
    phone: "+234 701 999 8877",
    appliedDate: "2026-08-29",
    status: "Hired",
    resumeUrl: "#",
    experience: "4 years facility support",
  },
  {
    id: "APP-1030",
    name: "Ngozi Umeh",
    role: "Caregiver",
    email: "ngozi.umeh@example.com",
    phone: "+234 805 111 4455",
    appliedDate: "2026-08-20",
    status: "Rejected",
    resumeUrl: "#",
    experience: "1 year, no certification",
  },
];

const STATUS_STYLES = {
  New: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    icon: <FaClock className="text-blue-500" />,
  },
  Reviewed: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    icon: <FaClock className="text-amber-500" />,
  },
  Interviewing: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-200",
    icon: <FaCalendarAlt className="text-purple-500" />,
  },
  Hired: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-200",
    icon: <FaCheckCircle className="text-teal-600" />,
  },
  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    icon: <FaTimesCircle className="text-rose-500" />,
  },
};

const STATUS_OPTIONS = ["All", "New", "Reviewed", "Interviewing", "Hired", "Rejected"];

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.New;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.bg} ${style.text} ${style.ring}`}
    >
      {style.icon}
      {status}
    </span>
  );
}

export default function Applicants() {
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchTerm, statusFilter]);

  const updateStatus = (id, newStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setSelectedApplicant((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  const pendingCount = applicants.filter(
    (a) => a.status === "New" || a.status === "Reviewed"
  ).length;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <FaUserPlus style={{ color: BRAND_COLOR }} />
            Job Applicants
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {pendingCount} pending review · {applicants.length} total applications
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role or email..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <FaFilter className="shrink-0 text-xs text-slate-400" />
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* APPLICANTS LIST */}
      {filteredApplicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <FaUserPlus className="mb-3 text-3xl text-slate-300" />
          <p className="text-sm font-bold text-slate-500">No applicants found</p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Applicant</th>
                <th className="hidden px-4 py-3 font-bold sm:table-cell">
                  Role Applied
                </th>
                <th className="hidden px-4 py-3 font-bold md:table-cell">
                  Applied On
                </th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedApplicant(a)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                        style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                      >
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{a.name}</p>
                        <p className="text-[10px] text-slate-400">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 font-medium text-slate-600 sm:table-cell">
                    {a.role}
                  </td>
                  <td className="hidden px-4 py-3.5 font-medium text-slate-500 md:table-cell">
                    {a.appliedDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <FaChevronRight className="ml-auto text-slate-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Applicant Details
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* DRAWER BODY */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl text-sm font-black"
                    style={{ background: "#ccfbf1", color: BRAND_COLOR }}
                  >
                    {selectedApplicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">
                      {selectedApplicant.name}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Applying for {selectedApplicant.role}
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <StatusBadge status={selectedApplicant.status} />
                </div>

                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <FaEnvelope className="shrink-0 text-slate-400" />
                    <span className="font-medium">{selectedApplicant.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <FaPhoneAlt className="shrink-0 text-slate-400" />
                    <span className="font-medium">{selectedApplicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <FaCalendarAlt className="shrink-0 text-slate-400" />
                    <span className="font-medium">
                      Applied {selectedApplicant.appliedDate}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Experience
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {selectedApplicant.experience}
                  </p>
                </div>

                <a
                  href={selectedApplicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <FaFileAlt />
                  View Resume / CV
                </a>
              </div>

              {/* DRAWER ACTIONS */}
              <div className="border-t border-slate-100 px-6 py-4">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Update Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedApplicant.id, "Reviewed")}
                    className="rounded-lg bg-amber-50 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedApplicant.id, "Interviewing")}
                    className="rounded-lg bg-purple-50 py-2 text-[10px] font-bold uppercase tracking-wider text-purple-700 ring-1 ring-purple-200 transition hover:bg-purple-100"
                  >
                    Schedule Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedApplicant.id, "Hired")}
                    className="rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider text-white transition"
                    style={{ background: BRAND_COLOR }}
                  >
                    Hire
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedApplicant.id, "Rejected")}
                    className="rounded-lg bg-rose-50 py-2 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}