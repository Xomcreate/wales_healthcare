import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function SafeSpace() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/52/48/3b/52483b5b3f766afea1a5c363da5039b7.jpg"
            alt="Safe and Accessible Home Environment Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Creating a Safe and Accessible Home Environment for Seniors
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Practical home modifications, hazard elimination, and mobility enhancements designed to foster independent living and safety.
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
                src="https://i.pinimg.com/1200x/47/92/57/479257421cb117c9ee3f523104dd3184.jpg" 
                alt="Accessible and safe senior living space adjustments" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Fall Prevention</p>
                <p className="text-[11px] text-slate-500">Securing home accessibility</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extended Detailed Explanation & Strategy Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Home Safety Solutions</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Adapting Living Spaces for Maximum Independence
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              As mobility needs shift over time, making targeted adjustments around the house is vital to preventing accidents and ensuring total comfort. Simple modifications like installing grab bars, optimizing lighting, and removing slip hazards allow seniors to navigate their homes securely.
            </p>

            {/* Feature Grid Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Eliminating Slip Hazards</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Secure loose rugs with double-sided tape, clear floor pathways, and eliminate unnecessary clutter.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Bathroom Accessibility</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Install sturdy grab bars near toilets and showers alongside non-slip mats for secure traction.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Optimized Lighting</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Ensure hallways, staircases, and entryways feature bright, motion-activated or easy-reach illumination.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Stairway Safety</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Fit secure handrails on both sides of staircases and keep steps clearly visible and obstruction-free.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Creating a secure home environment protects your loved one's independence. Our support specialists can help evaluate and adapt your living spaces safely.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Have questions about home accessibility? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
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

export default SafeSpace;