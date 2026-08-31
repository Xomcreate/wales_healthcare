import React from 'react';

function CareerC() {
  return (
    <section className="bg-slate-900 py-12 lg:py-16 border-b border-slate-800 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-4">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
          Apply to Join Wales Healthcare
        </h2>
        
        {/* Action Button - Reduced top padding for overall height compression */}
        <div className="pt-1">
          <a
            href="#apply-form"
            className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/25"
          >
            Apply Now
          </a>
        </div>

      </div>
    </section>
  );
}

export default CareerC;