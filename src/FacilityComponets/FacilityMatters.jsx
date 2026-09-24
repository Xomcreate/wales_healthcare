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
              <span>Sustaining Connection Beyond Transition</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Why Dedicated Facility Care Support <span className="text-teal-600">Matters</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Transitioning a loved one into a care facility brings structural safety, yet families frequently encounter a profound gap in personalized oversight. Without continuous independent attention, subtle personal nuances can easily be overlooked.
              </p>
              <p>
                Our specialized facility support model bridges this precise divide. We guarantee your loved one remains actively heard, valued, and individually prioritized, giving families absolute peace of mind through rigorous oversight and compassionate engagement.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                Safeguarding individual agency and protecting daily dignity through proactive, hands-on resident advocacy.
              </p>
            </div>
          </div>

          {/* Unique Photo Card 1 */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-teal-100/50 rounded-3xl transform rotate-3 -z-10" />
              <div className="h-100 sm:h-112.5 w-full bg-slate-200 rounded-2xl shadow-xl overflow-hidden relative border border-slate-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1J18_qDZMfeto-03E2V9aESzUcLjqkwGBrTG98p5yQ&s=10" 
                  alt="Supportive care in a facility setting" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Empowerment & Continuous Oversight</p>
                    <p className="text-[11px] text-slate-600">Ensuring residents always feel uniquely valued.</p>
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
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEuKvAotyBriZF0WAi-Z-1mM3mQJBW3kV9GRQmrwBbWmcePJf7ginIj3su&s=10" 
                  alt="Personalized resident advocacy and care" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Collaborative Advocacy</p>
                    <p className="text-[11px] text-slate-600">Enhancing institutional routines with personal care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Harmonious Clinical Collaboration</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              What Is Professional <span className="text-teal-600">Facility Advocacy?</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Our facility advocacy programs are engineered to organically enhance the operational foundation established by institutional medical teams, senior living networks, and clinical staff.
              </p>
              <p>
                Rather than replacing core institutional structures, our professional care partners work directly within the facility ecosystem—providing supplemental attention, safeguarding individual care standards, and acting as a dedicated bridge for the family.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                A collaborative framework focused entirely on optimizing daily comfort, protecting rights, and deepening human connection.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FacilityMatters;