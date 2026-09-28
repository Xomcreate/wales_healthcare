import React, { useState } from 'react';

// Put your real info-package file here (e.g. in /public) or remove the button
const INFO_PACKAGE_URL = '/info-package.pdf';

// Fill these in when you have the details. Any value left as null is hidden.
const courseDetails = {
  startDate: null, // e.g. 'January 12, 2027'
  length: '26 Weeks',
  schedule: null, // e.g. 'Mondays and Wednesdays'
  time: null, // e.g. '6 – 9 pm'
  delivery: 'Online + Classroom \u2022 Clinical Placement',
  tuition: null, // e.g. '$3,500'
  registrationFee: null, // e.g. '$75'
};

const modules = [
  {
    code: 'PSW 001',
    title: 'PSW Foundations',
    content:
      'Start with the role itself: what a personal support worker does, the settings where PSWs work, and how they fit into the healthcare team. Learners cover professional conduct, ethics, communication, confidentiality, and the legal responsibilities that guide safe, respectful care.',
  },
  {
    code: 'PSW 002',
    title: 'Safety and Mobility',
    content:
      'This module teaches how to keep clients and yourself safe. Learners practise safe lifting, transfers, and positioning, use mobility aids correctly, prevent falls and infections, and know how to respond in an emergency.',
  },
  {
    code: 'PSW 003',
    title: 'Body Systems',
    content:
      'Students learn the basic structure and function of the major body systems and how aging and illness affect them. This knowledge helps PSWs notice changes in a client\u2019s condition and report them accurately.',
  },
  {
    code: 'PSW 004',
    title: 'Assisting with Personal Hygiene',
    content:
      'Learners develop hands-on skills for helping clients with bathing, grooming, dressing, oral care, and toileting. The focus is on protecting privacy and dignity, encouraging independence, and adapting care to each person\u2019s needs and preferences.',
  },
  {
    code: 'PSW 005',
    title: 'Abuse and Neglect',
    content:
      'This module explains the different forms of abuse and neglect, how to recognize the warning signs, and what factors put clients at risk. Learners study their duty to report and the correct steps to take to protect vulnerable people.',
  },
  {
    code: 'PSW 006',
    title: 'Nutrition',
    content:
      'Students explore the basics of healthy eating and how nutritional needs change with age and illness. Topics include helping clients eat and drink safely, special and therapeutic diets, cultural food preferences, and spotting signs of poor nutrition or swallowing problems.',
  },
  {
    code: 'PSW 007',
    title: 'Care Planning',
    content:
      'Learners see how care plans are built and used. They practise following a plan, observing and recording a client\u2019s progress, writing clear reports, and sharing information with nurses and other team members.',
  },
  {
    code: 'PSW 008',
    title: 'Assisting the Family / Growth and Development',
    content:
      'This module looks at human growth and development across the lifespan and the role of family in a person\u2019s care. Learners build skills for supporting clients and their families through change, respecting different family structures, cultures, and values.',
  },
  {
    code: 'PSW 009',
    title: 'Assisting the Dying Person',
    content:
      'Students learn how to provide comfort and compassionate support to clients at the end of life and to their families. Topics include palliative care principles, managing common symptoms, respecting wishes and beliefs, and looking after your own emotional wellbeing.',
  },
  {
    code: 'PSW 010',
    title: 'Assisting With Medications',
    content:
      'Learners study how medications work, the PSW\u2019s limits and responsibilities, and how to safely assist clients who take their own medication. The module stresses accurate observation, documentation, and reporting of side effects or concerns.',
  },
  {
    code: 'PSW 011',
    title: 'Cognitive and Mental Health Challenges and Brain Injuries',
    content:
      'This module introduces common mental health conditions, cognitive changes, and acquired brain injuries. Learners practise respectful communication and person-centred strategies that support clients\u2019 safety, independence, and wellbeing.',
  },
  {
    code: 'PSW 012',
    title: 'Health Conditions',
    content:
      'Students review chronic and acute health conditions PSWs commonly encounter, such as diabetes, heart disease, stroke, and arthritis. They learn what to watch for, how to support clients day to day, and when to alert the health care team.',
  },
  {
    code: 'PSW 013',
    title: 'Gentle Persuasive Approaches (GPA\u00AE) in Dementia Care',
    content:
      'Learners are introduced to a respectful, person-centred approach for supporting people living with dementia. They practise calm, gentle techniques for responding to distress and responsive behaviours while protecting the dignity and safety of the client.',
  },
  {
    code: 'PSW 014',
    title: 'Clinical Placement (Community)',
    content:
      'Students apply what they have learned in a real community setting, such as providing care in clients\u2019 homes, under supervision. The placement builds confidence in personal care, communication, time management, and working independently with guidance.',
  },
  {
    code: 'PSW 015',
    title: 'Clinical Placement (Facility)',
    content:
      'In this supervised placement, learners work in a healthcare facility such as a long-term care home. They practise teamwork with nurses and other staff, care for several residents in a busy environment, and prepare for the transition into employment.',
  },
];

const demandPoints = [
  'An aging population means more people need help with daily living, in their own homes and in care facilities.',
  'Home care agencies, long-term care homes, and hospitals regularly hire trained personal support workers.',
  'PSW experience is also a common first step toward further study in nursing and other health careers.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants who do not meet the diploma requirement may apply as mature students and complete an entrance assessment.',
];

const careerRoles = [
  'Personal Support Worker',
  'Home Care Aide',
  'Long-Term Care Worker',
  'Health Care Aide',
  'Palliative Support Worker',
  'Community Support Worker',
];

const careerSettings = [
  'Clients\u2019 Homes',
  'Long-Term Care Homes',
  'Retirement Residences',
  'Hospitals',
  'Hospice and Palliative Care',
  'Home Care Agencies',
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

function NaccAll() {
  const [openModule, setOpenModule] = useState(modules[0].code);
  const d = courseDetails;
  const hasSchedule = d.length || d.schedule || d.time;
  const hasCost = d.tuition || d.registrationFee;

  return (
    <div className="font-sans bg-white text-slate-800">

      {/* 1. Program introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            NACC Personal Support Worker (PSW) DE 2022 Certificate Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This certificate trains you to give safe, respectful, hands-on care to people who need help with everyday living. You will study personal care, safety, nutrition, health conditions, dementia care, and end-of-life support, then put your skills to work in supervised clinical placements.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            With both community and facility placements, you finish the program with real experience and the confidence to begin working as a personal support worker.
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
          <h3 className="text-xl font-bold text-slate-900">Is there demand for personal support workers?</h3>
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
              15 courses, including two clinical placements
            </p>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isOpen = openModule === mod.code;
              return (
                <div key={mod.code} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setOpenModule(isOpen ? null : mod.code)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 text-left font-semibold text-sm sm:text-base flex justify-between items-center gap-4 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-teal-300">
                      {mod.code}: {mod.title}
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
            backgroundImage: "url('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000')",
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
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1000"
              alt="Personal support worker assisting a client"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Personal Support Worker Career Opportunities
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

export default NaccAll;