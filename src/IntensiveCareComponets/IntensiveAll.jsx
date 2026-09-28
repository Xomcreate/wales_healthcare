import React, { useState } from 'react';

// Put your real info-package file here (e.g. in /public) or change to a Link
const INFO_PACKAGE_URL = '/info-package.pdf';

const modules = [
  {
    id: 1,
    title: 'Foundations of Effective Case Management',
    content:
      'Begin with what case management is and why it matters for people facing addiction and homelessness. Learners look at the main models of practice, the responsibilities of a case manager, and how the role fits within a wider network of housing, health, and community services.',
  },
  {
    id: 2,
    title: 'Key Concepts & Guiding Attitudes',
    content:
      'This module clarifies the terms, values, and attitudes that shape good practice. Learners explore strengths-based and non-judgmental approaches, respect for a client\u2019s right to make their own choices, and how personal beliefs and biases can influence the way we work with people.',
  },
  {
    id: 3,
    title: 'Communicating Effectively',
    content:
      'Learners practise the everyday communication skills that build trust: active listening, open-ended questions, empathy, and clear, respectful language. The module also introduces techniques for handling sensitive or emotional conversations and for communicating across cultures and backgrounds.',
  },
  {
    id: 4,
    title: 'Engaging Clients & Assessing Strengths and Needs',
    content:
      'Students learn how to start a working relationship with a new client, from the first meeting through intake. They practise gathering information respectfully, identifying a client\u2019s strengths, barriers, and priorities, and using assessment tools to get a complete picture of housing, health, and support needs.',
  },
  {
    id: 5,
    title: 'Building a Support Plan With the Client',
    content:
      'This module focuses on planning together with the client, not for them. Learners set realistic, measurable goals, match those goals to available services such as housing, treatment, income support, and health care, and write plans that reflect what matters most to the person.',
  },
  {
    id: 6,
    title: 'Monitoring Services & Following Up With Clients',
    content:
      'Learners see how to coordinate with other providers, track a client\u2019s progress, and adjust the plan when circumstances change. Topics include regular check-ins, keeping accurate records, handling setbacks, and planning transitions or case closure in a way that keeps clients connected to support.',
  },
];

const demandPoints = [
  'Shelters, health centres, and community agencies rely on case managers to help clients with complex needs move toward stable housing and better health.',
  'This program gives you practical, job-ready skills in assessment, planning, and coordination of services for people facing addiction and homelessness.',
  'Experience as a case manager can also lead to senior roles in program coordination and management in non-profit and government settings.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants who do not meet the diploma requirement may apply as mature students and complete an entrance assessment.',
];

// Fill these in with your real figures. The section only shows if the list has items.
// Example: { label: 'Average salary (Canada)', value: '$00,000 / year' }
const careerStats = [];

const careerRoles = [
  'Case Manager',
  'Housing Support Worker',
  'Outreach Worker',
  'Addictions Support Worker',
  'Harm Reduction Worker',
  'Mental Health Support Worker',
  'Transitional Housing Coordinator',
  'Community Service Worker',
];

const careerSettings = [
  'Emergency and Transitional Shelters',
  'Supportive Housing Programs',
  'Addictions Treatment Centers',
  'Community Health Centers',
  'Non-Profit Agencies',
  'Government and Municipal Programs',
];

function Bullet({ children, className = '' }) {
  return (
    <li className={`flex items-start space-x-2 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function IntensiveAll() {
  const [openModule, setOpenModule] = useState(1);

  return (
    <div className="font-sans bg-white text-slate-800">

      {/* 1. Program introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Intensive Case Management for Addictions and Homelessness Certificate Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This certificate prepares you to support people whose lives are affected by addiction and housing instability. Over five weeks you will learn the full case management process, from meeting a client for the first time to planning services, coordinating care, and following their progress.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            You will also explore current best practices, legal and ethical responsibilities, the importance of keeping accurate records, and how to work well with other service providers. By graduation you will have the knowledge and confidence to step into a professional case management role.
          </p>
          {/* <a
            href={INFO_PACKAGE_URL}
            download
            className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
          >
            Get the Info Package
          </a> */}
        </div>

        {/* Demand */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for case managers?</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {demandPoints.map((point) => (
              <Bullet key={point}>{point}</Bullet>
            ))}
          </ul>
        </div>

        {/* Admission */}
        <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-teal-900">Admission requirements</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {admissionRequirements.map((req) => (
              <Bullet key={req}>{req}</Bullet>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Program outline accordion (dark) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Program Outline</h2>
            <div className="w-12 h-0.5 bg-teal-500 mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Five weeks of practical case management training
            </p>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isOpen = openModule === mod.id;
              return (
                <div key={mod.id} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setOpenModule(isOpen ? null : mod.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 text-left font-semibold text-sm sm:text-base flex justify-between items-center gap-4 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-teal-300">
                      Module {mod.id}: {mod.title}
                    </span>
                    <span className="text-slate-400 text-lg shrink-0">{isOpen ? '\u2212' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/60 pt-3 bg-slate-900/40">
                      {mod.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Course details & schedule */}
      <section className="relative py-16 bg-slate-950 text-white border-y border-slate-800">
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg">
              <h4 className="text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2">Course Details</h4>
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mx-auto">📅</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Start Date</h4>
                <p className="text-base font-bold text-white">October 5, 2026</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Length</h4>
                <p className="text-base font-bold text-white">5 Weeks</p>
                <p className="text-xs text-slate-300">Mondays and Fridays</p>
                <p className="text-xs text-teal-300 font-semibold">6 – 9 pm</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Delivery</h4>
                <p className="text-sm font-bold text-white">Online</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Tuition</h4>
                <p className="text-teal-400 font-bold text-base">$1,080</p>
                <p className="text-[11px] text-slate-400 mt-1">Registration fee: $75</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Career opportunities */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-100 h-80">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Graduates ready to start their case management careers"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Case Manager Career Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Graduates can pursue roles such as:
              </p>
            </div>

            {careerStats.length > 0 && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {careerStats.map((stat) => (
                  <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <dt className="text-[11px] font-semibold text-slate-500">{stat.label}</dt>
                    <dd className="text-lg font-bold text-teal-700">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
              {careerRoles.map((role) => (
                <Bullet key={role}>{role}</Bullet>
              ))}
            </ul>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">Where you could work</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                {careerSettings.map((place) => (
                  <Bullet key={place}>{place}</Bullet>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default IntensiveAll;