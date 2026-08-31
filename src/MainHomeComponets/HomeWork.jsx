import React from 'react';

// ---------------------------------------------------------------------------
// Same teal identity as HomeHero, adapted for a white section:
//   bg-white               section background
//   teal-50 / teal-200      eyebrow pill (light equivalent of hero's teal-500/10)
//   teal-600 -> teal-400    gradient accent (light equivalent of hero's teal-400/200)
//   teal-600 / teal-50      icon + number-badge accents
//   slate-600               body copy on white
//   slate-200               card borders / dividers
// ---------------------------------------------------------------------------

function HomeWork() {
  const steps = [
    {
      n: '01',
      title: 'Assessment',
      description: 'A complimentary consultation to understand your needs and preferences.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Tailored Care Plan',
      description: 'A customized plan designed around your schedule, budget, and needs.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Matching',
      description: 'Carefully paired with a qualified caregiver who fits your needs.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      n: '04',
      title: 'Ongoing Support',
      description: 'Continuous monitoring and adjustments to ensure exceptional care.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-14 lg:py-16 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .care-serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .care-sans  { font-family: 'Inter', sans-serif; }
        @keyframes careRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .care-step { animation: careRise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .care-step { animation: none; } }
      `}</style>

      <div className="care-sans mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-9 max-w-2xl text-center lg:mb-11">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-teal-700">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            How We Work
          </span>
          <h2 className="care-serif text-2xl font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Our Care{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-teal-400">
              Process
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            From first contact to ongoing care, we're with you every step of the way.
          </p>
        </div>

        {/* Steps row */}
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connecting rail (desktop only, sits behind the number badges) */}
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-linear-to-r from-transparent via-slate-200 to-transparent lg:block" />

          {steps.map((item, index) => (
            <div
              key={item.n}
              className="care-step relative flex flex-col rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:text-left"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 care-serif text-[12px] font-semibold text-white">
                  {item.n}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-teal-600">
                  {item.icon}
                </span>
              </div>
              <h3 className="care-serif text-base font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWork;