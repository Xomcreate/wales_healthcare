import React, { useState } from 'react';

function ContactB() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'homecare',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
            <span>Send Us a Message</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            We'd Love to Hear From You
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Fill out the form below and our team will get back to you promptly to discuss your healthcare or staffing requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Information Cards with Simple Clean Icons/Badges */}
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

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Wales Healthcare. A member of our support team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
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
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
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
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09076084515"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
                    />
                  </div>

                  {/* Service Interest */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="service">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 bg-white text-sm"
                    >
                      <option value="homecare">Homecare Plans</option>
                      <option value="staffing">Temporary Facility Staffing</option>
                      <option value="general">General Inquiry</option>
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
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 text-sm"
                >
                  Send Message
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactB;