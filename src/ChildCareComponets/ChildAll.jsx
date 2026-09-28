import React, { useState } from 'react';

// Fill these in with your real program info.
const courseInfo = {
  startDate: 'Add start date',
  length: '46 Weeks',
  schedule: 'Add days and times',
  delivery: 'Add delivery format',
  tuition: 'Add tuition',
  registrationFee: 'Add registration fee',
};

const modules = [
  {
    code: 'CYW 001',
    title: 'Introduction to Child and Youth Care',
    content:
      'Introduces the child and youth care profession, its values and history, and the many settings where workers support young people and their families.',
  },
  {
    code: 'CYW 002',
    title: 'Child and Adolescent Development',
    content:
      'Follows physical, emotional, social, and cognitive growth from early childhood through the teen years, and how development shapes behaviour and needs.',
  },
  {
    code: 'CYW 003',
    title: 'Introduction to Mental Health for Child and Youth Care',
    content:
      'Provides a foundation in mental health concepts and common challenges affecting children and youth, and how they appear in everyday care.',
  },
  {
    code: 'CYW 004',
    title: 'Mental Health Literacy for Child and Youth Care',
    content:
      'Builds the knowledge to recognize warning signs, reduce stigma, and talk about mental health in clear, supportive ways with young people and caregivers.',
  },
  {
    code: 'CYW 005',
    title: 'Fundamentals of Case Management',
    content:
      'Covers the basics of coordinating services, planning with clients, and following a young person\u2019s progress across programs and providers.',
  },
  {
    code: 'CYW 006',
    title: 'Issues, Ethics & Inclusivity in Child and Youth Care',
    content:
      'Explores ethical decision making, professional boundaries, and respectful, inclusive practice with youth from diverse cultures, identities, and backgrounds.',
  },
  {
    code: 'CYW 007',
    title: 'Record Keeping and Documentation',
    content:
      'Teaches how to write clear, accurate, and confidential records, including notes, incident reports, and progress documentation.',
  },
  {
    code: 'CYW 008',
    title: 'Crisis Intervention Strategies',
    content:
      'Prepares learners to recognize escalating situations, de-escalate safely, and support young people through moments of acute distress.',
  },
  {
    code: 'CYW 009',
    title: 'At-Risk Youth and Youth Justice',
    content:
      'Looks at the factors that put young people at risk, how the youth justice system works, and ways to support youth toward positive outcomes.',
  },
  {
    code: 'CYW 010',
    title: 'Trauma-Informed Practices with Children and Adolescents',
    content:
      'Explains how trauma affects development and behaviour, and how to create environments that promote safety, trust, and healing.',
  },
  {
    code: 'CYW 011',
    title: 'Interviewing Skills',
    content:
      'Develops the skills to gather information respectfully, ask open and age-appropriate questions, and listen well in conversations with young people.',
  },
  {
    code: 'CYW 012',
    title: 'Counselling Children and Adolescents',
    content:
      'Introduces counselling approaches and helping skills adapted for children and teens, focused on building rapport and supporting emotional growth.',
  },
  {
    code: 'CYW 013',
    title: 'Child and Youth Care Practice with Families',
    content:
      'Shows how to work alongside parents and caregivers, strengthen family relationships, and involve families in a young person\u2019s care.',
  },
  {
    code: 'CYW 014',
    title: 'Interventions with Children and Youth',
    content:
      'Covers practical strategies and program approaches for supporting positive behaviour, skill building, and recovery in individuals and groups.',
  },
  {
    code: 'CYW 015',
    title: 'Advocacy and Welfare of Children and Adolescents',
    content:
      'Focuses on children\u2019s rights, child welfare systems, and how to speak up for young people and connect them with the resources they need.',
  },
  {
    code: 'CYW 016',
    title: 'CYC Practitioner Health Promotion Strategies',
    content:
      'Looks at wellness for both young people and practitioners, including self-care habits that help workers stay healthy and avoid burnout.',
  },
  {
    code: 'CYW 017',
    title: 'Child and Youth Care Virtual Project',
    content:
      'A capstone project where learners apply what they have studied to a realistic child and youth care scenario in a virtual setting.',
  },
];

const demandPoints = [
  'Group homes, schools, community agencies, and youth programs need trained child and youth care workers to support young people facing complex challenges.',
  'The diploma combines child development, mental health, and hands-on practice skills, so you are prepared to work directly with youth and families.',
  'Experience in the field can lead to senior front-line roles, program coordination, and further study in social services.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants without a diploma may apply as mature students and complete an entrance assessment.',
];

const careerRoles = [
  'Child and Youth Care Worker',
  'Youth Outreach Worker',
  'Residential Support Worker',
  'Group Home Worker',
  'School Support Worker',
  'Youth Justice Worker',
  'Family Support Worker',
  'Community Service Worker',
];

const careerSettings = [
  'Group Homes and Residential Programs',
  'Schools and Education Programs',
  'Youth Shelters and Drop-in Centres',
  'Child Welfare and Family Service Agencies',
  'Community Health and Mental Health Centres',
  'Non-Profit and Government Programs',
];

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function ChildAll() {
  const [openModule, setOpenModule] = useState('CYW 001');

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Child and Youth Care Worker Diploma Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This diploma prepares you to support children and teens as they grow, heal, and build a stable future. You will study child and adolescent development, mental health, and trauma-informed care, then learn the practical skills to interview, counsel, and advocate for young people and their families.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The program also covers ethics, inclusive practice, documentation, crisis response, and working with at-risk youth, and finishes with a virtual project that puts your learning into action. Graduates are ready to begin a career in youth care.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for youth care workers?</h3>
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
              src="https://i.pinimg.com/736x/4e/a9/84/4ea984541d2b80715a15f2ba21c24e93.jpg"
              alt="Graduates ready to start careers in child and youth care"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Child and Youth Care Career Opportunities
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

export default ChildAll;