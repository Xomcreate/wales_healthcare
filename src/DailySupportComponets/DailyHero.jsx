import React from 'react';

function DailyHero() {
  return (
    <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/736x/0c/f9/5b/0cf95bbb233db1f8194f48d95455edf7.jpg"
          alt="Companionship and Daily Support Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Responsive Overlay matching the hero style */}
        <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Centered on mobile, left-aligned from small screens up */}
        <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
          
          {/* Title - Text size further reduced */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Companionship / Daily Support
          </h1>

          {/* Small Writeup */}
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Enhancing daily life with warm companionship, meaningful engagement, and reliable assistance to help individuals thrive comfortably at home.
          </p>

        </div>
      </div>
    </section>
  );
}

export default DailyHero;