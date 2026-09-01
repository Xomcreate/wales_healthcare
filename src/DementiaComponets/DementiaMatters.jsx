import React from 'react';

function DementiaMatters() {
  return (
    // Section with the dark background, image overlay, and updated dementia writeup & button
    <section className="relative bg-slate-900 py-12 lg:py-16 overflow-hidden font-sans border-b border-slate-800 text-center">
      
      {/* Background Image Layer set to be bright and visible */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
        style={{
          backgroundImage: "url('https://i.pinimg.com/236x/0e/26/9f/0e269ff7f4f51f0cfe8a3618c6290199.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Lighter semi-transparent slate overlay tint */}
      <div className="absolute inset-0 bg-slate-900/50 z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6">
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Why It Matters
          </h2>

          {/* Description Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow">
            Specialized dementia care helps reduce confusion and anxiety while promoting a sense of stability and security.
          </p>

          {/* Action Button styled in Teal */}
          <div className="pt-1">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-7 rounded-full text-sm sm:text-base transition-all shadow-xl hover:shadow-teal-600/20"
            >
              <span>Contact us to learn more about dementia care support</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DementiaMatters;