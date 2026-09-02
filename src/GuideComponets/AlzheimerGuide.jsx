import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function AlzheimerGuide() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxkZXJseSUyMGNhcmV8ZW58MHx8MHx8fDA%3D"
            alt="Alzheimer's Care at Home Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              A Comprehensive Guide to Alzheimer’s Care at Home
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Navigating cognitive changes with patience, safe environment modifications, structured routines, and compassionate in-home support.
            </p>

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH IMAGE SECTION (First Image) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: First Image Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none">
              <img 
                src="https://plus.unsplash.com/premium_photo-1681883882438-84077fb862f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvbWUlMjBjYXJlfGVufDB8fDB8fHww" 
                alt="Supportive memory care interaction" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Safe & Familiar</p>
                <p className="text-[11px] text-slate-500">Comfort of home surroundings</p>
              </div>
            </div>
          </div>

          {/* Right Column: First Content Block */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Cognitive Health & Well-being</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Creating a Safe and Nurturing Home Environment
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Alzheimer’s disease progressively influences memory, reasoning, language, and independent capability. Managing care within the familiar atmosphere of home significantly improves overall comfort and reduces confusion.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Home Modifications</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Eliminate slipping hazards, install secure handrails, optimize lighting, and utilize room labeling cues.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Predictable Routines</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Establish steady daily schedules for meals, medical dosing, and simple activities to lower anxiety levels.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Helpful Memory Aids</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Incorporate clocks, calendars, and labeled organizers to promote orientation and independence.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Clear Communication</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Speak calmly with simple phrasing, allowing adequate time for response while utilizing supportive non-verbal cues.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECOND CONTENT & IMAGE SECTION (Second Image Included) */}
      <section className="py-16 lg:py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & Strategies */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Holistic Support</h2>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Engaging Activities & Prioritizing Caregiver Well-being
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meaningful engagement fosters a sense of personal accomplishment, while maintaining caregiver health prevents exhaustion and burnout over time.
              </p>

              {/* Second Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Tailored Activities</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Involve loved ones in gentle music listening, puzzles, or mild exercises matched to personal interests.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Social Connection</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Encourage interactions with friends and family members to sustain emotional health and avoid isolation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Caregiver Self-Care</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Prioritize breaks, maintain personal education on disease updates, and explore professional respite services.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Flexible Adaptation</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Every journey remains distinctive; adjusting approaches with patience and unconditional care is fundamental.</p>
                </div>
              </div>

              {/* Closing Callout Block with Phone Number */}
              <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Choosing in-home care is less disruptive and allows greater family involvement. Our specialized nursing agency provides customized dementia support so your family never walks alone.
                </p>
                <p className="text-xs text-slate-800 font-semibold pt-1">
                  Have questions or want to know how we can support your family? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
                </p>
              </div>
            </div>

            {/* Right Column: Second Image Visual */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none">
                <img 
                  src="https://images.unsplash.com/photo-1587556930799-8dca6fad6d41?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Compassionate in-home care provider assisting a senior" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
              </div>
              {/* Decorative Floating Pill */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">★</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Expert Guidance</p>
                  <p className="text-[11px] text-slate-500">Dedicated nursing assistance</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. IMPORTED PERSONAL CARE COMPONENT AS THE LAST SECTION */}
      <section className="border-t border-slate-100">
        <PersonalLast/>
      </section>

    </div>
  );
}

export default AlzheimerGuide;