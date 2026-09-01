import React from 'react';

function ServiceHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/1200x/23/6e/d9/236ed92de8dc388b1ed7694467ab5761.jpg"
          alt="Service areas background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the style */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title - Decreased size */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white leading-tight">
            Service Areas
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Wales Healthcare provides reliable, high-standard healthcare services and professional support across communities throughout Ontario. Discover our coverage and how we bring quality care right to your door.
          </p>

        </div>
      </div>
    </section>
  );
}

export default ServiceHero;