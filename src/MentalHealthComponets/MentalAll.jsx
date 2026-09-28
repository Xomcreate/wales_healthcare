import React, { useState } from 'react';

// Fill these in with your real program info. Empty/placeholder values are easy to spot.
const courseInfo = {
  startDate: 'Add start date',
  length: 'Add program length',
  schedule: 'Add days and times',
  delivery: 'Add delivery format',
  tuition: 'Add tuition',
  registrationFee: 'Add registration fee',
};

const modules = [
  {
    code: 'MHA 101',
    title: 'Understanding Substance Abuse',
    content:
      'An introduction to substance use and addiction: how substances affect the body and mind, why dependence develops, and how it shows up in individuals, families, and communities.',
  },
  {
    code: 'MHA 102',
    title: 'Abnormal Psychology',
    content:
      'A look at the major mental health conditions, their signs and symptoms, common causes, and how they are recognized and understood in professional practice.',
  },
  {
    code: 'MHA 103',
    title: 'Understanding Concurrent Disorders',
    content:
      'Explores the overlap between mental health and substance use challenges, and why people living with both need coordinated, integrated support.',
  },
  {
    code: 'MHA 104',
    title: 'Sociology of Healthcare',
    content:
      'Examines how social factors such as income, culture, housing, and access to services shape health outcomes and the way care systems work.',
  },
  {
    code: 'MHA 105',
    title: 'Cognitive Development and Mental Health Across the Lifespan',
    content:
      'Follows how thinking, emotions, and behaviour develop from childhood to older age, and how mental health needs change at each stage of life.',
  },
  {
    code: 'MHA 106',
    title: 'Technology for Success: Microsoft Office and 365',
    content:
      'Builds the digital skills used every day in the workplace, including documents, spreadsheets, email, and collaboration tools for record keeping and teamwork.',
  },
  {
    code: 'MHA 108',
    title: 'Crisis Intervention',
    content:
      'Teaches how to recognize a crisis, stay calm, de-escalate, and respond safely and supportively to people in acute distress.',
  },
  {
    code: 'MHA 109',
    title: 'Client Referral, Screening, Assessment, Treatment Planning',
    content:
      'Covers the steps from first contact to a care plan: screening, assessing needs, making appropriate referrals, and planning treatment with the client.',
  },
  {
    code: 'MHA 111',
    title: 'Case Management',
    content:
      'Introduces the case management process, including coordinating services, advocating for clients, monitoring progress, and keeping clear records.',
  },
  {
    code: 'MHA 112',
    title: 'Counselling Principles',
    content:
      'Develops core helping skills such as active listening, empathy, and questioning, along with foundational counselling approaches used in the field.',
  },
  {
    code: 'MHA 113',
    title: 'Group Facilitation',
    content:
      'Prepares learners to plan and lead supportive groups, manage group dynamics, and create a safe space where participants can share and learn.',
  },
  {
    code: 'MHA 114',
    title: 'Medications (Pharmacology)',
    content:
      'A practical overview of medications used in mental health and addictions care, including their purposes, common effects, and what support workers should watch for.',
  },
  {
    code: 'MHA 115',
    title: 'Prevention and Health Promotion',
    content:
      'Focuses on strategies that reduce risk and promote wellness, from education and early intervention to community-wide health initiatives.',
  },
  {
    code: 'MHA 116',
    title: 'Family and Social Support',
    content:
      'Looks at the role families and social networks play in recovery, and how to involve and support them in a client\u2019s care.',
  },
  {
    code: 'MHA 117',
    title: 'Trauma-Specific Care',
    content:
      'Builds understanding of how trauma affects people and teaches trauma-informed approaches that promote safety, trust, and choice.',
  },
  {
    code: 'MHA 118',
    title: 'Issues and Ethics in Healthcare and Self Care Practices',
    content:
      'Addresses confidentiality, professional boundaries, and ethical decision making, along with self-care habits that help prevent burnout.',
  },
  {
    code: 'MHA 119',
    title: 'MHA Community Development and Outreach',
    content:
      'Shows how to connect with people where they are, build community partnerships, and develop outreach efforts that improve access to services.',
  },
  {
    code: 'MHA 120',
    title: 'MHA Mental Health and Addictions Virtual Project',
    content:
      'A capstone project where learners bring together what they have studied by working through a realistic mental health and addictions scenario in a virtual setting.',
  },
];

const demandPoints = [
  'Hospitals, community clinics, treatment centres, and social service agencies need trained support workers to meet growing mental health and addictions needs.',
  'The program combines theory with practical skills in assessment, crisis response, counselling, and case coordination, so you are ready to work with real clients.',
  'Starting as a support worker can open the door to further study and to senior roles in program coordination and community health.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants without a diploma may apply as mature students and complete an entrance assessment.',
];

const careerRoles = [
  'Mental Health Support Worker',
  'Addictions Support Worker',
  'Crisis Intervention Worker',
  'Case Manager',
  'Community Outreach Worker',
  'Harm Reduction Worker',
  'Peer and Family Support Worker',
  'Community Service Worker',
];

const careerSettings = [
  'Hospitals and Community Health Centres',
  'Addictions Treatment Centres',
  'Mental Health Clinics',
  'Supportive Housing and Shelters',
  'Non-Profit Agencies',
  'Government and Municipal Programs',
];

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function MentalAll() {
  const [openModule, setOpenModule] = useState('MHA 101');

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Mental Health and Addictions Certificate Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This certificate prepares you to support people living with mental health challenges and substance use concerns. You will build a strong understanding of addiction, mental illness, and concurrent disorders, then learn the practical skills to screen, assess, counsel, and coordinate care.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Along the way you will study crisis response, trauma-specific care, ethics, and community outreach, and finish with a virtual project that puts your learning into practice. Graduates leave ready to step into support roles across the mental health and addictions sector.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for this training?</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {demandPoints.map((point) => (
              <Bullet key={point}>{point}</Bullet>
            ))}
          </ul>
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

      {/* 2. Program outline accordion */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Program Outline</h2>
            <div className="w-12 h-0.5 bg-teal-500 mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              {modules.length} courses covering theory, practice, and real-world application
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
                      {mod.code} - {mod.title}
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

      {/* 3. Course details */}
      <section className="relative py-16 bg-slate-950 text-white border-y border-slate-800">
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg">
              <h4 className="text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2">Course Details</h4>
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mx-auto">
                📅
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Start Date</h4>
                <p className="text-base font-bold text-white">{courseInfo.startDate}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Length</h4>
                <p className="text-base font-bold text-white">{courseInfo.length}</p>
                <p className="text-xs text-teal-300 font-semibold">{courseInfo.schedule}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Delivery</h4>
                <p className="text-sm font-bold text-white">{courseInfo.delivery}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Tuition</h4>
                <p className="text-teal-400 font-bold text-base">{courseInfo.tuition}</p>
                <p className="text-[11px] text-slate-400 mt-1">Registration fee: {courseInfo.registrationFee}</p>
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
              src="https://i.pinimg.com/736x/1a/75/99/1a7599a6a6fca58b437b73d415f62fa0.jpg"
              alt="Graduates ready to start careers in mental health and addictions"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Career Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Graduates can pursue roles such as:</p>
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

export default MentalAll;