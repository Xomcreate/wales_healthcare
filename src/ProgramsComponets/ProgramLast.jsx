import React from 'react';

function ProgramLast() {
  return (
    <section className="relative bg-white py-10 lg:py-14 overflow-hidden font-sans border-b border-slate-100 text-center">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Very light transparent white overlay to maintain readability against the image */}
      <div className="absolute inset-0 bg-white/90 z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-4">
          
          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Take the First Step Toward Your Healthcare Career
          </h2>

          {/* Description Text */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Speak with our admissions team at Wales Healthcare to find the right training program and kickstart your professional journey today.
          </p>

          {/* Action Button */}
          <div className="pt-1">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-white font-medium py-2.5 px-6 rounded-full text-xs sm:text-sm transition-all shadow-xl hover:shadow-slate-950/20"
            >
              <span>Contact Admissions Today</span>
            </a>
          </div>

          {/* Inline Feature List with Dots */}
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-800 font-medium pt-1">
            <li>Industry-Aligned Training</li>
            <li aria-hidden="true" className="text-slate-400">&bull;</li>
            <li>Flexible Learning Options</li>
            <li aria-hidden="true" className="text-slate-400">&bull;</li>
            <li>Dedicated Career Support</li>
          </ul>

        </div>
      </div>
    </section>
  );
}

export default ProgramLast;