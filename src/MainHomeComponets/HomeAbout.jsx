
import React from 'react';

function HomeAbout() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid Layout: Video Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Caregiver Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-slate-900 border border-slate-100">

            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source
                src="/caregiver1.mp4"
                type="video/mp4"
              />

              Your browser does not support the video tag.
            </video>

          </div>

          {/* Right Column: About Content */}
          <div className="flex flex-col justify-center">

            {/* Section Tag */}
            <span className="text-teal-600 font-semibold text-xs uppercase tracking-widest block mb-3">
              Dedicated to Excellence
            </span>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-6">
              Empowering independence with compassionate, professional, and reliable home care
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">

              <p>
                We believe that true care goes beyond basic assistance—it is about
                restoring dignity, building trust, and nurturing meaningful
                connections in the comfort of home.
              </p>

              <p>
                Our rigorous selection process ensures that every caregiver on our
                team is not only certified and highly skilled, but deeply
                empathetic and passionate about improving the daily lives of
                seniors and individuals with unique care needs.
              </p>

              <p>
                From custom care planning to continuous family communication,
                we stand by your side to make every day safer, brighter, and
                more comfortable.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeAbout;
