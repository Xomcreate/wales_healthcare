import React from 'react';
// Import your personal care component
import PersonalLast from '../PersonalComponets/PersonalLast';

function PersonalSupportWorker() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/56/ac/c9/56acc9f40f511cdd574234cb92e61616.jpg"
            alt="Personal Support Worker Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Exploring the Role of a Personal Support Worker
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Providing compassionate, frontline care and essential daily assistance to help individuals maintain their independence, dignity, and quality of life.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ALTERNATIVE SECTION 2 DESIGN (Asymmetric Split Layout with Alternating Feature Rows & Dual Images) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          
          {/* Row 1: Text First, Image Second */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700 mx-auto sm:mx-0">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Frontline Healthcare Heroes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                The Foundation of Compassionate In-Home Support
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Personal Support Workers (PSWs) are the true backbone of daily health services. By stepping in with specialized hands-on training, they bridge the gap between clinical requirements and personal comfort, allowing seniors and recovering individuals to maintain total dignity at home.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Activities of Daily Living</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Expert assistance with bathing, dressing, grooming, and safe mobility support.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Medication Management</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Reliable reminders and medication tracking administered under professional care.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img 
                  src="https://i.pinimg.com/1200x/44/b2/aa/44b2aa4473057730cf98e6db2bf7ce32.jpg" 
                  alt="PSW assisting a client" 
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Image First, Text Second */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img 
                  src="https://i.pinimg.com/736x/f6/2b/06/f62b068f18ba895915799c8e09a491e4.jpg" 
                  alt="In-home care companionship" 
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Nutrition, Companionship & Family Peace of Mind
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Beyond physical care, PSWs offer crucial emotional companionship, reducing isolation and building trusting bonds. Choosing in-home care over nursing facilities ensures less disruption, greater patient comfort, and active family involvement in every step of the journey.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Meal Preparation</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Tailored nutritional planning and feeding assistance meeting individual dietary needs.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Emotional Support</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Trusted companionship that nurtures mental well-being and active social interaction.</p>
                </div>
              </div>

              {/* Callout Box */}
              <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-1">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  At <span className="text-teal-600 font-bold">Wales Healthcare</span>, we take pride in delivering empathetic support. Contact us today to learn how we can help your family!
                </p>
              </div>
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

export default PersonalSupportWorker;