import React, { useState } from 'react';

// Put your real info-package file here (e.g. in /public) or remove the button
const INFO_PACKAGE_URL = '/info-package.pdf';

// Fill these in when you have the details. Any value left as null is hidden.
const courseDetails = {
  startDate: null, // e.g. 'January 12, 2027'
  length: '16 Weeks',
  schedule: null, // e.g. 'Tuesdays and Thursdays'
  time: null, // e.g. '6 – 9 pm'
  delivery: 'Online + Classroom',
  tuition: null, // e.g. '$1,500'
  registrationFee: null, // e.g. '$75'
};

const modules = [
  {
    id: 1,
    title: 'Food Safety, Sanitation and Personal Hygiene',
    content:
      'This module covers the practices that keep food safe from delivery to serving. Learners study how foodborne illness spreads, safe temperatures for receiving, storing, cooking, and holding food, and how to prevent cross-contamination. They also learn proper handwashing, clean uniforms and grooming, cleaning and sanitizing of equipment and surfaces, and the food safety rules that apply in healthcare kitchens.',
  },
  {
    id: 2,
    title: 'Workplace Safety in the Food Service Industry',
    content:
      'Kitchens can be busy and hazardous, so this module focuses on protecting yourself and your coworkers. Topics include safe lifting and body mechanics, preventing slips, trips, and falls, handling knives and hot equipment, fire and burn prevention, and using chemicals safely. Learners also review emergency procedures, first response to workplace injuries, and their rights and responsibilities for health and safety at work.',
  },
  {
    id: 3,
    title: 'Working in the Food Service Industry',
    content:
      'Students get a clear picture of what the job involves day to day. The module looks at the different roles in a food service team, how meals are planned, prepared, and served in care settings, and how to work well with coworkers, nurses, and residents. Learners also build workplace skills such as teamwork, time management, professionalism, and reliability, and learn how to start and grow a career in the field.',
  },
];

const demandPoints = [
  'Hospitals, long-term care homes, and other care facilities need trained food service workers every day of the year.',
  'This program gives you practical skills in food preparation, meal service, nutrition basics, and sanitation for healthcare settings.',
  'Experience in a care facility kitchen can lead to roles such as cook, kitchen supervisor, or dietary services lead.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants who do not meet the diploma requirement may apply as mature students and complete an entrance assessment.',
];

const careerRoles = [
  'Food Service Worker',
  'Dietary Aide',
  'Kitchen Assistant',
  'Cook\u2019s Helper',
  'Meal Service Attendant',
  'Dietary Services Assistant',
];

const careerSettings = [
  'Hospitals',
  'Long-Term Care Homes',
  'Retirement Residences',
  'Rehabilitation Centers',
  'Community Care Facilities',
  'Institutional and Catering Kitchens',
];

function Bullet({ children, className = '' }) {
  return (
    <li className={`flex items-start space-x-2 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function DetailBlock({ label, children }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">{label}</h4>
      {children}
    </div>
  );
}

function FoodAll() {
  const [openModule, setOpenModule] = useState(1);
  const d = courseDetails;
  const hasSchedule = d.length || d.schedule || d.time;
  const hasCost = d.tuition || d.registrationFee;

  return (
    <div className="font-sans bg-white text-slate-800">

      {/* 1. Program introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Food Service Worker Certificate Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This certificate prepares you for work in the kitchens and dining rooms of healthcare and care facilities. You will learn how to prepare and serve meals safely, follow nutrition and dietary guidelines, and keep every part of the kitchen clean and compliant with food safety standards.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Along the way you will build the teamwork, reliability, and attention to detail that employers look for, so you can start your career with confidence.
          </p>
          
          <div className="pt-2">
            {/* <a
              href={INFO_PACKAGE_URL}
              download
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
            >
              Get the Info Package
            </a> */}
          </div>
        </div>

        {/* Demand */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for food service workers?</h3>
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
              What you will study, module by module
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
            backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000')",
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
              <DetailBlock label="Start Date">
                <p className="text-base font-bold text-white">{d.startDate || 'To be announced'}</p>
              </DetailBlock>
              {hasSchedule && (
                <div className="pt-2 border-t border-slate-800">
                  <DetailBlock label="Length">
                    {d.length && <p className="text-base font-bold text-white">{d.length}</p>}
                    {d.schedule && <p className="text-xs text-slate-300">{d.schedule}</p>}
                    {d.time && <p className="text-xs text-teal-300 font-semibold">{d.time}</p>}
                  </DetailBlock>
                </div>
              )}
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <DetailBlock label="Delivery">
                <p className="text-sm font-bold text-white">{d.delivery}</p>
              </DetailBlock>
              <div className="pt-2 border-t border-slate-800">
                <DetailBlock label="Tuition">
                  {hasCost ? (
                    <>
                      {d.tuition && <p className="text-teal-400 font-bold text-base">{d.tuition}</p>}
                      {d.registrationFee && (
                        <p className="text-[11px] text-slate-400 mt-1">Registration fee: {d.registrationFee}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-300">Contact us for fees</p>
                  )}
                </DetailBlock>
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
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000"
              alt="Food service team working in a care facility kitchen"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Food Service Career Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Graduates can pursue roles such as:
              </p>
            </div>

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

export default FoodAll;