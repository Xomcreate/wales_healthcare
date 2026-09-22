import React, { useState } from "react";
import api from "../api/axios"; // adjust the path if this component lives at a different depth

const BRAND_COLOR = "#0d9488"; // Teal-600 equivalent

// Must match ContactSubmission.SERVICE_CHOICES in models.py exactly —
// the backend rejects anything outside this set (it's a ChoiceField,
// not free text).
const SERVICE_OPTIONS = [
  { value: "homecare", label: "Homecare Plans" },
  { value: "staffing", label: "Temporary Facility Staffing" },
  { value: "general", label: "General Inquiry" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "general",
  message: "",
};

const getApiError = (err, fallback) => {
  const data = err?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;

  // DRF validation errors come back as { field: ["msg"] } or { detail: "msg" }
  if (data.detail) return data.detail;

  const first = Object.values(data)[0];
  if (Array.isArray(first) && first[0]) return String(first[0]);
  if (typeof first === "string") return first;

  return fallback;
};

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      // Public endpoint — no auth token needed/sent for this call.
      await api.post("contact/", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        message: formData.message.trim(),
      });

      setSubmitted(true);
    } catch (err) {
      setError(getApiError(err, "Could not send your message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setFormData(INITIAL_FORM);
    setSubmitted(false);
    setError("");
  };

  return (
    <section className="relative bg-slate-50 py-16 lg:py-24 border-b border-slate-100 overflow-hidden font-sans">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] bg-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold text-teal-700">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Toronto West Franchise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Send Us a Message
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Usually responds within a few hours. Fill out the form below to get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-5">

            {/* Info Card: Phone */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-5">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                📞
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Support</h3>
                <p className="text-base font-bold text-slate-900 mt-0.5">09076084515</p>
                <p className="text-xs text-slate-500 mt-0.5">Available 24/7 for urgent inquiries.</p>
              </div>
            </div>

            {/* Info Card: Email */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-5">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                ✉️
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</h3>
                <p className="text-base font-bold text-slate-900 mt-0.5">support@waleshealthcare.com</p>
                <p className="text-xs text-slate-500 mt-0.5">We reply within 24 hours.</p>
              </div>
            </div>

            {/* Info Card: Address */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-5">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                📍
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Office Address</h3>
                <p className="text-base font-bold text-slate-900 mt-0.5">123 Healthcare Avenue</p>
                <p className="text-xs text-slate-500 mt-0.5">Suite 400, Wales, UK</p>
              </div>
            </div>

            {/* Info Card: Working Hours */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-5">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                🕒
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Working Hours</h3>
                <p className="text-base font-bold text-slate-900 mt-0.5">Monday – Sunday</p>
                <p className="text-xs text-slate-500 mt-0.5">Administrative: 8:00 AM – 6:00 PM</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact/Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Toronto West Franchise. A member of our support team will get back to you shortly.
                </p>
                <button
                  onClick={handleSendAnother}
                  className="mt-4 inline-block text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  style={{ background: BRAND_COLOR }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="name">
                      Full Name <span className="text-teal-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={submitting}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Mary"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-60"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                      Email Address <span className="text-teal-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={submitting}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="mary@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="phone">
                      Phone Number <span className="text-teal-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      disabled={submitting}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09076084515"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-60"
                    />
                  </div>

                  {/* Service — must match backend SERVICE_CHOICES, so this is a
                      select rather than free text. */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="service">
                      What is this about? <span className="text-teal-600">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      disabled={submitting}
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 bg-white text-sm disabled:opacity-60"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="message">
                    Your Message <span className="text-teal-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    disabled={submitting}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm resize-none disabled:opacity-60"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 text-sm cursor-pointer hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: BRAND_COLOR }}
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}