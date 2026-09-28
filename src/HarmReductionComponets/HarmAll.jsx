import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const trainingInfo = {
  dates: ['Date to be announced'],
  time: '9:00 AM \u2013 5:00 PM',
  delivery: 'In-Person',
  cost: '$000',
  location: '25 Tangiers Road, Unit 1, North York, ON M3J 2B1',
};

const modules = [
  {
    id: 1,
    title: 'Harm Reduction Principles & Philosophy',
    content:
      'Explore the core values of harm reduction, what it is (and is not), and how it fits within health and social services.',
  },
  {
    id: 2,
    title: 'Understanding Substance Use & Stigma',
    content:
      'Look at why people use substances, the range of substance use experiences, and how stigma and judgment create barriers to safety, care, and connection.',
  },
  {
    id: 3,
    title: 'Practical Harm Reduction Strategies',
    content:
      'Learn practical, evidence-informed approaches that help people reduce risks and stay safer, and how to share this information respectfully and without pressure.',
  },
  {
    id: 4,
    title: 'Overdose Awareness & Response',
    content:
      'Recognize the signs of an overdose, understand risk factors, and learn how to respond quickly and calmly, including when to call 911 and how to use naloxone.',
  },
  {
    id: 5,
    title: 'Communication & Relationship-Building',
    content:
      'Practise non-judgmental language, active listening, and trauma-informed communication that builds trust and keeps people engaged with support.',
  },
  {
    id: 6,
    title: 'Systems Navigation & Referrals',
    content:
      'Learn how to connect people with health, housing, treatment, and community services, and how to make warm, supportive referrals.',
  },
  {
    id: 7,
    title: 'Worker Safety & Vicarious Trauma',
    content:
      'Understand how to protect your own safety, recognize the impact of vicarious trauma and burnout, and build self-care and peer support habits.',
  },
];

const whyMatters = [
  'Meeting people where they are, without judgment',
  'Sharing practical ways to reduce risk and stay safer',
  'Responding quickly and calmly to an overdose',
  'Connecting people to health and community supports',
];

const participantRequirements = [
  'Comfort taking part in discussions and role-play activities.',
  'Ability to attend all training sessions.',
  'Willingness to complete both theory and practical components.',
  'No previous harm reduction training is required.',
];

const audience = [
  'PSW, DSW, FSW, ICM and other healthcare or community students',
  'Shelter, housing, and outreach workers',
  'Staff in community agencies, group homes, and long-term care',
  'Mental health, settlement, and community support staff',
  'Volunteers, peer support workers, and anyone in a helping role',
];

const settings = [
  'Shelters, drop-in centres, and outreach programs',
  'Supportive housing and group homes',
  'Community health centres and clinics',
  'Long-term care and retirement homes',
  'Schools, colleges, and campus support services',
  'Social service agencies and non-profits',
];

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function HarmAll() {
  const [openModule, setOpenModule] = useState(1);

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, why it matters & requirements */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Harm Reduction Training
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Substance use and high-risk situations touch people in every community, including those we support in shelters, housing, healthcare, and social services.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This training gives you clear, practical skills to support people with respect and without judgment. You'll learn approaches that help people stay safer, stay connected to care, and feel treated with dignity.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Why this training matters</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Stigma often keeps people away from the very services that could help them. Many helpers want to support someone but are unsure what to say or do. A harm reduction approach gives you a practical, compassionate framework for:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {whyMatters.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            This training supports safer workplaces, homes, and communities.
          </p>
        </div>

        <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-teal-900">Participant requirements</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {participantRequirements.map((req) => (
              <Bullet key={req}>{req}</Bullet>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Training outline accordion */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Training Outline</h2>
            <div className="w-12 h-0.5 bg-teal-500 mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Seven focused parts combining theory, discussion, and hands-on practice
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
                      Part {mod.id}: {mod.title}
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

      {/* 3. Training details */}
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">
                  {trainingInfo.dates.length > 1 ? 'Session Dates' : 'Session Date'}
                </h4>
                <div className="space-y-1 mt-1">
                  {trainingInfo.dates.map((d) => (
                    <p key={d} className="text-base font-bold text-white">{d}</p>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Time</h4>
                <p className="text-sm font-bold text-teal-300">{trainingInfo.time}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Training Delivery</h4>
                <p className="text-base font-bold text-white">{trainingInfo.delivery}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Location</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{trainingInfo.location}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-4">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Cost</h4>
                <p className="text-teal-400 font-bold text-2xl">{trainingInfo.cost}</p>
              </div>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who it is for & where to use it */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-100 h-80">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Participants taking part in harm reduction training"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Who Is This Training For?
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {audience.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">Where you can use these skills</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                {settings.map((place) => (
                  <Bullet key={place}>{place}</Bullet>
                ))}
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These are transferable skills that are valued in many roles and settings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HarmAll;