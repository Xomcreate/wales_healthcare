import React from 'react';

function FacilityMatters() {
  return (
    <section className="bg-white py-16 lg:py-24 font-sans border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Section 1: Why Facility Care Support Matters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Staying Connected Beyond Transition</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Why Facility Care Support <span className="text-teal-600">Matters</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                When a loved one moves into a care facility, it can bring peace of mind — but also new concerns. Families may not always be present, and residents can benefit from additional personalized attention, companionship, and advocacy.
              </p>
              <p>
                Facility care support helps bridge that gap, ensuring your loved one continues to feel seen, heard, and cared for in a meaningful way. It provides reassurance that someone is there to support their comfort, well-being, and quality of life.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                Empowering residents with consistent care and dedicated advocacy to ensure dignity and connection every single day.
              </p>
            </div>
          </div>

          {/* Unique Photo Card 1 */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-teal-100/50 rounded-3xl transform rotate-3 -z-10" />
              <div className="h-100 sm:h-112.5 w-full bg-slate-200 rounded-2xl shadow-xl overflow-hidden relative border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Supportive care in a facility setting" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Comfort, Dignity & Connection</p>
                    <p className="text-[11px] text-slate-600">Ensuring loved ones feel seen and heard.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: What is Facility Care? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Unique Photo Card 2 (Order flipped on large screens for visual balance) */}
          <div className="lg:col-span-5 lg:order-1 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-teal-100/50 rounded-3xl transform -rotate-3 -z-10" />
              <div className="h-100 sm:h-112.5 w-full bg-slate-200 rounded-2xl shadow-xl overflow-hidden relative border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000" 
                  alt="Personalized resident advocacy and care" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Personalized Support & Advocacy</p>
                    <p className="text-[11px] text-slate-600">Enhancing care alongside facility teams.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Personalized Support Within Care Settings</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              What is <span className="text-teal-600">Facility Care?</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Facility care services are designed to complement the care already provided within hospitals, long-term care homes, or assisted living environments.
              </p>
              <p>
                Our team works alongside facility staff to offer one-on-one support tailored to your loved one’s unique needs — whether that’s companionship, assistance with daily routines, or simply being a consistent, caring presence.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                It’s about enhancing care, not replacing it, and helping residents feel more comfortable and connected.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FacilityMatters;