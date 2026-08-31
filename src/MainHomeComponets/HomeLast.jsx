import React from 'react';

function HomeLast() {
  return (
    <>
      <section className="font-sans w-full">
        
        {/* Top CTA Banner */}
        <div className="relative bg-slate-900 py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* Background image remains clear */}
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1200&auto=format&fit=crop" 
              alt="Care support" 
              className="w-full h-full object-cover opacity-60"
            />
            {/* Adjusted overlay to bg-white/45 (balanced: not too thick, not too light) */}
            <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative z-10 w-full max-w-250 mx-auto px-4 text-center">
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3 drop-shadow-xs">
              Ready to take the next step in care?
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-800 max-w-xl mx-auto mb-8 leading-relaxed font-medium">
              Contact us today for a friendly, no-obligation consultation. Let's create a customized support plan tailored to your family's needs.
            </p>

            <button className="bg-[#132A3E] hover:bg-slate-800 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-md transition-all duration-200 mb-6">
              Book Your Free Consultation
            </button>

            {/* Feature bullets */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-900">
              <span>Free Consultation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-700 hidden sm:inline-block"></span>
              <span>100% Confidential</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-700 hidden sm:inline-block"></span>
              <span>Dedicated Experts</span>
            </div>

          </div>
        </div>

        {/* Bottom Join Our Team Banner (Centered text & elements on mobile, left-aligned on large screens) */}
        <div className="bg-[#132A3E] py-14 lg:py-16 text-white w-full">
          <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Side: Image Container */}
              <div className="lg:col-span-5 h-70 sm:h-85 w-full rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop" 
                  alt="Medical team" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side: Content & Actions (Responsive text-center on mobile/tablet, text-left on desktop) */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-teal-400 uppercase mb-3">
                  CAREERS WITH US
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-snug">
                  Grow your healthcare career with purpose
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8 max-w-xl lg:max-w-none">
                  We are always seeking passionate care professionals dedicated to delivering excellence. Join our community-focused network and empower individuals throughout Ontario.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                  <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all duration-200">
                    Explore Open Positions
                  </button>
                  <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all duration-200">
                    Get in Touch
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>
    </>
  );
}

export default HomeLast;