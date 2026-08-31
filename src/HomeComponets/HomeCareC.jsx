import React from 'react';

function HomeCareC() {
  return (
    <section className="relative w-full bg-white py-8 lg:py-12 font-sans overflow-hidden">
      
      {/* Full-width container with reduced padding and teal accent theme */}
      <div className="relative w-full bg-[#f3ecf7] py-12 px-4 sm:px-6 lg:px-12 overflow-hidden">
        
        {/* SVG Curve at the top - pushed upwards */}
        <div className="absolute -top-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-8 sm:h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,90 900,90 1200,0 L1200,0 L0,0 Z" fill="currentColor"></path>
          </svg>
        </div>

        {/* SVG Curve at the bottom - pushed downwards */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none transform rotate-180">
          <svg className="relative block w-full h-8 sm:h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,90 900,90 1200,0 L1200,0 L0,0 Z" fill="currentColor"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 my-4">
          
          {/* Main Header with reduced text size */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Where We <span className="text-teal-600">Care</span> For Your Loved Ones
            </h2>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start max-w-5xl mx-auto">
            
            {/* Column 1: In-Home Care */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Rounded White Icon Box */}
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-800 text-2xl">
                🏠
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4">
                  In-Home Care
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-md">
                  Our compassionate caregivers come directly to your home to provide personalized support. We help your loved ones maintain independence, comfort, and dignity in the familiar surroundings they know and love.
                </p>
              </div>

              <div className="pt-1">
                <span className="text-sm font-bold text-slate-900">
                  Available 24/7 across Ontario
                </span>
              </div>
            </div>

            {/* Column 2: On-Site Care */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Rounded White Icon Box */}
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-800 text-2xl">
                🏥
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4">
                  On-Site Care
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-md">
                  If your loved one is in a hospital, retirement home, or long-term care facility, we can provide additional support and specialized care on-site. Our team works seamlessly with facility staff to ensure continuity of care.
                </p>
              </div>

              <div className="pt-1">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-bold text-slate-900">
                  <span>Hospitals</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  <span>Retirement Homes</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full hidden sm:inline-block"></span>
                  <span className="w-full sm:w-auto pt-1 sm:pt-0">Care Facilities</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default HomeCareC;