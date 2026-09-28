import React from 'react';

function ShelterHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/1200x/dc/b5/fd/dcb5fda909dbc20d82b5e2c74dc598b1.jpg"
          alt="Shelter Support Worker background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the style */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Program Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Shelter Support Worker Certificate Program
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            You&apos;re Only Weeks Away From Your New Career as a Shelter Support Worker with Wales Healthcare.
          </p>

        </div>
      </div>
    </section>
  );
}

export default ShelterHero;