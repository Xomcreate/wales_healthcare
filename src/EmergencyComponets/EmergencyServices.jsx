import React from 'react';

function EmergencyServices() {
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
            
            {/* Outline Alert/Emergency Icon */}
            <div className="text-teal-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            {/* Sub-heading / Overline */}
            <h3 className="text-xs sm:text-sm font-bold tracking-widest text-teal-700 uppercase">
              About Our Specialized Service
            </h3>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Emergency Staffing
            </h2>

            {/* Description Text */}
            <p className="text-sm text-slate-600 leading-relaxed">
              We offer flexible support solutions for facilities and families across Ontario, from Windsor to Ottawa.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our emergency staffing services provide immediate, dependable support to care facilities facing unexpected shortages or urgent care demands.
            </p>

          </div>

          {/* Right Column: Cards Grid (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: What We Provide */}
            <div className="bg-teal-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-teal-600 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
                  alt="Emergency staffing and rapid deployment"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">What We Provide</h3>
                
                <ul className="space-y-2.5 text-sm text-teal-100">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Rapid deployment of trained staff</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Coverage for unexpected absences</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Support during high-demand periods</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Reliable caregivers</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-300 font-bold shrink-0">✓</span>
                    <span className="text-left">Seamless team integration</span>
                  </li>
                </ul>

                <p className="text-xs text-teal-200 pt-2 italic border-t border-teal-600/60">
                  Ensuring uninterrupted resident safety and operational stability when it matters most.
                </p>
              </div>
            </div>

            {/* Card 2: Who This Is For */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-slate-800 text-white text-center sm:text-left relative z-10">
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                  alt="Urgent staffing solutions for care facilities"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Who This Is For</h3>
                
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Facilities facing urgent staffing shortages</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">High-demand or crisis situations</span>
                  </li>
                  <li className="flex items-start justify-center sm:justify-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span className="text-left">Teams needing immediate reinforcement</span>
                  </li>
                </ul>

                <div className="pt-6">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-teal-500/20"
                  >
                    <span>Request Emergency Coverage</span>
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

export default EmergencyServices;