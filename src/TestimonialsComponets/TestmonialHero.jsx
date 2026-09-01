import React from 'react';

function TestmonialHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/736x/e3/fd/c1/e3fdc18b2e24ce8586f99cb29b07e4af.jpg"
          alt="Family testimonials background"
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
            Family Testimonials
          </h1>

          {/* Small Writeup - Slightly increased body size */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Read authentic experiences and heartfelt stories from families and healthcare partners across Ontario who trust Wales Healthcare for compassionate support and dependable care.
          </p>

        </div>
      </div>
    </section>
  );
}

export default TestmonialHero;