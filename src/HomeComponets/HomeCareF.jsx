import React from 'react';

function HomeCareF() {
  const features = [
    {
      title: "Assistance with bathing, dressing, grooming",
      description: "Dignified homecare support for daily hygiene and appearance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      )
    },
    {
      title: "Meal preparation & nutrition support",
      description: "Nutritious meals planned and prepared according to dietary needs",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      )
    },
    {
      title: "Mobility and fall prevention",
      description: "Safe movement assistance and home safety assessments",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      title: "Companionship and emotional support",
      description: "Friendly conversation, activities, and meaningful engagement",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
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
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSemNhUb2zaYevptUIyC9Q5FKItNF0q-q8KtSoqJBTjtg&s=10" 
                  alt="Caregiver supporting senior with walker" 
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
                <span>Daily Assistance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Supporting daily life with <span className="text-[#E65C00]">compassion</span>
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

export default HomeCareF;