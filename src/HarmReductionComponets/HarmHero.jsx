import React from 'react';

// Swap this for your own Harm Reduction training image
const HERO_IMAGE = 'https://i.pinimg.com/1200x/5e/9d/ba/5e9dbadcef0add2db47d470d1f933f59.jpg';

function HarmHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Participants learning harm reduction skills during a training session"
          className="w-full h-full object-cover object-center"
        />
        {/* Flat tint on mobile, left-to-right fade from small screens up */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Harm Reduction Training
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            Meet people where they are. Help them stay safer, connected, and respected.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HarmHero;