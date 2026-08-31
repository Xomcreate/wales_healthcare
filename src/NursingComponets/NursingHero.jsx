import React from 'react';

function NursingHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfLO2JT9PQ4cNPNZVBwDKz2zrg-etfZs0sf9t6dXpwUg&s=10"
          alt="Nursing Care Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the style requested */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Nursing Support
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            From expert medication management to specialized clinical procedures, our licensed registered nurses deliver compassionate, hospital-grade care right in the comfort of your home.
          </p>

          {/* Action Button */}
          <div className="pt-2 flex justify-center sm:justify-start">
            <a
              href="#contact"
              className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/20"
            >
              <span>Get Started</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default NursingHero;