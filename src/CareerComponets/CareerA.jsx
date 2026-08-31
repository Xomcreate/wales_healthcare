import React from 'react';

function CareerA() {
  return (
    <section className="relative py-14 lg:py-20 overflow-hidden font-sans border-b border-slate-200">
      {/* Background Image with Lighter Semi-Transparent White Overlay to make the image more obvious */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8qjpypMcSl_ZdgQrjwuMje85YQoSWL2UMoafWrLSaOQ&s=10"
          alt="Healthcare professionals team"
          className="w-full h-full object-cover object-center"
        />
        {/* Lighter white overlay (70% opacity) so the image shows through clearly */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full text-xs font-semibold text-teal-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Join Our Growing Team</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Build Your Career With <span className="text-teal-600">Wales Healthcare</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Discover rewarding opportunities in homecare and facility staffing. Work with a compassionate team dedicated to making a meaningful difference in our communities.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#openings"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/25"
            >
              Apply Now
            </a>
            <a
              href="#culture"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/90 hover:bg-white text-slate-800 border border-slate-300 font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-sm backdrop-blur-sm"
            >
              Why Work With Us
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CareerA;