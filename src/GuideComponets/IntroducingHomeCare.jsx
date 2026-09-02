import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function IntroducingHomeCare() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1663054621092-0a2103af2ec5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Introducing At-Home Care Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Introducing At-Home Care to a Loved One With Compassion
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Navigating conversations about introducing in-home support gently, building trust, and ensuring a smooth transition to enhanced daily comfort.
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
                src="https://i.pinimg.com/736x/9a/cc/e1/9acce12f2b81e14a7aec74f05601233e.jpg" 
                alt="Family discussing home care options together peacefully" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Gentle Conversations</p>
                <p className="text-[11px] text-slate-500">Preserving independence & dignity</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extended Detailed Explanation & Strategy Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Smooth Transitions</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Approaching the Topic of Support with Empathy
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bringing up the idea of professional in-home assistance can sometimes trigger worries about losing independence. Framing the discussion around safety, comfort, and preserving freedom helps loved ones feel empowered and respected throughout the decision-making process.
            </p>

            {/* Feature Grid Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Choose the Right Time</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Pick a calm, relaxed environment without rushing or distractions to introduce the conversation warmly.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Focus on Benefits</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Highlight how extra help keeps them safe at home longer while relieving daily chores and fatigue.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Involve Them in Choices</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Give your loved one a voice in selecting schedules, activities, and caregiver preferences.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Take It Step-by-Step</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Start with short introductory visits or companion check-ins before scaling up full support hours.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Our expert care coordinators are here to assist your family in finding the perfect balance of independence and professional assistance.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Have questions or need guidance on starting care? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
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

export default IntroducingHomeCare;