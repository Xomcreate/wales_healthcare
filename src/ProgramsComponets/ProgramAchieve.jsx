import React from 'react';

function ProgramAchieve() {
  return (
    <section className="bg-slate-900 py-10 lg:py-12 border-b border-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        
        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Learn. <span className="text-teal-500">Achieve.</span> Succeed.
        </h2>

        {/* Divider Line */}
        <div className="w-12 h-0.5 bg-teal-500/60 mx-auto rounded-full" />

        {/* Description Text */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Wales Healthcare provides comprehensive education and hands-on training designed to empower students for professional excellence. Our learners build rewarding careers across specialized health, community, and support sectors.
        </p>

      </div>
    </section>
  );
}

export default ProgramAchieve;