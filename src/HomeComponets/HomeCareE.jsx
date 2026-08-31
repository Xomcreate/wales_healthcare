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
              <span>The Difference Home Makes</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Why Homecare is <span className="text-teal-600">Important</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Staying at home means staying connected to what matters most—familiar surroundings, cherished memories, and the comfort of routine. Homecare allows individuals to maintain their independence while receiving professional support in an environment where they feel most secure.
              </p>
              <p>
                Research shows that seniors who receive care at home experience better health outcomes, improved emotional well-being, and a higher quality of life. Homecare also provides peace of mind for families, knowing their loved ones are safe, supported, and living life on their own terms.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                Homecare empowers individuals to age in place with dignity, maintaining their independence while receiving the support they need to thrive.
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
                    <p className="text-xs font-bold text-slate-900">Comfort & Independence</p>
                    <p className="text-[11px] text-slate-600">Thriving securely in familiar surroundings.</p>
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
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3VxpVUQiDJaDAWmFgkJBSfJaGyAQ5ljHSw3sYC0J66A&s=10" 
                  alt="Professional caregiver supporting a senior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100 w-full">
                    <p className="text-xs font-bold text-slate-900">Professional Daily Living Support</p>
                    <p className="text-[11px] text-slate-600">Tailored assistance with dignity and respect.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Compassionate Care For Daily Living</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              What is <span className="text-teal-600">Homecare?</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Homecare services provide essential assistance with activities of daily living (ADLs) to help individuals maintain their independence, dignity, and quality of life at home.
              </p>
              <p>
                Our trained caregivers offer personalized support tailored to each client’s unique needs, preferences, and routines. From bathing and grooming to meal preparation and mobility assistance, we’re here to help your loved one live comfortably and safely.
              </p>
              <p className="font-medium text-slate-900 pt-2">
                Whether you need a few hours of support each week or around-the-clock care, our flexible service plans adapt to changing needs over time.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeCareE;