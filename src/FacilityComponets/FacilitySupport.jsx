import React from 'react';

function FacilitySupport() {
  const features = [
    {
      title: "Companionship",
      description: "Providing meaningful social interaction to reduce loneliness and support emotional well-being.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      )
    },
    {
      title: "Personalized Attention",
      description: "Focused, one-on-one support tailored to individual preferences and daily routines.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    },
    {
      title: "Family Peace of Mind",
      description: "Keeping families informed and reassured that their loved one is supported and cared for.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      title: "Advocacy & Support",
      description: "Helping communicate needs and preferences to ensure the best possible care experience.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#1b2a4e] py-10 lg:py-14 font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Shorter Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="h-80 sm:h-90 w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-700/50">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCrZFEhBhwlBwI5Afz6cB1o63M1JHqerP5dbX9dAJ3UQ&s=10" 
                  alt="Compassionate facility care support and interaction" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Header and Tighter 2x2 Feature Grid */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Section Heading */}
            <div className="space-y-2 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Facility Support Services</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Enhancing Comfort and Connection in <span className="text-teal-300">Care Settings</span>
              </h2>
            </div>

            {/* 2x2 Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {features.map((item, index) => (
                <div key={index} className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left space-y-3 lg:space-y-0 lg:space-x-3.5 group">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-inner">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default FacilitySupport;