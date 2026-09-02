import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function LongTime() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/736x/41/1d/ad/411dad4e959b0a6bfc102b3112d159eb.jpg"
            alt="Long-Term Care vs Staying at Home Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Navigating Long-Term Care Placement vs. Staying at Home
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Comparing institutional facility placement with customized in-home care options to determine the safest, most comforting path for your loved one.
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
                src="https://i.pinimg.com/1200x/7f/ca/a3/7fcaa3841c770855ac48d467b70ae72f.jpg" 
                alt="Family discussing long-term care choices and home alternatives" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Informed Decisions</p>
                <p className="text-[11px] text-slate-500">Weighing care environments</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extended Detailed Explanation & Strategy Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Care Transition Planning</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Evaluating Options for Your Family’s Future
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Deciding whether a loved one should transition to a long-term care facility or continue living at home with professional assistance is one of the most significant choices a family can make. Evaluating safety, independence, emotional comfort, and medical needs helps clarify the right direction.
            </p>

            {/* Feature Grid Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Comfort of Home</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Staying at home preserves familiar surroundings, personal routines, and deep emotional attachments.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Tailored In-Home Care</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Personalized hourly or 24/7 nursing and support adapts flexibly as health requirements evolve.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Facility Considerations</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Long-term care facilities offer structured institutional environments with round-the-clock clinical staffing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Family Involvement</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">In-home care allows family members to maintain direct involvement and close daily participation.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Every family situation is unique. Our experienced care advisors can help you assess your options and design a plan that prioritizes safety and dignity.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Need advice on care choices? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
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

export default LongTime;