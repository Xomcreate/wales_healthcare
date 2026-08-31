import React from 'react';

function ContactD() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden font-sans border-b border-slate-200">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Nk2V_MsxsaB5ZceFmghu2rxfc8IT-N5wvOO9Xc6gUw&s=10"
          alt="Healthcare team background"
          className="w-full h-full object-cover object-center filter grayscale-20"
        />
        {/* Semi-transparent white wash overlay */}
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
        
        {/* Content Container - Text color adjusted for visibility on white */}
        <div className="space-y-6 max-w-2xl mx-auto">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 drop-shadow-sm">
            Looking to Join Our Team?
          </h2>
          
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            Explore career opportunities and learn what it's like to work with Wales Healthcare.
          </p>
          
          <div className="pt-4">
            <a
              href="/careers"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-0.5 duration-200"
            >
              View Careers
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ContactD;