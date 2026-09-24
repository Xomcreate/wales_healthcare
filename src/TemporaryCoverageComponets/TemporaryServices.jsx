import React from 'react';

function TemporaryServices() {
  return (
    // Clean light white background section
    <section className="relative bg-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-100">
      
      {/* Background Image Layer set to a very subtle 8% watermark */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Intro Header & Description */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4 pr-0 lg:pr-4 text-center lg:text-left items-center lg:items-start">
            
            {/* Outline Clock/Support Icon */}
            <div className="text-teal-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            {/* Sub-heading / Overline */}
            <h3 className="text-xs sm:text-sm font-bold tracking-widest text-teal-700 uppercase">
              Specialized Workforce Solutions
            </h3>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Temporary & Short-Term Coverage
            </h2>

            {/* Description Text */}
            <p className="text-sm text-slate-600 leading-relaxed">
              We deliver agile, professional staffing solutions for healthcare facilities and care coordinators across Ontario—spanning from Windsor to Ottawa.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our short-term deployment services bridge critical scheduling gaps during unexpected vacancies, seasonal surges, and medical leaves of absence.
            </p>

          </div>

          {/* Right Column: Cards Grid (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: What We Provide */}
            <div className="bg-teal-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-teal-600 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/3f/b8/b2/3fb8b2cb3cb9b4278130befea2eb5f8f.jpg"
                  alt="Temporary staffing and care coverage"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">What We Provide</h3>
                
                <ul className="space-y-2.5 text-sm text-teal-100">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Rapid coverage for unexpected staffing shortages</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Seamless post-hospital transition assistance</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Targeted short-term resident care support</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Adaptable shift-based scheduling models</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Supplemental expertise during peak census periods</span>
                  </li>
                </ul>

                <p className="text-xs text-teal-200 pt-2 italic border-t border-teal-600/60">
                  We collaborate closely with administrative leaders to guarantee uncompromised care standards and operational stability.
                </p>
              </div>
            </div>

            {/* Card 2: Who This Is For */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-slate-800 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://i.pinimg.com/1200x/db/cd/1d/dbcd1dd88f1f3b4a2f391921c82a77e2.jpg"
                  alt="Flexible healthcare staffing solutions"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Who This Is For</h3>
                
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Care facilities managing acute scheduling gaps</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Residents requiring short-term recovery aid</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Families navigating complex transitional phases</span>
                  </li>
                </ul>

                <div className="pt-6">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-teal-500/20"
                  >
                    <span>Request Coverage</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default TemporaryServices;