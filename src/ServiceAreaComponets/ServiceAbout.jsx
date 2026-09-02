import React from 'react';

function ServiceAbout() {
  return (
    <section className="relative bg-white py-10 lg:py-14 overflow-hidden font-sans border-b border-slate-100">
      {/* Background Star / Heart SVG Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="heart-stars-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              {/* Star */}
              <path d="M30 5L36.5 18.5L51.5 20.5T40.5 31.5L43 46.5L30 39.5L17 46.5L19.5 31.5L8.5 20.5L23.5 18.5Z" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.25" transform="scale(0.4) translate(10, 10)" />
              {/* Heart */}
              <path d="M30 45C30 45 50 32 50 20C50 12 43 7 36 12C30 17 30 20 30 20C30 20 30 17 24 12C17 7 10 12 10 20C10 32 30 45 30 45Z" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.25" transform="scale(0.35) translate(80, 40)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heart-stars-pattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Service Coverage & Reach</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
          Serving Communities Across Ontario with Trusted Care
        </h2>

        {/* Body Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Staff Relief provides high-quality personal care, home care, and relief staffing support to individuals, families, and healthcare organizations throughout Ontario. With 25+ years of experience, we deliver compassionate, professional services wherever you call home.
        </p>

        {/* Brand Accent Box */}
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            At <span className="text-teal-600 font-bold">Wales Healthcare</span>, we bring dependable excellence and dedicated community support right to your neighborhood.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex flex-wrap justify-center gap-3">
          <a
            href="/about"
            className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
          >
            <span>Learn More About Staff Relief</span>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
          >
            <span>Request Care Today</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default ServiceAbout;