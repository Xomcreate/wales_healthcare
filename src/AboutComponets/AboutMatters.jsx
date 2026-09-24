import React from 'react';
import { Link } from 'react-router-dom';

function AboutMatters() {
  return (
    <section className="relative bg-slate-900 py-12 lg:py-16 overflow-hidden font-sans border-b border-slate-800 text-center">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/d1/a7/66/d1a766315e87150445675387a9b862fd.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Lighter semi-transparent slate overlay tint */}
      <div className="absolute inset-0 bg-slate-900/50 z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6">
          
          {/* Main Title (Shortened) */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Healthcare made seamless and compassionate.
          </h2>

          {/* Description Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow">
            That is why we consistently deliver agile, person-centered support solutions that empower individuals to live with dignity and enable care teams to operate with confidence—whether at home, within long-term facilities, or across the communities we support. It is this unwavering commitment to excellence that establishes Wales Healthcare as a trusted partner for families and institutions across Ontario.
          </p>

          {/* Action Button styled in Teal */}
          <div className="pt-1">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-7 rounded-full text-sm sm:text-base transition-all shadow-xl hover:shadow-teal-600/20"
            >
              <span>Request Care Today</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutMatters;