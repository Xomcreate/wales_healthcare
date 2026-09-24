import React from 'react';

function HomeCareE() {
  return (
    <section className="bg-white py-16 lg:py-24 font-sans border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Section 1: Why Homecare is Important */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Why Home Matters</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              The Value of <span className="text-teal-600">Homecare</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                There's something irreplaceable about familiar surroundings — the routines, the memories, the comfort of home. Homecare lets people hold onto that while still getting the professional support they need, in the place where they feel most at ease.
              </p>
              <p>
                Care at home is often linked to better health outcomes, stronger emotional wellbeing, and a fuller quality of life. For families, it also means peace of mind — knowing a loved one is safe, supported, and living life their own way.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                It's about aging with dignity — staying independent while getting exactly the support needed to keep thriving.
              </p>
            </div>
          </div>

          {/* Unique Photo Card 1 - Updated Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-teal-100/50 rounded-3xl transform rotate-3 -z-10" />
              <div className="h-100 sm:h-112.5 w-full bg-slate-200 rounded-2xl shadow-xl overflow-hidden relative border border-slate-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsKjoyeRZRipwRujqWhfEANEzhxJjdQsJ_B4NJmUAzlOqMH6oWy1GRjE&s=10" 
                  alt="Senior care support at home" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Comfort, Meet Independence</p>
                    <p className="text-[11px] text-slate-600">Living well in the surroundings they know.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: What is Homecare? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Unique Photo Card 2 (Order flipped on large screens for visual balance) - Updated Image */}
          <div className="lg:col-span-5 lg:order-1 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-purple-100/50 rounded-3xl transform -rotate-3 -z-10" />
              <div className="h-100 sm:h-112.5 w-full bg-slate-200 rounded-2xl shadow-xl overflow-hidden relative border border-slate-100">
                <img 
                  src="https://i.pinimg.com/736x/15/04/02/1504029ca6de74a33f32c256d75d04e1.jpg" 
                  alt="Professional caregiver supporting a senior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Everyday Support, Done Right</p>
                    <p className="text-[11px] text-slate-600">Care that respects independence and dignity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Support For Everyday Life</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              What Does <span className="text-teal-600">Homecare</span> Mean?
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Homecare covers the everyday support people need to stay independent, comfortable, and safe — all without leaving home.
              </p>
              <p>
                Our caregivers get to know each client personally, adapting to their routines, preferences, and needs. Whether it's help with bathing and grooming, preparing meals, or getting around safely, we're there to make daily life easier.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                From a few hours a week to full-time care, our plans flex as needs change — so support always fits the moment.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeCareE;