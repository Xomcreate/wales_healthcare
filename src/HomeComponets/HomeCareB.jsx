import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeCareB() {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-b from-white via-slate-50/50 to-white py-14 lg:py-20 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700 mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Ontario-Wide Healthcare</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-5">
          Serving communities from Windsor to Ottawa
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          Professional home healthcare and dedicated support tailored to your family's needs.
        </p>

        {/* Quick Highlights Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10 text-slate-700 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="text-teal-600 font-bold text-lg">700+</span>
            <span>Caregivers</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center space-x-2">
            <span className="text-teal-600 font-bold text-lg">24/7</span>
            <span>Availability</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center space-x-2">
            <span className="text-teal-600 font-bold text-lg">100%</span>
            <span>Personalized</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/consultation')}
            className="w-full sm:w-auto bg-[#0077b6] hover:bg-[#026296] text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all text-center"
          >
            Request Free Consultation
          </button>
          
          <a
            href="tel:9057091767"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all text-center"
          >
            905-709-1767 (24/7)
          </a>
        </div>

      </div>
    </section>
  );
}

export default HomeCareB;