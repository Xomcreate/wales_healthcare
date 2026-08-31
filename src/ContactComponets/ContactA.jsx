import React from 'react';

function ContactA() {
  return (
    <section className="relative bg-slate-50 border-b border-slate-100 overflow-hidden font-sans">
      {/* Ambient background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 w-md h-112 rounded-full bg-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-50 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Intro / Text Content */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold text-teal-700">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
              </span>
              <span>We&rsquo;re Here For You</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight text-balance">
              Get in Touch With{' '}
              <span className="text-teal-600">Wales Healthcare</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed text-pretty">
              Whether you need guidance on homecare plans, temporary facility
              staffing, or have questions about our services, our dedicated
              team is ready to provide compassionate support.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              {/* Call Button */}
              <a
                href="tel:09076084515"
                className="inline-flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl shadow-sm shadow-teal-900/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Call 0907 608 4515</span>
              </a>

              {/* Email Button */}
              <a
                href="mailto:support@waleshealthcare.com"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Send Email</span>
              </a>
            </div>

            {/* Availability Meta */}
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <svg
                className="w-3.5 h-3.5 text-teal-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M11.3 1.046A1 1 0 0112 2v6h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 19v-6H4a1 1 0 01-.82-1.573l7-10a1 1 0 01.914-.38z" />
              </svg>
              Available 24/7 for emergency homecare and staffing inquiries.
            </p>
          </div>

          {/* Right Column: Clean Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                  alt="Healthcare professional assisting a patient"
                  className="w-full h-72 sm:h-80 lg:h-105 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Floating stat card signature element */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 bg-white rounded-xl border border-slate-200/80 shadow-lg shadow-slate-900/10 px-5 py-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500">Response Team</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactA;