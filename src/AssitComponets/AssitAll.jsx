import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const trainingInfo = {
  date: 'November 30 \u2013 December 1, 2026',
  time: '9:00 AM \u2013 5:00 PM',
  delivery: 'In-Person',
  cost: '$282.50',
  location: '1526 Dusty Drive, Pickering, Ontario, L1X 0C9',
};

const modules = [
  {
    id: 1,
    title: 'Understanding Suicide & Stigma',
    content:
      'Look at common myths and facts about suicide, and how stigma affects people who are having thoughts of suicide and their willingness to reach out.',
  },
  {
    id: 2,
    title: 'Recognizing Invitations for Help',
    content:
      'Learn to notice the verbal, behavioural, and emotional signs that someone may be asking for help, even when they do not say so directly.',
  },
  {
    id: 3,
    title: 'Asking About Suicide',
    content:
      'Practise asking directly and calmly about thoughts of suicide, and responding in a way that keeps the person feeling heard and respected.',
  },
  {
    id: 4,
    title: 'Building Safety Together',
    content:
      'Work step by step with the person to understand their situation and develop a safety plan that reduces immediate risk.',
  },
  {
    id: 5,
    title: 'Connecting to Supports & Self-Care',
    content:
      'Learn how to link people with ongoing help in the community, and how to look after your own well-being as a helper.',
  },
];

const whyMatters = [
  'Noticing invitations for help',
  'Asking directly about thoughts of suicide',
  'Working together to build a safety plan',
  'Connecting people with ongoing support',
];

const participantRequirements = [
  'Comfort taking part in discussions and role-play activities.',
  'Ability to attend all training sessions.',
  'Recommended for participants aged 18 and over.',
  'No previous mental health training is required.',
];

const audience = [
  'PSW, DSW, FSW, ICM and other healthcare or community service students',
  'Shelter, housing, and outreach workers',
  'Mental health, settlement, and community support staff',
  'Volunteers and peer support workers',
  'Anyone in a helping role who may meet people at risk of suicide',
];

const settings = [
  'Emergency and transitional shelters',
  'Supportive housing and group homes',
  'Community health centres and outreach programs',
  'Schools, colleges, and campus support services',
  'Social service agencies and non-profits',
  'Faith communities and peer support spaces',
];

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function AssitAll() {
  const [openModule, setOpenModule] = useState(1);

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, why it matters & requirements */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            A.S.I.S.T. (Applied Suicide Intervention Skills Training)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Thoughts of suicide can affect anyone, including youth, adults, newcomers, people living with mental health or substance use challenges, and those under housing, financial, or relationship stress.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A.S.I.S.T. prepares you to recognize when someone may be having thoughts of suicide and to respond safely, respectfully, and with compassion. The training is interactive and skills-based, with real-life scenarios, small-group discussion, and practical tools you can use right away in your work and community.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Why this training matters</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            People often show signs of distress well before a crisis, through changes in mood, behaviour, or language that are easy to miss or dismiss. Many helpers want to step in but worry about saying the wrong thing. A.S.I.S.T. gives you a clear framework for:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {whyMatters.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            The approach is trauma-informed and person-centred, helping to reduce stigma and keep people connected to care.
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
              Five focused sessions built around practice and real scenarios
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
              "url('https://i.pinimg.com/236x/7c/6f/bf/7c6fbf87a16b64df85733c97d489a558.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Session Date</h4>
                <p className="text-base font-bold text-white">{trainingInfo.date}</p>
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
              src="https://i.pinimg.com/1200x/cd/22/45/cd2245cd36817607ce0ef18707b34549.jpg"
              alt="Participants taking part in A.S.I.S.T. training"
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
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you are new to a helping role or experienced in the field, A.S.I.S.T. strengthens your confidence in supporting someone at risk.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">Where you can use these skills</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                {settings.map((place) => (
                  <Bullet key={place}>{place}</Bullet>
                ))}
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These skills are valuable in any setting where people may be facing mental health struggles or a life crisis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssitAll;