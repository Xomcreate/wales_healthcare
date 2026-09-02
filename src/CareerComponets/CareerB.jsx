import React from 'react';

function CareerB() {
  return (
    <section id="why-join" className="relative bg-slate-50 py-16 lg:py-24 border-b border-slate-200 overflow-hidden font-sans">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] bg-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full text-xs font-semibold text-teal-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Careers at Wales Healthcare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Why Caregivers Choose <span className="text-teal-600">Wales Healthcare</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            At Wales Healthcare, our caregivers and healthcare professionals support individuals, families, and healthcare organizations across the region. We’re always interested in connecting with qualified, compassionate professionals to meet ongoing care needs.
          </p>
        </div>

        {/* Content Grid: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Text Information (Why & Who) */}
          <div className="lg:col-span-7 space-y-10 text-left">
            
            {/* Why Choose Us Block */}
            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-slate-900">Built to Support You</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-slate-700 list-inside">
                {[
                  "Flexible opportunities across the region",
                  "Supportive scheduling and coordination",
                  "Meaningful work in home and community settings",
                  "Trusted provider with decades of experience",
                  "Opportunities in both home care and facilities",
                  "Competitive compensation & benefits"
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Who We're Looking For Block */}
            <div className="space-y-5 bg-white p-8 rounded-2xl border border-slate-100 shadow-inner">
              <h3 className="text-2xl font-bold text-slate-900">Who We’re Looking For</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We work with certified healthcare professionals who are reliable, compassionate, and committed to providing quality care. Experience, availability, and regional demand help determine current opportunities.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  "Relevant Certification (PSW, RPN, RN, HCA)",
                  "Reliable & Compassionate Work Ethic",
                  "Strong Communication Skills",
                  "Independent & Team Player Ability"
                ].map((tag) => (
                  <span key={tag} className="bg-teal-50 text-teal-800 text-xs font-medium px-3 py-1.5 rounded-full border border-teal-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Image and CTA */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-24">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Container */}
              <div className="bg-white p-2 rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                  alt="Compassionate caregiver assisting a senior"
                  className="w-full h-96 lg:h-137.5 object-cover rounded-2xl"
                />
              </div>

              {/* Floating CTA Card */}
              <div className="absolute -bottom-8 -left-4 sm:left-6 right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Ready to make a difference?</p>
                  <p className="text-base font-bold text-slate-900">Join Our Care Team</p>
                </div>
                <a
                  href="/apply"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md whitespace-nowrap"
                >
                  Apply Now
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CareerB;