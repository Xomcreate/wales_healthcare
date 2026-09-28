import React from 'react';

function FoodHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=80"
          alt="Food service workers preparing meals in a professional kitchen"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive overlay: flat tint on mobile, left-to-right fade from small screens up */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">

          {/* Program Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Food Service Worker Certificate Program
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            Train with Wales Healthcare for a career preparing safe, nutritious meals in healthcare and care facilities.
          </p>

        </div>
      </div>
    </section>
  );
}

export default FoodHero;