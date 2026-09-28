import React from 'react';

// Swap this for your own child and youth care image
const HERO_IMAGE = 'https://i.pinimg.com/736x/0d/d7/a5/0dd7a57de2b466f8459997d1dd1976d9.jpg';

function ChildCareHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Child and youth care worker supporting a young person"
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
            Child and Youth Care Worker Diploma Program
          </h1>

          {/* Subtitle / Catchphrase */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
            Turn your passion for helping young people into a rewarding career. With Wales Healthcare, you are just 46 weeks from becoming a qualified youth care worker.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ChildCareHero;