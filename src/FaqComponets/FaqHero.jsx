import React from 'react';

function FaqHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/736x/d7/6f/71/d76f719a2eb084f29d5e5c35293d8d98.jpg"
          alt="Frequently asked questions background"
          className="w-full h-full object-cover object-center"
        />
        {/* Navy blue gradient overlay */}
        <div className="absolute inset-0 bg-slate-950/60 sm:bg-linear-to-r sm:from-slate-950/80 sm:via-slate-950/40 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Common questions about our services, care standards, and how we support families and healthcare facilities across Ontario. Find clear answers to help you navigate your healthcare journey with confidence.
          </p>

        </div>
      </div>
    </section>
  );
}

export default FaqHero;