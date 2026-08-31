import React from 'react';

function HomecareHero() {
  return (
    <section className="relative bg-slate-900 py-16 lg:py-20 border-b border-slate-200 overflow-hidden font-sans">
      
      {/* Background Image without Heavy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ3MBh2rsLD3WQRKHQaAsP9U7KkLRVbicBb0Co1tXndg&s=10"
          alt="Professional homecare service background"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light transparent veil so text is legible while the image stays clear */}
        <div className="absolute inset-0 bg-slate-950/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Compact Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Description with ultra-light glass backdrop */}
          <div className="lg:col-span-8 space-y-4 text-left p-6 sm:p-8 rounded-3xl bg-slate-950/20 backdrop-blur-xs border border-white/10 shadow-lg">
            
            {/* Medical Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-900/40 backdrop-blur-md border border-teal-500/30 px-3 py-1 rounded-md text-xs font-medium text-teal-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Wales Healthcare • Professional Clinical Support</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md leading-tight">
              Reliable Home Care Rooted in <span className="text-teal-400">Clinical Excellence</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-100 drop-shadow leading-relaxed max-w-2xl font-medium">
              Delivering specialized, compassionate homecare services tailored to support patient independence, safety, and recovery right at home.
            </p>

          </div>

          {/* Right Column: Clean Medical Card with light glassmorphism */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/15 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center text-teal-300 font-bold">
                  ✚
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">24/7 Care Coordination</h3>
                  <p className="text-xs text-slate-200">Licensed & certified professionals</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Care Status</span>
                  <span className="text-teal-300 font-semibold">Accepting New Patients</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Support Line</span>
                  <span className="text-white font-semibold">Always Available</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HomecareHero;