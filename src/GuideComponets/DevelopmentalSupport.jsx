import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function DevelopmentalSupport() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION (Set to match exact HospiceHero height styling) */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/1a/9f/1f/1a9f1f0b99566bbb839420621d49acce.jpg"
            alt="Developmental Support Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Centered on mobile, left-aligned from small screens up */}
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Empowering Growth & Developmental Support
            </h1>

            {/* Small Writeup */}
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Fostering holistic mental, emotional, and social growth across every life stage through specialized strategies, guidance, and community resources.
            </p>

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH IMAGE SECTION (Unique Re-crafted Writeup) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image / Visual Accent */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none">
              <img 
                src="https://i.pinimg.com/1200x/51/9c/7c/519c7cbdb2c3036d6cd68ea7f6aa78ea.jpg" 
                alt="Developmental guidance and growth session" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Lifespan Approach</p>
                <p className="text-[11px] text-slate-500">From infancy to adulthood</p>
              </div>
            </div>
          </div>

          {/* Right Column: Unique Re-crafted Content */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Holistic Progression</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Nurturing Potential Through Every Life Chapter
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Personal progression goes far beyond physical milestones—it encompasses mental wellness, emotional intelligence, and social integration. Our targeted support framework gives individuals the precise tools, professional insights, and encouragement required to navigate life's continuous evolution successfully.
            </p>

            {/* Unique Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Early Childhood Focus</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Building initial building blocks like language acquisition, curiosity, and emotional bonding safely.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Academic Empowerment</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Tailored tutoring, personalized study layouts, and enrichment activities optimized for student triumph.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Adaptive Transitions</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Expert coaching and mentorship to build resilience during major life shifts and career developments.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Social & Mental Wellness</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Fostering robust self-esteem, peer connectivity, and effective self-regulation skills.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                At <span className="text-teal-600 font-bold">Wales Healthcare</span>, we provide structured family support initiatives so every individual has the opportunity to flourish.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Need professional home care assistance? Call us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> or contact us online to get started today.
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

export default DevelopmentalSupport;