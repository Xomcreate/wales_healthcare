import React from 'react';

function HomeCareStories() {
  // Reusable 4-heart clover pattern component
  const FourHeartsPattern = () => (
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Heart */}
      <path 
        d="M50 38C44 26 30 26 30 38C30 50 50 62 50 62C50 62 70 50 70 38C70 26 56 26 50 38Z" 
        fill="#A5B4FC" 
        fillOpacity="0.4"
        transform="rotate(0 50 50)"
      />
      {/* Right Heart */}
      <path 
        d="M50 38C44 26 30 26 30 38C30 50 50 62 50 62C50 62 70 50 70 38C70 26 56 26 50 38Z" 
        fill="#99F6E4" 
        fillOpacity="0.45"
        transform="rotate(90 50 50)"
      />
      {/* Bottom Heart */}
      <path 
        d="M50 38C44 26 30 26 30 38C30 50 50 62 50 62C50 62 70 50 70 38C70 26 56 26 50 38Z" 
        fill="#5EEAD4" 
        fillOpacity="0.5"
        transform="rotate(180 50 50)"
      />
      {/* Left Heart */}
      <path 
        d="M50 38C44 26 30 26 30 38C30 50 50 62 50 62C50 62 70 50 70 38C70 26 56 26 50 38Z" 
        fill="#DDD6FE" 
        fillOpacity="0.4"
        transform="rotate(270 50 50)"
      />
    </svg>
  );

  return (
    <section className="relative bg-[#1a3248] py-14 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      
      {/* Top-Left Corner 4-Hearts Pattern */}
      <div className="absolute top-6 left-6 sm:left-12 pointer-events-none">
        <FourHeartsPattern />
      </div>

      {/* Bottom-Right Corner 4-Hearts Pattern */}
      <div className="absolute bottom-6 right-6 sm:right-12 pointer-events-none">
        <FourHeartsPattern />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[#C4B5FD] font-semibold text-xs uppercase tracking-widest block mb-1">
            Home Care Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hear from our dedicated team
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl relative text-slate-700 text-center mb-8">
          
          {/* Quote Icon Top Left */}
          <div className="absolute -top-4 left-6 sm:left-10 bg-[#DDD6FE] text-[#6D28D9] w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.998v10h-9.998z" />
            </svg>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 pt-2 max-w-2xl mx-auto">
            <p>
              Joining this agency two years ago completely changed my perspective on healthcare support. The scheduling flexibility allows me to balance my personal life while delivering meaningful care to elderly clients.
            </p>
            <p>
              Management genuinely listens to our feedback and ensures we have the proper training and resources needed in the field. It feels less like a traditional job and more like a supportive community.
            </p>
            <p className="font-medium text-slate-900">
              Knowing that I make a tangible difference in my clients' daily lives every single day is deeply rewarding.
            </p>
          </div>

          {/* Author Details */}
          <div className="mt-6 pt-2">
            <h4 className="font-bold text-slate-900 text-sm">Marcus Vance</h4>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">Senior Caregiver</span>
          </div>

        </div>

        {/* Action Button */}
        <div>
          <button className="bg-[#1D82B6] hover:bg-[#166995] text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-200 text-xs sm:text-sm inline-flex items-center justify-center mx-auto">
            Read More Caregiver Stories
          </button>
        </div>

      </div>
    </section>
  );
}

export default HomeCareStories;