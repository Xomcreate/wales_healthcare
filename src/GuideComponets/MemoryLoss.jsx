import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function MemoryLoss() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/31/23/2d/31232d6324a1114c1f0851e897a7a7dc.jpg"
            alt="Recognizing Early Signs of Memory Loss Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Recognizing Early Signs of Memory Loss and Cognitive Decline
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Identifying subtle changes in memory, reasoning, and daily patterns early to ensure prompt support, professional evaluation, and peace of mind.
            </p>

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH SINGLE IMAGE & COMPREHENSIVE EXPLANATION SECTION */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Single Controlled-Height Image Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none h-72 sm:h-80 lg:h-105">
              <img 
                src="https://staffrelief.ca/wp-content/uploads/2026/05/image-11-768x589.jpeg" 
                alt="Compassionate health evaluation and cognitive support session" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Early Awareness</p>
                <p className="text-[11px] text-slate-500">Spotting cognitive shifts promptly</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extended Detailed Explanation & Strategy Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Cognitive Health Insight</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Understanding Subtle Cognitive Changes Over Time
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Occasional forgetfulness can happen to anyone, but persistent shifts in memory, problem-solving abilities, and routine behaviors warrant closer attention. Recognizing these signs early allows families to secure professional medical evaluations and customized in-home support structures promptly.
            </p>

            {/* Feature Grid Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Disruptive Memory Loss</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Frequently forgetting recently learned information, important dates, or asking for the same details repeatedly.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Planning & Problem Challenges</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Trouble following familiar recipes, managing monthly bills, or concentrating on multi-step tasks.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Time & Spatial Confusion</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Losing track of dates, seasons, or passing time, and occasionally becoming disoriented in familiar locations.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Communication Shifts</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Difficulty following conversations, stopping midway through sentences, or struggling with vocabulary.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Early detection opens doors to better management and proactive care. Our compassionate professionals are ready to help your family navigate memory care options.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Have questions or need guidance? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. IMPORTED PERSONAL CARE COMPONENT AS THE LAST SECTION */}
      <section className="border-t border-slate-100">
        <PersonalLast/>
      </section>

    </div>
  );
}

export default MemoryLoss;