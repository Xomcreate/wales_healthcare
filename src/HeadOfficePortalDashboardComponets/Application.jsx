import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaEye,
  FaTimes,
} from "react-icons/fa";

import api from "../api/axios";

const BRAND_COLOR = "#0d9488";

// =========================================================
// STATUS STYLES
// =========================================================

const statusStyles = {
  New: "bg-amber-50 text-amber-700 border-amber-200",

  "Under Review":
    "bg-sky-50 text-sky-700 border-sky-200",

  Shortlisted:
    "bg-indigo-50 text-indigo-700 border-indigo-200",

  Interview:
    "bg-violet-50 text-violet-700 border-violet-200",

  Rejected:
    "bg-rose-50 text-rose-700 border-rose-200",

  Hired:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// =========================================================
// STATUS ICONS
// =========================================================

const statusIcons = {
  New: <FaClock className="text-xs" />,

  "Under Review":
    <FaClock className="text-xs" />,

  Shortlisted:
    <FaCheckCircle className="text-xs" />,

  Interview:
    <FaClock className="text-xs" />,

  Rejected:
    <FaTimesCircle className="text-xs" />,

  Hired:
    <FaCheckCircle className="text-xs" />,
};

// =========================================================
// COMPONENT
// =========================================================

export default function Applications() {
  const [applications, setApplications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // =======================================================
  // FETCH APPLICATIONS
  // =======================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/career-applications/"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setApplications(data);
    } catch (err) {
      console.error(
        "Error fetching applications:",
        err
      );

      console.error(
        "Server response:",
        err.response?.data
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view these applications."
        );
      } else if (err.response?.status === 404) {
        setError(
          "Applications endpoint was not found. Check the Django URL."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load applications. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // FORMAT DATE
  // =======================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =======================================================
  // GET APPLICATION ID
  // =======================================================

  const getApplicationId = (application) => {
    if (!application?.id) {
      return "—";
    }

    return `APP-${String(
      application.id
    ).padStart(4, "0")}`;
  };

  // =======================================================
  // GET FRANCHISE NAME
  // =======================================================

  const getFranchiseName = (application) => {
    if (!application) {
      return "—";
    }

    if (
      application.franchise &&
      typeof application.franchise === "object"
    ) {
      return (
        application.franchise.name ||
        application.franchise.location ||
        "—"
      );
    }

    if (application.franchise_name) {
      return application.franchise_name;
    }

    return "—";
  };

  // =======================================================
  // GET LOCATION
  // =======================================================

  const getLocation = (application) => {
    if (!application) {
      return "—";
    }

    if (
      application.franchise &&
      typeof application.franchise === "object"
    ) {
      return (
        application.franchise.location ||
        "—"
      );
    }

    return (
      application.franchise_location ||
      application.location ||
      "—"
    );
  };

  // =======================================================
  // GET STATUS
  // =======================================================

  const getStatus = (application) => {
    return application?.status || "New";
  };

  // =======================================================
  // SEARCH
  // =======================================================

  const filteredApplications =
    applications.filter((application) => {
      const applicantName =
        application.full_name || "";

      const applicationId =
        getApplicationId(application);

      const location =
        getLocation(application);

      const franchiseName =
        getFranchiseName(application);

      const position =
        application.position || "";

      const email =
        application.email || "";

      const phone =
        application.phone || "";

      const searchText = `
        ${applicantName}
        ${applicationId}
        ${location}
        ${franchiseName}
        ${position}
        ${email}
        ${phone}
      `.toLowerCase();

      return searchText.includes(
        searchTerm.toLowerCase()
      );
    });

  // =======================================================
  // OPEN APPLICATION
  // =======================================================

  const handleReview = (application) => {
    setSelectedApplication(application);
  };

  // =======================================================
  // CLOSE APPLICATION
  // =======================================================

  const closeApplication = () => {
    setSelectedApplication(null);
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="relative">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "#ccfbf1",
              color: BRAND_COLOR,
            }}
          >
            <FaClipboardList />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              Applications
            </h3>

            <p className="text-xs font-medium text-slate-400">
              Review and manage career applications
            </p>
          </div>
        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search applications..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">
                  Application ID
                </th>

                <th className="px-5 py-3.5">
                  Applicant
                </th>

                <th className="px-5 py-3.5">
                  Location
                </th>

                <th className="px-5 py-3.5">
                  Position
                </th>

                <th className="px-5 py-3.5">
                  Submitted
                </th>

                <th className="px-5 py-3.5">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <FaSpinner className="animate-spin text-lg" />

                      <span className="text-xs font-medium">
                        Loading applications...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredApplications.length ===
                0 ? (
                /* ==================================================
                    EMPTY
                ================================================== */

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    {searchTerm
                      ? "No applications match your search."
                      : "No applications found."}
                  </td>
                </tr>
              ) : (
                /* ==================================================
                    APPLICATIONS
                ================================================== */

                filteredApplications.map(
                  (application) => {
                    const status =
                      getStatus(application);

                    return (
                      <tr
                        key={application.id}
                        className="transition hover:bg-slate-50/60"
                      >
                        {/* APPLICATION ID */}

                        <td className="px-5 py-4 font-bold text-slate-700">
                          {getApplicationId(
                            application
                          )}
                        </td>

                        {/* APPLICANT */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {application.full_name ||
                                "—"}
                            </p>

                            {application.email && (
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {application.email}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-600">
                              {getFranchiseName(
                                application
                              )}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {getLocation(
                                application
                              )}
                            </p>
                          </div>
                        </td>

                        {/* POSITION */}

                        <td className="px-5 py-4 text-slate-500">
                          {application.position ||
                            "—"}
                        </td>

                        {/* SUBMITTED */}

                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(
                            application.created_at
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                              statusStyles[status] ||
                              "border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {statusIcons[status] || (
                              <FaClock className="text-xs" />
                            )}

                            {status}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleReview(
                                application
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition hover:border-teal-500 hover:text-teal-700"
                          >
                            <FaEye />

                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================
          RESULT COUNT
      ================================================== */}

      {!loading &&
        applications.length > 0 && (
          <div className="mt-3 text-right text-[10px] font-medium text-slate-400">
            Showing{" "}
            {filteredApplications.length} of{" "}
            {applications.length} applications
          </div>
        )}

      {/* ==================================================
          APPLICATION DETAILS DRAWER
      ================================================== */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px]">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close application"
            onClick={closeApplication}
            className="absolute inset-0 cursor-default"
          />

          {/* DRAWER */}

          <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
            {/* DRAWER HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                  Application
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {getApplicationId(
                    selectedApplication
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeApplication}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* DRAWER CONTENT */}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* STATUS */}

              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                    statusStyles[
                      getStatus(
                        selectedApplication
                      )
                    ] ||
                    "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {statusIcons[
                    getStatus(
                      selectedApplication
                    )
                  ] || (
                    <FaClock className="text-xs" />
                  )}

                  {getStatus(
                    selectedApplication
                  )}
                </span>
              </div>

              {/* APPLICANT */}

              <div className="mb-6">
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Applicant Information
                </h4>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedApplication.full_name ||
                        "—"}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedApplication.email ||
                        "—"}
                    </p>
                  </div>

                  <div className="px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedApplication.phone ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* JOB INFORMATION */}

              <div className="mb-6">
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Application Information
                </h4>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Position
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedApplication.position ||
                        "—"}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Franchise
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {getFranchiseName(
                        selectedApplication
                      )}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {getLocation(
                        selectedApplication
                      )}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedApplication.experience_years ||
                        "—"}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Availability
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedApplication.availability ||
                        "—"}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Referral Source
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedApplication.referral_source ||
                        "—"}
                    </p>
                  </div>

                  <div className="px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Submitted
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        selectedApplication.created_at
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* COVER NOTE */}

              {selectedApplication.cover_note && (
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    Cover Note
                  </h4>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {
                        selectedApplication.cover_note
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* RESUME */}

              {selectedApplication.resume_url && (
                <div>
                  <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    Resume
                  </h4>

                  <a
                    href={
                      selectedApplication.resume_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}