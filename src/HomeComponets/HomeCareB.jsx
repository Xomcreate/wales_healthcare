import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeCareB() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-block mb-4">
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-teal-600 uppercase">
            Fully Accredited
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-12">
          Serving communities across Ontario, from Windsor to Ottawa
        </h2>

        {/* Accreditation / Partner Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-12 opacity-85">
          
          {/* Logo 1: Accreditation Canada */}
          <div className="flex flex-col items-center">
            <span className="text-red-600 font-extrabold text-xl tracking-tighter">★</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Accreditation Canada</span>
          </div>

          {/* Logo 2: AdvantAge Ontario */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-purple-700 transform rotate-45 rounded-sm"></div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">AdvantAge</p>
              <p className="text-xs font-bold text-purple-700 leading-none">Ontario</p>
            </div>
          </div>

          {/* Logo 3: ORCA */}
          <div className="text-center">
            <span className="text-2xl font-serif font-bold text-red-700 tracking-tighter">ORCA</span>
            <p className="text-[8px] text-slate-600 tracking-tighter">Ontario Retirement Communities Association</p>
          </div>

          {/* Logo 4: Certified Badge */}
          <div className="flex items-center space-x-2 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <div className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-700">✓</div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-800">Caring Company</p>
              <p className="text-[9px] text-slate-500">Certified 2026</p>
            </div>
          </div>

          {/* Logo 5: OLTCA */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-teal-500"></div>
            <span className="text-lg font-extrabold tracking-wider text-slate-900">OLTCA</span>
          </div>

        </div>

        {/* Experience & Caregivers Statistics Line */}
        <div className="flex items-center justify-center space-x-3 text-sm sm:text-base font-semibold text-slate-800 mb-10">
          <span className="text-teal-600">25+ Years Experience</span>
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
          <span className="text-teal-600">700+ Caregivers</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/consultation')}
            className="w-full sm:w-auto bg-[#0077b6] hover:bg-[#026296] text-white font-semibold px-8 py-4 rounded-xl text-sm sm:text-base shadow-md transition-all text-center"
          >
            Request a Free Consultation
          </button>
          <a
            href="tel:9057091767"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl text-sm sm:text-base shadow-md transition-all text-center"
          >
            905-709-1767 (24/7)
          </a>
        </div>

      </div>
    </section>
  );
}

export default HomeCareB;