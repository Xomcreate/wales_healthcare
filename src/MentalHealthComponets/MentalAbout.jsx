import React from 'react';
import { Link } from 'react-router-dom';

function MentalAbout() {
  return (
    <section className="relative bg-white py-10 lg:py-14 overflow-hidden font-sans border-b border-slate-100">
      {/* Background star / heart pattern accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="mental-heart-stars-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              {/* Star */}
              <path
                d="M30 5L36.5 18.5L51.5 20.5L40.5 31.5L43 46.5L30 39.5L17 46.5L19.5 31.5L8.5 20.5L23.5 18.5Z"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="1"
                strokeOpacity="0.25"
                transform="scale(0.4) translate(10, 10)"
              />
              {/* Heart */}
              <path
                d="M30 45C30 45 50 32 50 20C50 12 43 7 36 12C30 17 30 20 30 20C30 20 30 17 24 12C17 7 10 12 10 20C10 32 30 45 30 45Z"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="1"
                strokeOpacity="0.25"
                transform="scale(0.35) translate(80, 40)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mental-heart-stars-pattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">

        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Program Overview</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
          Support People on Their Path to Mental Wellness and Recovery
        </h2>

        {/* Body Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
          The Mental Health and Addictions Diploma Program at Wales Healthcare gives you a solid professional foundation for working with people affected by mental health challenges and substance use. You will learn counselling techniques, crisis response, and recovery-focused support, and complete a practicum that lets you apply your skills in real community settings.
        </p>

        {/* Brand Accent Box */}
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            At <span className="text-teal-600 font-bold">Wales Healthcare</span>, we train caring professionals who meet people with respect and help them move toward healthier, more stable lives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex flex-wrap justify-center gap-3">
          <Link
            to="/programs"
            className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
          >
            <span>Explore All Programs</span>
          </Link>
          <Link
            to="/apply"
            className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
          >
            <span>Apply Now</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default MentalAbout;