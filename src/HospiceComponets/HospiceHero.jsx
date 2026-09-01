import React from 'react';

function HospiceHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/1200x/87/74/33/877433d16a97d895dc26394be90c99b4.jpg"
          alt="Hospice Care Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the previous style */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title - Reduced size */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Hospice Care
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Providing compassionate, dignity-centered end-of-life support focused on comfort, peace, and emotional reassurance for both individuals and their families.
          </p>

        </div>
      </div>
    </section>
  );
}

export default HospiceHero;