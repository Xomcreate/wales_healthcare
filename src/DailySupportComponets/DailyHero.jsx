import React from 'react';

function DailyHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000"
          alt="Companionship and Daily Support Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the hero style */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title (Decreased size from xl:text-5xl to lg:text-4xl) */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Companionship / Daily Support
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Enhancing daily life with warm companionship, meaningful engagement, and reliable assistance to help individuals thrive comfortably at home.
          </p>

          {/* Action Button */}
          <div className="pt-2 flex justify-center sm:justify-start">
            <a
              href="#contact"
              className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/20"
            >
              <span>Get Started</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DailyHero;