import React from 'react';

function HomeServe() {
  return (
    <section className="relative bg-[#132A3E] py-12 lg:py-16 font-sans text-white w-full overflow-hidden">
      
      {/* Background Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="medical-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" />
              <path d="M10 6v8M6 10h8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main Grid: Left Map Container & Right Text Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Map Simulation Container */}
          <div className="lg:col-span-7 relative w-full h-85 sm:h-100 rounded-3xl overflow-hidden shadow-xl border border-slate-700/50 bg-[#e5e3df]">
            
            <iframe 
              title="Ontario Service Areas Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.546781292067!2d-79.3832!3d43.6532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf332af%3A0x4235f4864896fc44!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              className="w-full h-full border-0 filter contrast-[1.05] opacity-90"
              allowFullScreen="" 
              loading="lazy"
            ></iframe>

            {/* Top-Left Map / Satellite Toggle buttons */}
            <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md p-0.5 flex text-xs font-semibold text-slate-700">
              <button className="px-2.5 py-1 bg-white text-slate-900 rounded-md shadow-xs">Map</button>
              <button className="px-2.5 py-1 text-slate-500 hover:text-slate-900">Satellite</button>
            </div>

            {/* Top-Right Fullscreen Control Icon */}
            <div className="absolute top-3 right-3 bg-white p-1.5 rounded-lg shadow-md text-slate-700 hover:bg-slate-50 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>

            {/* Bottom-Right Zoom Controls */}
            <div className="absolute bottom-4 right-3 flex flex-col items-end space-y-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-slate-700">
                <button className="p-1.5 hover:bg-slate-100 border-b border-slate-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
                <button className="p-1.5 hover:bg-slate-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                </button>
              </div>
            </div>

            {/* Google Attribution watermark overlay */}
            <div className="absolute bottom-1 left-2 text-[10px] text-slate-500 bg-white/80 px-1 rounded">
              Map data ©2026 Google
            </div>
          </div>

          {/* Right Side: Centered on mobile/tablet, left-aligned on desktop (lg) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Eyebrow Header */}
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-teal-400 uppercase mb-3">
              Our Coverage
            </span>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-snug">
              Trusted care delivered right to your neighborhood
            </h2>

            {/* Description Body */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
              Proudly supporting families and healthcare organizations across communities throughout Ontario with dedicated, professional assistance.
            </p>

            {/* Action Button */}
            <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400">
              View All Service Areas
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeServe;