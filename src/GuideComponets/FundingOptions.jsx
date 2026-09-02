import React from 'react';
import PersonalLast from '../PersonalComponets/PersonalLast';

function FundingOptions() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/13/af/97/13af97e75d92cd1c1c58832c34991237.jpg"
            alt="Home Care Funding Options Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Understanding Home Care Funding Options in Ontario
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Navigating financial support pathways, government grants, insurance programs, and private options to make quality home healthcare accessible.
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
                src="https://i.pinimg.com/236x/05/db/8a/05db8a2e9280d1bf7f21eec740157df3.jpg" 
                alt="Reviewing home care financial planning documents" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/40 via-transparent to-transparent" />
            </div>
            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Financial Clarity</p>
                <p className="text-[11px] text-slate-500">Exploring Ontario programs</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extended Detailed Explanation & Strategy Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Financial Guidance</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Navigating Available Funding Pathways for Care
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Securing financial support for home care doesn't have to be complicated. Understanding the various government subsidies, provincial programs, insurance coverages, and private funding models enables families to plan effectively and secure the right level of care without unnecessary stress.
            </p>

            {/* Feature Grid Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Government Subsidies</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Explore provincial home and community care programs that offer publicly funded nursing and support services.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Private Insurance Coverage</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Review your extended health benefits or workplace policies to check for eligible personal care reimbursements.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Tax Credits & Benefits</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Discover medical expense tax credits and caregiver benefits designed to offset home healthcare expenses.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Flexible Private Pay</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">Customizable hourly or live-in care arrangements tailored to fit your specific budgetary framework.</p>
              </div>
            </div>

            {/* Closing Callout Block with Phone Number */}
            <div className="bg-teal-50/70 border border-teal-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Our team can help guide you through understanding your funding choices so you can focus entirely on your loved one's well-being.
              </p>
              <p className="text-xs text-slate-800 font-semibold pt-1">
                Have questions about financing care? Contact us at <a href="tel:9057091767" className="text-teal-600 underline hover:text-teal-700">905-709-1767</a> today.
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

export default FundingOptions;