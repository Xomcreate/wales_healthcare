import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function Caregivertips() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/736x/49/c4/9d/49c49db4809249197414f0d2ac4e66a9.jpg"
            alt="Caregiver Wellness and Tips Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Essential Tips for Family Caregivers: Sustaining Wellness & Balance
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Empowering family supporters with practical self-care strategies, effective stress management, and reliable techniques to thrive while caring for loved ones.
            </p>

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH IMAGE SECTION (First Image - Controlled Height) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: First Image Visual (Fixed Height Container) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none h-72 sm:h-80 lg:h-96">
              <img 
                src="https://i.pinimg.com/736x/69/d9/96/69d996d3a1c6881ca930bd7b8b53b73a.jpg" 
                alt="Caregiver practicing self-care and taking a mindful break" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Preventing Burnout</p>
                <p className="text-[11px] text-slate-500">Protecting emotional health</p>
              </div>
            </div>
          </div>

          {/* Right Column: First Content Block */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Caregiver Wellness & Mindset</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Prioritizing Personal Health While Supporting Family
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Providing ongoing support to a family member is a deeply rewarding act of love, but it can also introduce physical fatigue and emotional stress. Establishing healthy boundaries and daily self-care rituals ensures you can sustain your dedication safely over the long term.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Set Realistic Boundaries</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Accept that you cannot control everything; acknowledge your personal physical limits and honor them daily.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Establish Daily Rest</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Incorporate intentional moments of rest, deep breathing exercises, or quiet walks to clear your mind.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Build a Support Network</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Share responsibilities with other family members or join caregiver peer groups to share experiences.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Maintain Health Routines</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Never skip your own routine medical checkups, balanced nutrition, and consistent sleep hygiene.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECOND CONTENT & IMAGE SECTION (Second Image - Controlled Height) */}
      <section className="py-16 lg:py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & Strategies */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Practical Support</h2>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Leveraging Professional Help & Respite Care Options
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You do not have to carry the entire caregiving journey alone. Integrating professional nursing and respite solutions grants you necessary time to recharge while ensuring superior care continuity for your loved one.
              </p>

              {/* Second Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Utilize Respite Care</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Schedule temporary professional coverage to handle personal errands, vacations, or uninterrupted rest.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Organize Daily Tasks</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Keep care logs, medication schedules, and medical contacts structured in a single accessible place.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Practice Self-Compassion</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Forgive yourself on challenging days and celebrate small victories in your caregiving routine.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Stay Informed</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Continuously educate yourself on specialized condition strategies and available healthcare funding options.</p>
                </div>
              </div>

              {/* Closing Callout Block with Phone Number */}
              <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Your well-being is vital to the quality of care your family receives. Our compassionate team is here to lighten your load with tailored home care solutions.
                </p>
                <p className="text-xs text-slate-800 font-semibold pt-1">
                  Ready to take a break or need guidance? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
                </p>
              </div>
            </div>

            {/* Right Column: Second Image Visual (Fixed Height Container) */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-w-md lg:max-w-none h-72 sm:h-80 lg:h-96">
                <img 
                  src="https://i.pinimg.com/736x/69/9c/67/699c674e57cb525ef568818e6bd842f5.jpg" 
                  alt="Family caregiver receiving reliable assistance" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
              </div>
              {/* Decorative Floating Pill */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">★</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Never Alone</p>
                  <p className="text-[11px] text-slate-500">Professional respite support</p>
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

export default Caregivertips;