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
    code: 'DSW 101',
    title: 'Introduction to the Field of Developmental Services',
    content:
      'Presents the core competencies of developmental services workers, the history and values of the field, and the settings where support is provided.',
  },
  {
    code: 'DSW 102',
    title: 'The Nature of Developmental Disabilities',
    content:
      'Explains the different types of developmental disabilities, their causes and characteristics, and how they affect learning, health, and daily life.',
  },
  {
    code: 'DSW 103',
    title: 'Autism Spectrum Disorders',
    content:
      'Builds understanding of autism, including how it presents across ages and abilities, and practical ways to support communication, sensory needs, and participation.',
  },
  {
    code: 'DSW 104',
    title: 'Documentation for Health Professionals',
    content:
      'Teaches how to write clear, accurate, and confidential notes, reports, and records that meet professional standards.',
  },
  {
    code: 'DSW 105',
    title: 'Introduction to Communication Disorders',
    content:
      'Looks at speech, language, and communication difficulties, how they are identified, and how they affect learning and relationships.',
  },
  {
    code: 'DSW 106',
    title: 'Communication Strategies for Inclusive Education',
    content:
      'Covers practical communication approaches that help every learner take part, with a focus on inclusive classrooms and support settings.',
  },
  {
    code: 'DSW 107',
    title: 'Developmental Psychology Across the Lifespan',
    content:
      'Follows physical, emotional, social, and cognitive development from birth through older adulthood and what it means for support.',
  },
  {
    code: 'DSW 108',
    title: 'Working with Families and Persons with Developmental Disabilities',
    content:
      'Shows how to build respectful partnerships with families and caregivers while keeping the person at the centre of every decision.',
  },
  {
    code: 'DSW 109',
    title: 'Person Directed Supports and Services for Persons with Developmental Disabilities',
    content:
      'Focuses on planning with people rather than for them, honouring their choices, goals, and strengths in the supports they receive.',
  },
  {
    code: 'DSW 110',
    title: 'Behavioural Support Techniques',
    content:
      'Introduces positive, respectful strategies for understanding behaviour, preventing challenges, and teaching new skills.',
  },
  {
    code: 'DSW 111',
    title: 'Health and Wellness Principles',
    content:
      'Covers nutrition, physical activity, rest, and preventive care, and how to support healthy routines in daily living.',
  },
  {
    code: 'DSW 112',
    title: 'Dual Diagnosis: Mental Health and Persons with Developmental Disabilities',
    content:
      'Examines how mental health challenges can occur alongside developmental disabilities, and how to recognize and respond to them.',
  },
  {
    code: 'DSW 113',
    title: 'Building Community',
    content:
      'Explores ways to help people build relationships, join local activities, and take part fully in their communities.',
  },
  {
    code: 'DSW 114',
    title: 'Adult Development and Aging',
    content:
      'Looks at the changes that come with adulthood and aging, and how to support health, independence, and quality of life over time.',
  },
  {
    code: 'DSW 115',
    title: 'Essentials of Pharmacology',
    content:
      'Provides a practical overview of common medications, their purposes and effects, and safe practices for supporting medication use.',
  },
  {
    code: 'DSW 116',
    title: 'Augmentative and Alternative Communication Systems (AAC)',
    content:
      'Introduces tools and systems, from picture boards to speech-generating devices, that help people express themselves and be understood.',
  },
  {
    code: 'DSW 117',
    title: 'Introduction to Educational Psychology in Canada',
    content:
      'Covers how people learn, factors that shape learning, and how Canadian education systems support diverse learners.',
  },
  {
    code: 'DSW 118',
    title: 'Individual Education Plan (IEP)',
    content:
      'Explains how Individual Education Plans are developed, carried out, and reviewed, and the support worker\u2019s role in the process.',
  },
  {
    code: 'DSW 119',
    title: 'Professional Development: Competencies and Standards of Practice',
    content:
      'Outlines the competencies, ethics, and standards expected of developmental services workers and how to keep growing in the profession.',
  },
  {
    code: 'DSW 120',
    title: 'Self-Care Strategies for the Developmental Services Worker',
    content:
      'Focuses on stress management, healthy boundaries, and habits that help workers stay well and avoid burnout.',
  },
  {
    code: 'DSW 121',
    title: 'Technology for Success',
    content:
      'Builds the digital skills used in today\u2019s workplaces, including documents, email, and online collaboration tools.',
  },
  {
    code: 'DSW 122',
    title: 'Virtual Project (Community and Education Support Focus)',
    content:
      'A capstone project where learners apply what they have studied to a realistic community and education support scenario in a virtual setting.',
  },
];

const demandPoints = [
  'Community agencies, supportive living programs, schools, and health organizations need trained developmental services workers to support people with developmental disabilities.',
  'The diploma combines knowledge of disability, communication, behaviour support, and health with practical skills you can use from your first day on the job.',
  'Experience in the field can lead to senior support roles, team leadership, and program coordination.',
];

const admissionRequirements = [
  'An Ontario Secondary School Diploma (OSSD) or an equivalent qualification.',
  'Credentials earned outside Canada must be translated into English and assessed as equivalent to Grade 12.',
  'Applicants without a diploma may apply as mature students and complete an entrance assessment.',
];

const careerRoles = [
  'Developmental Services Worker',
  'Community Support Worker',
  'Residential Support Worker',
  'Educational Assistant',
  'Behavioural Support Assistant',
  'Autism Support Worker',
  'Day Program Worker',
  'Family Support Worker',
];

const careerSettings = [
  'Supportive Living and Group Homes',
  'Schools and Education Programs',
  'Community Living Agencies',
  'Day Programs and Employment Services',
  'Health and Rehabilitation Centres',
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

function DevelopmentalAll() {
  const [openModule, setOpenModule] = useState('DSW 101');

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, demand & admission */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Developmental Services Worker Diploma Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This diploma prepares you to support children, youth, and adults with developmental disabilities in living independent, connected lives. You will study developmental disabilities, autism, communication, and health, then learn practical skills in person-directed support, behaviour support, and working with families.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The program also covers documentation, education planning, professional standards, and self-care, and finishes with a virtual project that puts your learning into action. Graduates are ready to begin a career in developmental services.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Is there demand for developmental services workers?</h3>
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
              src="https://i.pinimg.com/736x/2c/9c/6b/2c9c6ba78b415d4d15afbc714e3a389b.jpg"
              alt="Graduates ready to start careers in developmental services"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Developmental Services Career Opportunities
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

export default DevelopmentalAll;