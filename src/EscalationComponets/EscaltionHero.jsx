import React from 'react';

// Swap this for your own De-escalation training image
const HERO_IMAGE = 'https://i.pinimg.com/736x/31/92/a5/3192a5486d764e77e13b3292fbf3aa7d.jpg';

function EscaltionHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Participants practising de-escalation and crisis intervention skills during training"
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
            De-escalation, Crisis Intervention & Conflict Resolution
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            Support safely. Communicate clearly. Reduce harm for everyone involved.
          </p>
        </div>
      </div>
    </section>
  );
}

export default EscaltionHero;