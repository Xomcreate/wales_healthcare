import React from 'react';

function NursingService() {
  return (
    // Clean light white background section
    <section className="relative bg-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-100">
      
      {/* Background Image Layer set to a very subtle 8% watermark */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Intro Header & Description */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4 pr-0 lg:pr-4 text-center lg:text-left items-center lg:items-start">
            
            {/* Outline Medical / Nursing Icon */}
            <div className="text-teal-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
              </svg>
            </div>

            {/* Sub-heading / Overline */}
            <h3 className="text-xs sm:text-sm font-bold tracking-widest text-teal-700 uppercase">
              Specialized Clinical Excellence
            </h3>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Advanced In-Home Nursing Care
            </h2>

            {/* Description Text */}
            <p className="text-sm text-slate-600 leading-relaxed">
              We empower families with professional, dependable medical support tailored to foster smooth recoveries and proactive health management.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our clinical nursing solutions bridge the gap between hospital and home, delivering advanced care from seasoned professionals who prioritize your safety and comfort every step of the way.
            </p>

          </div>

          {/* Right Column: Cards Grid (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: What We Provide */}
            <div className="bg-teal-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-teal-600 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/24/87/3c/24873cb0aea6b7041389c9da4d3611eb.jpg"
                  alt="Professional nursing medical support"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Clinical Services We Provide</h3>
                
                <ul className="space-y-2.5 text-sm text-teal-100">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Precise medication administration</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Advanced wound care and healing monitoring</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Comprehensive chronic condition management</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Attentive post-surgical care and recovery</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Regular health assessments and physician reporting</span>
                  </li>
                </ul>

                <p className="text-xs text-teal-200 pt-2 italic border-t border-teal-600/60">
                  Our nurses collaborate closely with your primary care team to guarantee seamless, unified treatment.
                </p>
              </div>
            </div>

            {/* Card 2: Who This Is For */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-slate-800 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/24/3a/fb/243afb4c1e64856d399b409b6c092bfd.jpg"
                  alt="Skilled clinical care at home"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Who Benefits Most</h3>
                
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Individuals healing smoothly after surgery</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Those navigating long-term chronic conditions</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Patients needing continuous vital signs and health tracking</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Families seeking reliable, expert clinical guidance at home</span>
                  </li>
                </ul>

                <div className="pt-6">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-teal-500/20"
                  >
                    <span>Request Nursing Services</span>
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

export default NursingService;