import React from 'react';

// Swap this for your own developmental services image
const HERO_IMAGE = 'https://i.pinimg.com/736x/12/4a/70/124a705840d38358b9da887f64021219.jpg';

function DevelopmentHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Developmental services worker supporting a person in their daily life"
          className="w-full h-full object-cover object-center"
        />
        {/* Flat tint on mobile, left-to-right fade from small screens up */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          {/* Program Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Developmental Services Worker Diploma Program
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            Start a career that helps people live with independence and dignity. You are just 46 weeks away from becoming a developmental services worker.
          </p>
        </div>
      </div>
    </section>
  );
}

export default DevelopmentHero;