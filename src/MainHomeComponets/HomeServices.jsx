import React from 'react';

function HomeServices() {
  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden bg-slate-100">
      
      {/* Background Image with Transparent White Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600" 
          alt="Background Care" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
        
        {/* Right Side / Mobile First: Title & Description (Centered on mobile, right-aligned on desktop, comes first on mobile) */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-end text-center lg:text-right lg:pt-3 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full text-teal-700 font-semibold text-xs uppercase tracking-wider mb-3">
            Our Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 leading-snug">
            Complete care solutions for families & organizations
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg">
            Discover our comprehensive, professional in-home personal care and reliable healthcare facility staffing solutions tailored to your exact needs.
          </p>
        </div>

        {/* Left Side / Mobile Second: Two Cards Side-by-Side (Fully Responsive) */}
        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 order-2 lg:order-1">
          
          {/* Card 1: Home Care */}
          <div className="bg-white/95 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="relative h-32 w-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600" 
                  alt="Home Care" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">Home Care Services</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">
                  Personalized in-home support for individuals and families to live safely at home.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ Personal Care & Companionship</li>
                  <li className="flex items-center gap-2">✓ Dementia & Alzheimer’s Care</li>
                </ul>
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-0">
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-xl text-xs shadow-md transition-all">
                Book Home Care
              </button>
            </div>
          </div>

          {/* Card 2: Facility Care */}
          <div className="bg-white/95 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="relative h-32 w-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600" 
                  alt="Facility Care" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">Facility Care Services</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">
                  Qualified healthcare professionals for hospitals and long-term care facilities.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ Registered Nurses & RPNs</li>
                  <li className="flex items-center gap-2">✓ PSWs & 24/7 Support</li>
                </ul>
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-0">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs shadow-md transition-all">
                Book Facility Staffing
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeServices;