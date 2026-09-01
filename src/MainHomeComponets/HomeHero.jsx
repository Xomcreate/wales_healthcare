import React from 'react';
import { Link } from 'react-router-dom';

function HomeHero() {
  return (
    <section className="relative min-h-[60vh] py-16 sm:py-20 flex items-center justify-center overflow-hidden font-sans bg-slate-900">
      
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
        src="https://i.pinimg.com/736x/04/f9/c8/04f9c8713a0e55f7986ebe8572a221be.jpg"
          alt="Caregiver supporting senior individual" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/70 to-slate-950/40"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-8 text-center lg:text-left">
            
            {/* Top Tag */}
            <span className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 font-medium px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Trusted Care & Staffing Solutions
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-[1.15]">
              Care you can trust, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-200">
                support you can rely on.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Professional home care for families and dependable staffing support for healthcare organizations across Ontario.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/consultation" 
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-medium px-7 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2.5 group"
              >
                Request a Free Consultation
                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>

              <Link 
                to="/careers" 
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-7 py-3.5 rounded-xl backdrop-blur-md transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                Apply For A Role
              </Link>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default HomeHero;