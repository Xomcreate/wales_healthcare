import React, { useState } from 'react';

const modules = [
  {
    id: 1,
    title: 'Orientation, Community Shelter Systems & Responsibilities',
    content:
      'Start with the big picture: how emergency shelters, transitional housing, and other community housing services are organized, funded, and connected to one another. Learners map out the different kinds of shelters, clarify what a shelter support worker is (and is not) responsible for, and get familiar with the daily routines, expectations, and teamwork that come with the role.',
  },
  {
    id: 2,
    title: 'Equity, Diversity & Human Rights',
    content:
      'This module looks at how discrimination, poverty, and systemic barriers shape who ends up without housing. Learners study human rights principles and anti-oppressive practice, examine their own assumptions, and practise creating shelter spaces where people of every background, identity, and ability are treated with equal dignity and respect.',
  },
  {
    id: 3,
    title: 'Conflict Resolution & Effective Communication',
    content:
      'Shelters bring many people together under stress, so clear communication is a core skill. Learners practise active listening, calm and respectful language, and setting limits without escalating a situation. They also learn practical approaches to mediating disagreements between residents, and between residents and staff.',
  },
  {
    id: 4,
    title: 'Trauma-Informed Care & Wellness',
    content:
      'Many people who use shelters have lived through trauma. This module explains how trauma affects behaviour, trust, and health, and teaches the principles of safety, choice, and collaboration that guide trauma-informed care. It also covers how workers can look after their own wellbeing and avoid burnout and compassion fatigue.',
  },
  {
    id: 5,
    title: 'Ethics, Confidentiality, Boundaries & Disclosure',
    content:
      'Learners explore the ethical standards behind professional shelter work: protecting personal information, knowing when information must be shared, and keeping healthy professional boundaries with residents. Case-based exercises help students work through real dilemmas and decide how to respond responsibly and consistently.',
  },
  {
    id: 6,
    title: 'Facing Fears & Self-Sabotage',
    content:
      'Growth in this field starts with self-awareness. Learners identify the fears, doubts, and self-defeating habits that can hold them back personally and professionally, and learn to recognize similar patterns in the people they support. The module focuses on building confidence, resilience, and constructive ways to move forward.',
  },
  {
    id: 7,
    title: 'Harm Reduction',
    content:
      'Students explore the frameworks, policies, and practices that aim to reduce the health, social, and legal harms linked to substance use. Learners practise offering support without judgment, pressure, or discrimination, and meet people where they are so they can stay safer and stay connected to services.',
  },
  {
    id: 8,
    title: 'Case Management & Documentation',
    content:
      'This module covers how to work with residents on person-centred plans, from intake and needs assessment to goal setting, referrals, and follow-up on the path to stable housing. Learners also practise writing clear, accurate, and objective notes and records that meet professional and organizational standards.',
  },
  {
    id: 9,
    title: 'Crisis Intervention & De-Escalation',
    content:
      'Learners build the skills to recognize early warning signs of a crisis and respond safely. Topics include verbal and non-verbal de-escalation, responding to overdose, mental health emergencies, and aggressive behaviour, and knowing when to call for backup or emergency services. Role-play scenarios help turn the techniques into confident habits.',
  },
  {
    id: 10,
    title: 'Indigenous Competency',
    content:
      'This module introduces the history and ongoing impact of colonization on Indigenous peoples, including its link to the over-representation of Indigenous people among those experiencing homelessness. Learners develop culturally safe and respectful practices, and learn how to work alongside Indigenous communities and services.',
  },
];

const homelessnessCauses = [
  'Loss of income',
  'Family breakdown',
  'Mental health challenges',
  'Physical health problems',
  'Substance use',
  'Domestic or intimate partner violence',
  'Eviction',
  'Forced relocation',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants who do not meet the diploma requirement may apply as mature students and take an entrance assessment.',
];

const jobSettings = [
  'Emergency Shelters',
  'Group Homes',
  'Drop-in Centers',
  'Respite Shelters',
  'Food Banks',
  'Transitional and Supportive Housing',
  'Non-Profit Community Support Facilities',
  'Harm Reduction Centers',
  'Family Shelters',
  'Government and Municipal Programs',
  "Women's Shelters for Survivors of Abuse",
  'Residential Treatment Centers',
  'Youth Shelters',
];

function Bullet({ children, className = '' }) {
  return (
    <li className={`flex items-start space-x-2 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function ShelterTime() {
  const [openModule, setOpenModule] = useState(1);

  return (
    <div className="font-sans bg-white text-slate-800">

      {/* 1. Program Introduction & Causes of Homelessness */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Shelter Support Worker Certificate Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>Shelter Support Worker Micro-Credential:</strong> Shelter support workers spend their days alongside people who do not have a stable place to live. In this role you help residents settle into shelter life, build step-by-step plans toward independent or supportive housing, keep daily routines steady, and put harm reduction into practice.
          </p>
        </div>

        {/* Causes box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Why people become homeless
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            {homelessnessCauses.map((cause) => (
              <Bullet key={cause}>{cause}</Bullet>
            ))}
          </ul>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-teal-600 pl-4">
          Because of this, shelter workers need to bring compassion to every shift and understand how trauma and homelessness affect a person's wellbeing.
        </p>

        {/* Demand & admission */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for shelter workers?</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Thousands of people are without stable housing at any given time, and shelters and community agencies constantly need trained staff. This program gives you the practical skills to support vulnerable people well, and it can also open the door to wider careers in social services.
          </p>
        </div>

        <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-teal-900">Admission requirements</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {admissionRequirements.map((req) => (
              <Bullet key={req}>{req}</Bullet>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Course Outline Accordion (dark) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Course Outline</h2>
            <div className="w-12 h-0.5 bg-teal-500 mx-auto mt-2 rounded-full" />
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
                    <span className="text-slate-400 text-lg shrink-0">{isOpen ? '−' : '+'}</span>
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

      {/* 3. Course Details & Schedule */}
      <section className="relative py-16 bg-slate-950 text-white border-y border-slate-800">
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000')",
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
                <p className="text-base font-bold text-white">November 9, 2026</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Length</h4>
                <p className="text-base font-bold text-white">5 Weeks</p>
                <p className="text-xs text-slate-300">Mondays and Wednesdays</p>
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
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span className="text-slate-400 line-through">$2,000</span>
                  <span className="text-teal-400 font-bold">$1,499</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Registration fee: $75</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Career Opportunities */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-100 h-80">
            <img
              src="https://i.pinimg.com/1200x/dc/b5/fd/dcb5fda909dbc20d82b5e2c74dc598b1.jpg"
              alt="Support workers"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Where Shelter Support Workers Work
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Graduates can find roles in settings such as:
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
              {jobSettings.map((job, i) => (
                <Bullet
                  key={job}
                  className={i === jobSettings.length - 1 && jobSettings.length % 2 === 1 ? 'sm:col-span-2' : ''}
                >
                  {job}
                </Bullet>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ShelterTime;