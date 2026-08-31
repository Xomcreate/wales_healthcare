import React from 'react';

function HomeLogo() {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Horizontal Card Container with rounded corners */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
            
            {/* Left Side: Fully Accredited & Stats */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left shrink-0">
              <div className="text-teal-600">
                {/* Check Badge Icon */}
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Fully Accredited
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-teal-600 mt-0.5">
                  <span>25+ Years Experience</span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span>700+ Caregivers</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider (Hidden on mobile/tablet) */}
            <div className="hidden lg:block h-14 w-px bg-slate-200"></div>

            {/* Right Side: Partner Logos Row (Responsive Grid for Mobile, Flex for Desktop) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-end gap-6 sm:gap-8 lg:gap-10 w-full">
              
              {/* Logo 1: Accreditation Canada */}
              <div className="flex flex-col items-center text-center">
                <span className="text-red-600 font-black text-lg tracking-tighter">★</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-900">Accreditation Canada</span>
              </div>

              {/* Logo 2: AdvantAge Ontario */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-purple-700 transform rotate-45 rounded-xs shrink-0"></div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-900 leading-none">AdvantAge</p>
                  <p className="text-[11px] font-bold text-purple-700 leading-none">Ontario</p>
                </div>
              </div>

              {/* Logo 3: ORCA */}
              <div className="text-center">
                <span className="text-xl font-serif font-bold text-red-700 tracking-tighter">ORCA</span>
                <p className="text-[7px] text-slate-500 tracking-tight">Ontario Retirement Communities Association</p>
              </div>

              {/* Logo 4: Caring Company Badge */}
              <div className="flex items-center space-x-2 border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
                <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-700 shrink-0">✓</div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-800 leading-tight">Caring Company</p>
                  <p className="text-[8px] text-slate-500 leading-tight">Certified</p>
                </div>
              </div>

              {/* Logo 5: OLTCA */}
              <div className="flex items-center justify-center space-x-2 col-span-2 sm:col-span-1">
                <div className="w-5 h-5 rounded-full bg-teal-500 shrink-0"></div>
                <span className="text-base font-extrabold tracking-wide text-slate-900">OLTCA</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default HomeLogo;