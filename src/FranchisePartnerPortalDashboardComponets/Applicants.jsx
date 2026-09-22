import React, { useEffect, useMemo, useState } from "react";
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
  FaSpinner,
  FaExclamationCircle,
  FaVideo,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

const STATUS_STYLES = {
  New: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    icon: <FaClock className="text-blue-500" />,
  },

  "Under Review": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    icon: <FaClock className="text-amber-500" />,
  },

  Shortlisted: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
    icon: <FaCheckCircle className="text-indigo-500" />,
  },

  Interview: {
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

const STATUS_OPTIONS = [
  "All",
  "New",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Hired",
  "Rejected",
];

const INTERVIEW_TYPES = ["In-Person", "Phone", "Video"];

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.New;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.bg} ${style.text} ${style.ring}`}
    >
      {style.icon}
      {status || "New"}
    </span>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "—";

  const parts = String(time).split(":");

  if (parts.length < 2) return time;

  const hour = Number(parts[0]);
  const minute = parts[1];

  if (Number.isNaN(hour)) return time;

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Something went wrong.";
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data === "string") {
    return data;
  }

  const firstField = Object.values(data)?.[0];

  if (Array.isArray(firstField)) {
    return firstField[0];
  }

  if (typeof firstField === "string") {
    return firstField;
  }

  return "Unable to complete this action.";
}

function Modal({ children, onClose, title }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-black text-slate-900">{title}</h3>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto p-5">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    interview_date: "",
    interview_time: "",
    interview_type: "Video",
    interview_location: "",
    interview_link: "",
    interviewer: "",
    interview_message: "",
  });

  const [hireForm, setHireForm] = useState({
    start_date: "",
    hiring_message: "",
  });

  const [rejectForm, setRejectForm] = useState({
    hiring_message: "",
  });

  /*
   * FETCH APPLICANTS
   */
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/career-applications/");

      const data = response.data;

      const applicantList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setApplicants(applicantList);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
      setError(getErrorMessage(err));
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  /*
   * FILTER
   */
  const filteredApplicants = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return applicants.filter((applicant) => {
      const name = applicant.full_name || applicant.name || "";
      const position = applicant.position || applicant.role || "";
      const email = applicant.email || "";

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        position.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchTerm, statusFilter]);

  /*
   * COUNTS
   */
  const pendingCount = applicants.filter(
    (a) =>
      a.status === "New" ||
      a.status === "Under Review" ||
      a.status === "Shortlisted"
  ).length;

  /*
   * BASIC STATUS UPDATE
   */
  const updateStatus = async (id, newStatus, extraData = {}) => {
    try {
      setUpdatingStatus(true);

      const response = await api.patch(
        `/admin/career-applications/${id}/`,
        {
          status: newStatus,
          ...extraData,
        }
      );

      const updatedApplicant =
        response.data?.application || response.data;

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? {
                ...applicant,
                ...(updatedApplicant || {}),
                status: newStatus,
              }
            : applicant
        )
      );

      setSelectedApplicant((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              ...(updatedApplicant || {}),
              status: newStatus,
            }
          : prev
      );

      return true;
    } catch (err) {
      console.error("Failed to update applicant:", err);

      alert(getErrorMessage(err));

      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  /*
   * OPEN INTERVIEW MODAL
   */
  const openInterviewModal = () => {
    if (!selectedApplicant) return;

    setInterviewForm({
      interview_date: selectedApplicant.interview_date || "",
      interview_time: selectedApplicant.interview_time || "",
      interview_type:
        selectedApplicant.interview_type || "Video",
      interview_location:
        selectedApplicant.interview_location || "",
      interview_link:
        selectedApplicant.interview_link || "",
      interviewer:
        selectedApplicant.interviewer || "",
      interview_message:
        selectedApplicant.interview_message || "",
    });

    setShowInterviewModal(true);
  };

  /*
   * SAVE INTERVIEW
   */
  const saveInterview = async (e) => {
    e.preventDefault();

    if (!selectedApplicant) return;

    if (!interviewForm.interview_date) {
      alert("Please select an interview date.");
      return;
    }

    if (!interviewForm.interview_time) {
      alert("Please select an interview time.");
      return;
    }

    if (
      interviewForm.interview_type === "Video" &&
      !interviewForm.interview_link
    ) {
      alert("Please provide the video meeting link.");
      return;
    }

    if (
      interviewForm.interview_type === "In-Person" &&
      !interviewForm.interview_location
    ) {
      alert("Please provide the interview location.");
      return;
    }

    const success = await updateStatus(
      selectedApplicant.id,
      "Interview",
      interviewForm
    );

    if (success) {
      setShowInterviewModal(false);
    }
  };

  /*
   * OPEN HIRE MODAL
   */
  const openHireModal = () => {
    if (!selectedApplicant) return;

    setHireForm({
      start_date: "",
      hiring_message: "",
    });

    setShowHireModal(true);
  };

  /*
   * HIRE APPLICANT
   */
  const hireApplicant = async (e) => {
    e.preventDefault();

    if (!selectedApplicant) return;

    if (!hireForm.start_date) {
      alert("Please select the employee start date.");
      return;
    }

    const success = await updateStatus(
      selectedApplicant.id,
      "Hired",
      {
        hired_at: new Date().toISOString(),
        hiring_message: hireForm.hiring_message,
        start_date: hireForm.start_date,
      }
    );

    if (success) {
      setShowHireModal(false);
    }
  };

  /*
   * OPEN REJECT MODAL
   */
  const openRejectModal = () => {
    if (!selectedApplicant) return;

    setRejectForm({
      hiring_message: "",
    });

    setShowRejectModal(true);
  };

  /*
   * REJECT APPLICANT
   */
  const rejectApplicant = async (e) => {
    e.preventDefault();

    if (!selectedApplicant) return;

    const success = await updateStatus(
      selectedApplicant.id,
      "Rejected",
      {
        hiring_message: rejectForm.hiring_message,
      }
    );

    if (success) {
      setShowRejectModal(false);
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner
            className="mb-3 animate-spin text-2xl"
            style={{ color: BRAND_COLOR }}
          />

          <p className="text-xs font-semibold text-slate-500">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

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
            {pendingCount} pending review · {applicants.length} total
            applications
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <FaExclamationCircle className="mt-0.5 shrink-0 text-rose-500" />

          <div>
            <p className="text-xs font-bold text-rose-700">
              Unable to load applicants
            </p>

            <p className="mt-1 text-xs text-rose-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchApplicants}
              className="mt-2 text-xs font-bold text-rose-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* SEARCH + FILTER */}
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

      {/* EMPTY */}
      {filteredApplicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <FaUserPlus className="mb-3 text-3xl text-slate-300" />

          <p className="text-sm font-bold text-slate-500">
            {applicants.length === 0
              ? "No applicants yet"
              : "No applicants found"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {applicants.length === 0
              ? "Applications for your franchise will appear here."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        /* TABLE */
        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-165.2 text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">
                    Applicant
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Role Applied
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Applied On
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Status
                  </th>

                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.map((applicant) => {
                  const name =
                    applicant.full_name ||
                    applicant.name ||
                    "Unknown Applicant";

                  const position =
                    applicant.position ||
                    applicant.role ||
                    "—";

                  const email =
                    applicant.email || "—";

                  return (
                    <tr
                      key={applicant.id}
                      onClick={() =>
                        setSelectedApplicant(applicant)
                      }
                      className="cursor-pointer transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                            style={{
                              background: "#ccfbf1",
                              color: BRAND_COLOR,
                            }}
                          >
                            {getInitials(name)}
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {name}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              {email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {position}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-500">
                        {formatDate(applicant.created_at)}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge
                          status={applicant.status}
                        />
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <FaChevronRight className="ml-auto text-slate-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 220,
              }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Applicant Details
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedApplicant(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* DRAWER BODY */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {(() => {
                  const name =
                    selectedApplicant.full_name ||
                    selectedApplicant.name ||
                    "Unknown Applicant";

                  const position =
                    selectedApplicant.position ||
                    selectedApplicant.role ||
                    "—";

                  const email =
                    selectedApplicant.email || "—";

                  const phone =
                    selectedApplicant.phone || "—";

                  const experience =
                    selectedApplicant.experience_years ||
                    selectedApplicant.experience ||
                    "—";

                  const availability =
                    selectedApplicant.availability || "—";

                  const referral =
                    selectedApplicant.referral_source ||
                    "—";

                  const gender =
                    selectedApplicant.gender || "—";

                  const coverNote =
                    selectedApplicant.cover_note || "";

                  const resumeUrl =
                    selectedApplicant.resume_url ||
                    selectedApplicant.resumeUrl ||
                    "";

                  return (
                    <>
                      {/* PROFILE */}
                      <div className="mb-5 flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-xl text-sm font-black"
                          style={{
                            background: "#ccfbf1",
                            color: BRAND_COLOR,
                          }}
                        >
                          {getInitials(name)}
                        </div>

                        <div>
                          <p className="text-base font-black text-slate-900">
                            {name}
                          </p>

                          <p className="text-xs font-semibold text-slate-500">
                            Applying for {position}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="mb-5">
                        <StatusBadge
                          status={
                            selectedApplicant.status ||
                            "New"
                          }
                        />
                      </div>

                      {/* CONTACT */}
                      <div className="mb-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <FaEnvelope className="shrink-0 text-slate-400" />

                          <span className="break-all font-medium">
                            {email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-600">
                          <FaPhoneAlt className="shrink-0 text-slate-400" />

                          <span className="font-medium">
                            {phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-600">
                          <FaCalendarAlt className="shrink-0 text-slate-400" />

                          <span className="font-medium">
                            Applied{" "}
                            {formatDate(
                              selectedApplicant.created_at
                            )}
                          </span>
                        </div>
                      </div>

                      {/* APPLICATION INFORMATION */}
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Experience
                          </p>

                          <p className="text-xs leading-relaxed text-slate-600">
                            {experience}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Availability
                          </p>

                          <p className="text-xs leading-relaxed text-slate-600">
                            {availability}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Referral Source
                          </p>

                          <p className="text-xs leading-relaxed text-slate-600">
                            {referral}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Gender
                          </p>

                          <p className="text-xs leading-relaxed text-slate-600">
                            {gender}
                          </p>
                        </div>

                        {coverNote && (
                          <div>
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Cover Note
                            </p>

                            <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                              {coverNote}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* INTERVIEW DETAILS */}
                      {selectedApplicant.interview_date && (
                        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <FaCalendarAlt className="text-purple-500" />

                            <p className="text-xs font-black text-purple-800">
                              Interview Details
                            </p>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex justify-between gap-3">
                              <span className="text-slate-400">
                                Date
                              </span>

                              <span className="font-semibold">
                                {formatDate(
                                  selectedApplicant.interview_date
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between gap-3">
                              <span className="text-slate-400">
                                Time
                              </span>

                              <span className="font-semibold">
                                {formatTime(
                                  selectedApplicant.interview_time
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between gap-3">
                              <span className="text-slate-400">
                                Type
                              </span>

                              <span className="font-semibold">
                                {selectedApplicant.interview_type ||
                                  "—"}
                              </span>
                            </div>

                            {selectedApplicant.interviewer && (
                              <div className="flex justify-between gap-3">
                                <span className="text-slate-400">
                                  Interviewer
                                </span>

                                <span className="font-semibold">
                                  {
                                    selectedApplicant.interviewer
                                  }
                                </span>
                              </div>
                            )}

                            {selectedApplicant.interview_location && (
                              <div>
                                <span className="text-slate-400">
                                  Location
                                </span>

                                <p className="mt-1 font-semibold">
                                  {
                                    selectedApplicant.interview_location
                                  }
                                </p>
                              </div>
                            )}

                            {selectedApplicant.interview_link && (
                              <a
                                href={
                                  selectedApplicant.interview_link
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-purple-700"
                              >
                                <FaVideo />
                                Open Meeting Link
                              </a>
                            )}

                            {selectedApplicant.interview_message && (
                              <div className="border-t border-purple-100 pt-3">
                                <span className="text-slate-400">
                                  Message
                                </span>

                                <p className="mt-1 whitespace-pre-line leading-relaxed">
                                  {
                                    selectedApplicant.interview_message
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* HIRING DETAILS */}
                      {selectedApplicant.status === "Hired" && (
                        <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <FaCheckCircle className="text-teal-600" />

                            <p className="text-xs font-black text-teal-800">
                              Hiring Information
                            </p>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600">
                            {selectedApplicant.hired_at && (
                              <div className="flex justify-between gap-3">
                                <span className="text-slate-400">
                                  Hired On
                                </span>

                                <span className="font-semibold">
                                  {formatDate(
                                    selectedApplicant.hired_at
                                  )}
                                </span>
                              </div>
                            )}

                            {selectedApplicant.hiring_message && (
                              <div className="border-t border-teal-100 pt-3">
                                <span className="text-slate-400">
                                  Hiring Message
                                </span>

                                <p className="mt-1 whitespace-pre-line leading-relaxed">
                                  {
                                    selectedApplicant.hiring_message
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* RESUME */}
                      {resumeUrl ? (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FaFileAlt />
                          View Resume / CV
                        </a>
                      ) : (
                        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-2.5 text-xs font-bold text-slate-400">
                          <FaFileAlt />
                          No Resume Available
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* ACTIONS */}
              <div className="border-t border-slate-100 px-6 py-4">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Applicant Actions
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* UNDER REVIEW */}
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() =>
                      updateStatus(
                        selectedApplicant.id,
                        "Under Review"
                      )
                    }
                    className="rounded-lg bg-amber-50 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Under Review
                  </button>

                  {/* SHORTLIST */}
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() =>
                      updateStatus(
                        selectedApplicant.id,
                        "Shortlisted"
                      )
                    }
                    className="rounded-lg bg-indigo-50 py-2 text-[10px] font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Shortlist
                  </button>

                  {/* INTERVIEW */}
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={openInterviewModal}
                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-50 py-2 text-[10px] font-bold uppercase tracking-wider text-purple-700 ring-1 ring-purple-200 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaCalendarAlt />
                    Interview
                  </button>

                  {/* HIRE */}
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={openHireModal}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: BRAND_COLOR }}
                  >
                    <FaCheckCircle />
                    Hire
                  </button>

                  {/* REJECT */}
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={openRejectModal}
                    className="col-span-2 rounded-lg bg-rose-50 py-2 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>

                {updatingStatus && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-400">
                    <FaSpinner className="animate-spin" />
                    Updating application...
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =========================================================
          INTERVIEW MODAL
      ========================================================= */}
      {showInterviewModal && selectedApplicant && (
        <Modal
          title="Schedule Interview"
          onClose={() => setShowInterviewModal(false)}
        >
          <form
            onSubmit={saveInterview}
            className="space-y-4"
          >
            <div>
              <p className="mb-1 text-xs font-bold text-slate-800">
                {selectedApplicant.full_name}
              </p>

              <p className="text-[10px] text-slate-400">
                {selectedApplicant.position}
              </p>
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Interview Date
                </label>

                <input
                  type="date"
                  value={interviewForm.interview_date}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_date: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Interview Time
                </label>

                <input
                  type="time"
                  value={interviewForm.interview_time}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_time: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* TYPE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Interview Type
              </label>

              <select
                value={interviewForm.interview_type}
                onChange={(e) =>
                  setInterviewForm((prev) => ({
                    ...prev,
                    interview_type: e.target.value,
                    interview_location: "",
                    interview_link: "",
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
              >
                {INTERVIEW_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            {interviewForm.interview_type === "In-Person" && (
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <FaMapMarkerAlt />
                  Interview Location
                </label>

                <input
                  type="text"
                  value={interviewForm.interview_location}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_location: e.target.value,
                    }))
                  }
                  placeholder="Enter interview location"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
                />
              </div>
            )}

            {/* VIDEO LINK */}
            {interviewForm.interview_type === "Video" && (
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <FaVideo />
                  Meeting Link
                </label>

                <input
                  type="url"
                  value={interviewForm.interview_link}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_link: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
                />
              </div>
            )}

            {/* INTERVIEWER */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <FaUserTie />
                Interviewer
              </label>

              <input
                type="text"
                value={interviewForm.interviewer}
                onChange={(e) =>
                  setInterviewForm((prev) => ({
                    ...prev,
                    interviewer: e.target.value,
                  }))
                }
                placeholder="Enter interviewer name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Interview Message
              </label>

              <textarea
                rows="4"
                value={interviewForm.interview_message}
                onChange={(e) =>
                  setInterviewForm((prev) => ({
                    ...prev,
                    interview_message: e.target.value,
                  }))
                }
                placeholder="Add instructions or a message for the applicant..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setShowInterviewModal(false)
                }
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updatingStatus}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white disabled:opacity-50"
                style={{
                  background: BRAND_COLOR,
                }}
              >
                {updatingStatus ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCalendarAlt />
                    Schedule Interview
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================
          HIRE MODAL
      ========================================================= */}
      {showHireModal && selectedApplicant && (
        <Modal
          title="Hire Applicant"
          onClose={() => setShowHireModal(false)}
        >
          <form
            onSubmit={hireApplicant}
            className="space-y-4"
          >
            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-sm font-black text-teal-800">
                {selectedApplicant.full_name}
              </p>

              <p className="mt-1 text-xs text-teal-700">
                {selectedApplicant.position}
              </p>

              <p className="mt-2 text-[10px] leading-relaxed text-teal-600">
                Hiring this applicant will change their application
                status to Hired. Their employee onboarding can then
                continue from the Employees section.
              </p>
            </div>

            {/* START DATE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Employee Start Date
              </label>

              <input
                type="date"
                value={hireForm.start_date}
                onChange={(e) =>
                  setHireForm((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
                required
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hiring Message
              </label>

              <textarea
                rows="4"
                value={hireForm.hiring_message}
                onChange={(e) =>
                  setHireForm((prev) => ({
                    ...prev,
                    hiring_message: e.target.value,
                  }))
                }
                placeholder="Add an internal hiring note or message..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowHireModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updatingStatus}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white disabled:opacity-50"
                style={{
                  background: BRAND_COLOR,
                }}
              >
                {updatingStatus ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Hiring...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Confirm Hire
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================
          REJECT MODAL
      ========================================================= */}
      {showRejectModal && selectedApplicant && (
        <Modal
          title="Reject Applicant"
          onClose={() => setShowRejectModal(false)}
        >
          <form
            onSubmit={rejectApplicant}
            className="space-y-4"
          >
            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-sm font-black text-rose-800">
                Reject {selectedApplicant.full_name}?
              </p>

              <p className="mt-1 text-xs leading-relaxed text-rose-600">
                The application will be marked as Rejected.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Reason / Internal Note
              </label>

              <textarea
                rows="5"
                value={rejectForm.hiring_message}
                onChange={(e) =>
                  setRejectForm((prev) => ({
                    ...prev,
                    hiring_message: e.target.value,
                  }))
                }
                placeholder="Add an optional reason or internal note..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updatingStatus}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {updatingStatus ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}