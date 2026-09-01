import React from 'react';

function DementiaHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/736x/ea/f4/93/eaf49396c01960728c4c6c93ad90055d.jpg"
          alt="Dementia Care Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the style requested */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title - Reduced size */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Dementia Care
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Providing specialized, compassionate, and safe memory support designed to nurture familiarity, comfort, and peace of mind for individuals and their families at home.
          </p>

        </div>
      </div>
    </section>
  );
}

export default DementiaHero;